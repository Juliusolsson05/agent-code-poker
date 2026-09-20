import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
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

test('actual child-process kill releases ownership without losing the committed checkpoint', { timeout: 10000 }, async t => {
  const directory = mkdtempSync(join(tmpdir(), 'poker-checkpoint-crash-'))
  const module = new URL('../server/persistence/CheckpointStore.ts', import.meta.url).href
  // Kill only this explicitly spawned isolated writer. Wait for its ACK marker
  // before killing: this checks acknowledged data, not an invented ideal save.
  const child = spawn(process.execPath, ['--import', 'tsx', '--input-type=module', '-e',
    `import {CheckpointStore} from ${JSON.stringify(module)}; const store=new CheckpointStore(process.argv[1]); store.commit({accepted:7}); process.stdout.write('committed'); setInterval(()=>{},1000)`, directory], { stdio: ['ignore', 'pipe', 'pipe'] })
  t.after(async () => { if (child.exitCode === null && child.signalCode === null) { const exited = once(child, 'exit');child.kill('SIGKILL');await exited } rmSync(directory, { recursive: true, force: true }) })
  await Promise.race([once(child.stdout, 'data'), once(child, 'exit').then(() => { throw new Error('Writer exited before checkpoint') })])
  assert.throws(() => new CheckpointStore(directory), /already owned/)
  const exited = once(child, 'exit'); child.kill('SIGKILL'); await exited
  const restored = new CheckpointStore(directory)
  assert.deepEqual(restored.load(), { accepted: 7 }); restored.close()
})

test('interrupted staging bytes are preserved but never mistaken for an acknowledged ledger', t => {
  const directory = mkdtempSync(join(tmpdir(), 'poker-checkpoint-staging-'))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  let store = new CheckpointStore(directory); store.commit({ accepted: 7 }); store.close()
  writeFileSync(join(directory, 'table.pending'), '{partially written', { mode: 0o600 })
  store = new CheckpointStore(directory)
  assert.deepEqual(store.load(), { accepted: 7 })
  store.commit({ accepted: 8 }); store.close()
  const archive = readdirSync(directory).find(name => name.startsWith('interrupted-'))!
  assert.ok(archive); assert.equal(readFileSync(join(directory, archive), 'utf8'), '{partially written')
  assert.equal(statSync(join(directory, archive)).mode & 0o777, 0o600)
})
