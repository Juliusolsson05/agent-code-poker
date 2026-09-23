/** Point the Web Audio listener along the camera. Shared by every spatial
 * source (fire ambience, chat voices) because there is ONE listener per
 * AudioContext: two owners computing it differently would make the fire and a
 * speaking player disagree about where "left" is.
 *
 * Three/Web Audio share right-handed world coordinates. Matrix column 2 is
 * camera-backward, hence its NEGATION is forward; screen-space panning or an
 * un-negated Z flips left/right as the player looks around. */
export function applyListenerMatrix(context: AudioContext, matrix: ArrayLike<number>): boolean {
  if (matrix.length !== 16) return false
  for (let i = 0; i < 16; i++) if (!Number.isFinite(matrix[i])) return false
  const listener = context.listener, at = context.currentTime
  listener.positionX.setTargetAtTime(matrix[12], at, .04); listener.positionY.setTargetAtTime(matrix[13], at, .04); listener.positionZ.setTargetAtTime(matrix[14], at, .04)
  listener.forwardX.setTargetAtTime(-matrix[8], at, .04); listener.forwardY.setTargetAtTime(-matrix[9], at, .04); listener.forwardZ.setTargetAtTime(-matrix[10], at, .04)
  listener.upX.setTargetAtTime(matrix[4], at, .04); listener.upY.setTargetAtTime(matrix[5], at, .04); listener.upZ.setTargetAtTime(matrix[6], at, .04)
  return true
}
