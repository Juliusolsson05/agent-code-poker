import * as THREE from 'three'

type P = [number, number, number]
type Cell = { x: number; y: number; z: number; color: string }

/** Voxelization is a construction technique, not a character proportion system.
 * Work in metres and sculpt overlapping anatomical volumes before extracting
 * their surface. Internal cubes never reach the GPU. Heads use 4.5mm samples;
 * cloth uses 12mm samples, where the contour tolerates a coarser silhouette.
 * One instanced mesh per articulated part keeps this viable inside an iframe. */
export class Sculpture {
  private cells = new Map<number, Cell>()
  constructor(private step: number) {}
  ellipsoid(center: P, radii: P, color: string, keep?: (x: number, y: number, z: number) => boolean): void {
    const [cx, cy, cz] = center; const [rx, ry, rz] = radii; const s = this.step
    for (let ix = Math.floor((cx - rx) / s); ix <= Math.ceil((cx + rx) / s); ix++)
      for (let iy = Math.floor((cy - ry) / s); iy <= Math.ceil((cy + ry) / s); iy++)
        for (let iz = Math.floor((cz - rz) / s); iz <= Math.ceil((cz + rz) / s); iz++) {
          const x = ix * s; const y = iy * s; const z = iz * s
          if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2 > 1 || keep && !keep(x, y, z)) continue
          this.cells.set((ix + 512) * 1048576 + (iy + 512) * 1024 + iz + 512, { x, y, z, color })
        }
  }
  limb(a: P, b: P, radius: P, color: string): void {
    const length = new THREE.Vector3(...a).distanceTo(new THREE.Vector3(...b))
    const steps = Math.max(2, Math.ceil(length / (Math.min(...radius) * .7)))
    for (let i = 0; i <= steps; i++) this.ellipsoid(a.map((n, k) => n + (b[k] - n) * i / steps) as P, radius, color)
  }
  mesh(geometry: THREE.BoxGeometry, material: THREE.MeshStandardMaterial): THREE.InstancedMesh {
    const shell = [...this.cells].filter(([k]) => [1, -1, 1024, -1024, 1048576, -1048576].some(n => !this.cells.has(k + n)))
    const surface = new Float32Array(shell.length * 3)
    const localGeometry = geometry.clone()
    localGeometry.setAttribute('surfaceNormal', new THREE.InstancedBufferAttribute(surface, 3))
    const mesh = new THREE.InstancedMesh(localGeometry, material, shell.length)
    const matrix = new THREE.Matrix4(); const color = new THREE.Color()
    shell.forEach(([key, cell], i) => {
      // Adjacent cubes must meet, never overlap. Inflating them creates coplanar
      // top faces and severe grazing-angle z-fighting across skin and clothing.
      matrix.makeScale(this.step, this.step, this.step)
      matrix.setPosition(cell.x, cell.y, cell.z); mesh.setMatrixAt(i, matrix)
      // Low-amplitude deterministic albedo variation suggests fabric/skin grain
      // without turning a finely sampled face into a noisy checkerboard.
      const grain = Math.sin(cell.x * 892 + cell.y * 331 + cell.z * 731) * .023
      color.set(cell.color).multiplyScalar(1 + grain); mesh.setColorAt(i, color)
      // Lighting follows the sculpted surface envelope, not six discontinuous
      // normals on every 4mm sample. Otherwise subpixel cube faces shimmer like
      // sequins, particularly on cheeks. Geometry/silhouettes remain voxelized;
      // a small neighborhood estimates a smooth anatomical outward normal.
      const normal = new THREE.Vector3()
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
        if (!dx && !dy && !dz) continue
        for (let distance = 1; distance <= 3; distance++) {
          if (!this.cells.has(key + (dx * 1048576 + dy * 1024 + dz) * distance))
            normal.addScaledVector(new THREE.Vector3(dx, dy, dz), 1 / (distance * (dx * dx + dy * dy + dz * dz)))
        }
      }
      normal.normalize(); surface.set([normal.x, normal.y, normal.z], i * 3)
    })
    mesh.castShadow = true; mesh.receiveShadow = false
    mesh.computeBoundingSphere(); this.cells.clear(); return mesh
  }
}

