import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { FireAmbience } from '../src/audio/FireAmbience'
import { PerspectiveCamera, Vector3 } from 'three'
import { FIREPLACE_LAYOUT, PLAYER_LAYOUT } from '../src/scene/environment/layout'

test('downloaded creator recording retains its provenance checksum', () => {
  const bytes = readFileSync(new URL('../src/assets/audio/fireplace-creator-assets.mp3', import.meta.url))
  assert.equal(createHash('sha256').update(bytes).digest('hex'), 'd336de97d9c08015671c45e12e74a2835555fca563c3f0572ecb3545ccc31c95')
  assert.ok(bytes.length < 1_500_000, 'do not accidentally bundle a multi-hour video')
})

test('synthetic audio lifecycle requires gesture, gates pause/mute, and releases its single source', async () => {
  let starts = 0, pauses = 0, releases = 0
  const element = { loop: false, preload: '', volume: 0, currentTime: 12,
    play: () => { starts++; return Promise.resolve() }, pause: () => { pauses++ },
    removeAttribute: (key: string) => { assert.equal(key, 'src'); releases++ }, load() {} }
  const ambience = new FireAmbience(element as unknown as HTMLAudioElement)
  ambience.setActive(true); assert.equal(starts, 0)
  ambience.unlock(); ambience.unlock(); assert.equal(starts, 1)
  ambience.setActive(false); assert.ok(pauses > 0); assert.equal(element.currentTime, 12)
  ambience.unlock(); assert.equal(starts, 1, 'UI gesture while paused cannot start fire')
  ambience.setActive(true); assert.equal(starts, 2)
  ambience.setMuted(true); ambience.setActive(true); assert.equal(starts, 2)
  ambience.setMuted(false); assert.equal(starts, 3)
  ambience.setVolume(0); ambience.unlock(); assert.equal(starts, 3)
  ambience.setVolume(.1); assert.equal(starts, 4)
  ambience.dispose(); ambience.unlock(); ambience.setActive(true)
  assert.equal(starts, 4); assert.equal(releases, 1)
  await Promise.resolve()
})

test('rejected browser playback is retryable and stale rejection cannot reset a newer request', async () => {
  let starts = 0, rejectOld: (e: Error) => void = () => {}
  const element = { play: () => { starts++; return starts === 1 ? new Promise<void>((_, reject) => { rejectOld = reject }) : Promise.resolve() }, pause() {}, removeAttribute() {}, load() {} }
  const ambience = new FireAmbience(element as unknown as HTMLAudioElement)
  ambience.setActive(true); ambience.unlock(); ambience.setActive(false); ambience.setActive(true)
  rejectOld(new Error('gesture revoked')); await Promise.resolve()
  ambience.unlock(); assert.equal(starts, 2)
  ambience.dispose()
})

test('synthetic spatial graph has one quiet HRTF source and follows actual camera axes', () => {
  const param = () => ({ value: 0, setTargetAtTime(value: number) { this.value = value } })
  const links: unknown[] = []; let disconnected = 0, sources = 0
  const node = () => ({ connect(target: unknown) { links.push(target) }, disconnect() { disconnected++ } })
  const panner = { ...node(), panningModel: '', distanceModel: '', refDistance: 0, maxDistance: 0, rolloffFactor: 0, positionX: param(), positionY: param(), positionZ: param() }
  const gain = { ...node(), gain: param() }
  const listener = { positionX: param(), positionY: param(), positionZ: param(), forwardX: param(), forwardY: param(), forwardZ: param(), upX: param(), upY: param(), upZ: param() }
  const context = { destination: {}, listener, currentTime: 1, createMediaElementSource() { sources++; return node() }, createPanner: () => panner, createGain: () => gain }
  const element = { volume: 0, play: () => Promise.resolve(), pause() {}, removeAttribute() {}, load() {} }
  const fire = new FireAmbience(element as unknown as HTMLAudioElement)
  const position = [FIREPLACE_LAYOUT.position[0], .4, FIREPLACE_LAYOUT.position[2] + .05]
  fire.connectSpatial(context as unknown as AudioContext, position)
  fire.connectSpatial(context as unknown as AudioContext, position)
  assert.equal(sources, 1); assert.deepEqual(links, [panner, gain, context.destination])
  assert.equal(panner.panningModel, 'HRTF'); assert.equal(panner.distanceModel, 'inverse')
  assert.ok(panner.rolloffFactor > 0); assert.ok(gain.gain.value <= .045, 'fire is a background bed, not the earlier .12 foreground loop')
  assert.deepEqual([panner.positionX.value, panner.positionY.value, panner.positionZ.value], position)
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
  fire.dispose(); assert.equal(disconnected, 3)
})
