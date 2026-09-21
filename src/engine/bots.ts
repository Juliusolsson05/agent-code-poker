import { evaluate, type Card } from './cards'
import { CHARACTERS, type Action, type Legal, type GameState } from './game'

export type Observation = {
  seat: number; hole: Card[]; board: Card[]; opponents: number
  pot: number; bigBlind: number; currentBet: number; bet: number; legal: Legal
}

// This is the only boundary between hidden engine state and a bot. The deck,
// burn cards and every opponent's hole cards are deliberately absent. Sampling
// from the remaining 50/47/46/45 cards means a bot cannot know the actual runout.
export function observe(s: GameState, legal: Legal): Observation {
  const seat = s.actor!
  return { seat, hole: [...s.players[seat].hole], board: [...s.board],
    opponents: s.players.filter(p => p.seat !== seat && !p.folded && p.hole.length === 2).length,
    pot: s.players.reduce((n, p) => n + p.committed, 0), bigBlind: s.bigBlind,
    currentBet: s.currentBet, bet: s.players[seat].bet, legal: { ...legal } }
}

export function equity(o: Observation, random: () => number, samples = 56): number {
  const known = new Set([...o.hole, ...o.board])
  const unseen = Array.from({ length: 52 }, (_, i) => i).filter(c => !known.has(c))
  let share = 0
  for (let trial = 0; trial < samples; trial++) {
    const deck = [...unseen]
    const need = 5 - o.board.length + o.opponents * 2
    for (let i = 0; i < need; i++) {
      const j = i + Math.floor(random() * (deck.length - i))
      ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }
    let offset = 5 - o.board.length
    const board = [...o.board, ...deck.slice(0, offset)]
    const ours = evaluate([...o.hole, ...board]).score
    let ties = 1; let beaten = false
    for (let i = 0; i < o.opponents; i++) {
      const theirs = evaluate([deck[offset++], deck[offset++], ...board]).score
      if (theirs > ours) { beaten = true; break }
      if (theirs === ours) ties++
    }
    if (!beaten) share += 1 / ties
  }
  return share / samples
}

export function chooseAction(o: Observation, random: () => number = Math.random): Action {
  const style = CHARACTERS[o.seat].style
  const risk = style === 'loose' ? 0.11 : style === 'tight' ? -0.05 : style === 'aggressive' ? 0.06 : 0
  const strength = equity(o, random) + risk + (random() - 0.5) * 0.10
  const odds = o.legal.call / Math.max(1, o.pot + o.legal.call)
  const bluff = random() < (style === 'aggressive' ? 0.15 : style === 'tight' ? 0.025 : 0.07)
  if (o.legal.raise && (strength > Math.max(0.48, 1 / (o.opponents + 1) + 0.20) || bluff)) {
    const size = Math.round((o.pot + o.legal.call) * (style === 'aggressive' ? 0.8 : 0.55))
    const to = Math.min(o.legal.max, Math.max(o.legal.min, o.currentBet + Math.max(o.bigBlind, size)))
    return { type: 'raise', to }
  }
  if (o.legal.check) return { type: 'check' }
  if (strength >= odds + (style === 'tight' ? 0.08 : 0.015) || o.legal.call <= o.bigBlind && strength > 0.14)
    return { type: 'call' }
  return { type: 'fold' }
}
