import { Box3, BoxGeometry, BufferAttribute, Color, DynamicDrawUsage, Group, InstancedMesh, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, PointLight, Vector3 } from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { FIREPLACE_LAYOUT } from './layout'

/** Self-contained authored hearth. Local +Z is the open front, facing the
 * player from the back wall between the future dealer and right-center guest. Keeping it in this frame makes
 * its recorded-room clearance test cover logs, mantel and chimney, not just a
 * convenient proxy rectangle. Positive wall clearance avoids coplanar masonry shimmer.
 * No hand, game state, timers, audio or DOM belongs in this geometry owner. */
/** The hearth is the room's main living light (#8). At 1.7cd over 3.2m it
 * never reached a chair (under 1 lux at the right-hand seats 3.5–4m away), so
 * the fire read as a picture of a fire. At 8cd over 7m it puts a warm moving
 * rim on the right-side players and the rail. Intensity combines a slow
 * "breath" (logs settling, ~7s) with two faster flutters. Amplitude stays
 * under ±20% and far below 3Hz: warm movement, not strobing. */
export const FIRE_LIGHT = { base: 8, range: 7, swing: 1.5 } as const

export class Fireplace {
  readonly root = new Group()
  readonly flames: InstancedMesh
  readonly light = new PointLight('#ff9f52', FIRE_LIGHT.base, FIRE_LIGHT.range, 2)
  readonly solidBounds: Box3[] = []
  private dummy = new Object3D()
  private lastTick = -1

  constructor() {
    this.root.name = 'tavern-fireplace'
    this.root.position.set(...FIREPLACE_LAYOUT.position); this.root.scale.x = FIREPLACE_LAYOUT.widthScale
    const parts: BoxGeometry[] = []
    const block = (color: string, x: number, y: number, z: number, sx: number, sy: number, sz: number, turn = 0) => {
      const geometry = new BoxGeometry(sx, sy, sz)
      geometry.rotateY(turn); geometry.translate(x, y, z)
      const tint = new Color(color), colors = new Float32Array(geometry.getAttribute('position').count * 3)
      for (let i = 0; i < colors.length; i += 3) tint.toArray(colors, i)
      geometry.setAttribute('color', new BufferAttribute(colors, 3)); parts.push(geometry)
    }
    block('#51473c', 0, .05, 0, 1.30, .12, .54) // bottom=-.01, actual floor top
    block('#191512', 0, .55, -.22, 1.04, .9, .10)
    // Staggered lintel/jamb blocks read as hand-laid stone without hundreds of
    // separate meshes. Gaps are mortar depth, not nearly coincident overlays.
    const stone = ['#383b38', '#45463e', '#41433e', '#333934']
    for (let row = 0; row < 6; row++) for (const side of [-1, 1]) {
      block(stone[(row + (side > 0 ? 1 : 0)) % 4], side * .50, .18 + row * .135, -.01, .22, .127, .46)
    }
    for (let i = 0; i < 5; i++) block(stone[i % 4], (i - 2) * .236, 1.015, -.01, .229, .19, .46)
    block('#38261c', 0, 1.155, 0, 1.30, .12, .54)
    block('#59402b', 0, 1.217, .02, 1.32, .035, .55)
    for (const side of [-1, 1]) block('#30241b', side * .48, 1.05, .12, .075, .17, .18)
    for (let row = 0; row < 14; row++) for (let col = 0; col < 3; col++) {
      block(stone[(row * 7 + col * 3) % 4], (col - 1) * .23, 1.30 + row * .135, -.14, .222, .127, .24)
    }
    // Decoration is fitted to the mantel, not pasted across the old shelf.
    // Tiny block sprigs and ribbon share the masonry batch; bright bead colors
    // read as steady festive bulbs without a point light per ornament.
    for (let i = 0; i < 35; i++) {
      const x = -.61 + i * .036, y = 1.22 - .045 * Math.sin(i / 34 * Math.PI)
      block(i % 3 ? '#193c2b' : '#28503a', x, y, .265, .052, .06, .075, Math.sin(i * 2.7) * .45)
      if (i % 4 === 0) block('#e7bb62', x, y - .012, .31, .013, .016, .012)
      if (i % 7 === 0) block('#932e32', x, y - .035, .304, .025, .03, .023)
    }
    for (const [x, color] of [[-.46, '#932d35'], [.46, '#315945']] as const) {
      block(color, x, .98, .302, .082, .27, .034)
      block(color, x + .035, .855, .305, .13, .073, .04)
      block('#ddcfb0', x, 1.115, .309, .099, .047, .04)
      block('#d1af69', x, .99, .323, .019, .022, .006)
    }
    block('#181717', 0, .15, .04, .72, .065, .28)
    for (let i = 0; i < 4; i++) {
      block(i % 2 ? '#34251b' : '#423024', 0, .22 + (i % 2) * .07, -.08 + i * .066, .64, .105, .08, (i % 2 ? 1 : -1) * .12)
    }
    for (let i = 0; i < 7; i++) block('#22201d', (i - 3) * .10, .21, .20, .018, .21, .025)
    block('#29241e', 0, .31, .20, .72, .023, .025)
    const geometry = mergeGeometries(parts)!
    this.root.updateMatrixWorld(true)
    // Whole-asset AABBs falsely put the wide projecting mantel at chimney
    // height. Retain bounds of the actual authored blocks before merging so
    // mounted garland can be checked against the narrower recessed chimney.
    for (const part of parts) {
      part.computeBoundingBox(); this.solidBounds.push(part.boundingBox!.clone().applyMatrix4(this.root.matrixWorld))
    }
    parts.forEach(g => g.dispose())
    const masonry = new Mesh(geometry, new MeshStandardMaterial({ vertexColors: true, roughness: .94 }))
    masonry.name = 'fireplace-masonry-and-logs'; masonry.receiveShadow = true; this.root.add(masonry)

    // Opaque, depth-tested little blocks keep the authored voxel style and
    // avoid alpha overdraw/sorting through the walls. Hot core is local to the
    // opening, not bloom on playing cards. One instanced batch, fixed capacity.
    this.flames = new InstancedMesh(new BoxGeometry(), new MeshBasicMaterial({ toneMapped: false }), 128)
    this.flames.name = 'fireplace-block-flames'
    this.flames.instanceMatrix.setUsage(DynamicDrawUsage)
    const tint = new Color()
    for (let i = 0; i < 128; i++) {
      const core = Math.floor(i / 6) % 2 === 1, tip = i % 6 > 3
      const color = i >= 124 ? '#ffcd70' : i >= 108 ? (i % 3 ? '#ad3610' : '#ee761c')
        : core ? (tip ? '#ffc466' : '#ffe3a0') : (tip ? '#d84e14' : '#ed882b')
      this.flames.setColorAt(i, tint.set(color).multiplyScalar(core && i < 108 ? 1.5 : 1.05))
    }
    this.root.add(this.flames)
    this.light.name = 'fireplace-bounce'; this.light.position.set(0, .62, .58)
    // Keep the aggregate light outside masonry to avoid inverse-square hot
    // spots. It adds one bounded light, never an additional shadow render.
    this.root.add(this.light); this.frame(0, false)
    this.flames.computeBoundingBox(); this.flames.computeBoundingSphere()
    // Frustum bounds must cover every later amplitude, not only t=0. A small
    // conservative local expansion avoids recomputing bounds every frame.
    this.flames.boundingBox!.setFromCenterAndSize(new Vector3(0, .55, .015), new Vector3(.90, .75, .34))
    this.flames.boundingBox!.getBoundingSphere(this.flames.boundingSphere!)
  }

