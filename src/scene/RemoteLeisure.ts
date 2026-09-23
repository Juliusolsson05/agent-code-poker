import type { ScenePlayer } from '../presentation/RoomProjection'

export type ArrivedGesture<K> = { key: K; action: 'smoke' | 'sip'; ageSeconds: number }

/** Turns projected leisure records into gesture starts for opponent bodies.
 *
 * Why wall time, not the room's visual clock: Room's visual clock stops while
 * the tab is hidden or paused and crawls under low fps (dt is capped at .1s
 * per frame). Anchoring a projected start in visual time at POLL time let a
 * gesture received while hidden (or at 5fps) play in full, late, once frames
 * resumed. Instead each new gesture is anchored to its wall-clock start
 * (arrival wall time minus the host-measured age) and only converted into
 * visual time by the first frame that actually renders it. A gesture that
 * already finished in wall time by then is reported with that full age, and
 * requestNpcGesture drops it instead of replaying it.
 *
 * DOM-free and clock-injected so the hidden-tab case is testable without a
 * browser. `seen` is per body key: any different seq is a new gesture (seq is
 * never reused), and a fresh instance (new room / viewer) joins in-progress
 * gestures part-way. */
export class RemoteLeisure<K> {
  private seen = new Map<K, number | null>()
  private arrived: { key: K; action: 'smoke' | 'sip'; wallStart: number }[] = []
  observe(key: K, leisure: ScenePlayer['leisure'], wallNowMs: number): void {
    const seq = leisure?.seq ?? null
    if (leisure?.action && leisure.ageMs !== null && seq !== this.seen.get(key))
      this.arrived.push({ key, action: leisure.action, wallStart: wallNowMs - leisure.ageMs })
    this.seen.set(key, seq)
  }
  /** Called by a rendering frame only; hidden/paused frames must not call it. */
  take(wallNowMs: number): ArrivedGesture<K>[] {
    const out = this.arrived.map(a => ({ key: a.key, action: a.action, ageSeconds: Math.max(0, (wallNowMs - a.wallStart) / 1000) }))
    this.arrived = []
    return out
  }
}
