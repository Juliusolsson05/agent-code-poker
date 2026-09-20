import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import * as THREE from 'three'
import { PostProcessing, RENDERER_OPTIONS } from '../src/scene/rendering/PostProcessing'

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
  assert.equal(state.passCount, 3); assert.equal(state.bloomThreshold, 4)
  pipeline.setSize(1100, 800, 1.25)
  assert.deepEqual(pipeline.diagnostics().buffer, [1375, 1000], 'first resize must apply DPR even at constructor CSS dimensions')
  pipeline.setSize(100, 50, 1.25)
  assert.deepEqual(pipeline.diagnostics().buffer, [125, 62.5])
  pipeline.setSize(1, 1, 1)
  assert.deepEqual(pipeline.diagnostics().buffer, [1, 1])
  pipeline.dispose()
})
