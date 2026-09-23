import * as THREE from 'three'
import type { SurroundPicture } from './Surround'

type WinterView = Omit<SurroundPicture, 'facing'> & {
  facing: SurroundPicture['facing'] | '+z'; depthScale?: number; snowfall?: boolean; lantern?: boolean
}
// The original window has only 8mm between glass and its retained snow layer.
// Compress relief depth, not the landscape's visible proportions, to preserve
// that ordering without changing one byte of the pinned createRoomPlan().
export const MAIN_WINTER_VIEW: WinterView = {
  kind: 'snowscape', position: [-3.55, 1.995, -5.024], size: [1.24, 1.92],
  facing: '+z', lit: false, depthScale: .20, snowfall: false, lantern: true,
}

type Point = [number, number, number]
type Cell = { color: THREE.Color; depth: number }
const hash = (n: number) => { const f = Math.sin(n * 127.1 + 311.7) * 43758.5453; return f - Math.floor(f) }
const clamp = THREE.MathUtils.clamp

/** The pinned side walls cannot be cut open. A shallow voxel diorama sits
 * between their finish and the window joinery instead: real stepped geometry,
 * with an authored night palette for distant light, not a luminous flat photo.
 * Each window gets its own landscape and the close snow lives in a separate
 * glass-depth layer. All windows together cost three draws and zero lights.
 * No canvas, downloaded texture, clock, or random-at-runtime state is used. */
export class SnowyWindows {
  readonly root = new THREE.Group()
  private readonly snow: THREE.InstancedMesh
  private readonly flakes: { window: WinterView; u: number; v: number; speed: number; size: number; phase: number }[] = []
  private readonly dummy = new THREE.Object3D()
  private lastTick = -1

