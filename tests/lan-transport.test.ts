import test from 'node:test'
import assert from 'node:assert/strict'

import { randomBytes } from 'node:crypto'
import { SERVICE_ID, proxyTransport, netFetchTransport, brokeredGuestTransport, lanShareText, lanShareUrls, type NetFetchInit } from '../server/client/inAppTransport'
import { startLanHost } from '../server/http'

// The two adapters are the ONLY new logic between the extension view and the
// poker host. Their contracts: proxy paths stay inside the extension's own
// service namespace; guest paths can never promote a second absolute URL past
// the broker's private-address policy; responses keep the client's Response
// shape (ok/status/json) so its error handling is unchanged.

const call = { path: '/api/state', method: 'POST' as const, headers: { 'Content-Type': 'application/json' }, body: '{"x":1}' }

test('proxy transport routes onto the extension origin under the service namespace', async () => {
  const seen: Array<{ url: string; init: RequestInit }> = []
  const transport = proxyTransport()
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    seen.push({ url: String(url), init: init ?? {} })
    return new Response('{"ok":true}', { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch
  try {
    const response = await transport(call)
    assert.equal(response.ok, true)
    assert.deepEqual(await response.json(), { ok: true })
  } finally { globalThis.fetch = originalFetch }
  assert.equal(seen.length, 1)
  assert.equal(seen[0].url, `./__service/${SERVICE_ID}/api/state`)
  assert.equal(seen[0].init.method, 'POST')
  assert.equal(seen[0].init.body, '{"x":1}')
})

test('guest transport maps broker results onto the Response surface', async () => {
  const urls: string[] = []
  const transport = netFetchTransport(async (url, init) => {
    urls.push(url)
    assert.equal(init?.httpMethod, 'POST')
    // The guest states the origin it dialed: the host's POST rule needs it and
    // Agent Code's brokered fetch adds none (poker#17).
    assert.deepEqual(init?.headers, [{ name: 'Content-Type', value: 'application/json' }, { name: 'Origin', value: 'http://192.168.1.42:5192' }])
    assert.equal(init?.body, '{"x":1}')
    return { status: 409, contentType: 'application/json', body: '{"error":"nope"}' }
  }, 'http://192.168.1.42:5192')
  const response = await transport(call)
  assert.equal(response.ok, false)
  assert.equal(response.status, 409)
  assert.deepEqual(await response.json(), { error: 'nope' })
  assert.deepEqual(urls, ['http://192.168.1.42:5192/api/state'])
})

test('a guest path can never smuggle an absolute URL through the broker', async () => {
  const transport = netFetchTransport(async () => ({ status: 200, contentType: 'application/json', body: '{}' }), 'http://192.168.1.42:5192')
  await assert.rejects(transport({ ...call, path: 'http://evil.example/' }), /Invalid service path/)
})

// The view hands this adapter privateHostDestination()'s value, which ends in
// '/'. Before poker#17 that produced '//api/…' (a 404 on the exact-path host)
// and would have sent an Origin no browser sends.
test('guest transport normalises the destination and owns the Origin header', async () => {
  const seen: Array<{ url: string; headers: Array<{ name: string; value: string }> | undefined }> = []
  const transport = netFetchTransport(async (url, init) => {
    seen.push({ url, headers: init?.headers })
    return { status: 200, contentType: 'application/json', body: '{}' }
  }, 'http://192.168.1.42:5192/')
  await transport({ ...call, headers: { 'Content-Type': 'application/json', origin: 'http://evil.example' } })
  assert.equal(seen[0].url, 'http://192.168.1.42:5192/api/state')
  assert.deepEqual(seen[0].headers?.filter(h => h.name.toLowerCase() === 'origin'), [{ name: 'Origin', value: 'http://192.168.1.42:5192' }])
})

// The status answer crosses a process boundary as untyped JSON and ends up
// as text in the share line. Only dotted-quad addresses may become URLs.
test('share URLs come only from well-formed service addresses', () => {
  assert.deepEqual(lanShareUrls({ origin: 'http://127.0.0.1:1', lanAddresses: ['192.168.1.5', '10.0.0.2'] }, 61234),
    ['http://192.168.1.5:61234', 'http://10.0.0.2:61234'])
  assert.deepEqual(lanShareUrls({ lanAddresses: ['<img src=x>', 7, 'evil.example', '192.168.1.5/x'] }, 1), [])
  assert.deepEqual(lanShareUrls(undefined, 1), [])
  assert.equal(lanShareText(['http://192.168.1.5:61234'], 61234), 'Friends join at http://192.168.1.5:61234')
  // No private interface: say so instead of inventing an address.
  assert.match(lanShareText([], 61234), /:61234 \(no private network address found\)$/)
})

// In-app guests (poker#19 follow-up). Two real bugs dropped the request
// between the client and the host, and the earlier end-to-end script used Node
// fetch in place of the SDK's net.fetch, so neither showed up:
//  - lanView passed `url => net.fetch(url)`, dropping the whole init;
//  - agent-code origin/main's bridge reads `init.method`, while SDK 0.9 names
//    the field `httpMethod`.
// Each fake below copies one host bridge's field reads
// (agent-code src/main/extensions/frameDocument.ts: origin/main, then PR #1151)
// and ends the way the host's netFetch does: method = httpMethod ?? 'GET'. A
// real poker server sits behind it, so a dropped method, header or body fails
// here as a 403/404/401 instead of passing in a mock.
type BridgeRequest = { url: string; httpMethod?: string; headers?: Array<{ name: string; value: string }>; body?: string }
const hostNetFetch = async (request: BridgeRequest) => {
  const response = await fetch(request.url, {
    method: request.httpMethod ?? 'GET',
    headers: Object.fromEntries((request.headers ?? []).map(h => [h.name, h.value])),
    ...(request.body !== undefined ? { body: request.body } : {}),
  })
  return { status: response.status, contentType: response.headers.get('content-type') ?? '', body: await response.text() }
}
const bridges: Record<string, (url: string, init?: NetFetchInit) => ReturnType<typeof hostNetFetch>> = {
  // origin/main: `httpMethod: init && init.method`
  'origin/main host': (url, init) => hostNetFetch({ url, httpMethod: init && init.method, headers: init && init.headers, body: init && init.body }),
  // agent-code#1151: `httpMethod: init && (init.httpMethod || init.method)`
  'agent-code#1151 host': (url, init) => hostNetFetch({ url, httpMethod: init && (init.httpMethod || init.method), headers: init && init.headers, body: init && init.body }),
}

for (const [label, bridge] of Object.entries(bridges)) {
  test(`an in-app guest joins, reads and acts through the ${label}`, async t => {
    // The standalone server: a guest's net.fetch reaches either it or the Agent
    // Code listener, and both apply the same Origin + bearer rules to a guest.
    const host = await startLanHost({ port: 0, lan: false, automaticTicks: false })
    t.after(() => host.close())
    const created = await (await fetch(`${host.origin}/api/create`, { method: 'POST', headers: { origin: host.origin, 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Host', nonce: randomBytes(32).toString('hex') }) })).json() as { code: string }
    // privateHostDestination() form, trailing slash included.
    const guest = brokeredGuestTransport({ fetch: bridge }, `${host.origin}/`)
    const joined = await guest({ path: '/api/join', method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Guest', nonce: randomBytes(32).toString('hex'), code: created.code }) })
    assert.equal(joined.status, 201, JSON.stringify(await joined.json()))
    const { token } = await joined.json() as { token: string }
    const state = await guest({ path: '/api/state', method: 'GET', headers: { Authorization: `Bearer ${token}` }, body: undefined })
    assert.equal(state.status, 200)
    // An authenticated POST with a body: the host answers 409 with a receipt
    // (not the guest's turn), which it can only do after parsing both.
    const acted = await guest({ path: '/api/action', method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ sequence: 1, revision: 0, action: { type: 'check' } }) })
    const receipt = await acted.json() as { receipt?: { code: string } }
    assert.ok(receipt.receipt, `expected a parsed action receipt, got ${acted.status} ${JSON.stringify(receipt)}`)
  })
}
