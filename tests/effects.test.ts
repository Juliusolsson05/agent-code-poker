import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
import { EffectEngine, EFFECT_FREQUENCIES, ROLL_CAP, blendTint, type EffectFrame } from '../src/interaction/effects/EffectEngine'
import { applySway, calmEffect } from '../src/scene/rendering/EffectCamera'
import { PostProcessing } from '../src/scene/rendering/PostProcessing'

// The worst case the engine can reach: every source at its cap on Strong,
// after the onset has fully built. Safety bounds must hold HERE, not only for
// a single drink.
function saturated(): EffectEngine {
  const e = new EffectEngine(); e.setSetting('strong')
  for (let id = 1; id <= 20; id++) e.acceptSip({ id, actor: 'player', kind: 'negroni' })
  e.acceptTreat({ id: 1, actor: 'player', kind: 'mushrooms' }); e.acceptTreat({ id: 2, actor: 'player', kind: 'mushrooms' })
  e.acceptTreat({ id: 3, actor: 'player', kind: 'lsd' }); e.acceptTreat({ id: 4, actor: 'player', kind: 'lsd' })
  for (let i = 0; i < 90; i++) e.advance(1) // past every onset, before much decay
  return e
}
const channels = (f: EffectFrame) => ({ yaw: f.sway.yaw, pitch: f.sway.pitch, roll: f.sway.roll, bob: f.sway.bob,
  dx: f.post.double[0], dy: f.post.double[1], warp: f.post.warp, breath: f.post.breath, hueMix: f.post.hueMix, sat: f.post.saturation, tint: f.tint.opacity })

test('every oscillator is at most 0.5 Hz (photosensitivity and motion comfort)', () => {
  for (const [name, hz] of Object.entries(EFFECT_FREQUENCIES)) assert.ok(hz > 0 && hz <= .5, `${name}: ${hz} Hz`)
  // Independent of the table: count turning points in the actual output. A
  // band-limited signal at ≤f Hz turns at most ~2f times per second; 3 Hz of
  // luminance flicker would need 6 turns/s. Sample at 120 Hz for 60 s.
  const e = saturated()
  const series = new Map<string, number[]>()
  for (let i = 0; i <= 7200; i++) for (const [key, value] of Object.entries(channels(e.sample(100 + i / 120, false)))) {
    if (!series.has(key)) series.set(key, []); series.get(key)!.push(value)
  }
  for (const [key, values] of series) {
    let turns = 0
    for (let i = 2; i < values.length; i++) if ((values[i] - values[i - 1]) * (values[i - 1] - values[i - 2]) < 0) turns++
    // 60 s × 2 × 0.5 Hz = 60, plus slack for sums of incommensurate waves.
    assert.ok(turns <= 70, `${key}: ${turns} turning points in 60 s exceeds the 0.5 Hz budget`)
    assert.ok(turns / 60 < 6, `${key}: would flicker at ≥3 Hz`)
  }
})

test('roll, yaw and double vision stay capped even with every source saturated', () => {
  const e = saturated()
  let maxRoll = 0, maxYaw = 0, maxDouble = 0
  for (let t = 0; t < 120; t += .05) {
    const f = e.sample(t, false)
    maxRoll = Math.max(maxRoll, Math.abs(f.sway.roll)); maxYaw = Math.max(maxYaw, Math.abs(f.sway.yaw))
    maxDouble = Math.max(maxDouble, Math.hypot(...f.post.double))
    assert.ok(f.tint.opacity <= .3 && f.post.hueMix <= .85 && f.post.warp <= .012)
  }
  assert.ok(maxRoll <= ROLL_CAP + 1e-12 && maxRoll > ROLL_CAP * .8, `roll ${maxRoll} must reach but never exceed the cap`)
  assert.ok(maxYaw <= .06 && maxDouble <= .014)
})

test('reduced motion leaves a static colour tint only', () => {
  const e = saturated()
  const a = e.sample(10, true), b = e.sample(37.3, true)
  for (const f of [a, b]) {
    assert.equal(f.active, false, 'post pass must be bypassed')
    assert.deepEqual(f.sway, { yaw: 0, pitch: 0, roll: 0, bob: 0 })
    assert.deepEqual(f.post.double, [0, 0]); assert.equal(f.post.warp, 0); assert.equal(f.post.breath, 0); assert.equal(f.post.hueMix, 0)
    assert.ok(f.tint.opacity > 0, 'the tint is the reduced-motion feedback')
  }
  assert.deepEqual(a.tint, b.tint, 'no change over time: nothing cycles under reduced motion')
})

