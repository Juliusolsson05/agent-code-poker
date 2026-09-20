import { evaluate, shuffledDeck, type Card, type Hand } from './cards'

export const CHARACTERS = [
  { name: 'You', color: '#b8e58b', title: 'The newcomer', style: 'balanced' },
  { name: 'Juno', color: '#e7ab71', title: 'The wild card', style: 'loose' },
  { name: 'Moss', color: '#97bea8', title: 'Quiet confidence', style: 'tight' },
  { name: 'Cleo', color: '#c6a3d9', title: 'Always a read ahead', style: 'balanced' },
  { name: 'Rook', color: '#88b7d8', title: 'Pressure makes diamonds', style: 'aggressive' },
  { name: 'Sol', color: '#e3ce84', title: 'Here for the long game', style: 'steady' },
] as const
export const STREETS = ['Pre-flop', 'Flop', 'Turn', 'River'] as const
export type Phase = 'ready' | 'betting' | 'transition' | 'showdown' | 'complete'
export type Player = {
  seat: number; stack: number; hole: Card[]; folded: boolean
  bet: number; committed: number; startStack: number; action: string
  // null = no action yet; zero = checked before an opening bet. A prior caller
  // only regains a raise when cumulative new action reaches a full raise.
  actedAt: number | null
}
export type Award = { amount: number; winners: number[]; shares: number[]; label: string }
export type Result = { seat: number; hand: Hand | null; won: number }
export type History = { number: number; board: Card[]; summary: string; net: number; log: string[] }
export type GameState = {
  version: 1; revision: number; handNumber: number; phase: Phase; street: number
  dealer: number; smallBlindSeat: number; bigBlindSeat: number
  smallBlind: number; bigBlind: number; initialTotal: number
  players: Player[]; deck: Card[]; cursor: number; board: Card[]
  currentBet: number; lastFullRaise: number; pending: number[]; actor: number | null
  awards: Award[]; results: Result[]; log: string[]; history: History[]
}
export type Action = { type: 'fold' } | { type: 'check' } | { type: 'call' } | { type: 'raise'; to: number }
export type Legal = { fold: boolean; check: boolean; call: number; raise: boolean; min: number; max: number; shortOnly: boolean }
const money = (n: number) => Number.isSafeInteger(n) && n >= 0 && n <= 1_000_000
const copy = <T,>(value: T): T => structuredClone(value)

export class PokerGame {
  private state: GameState
  constructor(private random: () => number = Math.random, stacks: number[] = Array(6).fill(2000)) {
    if (stacks.length < 2 || stacks.length > 6 || stacks.some(s => !money(s)) || stacks.filter(s => s > 0).length < 2)
      throw new Error('A table needs two to six funded seats.')
    this.state = {
      version: 1, revision: 0, handNumber: 0, phase: 'ready', street: 0,
      dealer: -1, smallBlindSeat: -1, bigBlindSeat: -1, smallBlind: 10, bigBlind: 20,
      initialTotal: stacks.reduce((a, b) => a + b, 0),
      players: stacks.map((stack, seat) => ({ seat, stack, hole: [], folded: false, bet: 0, committed: 0, startStack: stack, action: '', actedAt: null })),
      deck: [], cursor: 0, board: [], currentBet: 0, lastFullRaise: 20, pending: [], actor: null,
      awards: [], results: [], log: [], history: [],
    }
  }
  snapshot(): GameState { return copy(this.state) }
  get pot(): number { return this.state.players.reduce((n, p) => n + p.committed, 0) }

