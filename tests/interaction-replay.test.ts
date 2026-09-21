import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import * as THREE from 'three'
import { InteractionDirector } from '../src/scene/InteractionDirector'

const trace = JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T03-19-01-705Z.json.gz', import.meta.url))).toString())
const vector = (p: number[]) => new THREE.Vector3(...p)
const worldPoint = (matrix: number[], point = [0, 0, 0]) => vector(point).applyMatrix4(new THREE.Matrix4().fromArray(matrix))

test('recorded old reach violates the connected-body envelope even though glass anchors agree', () => {
  const poses = trace.entries.filter((e: any) => e.kind === 'pose')
  const maxEyeDistance = Math.max(...poses.map((e: any) => worldPoint(e.data.hero.right.world).distanceTo(worldPoint(e.data.camera.world))))
  // Negative control: this exact assertion is the user's failed reach, not an
  // invented outlier. A future test with only grip equality would miss it.
  assert.throws(() => assert.ok(maxEyeDistance < .9), /false == true|assert/i)
  assert.ok(maxEyeDistance > 1.98)
  const attached = poses.filter((e: any) => e.data.hero.action === 'drink' && e.visualSeconds - e.data.hero.actionAt >= 1.25 && e.visualSeconds - e.data.hero.actionAt < 4.8)
  assert.ok(attached.length > 20)
  for (const e of attached) assert.ok(worldPoint(e.data.hero.right.world, e.data.hero.glassGrip).distanceTo(worldPoint(e.data.hero.drink.world, [.038, .038, .015])) < 1e-6)
})

test('actual recorded command sequence produces connected reachable arms and exclusive prop ownership', () => {
  const director = new InteractionDirector()
  let samples = 0, sawReturn = false, sawDrink = false
  for (const entry of trace.entries) {
    const t = entry.visualSeconds
    if (entry.kind === 'playing') director.setActive(entry.data.playing, t)
    if (entry.kind === 'drink') director.begin('drink', t)
    if (entry.kind === 'smoke') director.begin('smoke', t)
    if (entry.kind === 'inspection') director.inspect(entry.data.active, t)
    if (entry.kind !== 'pose') continue
    const pose = director.sample(t)
    samples++; sawReturn ||= pose.action === 'return'; sawDrink ||= pose.action === 'drink'
    assert.equal(pose.space, 'world')
    assert.ok(pose.arm.reachError < 1e-6, `unreachable wrist at recorded visual ${t}: ${pose.arm.reachError}`)
    assert.ok(Math.abs(vector(pose.arm.shoulder).distanceTo(vector(pose.arm.elbow)) - .285) < 1e-6)
    assert.ok(Math.abs(vector(pose.arm.elbow).distanceTo(vector(pose.arm.wrist)) - .285) < 1e-6)
    assert.ok(vector(pose.right.position).distanceTo(vector(pose.arm.wrist)) < 1e-9)
    assert.ok(!(pose.drink.owner === 'right-hand' && pose.cigar.owner === 'right-hand'), 'one hand cannot hold both props')
    for (const prop of [pose.drink, pose.cigar]) assert.ok(prop.position.every(Number.isFinite))
    if (pose.drink.owner === 'right-hand') {
      const contact = vector(director.calibration.handGlassContact).applyQuaternion(new THREE.Quaternion(...pose.right.rotation)).add(vector(pose.right.position))
      const glass = vector(director.calibration.glassContact).applyQuaternion(new THREE.Quaternion(...pose.drink.rotation)).add(vector(pose.drink.position))
      assert.ok(contact.distanceTo(glass) < 1e-6)
    }
  }
  assert.equal(samples, 500); assert.ok(sawReturn); assert.ok(sawDrink)
})

test('sampling the same paused time and skipping directly across transfer boundaries is deterministic', () => {
  const start = trace.entries.find((e: any) => e.kind === 'drink').visualSeconds
  const dense = new InteractionDirector(), sparse = new InteractionDirector()
  for (const d of [dense, sparse]) { d.setActive(true, start); assert.equal(d.begin('drink', start), true) }
  // These inspection times and gaps come from the real captured poses, not a
  // clean 60 Hz clock. Both samplers must describe the same ownership/position.
  const times = trace.entries.filter((e: any) => e.kind === 'pose' && e.visualSeconds >= start && e.visualSeconds < start + 6).map((e: any) => e.visualSeconds)
  for (let i = 0; i < times.length; i++) {
    const expected = dense.sample(times[i])
    assert.deepEqual(dense.sample(times[i]), expected, 'paused/repeated sample mutated state')
    if (i % 7 === 0 || i === times.length - 1) assert.deepEqual(sparse.sample(times[i]), expected)
  }
})

test('recorded mid-sip inspection returns the held glass before granting the lean and allows cigar retrieval afterward', () => {
  const candidate = JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T03-39-26-621Z.json.gz', import.meta.url))).toString())
  const director = new InteractionDirector()
  let interruptedHeldGlass = false, returnedBeforeInspection = false, retrieved = false
  let previous: ReturnType<InteractionDirector['sample']> | null = null, previousTime = 0
  for (const entry of candidate.entries) {
    const t = entry.visualSeconds
    if (entry.kind === 'playing') director.setActive(entry.data.playing, t)
    if (entry.kind === 'drink') assert.equal(director.begin('drink', t), entry.data.accepted)
    if (entry.kind === 'inspection') {
      if (entry.data.active) interruptedHeldGlass = director.sample(t).drink.owner === 'right-hand'
      director.inspect(entry.data.active, t)
    }
    if (entry.kind === 'smoke') { assert.equal(director.begin('smoke', t), entry.data.accepted); retrieved = true }
    if (entry.kind !== 'pose') continue
    const pose = director.sample(t)
    assert.ok(pose.arm.reachError < 1e-6)
    if (pose.inspectionReady) {
      returnedBeforeInspection = true
      assert.equal(pose.drink.owner, 'table')
      assert.deepEqual(pose.drink.position, director.calibration.drinkHome.position)
    }
    if (previous && t > previousTime) {
      // 2m/s is a generous arm/prop speed ceiling, not a likeness target. It
      // detects the old instantaneous home snap at an actual recorded interrupt.
      const dt = t - previousTime
      assert.ok(vector(pose.drink.position).distanceTo(vector(previous.drink.position)) <= 2 * dt + .001, `glass teleported at ${t}`)
      assert.ok(vector(pose.right.position).distanceTo(vector(previous.right.position)) <= 2 * dt + .001, `wrist teleported at ${t}`)
    }
    previous = pose; previousTime = t
  }
  assert.ok(interruptedHeldGlass && returnedBeforeInspection && retrieved)
})
