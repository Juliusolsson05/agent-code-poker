import { Euler, MathUtils, Matrix4, Quaternion, Vector3 } from 'three'
import { CIGAR, ASHTRAY } from '../../scene/props/specs'
import { CIGAR_HAND_CONTACT } from '../../scene/HandGrips'
import { NPC_REST_ROTATION, NPC_REST_WRIST } from './GlassApproach'

// One body-local route owns an opponent's whole smoke: fetch the cigar from
// its ashtray, puff at the ANIMATED lips, put it back. Human is the only
// production consumer (like GlassApproach). Only prop specs and the fitted
// hand contact come in; no meshes, clocks, camera or poker state.
//
// Why a separate route instead of the hero's Leisure state machine: the hero
// is a camera with no face, fixed lips and no neighbours. An opponent's lips
// move with gaze/tilt every frame, and his tray shares crowded felt with his
// glass, cards and resting hand. The hero's contact FRAME is reused exactly
// (CIGAR_HAND_CONTACT: hand frame == cigar frame, offset only), so every
// clearance fitted against production skin for the held pinch carries over.

const basis = (x: Vector3, y: Vector3, z: Vector3) => new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(x, y, z))

/** Felt height in body-local metres (TABLE.feltY; the body root sits on the
 * floor at y=0, and opponents never tilt). Kept as data here so this module
 * does not import the table's geometry builder; a test pins it to TABLE. */
export const NPC_FELT_Y = .7925

/** Where the cigar lies when nobody holds it: across BOTH notches of the tray,
 * exactly the hero's rest, so it is physically supported (a one-notch
 * cantilever with the grip outside the rim would tip over).
 *
 * Why here, in front of the body just right of centre, and not beside the
 * glass: the pinch puts one finger UNDER the shaft, so no pickup that slides
 * along the axis or approaches sideways can avoid pushing that finger through
 * the tray wall. The only clean pickup is from above with the fingers pointing
 * down (see TRAY rotation below), which needs the wrist ~12cm above and ~4cm
 * beyond the cigar. Right of the glass that wrist position is out of reach
 * (arm length .57m) or inside the glass; in front of the body it is an easy
 * .51m reach. x=.05 keeps the resting hand's fingertips (x>=.131 at rest) off
 * the ember end (x<=.131) and puts the tray between the card hand and glass.
 *
 * Known limitation, not solved here: opponents' chip stacks are laid out in
 * world space (ChipField.anchor) with no knowledge of props, and no spot on
 * the felt in front of an opponent is free of every seat's stack. The coaster
 * and resting hand already share this. Moving the stacks is a layout change of
 * its own. */
export const NPC_CIGAR_REST = [.05, NPC_FELT_Y + ASHTRAY.cigarRestY, .41] as const

/** Tray pinch: cigar axis (hand X) along body +x, ember toward the glass;
 * fingers (hand Y) pointing DOWN; palm (hand Z) facing the body. That is a
 * flexed wrist reaching over the tray, the natural way to lift something from
 * above. It keeps the finger that was "under" the shaft beside it instead, and
 * the fingertips dip only 6.6mm below the axis into the tray's open well (12mm
 * above its floor, 13mm from its wall). */
export const NPC_CIGAR_TRAY_ROTATION = basis(new Vector3(1, 0, 0), new Vector3(0, -1, 0), new Vector3(0, 0, -1))

/** Smoke frame. Starts from the hero's recipe mirrored to a body facing +Z:
 * solve the PROP's shaft first (ember forward, a little outward to the smoking
 * arm's side, slightly down), keep the fingers up, transport the fitted hand
 * frame. Unlike the hero, an opponent has a chest under his chin: the mirrored
 * hero frame (.28,-.10, fingers vertical) put the heel of the hand ~1300 skin
 * vertices into the upper chest at the collar, because the wrist hangs 12cm
 * below the lips. Two changes fix that without moving the lips contact:
 * - roll the hand ~38° about the cigar axis (the pinch is symmetric about its
 *   own shaft, so every fitted clearance holds): fingers lean toward the
 *   midline and the wrist swings out and forward, off the sternum;
 * - a slightly less outward, flatter shaft (.20,-.05).
 * These come from a sweep over shaft/roll that checked hand vs torso, head
 * and the midline on seats 1/3/5 at three gazes; this point sits in the middle
 * of the clear region (its neighbours pass too), not on its edge. The full
 * route is re-verified frame by frame in npc-smoking.test.ts. */
const shaft = new Vector3(.20, -.05, 1).normalize()
const up = new Vector3(0, 1, 0).addScaledVector(shaft, -shaft.y).normalize()
export const NPC_CIGAR_SMOKE_ROTATION = basis(shaft, up, new Vector3().crossVectors(shaft, up))
  .multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), .66))

/** Seconds from the start of a smoke. Phase boundaries are the ownership
 * contract: the tray owns the cigar before 'lift' and from 'withdraw' on. */
export const NPC_SMOKE = { clear: .4, form: .95, approach: 1.25, lift: 1.55, raise: 2.4, puff: 3.4, lower: 4.25, set: 4.55, withdraw: 4.85, release: 5.4, settle: 5.8 } as const
export const NPC_SMOKE_SECONDS = NPC_SMOKE.settle

