import test from 'node:test'
import assert from 'node:assert/strict'
import { ResponseOrder } from '../server/client/ResponseOrder'
import capture from '../testing/fixtures/experience/lan-response-order.json'

// These envelope fields were captured over actual isolated HTTP sockets.
// Delivery reordering, new generations and local resets below are deliberate
// fault injections, NOT a recording of browser network behavior.
const [initial, paused, resumed] = capture.records
test('transport observations preserve pause without requiring a poker revision', () => {
  const owner = new ResponseOrder()
  assert.equal(owner.accept(owner.begin(), initial), true)
  const poll = owner.begin(), pause = owner.begin()
  assert.equal(owner.accept(pause, paused), true)
  assert.equal(owner.accept(poll, initial), false, 'old poll cannot undo pause')
  assert.equal(owner.failureCurrent(poll), false, 'old poll error cannot disable healthy controls')
  assert.equal(owner.accept(owner.begin(), resumed), true)
  assert.equal(owner.accept(owner.begin(), paused), false)
})

test('seat cleanup invalidates pending successes and failures even when resuming the same key', () => {
  const owner = new ResponseOrder(), old = owner.begin()
  owner.reset()
  assert.equal(owner.current(old), false)
  assert.equal(owner.accept(old, paused), false)
  assert.equal(owner.failureCurrent(old), false)
  assert.equal(owner.accept(owner.begin(), initial), true)
  owner.reset() // Definitive ended-session rejection also seals in-flight work.
  assert.equal(owner.accept(old, resumed), false)
})

test('a new process may restart observations but delayed old-process replies cannot switch back', () => {
  const owner = new ResponseOrder()
  owner.accept(owner.begin(), resumed)
  const delayed = owner.begin(), recovery = owner.begin(), concurrentRecovery = owner.begin()
  const restarted = { ...paused, generation: 'synthetic-restart', observation: 1 }
  assert.equal(owner.accept(recovery, restarted), true)
  assert.equal(owner.accept(delayed, resumed), false)
  assert.equal(owner.failureCurrent(delayed), false)
  assert.equal(owner.accept(concurrentRecovery, {...restarted, observation:2}), true)
  assert.equal(owner.failureCurrent(owner.begin()), true, 'fresh failures must remain visible')
})

test('malformed ordering data cannot poison future valid observations', () => {
  const owner = new ResponseOrder(), request = owner.begin()
  for (const observation of [NaN, Infinity, -1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(owner.accept(request, {...initial, observation}), false)
  }
  assert.equal(owner.accept(request, {...initial, generation:''}), false)
  assert.equal(owner.accept(request, initial), true)
})
