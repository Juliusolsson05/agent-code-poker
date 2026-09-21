import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { PokerGame } from '../src/engine/game'
import { commandForKey, currentDraft, initialDraft, presetAmount, reduceBetting, type BettingContext, type KeyInput } from '../src/interaction/betting/controller'

const context = (game: PokerGame): BettingContext => {
  const s = game.snapshot()
  return { revision: s.revision, blocked: false, pot: game.pot, currentBet: s.currentBet, coarseStep: s.bigBlind, legal: game.legal() }
}
const key = (value: string, extra: Partial<KeyInput> = {}): KeyInput => ({ key: value, repeat: false, shift: false, modified: false, composing: false, target: 'table', ...extra })

test('actual recorded cancel/reopen discards an abandoned all-in without committing chips', () => {
  const trace = JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T09-55-42-159Z.json.gz', import.meta.url))).toString())
  type RecordedInput = KeyInput & BettingContext & { amount: number }
  const inputs: RecordedInput[] = trace.entries.filter((e: { kind: string }) => e.kind === 'betting-input').map((e: { data: RecordedInput }) => e.data)
  assert.deepEqual(inputs.slice(0,7).map(i => i.key), ['b','arrowright','arrowright','4','escape','enter','b'])
  assert.equal(inputs[6].amount, 2000, 'retain the real negative control: the canceled all-in survived')
  // Replay input intent, not the recorded wrong draft amounts. These bounds
  // came from a real hand facing a raise70; the original recording remains
  // unchanged so a future test cannot accidentally bless the bad behavior.
  const first=inputs[0], c: BettingContext={...first,coarseStep:20}
  let draft=initialDraft(c)
  for(const input of inputs.slice(0,7)) {
    const command=commandForKey({...input,composing:false},draft.open)
    if(!command)continue
    const result=reduceBetting(draft,c,command)
    assert.equal(result.intent,undefined,'sizing/cancel/reopen must not spend any chips')
    draft=result.draft
  }
  assert.equal(draft.open,true)
  assert.equal(draft.amount,first.legal.min,'cancel abandons amount as well as closing the tray')
  assert.equal(commandForKey({...inputs[7],composing:false},true),null,'recorded native preset Enter stays native')
})

test('recorded public raise/call sequence supplies realistic engine bounds without claiming recorded keys', () => {
  // Raw browser evidence contains PUBLIC action results, not key events or a
  // deck. Reconstruct public betting with an arbitrary deterministic deck: no
  // assertion here depends on hidden cards. Key choices below are synthetic.
  const trace = JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T05-52-49-020Z.json.gz', import.meta.url))).toString())
  const first = trace.entries.find((e: { kind: string }) => e.kind === 'public-game').data
  assert.equal(first.players[0].action, 'Raise 500')
  const game = new PokerGame(() => .5); game.startHand()
  for (const seat of [3, 4, 5]) { assert.equal(first.players[seat].action, 'Call 20'); game.act(seat, { type: 'call' }) }
  const c = context(game)
  assert.deepEqual([c.legal.min, c.legal.max, c.pot], [40, 2000, 90])
  assert.equal(presetAmount('half', c), 75)
  assert.equal(presetAmount('pot', c), 130)
  let d = reduceBetting(initialDraft(c), c, 'open').draft
  for (let i = 0; i < 23; i++) d = reduceBetting(d, c, { step: 1, coarse: true }).draft
  const result = reduceBetting(d, c, 'confirm')
  assert.deepEqual(result.intent, { type: 'raise', to: 500 })
  game.act(0, result.intent!)
  assert.deepEqual(game.snapshot().players.map(p => [p.stack, p.bet]), first.players.map((p: { stack: number; bet: number }) => [p.stack, p.bet]))
  assert.equal(reduceBetting(result.draft, c, 'confirm').intent, undefined, 'same-revision double submit is latched')
  const canceledAfterSubmit=reduceBetting(result.draft,c,'cancel').draft
  assert.equal(canceledAfterSubmit.submitted,true,'cancel cannot release a pending submission latch')
  assert.equal(reduceBetting(canceledAfterSubmit,c,'call').intent,undefined)
})

