import { Matrix4, Quaternion, Vector3 } from 'three'

/** Contact frames belong to the authored hand, not to individual characters.
 * Canonical fingers point +Y and palm +Z. In a glass grip, hand X runs up the
 * vessel and the fingers wrap its far side. The cylinder axis in hand space is
 * Y=.073, Z=.050 (36mm radius + 14mm palm contact). The former Z=.083 axis
 * floated 38mm from the palm while allowing 22mm finger penetration.
 * Values are fitted offline against deformed production skin, with clearance
 * for 2mm glass voxels; no optimization/geometry queries run per frame. */
export const GLASS_HAND_CONTACT: [number, number, number] = [-.004, .073, .014]
export const GLASS_HAND_ROTATION: [number, number, number, number] = new Quaternion()
  .setFromRotationMatrix(new Matrix4().makeBasis(new Vector3(0, 1, 0), new Vector3(0, 0, -1), new Vector3(-1, 0, 0))).toArray()

/** The same fitted wrap for a drinker who faces vessel-local +Z (opponents).
 * It is the hero frame turned half a revolution about the vessel's RADIAL X
 * axis, i.e. about the line through the palm contact, not about the vertical.
 * Why that axis: a cylinder maps onto itself under a half-turn about any radial
 * line, so every clearance fitted offline against production skin carries over
 * unchanged, and the palm stays on the vessel's +X face (the drinking arm's
 * outer side). The former π turn about Y also mapped the cylinder to itself but
 * moved the palm to the -X face, so opponents held the glass from the inside,
 * reaching across their own chest (#7). Fingers now point away from the body
 * and wrap the far side; the index finger sits on top of the grip. */
export const GLASS_HAND_ROTATION_FACING: [number, number, number, number] = new Quaternion(1, 0, 0, 0)
  .multiply(new Quaternion(...GLASS_HAND_ROTATION)).toArray() as [number, number, number, number]

// Two-finger cigar pinch: index below, middle above. Keeping the center near
// the fingertip pads (rather than through the proximal joints) leaves a visible
// shaft and avoids the former hooked-fist silhouette. Its local X axis remains
// the cigar axis, so tray rest and bite targets can transport the same frame.
export const CIGAR_HAND_CONTACT: [number, number, number] = [-.009, .120, .038]
