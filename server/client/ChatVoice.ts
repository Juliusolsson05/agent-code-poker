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
/** What send() resolves with: only whether the HOST took the line. It resolves
 * as soon as the chat receipt arrives, so the chat box is free again while
 * ElevenLabs is still working (review of #23: the box used to stay disabled
 * for the whole synthesis). The voice result arrives later via onVoice. */
export type SendOutcome = { sent: false; error: string } | { sent: true; seq: number }
export type VoiceOutcome = { seq: number; voice: 'off' | 'spoken' | 'local-only'; issue?: VoiceFailure | 'relay-refused' | 'too-long' }

/** A clip older than this when its audio finally becomes available is not
 * spoken: hearing a line 40 s after its bubble faded is confusing, not helpful. */
export const VOICE_FRESH_MS = 30_000

export class ChatVoice {
  // False until the first projection: everything present then is history.
  #primed = false
  // Seqs this tab has decided about (played, skipped or its own). Pruned to
  // the live projection window, so it stays bounded for a long session.
  #consumed = new Set<number>()
  #voicesWereOn = false

  constructor(private readonly deps: {
    hostApi: HostApi
    provider: () => VoiceProvider | null
    /** Plays decoded audio at a display seat (0 = this player). */
    play: (bytes: Uint8Array, displaySeat: number) => void
    /** Silences every voice already playing (host turned voices off). */
    stopAll: () => void
  }) {}

  /** Send one line. Text first, always: a voice failure never costs the
   * message. Then, detached, only if the host has voices on and this player
   * configured a provider: synthesise locally, play it for ourselves, relay it. */
  async send(text: string, voicesOn: boolean, onVoice: (outcome: VoiceOutcome) => void = () => {}): Promise<SendOutcome> {
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
    this.#consumed.add(seq)
    void this.#voice(seq, text, voicesOn).then(onVoice, () => onVoice({ seq, voice: 'off', issue: 'failed' }))
    return { sent: true, seq }
  }

  async #voice(seq: number, text: string, voicesOn: boolean): Promise<VoiceOutcome> {
    const provider = this.deps.provider()
    if (!voicesOn || !provider) return { seq, voice: 'off' }
    const result = await provider.synthesize(text)
    if (!result.ok) return { seq, voice: 'off', issue: result.reason }
    this.deps.play(result.audio, 0)
    if (result.audio.length > MAX_VOICE_BYTES) return { seq, voice: 'local-only', issue: 'too-long' }
    try {
      await this.deps.hostApi('/api/voice', { seq, mime: VOICE_MIME, data: bytesToBase64(result.audio) })
      return { seq, voice: 'spoken' }
    } catch {
      // Voices switched off between our send and our upload, the window
      // closed, or the transport failed. The others simply get text.
      return { seq, voice: 'local-only', issue: 'relay-refused' }
    }
  }

  /** Feed every poll's chat projection. Playback is the side effect; each seq
   * is decided at most once per tab. */
  observe(lines: readonly ChatLine[], voicesOn: boolean, audible: boolean): void {
    // Host switched voices off: stop what is already playing, not only what
    // would start next (review of #23).
    if (this.#voicesWereOn && !voicesOn) this.deps.stopAll()
    this.#voicesWereOn = voicesOn
    if (!this.#primed) {
      // First sight of this table: everything already here is history.
      this.#primed = true
      for (const line of lines) this.#consumed.add(line.seq)
      return
    }
    for (const line of lines) {
      if (this.#consumed.has(line.seq)) continue
      // Inaudible (muted, hidden, voices off): a line arriving now is consumed
      // WITHOUT playing. Leaving it pending made every line said while muted
      // burst out at once on unmute (review of #23).
      if (!voicesOn || !audible) { this.#consumed.add(line.seq); continue }
      // Audible but the sender's clip is not uploaded yet: decide on a later poll.
      if (!line.voice) continue
      this.#consumed.add(line.seq)
      // displaySeat 0 is this viewer: its own audio was played at send time.
      if (line.displaySeat === 0 || line.ageMs > VOICE_FRESH_MS) continue
      void this.#fetchAndPlay(line.seq, line.displaySeat)
    }
    // Bound memory: the projection is the last few lines, so anything that has
    // left it can never be observed again.
    if (this.#consumed.size > 64) {
      const live = new Set(lines.map(line => line.seq))
      for (const seq of this.#consumed) if (!live.has(seq)) this.#consumed.delete(seq)
    }
  }

  /** A new table generation (host restart, a different table) starts a new
   * history; the next observe() treats its lines as already said. */
  reset(): void { this.#primed = false; this.#consumed.clear(); this.#voicesWereOn = false; this.deps.stopAll() }

  /** Test/diagnostic view of the bounded state. */
  get trackedCount(): number { return this.#consumed.size }

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
