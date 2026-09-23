import test from 'node:test'
import assert from 'node:assert/strict'
import { HostTable, LEISURE_LIMITS } from '../src/session/HostTable'
import { RoomProjection } from '../src/presentation/RoomProjection'
import { DRINKS } from '../src/scene/props/specs'

// Synthetic, clock-injected packets against the in-process owner. These prove
// the authority contract; the real HTTP path and two real browsers are
// exercised separately (lan-http.test.ts and the recorded acceptance run).
const ids = Array.from({ length: 6 }, (_, seat) => ({ id: `principal-${seat}`, name: `Guest ${seat}` }))
function table(humans = 6) {
  let clock = 10_000
  const t = new HostTable(ids[0], { random: () => .43, now: () => clock })
  ids.slice(1, humans).forEach(p => t.join(p.id, p.name))
  t.start(ids[0].id, t.view(ids[0].id).revision)
  return { t, advance: (ms: number) => { clock += ms } }
}
function playOut(t: HostTable) {
  // Humans fold whenever it is their turn; the scheduler plays bots/advances.
  for (let guard = 0; guard < 200; guard++) {
    const v = t.view(ids[0].id)
    if (v.phase === 'complete') return
    const owner = v.phase === 'betting' ? ids.find(p => { try { return t.view(p.id).self.seat === v.actor && !t.view(p.id).self.waiting } catch { return false } }) : undefined
    if (owner && t.act(owner.id, { sequence: t.view(owner.id).self.nextSequence, revision: v.revision, action: { type: 'fold' } }).ok) continue
    t.tick(v.revision)
  }
  throw new Error('hand did not finish')
}
const seatLeisure = (t: HostTable, viewer: number, seat: number) => t.view(ids[viewer].id).players.find(p => p.seat === seat)!.leisure

test('accepted gestures reach every other viewer as a public cosmetic record, bots stay ambient', () => {
  const { t, advance } = table(3)
  // A human who has not gestured is still marked human-driven (non-null), so
  // renderers suppress ambient sips; seats 3-5 are bots and stay null.
  assert.deepEqual(seatLeisure(t, 0, 2), { seq: 0, action: null, ageMs: null, drinkKind: null })
  for (const seat of [3, 4, 5]) assert.equal(seatLeisure(t, 0, seat), null)
  assert.deepEqual(t.leisure(ids[2].id, { action: 'smoke' }, { paused: false }), { ok: true, code: 'accepted' })
  advance(400)
  const smoke = seatLeisure(t, 0, 2)!
  assert.equal(smoke.action, 'smoke'); assert.equal(smoke.ageMs, 400); assert.equal(smoke.drinkKind, null)
  assert.deepEqual(seatLeisure(t, 1, 2), smoke, 'every viewer receives the same record for that seat')
  advance(LEISURE_LIMITS.animatedMs)
  assert.equal(t.leisure(ids[2].id, { action: 'sip', kind: 'wine' }, { paused: false }).code, 'accepted')
  const sip = seatLeisure(t, 1, 2)!
  assert.ok(sip.seq > smoke.seq); assert.equal(sip.action, 'sip'); assert.equal(sip.drinkKind, 'wine'); assert.equal(sip.ageMs, 0)
  assert.equal(t.leisure(ids[2].id, { action: 'order', kind: 'water' }, { paused: false }).code, 'accepted')
  assert.equal(seatLeisure(t, 0, 2)!.drinkKind, 'water')
  advance(LEISURE_LIMITS.animatedMs)
  assert.equal(t.leisure(ids[2].id, { action: 'smoke' }, { paused: false }).code, 'accepted')
  assert.equal(seatLeisure(t, 0, 2)!.drinkKind, 'water', 'smoking keeps the glass the player ordered')
  // Every authored drink is orderable: the check is DRINKS itself, not a copy.
  for (const kind of Object.keys(DRINKS)) {
    advance(LEISURE_LIMITS.orderMs)
    assert.equal(t.leisure(ids[1].id, { action: 'order', kind }, { paused: false }).code, 'accepted', kind)
  }
})