  startHand(deck?: Card[]): void {
    const s = this.state
    if (s.phase !== 'ready' && s.phase !== 'complete') throw new Error('Finish this hand first.')
    const funded = s.players.filter(p => p.stack > 0)
    if (funded.length < 2) throw new Error('The table is complete.')
    const nextDeck = deck ? [...deck] : shuffledDeck(this.random)
    if (nextDeck.length !== 52 || new Set(nextDeck).size !== 52 || nextDeck.some(c => !Number.isInteger(c) || c < 0 || c >= 52))
      throw new Error('The deck must contain all 52 unique cards.')
    const previousBB = s.bigBlindSeat
    s.handNumber++; s.street = 0; s.board = []; s.awards = []; s.results = []; s.log = []
    s.deck = nextDeck; s.cursor = 0; s.currentBet = s.bigBlind; s.lastFullRaise = s.bigBlind
    for (const p of s.players) {
      p.hole = []; p.folded = p.stack === 0; p.bet = 0; p.committed = 0
      p.startStack = p.stack; p.action = p.folded ? 'Out' : ''; p.actedAt = null
    }
    s.dealer = this.next(s.dealer, p => p.stack > 0)
    // In heads-up the button posts the small blind and acts first pre-flop.
    // During the transition from 3 seats, the previous BB must not pay it twice.
    if (funded.length === 2 && previousBB >= 0) {
      s.bigBlindSeat = this.next(previousBB, p => p.stack > 0)
      s.dealer = this.next(s.bigBlindSeat, p => p.stack > 0)
    }
    s.smallBlindSeat = funded.length === 2 ? s.dealer : this.next(s.dealer, p => p.stack > 0)
    s.bigBlindSeat = this.next(s.smallBlindSeat, p => p.stack > 0)
    for (let round = 0; round < 2; round++) {
      let seat = s.dealer
      for (let i = 0; i < funded.length; i++) {
        seat = this.next(seat, p => !p.folded)
        s.players[seat].hole.push(this.draw())
      }
    }
    this.pay(s.smallBlindSeat, s.smallBlind, 'Small blind')
    this.pay(s.bigBlindSeat, s.bigBlind, 'Big blind')
    s.phase = 'betting'
    s.pending = this.orderAfter(s.bigBlindSeat).filter(i => this.canAct(s.players[i]))
    this.selectActor()
    this.changed()
  }

  legal(seat = this.state.actor): Legal {
    const s = this.state
    const empty = { fold: false, check: false, call: 0, raise: false, min: 0, max: 0, shortOnly: false }
    if (seat === null || seat !== s.actor || s.phase !== 'betting') return empty
    const p = s.players[seat]
    const owed = Math.max(0, s.currentBet - p.bet)
    const max = p.bet + p.stack
    const min = s.currentBet < s.bigBlind ? s.bigBlind : s.currentBet + s.lastFullRaise
    const reopened = p.actedAt === null || p.actedAt === 0 || s.currentBet - p.actedAt >= s.lastFullRaise
    // Nobody can bet into an empty side pot. A player with chips may still owe a
    // call to an all-in opponent, but cannot raise when every opponent is all-in.
    const opponent = s.players.some(q => q.seat !== seat && this.canAct(q))
    return { fold: true, check: owed === 0, call: Math.min(owed, p.stack),
      raise: reopened && opponent && max > s.currentBet, min: Math.min(min, max), max, shortOnly: max < min }
  }

