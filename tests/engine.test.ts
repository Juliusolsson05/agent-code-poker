import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluate, evaluateFive, shuffledDeck } from '../src/engine/cards'
import { PokerGame } from '../src/engine/game'
import { observe, chooseAction, equity } from '../src/engine/bots'

const cards = (text: string) => text.split(' ').map(c => '23456789TJQKA'.indexOf(c[0]) + 'cdhs'.indexOf(c[1]) * 13)
const rng = (seed = 42) => () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
const deck = (prefix: number[]) => [...prefix, ...Array.from({ length: 52 }, (_, i) => i).filter(c => !prefix.includes(c))]
const call = (g: PokerGame) => g.act(g.snapshot().actor!, { type: g.legal().check ? 'check' : 'call' })
function finish(g: PokerGame) {
  for (let n = 0; g.snapshot().phase !== 'complete'; n++) {
    assert.ok(n < 200, 'hand must terminate')
    if (g.snapshot().phase === 'betting') call(g); else g.advance()
  }
}

test('exhaustive five-card classification matches all 2,598,960 combinatorial hands', () => {
  // These published combinatorial counts are an independent oracle, not values
  // calculated by the evaluator under test. In particular they catch wheel,
  // flush/straight overlap, and duplicate-rank classification mistakes.
  const counts = Array(9).fill(0)
  for (let a = 0; a < 48; a++) for (let b = a + 1; b < 49; b++)
    for (let c = b + 1; c < 50; c++) for (let d = c + 1; d < 51; d++)
      for (let e = d + 1; e < 52; e++) counts[evaluateFive([a, b, c, d, e]).category]++
  assert.deepEqual(counts, [1302540, 1098240, 123552, 54912, 10200, 5108, 3744, 624, 40])
})

test('best-seven evaluator handles wheels, two trips, kickers and playing the board', () => {
  assert.equal(evaluate(cards('Ac 2d 3h 4s 5c Kd Qh')).name, 'Straight')
  assert.ok(evaluate(cards('2c 3d 4h 5s 6c')).score > evaluate(cards('Ac 2d 3h 4s 5c')).score)
  assert.equal(evaluate(cards('Ac Ad Ah Kc Kd Kh 2s')).score, evaluate(cards('Ac Ad Ah Kc Kd')).score)
  assert.ok(evaluate(cards('Ac Ad Kh Qs 9c')).score > evaluate(cards('As Ah Kd Qc 8h')).score)
  assert.equal(evaluate(cards('Ts Js Qs Ks As 2c 3d')).score, evaluate(cards('Ts Js Qs Ks As 4c 5d')).score)
  assert.equal(evaluate(cards('Ah Kh Qh Jh 9h 2h 3c')).score, evaluate(cards('Ah Kh Qh Jh 9h')).score)
  assert.throws(() => evaluate(cards('Ac Ac 3h 4s 5c')))
})

test('blind order, big-blind option, and post-flop order are correct', () => {
  const g = new PokerGame(rng()); g.startHand()
  assert.deepEqual([g.snapshot().dealer, g.snapshot().smallBlindSeat, g.snapshot().bigBlindSeat, g.snapshot().actor], [0, 1, 2, 3])
  for (let i = 0; i < 5; i++) call(g)
  assert.equal(g.snapshot().actor, 2); assert.equal(g.legal().check, true); assert.equal(g.legal().raise, true)
  call(g); assert.equal(g.pot, 120); g.advance()
  assert.equal(g.snapshot().actor, 1); assert.equal(g.snapshot().board.length, 3)
})

test('heads-up button posts small blind and acts first only pre-flop', () => {
  const g = new PokerGame(rng(), [200, 200]); g.startHand()
  assert.deepEqual([g.snapshot().dealer, g.snapshot().actor], [0, 0])
  call(g); call(g); g.advance(); assert.equal(g.snapshot().actor, 1)
  finish(g); g.startHand(); assert.equal(g.snapshot().bigBlindSeat, 0); assert.equal(g.snapshot().actor, 1)
})

test('illegal actions are atomic and cannot move chips', () => {
  const g = new PokerGame(rng()); g.startHand(); const original = g.snapshot()
  assert.throws(() => g.act(0, { type: 'call' }))
  assert.throws(() => g.act(3, { type: 'check' }))
  assert.throws(() => g.act(3, { type: 'raise', to: 39 }))
  assert.throws(() => g.act(3, { type: 'raise', to: NaN }))
  assert.throws(() => g.advance())
  assert.deepEqual(g.snapshot(), original)
})

test('short all-in requires a call but does not reopen an earlier caller', () => {
  const g = new PokerGame(rng(), [200, 200, 25]); g.startHand()
  call(g); call(g); g.act(2, { type: 'raise', to: 25 })
  assert.equal(g.snapshot().actor, 0); assert.equal(g.legal().call, 5); assert.equal(g.legal().raise, false)
  call(g); assert.equal(g.legal().raise, false); call(g); finish(g)
})

test('cumulative short all-ins reopen when they reach a full raise', () => {
  const g = new PokerGame(rng(), [200, 30, 40, 200]); g.startHand()
  call(g); call(g); g.act(1, { type: 'raise', to: 30 }); g.act(2, { type: 'raise', to: 40 })
  assert.equal(g.snapshot().actor, 3); assert.equal(g.legal().raise, true); assert.equal(g.legal().min, 60)
  finish(g)
})

