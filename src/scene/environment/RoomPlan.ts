/** Actual rendered room placements, in metres. The renderer and clearance tests
 * consume this one plan: a separately drawn test rectangle can quietly bless
 * furniture intersections when the production bar or wall changes. No DOM,
 * renderer, private game state or time belongs in the placement contract. */
export type RoomBlock = { color: string; position: [number, number, number]; size: [number, number, number] }
type Glow = [color: string, x: number, y: number, z: number, sx: number, sy: number, sz: number, strength?: number]
type Sign = [text: string, x: number, y: number, z: number, width: number, height: number, small?: boolean]
type Practical = [color: string, power: number, x: number, y: number, z: number]

export function createRoomPlan() {
  const blocks: RoomBlock[] = [], glows: Glow[] = [], signs: Sign[] = [], lights: Practical[] = []
  const glow = (...args: Glow) => glows.push(args)
  const sign = (...args: Sign) => signs.push(args)
  const b = (color: string, x: number, y: number, z: number, sx: number, sy: number, sz: number) => blocks.push({ color, position: [x, y, z], size: [sx, sy, sz] })
  b('#151311', 0, -.06, -1, 12, .1, 13)
  for (let row = 0; row < 28; row++) for (let col = 0; col < 25; col++)
    b(['#322821', '#2b2421', '#352a25', '#292420'][(col * 7 + row * 3) % 4], (col - 12) * .39 + row % 2 * .19, row * .13 + .04, -5.3, .377, .117, .12)
  b('#161716', -4.8, 1.8, -1.2, .12, 3.6, 8); b('#181614', 4.8, 1.8, -1.2, .12, 3.6, 8); b('#10100f', 0, 3.6, -1.2, 10, .12, 9)
  for (let x = -4; x <= 4; x++) b('#221d18', x, 3.40, -1.1, .12, .23, 8)
  // Dark back-bar mirror, brass uprights and individually labelled bottles
  // supply scale/depth. Their highlights stay subordinate to faces and felt.
  b('#14181a', 0, 1.93, -5.15, 4.50, 2.5, .08)
  for (const x of [-2.3, -.76, .76, 2.3]) b('#705333', x, 1.87, -5.00, .035, 2.3, .10)
  for (const y of [1.13, 1.80, 2.48]) {
    b('#4a3526', 0, y, -4.89, 4.65, .055, .47); glow('#f2b269', 0, y - .032, -4.95, 4.3, .012, .03)
    for (let i = 0; i < 20; i++) {
      const x = -2.10 + i * .22, h = .22 + i % 4 * .038, color = ['#574125', '#253e30', '#65452a', '#334132', '#604029'][i % 5]
      b(color, x, y + h / 2 + .032, -4.87, .078, h, .078); b(color, x, y + h + .06, -4.87, .039, .076, .039)
      b('#a49673', x, y + h + .106, -4.87, .043, .018, .043); b(i % 3 ? '#9c8863' : '#3c332a', x, y + h * .47, -4.825, .063, h * .34, .003)
    }
  }
  b('#201712', 0, .55, -3.82, 5.4, 1.1, .68)
  for (let x = -2.5; x < 2.6; x += .39) { b('#34241c', x, .54, -3.46, .35, .91, .027); b('#6b5032', x, .91, -3.44, .30, .016, .016) }
  b('#392e26', 0, 1.12, -3.76, 5.7, .10, .92); b('#8b673d', 0, .16, -3.18, 5.3, .035, .035)
  for (const x of [-1.7, -.55, .65, 1.8]) {
    b('#171818', x, .36, -2.98, .036, .69, .036); b('#2b201c', x, .72, -2.98, .36, .09, .36); b('#27221d', x, .045, -2.98, .34, .06, .34)
  }
  b('#151719', -3.55, 2.01, -5.17, 1.35, 2.15, .15)
  for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) {
    b('#26303d', -3.96 + x * .41, 1.34 + y * .65, -5.05, .37, .60, .05)
  }
  // Mullions stand in front of the bounded outdoor particles. This preserves
  // window depth rather than letting a snow overlay pass across the timber.
  for (const x of [-4.17, -3.755, -3.345, -2.93]) b('#28241f', x, 1.99, -4.99, .034, 1.96, .04)
  for (const y of [1.025, 1.665, 2.315, 2.965]) b('#28241f', -3.55, y, -4.99, 1.28, .034, .04)
  for (const x of [-3, 3]) {
    b('#705232', x, 2.25, -5.04, .07, .36, .13); b('#a47d46', x, 2.30, -4.89, .26, .22, .19)
    glow('#ffce8d', x, 2.16, -4.90, .17, .035, .12)
    lights.push(['#eaaa65', 2, x, 2.14, -4.60])
  }
  sign('THE RIVER', 3.55, 2.33, -5.08, 1.85, .42); sign('PRIVATE CARD ROOM', 3.55, 1.98, -5.07, 1.85, .18, true)
  b('#211a16', 0, .65, 0, 3.0, .20, 1.7); b('#181615', 0, .32, 0, 1.6, .6, .65)
  for (const x of [-1.08, 1.08]) {
    b('#5a4936', x, 3.12, -.06, .012, .90, .012)
    for (let row = 0; row < 9; row++) b('#51412d', x, 2.76 - row * .014, -.06, .18 + row * .040, .015, .15 + row * .027)
    glow('#ffdca1', x, 2.637, -.06, .42, .008, .29, 5)
  }
  return { blocks, glows, signs, lights }
}

