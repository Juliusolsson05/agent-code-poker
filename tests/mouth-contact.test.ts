import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { Matrix4, Quaternion, Vector3 } from 'three'
import { InteractionDirector } from '../src/scene/InteractionDirector'
import { PLAYER_LAYOUT } from '../src/scene/environment/layout'
import { CIGAR, drinkAnchors } from '../src/scene/props/specs'

const trace = JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T05-26-21-152Z.json.gz', import.meta.url))).toString())
// Authored anatomy contract, not inferred from the broken prop targets. The
// user's eye/body stays put; props meet lips 95mm down and55mm toward the table.
const lips = new Vector3(...PLAYER_LAYOUT.eye).add(new Vector3(0, -.095, -.055))
const point = (pose: { position: number[]; rotation: number[] }, anchor: number[]) => new Vector3(...anchor)
  .applyQuaternion(new Quaternion(...pose.rotation)).add(new Vector3(...pose.position))

test('real puff baseline points the ember toward the eye and uses a floating mouth target', () => {
  const puffs = trace.entries.filter((e: any) => e.kind === 'pose' && e.data.hero.phase === 'puff')
  assert.equal(puffs.length, 7)
  for (const entry of puffs) {
    const matrix = new Matrix4().fromArray(entry.data.hero.cigar.world)
    assert.ok(new Vector3(1, 0, 0).transformDirection(matrix).z > .3)
    assert.ok(new Vector3(...CIGAR.bite).applyMatrix4(matrix).distanceTo(lips) > .075)
  }
})

test('recorded smoke and sip meet one lip landmark with an outward ember and bounded reach', () => {
  const director = new InteractionDirector()
  let puffs = 0, sips = 0
  for (const entry of trace.entries) {
    const time = entry.visualSeconds
    director.sample(time)
    if (entry.kind === 'playing') director.setActive(entry.data.playing, time)
    if (entry.kind === 'smoke' || entry.kind === 'drink') assert.equal(director.begin(entry.kind, time), entry.data.accepted)
    if (entry.kind !== 'pose') continue
    const pose = director.sample(time)
    assert.ok(pose.arm.reachError < 1e-6, 'contact cannot be obtained by stretching the arm')
    if (pose.phase === 'puff') {
      puffs++
      assert.ok(point(pose.cigar, [...CIGAR.bite]).distanceTo(lips) < .005, 'cigar mouth-end misses the lips')
      const axis = new Vector3(1, 0, 0).applyQuaternion(new Quaternion(...pose.cigar.rotation))
      assert.ok(axis.dot(new Vector3(0, 0, -1)) > .9, 'burning end must face away from the player')
      assert.ok(point(pose.cigar, [...CIGAR.tip]).z < lips.z - .12, 'ember must remain well outside the face')
    }
    if (pose.phase === 'sip') {
      sips++
      assert.ok(point(pose.drink, drinkAnchors('old-fashioned').rim).distanceTo(lips) < .005, 'glass rim misses the same lips')
    }
  }
  assert.equal(puffs, 7); assert.equal(sips, 11)
})
