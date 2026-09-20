import test from 'node:test'
import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { request } from 'node:http'
import { startLanHost } from '../server/http'

const nonce = () => randomBytes(32).toString('hex')
async function call(origin: string, path: string, body?: unknown, token?: string, headers: Record<string, string> = {}) {
  const response = await fetch(origin + path, { method: body === undefined ? 'GET' : 'POST', headers: {
    origin, ...(body === undefined ? {} : { 'content-type': 'application/json' }),
    ...(token ? { authorization: `Bearer ${token}` } : {}), ...headers,
  }, body: body === undefined ? undefined : JSON.stringify(body) })
  return { status: response.status, body: await response.json(), headers: response.headers }
}

// These are actual HTTP sockets with scripted clients, not browser/Wi-Fi/user
// recordings. Existing D9 tests separately replay the retained public game.
test('real loopback clients create, code-join, retry admission and receive distinct private views', async t => {
  const host = await startLanHost({ port: 0, automaticTicks: false }); t.after(() => host.close())
  const first = { name: 'Host', nonce: nonce() }
  const created = await call(host.origin, '/api/create', first)
  assert.equal(created.status, 201)
  const a = created.body
  assert.equal((await call(host.origin, '/api/create', first)).body.token, a.token)
  assert.equal((await call(host.origin, '/api/create', { ...first, nonce: nonce() })).status, 409)
  assert.equal((await call(host.origin, '/api/join', { name: 'Guest', nonce: nonce(), code: 'WRONG' })).status, 403)
  const join = { name: '<b>Guest</b>', nonce: nonce(), code: a.code }
  const b = (await call(host.origin, '/api/join', join)).body
  assert.notEqual(b.token, a.token)
  assert.equal((await call(host.origin, '/api/join', join)).body.token, b.token)
  const initial = await call(host.origin, '/api/state', undefined, a.token)
  const later = await call(host.origin, '/api/state', undefined, a.token)
  assert.ok(later.body.observation > initial.body.observation, 'poll ordering includes states without wager changes')
  assert.equal(later.body.view.revision, initial.body.view.revision)
  assert.equal(initial.body.view.players.filter((p: any) => p.kind === 'human').length, 2)
  assert.equal((await call(host.origin, '/api/start', { revision: initial.body.view.revision }, b.token)).status, 403)
  assert.equal((await call(host.origin, '/api/start', { revision: initial.body.view.revision }, a.token)).status, 200)
  const va = (await call(host.origin, '/api/state', undefined, a.token)).body.view
  const vb = (await call(host.origin, '/api/state', undefined, b.token)).body.view
  assert.equal(va.self.seat, 0); assert.equal(vb.self.seat, 1)
  assert.equal(vb.players[1].name, '<b>Guest</b>', 'server carries plain text, never HTML')
  for (const v of [va, vb]) {
    assert.equal(v.players.length, 6)
    assert.deepEqual(v.players.filter((p: any) => p.cards.kind === 'visible').map((p: any) => p.seat), [v.self.seat])
    assert.equal(v.players[v.self.seat].displaySeat, 0)
    for (const key of ['deck', 'cursor', 'pending', 'history']) assert.equal(key in v, false)
  }
  assert.equal(initial.headers.get('cache-control'), 'no-store')
  assert.equal((await call(host.origin, '/api/state', undefined, 'forged')).status, 401)
})

