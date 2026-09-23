import * as THREE from 'three'

type Point = [number, number, number]
type Cell = { x: number; y: number; z: number; color: THREE.Color }

/** Author anatomy in continuous space, then sample it. Small blocks must never
 * become the proportion system. Only exposed faces are emitted: six complete
 * cubes per surface sample wasted most triangles inside the old sculptures.
 * Coordinates are deliberately local to each bone, so articulation does not
 * resample anatomy or allocate meshes every frame. */
export class VoxelSculpt {
  private cells = new Map<number, Cell>()
  constructor(readonly step: number) {}
  private key(x: number, y: number, z: number): number { return (x + 1024) * 4194304 + (y + 1024) * 2048 + z + 1024 }
  volume(min: Point, max: Point, inside: (x: number, y: number, z: number) => boolean, color: string): this {
    const tint = new THREE.Color(color), s = this.step
    for (let x = Math.ceil(min[0] / s); x <= Math.floor(max[0] / s); x++)
      for (let y = Math.ceil(min[1] / s); y <= Math.floor(max[1] / s); y++)
        for (let z = Math.ceil(min[2] / s); z <= Math.floor(max[2] / s); z++)
          if (inside(x * s, y * s, z * s)) this.cells.set(this.key(x, y, z), { x, y, z, color: tint })
    return this
  }
  ellipsoid(center: Point, radii: Point, color: string): this {
    return this.volume(center.map((v, i) => v - radii[i]) as Point, center.map((v, i) => v + radii[i]) as Point,
      (x, y, z) => ((x - center[0]) / radii[0]) ** 2 + ((y - center[1]) / radii[1]) ** 2 + ((z - center[2]) / radii[2]) ** 2 <= 1, color)
  }
  /** Short hair/stubble changes an existing skin surface, not its silhouette.
   * volume() here would add floating blocks outside the jaw (the old beard
   * made a rectangular U-shaped plate). Painting cannot invent occupied cells. */
  paint(inside: (x: number, y: number, z: number) => boolean, color: string): this {
    const tint = new THREE.Color(color), s = this.step
    for (const cell of this.cells.values()) if (inside(cell.x * s, cell.y * s, cell.z * s)) cell.color = tint
    return this
  }
  /** Cross sections taper along a bone rather than piling spheres at joints.
   * Slightly rounded end caps cover the bend without growing a knuckle ball. */
  segment(length: number, width: number, depth: number, color: string, taper = .76): this {
    return this.volume([-width, -.003, -depth], [width, length + .003, depth], (x, y, z) => {
      const t = THREE.MathUtils.clamp(y / length, 0, 1), r = THREE.MathUtils.lerp(1, taper, t)
      const cap = y < 0 ? y / .003 : y > length ? (y - length) / .003 : 0
      return (x / (width * r)) ** 2 + (z / (depth * r)) ** 2 + cap * cap <= 1
    }, color)
  }
  mesh(material: THREE.MeshStandardMaterial, options: { deformable?: boolean } = {}): THREE.Mesh {
    const positions: number[] = [], normals: number[] = [], colors: number[] = [], indices: number[] = []
    const faces = [
      { n: [1, 0, 0], u: [0, 1, 0], v: [0, 0, 1] }, { n: [-1, 0, 0], u: [0, 0, 1], v: [0, 1, 0] },
      { n: [0, 1, 0], u: [0, 0, 1], v: [1, 0, 0] }, { n: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1] },
      { n: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] }, { n: [0, 0, -1], u: [0, 1, 0], v: [1, 0, 0] },
    ]
    type Patch = { face: typeof faces[number]; cells: Map<number, Cell> }
    const planes = new Map<number, Patch>(), normalCache = new Map<Cell, THREE.Vector3>()
    const dot = (c: Cell, axis: number[]) => c.x * axis[0] + c.y * axis[1] + c.z * axis[2]
    const faceKey = (u: number, v: number) => (u + 1024) * 2048 + v + 1024

    // Occupancy is a dense bitset over the cells' bounding box (padded by the
    // 2-cell normal reach), not this.cells.has(). WHY: the Map key
    // (x+1024)*4194304+… exceeds the small-integer range, so every lookup
    // hashes a heap double. mesh() makes 6 exposure lookups per cell plus up
    // to 52 per surface cell for normals, and on the surround's 25mm furniture
    // (≈170k cells) those lookups were most of a ~900ms main-thread stall on
    // every room mount (review of PR #11). A bit per box cell is ~1.6MB even
    // for furniture spread over all three walls, and is freed with this call.
    // The Map stays the authoring store: its insertion order is what makes
    // the emitted vertex order (and therefore the geometry bytes) stable, and
    // this speed-up is pinned to reproduce the Map path's output exactly.
    let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity
    for (const c of this.cells.values()) {
      if (c.x < minX) minX = c.x; if (c.y < minY) minY = c.y; if (c.z < minZ) minZ = c.z
      if (c.x > maxX) maxX = c.x; if (c.y > maxY) maxY = c.y; if (c.z > maxZ) maxZ = c.z
    }
    const sx = maxX - minX + 1, sy = maxY - minY + 1, sz = maxZ - minZ + 1
    const occupied = new Uint32Array(this.cells.size ? Math.ceil(sx * sy * sz / 32) : 0)
    for (const c of this.cells.values()) {
      const i = ((c.x - minX) * sy + c.y - minY) * sz + c.z - minZ
      occupied[i >>> 5] |= 1 << (i & 31)
    }
    const has = (x: number, y: number, z: number) => {
      x -= minX; y -= minY; z -= minZ
      if (x < 0 || y < 0 || z < 0 || x >= sx || y >= sy || z >= sz) return false
      const i = (x * sy + y) * sz + z
      return (occupied[i >>> 5] & (1 << (i & 31))) !== 0
    }

    for (const c of this.cells.values()) for (let direction = 0; direction < faces.length; direction++) {
      const f = faces[direction]
      if (has(c.x + f.n[0], c.y + f.n[1], c.z + f.n[2])) continue
      // Numeric twin of the former `direction:plane:colour` string key. The
      // plane index is within ±4096 and the colour is 24-bit, so the product
      // stays an exact integer below 2^53; string building per exposed face
      // was the next-largest cost after the lookups above.
      const key = ((direction * 8192 + dot(c, f.n) + 4096) * 16777216) + c.color.getHex()
      let patch = planes.get(key)
      if (!patch) { patch = { face: f, cells: new Map() }; planes.set(key, patch) }
      patch.cells.set(faceKey(dot(c, f.u), dot(c, f.v)), c)
    }
    const normalFor = (c: Cell) => {
      const cached = normalCache.get(c)
      if (cached) return cached
      let nx = 0, ny = 0, nz = 0
      for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
        const d = x * x + y * y + z * z
        if (!d) continue
        // Same accumulation order as the original `for (distance of [1, 2])`
        // loop, unrolled so it allocates nothing: floating-point addition is
        // order-sensitive and the output is pinned byte-for-byte.
        if (!has(c.x + x, c.y + y, c.z + z)) { nx += x / d; ny += y / d; nz += z / d }
        if (!has(c.x + x * 2, c.y + y * 2, c.z + z * 2)) { nx += x / (d * 2); ny += y / (d * 2); nz += z / (d * 2) }
      }
      const n = new THREE.Vector3(nx, ny, nz).normalize(); normalCache.set(c, n); return n
    }
    // Greedy faces are suitable only for rigid objects. Even limiting them to
    // 20mm left 1,492 unpaired edges in the recorded hand: a vertex midway down
    // a neighbouring long edge receives a different blended bone transform,
    // opening a crack after bending. Deforming surfaces retain the voxel lattice
    // so both sides of every edge have identical endpoints/weights. This costs
    // triangles, not draw calls. Never trade this invariant for a smooth bind-
    // pose screenshot; any future simplifier must preserve conforming topology.
    const span = options.deformable ? 1 : Math.max(1, Math.floor(.020 / this.step))
    const corners = [[-.5, -.5], [.5, -.5], [.5, .5], [-.5, .5]]
    const n = new THREE.Vector3(), faceNormal = new THREE.Vector3(), s = this.step
    for (const { face: f, cells } of planes.values()) {
      const original = new Map(cells)
      faceNormal.set(f.n[0], f.n[1], f.n[2])
      for (const [key, c] of cells) {
        if (!cells.has(key)) continue
        const u = dot(c, f.u), v = dot(c, f.v)
        let width = 1, height = 1
        while (width < span && cells.has(faceKey(u + width, v))) width++
        outer: while (height < span) {
          for (let x = 0; x < width; x++) if (!cells.has(faceKey(u + x, v + height))) break outer
          height++
        }
        for (let x = 0; x < width; x++) for (let y = 0; y < height; y++) cells.delete(faceKey(u + x, v + y))
        const base = positions.length / 3
        for (const [cu, cv] of corners) {
          const du = cu < 0 ? -.5 : width - .5, dv = cv < 0 ? -.5 : height - .5
          positions.push(
            (c.x + f.n[0] * .5 + f.u[0] * du + f.v[0] * dv) * s,
            (c.y + f.n[1] * .5 + f.u[1] * du + f.v[1] * dv) * s,
            (c.z + f.n[2] * .5 + f.u[2] * du + f.v[2] * dv) * s)
          const corner = original.get(faceKey(u + (du < 0 ? 0 : width - 1), v + (dv < 0 ? 0 : height - 1)))!
          n.copy(normalFor(corner)).multiplyScalar(.94).addScaledVector(faceNormal, .06).normalize()
          normals.push(n.x, n.y, n.z); colors.push(c.color.r, c.color.g, c.color.b)
        }
        indices.push(base, base + 1, base + 2, base, base + 2, base + 3)
      }
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); geometry.setIndex(indices)
    geometry.computeBoundingSphere(); geometry.computeBoundingBox()
    const mesh = new THREE.Mesh(geometry, material); mesh.castShadow = true; mesh.receiveShadow = true
    this.cells.clear(); return mesh
  }
}

export function anatomyMaterial(roughness = .67): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ vertexColors: true, roughness, metalness: 0 })
}
