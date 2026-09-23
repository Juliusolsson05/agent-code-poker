import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { randomBytes, timingSafeEqual } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'
import { networkInterfaces } from 'node:os'
import { HostTable } from '../src/session/HostTable'
import { CheckpointStore } from './persistence/CheckpointStore'

type Credential = { id: string; token: string; nonce: string; name: string; seen: number; connected: boolean }
type Room = { table: HostTable; code: string; host: Credential; credentials: Map<string, Credential>; paused: boolean; nextTick: number; observation: number }
/** `agentCodeHost`: this process is the extension's service behind Agent Code's
 *  proxy and listener, so its transport markers are read (see resolveCaller).
 *  Only server/service.ts sets it; the standalone CLI never does. */
type Options = { port?: number; lan?: boolean; now?: () => number; automaticTicks?: boolean; checkpointDirectory?: string; agentCodeHost?: boolean }
class HttpFailure extends Error { constructor(readonly status: number, message: string) { super(message) } }
const fail = (status: number, message: string): never => { throw new HttpFailure(status, message) }
const isLoopback = (address?: string) => address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1'
const privateV4 = (s: string) => /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(s)

/** The machine's private IPv4 LAN addresses — the only addresses a friend can
 *  dial. Shared by the standalone --lan bind list and the in-extension
 *  service's `status` answer: the sandboxed view cannot enumerate interfaces,
 *  so the service (a normal Node process) reports them for the share line. */
export const lanAddresses = (): string[] => Object.values(networkInterfaces()).flatMap(list =>
  (list ?? []).filter(i => i.family === 'IPv4' && !i.internal && privateV4(i.address)).map(i => i.address))

/** Host-set marker from Agent Code (src/main/extensions/serviceTransport.ts,
 *  TRANSPORT_ATTESTATION_HEADER): `service` = this extension's own frame via
 *  the service proxy; `lan` = a LAN peer via the host's net.listen listener. */
const TRANSPORT_HEADER = 'x-agent-code-transport'
/** A forwarded Host must be `a.b.c.d:port`, nothing else. */
const literalHost = /^(\d{1,3}(?:\.\d{1,3}){3}):(\d{1,5})$/

/** `via` names the path the request took: a direct socket, the host player's
 *  own frame through the Agent Code service proxy, or a LAN peer through the
 *  host's listener. */
type Caller = { peer: string | undefined; host: string | undefined; via: 'direct' | 'service' | 'lan' }

/**
 * Resolve WHO is asking before any rule runs. Every security rule below (peer,
 * Host, same-origin, loopback-only create) reads this, never the raw socket.
 *
 * Standalone website (the CLI, `agentCodeHost` off): the socket peer, the Host
 * header and the browser's Origin. Markers are never read, so those rules are
 * byte-for-byte what they were.
 *
 * Inside Agent Code (`agentCodeHost`, set only by server/service.ts) the server
 * binds loopback only, and every request arrives from the host app's main
 * process on 127.0.0.1. Taken at face value that would make every LAN guest
 * "local", free to take the host seat via /api/create. And the host player's
 * own frame, whose Origin never reaches us, could not create at all. The host
 * therefore marks each request (agent-code#1147):
 *
 * - `lan`: the forwarded peer and Host become the caller. This DOWNGRADES trust
 *   from loopback to "a LAN guest", and it wins over any other claim. The
 *   listener sets these values from its socket and request line and never
 *   copies a peer's own, so a guest can neither forge nor strip them. It is
 *   trusted ONLY with the raw Host the listener always dials with,
 *   `127.0.0.1:<our port>`. A DNS-rebound page (Host: evil.example:<port>) is
 *   same-origin with itself, so it could attach the marker without any
 *   preflight; without this rule its `lan` claim would skip the exact Host
 *   allow-list below.
 * - `service`: the host player's own frame. The host already checked the grant
 *   and the running service, and the frame's CSP is `connect-src 'self'`. The
 *   marker then stands in for the same-origin proof. A cross-origin page can't
 *   send it: a custom header needs a CORS preflight, and this server never
 *   answers one (OPTIONS is a 404 without CORS headers). NEVER add CORS here;
 *   doing so would make this marker forgeable by any website. A rebound page
 *   can send it, but its Host then fails the exact allow-list.
 *
 * Markers only count on a loopback socket. Agent Code's net.fetch refuses both
 * the marker headers and loopback service ports, so no other extension can
 * send them. Any LOCAL PROGRAM still can, including every extension's service
 * child, which is ordinary Node. Loopback callers are therefore local-user
 * trust, and that is all `service` or a loopback forwarded peer grants: a
 * same-machine client dialing the listener on 127.x arrives as a loopback
 * `lan` peer and may create, exactly like the host computer's own browser.
 */
