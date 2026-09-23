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

export const WALL = { left: -4.74, right: 4.74, rear: 3.34, back: -5.24, floor: -.01, ceiling: 3.54 } as const

const rnd = (i: number) => { const v = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v) }

export function createSurroundPlan() {
  const shell: SurroundBlock[] = [], blocks: SurroundBlock[] = [], glows: SurroundGlow[] = [], lights: SurroundLight[] = []
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

  // ── Shell: close the room behind the player and finish every wall ────────
  // The old side walls stopped at z=2.8 and there was no rear wall, so turning
  // past ~120° looked into the clear colour. Beams continue to the new wall.
  box(shell, '#1a1512', 0, 1.8, WALL.rear + .06, 9.72, 3.6, .12)
  for (const x of [-4.8, 4.8]) box(shell, x < 0 ? '#161716' : '#181614', x, 1.8, 3.13, .12, 3.6, .66)
  for (let x = -4; x <= 4; x++) box(shell, '#221d18', x, 3.40, 3.12, .12, .23, .44)
  // Wainscoting + wallpaper on the three walls the player turns to face. Dark
  // near-black paint read as void at night; warm panelling and deep red paper
  // give every direction a surface the practicals can actually light.
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
    }
    // Wallpaper: alternating burgundy stripes with a thin gold pinstripe.
    const stripes = Math.round(length / .18)
    for (let i = 0; i < stripes; i++) {
      const a = from + (i + .5) * length / stripes
      at(.006, 2.15, a, .012, 2.1, length / stripes, i % 2 ? '#3b1b1b' : '#341818')
      if (i % 4 === 0) at(.008, 2.15, a - length / stripes / 2, .012, 2.1, .012, '#6b4d2e')
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
  for (const [w, c] of [[1.4, '#8a6a35'], [1.1, '#5a1a1a'], [.5, '#8a6a35']] as const) box(blocks, c, 0, -.002 + w * .0005, -.25, w, .016, w, { rot: Math.PI / 4 })

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
      if (rnd(seed++) < .3) L('#c9a24e', .03 + d + .001, y + .0125 + h * .78, z + w / 2, .002, .012, w * .8)
      z += w + .003
    }
  }
  // Nutcracker (voxel toy soldier) and candle jar on the middle shelf.
  const nz = -4.2, ny = .98 + .0125
  L('#1a1a1a', .15, ny + .03, nz, .06, .06, .07); L('#8a1f24', .15, ny + .12, nz, .07, .12, .08)
  L('#d9bf8f', .15, ny + .21, nz, .05, .06, .06); L('#1a1a1a', .15, ny + .27, nz, .06, .07, .065)
  L('#c9a24e', .15, ny + .12, nz, .072, .015, .082, brass)
  L('#9a2a2a', .15, ny + .05, -4.08, .07, .09, .07)
  glow('#ffb15c', WALL.left + .15, ny + .11, -4.08, .018, .03, .018, 4.5, 'candle')

  // Snowy side window with heavy curtains, candles on the sill and a wreath.
  const winZ = -2.0, winY = 1.9, winW = 1.5, winH = 1.8
  pictures.push({ kind: 'snowscape', position: [WALL.left + .004, winY, winZ], size: [winW, winH], facing: '+x', lit: false })
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
  L('#3a2418', .13, .15, clockZ, .26, .3, .5); L('#452b1c', .12, 1.0, clockZ, .22, 1.4, .38)
  L('#140f0c', .232, .95, clockZ, .006, .86, .24)
  L('#452b1c', .14, 1.95, clockZ, .28, .5, .46); L('#3a2418', .15, 2.24, clockZ, .3, .08, .52)
  L('#c9a24e', .152, 2.3, clockZ, .04, .06, .1, brass)
  pictures.push({ kind: 'clock', position: [WALL.left + .282, 1.95, clockZ], size: [.32, .32], facing: '+x', lit: true })
  pendulums.push({ pivot: [WALL.left + .226, 1.36, clockZ], length: .66, facing: '+x' })

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
    if (facing === '-z') { box(blocks, '#8a6a3a', x, ly, z - .1, len, .03, .05, brass); glow('#ffd9a0', x, ly - .02, z - .1, len * .9, .008, .02, 3, 'steady') }
    else {
      const d = facing === '+x' ? .1 : -.1
      box(blocks, '#8a6a3a', x + d, ly, z, .05, .03, len, brass); glow('#ffd9a0', x + d, ly - .02, z, .02, .008, len * .9, 3, 'steady')
    }
  }
  art(WALL.left, 1.85, .55, 1.0, .74, 'landscape', '+x')

  // Reading nook: wingback armchair, lamp table, blanket, footstool, rug.
  const chairZ = 2.1
  for (const [d, z] of [[.12, 1.8], [.12, 2.4], [.62, 1.8], [.62, 2.4]]) L('#1f140e', d, .05, z, .05, .1, .05)
  L('#4f1a18', .37, .25, chairZ, .6, .3, .72); L('#5c201d', .40, .44, chairZ, .52, .09, .6)
  L('#4f1a18', .09, .85, chairZ, .16, .95, .72)
  for (const side of [-1, 1]) {
    L('#4f1a18', .22, 1.02, chairZ + side * .33, .3, .5, .08)
    L('#551c1a', .36, .55, chairZ + side * .34, .6, .26, .1); L('#5c201d', .38, .69, chairZ + side * .34, .6, .05, .12)
  }
  L('#c8a86a', .2, .72, chairZ, .1, .28, .34)
  // Plaid blanket draped over the near arm.
  L('#7a2226', .40, .725, chairZ + .34, .34, .02, .16); L('#7a2226', .40, .5, chairZ + .43, .34, .44, .02)
  for (const y of [.36, .5, .64]) L('#1f4a33', .40, y, chairZ + .441, .34, .03, .004)
  for (const d of [.3, .44]) L('#1f4a33', d, .5, chairZ + .442, .025, .44, .004)
  L('#6a2a22', .70, -.0035, chairZ - .05, 1.3, .013, 1.5)
  L('#4f1a18', .95, .22, chairZ, .38, .18, .38); for (const [dd, zz] of [[.8, 1.95], [1.1, 2.25]]) L('#1f140e', dd, .06, zz, .04, .12, .04)
  const tableZ = 1.35
  L('#3a2418', .28, .62, tableZ, .46, .04, .46); for (const [dd, zz] of [[.08, 1.15], [.08, 1.55], [.48, 1.15], [.48, 1.55]]) L('#2a1a12', dd, .3, zz, .03, .6, .03)
  L('#7d5a32', .24, .72, tableZ - .05, .12, .16, .12, brass); L('#9a7a44', .24, .92, tableZ - .05, .02, .26, .02, brass)
  // A lit fabric shade glows amber, not white: at 1.4× cream it clipped to a
  // white box after tone mapping and out-shone the whole nook.
  glow('#b8742f', WALL.left + .24, 1.14, tableZ - .05, .30, .22, .30, .85, 'lamp')
  glow('#ffd29a', WALL.left + .24, 1.028, tableZ - .05, .26, .005, .26, 4, 'lamp')
  L('#2a3148', .40, .655, tableZ + .08, .16, .03, .22); L('#5b1f1d', .40, .685, tableZ + .08, .14, .03, .2)
  L('#e8e0d0', .40, .74, tableZ - .12, .06, .08, .06)
  lights.push({ name: 'nook-lamp', color: '#ffb466', power: 3.4, range: 5.2, position: [WALL.left + .45, 1.25, tableZ + .1], flicker: 'lamp' })
  art(WALL.left, 1.98, chairZ, .42, .54, 'hound', '+x', false)

  // ── RIGHT WALL ───────────────────────────────────────────────────────────
  // Sideboard with candelabra, gingerbread house, punch and poinsettias.
  const sideZ = -1.6
  R('#3a2418', .24, .47, sideZ, .48, .8, 1.4); R('#4a3020', .26, .89, sideZ, .52, .04, 1.46)
  for (const [d, z] of [[.05, -2.25], [.05, -.95], [.43, -2.25], [.43, -.95]]) R('#2a1a12', d, .04, z, .04, .08, .04)
  for (const z of [-2.06, -1.6, -1.14]) { R('#452b1c', .485, .47, z, .01, .62, .4); R('#b08a48', .495, .52, z + .15, .015, .06, .015, brass) }
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
  R('#b9c4bd', .24, .95, -1.1, .24, .08, .24); R('#7a1f24', .24, .985, -1.1, .2, .01, .2)
  const poinsettia = (x: number, y: number, z: number, s: number) => {
    box(blocks, '#6a3220', x, y + .08 * s, z, .16 * s, .16 * s, .16 * s)
    for (let i = 0; i < 7; i++) {
      const a = i / 7 * Math.PI * 2, r = .07 * s
      box(blocks, i % 2 ? '#a3161f' : '#c11d27', x + Math.cos(a) * r, y + .19 * s, z + Math.sin(a) * r, .1 * s, .02 * s, .05 * s, { rot: -a })
      box(blocks, '#1f4a2c', x + Math.cos(a + .45) * r * .8, y + .175 * s, z + Math.sin(a + .45) * r * .8, .08 * s, .02 * s, .045 * s, { rot: -a - .45 })
    }
    box(blocks, '#e0b84a', x, y + .205 * s, z, .03 * s, .02 * s, .03 * s)
  }
  poinsettia(WALL.right - .3, .91, -.98, .8)
  poinsettia(WALL.right - .28, 0, -.62, 1.5)
  lights.push({ name: 'sideboard-candles', color: '#ffa95a', power: 2.8, range: 5, position: [WALL.right - .45, 1.35, sideZ], flicker: 'candle' })
  art(WALL.right, 1.9, sideZ, 1.2, .8, 'village', '-x')
  garlands.push({ from: [WALL.right - .12, 2.45, sideZ - .75], to: [WALL.right - .12, 2.45, sideZ + .75], sag: .12 })

  // Second snowy window, green curtains, candles.
  const rZ = .65, rW = 1.3, rH = 1.7, rY = 1.9
  pictures.push({ kind: 'snowscape', position: [WALL.right - .004, rY, rZ], size: [rW, rH], facing: '-x', lit: false })
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
  // Wooden sled resting on the floor, runners curling up at the front, with a
  // gift strapped on. (Leaning it upright needed a tilt the block plan does not
  // author, and read as a ladder.)
  for (const d of [.16, .44]) { R('#8a2226', d, .03, 2.9, .025, .025, .8); R('#8a2226', d, .1, 2.52, .025, .14, .025) }
  for (let i = 0; i < 6; i++) R('#9a6a3a', .3, .075, 2.61 + i * .11, .36, .025, .08)
  R('#1f4a33', .3, .15, 2.9, .2, .12, .22); R('#c9a24e', .3, .15, 2.9, .205, .125, .03)

  // ── REAR WALL (behind the player; visible toward the corners) ───────────
  // Upright piano with candelabra, sheet music, photos and a bench.
  const pX = -3.15
  B('#1a1210', pX, .65, .31, 1.5, 1.3, .62); B('#231816', pX, 1.32, .33, 1.56, .04, .66)
  B('#1a1210', pX, .76, .72, 1.5, .06, .24)
  B('#e9e2d0', pX, .8, .74, 1.3, .015, .16)
  for (let i = 0; i < 48; i++) if ([1, 2, 4, 5, 6].includes(i % 7)) B('#111111', pX - .65 + i * .027 + .0135, .815, .70, .014, .02, .09)
  B('#231816', pX, .9, .63, 1.4, .12, .04)
  B('#231816', pX, 1.02, .58, .6, .02, .02)
  pictures.push({ kind: 'sheet-music', position: [pX, 1.12, WALL.rear - .592], size: [.42, .2], facing: '-z', lit: true })
  for (const x of [pX - .7, pX + .7]) B('#140e0c', x, .15, .82, .06, .3, .06)
  B('#1a1210', pX, .47, 1.05, .8, .06, .34); for (const x of [pX - .35, pX + .35]) B('#140e0c', x, .22, 1.05, .05, .44, .3)
  B('#b08a48', pX - .55, 1.37, .25, .1, .06, .1, brass); B('#b08a48', pX - .55, 1.46, .25, .22, .03, .03, brass)
  for (const dx of [-.09, 0, .09]) { B('#efe6cf', pX - .55 + dx, 1.53, .25, .03, .11, .03); glow('#ffbf6a', pX - .55 + dx, 1.61, WALL.rear - .25, .014, .03, .014, 5, 'candle') }
  for (const [dx, h] of [[-.05, .18], [.12, .14], [.26, .2]] as const) B('#9b7a3f', pX + dx, 1.34 + h / 2, .18, .14, h, .02, brass)
  poinsettia(pX + .55, 1.34, WALL.rear - .3, .9)
  garlands.push({ from: [pX - .8, 2.15, WALL.rear - .1], to: [pX + .8, 2.15, WALL.rear - .1], sag: .18 })
  art(pX, 2.55, WALL.rear, .9, .5, 'landscape', '-z', false)

  // Entrance door: double leaves, frosted panes, wreath, lanterns, doormat.
  const dX = 2.95
  B('#3a2418', dX, 1.25, .03, 1.5, 2.5, .06)
  for (const x of [dX - .29, dX + .29]) {
    B('#4f3320', x, 1.16, .07, .56, 2.28, .05)
    for (const y of [.55, 1.35]) B('#5a3b25', x, y, .1, .4, .66, .012)
    glow('#6d86a8', x, 1.98, WALL.rear - .097, .3, .34, .006, .7, 'steady')
    B('#3a2418', x, 1.98, .098, .02, .34, .006); B('#3a2418', x, 1.98, .098, .3, .02, .006)
  }
  for (const x of [dX - .06, dX + .06]) B('#b08a48', x, 1.08, .11, .02, .14, .02, brass)
  wreaths.push({ position: [dX, 1.7, WALL.rear - .13], radius: .24, facing: '-z' })
  for (const x of [dX - 1.0, dX + 1.0]) {
    B('#1a1a1a', x, 2.1, .1, .03, .03, .2, brass)
    B('#1a1a1a', x, 2.02, .2, .2, .04, .2, brass); B('#1a1a1a', x, 1.72, .2, .18, .03, .18, brass)
    for (const [ox, od] of [[-.08, -.08], [-.08, .08], [.08, -.08], [.08, .08]]) B('#1a1a1a', x + ox, 1.87, .2 + od, .015, .28, .015, brass)
    glow('#ff9f45', x, 1.86, WALL.rear - .2, .06, .1, .06, 2.2, 'candle')
  }
  lights.push({ name: 'door-lanterns', color: '#ffb25e', power: 2.6, range: 5, position: [dX, 2.0, WALL.rear - .6], flicker: 'candle' })
  B('#5a4028', dX, -.0035, .45, 1.2, .013, .6)
  B('#2a1a12', dX + .85, .1, .2, .1, .2, .24); B('#2a1a12', dX + .98, .1, .2, .1, .2, .24)
  B('#2a3a2e', dX - .9, .3, .2, .2, .6, .2); B('#1a1a1a', dX - .93, .72, .2, .02, .3, .02); B('#6a2226', dX - .86, .68, .18, .02, .24, .02)
  garlands.push({ from: [dX - .82, 2.55, WALL.rear - .1], to: [dX + .82, 2.55, WALL.rear - .1], sag: .08 })

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

  return { shell, blocks, glows, lights, pictures, wreaths, garlands, fairy, pendulums }
}
export type SurroundPlan = ReturnType<typeof createSurroundPlan>