  act(seat: number, action: Action): void {
    const s = this.state
    if (s.actor !== seat || s.phase !== 'betting') throw new Error('It is not that seat’s turn.')
    const p = s.players[seat]
    const legal = this.legal(seat)
    if (action.type === 'fold') {
      p.folded = true; p.action = 'Fold'
      this.note(`${CHARACTERS[seat].name} folds`)
    } else if (action.type === 'check') {
      if (!legal.check) throw new Error('A bet must be called or folded.')
      p.action = 'Check'; p.actedAt = s.currentBet
      this.note(`${CHARACTERS[seat].name} checks`)
    } else if (action.type === 'call') {
      if (legal.call === 0) throw new Error('There is no bet to call.')
      this.pay(seat, legal.call, 'Call'); p.actedAt = s.currentBet
    } else {
      if (!legal.raise || !money(action.to) || action.to < legal.min || action.to > legal.max)
        throw new Error('That raise is not legal.')
      const increase = action.to - s.currentBet
      const full = increase >= s.lastFullRaise || (s.currentBet < s.bigBlind && action.to >= s.bigBlind)
      const opening = s.currentBet === 0
      this.pay(seat, action.to - p.bet, opening ? 'Bet' : 'Raise')
      s.currentBet = action.to
      if (full) s.lastFullRaise = Math.max(s.bigBlind, increase)
      p.actedAt = s.currentBet
      // A short raise adds everyone who still owes chips without automatically
      // restoring their right to raise. legal() independently tracks that right.
      s.pending = this.orderAfter(seat).filter(i => this.canAct(s.players[i]) && s.players[i].bet < s.currentBet)
    }
    s.pending = s.pending.filter(i => i !== seat && this.canAct(s.players[i]))
    const live = s.players.filter(q => !q.folded && q.hole.length === 2)
    if (live.length === 1) this.settleUncontested(live[0].seat)
    else this.selectActor()
    this.changed()
  }

  /** The controller calls this after a readable pause. Keeping street progression
   * explicit makes the same engine deterministic in tests and resumable on disk. */
  advance(): void {
    const s = this.state
    if (s.phase === 'showdown') { this.settleShowdown(); this.changed(); return }
    if (s.phase !== 'transition') throw new Error('No street transition is pending.')
    if (s.street === 3) { s.phase = 'showdown'; this.changed(); return }
    s.street++
    this.draw() // Burn before each board street; deck/cursor persist together.
    for (let i = 0; i < (s.street === 1 ? 3 : 1); i++) s.board.push(this.draw())
    for (const p of s.players) { p.bet = 0; p.actedAt = null; if (!p.folded) p.action = p.stack === 0 ? 'All-in' : '' }
    s.currentBet = 0; s.lastFullRaise = s.bigBlind
    this.note(STREETS[s.street])
    s.phase = 'betting'
    s.pending = this.orderAfter(s.dealer).filter(i => this.canAct(s.players[i]))
    this.selectActor(); this.changed()
  }

