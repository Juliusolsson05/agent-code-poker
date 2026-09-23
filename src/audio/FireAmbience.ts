/** One locally bundled recording, not a timer spawning crackle oscillators.
 * Intentionally independent of poker state/graphics so lifecycle races can be
 * tested without pretending a fake audio device verifies listening quality.
 *
 * WHY WEB AUDIO BUFFERS AND NOT AN <audio> ELEMENT (issue #12)
 * This used to be `new Audio(dataUrl)` routed through
 * `createMediaElementSource`. That played on the standalone website, whose CSP
 * adds `media-src data:` (server/http.ts), and was silent inside the installed
 * extension. The agent-code host serves every extension frame with exactly
 * this policy (agent-code `src/main/extensions/frameDocument.ts`,
 * `childFrameCsp`):
 *
 *   default-src 'none'; base-uri 'none'; form-action 'none';
 *   script-src 'nonce-…' agent-code-ext://<id>;
 *   style-src 'unsafe-inline' agent-code-ext://<id>;
 *   img-src agent-code-ext://<id> data: blob:;
 *   font-src agent-code-ext://<id> data:;
 *   connect-src agent-code-ext://<id>
 *
 * There is no `media-src`, so a media element falls back to `default-src 'none'`.
 * Every media URL is refused (data:, blob: and even our own agent-code-ext://
 * bundle), and the play() rejection was deliberately swallowed as an autoplay
 * refusal. `fetch(dataUrl)` is no escape either: that is `connect-src`, which
 * does not list data:. What no directive governs is bytes the page already
 * holds: the MP3 is inlined into the JS bundle at build time, so we base64-decode
 * it in memory and hand the ArrayBuffer to `decodeAudioData`. Chip and tone cues
 * already worked in the extension for the same reason: they are synthesised
 * buffers and oscillators. Changing the host CSP instead would be a release of
 * another repository and would still leave older hosts silent.
 *
 * Cost we accept: the old element decoded incrementally, and a decoded
 * AudioBuffer holds the whole minute as float PCM (~59 s × 2 ch × 4 B × 44.1–48 kHz
 * ≈ 21–23 MB). It is decoded once per room and dropped on dispose. That is
 * bounded, and small next to the WebGL scene. Streaming decode (WebCodecs /
 * AudioWorklet) would be far more machinery for a one-minute loop. */

/** Samples quieter than this on every channel count as codec padding or the
 * file's own lead-in (≈ -60 dBFS). Measured on the bundled MP3 decoded at
 * 48 kHz (Chrome's decodeAudioData and ffmpeg agree to the frame): 8412
 * frames (0.17525 s) of near-silence at the head and 1669 (~35 ms) at the
 * tail. Looping the raw buffer would put a ~210 ms dropout into every minute.
 * The old media element had the same gap.
 *
 * WHY THIS CANNOT EAT REAL CONTENT: not because the bed stays loud. Its median
 * is about -43.6 dBFS, and plenty of individual samples dip below 1e-3 at zero
 * crossings. It is safe because the scan only walks inward from each END and
 * stops at the FIRST loud sample. Quiet samples inside the recording are
 * never looked at, and nothing is cut from the middle. The only risk is a
 * long quiet intro/outro, which SEAM_MAX_TRIM_SECONDS bounds.
 * tests/fire-audio.test.ts pins these frame counts on the real file. */
const SEAM_SILENCE = 1e-3
/** Belt and braces: never trim more than this from either end. A future
 * recording with a genuinely quiet intro still loops in full instead of
 * silently shrinking to a fragment. */
const SEAM_MAX_TRIM_SECONDS = 1
/** Pause/mute/Off fade. A hard stop() cuts the waveform mid-cycle and clicks.
 * This matches the 40 ms time constant setVolume always used, so every level
 * change on this bus has the same feel. */
const FADE_SECONDS = .04

/** Shared onended handler, so a fade-out allocates no per-stop closure. It
 * detaches the finished node from the bus. */
function releaseEnded(this: AudioScheduledSourceNode): void { this.onended = null; this.disconnect() }

/** Loop bounds in seconds, found once at decode time and never per frame. */
export function audibleLoopWindow(buffer: AudioBuffer): { start: number; end: number } {
  const channels: Float32Array[] = []
  for (let c = 0; c < buffer.numberOfChannels; c++) channels.push(buffer.getChannelData(c))
  const loud = (i: number) => { for (const pcm of channels) if (Math.abs(pcm[i]) >= SEAM_SILENCE) return true; return false }
  const cap = Math.min(Math.floor(buffer.sampleRate * SEAM_MAX_TRIM_SECONDS), Math.floor(buffer.length / 4))
  let head = 0; while (head < cap && !loud(head)) head++
  let tail = buffer.length; while (buffer.length - tail < cap && !loud(tail - 1)) tail--
  // The cap is at most a quarter of the buffer per end, so at least half always
  // remains and the loop can never collapse to zero length (stopSource()'s
  // modulo relies on a positive span). Even an all-silent buffer stays a loop.
  return { start: head / buffer.sampleRate, end: tail / buffer.sampleRate }
}

