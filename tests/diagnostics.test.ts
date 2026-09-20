import test from 'node:test'
import assert from 'node:assert/strict'
import { ExperienceRecorder } from '../src/scene/diagnostics/Recorder'

// These are recorder unit checks, not invented gameplay fixtures or proof of
// visual correctness. Session traces are collected by the opt-in browser UI.
test('recording preserves raw order/timing and snapshots mutable input', () => {
  const recorder = new ExperienceRecorder(), input = { position: [1, 2, 3] }
  recorder.record(0, 0, 'ignored', null)
  recorder.start(100, { source: 'unit-test' })
  recorder.record(101.25, 8.2, 'pose', input); input.position[0] = 99
  recorder.record(104, 8.2, 'pause', { paused: true }); recorder.stop()
  recorder.record(105, 8.3, 'ignored', null)
  const trace = recorder.export()
  assert.deepEqual(trace.counts, { pose: 1, pause: 1 })
  assert.equal(trace.entries[0].wallMs, 1.25)
  assert.deepEqual(trace.entries[0].data, { position: [1, 2, 3] })
  trace.entries.length = 0
  assert.equal(recorder.length, 2)
})
test('recording stops with explicit truncation rather than losing the first transitions', () => {
  const recorder = new ExperienceRecorder(2); recorder.start(0, null)
  for (let i = 0; i < 3; i++) recorder.record(i, i, 'frame', i)
  assert.equal(recorder.active, false); assert.equal(recorder.truncated, true)
  assert.deepEqual(recorder.export().entries.map(e => e.data), [0, 1])
  recorder.start(5, null); assert.equal(recorder.length, 0); assert.equal(recorder.truncated, false)
})
