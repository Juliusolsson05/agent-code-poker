import { Box3, BoxGeometry, BufferAttribute, Color, DynamicDrawUsage, Group, InstancedMesh, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, PointLight } from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { FIREPLACE_LAYOUT } from './layout'

/** Self-contained authored hearth. Local +Z is the open front, facing the
 * player from the back wall between the future dealer and right-center guest. Keeping it in this frame makes
 * its recorded-room clearance test cover logs, mantel and chimney, not just a
 * convenient proxy rectangle. Positive wall clearance avoids coplanar masonry shimmer.
 * No hand, game state, timers, audio or DOM belongs in this geometry owner. */
export class Fireplace {
  readonly root = new Group()
  readonly flames: InstancedMesh
  readonly light = new PointLight('#ffac62', 3, 3.2, 2)
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
    const stone = ['#66594a', '#5b5145', '#716251', '#615447']
    for (let row = 0; row < 6; row++) for (const side of [-1, 1]) {
      block(stone[(row + (side > 0 ? 1 : 0)) % 4], side * .50, .18 + row * .135, -.01, .22, .127, .46)
    }
    for (let i = 0; i < 5; i++) block(stone[i % 4], (i - 2) * .236, 1.015, -.01, .229, .19, .46)
    block('#33271e', 0, 1.155, 0, 1.30, .09, .54)
    for (let row = 0; row < 14; row++) for (let col = 0; col < 3; col++) {
      block(stone[(row * 3 + col) % 4], (col - 1) * .25, 1.27 + row * .14, -.14, .242, .132, .24)
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
    this.flames = new InstancedMesh(new BoxGeometry(), new MeshBasicMaterial({ toneMapped: false }), 18)
    this.flames.name = 'fireplace-block-flames'
    this.flames.instanceMatrix.setUsage(DynamicDrawUsage)
    const tint = new Color()
    for (let i = 0; i < 18; i++) this.flames.setColorAt(i, tint.set(['#db531b', '#ec8029', '#ffc86e'][i % 3]).multiplyScalar(1.4))
    this.root.add(this.flames)
    this.light.name = 'fireplace-bounce'; this.light.position.set(0, .62, .58)
    // Keep the aggregate light outside masonry to avoid inverse-square hot
    // spots. It adds one bounded light, never an additional shadow render.
    this.root.add(this.light); this.frame(0, false)
    this.flames.computeBoundingBox(); this.flames.computeBoundingSphere()
    // Frustum bounds must cover every later amplitude, not only t=0. A small
    // conservative local expansion avoids recomputing bounds every frame.
    this.flames.boundingBox!.expandByScalar(.08)
    this.flames.boundingBox!.getBoundingSphere(this.flames.boundingSphere!)
  }

  frame(time: number, reduced: boolean): void {
    if (!Number.isFinite(time)) return
    // The room supplies its pause-aware visual clock. 20Hz uploads are enough
    // for slow fire breathing; no per-frame object/buffer/texture allocations.
    const tick = reduced ? 0 : Math.floor(Math.max(0, time) * 20) + 1
    if (tick === this.lastTick) return
    this.lastTick = tick
    const t = reduced ? 0 : (tick - 1) / 20
    for (let i = 0; i < 18; i++) {
      const tier = i % 3, column = Math.floor(i / 3), wave = reduced ? 0 : Math.sin(t * 3.1 + column * 1.9 + tier)
      const height = (.19 - tier * .045) * (1 + wave * .10)
      this.dummy.position.set((column - 2.5) * .092 + Math.sin(column * 3) * .017, .30 + tier * .115 + height / 2, -.005 - tier * .026)
      this.dummy.scale.set(.085 - tier * .020, height, .075 - tier * .015)
      this.dummy.updateMatrix(); this.flames.setMatrixAt(i, this.dummy.matrix)
    }
    this.flames.instanceMatrix.needsUpdate = true
    this.light.intensity = reduced ? 3 : 3 + .18 * Math.sin(t * 2.1) + .10 * Math.sin(t * 3.7)
  }
  // Room's shared scene traversal disposes these meshes/materials/instances.
  // This owner deliberately installs no listeners or independently owned GPU
  // targets; a second dispose path would obscure resource responsibility.
}