test('a full raise establishes the next minimum increment', () => {
  const g = new PokerGame(rng()); g.startHand(); g.act(3, { type: 'raise', to: 75 })
  assert.equal(g.legal().min, 130)
  g.act(4, { type: 'raise', to: 140 }); assert.equal(g.legal().min, 205)
})

test('unmatched all-in excess is returned and each side pot finds its own winner', () => {
  // Seat 0 holds aces, seat 1 kings, seat 2 queens; board never improves them.
  const prefix = cards('Kc Qc Ac Kd Qd Ad 8c 2c 4d 6h 9c 8s Tc Jh')
  const g = new PokerGame(rng(), [50, 100, 200]); g.startHand(deck(prefix))
  g.act(0, { type: 'raise', to: 50 }); g.act(1, { type: 'raise', to: 100 })
  assert.equal(g.legal().raise, false); call(g); finish(g)
  assert.deepEqual(g.snapshot().awards.map(a => [a.amount, a.winners]), [[150, [0]], [100, [1]]])
  assert.deepEqual(g.snapshot().players.map(p => p.stack), [150, 100, 100])
})

test('folded contributions fund pots; unmatched raises return before award', () => {
  const g = new PokerGame(rng(), [200, 200, 200]); g.startHand()
  g.act(0, { type: 'raise', to: 100 }); g.act(1, { type: 'fold' }); g.act(2, { type: 'fold' })
  assert.equal(g.snapshot().phase, 'complete')
  assert.equal(g.snapshot().awards[0].amount, 50)
  assert.deepEqual(g.snapshot().players.map(p => p.stack), [230, 190, 180])
})

test('tied main pot gives its odd chip to the first winner left of the button', () => {
  const prefix = cards('4c 6c 2c 5d 7d 3d 8c Ts Js Qs 9c Ks 9d As')
  const g = new PokerGame(rng(), [101, 101, 101]); g.startHand(deck(prefix))
  g.act(0, { type: 'raise', to: 41 }); call(g); call(g)
  g.advance(); g.act(1, { type: 'check' }); g.act(2, { type: 'fold' }); g.act(0, { type: 'check' }); finish(g)
  assert.deepEqual(g.snapshot().awards[0].winners, [1, 0])
  assert.deepEqual(g.snapshot().awards[0].shares, [62, 61])
})

test('every live state round-trips and corrupt saves do not restore', () => {
  const g = new PokerGame(rng()); g.startHand()
  for (let i = 0; i < 40 && g.snapshot().phase !== 'complete'; i++) {
    assert.deepEqual(PokerGame.restore(JSON.parse(JSON.stringify(g.snapshot()))).snapshot(), g.snapshot())
    if (g.snapshot().phase === 'betting') call(g); else g.advance()
  }
  const valid = g.snapshot()
  assert.deepEqual(PokerGame.restore(valid).snapshot(), valid)
  for (const mutate of [s => { s.players[0].stack++ }, s => { s.deck[0] = s.deck[1] }, s => { s.actor = 99 }, s => { s.board[0] = -1 }]) {
    const bad = structuredClone(valid); mutate(bad); assert.throws(() => PokerGame.restore(bad))
  }
  assert.throws(() => PokerGame.restore(null))
})

test('bots cannot observe private cards or deck and return legal actions', () => {
  const random = rng(); const g = new PokerGame(random); g.startHand()
  const publicView = observe(g.snapshot(), g.legal())
  const altered = g.snapshot(); altered.deck.reverse(); altered.players[0].hole = [50, 51]
  assert.deepEqual(observe(altered, g.legal()), publicView)
  const action = chooseAction(publicView, random); assert.doesNotThrow(() => g.act(g.snapshot().actor!, action))
  assert.equal(equity({ ...publicView, hole: cards('2c 3c'), board: cards('Ts Js Qs Ks As') }, random, 5), 1 / 6)
})

test('seeded randomized legal play conserves every chip through 1000 hands and restores', () => {
  const random = rng(312);
  for (let hand = 0; hand < 1000; hand++) {
    let g = new PokerGame(random, Array.from({ length: 2 + hand % 5 }, () => 1 + Math.floor(random() * 400)))
    g.startHand(shuffledDeck(random))
    for (let step = 0; g.snapshot().phase !== 'complete'; step++) {
      assert.ok(step < 300)
      const s = g.snapshot()
      assert.equal(s.players.reduce((n, p) => n + p.stack + p.committed, 0), s.initialTotal)
      g = PokerGame.restore(s, random)
      if (s.phase !== 'betting') { g.advance(); continue }
      const l = g.legal(); const r = random()
      if (r < .12) g.act(s.actor!, { type: 'fold' })
      else if (r < .38 && l.raise) g.act(s.actor!, { type: 'raise', to: l.min + Math.floor(random() * (l.max - l.min + 1)) })
      else call(g)
    }
    assert.equal(g.snapshot().players.reduce((n, p) => n + p.stack, 0), g.snapshot().initialTotal)
  }
})
