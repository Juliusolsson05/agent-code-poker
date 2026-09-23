import test from 'node:test'
import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { request, type OutgoingHttpHeaders } from 'node:http'
import { lanAddresses, startLanHost } from '../server/http'

// Inside Agent Code the table runs as a loopback-only service. EVERY request
// reaches it through the host app's main process, one of two ways:
//
//  - The service proxy. It carries the host player's own frame, via
//    ./__service/<id>/…
//    Source: agent-code src/main/extensions/serviceTransport.ts.
//    Forwards: accept, content-type, authorization.
//    Sets: x-agent-code-transport: service.
//    Dials: http://127.0.0.1:<port>, so Host is 127.0.0.1:<port>.
//  - The LAN listener. It carries guests, either browsers or another Agent
//    Code install through net.fetch.
//    Source: agent-code src/main/extensions/serviceLanListener.ts.
//    Forwards: accept, content-type, authorization, origin, sec-fetch-site.
//    Sets: x-agent-code-transport: lan, plus x-forwarded-for (the socket peer)
//    and x-forwarded-host (the Host the peer used).
//    Dials: 127.0.0.1:<port>.
//
// The helpers below HAND-BUILD those header sets and send them over real
// sockets to the real startLanHost. They do not run the host code: the host
// side of the contract is pinned by agent-code's serviceTransport.test.ts and
// serviceLanListener.test.ts. If either host file changes its forwarded set,
// both sides must change together (agent-code#1147, poker#17). For a manual
// run of the real host code in front of this server, see
// testing/manual/agent-code-lan-e2e.mts.
//
// Raw node:http sends Host = 127.0.0.1:<port>, which is exactly the Host the
// Agent Code proxy and listener dial with.

const TRANSPORT = 'x-agent-code-transport'
const LISTENER = '192.168.1.42:61234' // the Host a guest dialed on the host's LAN listener

type Reply = { status: number; body: any }

/** Raw node:http so nothing (fetch, undici) adds or hides a header. */
function raw(origin: string, method: 'GET' | 'POST' | 'OPTIONS', path: string, headers: OutgoingHttpHeaders, body?: unknown): Promise<Reply & { headers: Record<string, unknown> }> {
  const url = new URL(origin)
  const payload = body === undefined ? undefined : JSON.stringify(body)
  return new Promise((resolve, reject) => {
    const req = request({ host: url.hostname, port: url.port, method, path, headers: {
      ...headers, ...(payload === undefined ? {} : { 'content-type': 'application/json', 'content-length': Buffer.byteLength(payload) }),
    } }, res => {
      let text = ''
      res.on('data', chunk => { text += chunk })
      res.on('end', () => resolve({ status: res.statusCode ?? 0, body: text ? JSON.parse(text) : undefined, headers: res.headers }))
    })
    req.on('error', reject)
    req.end(payload)
  })
}

/** The host player's frame through the service proxy. */
const viaProxy = (origin: string, path: string, body?: unknown, token?: string) =>
  raw(origin, body === undefined ? 'GET' : 'POST', path, {
    accept: '*/*',
    ...(token ? { authorization: `Bearer ${token}` } : {}),
    [TRANSPORT]: 'service',
  }, body)

/** A guest through the LAN listener. `origin` is what the guest's browser, or
 *  the in-app guest transport, sends: the address it dialed. */
const viaListener = (origin: string, path: string, body?: unknown, token?: string, over: Record<string, string> = {}) =>
  raw(origin, body === undefined ? 'GET' : 'POST', path, {
    accept: '*/*',
    ...(body === undefined ? {} : { origin: `http://${LISTENER}` }),
    ...(token ? { authorization: `Bearer ${token}` } : {}),
    [TRANSPORT]: 'lan',
    'x-forwarded-for': '192.168.1.77',
    'x-forwarded-host': LISTENER,
    ...over,
  }, body)

const nonce = () => randomBytes(32).toString('hex')

