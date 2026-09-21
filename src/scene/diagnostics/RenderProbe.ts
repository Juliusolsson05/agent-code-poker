export type ProbeMode = 'legacy' | 'balanced' | 'no-bloom' | 'no-shadows' | 'direct'
export type ProbeSample = { frameMs: number; cpuMs: number; draws: number; triangles: number }
const MODES: ProbeMode[] = ['legacy', 'balanced', 'legacy', 'balanced']

/** Completion is not comparability: the real E2 ablation returned to a baseline
 * five times slower than it started. Reject that run as a decision basis. The
 * 25% median-drift guard is a conservative QA screen, not a statistical proof
 * or a claim that background GPU work is controlled. Retain rejected raw data. */
export function assessProbe(windows: { mode: ProbeMode; samples: ProbeSample[] }[]) {
  const percentile = (values: number[], q: number) => values.length ? [...values].sort((a, b) => a - b)[Math.floor((values.length - 1) * q)] : null
  const summary = windows.map(w => ({ mode: w.mode, samples: w.samples.length,
    medianMs: percentile(w.samples.map(s => s.frameMs), .5), p95Ms: percentile(w.samples.map(s => s.frameMs), .95) }))
  const reasons: string[] = []
  if (windows.some(w => w.samples.length < 30)) reasons.push('insufficient-samples')
  if (windows.some(w => w.samples.some(s => !Number.isFinite(s.frameMs) || s.frameMs <= 0))) reasons.push('invalid-frame-time')
  const baselines = summary.filter(w => w.mode === summary[0]?.mode && w.medianMs !== null)
  let baselineRatio: number | null = null
  if (baselines.length < 2) reasons.push('missing-repeated-baseline')
  else {
    const values = baselines.map(w => w.medianMs!)
    baselineRatio = Math.max(...values) / Math.min(...values)
    if (baselineRatio > 1.25) reasons.push('baseline-drift')
  }
  return { comparable: reasons.length === 0, reasons, baselineRatio, windows: summary }
}

/** Fixed warm/sample windows prevent a human's click latency selecting only
 * fast frames. Repeated A/B windows expose gross thermal/background drift.
 * This measures wall-frame delivery and JS submission, never GPU execution.
 * Static-scene timing is intentionally separate from active gameplay traces. */
export class RenderProbe {
  readonly windows: { mode: ProbeMode; samples: ProbeSample[]; gpuMs: number[] }[]
  index = 0
  private started = 0
  constructor(now: number, readonly warmMs = 2000, readonly sampleMs = 8000, modes: ProbeMode[] = MODES) {
    this.started = now; this.windows = modes.map(mode => ({ mode, samples: [], gpuMs: [] }))
  }
  get mode(): ProbeMode { return this.windows[Math.min(this.index, this.windows.length - 1)].mode }
  get done(): boolean { return this.index >= this.windows.length }
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
