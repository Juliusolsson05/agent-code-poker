import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { FireAmbience, audibleLoopWindow, inlineAudioBytes } from '../src/audio/FireAmbience'
import { PokerAudio } from '../src/audio'
import { PerspectiveCamera, Vector3 } from 'three'
import { FIREPLACE_LAYOUT, PLAYER_LAYOUT } from '../src/scene/environment/layout'

const recording = readFileSync(new URL('../src/assets/audio/fireplace-creator-assets.mp3', import.meta.url))
// Same shape Vite's `?inline` import hands App.tsx and the LAN client.
const inlined = `data:audio/mpeg;base64,${recording.toString('base64')}`
const sha = (bytes: ArrayBuffer | Uint8Array) => createHash('sha256').update(new Uint8Array(bytes)).digest('hex')

/** A decoded buffer the tests control: `lead`/`tail` frames of digital silence
 * around a steady bed, mirroring the codec padding measured on the real MP3. */
function fakeBuffer(seconds = 10, lead = 0, tail = 0, sampleRate = 1000) {
  const length = seconds * sampleRate
  const pcm = new Float32Array(length).fill(.004)
  pcm.fill(0, 0, lead); pcm.fill(0, length - tail)
  return { numberOfChannels: 2, length, sampleRate, duration: seconds, getChannelData: () => pcm } as unknown as AudioBuffer
}

type Source = { buffer: unknown; loop: boolean; loopStart: number; loopEnd: number; started: number[] | null; stopped: boolean; stopAt: number | null; target: unknown; onended: unknown; connect(t: unknown): void; disconnect(): void; start(when: number, offset: number): void; stop(when?: number): void }

/** Fake device. It records what the fire asks for and REFUSES every
 * media-element path, the way the Agent Code frame CSP does. */
function fakeContext(decoded: AudioBuffer | Promise<AudioBuffer> = fakeBuffer()) {
  // Automation is collapsed to its end state (value = ramp target). `ramp`
  // records the last linear ramp so fade timing can be asserted.
  const param = () => ({ value: 0, ramp: null as null | { target: number; end: number }, cancelled: 0,
    setTargetAtTime(value: number) { this.value = value }, setValueAtTime(value: number) { this.value = value },
    cancelScheduledValues() { this.cancelled++ }, linearRampToValueAtTime(target: number, end: number) { this.value = target; this.ramp = { target, end } } })
  const links: unknown[] = []; let disconnected = 0
  const node = () => ({ connect(target: unknown) { links.push(target) }, disconnect() { disconnected++ } })
  const sources: Source[] = [], decodes: ArrayBuffer[] = []
  const context = {
    state: 'running', currentTime: 1, sampleRate: 48000, destination: {},
    // Only what PokerAudio's own synthesised chip cues need beside the fire.
    createBuffer: () => ({ copyToChannel() {} }), resume: () => Promise.resolve(), close: () => Promise.resolve(),
    listener: { positionX: param(), positionY: param(), positionZ: param(), forwardX: param(), forwardY: param(), forwardZ: param(), upX: param(), upY: param(), upZ: param() },
    createGain: () => ({ ...node(), gain: param() }),
    createPanner: () => ({ ...node(), panningModel: '', distanceModel: '', refDistance: 0, maxDistance: 0, rolloffFactor: 0, positionX: param(), positionY: param(), positionZ: param() }),
    createBufferSource() {
      const source: Source = { buffer: null, loop: false, loopStart: 0, loopEnd: 0, started: null, stopped: false, stopAt: null, target: null, onended: null,
        connect(t) { this.target = t }, disconnect() {}, start(when, offset) { this.started = [when, offset] }, stop(when = 0) { this.stopped = true; this.stopAt = when } }
      sources.push(source); return source
    },
    decodeAudioData(bytes: ArrayBuffer) { decodes.push(bytes); return Promise.resolve(decoded) },
    createMediaElementSource() { throw new Error('media elements are blocked by the host frame CSP (no media-src)') },
  }
  const playing = () => sources.filter(s => s.started && !s.stopped)
  return { context, asContext: context as unknown as AudioContext, links, sources, decodes, playing, disconnected: () => disconnected }
}
const settle = () => new Promise(resolve => setImmediate(resolve))

