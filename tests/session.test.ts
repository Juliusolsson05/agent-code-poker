import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { gunzipSync } from 'node:zlib'
import { PokerGame, type Action } from '../src/engine/game'
import { HostTable } from '../src/session/HostTable'
import { projectTable } from '../src/session/view'

const raw = gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T05-52-49-020Z.json.gz', import.meta.url)))
const trace = JSON.parse(raw.toString())
const recorded = trace.entries.filter((e: any) => e.kind === 'public-game')
const identities = Array.from({ length: 6 }, (_, seat) => ({ id: `principal-${seat}`, name: `Guest ${seat}` }))
function fullTable() {
  const table = new HostTable(identities[0], { random: () => .43 })
  identities.slice(1).forEach(p => table.join(p.id, p.name))
  table.start(identities[0].id, table.view(identities[0].id).revision)
  return table
}
function act(table: HostTable, seat: number, action: Action) {
  const id = identities[seat].id, view = table.view(id)
  return table.act(id, { sequence: view.self.nextSequence, revision: view.revision, action })
}
const publicFields = (v: ReturnType<HostTable['view']>) => v.players.map(p => ({ seat: p.seat, stack: p.stack, bet: p.bet, folded: p.folded, action: p.action }))

test('retained real public wager sequence preserves balances and actor for every viewer', () => {
  assert.equal(createHash('sha256').update(raw).digest('hex'), '632b8b84142f1ac52791c5af76ffd5fb53bac66a94a515f35e5a034b340f5d42')
  assert.equal(recorded.length, 9)
  const table = fullTable()
  // The calls preceding capture are present in its first state. The injected
  // shuffle is synthetic, not a reconstruction of the unrecorded private deal.
  for (const seat of [3, 4, 5]) assert.equal(act(table, seat, { type: 'call' }).ok, true)
  assert.equal(act(table, 0, { type: 'raise', to: 500 }).ok, true)
  const follow: Action[] = [{ type: 'fold' }, { type: 'fold' }, { type: 'fold' }, { type: 'call' }, { type: 'call' }]
  for (let i = 0; i < recorded.length; i++) {
    if (i > 0 && i <= 5) assert.equal(act(table, i, follow[i - 1]).ok, true)
    if (i === 6) assert.equal(table.tick(table.view(identities[0].id).revision), true)
    if (i > 6) assert.equal(act(table, i - 3, { type: 'check' }).ok, true)
    for (const { id } of identities) {
      const view = table.view(id), actual = recorded[i].data
      assert.deepEqual(publicFields(view), actual.players)
      assert.equal(view.actor, actual.actor); assert.equal(view.phase, actual.phase)
      assert.equal(view.players.reduce((n, p) => n + p.stack + p.committed, 0), 12000)
      assert.equal(view.players[view.self.seat].displaySeat, 0)
      assert.equal(new Set(view.players.map(p => p.displaySeat)).size, 6)
      assert.equal('deck' in view, false); assert.equal('cursor' in view, false)
      assert.equal('pending' in view, false); assert.equal('history' in view, false)
      for (const identity of identities) assert.equal(JSON.stringify(view).includes(identity.id), false, 'principals are not public roster IDs')
      for (const p of view.players) assert.equal(p.cards.kind, p.seat === view.self.seat ? 'visible' : 'hidden')
    }
  }
})

test('synthetic hidden-card changes cannot influence another viewer payload', () => {
  const game = new PokerGame(() => .43); game.startHand()
  const a = game.snapshot(), b = structuredClone(a)
  // Deliberately taint future/private fields independently of engine rules.
  // Whitelist projection must not spread them, even if the engine grows fields.
  b.players[1].hole.reverse(); b.deck.reverse(); b.cursor = 52
  ;(b as any).futureSecret = 'not-for-wire'; (b.players[1] as any).secret = 'private'
  const first = projectTable(a, 0, game.legal(0)), changed = projectTable(b, 0, game.legal(0))
  assert.deepEqual(changed, first)
  assert.notDeepEqual(JSON.stringify(a), JSON.stringify(b), 'negative control: full local snapshots leak changes')
  first.board.push(51); first.players[0].cards.kind === 'visible' && first.players[0].cards.values.push(50)
  assert.deepEqual(game.snapshot(), a, 'viewer cannot mutate authoritative arrays')
})

