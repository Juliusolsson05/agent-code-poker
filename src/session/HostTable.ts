import { chooseAction, observe, type Observation } from '../engine/bots'
import { CHARACTERS, PokerGame, type Action } from '../engine/game'
import { projectTable, type SeatLeisure, type TableView } from './view'
import { GESTURE_SECONDS, isDrinkKind, type DrinkKind } from '../scene/props/specs'
import { createPracticeBank, planBankTransfer, restorePracticeBank, REBUY_CHIPS, type BankState, type BankOperation } from '../bank/PracticeBank'

type Identity = { id: string; name: string }
type Member = Identity & {
  seat: number; active: boolean; connected: boolean; leaving: boolean
  sequence: number; lastRequest: string | null
}
type Options = { random?: () => number; bot?: (observation: Observation) => Action; now?: () => number }
// This is an intentionally private-storage schema, NOT a transport DTO. Only
// the standalone host may persist it. Never spread it into a SessionView.
export type HostCheckpoint = { version: 2; host: string; revision: number; members: Member[]; game: ReturnType<PokerGame['snapshot']>; bank: BankState }
type Intent = { sequence: number; revision: number; action: Action | BankOperation }
type Code = 'accepted' | 'duplicate' | 'unauthorized' | 'invalid' | 'disconnected' | 'waiting' |
  'sequence-conflict' | 'out-of-order' | 'stale' | 'not-your-turn' | 'illegal'
export type Receipt = { ok: boolean; code: Code; revision: number }
type LeisureRequest = { action: 'smoke' } | { action: 'sip' | 'order'; kind: DrinkKind }
type LeisureCode = 'accepted' | 'unauthorized' | 'invalid' | 'disconnected' | 'waiting' | 'paused' | 'busy' | 'rate-limited'
/** Deliberately carries no revision: a leisure receipt must not look like, or
 * be ordered against, a wager acknowledgement. */
export type LeisureReceipt = { ok: boolean; code: LeisureCode }
/** One coherent spacing rule (review of #21): a new smoke/sip is refused
 * ('busy') while the member's previous gesture is still within its AUTHORED
 * length (GESTURE_SECONDS, shared with the hero and the opponent copies).
 * - It never refuses a real gesture: the local player cannot start a second
 *   gesture before the first one ends either, so an honest client's requests
 *   are always at least that far apart. The one exception is a local
 *   interruption (inspection cuts a gesture short); then the next gesture is
 *   simply not shown to others, which is a missing cosmetic, not a phantom.
 * - It keeps every other screen honest: remote copies last exactly as long,
 *   so no remote copy ever has to queue behind the previous one and drift,
 *   and at most one can be waiting for a hand at a time.
 * The old flat 2.5s limit accepted chains that remote bodies could not keep
 * up with (drift, then a newer gesture overwriting an unseen queued one).
 * jitterMs absorbs request timing noise between two back-to-back local
 * starts; the renderer queues that sub-second overlap behind the busy hand.
 * Orders are a glass swap with no gesture, so they keep a plain spacing. The
 * age cap only bounds the projected number. */
export const LEISURE_LIMITS = { jitterMs: 250, orderMs: 1000, maxAgeMs: 60_000 } as const
export const gestureSpacingMs = (action: 'smoke' | 'sip') =>
  (action === 'sip' ? GESTURE_SECONDS.drink : GESTURE_SECONDS.smoke) * 1000 - LEISURE_LIMITS.jitterMs
/** The last ANIMATED gesture and the current drink are separate facts. An
 * order must never overwrite a smoke/sip that a viewer has not polled yet
 * (a latest-only record hid it), so orders only change drinkKind. */
type LeisureRecord = { gesture: { seq: number; action: 'smoke' | 'sip'; at: number } | null; drinkKind: DrinkKind | null; orderedAt: number }
/** Chat is table talk, not poker state: like leisure it never touches
 * PokerGame, the member command sequence, #revision or the checkpoint.
 * - maxChars counts code points after normalisation, so an emoji is one.
 * - burst/refillMs is a per-member token bucket: four quick lines, then one
 *   every 3 s. Six players at that rate is still readable, and one browser
 *   (or a script holding a token) cannot scroll everyone else's log away.
 * - keep bounds memory; project bounds every poll's payload (six viewers poll
 *   twice a second, so the projection must stay small); maxAgeMs drops lines
 *   nobody is still reading. */
