import * as THREE from 'three'
import type { Card } from '../engine/cards'
import type { GameState } from '../engine/game'
import { tableCardPosition, TABLE } from './Table'

type Flight = { mesh: THREE.Mesh; start: THREE.Vector3; end: THREE.Vector3; time: number; duration: number; delay: number; disappear: boolean; spin: number }

export class CardField {
  readonly root = new THREE.Group()
  private cards = new Map<string, THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>()
  private flights: Flight[] = []
  private previous: GameState | null = null
  private inspecting = false
  private inspectedCards: THREE.Mesh[] = []
  constructor(private seats: [number, number][], private texture: (card: Card | null) => THREE.CanvasTexture) {}
  private card(key: string, value: Card | null): THREE.Mesh {
    let mesh = this.cards.get(key)
    if (!mesh) {
      // Paper luminance is bounded independently of dramatic room lighting.
      // This is intentionally NOT emissive and can never cross bloom threshold.
      mesh = new THREE.Mesh(new THREE.PlaneGeometry(.104, .145), new THREE.MeshBasicMaterial({ color: '#bdb6a6', side: THREE.DoubleSide }))
      this.cards.set(key, mesh); this.root.add(mesh)
    }
    mesh.material.map = this.texture(value); mesh.material.needsUpdate = true; mesh.rotation.x = -Math.PI / 2
    return mesh
  }
  update(state: GameState, now = performance.now() / 1000): void {
    const old = this.previous, newHand = old?.handNumber !== state.handNumber || old?.deck.join() !== state.deck.join()
    if (newHand) {
      for (const mesh of this.cards.values()) { mesh.geometry.dispose(); mesh.material.dispose(); mesh.removeFromParent() }
      this.cards.clear(); this.flights = []
    }
    state.board.forEach((value, i) => {
      const key = `board:${i}`
      if (this.cards.has(key)) return
      const mesh = this.card(key, value), end = new THREE.Vector3((i - 2) * .122, TABLE.cardY, -.06)
      mesh.rotation.z = 0
      this.flights.push({ mesh, start: new THREE.Vector3(0, .95, -.87), end, time: now, duration: .62, delay: (i - (old?.board.length ?? 0)) * .20, disappear: false, spin: -.18 })
    })
    const show = state.phase === 'showdown' || state.phase === 'complete' && state.results.some(r => r.hand)
    const wasShow = old?.phase === 'showdown' || old?.phase === 'complete' && old.results.some(r => r.hand)
    for (const p of state.players) {
      if (p.hole.length !== 2) continue
      const [x, z] = this.seats[p.seat]
      for (let i = 0; i < 2; i++) {
        const key = `seat:${p.seat}:${i}`, end = tableCardPosition(p.seat, i, this.seats)
        // Restoration can first present an already-public showdown. In that
        // case the face-up result takes precedence over replaying a private deal.
        if (show && (newHand || !wasShow) && !p.folded) {
          const mesh = this.card(key, p.hole[i])
          this.flights.push({ mesh, start: newHand ? end.clone() : new THREE.Vector3(x * .90, 1.06, z * .77), end, time: now, duration: .65, delay: newHand ? 0 : p.seat * .10, disappear: false, spin: .4 })
        } else if (newHand && !p.folded) {
          const mesh = this.card(key, null)
          this.flights.push({ mesh, start: new THREE.Vector3(0, .96, -.84), end, time: now, duration: .54, delay: i * .70 + p.seat * .105, disappear: true, spin: .25 })
        } else if (p.folded && !old?.players[p.seat].folded) {
          const mesh = this.card(key, null)
          this.flights.push({ mesh, start: new THREE.Vector3(x * .79, .98, z * .72), end: new THREE.Vector3(-.2 + i * .07, TABLE.cardY, -.65), time: now, duration: .68, delay: i * .08, disappear: true, spin: .55 })
        }
      }
    }
    this.previous = state
    this.updateInspection()
  }
  setInspection(active: boolean): void {
    if (this.inspecting === active) return
    this.inspecting = active; this.updateInspection()
  }
  private updateInspection(): void {
    const state = this.previous, player = state?.players[0]
    const publicShowdown = state?.phase === 'showdown' || state?.phase === 'complete' && state.results.some(r => r.hand)
    const visible = this.inspecting && !!player && !player.folded && player.hole.length === 2 && !publicShowdown
    // This close inspection is local-player information only. Opponent meshes
    // retain their existing back textures, regardless of the new camera angle.
    if (visible && !this.inspectedCards.length) for (let i = 0; i < 2; i++) {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(.104, .145), new THREE.MeshBasicMaterial({ color: '#bdb6a6', side: THREE.DoubleSide }))
      mesh.name = 'player-inspection-card'; mesh.rotation.x = -Math.PI / 2
      mesh.position.copy(tableCardPosition(0, i, this.seats)); this.root.add(mesh); this.inspectedCards.push(mesh)
    }
    this.inspectedCards.forEach((mesh, i) => {
      mesh.visible = visible
      if (visible) {
        const material = mesh.material as THREE.MeshBasicMaterial
        material.map = this.texture(player!.hole[i]); material.needsUpdate = true
      }
    })
  }
  frame(now: number, reduced: boolean): void {
    for (let i = this.flights.length - 1; i >= 0; i--) {
      const flight = this.flights[i], t = reduced ? 1 : THREE.MathUtils.clamp((now - flight.time - flight.delay) / flight.duration, 0, 1)
      flight.mesh.position.lerpVectors(flight.start, flight.end, 1 - (1 - t) ** 3)
      flight.mesh.position.y += Math.sin(t * Math.PI) * .045; flight.mesh.rotation.z = (1 - t) * flight.spin
      flight.mesh.visible = now >= flight.time + flight.delay && !(flight.disappear && t >= 1)
      if (t >= 1) this.flights.splice(i, 1)
    }
  }
}