async function table(t: { after(fn: () => unknown): void }, clock = { now: 1000 }) {
  // lan:false, port 0, agentCodeHost: exactly how server/service.ts starts it.
  const host = await startLanHost({ port: 0, lan: false, agentCodeHost: true, automaticTicks: false, now: () => clock.now })
  t.after(() => host.close())
  return host
}

test('the host player creates, starts, acts, pauses and reads through the service proxy', async t => {
  const host = await table(t)
  const created = await viaProxy(host.origin, '/api/create', { name: 'Host', nonce: nonce() })
  assert.equal(created.status, 201, JSON.stringify(created.body))
  const token = created.body.token
  const guest = await viaListener(host.origin, '/api/join', { name: 'Guest', nonce: nonce(), code: created.body.code })
  assert.equal(guest.status, 201, JSON.stringify(guest.body))
  const state = await viaProxy(host.origin, '/api/state', undefined, token)
  assert.equal(state.status, 200)
  assert.equal(state.body.isHost, true)
  const started = await viaProxy(host.origin, '/api/start', { revision: state.body.view.revision }, token)
  assert.equal(started.status, 200, JSON.stringify(started.body))
  const paused = await viaProxy(host.origin, '/api/pause', { paused: true }, token)
  assert.equal(paused.status, 200)
  assert.equal(paused.body.paused, true)
  assert.equal((await viaProxy(host.origin, '/api/pause', { paused: false }, token)).status, 200)
})

test('a guest joins, reads its private view and acts through the LAN listener', async t => {
  const clock = { now: 1000 }
  const host = await table(t, clock)
  const created = (await viaProxy(host.origin, '/api/create', { name: 'Host', nonce: nonce() })).body
  const joined = await viaListener(host.origin, '/api/join', { name: 'Guest', nonce: nonce(), code: created.code })
  assert.equal(joined.status, 201)
  const guest = joined.body.token
  const hostView = (await viaProxy(host.origin, '/api/state', undefined, created.token)).body.view
  assert.equal((await viaProxy(host.origin, '/api/start', { revision: hostView.revision }, created.token)).status, 200)
  // Play check/call until it is the guest's turn, then act as the guest. Bots
  // only move on the injected scheduler clock (automaticTicks is off).
  for (let step = 0; step < 40; step++) {
    const mine = (await viaListener(host.origin, '/api/state', undefined, guest)).body
    assert.equal(mine.isHost, false)
    assert.equal(mine.code, undefined, 'a guest must never receive the lobby code')
    const view = mine.view
    if (view.phase === 'betting' && view.actor === view.self.seat) {
      const acted = await viaListener(host.origin, '/api/action', {
        sequence: view.self.nextSequence, revision: view.revision, action: { type: view.legal.check ? 'check' : 'call' },
      }, guest)
      assert.equal(acted.status, 200, JSON.stringify(acted.body))
      assert.equal(acted.body.receipt.code, 'accepted')
      return
    }
    const own = (await viaProxy(host.origin, '/api/state', undefined, created.token)).body.view
    if (own.phase === 'betting' && own.actor === own.self.seat) {
      await viaProxy(host.origin, '/api/action', { sequence: own.self.nextSequence, revision: own.revision, action: { type: own.legal.check ? 'check' : 'call' } }, created.token)
    } else { clock.now += 1050; host.pulse() }
  }
  assert.fail('The guest never received a turn to act on')
})

test('a guest reconnects through the listener with its token after its lease lapsed', async t => {
  const clock = { now: 1000 }
  const host = await table(t, clock)
  const created = (await viaProxy(host.origin, '/api/create', { name: 'Host', nonce: nonce() })).body
  const guest = (await viaListener(host.origin, '/api/join', { name: 'Guest', nonce: nonce(), code: created.code })).body.token
  clock.now += 16000
  host.pulse()
  // Keep the host's own lease alive so the table is not host-paused.
  await viaProxy(host.origin, '/api/state', undefined, created.token)
  const seat = (view: any) => view.players.find((p: any) => p.name === 'Guest')
  assert.equal(seat((await viaProxy(host.origin, '/api/state', undefined, created.token)).body.view).connected, false)
  assert.equal((await viaListener(host.origin, '/api/state', undefined, guest)).status, 200)
  assert.equal(seat((await viaProxy(host.origin, '/api/state', undefined, created.token)).body.view).connected, true)
})

