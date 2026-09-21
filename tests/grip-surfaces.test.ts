import test from 'node:test'
import assert from 'node:assert/strict'
import { SkinnedMesh, Vector2, Vector3 } from 'three'
import { AnatomicalHand } from '../src/scene/Hand'
import { CIGAR_HAND_CONTACT, GLASS_HAND_CONTACT } from '../src/scene/HandGrips'
import { CIGAR, DRINKS } from '../src/scene/props/specs'

/** Minimum distance of a projected skin triangle to the glass axis. Testing
 * only vertices misses a face cutting through a convex prop between vertices.
 * This is deliberately a conservative infinite-cylinder envelope: the real
 * glasses taper inward at the base and their voxel corners fit in R+sqrt(2)mm.
 * It tests actual production skin, not rendered pixels or a bone-only proxy. */
function radialClearance(hand: AnatomicalHand, cy: number, cz: number, radius = DRINKS['old-fashioned'].radius): number[] {
  hand.updateSkin()
  const skin = hand.root.getObjectByName('articulated-hand-surface') as SkinnedMesh
  const index = skin.geometry.index!, bones = skin.geometry.getAttribute('skinIndex')
  const minima = Array(6).fill(Infinity), p = new Vector3()
  for (let i = 0; i < index.count; i += 3) {
    const triangle: Vector2[] = []
    for (let j = 0; j < 3; j++) {
      skin.getVertexPosition(index.getX(i + j), p)
      triangle.push(new Vector2(p.y - cy, p.z - cz))
    }
    const crosses = triangle.map((a, j) => a.cross(triangle[(j + 1) % 3]))
    // Degenerate projections occur on axial faces; do not mistake a collapsed
    // line for a triangle containing the origin.
    const contains = (crosses.every(v => v > 1e-14) || crosses.every(v => v < -1e-14))
    let distance = contains ? 0 : Infinity
    for (let j = 0; j < 3; j++) {
      const a = triangle[j], edge = triangle[(j + 1) % 3].clone().sub(a)
      const t = Math.max(0, Math.min(1, -a.dot(edge) / (edge.lengthSq() || 1)))
      distance = Math.min(distance, edge.multiplyScalar(t).add(a).length())
    }
    const bone = bones.getX(index.getX(i)), group = bone === 0 ? 0 : bone >= 13 ? 5 : 1 + Math.floor((bone - 1) / 3)
    minima[group] = Math.min(minima[group], distance - radius)
  }
  return minima
}

test('glass wrap clears the actual voxel envelope with five nearby, opposing supports', () => {
  const hand = new AnatomicalHand('right', '#ae8165', .0025)
  hand.pose('glass')
  const radius = DRINKS['old-fashioned'].radius
  assert.ok(Object.values(DRINKS).every(d => d.radius === radius), 'shared pose assumes the shared lower vessel profile')
  const clearances = radialClearance(hand, GLASS_HAND_CONTACT[1], GLASS_HAND_CONTACT[2] + radius)
  for (const [part, gap] of clearances.entries()) {
    assert.ok(gap >= Math.SQRT2 * .001, `part ${part} enters a possible glass voxel corner: ${gap * 1000}mm`)
    if (part > 0) assert.ok(gap < .0045, `digit ${part} is floating ${gap * 1000}mm from the vessel`)
  }
  const middle = hand.tips[1].getWorldPosition(new Vector3())
  const thumb = hand.thumb[2].localToWorld(new Vector3(0, .022, 0))
  assert.ok(middle.y > GLASS_HAND_CONTACT[1] + .025 && thumb.y < GLASS_HAND_CONTACT[1] - .025,
    'thumb and fingers must oppose each other, not merely touch the same side')
})

test('cigar is pinched between index and middle pads without entering any skin triangle', () => {
  const hand = new AnatomicalHand('right', '#ae8165', .0025); hand.pose('cigar')
  const gaps = radialClearance(hand, CIGAR_HAND_CONTACT[1], CIGAR_HAND_CONTACT[2], CIGAR.radius)
  assert.ok(gaps.every(g => g >= Math.SQRT2 * .0006), `skin enters cigar voxel envelope: ${gaps}`)
  assert.ok(gaps[1] < .0035 && gaps[2] < .0035, 'both supporting digits must stay close to the wrapper')
  const index = hand.tips[0].getWorldPosition(new Vector3()), middle = hand.tips[1].getWorldPosition(new Vector3())
  assert.ok(index.z < CIGAR_HAND_CONTACT[2] - CIGAR.radius && middle.z > CIGAR_HAND_CONTACT[2] + CIGAR.radius,
    'two fingers on one side can balance a cigar but cannot pinch it')
})

test('negative control retains the old matching-anchor but penetrating glass grip', () => {
  const hand = new AnatomicalHand('right', '#ae8165', .0025); hand.pose('glass')
  // Source calibration at a661198, visible in the recorded D2 held-drink views.
  // This is a synthetic surface measurement of that authored pose, NOT a new
  // browser recording or an approved visual golden.
  const curls = [[.58, .65, .34], [.65, .72, .38], [.72, .75, .42], [.82, .80, .44]]
  hand.fingers.forEach((digit, f) => digit.forEach((bone, j) => { bone.rotation.x = curls[f][j] }))
  hand.thumb[0].rotation.set(.45, -.90, -.75); hand.thumb[1].rotation.x = .35; hand.thumb[2].rotation.x = .245
  assert.ok(Math.min(...radialClearance(hand, .079, .083)) < -.020, 'negative control must expose the old >20mm penetration')
})