test('synthetic retries, forged seats and stale packets never repeat or redirect a wager', () => {
  const table = fullTable(), id = identities[3].id, before = table.view(id)
  const request = { sequence: 1, revision: before.revision, action: { type: 'call' } }
  assert.equal(table.act('unknown', request).code, 'unauthorized')
  assert.equal(table.act(identities[4].id, request).code, 'not-your-turn')
  assert.equal(table.act(id, { ...request, seat: 4 }).code, 'invalid')
  assert.equal(table.act(id, { ...request, action: { type: 'raise', to: NaN } }).code, 'invalid')
  assert.equal(table.act(id, { ...request, action: { type: 'raise', to: 21 } }).code, 'illegal')
  assert.deepEqual(table.view(id), before)
  assert.equal(table.act(id, request).ok, true)
  const after = table.view(id)
  assert.equal(table.act(id, request).code, 'duplicate')
  assert.equal(table.act(id, { ...request, action: { type: 'fold' } }).code, 'sequence-conflict')
  assert.deepEqual(table.view(id), after)
  assert.equal(table.act(id, { ...request, sequence: 2 }).code, 'stale')
  assert.equal(table.act(id, { ...request, sequence: 100, revision: after.revision }).code, 'out-of-order')
})

test('synthetic mid-hand admission reserves a bot seat without receiving its old private cards', () => {
  const table = new HostTable(identities[0], { random: () => .43, bot: () => ({ type: 'fold' }) })
  table.start(identities[0].id, table.view(identities[0].id).revision)
  assert.equal(table.join(identities[1].id, identities[1].name), 1)
  let view = table.view(identities[1].id)
  assert.equal(view.self.waiting, true); assert.equal(view.players[1].cards.kind, 'hidden')
  assert.equal(view.players[1].name, 'Juno'); assert.equal(view.players[1].pendingName, identities[1].name)
  assert.equal(act(table, 1, { type: 'call' }).code, 'waiting')
  while (table.view(identities[0].id).phase !== 'complete') {
    const v = table.view(identities[0].id)
    if (v.actor === 0) assert.equal(act(table, 0, { type: v.legal.check ? 'check' : 'call' }).ok, true)
    else assert.equal(table.tick(v.revision), true)
  }
  view = table.view(identities[1].id)
  assert.equal(view.players[1].cards.kind, 'hidden', 'complete is not permission to see an old folded NPC hand')
  table.start(identities[0].id, table.view(identities[0].id).revision)
  view = table.view(identities[1].id)
  assert.equal(view.self.waiting, false); assert.equal(view.players[1].cards.kind, 'visible')
  assert.equal(view.players[1].name, identities[1].name)
  assert.equal(view.players.length, 6)
})

test('synthetic disconnect uses a bot but keeps principal and sequence ownership on reconnect', () => {
  const table = new HostTable(identities[0], { random: () => .43, bot: () => ({ type: 'call' }) })
  for (const p of identities.slice(1, 4)) table.join(p.id, p.name)
  table.start(identities[0].id, table.view(identities[0].id).revision)
  assert.equal(table.tick(table.view(identities[0].id).revision), false, 'connected human owns turn')
  table.disconnect(identities[3].id)
  assert.equal(table.tick(table.view(identities[0].id).revision), true)
  assert.throws(() => table.view(identities[3].id), /disconnected/)
  table.reconnect(identities[3].id)
  assert.equal(table.view(identities[3].id).self.seat, 3)
  assert.equal(table.view(identities[3].id).players[3].bet, 20)
  table.leave(identities[3].id)
  assert.throws(() => table.reconnect(identities[3].id), /left/)
  assert.equal(table.join('replacement', 'Replacement'), 4, 'leaving seat is not reusable during the hand')
})

test('synthetic six-seat capacity, name bounds and no externally mutable state', () => {
  const table = fullTable()
  assert.throws(() => table.join('seventh', 'Guest'), /full/)
  assert.throws(() => new HostTable({ id: 'host', name: ' \n ' }), /name/)
  assert.throws(() => new HostTable({ id: 'host', name: 'a'.repeat(25) }), /name/)
  assert.throws(() => new HostTable({ id: 'host', name: 'a\u202eb' }), /name/)
  assert.throws(() => table.start(identities[1].id, 0), /host/)
  const v = table.view(identities[0].id); v.players[0].stack = 999999; v.self.seat = 5
  assert.equal(table.view(identities[0].id).players[0].stack, 2000)
  assert.deepEqual(JSON.stringify(table), '{}', 'accidental serialization of owner cannot serialize engine or principals')
})

test('synthetic public showdown reveals live hands, never folded cards or an uncontested winner', () => {
  const game = new PokerGame(() => .43); game.startHand(); game.act(3, { type: 'fold' })
  while (game.snapshot().phase !== 'showdown') {
    const s = game.snapshot()
    if (s.phase === 'betting') game.act(s.actor!, { type: game.legal().check ? 'check' : 'call' })
    else game.advance()
  }
  const view = projectTable(game.snapshot(), null, game.legal(null))
  for (const p of view.players) assert.equal(p.cards.kind, p.seat === 3 ? 'hidden' : 'visible')
  game.advance()
  assert.equal(projectTable(game.snapshot(), null, game.legal(null)).players[3].cards.kind, 'hidden')
  const folds = new PokerGame(); folds.startHand()
  while (folds.snapshot().phase !== 'complete') folds.act(folds.snapshot().actor!, { type: 'fold' })
  assert.ok(projectTable(folds.snapshot(), null, folds.legal(null)).players.every(p => p.cards.kind === 'hidden'))
})

