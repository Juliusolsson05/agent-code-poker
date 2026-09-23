import { MAX_VOICE_BYTES, VOICE_MIME, base64ToBytes, bytesToBase64, looksLikeMpegAudio } from '../../src/voice/audioClip'
import type { VoiceFailure, VoiceProvider } from '../../src/voice/ElevenLabs'
import type { ChatLine } from '../../src/session/HostTable'

/** The chat + voice orchestration of one LAN tab, kept out of client.js so the
 * contracts that matter are testable without a DOM or a 3D room:
 *
 * 1. THE KEY NEVER GOES TO THE HOST. This class talks to two things: the
 *    LAN host (`hostApi`: chat text, then finished audio) and a VoiceProvider
 *    (the only holder of the ElevenLabs key). Nothing flows from the provider
 *    to the host except the audio bytes it returned.
 * 2. SENDER-ONLY SYNTHESIS. A tab synthesises only lines it sent; everyone
 *    else's audio arrives through the host relay. No tab ever spends a key on
 *    somebody else's words.
 * 3. NO REPLAY. Lines already present when this tab first sees the table
 *    (reload, late join, reconnect) are history: shown, never spoken. Only a
 *    line this tab watched arrive may play, once, while it is still fresh.
 *
 * The host's `features.voices` switch gates BOTH synthesis and playback: when
 * it is off nothing calls ElevenLabs, even if this player saved a key. */
export type HostApi = (path: string, body?: unknown) => Promise<unknown>
export type SendOutcome =
  | { sent: false; error: string }
  | { sent: true; seq: number; voice: 'off' | 'spoken' | 'local-only'; issue?: VoiceFailure | 'relay-refused' | 'too-long' }

/** A clip older than this when its audio finally becomes available is not
 * spoken: hearing a line 40 s after its bubble faded is confusing, not helpful. */
export const VOICE_FRESH_MS = 30_000

export class ChatVoice {
  #known: Set<number> | null = null
  #requested = new Set<number>()

  constructor(private readonly deps: {
    hostApi: HostApi
    provider: () => VoiceProvider | null
    /** Plays decoded audio at a display seat (0 = this player). */
    play: (bytes: Uint8Array, displaySeat: number) => void
  }) {}

  /** Send one line. Text first, always: a voice failure never costs the
   * message. Then, only if the host has voices on and this player configured
   * a provider, synthesise locally, play it for ourselves, and relay it. */
  async send(text: string, voicesOn: boolean): Promise<SendOutcome> {
    let seq: number
    try {
      const reply = await this.deps.hostApi('/api/chat', { text }) as { receipt?: { seq?: unknown } }
      if (!Number.isSafeInteger(reply?.receipt?.seq)) return { sent: false, error: 'The host did not accept the message.' }
      seq = Number(reply.receipt!.seq)
    } catch (error) {
      return { sent: false, error: error instanceof Error ? error.message : 'Message not sent.' }
    }
    // Our own line is ours to voice; mark it so the relay poll never fetches
    // back the clip we are about to upload.
    this.#requested.add(seq)
    const provider = this.deps.provider()
    if (!voicesOn || !provider) return { sent: true, seq, voice: 'off' }
    const result = await provider.synthesize(text)
    if (!result.ok) return { sent: true, seq, voice: 'off', issue: result.reason }
    this.deps.play(result.audio, 0)
    if (result.audio.length > MAX_VOICE_BYTES) return { sent: true, seq, voice: 'local-only', issue: 'too-long' }
    try {
      await this.deps.hostApi('/api/voice', { seq, mime: VOICE_MIME, data: bytesToBase64(result.audio) })
      return { sent: true, seq, voice: 'spoken' }
    } catch {
      // Voices switched off between our send and our upload, the window
      // closed, or the transport failed. The others simply get text.
      return { sent: true, seq, voice: 'local-only', issue: 'relay-refused' }
    }
  }

  /** Feed every poll's chat projection. Returns nothing: playback is the
   * side effect, and each seq is requested at most once per tab. */
  observe(lines: readonly ChatLine[], voicesOn: boolean, audible: boolean): void {
    if (this.#known === null) {
      // First sight of this table: everything already here is history.
      this.#known = new Set(lines.map(line => line.seq))
      for (const line of lines) this.#requested.add(line.seq)
      return
    }
    for (const line of lines) {
      if (!this.#known.has(line.seq)) this.#known.add(line.seq)
      // displaySeat 0 is this viewer: its own audio was played at send time.
      if (!voicesOn || !audible || !line.voice || line.displaySeat === 0 || this.#requested.has(line.seq)) continue
      this.#requested.add(line.seq)
      if (line.ageMs > VOICE_FRESH_MS) continue
      void this.#fetchAndPlay(line.seq, line.displaySeat)
    }
    // Bound memory: forget seqs that have left the projection window.
    if (this.#requested.size > 256) {
      const live = new Set(lines.map(line => line.seq))
      for (const seq of this.#requested) if (!live.has(seq)) this.#requested.delete(seq)
    }
  }

  /** A new table generation (host restart, a different table) starts a new
   * history; the next observe() treats its lines as already said. */
  reset(): void { this.#known = null; this.#requested.clear() }

  async #fetchAndPlay(seq: number, displaySeat: number): Promise<void> {
    try {
      const clip = await this.deps.hostApi(`/api/voice/${seq}`) as { mime?: unknown; data?: unknown }
      if (clip?.mime !== VOICE_MIME || typeof clip.data !== 'string') return
      const bytes = base64ToBytes(clip.data)
      // Re-check what the host already checked: a tab decodes only audio.
      if (!bytes || bytes.length > MAX_VOICE_BYTES || !looksLikeMpegAudio(bytes)) return
      this.deps.play(bytes, displaySeat)
    } catch { /* Expired, voices turned off, or offline: the bubble is enough. */ }
  }
}