  private selectActor(): void {
    const s = this.state
    const actors = s.players.filter(p => this.canAct(p))
    if (actors.length <= 1) {
      const one = actors[0]
      const othersBet = Math.max(0, ...s.players.filter(p => !p.folded && p.seat !== one?.seat).map(p => p.bet))
      if (!one || one.bet >= othersBet) s.pending = []
    }
    s.actor = s.pending[0] ?? null
    if (s.actor === null) {
      this.returnUncalled()
      s.phase = 'transition'
    }
  }
  private canAct(p: Player): boolean { return !p.folded && p.hole.length === 2 && p.stack > 0 }
  private next(from: number, accepts: (p: Player) => boolean): number {
    for (const i of this.orderAfter(from)) if (accepts(this.state.players[i])) return i
    throw new Error('No eligible seat.')
  }
  private orderAfter(from: number): number[] {
    const n = this.state.players.length
    return Array.from({ length: n }, (_, j) => (from + j + 1 + n) % n)
  }
  private draw(): Card { return this.state.deck[this.state.cursor++] }
  private pay(seat: number, amount: number, label: string): void {
    const p = this.state.players[seat]
    const paid = Math.min(amount, p.stack)
    p.stack -= paid; p.bet += paid; p.committed += paid
    p.action = p.stack === 0 ? `All-in ${p.bet}` : `${label} ${p.bet}`
    this.note(`${CHARACTERS[seat].name} ${p.action.toLowerCase()}`)
  }
  private note(line: string): void { this.state.log = [...this.state.log, line].slice(-60) }
  private returnUncalled(): void {
    const players = [...this.state.players].sort((a, b) => b.bet - a.bet)
    const extra = players[0].bet - players[1].bet
    if (extra > 0 && !players[0].folded) {
      const p = players[0]
      p.bet -= extra; p.committed -= extra; p.stack += extra
      this.note(`${CHARACTERS[p.seat].name} receives ${extra} uncalled chips back`)
    }
  }
  private settleUncontested(winner: number): void {
    this.returnUncalled()
    const amount = this.pot
    this.state.awards = [{ amount, winners: [winner], shares: [amount], label: 'Uncontested pot' }]
    this.state.results = [{ seat: winner, hand: null, won: amount }]
    this.state.players[winner].stack += amount
    this.complete()
  }
  private settleShowdown(): void {
    const s = this.state
    const live = s.players.filter(p => !p.folded && p.hole.length === 2)
    const hands = new Map(live.map(p => [p.seat, evaluate([...p.hole, ...s.board])]))
    s.results = live.map(p => ({ seat: p.seat, hand: hands.get(p.seat)!, won: 0 }))
    s.awards = []
    // Contribution levels define disjoint pots. Folded chips still fund a pot,
    // but only live contributors at that level may win it. Never divide the
    // whole pot before accounting for each player's maximum exposure.
    const levels = [...new Set(s.players.map(p => p.committed).filter(n => n > 0))].sort((a, b) => a - b)
    let previous = 0
    for (const level of levels) {
      const contributors = s.players.filter(p => p.committed >= level)
      const amount = (level - previous) * contributors.length
      previous = level
      const eligible = contributors.filter(p => !p.folded)
      const best = Math.max(...eligible.map(p => hands.get(p.seat)!.score))
      const winnerSet = eligible.filter(p => hands.get(p.seat)!.score === best).map(p => p.seat)
      const winners = this.orderAfter(s.dealer).filter(i => winnerSet.includes(i))
      if (!winners.length) throw new Error('A pot has no eligible winner.')
      // Odd chips go clockwise from the button, independently for every pot.
      const shares = winners.map((_, i) => Math.floor(amount / winners.length) + (i < amount % winners.length ? 1 : 0))
      winners.forEach((seat, i) => {
        s.players[seat].stack += shares[i]
        s.results.find(r => r.seat === seat)!.won += shares[i]
      })
      s.awards.push({ amount, winners, shares, label: s.awards.length ? `Side pot ${s.awards.length}` : 'Main pot' })
    }
    this.complete()
  }
  private complete(): void {
    const s = this.state
    const winners = s.results.filter(r => r.won > 0)
    const summary = winners.map(r => `${CHARACTERS[r.seat].name} +${r.won}${r.hand ? ` · ${r.hand.name}` : ''}`).join(' / ')
    this.note(summary)
    s.history = [{ number: s.handNumber, board: [...s.board], summary,
      net: s.players[0].stack - s.players[0].startStack, log: [...s.log] }, ...s.history].slice(0, 12)
    for (const p of s.players) { p.committed = 0; p.bet = 0 }
    s.phase = 'complete'; s.actor = null; s.pending = []
  }
  private changed(): void {
    const s = this.state
    s.revision++
    if (s.players.some(p => !money(p.stack) || !money(p.committed)) ||
      s.players.reduce((n, p) => n + p.stack + p.committed, 0) !== s.initialTotal)
      throw new Error('Poker chip conservation failed.')
  }

