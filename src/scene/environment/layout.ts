/** The recorded 2.02m eye position plus far-side drink home required nearly 2m
 * of camera-to-wrist travel. A longer/stretchy sleeve cannot make that physical.
 * Bring the seated body to the table and keep leisure props on near felt. These
 * anchors are shared with the renderer; no consumer invents its own eye/home.
 * Tree/bar envelopes are a separate recorded-layout slice, not inferred here. */
export const PLAYER_LAYOUT = {
  eye: [0, 1.43, 1.50] as [number, number, number],
  look: [0, 1.03, -.60] as [number, number, number],
  body: [0, 0, 1.28] as [number, number, number],
  shoulder: [.192, 1.195, 1.305] as [number, number, number],
  drink: [.29, .7955, .84] as [number, number, number],
  cigar: [.105, .825, .83] as [number, number, number],
  rest: [.205, 1.13, 1.07] as [number, number, number],
} as const
