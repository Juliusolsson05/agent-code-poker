import * as THREE from 'three'
import { VoxelSculpt } from '../Voxel'
import type { SurroundPicture, SurroundSculpt } from './Surround'

type Point = [number, number, number]

/** A single sampled mesh carries the chair upholstery, carved clock hood and
 * piano case. Keeping the authoring volumes continuous matters: a pile of
 * independent cuboids has visible seams and cannot form the rolled edges that
 * distinguish padded furniture from storage crates. Exposed-face
 * generation in VoxelSculpt keeps this to one draw despite the fine steps. */
export function buildFurnitureSculpt(shapes: SurroundSculpt[]): THREE.Mesh {
  const voxels = new VoxelSculpt(.025)
  for (const shape of shapes) {
    const [x, y, z] = shape.position, [sx, sy, sz] = shape.size
    const half: Point = [sx / 2, sy / 2, sz / 2]
    const min: Point = [x - half[0], y - half[1], z - half[2]]
    const max: Point = [x + half[0], y + half[1], z + half[2]]
    if (shape.kind === 'ellipsoid') {
      voxels.ellipsoid(shape.position, half, shape.color)
      continue
    }
    const r = Math.min(shape.radius ?? .04, ...half)
    // A rounded-box distance field retains the planes of joinery, yet rounds
    // just its exposed edges. Rounding the entire case into an ellipsoid made
    // the piano and clock look like upholstery; square boxes repeated the old
    // flat silhouette. The radius is authored per component for that reason.
    voxels.volume(min, max, (px, py, pz) => {
      const qx = Math.max(Math.abs(px - x) - half[0] + r, 0)
      const qy = Math.max(Math.abs(py - y) - half[1] + r, 0)
      const qz = Math.max(Math.abs(pz - z) - half[2] + r, 0)
      return qx * qx + qy * qy + qz * qz <= r * r
    }, shape.color)
  }
  // Shape and local practical light carry the furniture. A uniform emissive
  // lift gave the piano and chair an artificial self-illuminated orange face.
  const mesh = voxels.mesh(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .85 }))
  mesh.name = 'surround-sampled-furniture'
  // Only the table key casts a shadow. The surround is outside its useful
  // shadow map; casting from thousands of furniture faces adds a depth pass
  // while producing little visible change at the seated camera.
  mesh.castShadow = false
  return mesh
}

/** Relief grid pitch. Shared by every picture so all framed art is one mesh. */
export const RELIEF_STEP = .025

/** Pictures are shallow voxel dioramas against a solid code-authored backing.
 * The old canvas paint had smooth gradients and flat polygons that looked
 * unrelated to the block-sculpted people. Each relief here is built in a
 * picture-local frame, so the same relief faces any authored wall without
 * runtime textures, external assets, or one draw per little tree.
 *
 * Depth is authored in whole grid LEVELS, never millimetres. The first pass
 * authored layers 5–12mm apart (d = .011/.018/.023/.029/…) on this shared
 * 25mm grid, so every picture collapsed onto one or two voxel planes and the
 * parallax its comments described did not exist (review of PR #11). A finer
 * relief step was rejected: at 12.5mm the relief alone costs ~4× the cells and
 * triangles, undoing the mount-time budget this same review asked for. So
 * level 0, 1 and 2 are exactly one, two and three voxels proud of the backing
 * (25mm apart); what the comments below call "in front" is a real step. */
