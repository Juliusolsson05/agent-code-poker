import * as THREE from 'three'
import { ExperienceRecorder, type TraceValue } from './Recorder'
import { RenderProbe, assessProbe, type ProbeMode } from './RenderProbe'
import { GpuTimer } from './GpuTimer'

export function transform(object: THREE.Object3D): TraceValue {
  object.updateWorldMatrix(true, false)
  return { parent: object.parent?.name || object.parent?.type || 'none', local: object.matrix.toArray(), world: object.matrixWorld.toArray(), visible: object.visible }
}

/** Development-only, explicit opt-in UI. Export goes to a local browser download
 * with a capture ID; there is no service or host/network telemetry. Screenshot
 * copying happens just after render because preserveDrawingBuffer would impose
 * a permanent GPU cost on the very workload we're trying to measure. */
export class SceneCapture {
  private recorder = new ExperienceRecorder()
  private panel = document.createElement('aside')
  private status = document.createElement('output')
  private id = ''
  private imageRequested = false
  private lastPose = -Infinity
  private lastStatus = 0
  private probe: RenderProbe | null = null
  private probeMetadata: TraceValue = null
  private probeEnvironments: TraceValue[] = []
  private gpuTimer: GpuTimer | null
  private probeFrames = 0
  private fixedImage = false
  private profileResult = ''
  constructor(private renderer: THREE.WebGLRenderer, private getTime: () => number, private metadata: () => TraceValue,
    setView?: (wide: boolean) => void, private setProbeMode?: (mode: ProbeMode | null) => boolean) {
    // Three r169 requires WebGL2; its older type declaration retains a union.
    this.gpuTimer = new URLSearchParams(location.search).has('gpu')
      ? new GpuTimer(renderer.getContext() as WebGL2RenderingContext, (tag, ms) => { this.probe?.windows[tag]?.gpuMs.push(ms) }) : null
    this.panel.setAttribute('aria-label', 'Experience recording')
    this.panel.style.cssText = 'position:absolute;left:12px;top:112px;max-width:min(560px,calc(100% - 24px));z-index:60;background:#111c22ee;border:1px solid #68766c;padding:8px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;font:12px monospace;color:#e5e6dc'
    const button = (label: string, run: () => void) => {
      const b = document.createElement('button'); b.textContent = label; b.type = 'button'
      b.style.cssText = 'background:#263b36;color:#fff;border:1px solid #6f877a;padding:6px;cursor:pointer'
      b.addEventListener('click', run); this.panel.append(b)
    }
    button('Record evidence', () => {
      this.finishProbe('recording-started')
      this.id = new Date().toISOString().replace(/[:.]/g, '-')
      this.recorder.start(performance.now(), { captureId: this.id, capturedAt: new Date().toISOString(), source: 'actual-browser-session', ...this.environment(), scene: this.metadata() })
      this.lastPose = -Infinity; this.event('capture-start', null); this.updateStatus()
    })
    button('Save trace', () => {
      this.event('capture-stop', null); this.recorder.stop()
      this.download(new Blob([JSON.stringify(this.recorder.export(), null, 2)], { type: 'application/json' }), `poker-evidence-${this.id || 'empty'}.json`); this.updateStatus()
    })
    button('Capture view', () => { this.finishProbe('image-requested'); this.imageRequested = true; this.event('image-request', null) })
    if (setView) {
      button('Wide room', () => { this.finishProbe('camera-changed'); setView(true); this.event('diagnostic-view', { wide: true }) })
      button('Seated view', () => { this.finishProbe('camera-changed'); setView(false); this.event('diagnostic-view', { wide: false }) })
    }
    if (setProbeMode) button('Profile render cost', () => {
      if (this.probe || this.recorder.active || !setProbeMode('legacy')) return
      this.gpuTimer?.dispose(); this.probeFrames = 0
      this.profileResult = ''
      this.probe = new RenderProbe(performance.now()); this.probeMetadata = this.metadata()
      this.probeEnvironments = [this.environment()]; this.updateStatus()
    })
    if (setProbeMode) button('Isolate render passes', () => {
      if (this.probe || this.recorder.active || !setProbeMode('balanced')) return
      this.gpuTimer?.dispose(); this.probeFrames = 0
      this.profileResult = ''
      this.probe = new RenderProbe(performance.now(), 4000, 6000, ['balanced', 'no-bloom', 'no-shadows', 'direct', 'balanced'])
      this.probeMetadata = this.metadata(); this.probeEnvironments = [this.environment()]; this.updateStatus()
    })
    if (setProbeMode) button('Capture fixed view', () => {
      if (this.probe || this.recorder.active || !setProbeMode('balanced')) return
      this.fixedImage = true
    })
    this.panel.append(this.status); renderer.domElement.parentElement!.append(this.panel); this.updateStatus()
    window.addEventListener('error', this.error)
    document.addEventListener('visibilitychange', this.visibility)
    window.addEventListener('resize', this.probeResize)
  }
  private environment(): Record<string, TraceValue> {
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2())
    const gl = this.renderer.getContext()
    return { viewport: [innerWidth, innerHeight], buffer: size.toArray(), dpr: devicePixelRatio, pixelRatio: this.renderer.getPixelRatio(),
      canvasAntialias: gl.getContextAttributes()?.antialias ?? false, defaultSamples: gl.getParameter(gl.SAMPLES),
      userAgent: navigator.userAgent, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches }
  }
  private error = (event: ErrorEvent) => this.event('error', { message: event.message, line: event.lineno })
  private visibility = () => { this.event('visibility', { hidden: document.hidden }); if (document.hidden) this.finishProbe('hidden') }
  private probeResize = () => this.finishProbe('resized')
  private finishProbe(reason: string): void {
    if (!this.probe) return
    const probe = this.probe; this.probe = null; this.setProbeMode?.(null)
    const assessment = assessProbe(probe.windows)
    this.profileResult = reason === 'complete' && assessment.comparable ? 'Drift check passed; inspect raw results' : `Comparison rejected: ${reason === 'complete' ? assessment.reasons.join(', ') : reason}`
    this.download(new Blob([JSON.stringify({ version: 1, source: 'actual-browser-fixed-lobby', reason,
      capturedAt: new Date().toISOString(), warmMs: probe.warmMs, sampleMs: probe.sampleMs,
      protocol: 'Lobby, visual time 12, canonical reduced-motion opponent pose, centered seated camera. Resolution comparison or named pass ablations; no inputs during windows.',
      gpuTimerSupported: this.gpuTimer?.supported ?? null,
      assessment, scene: this.probeMetadata, environments: this.probeEnvironments, windows: probe.windows }, null, 2)],
    { type: 'application/json' }), `poker-profile-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
    this.updateStatus()
  }
  event(kind: string, data: TraceValue): void { this.recorder.record(performance.now(), this.getTime(), kind, data) }
  cancelProbe(reason: string): void { this.finishProbe(reason) }
  beforeRender(): void { this.gpuTimer?.begin(this.probe?.sampling(performance.now()) && this.probeFrames++ % 30 === 0 ? this.probe.index : null) }
  afterRender(): void { this.gpuTimer?.end() }
  frame(wallMs: number, frameMs: number, cpuMs: number, pose: () => TraceValue): void {
    if (this.fixedImage) {
      this.fixedImage = false
      // toBlob snapshots this already-rendered frame before restoring live
      // time. Identical pose/camera/buffer images can test pipeline equivalence
      // without inferring image quality from a geometry budget or FPS counter.
      const name = `poker-fixed-${new Date().toISOString().replace(/[:.]/g, '-')}.png`
      this.renderer.domElement.toBlob(blob => { if (blob) this.download(blob, name) })
      this.setProbeMode?.(null)
    }
    if (this.probe) {
      const info = this.renderer.info.render
      if (this.probe.frame(wallMs, { frameMs, cpuMs, draws: info.calls, triangles: info.triangles })) {
        if (this.probe.done) this.finishProbe('complete')
        else { this.setProbeMode?.(this.probe.mode); this.probeEnvironments.push(this.environment()); this.updateStatus() }
      }
    }
    if (this.recorder.active) {
      const info = this.renderer.info
      this.recorder.record(wallMs, this.getTime(), 'frame', { frameMs, cpuMs, draws: info.render.calls, triangles: info.render.triangles, geometries: info.memory.geometries, textures: info.memory.textures })
      // All frame timing is retained; heavier matrices are sampled at 15 Hz.
      // Input events remain full rate so a transition between pose samples is
      // still replayable. Report this rate in the trace rather than implying a
      // sampled pose stream is an exact capture of every GPU frame.
      if (wallMs - this.lastPose >= 1000 / 15) {
        this.lastPose = wallMs; this.recorder.record(wallMs, this.getTime(), 'pose', pose())
      }
    }
    if (this.imageRequested) {
      this.imageRequested = false
      const seconds = this.getTime().toFixed(3)
      this.event('image', { filename: `poker-evidence-${this.id}-${seconds}.png` })
      this.renderer.domElement.toBlob(blob => { if (blob) this.download(blob, `poker-evidence-${this.id}-${seconds}.png`) })
    }
    if (wallMs - this.lastStatus > 1000) { this.lastStatus = wallMs; this.updateStatus() }
  }
  private updateStatus(): void { this.status.textContent = this.probe ? `Profile ${this.probe.index + 1}/${this.probe.windows.length} · ${this.probe.mode} · keep this lobby visible` : `${this.recorder.active ? 'Recording' : this.recorder.truncated ? 'Limit reached' : 'Stopped'} · ${this.recorder.length} records${this.profileResult ? ' · ' + this.profileResult : ''}` }
  private download(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = filename; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  dispose(): void { this.gpuTimer?.dispose(); this.probe = null; this.recorder.stop(); this.panel.remove(); window.removeEventListener('error', this.error); window.removeEventListener('resize', this.probeResize); document.removeEventListener('visibilitychange', this.visibility) }
}