test('real HTTP rejects foreign origins, forged host, oversized and malformed bodies, and unlisted files', async t => {
  const host = await startLanHost({ port: 0, automaticTicks: false }); t.after(() => host.close())
  assert.equal((await call(host.origin, '/api/create', { name: 'x', nonce: nonce() }, undefined, { origin: 'http://evil.invalid' })).status, 403)
  const invalid = await fetch(host.origin + '/api/create', { method: 'POST', headers: { origin: host.origin, 'content-type': 'application/json' }, body: '{' })
  assert.equal(invalid.status, 400)
  const large = await call(host.origin, '/api/create', { name: 'x'.repeat(5000), nonce: nonce() })
  assert.equal(large.status, 413)
  for (const path of ['/src/engine/game.ts', '/package.json', '/@fs/etc/passwd', '/client.js?token=secret']) {
    assert.equal((await fetch(host.origin + path)).status, 404)
  }
  const forged = await new Promise<number>(resolve => {
    const req = request(host.origin + '/', { headers: { host: 'evil.invalid' } }, r => { r.resume(); resolve(r.statusCode!) })
    req.end()
  })
  assert.equal(forged, 403)
  const page = await fetch(host.origin)
  assert.match(page.headers.get('content-security-policy')!, /script-src 'self'/)
  assert.equal(page.headers.get('access-control-allow-origin'), null)
  assert.match(await page.text(), /Connection test/)
})

test('real client packets bind actions to tokens and pause/lease/reconnect do not create another seat', async t => {
  let now = 1000
  const host = await startLanHost({ port: 0, now: () => now, automaticTicks: false }); t.after(() => host.close())
  const a = (await call(host.origin, '/api/create', { name: 'Host', nonce: nonce() })).body
  const tokens = [a.token]
  for (let i = 1; i < 6; i++) tokens.push((await call(host.origin, '/api/join', { name: `Guest ${i}`, nonce: nonce(), code: a.code })).body.token)
  assert.equal((await call(host.origin, '/api/join', { name: 'Seventh', nonce: nonce(), code: a.code })).status, 409)
  let state = (await call(host.origin, '/api/state', undefined, a.token)).body
  await call(host.origin, '/api/start', { revision: state.view.revision }, a.token)
  const v = (await call(host.origin, '/api/state', undefined, tokens[3])).body.view
  const packet = { sequence: v.self.nextSequence, revision: v.revision, action: { type: 'call' } }
  assert.equal((await call(host.origin, '/api/action', packet, tokens[4])).body.receipt.code, 'not-your-turn')
  assert.equal((await call(host.origin, '/api/action', packet, tokens[3])).body.receipt.code, 'accepted')
  assert.equal((await call(host.origin, '/api/action', packet, tokens[3])).body.receipt.code, 'duplicate')
  await call(host.origin, '/api/pause', { paused: true }, a.token)
  state = (await call(host.origin, '/api/state', undefined, tokens[4])).body
  assert.equal(state.paused, true)
  assert.equal((await call(host.origin, '/api/action', { sequence: 1, revision: state.view.revision, action: { type: 'call' } }, tokens[4])).status, 409)
  await call(host.origin, '/api/pause', { paused: false }, a.token)
  now += 16000; host.pulse()
  const disconnected = (await call(host.origin, '/api/state', undefined, tokens[4])).body
  assert.equal(disconnected.hostConnected, false)
  assert.equal(disconnected.paused, true)
  const revision = disconnected.view.gameRevision
  now += 2000; host.pulse()
  assert.equal((await call(host.origin, '/api/state', undefined, tokens[4])).body.view.gameRevision, revision)
  state = (await call(host.origin, '/api/state', undefined, a.token)).body
  assert.equal(state.hostConnected, true); assert.equal(state.view.players.length, 6)
  assert.equal(state.view.players[4].kind, 'human'); assert.equal(state.view.players[4].connected, true)
  await call(host.origin, '/api/leave', {}, tokens[4])
  assert.equal((await call(host.origin, '/api/state', undefined, tokens[4])).status, 401)
  await call(host.origin, '/api/leave', {}, a.token)
  assert.equal((await call(host.origin, '/api/state', undefined, tokens[3])).status, 410)
})

test('real join attempts are rate bounded and cannot create unlimited identity state', async t => {
  const host = await startLanHost({ port: 0, automaticTicks: false }); t.after(() => host.close())
  let last = 0
  for (let i = 0; i < 25; i++) last = (await call(host.origin, '/api/join', { name: 'x', nonce: nonce(), code: 'WRONG' })).status
  assert.equal(last, 429)
})
