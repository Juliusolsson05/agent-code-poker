import { MAX_VOICE_BYTES, looksLikeMpegAudio } from '../src/voice/audioClip'

/** In-memory relay for chat voice clips, keyed by chat seq.
 *
 * WHY A RELAY AT ALL (user decision, option 1): each player synthesises their
 * own line with their own ElevenLabs key. The other players still need to hear
 * it, and the only channel every client already has is the LAN host. So the
 * sender uploads the finished audio for its own line and the others fetch it.
 * The host never sees a key, never calls ElevenLabs and never makes audio.
 *
 * WHY MEMORY ONLY: a clip is a few seconds of someone's voice-alike speaking
 * table talk. It has no value after the bubble fades, and the host checkpoint
 * directory is a private poker ledger, not a media store. Nothing here is
 * reachable from checkpoint(); a restart forgets every clip.
 *
 * Bounds: TTL (a late poll after 90 s is not "live" any more), a count cap
 * with oldest-first eviction, and the per-clip byte cap from audioClip.ts, so
 * total memory is at most MAX_CLIPS × MAX_VOICE_BYTES (~1.5 MiB). */
export const VOICE_RELAY_LIMITS = { ttlMs: 90_000, maxClips: 16, uploadWindowMs: 60_000 } as const

export type VoicePutCode = 'stored' | 'not-sender' | 'unknown-line' | 'expired' | 'duplicate' | 'too-large' | 'not-audio'

export class VoiceRelay {
  #clips = new Map<number, { bytes: Uint8Array; at: number }>()
  constructor(private readonly now: () => number) {}

  /** `sender` is HostTable.chatSender(seq); `uploader` is the authenticated
   * member. Only a line's own sender may attach audio to it: otherwise any
   * player could put words in another player's mouth. One clip per line, so a
   * retry cannot swap the audio after others already heard it. */
  put(seq: number, uploader: string, sender: { memberId: string; at: number } | null, bytes: Uint8Array): VoicePutCode {
    this.#sweep()
    if (!sender) return 'unknown-line'
    if (sender.memberId !== uploader) return 'not-sender'
    if (this.now() - sender.at > VOICE_RELAY_LIMITS.uploadWindowMs) return 'expired'
    if (this.#clips.has(seq)) return 'duplicate'
    if (bytes.length > MAX_VOICE_BYTES) return 'too-large'
    if (!looksLikeMpegAudio(bytes)) return 'not-audio'
    this.#clips.set(seq, { bytes, at: this.now() })
    // Map iteration is insertion order: the first key is the oldest clip.
    while (this.#clips.size > VOICE_RELAY_LIMITS.maxClips) this.#clips.delete(this.#clips.keys().next().value!)
    return 'stored'
  }

  get(seq: number): Uint8Array | null {
    this.#sweep()
    return this.#clips.get(seq)?.bytes ?? null
  }

  has(seq: number): boolean { return this.get(seq) !== null }

  /** Voices switched off: drop everything now, not at TTL. A host who turns
   * voices off mid-session means "stop", including clips already uploaded. */
  clear(): void { this.#clips.clear() }

  get size(): number { this.#sweep(); return this.#clips.size }

  #sweep(): void {
    const at = this.now()
    for (const [seq, clip] of this.#clips) if (at - clip.at > VOICE_RELAY_LIMITS.ttlMs) this.#clips.delete(seq)
  }
}
