import * as THREE from 'three'
import { createSurroundPlan, type Facing, type Flicker, type SurroundPlan } from './Surround'
import { buildFurnitureSculpt, buildPictureRelief } from './SurroundVoxel'
import { MAIN_WINTER_VIEW, SnowyWindows } from './SnowyWindows'

/** Renders the 280° surround plan (#10). Owns only decor: no game state, DOM
 * input, timers or audio. Room supplies its visual clock, so pause freezes
 * every flame and the pendulum exactly, and reduced motion is one still
 * tableau (same contract as Fireplace and ChristmasTavern).
 *
 * Draw budget: static solids are ONE instanced batch per finish (rough /
 * metal), glows are one instanced batch per flicker class, fairy bulbs and
 * wire share batches, and all sculpted furniture / picture relief share two
 * meshes. A few hundred separate meshes
 * behind the player would cost more CPU submission than the whole poker
 * table. Lights: exactly the plan's aggregate practicals, never one per bulb. */
export class SurroundDecor {
  readonly root = new THREE.Group()
  readonly plan: SurroundPlan = createSurroundPlan()
  private flickerMaterials = new Map<Flicker, THREE.MeshBasicMaterial>()
  private lights: { light: THREE.PointLight; base: number; flicker: Flicker; phase: number }[] = []
  private pendulums: THREE.Group[] = []
  private windows: SnowyWindows
  private lastTick = -1

  constructor() {
    this.root.name = 'surround-decor'
    const dummy = new THREE.Object3D(), cube = new THREE.BoxGeometry(1, 1, 1)
    // Static blocks. Rough and metal finishes are separate batches so brass
    // catches practical highlights without making wallpaper shiny.
    const solids = [...this.plan.shell, ...this.plan.blocks]
    for (const metal of [false, true]) {
      const list = solids.filter(b => !!b.metal === metal)
      // Ambient emission across every block made the side walls look as if
      // they were lit from within. Keep them physically lit by the three
      // practical zones: dark pockets are part of this winter room's mood.
      const material = new THREE.MeshStandardMaterial(metal
        ? { roughness: .38, metalness: .7 }
        : { roughness: .84 })
      const mesh = new THREE.InstancedMesh(cube, material, list.length)
      list.forEach((b, i) => {
        dummy.position.set(...b.position); dummy.rotation.set(0, b.rot ?? 0, 0); dummy.scale.set(...b.size); dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix); mesh.setColorAt(i, new THREE.Color(b.color))
      })
      mesh.name = metal ? 'surround-brass' : 'surround-solids'
      // Only receive shadows: the one shadow-casting key light points at the
      // table, and decor casting into that map would only add depth-pass cost.
      mesh.receiveShadow = true; mesh.computeBoundingSphere(); this.root.add(mesh)
    }
    // These contours share the same fine-block sculptor as the characters.
    // Keeping them in one mesh prevents the sculptural detail from raising the
    // number of submissions with every cushion or rounded cabinet edge.
    this.root.add(buildFurnitureSculpt(this.plan.sculpts))

