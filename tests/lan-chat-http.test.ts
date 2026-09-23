import test from 'node:test'
import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { startLanHost } from '../server/http'
import { VOICE_RELAY_LIMITS } from '../server/VoiceRelay'
import { MAX_VOICE_BYTES, bytesToBase64 } from '../src/voice/audioClip'

// Actual loopback HTTP sockets with scripted clients and an injected clock.
// They prove the transport contract of chat, host features and the voice
// relay; the two-browser acceptance run is recorded separately.
const nonce = () => randomBytes(32).toString('hex')
const mp3 = new Uint8Array(readFileSync(new URL('../testing/fixtures/elevenlabs/fake-tts-mp3_22050_32.mp3', import.meta.url)))
async function call(origin: string, path: string, body?: unknown, token?: string) {
  const response = await fetch(origin + path, { method: body === undefined ? 'GET' : 'POST', headers: {
    origin, ...(body === undefined ? {} : { 'content-type': 'application/json' }), ...(token ? { authorization: `Bearer ${token}` } : {}),
  }, body: body === undefined ? undefined : JSON.stringify(body) })
  return { status: response.status, body: await response.json() as any, headers: response.headers }
}
async function room(t: test.TestContext, options: { checkpointDirectory?: string } = {}) {
  let clock = 100_000
  const host = await startLanHost({ port: 0, automaticTicks: false, now: () => clock, ...options }); t.after(() => host.close())
  const a = (await call(host.origin, '/api/create', { name: 'Host', nonce: nonce() })).body
  const b = (await call(host.origin, '/api/join', { name: 'Guest', nonce: nonce(), code: a.code })).body
  const c = (await call(host.origin, '/api/join', { name: 'Third', nonce: nonce(), code: a.code })).body
  return { origin: host.origin, host: a.token as string, guest: b.token as string, third: c.token as string, advance: (ms: number) => { clock += ms } }
}

test('features default off, only the host changes them, and every member sees the change', async t => {
  const r = await room(t)
  assert.deepEqual((await call(r.origin, '/api/state', undefined, r.guest)).body.features, { voices: false, treats: false })
  const refused = await call(r.origin, '/api/features', { voices: true, treats: true }, r.guest)
  assert.equal(refused.status, 403)
  for (const bad of [{ voices: true }, { voices: 'yes', treats: false }, { voices: true, treats: true, paused: false }])
    assert.equal((await call(r.origin, '/api/features', bad, r.host)).status, 400, JSON.stringify(bad))
  assert.equal((await call(r.origin, '/api/features', { voices: true, treats: false }, r.host)).status, 200)
  assert.deepEqual((await call(r.origin, '/api/state', undefined, r.guest)).body.features, { voices: true, treats: false })
  // Pause does not freeze the switches: the host may change them during a pause.
  await call(r.origin, '/api/pause', { paused: true }, r.host)
  assert.equal((await call(r.origin, '/api/features', { voices: false, treats: true }, r.host)).status, 200)
  assert.deepEqual((await call(r.origin, '/api/state', undefined, r.third)).body.features, { voices: false, treats: true })
})

test('chat over HTTP: bare receipt, projected to others, limits enforced, allowed while paused', async t => {
  const r = await room(t)
  const sent = await call(r.origin, '/api/chat', { text: '<img src=x onerror=alert(1)>' }, r.guest)
  assert.equal(sent.status, 200); assert.equal(sent.body.receipt.code, 'accepted')
  assert.equal(sent.body.view, undefined, 'a cosmetic reply never carries an envelope that could reorder a wager reply')
  const [line] = (await call(r.origin, '/api/state', undefined, r.host)).body.view.chat
  assert.equal(line.text, '<img src=x onerror=alert(1)>'); assert.equal(line.name, 'Guest'); assert.equal(line.displaySeat, 1)
  assert.equal((await call(r.origin, '/api/chat', { text: 'x'.repeat(201) }, r.guest)).body.receipt.code, 'invalid')
  assert.equal((await call(r.origin, '/api/chat', { text: 'hi' })).status, 401)
  await call(r.origin, '/api/pause', { paused: true }, r.host)
  assert.equal((await call(r.origin, '/api/chat', { text: 'paused chat' }, r.guest)).body.receipt.code, 'accepted')
  for (let i = 0; i < 3; i++) await call(r.origin, '/api/chat', { text: `burst ${i}` }, r.guest)
  const limited = await call(r.origin, '/api/chat', { text: 'flood' }, r.guest)
  assert.equal(limited.status, 409); assert.equal(limited.body.receipt.code, 'rate-limited')
  // The ordinary 4 KB cap still guards chat; only the voice route is larger.
  assert.equal((await call(r.origin, '/api/chat', { text: 'x'.repeat(5000) }, r.third)).status, 413)
})