// The security hinge: the listener dials loopback, so without the forwarded
// peer every guest would pass the loopback-only create and take the host seat.
test('a guest through the listener can never create (and so never become) the host', async t => {
  const host = await table(t)
  const attempt = await viaListener(host.origin, '/api/create', { name: 'Mallory', nonce: nonce() })
  assert.equal(attempt.status, 403)
  assert.match(attempt.body.error, /host computer/)
  // A guest who ALSO claims the proxy's marker is still the forwarded guest:
  // the lan marker downgrades trust, and a joined value never upgrades it.
  const both = await viaListener(host.origin, '/api/create', { name: 'Mallory', nonce: nonce() }, undefined, { [TRANSPORT]: 'lan, service' })
  assert.equal(both.status, 403)
})

test('listener requests keep the website rules: private peer, literal host, same origin', async t => {
  const host = await table(t)
  const created = (await viaProxy(host.origin, '/api/create', { name: 'Host', nonce: nonce() })).body
  const join = (over: Record<string, string>) => viaListener(host.origin, '/api/join', { name: 'Guest', nonce: nonce(), code: created.code }, undefined, over)
  // DNS rebinding: a hostname can never be a forwarded Host.
  assert.equal((await join({ 'x-forwarded-host': 'evil.example:61234', origin: 'http://evil.example:61234' })).status, 403)
  // A public forwarded Host literal is not this LAN.
  assert.equal((await join({ 'x-forwarded-host': '8.8.8.8:61234', origin: 'http://8.8.8.8:61234' })).status, 403)
  // A page on another origin in the guest's browser (CSRF).
  assert.equal((await join({ origin: 'http://192.168.1.99:8080' })).status, 403)
  assert.equal((await join({ 'sec-fetch-site': 'cross-site' })).status, 403)
  // A POST with no Origin at all proves nothing.
  const bare = await raw(host.origin, 'POST', '/api/join', { [TRANSPORT]: 'lan', 'x-forwarded-for': '192.168.1.77', 'x-forwarded-host': LISTENER }, { name: 'Guest', nonce: nonce(), code: created.code })
  assert.equal(bare.status, 403)
  // A non-private forwarded peer.
  assert.equal((await join({ 'x-forwarded-for': '8.8.8.8' })).status, 403)
  // The control: the same request with the true facts is admitted.
  assert.equal((await join({})).status, 201)
})

test('an unauthenticated or unmarked request gets no free pass', async t => {
  const host = await table(t)
  const created = (await viaProxy(host.origin, '/api/create', { name: 'Host', nonce: nonce() })).body
  // A proxied call with no token is still unauthenticated.
  assert.equal((await viaProxy(host.origin, '/api/state')).status, 401)
  // Standalone rule unchanged: an unmarked loopback POST must prove its origin.
  const unmarked = await raw(host.origin, 'POST', '/api/pause', { authorization: `Bearer ${created.token}` }, { paused: true })
  assert.equal(unmarked.status, 403)
  const sameOrigin = await raw(host.origin, 'POST', '/api/pause', { authorization: `Bearer ${created.token}`, origin: host.origin }, { paused: true })
  assert.equal(sameOrigin.status, 200)
})

// The proxy marker is unforgeable from a web page ONLY because a custom header
// forces a CORS preflight that this server never grants. If someone ever adds
// CORS, any website could claim to be the host player's frame.
test('the server never grants a CORS preflight, which the service marker relies on', async t => {
  const host = await table(t)
  const preflight = await raw(host.origin, 'OPTIONS', '/api/create', {
    origin: 'http://evil.example', 'access-control-request-method': 'POST', 'access-control-request-headers': TRANSPORT,
  })
  assert.notEqual(preflight.status, 204)
  assert.equal(preflight.headers['access-control-allow-origin'], undefined)
  assert.equal(preflight.headers['access-control-allow-headers'], undefined)
})