export const CHAT_LIMITS = { maxChars: 200, burst: 4, refillMs: 3000, keep: 30, project: 12, maxAgeMs: 600_000 } as const
type ChatCode = 'accepted' | 'unauthorized' | 'invalid' | 'disconnected' | 'rate-limited'
/** Bare receipt, never an envelope (same reason as LeisureReceipt). seq lets
 * the sender attach its own synthesised clip to exactly this line. */
export type ChatReceipt = { ok: boolean; code: ChatCode; seq?: number }
type ChatRecord = { seq: number; memberId: string; seat: number; name: string; text: string; at: number }
/** One projected chat line. Public by construction: the name and text the
 * sender chose, the seat everyone can see, and an age instead of a host
 * timestamp. voice says the host currently holds a relayed clip for seq. */
export type ChatLine = { seq: number; seat: number; displaySeat: number; name: string; text: string; ageMs: number; voice: boolean }
export type SessionView = Omit<TableView, 'players'> & {
  revision: number; chat: ChatLine[]; self: { seat: number; waiting: boolean; nextSequence: number;
    bank: { debt: number; borrowAmount: number; canBorrow: boolean; repayMax: number; reason: string | null } }
  players: (TableView['players'][number] & {
    name: string; kind: 'human' | 'bot'; connected: boolean; pendingName: string | null
  })[]
}

function displayName(value: string): string {
  // Names are labels, not authentication. Preserve plain text (including '<')
  // for a text-rendering client; reject invisible controls and bidi overrides
  // that could disguise identity. Bound before normalization to cap work.
  if (typeof value !== 'string' || value.length > 96 || /[\p{Cc}\p{Cf}]/u.test(value)) throw new Error('Invalid display name.')
  const name = value.normalize('NFC').trim().replace(/\s+/gu, ' ')
  if (!name || [...name].length > 24) throw new Error('Invalid display name.')
  return name
}
/** Plain text only. Control and format characters (\p{Cc}\p{Cf}) are refused,
 * not stripped: bidi overrides and zero-width joiners could make a line look
 * like it came from someone else, and silently editing what a person typed is
 * worse than telling them no. '<' and '&' stay as typed: every renderer uses
 * text nodes, and "escaping" here would only corrupt honest messages. Newlines
 * are Cc too, so a bubble is always one line. Returns null when invalid. */
export function chatText(value: unknown): string | null {
  // Bound the raw input before normalising so a huge string costs nothing.
  if (typeof value !== 'string' || value.length > CHAT_LIMITS.maxChars * 4) return null
  const text = value.normalize('NFC').replace(/[ \u00a0\u2000-\u200a\u202f\u205f\u3000]+/gu, ' ').trim()
  if (!text || /[\p{Cc}\p{Cf}]/u.test(text) || [...text].length > CHAT_LIMITS.maxChars) return null
  return text
}
function principal(value: string): void {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(value)) throw new Error('Invalid principal.')
}
const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype
const keys = (value: Record<string, unknown>, expected: string[]) =>
  Object.keys(value).length === expected.length && expected.every(key => Object.hasOwn(value, key))
