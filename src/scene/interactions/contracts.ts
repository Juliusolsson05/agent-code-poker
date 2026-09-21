export type Vec3 = [number, number, number]
export type Quat = [number, number, number, number]
export type Pose = { position: Vec3; rotation: Quat }
export type Owner = 'table' | 'right-hand'
export type Action = 'idle' | 'drink' | 'smoke' | 'return'
export type Grip = 'rest' | 'cigar' | 'glass'

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
}

export interface InteractionPose {
  space: 'world'
  action: Action
  phase: string
  right: Pose & { grip: Grip }
  arm: { shoulder: Vec3; elbow: Vec3; wrist: Vec3; reachError: number }
  drink: Pose & { owner: Owner }
  cigar: Pose & { owner: Owner }
  inspectionReady: boolean
  busy: boolean
}