export function humanMaterial(): THREE.MeshStandardMaterial {
  const material = new THREE.MeshStandardMaterial({ roughness: .88 })
  material.onBeforeCompile = shader => {
    shader.vertexShader = `attribute vec3 surfaceNormal;\n${shader.vertexShader}`.replace('#include <beginnormal_vertex>',
      '#include <beginnormal_vertex>\nobjectNormal = normalize(mix(objectNormal, surfaceNormal, 0.94));')
  }
  material.customProgramCacheKey = () => 'poker-sculpture-envelope-v1'
  return material
}

const PEOPLE = [
  { skin: '#bb8565', shadow: '#916047', hair: '#281b16', jacket: '#202824', shirt: '#b7b2a2' },
  { skin: '#c69a7c', shadow: '#986a54', hair: '#30231e', jacket: '#342924', shirt: '#837965' },
  { skin: '#bea189', shadow: '#947764', hair: '#59544b', jacket: '#242b2b', shirt: '#bbb3a4' },
  { skin: '#b58b72', shadow: '#8d6150', hair: '#201b1c', jacket: '#342730', shirt: '#2a2928' },
  { skin: '#805845', shadow: '#5d3b2f', hair: '#171515', jacket: '#242a31', shirt: '#b7ae9c' },
  { skin: '#c9a183', shadow: '#9b7760', hair: '#a79a82', jacket: '#343c34', shirt: '#a49b84' },
]

export type Human = { root: THREE.Group; head: THREE.Group; leftArm: THREE.Group; rightArm: THREE.Group; cards: THREE.Group; eyes: THREE.Group; seat: number }