test('voice relay: sender-only, voices-on only, audio/mpeg bytes only, capped, fetched by others, gone at TTL', async t => {
  const directory = mkdtempSync(join(tmpdir(), 'poker-voice-relay-')); t.after(() => rmSync(directory, { recursive: true, force: true }))
  const r = await room(t, { checkpointDirectory: directory })
  const seq = (await call(r.origin, '/api/chat', { text: 'nice hand' }, r.guest)).body.receipt.seq
  const upload = (token: string, data: string, extra: Record<string, unknown> = {}) => call(r.origin, '/api/voice', { seq, mime: 'audio/mpeg', data, ...extra }, token)
  assert.equal((await upload(r.guest, bytesToBase64(mp3))).status, 409, 'voices are off by default')
  await call(r.origin, '/api/features', { voices: true, treats: false }, r.host)
  assert.equal((await upload(r.third, bytesToBase64(mp3))).status, 403, 'nobody attaches audio to another player\'s line')
  assert.equal((await upload(r.guest, bytesToBase64(new TextEncoder().encode('<html>not audio</html>')))).body.voice, 'not-audio')
  assert.equal((await upload(r.guest, bytesToBase64(mp3), { mime: 'audio/wav' })).status, 400)
  assert.equal((await upload(r.guest, 'not base64!')).status, 400)
  const oversized = new Uint8Array(MAX_VOICE_BYTES + 1); oversized.set(mp3.subarray(0, 4))
  assert.equal((await upload(r.guest, bytesToBase64(oversized))).body.voice, 'too-large')
  const tooBigBody = await call(r.origin, '/api/voice', { seq, mime: 'audio/mpeg', data: 'A'.repeat(200_000) }, r.guest)
  assert.equal(tooBigBody.status, 413, 'the voice route has its own cap, not an unbounded body')
  assert.equal((await upload(r.guest, bytesToBase64(mp3))).body.voice, 'stored')
  assert.equal((await upload(r.guest, bytesToBase64(mp3))).body.voice, 'duplicate', 'audio cannot be swapped after others heard it')

  const view = (await call(r.origin, '/api/state', undefined, r.third)).body.view
  assert.equal(view.chat.find((l: any) => l.seq === seq).voice, true)
  const clip = await call(r.origin, `/api/voice/${seq}`, undefined, r.third)
  assert.equal(clip.status, 200); assert.equal(clip.body.mime, 'audio/mpeg'); assert.equal(clip.body.data, bytesToBase64(mp3))
  assert.equal((await call(r.origin, `/api/voice/${seq}`)).status, 401, 'token-authenticated')
  for (const path of [`/api/voice/${seq}?x=1`, '/api/voice/0', '/api/voice/..%2Fstate']) assert.equal((await call(r.origin, path, undefined, r.third)).status, 404, path)
  // Never on disk: the private checkpoint directory holds no clip bytes.
  const needle = Buffer.from(mp3.subarray(0, 64)).toString('hex')
  for (const file of readdirSync(directory)) assert.ok(!readFileSync(join(directory, file)).toString('hex').includes(needle), file)
  assert.ok(!readdirSync(directory).some(file => readFileSync(join(directory, file), 'utf8').includes(bytesToBase64(mp3).slice(0, 64))))

  r.advance(VOICE_RELAY_LIMITS.ttlMs + 1)
  assert.equal((await call(r.origin, `/api/voice/${seq}`, undefined, r.third)).status, 404, 'short-lived')
  assert.equal((await call(r.origin, '/api/state', undefined, r.third)).body.view.chat[0].voice, false)
})

test('turning voices off drops relayed clips immediately and hides the voiced flag', async t => {
  const r = await room(t)
  await call(r.origin, '/api/features', { voices: true, treats: false }, r.host)
  const seq = (await call(r.origin, '/api/chat', { text: 'hello' }, r.host)).body.receipt.seq
  assert.equal((await call(r.origin, '/api/voice', { seq, mime: 'audio/mpeg', data: bytesToBase64(mp3) }, r.host)).status, 200)
  await call(r.origin, '/api/features', { voices: false, treats: false }, r.host)
  assert.equal((await call(r.origin, `/api/voice/${seq}`, undefined, r.guest)).status, 404)
  await call(r.origin, '/api/features', { voices: true, treats: false }, r.host)
  assert.equal((await call(r.origin, `/api/voice/${seq}`, undefined, r.guest)).status, 404, 'cleared, not merely hidden')
  const late = await call(r.origin, '/api/voice', { seq, mime: 'audio/mpeg', data: bytesToBase64(mp3) }, r.host)
  assert.equal(late.body.voice, 'stored', 'the sender may re-attach within its window after a toggle')
  r.advance(VOICE_RELAY_LIMITS.uploadWindowMs + 1)
  const seq2 = (await call(r.origin, '/api/chat', { text: 'again' }, r.guest)).body.receipt.seq
  r.advance(VOICE_RELAY_LIMITS.uploadWindowMs + 1)
  assert.equal((await call(r.origin, '/api/voice', { seq: seq2, mime: 'audio/mpeg', data: bytesToBase64(mp3) }, r.guest)).body.voice, 'expired')
})

test('the standalone page may reach exactly one public origin, ElevenLabs, for its players\' own voice requests', async t => {
  const r = await room(t)
  const csp = (await call(r.origin, '/api/state', undefined, r.host)).headers.get('content-security-policy')!
  const connect = csp.split(';').map(part => part.trim()).find(part => part.startsWith('connect-src'))
  assert.equal(connect, "connect-src 'self' https://api.elevenlabs.io")
  assert.ok(csp.includes('media-src data:'), 'no remote media source')
})
