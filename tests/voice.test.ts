import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { MAX_VOICE_BYTES, base64ToBytes, bytesToBase64, looksLikeMpegAudio } from '../src/voice/audioClip'
import { ELEVENLABS_ORIGIN, createElevenLabsProvider, normalizeVoiceSettings, type VoiceHttpRequest } from '../src/voice/ElevenLabs'
import { brokeredVoiceHttp } from '../src/voice/transports'
import { browserVoiceSettingsStore, agentCodeVoiceSettingsStore } from '../src/voice/settingsStore'
import { ChatVoice } from '../server/client/ChatVoice'
import type { ChatLine } from '../src/session/HostTable'

// Real bytes, not invented ones: the MP3 is locally encoded in the exact
// output format the client requests, and the error bodies were recorded from
// ElevenLabs with curl (no key). See testing/fixtures/elevenlabs/README.md.
const fixtures = new URL('../testing/fixtures/elevenlabs/', import.meta.url)
const mp3 = new Uint8Array(readFileSync(new URL('fake-tts-mp3_22050_32.mp3', fixtures)))
const recorded = JSON.parse(readFileSync(new URL('recorded-errors.json', fixtures), 'utf8')).responses as
  { case: string; status: number; body: unknown }[]
const KEY = 'sk_test_0123456789abcdef', VOICE = '21m00Tcm4TlvDq8ikWAM'
const settings = normalizeVoiceSettings({ apiKey: ` ${KEY}\n`, voiceId: VOICE })!
const json = (value: unknown) => new TextEncoder().encode(JSON.stringify(value))

test('magic bytes accept real MPEG audio and refuse look-alikes', () => {
  assert.ok(looksLikeMpegAudio(mp3))
  assert.ok(looksLikeMpegAudio(new Uint8Array([0x49, 0x44, 0x33, 0x04, 0, 0])), 'ID3v2.4 tag')
  for (const bad of [
    new TextEncoder().encode('<html>'), new TextEncoder().encode('RIFF....WAVE'), new TextEncoder().encode('OggS'),
    new Uint8Array([0x49, 0x44, 0x33, 0xff]), // "ID3" with an impossible version
    new Uint8Array([0xff, 0xe8, 0x40, 0]), // reserved MPEG version 01
    new Uint8Array([0xff, 0xf3, 0xf0, 0]), // bitrate index 1111
    new Uint8Array([0xff, 0xf3]), // too short
  ]) assert.equal(looksLikeMpegAudio(bad), false, Array.from(bad.slice(0, 4)).join(','))
})

test('base64 round-trips a real clip and is strict about its alphabet', () => {
  assert.deepEqual(base64ToBytes(bytesToBase64(mp3)), mp3)
  const big = new Uint8Array(MAX_VOICE_BYTES).map((_, i) => i * 7)
  assert.deepEqual(base64ToBytes(bytesToBase64(big)), big, 'no call-stack overflow at the cap')
  for (const bad of ['abc', 'ab c', 'data:audio/mpeg;base64,AAAA', '-_-_', 'AAAA=AAA']) assert.equal(base64ToBytes(bad), null, bad)
})

test('the provider sends one request to the documented endpoint with the key in one header only', async () => {
  const calls: VoiceHttpRequest[] = []
  const provider = createElevenLabsProvider(() => settings, async request => { calls.push(request); return { status: 200, contentType: 'audio/mpeg', bytes: mp3 } })
  const result = await provider.synthesize('Nice hand.')
  assert.deepEqual(result, { ok: true, audio: mp3 })
  assert.equal(calls.length, 1)
  const [call] = calls, url = new URL(call.url)
  assert.equal(url.origin, ELEVENLABS_ORIGIN); assert.equal(url.pathname, `/v1/text-to-speech/${VOICE}`)
  assert.equal(url.searchParams.get('output_format'), 'mp3_22050_32')
  assert.equal(call.headers['xi-api-key'], KEY, 'trimmed key in its header')
  assert.ok(!call.url.includes(KEY) && !call.body.includes(KEY), 'never in the URL or body')
  assert.deepEqual(JSON.parse(call.body), { text: 'Nice hand.', model_id: 'eleven_flash_v2_5' })
})

