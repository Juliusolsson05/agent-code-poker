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
  /** Cross sections taper along a bone rather than piling spheres at joints.
   * Slightly rounded end caps cover the bend without growing a knuckle ball. */
  segment(length: number, width: number, depth: number, color: string, taper = .76): this {
    return this.volume([-width, -.003, -depth], [width, length + .003, depth], (x, y, z) => {
      const t = THREE.MathUtils.clamp(y / length, 0, 1), r = THREE.MathUtils.lerp(1, taper, t)
      const cap = y < 0 ? y / .003 : y > length ? (y - length) / .003 : 0
      return (x / (width * r)) ** 2 + (z / (depth * r)) ** 2 + cap * cap <= 1
    }, color)
  }
  mesh(material: THREE.MeshStandardMaterial): THREE.Mesh {
    const positions: number[] = [], normals: number[] = [], colors: number[] = [], indices: number[] = []
    const faces = [
      { n: [1, 0, 0], u: [0, 1, 0], v: [0, 0, 1] }, { n: [-1, 0, 0], u: [0, 0, 1], v: [0, 1, 0] },
      { n: [0, 1, 0], u: [0, 0, 1], v: [1, 0, 0] }, { n: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1] },
      { n: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] }, { n: [0, 0, -1], u: [0, 1, 0], v: [1, 0, 0] },
    ]
    type Patch = { face: typeof faces[number]; cells: Map<number, Cell> }
    const planes = new Map<string, Patch>(), normalCache = new Map<number, THREE.Vector3>()
    const dot = (c: Cell, axis: number[]) => c.x * axis[0] + c.y * axis[1] + c.z * axis[2]
    const faceKey = (u: number, v: number) => (u + 1024) * 2048 + v + 1024
    for (const c of this.cells.values()) for (let direction = 0; direction < faces.length; direction++) {
      const f = faces[direction]
      if (this.cells.has(this.key(c.x + f.n[0], c.y + f.n[1], c.z + f.n[2]))) continue
      const key = direction + ':' + dot(c, f.n) + ':' + c.color.getHex()
      let patch = planes.get(key)
      if (!patch) { patch = { face: f, cells: new Map() }; planes.set(key, patch) }
      patch.cells.set(faceKey(dot(c, f.u), dot(c, f.v)), c)
    }
    const normalFor = (c: Cell) => {
      const key = this.key(c.x, c.y, c.z), cached = normalCache.get(key)
      if (cached) return cached
      let nx = 0, ny = 0, nz = 0
      for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
        const d = x * x + y * y + z * z
        if (!d) continue
        for (const distance of [1, 2]) if (!this.cells.has(this.key(c.x + x * distance, c.y + y * distance, c.z + z * distance))) {
          nx += x / (d * distance); ny += y / (d * distance); nz += z / (d * distance)
        }
      }
      const n = new THREE.Vector3(nx, ny, nz).normalize(); normalCache.set(key, n); return n
    }
    // Greedy coplanar patches preserve the exact voxel silhouette while removing
    // internal grid edges. Limit patch size to 20mm: an arbitrarily long merged
    // quad would have no vertices near a finger/elbow joint and could not bend.
    const span = Math.max(1, Math.floor(.020 / this.step))
    for (const { face: f, cells } of planes.values()) {
      const original = new Map(cells)
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
        for (const [du, dv] of [[-.5, -.5], [width - .5, -.5], [width - .5, height - .5], [-.5, height - .5]]) {
          positions.push(...[c.x, c.y, c.z].map((p, k) => (p + f.n[k] * .5 + f.u[k] * du + f.v[k] * dv) * this.step))
          const corner = original.get(faceKey(u + (du < 0 ? 0 : width - 1), v + (dv < 0 ? 0 : height - 1)))!
          const n = normalFor(corner).clone().multiplyScalar(.94).addScaledVector(new THREE.Vector3(...f.n as Point), .06).normalize()
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