export function buildPictureRelief(pictures: SurroundPicture[]): THREE.Group {
  const group = new THREE.Group(); group.name = 'surround-voxel-pictures'
  const s = RELIEF_STEP, relief = new VoxelSculpt(s)
  const backing = new THREE.BoxGeometry(1, 1, 1)
  const backings: { matrix: THREE.Matrix4; color: THREE.Color }[] = []
  const dummy = new THREE.Object3D()
  for (const p of pictures) {
    const winter = p.kind === 'snowscape' || p.kind === 'village'
    const sky = winter ? '#273b59' : p.kind === 'landscape' ? '#596a72' : p.kind === 'hound' ? '#3d3026' : '#dbc9a1'
    const [x, y, z] = p.position
    // Grid planes are world-aligned (multiples of s) while pictures sit at
    // authored wall offsets, so find the first whole voxel layer whose back
    // face is at least ~1mm in front of the picture plane (sign = which way
    // "toward the room" runs along the picture's normal axis).
    const axis = p.facing === '-z' ? z : x, sign = p.facing === '+x' ? 1 : -1
    const k = sign > 0 ? Math.ceil((axis + .001 + s / 2) / s - 1e-9) : Math.floor((axis - .001 - s / 2) / s + 1e-9)
    const level0 = sign * (k * s - axis) // centre depth of level 0 relative to the picture plane
    // The backing runs from 4.5mm behind the picture plane up to exactly the
    // back face of level 0. Its front is therefore coplanar only with relief
    // BACK faces, which face the wall and are culled, so sky and relief can
    // never z-fight, and no relief voxel floats with a see-through slot
    // behind it. Instanced backings share one geometry and material.
    const front = level0 - s / 2, back = -.0045
    const world = (u: number, v: number, d: number): Point => p.facing === '+x'
      ? [x + d, y + v * p.size[1] / 2, z + u * p.size[0] / 2]
      : p.facing === '-x' ? [x - d, y + v * p.size[1] / 2, z - u * p.size[0] / 2]
        : [x - u * p.size[0] / 2, y + v * p.size[1] / 2, z - d]
    dummy.position.set(...world(0, 0, (front + back) / 2))
    dummy.rotation.y = p.facing === '+x' ? Math.PI / 2 : p.facing === '-x' ? -Math.PI / 2 : Math.PI
    dummy.scale.set(p.size[0], p.size[1], front - back); dummy.updateMatrix()
    backings.push({ matrix: dummy.matrix.clone(), color: new THREE.Color(sky) })

    // u/v are normalized to [-1,1], d is the distance toward the room.
    // Sampling all motifs into one grid welds touching snowdrifts/trees and
    // leaves only exposed faces, rather than six faces for every tiny cube.
    const local = (px: number, py: number, pz: number) => ({
      u: p.facing === '+x' ? (pz - z) * 2 / p.size[0] : p.facing === '-x' ? (z - pz) * 2 / p.size[0] : (x - px) * 2 / p.size[0],
      v: (py - y) * 2 / p.size[1],
      d: p.facing === '+x' ? px - x : p.facing === '-x' ? x - px : z - pz,
    })
    // A motif on level n fills levels 0..n: carved bas-relief, not a cut-out
    // floating one or two voxels off the backing with a see-through slot
    // behind it at grazing angles. Later layers on the same level overwrite
    // colour (a painted detail); a higher level adds a real voxel step.
    const layer = (level: 0 | 1 | 2, color: string, inside: (u: number, v: number) => boolean, u0 = -1, u1 = 1, v0 = -1, v1 = 1) => {
      const d = level0 + level * s
      const a = world(u0, v0, level0 - s / 2), b = world(u1, v1, d + s / 2)
      const min: Point = [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.min(a[2], b[2])]
      const max: Point = [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.max(a[2], b[2])]
      relief.volume(min, max, (px, py, pz) => { const q = local(px, py, pz); return q.d > level0 - s * .45 && q.d < d + s * .45 && inside(q.u, q.v) }, color)
    }
    if (winter || p.kind === 'landscape') {
      // Three planes: distant hills and treeline on level 0, the nearer
      // trees, snowfield (and cabin wall) on level 1, the cabin roof and warm
      // windows on level 2. Near snow is light enough to read in the warm room.
      layer(0, winter ? '#52647a' : '#788875', (u, v) => v < -.22 + .12 * Math.sin(u * 4.2) + .045 * Math.sin(u * 11))
      layer(0, winter ? '#284038' : '#354b35', (u, v) => v < -.39 + .07 * Math.sin(u * 6.7))
      for (let i = 0; i < 13; i++) {
        const u = -.93 + i * .155, h = .18 + ((i * 7) % 5) * .034, base = -.38 + .05 * Math.sin(u * 6)
        layer(1, i % 3 ? '#18342e' : '#244238', (a, v) => v >= base && v <= base + h && Math.abs(a - u) < .013 + (base + h - v) * .24,
          u - .11, u + .11, base, base + h)
      }
      layer(1, winter ? '#c5d3dc' : '#aab39a', (u, v) => v < -.70 + .07 * Math.sin(u * 5.1) + .028 * Math.cos(u * 13))
      if (winter) {
        layer(1, '#e3e9e6', (u, v) => (u - .55) ** 2 + (v - .55) ** 2 < .035, .30, .80, .30, .80)
        // A cabin and its tiny warm windows anchor the scale and provide a
        // warm destination beyond the cold glass. These are surface colors,
        // not extra lights; the three zone lights remain the only practicals.
        layer(1, '#4b3328', (u, v) => u > -.55 && u < -.2 && v > -.67 && v < -.46, -.6, -.15, -.7, -.4)
        layer(2, '#e3e7e5', (u, v) => u > -.60 && u < -.15 && v > -.48 && v < -.45 - Math.abs(u + .375) * 1.0, -.62, -.13, -.5, -.27)
        for (const u of [-.47, -.28]) layer(2, '#ffc176', (a, v) => Math.abs(a - u) < .035 && v > -.61 && v < -.52, u - .04, u + .04, -.62, -.51)
      }
    } else if (p.kind === 'hound') {
      // A carved hunting-dog silhouette reads from the table without a smooth
      // painted ellipse. Dark relief against ochre backing matches the wood:
      // body on level 0, head, ears and red collar one step proud of it.
      layer(0, '#755639', (u, v) => (u / .56) ** 2 + ((v + .15) / .73) ** 2 < 1)
      layer(1, '#9b7450', (u, v) => (u / .27) ** 2 + ((v - .26) / .31) ** 2 < 1)
      for (const sx of [-1, 1]) layer(1, '#483124', (u, v) => ((u - sx * .29) / .16) ** 2 + ((v - .19) / .32) ** 2 < 1)
      layer(1, '#8c3030', (u, v) => Math.abs(u) < .25 && v > -.04 && v < .035)
    } else if (p.kind === 'clock') {
      // Dial and hour marks share level 0 (marks are painted, as on a real
      // face); both hands stand one real step proud of the dial.
      layer(0, '#eee1bd', (u, v) => u * u + v * v < .85)
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, tx = Math.sin(a) * .68, ty = Math.cos(a) * .68
        // This dial is only 32cm wide; a nominal 5mm mark falls between the
        // 25mm world samples. Broad voxel ticks survive the shared sculpture
        // grid and read like carved hour markers from the seated eye.
        layer(0, '#2a2018', (u, v) => Math.abs(u - tx) < .095 && Math.abs(v - ty) < .095, tx - .10, tx + .10, ty - .10, ty + .10)
      }
      layer(1, '#2a2018', (u, v) => Math.abs(v - u * .55) < .095 && u > -.05 && u < .50, -.1, .55, -.1, .32)
      layer(1, '#2a2018', (u, v) => Math.abs(u + v * .15) < .07 && v > 0 && v < .62, -.13, .05, 0, .65)
    } else {
      // Sheet music: staff lines painted on level 0, note heads one step up.
      // The sheet is 42×20cm, i.e. about 17×8 samples, so the 1.6mm staff
      // lines only colour whichever sample rows they happen to cross; from
      // the table that reads as ruled paper, which is all it needs to be.
      for (const base of [-.45, .25]) for (let i = 0; i < 5; i++) {
        const v = base + i * .075
        layer(0, '#5b4a37', (_u, yv) => Math.abs(yv - v) < .008, -.90, .90, v - .015, v + .015)
      }
      // Heads were first authored 7mm wide at 12 per line and never landed
      // on a 25mm sample, so no note ever rendered (found while checking the
      // relief planes for the same review). Seven heads at least one sample
      // wide, 5cm apart, each become a single raised voxel.
      for (let i = 0; i < 7; i++) { const u = -.72 + i * .24, v = (i % 2 ? -.31 : .39) + (i % 3) * .075
        layer(1, '#382b22', (a, yv) => ((a - u) / .075) ** 2 + ((yv - v) / .15) ** 2 < 1, u - .08, u + .08, v - .16, v + .16)
      }
    }
  }
  // Framed art, sheet music and a clock dial are objects IN the room. Basic
  // materials bypassed the practical lighting and turned their broad pale
  // areas into screens. Only the separate outdoor views author their own
  // night luminance; these surfaces must respond to the nearby warm lamps.
  const plates = new THREE.InstancedMesh(backing, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .95 }), backings.length)
  backings.forEach((b, i) => { plates.setMatrixAt(i, b.matrix); plates.setColorAt(i, b.color) })
  plates.name = 'surround-picture-backings'; plates.computeBoundingSphere(); group.add(plates)
  const mesh = relief.mesh(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95 }))
  mesh.name = 'surround-voxel-relief'; mesh.castShadow = false; mesh.receiveShadow = false; group.add(mesh)
  return group
}