test('leisure never consumes the wager sequence, the revision, the ledger or the private checkpoint', () => {
  const { t, advance } = table()
  const before = t.exportHostCheckpoint(), actor = t.view(ids[0].id).actor!
  const view = t.view(ids[actor].id)
  // Build the actor's wager BEFORE anybody gestures. If leisure bumped the
  // revision this would come back 'stale'; if it consumed the member sequence
  // it would come back 'out-of-order'.
  const wager = { sequence: view.self.nextSequence, revision: view.revision, action: { type: 'call' } }
  for (const [seat, request] of [[actor, { action: 'smoke' }], [(actor + 1) % 6, { action: 'sip', kind: 'beer' }], [(actor + 2) % 6, { action: 'order', kind: 'wine' }]] as const) {
    assert.equal(t.leisure(ids[seat].id, request, { paused: false }).code, 'accepted'); advance(10)
  }
  assert.deepEqual(t.exportHostCheckpoint(), before, 'nothing cosmetic enters the private save')
  assert.equal(t.view(ids[actor].id).revision, view.revision)
  assert.equal(t.view(ids[actor].id).self.nextSequence, view.self.nextSequence)
  assert.equal(t.act(ids[actor].id, wager).code, 'accepted')
})

test('rejections: unknown, forged, malformed, disconnected, queued, paused and too frequent', () => {
  const { t, advance } = table()
  const ok = { paused: false }
  assert.equal(t.leisure('principal-unknown', { action: 'smoke' }, ok).code, 'unauthorized')
  for (const forged of [
    { action: 'smoke', seat: 3 }, { action: 'sip', kind: 'wine', seat: 1 }, { action: 'sip' }, { action: 'order' },
    { action: 'smoke', kind: 'wine' }, { action: 'order', kind: 'absinthe' }, { action: 'order', kind: 'toString' },
    { action: 'wave' }, ['smoke'], null, 'smoke', Object.create({ action: 'smoke' }),
  ]) assert.equal(t.leisure(ids[1].id, forged, ok).code, 'invalid', JSON.stringify(forged))
  assert.equal(t.leisure(ids[1].id, { action: 'smoke' }, { paused: true }).code, 'paused')
  t.disconnect(ids[1].id)
  assert.equal(t.leisure(ids[1].id, { action: 'smoke' }, ok).code, 'disconnected')
  t.reconnect(ids[1].id)
  assert.equal(t.leisure(ids[1].id, { action: 'smoke' }, ok).code, 'accepted')
  advance(LEISURE_LIMITS.animatedMs - 1)
  assert.equal(t.leisure(ids[1].id, { action: 'sip', kind: 'beer' }, ok).code, 'rate-limited')
  // Orders have their own spacing, so a glass swap right after a puff works.
  assert.equal(t.leisure(ids[1].id, { action: 'order', kind: 'beer' }, ok).code, 'accepted')
  advance(LEISURE_LIMITS.orderMs - 2)
  assert.equal(t.leisure(ids[1].id, { action: 'order', kind: 'wine' }, ok).code, 'rate-limited')
  advance(2)
  assert.equal(t.leisure(ids[1].id, { action: 'sip', kind: 'wine' }, ok).code, 'accepted')
  // Rejections leave no trace in the record other viewers receive.
  assert.equal(seatLeisure(t, 0, 1)!.action, 'sip')
  t.leave(ids[5].id)
  assert.equal(t.leisure(ids[5].id, { action: 'smoke' }, ok).code, 'unauthorized')
})

test('a queued arrival does not own the body its bot is still playing', () => {
  const { t } = table(5)
  t.join('late-arrival', 'Late')
  assert.equal(t.leisure('late-arrival', { action: 'smoke' }, { paused: false }).code, 'waiting')
  assert.equal(seatLeisure(t, 0, 5), null)
})