// Vertical clearance of the pre-formed pinch above its final contact. The
// fingertips reach only 8mm past the cigar axis (skin y<=.128 vs contact .120),
// so any positive descent clears; 7cm also clears the rest-pose fingers while
// they close in free air.
const DESCENT = .07
const LIFT = .06

export type CigarFrame = {
  wrist: Vector3; rotation: Quaternion; grip: number; phase: string
  owner: 'table' | 'hand'; cigar: { position: Vector3; rotation: Quaternion }; ember: number
}

const contact = new Vector3(...CIGAR_HAND_CONTACT)
const bite = new Vector3(...CIGAR.bite).add(contact)
/** Wrist that places the cigar origin at `origin` with the given hand frame. */
const wristFor = (origin: Vector3, rotation: Quaternion) => origin.clone().sub(contact.clone().applyQuaternion(rotation))
/** Wrist that puts the cigar's BITE point exactly on `mouth`. */
export const smokeWrist = (mouth: Vector3) => mouth.clone().sub(bite.clone().applyQuaternion(NPC_CIGAR_SMOKE_ROTATION))

export function cigarRoute(age: number, mouth: Vector3): CigarFrame {
  const S = NPC_SMOKE
  const restCigar = new Vector3(...NPC_CIGAR_REST)
  const rest = new Vector3(...NPC_REST_WRIST), restRotation = new Quaternion().setFromEuler(new Euler(...NPC_REST_ROTATION))
  const tray = NPC_CIGAR_TRAY_ROTATION
  const onTray = wristFor(restCigar, tray)
  // The fingertips-first descent is along hand +Y, which the tray frame points
  // straight down: its swept clearance is proven in npc-smoking.test.ts for
  // any descent, so the path is a plain vertical line above the contact.
  const above = onTray.clone().setY(onTray.y + DESCENT), lifted = onTray.clone().setY(onTray.y + LIFT)
  const clear = rest.clone().setY(above.y)
  const atMouth = smokeWrist(mouth)
  const step = (u: number, a: number, b: number) => MathUtils.smoothstep(u, a, b)
  let wrist: Vector3, rotation = tray.clone(), grip = 1, phase: string, owner: 'table' | 'hand' = 'table', ember = 0
  const t = Math.max(0, age)
  if (t >= S.settle) { wrist = rest; rotation = restRotation.clone(); grip = 0; phase = 'rest' }
  else if (t < S.clear) { wrist = rest.lerp(clear, step(t, 0, S.clear)); rotation = restRotation.clone(); grip = 0; phase = 'clear' }
  else if (t < S.form) {
    // Rotate and close the pinch above the tray's height, far from the shaft;
    // closing it next to the cigar is the mistake the glass route documents.
    const u = step(t, S.clear, S.form)
    wrist = clear.lerp(above, u); rotation = restRotation.clone().slerp(tray, u); grip = u; phase = 'form'
  } else if (t < S.approach) { wrist = above.lerp(onTray, step(t, S.form, S.approach)); phase = 'approach' }
  else if (t < S.lift) { wrist = onTray.lerp(lifted, step(t, S.approach, S.lift)); owner = 'hand'; phase = 'lift' }
  else if (t < S.raise) {
    const u = step(t, S.lift, S.raise)
    wrist = lifted.lerp(atMouth, u); rotation = tray.clone().slerp(NPC_CIGAR_SMOKE_ROTATION, u); owner = 'hand'; phase = 'raise'
  } else if (t < S.puff) {
    wrist = atMouth; rotation = NPC_CIGAR_SMOKE_ROTATION.clone(); owner = 'hand'; phase = 'puff'
    ember = Math.sin(step(t, S.raise, S.puff) * Math.PI)
  } else if (t < S.lower) {
    const u = step(t, S.puff, S.lower)
    wrist = atMouth.lerp(lifted, u); rotation = NPC_CIGAR_SMOKE_ROTATION.clone().slerp(tray, u); owner = 'hand'; phase = 'lower'
  } else if (t < S.set) { wrist = lifted.lerp(onTray, step(t, S.lower, S.set)); owner = 'hand'; phase = 'set' }
  else if (t < S.withdraw) { wrist = onTray.lerp(above, step(t, S.set, S.withdraw)); phase = 'withdraw' }
  else if (t < S.release) {
    const u = step(t, S.withdraw, S.release)
    wrist = above.lerp(clear, u); rotation = tray.clone().slerp(restRotation, u); grip = 1 - u; phase = 'release'
  } else { wrist = clear.lerp(rest, step(t, S.release, S.settle)); rotation = restRotation.clone(); grip = 0; phase = 'settle' }
  // While held, the cigar is the hand frame translated by the fitted contact:
  // one rigid transport, so no phase can open a gap between pads and wrapper.
  const cigar = owner === 'hand'
    ? { position: wrist.clone().add(contact.clone().applyQuaternion(rotation)), rotation: rotation.clone() }
    : { position: restCigar, rotation: tray.clone() }
  return { wrist, rotation, grip, phase, owner, cigar, ember }
}