  static restore(value: unknown, random: () => number = Math.random): PokerGame {
    // Persisting an active hand means malformed state cannot be treated as a new
    // bankroll. Reject it visibly; the controller preserves the original bytes
    // and offers an explicit new table. Validate before trusting saved indices.
    const s = copy(value) as GameState
    const fail = () => { throw new Error('The saved table could not be restored. Your saved data has been preserved.') }
    if (!s || s.version !== 1 || !['ready', 'betting', 'transition', 'showdown', 'complete'].includes(s.phase) ||
      !Array.isArray(s.players) || s.players.length < 2 || s.players.length > 6 ||
      !money(s.revision) || !money(s.handNumber) || !money(s.initialTotal) ||
      !Number.isInteger(s.street) || s.street < 0 || s.street > 3 || s.smallBlind !== 10 || s.bigBlind !== 20 ||
      !money(s.currentBet) || !money(s.lastFullRaise) || s.lastFullRaise < 20) fail()
    const card = (c: unknown) => Number.isInteger(c) && Number(c) >= 0 && Number(c) < 52
    for (const [i, p] of s.players.entries()) {
      if (!p || p.seat !== i || !money(p.stack) || !money(p.bet) || !money(p.committed) || p.bet > p.committed ||
        !money(p.startStack) || typeof p.folded !== 'boolean' || typeof p.action !== 'string' || p.action.length > 80 ||
        !(p.actedAt === null || money(p.actedAt)) || !Array.isArray(p.hole) ||
        ![0, 2].includes(p.hole.length) || !p.hole.every(card)) fail()
    }
    if (s.players.reduce((n, p) => n + p.stack + p.committed, 0) !== s.initialTotal ||
      !Array.isArray(s.deck) || ![0, 52].includes(s.deck.length) || !s.deck.every(card) || new Set(s.deck).size !== s.deck.length ||
      !Array.isArray(s.board) || ![0, 3, 4, 5].includes(s.board.length) || !s.board.every(card) ||
      !Number.isInteger(s.cursor) || s.cursor < 0 || s.cursor > 52) fail()
    const dealt = [...s.board, ...s.players.flatMap(p => p.hole)]
    if (new Set(dealt).size !== dealt.length || dealt.some(c => !s.deck.slice(0, s.cursor).includes(c))) fail()
    const seat = (n: unknown) => Number.isInteger(n) && Number(n) >= 0 && Number(n) < s.players.length
    if (![s.dealer, s.smallBlindSeat, s.bigBlindSeat].every(n => s.phase === 'ready' ? n === -1 : seat(n)) ||
      !Array.isArray(s.pending) || new Set(s.pending).size !== s.pending.length || !s.pending.every(seat) ||
      s.pending.some(i => s.players[i].folded || s.players[i].stack === 0 || s.players[i].hole.length !== 2) ||
      (s.phase === 'betting' ? !seat(s.actor) || s.actor !== s.pending[0] : s.actor !== null || s.pending.length !== 0)) fail()
    if (!Array.isArray(s.log) || s.log.length > 60 || s.log.some(l => typeof l !== 'string' || l.length > 300) ||
      !Array.isArray(s.history) || s.history.length > 12 || !Array.isArray(s.results) || !Array.isArray(s.awards)) fail()
    // Display-only history/results are retained only after checking their bounded
    // structure; they must never smuggle values into the active ledger.
    for (const h of s.history) if (!h || !money(h.number) || !Number.isSafeInteger(h.net) || typeof h.summary !== 'string' || h.summary.length > 800 ||
      !Array.isArray(h.board) || h.board.length > 5 || !h.board.every(card) || !Array.isArray(h.log) || h.log.length > 60 || h.log.some(l => typeof l !== 'string' || l.length > 300)) fail()
    for (const a of s.awards) if (!a || !money(a.amount) || typeof a.label !== 'string' || a.label.length > 50 || !Array.isArray(a.winners) || !a.winners.every(seat) ||
      !Array.isArray(a.shares) || a.shares.length !== a.winners.length || !a.shares.every(money)) fail()
    for (const r of s.results) if (!r || !seat(r.seat) || !money(r.won) || (r.hand !== null && (!r.hand || !money(r.hand.score) && !Number.isSafeInteger(r.hand.score) ||
      typeof r.hand.name !== 'string' || r.hand.name.length > 40 || !Array.isArray(r.hand.cards) || r.hand.cards.length !== 5 || !r.hand.cards.every(card)))) fail()
    const game = new PokerGame(random)
    game.state = s
    return game
  }
}