test('downloaded creator recording retains its provenance checksum', () => {
  assert.equal(sha(recording), 'd336de97d9c08015671c45e12e74a2835555fca563c3f0572ecb3545ccc31c95')
  assert.ok(recording.length < 1_500_000, 'do not accidentally bundle a multi-hour video')
})

// The regression guard for #12. The Agent Code extension frame CSP has no
// media-src and its connect-src excludes data:. So an <audio> element, a
// MediaElementSource, or fetch(dataUrl) are all silent in the installed
// extension while still working on the website. Every one of those paths
// throws here. The only way to make sound is decoding the bundled bytes
// in-page.
test('fire decodes the bundled MP3 bytes in-page and never uses a media element or data: media URL', async () => {
  const saved = { Audio: globalThis.Audio, AudioContext: globalThis.AudioContext, fetch: globalThis.fetch }
  const device = fakeContext()
  const mediaUrls: string[] = []
  globalThis.Audio = class { constructor(url?: string) { mediaUrls.push(String(url)); throw new Error('new Audio() is blocked in the extension frame') } } as unknown as typeof Audio
  globalThis.fetch = ((url: unknown) => { mediaUrls.push(String(url)); throw new Error('fetch(data:) is blocked by connect-src') }) as typeof fetch
  globalThis.AudioContext = class { constructor() { return device.context } } as unknown as typeof AudioContext
  try {
    const position = [FIREPLACE_LAYOUT.position[0], .4, FIREPLACE_LAYOUT.position[2] + .05]
    const audio = new PokerAudio(inlined, position)
    audio.setAmbienceActive(true); audio.unlock(); await settle()
    assert.deepEqual(mediaUrls, [], 'no media element or URL fetch may carry the recording')
    assert.equal(device.decodes.length, 1)
    assert.equal(sha(device.decodes[0]), sha(recording), 'decodeAudioData receives exactly the bundled MP3')
    const [fire] = device.playing()
    assert.ok(fire, 'a decoded buffer source is playing')
    assert.equal(fire.loop, true)
    audio.unlock(); await settle(); assert.equal(device.decodes.length, 1, 'later gestures never re-decode')
    audio.dispose()
  } finally {
    globalThis.Audio = saved.Audio; globalThis.AudioContext = saved.AudioContext; globalThis.fetch = saved.fetch
  }
})

test('inlined bytes survive the data: carrier and a percent-encoded carrier is refused', () => {
  assert.equal(sha(inlineAudioBytes(inlined)), sha(recording))
  assert.equal(sha(inlineAudioBytes(recording.toString('base64'))), sha(recording))
  assert.throws(() => inlineAudioBytes('data:audio/mpeg,%FF%FB'))
})

test('lifecycle requires gesture, gates pause/mute/level, keeps loop position and releases on dispose', async () => {
  const device = fakeContext(fakeBuffer(10))
  const fire = new FireAmbience(inlined)
  fire.setActive(true); fire.unlock(); assert.equal(device.sources.length, 0, 'no context yet, nothing to play on')
  fire.attach(device.asContext); await settle()
  assert.equal(device.playing().length, 1)
  device.context.currentTime = 4 // three seconds into the loop
  fire.setActive(false); assert.equal(device.playing().length, 0)
  fire.unlock(); assert.equal(device.playing().length, 0, 'UI gesture while paused cannot start fire')
  fire.setActive(true)
  assert.equal(device.playing().length, 1)
  assert.equal(device.playing()[0].started![1], 3, 'resume continues the loop instead of restarting it')
  fire.setMuted(true); fire.setActive(true); assert.equal(device.playing().length, 0)
  fire.setMuted(false); assert.equal(device.playing().length, 1)
  fire.setVolume(0); fire.unlock(); assert.equal(device.playing().length, 0, 'Off preset stops the fire')
  fire.setVolume(.1); assert.equal(device.playing().length, 1)
  const created = device.sources.length
  fire.setVolume(.02); fire.setActive(true); fire.unlock(); assert.equal(device.sources.length, created, 'no churn while already playing')
  fire.dispose(); fire.unlock(); fire.setActive(true)
  assert.equal(device.playing().length, 0); assert.equal(device.sources.length, created)
})

