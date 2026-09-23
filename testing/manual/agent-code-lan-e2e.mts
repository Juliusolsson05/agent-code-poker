// MANUAL tool, not part of `npm test`: runs Agent Code's REAL service proxy,
// LAN listener and net.fetch broker in front of this repo's REAL server, driven
// by the REAL client transports, over this machine's LAN address.
//
// tests/lan-proxy-contract.test.ts hand-builds the host's header shapes; this
// script is the cross-check that the host code actually produces them.
// Electron's net.fetch is replaced by Node's fetch, so it proves the header
// contract, not Chromium's behaviour. It never launches the app.
//
//   AGENT_CODE_DIR=/path/to/agent-code npx tsx testing/manual/agent-code-lan-e2e.mts
//
// Needs a private IPv4 interface. Expected output: every line shows the status
// in its label ("must be 403" lines print 403, everything else 2xx/409).
import { randomBytes } from 'node:crypto'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { startLanHost, lanAddresses } from '../../server/http'
import { brokeredGuestTransport, proxyTransport } from '../../server/client/inAppTransport'

const agentCode = process.env.AGENT_CODE_DIR
if (!agentCode) throw new Error('Set AGENT_CODE_DIR to an agent-code checkout.')
const hostModule = (name: string) => import(pathToFileURL(resolve(agentCode, 'src/main/extensions', `${name}.ts`)).href)
const { startServiceLanListener } = await hostModule('serviceLanListener')
const { configureServiceTransport, proxyServiceTransportRequest } = await hostModule('serviceTransport')
const { netFetch } = await hostModule('netFetch')

const nodeFetch = globalThis.fetch
const nonce = () => randomBytes(32).toString('hex')
const host = await startLanHost({ port: 0, lan: false, agentCodeHost: true, automaticTicks: false })
const port = Number(new URL(host.origin).port)
const listener = await startServiceLanListener(port)
const ip = lanAddresses()[0]
if (!ip) throw new Error('need a private LAN interface for a non-loopback guest')
console.log('service', host.origin, '| listener port', listener.port, '| lan ip', ip)

// Host player's frame: fetch('./__service/<id>/…') handled by the real proxy,
// whose upstream dial uses Node fetch (stand-in for Electron net.fetch).
configureServiceTransport({ hasCapability: async () => true, serviceEndpoint: () => port, fetch: nodeFetch })
globalThis.fetch = (async (url: string, init: RequestInit) => {
  const rel = String(url).replace(/^\.\//, '')
  return proxyServiceTransportRequest('agent-code-poker', 'gen', rel,
    new Request(`agent-code-ext://agent-code-poker/${rel}`, { ...init, duplex: 'half' } as RequestInit))
}) as typeof fetch
const hostT = proxyTransport()
// In-app guest: the real netFetch broker (Node global fetch in main) to the
// host's real listener at its LAN address, via privateHostDestination-shaped input.
// The host's own service ports are refused to net.fetch; a guest dials the
// listener's LAN address, which is allowed.
const guard = { isHostOwnedLoopbackPort: (p: number) => p === port || p === listener.port }
// The guest goes through the view's real wiring (brokeredGuestTransport) and a
// net.fetch that reads init fields exactly as agent-code origin/main's frame
// bridge does (frameDocument.ts: `httpMethod: init && init.method`). An earlier
// version spread init straight into netFetch, which hid two bugs: lanView
// dropped init, and the SDK's `httpMethod` field isn't what that bridge reads.
const bridgeFetch = (url: string, init?: { method?: string; headers?: Array<{ name: string; value: string }>; body?: string }) =>
  netFetch({ url, httpMethod: init && init.method, headers: init && init.headers, body: init && init.body }, nodeFetch, guard)
const guest = brokeredGuestTransport({ fetch: bridgeFetch as never }, `http://${ip}:${listener.port}/`)

const call = async (t: any, path: string, body?: unknown, token?: string) => {
  const r = await t({ path, method: body === undefined ? 'GET' : 'POST',
    headers: { ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body) })
  return { status: r.status, body: await r.json() }
}
const show = (label: string, r: { status: number; body: any }) => console.log(label.padEnd(34), r.status, r.body.error ?? '')

const early = await call(guest, '/api/create', { name: 'Mallory', nonce: nonce() }); show('guest create (must be 403)', early)
const created = await call(hostT, '/api/create', { name: 'Host', nonce: nonce() }); show('host create via proxy', created)
const joined = await call(guest, '/api/join', { name: 'Guest', nonce: nonce(), code: created.body.code }); show('guest join via listener', joined)
const hs = await call(hostT, '/api/state', undefined, created.body.token); show('host state', hs)
show('host start', await call(hostT, '/api/start', { revision: hs.body.view.revision }, created.body.token))
const gs = await call(guest, '/api/state', undefined, joined.body.token); show('guest state', gs)
console.log('guest sees code?', gs.body.code !== undefined, '| guest seat', gs.body.view.self.seat)
show('host pause', await call(hostT, '/api/pause', { paused: true }, created.body.token))
show('guest action while paused (409)', await call(guest, '/api/action', { sequence: 1, revision: 0, action: { type: 'check' } }, joined.body.token))
show('host unpause', await call(hostT, '/api/pause', { paused: false }, created.body.token))
// Browser guest through the listener: page load carries the service CSP.
const page = await nodeFetch(`http://${ip}:${listener.port}/`)
console.log('browser page via listener', page.status, '| csp:', page.headers.get('content-security-policy')?.slice(0, 40))
const browserJoin = await nodeFetch(`http://${ip}:${listener.port}/api/join`, { method: 'POST', headers: { 'content-type': 'application/json', origin: `http://${ip}:${listener.port}` }, body: JSON.stringify({ name: 'Browser', nonce: nonce(), code: created.body.code }) })
console.log('browser join via listener'.padEnd(34), browserJoin.status)
const csrf = await nodeFetch(`http://${ip}:${listener.port}/api/join`, { method: 'POST', headers: { 'content-type': 'application/json', origin: 'http://evil.example' }, body: JSON.stringify({ name: 'X', nonce: nonce(), code: created.body.code }) })
console.log('foreign-origin join (must be 403)'.padEnd(34), csrf.status)

// Review blocker (agent-code#1147): another extension's net.fetch must not
// reach the service's loopback port, nor send the host-only marker.
const direct = await netFetch({ url: `http://127.0.0.1:${port}/api/state` }, nodeFetch, guard).then(() => 'reached', (e: Error) => e.message.slice(0, 40))
console.log('net.fetch to service port (refused)'.padEnd(34), direct)
const forged = await netFetch({ url: `http://${ip}:${listener.port}/api/create`, httpMethod: 'POST', headers: [{ name: 'x-agent-code-transport', value: 'service' }], body: '{}' }, nodeFetch, guard).then(() => 'reached', (e: Error) => e.message.slice(0, 40))
console.log('net.fetch with marker (refused)'.padEnd(34), forged)
await listener.close(); await host.close()
