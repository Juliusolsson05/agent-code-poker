import test from 'node:test'
import assert from 'node:assert/strict'
import { SeatRecovery, type SeatKey } from '../server/client/SeatRecovery'

class MemoryStorage {
  values = new Map<string, string>()
  get length() { return this.values.size }
  key(i: number) { return [...this.values.keys()][i] ?? null }
  getItem(k: string) { return this.values.get(k) ?? null }
  setItem(k: string, v: string) { this.values.set(k, v) }
  removeItem(k: string) { this.values.delete(k) }
}
const key = (n: number): SeatKey => ({ token: String(n).repeat(43), nonce: String(n).repeat(64), name: `Guest ${n}` })
const vault = (session = new MemoryStorage(), local = new MemoryStorage()) => new SeatRecovery(() => session, () => local)

test('synthetic close/reopen lists a saved seat without automatically claiming it', () => {
  const local = new MemoryStorage(), session = new MemoryStorage(), first = vault(session, local)
  assert.equal(first.save(key(1), true), true)
  assert.deepEqual(vault(session, local).current(), key(1), 'reload resumes only this tab')
  const reopened = vault(new MemoryStorage(), local)
  assert.equal(reopened.current(), null, 'fresh tab must not silently take over')
  assert.deepEqual(reopened.saved(), [key(1)])
  reopened.save(reopened.saved()[0], false)
  assert.deepEqual(reopened.current(), key(1), 'only explicit selection sets the current tab')
})

test('synthetic separate tabs preserve each other and explicit forget touches only one identity', () => {
  const local = new MemoryStorage(), first = vault(new MemoryStorage(), local), second = vault(new MemoryStorage(), local)
  local.setItem('unrelated-solo-save', 'preserve')
  first.save(key(1), true); second.save(key(2), true)
  assert.equal(first.saved().length, 2)
  first.forget(key(1))
  assert.deepEqual(second.current(), key(2)); assert.deepEqual(first.saved(), [key(2)])
  assert.equal(local.getItem('unrelated-solo-save'), 'preserve')
})

test('synthetic denied storage never throws away the in-memory admission result', () => {
  const denied = () => { throw new Error('Storage disabled') }
  const store = new SeatRecovery(denied, denied)
  assert.equal(store.current(), null); assert.deepEqual(store.saved(), [])
  assert.equal(store.save(key(1), true), false)
  assert.equal(store.forget(key(1)), false)
  const session = new MemoryStorage(), partial = new SeatRecovery(() => session, denied)
  assert.equal(partial.save(key(1), true), false)
  assert.deepEqual(partial.current(), key(1), 'failure to remember does not discard successful tab save')
})

test('synthetic admission nonce survives reload before response, without a saved seat token', () => {
  const session = new MemoryStorage(), local = new MemoryStorage()
  const candidate = { ...key(1), token: '' }
  assert.equal(vault(session, local).save(candidate, false), true)
  assert.deepEqual(vault(session, local).current(), candidate)
  assert.deepEqual(vault(session, local).saved(), [])
})

test('synthetic malformed keys fail closed and old tab credentials migrate without erasure', () => {
  const session = new MemoryStorage(), local = new MemoryStorage()
  session.setItem('poker-lan-connection-test-v1', JSON.stringify({ token: key(1).token, nonce: key(1).nonce }))
  assert.deepEqual(vault(session, local).current(), { ...key(1), name: 'Saved player' })
  session.setItem('poker-lan-connection-test-v1', '{broken')
  assert.equal(vault(session, local).current(), null)
  assert.equal(session.getItem('poker-lan-connection-test-v1'), '{broken')
  assert.equal(vault(session, local).save({ ...key(1), token: 'bad' }, true), false)
  assert.deepEqual(vault(session, local).saved(), [])
})

test('saved seats carry table code and time, list newest first, and keep legacy entries (#24)', () => {
  // After a host restart the browser still holds seats from earlier tables.
  // The picker must show which table each belongs to, newest first, so the
  // live seat is the default choice instead of a dead one in storage order.
  const local = new MemoryStorage(), store = vault(new MemoryStorage(), local)
  local.setItem('poker-lan-saved-seat-v1:' + key(1).nonce, JSON.stringify(key(1))) // legacy: no labels
  store.save({ ...key(2), code: '3B8E5AB6FE', at: 1000 }, true)
  store.save({ ...key(3), code: 'AAAAA11111', at: 5000 }, true)
  assert.deepEqual(store.saved().map(k => k.name), ['Guest 3', 'Guest 2', 'Guest 1'])
  assert.deepEqual(store.saved()[0], { ...key(3), code: 'AAAAA11111', at: 5000 })
  assert.deepEqual(store.saved()[2], key(1), 'legacy entry parses unchanged and sorts last')
})

test('a malformed label is dropped without discarding a good credential (#24)', () => {
  const local = new MemoryStorage(), store = vault(new MemoryStorage(), local)
  local.setItem('poker-lan-saved-seat-v1:' + key(4).nonce, JSON.stringify({ ...key(4), code: '<script>', at: -3 }))
  assert.deepEqual(store.saved(), [key(4)])
})
