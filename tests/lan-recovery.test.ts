import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, readFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { startLanHost } from '../server/http'
import { spawn, type ChildProcess } from 'node:child_process'
import { once } from 'node:events'

test('actual loopback clients recover seats/private cards and duplicate ACK after durable host restart', async t => {
  const directory = mkdtempSync(join(tmpdir(), 'poker-host-restart-'))
  let host = await startLanHost({ port: 0, automaticTicks: false, checkpointDirectory: directory })
  t.after(async () => { await host.close(); rmSync(directory, { recursive: true, force: true }) })
  const tokens: string[] = []
  async function api(path: string, input?: unknown, seat = 0) {
    const response = await fetch(host.origin + path, { method: input === undefined ? 'GET' : 'POST',
      headers: { Origin: host.origin, 'Content-Type': 'application/json', ...(tokens[seat] ? { Authorization: `Bearer ${tokens[seat]}` } : {}) },
      ...(input === undefined ? {} : { body: JSON.stringify(input) }) })
    return { status: response.status, data: await response.json() }
  }
  const created = await api('/api/create', { name: 'Host', nonce: 'a'.repeat(64) })
  tokens.push(created.data.token)
  for (let seat = 1; seat < 6; seat++) {
    const r = await api('/api/join', { name: `Guest ${seat}`, nonce: String(seat).repeat(64), code: created.data.code })
    assert.equal(r.status, 201); tokens.push(r.data.token)
  }
  let state = (await api('/api/state')).data
  assert.equal((await api('/api/start', { revision: state.view.revision })).status, 200)
  state = (await api('/api/state', undefined, 3)).data
  const request = { sequence: state.view.self.nextSequence, revision: state.view.revision, action: { type: 'call' } }
  const accepted = await api('/api/action', request, 3)
  assert.equal(accepted.data.receipt.code, 'accepted')
  const privateBefore = await Promise.all(tokens.map((_, seat) => api('/api/state', undefined, seat)))
  const bytes = readFileSync(join(directory, 'table.json'), 'utf8')
  assert.ok(bytes.includes('lastRequest'), 'idempotency stored with ledger, never a second file')
  await host.close()
  host = await startLanHost({ port: 0, automaticTicks: false, checkpointDirectory: directory })
  for (let seat = 0; seat < 6; seat++) {
    const restored = await api('/api/state', undefined, seat)
    assert.equal(restored.status, 200); assert.equal(restored.data.paused, true)
    assert.equal(restored.data.view.self.seat, seat)
    assert.deepEqual(restored.data.view.players.map((p: any) => p.cards), privateBefore[seat].data.view.players.map((p: any) => p.cards))
    assert.deepEqual(restored.data.view.players.map((p: any) => p.stack), privateBefore[seat].data.view.players.map((p: any) => p.stack))
    assert.notEqual(restored.data.generation, state.generation)
    for (const secret of [...tokens, '"deck"', '"lastRequest"']) assert.equal(JSON.stringify(restored.data).includes(secret), false)
  }
  assert.equal((await api('/api/pause', { paused: false })).status, 200)
  const retry = await api('/api/action', request, 3)
  assert.equal(retry.data.receipt.code, 'duplicate')
  assert.equal(retry.data.view.players[3].bet, 20)
  await api('/api/leave', {})
  await host.close(); host = await startLanHost({ port: 0, automaticTicks: false, checkpointDirectory: directory })
  assert.equal((await api('/api/state')).status, 410, 'explicit end is not revived by restarting')
})

test('synthetic disk fault over actual HTTP rejects acknowledgement and freezes the authority', async t => {
  const directory = mkdtempSync(join(tmpdir(), 'poker-host-fault-'))
  const host = await startLanHost({ port: 0, automaticTicks: false, checkpointDirectory: directory })
  t.after(async () => { await host.close(); rmSync(directory, { recursive: true, force: true }) })
  const post = async (path: string, body: object, token = '') => fetch(host.origin + path, { method: 'POST',
    headers: { Origin: host.origin, 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
  const admitted = await (await post('/api/create', { name: 'Host', nonce: 'a'.repeat(64) })).json()
  const before = readFileSync(join(directory, 'table.json'))
  mkdirSync(join(directory, 'table.pending'))
  const rejected = await post('/api/start', { revision: 0 }, admitted.token)
  assert.equal(rejected.status, 503)
  assert.equal((await rejected.json()).view, undefined, 'uncommitted cards must not escape')
  assert.deepEqual(readFileSync(join(directory, 'table.json')), before)
  const poll = await fetch(host.origin + '/api/state', { headers: { Authorization: `Bearer ${admitted.token}` } })
  assert.equal(poll.status, 503)
})

test('actual isolated host SIGKILL preserves an acknowledged wager and its replay protection', { timeout: 15000 }, async t => {
  const directory = mkdtempSync(join(tmpdir(), 'poker-http-crash-'))
  const module = new URL('../server/http.ts', import.meta.url).href
  let child: ChildProcess | undefined, origin = ''
  const stop = async () => {
    if (child && child.exitCode === null && child.signalCode === null) { const exited = once(child, 'exit');child.kill('SIGKILL');await exited }
  }
  t.after(async () => { await stop();rmSync(directory, { recursive: true, force: true }) })
  const boot = async () => {
    child = spawn(process.execPath, ['--import', 'tsx', '--input-type=module', '-e',
      `import {startLanHost} from ${JSON.stringify(module)}; const host=await startLanHost({port:0,automaticTicks:false,checkpointDirectory:process.argv[1]});process.stdout.write(host.origin)`, directory], { stdio: ['ignore', 'pipe', 'pipe'] })
    const [bytes] = await Promise.race([once(child.stdout!, 'data'), once(child, 'exit').then(() => { throw new Error('Host exited before listening') })])
    origin = String(bytes); assert.match(origin, /^http:\/\/127\.0\.0\.1:\d+$/)
  }
  await boot()
  const tokens: string[] = []
  const api = async (path: string, body?: object, seat = 0) => {
    const r = await fetch(origin + path, { method: body ? 'POST' : 'GET', headers: { Origin: origin,
      'Content-Type': 'application/json', Authorization: `Bearer ${tokens[seat] || ''}` }, ...(body ? { body: JSON.stringify(body) } : {}) })
    assert.ok(r.ok); return r.json()
  }
  const created = await api('/api/create', { name: 'Host', nonce: 'a'.repeat(64) });tokens.push(created.token)
  for (let seat = 1; seat < 6; seat++) tokens.push((await api('/api/join', { name: `Guest ${seat}`, nonce: String(seat).repeat(64), code: created.code })).token)
  await api('/api/start', { revision: (await api('/api/state')).view.revision })
  const before = await api('/api/state', undefined, 3)
  const request = { sequence: before.view.self.nextSequence, revision: before.view.revision, action: { type: 'call' } }
  const accepted = await api('/api/action', request, 3)
  assert.equal(accepted.receipt.code, 'accepted')
  await stop(); await boot()
  const recovered = await api('/api/state', undefined, 3)
  assert.equal(recovered.paused, true);assert.equal(recovered.durable, true)
  assert.deepEqual(recovered.view.players.map((p: any) => ({ stack: p.stack, bet: p.bet, cards: p.cards })),
    accepted.view.players.map((p: any) => ({ stack: p.stack, bet: p.bet, cards: p.cards })))
  await api('/api/state');await api('/api/pause', { paused: false })
  assert.equal((await api('/api/action', request, 3)).receipt.code, 'duplicate')
})
