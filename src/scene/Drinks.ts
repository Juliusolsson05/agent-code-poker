import * as THREE from 'three'
import { VoxelSculpt, anatomyMaterial } from './Voxel'
import { DRINKS, drinkAnchors, type DrinkKind } from './props/specs'
export type { DrinkKind } from './props/specs'

/** Sampled hollow solids, not transparent filled cylinders. Only exposed block
 * faces are emitted. Standard alpha glass avoids transmission render targets;
 * a separate restrained rim keeps the vessel legible in the dark room. Each
 * instance owns resources: replacing it cannot dispose another actor's drink.
 * No per-frame geometry allocation or procedural re-sampling. */
export class TableDrink {
  readonly root = new THREE.Group()
  readonly grip: THREE.Vector3
  readonly rim: THREE.Vector3
  constructor(readonly kind: DrinkKind = 'old-fashioned') {
    const spec = DRINKS[kind], anchors = drinkAnchors(kind), step = .002
    this.grip = new THREE.Vector3(...anchors.grip); this.rim = new THREE.Vector3(...anchors.rim)
    this.root.name = `${kind}-drink`
    const radiusAt = (y: number) => spec.radius - .002 * (1 - Math.min(1, y / .030))
    const wall = new VoxelSculpt(step).volume([-spec.radius, step / 2, -spec.radius], [spec.radius, spec.height - .004, spec.radius], (x, y, z) => {
      const radius = radiusAt(y), r = Math.hypot(x, z)
      return r < radius && (y <= .006 || r > radius - .0028)
    }, '#b2c5be')
    const glass = anatomyMaterial(.24); glass.transparent = true; glass.opacity = .23; glass.depthWrite = false
    this.add(wall.mesh(glass), 'block-glass')
    const lip = new VoxelSculpt(step).volume([-spec.radius, spec.height - .002, -spec.radius], [spec.radius, spec.height, spec.radius], (x, _y, z) => {
      const r = Math.hypot(x, z); return r < spec.radius && r > spec.radius - .0025
    }, '#c3c8b9')
    const rimMaterial = anatomyMaterial(.32); rimMaterial.transparent = true; rimMaterial.opacity = .65; rimMaterial.depthWrite = false
    this.add(lip.mesh(rimMaterial), 'block-rim')
    const liquid = new VoxelSculpt(step).volume([-spec.radius, .008, -spec.radius], [spec.radius, spec.fill, spec.radius], (x, y, z) => Math.hypot(x, z) < radiusAt(y) - .0045, spec.color)
    const liquidMaterial = anatomyMaterial(.26)
    // Opaque amber/wine avoids nested alpha sorting through the hand. Water
    // alone is translucent; the ice rises visibly above the fill surface.
    if (kind === 'water') { liquidMaterial.transparent = true; liquidMaterial.opacity = .35; liquidMaterial.depthWrite = false }
    this.add(liquid.mesh(liquidMaterial), 'block-liquid')
    if (kind === 'old-fashioned' || kind === 'water') {
      const ice = new VoxelSculpt(step).volume([-.018, -.019, -.018], [.018, .019, .018], (x, y, z) =>
        Math.max(0, Math.abs(x) - .014) ** 2 + Math.max(0, Math.abs(y) - .015) ** 2 + Math.max(0, Math.abs(z) - .014) ** 2 < .004 ** 2, '#c4d5cc')
      const mesh = ice.mesh(anatomyMaterial(.29)); mesh.position.set(.002, spec.fill + .005, -.002); mesh.rotation.y = .24
      this.add(mesh, 'block-ice')
    }
    if (kind === 'old-fashioned') {
      const peel = new VoxelSculpt(.0015).volume([-.024, -.005, -.024], [.024, .005, .024], (x, _y, z) => {
        const a = Math.atan2(z, x), r = Math.hypot(x, z)
        return a > -.6 && a < 2.1 && r > .019 && r < .023
      }, '#d37a27').paint((x, _y, z) => Math.hypot(x, z) < .0205, '#d7b46c')
      const mesh = peel.mesh(anatomyMaterial(.8)); mesh.position.set(-.006, .065, .004); mesh.rotation.set(.3, .2, .35)
      this.add(mesh, 'block-orange-peel')
    }
    if (kind === 'beer') {
      const foam = new VoxelSculpt(step).volume([-.033, spec.fill + .001, -.033], [.033, spec.fill + .009, .033], (x, y, z) =>
        Math.hypot(x, z) < .031 && y < spec.fill + .007 + .0015 * Math.cos(x * 160) * Math.cos(z * 150), '#d9ccb0')
      this.add(foam.mesh(anatomyMaterial(1)), 'block-foam')
    }
  }
  private add(mesh: THREE.Mesh, name: string): void {
    mesh.name = name; mesh.castShadow = false; mesh.receiveShadow = true; this.root.add(mesh)
  }
  dispose(): void {
    this.root.traverse(o => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); (o.material as THREE.Material).dispose() } })
    this.root.removeFromParent()
  }
}

export function coaster(): THREE.Mesh {
  const mesh = new VoxelSculpt(.003).volume([-.051, -.0015, -.051], [.051, .0015, .051], (x, _y, z) =>
    Math.hypot(x, z) < .051, '#4c3527').mesh(anatomyMaterial(.95))
  mesh.name = 'block-leather-coaster'; mesh.castShadow = false; return mesh
}