function resolveCaller(request: IncomingMessage, agentCodeHost: boolean, ownHost: string): Caller {
  const socketPeer = request.socket.remoteAddress?.replace(/^::ffff:/, '')
  const marker = agentCodeHost && isLoopback(socketPeer) ? request.headers[TRANSPORT_HEADER] : undefined
  if (marker === 'lan') {
    if (request.headers.host !== ownHost) fail(403, 'Unrecognized host.')
    const peer = request.headers['x-forwarded-for']
    const host = request.headers['x-forwarded-host']
    // We don't know the listener's OS-chosen port or which interface the guest
    // dialed, so an exact Host allow-list (the standalone rule) is impossible.
    // A private or loopback IPv4 LITERAL is the DNS-rebinding defence for the
    // GUEST's browser instead: rebinding needs a hostname, and a hostname can
    // never match this. IPv6 guests are refused here and by the peer rule, as
    // on the standalone server: IPv4 only (the share line shows IPv4 too).
    const literal = typeof host === 'string' ? literalHost.exec(host) : null
    if (!literal || !(privateV4(literal[1]) || literal[1] === '127.0.0.1')) fail(403, 'Unrecognized host.')
    return { peer: typeof peer === 'string' ? peer.replace(/^::ffff:/, '') : undefined, host: host as string, via: 'lan' }
  }
  return { peer: socketPeer, host: request.headers.host, via: marker === 'service' ? 'service' : 'direct' }
}
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
function shape(value: unknown, fields: string[]): asserts value is Record<string, unknown> {
  if (!object(value) || Object.keys(value).length !== fields.length || fields.some(f => !Object.hasOwn(value, f))) fail(400, 'Invalid request fields.')
}
function admission(value: unknown, joining: boolean) {
  shape(value, joining ? ['name', 'nonce', 'code'] : ['name', 'nonce'])
  if (typeof value.name !== 'string' || typeof value.nonce !== 'string' || !/^[a-f0-9]{64}$/.test(value.nonce) ||
    joining && (typeof value.code !== 'string' || value.code.length > 24)) fail(400, 'Invalid admission request.')
  return { name: value.name as string, nonce: value.nonce as string, code: joining ? String(value.code).trim().toUpperCase().replaceAll('-', '') : '' }
}
function body(request: IncomingMessage): Promise<unknown> {
  if (request.headers['content-type']?.split(';')[0].trim().toLowerCase() !== 'application/json') fail(415, 'Use application/json.')
  if (Number(request.headers['content-length'] ?? 0) > 4096) { request.resume(); fail(413, 'Request is too large.') }
  return new Promise((resolve, reject) => {
    let size = 0, rejected = false
    const chunks: Buffer[] = []
    request.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > 4096) { rejected = true; chunks.length = 0; reject(new HttpFailure(413, 'Request is too large.')); return }
      if (!rejected) chunks.push(chunk)
    })
    request.on('end', () => {
      if (rejected) return
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))) }
      catch { reject(new HttpFailure(400, 'Invalid JSON.')) }
    })
    request.on('error', () => reject(new HttpFailure(400, 'Request interrupted.')))
  })
}

/** Standalone, opt-in website host. This process is not shipped inside the SDK
 * runtime. Only these exact assets and the private-view API are reachable; do
 * not mount Vite, the repository root, arbitrary paths or an engine snapshot.
 *
 * HTTP is for trusted local networks, not encrypted transport. Origin/Host
 * checks prevent a hostile website from driving a local table or DNS-rebinding
 * it; they do NOT protect against someone sniffing the LAN. Tokens must never
 * appear in URLs, diagnostic records, logs, cookies or another player's view.
 */
