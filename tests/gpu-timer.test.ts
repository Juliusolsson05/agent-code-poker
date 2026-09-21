import test from 'node:test'
import assert from 'node:assert/strict'
import { GpuTimer } from '../src/scene/diagnostics/GpuTimer'

// API lifecycle tests with a fake GL driver, NOT GPU performance fixtures.
// The real browser probe records availability and timings independently.
test('GPU timer is bounded, asynchronous, tagged, and discards disjoint results', () => {
  let available = false, disjoint = false, created = 0, deleted = 0, began = 0, ended = 0
  const gl = {
    QUERY_RESULT_AVAILABLE: 1, QUERY_RESULT: 2,
    getExtension: () => ({ TIME_ELAPSED_EXT: 3, GPU_DISJOINT_EXT: 4 }),
    getParameter: () => disjoint,
    createQuery: () => ({ id: ++created }), deleteQuery: () => deleted++,
    beginQuery: () => began++, endQuery: () => ended++,
    getQueryParameter: (_q: unknown, key: number) => key === 1 ? available : 3_000_000,
  }
  const samples: number[][] = [], timer = new GpuTimer(gl as unknown as WebGL2RenderingContext, (tag, ms) => samples.push([tag, ms]))
  for (let i = 0; i < 20; i++) { timer.begin(i); timer.end() }
  assert.equal(created, 8); assert.equal(began, ended); assert.equal(samples.length, 0)
  available = true; timer.begin(null)
  assert.deepEqual(samples, Array.from({ length: 8 }, (_, i) => [i, 3])); assert.equal(deleted, 8)
  available = false; timer.begin(9); timer.end(); available = true; disjoint = true; timer.begin(10)
  assert.equal(deleted, 9); assert.equal(samples.length, 8); assert.equal(created, 9)
  disjoint = false; timer.begin(11); timer.dispose()
  assert.equal(deleted, created); assert.equal(began, ended)
})
test('unsupported GPU queries produce no fabricated timing or GL work', () => {
  const timer = new GpuTimer({ getExtension: () => null } as unknown as WebGL2RenderingContext, () => assert.fail('unsupported timer'))
  assert.equal(timer.supported, false); timer.begin(0); timer.end(); timer.dispose()
})