test('loop position wraps inside the trimmed loop window', async () => {
  const device = fakeContext(fakeBuffer(10, 500, 1000)) // loop 0.5 s .. 9 s
  const fire = new FireAmbience(inlined)
  fire.setActive(true); fire.unlock(); fire.attach(device.asContext); await settle()
  const [first] = device.playing()
  assert.deepEqual([first.loopStart, first.loopEnd, first.started![1]], [.5, 9, .5], 'starts at the first audible frame, not the codec padding')
  device.context.currentTime = 1 + 10 // 10 s played: one 8.5 s lap plus 1.5 s
  fire.setActive(false); fire.setActive(true)
  assert.ok(Math.abs(device.playing()[0].started![1] - 2) < 1e-9)
})

test('pause, mute and Off fade the bus for 40 ms before the source stops; dispose cuts at once', async () => {
  const device = fakeContext(fakeBuffer(10))
  const fire = new FireAmbience(inlined)
  fire.setActive(true); fire.unlock(); fire.attach(device.asContext); await settle()
  // No hearth position: the source feeds the quiet bus directly.
  const bus = device.sources[0].target as { gain: { value: number; ramp: { target: number; end: number } | null } }
  assert.deepEqual(bus.gain.ramp, { target: .045, end: 1.04 }, 'first start fades in instead of popping')
  device.context.currentTime = 2
  fire.setActive(false)
  const [paused] = device.sources
  assert.deepEqual(bus.gain.ramp, { target: 0, end: 2.04 })
  assert.equal(paused.stopAt, 2.04, 'stop lands exactly when the fade reaches zero, not on the same tick')
  assert.equal(typeof paused.onended, 'function', 'the faded node detaches itself from the bus when it ends')
  fire.setActive(true) // resumed inside the fade window
  assert.equal(paused.stopAt, 0, 'a still-fading tail is cut so it cannot double the new source')
  device.context.currentTime = 3
  fire.setVolume(0); assert.equal(device.sources[1].stopAt, 3.04, 'Off fades too')
  fire.setVolume(.045); device.context.currentTime = 4
  fire.setMuted(true); assert.equal(device.sources[2].stopAt, 4.04, 'mute fades too')
  const fading = device.sources[2]
  fire.setMuted(false); const live = device.sources[3]
  fire.dispose()
  assert.equal(live.stopAt, 0, 'dispose stops the playing source immediately')
  assert.equal(fading.stopAt, 0)
})

// Electron can keep the context suspended until a gesture that its autoplay
// policy accepts. In that state currentTime does not advance and nothing
// renders. This fake models both, and only PokerAudio's resume() leaves the
// state, so the test fails if the fire's bookkeeping ignores the frozen clock.
test('autoplay-locked context: source waits for resume(), and the loop position respects the frozen clock', async () => {
  const saved = globalThis.AudioContext
  const device = fakeContext(fakeBuffer(10, 500, 0))
  let gestureAccepted = false
  device.context.state = 'suspended'
  device.context.resume = () => { if (gestureAccepted) device.context.state = 'running'; return gestureAccepted ? Promise.resolve() : Promise.reject(new Error('NotAllowedError')) }
  const advance = (seconds: number) => { if (device.context.state === 'running') device.context.currentTime += seconds }
  const audible = () => device.context.state === 'running' ? device.playing() : []
  globalThis.AudioContext = class { constructor() { return device.context } } as unknown as typeof AudioContext
  try {
    const audio = new PokerAudio(inlined)
    audio.setAmbienceActive(true); audio.unlock(); await settle()
    assert.equal(device.playing().length, 1, 'scheduled on the suspended context')
    assert.equal(audible().length, 0, 'but silent until resume() succeeds')
    advance(5)
    audio.setAmbienceActive(false); audio.setAmbienceActive(true)
    assert.equal(device.playing()[0].started![1], .5, 'no time passed on a frozen clock, so resume stays at loopStart')
    gestureAccepted = true; audio.unlock(); await settle()
    assert.equal(audible().length, 1, 'the next accepted gesture makes the same scheduled loop audible')
    advance(3)
    audio.setAmbienceActive(false); audio.setAmbienceActive(true)
    assert.equal(device.playing()[0].started![1], 3.5, 'once running, played time counts from the context clock')
    audio.dispose()
  } finally { globalThis.AudioContext = saved }
})

