import test from 'node:test'
import assert from 'node:assert/strict'

import { SERVICE_ID, proxyTransport, netFetchTransport } from '../server/client/inAppTransport'

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
    assert.deepEqual(init?.headers, [{ name: 'Content-Type', value: 'application/json' }])
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
