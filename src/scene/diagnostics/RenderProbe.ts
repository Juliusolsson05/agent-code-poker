export type ProbeMode = 'legacy' | 'balanced'
export type ProbeSample = { frameMs: number; cpuMs: number; draws: number; triangles: number }
const MODES: ProbeMode[] = ['legacy', 'balanced', 'legacy', 'balanced']

/** Fixed warm/sample windows prevent a human's click latency selecting only
 * fast frames. Repeated A/B windows expose gross thermal/background drift.
 * This measures wall-frame delivery and JS submission, never GPU execution.
 * Static-scene timing is intentionally separate from active gameplay traces. */
export class RenderProbe {
  readonly windows: { mode: ProbeMode; samples: ProbeSample[]; gpuMs: number[] }[] = MODES.map(mode => ({ mode, samples: [], gpuMs: [] }))
  index = 0
  private started = 0
  constructor(now: number, readonly warmMs = 2000, readonly sampleMs = 8000) { this.started = now }
  get mode(): ProbeMode { return MODES[Math.min(this.index, MODES.length - 1)] }
  get done(): boolean { return this.index >= MODES.length }
  sampling(now: number): boolean { return !this.done && now - this.started >= this.warmMs && now - this.started < this.warmMs + this.sampleMs }
  frame(now: number, sample: ProbeSample): boolean {
    if (this.done) return false
    const age = now - this.started
    if (age >= this.warmMs + this.sampleMs) {
      this.index++; this.started = now; return true
    }
    if (age >= this.warmMs) this.windows[this.index].samples.push({ ...sample })
    return false
  }
}