test('a pause or dispose during decode wins over the decode result', async () => {
  let release: (b: AudioBuffer) => void = () => {}
  const device = fakeContext(new Promise<AudioBuffer>(resolve => { release = resolve }))
  const fire = new FireAmbience(inlined)
  fire.setActive(true); fire.unlock(); fire.attach(device.asContext)
  fire.setActive(false) // dialog opened while decoding
  release(fakeBuffer()); await settle()
  assert.equal(device.sources.length, 0, 'a decode finishing during a pause cannot start the fire')
  fire.setActive(true)
  assert.equal(device.playing().length, 1)

  let late: (b: AudioBuffer) => void = () => {}
  const slow = fakeContext(new Promise<AudioBuffer>(resolve => { late = resolve }))
  const disposed = new FireAmbience(inlined)
  disposed.setActive(true); disposed.unlock(); disposed.attach(slow.asContext); disposed.dispose()
  late(fakeBuffer()); await settle()
  assert.equal(slow.sources.length, 0, 'decode completing after dispose is discarded')
})

test('decode failure is logged once, not retried, and never throws into the hand', async () => {
  const device = fakeContext()
  device.context.decodeAudioData = (bytes: ArrayBuffer) => { device.decodes.push(bytes); return Promise.reject(new Error('EncodingError')) }
  const warn = console.warn, warnings: unknown[] = []
  console.warn = (...args: unknown[]) => { warnings.push(args) }
  try {
    const fire = new FireAmbience(inlined)
    fire.setActive(true); fire.unlock(); fire.attach(device.asContext); await settle()
    fire.unlock(); fire.setActive(false); fire.setActive(true); await settle()
    assert.equal(device.decodes.length, 1); assert.equal(warnings.length, 1); assert.equal(device.sources.length, 0)
    fire.dispose()
  } finally { console.warn = warn }
})

// Decision: decode the REAL file with ffmpeg rather than only pinning numbers.
// Node has no decodeAudioData, and a pure-JS MP3 decoder would be a new
// dependency for one test. ffmpeg at 48 kHz matches Chrome's decodeAudioData
// to the frame on this file (both give 8412 head / 1669 tail frames; checked
// in headless Chrome for PR #18). Where ffmpeg is missing the test SKIPS with
// that reason, and the checksum test above still catches any re-encode. A
// re-encode would change those counts and should make someone re-listen to the
// seam.
test('seam window on the real bundled MP3 trims exactly its codec padding', t => {
  let pcm: Buffer
  try {
    pcm = execFileSync('ffmpeg', ['-v', 'error', '-i', fileURLToPath(new URL('../src/assets/audio/fireplace-creator-assets.mp3', import.meta.url)), '-ar', '48000', '-f', 'f32le', '-acodec', 'pcm_f32le', '-'], { maxBuffer: 64 * 1024 * 1024 })
  } catch { t.skip('ffmpeg is not installed; the recording checksum test still pins the bytes'); return }
  const frames = pcm.length / 8, left = new Float32Array(frames), right = new Float32Array(frames)
  for (let i = 0; i < frames; i++) { left[i] = pcm.readFloatLE(i * 8); right[i] = pcm.readFloatLE(i * 8 + 4) }
  const decoded = { numberOfChannels: 2, length: frames, sampleRate: 48000, duration: frames / 48000, getChannelData: (c: number) => c ? right : left } as unknown as AudioBuffer
  const bounds = audibleLoopWindow(decoded)
  assert.equal(Math.round(bounds.start * 48000), 8412, 'head: codec delay plus the file lead-in')
  assert.equal(frames - Math.round(bounds.end * 48000), 1669, 'tail padding')
})

