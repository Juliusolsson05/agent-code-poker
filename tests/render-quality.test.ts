import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { renderPixelRatio } from '../src/scene/rendering/RenderQuality'
import { RenderProbe } from '../src/scene/diagnostics/RenderProbe'

const trace = JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T04-43-40-879Z.json.gz', import.meta.url))).toString())
test('recorded fullscreen viewport fits the candidate pixel budget without changing CSS dimensions', () => {
  const [w, h] = trace.metadata.viewport
  const previous = renderPixelRatio(w, h, trace.metadata.dpr, 'legacy')
  assert.deepEqual([Math.floor(w * previous), Math.floor(h * previous)], trace.metadata.buffer)
  assert.ok(trace.metadata.buffer[0] * trace.metadata.buffer[1] > 3_600_000, 'preserve expensive real baseline')
  const ratio = renderPixelRatio(w, h, trace.metadata.dpr)
  assert.ok(Math.floor(w * ratio) * Math.floor(h * ratio) <= 2_500_000)
  assert.ok(ratio >= 1, 'recorded desktop must retain at least one pixel per CSS pixel')
})
test('profiling keeps real captured intervals, excludes warmup and owns fixed windows', () => {
  const probe = new RenderProbe(0, 2000, 8000)
  const frames = trace.entries.filter((e: any) => e.kind === 'frame')
  for (const entry of frames) probe.frame(entry.wallMs, entry.data)
  const expected = frames.filter((e: any) => e.wallMs >= 2000 && e.wallMs < 10000)
  assert.deepEqual(probe.windows[0].samples, expected.map((e: any) => e.data))
  // Synthetic boundary checks supplement, not replace, the captured intervals.
  const sample = { frameMs: 16, cpuMs: 4, draws: 300, triangles: 1_145_000 }
  const boundaries = new RenderProbe(0)
  for (let i = 0; i < 4; i++) {
    boundaries.frame(i * 10000 + 1999, sample)
    boundaries.frame(i * 10000 + 2000, sample)
    assert.equal(boundaries.frame((i + 1) * 10000, sample), true)
  }
  assert.equal(boundaries.done, true)
  assert.deepEqual(boundaries.windows.map(w => [w.mode, w.samples.length]), [['legacy', 1], ['balanced', 1], ['legacy', 1], ['balanced', 1]])
  boundaries.frame(50000, sample); assert.equal(boundaries.windows[3].samples.length, 1)
})
test('actual A/B export varies only the intended render budget while retaining workload counts', () => {
  const profile = JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-profile-2026-09-20T04-50-10-044Z.json.gz', import.meta.url))).toString())
  assert.equal(profile.reason, 'complete'); assert.equal(profile.windows.length, 4)
  for (const [index, window] of profile.windows.entries()) {
    const environment = profile.environments[index], [width, height] = environment.viewport
    assert.deepEqual(environment.viewport, profile.environments[0].viewport)
    const ratio = renderPixelRatio(width, height, environment.dpr, window.mode)
    assert.deepEqual(environment.buffer, [Math.floor(width * ratio), Math.floor(height * ratio)])
    assert.ok(window.samples.length > 80, 'retain every measured frame, not just a percentile summary')
    for (const frame of window.samples) {
      assert.equal(frame.draws, 300); assert.equal(frame.triangles, 1145166)
    }
  }
  // These are historical observations, not a CI FPS promise. Future hardware
  // comparisons must collect another real export; do not rewrite this fixture.
})