function intent(value: unknown): Intent | null {
  if (!record(value) || !keys(value, ['sequence', 'revision', 'action']) ||
    !Number.isSafeInteger(value.sequence) || Number(value.sequence) < 1 ||
    !Number.isSafeInteger(value.revision) || Number(value.revision) < 0 || !record(value.action)) return null
  const a = value.action
  if(a.type==='borrow')return keys(a,['type']) ? {sequence:Number(value.sequence),revision:Number(value.revision),action:{type:'borrow'}} : null
  if(a.type==='repay') {
    if(!keys(a,['type','amount']) || !Number.isSafeInteger(a.amount) || Number(a.amount)<1 || Number(a.amount)>1_000_000)return null
    return {sequence:Number(value.sequence),revision:Number(value.revision),action:{type:'repay',amount:Number(a.amount)}}
  }
  if (a.type === 'raise') {
    if (!keys(a, ['type', 'to']) || !Number.isSafeInteger(a.to) || Number(a.to) < 0 || Number(a.to) > 1_000_000) return null
    return { sequence: Number(value.sequence), revision: Number(value.revision), action: { type: 'raise', to: Number(a.to) } }
  }
  if (!keys(a, ['type']) || a.type !== 'fold' && a.type !== 'check' && a.type !== 'call') return null
  return { sequence: Number(value.sequence), revision: Number(value.revision), action: { type: a.type } }
}
function leisureRequest(value: unknown): LeisureRequest | null {
  // Exact shapes only. In particular there is no seat field to forge: the seat
  // always comes from the authenticated member, exactly as for wagers.
  if (!record(value)) return null
  if (value.action === 'smoke') return keys(value, ['action']) ? { action: 'smoke' } : null
  if ((value.action === 'sip' || value.action === 'order') && keys(value, ['action', 'kind']) && isDrinkKind(value.kind))
    return { action: value.action, kind: value.kind }
  return null
}

/** In-process host authority, not a network server. A future transport resolves
 * an authenticated principal BEFORE invoking this API; client-supplied seat IDs
 * are never accepted. Do not expose tick/start as arbitrary remote methods.
 *
 * Only this owner accesses PokerGame and private projection. No public snapshot,
 * mutable engine reference, or credentials enter a SessionView. JS #fields also
 * make accidental JSON.stringify(owner) empty instead of shipping the deck.
 * The existing solo App stays independent until a real client adapter and LAN
 * transport pass integration gates; never cast a redacted view to GameState.
 */
export class HostTable {
  #game: PokerGame
  #host: string
  #members = new Map<string, Member>()
  #revision = 0
  #bot: (observation: Observation) => Action
  #random: () => number
  #bank: BankState
  #now: () => number
  // Cosmetic and volatile BY DESIGN: not a Member field (members are exported
  // verbatim into the private checkpoint, whose restore demands exact keys) and
  // not part of exportHostCheckpoint. A sip must never cost a disk commit, and a
  // host restart simply forgets who was holding a cigar.
  #leisure = new Map<string, LeisureRecord>()
  // Random 32-bit start, then +1 per gesture. Leisure is volatile, so a host
  // restart restarts the counter; a random start makes a post-restart seq equal
  // to the one a browser saw before the restart (and so skipped as already
  // animated) a 1-in-2^32 event. The earlier clock seed did the same job but
  // published the host's wall clock to every player.
  #leisureSeq = globalThis.crypto.getRandomValues(new Uint32Array(1))[0]
  // Volatile for the same reasons as #leisure. A host restart forgets the
  // conversation; nobody's chips or seat depend on it. Random start for the
  // same reason as #leisureSeq: projected seqs must not publish the host clock,
  // and a restart must not reuse a seq a browser already spoke.
  #chat: ChatRecord[] = []
  #chatSeq = globalThis.crypto.getRandomValues(new Uint32Array(1))[0]
  #chatBuckets = new Map<string, { tokens: number; at: number }>()

  constructor(host: Identity, options: Options = {}) {
    principal(host.id)
    const name = displayName(host.name)
    // A LAN host must not shuffle with the same predictable stream used for
    // public bot personality. Injection remains for deterministic tests, but the
    // normal host draws deck entropy from Web Crypto, with no weak fallback.
    // Reuse one word: shuffling happens at a hand boundary, never every frame.
    const word = new Uint32Array(1)
    const deckRandom = options.random ?? (() => globalThis.crypto.getRandomValues(word)[0] / 0x1_0000_0000)
    this.#random = deckRandom
    this.#game = new PokerGame(deckRandom)
    this.#bank = createPracticeBank(this.#game.snapshot().initialTotal)
    this.#bot = options.bot ?? (o => chooseAction(o))
    this.#now = options.now ?? Date.now
    this.#host = host.id
    this.#members.set(host.id, { id: host.id, name, seat: 0, active: true, connected: true, leaving: false, sequence: 0, lastRequest: null })
  }

