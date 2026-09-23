import * as THREE from 'three'
import type { EffectFrame } from '../../interaction/effects/EffectEngine'

const UP = new THREE.Vector3(0, 1, 0)

/** Derive the RENDER camera from the logical seated camera plus cosmetic sway
 * (#15). The logical camera is read-only here: the HRTF audio listener, the
 * world-anchored seat/pot labels and diagnostics keep reading it, so a woozy
 * view never makes the fire's position wobble in your ears or the name tags
 * jitter against the heads they label. Props are world-owned and never see
 * either camera, so nothing physical can move with the sway.
 *
 * Order matters: yaw about room-up (same reason SeatedLook yaws about world
 * up: local-Y yaw on a pitched camera rolls the horizon), then local pitch,
 * then local roll about the view axis, then a vertical bob. All of it is
 * applied AFTER look yaw/pitch, so dragging the view still aims precisely. */
export function applySway(source: THREE.PerspectiveCamera, target: THREE.PerspectiveCamera, sway: EffectFrame['sway'] | null): void {
  target.copy(source, false)
  if (sway && (sway.yaw || sway.pitch || sway.roll || sway.bob)) {
    target.rotateOnWorldAxis(UP, sway.yaw); target.rotateX(sway.pitch); target.rotateZ(sway.roll)
    target.position.y += sway.bob
  }
  target.updateMatrixWorld(true)
}