test('recorded ElevenLabs failures map to closed reasons; nothing echoes the key', async () => {
  const expected: Record<string, string> = { 401: 'invalid-key', 400: 'voice-not-found' }
  for (const response of recorded) {
    const provider = createElevenLabsProvider(() => settings, async () => ({ status: response.status, contentType: 'application/json', bytes: json(response.body) }))
    const result = await provider.synthesize('hi')
    assert.deepEqual(result, { ok: false, reason: expected[response.status] }, response.case)
  }
  // Documented-but-unrecorded shapes (a real key is needed to provoke them).
  const classify = async (status: number, body: unknown) => (await createElevenLabsProvider(() => settings,
    async () => ({ status, contentType: 'application/json', bytes: json(body) })).synthesize('hi'))
  assert.deepEqual(await classify(401, { detail: { status: 'quota_exceeded', message: 'quota' } }), { ok: false, reason: 'quota' })
  assert.deepEqual(await classify(429, { detail: { status: 'too_many_concurrent_requests' } }), { ok: false, reason: 'busy' })
  assert.deepEqual(await classify(503, '<html>oops</html>'), { ok: false, reason: 'failed' })
  const network = createElevenLabsProvider(() => settings, async () => { throw new Error(`fetch failed with ${KEY}`) })
  assert.deepEqual(await network.synthesize('hi'), { ok: false, reason: 'network' }, 'transport text (even one holding the key) is dropped')
  const notAudio = createElevenLabsProvider(() => settings, async () => ({ status: 200, contentType: 'audio/mpeg', bytes: json({ ok: true }) }))
  assert.deepEqual(await notAudio.synthesize('hi'), { ok: false, reason: 'invalid-response' })
  assert.deepEqual(await createElevenLabsProvider(() => null, async () => assert.fail('no request without settings')).synthesize('hi'),
    { ok: false, reason: 'not-configured' })
})

test('settings validation refuses values that could escape the URL or a header', () => {
  for (const bad of [{ apiKey: 'short', voiceId: VOICE }, { apiKey: `${KEY}\r\nx: y`, voiceId: VOICE },
    { apiKey: KEY, voiceId: '../../v1/user' }, { apiKey: KEY, voiceId: `${VOICE}?x=1` }, { apiKey: KEY }])
    assert.equal(normalizeVoiceSettings(bad), null, JSON.stringify(bad))
})

test('the Agent Code transport asks the host for base64 and refuses a host that cannot give it', async () => {
  const seen: unknown[] = []
  const http = brokeredVoiceHttp(async (url, init) => { seen.push({ url, init }); return { status: 200, contentType: 'audio/mpeg', body: bytesToBase64(mp3), bodyEncoding: 'base64' } })
  const response = await http({ url: `${ELEVENLABS_ORIGIN}/v1/x`, headers: { a: 'b' }, body: '{}' })
  assert.deepEqual(response.bytes, mp3)
  assert.deepEqual(seen, [{ url: `${ELEVENLABS_ORIGIN}/v1/x`, init: { httpMethod: 'POST', body: '{}', responseType: 'base64', headers: [{ name: 'a', value: 'b' }] } }])
  const oldHost = brokeredVoiceHttp(async () => ({ status: 200, contentType: 'audio/mpeg', body: 'ID3garbled' }))
  await assert.rejects(oldHost({ url: ELEVENLABS_ORIGIN, headers: {}, body: '' }), /binary/)
})

test('settings stores: the browser says where the key lives; Agent Code never downgrades to plain storage', async () => {
  const memory = new Map<string, string>()
  const local = { getItem: (k: string) => memory.get(k) ?? null, setItem: (k: string, v: string) => void memory.set(k, v), removeItem: (k: string) => void memory.delete(k) } as unknown as Storage
  const browser = browserVoiceSettingsStore(() => local)
  assert.match(browser.where, /this browser/)
  assert.equal(await browser.save(settings), true); assert.deepEqual(await browser.load(), settings)
  await browser.clear(); assert.equal(await browser.load(), null)
  const stored = new Map<string, unknown>(), secret = new Map<string, string>()
  const storage = { get: async (k: string) => stored.get(k), set: async (k: string, v: string) => void stored.set(k, v), delete: async (k: string) => void stored.delete(k) }
  const withSecrets = agentCodeVoiceSettingsStore({ storage, secrets: { get: async k => secret.get(k) ?? null, set: async (k, v) => void secret.set(k, v), delete: async k => void secret.delete(k) } })
  assert.equal(await withSecrets.save(settings), true)
  assert.ok(![...stored.values()].some(v => String(v).includes(KEY)), 'the key is not in ordinary extension storage')
  assert.deepEqual(await withSecrets.load(), settings)
  const oldHost = agentCodeVoiceSettingsStore({ storage })
  assert.equal(await oldHost.save(settings), false); assert.equal(await oldHost.load(), null)
  assert.match(oldHost.where, /no secret storage/)
})

