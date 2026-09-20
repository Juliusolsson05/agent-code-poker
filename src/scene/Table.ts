import * as THREE from 'three'

/** Metres, shared by the visible table and everything resting on it. The old
 * seat multipliers put hero cards at z=.918, inside the rail beginning at .915.
 * Layout is physical: no depth-test overrides that let cards show through wood. */
// A sub-millimetre paper offset separates depth surfaces without making the
// cards visibly levitate. Felt printing sits below this, not above the paper.
export const TABLE = { feltY: .7925, feltX: 1.69, feltZ: .915, exponent: 2.7, cardY: .7931 } as const
export const PLAYER_CARD_Z = .64

export function tableCardPosition(seat: number, index: number, seats: [number, number][]): THREE.Vector3 {
  const [x, z] = seats[seat]
  return new THREE.Vector3(x * .72 + (index - .5) * .112, TABLE.cardY, seat === 0 ? PLAYER_CARD_Z : z * .54)
}

export function dealerPosition(seat: number, seats: [number, number][]): THREE.Vector3 {
  const [x, z] = seats[seat]
  // The button belongs beside the cards, not under the cushion. Its former
  // seat-zero z=1.02 was wholly inside the rail; the HUD also omitted our seat.
  return new THREE.Vector3(seat === 0 ? -.22 : x * .73 - .13, TABLE.feltY + .006, seat === 0 ? .70 : z * .60)
}

function contour(angle: number, x: number, z: number): [number, number] {
  const c = Math.cos(angle), s = Math.sin(angle), power = 2 / TABLE.exponent
  return [Math.sign(c) * Math.abs(c) ** power * x, Math.sign(s) * Math.abs(s) ** power * z]
}

/** One tessellated skin, with material bands rather than intersecting solids.
 * Gold formerly occupied a second box INSIDE each wood box, sharing its side
 * planes. Antialiasing cannot resolve that depth ambiguity. These strips meet
 * only at shared edges; the brass is an inlay, not an overlay or glowing decal.
 * A continuous rail also removes the foreground staircase silhouette without
 * changing the room's finely constructed visual style. */
export function createTableSurface(): THREE.Group {
  const root = new THREE.Group(), segments = 192
  const section = [
    [1.90, 1.125, .755], [1.91, 1.135, .805], [1.895, 1.12, .835],
    [1.87, 1.095, .843], [1.75, .975, .843], [1.738, .963, .843],
    [1.730, .955, .843], [1.712, .937, .832], [TABLE.feltX, TABLE.feltZ, TABLE.feltY],
  ]
  const positions: number[] = [], indices: number[] = []
  for (const [rx, rz, y] of section) for (let i = 0; i <= segments; i++) {
    const [x, z] = contour(i / segments * Math.PI * 2, rx, rz)
    positions.push(x, y, z)
  }
  const geometry = new THREE.BufferGeometry()
  for (let band = 0; band < section.length - 1; band++) {
    const start = indices.length
    for (let i = 0; i < segments; i++) {
      const a = band * (segments + 1) + i, b = a + segments + 1
      indices.push(a, b, a + 1, a + 1, b, b + 1)
    }
    geometry.addGroup(start, indices.length - start, band === 5 ? 2 : band < 2 ? 0 : 1)
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setIndex(indices); geometry.computeVertexNormals()
  const rail = new THREE.Mesh(geometry, [
    new THREE.MeshStandardMaterial({ color: '#33251f', roughness: .72 }),
    new THREE.MeshStandardMaterial({ color: '#242521', roughness: .84 }),
    new THREE.MeshStandardMaterial({ color: '#9b8252', metalness: .45, roughness: .58 }),
  ])
  rail.name = 'table-rail'; rail.castShadow = true; rail.receiveShadow = true; root.add(rail)
  const feltPositions = [0, TABLE.feltY, 0], feltIndices: number[] = []
  for (let i = 0; i <= segments; i++) {
    const [x, z] = contour(i / segments * Math.PI * 2, TABLE.feltX, TABLE.feltZ)
    feltPositions.push(x, TABLE.feltY, z)
    if (i < segments) feltIndices.push(0, i + 2, i + 1)
  }
  const feltGeometry = new THREE.BufferGeometry()
  feltGeometry.setAttribute('position', new THREE.Float32BufferAttribute(feltPositions, 3)); feltGeometry.setIndex(feltIndices); feltGeometry.computeVertexNormals()
  const felt = new THREE.Mesh(feltGeometry, new THREE.MeshStandardMaterial({ color: '#22473e', roughness: 1 }))
  felt.name = 'table-felt'; felt.receiveShadow = true; root.add(felt)
  return root
}
