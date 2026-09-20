import * as THREE from 'three'
import { ExperienceRecorder, type TraceValue } from './Recorder'

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
  constructor(private renderer: THREE.WebGLRenderer, private getTime: () => number, private metadata: () => TraceValue,
    setView?: (wide: boolean) => void) {
    this.panel.setAttribute('aria-label', 'Experience recording')
    this.panel.style.cssText = 'position:absolute;left:12px;bottom:104px;z-index:60;background:#111c22ee;border:1px solid #68766c;padding:8px;display:flex;gap:8px;align-items:center;font:12px monospace;color:#e5e6dc'
    const button = (label: string, run: () => void) => {
      const b = document.createElement('button'); b.textContent = label; b.type = 'button'
      b.style.cssText = 'background:#263b36;color:#fff;border:1px solid #6f877a;padding:6px;cursor:pointer'
      b.addEventListener('click', run); this.panel.append(b)
    }
    button('Record evidence', () => {
      this.id = new Date().toISOString().replace(/[:.]/g, '-')
      this.recorder.start(performance.now(), { captureId: this.id, capturedAt: new Date().toISOString(), source: 'actual-browser-session', ...this.environment(), scene: this.metadata() })
      this.lastPose = -Infinity; this.event('capture-start', null); this.updateStatus()
    })
    button('Save trace', () => {
      this.event('capture-stop', null); this.recorder.stop()
      this.download(new Blob([JSON.stringify(this.recorder.export(), null, 2)], { type: 'application/json' }), `poker-evidence-${this.id || 'empty'}.json`); this.updateStatus()
    })
    button('Capture view', () => { this.imageRequested = true; this.event('image-request', null) })
    if (setView) {
      button('Wide room', () => { setView(true); this.event('diagnostic-view', { wide: true }) })
      button('Seated view', () => { setView(false); this.event('diagnostic-view', { wide: false }) })
    }
    this.panel.append(this.status); renderer.domElement.parentElement!.append(this.panel); this.updateStatus()
    window.addEventListener('error', this.error)
    document.addEventListener('visibilitychange', this.visibility)
  }
  private environment(): Record<string, TraceValue> {
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2())
    return { viewport: [innerWidth, innerHeight], buffer: size.toArray(), dpr: devicePixelRatio, pixelRatio: this.renderer.getPixelRatio(), userAgent: navigator.userAgent, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches }
  }
  private error = (event: ErrorEvent) => this.event('error', { message: event.message, line: event.lineno })
  private visibility = () => this.event('visibility', { hidden: document.hidden })
  event(kind: string, data: TraceValue): void { this.recorder.record(performance.now(), this.getTime(), kind, data) }
  frame(wallMs: number, frameMs: number, cpuMs: number, pose: () => TraceValue): void {
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
  private updateStatus(): void { this.status.textContent = `${this.recorder.active ? 'Recording' : this.recorder.truncated ? 'Limit reached' : 'Stopped'} · ${this.recorder.length} records` }
  private download(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = filename; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  dispose(): void { this.recorder.stop(); this.panel.remove(); window.removeEventListener('error', this.error); document.removeEventListener('visibilitychange', this.visibility) }
}