  /** Private host disk boundary. Deliberately not toJSON(): accidental owner
   * serialization must remain {}. Copying all three owners together prevents
   * restoring chips without the accepted sequence (which would replay a bet),
   * or restoring a seat without its private-card entitlement. */
  exportHostCheckpoint(): HostCheckpoint {
    return { version: 2, host: this.#host, revision: this.#revision,
      members: [...this.#members.values()].map(m => ({ ...m })), game: this.#game.snapshot(), bank: structuredClone(this.#bank) }
  }

  static restoreHostCheckpoint(value: unknown, options: Options = {}): HostTable {
    const invalid = () => new Error('Invalid host checkpoint. Original saved data has been preserved.')
    try {
      if (!record(value) || !keys(value, value.version===1 ? ['version', 'host', 'revision', 'members', 'game'] : ['version', 'host', 'revision', 'members', 'game','bank']) || value.version!==1 && value.version!==2 ||
        typeof value.host !== 'string' || !Number.isSafeInteger(value.revision) || Number(value.revision) < 0 ||
        Number(value.revision) >= Number.MAX_SAFE_INTEGER - 10 || !Array.isArray(value.members) ||
        value.members.length < 1 || value.members.length > 6) throw invalid()
      principal(value.host)
      const members: Member[] = [], seats = new Set<number>(), ids = new Set<string>()
      for (const m of value.members) {
        if (!record(m) || !keys(m, ['id', 'name', 'seat', 'active', 'connected', 'leaving', 'sequence', 'lastRequest']) ||
          typeof m.id !== 'string' || typeof m.name !== 'string' || displayName(m.name) !== m.name ||
          !Number.isInteger(m.seat) || Number(m.seat) < 0 || Number(m.seat) > 5 ||
          typeof m.active !== 'boolean' || typeof m.connected !== 'boolean' || typeof m.leaving !== 'boolean' ||
          m.leaving && m.connected || !Number.isSafeInteger(m.sequence) || Number(m.sequence) < 0 ||
          Number(m.sequence) > Number(value.revision) || seats.has(Number(m.seat)) || ids.has(m.id)) throw invalid()
        principal(m.id)
        if (m.sequence === 0) { if (m.lastRequest !== null) throw invalid() }
        else {
          if (typeof m.lastRequest !== 'string' || m.lastRequest.length > 256) throw invalid()
          const accepted = intent(JSON.parse(m.lastRequest))
          if (!accepted || JSON.stringify(accepted) !== m.lastRequest || accepted.sequence !== m.sequence ||
            accepted.revision >= Number(value.revision) || value.version===1 &&
              (accepted.action.type==='borrow' || accepted.action.type==='repay')) throw invalid()
        }
        seats.add(Number(m.seat)); ids.add(m.id)
        members.push({ id: m.id, name: m.name, seat: Number(m.seat), active: m.active,
          connected: false, leaving: m.leaving, sequence: Number(m.sequence), lastRequest: m.lastRequest as string | null })
      }
      const host = members.find(m => m.id === value.host)
      if (!host || host.seat !== 0 || !host.active || host.leaving) throw invalid()
      const table = new HostTable(host, options)
      const game = PokerGame.restore(value.game, table.#random), state = game.snapshot()
      if (state.players.length !== 6 || state.revision > Number(value.revision) ||
        state.phase === 'ready' && members.some(m => !m.active)) throw invalid()
      table.#game = game; table.#members = new Map(members.map(m => [m.id, m]))
      // Version1 predated external issuance. Preserve its exact chips as the
      // starting base; never infer a loan from a lost hand. Version2 restores
      // debt/reserve with the same private game and command fingerprint.
      table.#bank = value.version===1 ? createPracticeBank(state.initialTotal) : restorePracticeBank(value.bank,state.initialTotal)
      // Every old socket lease is dead after a process restart. Invalidate
      // queued intents even if no wager occurred, while retaining duplicate
      // ACK fingerprints. Transport separately requires explicit host resume.
      table.#revision = Number(value.revision) + 1
      return table
    } catch { throw invalid() }
  }

  join(id: string, rawName: string): number {
    principal(id); const name = displayName(rawName)
    if (this.#members.has(id)) throw new Error('Principal already joined; reconnect instead.')
    const occupied = new Set([...this.#members.values()].map(m => m.seat))
    const seat = [0, 1, 2, 3, 4, 5].find(s => !occupied.has(s))
    if (seat === undefined) throw new Error('The table is full.')
    // Even 'complete' still contains the previous hand's cards. A newly seated
    // human is pending until start(), not the new owner of that historical hand.
    this.#members.set(id, { id, name, seat, active: this.#game.snapshot().phase === 'ready', connected: true,
      leaving: false, sequence: 0, lastRequest: null })
    this.#revision++; return seat
  }

  disconnect(id: string): void {
    const member = this.#member(id)
    if (member.connected) { member.connected = false; this.#revision++ }
  }
  reconnect(id: string): void {
    const member = this.#member(id)
    if (member.leaving) throw new Error('This principal has left the table.')
    if (!member.connected) { member.connected = true; this.#revision++ }
  }
  leave(id: string): void {
    if (id === this.#host) throw new Error('The host must close the session, not abandon authority.')
    const member = this.#member(id)
    if (member.leaving) return
    // Do not reassign a dealt hand (or its private knowledge) to another human.
    // Bot control is immediate; release of identity and seat is boundary-only.
    member.leaving = true; member.connected = false; this.#revision++
  }

  start(id: string, revision: number): void {
    if (id !== this.#host) throw new Error('Only the host can start a hand.')
    if (!this.#member(id).connected) throw new Error('Host is disconnected.')
    if (revision !== this.#revision) throw new Error('Stale session revision.')
    // Engine validation runs before membership mutation. A rejected start must
    // not release a seat or activate a queued human against the old deal.
    this.#game.startHand()
    for (const [key, m] of this.#members) {
      if (m.leaving) { this.#members.delete(key); this.#leisure.delete(key); this.#chatBuckets.delete(key) }
      else m.active = true
    }
    this.#revision++
  }

  act(id: string, request: unknown): Receipt {
    const reply = (code: Code): Receipt => ({ ok: code === 'accepted' || code === 'duplicate', code, revision: this.#revision })
    const m = this.#members.get(id)
    if (!m || m.leaving) return reply('unauthorized')
    const parsed = intent(request)
    if (!parsed) return reply('invalid')
    if (!m.connected) return reply('disconnected')
    const bankCommand=parsed.action.type==='borrow' || parsed.action.type==='repay'
    if (!m.active && !bankCommand) return reply('waiting')
    const fingerprint = JSON.stringify(parsed)
    // A retry may arrive after everybody else's turn. Check the last accepted
    // sequence before revision/actor so its ACK is repeatable, but never apply
    // it twice. Bounded memory: only the last accepted command is retained;
    // older commands are rejected, never silently executed as new wagers.
    if (parsed.sequence === m.sequence) return reply(fingerprint === m.lastRequest ? 'duplicate' : 'sequence-conflict')
    if (parsed.sequence !== m.sequence + 1) return reply('out-of-order')
    if (parsed.revision !== this.#revision) return reply('stale')
    const state=this.#game.snapshot()
    if(parsed.action.type==='borrow' || parsed.action.type==='repay') {
      try {
        // One synchronous transaction, then the transport commits game, bank
        // and fingerprint before ACK. A queued arrival may fund its busted
        // chair at a completed boundary without acquiring the previous cards.
        // Planning is non-mutating; an engine refusal leaves both ledgers intact.
        const next=planBankTransfer(this.#bank,id,parsed.action,{phase:state.phase,stack:state.players[m.seat].stack,tableTotal:state.initialTotal})
        this.#game.transferBetweenHands(m.seat,next.delta)
        this.#bank=next.bank
      } catch { return reply('illegal') }
    } else {
      if (state.actor !== m.seat) return reply('not-your-turn')
      try { this.#game.act(m.seat, parsed.action) } catch { return reply('illegal') }
    }
    m.sequence = parsed.sequence; m.lastRequest = fingerprint; this.#revision++
    return reply('accepted')
  }

  /** Cosmetic intent: smoke, sip or order a drink. It is intentionally NOT an
   * act() command. act() shares one per-member sequence and the table revision
   * with wagers; consuming either would make every other player's in-flight
   * wager 'stale' (or this player's next one 'out-of-order') because somebody
   * lit a cigar. So this path never touches PokerGame, the bank, Member.sequence
   * or #revision, and a pending wager built before it stays valid.
   *
   * Pause is the transport's state, so the transport passes it in. A queued
   * human (inactive) does not own the seat's body yet: a bot is still playing
   * it, and a gesture there would animate a body the person does not control. */
  leisure(id: string, request: unknown, context: { paused: boolean }): LeisureReceipt {
    const reply = (code: LeisureCode): LeisureReceipt => ({ ok: code === 'accepted', code })
    const m = this.#members.get(id)
    if (!m || m.leaving) return reply('unauthorized')
    const parsed = leisureRequest(request)
    if (!parsed) return reply('invalid')
    if (!m.connected) return reply('disconnected')
    if (!m.active) return reply('waiting')
    if (context.paused) return reply('paused')
    const at = this.#now(), prior = this.#leisure.get(id) ?? { gesture: null, drinkKind: null, orderedAt: -Infinity }
    if (parsed.action === 'order') {
      if (at - prior.orderedAt < LEISURE_LIMITS.orderMs) return reply('rate-limited')
      this.#leisure.set(id, { ...prior, drinkKind: parsed.kind, orderedAt: at })
      return reply('accepted')
    }
    const last = prior.gesture
    if (last && at - last.at < gestureSpacingMs(last.action)) return reply('busy')
    this.#leisure.set(id, { gesture: { seq: ++this.#leisureSeq, action: parsed.action, at },
      drinkKind: parsed.action === 'sip' ? parsed.kind : prior.drinkKind, orderedAt: prior.orderedAt })
    return reply('accepted')
  }

  /** Principal-bound table talk. The seat and name come from the
   * authenticated member at send time (a later leave does not rewrite who
   * said it). Allowed while paused and while queued for the next hand: a
   * pause is exactly when people talk, and a waiting player is at the table. */
  chat(id: string, request: unknown): ChatReceipt {
    const reply = (code: ChatCode, seq?: number): ChatReceipt => ({ ok: code === 'accepted', code, ...(seq === undefined ? {} : { seq }) })
    const m = this.#members.get(id)
    if (!m || m.leaving) return reply('unauthorized')
    // Exact shape: there is no seat, name or timestamp field to forge.
    if (!record(request) || !keys(request, ['text'])) return reply('invalid')
    const text = chatText(request.text)
    if (text === null) return reply('invalid')
    if (!m.connected) return reply('disconnected')
    const at = this.#now(), bucket = this.#chatBuckets.get(id) ?? { tokens: CHAT_LIMITS.burst, at }
    bucket.tokens = Math.min(CHAT_LIMITS.burst, bucket.tokens + Math.max(0, at - bucket.at) / CHAT_LIMITS.refillMs); bucket.at = at
    if (bucket.tokens < 1) { this.#chatBuckets.set(id, bucket); return reply('rate-limited') }
    bucket.tokens -= 1; this.#chatBuckets.set(id, bucket)
    this.#chatSeq += 1
    this.#chat.push({ seq: this.#chatSeq, memberId: id, seat: m.seat, name: m.name, text, at })
    if (this.#chat.length > CHAT_LIMITS.keep) this.#chat.splice(0, this.#chat.length - CHAT_LIMITS.keep)
    return reply('accepted', this.#chatSeq)
  }

  /** The relay's authority check: who sent chat line `seq`, and when. The
   * transport stores a clip only for the line's own sender. */
  chatSender(seq: number): { memberId: string; at: number } | null {
    const line = this.#chat.find(c => c.seq === seq)
    return line ? { memberId: line.memberId, at: line.at } : null
  }

  /** Called by the host scheduler, not a client packet. Timer cancellation alone
   * cannot prevent queued callbacks: revision check makes a late tick harmless.
   * Bots see the existing observe() allowlist, never another player's cards.
   * Pauses/timing and durable saves remain the transport/controller's job. */
  tick(revision: number): boolean {
    if (revision !== this.#revision) return false
    const s = this.#game.snapshot()
    if (s.phase === 'betting' && s.actor !== null) {
      const owner = [...this.#members.values()].find(m => m.seat === s.actor)
      if (owner?.active && owner.connected && !owner.leaving) return false
      this.#game.act(s.actor, this.#bot(observe(s, this.#game.legal())))
    } else if (s.phase === 'transition' || s.phase === 'showdown') this.#game.advance()
    else return false
    this.#revision++; return true
  }

  /** `voiced` is the transport's relay: it knows which lines have a clip and
   * whether voices are on. HostTable only turns that into a boolean per line. */
  view(id: string, options: { voiced?: (seq: number) => boolean } = {}): SessionView {
    const member = this.#member(id)
    if (!member.connected || member.leaving) throw new Error('Principal is disconnected or has left.')
    const state = this.#game.snapshot(), privateSeat = member.active ? member.seat : null
    const at = this.#now()
    const leisure = state.players.map((_, seat): SeatLeisure | null => {
      const occupant = [...this.#members.values()].find(m => m.seat === seat)
      // Same control rule as tick(): a bot plays (and gestures for) a seat
      // whose human is queued, disconnected or leaving.
      if (!occupant?.active || !occupant.connected || occupant.leaving) return null
      const l = this.#leisure.get(occupant.id)
      const g = l?.gesture
      return { seq: g?.seq ?? 0, action: g?.action ?? null, drinkKind: l?.drinkKind ?? null,
        ageMs: g ? Math.min(LEISURE_LIMITS.maxAgeMs, Math.max(0, Math.floor(at - g.at))) : null }
    })
    const view = projectTable(state, privateSeat, this.#game.legal(privateSeat), member.seat, leisure)
    const debt=this.#bank.accounts.find(a=>a.id===id)?.debt??0, stack=state.players[member.seat].stack
    const boundary=state.phase==='ready' || state.phase==='complete'
    let reason: string|null=!boundary ? 'Bank transfers are only available between hands.' : stack!==0 ? 'Rebuys are available when your stack is empty.' : null
    if(!reason)try { planBankTransfer(this.#bank,id,{type:'borrow'},{phase:state.phase,stack,tableTotal:state.initialTotal}) }
    catch(error) { reason=error instanceof Error?error.message:'The practice bank is unavailable.' }
    // Field by field: the private ChatRecord carries the member id, which must
    // never reach another browser (it is the principal behind a bearer token).
    const chat = this.#chat.filter(c => at - c.at <= CHAT_LIMITS.maxAgeMs).slice(-CHAT_LIMITS.project).map((c): ChatLine => ({
      seq: c.seq, seat: c.seat, displaySeat: (c.seat - member.seat + 6) % 6, name: c.name, text: c.text,
      ageMs: Math.max(0, Math.floor(at - c.at)), voice: options.voiced?.(c.seq) ?? false,
    }))
    return { ...view, revision: this.#revision, chat,
      self: { seat: member.seat, waiting: !member.active, nextSequence: member.sequence + 1,
        bank: {debt,borrowAmount:REBUY_CHIPS,canBorrow:!reason,repayMax:boundary?Math.min(stack,debt):0,reason} },
      players: view.players.map(p => {
        const occupant = [...this.#members.values()].find(m => m.seat === p.seat)
        return { ...p, name: occupant?.active ? occupant.name : CHARACTERS[p.seat].name,
          kind: occupant?.active ? 'human' : 'bot', connected: !!occupant?.connected && !occupant.leaving,
          pendingName: occupant && !occupant.active ? occupant.name : null }
      }),
    }
  }
  #member(id: string): Member {
    const m = this.#members.get(id)
    if (!m) throw new Error('Unknown principal.')
    return m
  }
}
