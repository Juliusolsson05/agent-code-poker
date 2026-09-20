import { chooseAction, observe, type Observation } from '../engine/bots'
import { CHARACTERS, PokerGame, type Action } from '../engine/game'
import { projectTable, type TableView } from './view'

type Identity = { id: string; name: string }
type Member = Identity & {
  seat: number; active: boolean; connected: boolean; leaving: boolean
  sequence: number; lastRequest: string | null
}
type Options = { random?: () => number; bot?: (observation: Observation) => Action }
type Intent = { sequence: number; revision: number; action: Action }
type Code = 'accepted' | 'duplicate' | 'unauthorized' | 'invalid' | 'disconnected' | 'waiting' |
  'sequence-conflict' | 'out-of-order' | 'stale' | 'not-your-turn' | 'illegal'
export type Receipt = { ok: boolean; code: Code; revision: number }
export type SessionView = Omit<TableView, 'players'> & {
  revision: number; self: { seat: number; waiting: boolean; nextSequence: number }
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
  if (a.type === 'raise') {
    if (!keys(a, ['type', 'to']) || !Number.isSafeInteger(a.to) || Number(a.to) < 0 || Number(a.to) > 1_000_000) return null
    return { sequence: Number(value.sequence), revision: Number(value.revision), action: { type: 'raise', to: Number(a.to) } }
  }
  if (!keys(a, ['type']) || a.type !== 'fold' && a.type !== 'check' && a.type !== 'call') return null
  return { sequence: Number(value.sequence), revision: Number(value.revision), action: { type: a.type } }
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

  constructor(host: Identity, options: Options = {}) {
    principal(host.id)
    const name = displayName(host.name)
    // A LAN host must not shuffle with the same predictable stream used for
    // public bot personality. Injection remains for deterministic tests, but the
    // normal host draws deck entropy from Web Crypto, with no weak fallback.
    // Reuse one word: shuffling happens at a hand boundary, never every frame.
    const word = new Uint32Array(1)
    const deckRandom = options.random ?? (() => globalThis.crypto.getRandomValues(word)[0] / 0x1_0000_0000)
    this.#game = new PokerGame(deckRandom)
    this.#bot = options.bot ?? (o => chooseAction(o))
    this.#host = host.id
    this.#members.set(host.id, { id: host.id, name, seat: 0, active: true, connected: true, leaving: false, sequence: 0, lastRequest: null })
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
      if (m.leaving) this.#members.delete(key)
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
    if (!m.active) return reply('waiting')
    const fingerprint = JSON.stringify(parsed)
    // A retry may arrive after everybody else's turn. Check the last accepted
    // sequence before revision/actor so its ACK is repeatable, but never apply
    // it twice. Bounded memory: only the last accepted command is retained;
    // older commands are rejected, never silently executed as new wagers.
    if (parsed.sequence === m.sequence) return reply(fingerprint === m.lastRequest ? 'duplicate' : 'sequence-conflict')
    if (parsed.sequence !== m.sequence + 1) return reply('out-of-order')
    if (parsed.revision !== this.#revision) return reply('stale')
    if (this.#game.snapshot().actor !== m.seat) return reply('not-your-turn')
    try { this.#game.act(m.seat, parsed.action) } catch { return reply('illegal') }
    m.sequence = parsed.sequence; m.lastRequest = fingerprint; this.#revision++
    return reply('accepted')
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

  view(id: string): SessionView {
    const member = this.#member(id)
    if (!member.connected || member.leaving) throw new Error('Principal is disconnected or has left.')
    const state = this.#game.snapshot(), privateSeat = member.active ? member.seat : null
    const view = projectTable(state, privateSeat, this.#game.legal(privateSeat), member.seat)
    return { ...view, revision: this.#revision,
      self: { seat: member.seat, waiting: !member.active, nextSequence: member.sequence + 1 },
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
