import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, statSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { CheckpointStore } from '../server/persistence/CheckpointStore'

// Real filesystem operations in disposable directories, not claims about an
// observed power loss. Faults below are deliberate synthetic injection.
test('atomic host store preserves a complete replacement, private permissions and ended tombstone', t => {
  const directory = mkdtempSync(join(tmpdir(), 'poker-checkpoint-'))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  let store = new CheckpointStore(directory)
  assert.equal(store.load(), null)
  store.commit({ version: 1, balance: 12000 })
  assert.equal(statSync(join(directory, 'table.json')).mode & 0o777, 0o600)
  assert.throws(() => new CheckpointStore(directory), /already owned/)
  store.commit({ version: 1, balance: 11980 })
  store.close(); store = new CheckpointStore(directory)
  assert.deepEqual(store.load(), { version: 1, balance: 11980 })
  store.commit(null); store.close(); store = new CheckpointStore(directory)
  assert.equal(store.load(), null, 'explicit end is durable, not deletion followed by resurrection')
  store.close(); store.close()
})

test('synthetic failed replacement keeps last bytes and poisons the writer until restart', t => {
  const directory = mkdtempSync(join(tmpdir(), 'poker-checkpoint-'))
  const store = new CheckpointStore(directory)
  t.after(() => { store.close(); rmSync(directory, { recursive: true, force: true }) })
  store.commit({ accepted: 1 })
  const original = readFileSync(join(directory, 'table.json'))
  // A directory at the reserved staging path makes exclusive staging fail.
  // Never delete unknown bytes to get past a failed write.
  mkdirSync(join(directory, 'table.pending'))
  assert.throws(() => store.commit({ accepted: 2 }), /checkpoint/)
  assert.deepEqual(readFileSync(join(directory, 'table.json')), original)
  rmSync(join(directory, 'table.pending'), { recursive: true })
  assert.throws(() => store.commit({ accepted: 3 }), /checkpoint/)
})

test('corrupt, oversized and stale-lock files are preserved rather than reset', t => {
  const directory = mkdtempSync(join(tmpdir(), 'poker-checkpoint-'))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  writeFileSync(join(directory, 'table.json'), '{broken', { mode: 0o600 })
  let store = new CheckpointStore(directory)
  assert.throws(() => store.load(), /checkpoint/); store.close()
  assert.equal(readFileSync(join(directory, 'table.json'), 'utf8'), '{broken')
  writeFileSync(join(directory, 'table.json'), ' '.repeat(300000))
  store = new CheckpointStore(directory); assert.throws(() => store.load(), /checkpoint/); store.close()
  writeFileSync(join(directory, 'host.lock'), 'unverified-owner')
  assert.throws(() => new CheckpointStore(directory), /already owned/)
  assert.equal(readFileSync(join(directory, 'host.lock'), 'utf8'), 'unverified-owner')
})
