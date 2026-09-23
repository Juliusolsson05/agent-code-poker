import test from 'node:test'
import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { request } from 'node:http'
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { startLanHost } from '../server/http'
import { RoomProjection } from '../src/presentation/RoomProjection'
import { ChipLedger } from '../src/scene/ChipLedger'

const nonce = () => randomBytes(32).toString('hex')
async function call(origin: string, path: string, body?: unknown, token?: string, headers: Record<string, string> = {}) {
  const response = await fetch(origin + path, { method: body === undefined ? 'GET' : 'POST', headers: {
    origin, ...(body === undefined ? {} : { 'content-type': 'application/json' }),
    ...(token ? { authorization: `Bearer ${token}` } : {}), ...headers,
  }, body: body === undefined ? undefined : JSON.stringify(body) })
  return { status: response.status, body: await response.json(), headers: response.headers }
}

test('six actual HTTP clients complete a hand with viewer-relative chip accounts and private cards', async t => {
  let clock=1000
  const host=await startLanHost({port:0,automaticTicks:false,now:()=>clock});t.after(()=>host.close())
  const a=(await call(host.origin,'/api/create',{name:'Host',nonce:nonce()})).body
  const tokens=[a.token], projections=Array.from({length:6},()=>new RoomProjection()), ledgers=Array.from({length:6},()=>new ChipLedger())
  for(let i=1;i<6;i++)tokens.push((await call(host.origin,'/api/join',{name:`Player ${i}`,nonce:nonce(),code:a.code})).body.token)
  const initial=(await call(host.origin,'/api/state',undefined,a.token)).body.view
  await call(host.origin,'/api/start',{revision:initial.revision},a.token)
  for(let step=0;step<40;step++) {
    const views=await Promise.all(tokens.map(async token=>(await call(host.origin,'/api/state',undefined,token)).body.view))
    for(let seat=0;seat<6;seat++) {
      const v=views[seat], scene=projections[seat].remote(v,seat), chips=ledgers[seat].sync(scene)
      assert.equal(scene.players[0].sourceSeat,seat)
      assert.equal(chips.reduce((n,c)=>n+c.value,0),12000)
      for(const p of scene.players) assert.equal(chips.filter(c=>c.account===`bank:${p.seat}`).reduce((n,c)=>n+c.value,0),p.stack)
      if(v.phase==='betting')assert.deepEqual(v.players.filter((p:any)=>p.cards.kind==='visible').map((p:any)=>p.seat),[seat])
    }
    const v=views[0]
    if(v.phase==='complete'){assert.ok(v.results.length>0);return}
    if(v.phase==='betting') {
      const actor=v.actor, own=views[actor]
      assert.equal((await call(host.origin,'/api/action',{sequence:own.self.nextSequence,revision:own.revision,action:{type:own.legal.check?'check':'call'}},tokens[actor])).status,200)
    } else {
      // Actual HTTP packets with an explicitly injected scheduler clock, not
      // a browser recording, real latency measurement or a Wi-Fi claim.
      clock+=1050;host.pulse()
    }
  }
  assert.fail('A check/call hand did not settle within its bounded action count')
})

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
  assert.match(page.headers.get('content-security-policy')!, /media-src data:;/,'bundled fireplace media is allowed without external audio origins')
  // Exactly one public origin, the user-approved ElevenLabs exception (#22,
  // AGENTS.md). Fire audio or anything else must not widen it further.
  assert.match(page.headers.get('content-security-policy')!, /connect-src 'self' https:\/\/api\.elevenlabs\.io;/,'only the approved voice origin widens poker network access')
  assert.equal(page.headers.get('access-control-allow-origin'), null)
  assert.match(await page.text(), /Multiplayer poker room/)
  const bundle = await fetch(host.origin + '/client.js')
  assert.equal(bundle.status,200)
  assert.match(bundle.headers.get('content-type')!, /javascript/)
  assert.doesNotMatch(await bundle.text(), /from ['"](?:react|three|\.\.\/)/, 'LAN serves a compiled bundle, not source imports')
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

test('real leisure packets are token-bound, paused like wagers, never saved and visible to the other player', async t => {
  const directory = mkdtempSync(join(tmpdir(), 'poker-leisure-http-'))
  let now = 1000
  const host = await startLanHost({ port: 0, now: () => now, automaticTicks: false, checkpointDirectory: directory })
  t.after(async () => { await host.close(); rmSync(directory, { recursive: true, force: true }) })
  const a = (await call(host.origin, '/api/create', { name: 'Host', nonce: nonce() })).body
  const b = (await call(host.origin, '/api/join', { name: 'Guest', nonce: nonce(), code: a.code })).body
  const ready = (await call(host.origin, '/api/state', undefined, a.token)).body
  await call(host.origin, '/api/start', { revision: ready.view.revision }, a.token)
  const before = (await call(host.origin, '/api/state', undefined, b.token)).body.view
  assert.equal((await call(host.origin, '/api/leisure', { action: 'smoke' })).status, 401)
  assert.equal((await call(host.origin, '/api/leisure', { action: 'smoke' }, b.token, { origin: 'http://evil.invalid' })).status, 403)
  assert.equal((await call(host.origin, '/api/leisure', { action: 'smoke', pad: 'x'.repeat(5000) }, b.token)).status, 413)
  const forged = await call(host.origin, '/api/leisure', { action: 'smoke', seat: 0 }, b.token)
  assert.equal(forged.status, 409); assert.equal(forged.body.receipt.code, 'invalid')
  // A leisure commit would fail against this blocking directory (see the bank
  // test): a 200 here proves the checkpoint was never rewritten for a gesture.
  mkdirSync(join(directory, 'table.pending'))
  const smoked = await call(host.origin, '/api/leisure', { action: 'smoke' }, b.token)
  assert.equal(smoked.status, 200)
  assert.deepEqual(smoked.body, { receipt: { ok: true, code: 'accepted' } }, 'a bare receipt: no view, generation or observation to reorder')
  now += 300
  const seen = (await call(host.origin, '/api/state', undefined, a.token)).body.view.players[1].leisure
  assert.equal(seen.action, 'smoke'); assert.equal(seen.ageMs, 300)
  const after = (await call(host.origin, '/api/state', undefined, b.token)).body.view
  assert.equal(after.revision, before.revision); assert.equal(after.self.nextSequence, before.self.nextSequence)
  rmSync(join(directory, 'table.pending'), { recursive: true })
  await call(host.origin, '/api/pause', { paused: true }, a.token)
  now += 4000
  const paused = await call(host.origin, '/api/leisure', { action: 'sip', kind: 'wine' }, b.token)
  assert.equal(paused.status, 409); assert.equal(paused.body.receipt.code, 'paused')
  await call(host.origin, '/api/pause', { paused: false }, a.token)
  assert.equal((await call(host.origin, '/api/leisure', { action: 'sip', kind: 'wine' }, b.token)).status, 200)
  assert.equal((await call(host.origin, '/api/leisure', { action: 'sip', kind: 'wine' }, b.token)).body.receipt.code, 'busy', 'the previous sip is still playing')
  assert.equal((await call(host.origin, '/api/state', undefined, a.token)).body.view.players[1].leisure.drinkKind, 'wine')
})
