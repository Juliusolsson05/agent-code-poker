import * as THREE from 'three'
import { VoxelSculpt, anatomyMaterial } from '../Voxel'
import { TREATS, type TreatKind } from './specs'

/** Piece geometry in piece-local metres, origin at the piece centre (the
 * point the pinch closes around). Every piece must fit the pinch envelope
 * sphere (HandGrips.TREAT_PINCH_ENVELOPE); tests/props measures the real mesh.
 * Deliberately stylised: a warm-brown voxel cap (no real species cues) and a
 * plain sugar cube. These are fictional props, not depictions of anything. */
function pieceSculpt(kind: TreatKind): VoxelSculpt {
  if (kind === 'lsd') {
    const s = .0012, half = .0045
    return new VoxelSculpt(s).volume([-half, -half, -half], [half, half, half], () => true, '#efebe2')
      // Sugar grain and one pastel dot: a cube that reads as "not just sugar"
      // at seated distance, without any real-world depiction.
      .paint((x, y, z) => (Math.round(x / s) * 7 + Math.round(y / s) * 3 + Math.round(z / s) * 5) % 9 === 0, '#dcd6ca')
      .paint((x, y, z) => y > half - s && Math.hypot(x, z) < .0021, '#b58ad6')
  }
  return new VoxelSculpt(.0012)
    .volume([-.0028, -.0068, -.0028], [.0028, 0, .0028], (x, _y, z) => Math.hypot(x, z) < .0026, '#e2d6bd')
    .volume([-.0068, -.0012, -.0068], [.0068, .0042, .0068], (x, y, z) => {
      const r = Math.hypot(x, z); return r < .0066 && y < .0042 * Math.sqrt(Math.max(0, 1 - (r / .0066) ** 2)) + .0004
    }, '#8a5a3a')
    .paint((x, y, z) => y > .0022 && (Math.round(x / .0012) + Math.round(z / .0012) * 3) % 7 === 0, '#a87450')
}

/** A tabletop dish of cosmetic treats (#14). The dish is a world-owned table
 * prop like the coaster; pieces are separate meshes only so an eaten one can
 * be hidden. The HELD piece is its own mesh driven by the director's pose,
 * so the dish never re-parents anything into the hand (same ownership rule as
 * the glass). Each instance owns its resources; replacing a dish disposes
 * only its own geometry/materials. */
export class TableTreat {
  readonly root = new THREE.Group()
  readonly held: THREE.Mesh
  readonly pieces: THREE.Mesh[] = []
  constructor(readonly kind: TreatKind) {
    const spec = TREATS[kind]
    this.root.name = `${kind}-treat`
    const rim = spec.dish, porcelain = kind === 'lsd'
    const dish = new VoxelSculpt(.002).volume([-rim, .001, -rim], [rim, porcelain ? .005 : .009, rim], (x, y, z) => {
      const r = Math.hypot(x, z)
      // A saucer is a flat disc with a low lip; the mushroom dish is a small
      // bowl with a real recess, so the caps sit IN it rather than on a puck.
      return porcelain ? r < rim && (y <= .003 || r > rim - .004) : r < rim && (y <= .004 || r > rim - .005)
    }, porcelain ? '#d9d4c8' : '#5b3e2b')
    if (porcelain) dish.paint((x, y, z) => y > .003 && Math.hypot(x, z) > rim - .0025, '#b89a55')
    const dishMesh = dish.mesh(anatomyMaterial(porcelain ? .35 : .8)); dishMesh.name = 'block-treat-dish'
    dishMesh.castShadow = false; this.root.add(dishMesh)
    spec.slots.forEach((slot, i) => {
      const piece = pieceSculpt(kind).mesh(anatomyMaterial(.7))
      piece.name = `block-treat-piece-${i}`; piece.position.set(slot[0], slot[1], slot[2]); piece.castShadow = false
      this.pieces.push(piece); this.root.add(piece)
    })
    this.held = pieceSculpt(kind).mesh(anatomyMaterial(.7)); this.held.name = `${kind}-held-piece`; this.held.visible = false; this.held.castShadow = false
  }
  /** `remaining` counts the pieces still resting in the dish (excluding one in
   * the fingers), straight from the director's pose. Slots fill from 0, and
   * the director always picks the highest remaining slot. */
  show(remaining: number): void { this.pieces.forEach((piece, i) => { piece.visible = i < remaining }) }
  dispose(): void {
    for (const root of [this.root, this.held]) root.traverse(o => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); (o.material as THREE.Material).dispose() } })
    this.root.removeFromParent(); this.held.removeFromParent()
  }
}