/** Accepts the Vite `?inline` value (`data:audio/mpeg;base64,…`) or bare base64.
 * The data: prefix is only a byte carrier here and is never handed to the
 * browser as a URL. That is the whole point of this class. */
export function inlineAudioBytes(encoded: string): ArrayBuffer {
  let payload = encoded
  if (encoded.startsWith('data:')) {
    const comma = encoded.indexOf(',')
    // Vite inlines binary assets as base64. A percent-encoded data URL here
    // would mean the build changed shape: fail loudly (logged by the caller)
    // rather than decode garbage.
    if (comma < 0 || !encoded.slice(0, comma).endsWith(';base64')) throw new Error('fireplace recording is not base64-inlined')
    payload = encoded.slice(comma + 1)
  }
  const binary = atob(payload), bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

type FireGraph = { context: AudioContext; input: AudioNode; panner: PannerNode | null; gain: GainNode }

export class FireAmbience {
  private active = false
  private unlocked = false
  private disposed = false
  private muted = false
  private level = .045
  private encoded: string | null
  private graph: FireGraph | null = null
  private buffer: AudioBuffer | null = null
  private loopStart = 0
  private loopEnd = 0
  // AudioBufferSourceNodes are one-shot, so every resume needs a fresh node.
  // That is one small allocation per pause/resume, never per frame. The
  // AudioBuffer itself is shared.
  private source: AudioBufferSourceNode | null = null
  // A source still fading out after a pause. It is kept only so that an
  // immediate resume (within FADE_SECONDS) or a dispose can cut it at once.
  // Otherwise its tail would overlap the new source on the shared bus, which is
  // ramping back up, and double the same crackle.
  private fading: AudioBufferSourceNode | null = null
  // The old media element kept its position across pause. We do the same, so
  // pausing for a dialog does not restart the minute at the same crackle every
  // time. `offset` is the buffer position to resume from. `startedAt` is the
  // context time the current source began at `offset`.
  private offset = 0
  private startedAt = 0
  constructor(encoded: string) { this.encoded = encoded }

  unlock(): void { this.unlocked = true; this.sync() }

  /** Builds the fire's own quiet bus on the shared context, plus an HRTF panner
   * when the hearth has a valid room position. Decoding starts here and not in
   * the constructor, because decodeAudioData needs a BaseAudioContext, and
   * creating one before a user gesture only yields a suspended context plus a
   * console autoplay warning. PokerAudio creates the context inside unlock(),
   * so the first gesture pays a one-off decode (tens of ms for this minute of
   * MP3) and the fire fades in slightly after the table sounds. */
  attach(context: AudioContext, position?: readonly number[]): void {
    if (this.disposed || this.graph) return
    // Starts at zero: the first start() fades in over FADE_SECONDS like every
    // resume does, so the fire never pops in at full level on the first gesture.
    const gain = context.createGain(); gain.gain.value = 0
    let panner: PannerNode | null = null
    if (position && position.length === 3 && position.every(Number.isFinite)) {
      panner = context.createPanner()
      panner.panningModel = 'HRTF'; panner.distanceModel = 'inverse'
      panner.refDistance = 2; panner.maxDistance = 20; panner.rolloffFactor = .6
      panner.positionX.value = position[0]; panner.positionY.value = position[1]; panner.positionZ.value = position[2]
      panner.connect(gain)
    }
    // Ambience has its own bus beside PokerAudio's effects master. Global mute
    // pauses this owner rather than relying on the effects gain, so the
    // Off/Quiet/Normal fire preset and the effects preset stay independent.
    gain.connect(context.destination)
    this.graph = { context, input: panner ?? gain, panner, gain }
    this.decode(context)
  }

  private decode(context: AudioContext): void {
    const encoded = this.encoded; this.encoded = null
    if (!encoded) return
    let bytes: ArrayBuffer
    try { bytes = inlineAudioBytes(encoded) } catch (reason) { this.decodeFailed(reason); return }
    // Decoding works on a suspended (autoplay-locked) context. Only rendering
    // waits for resume(). Promise form is Chromium/Electron's. The legacy
    // callback overload only matters for Safari < 14.1, which is not a host.
    context.decodeAudioData(bytes).then(buffer => {
      // A dispose (or context teardown) during the decode wins: the result
      // must not start a source on a graph that no longer exists.
      if (this.disposed || this.graph?.context !== context) return
      const bounds = audibleLoopWindow(buffer)
      this.buffer = buffer; this.loopStart = bounds.start; this.loopEnd = bounds.end; this.offset = bounds.start
      this.sync()
    }, reason => this.decodeFailed(reason))
  }

  /** Not retried: the same bytes on the same host fail the same way. It is logged,
   * unlike the old swallowed play() rejection. A silent failure is how #12 went
   * unnoticed, and the hand itself must keep going regardless. */
  private decodeFailed(reason: unknown): void {
    if (!this.disposed) console.warn('Fireplace ambience could not be decoded; the room stays silent.', reason)
  }

  setListenerMatrix(matrix: ArrayLike<number>): void {
    // Called every rendered frame: AudioParam writes only, no allocation.
    if (!this.graph?.panner || matrix.length !== 16) return
    for (let i = 0; i < 16; i++) if (!Number.isFinite(matrix[i])) return
    const listener = this.graph.context.listener, at = this.graph.context.currentTime
    // Three/Web Audio share right-handed world coordinates. Matrix column2 is
    // camera-backward, hence its NEGATION is forward; screen-space panning or
    // an un-negated Z flips left/right as the player looks around.
    listener.positionX.setTargetAtTime(matrix[12], at, .04); listener.positionY.setTargetAtTime(matrix[13], at, .04); listener.positionZ.setTargetAtTime(matrix[14], at, .04)
    listener.forwardX.setTargetAtTime(-matrix[8], at, .04); listener.forwardY.setTargetAtTime(-matrix[9], at, .04); listener.forwardZ.setTargetAtTime(-matrix[10], at, .04)
    listener.upX.setTargetAtTime(matrix[4], at, .04); listener.upY.setTargetAtTime(matrix[5], at, .04); listener.upZ.setTargetAtTime(matrix[6], at, .04)
  }
  setActive(active: boolean): void { this.active = active; this.sync() }
  setMuted(muted: boolean): void { this.muted = muted; this.sync() }
  setVolume(level: number): void {
    if (!Number.isFinite(level)) return
    this.level = Math.max(0, Math.min(1, level))
    // Only ramp while audible. When this call silences the fire (Off), sync()
    // below owns the fade-out, and when not playing, the next start ramps up
    // to the new level.
    if (this.graph && this.source && this.level > 0) this.rampBus(this.level)
    this.sync()
  }

  /** Linear ramp from the bus's current value. cancelScheduledValues first, or
   * a pending fade-out and a new fade-in would both be in the automation
   * timeline and the later one would jump. AudioParam writes only, no
   * allocation. */
  private rampBus(target: number): void {
    const { context, gain } = this.graph!, at = context.currentTime
    gain.gain.cancelScheduledValues(at)
    gain.gain.setValueAtTime(gain.gain.value, at)
    gain.gain.linearRampToValueAtTime(target, at + FADE_SECONDS)
  }

  private sync(): void {
    const wanted = !this.disposed && this.active && this.unlocked && !this.muted && this.level > 0
    if (!wanted) { this.stopSource(); return }
    // Still decoding (or never attached): the decode callback calls sync()
    // again, and it re-reads the gates at that moment. A pause during the
    // decode therefore wins.
    if (this.source || !this.graph || !this.buffer) return
    const { context, input } = this.graph
    this.cutFading()
    const source = context.createBufferSource()
    source.buffer = this.buffer; source.loop = true
    source.loopStart = this.loopStart; source.loopEnd = this.loopEnd
    source.connect(input)
    // Starting on a context that the autoplay policy still holds suspended is
    // fine: the source is scheduled and becomes audible when PokerAudio's
    // resume() succeeds on this or a later gesture. currentTime is frozen
    // meanwhile, so the loop position bookkeeping below stays correct.
    source.start(0, this.offset)
    this.source = source; this.startedAt = context.currentTime
    this.rampBus(this.level)
  }

  /** `immediate` is for dispose only: the graph is about to be torn down, so
   * there is no bus left to fade on. Every other stop fades the bus to zero
   * and schedules stop() at the end of that fade. Stop and fade are on the
   * same audio clock, so the node ends exactly when the bus reaches zero. */
  private stopSource(immediate = false): void {
    const source = this.source, graph = this.graph
    if (!source || !graph) return
    this.source = null
    const at = graph.context.currentTime
    const span = this.loopEnd - this.loopStart
    if (span > 0) {
      // The resume point is where the pause was ASKED for, not the end of the
      // fade. A resume replays at most 40 ms, which is inaudible on a crackle
      // bed and keeps the maths independent of the fade.
      const played = Math.max(0, at - this.startedAt)
      this.offset = this.loopStart + ((this.offset - this.loopStart + played) % span)
    }
    this.cutFading()
    if (immediate) { this.halt(source, 0); return }
    this.rampBus(0)
    source.onended = releaseEnded
    this.fading = source
    this.halt(source, at + FADE_SECONDS)
  }

  private cutFading(): void {
    const fading = this.fading
    if (!fading) return
    this.fading = null
    this.halt(fading, 0)
  }

  /** stop() on a node whose context was already closed is harmless in Chromium
   * but has thrown in older engines. Teardown must not throw. A stop(0) after
   * an earlier scheduled stop() replaces it (the last call wins). */
  private halt(source: AudioBufferSourceNode, when: number): void {
    try { source.stop(when) } catch { /* already stopped */ }
    if (when === 0) { source.onended = null; source.disconnect() }
  }

  dispose(): void {
    this.disposed = true; this.stopSource(true); this.cutFading()
    if (this.graph) { this.graph.panner?.disconnect(); this.graph.gain.disconnect(); this.graph = null }
    // Drop the ~20 MB of PCM and the base64 reference promptly. The module
    // string stays alive in the bundle anyway, but this owner no longer pins it.
    this.buffer = null; this.encoded = null
  }
}