export async function startLanHost(options: Options = {}) {
  const now = options.now ?? Date.now
  const addresses = ['127.0.0.1', ...(options.lan ? lanAddresses() : [])]
  const built = new URL('../lan-dist/', import.meta.url)
  const files = (await readdir(built)).filter(file => /^(?:index\.html|[a-zA-Z0-9_-]+\.(?:js|css))$/.test(file))
  if (!files.includes('index.html') || !files.includes('client.js')) throw new Error('Run npm run build:lan before hosting.')
  const assets = new Map(await Promise.all(files.map(async file => [file === 'index.html' ? '/' : `/${file}`, {
    bytes: await readFile(new URL(file, built)), type: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html',
  }] as const)))
  let room: Room | null = null, port = 0, closed = false
  const generation = randomBytes(16).toString('hex')
  const store = options.checkpointDirectory ? new CheckpointStore(options.checkpointDirectory) : undefined
  let committed = 'null', storageFailed = false
  // Disk is a private host boundary. No object produced here may be reused as
  // a response. The public envelope below remains an explicit view allowlist.
  const checkpoint = () => room ? { version: 1, code: room.code, host: room.host.id,
    table: room.table.exportHostCheckpoint(), credentials: [...room.credentials.values()].map(c =>
      ({ id: c.id, token: c.token, nonce: c.nonce, name: c.name })) } : null
  try {
    const saved = store?.load() ?? null
    if (saved !== null) {
      shape(saved, ['version', 'code', 'host', 'table', 'credentials'])
      if (saved.version !== 1 || typeof saved.code !== 'string' || !/^[A-F0-9]{10}$/.test(saved.code) ||
        typeof saved.host !== 'string' || !Array.isArray(saved.credentials) || saved.credentials.length < 1 || saved.credentials.length > 6) throw new Error()
      const table = HostTable.restoreHostCheckpoint(saved.table), privateState = table.exportHostCheckpoint()
      if (saved.host !== privateState.host) throw new Error()
      const credentials = new Map<string, Credential>(), ids = new Set<string>(), nonces = new Set<string>()
      for (const c of saved.credentials) {
        shape(c, ['id', 'token', 'nonce', 'name'])
        if (typeof c.id !== 'string' || !/^[a-f0-9]{32}$/.test(c.id) || typeof c.token !== 'string' ||
          !/^[A-Za-z0-9_-]{43}$/.test(c.token) || typeof c.nonce !== 'string' || !/^[a-f0-9]{64}$/.test(c.nonce) ||
          typeof c.name !== 'string' || c.name.length > 96 || /[\p{Cc}\p{Cf}]/u.test(c.name) ||
          credentials.has(c.token) || ids.has(c.id) || nonces.has(c.nonce)) throw new Error()
        const member = privateState.members.find(m => m.id === c.id)
        if (!member || member.leaving || member.name !== c.name.normalize('NFC').trim().replace(/\s+/gu, ' ')) throw new Error()
        ids.add(c.id); nonces.add(c.nonce)
        credentials.set(c.token, { id: c.id, token: c.token, nonce: c.nonce, name: c.name, connected: false, seen: now() })
      }
      const host = [...credentials.values()].find(c => c.id === saved.host)
      if (!host || privateState.members.some(m => !m.leaving && !ids.has(m.id))) throw new Error()
      // No saved lease remains live; no action/bot resumes until the host
      // reconnects AND explicitly unpauses. This protects an unattended restart.
      room = { table, code: saved.code, host, credentials, paused: true, nextTick: now() + 1000, observation: 0 }
      committed = JSON.stringify(saved)
    }
  } catch {
    store?.close()
    throw new Error('Invalid host checkpoint. Hosting refused; original saved data has been preserved.')
  }
  const persist = () => {
    if (!store || storageFailed || closed) return
    try {
      const value = checkpoint(), serialized = JSON.stringify(value)
      if (serialized !== committed) { store.commit(value); committed = serialized }
    } catch { storageFailed = true }
  }
  // Global buckets have constant memory and also bound attacks spread over many
  // claimed IPs. Admission is slower than ordinary six-client500ms polling.
  const buckets = { request: { tokens: 200, time: now() }, admission: { tokens: 20, time: now() } }
  const rate = (kind: keyof typeof buckets) => {
    const bucket = buckets[kind], capacity = kind === 'request' ? 200 : 20, period = kind === 'request' ? 10000 : 60000
    const at = now(); bucket.tokens = Math.min(capacity, bucket.tokens + Math.max(0, at - bucket.time) * capacity / period); bucket.time = at
    if (bucket.tokens < 1) fail(429, 'Too many requests. Wait before retrying.')
    bucket.tokens--
  }
  const credential = (name: string, nonce: string): Credential => ({ id: randomBytes(16).toString('hex'),
    token: randomBytes(32).toString('base64url'), name, nonce, seen: now(), connected: true })
  const current = () => room ?? fail(410, 'This test session has ended. Create a new table explicitly.')
  const authorize = (request: IncomingMessage) => {
    const r = current(), value = request.headers.authorization
    const c = value && /^Bearer [A-Za-z0-9_-]{43}$/.test(value) ? r.credentials.get(value.slice(7)) : undefined
    if (!c) return fail(401, 'Session credential is invalid.')
    // A valid token reconnects the same identity, not a free slot. Do not
    // reconnect on an unauthenticated username or claimed seat number.
    if (!c.connected) { r.table.reconnect(c.id); c.connected = true }
    c.seen = now(); return { r, c }
  }
  // Response order can differ from processing order. Transport observation is
  // distinct from wager revision: pause/lease responses also need an ordering
  // guard so a late poll cannot visually undo an acknowledged pause or action.
  const envelope = (r: Room, c: Credential) => ({ generation, observation: ++r.observation, view: r.table.view(c.id), isHost: c === r.host,
    paused: r.paused || !r.host.connected, hostConnected: r.host.connected, durable: !!store,
    ...(c === r.host ? { code: r.code } : {}) })
  const send = (response: ServerResponse, status: number, value: unknown) => {
    // The synchronous commit finishes before ANY API response is published.
    // On failure even reads are refused: in-memory mutation may be newer than
    // the last durable chips. Do not leak that speculative state or retry it.
    persist()
    if (storageFailed) { status = 503; value = { error: 'Host storage failed. Table frozen; preserve the host save and restart after resolving storage.' } }
    response.statusCode = status; response.setHeader('Content-Type', 'application/json; charset=utf-8'); response.end(JSON.stringify(value))
  }
  const pulse = () => {
    const r = room
    if (!r || closed || storageFailed) return
    const at = now()
    for (const c of r.credentials.values()) if (c.connected && at - c.seen > 15000) {
      r.table.disconnect(c.id); c.connected = false
    }
    if (r.paused || !r.host.connected || at < r.nextTick) { persist(); return }
    // A missing host browser freezes the entire session. Connected guests do
    // not silently keep playing against the host's unattended bot.
    try { r.table.tick(r.table.view(r.host.id).revision) }
    catch { r.paused = true }
    r.nextTick = at + 1000
    persist()
  }
  const server = createServer({ requestTimeout: 5000, headersTimeout: 5000, keepAliveTimeout: 2000, maxHeaderSize: 8192 }, (request, response) => {
    response.setHeader('Cache-Control', 'no-store')
    response.setHeader('X-Content-Type-Options', 'nosniff')
    response.setHeader('Referrer-Policy', 'no-referrer')
    // The licensed fireplace recording is embedded in the compiled client as a
    // data URL. Allow only that media scheme, not arbitrary remote audio or a
    // broader connect-src exception; all poker traffic stays same-origin.
    response.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; media-src data:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'")
    void (async () => {
      const caller = resolveCaller(request, options.agentCodeHost === true, `127.0.0.1:${port}`)
      const peer = caller.peer
      if (!isLoopback(peer) && (!peer || !privateV4(peer))) fail(403, 'Private-network peers only.')
      // A LAN caller's forwarded Host was already held to the literal rule in
      // resolveCaller; every other caller still meets the exact allow-list.
      const allowed = new Set(addresses.map(address => `${address}:${port}`))
      if (!caller.host || caller.via !== 'lan' && !allowed.has(caller.host)) fail(403, 'Unrecognized host.')
      // The same-origin proof: a browser's Origin must name the address it
      // dialed. The host's `service` attestation replaces it for the host
      // player's own frame (resolveCaller explains why it can be trusted).
      // Chromium may add its own Origin/Sec-Fetch-* to that main-process fetch,
      // so the browser-shaped checks are skipped for it rather than trusted.
      if (caller.via !== 'service') {
        const origin = `http://${caller.host}`
        if (request.headers.origin && request.headers.origin !== origin || request.headers['sec-fetch-site'] === 'cross-site') fail(403, 'Foreign origin rejected.')
        if (request.method === 'POST' && request.headers.origin !== origin) fail(403, 'Same-origin request required.')
      }
      rate('request')
      // Match the raw path exactly: encoded traversal and token-bearing query
      // strings are not aliases for an allowed asset or API route.
      const route = request.url ?? ''
      if (request.method === 'GET' && assets.has(route)) {
        const asset = assets.get(route)!; response.setHeader('Content-Type', `${asset.type}; charset=utf-8`); response.end(asset.bytes); return
      }
      if (closed || storageFailed) fail(503, 'Host closed or storage failed; table frozen.')
      if (request.method === 'GET' && route === '/api/state') {
        const { r, c } = authorize(request); send(response, 200, envelope(r, c)); return
      }
      if (request.method !== 'POST' || !['/api/create', '/api/join', '/api/start', '/api/action', '/api/pause', '/api/leave'].includes(route)) fail(404, 'Not found.')
      if (route === '/api/create' || route === '/api/join') rate('admission')
      const input = await body(request)
      if (closed || storageFailed) fail(503, 'Host closed or storage failed; table frozen.')
      // Do not keep a pre-await room reference: another request may have closed
      // or replaced it while this body was arriving. Admission and mutations
      // below execute synchronously against one current room.
      if (route === '/api/create') {
        // The RESOLVED peer, not the socket: inside Agent Code every guest's
        // socket is loopback, and only the forwarded peer tells them apart.
        if (!isLoopback(peer)) fail(403, 'Create the table on the host computer.')
        const a = admission(input, false)
        if (room) {
          if (room.host.nonce !== a.nonce || room.host.name !== a.name) fail(409, 'A table already exists.')
          send(response, 200, { token: room.host.token, code: room.code }); return
        }
        const c = credential(a.name, a.nonce)
        const table = new HostTable({ id: c.id, name: a.name })
        room = { table, code: randomBytes(5).toString('hex').toUpperCase(), host: c,
          credentials: new Map([[c.token, c]]), paused: false, nextTick: now() + 1000, observation: 0 }
        send(response, 201, { token: c.token, code: room.code }); return
      }
      if (route === '/api/join') {
        const a = admission(input, true), r = current()
        const code = Buffer.from(a.code), expected = Buffer.from(r.code)
        if (code.length !== expected.length || !timingSafeEqual(code, expected)) fail(403, 'Lobby code is not valid.')
        const existing = [...r.credentials.values()].find(c => c.nonce === a.nonce)
        if (existing) {
          if (existing.name !== a.name) fail(409, 'Admission retry changed the name.')
          send(response, 200, { token: existing.token }); return
        }
        const c = credential(a.name, a.nonce)
        r.table.join(c.id, a.name); r.credentials.set(c.token, c)
        send(response, 201, { token: c.token }); return
      }
      const { r, c } = authorize(request)
      if (route === '/api/leave') {
        shape(input, [])
        if (c === r.host) room = null
        else { r.table.leave(c.id); r.credentials.delete(c.token) }
        send(response, 200, { left: true }); return
      }
      if (route === '/api/pause') {
        if (c !== r.host) fail(403, 'Only the host controls pause.')
        shape(input, ['paused']); if (typeof input.paused !== 'boolean') fail(400, 'Invalid pause state.')
        r.paused = input.paused as boolean; r.nextTick = now() + 1000
        send(response, 200, envelope(r, c)); return
      }
      if (r.paused || !r.host.connected) fail(409, 'The host has paused or disconnected.')
      if (route === '/api/start') {
        if (c !== r.host) fail(403, 'Only the host starts a hand.')
        shape(input, ['revision']); if (!Number.isSafeInteger(input.revision)) fail(400, 'Invalid revision.')
        r.table.start(c.id, Number(input.revision)); r.nextTick = now() + 1000
        send(response, 200, envelope(r, c)); return
      }
      const receipt = r.table.act(c.id, input)
      if (receipt.code === 'accepted') r.nextTick = now() + 1000
      send(response, receipt.ok ? 200 : 409, { receipt, ...envelope(r, c) })
    })().catch(error => {
      // Errors are bounded product messages, never raw request bodies, tokens,
      // stacks or engine objects. Drain a rejected body without retaining it.
      request.resume()
      if (response.writableEnded || response.destroyed) return
      if (error instanceof HttpFailure) send(response, error.status, { error: error.message })
      else if (error instanceof Error && /full|name|Principal|Finish this hand|Stale session|table is complete/.test(error.message)) send(response, 409, { error: error.message })
      else send(response, 500, { error: 'Host could not complete this request.' })
    })
  })
  server.maxConnections = 32; server.maxRequestsPerSocket = 200; server.setTimeout(5000, socket => socket.destroy())
  try {
    await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(options.port ?? 5192, options.lan ? '0.0.0.0' : '127.0.0.1', () => { server.off('error', reject); resolve() }) })
  } catch (error) { store?.close(); throw error }
  port = (server.address() as { port: number }).port
  const timer = options.automaticTicks === false ? undefined : setInterval(pulse, 250)
  timer?.unref()
  return { origin: `http://127.0.0.1:${port}`, addresses: addresses.map(a => `http://${a}:${port}`), pulse,
    async close() {
      if (closed) return
      closed = true; if (timer) clearInterval(timer); room = null
      try { await new Promise<void>((resolve, reject) => { server.close(error => error ? reject(error) : resolve()); server.closeAllConnections() }) }
      finally { store?.close() }
    },
  }
}
