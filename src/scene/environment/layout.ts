import { TABLE } from '../Table'
import { ASHTRAY } from '../props/specs'

/** The recorded 2.02m eye position plus far-side drink home required nearly 2m
 * of camera-to-wrist travel. A longer/stretchy sleeve cannot make that physical.
 * Bring the seated body to the table and keep leisure props on near felt. These
 * anchors are shared with the renderer; no consumer invents its own eye/home.
 * Tree/bar envelopes are a separate recorded-layout slice, not inferred here. */
export const PLAYER_LAYOUT = {
  eye: [0, 1.43, 1.50] as [number, number, number],
  // A body landmark, not a near-plane trick: 95mm below and55mm forward of
  // the seated eyes. Smoking, drinking and exhalation must agree on one mouth.
  // Camera inspection cannot move this point or pull held props through us.
  mouth: [0, 1.335, 1.445] as [number, number, number],
  look: [0, 1.03, -.60] as [number, number, number],
  body: [0, 0, 1.28] as [number, number, number],
  shoulder: [.192, 1.195, 1.305] as [number, number, number],
  drink: [.29, .7955, .84] as [number, number, number],
  cigar: [.105, TABLE.feltY + ASHTRAY.cigarRestY, .83] as [number, number, number],
  rest: [.205, 1.13, 1.07] as [number, number, number],
} as const

export const SEATS: [number, number][] = [[0, 1.7], [-1.82, -.39], [-1.10, -1.03], [0, -1.25], [1.10, -1.03], [1.82, -.39]]
export const seatYaw = (x: number, z: number): number => Math.atan2(-x * .8, .65 - z)
export const CHAIR_BLOCKS: { color: string; position: [number, number, number]; size: [number, number, number] }[] = [
  { color: '#211d1a', position: [0, .57, -.04], size: [.46, .10, .40] },
  { color: '#28231e', position: [0, 1.00, -.205], size: [.44, .75, .065] },
  ...[-.18, .18].map(x => ({ color: '#292824', position: [x, .29, -.04] as [number, number, number], size: [.030, .56, .03] as [number, number, number] })),
]

/** A clear bay between the bar's x=2.85 counter edge and x=4.74 wall face.
 * The full authored tree envelope (including gifts and ornaments) is 1.85m
 * wide. At 84% it leaves >16cm on both sides, rather than hiding intersections
 * behind the counter. Its light is tree-local so moving decor cannot leave an
 * unrelated bright patch at the old location. Floor contact is intentional;
 * every other furniture/wall envelope needs positive clearance. */
export const CHRISTMAS_LAYOUT = {
  tree: [3.795, 0, -3.55] as [number, number, number], scale: .84, clearance: .12,
  // Garland hangs in front of the bottles, not through their front faces. The
  // wreath stays below the lowest beam face at y=3.285 and ahead of the mirror.
  garlandDepth: -4.68, wreath: [0, 2.94, -4.63] as [number, number, number],
} as const