test('intensity is deterministic, builds on the visual clock and pause freezes it', () => {
  const run = () => {
    const e = new EffectEngine(); e.setSetting('normal')
    e.acceptSip({ id: 1, actor: 'player', kind: 'mulled-wine' }); e.acceptTreat({ id: 1, actor: 'player', kind: 'lsd' })
    const out: number[] = []
    for (let i = 0; i < 400; i++) { e.advance(1 / 4); out.push(...Object.values(channels(e.sample(i / 4, false)))) }
    return out
  }
  assert.deepEqual(run(), run())
  const e = new EffectEngine(); e.setSetting('strong'); e.acceptTreat({ id: 1, actor: 'player', kind: 'mushrooms' })
  // Onset: consuming does not jump straight to full effect.
  assert.equal(e.levels().mushroom, 0)
  e.advance(10); const early = e.levels().mushroom; e.advance(30); const later = e.levels().mushroom
  assert.ok(early > 0 && later > early)
  // Pause = Room passes dt 0 (and repeats the same visual time).
  const frozen = e.levels(), frame = e.sample(55, false)
  for (let i = 0; i < 100; i++) e.advance(0)
  e.advance(-1); e.advance(Number.NaN)
  assert.deepEqual(e.levels(), frozen); assert.deepEqual(e.sample(55, false), frame)
  // Fade: long active time returns to exactly sober and bypasses everything.
  e.advance(10_000); assert.equal(e.sample(99, false).active, false); assert.equal(e.sample(99, false).tint.opacity, 0)
})

test('Off clears immediately, ignores receipts, and cannot replay them later', () => {
  const e = saturated(); e.setSetting('off')
  const f = e.sample(12, false)
  assert.equal(f.active, false); assert.equal(f.tint.opacity, 0)
  e.acceptSip({ id: 21, actor: 'player', kind: 'negroni' }); e.acceptTreat({ id: 5, actor: 'player', kind: 'lsd' })
  e.setSetting('strong'); e.advance(120)
  assert.equal(e.sample(12, false).active, false, 'receipts seen while Off must not apply after turning it on')
  // Sips and treats are separate id streams: treat #6 is new even after sip #21.
  e.acceptTreat({ id: 6, actor: 'player', kind: 'lsd' }); e.advance(120)
  assert.ok(e.levels().lsd > 0)
})

test('profiles are distinct: drinks sway, mushrooms saturate and breathe, LSD cycles hue and warps', () => {
  const only = (feed: (e: EffectEngine) => void) => { const e = new EffectEngine(); e.setSetting('strong'); feed(e); e.advance(120); return e.sample(7, false) }
  const drink = only(e => { for (let id = 1; id < 7; id++) e.acceptSip({ id, actor: 'player', kind: 'old-fashioned' }) })
  const mush = only(e => e.acceptTreat({ id: 1, actor: 'player', kind: 'mushrooms' }))
  const lsd = only(e => e.acceptTreat({ id: 1, actor: 'player', kind: 'lsd' }))
  assert.ok(Math.abs(drink.sway.roll) > 0 && Math.hypot(...drink.post.double) > 0 && drink.post.hueMix === 0 && drink.post.warp === 0)
  assert.ok(mush.post.saturation > 0 && mush.post.hueMix === 0 && Math.hypot(...mush.post.double) === 0)
  assert.ok(lsd.post.hueMix > 0 && lsd.post.warp > 0 && Math.hypot(...lsd.post.double) === 0)
  assert.notEqual(drink.tint.color, lsd.tint.color); assert.notEqual(mush.tint.color, lsd.tint.color)
  const soft = only(e => e.acceptSip({ id: 1, actor: 'player', kind: 'hot-chocolate' }))
  assert.equal(soft.active, false, 'soft drinks never intoxicate')
})

test('sway moves only the render camera; the logical camera (audio listener) stays put', () => {
  const logical = new THREE.PerspectiveCamera(70, 1.6, .035, 35), view = new THREE.PerspectiveCamera()
  logical.position.set(0, 1.43, 1.5); logical.lookAt(0, 1.03, -.6); logical.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), .3); logical.updateMatrixWorld()
  const before = logical.matrixWorld.clone()
  applySway(logical, view, { yaw: .02, pitch: .01, roll: ROLL_CAP, bob: .01 })
  assert.ok(logical.matrixWorld.equals(before), 'the listener camera must not be touched')
  assert.ok(!view.matrixWorld.equals(before))
  // Roll is about the view axis: the forward direction is unchanged by roll,
  // the horizon tilts by exactly the capped angle.
  applySway(logical, view, { yaw: 0, pitch: 0, roll: ROLL_CAP, bob: 0 })
  const forward = (c: THREE.Camera) => new THREE.Vector3(0, 0, -1).transformDirection(c.matrixWorld)
  assert.ok(forward(view).distanceTo(forward(logical)) < 1e-9)
  const up = (c: THREE.Camera) => new THREE.Vector3(0, 1, 0).transformDirection(c.matrixWorld)
  assert.ok(Math.abs(up(view).angleTo(up(logical)) - ROLL_CAP) < 1e-9)
  applySway(logical, view, null)
  assert.ok(view.matrixWorld.equals(logical.matrixWorld) && view.projectionMatrix.equals(logical.projectionMatrix), 'sober = identical view')
})

