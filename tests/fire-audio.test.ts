import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { FireAmbience } from '../src/audio/FireAmbience'

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
