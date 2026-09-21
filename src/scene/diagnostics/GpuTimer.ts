type Extension = { TIME_ELAPSED_EXT: number; GPU_DISJOINT_EXT: number }

/** Optional asynchronous GL timing. Never gl.finish()/busy-wait: that would
 * change the workload being measured. A disjoint event invalidates ALL pending
 * queries, and a bounded queue skips samples when the GPU falls behind.
 * Spec: https://registry.khronos.org/webgl/extensions/EXT_disjoint_timer_query_webgl2/
 * This is created only by opt-in diagnostics, never by installed gameplay. */
export class GpuTimer {
  private ext: Extension | null
  private active: { query: WebGLQuery; tag: number } | null = null
  private pending: { query: WebGLQuery; tag: number }[] = []
  constructor(private gl: WebGL2RenderingContext, private receive: (tag: number, ms: number) => void) {
    this.ext = gl.getExtension('EXT_disjoint_timer_query_webgl2') as Extension | null
  }
  get supported(): boolean { return !!this.ext }
  begin(tag: number | null): void {
    if (!this.ext || tag === null && this.pending.length === 0) return
    // Even a nominally cheap getParameter can cross Chrome's GPU-process
    // boundary. Never poll it on ordinary recording frames or before a result
    // is available; keep instrumentation cost confined to pending measurements.
    const ready = this.pending.length > 0 && this.gl.getQueryParameter(this.pending[0].query, this.gl.QUERY_RESULT_AVAILABLE)
    if (ready && this.gl.getParameter(this.ext.GPU_DISJOINT_EXT)) {
      this.pending.forEach(p => this.gl.deleteQuery(p.query)); this.pending = []; return
    }
    while (this.pending.length && this.gl.getQueryParameter(this.pending[0].query, this.gl.QUERY_RESULT_AVAILABLE)) {
      const p = this.pending.shift()!
      const ns = this.gl.getQueryParameter(p.query, this.gl.QUERY_RESULT) as number
      this.gl.deleteQuery(p.query)
      if (Number.isFinite(ns) && ns >= 0) this.receive(p.tag, ns / 1e6)
    }
    if (tag === null || this.pending.length >= 8 || this.active) return
    const query = this.gl.createQuery(); if (!query) return
    this.active = { query, tag }; this.gl.beginQuery(this.ext.TIME_ELAPSED_EXT, query)
  }
  end(): void {
    if (!this.ext || !this.active) return
    this.gl.endQuery(this.ext.TIME_ELAPSED_EXT); this.pending.push(this.active); this.active = null
  }
  dispose(): void {
    this.end(); this.pending.forEach(p => this.gl.deleteQuery(p.query)); this.pending = []
  }
}
