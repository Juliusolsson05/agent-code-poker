/** Everything the seated player can see once look-around sweeps the full 280°
 * field of regard (#10): the side walls end to end, the rear corners behind
 * the chair, the ceiling and the floor around the table.
 *
 * Why a separate plan instead of growing createRoomPlan(): that plan is pinned
 * byte-for-byte to recorded browser captures (environment/fireplace tests), so
 * any addition would silently invalidate evidence gathered for the bar, window
 * and hearth. This plan is pure data (no DOM, Three, time or game state) so the
 * clearance and no-void tests consume exactly what SurroundDecor renders.
 *
 * Coordinates are metres, room space. Inner wall faces: left x=-4.74, right
 * x=+4.74, rear z=+3.34 (the rear wall is new; the room used to end in the
 * clear colour behind the player). Helpers take distance-from-wall, so every
 * furniture piece is authored against its wall rather than as a world guess. */

export type SurroundBlock = {
  color: string; position: [number, number, number]; size: [number, number, number]
  /** Yaw in radians about the block centre (poinsettia leaves, the sled). */
  rot?: number
  /** Brass/iron fittings get a metallic response; everything else is wood,
   * plaster, fabric or paper under one rough material. */
  metal?: boolean
}
export type Flicker = 'candle' | 'lamp' | 'steady' | 'fairy'
export type SurroundGlow = { color: string; position: [number, number, number]; size: [number, number, number]; strength: number; flicker: Flicker }
export type SurroundLight = { name: string; color: string; power: number; range: number; position: [number, number, number]; flicker: Flicker }
export type Facing = '+x' | '-x' | '-z'
export type PictureKind = 'snowscape' | 'landscape' | 'hound' | 'village' | 'clock' | 'sheet-music'
export type SurroundPicture = { kind: PictureKind; position: [number, number, number]; size: [number, number]; facing: Facing; lit: boolean }
export type SurroundWreath = { position: [number, number, number]; radius: number; facing: Facing }
export type SurroundGarland = { from: [number, number, number]; to: [number, number, number]; sag: number }
export type SurroundPendulum = { pivot: [number, number, number]; length: number; facing: Facing }
/** These are continuous volumes, not a list of cubes. The renderer samples
 * them through VoxelSculpt so upholstery and carved wood have stepped contours
 * at the same scale as the people. Their explicit bounds let the pure plan's
 * clearance test audit the actual added volume. */
export type SurroundSculpt = { kind: 'rounded' | 'ellipsoid'; color: string; position: [number, number, number]; size: [number, number, number]; radius?: number }

export const WALL = { left: -4.74, right: 4.74, rear: 3.34, back: -5.24, floor: -.01, ceiling: 3.54 } as const

const rnd = (i: number) => { const v = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v) }

