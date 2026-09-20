import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { HostTable } from '../src/session/HostTable'

const trace = JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T05-52-49-020Z.json.gz', import.meta.url))).toString())
const observed = trace.entries.filter((e: any) => e.kind === 'public-game')
const identity = (seat: number) => `recovery-${seat}`
function table() {
  const t = new HostTable({ id: identity(0), name: 'Host' }, { random: () => .43 })
  for (let seat = 1; seat < 6; seat++) t.join(identity(seat), `Guest ${seat}`)
  t.start(identity(0), t.view(identity(0)).revision)
  return t
}
function act(t: HostTable, seat: number, action: object) {
  const v = t.view(identity(seat))
  const request = { sequence: v.self.nextSequence, revision: v.revision, action }
  assert.equal(t.act(identity(seat), request).code, 'accepted')
  return request
}

test('retained real public wager/fold sequence survives private checkpoint recovery at each step', () => {
  let t = table()
  for (const seat of [3, 4, 5]) act(t, seat, { type: 'call' })
  act(t, 0, { type: 'raise', to: 500 })
  for (let step = 0; step < observed.length; step++) {
    if (step > 0 && step <= 5) act(t, step, { type: step <= 3 ? 'fold' : 'call' })
    if (step === 6) assert.equal(t.tick(t.view(identity(0)).revision), true)
    if (step > 6) act(t, step - 3, { type: 'check' })
    const before = Array.from({ length: 6 }, (_, seat) => t.view(identity(seat)))
    t = HostTable.restoreHostCheckpoint(JSON.parse(JSON.stringify(t.exportHostCheckpoint())))
    assert.throws(() => t.view(identity(0)), /disconnected/)
    for (let seat = 0; seat < 6; seat++) t.reconnect(identity(seat))
    for (let seat = 0; seat < 6; seat++) {
      const view = t.view(identity(seat))
      assert.deepEqual({ ...view, revision: 0 }, { ...before[seat], revision: 0 })
      assert.deepEqual(view.players.map(p => ({ seat: p.seat, stack: p.stack, bet: p.bet, folded: p.folded, action: p.action })), observed[step].data.players)
      assert.equal(view.actor, observed[step].data.actor)
      assert.equal(JSON.stringify(t), '{}', 'checkpoint export must stay explicit, not an enumerable property')
    }
  }
})

test('synthetic lost ACK retry after restart preserves sequence and spends no second wager', () => {
  const original = table(), request = act(original, 3, { type: 'call' })
  const recovered = HostTable.restoreHostCheckpoint(original.exportHostCheckpoint())
  recovered.reconnect(identity(3))
  const before = recovered.view(identity(3))
  assert.equal(recovered.act(identity(3), request).code, 'duplicate')
  assert.equal(recovered.act(identity(3), { ...request, action: { type: 'fold' } }).code, 'sequence-conflict')
  assert.deepEqual(recovered.view(identity(3)), before)
})

test('synthetic queued and leaving identities retain boundary-only ownership after recovery', () => {
  const original = new HostTable({ id: identity(0), name: 'Host' })
  original.join(identity(1), 'Leaving')
  original.start(identity(0), original.view(identity(0)).revision)
  original.leave(identity(1)); original.join(identity(2), 'Waiting')
  const recovered = HostTable.restoreHostCheckpoint(original.exportHostCheckpoint())
  assert.throws(() => recovered.reconnect(identity(1)), /left/)
  recovered.reconnect(identity(2))
  const v = recovered.view(identity(2))
  assert.equal(v.self.waiting, true); assert.equal(v.self.seat, 2)
  assert.equal(v.players[2].cards.kind, 'hidden')
  assert.equal(recovered.join('new', 'New'), 3, 'leaving hand cannot be reassigned')
})

test('synthetic corrupt checkpoint fails closed and exported values cannot mutate the owner', () => {
  const original = table(), before = original.view(identity(0))
  const checkpoint = original.exportHostCheckpoint()
  checkpoint.game.players[0].stack++
  assert.deepEqual(original.view(identity(0)), before)
  const mutations = [
    (c: any) => { c.version = 2 },
    (c: any) => { c.members[1].seat = 0 },
    (c: any) => { c.members[1].id = c.host },
    (c: any) => { c.members[0].leaving = true },
    (c: any) => { c.members[0].active = false },
    (c: any) => { c.members[0].name = '\u202eSpoof' },
    (c: any) => { c.members[1].sequence = 1 },
    (c: any) => { c.members[1].lastRequest = 'not json' },
    (c: any) => { c.game.players[1].stack++ },
    (c: any) => { c.revision = -1 },
    (c: any) => { c.unexpected = 'private-field' },
  ]
  for (const mutate of mutations) {
    const c = original.exportHostCheckpoint(); mutate(c)
    assert.throws(() => HostTable.restoreHostCheckpoint(c), /checkpoint/)
  }
  assert.throws(() => HostTable.restoreHostCheckpoint(null), /checkpoint/)
})
