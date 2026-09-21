export type TraceValue = null | boolean | number | string | TraceValue[] | { [key: string]: TraceValue }
export type TraceEntry = { wallMs: number; visualSeconds: number; kind: string; data: TraceValue }

/** A diagnostic corpus must retain the sequence that actually happened, not
 * mutable vectors later overwritten by animation. Limits stop a forgotten QA
 * tab becoming a memory leak. Stop at the limit rather than overwriting the
 * beginning: ownership transitions at the start are essential replay evidence.
 * No engine object is accepted by callers; record only the explicit public
 * pose/performance projection, never hole cards, deck, saves or DOM input text. */
export class ExperienceRecorder {
  private entries: TraceEntry[] = []
  private counts: Record<string, number> = {}
  private startedAt = 0
  private metadata: TraceValue = null
  active = false
  truncated = false
  constructor(private readonly limit = 12000) {}
  start(wallMs: number, metadata: TraceValue): void {
    this.entries = []; this.counts = {}; this.startedAt = wallMs
    this.metadata = structuredClone(metadata); this.truncated = false; this.active = true
  }
  stop(): void { this.active = false }
  record(wallMs: number, visualSeconds: number, kind: string, data: TraceValue): void {
    if (!this.active) return
    if (this.entries.length >= this.limit) { this.active = false; this.truncated = true; return }
    this.entries.push({ wallMs: wallMs - this.startedAt, visualSeconds, kind, data: structuredClone(data) })
    this.counts[kind] = (this.counts[kind] ?? 0) + 1
  }
  export(): { version: 1; metadata: TraceValue; truncated: boolean; counts: Record<string, number>; entries: TraceEntry[] } {
    return structuredClone({ version: 1, metadata: this.metadata, truncated: this.truncated, counts: this.counts, entries: this.entries })
  }
  get length(): number { return this.entries.length }
}