test('seam trimming finds codec padding but never eats real content', () => {
  assert.deepEqual(audibleLoopWindow(fakeBuffer(10, 175, 35)), { start: .175, end: 9.965 })
  assert.deepEqual(audibleLoopWindow(fakeBuffer(10)), { start: 0, end: 10 })
  assert.deepEqual(audibleLoopWindow(fakeBuffer(10, 3000, 0)), { start: 1, end: 10 }, 'a quiet intro is capped at one second of trim')
  assert.deepEqual(audibleLoopWindow(fakeBuffer(1, 1000, 0)), { start: .25, end: .75 }, 'even an all-silent buffer keeps half its length as a loop')
})

test('spatial graph has one quiet HRTF source and follows actual camera axes', async () => {
  const device = fakeContext()
  const fire = new FireAmbience(inlined)
  const position = [FIREPLACE_LAYOUT.position[0], .4, FIREPLACE_LAYOUT.position[2] + .05]
  fire.attach(device.asContext, position); fire.attach(device.asContext, position)
  fire.setActive(true); fire.unlock(); await settle()
  assert.equal(device.sources.length, 1)
  // Built once: source -> panner -> quiet bus -> destination.
  const pannerNode = device.sources[0].target as { panningModel: string; distanceModel: string; rolloffFactor: number; positionX: { value: number }; positionY: { value: number }; positionZ: { value: number } }
  const bus = device.links[0] as { gain: { value: number } }
  assert.deepEqual(device.links, [bus, device.context.destination])
  assert.notEqual(pannerNode, bus, 'the source feeds the panner, not the bus directly')
  assert.equal(pannerNode.panningModel, 'HRTF'); assert.equal(pannerNode.distanceModel, 'inverse')
  assert.ok(pannerNode.rolloffFactor > 0)
  assert.ok(bus.gain.value <= .045, 'fire is a background bed, not the earlier .12 foreground loop')
  assert.deepEqual([pannerNode.positionX.value, pannerNode.positionY.value, pannerNode.positionZ.value], position)
  const listener = device.context.listener
  const camera = new PerspectiveCamera(); camera.position.set(...PLAYER_LAYOUT.eye)
  camera.lookAt(...PLAYER_LAYOUT.look); camera.updateMatrixWorld()
  fire.setListenerMatrix(camera.matrixWorld.elements)
  const forward = camera.getWorldDirection(new Vector3())
  assert.deepEqual([listener.positionX.value, listener.positionY.value, listener.positionZ.value], [...PLAYER_LAYOUT.eye])
  assert.ok(new Vector3(listener.forwardX.value, listener.forwardY.value, listener.forwardZ.value).distanceTo(forward) < 1e-9)
  camera.lookAt(...position); camera.updateMatrixWorld(); fire.setListenerMatrix(camera.matrixWorld.elements)
  assert.ok(new Vector3(listener.forwardX.value, listener.forwardY.value, listener.forwardZ.value).distanceTo(new Vector3(...position).sub(camera.position).normalize()) < 1e-9, 'looking toward hearth must center source, not invert listener Z')
  const before = listener.positionX.value; const invalid = camera.matrixWorld.elements.slice(); invalid[12] = NaN
  fire.setListenerMatrix(invalid); assert.equal(listener.positionX.value, before)
  fire.dispose(); assert.equal(device.disconnected(), 2, 'panner and bus released')
  assert.ok(device.sources[0].stopped)
})