const line = (seq: number, displaySeat: number, voice: boolean, ageMs = 500): ChatLine =>
  ({ seq, seat: displaySeat, displaySeat, name: 'P', text: 't', ageMs, voice })

test('KEY NEVER LEAVES THE CLIENT: the host sees text and audio, ElevenLabs sees the key', async () => {
  const hostCalls: unknown[] = [], elevenCalls: VoiceHttpRequest[] = [], played: number[] = []
  const provider = createElevenLabsProvider(() => settings, async request => { elevenCalls.push(request); return { status: 200, contentType: 'audio/mpeg', bytes: mp3 } })
  const chat = new ChatVoice({
    hostApi: async (path, body) => { hostCalls.push({ path, body }); return path === '/api/chat' ? { receipt: { ok: true, code: 'accepted', seq: 77 } } : { voice: 'stored' } },
    provider: () => provider, play: (_bytes, seat) => played.push(seat),
  })
  assert.deepEqual(await chat.send('all in', true), { sent: true, seq: 77, voice: 'spoken' })
  assert.deepEqual(hostCalls.map(c => (c as { path: string }).path), ['/api/chat', '/api/voice'])
  assert.ok(!JSON.stringify(hostCalls).includes(KEY), 'no host request carries the key')
  assert.ok(!JSON.stringify(hostCalls).includes(VOICE), 'nor the voice id')
  assert.deepEqual(base64ToBytes((hostCalls[1] as { body: { data: string } }).body.data), mp3, 'only the finished audio is relayed')
  assert.equal(elevenCalls.length, 1); assert.deepEqual(played, [0], 'the sender hears its own line locally')
})

test('voices off: no ElevenLabs call even with a saved key; a failed synthesis still sends the text', async () => {
  let spent = 0
  const provider = { synthesize: async () => { spent++; return { ok: false as const, reason: 'quota' as const } } }
  const hostCalls: string[] = []
  const chat = new ChatVoice({ hostApi: async path => { hostCalls.push(path); return { receipt: { seq: 5 } } }, provider: () => provider, play: () => assert.fail() })
  assert.deepEqual(await chat.send('hi', false), { sent: true, seq: 5, voice: 'off' }); assert.equal(spent, 0)
  assert.deepEqual(await chat.send('hi', true), { sent: true, seq: 5, voice: 'off', issue: 'quota' })
  assert.deepEqual(hostCalls, ['/api/chat', '/api/chat'], 'no upload for a failed synthesis')
})

test('relay playback: only lines this tab saw arrive, once each, never its own, never stale, never while off or muted', async () => {
  const fetched: string[] = [], played: number[] = []
  const chat = new ChatVoice({ provider: () => null, play: (_bytes, seat) => played.push(seat),
    hostApi: async path => { fetched.push(path); return { mime: 'audio/mpeg', data: bytesToBase64(mp3) } } })
  chat.observe([line(1, 2, true)], true, true) // first sight: history, never spoken
  chat.observe([line(1, 2, true), line(2, 3, false)], true, true) // new line, clip not uploaded yet
  chat.observe([line(1, 2, true), line(2, 3, true), line(3, 0, true), line(4, 4, true, 31_000)], true, true)
  chat.observe([line(2, 3, true)], true, true) // a later poll must not refetch
  chat.observe([line(5, 1, true)], false, true) // voices off
  chat.observe([line(6, 1, true)], true, false) // muted / not audible
  await new Promise(resolve => setTimeout(resolve, 0))
  assert.deepEqual(fetched, ['/api/voice/2']); assert.deepEqual(played, [3])
  chat.reset(); chat.observe([line(9, 1, true)], true, true); await new Promise(resolve => setTimeout(resolve, 0))
  assert.deepEqual(fetched, ['/api/voice/2'], 'a new generation starts with history, not playback')
})
