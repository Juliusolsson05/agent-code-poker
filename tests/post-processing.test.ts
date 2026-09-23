import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { createHash } from 'node:crypto'
import * as THREE from 'three'
import { PostProcessing, RENDERER_OPTIONS } from '../src/scene/rendering/PostProcessing'

test('canonical browser captures preserve exact pixels without second canvas MSAA', () => {
  const base = new URL('../testing/fixtures/experience/', import.meta.url)
  const before = readFileSync(new URL('poker-fixed-2026-09-20T14-12-39-305Z.png', base))
  const candidate = readFileSync(new URL('poker-fixed-2026-09-20T14-13-19-540Z.png', base))
  // These are original browser PNGs, not a generated golden. Exact bytes are
  // stronger than a broad mean-error threshold that hid changed NPC poses in
  // the rejected05-06/05-09 pair. This one-frame proof is not motion approval.
  assert.equal(createHash('sha256').update(before).digest('hex'), 'ce448b9f3961d9ef7567b8784236dc9a017d1ec0f516908fae9f03e8b2ad9bcd')
  assert.ok(before.equals(candidate))
  assert.equal(before.readUInt32BE(16), 1994); assert.equal(before.readUInt32BE(20), 1253)
  const profile = JSON.parse(gunzipSync(readFileSync(new URL('poker-profile-2026-09-20T14-12-29-610Z.json.gz', base))).toString())
  assert.equal(profile.assessment.comparable, true)
  for (const environment of profile.environments) {
    assert.equal(environment.canvasAntialias, true); assert.equal(environment.defaultSamples, 4)
    assert.deepEqual(environment.buffer, [1994, 1253])
  }
  assert.equal(profile.scene.pipeline.sceneSamples, 4)
  assert.equal(profile.scene.pipeline.hdr, true)
})

test('double-MSAA candidate removes canvas samples, not geometry target coverage', () => {
  const trace = JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T05-06-37-467Z.json.gz', import.meta.url))).toString())
  assert.equal(trace.metadata.canvasAntialias, true); assert.equal(trace.metadata.defaultSamples, 4)
  assert.equal(RENDERER_OPTIONS.antialias, false, 'fullscreen resolved texture has no polygon edges left to multisample')
  // This constructs real Three targets/passes but no fake GPU. Pixel equivalence
  // must be checked separately against the two fixed-pose browser captures.
  const renderer = { getPixelRatio: () => 1 } as THREE.WebGLRenderer
  const pipeline = new PostProcessing(renderer, new THREE.Scene(), new THREE.PerspectiveCamera())
  const state = pipeline.diagnostics()
  assert.equal(state.sceneSamples, 4); assert.equal(state.hdr, true)
  // Four passes since #15: scene, bloom, the cosmetic intoxication pass and
  // output. The effect pass starts DISABLED, and EffectComposer skips disabled
  // passes, so a sober frame is still the three-pass pipeline these canonical
  // pixel captures were taken with.
  assert.equal(state.passCount, 4); assert.equal(state.effectEnabled, false); assert.equal(state.bloomThreshold, 4)
  pipeline.setSize(1100, 800, 1.25)
  assert.deepEqual(pipeline.diagnostics().buffer, [1375, 1000], 'first resize must apply DPR even at constructor CSS dimensions')
  pipeline.setSize(100, 50, 1.25)
  assert.deepEqual(pipeline.diagnostics().buffer, [125, 62.5])
  pipeline.setSize(1, 1, 1)
  assert.deepEqual(pipeline.diagnostics().buffer, [1, 1])
  pipeline.dispose()
})
