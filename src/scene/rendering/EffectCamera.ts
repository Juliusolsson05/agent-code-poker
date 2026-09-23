import * as THREE from 'three'
import type { EffectFrame } from '../../interaction/effects/EffectEngine'

const UP = new THREE.Vector3(0, 1, 0)

/** Derive the RENDER camera from the logical seated camera plus cosmetic sway
 * (#15). The logical camera is read-only here: the HRTF audio listener and
 * capture diagnostics keep reading it, so a woozy view never makes the fire's
 * position wobble in your ears. World-anchored seat/pot labels do the
 * opposite on purpose: they are drawn over the swayed image, so Room projects
 * them through the RENDER camera and they stay glued to the heads they label.
 * Props are world-owned and never see either camera, so nothing physical can
 * move with the sway.
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

/** Card inspection (and the wide diagnostic view) calms the effect by
 * `calm` = 1 − inspection blend. Every MOTION channel scales together: sway,
 * double image, warp, breathing and hue cycling. Only static colour
 * (saturation, tint) is left, so leaning in to read your own cards is never
 * fighting a doubled, warping image. Pure, so it is tested without a GPU. */
export function calmEffect(frame: EffectFrame, calm: number): EffectFrame {
  const k = Math.max(0, Math.min(1, calm))
  const sway = { yaw: frame.sway.yaw * k, pitch: frame.sway.pitch * k, roll: frame.sway.roll * k, bob: frame.sway.bob * k }
  const post = { ...frame.post, double: [frame.post.double[0] * k, frame.post.double[1] * k] as [number, number],
    warp: frame.post.warp * k, breath: frame.post.breath * k, hueMix: frame.post.hueMix * k }
  return { ...frame, sway, post, active: frame.active && (k > 0 || post.saturation !== 0) }
}
