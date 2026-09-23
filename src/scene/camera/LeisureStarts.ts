import type { SeatedLook } from './SeatedLook'

type Kind = 'smoke' | 'drink'

/** The only place that decides a LOCAL leisure gesture has actually started,
 * and so the only place allowed to tell anyone else about it.
 *
 * Why this exists (review of #21): with mouse-look on, a smoke/sip request is
 * only QUEUED in SeatedLook until the view re-centres. The client used to
 * broadcast at request time, so an interruption before the start (a pause from
 * a poll, the hand ending, the wager or drink panel blocking the look,
 * inspection) cancelled it locally while every other player had already been
 * shown it, and even real gestures started early for others by the re-centre
 * time. `onStarted` now fires only when the hero's own owner accepted the
 * start: immediately without look, or when the queued contact is dispatched.
 * Kept free of DOM/WebGL so it is tested with the real SeatedLook. */
export class LeisureStarts {
  onStarted: (kind: Kind) => void = () => {}
  constructor(private look: Pick<SeatedLook, 'requestContact' | 'takeContact'> | null, private start: (kind: Kind) => boolean) {}
  /** True when started (no look) or queued (look). Queued is not started. */
  request(kind: Kind): boolean { return this.look ? this.look.requestContact(kind) : this.begin(kind) }
  /** Once per frame, before posing: dispatch a queued contact that is due. */
  frame(): { kind: Kind; accepted: boolean } | null {
    const kind = this.look?.takeContact() ?? null
    return kind ? { kind, accepted: this.begin(kind) } : null
  }
  private begin(kind: Kind): boolean {
    const accepted = this.start(kind)
    if (accepted) this.onStarted(kind)
    return accepted
  }
}