export function createSurroundPlan() {
  const shell: SurroundBlock[] = [], blocks: SurroundBlock[] = [], sculpts: SurroundSculpt[] = [], glows: SurroundGlow[] = [], lights: SurroundLight[] = []
  const pictures: SurroundPicture[] = [], wreaths: SurroundWreath[] = [], garlands: SurroundGarland[] = [], fairy: [number, number, number][][] = []
  const pendulums: SurroundPendulum[] = []
  const box = (list: SurroundBlock[], color: string, x: number, y: number, z: number, sx: number, sy: number, sz: number, extra: Partial<SurroundBlock> = {}) =>
    list.push({ color, position: [x, y, z], size: [sx, sy, sz], ...extra })
  // Wall-relative authoring: d = distance out from the wall face, along = the
  // coordinate that runs along the wall. sd/sa are the matching sizes.
  const L = (c: string, d: number, y: number, z: number, sd: number, sy: number, sz: number, extra?: Partial<SurroundBlock>) => box(blocks, c, WALL.left + d, y, z, sd, sy, sz, extra)
  const R = (c: string, d: number, y: number, z: number, sd: number, sy: number, sz: number, extra?: Partial<SurroundBlock>) => box(blocks, c, WALL.right - d, y, z, sd, sy, sz, extra)
  const B = (c: string, x: number, y: number, d: number, sx: number, sy: number, sd: number, extra?: Partial<SurroundBlock>) => box(blocks, c, x, y, WALL.rear - d, sx, sy, sd, extra)
  const glow = (color: string, x: number, y: number, z: number, sx: number, sy: number, sz: number, strength: number, flicker: Flicker) =>
    glows.push({ color, position: [x, y, z], size: [sx, sy, sz], strength, flicker })
  const brass = { metal: true }
  const sculpt = (kind: SurroundSculpt['kind'], color: string, x: number, y: number, z: number, sx: number, sy: number, sz: number, radius?: number) =>
    sculpts.push({ kind, color, position: [x, y, z], size: [sx, sy, sz], ...(radius === undefined ? {} : { radius }) })

  // ── Shell: close the room behind the player and finish every wall ────────
  // The old side walls stopped at z=2.8 and there was no rear wall, so turning
  // past ~120° looked into the clear colour. Beams continue to the new wall.
  box(shell, '#1a1512', 0, 1.8, WALL.rear + .06, 9.72, 3.6, .12)
  for (const x of [-4.8, 4.8]) box(shell, x < 0 ? '#161716' : '#181614', x, 1.8, 3.13, .12, 3.6, .66)
  for (let x = -4; x <= 4; x++) box(shell, '#221d18', x, 3.40, 3.12, .12, .23, .44)
  // Walnut panelling below hand-laid warm masonry continues the main wall's
  // material language. Flat striped wallpaper (and then repeated gold motifs)
  // had no small-scale variation beside that wall's individual brick faces.
  const finish = (axis: 'left' | 'right' | 'rear', from: number, to: number) => {
    const at = (d: number, y: number, a: number, sd: number, sy: number, sa: number, c: string) =>
      axis === 'left' ? box(shell, c, WALL.left + d, y, a, sd, sy, sa)
        : axis === 'right' ? box(shell, c, WALL.right - d, y, a, sd, sy, sa)
          : box(shell, c, a, y, WALL.rear - d, sa, sy, sd)
    const length = to - from, mid = (from + to) / 2
    at(.0125, .54, mid, .025, 1.08, length, '#2e2018') // dado panel field
    at(.03, 1.085, mid, .045, .05, length, '#5b4130') // dado rail
    at(.02, .07, mid, .04, .14, length, '#20160f') // skirting
    at(.035, 3.22, mid, .07, .07, length, '#4a3526') // crown
    const bays = Math.max(1, Math.round(length / .62))
    for (let i = 0; i < bays; i++) {
      const a = from + (i + .5) * length / bays
      at(.03, .58, a, .01, .74, length / bays - .12, '#3a291e') // raised panel
      // The first pass had one slab per bay; in low winter light it merged
      // into a featureless dark belt. A narrow inset moulding gives each bay
      // a readable recessed centre without adding a separate material/draw.
      const width = length / bays - .08
      for (const side of [-1, 1]) at(.051, .57, a + side * width / 2, .018, .76, .022, '#765237')
      for (const y of [.19, .95]) at(.051, y, a, .018, .022, width + .02, '#765237')
    }
    at(.001, 2.15, mid, .002, 2.10, length, '#171614')
    const brick = ['#382a22', '#30261f', '#403027', '#332a24', '#473228', '#352821', '#3e3026']
    const course = .131, pitch = .385
    for (let row = 0; row < 16; row++) for (let col = -1; col <= Math.ceil(length / pitch); col++) {
      const start = from + col * pitch + (row % 2) * pitch / 2
      const lo = Math.max(from, start + .006), hi = Math.min(to, start + pitch - .006)
      if (hi <= lo) continue
      const variation = rnd(row * 137 + col * 19 + length)
      const front = .009 + variation * .004
      // Shallow courses sit on the immutable wall instead of altering its
      // recorded geometry. Their maximum face is 13mm from the wall, safely
      // behind the snowy aperture at 16mm. Actual gaps expose dark mortar;
      // they are not painted black lines laid over a flat red plane.
      at(front / 2, 1.12 + (row + .5) * course, (lo + hi) / 2, front, course - .010, hi - lo,
        brick[(row * 3 + col * 5 + brick.length * 20) % brick.length])
      if (variation > .58) at(front + .0003, 1.12 + (row + .5) * course - .033, (lo + hi) / 2,
        .0006, .006, (hi - lo) * (.28 + variation * .3), '#49382b')
    }
    // Fine panel grain breaks the broad lower surfaces without introducing a
    // texture asset. These restrained strips stay behind the inset moulding,
    // so the wooden frame, rather than the grain, carries the main silhouette.
    for (let i = 0; i < bays; i++) for (let grain = 0; grain < 5; grain++) {
      const a = from + (i + .5) * length / bays + (grain - 2) * .072
      at(.036, .58, a, .003, .61 - rnd(i * 13 + grain) * .13, .006, grain % 2 ? '#493324' : '#302219')
    }
  }
  finish('left', -5.18, 3.30); finish('right', -5.18, 3.30); finish('rear', -4.70, 4.70)

  // ── Floor: a festive rug under the table ─────────────────────────────────
  // Stepped tops (.002→.005) instead of coplanar layers: equal heights would
  // z-fight as the camera turns. Chair feet start at y=.01, above all of it.
  box(blocks, '#7d5f2e', 0, -.004, -.25, 5.6, .012, 4.4)
  box(blocks, '#5a1a1a', 0, -.0035, -.25, 5.3, .013, 4.1)
  box(blocks, '#1f3a2a', 0, -.003, -.25, 4.7, .014, 3.5)
  box(blocks, '#5a1a1a', 0, -.0025, -.25, 4.55, .015, 3.35)
  for (const [w, c] of [[1.4, '#8a6a35'], [1.1, '#5a1a1a'], [.5, '#8a6a35']] as const) box(blocks, c, 0, -.002 - w * .0005, -.25, w, .016, w, { rot: Math.PI / 4 }) // smaller diamonds stand higher so each stays visible
  // The table hides the rug's centre, so detail belongs on its visible hem.
  // These little woven diamonds are part of the existing rough instanced
  // batch, not hundreds of individual decorative draw calls.
  for (const z of [-2.07, 1.57]) for (let i = -25; i <= 25; i++) {
    const x = i * .10
    box(blocks, i % 2 ? '#c79c5b' : '#2f5036', x, -.002, z, .065, .016, .065, { rot: Math.PI / 4 })
  }
  for (const x of [-2.59, 2.59]) for (let i = -17; i <= 17; i++) {
    const z = -.25 + i * .10
    box(blocks, i % 2 ? '#c79c5b' : '#2f5036', x, -.002, z, .065, .016, .065, { rot: Math.PI / 4 })
  }

  // ── LEFT WALL ────────────────────────────────────────────────────────────
  // Bookcase in the back-left corner, beside the existing snowy back window.
  const shelfZ = -4.15
  for (const z of [-4.735, -3.565]) L('#3b2a1e', .17, 1.15, z, .34, 2.3, .03)
  L('#21170f', .012, 1.15, shelfZ, .02, 2.3, 1.14)
  L('#3b2a1e', .17, 2.315, shelfZ, .34, .03, 1.2); L('#4a3526', .18, 2.35, shelfZ, .36, .04, 1.26)
  const shelves = [.06, .52, .98, 1.44, 1.9]
  for (const y of shelves) L('#3b2a1e', .17, y, shelfZ, .32, .025, 1.14)
  const bookColors = ['#5b1f1d', '#1f3b2c', '#2a3148', '#6b4a2a', '#3a2a22', '#7a5a2e', '#40243a', '#8b7a58', '#2c4a45']
  let seed = 1
  for (const [row, y] of shelves.slice(0, 4).entries()) {
    let z = -4.70
    while (z < -3.62) {
      const w = .026 + rnd(seed++) * .03, h = .19 + rnd(seed++) * .15, d = .16 + rnd(seed++) * .06
      if (z + w > -3.60) break
      // One shelf keeps a small nutcracker and a candle jar instead of books.
      if (row === 2 && z > -4.3 && z < -4.02) { z += .03; continue }
      if (rnd(seed++) < .07) { // a lying stack every so often breaks the rhythm
        for (let k = 0; k < 3; k++) L(bookColors[(seed + k) % bookColors.length], .03 + d / 2, y + .0125 + .02 + k * .04, z + .1, d, .038, .2)
        z += .22; continue
      }
      L(bookColors[Math.floor(rnd(seed++) * bookColors.length)], .03 + d / 2, y + .0125 + h / 2, z + w / 2, d, h, w)
      // Cover lips, page edges and paired spine bands make the shelf read as
      // bound books instead of random coloured upright blocks. The bands use
      // the existing instance batch, so a library still costs one submission.
      for (const yy of [y + .045, y + h - .015]) L('#957342', .032 + d, yy, z + w / 2, .006, .008, w * .85)
      L('#a18a64', .03 + d / 2, y + h + .014, z + w / 2, d * .8, .004, w * .6)
      if (rnd(seed++) < .3) L('#c9a24e', .03 + d + .001, y + .0125 + h * .78, z + w / 2, .002, .012, w * .8)
      z += w + .003
    }
  }
  // Cornice dentils and fluted stiles give this tall case the same small
  // handmade rhythm as the bottle shelves on the main wall.
  for (let z = -4.68; z < -3.62; z += .085) L('#755235', .345, 2.295, z, .028, .05, .035)
  for (const z of [-4.735, -3.565]) for (const dz of [-.018, .018]) L('#785437', .343, 1.17, z + dz, .012, 2.15, .009)
  // Nutcracker (voxel toy soldier) and candle jar on the middle shelf.
  const nz = -4.2, ny = .98 + .0125
  L('#1a1a1a', .15, ny + .03, nz, .06, .06, .07); L('#8a1f24', .15, ny + .12, nz, .07, .12, .08)
  L('#d9bf8f', .15, ny + .21, nz, .05, .06, .06); L('#1a1a1a', .15, ny + .27, nz, .06, .07, .065)
  L('#c9a24e', .15, ny + .12, nz, .072, .015, .082, brass)
  L('#9a2a2a', .15, ny + .05, -4.08, .07, .09, .07)
  glow('#ffb15c', WALL.left + .15, ny + .11, -4.08, .018, .03, .018, 4.5, 'candle')

  // Snowy side window with heavy curtains, candles on the sill and a wreath.
  // Window bottoms sit above the dado rail (top y=1.11). They started at 1.0,
  // and the rail and panelling ran across the snowy view (review of #11).
  const winZ = -2.0, winY = 2.03, winW = 1.5, winH = 1.76
  // The view plane must stand in front of the wallpaper (which is 12mm proud of
  // the wall) and behind the mullions (30mm+). At 4mm the paper hid it and
  // both windows rendered as black panes.
  pictures.push({ kind: 'snowscape', position: [WALL.left + .016, winY, winZ], size: [winW, winH], facing: '+x', lit: false })
  L('#3a2a1e', .04, winY + winH / 2 + .04, winZ, .08, .08, winW + .12); L('#3a2a1e', .04, winY, winZ - winW / 2 - .04, .08, winH + .16, .08)
  L('#3a2a1e', .04, winY, winZ + winW / 2 + .04, .08, winH + .16, .08)
  L('#4a3526', .11, winY - winH / 2 - .03, winZ, .22, .06, winW + .26)
  for (const z of [winZ - winW / 6, winZ + winW / 6]) L('#2a2019', .045, winY, z, .03, winH, .03)
  for (const y of [winY - winH / 6, winY + winH / 6]) L('#2a2019', .045, y, winZ, .03, .03, winW)
  for (const z of [winZ - .45, winZ, winZ + .45]) {
    const tall = z === winZ ? .16 : .11
    L('#efe6cf', .12, winY - winH / 2 + tall / 2, z, .045, tall, .045)
    glow('#ffbf6a', WALL.left + .12, winY - winH / 2 + tall + .02, z, .014, .03, .014, 5, 'candle')
  }
  wreaths.push({ position: [WALL.left + .1, winY + .15, winZ], radius: .17, facing: '+x' })
  const curtains = (along: (z: number) => void) => along(0)
  curtains(() => {
    for (const side of [-1, 1]) for (let i = 0; i < 5; i++) {
      const z = winZ + side * (winW / 2 + .05 + i * .065)
      L(i % 2 ? '#521719' : '#651f21', .1 + (i % 2) * .03, 1.72, z, .06, 2.56, .066)
    }
    for (const side of [-1, 1]) L('#c9a24e', .16, 1.3, winZ + side * (winW / 2 + .18), .03, .04, .36, brass)
    L('#9a7a44', .12, 3.02, winZ, .025, .025, winW + .9, brass)
  })
  garlands.push({ from: [WALL.left + .14, 3.0, winZ - winW / 2 - .35], to: [WALL.left + .14, 3.0, winZ + winW / 2 + .35], sag: .16 })

  // Grandfather clock with a swinging pendulum behind its glass.
  const clockZ = -.55
  // The trunk stops at .20 with a dark back panel, so the pendulum (at .215)
  // swings in an open, framed case. First pass hung it inside the solid trunk,
  // behind an opaque panel, where it could never be seen (review of #11).
  L('#3a2418', .13, .15, clockZ, .26, .3, .5); L('#452b1c', .105, 1.0, clockZ, .19, 1.4, .38)
  L('#140f0c', .203, 1.0, clockZ, .006, 1.0, .28)
  for (const z of [clockZ - .165, clockZ + .165]) L('#452b1c', .215, 1.0, z, .03, 1.4, .05)
  L('#452b1c', .215, .45, clockZ, .03, .3, .38)
  L('#452b1c', .14, 1.95, clockZ, .28, .5, .46); L('#3a2418', .15, 2.24, clockZ, .3, .08, .52)
  L('#c9a24e', .152, 2.3, clockZ, .04, .06, .1, brass)
  pictures.push({ kind: 'clock', position: [WALL.left + .282, 1.95, clockZ], size: [.32, .32], facing: '+x', lit: true })
  pendulums.push({ pivot: [WALL.left + .215, 1.62, clockZ], length: .9, facing: '+x' })
  // The hood projects in a shallow, rounded crown. Its stepped sampled edge
  // makes the clock read as joinery rather than another vertical wall box.
  sculpt('rounded', '#50331f', WALL.left + .16, 2.21, clockZ, .32, .16, .55, .055)
  sculpt('rounded', '#6c4829', WALL.left + .19, 2.28, clockZ, .28, .045, .51, .02)

  // Slender paired columns, base mouldings and the key escutcheon finish the
  // clock case. Detail belongs beside its open pendulum cavity, never across
  // it: filling that gap previously hid the movement entirely.
  for (const z of [clockZ - .195, clockZ + .195]) {
    L('#785133', .243, 1.03, z, .025, 1.23, .025)
    for (const y of [.40, 1.65]) L('#916139', .24, y, z, .05, .055, .065)
  }
  for (const y of [.07, .27, 1.69, 2.15]) L('#704b30', .268, y, clockZ, .025, .026, .48)
  L('#a98746', .25, .52, clockZ, .018, .04, .025, brass)

  // Landscape painting with a brass picture light.
  const art = (x: number, y: number, z: number, w: number, h: number, kind: PictureKind, facing: Facing, light = true) => {
    const frame = (c: string, d: number, sd: number, sw: number, sh: number) =>
      facing === '+x' ? box(blocks, c, x + d, y, z, sd, sh, sw, c === '#9b7a3f' ? brass : {})
        : facing === '-x' ? box(blocks, c, x - d, y, z, sd, sh, sw, c === '#9b7a3f' ? brass : {})
          : box(blocks, c, x, y, z - d, sw, sh, sd, c === '#9b7a3f' ? brass : {})
    frame('#9b7a3f', .02, .04, w + .12, h + .12)
    const off = .042
    pictures.push({ kind, position: facing === '+x' ? [x + off, y, z] : facing === '-x' ? [x - off, y, z] : [x, y, z - off], size: [w, h], facing, lit: true })
    if (!light) return
    const ly = y + h / 2 + .12, len = Math.min(.55, w * .6)
    if (facing === '-z') { box(blocks, '#8a6a3a', x, ly, z - .1, len, .03, .05, brass); glow('#bd773c', x, ly - .02, z - .1, len * .9, .008, .02, 1.4, 'steady') }
    else {
      const d = facing === '+x' ? .1 : -.1
      box(blocks, '#8a6a3a', x + d, ly, z, .05, .03, len, brass); glow('#bd773c', x + d, ly - .02, z, .02, .008, len * .9, 1.4, 'steady')
    }
  }
  art(WALL.left, 1.85, .55, 1.0, .74, 'landscape', '+x')

  // Reading nook: wingback armchair, lamp table, blanket, footstool, rug.
  const chairZ = 2.1
  for (const [d, z] of [[.12, 1.8], [.12, 2.4], [.62, 1.8], [.62, 2.4]]) L('#1f140e', d, .05, z, .05, .1, .05)
  // Carved shell and cushions are authored as continuous padded forms. The
  // previous five orthogonal slabs gave the chair a square silhouette even
  // though it had a blanket and footstool; fine voxel sampling adds the
  // familiar rolled arms, wing tips and broken highlight along the back.
  sculpt('rounded', '#401b18', WALL.left + .37, .27, chairZ, .59, .32, .72, .08)
  sculpt('rounded', '#752b25', WALL.left + .40, .47, chairZ, .49, .13, .57, .055)
  sculpt('rounded', '#4e1e1c', WALL.left + .11, .87, chairZ, .20, 1.03, .75, .09)
  sculpt('rounded', '#692823', WALL.left + .23, .91, chairZ, .09, .78, .56, .045)
  for (const side of [-1, 1]) {
    sculpt('ellipsoid', '#54201d', WALL.left + .23, 1.04, chairZ + side * .32, .32, .54, .16)
    sculpt('ellipsoid', '#78312a', WALL.left + .38, .68, chairZ + side * .34, .58, .19, .19)
    sculpt('rounded', '#37211a', WALL.left + .48, .57, chairZ + side * .33, .39, .23, .10, .045)
  }
  sculpt('rounded', '#c8a86a', WALL.left + .22, .76, chairZ, .12, .26, .32, .045)
  for (const z of [chairZ - .18, chairZ, chairZ + .18]) sculpt('ellipsoid', '#9a5141', WALL.left + .287, 1.05, z, .025, .025, .025)
  // Upholstery seams and small brass tacks follow the padded silhouette;
  // keeping them dark avoids turning an old leather chair into striped candy.
  for (const z of [chairZ - .255, chairZ + .255]) {
    L('#9b4633', .57, .48, z, .13, .014, .012)
    for (let y = .72; y < 1.23; y += .075) L('#bd854b', .283, y, z, .014, .012, .012, brass)
  }
  for (const y of [.91, 1.16]) for (const z of [chairZ - .16, chairZ + .16]) {
    sculpt('ellipsoid', '#421a18', WALL.left + .278, y, z, .025, .035, .035)
  }
  for (let z = chairZ - .12; z <= chairZ + .12; z += .06) L('#997e4c', .284, .77, z, .009, .19, .009)
  // Plaid blanket draped over the near arm.
  L('#7a2226', .40, .725, chairZ + .34, .34, .02, .16); L('#7a2226', .40, .5, chairZ + .43, .34, .44, .02)
  for (const y of [.36, .5, .64]) L('#1f4a33', .40, y, chairZ + .441, .34, .03, .004)
  for (const d of [.3, .44]) L('#1f4a33', d, .5, chairZ + .442, .025, .44, .004)
  for (let d = .26; d < .56; d += .032) L('#c29566', d, .265, chairZ + .442, .010, .07, .014)
  L('#6a2a22', .70, -.0035, chairZ - .05, 1.3, .013, 1.5)
  sculpt('rounded', '#632921', WALL.left + .95, .22, chairZ, .38, .18, .38, .075); for (const [dd, zz] of [[.8, 1.95], [1.1, 2.25]]) L('#1f140e', dd, .06, zz, .04, .12, .04)
  const tableZ = 1.35
  L('#3a2418', .28, .62, tableZ, .46, .04, .46); for (const [dd, zz] of [[.08, 1.15], [.08, 1.55], [.48, 1.15], [.48, 1.55]]) L('#2a1a12', dd, .3, zz, .03, .6, .03)
  // Apron drawer, lower stretcher and turned collars make the little lamp
  // table feel constructed. These all stay inside its original footprint.
  L('#60422c', .50, .56, tableZ, .018, .08, .36)
  L('#ac8348', .514, .56, tableZ, .016, .022, .055, brass)
  L('#4a3020', .28, .16, tableZ, .40, .025, .035)
  for (const [dd, zz] of [[.08, 1.15], [.08, 1.55], [.48, 1.15], [.48, 1.55]]) {
    for (const y of [.10, .46]) sculpt('ellipsoid', '#59402b', WALL.left + dd, y, zz, .055, .075, .055)
  }
  L('#7d5a32', .24, .72, tableZ - .05, .12, .16, .12, brass); L('#9a7a44', .24, .92, tableZ - .05, .02, .26, .02, brass)
  // A lit fabric shade glows amber, not white: at 1.4× cream it clipped to a
  // white box after tone mapping and out-shone the whole nook.
  glow('#b8742f', WALL.left + .24, 1.14, tableZ - .05, .30, .22, .30, .85, 'lamp')
  glow('#ffd29a', WALL.left + .24, 1.028, tableZ - .05, .26, .005, .26, 4, 'lamp')
  L('#2a3148', .40, .655, tableZ + .08, .16, .03, .22); L('#5b1f1d', .40, .685, tableZ + .08, .14, .03, .2)
  L('#e8e0d0', .40, .74, tableZ - .12, .06, .08, .06)
  // Raised ceramic rim and a dark tea surface keep the mug from reading as
  // a plain white cube; the small squared handle suits the voxel room.
  L('#40291a', .40, .782, tableZ - .12, .041, .003, .041)
  for (const y of [.718, .761]) L('#d3c7ac', .448, y, tableZ - .12, .043, .012, .012)
  L('#d3c7ac', .465, .74, tableZ - .12, .012, .052, .012)
  // The practical stands a little out from the wall so it models both the
  // armchair and books. The former wall-hugging source lit only its own shade and
  // left this full side of the 280° sweep nearly black in seated captures.
  lights.push({ name: 'nook-lamp', color: '#ffae69', power: 3.2, range: 5.8, position: [WALL.left + .80, 1.42, tableZ + .15], flicker: 'lamp' })
  art(WALL.left, 1.98, chairZ, .42, .54, 'hound', '+x', false)

  // ── RIGHT WALL ───────────────────────────────────────────────────────────
  // Sideboard with candelabra, gingerbread house, punch and poinsettias.
  const sideZ = -1.6
  R('#3a2418', .24, .47, sideZ, .48, .8, 1.4); R('#4a3020', .26, .89, sideZ, .52, .04, 1.46)
  for (const [d, z] of [[.05, -2.25], [.05, -.95], [.43, -2.25], [.43, -.95]]) R('#2a1a12', d, .04, z, .04, .08, .04)
  for (const z of [-2.06, -1.6, -1.14]) { R('#452b1c', .485, .47, z, .01, .62, .4); R('#b08a48', .495, .52, z + .15, .015, .06, .015, brass) }
  // Recessed rounded drawer faces interrupt the large cabinet box. Sampling
  // only the carved fronts keeps thin handles and square joinery crisp.
  for (const z of [-2.06, -1.6, -1.14]) {
    sculpt('rounded', '#67432c', WALL.right - .505, .48, z, .025, .58, .36, .012)
    sculpt('rounded', '#875d38', WALL.right - .522, .48, z, .015, .48, .26, .007)
  }
  // Door insets need a shadow line, grain and visible hardware. The earlier
  // handles sat inside the new rounded fronts, so put them on the outer face.
  // Narrow rails also divide the broad case into believable joined parts.
  for (const z of [-2.06, -1.6, -1.14]) {
    for (const dz of [-.17, .17]) R('#382318', .54, .48, z + dz, .012, .53, .012)
    for (const y of [.215, .745]) R('#a17444', .54, y, z, .012, .014, .34)
    for (let i = -2; i <= 2; i++) R(i % 2 ? '#795032' : '#614026', .536, .48, z + i * .043, .005, .37, .006)
    R('#30231a', .55, .58, z + .11, .018, .065, .039)
    R('#bb914d', .568, .58, z + .11, .022, .025, .038, brass)
  }
  for (const y of [.13, .81, .865]) R('#6b482c', .50, y, sideZ, .055, .025, 1.42)
  // Gingerbread house.
  R('#8a5a2e', .24, .98, -2.02, .22, .14, .26)
  R('#f2ece0', .24, 1.07, -2.02, .26, .04, .30); R('#8a5a2e', .24, 1.1, -2.02, .18, .03, .26)
  R('#f2ece0', .24, 1.125, -2.02, .18, .03, .28); R('#f2ece0', .24, 1.155, -2.02, .09, .03, .28)
  R('#5a3a1e', .355, .95, -2.02, .01, .08, .05)
  for (const [y, z, c] of [[1.0, -2.11, '#b0282c'], [1.0, -1.93, '#2a7a45'], [.94, -2.12, '#e8e0d0']] as const) R(c, .355, y, z, .012, .018, .018)
  // Brass candelabra with five candles.
  R('#b08a48', .24, .94, -1.55, .1, .06, .1, brass); R('#b08a48', .24, 1.03, -1.55, .03, .16, .03, brass)
  R('#b08a48', .24, 1.11, -1.55, .03, .03, .38, brass)
  for (let i = 0; i < 5; i++) {
    const z = -1.73 + i * .09
    R('#efe6cf', .24, 1.18, z, .03, .12, .03)
    glow('#ffbf6a', WALL.right - .24, 1.26, z, .014, .03, .014, 5, 'candle')
  }
  // A sampled bowl and raised rim break up the row of rectangular tabletop
  // props; the flat burgundy punch surface stays just below its rolled lip.
  sculpt('ellipsoid', '#8c9180', WALL.right - .24, .956, -1.1, .24, .10, .24)
  R('#b9c4bd', .24, .95, -1.1, .18, .06, .18); R('#7a1f24', .24, .985, -1.1, .2, .01, .2)
  const poinsettia = (x: number, y: number, z: number, s: number) => {
    box(blocks, '#6a3220', x, y + .08 * s, z, .16 * s, .16 * s, .16 * s)
    for (let i = 0; i < 7; i++) {
      const a = i / 7 * Math.PI * 2, r = .07 * s
      // Neighbouring yawed bracts overlap in slivers. With one shared top
      // plane, the two reds z-fought there at grazing angles (review of #11).
      // Odd bracts (the darker red) sit 1mm higher, so every overlapping pair
      // has distinct depths; i=6 and i=0 meet at the same, even, colour.
      box(blocks, i % 2 ? '#a3161f' : '#c11d27', x + Math.cos(a) * r, y + .19 * s + (i % 2 ? .001 : 0), z + Math.sin(a) * r, .1 * s, .02 * s, .05 * s, { rot: -a })
      box(blocks, '#1f4a2c', x + Math.cos(a + .45) * r * .8, y + .175 * s, z + Math.sin(a + .45) * r * .8, .08 * s, .02 * s, .045 * s, { rot: -a - .45 })
    }
    box(blocks, '#e0b84a', x, y + .205 * s, z, .03 * s, .02 * s, .03 * s)
  }
  poinsettia(WALL.right - .3, .91, -.98, .8)
  poinsettia(WALL.right - .28, 0, -.62, 1.5)
  lights.push({ name: 'sideboard-candles', color: '#ffa052', power: 2.8, range: 5.3, position: [WALL.right - .62, 1.48, sideZ], flicker: 'candle' })
  art(WALL.right, 1.9, sideZ, 1.2, .8, 'village', '-x')
  garlands.push({ from: [WALL.right - .12, 2.45, sideZ - .75], to: [WALL.right - .12, 2.45, sideZ + .75], sag: .12 })

  // Second snowy window, green curtains, candles.
  const rZ = .65, rW = 1.3, rH = 1.64, rY = 1.97
  pictures.push({ kind: 'snowscape', position: [WALL.right - .016, rY, rZ], size: [rW, rH], facing: '-x', lit: false })
  R('#3a2a1e', .04, rY + rH / 2 + .04, rZ, .08, .08, rW + .12)
  for (const s of [-1, 1]) R('#3a2a1e', .04, rY, rZ + s * (rW / 2 + .04), .08, rH + .16, .08)
  R('#4a3526', .11, rY - rH / 2 - .03, rZ, .22, .06, rW + .26)
  R('#2a2019', .045, rY, rZ, .03, rH, .03); for (const y of [rY - rH / 6, rY + rH / 6]) R('#2a2019', .045, y, rZ, .03, .03, rW)
  for (const z of [rZ - .35, rZ + .35]) { R('#efe6cf', .12, rY - rH / 2 + .06, z, .045, .12, .045); glow('#ffbf6a', WALL.right - .12, rY - rH / 2 + .14, z, .014, .03, .014, 5, 'candle') }
  for (const side of [-1, 1]) for (let i = 0; i < 4; i++) R(i % 2 ? '#173826' : '#1f4a33', .1 + (i % 2) * .03, 1.72, rZ + side * (rW / 2 + .05 + i * .065), .06, 2.56, .066)
  R('#9a7a44', .12, 3.02, rZ, .025, .025, rW + .7, brass)
  wreaths.push({ position: [WALL.right - .1, rY + .12, rZ], radius: .15, facing: '-x' })

  // Coat corner: bench with gifts, hooks with coat, scarf and knit hat, sled.
  R('#4a3020', .2, .44, 2.3, .38, .06, .9); for (const z of [1.9, 2.7]) R('#3a2418', .2, .21, z, .34, .42, .05)
  for (const [z, w, h, c, rc] of [[2.02, .2, .16, '#7a1f24', '#c9a24e'], [2.3, .24, .1, '#1f4a33', '#c9a24e'], [2.56, .16, .26, '#c9b27a', '#8a1f24']] as const) {
    R(c, .2, .47 + h / 2, z, .18, h, w); R(rc, .2, .47 + h / 2, z, .185, h + .004, .025)
  }
  R('#4a3020', .02, 1.75, 2.35, .04, .1, .95); for (const z of [1.98, 2.3, 2.62]) R('#b08a48', .06, 1.72, z, .05, .02, .02, brass)
  R('#2a2420', .1, 1.28, 1.98, .14, .86, .36); R('#241f1c', .12, 1.62, 1.98, .12, .12, .3)
  R('#8a2226', .08, 1.36, 2.3, .03, .72, .12); for (const y of [1.1, 1.24, 1.38, 1.52]) R('#e8e0d0', .082, y, 2.3, .03, .04, .122)
  R('#1f4a33', .1, 1.62, 2.62, .14, .12, .16); R('#e8e0d0', .1, 1.71, 2.62, .06, .06, .06)
  R('#2a1a12', .3, .1, 2.12, .1, .2, .1); R('#2a1a12', .3, .1, 2.26, .1, .2, .1)
  // The entry bench gets a shaped apron, a lower shoe shelf and joinery pegs;
  // gift bows sit above the wrapping, so even this dark corner has handwork.
  sculpt('rounded', '#775033', WALL.right - .38, .39, 2.3, .055, .09, .86, .025)
  R('#332217', .20, .13, 2.3, .29, .028, .80)
  for (const z of [1.94, 2.66]) R('#b48b50', .412, .39, z, .008, .016, .016)
  for (const [z, y] of [[2.02, .635], [2.3, .575], [2.56, .735]]) {
    for (const dz of [-.027, .027]) sculpt('ellipsoid', '#a87539', WALL.right - .20, y, z + dz, .06, .025, .05)
  }
  // Wooden sled resting on the floor, runners curling up at the front, with a
  // gift strapped on. (Leaning it upright needed a tilt the block plan does not
  // author, and read as a ladder.)
  for (const d of [.16, .44]) { R('#8a2226', d, .03, 2.9, .025, .025, .8); R('#8a2226', d, .1, 2.52, .025, .14, .025) }
  for (let i = 0; i < 6; i++) R('#9a6a3a', .3, .075, 2.61 + i * .11, .36, .025, .08)
  R('#1f4a33', .3, .15, 2.9, .2, .12, .22); R('#c9a24e', .3, .15, 2.9, .205, .125, .03)

  // ── REAR WALL (behind the player; visible toward the corners) ───────────
  // Upright piano with candelabra, sheet music, photos and a bench.
  const pX = -3.15
  // The large piano case uses rounded sampled wood, while the thin keyboard,
  // individual keys and music rail remain precise blocks. A sampled shape is
  // useful for the silhouette; it would blur the small mechanical parts.
  sculpt('rounded', '#4c3024', pX, .65, WALL.rear - .31, 1.50, 1.30, .62, .07)
  sculpt('rounded', '#735039', pX, 1.29, WALL.rear - .33, 1.57, .085, .66, .035)
  sculpt('rounded', '#33231c', pX, 1.34, WALL.rear - .34, 1.43, .035, .58, .012)
  B('#1a1210', pX, .76, .72, 1.5, .06, .24)
  B('#e9e2d0', pX, .8, .74, 1.3, .015, .16)
  for (let i = 0; i < 48; i++) if ([1, 2, 4, 5, 6].includes(i % 7)) B('#111111', pX - .65 + i * .027 + .0135, .815, .70, .014, .02, .09)
  // Recessed upper panels, carved pilasters and a framed lower soundboard
  // supply detail on the broad visible face. Nothing changes the keyboard
  // footprint: individual keys remain readable mechanical pieces.
  for (const dx of [-.44, 0, .44]) {
    B('#36241b', pX + dx, 1.105, .629, .36, .27, .016)
    for (const edge of [-.18, .18]) B('#805a39', pX + dx + edge, 1.105, .642, .018, .30, .018)
    for (const y of [.955, 1.255]) B('#805a39', pX + dx, y, .642, .378, .018, .018)
  }
  for (const dx of [-.695, .695]) {
    sculpt('rounded', '#6e4830', pX + dx, .48, WALL.rear - .655, .07, .54, .08, .025)
    for (const y of [.22, .68]) B('#94653d', pX + dx, y, .668, .105, .055, .08)
  }
  B('#34231b', pX, .39, .626, 1.19, .48, .022)
  for (const y of [.145, .635]) B('#704c30', pX, y, .645, 1.23, .018, .018)
  for (const dx of [-.61, .61]) B('#704c30', pX + dx, .39, .645, .018, .49, .018)
  for (const dx of [-.12, 0, .12]) {
    B('#b18b4c', pX + dx, .075, .72, .034, .025, .16, brass)
    sculpt('rounded', '#a27b42', pX + dx, .085, WALL.rear - .80, .055, .03, .07, .012)
  }
  B('#231816', pX, .9, .63, 1.4, .12, .04)
  B('#231816', pX, 1.02, .58, .6, .02, .02)
  pictures.push({ kind: 'sheet-music', position: [pX, 1.12, WALL.rear - .671], size: [.42, .2], facing: '-z', lit: true })
  for (const x of [pX - .7, pX + .7]) B('#140e0c', x, .15, .82, .06, .3, .06)
  B('#1a1210', pX, .47, 1.05, .8, .06, .34); for (const x of [pX - .35, pX + .35]) B('#140e0c', x, .22, 1.05, .05, .44, .3)
  sculpt('rounded', '#43221a', pX, .518, WALL.rear - 1.05, .77, .06, .32, .027)
  for (const dx of [-.24, 0, .24]) B('#241511', pX + dx, .552, 1.05, .02, .008, .02)
  B('#b08a48', pX - .55, 1.37, .25, .1, .06, .1, brass); B('#b08a48', pX - .55, 1.46, .25, .22, .03, .03, brass)
  for (const dx of [-.09, 0, .09]) { B('#efe6cf', pX - .55 + dx, 1.53, .25, .03, .11, .03); glow('#ffbf6a', pX - .55 + dx, 1.61, WALL.rear - .25, .014, .03, .014, 5, 'candle') }
  for (const [dx, h] of [[-.05, .18], [.12, .14], [.26, .2]] as const) B('#9b7a3f', pX + dx, 1.34 + h / 2, .18, .14, h, .02, brass)
  poinsettia(pX + .55, 1.34, WALL.rear - .3, .9)
  garlands.push({ from: [pX - .8, 2.15, WALL.rear - .1], to: [pX + .8, 2.15, WALL.rear - .1], sag: .18 })
  art(pX, 2.55, WALL.rear, .9, .5, 'landscape', '-z', false)

  // Rear architecture needs its own rhythm, not one uninterrupted brick strip.
  // Timber bays and a continuous evergreen swag tie the piano and entrance
  // together; all of their small blocks join the same static/foliage batches.
  for (const x of [-4.43, -1.95, .96, 4.43]) {
    B('#37251b', x, 1.62, .075, .15, 3.15, .11)
    for (const edge of [-.052, .052]) B('#60432c', x + edge, 1.64, .139, .018, 3.10, .018)
    for (const y of [.13, 1.10, 3.13]) B('#765137', x, y, .14, .21, .075, .08)
  }
  for (const [from, to] of [[-4.35, -2.04], [-1.86, .87], [1.05, 4.34]]) {
    garlands.push({ from: [from, 3.08, WALL.rear - .19], to: [to, 3.08, WALL.rear - .19], sag: .21 })
  }
  // A framed festive hanging gives the centre bay an intentional focal point
  // even at the far edge of a seated turn. Burgundy wool, evergreen and brass
  // repeat the hearth's palette; none of this is an emissive wall panel.
  B('#4b3020', -.48, 2.12, .07, 1.48, 1.43, .06)
  B('#471f1c', -.48, 2.12, .108, 1.32, 1.27, .012)
  for (const x of [-1.16, .20]) B('#8b633a', x, 2.12, .125, .024, 1.32, .025)
  for (const y of [1.46, 2.78]) B('#8b633a', -.48, y, .125, 1.38, .024, .025)
  wreaths.push({ position: [-.48, 2.29, WALL.rear - .19], radius: .32, facing: '-z' })
  for (const [x, color] of [[-.88, '#8c3028'], [-.08, '#31563a']] as const) {
    sculpt('rounded', color, x, 1.80, WALL.rear - .17, .15, .30, .09, .04)
    sculpt('rounded', color, x + .045, 1.66, WALL.rear - .17, .24, .11, .09, .04)
    B('#bcaa7c', x, 1.95, .22, .17, .065, .025)
    for (const y of [1.78, 1.85]) B('#bb8c55', x, y, .222, .105, .012, .012)
  }

  // The old flat door backing ended EXACTLY on the dado moulding's .060m
  // face. At grazing camera angles those coplanar faces fought the depth
  // buffer, flashing stripes through the frame. A continuous opaque rebate
  // now stands fully ahead of every wall finish; casing, leaves, mouldings,
  // glass and hardware each have deliberate depth separation. Never solve
  // this with polygonOffset: the conflicting construction would still exist.
  const dX = 2.95
  B('#241b15', dX, 1.30, .106, 1.58, 2.60, .088)
  for (const x of [dX - .80, dX + .80]) {
    B('#533923', x, 1.30, .16, .16, 2.60, .10)
    for (const dx of [-.055, .055]) B('#94683f', x + dx, 1.32, .221, .018, 2.51, .022)
    for (const y of [.14, 2.44]) B('#755033', x, y, .222, .21, .16, .045)
    B('#b58a4f', x, 2.44, .248, .055, .055, .018, brass)
  }
  for (const [y, width, depth] of [[2.60, 1.79, .18], [2.68, 1.89, .20], [2.73, 1.99, .22]]) {
    B('#68452b', dX, y, depth, width, .075, .12)
  }
  for (let x = dX - .73; x < dX + .75; x += .105) B('#a57947', x, 2.62, .247, .04, .05, .025)
  B('#80613b', dX, .022, .20, 1.48, .045, .25)
  for (const x of [dX - .355, dX + .355]) {
    B('#503421', x, 1.26, .15, .69, 2.43, .028)
    for (const y of [.47, 1.22]) {
      B('#281d16', x, y, .172, .52, .57, .012)
      sculpt('rounded', '#785033', x, y, WALL.rear - .187, .44, .49, .035, .015)
      for (const dx of [-.26, .26]) B('#ac7846', x + dx, y, .217, .026, .62, .022)
      for (const yy of [y - .297, y + .297]) B('#94633b', x, yy, .217, .49, .026, .022)
      for (const dx of [-.13, -.045, .07, .145]) B('#624129', x + dx, y, .211, .006, .38, .006)
    }
    glow('#35434f', x, 1.98, WALL.rear - .18, .45, .53, .010, .30, 'steady')
    for (const dx of [-.245, .245]) B('#8d623a', x + dx, 1.98, .203, .035, .60, .045)
    for (const y of [1.69, 2.27]) B('#8d623a', x, y, .203, .455, .035, .045)
    B('#3b2a1d', x, 1.98, .216, .022, .53, .020)
    B('#3b2a1d', x, 1.98, .216, .45, .022, .020)
    B('#765332', x, .115, .183, .57, .12, .015, brass)
  }
  B('#2c2017', dX, 1.26, .205, .025, 2.43, .04)
  for (const x of [dX - .095, dX + .095]) {
    B('#9e7842', x, 1.03, .224, .060, .23, .018, brass)
    B('#2c2118', x, .969, .238, .014, .024, .012)
    B('#c39a55', x, 1.077, .26, .025, .10, .045, brass)
  }
  for (const x of [dX - .66, dX + .66]) for (const y of [.38, 1.29, 2.28]) {
    B('#33291f', x, y, .188, .060, .12, .022, brass)
    B('#af884d', x, y, .206, .018, .095, .022, brass)
  }
  wreaths.push({ position: [dX, 1.80, WALL.rear - .285], radius: .26, facing: '-z' })
  for (const x of [dX - 1.0, dX + 1.0]) {
    B('#1a1a1a', x, 2.1, .1, .03, .03, .2, brass)
    B('#1a1a1a', x, 2.02, .2, .2, .04, .2, brass); B('#1a1a1a', x, 1.72, .2, .18, .03, .18, brass)
    for (const [ox, od] of [[-.08, -.08], [-.08, .08], [.08, -.08], [.08, .08]]) B('#1a1a1a', x + ox, 1.87, .2 + od, .015, .28, .015, brass)
    glow('#e87e2c', x, 1.86, WALL.rear - .2, .06, .1, .06, 1.6, 'candle')
  }
  // One pool belongs to the door lanterns. The prior 8cd source at the rear
  // wall centre washed every panel orange, overpowering the hearth's cozy
  // falloff. Keep the door warm but let the corners recede naturally.
  lights.push({ name: 'rear-practicals', color: '#ffa55b', power: 2.7, range: 5.4, position: [dX - .45, 1.95, WALL.rear - .65], flicker: 'candle' })
  B('#5a4028', dX, -.0035, .45, 1.2, .013, .6)
  B('#2a1a12', dX + .85, .1, .2, .1, .2, .24); B('#2a1a12', dX + .98, .1, .2, .1, .2, .24)
  B('#2a3a2e', dX - .9, .3, .2, .2, .6, .2); B('#1a1a1a', dX - .93, .72, .2, .02, .3, .02); B('#6a2226', dX - .86, .68, .18, .02, .24, .02)
  garlands.push({ from: [dX - .91, 2.84, WALL.rear - .30], to: [dX + .91, 2.84, WALL.rear - .30], sag: .12 })

  // ── CEILING: fairy lights strung beam to beam across the whole room ──────
  // Five catenary strands sag between the x=integer beams. Kept at z away
  // from the table pendants (z=-.06) so they never cross a hanging lamp.
  for (const z of [-4.4, -2.9, -1.3, .45, 2.2]) {
    const strand: [number, number, number][] = []
    for (let x = -4.55; x <= 4.55 + 1e-9; x += .115) {
      const bay = x - Math.floor(x)
      strand.push([x, 3.27 - .15 * Math.sin(bay * Math.PI), z])
    }
    fairy.push(strand)
  }

  return { shell, blocks, sculpts, glows, lights, pictures, wreaths, garlands, fairy, pendulums }
}
export type SurroundPlan = ReturnType<typeof createSurroundPlan>
