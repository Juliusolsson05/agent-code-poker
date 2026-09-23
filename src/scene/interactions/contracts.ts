export type Vec3 = [number, number, number]
export type Quat = [number, number, number, number]
export type Pose = { position: Vec3; rotation: Quat }
export type Owner = 'table' | 'right-hand'
export type Action = 'idle' | 'drink' | 'smoke' | 'consume' | 'return'
export type Grip = 'rest' | 'cigar' | 'glass' | 'pinch'
/** A treat piece is either in the dish, pinched, or eaten (hidden until the
 * action ends and the next slot becomes the pick target). */
export type PieceOwner = Owner | 'consumed'

/** Every pose is WORLD-space metres. There is intentionally no camera transform
 * in this input: a look/inspection camera cannot drag a held glass through the
 * table, and a presenter cannot reinterpret a wrist as camera-local. Geometry
 * provides contact anchors; the director alone decides ownership and timing. */
export interface Calibration {
  shoulder: Vec3
  armLengths: [number, number]
  rest: Pose
  cigarHome: Pose
  drinkHome: Pose
  drinkMouth: Pose
  smokeHand: Pose
  glassHandRotation: Quat
  handGlassContact: Vec3
  glassContact: Vec3
  handCigarContact: Vec3
  /** Cosmetic treat dish (#14): its world pose on the felt, the pinched
   * piece's pose at the lips, the hand's world rotation when it pinches a
   * piece from the dish, and the pinch centre in hand space. Pieces rest
   * unrotated, so the hand frame at the dish is exactly pinchRotation. */
  treatHome: Pose
  treatMouth: Pose
  pinchRotation: Quat
  handPinchContact: Vec3
}

export interface InteractionPose {
  space: 'world'
  action: Action
  phase: string
  right: Pose & { grip: Grip }
  arm: { shoulder: Vec3; elbow: Vec3; wrist: Vec3; reachError: number }
  drink: Pose & { owner: Owner }
  cigar: Pose & { owner: Owner }
  /** The piece currently targeted: `slot` indexes the dish slots, and
   * `remaining` counts pieces still drawn (the held/eaten one excluded). */
  treat: Pose & { owner: PieceOwner; slot: number; remaining: number }
  inspectionReady: boolean
  busy: boolean
}