// DNS rebinding: evil.example resolves to 127.0.0.1, so its page is
// same-origin with ITSELF and may attach any header without a preflight. The
// listener always dials with Host 127.0.0.1:<port>; any other Host with a
// marker did not come from Agent Code.
test('a DNS-rebound page cannot use a transport marker to skip the Host allow-list', async t => {
  const host = await table(t)
  const port = new URL(host.origin).port
  // A same-origin GET carries no Origin header, and a page cannot set one, so
  // the Host rule is the ONLY thing standing between a rebound GET and data.
  const rebound = { host: `evil.example:${port}` }
  for (const path of ['/', '/client.js', '/api/state']) {
    const lan = await raw(host.origin, 'GET', path, { ...rebound, [TRANSPORT]: 'lan', 'x-forwarded-for': '192.168.1.77', 'x-forwarded-host': LISTENER })
    assert.equal(lan.status, 403, `lan marker on ${path}`)
    assert.equal((await raw(host.origin, 'GET', path, { ...rebound, [TRANSPORT]: 'service' })).status, 403, `service marker on ${path}`)
  }
  const create = await raw(host.origin, 'POST', '/api/create', { ...rebound, origin: `http://evil.example:${port}`, [TRANSPORT]: 'service' }, { name: 'Mallory', nonce: nonce() })
  assert.equal(create.status, 403)
})

// A client on the host computer that dials the LAN listener on 127.x arrives
// as a loopback forwarded peer. That is local access, the same as the host
// computer's own browser on the standalone server, so it may create.
test('a loopback forwarded peer is local access and may create', async t => {
  const host = await table(t)
  const local = await viaListener(host.origin, '/api/create', { name: 'Host', nonce: nonce() }, undefined, {
    'x-forwarded-for': '127.0.0.1', 'x-forwarded-host': '127.0.0.1:61234', origin: 'http://127.0.0.1:61234',
  })
  assert.equal(local.status, 201)
})

// Standalone rules are unchanged: the CLI never sets agentCodeHost, so no
// marker is read, not even from a loopback socket.
test('the standalone server never reads markers, even on loopback', async t => {
  const host = await startLanHost({ port: 0, lan: false, automaticTicks: false })
  t.after(() => host.close())
  // `service` does not replace the Origin proof.
  const service = await raw(host.origin, 'POST', '/api/create', { [TRANSPORT]: 'service' }, { name: 'Host', nonce: nonce() })
  assert.equal(service.status, 403)
  assert.match(service.body.error, /Same-origin/)
  // A `lan` claim with a forged forwarded Host is just an ordinary same-origin
  // loopback request judged by the website rules.
  const lan = await raw(host.origin, 'POST', '/api/create', {
    [TRANSPORT]: 'lan', 'x-forwarded-for': '192.168.1.77', 'x-forwarded-host': LISTENER, origin: host.origin,
  }, { name: 'Host', nonce: nonce() })
  assert.equal(lan.status, 201)
})

// Markers are host facts only on a loopback socket. On the standalone --lan
// server a real LAN peer could type them, so they must change nothing there.
test('on the standalone LAN server, markers from a real LAN socket are ignored', async t => {
  const address = lanAddresses()[0]
  if (!address) { t.skip('no private IPv4 interface on this machine'); return }
  const host = await startLanHost({ port: 0, lan: true, automaticTicks: false })
  t.after(() => host.close())
  const lanOrigin = host.addresses.find(a => a.includes(address))!
  // Claiming the service marker from a LAN socket: no Origin, so rejected.
  const forged = await raw(lanOrigin, 'POST', '/api/create', { [TRANSPORT]: 'service' }, { name: 'Mallory', nonce: nonce() })
  assert.equal(forged.status, 403)
  // Claiming the lan marker with a loopback forwarded peer changes nothing either.
  const spoofed = await raw(lanOrigin, 'POST', '/api/create', {
    [TRANSPORT]: 'lan', 'x-forwarded-for': '127.0.0.1', 'x-forwarded-host': `127.0.0.1:${new URL(host.origin).port}`, origin: host.origin,
  }, { name: 'Mallory', nonce: nonce() })
  assert.equal(spoofed.status, 403)
})