  frame(time: number, reduced: boolean): void {
    if (!Number.isFinite(time)) return
    // Connected tapered tongues replace equal-height candle columns. Each has
    // its own height/lean phase; brighter short cores sit forward of the amber
    // envelope. Fixed 128 block instances, no sprites/alpha sorting or spawning.
    // The room's visual clock makes pause exact; reduced motion is one tableau.
    const tick = reduced ? 0 : Math.floor(Math.max(0, time) * 30) + 1
    if (tick === this.lastTick) return
    this.lastTick = tick
    const t = reduced ? 0 : (tick - 1) / 30
    for (let i = 0; i < 128; i++) {
      if (i < 108) {
        const tongue = Math.floor(i / 12), core = Math.floor(i / 6) % 2, tier = i % 6
        const phase = tongue * 2.39, fraction = (tier + .5) / 6
        const wave = Math.sin(t * (2.8 + tongue * .17) + phase)
        const height = (.32 + .09 * Math.sin(phase * 1.7) + .09 * wave) * (core ? .66 : 1)
        const lean = Math.sin(t * 2.3 + phase + fraction * 1.4) * .048 * fraction * fraction
        this.dummy.position.set((tongue - 4) * .073 + lean, .29 + fraction * height, (tongue % 2 ? -.035 : .02) + core * .061)
        this.dummy.scale.set((.095 - fraction * .077) * (core ? .6 : 1), height / 6 * 1.2, core ? .025 : .075)
      } else if (i < 124) {
        const ember = i - 108
        this.dummy.position.set((ember % 8 - 3.5) * .082, .19 + ember % 3 * .012, -.10 + Math.floor(ember / 8) * .14)
        this.dummy.scale.set(.068, .022, .052)
      } else {
        const spark = i - 124, age = (t * .39 + spark * .271) % 1
        this.dummy.position.set(Math.sin(spark * 2.9 + age * 2) * .23, .31 + age * .52, -.04)
        this.dummy.scale.setScalar(.008 * (1 - age * .65))
      }
      this.dummy.updateMatrix(); this.flames.setMatrixAt(i, this.dummy.matrix)
    }
    this.flames.instanceMatrix.needsUpdate = true
    this.light.intensity = reduced ? FIRE_LIGHT.base : FIRE_LIGHT.base + .7 * Math.sin(t * .9) + .5 * Math.sin(t * 2.7 + 1.3) + .3 * Math.sin(t * 6.1 + .4)
  }
  // Room's shared scene traversal disposes these meshes/materials/instances.
  // This owner deliberately installs no listeners or independently owned GPU
  // targets; a second dispose path would obscure resource responsibility.
}