    // Emissive glows (candle flames, lamp shades, frosted panes, fairy bulbs).
    // MeshBasic + toneMapped:false + instance colour × strength deliberately
    // exceeds 1.0 so only these reach the bloom threshold; paper and skin
    // never do. Per-class material colour is the flicker multiplier.
    const glowGroups = new Map<Flicker, { position: THREE.Vector3; size: THREE.Vector3; color: THREE.Color }[]>()
    const addGlow = (flicker: Flicker, position: THREE.Vector3, size: THREE.Vector3, color: THREE.Color) => {
      const list = glowGroups.get(flicker) ?? []; list.push({ position, size, color }); glowGroups.set(flicker, list)
    }
    for (const g of this.plan.glows) addGlow(g.flicker, new THREE.Vector3(...g.position), new THREE.Vector3(...g.size), new THREE.Color(g.color).multiplyScalar(g.strength))
    // Fairy strands: warm-white bulbs with an occasional red or green one,
    // plus a dark wire segment between neighbours so they read as strung.
    const wires: { from: THREE.Vector3; to: THREE.Vector3 }[] = []
    const fairyColors = ['#ffba67', '#f2a64f', '#ffd089', '#d35431', '#ffba67', '#638c55', '#f2a64f']
    this.plan.fairy.forEach((strand, s) => strand.forEach((p, i) => {
      addGlow('fairy', new THREE.Vector3(...p).setY(p[1] - .018), new THREE.Vector3(.014, .02, .014), new THREE.Color(fairyColors[(i + s * 3) % fairyColors.length]).multiplyScalar(3.2))
      if (i) wires.push({ from: new THREE.Vector3(...strand[i - 1]), to: new THREE.Vector3(...p) })
    }))
    // Garlands: evergreen sprigs along a sagging line with warm bulbs and red
    // berries, matching the bar garland's language.
    const sprigs: THREE.Matrix4[] = [], berries: THREE.Matrix4[] = []
    const sag = (from: THREE.Vector3, to: THREE.Vector3, amount: number, t: number) => from.clone().lerp(to, t).setY(from.y + (to.y - from.y) * t - amount * Math.sin(t * Math.PI))
    for (const [n, garland] of this.plan.garlands.entries()) {
      const from = new THREE.Vector3(...garland.from), to = new THREE.Vector3(...garland.to), count = Math.ceil(from.distanceTo(to) / .045)
      for (let i = 0; i <= count; i++) {
        const t = i / count, p = sag(from, to, garland.sag, t)
        dummy.position.copy(p); dummy.rotation.set(Math.sin(i * 1.7 + n) * .5, Math.sin(i * 2.3) * .6, Math.sin(i * .9) * .4); dummy.scale.set(.1, .07, .08); dummy.updateMatrix()
        sprigs.push(dummy.matrix.clone())
        if (i % 3 === 1) addGlow('fairy', p.clone().add(new THREE.Vector3(0, -.04, 0)), new THREE.Vector3(.014, .018, .014), new THREE.Color(i % 9 === 1 ? '#ff6a50' : '#ffd29a').multiplyScalar(4))
        if (i % 7 === 3) { dummy.position.copy(p).add(new THREE.Vector3(0, -.06, 0)); dummy.rotation.set(0, 0, 0); dummy.scale.setScalar(.03); dummy.updateMatrix(); berries.push(dummy.matrix.clone()) }
      }
    }
    // Wreaths: a ring of crossed sprigs plus berries and a red bow.
    const facingQuat = (f: Facing) => new THREE.Quaternion().setFromEuler(new THREE.Euler(0, f === '+x' ? Math.PI / 2 : f === '-x' ? -Math.PI / 2 : Math.PI, 0))
    const bows: THREE.Matrix4[] = []
    for (const w of this.plan.wreaths) {
      const q = facingQuat(w.facing), centre = new THREE.Vector3(...w.position), n = Math.round(w.radius * 200)
      for (let i = 0; i < n; i++) {
        const a = i / n * Math.PI * 2, local = new THREE.Vector3(Math.cos(a) * w.radius, Math.sin(a) * w.radius, 0)
        dummy.position.copy(local.applyQuaternion(q).add(centre)); dummy.quaternion.copy(q).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, a + (i % 2 ? .6 : -.6))))
        dummy.scale.set(.07, .04, .06); dummy.updateMatrix(); sprigs.push(dummy.matrix.clone())
        if (i % 6 === 0) { dummy.position.add(new THREE.Vector3(0, 0, .03).applyQuaternion(q)); dummy.scale.setScalar(.022); dummy.updateMatrix(); berries.push(dummy.matrix.clone()) }
      }
      for (const [x, y, sx] of [[0, -w.radius, .04], [-.045, -w.radius + .005, .07], [.045, -w.radius + .005, .07]] as const) {
        dummy.position.copy(new THREE.Vector3(x, y, .035).applyQuaternion(q).add(centre)); dummy.quaternion.copy(q); dummy.scale.set(sx, .05, .03); dummy.updateMatrix(); bows.push(dummy.matrix.clone())
      }
    }
    const instanced = (name: string, geometry: THREE.BufferGeometry, material: THREE.Material, matrices: THREE.Matrix4[]) => {
      const mesh = new THREE.InstancedMesh(geometry, material, Math.max(1, matrices.length)); mesh.count = matrices.length
      matrices.forEach((m, i) => mesh.setMatrixAt(i, m)); mesh.name = name; mesh.computeBoundingSphere(); this.root.add(mesh); return mesh
    }
    instanced('surround-sprigs', cube, new THREE.MeshStandardMaterial({ color: '#173c2b', roughness: .95 }), sprigs)
    instanced('surround-berries', new THREE.SphereGeometry(.5, 8, 6), new THREE.MeshStandardMaterial({ color: '#8e1d24', roughness: .4 }), berries)
    instanced('surround-bows', cube, new THREE.MeshStandardMaterial({ color: '#8a1d25', roughness: .5 }), bows)
    instanced('surround-fairy-wire', cube, new THREE.MeshStandardMaterial({ color: '#171412', roughness: .9 }), wires.map(({ from, to }) => {
      dummy.position.copy(from).lerp(to, .5); dummy.lookAt(to); dummy.scale.set(.004, .004, from.distanceTo(to)); dummy.updateMatrix(); return dummy.matrix.clone()
    }))
    for (const [flicker, list] of glowGroups) {
      const material = new THREE.MeshBasicMaterial({ toneMapped: false }); this.flickerMaterials.set(flicker, material)
      const mesh = new THREE.InstancedMesh(cube, material, list.length)
      list.forEach((g, i) => { dummy.position.copy(g.position); dummy.rotation.set(0, 0, 0); dummy.scale.copy(g.size); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix); mesh.setColorAt(i, g.color) })
      mesh.name = `surround-glow-${flicker}`; mesh.computeBoundingSphere(); this.root.add(mesh)
    }

    // Artwork takes the room's actual light. The two outdoor apertures have a
    // separate night palette and depth layers; sharing the old self-lit paper
    // material made both windows and framed art look like bright monitors.
    this.root.add(buildPictureRelief(this.plan.pictures.filter(p => p.kind !== 'snowscape')))
    this.windows = new SnowyWindows([...this.plan.pictures.filter(p => p.kind === 'snowscape'), MAIN_WINTER_VIEW])
    this.root.add(this.windows.root)
    // Clock pendulum: rod + brass bob swinging in the case's plane.
    for (const pend of this.plan.pendulums) {
      const pivot = new THREE.Group(); pivot.position.set(...pend.pivot)
      const metal = new THREE.MeshStandardMaterial({ color: '#b08a48', metalness: .75, roughness: .32 })
      const rod = new THREE.Mesh(cube, metal); rod.scale.set(.008, pend.length, .008); rod.position.y = -pend.length / 2
      const bob = new THREE.Mesh(new THREE.CylinderGeometry(.055, .055, .012, 20), metal); bob.rotation.z = Math.PI / 2; bob.position.y = -pend.length
      pivot.add(rod, bob); this.root.add(pivot); this.pendulums.push(pivot)
    }
    for (const l of this.plan.lights) {
      const light = new THREE.PointLight(l.color, l.power, l.range, 2); light.name = l.name; light.position.set(...l.position)
      this.root.add(light); this.lights.push({ light, base: l.power, flicker: l.flicker, phase: this.lights.length * 2.17 })
    }
    this.frame(0, true)
  }

  /** 30Hz ticks like the hearth: sub-frame flame changes are invisible, and a
   * repeated paused time must not re-upload anything. */
  frame(time: number, reduced: boolean): void {
    if (!Number.isFinite(time)) return
    const tick = reduced ? 0 : Math.floor(Math.max(0, time) * 30) + 1
    if (tick === this.lastTick) return
    this.lastTick = tick
    const t = reduced ? 0 : (tick - 1) / 30
    this.windows.frame(t, reduced)
    for (const [flicker, material] of this.flickerMaterials) material.color.setScalar(reduced ? 1 : flickerAt(flicker, t, 0))
    for (const l of this.lights) l.light.intensity = l.base * (reduced ? 1 : flickerAt(l.flicker, t, l.phase))
    // A 2s-period seconds pendulum, small angle (clocks swing ±4–5°).
    for (const p of this.pendulums) p.rotation.x = reduced ? 0 : Math.sin(t * Math.PI) * .08
  }

  // Room's scene traversal owns the shared geometries/materials. There are no
  // canvas textures to release after replacing painted pictures with voxels;
  // keep this lifecycle hook because Room disposes each environment owner.
  dispose(): void {}
}

/** Deterministic flicker multipliers in [~.8, ~1.15]. Candles combine a slow
 * breath with two incommensurate flutters so the pattern never visibly loops;
 * electric lamps only hum; fairy bulbs slowly twinkle. Pure in time and phase:
 * tests and pause rely on the same time giving the same light. */
export function flickerAt(kind: Flicker, t: number, phase: number): number {
  if (kind === 'steady') return 1
  if (kind === 'lamp') return 1 + .012 * Math.sin(t * 2.3 + phase)
  if (kind === 'fairy') return .92 + .08 * Math.sin(t * .9 + phase)
  return 1 + .06 * Math.sin(t * 1.3 + phase) + .045 * Math.sin(t * 7.9 + phase * 1.7) + .03 * Math.sin(t * 13.7 + phase * .6)
}