test('synthetic keyboard focus, repeat and OS shortcut boundaries do not emit accidental wagers', () => {
  for (const k of ['f', 'c', 'b', 'Enter', '1', 'Escape']) {
    for (const extra of [{ repeat: true }, { modified: true }, { composing: true }, { target: 'editing' as const }])
      assert.equal(commandForKey(key(k, extra), true), null)
  }
  assert.equal(commandForKey(key('Enter', { target: 'control' }), true), null)
  assert.equal(commandForKey(key(' '), true), null, 'native button Space remains native')
  assert.equal(commandForKey(key('r'), true), null, 'camera retains R')
  assert.equal(commandForKey(key('Enter'), false), null, 'Enter never opens/commits an unseen amount')
  assert.deepEqual(commandForKey(key('ArrowRight', { repeat: true, shift: true }), true), { step: 1, coarse: true })
  assert.equal(commandForKey(key('ArrowRight'), false), null)
})

test('synthetic interruptions discard risky drafts and legality remains engine-owned', () => {
  const game = new PokerGame(() => .5); game.startHand()
  const c = context(game)
  const opened = reduceBetting(initialDraft(c), c, 'open').draft
  const all = reduceBetting(opened, c, 'all').draft
  const paused = currentDraft(all, { ...c, blocked: true })
  assert.equal(paused.open, false)
  assert.equal(reduceBetting(paused, c, 'open').draft.amount, c.legal.min, 'resume cannot retain an abandoned all-in')
  assert.equal(reduceBetting(paused, c, 'confirm').intent, undefined)
  assert.equal(currentDraft(all, { ...c, revision: c.revision + 1 }).amount, c.legal.min)
  for (const command of ['confirm', 'call', 'fold', 'open'] as const)
    assert.equal(reduceBetting(all, { ...c, blocked: true }, command).intent, undefined)
  assert.equal(reduceBetting(all, { ...c, legal: { ...c.legal, raise: false } }, 'confirm').intent, undefined)
  assert.equal(reduceBetting(initialDraft(c), c, 'confirm').intent, undefined)
})

test('synthetic ordered key path changes only a draft until deliberate confirmation', () => {
  const game = new PokerGame(() => .5); game.startHand()
  const before = game.snapshot(), c = context(game)
  let d = initialDraft(c)
  for (const input of [key('b'), key('4'), key('Escape'), key('b'), key('1'), key('ArrowRight'), key('ArrowRight', { shift: true }), key('ArrowLeft')]) {
    const cmd = commandForKey(input, d.open)
    assert.ok(cmd)
    const result = reduceBetting(d, c, cmd)
    assert.equal(result.intent, undefined); d = result.draft
  }
  assert.equal(d.amount, 60)
  assert.deepEqual(game.snapshot(), before, 'UI sizing never spends chips')
  const result = reduceBetting(d, c, commandForKey(key('Enter'), d.open)!)
  assert.deepEqual(result.intent, { type: 'raise', to: 60 })
  game.act(before.actor!, result.intent!)
  assert.equal(game.snapshot().players[before.actor!].bet, 60)
})

test('synthetic short all-in, clamp, and call/check cases use supplied legal bounds', () => {
  const game = new PokerGame(() => .5, [2000, 2000, 2000, 35, 2000, 2000]); game.startHand()
  const c = context(game)
  assert.equal(c.legal.shortOnly, true)
  assert.deepEqual([c.legal.min, c.legal.max], [35, 35])
  let d = reduceBetting(initialDraft(c), c, 'open').draft
  for (const p of ['min', 'half', 'pot', 'all'] as const) assert.equal(presetAmount(p, c), 35)
  for (let i = 0; i < 20; i++) d = reduceBetting(d, c, { step: -1, coarse: false }).draft
  assert.equal(d.amount, 35)
  const r = reduceBetting(d, c, 'confirm'); game.act(3, r.intent!)
  assert.equal(game.snapshot().players[3].stack, 0)
  assert.deepEqual(reduceBetting(initialDraft(c), c, 'call').intent, { type: 'call' })
  assert.deepEqual(reduceBetting(initialDraft(c), { ...c, legal: { ...c.legal, check: true, call: 0 } }, 'call').intent, { type: 'check' })
})