export function buildHuman(seat: number, geometry: THREE.BoxGeometry, material: THREE.MeshStandardMaterial): Human {
  const p = PEOPLE[seat]; const root = new THREE.Group(); const head = new THREE.Group(); const eyes = new THREE.Group()
  const leftArm = new THREE.Group(), rightArm = new THREE.Group(), cards = new THREE.Group()
  const female = seat === 3
  const body = new Sculpture(.009)
  body.ellipsoid([0, .99, -.02], [female ? .19 : .225, .31, .115], p.jacket)
  body.ellipsoid([0, 1.13, .035], [.135, .185, .099], p.shirt)
  // Jacket fronts overlap the shirt, but leave a narrowing opening. Cloth folds
  // follow shoulder and elbow anatomy, rather than arbitrary decorative cubes.
  for (const side of [-1, 1]) {
    body.ellipsoid([side * .105, 1.04, .065], [.092, .27, .085], p.jacket)
    body.limb([side * .052, 1.24, .115], [side * .105, 1.02, .133], [.03, .035, .019], seat === 1 ? '#574236' : '#41423e')
    body.ellipsoid([side * .215, 1.19, -.01], [.078, .092, .10], p.jacket)
    body.limb([side * .23, 1.15, .015], [side * .27, .89, .17], [.063, .070, .067], p.jacket)
    body.ellipsoid([side * .105, .61, .13], [.10, .12, .28], '#1c1d1c')
    body.limb([side * .12, .58, .35], [side * .12, .15, .37], [.077, .085, .085], '#20211f')
    body.ellipsoid([side * .12, .085, .42], [.08, .064, .16], '#121414')
  }
  body.ellipsoid([0, 1.285, -.006], [.054, .096, .056], p.skin)
  // Visible shirt collar and jacket buttons remain small enough to read as
  // tailoring. Their scale is anchored to a 24cm head, not an oversized mascot.
  for (const side of [-1, 1]) body.limb([side * .045, 1.28, .04], [side * .065, 1.20, .11], [.026, .025, .015], p.shirt)
  for (let i = 0; i < 3; i++) body.ellipsoid([.023, 1.035 - i * .085, .15], [.010, .010, .007], '#a59676')
  root.add(body.mesh(geometry, material))

  for (const side of [-1, 1]) {
    const hands = new Sculpture(.0045)
    if (side === -1) {
      // The guarding hand is genuinely posed around a fan of cards. Keeping the
      // elbow fixed while rotating this forearm lets each player privately peek
      // without turning their hole-card faces towards the viewer.
      hands.limb([-.27, .89, .16], [-.15, .945, .29], [.054, .039, .053], p.jacket)
      hands.ellipsoid([-.145, .954, .30], [.039, .027, .036], p.shirt)
      hands.ellipsoid([-.14, .972, .337], [.035, .037, .023], p.skin)
      for (let finger = 0; finger < 4; finger++) {
        const x = -.162 + finger * .014
        hands.limb([x, .977, .350], [x, 1.006 - Math.abs(finger - 1) * .004, .360], [.0068, .011, .009], p.skin)
        hands.ellipsoid([x, 1.012 - Math.abs(finger - 1) * .004, .352], [.0067, .009, .011], p.skin)
      }
      hands.limb([-.112, .973, .349], [-.102, 1.001, .360], [.010, .015, .009], p.skin)
    } else {
    hands.limb([side * .27, .89, .16], [side * .18, .842, .39], [.057, .042, .058], p.jacket)
    hands.ellipsoid([side * .178, .842, .40], [.043, .026, .041], p.shirt)
    hands.ellipsoid([side * .17, .837, .46], [.040, .020, .065], p.skin)
    for (let finger = 0; finger < 4; finger++) {
      const x = side * .17 + (finger - 1.5) * .017
      const z = .515 + (.025 - Math.abs(finger - 1.4) * .012)
      hands.limb([x, .833, .49], [x + side * .012, .828, z + .033], [.008, .009, .018], p.skin)
      hands.ellipsoid([x + side * .012, .837, z + .021], [.005, .0025, .009], '#c1a38d')
    }
    hands.limb([side * .137, .837, .44], [side * .110, .827, .475], [.014, .012, .021], p.skin)
    // A cuff watch adds a strong close-range material cue without needing an
    // imported model; the square crystal is intentionally not luminous.
    if (side === -1 && seat !== 3) hands.ellipsoid([side * .19, .870, .386], [.029, .007, .027], '#a48c60')
    }
    const arm = side === -1 ? leftArm : rightArm
    // Translate the vertices into elbow-local space. Moving the group then
    // rotates an anatomical joint instead of sliding a detached hand around.
    const mesh = hands.mesh(geometry, material)
    mesh.position.set(-side * .27, -.89, -.16)
    arm.position.set(side * .27, .89, .16); arm.add(mesh); root.add(arm)
  }
  cards.position.set(.13, .157, .186); cards.rotation.set(.20, 0, -.10)
  leftArm.add(cards)

  const face = new Sculpture(.0045)
  face.ellipsoid([0, .02, -.008], [female ? .080 : .087, .111, .085], p.skin)
  face.ellipsoid([0, -.050, .014], [.069, .077, .071], p.skin)
  face.ellipsoid([0, -.097, .037], [.042, .026, .038], p.skin)
  for (const side of [-1, 1]) {
    face.ellipsoid([side * .079, -.008, -.008], [.016, .035, .021], p.shadow)
    face.ellipsoid([side * .085, -.006, -.003], [.013, .028, .016], p.skin)
    face.ellipsoid([side * .050, -.020, .060], [.031, .032, .028], p.skin)
    face.ellipsoid([side * .034, .026, .073], [.028, .021, .012], p.shadow)
    face.ellipsoid([side * .034, .034, .076], [.029, .010, .018], p.skin)
    face.ellipsoid([side * .035, .042, .084], [.024, .005, .005], p.hair)
    face.ellipsoid([side * .035, .006, .077], [.023, .007, .012], p.skin)
  }
  face.ellipsoid([0, .005, .079], [.013, .039, .024], p.skin)
  face.ellipsoid([0, -.020, .099], [.019, .015, .023], p.skin)
  for (const side of [-1, 1]) {
    face.ellipsoid([side * .017, -.024, .089], [.013, .012, .016], p.skin)
    face.ellipsoid([side * .012, -.032, .101], [.005, .0035, .004], p.shadow)
  }
  face.ellipsoid([0, -.061, .080], [.029, .007, .008], female ? '#8c4e48' : '#8f5b4d')
  face.ellipsoid([0, -.053, .080], [.028, .005, .007], '#775044')
  face.ellipsoid([0, -.057, .087], [.022, .0018, .003], '#47332c')
  // Hair is a sampled scalp volume. Hairline, part, sideburns and individual
  // locks determine its silhouette; no single box stands in for the hairstyle.
  face.ellipsoid([0, .045, -.025], [.091, .099, .083], p.hair,
    (x, y, z) => z < -.027 || y > .079 + Math.sin(x * 28 + seat) * .009 || Math.abs(x) > .075 && y > .013)
  for (let i = 0; i < 24; i++) {
    const a = i * 2.4
    face.ellipsoid([Math.cos(a) * .065, .103 + Math.sin(i * .82) * .008, -.025 + Math.sin(a) * .05], [.026, .023, .030], i % 5 === 0 && seat === 5 ? '#c1b49a' : p.hair)
  }
  if (female) for (const side of [-1, 1]) {
    face.ellipsoid([side * .079, -.041, -.04], [.030, .128, .062], p.hair)
    face.ellipsoid([side * .085, -.032, .009], [.004, .009, .004], '#cbb280')
  }
  if (seat === 1 || seat === 4) face.ellipsoid([0, -.082, .024], [.060, .045, .064], p.hair,
    (x, y, z) => z > .048 && y < -.071 || Math.abs(x) > .054 && y < -.029)
  head.add(face.mesh(geometry, material))
  const eye = new Sculpture(.0022)
  for (const side of [-1, 1]) {
    eye.ellipsoid([side * .034, .019, .082], [.0175, .007, .009], '#afa99c')
    eye.ellipsoid([side * .034, .019, .089], [.0065, .0065, .0035], seat === 2 ? '#506667' : '#554333')
    eye.ellipsoid([side * .034, .019, .092], [.0032, .0040, .002], '#0d1010')
    eye.ellipsoid([side * .033, .022, .094], [.0015, .0015, .001], '#e7d7bf')
  }
  eyes.add(eye.mesh(geometry, material)); head.add(eyes)
  if (seat === 2 || seat === 5) {
    const glasses = new Sculpture(.003)
    for (const side of [-1, 1]) {
      glasses.ellipsoid([side * .035, .020, .094], [.027, .020, .003], '#56514a',
        (x, y) => ((x - side * .035) / .022) ** 2 + ((y - .020) / .015) ** 2 > 1)
      glasses.limb([side * .060, .024, .09], [side * .085, .026, -.005], [.0025, .003, .003], '#56514a')
    }
    glasses.limb([-.01, .025, .097], [.01, .025, .097], [.003, .002, .003], '#72634c')
    head.add(glasses.mesh(geometry, material))
  }
  // Small anatomical differences matter more than swapping shirt colors. The
  // broad/lean shoulders and longer/rounder faces break the clone-like lineup.
  head.scale.set(female ? .91 : seat === 1 ? 1.06 : seat === 2 ? .94 : 1, seat === 5 ? 1.08 : seat === 4 ? .97 : 1, 1)
  head.position.set(0, 1.41, .004); root.add(head)
  root.scale.set(seat === 1 ? 1.05 : female ? .96 : 1, seat === 2 ? .97 : seat === 4 ? 1.035 : 1, 1)
  return { root, head, leftArm, rightArm, cards, eyes, seat }
}
