import { applyListenerMatrix } from './listener'

/** One locally bundled recording, not a timer spawning crackle oscillators.
 * A media element decodes incrementally rather than reserving an entire minute
 * of stereo float PCM. It also preserves loop position on pause. Source is a
 * build-time data URL; this class never chooses or requests an external URL.
 * Intentionally independent of poker state/graphics so lifecycle races can be
 * tested without pretending a fake audio device verifies listening quality. */
export class FireAmbience {
  private active = false
  private unlocked = false
  private disposed = false
  private muted = false
  private playing = false
  private generation = 0
  private level = .045
  private spatial: { context: AudioContext; source: MediaElementAudioSourceNode; panner: PannerNode; gain: GainNode } | null = null
  constructor(private element: HTMLAudioElement) {
    element.loop = true; element.preload = 'none'; element.volume = this.level
  }
  unlock(): void { this.unlocked = true; this.sync() }
  connectSpatial(context: AudioContext, position: readonly number[]): void {
    if (this.disposed || this.spatial || position.length !== 3 || !position.every(Number.isFinite)) return
    const source = context.createMediaElementSource(this.element), panner = context.createPanner(), gain = context.createGain()
    panner.panningModel = 'HRTF'; panner.distanceModel = 'inverse'
    panner.refDistance = 2; panner.maxDistance = 20; panner.rolloffFactor = .6
    panner.positionX.value = position[0]; panner.positionY.value = position[1]; panner.positionZ.value = position[2]
    gain.gain.value = this.level; this.element.volume = 1
    // Creating this source reroutes the element's output into Web Audio: there
    // is no parallel flat stereo path. Ambience has its own quieter bus; global
    // mute still pauses this owner rather than relying on the effects gain.
    source.connect(panner); panner.connect(gain); gain.connect(context.destination)
    this.spatial = { context, source, panner, gain }
  }
  setListenerMatrix(matrix: ArrayLike<number>): void {
    if (this.spatial) applyListenerMatrix(this.spatial.context, matrix)
  }
  setActive(active: boolean): void { this.active = active; this.sync() }
  setMuted(muted: boolean): void { this.muted = muted; this.sync() }
  setVolume(level: number): void {
    if (!Number.isFinite(level)) return
    this.level = Math.max(0, Math.min(1, level))
    if (this.spatial) this.spatial.gain.gain.setTargetAtTime(this.level, this.spatial.context.currentTime, .04)
    else this.element.volume = this.level
    this.sync()
  }
  private sync(): void {
    const wanted = !this.disposed && this.active && this.unlocked && !this.muted && this.level > 0
    if (!wanted) {
      this.generation++; this.playing = false; this.element.pause(); return
    }
    if (this.playing) return
    this.playing = true; const generation = ++this.generation
    // Autoplay rejection must not break the hand or become an unhandled
    // promise. A later real gesture can retry. An older rejection cannot undo
    // a newer successful play request after a quick pause/resume.
    void this.element.play().catch(() => { if (generation === this.generation) this.playing = false })
  }
  dispose(): void {
    this.disposed = true; this.sync()
    if (this.spatial) {
      this.spatial.source.disconnect(); this.spatial.panner.disconnect(); this.spatial.gain.disconnect(); this.spatial = null
    }
    this.element.removeAttribute('src'); this.element.load()
  }
}