  constructor(windows: WinterView[]) {
    this.root.name = 'surround-winter-windows'
    const positions: number[] = [], colors: number[] = [], indices: number[] = []
    const frostPositions: number[] = [], frostColors: number[] = [], frostIndices: number[] = []
    const nightTop = new THREE.Color('#101c2b'), nightHorizon = new THREE.Color('#536575')
    // Parse each authored hex once. new THREE.Color(hex) runs the CSS-style
    // parser plus the sRGB→linear conversion, and the sampler below asks for
    // several tints per cell across ~58k cells; that parsing alone was a
    // measurable slice of the ~170ms window build that ran synchronously in
    // the PokerRoom constructor (review of PR #11). The clone keeps callers
    // free to mutate their colour (lerp/multiplyScalar) without corrupting
    // the shared palette, and yields exactly the same floats as before.
    const palette = new Map<string, THREE.Color>()
    const tint = (hex: string, amount = 1) => {
      let base = palette.get(hex)
      if (!base) { base = new THREE.Color(hex); palette.set(hex, base) }
      return base.clone().multiplyScalar(amount)
    }

    // Local coordinates use physical metres. Keeping all quads in this frame
    // makes the frost, scenery and snowfall obey the exact same aperture on
    // either wall; none can leak across the mullions or into the room.
    const quad = (p: WinterView, points: Point[], color: THREE.Color, frost = false, alpha = 1) => {
      const pos = frost ? frostPositions : positions, col = frost ? frostColors : colors, idx = frost ? frostIndices : indices
      const base = pos.length / 3
      for (const point of points) {
        pushWindowWorld(pos, p, point[0], point[1], point[2]); col.push(color.r, color.g, color.b)
        if (frost) col.push(alpha)
      }
      idx.push(base, base + 1, base + 2, base, base + 2, base + 3)
    }
    // The relief emits ~70k quads. Writing corners straight into the arrays,
    // instead of building a points array plus one spread per corner, removes
    // several hundred thousand short-lived arrays from the mount-time build.
    const relief = (p: WinterView, u0: number, v0: number, d0: number, u1: number, v1: number, d1: number,
      u2: number, v2: number, d2: number, u3: number, v3: number, d3: number, r: number, g: number, b: number) => {
      const base = positions.length / 3
      pushWindowWorld(positions, p, u0, v0, d0); pushWindowWorld(positions, p, u1, v1, d1)
      pushWindowWorld(positions, p, u2, v2, d2); pushWindowWorld(positions, p, u3, v3, d3)
      colors.push(r, g, b, r, g, b, r, g, b, r, g, b)
      indices.push(base, base + 1, base + 2, base, base + 2, base + 3)
    }

    windows.forEach((p, windowIndex) => {
      const width = p.size[0], height = p.size[1], columns = 120, rows = Math.round(columns * height / width)
      const du = width / columns, dv = height / rows, cells: Cell[] = []
      const seed = windowIndex * 83 + 17
      const cabinX = windowIndex ? -.32 : .20, cabinY = -.51
      const moonX = windowIndex ? .48 : -.49, moonY = .62
      // Tree placement is a per-window constant. It used to be recomputed
      // inside sample() for every cell: three hash() sines per tree × 26 trees
      // ≈ 80 Math.sin calls per cell, over ~58k cells, all synchronously in
      // the PokerRoom constructor (review of PR #11). Same expressions, same
      // floats, evaluated once; the sampled landscape is unchanged.
      const farPines = Array.from({ length: 19 }, (_, i) => ({
        x: -1.04 + i * .118 + (hash(i + seed) - .5) * .05, base: -.37 + .025 * Math.sin(i * 1.7),
        h: .18 + hash(i * 7 + seed) * .23, w: .063 + hash(i * 3) * .036,
      }))
      const nearPines = Array.from({ length: 7 }, (_, i) => ({
        x: -.96 + i * .31 + (hash(i + seed * 2) - .5) * .07, base: -.64 + hash(i + 91) * .05, h: .45 + hash(i + seed) * .28,
      })).filter(t => Math.abs(t.x - cabinX) >= .29)

      // Author the outside as one continuous scene, then sample that scene.
      // Atmospheric perspective is more important than bright snow: distant
      // trees dissolve into slate blue; only nearby boughs have dark needles
      // and moonlit caps. The previous white foreground and giant moon made
      // the windows look like luminous paper cutouts.
      const sample = (u: number, v: number, column: number, row: number): Cell => {
        const grain = hash(column * 3 + row * 19 + seed)
        let color = nightTop.clone().lerp(nightHorizon, clamp((.95 - v) * .48, 0, 1)), depth = .003
        const cloud = Math.sin(u * 4.7 + v * 9 + seed) * Math.sin(v * 17 - u * 2.3)
        color.multiplyScalar(1 + .045 * cloud + (grain - .5) * .018)
        const moonDistance = Math.hypot((u - moonX) * width / height, v - moonY)
        if (moonDistance < .16) color.lerp(tint('#718395'), (1 - moonDistance / .16) ** 3 * .28)
        if (moonDistance < .052) { color = tint('#b8c3c8', .94 + grain * .06); depth = .004 }
        if (v > .08 && grain > .9991 && moonDistance > .15) color = tint('#b1bac2', .50 + hash(row + seed) * .24)

        const farRidge = -.08 + .11 * Math.sin(u * 3.1 + seed) + .055 * Math.sin(u * 8.3)
        if (v < farRidge) { color = tint('#465b70', .93 + grain * .09); depth = .005 }
        const snowLine = -.39 + .055 * Math.sin(u * 5 + seed) + .035 * Math.sin(u * 11)
        if (v < snowLine) {
          const light = .86 + .09 * Math.sin(u * 2 - v * 4) + (grain - .5) * .035
          color = tint('#7d929f', light); depth = .009
        }

        // Tiered branches have a serrated outline and snow lying on their
        // upper surfaces. Varying height/spacing prevents a repeated triangle
        // skyline; the close trees deliberately frame a clearing at the cabin.
        const pine = (x: number, base: number, h: number, w: number, foliage: string, snow: string, d: number, detail: boolean) => {
          if (v < base || v > base + h || Math.abs(u - x) > w) return
          let occupied = false, capped = false
          for (let tier = 0; tier < 7; tier++) {
            const top = base + h * (1 - tier * .105), bottom = top - h * .30
            const breadth = w * (.25 + tier * .112)
            if (v < bottom || v > top) continue
            const edge = breadth * (top - v) / (top - bottom)
            const rough = detail ? .006 * Math.sin(v * 280 + tier * 13 + x * 9) : 0
            if (Math.abs(u - x) < edge + rough) {
              occupied = true
              if (detail && edge - Math.abs(u - x) < .018 && v > bottom + h * .025) capped = true
            }
          }
          if (Math.abs(u - x) < w * .045 && v < base + h * .65) occupied = true
          if (occupied) {
            color = tint(capped ? snow : foliage, (.88 + grain * .14) * (u > x ? 1 : .87))
            depth = d + (capped ? .002 : 0)
          }
        }
        for (const t of farPines) pine(t.x, t.base, t.h, t.w, '#304b60', '#617b8a', .007, false)
        // Trees crowding the cabin clearing were dropped when the table was built.
        for (const t of nearPines) pine(t.x, t.base, t.h, .14, '#213d48', '#819ba5', .012, true)

        // A curving, blue-shadowed footpath and a few footprints make the
        // clearing inhabited. They remain subdued so the room's candles, not
        // outdoor snow, hold the brightest values in the seated view.
        if (v < cabinY - .16) {
          const path = cabinX + Math.sin((v - cabinY) * 5) * .22
          const pathWidth = .028 + (cabinY - v) * .18
          if (Math.abs(u - path) < pathWidth) color.lerp(tint('#a4b1b5'), .19)
          if (Math.abs(Math.abs(u - path) - pathWidth * .26) < .012 && Math.sin(v * 105) > .62) color.multiplyScalar(.75)
        }

        const dx = u - cabinX, wallBottom = cabinY - .12, eave = cabinY + .10
        if (Math.abs(dx) < .235 && v > wallBottom && v < eave) {
          color = tint(dx < .12 ? '#3c3430' : '#272d31', .92 + .09 * Math.sin(v * 155)); depth = .015
          if (Math.abs(dx + .02) < .027 && v < cabinY) color = tint('#23262a')
          for (const wx of [-.145, .125]) if (Math.abs(dx - wx) < .043 && v > cabinY - .035 && v < cabinY + .035) {
            color = tint(Math.abs(dx - wx) < .005 || Math.abs(v - cabinY) < .004 ? '#846444' : '#d9ab69'); depth = .018
          }
        }
        const roof = eave + .17 - Math.abs(dx) * .68
        if (Math.abs(dx) < .285 && v > eave - .022 && v < roof) {
          color = tint(v > roof - .036 ? '#a8b5bb' : '#677c8b', .94 + grain * .05); depth = .018
        }
        if (dx > .13 && dx < .17 && v > eave + .075 && v < eave + .24) { color = tint('#45464a'); depth = .017 }
        if (v > eave + .24 && v < eave + .53 && Math.abs(dx - .15 - Math.sin(v * 16) * .025) < .018 + (v - eave - .24) * .10) {
          color.lerp(tint('#82909a'), .22 * (1 - (v - eave - .24) / .29))
        }
        // Two foreground firs supply a close, detailed silhouette against the
        // atmospheric forest, with separate cold highlights on snowy boughs.
        pine(-.88, -.97, 1.04, .26, '#182e35', '#99aeb6', .021, true)
        pine(.93, -.84, .82, .22, '#21363b', '#8ba3af', .020, true)
        if (v < -.90 + .035 * Math.sin(u * 8)) { color = tint('#8a9faa', .96 + (grain - .5) * .04); depth = .022 }
        if (p.lantern) {
          // A hanging oil lantern gives the main window a warm focal point.
          // Its stepped iron hood, chain, cage and snow cap are authored into
          // the outdoor relief, behind the original moving flakes/mullions.
          // Local amber in the surrounding air/snow suggests a pool of light
          // without adding a fourteenth room light or washing the room blue.
          const lx = -.63, ly = .56, dx = u - lx, dy = v - ly
          const halo = Math.exp(-(dx * dx * 18 + dy * dy * 34))
          color.lerp(tint('#ae662b', 2.2), halo * .18)
          if (v < -.44) color.lerp(tint('#a78052'), Math.exp(-((u - lx) ** 2 * 5)) * .22)
          if (Math.abs(dx) < .012 && v > ly + .17) { color = tint('#544630'); depth = .019 }
          if (Math.abs(dx) < .10 && Math.abs(dy) < .13) {
            color = tint('#df842f', 5.5 + (1 - Math.abs(dx) / .10) * 2); depth = .020
            if (Math.abs(dx) > .075 || Math.abs(dy) > .105 || Math.abs(dx) < .009) color = tint('#5c4029')
          }
          if (dy > .13 && dy < .22 && Math.abs(dx) < .13 - (dy - .13) * .9) {
            color = tint(dy > .19 ? '#87918d' : '#463a2b'); depth = .021
          }
          if (Math.abs(dx) < .115 && dy < -.13 && dy > -.16) { color = tint('#604a30'); depth = .021 }
        }
        return { color, depth }
      }
      for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) {
        cells.push(sample(-1 + (col + .5) / columns * 2, -1 + (row + .5) / rows * 2, col, row))
      }
      // Emit only the visible cap and the step between unlike neighbours.
      // Full boxes would send six faces per sky pixel to the GPU, most of
      // them sealed inside the relief. These exposed faces preserve the voxel
      // silhouette at a fraction of the triangles and still form one batch.
      for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) {
        const cell = cells[row * columns + col], d = cell.depth, { r, g, b } = cell.color
        const u = -width / 2 + col * du, v = -height / 2 + row * dv
        relief(p, u, v, d, u + du, v, d, u + du, v + dv, d, u, v + dv, d, r, g, b)
        const left = col ? cells[row * columns + col - 1].depth : 0
        const down = row ? cells[(row - 1) * columns + col].depth : 0
        if (Math.abs(left - d) > .001) relief(p, u, v, left, u, v, d, u, v + dv, d, u, v + dv, left, r * .68, g * .68, b * .68)
        if (Math.abs(down - d) > .001) relief(p, u, v, down, u + du, v, down, u + du, v, d, u, v, d, r * .82, g * .82, b * .82)
      }
      // Frost is sparse and translucent, clustered at cold edges. Dense white
      // borders would shrink the view into another glowing rectangular plate.
      // A few warm streaks beside the sill reflect the nearby candles in glass.
      for (let i = 0; i < 165; i++) {
        const side = i % 4, t = hash(i * 7 + seed), inward = hash(i * 11 + seed) ** 3 * .10
        const u = side < 2 ? (side ? 1 : -1) * (width / 2 - .008 - inward) : (t - .5) * width
        const v = side < 2 ? (t - .5) * height : (side === 2 ? -1 : 1) * (height / 2 - .008 - inward)
        const s = .003 + hash(i + seed) * .010
        if (Math.abs(u) + s > width / 2 || Math.abs(v) + s > height / 2) continue
        quad(p, [[u-s,v,.033],[u+s,v,.033],[u+s,v+s*.55,.033],[u-s,v+s*.55,.033]], tint('#a8c1cc'), true, .15 + hash(i) * .32)
      }
      for (const u of [-width * .28, width * .26]) {
        const v = -height * .40
        quad(p, [[u-.004,v,.034],[u+.004,v,.034],[u+.008,v+.11,.034],[u-.008,v+.11,.034]], tint('#dcad73'), true, .20)
      }
      // Side flakes must survive seated projection, but stay quieter than
      // the main window's 84 large soft flakes. Fewer, dimmer 14–26mm blocks
      // read as gentle snowfall; the previous 2mm specks disappeared entirely.
      if (p.snowfall !== false) for (let i = 0; i < 45; i++) this.flakes.push({ window: p, u: hash(i * 7 + seed), v: hash(i * 13 + seed), speed: .018 + hash(i + seed) * .018, size: .014 + hash(i * 3 + seed) ** 3 * .012, phase: hash(i + 93) * 6.28 })
    })

    const geometry = (pos: number[], col: number[], idx: number[], alpha = false) => {
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, alpha ? 4 : 3)); g.setIndex(idx)
      g.computeBoundingSphere(); g.computeBoundingBox(); return g
    }
    // The outside must sit well below the room's candlelight. This tint is
    // only about 7% light in linear space: even snow stays dark beyond glass,
    // while the many small contour differences remain visible on inspection.
    // A 30% pass still looked like a luminous monitor beside the cozy hearth.
    const exterior = new THREE.Mesh(geometry(positions, colors, indices), new THREE.MeshBasicMaterial({ vertexColors: true, color: '#494d52', side: THREE.DoubleSide }))
    exterior.name = 'surround-window-voxel-landscapes'; this.root.add(exterior)
    const glass = new THREE.Mesh(geometry(frostPositions, frostColors, frostIndices, true), new THREE.MeshBasicMaterial({ vertexColors: true, color: '#69737a', transparent: true, depthWrite: false, side: THREE.DoubleSide }))
    glass.name = 'surround-window-frost-and-reflections'; this.root.add(glass)
    this.snow = new THREE.InstancedMesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ color: '#697982', transparent: true, opacity: .32, depthWrite: false }), this.flakes.length)
    this.snow.instanceMatrix.setUsage(THREE.DynamicDrawUsage); this.snow.name = 'surround-window-snow'; this.snow.frustumCulled = false; this.root.add(this.snow)
    this.frame(0, true)
  }

  frame(time: number, reduced: boolean): void {
    if (!Number.isFinite(time)) return
    const tick = reduced ? 0 : Math.floor(Math.max(0, time) * 24) + 1
    if (tick === this.lastTick) return
    this.lastTick = tick
    const t = reduced ? 0 : (tick - 1) / 24
    this.flakes.forEach((f, i) => {
      const v = ((f.v - t * f.speed) % 1 + 1) % 1
      const u = f.u + Math.sin(t * .24 + f.phase) * .014
      const w = f.window.size[0], h = f.window.size[1]
      this.dummy.position.set(...windowWorld(f.window, (clamp(u, .015, .985) - .5) * w, (v - .5) * (h - .025), .030))
      this.dummy.scale.set(f.size, f.size * 1.4, f.size); this.dummy.updateMatrix(); this.snow.setMatrixAt(i, this.dummy.matrix)
    })
    this.snow.instanceMatrix.needsUpdate = true
  }
}

function windowWorld(p: WinterView, u: number, v: number, d: number): Point {
  const [x, y, z] = p.position
  d *= p.depthScale ?? 1
  return p.facing === '+x' ? [x + d, y + v, z + u] : p.facing === '-x' ? [x - d, y + v, z - u] : p.facing === '+z' ? [x + u, y + v, z + d] : [x - u, y + v, z - d]
}
/** windowWorld() without the result tuple, for the hot relief loop. Must stay
 * arithmetically identical to it: the tests pin window bounds and snowfall
 * uses windowWorld() for the same aperture. */
function pushWindowWorld(out: number[], p: WinterView, u: number, v: number, d: number): void {
  const x = p.position[0], y = p.position[1], z = p.position[2]
  d *= p.depthScale ?? 1
  if (p.facing === '+x') out.push(x + d, y + v, z + u)
  else if (p.facing === '-x') out.push(x - d, y + v, z - u)
  else if (p.facing === '+z') out.push(x + u, y + v, z + d)
  else out.push(x - u, y + v, z - d)
}
