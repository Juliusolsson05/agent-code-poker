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
  private level = .12
  constructor(private element: HTMLAudioElement) {
    element.loop = true; element.preload = 'none'; element.volume = this.level
  }
  unlock(): void { this.unlocked = true; this.sync() }
  setActive(active: boolean): void { this.active = active; this.sync() }
  setMuted(muted: boolean): void { this.muted = muted; this.sync() }
  setVolume(level: number): void {
    if (!Number.isFinite(level)) return
    this.level = Math.max(0, Math.min(1, level)); this.element.volume = this.level; this.sync()
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
    this.element.removeAttribute('src'); this.element.load()
  }
}
