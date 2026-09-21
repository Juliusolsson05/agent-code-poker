import test from 'node:test'
import assert from 'node:assert/strict'
import { Vector3 } from 'three'
import { AnatomicalHand } from '../src/scene/Hand'

// Pose regression motivated by user-thumb-silhouette-before.png. These are
// explicitly geometry checks, not image similarity or aesthetic acceptance.
test('cigar thumb rests alongside the palm rather than protruding as a central hook', () => {
  const hand = new AnatomicalHand('right'); hand.pose('cigar')
  const tip = hand.thumb[2].localToWorld(new Vector3(0, .022, 0))
  assert.ok(tip.x < -.050, 'unused thumb must rest outside the palm/index side')
  assert.ok(tip.z < .035, 'thumb must not protrude 69mm above the palm like the reported hook')
})

test('original cigar thumb posture reproduces the raised central hook', () => {
  const hand = new AnatomicalHand('right'); hand.pose('cigar')
  hand.thumb[0].rotation.set(.65, -.50, -.75)
  hand.thumb[1].rotation.x = .43; hand.thumb[2].rotation.x = .301
  hand.updateSkin()
  const tip = hand.thumb[2].localToWorld(new Vector3(0, .022, 0))
  assert.ok(tip.x > 0 && tip.z > .069, 'preserve the actual original pose as the negative control')
})
