import * as THREE from 'three'
import { createSurroundPlan, type Facing, type Flicker, type PictureKind, type SurroundPlan } from './Surround'

/** Renders the 280° surround plan (#10). Owns only decor: no game state, DOM
 * input, timers or audio. Room supplies its visual clock, so pause freezes
 * every flame and the pendulum exactly, and reduced motion is one still
 * tableau (same contract as Fireplace and ChristmasTavern).
 *
 * Draw budget: static solids are ONE instanced batch per finish (rough /
 * metal), glows are one instanced batch per flicker class, fairy bulbs and
 * wire, sprigs and paintings a handful more. A few hundred separate meshes
 * behind the player would cost more CPU submission than the whole poker
 * table. Lights: exactly the plan's aggregate practicals, never one per bulb. */
export class SurroundDecor {
  readonly root = new THREE.Group()
  readonly plan: SurroundPlan = createSurroundPlan()
  private flickerMaterials = new Map<Flicker, THREE.MeshBasicMaterial>()
  private lights: { light: THREE.PointLight; base: number; flicker: Flicker; phase: number }[] = []
  private pendulums: THREE.Group[] = []
  private textures: THREE.Texture[] = []
  private lastTick = -1

  constructor() {
    this.root.name = 'surround-decor'
    const dummy = new THREE.Object3D(), cube = new THREE.BoxGeometry(1, 1, 1)
    // Static blocks. Rough and metal finishes are separate batches so brass
    // catches practical highlights without making wallpaper shiny.
    const solids = [...this.plan.shell, ...this.plan.blocks]
    for (const metal of [false, true]) {
      const list = solids.filter(b => !!b.metal === metal)
      const mesh = new THREE.InstancedMesh(cube, new THREE.MeshStandardMaterial(metal ? { roughness: .38, metalness: .7 } : { roughness: .84 }), list.length)
      list.forEach((b, i) => {
        dummy.position.set(...b.position); dummy.rotation.set(0, b.rot ?? 0, 0); dummy.scale.set(...b.size); dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix); mesh.setColorAt(i, new THREE.Color(b.color))
      })
      mesh.name = metal ? 'surround-brass' : 'surround-solids'
      // Only receive shadows: the one shadow-casting key light points at the
      // table, and decor casting into that map would only add depth-pass cost.
      mesh.receiveShadow = true; mesh.computeBoundingSphere(); this.root.add(mesh)
    }

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
    const fairyColors = ['#ffd9a0', '#ffc27a', '#ffd9a0', '#ff6a50', '#ffd9a0', '#6aff9a', '#ffc27a']
    this.plan.fairy.forEach((strand, s) => strand.forEach((p, i) => {
      addGlow('fairy', new THREE.Vector3(...p).setY(p[1] - .018), new THREE.Vector3(.014, .02, .014), new THREE.Color(fairyColors[(i + s * 3) % fairyColors.length]).multiplyScalar(4.2))
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

    // Paintings, window views, clock face and sheet music: small canvases
    // painted once. Window views are self-lit night scenes (MeshBasic): they
    // are the outdoors, not paper lit by the room.
    for (const p of this.plan.pictures) {
      const texture = paint(p.kind); this.textures.push(texture)
      const material = p.lit ? new THREE.MeshStandardMaterial({ map: texture, roughness: .9 }) : new THREE.MeshBasicMaterial({ map: texture, color: '#d6deeb' })
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(...p.size), material)
      mesh.position.set(...p.position); mesh.quaternion.copy(facingQuat(p.facing)); mesh.name = `surround-picture-${p.kind}`
      mesh.receiveShadow = p.lit; this.root.add(mesh)
    }
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
    for (const [flicker, material] of this.flickerMaterials) material.color.setScalar(reduced ? 1 : flickerAt(flicker, t, 0))
    for (const l of this.lights) l.light.intensity = l.base * (reduced ? 1 : flickerAt(l.flicker, t, l.phase))
    // A 2s-period seconds pendulum, small angle (clocks swing ±4–5°).
    for (const p of this.pendulums) p.rotation.x = reduced ? 0 : Math.sin(t * Math.PI) * .08
  }

  dispose(): void {
    // Room's scene traversal disposes geometry/material; only the canvas
    // textures are owned solely here.
    this.textures.forEach(t => t.dispose()); this.textures = []
  }
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

/** Painted in code: the extension ships no external assets (AGENTS.md). Each
 * canvas is small; these are read from across the room at a few hundred px. */
function paint(kind: PictureKind): THREE.CanvasTexture {
  const canvas = document.createElement('canvas'), g = canvas.getContext('2d')!
  const size = kind === 'snowscape' ? [384, 460] : kind === 'clock' ? [256, 256] : kind === 'sheet-music' ? [256, 128] : [384, 288]
  canvas.width = size[0]; canvas.height = size[1]
  const w = canvas.width, h = canvas.height, rand = (i: number) => { const v = Math.sin(i * 91.7 + kind.length * 13.1) * 43758.5; return v - Math.floor(v) }
  const trees = (baseY: number, count: number, height: number, color: string, seed: number) => {
    g.fillStyle = color
    for (let i = 0; i < count; i++) {
      const x = rand(seed + i) * w, th = height * (.6 + rand(seed + i + 50) * .6)
      g.beginPath(); g.moveTo(x, baseY - th); g.lineTo(x - th * .28, baseY); g.lineTo(x + th * .28, baseY); g.fill()
    }
  }
  if (kind === 'snowscape' || kind === 'village' || kind === 'landscape') {
    const night = kind !== 'landscape'
    const sky = g.createLinearGradient(0, 0, 0, h)
    sky.addColorStop(0, night ? '#15223d' : '#44526a'); sky.addColorStop(.6, night ? '#34496d' : '#9aa4ae'); sky.addColorStop(1, night ? '#5a6d8c' : '#c9c2b0')
    g.fillStyle = sky; g.fillRect(0, 0, w, h)
    if (night) { g.fillStyle = '#e8eef7'; g.beginPath(); g.arc(w * .72, h * .18, w * .06, 0, Math.PI * 2); g.fill() }
    g.fillStyle = night ? '#55627a' : '#7d8794'; g.beginPath(); g.moveTo(0, h * .62)
    for (let x = 0; x <= w; x += w / 8) g.lineTo(x, h * (.5 + rand(x) * .12)); g.lineTo(w, h); g.lineTo(0, h); g.fill()
    trees(h * .74, 14, h * .22, night ? '#16241f' : '#2c3b31', 3)
    g.fillStyle = night ? '#c9d4e4' : '#e4e0d4'; g.fillRect(0, h * .74, w, h * .26)
    trees(h * .9, 6, h * .3, night ? '#0f1a16' : '#243328', 30)
    if (kind !== 'landscape') {
      // A lit cabin (snowscape) or a row of houses (village): warm windows in
      // the cold scene are what make a winter view feel inhabited.
      const houses = kind === 'village' ? 4 : 1
      for (let i = 0; i < houses; i++) {
        const x = w * (kind === 'village' ? .12 + i * .21 : .3), y = h * .72, bw = w * .14, bh = h * .09
        g.fillStyle = '#3a2a22'; g.fillRect(x, y - bh, bw, bh)
        g.fillStyle = '#e8edf5'; g.beginPath(); g.moveTo(x - bw * .12, y - bh); g.lineTo(x + bw / 2, y - bh * 1.8); g.lineTo(x + bw * 1.12, y - bh); g.fill()
        g.fillStyle = '#ffc16a'; g.fillRect(x + bw * .2, y - bh * .7, bw * .22, bh * .35); g.fillRect(x + bw * .6, y - bh * .7, bw * .22, bh * .35)
      }
    }
    g.fillStyle = '#ffffff'
    for (let i = 0; i < (night ? 160 : 40); i++) { const r = .6 + rand(i + 300) * 1.8; g.globalAlpha = .5 + rand(i + 600) * .5; g.fillRect(rand(i + 100) * w, rand(i + 200) * h, r, r) }
    g.globalAlpha = 1
    if (kind === 'snowscape') { g.fillStyle = '#e9eef6'; g.fillRect(0, h - 18, w, 18) } // snow drift on the sill outside
  } else if (kind === 'hound') {
    g.fillStyle = '#2a2018'; g.fillRect(0, 0, w, h)
    const bg = g.createRadialGradient(w / 2, h * .4, 10, w / 2, h / 2, w * .7); bg.addColorStop(0, '#5a4630'); bg.addColorStop(1, '#1e1610')
    g.fillStyle = bg; g.fillRect(0, 0, w, h)
    g.fillStyle = '#8a6440'; g.beginPath(); g.ellipse(w / 2, h * .62, w * .2, h * .3, 0, 0, Math.PI * 2); g.fill()
    g.beginPath(); g.ellipse(w / 2, h * .32, w * .12, h * .15, 0, 0, Math.PI * 2); g.fill()
    g.fillStyle = '#5a3e26'; g.beginPath(); g.ellipse(w * .4, h * .36, w * .05, h * .12, .3, 0, Math.PI * 2); g.ellipse(w * .6, h * .36, w * .05, h * .12, -.3, 0, Math.PI * 2); g.fill()
    g.fillStyle = '#8a1f24'; g.fillRect(w * .38, h * .45, w * .24, h * .04)
  } else if (kind === 'clock') {
    g.fillStyle = '#e8dcc0'; g.beginPath(); g.arc(w / 2, h / 2, w * .48, 0, Math.PI * 2); g.fill()
    g.strokeStyle = '#2a2018'; g.lineWidth = 4; g.stroke()
    g.fillStyle = '#2a2018'
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.fillRect(w / 2 + Math.sin(a) * w * .38 - 4, h / 2 - Math.cos(a) * h * .38 - 4, 8, 8) }
    g.lineWidth = 6; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 + w * .16, h / 2 - h * .12); g.stroke()
    g.lineWidth = 4; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 - w * .05, h / 2 - h * .34); g.stroke()
  } else {
    g.fillStyle = '#ece3cc'; g.fillRect(0, 0, w, h); g.strokeStyle = '#3a3028'; g.lineWidth = 1.5
    for (let staff = 0; staff < 2; staff++) for (let line = 0; line < 5; line++) { const y = 22 + staff * 55 + line * 7; g.beginPath(); g.moveTo(10, y); g.lineTo(w - 10, y); g.stroke() }
    g.fillStyle = '#2a2018'
    for (let i = 0; i < 22; i++) { const staff = i % 2, y = 22 + staff * 55 + Math.floor(rand(i) * 5) * 7 - 3; g.beginPath(); g.ellipse(24 + (i >> 1) * 21, y, 4.5, 3.4, -.4, 0, Math.PI * 2); g.fill() }
  }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4
  return texture
}
