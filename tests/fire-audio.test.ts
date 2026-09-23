import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
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

type Source = { buffer: unknown; loop: boolean; loopStart: number; loopEnd: number; started: number[] | null; stopped: boolean; target: unknown; connect(t: unknown): void; disconnect(): void; start(when: number, offset: number): void; stop(): void }

/** Fake device. It records what the fire asks for and REFUSES every
 * media-element path, the way the Agent Code frame CSP does. */
function fakeContext(decoded: AudioBuffer | Promise<AudioBuffer> = fakeBuffer()) {
  const param = () => ({ value: 0, setTargetAtTime(value: number) { this.value = value } })
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
      const source: Source = { buffer: null, loop: false, loopStart: 0, loopEnd: 0, started: null, stopped: false, target: null,
        connect(t) { this.target = t }, disconnect() {}, start(when, offset) { this.started = [when, offset] }, stop() { this.stopped = true } }
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

test('autoplay-locked and racing contexts: suspended still schedules, pause/dispose during decode win', async () => {
  let release: (b: AudioBuffer) => void = () => {}
  const pending = new Promise<AudioBuffer>(resolve => { release = resolve })
  const device = fakeContext(pending)
  device.context.state = 'suspended' // Electron may hold the context until a later gesture's resume()
  const fire = new FireAmbience(inlined)
  fire.setActive(true); fire.unlock(); fire.attach(device.asContext)
  fire.setActive(false) // dialog opened while decoding
  release(fakeBuffer()); await settle()
  assert.equal(device.sources.length, 0, 'a decode finishing during a pause cannot start the fire')
  fire.setActive(true)
  assert.equal(device.playing().length, 1, 'suspended context: source is scheduled and becomes audible on resume()')

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
