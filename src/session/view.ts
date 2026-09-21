import type { Card } from '../engine/cards'
import type { GameState, Legal, Phase } from '../engine/game'

export type VisibleCards = { kind: 'absent' } | { kind: 'hidden'; count: number } | { kind: 'visible'; values: Card[] }
export type TablePlayer = {
  seat: number; displaySeat: number; stack: number; bet: number; committed: number
  startStack: number; folded: boolean; action: string; cards: VisibleCards
}
export type TableView = {
  protocol: 1; gameRevision: number; handNumber: number; phase: Phase; street: number
  dealer: number; smallBlindSeat: number; bigBlindSeat: number; smallBlind: number; bigBlind: number
  currentBet: number; pot: number; actor: number | null; board: Card[]; legal: Legal
  players: TablePlayer[]
  awards: { amount: number; winners: number[]; shares: number[]; label: string }[]
  results: { seat: number; won: number; hand: { name: string; cards: Card[] } | null }[]
}

/** HostTable is the only runtime consumer. This is an allowlist, NOT an Omit of
 * GameState: future engine fields must default to private. The existing local
 * renderer legitimately knows the entire deck; copying its object onto a wire
 * would disclose everything even if card meshes still showed backs.
 *
 * Stable seat is always the authority; displaySeat is just a view hint. A waiting
 * human may look from their reserved chair, but privateSeat remains null until
 * the next deal. Conflating those two would reveal the replaced bot's old hand.
 * No invented placeholder Card values: hidden/absent/visible are distinct, so a
 * later renderer adapter cannot accidentally turn a sentinel into a real face.
 */
export function projectTable(state: GameState, privateSeat: number | null, legal: Legal, viewSeat = privateSeat ?? 0): TableView {
  const count = state.players.length
  if (count !== 6 || !Number.isInteger(viewSeat) || viewSeat < 0 || viewSeat >= count ||
    privateSeat !== null && (!Number.isInteger(privateSeat) || privateSeat < 0 || privateSeat >= count))
    throw new Error('A LAN view requires six valid seats.')
  const publicShowdown = state.phase === 'showdown' || state.phase === 'complete' && state.results.some(r => r.hand !== null)
  return {
    protocol: 1, gameRevision: state.revision, handNumber: state.handNumber, phase: state.phase, street: state.street,
    dealer: state.dealer, smallBlindSeat: state.smallBlindSeat, bigBlindSeat: state.bigBlindSeat,
    smallBlind: state.smallBlind, bigBlind: state.bigBlind, currentBet: state.currentBet,
    pot: state.players.reduce((total, p) => total + p.committed, 0), actor: state.actor,
    board: [...state.board], legal: { fold: legal.fold, check: legal.check, call: legal.call,
      raise: legal.raise, min: legal.min, max: legal.max, shortOnly: legal.shortOnly },
    players: state.players.map(p => ({
      seat: p.seat, displaySeat: (p.seat - viewSeat + count) % count,
      stack: p.stack, bet: p.bet, committed: p.committed, startStack: p.startStack,
      folded: p.folded, action: p.action,
      cards: p.hole.length === 0 ? { kind: 'absent' } : p.seat === privateSeat || publicShowdown && !p.folded
        ? { kind: 'visible', values: [...p.hole] } : { kind: 'hidden', count: p.hole.length },
    })),
    awards: state.awards.map(a => ({ amount: a.amount, winners: [...a.winners], shares: [...a.shares], label: a.label })),
    results: state.results.map(r => ({ seat: r.seat, won: r.won,
      hand: publicShowdown && !state.players[r.seat].folded && r.hand
        ? { name: r.hand.name, cards: [...r.hand.cards] } : null })),
  }
}