test('age is capped and integral; a new occupant never repeats the previous seq', () => {
  const { t, advance } = table(3)
  assert.equal(t.leisure(ids[2].id, { action: 'smoke' }, { paused: false }).code, 'accepted')
  const first = seatLeisure(t, 0, 2)!.seq
  advance(1.7)
  assert.equal(seatLeisure(t, 0, 2)!.ageMs, 1)
  advance(10 * LEISURE_LIMITS.maxAgeMs)
  assert.equal(seatLeisure(t, 0, 2)!.ageMs, LEISURE_LIMITS.maxAgeMs)
  // Disconnection hands the body to a bot: ambient again until reconnect.
  t.disconnect(ids[2].id); assert.equal(seatLeisure(t, 0, 2), null)
  t.reconnect(ids[2].id); assert.equal(seatLeisure(t, 0, 2)!.seq, first)
  // Release the seat at a boundary and seat somebody else in it: leave, finish
  // the hand, the next deal frees the chair, the successor queues into it and
  // owns it from the deal after that.
  t.leave(ids[2].id)
  playOut(t); t.start(ids[0].id, t.view(ids[0].id).revision)
  t.join('successor', 'Successor')
  assert.equal(t.view('successor').self.seat, 2)
  assert.equal(seatLeisure(t, 0, 2), null, 'queued: the bot still owns the body')
  playOut(t); t.start(ids[0].id, t.view(ids[0].id).revision)
  assert.deepEqual(seatLeisure(t, 0, 2), { seq: 0, action: null, ageMs: null, drinkKind: null }, 'nothing inherited from the old occupant')
  assert.equal(t.leisure('successor', { action: 'smoke' }, { paused: false }).code, 'accepted')
  assert.ok(seatLeisure(t, 0, 2)!.seq > first)
})

test('the wire carries only the allowlisted fields and the renderer adapter validates them', () => {
  const { t } = table(2)
  t.leisure(ids[1].id, { action: 'sip', kind: 'beer' }, { paused: false })
  const wire = t.view(ids[0].id), json = JSON.stringify(wire)
  for (const secret of ['animatedAt', 'orderedAt', 'principal-', '"at"', 'deck', 'hole']) assert.equal(json.includes(secret), false, secret)
  assert.deepEqual(Object.keys(wire.players[1].leisure!).sort(), ['action', 'ageMs', 'drinkKind', 'seq'])
  const scene = new RoomProjection().remote(structuredClone(wire), 0)
  assert.deepEqual(scene.players[1].leisure, wire.players[1].leisure)
  assert.equal(scene.players[1].sourceSeat, 1)
  // Viewer rotation moves the record with its body, never with a display index.
  const rotated = new RoomProjection().remote(t.view(ids[1].id), 1)
  assert.equal(rotated.players.find(p => p.sourceSeat === 1)!.leisure!.drinkKind, 'beer')
  for (const bad of [
    { seq: -1, action: 'sip', ageMs: 0, drinkKind: 'beer' }, { seq: 1, action: 'dance', ageMs: 0, drinkKind: null },
    { seq: 1, action: 'sip', ageMs: 1.5, drinkKind: null }, { seq: 1, action: 'sip', ageMs: 0, drinkKind: 'absinthe' },
    { seq: 1, action: null, ageMs: 5, drinkKind: null }, { seq: 1, action: 'smoke', ageMs: null, drinkKind: null }, 'smoke', 7,
  ]) {
    const tampered = structuredClone(wire) as any; tampered.players[1].leisure = bad
    assert.equal(new RoomProjection().remote(tampered, 0).players[1].leisure, null, JSON.stringify(bad))
  }
  const copy = structuredClone(wire), adapted = new RoomProjection().remote(copy, 0)
  adapted.players[1].leisure!.seq = 999
  assert.deepEqual(copy, wire, 'the adapter copies instead of aliasing the wire object')
})
