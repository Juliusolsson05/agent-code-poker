import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { assessProbe } from '../src/scene/diagnostics/RenderProbe'

const load = (id: string) => JSON.parse(gunzipSync(readFileSync(new URL(`../testing/fixtures/experience/poker-profile-${id}.json.gz`, import.meta.url))).toString())
test('actual ablation with a fivefold moving baseline cannot be accepted as a fair comparison', () => {
  const raw = load('2026-09-20T05-03-34-188Z')
  assert.equal(raw.reason, 'complete', 'a completed protocol alone was insufficient')
  const assessment = assessProbe(raw.windows)
  assert.equal(assessment.comparable, false)
  assert.ok(assessment.reasons.includes('baseline-drift'))
  assert.ok(assessment.baselineRatio! > 4.9)
})
test('earlier actual repeated resolution windows pass the drift check, not a universal FPS guarantee', () => {
  const raw = load('2026-09-20T04-50-10-044Z')
  const assessment = assessProbe(raw.windows)
  assert.equal(assessment.comparable, true)
  assert.ok(assessment.baselineRatio! < 1.1)
  assert.equal(assessment.windows[0].samples, 97)
})
test('actual immediate camera interruption contains no usable performance window', () => {
  const raw = load('2026-09-20T04-58-59-194Z')
  assert.equal(assessProbe(raw.windows).comparable, false)
})