test('post pass is bypassed at zero intensity and enabled only by real parameters', () => {
  const renderer = { getPixelRatio: () => 1 } as THREE.WebGLRenderer
  const pipeline = new PostProcessing(renderer, new THREE.Scene(), new THREE.PerspectiveCamera())
  assert.equal(pipeline.diagnostics().effectEnabled, false)
  const sober = new EffectEngine().sample(3, false)
  pipeline.setEffect(sober.post); assert.equal(pipeline.diagnostics().effectEnabled, false)
  pipeline.setEffect(saturated().sample(3, false).post); assert.equal(pipeline.diagnostics().effectEnabled, true)
  pipeline.setEffect(saturated().sample(3, true).post); assert.equal(pipeline.diagnostics().effectEnabled, false, 'reduced motion bypasses the pass')
  pipeline.setEffect(null); assert.equal(pipeline.diagnostics().effectEnabled, false)
  pipeline.dispose()
})

test('Room projects world labels through the swayed render camera and keeps audio on the logical one', () => {
  // Behaviour first: under real sway a head lands somewhere else on screen,
  // so a tag projected through the steady camera visibly drifts off it.
  const logical = new THREE.PerspectiveCamera(70, 1.6, .035, 35), view = new THREE.PerspectiveCamera()
  logical.position.set(0, 1.43, 1.5); logical.lookAt(0, 1.03, -.6); logical.updateMatrixWorld()
  applySway(logical, view, { yaw: .03, pitch: .015, roll: ROLL_CAP, bob: .01 })
  const head = new THREE.Vector3(-1.10, 1.79, -1.03)
  const drift = head.clone().project(view).distanceTo(head.clone().project(logical))
  assert.ok(drift > .02, `sway must move a head on screen (${drift}); otherwise this contract is vacuous`)
  // Then the wiring: every projection inside Room.frame must use renderCamera,
  // and the listener must read the logical camera. A regression to
  // `.project(this.camera)` fails here (the review found exactly that).
  const source = readFileSync(new URL('../src/scene/Room.ts', import.meta.url), 'utf8')
  const file = ts.createSourceFile('Room.ts', source, ts.ScriptTarget.Latest, true)
  let frameBody: ts.Node | undefined
  const find = (node: ts.Node) => {
    if (ts.isPropertyDeclaration(node) && node.name.getText(file) === 'frame') frameBody = node.initializer
    ts.forEachChild(node, find)
  }
  find(file); assert.ok(frameBody, 'Room.frame not found')
  const projections: string[] = [], listener: string[] = []
  const visit = (node: ts.Node) => {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
      if (node.expression.name.text === 'project') projections.push(node.arguments[0].getText(file))
      if (node.expression.getText(file).includes('onAudioListener')) listener.push(node.arguments[0].getText(file))
    }
    ts.forEachChild(node, visit)
  }
  visit(frameBody!)
  assert.ok(projections.length > 0)
  assert.deepEqual([...new Set(projections)], ['this.renderCamera'], 'world labels must follow the rendered (swayed) image')
  assert.deepEqual(listener, ['this.camera.matrixWorld.elements'], 'the HRTF listener must stay on the steady logical camera')
})

test('card inspection calms every motion channel, not just the camera', () => {
  const frame = saturated().sample(21.7, false)
  const leaning = calmEffect(frame, 0)
  // Magnitudes, not deepEqual: a negative phase times 0 is -0, which is still still.
  for (const value of [...Object.values(leaning.sway), ...leaning.post.double, leaning.post.warp, leaning.post.breath, leaning.post.hueMix])
    assert.equal(Math.abs(value), 0)
  assert.equal(leaning.post.saturation, frame.post.saturation, 'static colour may remain')
  const half = calmEffect(frame, .5)
  assert.ok(Math.abs(half.sway.roll - frame.sway.roll / 2) < 1e-12 && Math.abs(half.post.warp - frame.post.warp / 2) < 1e-12)
  assert.deepEqual(calmEffect(frame, 1), frame)
  const sober = new EffectEngine().sample(3, false)
  assert.equal(calmEffect(sober, 1).active, false, 'calming never activates a bypassed pass')
})

test('the edge tint colour glides between sources instead of snapping at the crossover', () => {
  // Sweep the drink/LSD balance through the point where LSD takes the lead.
  let previous: number[] | null = null
  const rgb = (c: string) => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16))
  for (let i = 0; i <= 100; i++) {
    const colour = rgb(blendTint([['#ad582b', 1 - i / 100], ['#b8862b', 0], ['#7a4fb0', i / 100]]))
    if (previous) assert.ok(Math.max(...colour.map((c, k) => Math.abs(c - previous![k]))) <= 3, `tint jumped at step ${i}`)
    previous = colour
  }
  assert.equal(blendTint([['#ad582b', 0], ['#7a4fb0', 0]]), '#ad582b', 'idle tint keeps the old amber')
})
