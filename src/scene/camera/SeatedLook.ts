export const LOOK_LIMITS = { yaw: .85, down: -.25, up: .20 } as const
/** Total horizontal field of regard the seated player can sweep, edge to edge
 * of the image, in radians. A requested product contract (#10), not a derived
 * number: every direction inside it must land on finished decor. */
export const FIELD_OF_REGARD = 280 * Math.PI / 180

/** Yaw limit that makes `2·yaw + horizontal FOV = FIELD_OF_REGARD` for this
 * lens and aspect. A fixed yaw limit gave narrow viewports less room than wide
 * ones and let ultrawide screens see past the finished walls. Deriving it from
 * the actual lens keeps the swept edge on the same authored surfaces
 * everywhere. Never below the original .85: narrowing an existing gesture
 * would feel like a regression. */
export function yawLimitForView(verticalFovDegrees: number, aspect: number): number {
  if (!(verticalFovDegrees > 0) || !(aspect > 0)) return LOOK_LIMITS.yaw
  const halfWidth = Math.atan(Math.tan(verticalFovDegrees * Math.PI / 360) * aspect)
  return Math.max(LOOK_LIMITS.yaw, FIELD_OF_REGARD / 2 - halfWidth)
}
type Context = { playing: boolean; enabled: boolean; paused: boolean; blocked: boolean; inspection: boolean; busy: boolean; reduced: boolean }
type View = { yaw: number; pitch: number }
type Contact = 'smoke' | 'drink' | 'consume'

/** Camera intent has one owner. This core knows neither poker state nor prop
 * transforms: turning the view must never stretch an arm or change the ledger.
 * Inspection temporarily overrides intent; explicit centering replaces it.
 * Room supplies elapsed visual time, so pause/hidden cannot accrue motion. */
export class SeatedLook {
  private context: Context = { playing: false, enabled: true, paused: false, blocked: false, inspection: false, busy: false, reduced: false }
  private intent: View = { yaw: 0, pitch: 0 }
  private view: View = { yaw: 0, pitch: 0 }
  private pointer: { id: number; x: number; y: number } | null = null
  private pending: Contact | null = null
  private yawLimit: number = LOOK_LIMITS.yaw
  get contactPending(): boolean { return this.pending !== null }
  get dragging(): boolean { return this.pointer !== null }
  get centered(): boolean { return Math.abs(this.view.yaw) < .003 && Math.abs(this.view.pitch) < .003 }
  private get allowed(): boolean {
    const c = this.context
    return c.playing && c.enabled && !c.paused && !c.blocked && !c.inspection && !c.busy && !this.pending
  }
  setContext(update: Partial<Context>): void {
    Object.assign(this.context, update)
    if (!this.context.playing || this.context.paused || this.context.blocked || this.context.inspection) this.pending = null
    if (!this.allowed) this.cancel()
    if (!this.context.enabled || !this.context.playing) this.recenter()
  }
  begin(id: number, x: number, y: number, scenePrimaryMouse: boolean): boolean {
    if (!scenePrimaryMouse || !this.allowed || this.pointer || ![id, x, y].every(Number.isFinite)) return false
    this.pointer = { id, x, y }; return true
  }
  move(id: number, x: number, y: number, viewportHeight: number, buttons: number): void {
    const pointer = this.pointer
    if (!pointer || pointer.id !== id) return
    if (!(buttons & 1) || !this.allowed) { this.cancel(); return }
    if (![x, y, viewportHeight].every(Number.isFinite) || viewportHeight <= 0) return
    // Height-normalized deltas keep sensitivity stable across ultrawide and
    // ordinary layouts. No acceleration/inertia; only an owned pointer steers.
    this.intent.yaw = Math.max(-this.yawLimit, Math.min(this.yawLimit, this.intent.yaw - (x - pointer.x) * 1.5 / viewportHeight))
    this.intent.pitch = Math.max(LOOK_LIMITS.down, Math.min(LOOK_LIMITS.up, this.intent.pitch - (y - pointer.y) / viewportHeight))
    pointer.x = x; pointer.y = y
  }
  /** Room owns the lens; this core only receives the resulting bound. Retained
   * intent is clamped immediately so a viewport resize cannot leave the view
   * parked beyond the finished room. */
  setYawLimit(limit: number): void {
    if (!Number.isFinite(limit)) return
    this.yawLimit = Math.max(LOOK_LIMITS.yaw, limit)
    this.intent.yaw = Math.max(-this.yawLimit, Math.min(this.yawLimit, this.intent.yaw))
  }
  end(id: number): void { if (this.pointer?.id === id) this.cancel() }
  cancel(): void { this.pointer = null }
  recenter(): void { this.cancel(); this.intent = { yaw: 0, pitch: 0 } }
  requestContact(kind: Contact): boolean {
    const c = this.context
    if (!c.playing || c.paused || c.blocked || c.inspection || c.busy || this.pending) return false
    this.recenter(); this.pending = kind; return true
  }
  cancelContact(): void { this.pending = null }
  takeContact(): Contact | null {
    const c = this.context
    if (!this.centered || !c.playing || c.paused || c.blocked || c.inspection || c.busy) return null
    // Dispatch once, only after view alignment. This does not animate or attach
    // a prop; Room invokes its existing owner. A missed frame cannot duplicate
    // the request and an interrupted request never silently resumes later.
    const kind = this.pending; this.pending = null; return kind
  }
  sample(seconds: number): View {
    if (this.context.paused) return { ...this.view }
    const target = this.context.inspection || this.context.busy || this.pending ? { yaw: 0, pitch: 0 } : this.intent
    const blend = this.context.reduced ? 1 : 1 - Math.exp(-12 * Math.max(0, Number.isFinite(seconds) ? seconds : 0))
    for (const axis of ['yaw', 'pitch'] as const) {
      this.view[axis] += (target[axis] - this.view[axis]) * blend
      if (Math.abs(this.view[axis] - target[axis]) < .00001) this.view[axis] = target[axis]
    }
    return { ...this.view }
  }
  diagnostic(): { intent: View; view: View; dragging: boolean } {
    return { intent: { ...this.intent }, view: { ...this.view }, dragging: this.dragging }
  }
}
