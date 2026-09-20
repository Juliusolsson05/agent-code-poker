import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { createHash } from 'node:crypto'
import type { TraceEntry } from '../src/scene/diagnostics/Recorder'

const base = new URL('../testing/fixtures/experience/', import.meta.url)
const manifest = JSON.parse(readFileSync(new URL('manifest.json', base), 'utf8'))

// Preserve evidence independently of future render changes. These checks prove
// provenance/privacy/completeness, NOT that the recorded broken behavior is
// acceptable. Replays must assert the user's semantics against new pose output,
// never compare a fixed renderer to these bad poses as visual golden truth.
test('recorded experience corpus remains verbatim, finite and free of private engine data', () => {
  for (const session of manifest.sessions) {
    const bytes = gunzipSync(readFileSync(new URL(session.file, base)))
    if (session.rawSha256) assert.equal(createHash('sha256').update(bytes).digest('hex'), session.rawSha256)
    const trace = JSON.parse(bytes.toString())
    assert.equal(trace.metadata.source, 'actual-browser-session')
    assert.equal(trace.truncated, false)
    assert.equal(trace.counts.frame, session.frameCount)
    assert.equal(trace.counts.pose, session.poseCount)
    const walk = (value: unknown): void => {
      if (typeof value === 'number') assert.ok(Number.isFinite(value))
      if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) {
        assert.ok(!['hole', 'deck', 'save', 'storage', 'board'].includes(key), `private/unnecessary data field: ${key}`)
        walk(child)
      }
    }
    walk(trace)
    let previous = -Infinity
    for (const entry of trace.entries as TraceEntry[]) { assert.ok(entry.wallMs >= previous); previous = entry.wallMs }
    for (const image of session.images) assert.ok(existsSync(new URL(image, base)))
  }
  for (const image of manifest.rigImages) assert.ok(existsSync(new URL(image.file, base)))
})