test('synthetic completed-hand arrival cannot inherit private cards; leave releases only at the next deal', () => {
  const table = new HostTable(identities[0], { bot: () => ({ type: 'fold' }) })
  table.join(identities[1].id, identities[1].name)
  table.start(identities[0].id, table.view(identities[0].id).revision)
  table.leave(identities[1].id)
  for (let step = 0; step < 20 && table.view(identities[0].id).phase !== 'complete'; step++) {
    const v = table.view(identities[0].id)
    if (v.actor === 0) assert.equal(act(table, 0, { type: 'call' }).ok, true)
    else assert.equal(table.tick(v.revision), true)
  }
  assert.equal(table.view(identities[0].id).phase, 'complete')
  const before = table.view(identities[0].id)
  assert.equal(table.join('late', '  Late   Guest  '), 2)
  const arrival = table.view('late')
  assert.equal(arrival.self.waiting, true)
  assert.ok(arrival.players.every(p => p.cards.kind === 'hidden'))
  assert.equal(arrival.players[2].pendingName, 'Late Guest')
  assert.deepEqual(publicFields(arrival), publicFields(before), 'admission does not mint chips or change ledger')
  table.start(identities[0].id, arrival.revision)
  assert.equal(table.view('late').self.waiting, false)
  assert.equal(table.join('new-member', '<b>plain text</b>'), 1)
  assert.equal(table.view('new-member').self.waiting, true)
  assert.throws(() => table.reconnect(identities[1].id), /Unknown/)
})

test('synthetic stale host tick and failed hand start are atomic across queued ownership', () => {
  const table = fullTable(), before = table.view(identities[0].id)
  assert.throws(() => table.start(identities[0].id, before.revision), /Finish this hand/)
  assert.deepEqual(table.view(identities[0].id), before)
  table.disconnect(identities[3].id)
  const disconnected = table.view(identities[0].id)
  assert.equal(table.tick(before.revision), false)
  assert.deepEqual(table.view(identities[0].id), disconnected)
  table.reconnect(identities[3].id)
  assert.equal(table.tick(disconnected.revision), false, 'a queued bot callback cannot act after human reconnection')
  assert.equal(table.view(identities[3].id).actor, 3)
})

test('synthetic side-pot awards retain authoritative winners under all six display rotations', () => {
  const game = new PokerGame(() => .43, [200, 100, 50, 200, 100, 50]); game.startHand()
  for (let step = 0; step < 40 && game.snapshot().phase !== 'complete'; step++) {
    const s = game.snapshot(), legal = game.legal()
    if (s.phase === 'betting') game.act(s.actor!, legal.raise ? { type: 'raise', to: legal.max } : { type: legal.call ? 'call' : 'check' })
    else game.advance()
  }
  const s = game.snapshot()
  assert.equal(s.phase, 'complete'); assert.ok(s.awards.length > 1)
  for (let seat = 0; seat < 6; seat++) {
    const v = projectTable(s, seat, game.legal(seat))
    assert.deepEqual(v.awards, s.awards)
    assert.deepEqual(v.players.map(p => p.stack), s.players.map(p => p.stack))
    assert.equal(v.players[seat].displaySeat, 0)
    assert.equal(v.dealer, s.dealer)
  }
})

test('session internals stay outside engine, renderer, audio and the shipped solo app', () => {
  const root = new URL('../src/', import.meta.url)
  const files = readdirSync(root, { recursive: true }).filter(f => /\.(ts|tsx)$/.test(String(f))).map(String)
  const projectionUsers = files.filter(f => /from ['"].*\/view['"]/.test(readFileSync(new URL(f, root), 'utf8')) && f.startsWith('session/'))
  assert.deepEqual(projectionUsers, ['session/HostTable.ts'])
  // B11 introduces exactly one public-DTO adapter, never a renderer import of
  // HostTable/engine authority. This replaces the temporary all-import ban as
  // the user-requested real client integration begins; privacy remains tested.
  const adapter = readFileSync(new URL('presentation/RoomProjection.ts', root), 'utf8')
  assert.match(adapter, /import type .* from '..\/session\/view'/)
  assert.doesNotMatch(adapter, /session\/HostTable/)
  for (const file of files.filter(f => !f.startsWith('session/') && f !== 'presentation/RoomProjection.ts')) {
    assert.doesNotMatch(readFileSync(new URL(file, root), 'utf8'), /(?:from\s*|import\s*\()['"][^'"]*session\//, `${file} must not reach into host authority`)
  }
})
