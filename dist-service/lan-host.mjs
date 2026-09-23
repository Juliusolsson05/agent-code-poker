// server/service.ts
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { sep } from "node:path";

// node_modules/agent-code-extension-api/dist/service.js
function defineService(module) {
  return module;
}
var errorText = (error) => String(error?.message ?? error).slice(0, 2e3);
function runService(module) {
  const port = globalThis.process?.parentPort;
  if (!port)
    throw new Error("runService() requires an Agent Code service process (process.parentPort).");
  const handlers = /* @__PURE__ */ new Map();
  let ready = false;
  let stopping = false;
  const context = {
    ready(endpoints) {
      if (ready || stopping)
        return;
      ready = true;
      port.postMessage({ kind: "ready", ...endpoints?.length ? { endpoints } : {} });
    },
    onRequest(name, handler) {
      if (!/^[a-zA-Z][a-zA-Z0-9_.-]{0,63}$/.test(name))
        throw new Error(`Invalid service request name: ${name}`);
      handlers.set(name, handler);
      return { dispose: () => {
        if (handlers.get(name) === handler)
          handlers.delete(name);
      } };
    },
    log: (line) => {
      port.postMessage({ kind: "log", line: String(line).slice(0, 2e3) });
    }
  };
  port.on("message", ({ data }) => {
    const message = data;
    if (!message || typeof message.kind !== "string")
      return;
    if (message.kind === "request" && typeof message.id === "string" && typeof message.name === "string") {
      const { id, name, params } = message;
      void (async () => {
        const handler = handlers.get(name);
        try {
          if (!handler)
            throw new Error(`No service handler registered for ${name}`);
          const value = await handler(params);
          if (!stopping)
            port.postMessage({ kind: "result", id, ok: true, ...value === void 0 ? {} : { value } });
        } catch (error) {
          if (!stopping)
            port.postMessage({ kind: "result", id, ok: false, error: errorText(error) });
        }
      })();
      return;
    }
    if (message.kind === "shutdown" && typeof message.id === "string") {
      const { id } = message;
      stopping = true;
      void (async () => {
        try {
          await module.stop?.();
        } catch {
        }
        port.postMessage({ kind: "stopped", id });
      })();
    }
  });
  void Promise.resolve(module.start(context)).catch((error) => {
    context.log(`service start failed: ${errorText(error)}`);
  });
}

// server/http.ts
import { createServer } from "node:http";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { networkInterfaces } from "node:os";

// src/engine/cards.ts
var rank = (card) => card % 13 + 2;
var suit = (card) => Math.floor(card / 13);
var HAND_NAMES = ["High card", "One pair", "Two pair", "Three of a kind", "Straight", "Flush", "Full house", "Four of a kind", "Straight flush"];
function shuffledDeck(random) {
  const deck = Array.from({ length: 52 }, (_, index) => index);
  for (let i = 51; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
function evaluateFive(cards) {
  if (cards.length !== 5) throw new Error("A five-card hand is required.");
  const ranks = cards.map(rank).sort((a, b) => b - a);
  const counts = /* @__PURE__ */ new Map();
  for (const r of ranks) counts.set(r, (counts.get(r) ?? 0) + 1);
  const groups = [...counts].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
  const flush = cards.every((card) => suit(card) === suit(cards[0]));
  const straight = counts.size === 5 ? ranks[0] - ranks[4] === 4 ? ranks[0] : ranks.join(",") === "14,5,4,3,2" ? 5 : 0 : 0;
  let category = 0;
  let kickers = ranks;
  if (straight && flush) {
    category = 8;
    kickers = [straight];
  } else if (groups[0][1] === 4) {
    category = 7;
    kickers = groups.map((g) => g[0]);
  } else if (groups[0][1] === 3 && groups[1][1] === 2) {
    category = 6;
    kickers = groups.map((g) => g[0]);
  } else if (flush) category = 5;
  else if (straight) {
    category = 4;
    kickers = [straight];
  } else if (groups[0][1] === 3) {
    category = 3;
    kickers = groups.map((g) => g[0]);
  } else if (groups[0][1] === 2 && groups[1][1] === 2) {
    category = 2;
    kickers = groups.map((g) => g[0]);
  } else if (groups[0][1] === 2) {
    category = 1;
    kickers = groups.map((g) => g[0]);
  }
  let score = category;
  for (let i = 0; i < 5; i++) score = score * 15 + (kickers[i] ?? 0);
  return { score, category, name: category === 8 && straight === 14 ? "Royal flush" : HAND_NAMES[category], cards: [...cards] };
}
function evaluate(cards) {
  if (cards.length < 5 || cards.length > 7 || new Set(cards).size !== cards.length || cards.some((c) => !Number.isInteger(c) || c < 0 || c > 51)) throw new Error("Invalid poker cards.");
  let best;
  for (let a = 0; a < cards.length - 4; a++)
    for (let b = a + 1; b < cards.length - 3; b++)
      for (let c = b + 1; c < cards.length - 2; c++)
        for (let d = c + 1; d < cards.length - 1; d++)
          for (let e = d + 1; e < cards.length; e++) {
            const hand = evaluateFive([cards[a], cards[b], cards[c], cards[d], cards[e]]);
            if (!best || hand.score > best.score) best = hand;
          }
  return best;
}

// src/engine/game.ts
var CHARACTERS = [
  { name: "You", color: "#b8e58b", title: "The newcomer", style: "balanced" },
  { name: "Juno", color: "#e7ab71", title: "The wild card", style: "loose" },
  { name: "Moss", color: "#97bea8", title: "Quiet confidence", style: "tight" },
  { name: "Cleo", color: "#c6a3d9", title: "Always a read ahead", style: "balanced" },
  { name: "Rook", color: "#88b7d8", title: "Pressure makes diamonds", style: "aggressive" },
  { name: "Sol", color: "#e3ce84", title: "Here for the long game", style: "steady" }
];
var STREETS = ["Pre-flop", "Flop", "Turn", "River"];
var money = (n) => Number.isSafeInteger(n) && n >= 0 && n <= 1e6;
var copy = (value) => structuredClone(value);
var PokerGame = class _PokerGame {
  constructor(random = Math.random, stacks = Array(6).fill(2e3)) {
    this.random = random;
    if (stacks.length < 2 || stacks.length > 6 || stacks.some((s) => !money(s)) || stacks.filter((s) => s > 0).length < 2)
      throw new Error("A table needs two to six funded seats.");
    this.state = {
      version: 1,
      revision: 0,
      handNumber: 0,
      phase: "ready",
      street: 0,
      dealer: -1,
      smallBlindSeat: -1,
      bigBlindSeat: -1,
      smallBlind: 10,
      bigBlind: 20,
      initialTotal: stacks.reduce((a, b) => a + b, 0),
      players: stacks.map((stack, seat) => ({ seat, stack, hole: [], folded: false, bet: 0, committed: 0, startStack: stack, action: "", actedAt: null })),
      deck: [],
      cursor: 0,
      board: [],
      currentBet: 0,
      lastFullRaise: 20,
      pending: [],
      actor: null,
      awards: [],
      results: [],
      log: [],
      history: []
    };
  }
  state;
  snapshot() {
    return copy(this.state);
  }
  get pot() {
    return this.state.players.reduce((n, p) => n + p.committed, 0);
  }
  /** The table's only external chip boundary. The caller owns the outside
   * reserve and identity/debt transaction; this pure engine owns all stacks.
   * Validate before touching state so a rejected transfer cannot partially
   * mint chips. Within a hand initialTotal is still strictly conserved.
   *
   * Completed results/history/startStack describe the OLD hand. A rebuy is not
   * a poker win and must not rewrite net winnings or side-pot awards. The next
   * startHand establishes new start stacks and deals only to funded players.
   */
  transferBetweenHands(seat, delta) {
    const s = this.state;
    if (s.phase !== "ready" && s.phase !== "complete") throw new Error("Transfer chips only between hands.");
    if (!Number.isInteger(seat) || seat < 0 || seat >= s.players.length || !Number.isSafeInteger(delta) || delta === 0 || !money(s.players[seat].stack + delta) || !money(s.initialTotal + delta) || s.players.some((p) => p.bet !== 0 || p.committed !== 0))
      throw new Error("Invalid table chip transfer.");
    s.players[seat].stack += delta;
    s.initialTotal += delta;
    if (s.phase === "ready") s.players[seat].startStack = s.players[seat].stack;
    this.changed();
  }
  startHand(deck) {
    const s = this.state;
    if (s.phase !== "ready" && s.phase !== "complete") throw new Error("Finish this hand first.");
    const funded = s.players.filter((p) => p.stack > 0);
    if (funded.length < 2) throw new Error("The table is complete.");
    const nextDeck = deck ? [...deck] : shuffledDeck(this.random);
    if (nextDeck.length !== 52 || new Set(nextDeck).size !== 52 || nextDeck.some((c) => !Number.isInteger(c) || c < 0 || c >= 52))
      throw new Error("The deck must contain all 52 unique cards.");
    const previousBB = s.bigBlindSeat;
    s.handNumber++;
    s.street = 0;
    s.board = [];
    s.awards = [];
    s.results = [];
    s.log = [];
    s.deck = nextDeck;
    s.cursor = 0;
    s.currentBet = s.bigBlind;
    s.lastFullRaise = s.bigBlind;
    for (const p of s.players) {
      p.hole = [];
      p.folded = p.stack === 0;
      p.bet = 0;
      p.committed = 0;
      p.startStack = p.stack;
      p.action = p.folded ? "Out" : "";
      p.actedAt = null;
    }
    s.dealer = this.next(s.dealer, (p) => p.stack > 0);
    if (funded.length === 2 && previousBB >= 0) {
      s.bigBlindSeat = this.next(previousBB, (p) => p.stack > 0);
      s.dealer = this.next(s.bigBlindSeat, (p) => p.stack > 0);
    }
    s.smallBlindSeat = funded.length === 2 ? s.dealer : this.next(s.dealer, (p) => p.stack > 0);
    s.bigBlindSeat = this.next(s.smallBlindSeat, (p) => p.stack > 0);
    for (let round = 0; round < 2; round++) {
      let seat = s.dealer;
      for (let i = 0; i < funded.length; i++) {
        seat = this.next(seat, (p) => !p.folded);
        s.players[seat].hole.push(this.draw());
      }
    }
    this.pay(s.smallBlindSeat, s.smallBlind, "Small blind");
    this.pay(s.bigBlindSeat, s.bigBlind, "Big blind");
    s.phase = "betting";
    s.pending = this.orderAfter(s.bigBlindSeat).filter((i) => this.canAct(s.players[i]));
    this.selectActor();
    this.changed();
  }
  legal(seat = this.state.actor) {
    const s = this.state;
    const empty = { fold: false, check: false, call: 0, raise: false, min: 0, max: 0, shortOnly: false };
    if (seat === null || seat !== s.actor || s.phase !== "betting") return empty;
    const p = s.players[seat];
    const owed = Math.max(0, s.currentBet - p.bet);
    const max = p.bet + p.stack;
    const min = s.currentBet < s.bigBlind ? s.bigBlind : s.currentBet + s.lastFullRaise;
    const reopened = p.actedAt === null || p.actedAt === 0 || s.currentBet - p.actedAt >= s.lastFullRaise;
    const opponent = s.players.some((q) => q.seat !== seat && this.canAct(q));
    return {
      fold: true,
      check: owed === 0,
      call: Math.min(owed, p.stack),
      raise: reopened && opponent && max > s.currentBet,
      min: Math.min(min, max),
      max,
      shortOnly: max < min
    };
  }
  act(seat, action) {
    const s = this.state;
    if (s.actor !== seat || s.phase !== "betting") throw new Error("It is not that seat\u2019s turn.");
    const p = s.players[seat];
    const legal = this.legal(seat);
    if (action.type === "fold") {
      p.folded = true;
      p.action = "Fold";
      this.note(`${CHARACTERS[seat].name} folds`);
    } else if (action.type === "check") {
      if (!legal.check) throw new Error("A bet must be called or folded.");
      p.action = "Check";
      p.actedAt = s.currentBet;
      this.note(`${CHARACTERS[seat].name} checks`);
    } else if (action.type === "call") {
      if (legal.call === 0) throw new Error("There is no bet to call.");
      this.pay(seat, legal.call, "Call");
      p.actedAt = s.currentBet;
    } else {
      if (!legal.raise || !money(action.to) || action.to < legal.min || action.to > legal.max)
        throw new Error("That raise is not legal.");
      const increase = action.to - s.currentBet;
      const full = increase >= s.lastFullRaise || s.currentBet < s.bigBlind && action.to >= s.bigBlind;
      const opening = s.currentBet === 0;
      this.pay(seat, action.to - p.bet, opening ? "Bet" : "Raise");
      s.currentBet = action.to;
      if (full) s.lastFullRaise = Math.max(s.bigBlind, increase);
      p.actedAt = s.currentBet;
      s.pending = this.orderAfter(seat).filter((i) => this.canAct(s.players[i]) && s.players[i].bet < s.currentBet);
    }
    s.pending = s.pending.filter((i) => i !== seat && this.canAct(s.players[i]));
    const live = s.players.filter((q) => !q.folded && q.hole.length === 2);
    if (live.length === 1) this.settleUncontested(live[0].seat);
    else this.selectActor();
    this.changed();
  }
  /** The controller calls this after a readable pause. Keeping street progression
   * explicit makes the same engine deterministic in tests and resumable on disk. */
  advance() {
    const s = this.state;
    if (s.phase === "showdown") {
      this.settleShowdown();
      this.changed();
      return;
    }
    if (s.phase !== "transition") throw new Error("No street transition is pending.");
    if (s.street === 3) {
      s.phase = "showdown";
      this.changed();
      return;
    }
    s.street++;
    this.draw();
    for (let i = 0; i < (s.street === 1 ? 3 : 1); i++) s.board.push(this.draw());
    for (const p of s.players) {
      p.bet = 0;
      p.actedAt = null;
      if (!p.folded) p.action = p.stack === 0 ? "All-in" : "";
    }
    s.currentBet = 0;
    s.lastFullRaise = s.bigBlind;
    this.note(STREETS[s.street]);
    s.phase = "betting";
    s.pending = this.orderAfter(s.dealer).filter((i) => this.canAct(s.players[i]));
    this.selectActor();
    this.changed();
  }
  selectActor() {
    const s = this.state;
    const actors = s.players.filter((p) => this.canAct(p));
    if (actors.length <= 1) {
      const one = actors[0];
      const othersBet = Math.max(0, ...s.players.filter((p) => !p.folded && p.seat !== one?.seat).map((p) => p.bet));
      if (!one || one.bet >= othersBet) s.pending = [];
    }
    s.actor = s.pending[0] ?? null;
    if (s.actor === null) {
      this.returnUncalled();
      s.phase = "transition";
    }
  }
  canAct(p) {
    return !p.folded && p.hole.length === 2 && p.stack > 0;
  }
  next(from, accepts) {
    for (const i of this.orderAfter(from)) if (accepts(this.state.players[i])) return i;
    throw new Error("No eligible seat.");
  }
  orderAfter(from) {
    const n = this.state.players.length;
    return Array.from({ length: n }, (_, j) => (from + j + 1 + n) % n);
  }
  draw() {
    return this.state.deck[this.state.cursor++];
  }
  pay(seat, amount, label) {
    const p = this.state.players[seat];
    const paid = Math.min(amount, p.stack);
    p.stack -= paid;
    p.bet += paid;
    p.committed += paid;
    p.action = p.stack === 0 ? `All-in ${p.bet}` : `${label} ${p.bet}`;
    this.note(`${CHARACTERS[seat].name} ${p.action.toLowerCase()}`);
  }
  note(line) {
    this.state.log = [...this.state.log, line].slice(-60);
  }
  returnUncalled() {
    const players = [...this.state.players].sort((a, b) => b.bet - a.bet);
    const extra = players[0].bet - players[1].bet;
    if (extra > 0 && !players[0].folded) {
      const p = players[0];
      p.bet -= extra;
      p.committed -= extra;
      p.stack += extra;
      this.note(`${CHARACTERS[p.seat].name} receives ${extra} uncalled chips back`);
    }
  }
  settleUncontested(winner) {
    this.returnUncalled();
    const amount = this.pot;
    this.state.awards = [{ amount, winners: [winner], shares: [amount], label: "Uncontested pot" }];
    this.state.results = [{ seat: winner, hand: null, won: amount }];
    this.state.players[winner].stack += amount;
    this.complete();
  }
  settleShowdown() {
    const s = this.state;
    const live = s.players.filter((p) => !p.folded && p.hole.length === 2);
    const hands = new Map(live.map((p) => [p.seat, evaluate([...p.hole, ...s.board])]));
    s.results = live.map((p) => ({ seat: p.seat, hand: hands.get(p.seat), won: 0 }));
    s.awards = [];
    const levels = [...new Set(s.players.map((p) => p.committed).filter((n) => n > 0))].sort((a, b) => a - b);
    let previous = 0;
    for (const level of levels) {
      const contributors = s.players.filter((p) => p.committed >= level);
      const amount = (level - previous) * contributors.length;
      previous = level;
      const eligible = contributors.filter((p) => !p.folded);
      const best = Math.max(...eligible.map((p) => hands.get(p.seat).score));
      const winnerSet = eligible.filter((p) => hands.get(p.seat).score === best).map((p) => p.seat);
      const winners = this.orderAfter(s.dealer).filter((i) => winnerSet.includes(i));
      if (!winners.length) throw new Error("A pot has no eligible winner.");
      const shares = winners.map((_, i) => Math.floor(amount / winners.length) + (i < amount % winners.length ? 1 : 0));
      winners.forEach((seat, i) => {
        s.players[seat].stack += shares[i];
        s.results.find((r) => r.seat === seat).won += shares[i];
      });
      s.awards.push({ amount, winners, shares, label: s.awards.length ? `Side pot ${s.awards.length}` : "Main pot" });
    }
    this.complete();
  }
  complete() {
    const s = this.state;
    const winners = s.results.filter((r) => r.won > 0);
    const summary = winners.map((r) => `${CHARACTERS[r.seat].name} +${r.won}${r.hand ? ` \xB7 ${r.hand.name}` : ""}`).join(" / ");
    this.note(summary);
    s.history = [{
      number: s.handNumber,
      board: [...s.board],
      summary,
      net: s.players[0].stack - s.players[0].startStack,
      log: [...s.log]
    }, ...s.history].slice(0, 12);
    for (const p of s.players) {
      p.committed = 0;
      p.bet = 0;
    }
    s.phase = "complete";
    s.actor = null;
    s.pending = [];
  }
  changed() {
    const s = this.state;
    s.revision++;
    if (s.players.some((p) => !money(p.stack) || !money(p.committed)) || s.players.reduce((n, p) => n + p.stack + p.committed, 0) !== s.initialTotal)
      throw new Error("Poker chip conservation failed.");
  }
  static restore(value, random = Math.random) {
    const s = copy(value);
    const fail2 = () => {
      throw new Error("The saved table could not be restored. Your saved data has been preserved.");
    };
    if (!s || s.version !== 1 || !["ready", "betting", "transition", "showdown", "complete"].includes(s.phase) || !Array.isArray(s.players) || s.players.length < 2 || s.players.length > 6 || !money(s.revision) || !money(s.handNumber) || !money(s.initialTotal) || !Number.isInteger(s.street) || s.street < 0 || s.street > 3 || s.smallBlind !== 10 || s.bigBlind !== 20 || !money(s.currentBet) || !money(s.lastFullRaise) || s.lastFullRaise < 20) fail2();
    const card = (c) => Number.isInteger(c) && Number(c) >= 0 && Number(c) < 52;
    for (const [i, p] of s.players.entries()) {
      if (!p || p.seat !== i || !money(p.stack) || !money(p.bet) || !money(p.committed) || p.bet > p.committed || !money(p.startStack) || typeof p.folded !== "boolean" || typeof p.action !== "string" || p.action.length > 80 || !(p.actedAt === null || money(p.actedAt)) || !Array.isArray(p.hole) || ![0, 2].includes(p.hole.length) || !p.hole.every(card)) fail2();
    }
    if (s.players.reduce((n, p) => n + p.stack + p.committed, 0) !== s.initialTotal || !Array.isArray(s.deck) || ![0, 52].includes(s.deck.length) || !s.deck.every(card) || new Set(s.deck).size !== s.deck.length || !Array.isArray(s.board) || ![0, 3, 4, 5].includes(s.board.length) || !s.board.every(card) || !Number.isInteger(s.cursor) || s.cursor < 0 || s.cursor > 52) fail2();
    const dealt = [...s.board, ...s.players.flatMap((p) => p.hole)];
    if (new Set(dealt).size !== dealt.length || dealt.some((c) => !s.deck.slice(0, s.cursor).includes(c))) fail2();
    const seat = (n) => Number.isInteger(n) && Number(n) >= 0 && Number(n) < s.players.length;
    if (![s.dealer, s.smallBlindSeat, s.bigBlindSeat].every((n) => s.phase === "ready" ? n === -1 : seat(n)) || !Array.isArray(s.pending) || new Set(s.pending).size !== s.pending.length || !s.pending.every(seat) || s.pending.some((i) => s.players[i].folded || s.players[i].stack === 0 || s.players[i].hole.length !== 2) || (s.phase === "betting" ? !seat(s.actor) || s.actor !== s.pending[0] : s.actor !== null || s.pending.length !== 0)) fail2();
    if (!Array.isArray(s.log) || s.log.length > 60 || s.log.some((l) => typeof l !== "string" || l.length > 300) || !Array.isArray(s.history) || s.history.length > 12 || !Array.isArray(s.results) || !Array.isArray(s.awards)) fail2();
    for (const h of s.history) if (!h || !money(h.number) || !Number.isSafeInteger(h.net) || typeof h.summary !== "string" || h.summary.length > 800 || !Array.isArray(h.board) || h.board.length > 5 || !h.board.every(card) || !Array.isArray(h.log) || h.log.length > 60 || h.log.some((l) => typeof l !== "string" || l.length > 300)) fail2();
    for (const a of s.awards) if (!a || !money(a.amount) || typeof a.label !== "string" || a.label.length > 50 || !Array.isArray(a.winners) || !a.winners.every(seat) || !Array.isArray(a.shares) || a.shares.length !== a.winners.length || !a.shares.every(money)) fail2();
    for (const r of s.results) if (!r || !seat(r.seat) || !money(r.won) || r.hand !== null && (!r.hand || !money(r.hand.score) && !Number.isSafeInteger(r.hand.score) || typeof r.hand.name !== "string" || r.hand.name.length > 40 || !Array.isArray(r.hand.cards) || r.hand.cards.length !== 5 || !r.hand.cards.every(card))) fail2();
    const game = new _PokerGame(random);
    game.state = s;
    return game;
  }
};

// src/engine/bots.ts
function observe(s, legal) {
  const seat = s.actor;
  return {
    seat,
    hole: [...s.players[seat].hole],
    board: [...s.board],
    opponents: s.players.filter((p) => p.seat !== seat && !p.folded && p.hole.length === 2).length,
    pot: s.players.reduce((n, p) => n + p.committed, 0),
    bigBlind: s.bigBlind,
    currentBet: s.currentBet,
    bet: s.players[seat].bet,
    legal: { ...legal }
  };
}
function equity(o, random, samples = 56) {
  const known = /* @__PURE__ */ new Set([...o.hole, ...o.board]);
  const unseen = Array.from({ length: 52 }, (_, i) => i).filter((c) => !known.has(c));
  let share = 0;
  for (let trial = 0; trial < samples; trial++) {
    const deck = [...unseen];
    const need = 5 - o.board.length + o.opponents * 2;
    for (let i = 0; i < need; i++) {
      const j = i + Math.floor(random() * (deck.length - i));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    let offset = 5 - o.board.length;
    const board = [...o.board, ...deck.slice(0, offset)];
    const ours = evaluate([...o.hole, ...board]).score;
    let ties = 1;
    let beaten = false;
    for (let i = 0; i < o.opponents; i++) {
      const theirs = evaluate([deck[offset++], deck[offset++], ...board]).score;
      if (theirs > ours) {
        beaten = true;
        break;
      }
      if (theirs === ours) ties++;
    }
    if (!beaten) share += 1 / ties;
  }
  return share / samples;
}
function chooseAction(o, random = Math.random) {
  const style = CHARACTERS[o.seat].style;
  const risk = style === "loose" ? 0.11 : style === "tight" ? -0.05 : style === "aggressive" ? 0.06 : 0;
  const strength = equity(o, random) + risk + (random() - 0.5) * 0.1;
  const odds = o.legal.call / Math.max(1, o.pot + o.legal.call);
  const bluff = random() < (style === "aggressive" ? 0.15 : style === "tight" ? 0.025 : 0.07);
  if (o.legal.raise && (strength > Math.max(0.48, 1 / (o.opponents + 1) + 0.2) || bluff)) {
    const size = Math.round((o.pot + o.legal.call) * (style === "aggressive" ? 0.8 : 0.55));
    const to = Math.min(o.legal.max, Math.max(o.legal.min, o.currentBet + Math.max(o.bigBlind, size)));
    return { type: "raise", to };
  }
  if (o.legal.check) return { type: "check" };
  if (strength >= odds + (style === "tight" ? 0.08 : 0.015) || o.legal.call <= o.bigBlind && strength > 0.14)
    return { type: "call" };
  return { type: "fold" };
}

// src/session/view.ts
function projectTable(state, privateSeat, legal, viewSeat = privateSeat ?? 0, leisure = []) {
  const count = state.players.length;
  if (count !== 6 || !Number.isInteger(viewSeat) || viewSeat < 0 || viewSeat >= count || privateSeat !== null && (!Number.isInteger(privateSeat) || privateSeat < 0 || privateSeat >= count))
    throw new Error("A LAN view requires six valid seats.");
  const publicShowdown = state.phase === "showdown" || state.phase === "complete" && state.results.some((r) => r.hand !== null);
  return {
    protocol: 1,
    gameRevision: state.revision,
    handNumber: state.handNumber,
    phase: state.phase,
    street: state.street,
    dealer: state.dealer,
    smallBlindSeat: state.smallBlindSeat,
    bigBlindSeat: state.bigBlindSeat,
    smallBlind: state.smallBlind,
    bigBlind: state.bigBlind,
    currentBet: state.currentBet,
    pot: state.players.reduce((total, p) => total + p.committed, 0),
    actor: state.actor,
    board: [...state.board],
    legal: {
      fold: legal.fold,
      check: legal.check,
      call: legal.call,
      raise: legal.raise,
      min: legal.min,
      max: legal.max,
      shortOnly: legal.shortOnly
    },
    players: state.players.map((p) => ({
      seat: p.seat,
      displaySeat: (p.seat - viewSeat + count) % count,
      stack: p.stack,
      bet: p.bet,
      committed: p.committed,
      startStack: p.startStack,
      folded: p.folded,
      action: p.action,
      cards: p.hole.length === 0 ? { kind: "absent" } : p.seat === privateSeat || publicShowdown && !p.folded ? { kind: "visible", values: [...p.hole] } : { kind: "hidden", count: p.hole.length },
      // Field by field for the same reason as everything above: the owner's
      // private record (rate-limit clocks, member IDs) must never ride along.
      leisure: copyLeisure(leisure[p.seat] ?? null)
    })),
    awards: state.awards.map((a) => ({ amount: a.amount, winners: [...a.winners], shares: [...a.shares], label: a.label })),
    results: state.results.map((r) => ({
      seat: r.seat,
      won: r.won,
      hand: publicShowdown && !state.players[r.seat].folded && r.hand ? { name: r.hand.name, cards: [...r.hand.cards] } : null
    }))
  };
}
var copyLeisure = (l) => l ? { seq: l.seq, action: l.action, ageMs: l.ageMs, drinkKind: l.drinkKind } : null;

// src/scene/props/specs.ts
var DRINKS = {
  "old-fashioned": { label: "Old Fashioned", note: "Whiskey \xB7 orange peel \xB7 clear ice", section: "bar", radius: 0.036, height: 0.088, fill: 0.041, color: "#a65518", alcoholic: true, strength: 1 },
  wine: { label: "Red wine", note: "A small pour in a stemless glass", section: "bar", radius: 0.036, height: 0.1, fill: 0.043, color: "#632533", alcoholic: true, strength: 1 },
  "gin-tonic": { label: "Gin & tonic", note: "Tall and bright \xB7 lime \xB7 ice", section: "bar", radius: 0.036, height: 0.124, fill: 0.094, color: "#cfe0d6", alcoholic: true, strength: 0.8, translucent: true },
  negroni: { label: "Negroni", note: "Bitter red \xB7 orange slice \xB7 one big cube", section: "bar", radius: 0.036, height: 0.088, fill: 0.046, color: "#b0261b", alcoholic: true, strength: 1.2 },
  champagne: { label: "Champagne", note: "A tall flute-style pour \xB7 fine bubbles", section: "bar", radius: 0.036, height: 0.136, fill: 0.112, color: "#e0c774", alcoholic: true, strength: 0.8 },
  beer: { label: "Winter ale", note: "Golden ale \xB7 a soft foam head", section: "bar", radius: 0.036, height: 0.136, fill: 0.108, color: "#ae7928", alcoholic: true, strength: 1 },
  stout: { label: "Stout", note: "Near-black \xB7 a thick tan head", section: "bar", radius: 0.036, height: 0.136, fill: 0.104, color: "#1c120d", alcoholic: true, strength: 0.8 },
  cider: { label: "Cider", note: "Crisp apple \xB7 a thin slice on top", section: "bar", radius: 0.036, height: 0.124, fill: 0.096, color: "#d19a32", alcoholic: true, strength: 0.6 },
  "mulled-wine": { label: "Mulled wine", note: "Spiced red \xB7 orange wheel \xB7 cinnamon", section: "warm", radius: 0.036, height: 0.1, fill: 0.068, color: "#5a1426", alcoholic: true, strength: 0.8 },
  glogg: { label: "Gl\xF6gg", note: "Nordic spiced wine \xB7 raisins \xB7 almonds", section: "warm", radius: 0.036, height: 0.1, fill: 0.066, color: "#3f0c1b", alcoholic: true, strength: 0.9 },
  "hot-toddy": { label: "Hot toddy", note: "Whisky \xB7 honey \xB7 lemon wheel \xB7 cinnamon", section: "warm", radius: 0.036, height: 0.1, fill: 0.07, color: "#c07a24", alcoholic: true, strength: 0.9 },
  "irish-coffee": { label: "Irish coffee", note: "Hot coffee \xB7 whiskey \xB7 a cream collar", section: "warm", radius: 0.036, height: 0.112, fill: 0.078, color: "#2a160c", alcoholic: true, strength: 0.9 },
  eggnog: { label: "Eggnog", note: "Creamy \xB7 a dusting of nutmeg", section: "warm", radius: 0.036, height: 0.1, fill: 0.074, color: "#e8d9a8", alcoholic: true, strength: 0.7 },
  "hot-chocolate": { label: "Hot chocolate", note: "Dark cocoa \xB7 marshmallow cubes", section: "warm", radius: 0.036, height: 0.1, fill: 0.074, color: "#4a2716", alcoholic: false, strength: 0 },
  water: { label: "Water", note: "Still water \xB7 clear ice", section: "soft", radius: 0.036, height: 0.106, fill: 0.07, color: "#8daca8", alcoholic: false, strength: 0, translucent: true },
  "cranberry-spritz": { label: "Cranberry spritz", note: "Alcohol-free \xB7 cranberries \xB7 rosemary \xB7 ice", section: "soft", radius: 0.036, height: 0.124, fill: 0.094, color: "#b3203d", alcoholic: false, strength: 0, translucent: true }
};
var isDrinkKind = (value) => typeof value === "string" && Object.hasOwn(DRINKS, value);
var GESTURE_SECONDS = { drink: 5.35, smoke: 3.6, smokeFromTable: 4.15, consume: 4.1 };

// src/bank/PracticeBank.ts
var BANK_CAPACITY = 1e6;
var REBUY_CHIPS = 2e3;
var MAX_ACCOUNTS = 256;
var integer = (n) => Number.isSafeInteger(n) && Number(n) >= 0 && Number(n) <= BANK_CAPACITY;
var principal = (id) => typeof id === "string" && /^[a-zA-Z0-9_-]{1,128}$/.test(id);
var object = (v) => !!v && typeof v === "object" && !Array.isArray(v);
var keys = (v, expected) => Object.keys(v).length === expected.length && expected.every((k) => Object.hasOwn(v, k));
function createPracticeBank(tableTotal) {
  if (!integer(tableTotal) || tableTotal === 0) throw new Error("Invalid bank starting chips.");
  return { version: 1, base: tableTotal, reserve: BANK_CAPACITY - tableTotal, accounts: [] };
}
function restorePracticeBank(value, tableTotal) {
  const invalid = () => new Error("Invalid bank checkpoint. Saved data has been preserved.");
  if (!object(value) || !keys(value, ["version", "base", "reserve", "accounts"]) || value.version !== 1 || !integer(value.base) || value.base === 0 || !integer(value.reserve) || !integer(tableTotal) || value.reserve + tableTotal !== BANK_CAPACITY || !Array.isArray(value.accounts) || value.accounts.length > MAX_ACCOUNTS) throw invalid();
  const ids = /* @__PURE__ */ new Set(), accounts = [];
  let debt = 0;
  for (const entry of value.accounts) {
    if (!object(entry) || !keys(entry, ["id", "debt"]) || !principal(entry.id) || ids.has(entry.id) || !integer(entry.debt) || entry.debt === 0) throw invalid();
    ids.add(entry.id);
    debt += entry.debt;
    accounts.push({ id: entry.id, debt: entry.debt });
  }
  if (debt !== tableTotal - value.base) throw invalid();
  return { version: 1, base: value.base, reserve: value.reserve, accounts };
}
function planBankTransfer(value, id, operation, context) {
  const bank = restorePracticeBank(value, context.tableTotal);
  if (!principal(id) || !integer(context.stack)) throw new Error("Invalid bank player.");
  if (context.phase !== "ready" && context.phase !== "complete") throw new Error("Bank transfers are only available between hands.");
  const account = bank.accounts.find((a) => a.id === id);
  let delta;
  if (operation.type === "borrow") {
    if (context.stack !== 0) throw new Error("Only a busted player can borrow chips.");
    if (bank.reserve < REBUY_CHIPS) throw new Error("The practice bank reserve cannot fund another rebuy.");
    if (!account && bank.accounts.length >= MAX_ACCOUNTS) throw new Error("The practice bank account limit has been reached for this room.");
    delta = REBUY_CHIPS;
  } else if (operation.type === "repay") {
    if (!integer(operation.amount) || operation.amount === 0 || operation.amount > (account?.debt ?? 0)) throw new Error("Repayment exceeds your bank debt.");
    if (operation.amount > context.stack) throw new Error("Repayment exceeds your available chips.");
    delta = -operation.amount;
  } else throw new Error("Invalid bank operation.");
  const debt = (account?.debt ?? 0) + delta;
  bank.accounts = bank.accounts.filter((a) => a.id !== id);
  if (debt > 0) bank.accounts.push({ id, debt });
  bank.reserve -= delta;
  return { bank: restorePracticeBank(bank, context.tableTotal + delta), delta };
}

// src/session/HostTable.ts
var LEISURE_LIMITS = { jitterMs: 250, orderMs: 1e3, maxAgeMs: 6e4 };
var gestureSpacingMs = (action) => (action === "sip" ? GESTURE_SECONDS.drink : GESTURE_SECONDS.smoke) * 1e3 - LEISURE_LIMITS.jitterMs;
function displayName(value) {
  if (typeof value !== "string" || value.length > 96 || /[\p{Cc}\p{Cf}]/u.test(value)) throw new Error("Invalid display name.");
  const name = value.normalize("NFC").trim().replace(/\s+/gu, " ");
  if (!name || [...name].length > 24) throw new Error("Invalid display name.");
  return name;
}
function principal2(value) {
  if (typeof value !== "string" || !/^[a-zA-Z0-9_-]{1,128}$/.test(value)) throw new Error("Invalid principal.");
}
var record = (value) => !!value && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
var keys2 = (value, expected) => Object.keys(value).length === expected.length && expected.every((key) => Object.hasOwn(value, key));
function intent(value) {
  if (!record(value) || !keys2(value, ["sequence", "revision", "action"]) || !Number.isSafeInteger(value.sequence) || Number(value.sequence) < 1 || !Number.isSafeInteger(value.revision) || Number(value.revision) < 0 || !record(value.action)) return null;
  const a = value.action;
  if (a.type === "borrow") return keys2(a, ["type"]) ? { sequence: Number(value.sequence), revision: Number(value.revision), action: { type: "borrow" } } : null;
  if (a.type === "repay") {
    if (!keys2(a, ["type", "amount"]) || !Number.isSafeInteger(a.amount) || Number(a.amount) < 1 || Number(a.amount) > 1e6) return null;
    return { sequence: Number(value.sequence), revision: Number(value.revision), action: { type: "repay", amount: Number(a.amount) } };
  }
  if (a.type === "raise") {
    if (!keys2(a, ["type", "to"]) || !Number.isSafeInteger(a.to) || Number(a.to) < 0 || Number(a.to) > 1e6) return null;
    return { sequence: Number(value.sequence), revision: Number(value.revision), action: { type: "raise", to: Number(a.to) } };
  }
  if (!keys2(a, ["type"]) || a.type !== "fold" && a.type !== "check" && a.type !== "call") return null;
  return { sequence: Number(value.sequence), revision: Number(value.revision), action: { type: a.type } };
}
function leisureRequest(value) {
  if (!record(value)) return null;
  if (value.action === "smoke") return keys2(value, ["action"]) ? { action: "smoke" } : null;
  if ((value.action === "sip" || value.action === "order") && keys2(value, ["action", "kind"]) && isDrinkKind(value.kind))
    return { action: value.action, kind: value.kind };
  return null;
}
var HostTable = class _HostTable {
  #game;
  #host;
  #members = /* @__PURE__ */ new Map();
  #revision = 0;
  #bot;
  #random;
  #bank;
  #now;
  // Cosmetic and volatile BY DESIGN: not a Member field (members are exported
  // verbatim into the private checkpoint, whose restore demands exact keys) and
  // not part of exportHostCheckpoint. A sip must never cost a disk commit, and a
  // host restart simply forgets who was holding a cigar.
  #leisure = /* @__PURE__ */ new Map();
  // Random 32-bit start, then +1 per gesture. Leisure is volatile, so a host
  // restart restarts the counter; a random start makes a post-restart seq equal
  // to the one a browser saw before the restart (and so skipped as already
  // animated) a 1-in-2^32 event. The earlier clock seed did the same job but
  // published the host's wall clock to every player.
  #leisureSeq = globalThis.crypto.getRandomValues(new Uint32Array(1))[0];
  constructor(host2, options = {}) {
    principal2(host2.id);
    const name = displayName(host2.name);
    const word = new Uint32Array(1);
    const deckRandom = options.random ?? (() => globalThis.crypto.getRandomValues(word)[0] / 4294967296);
    this.#random = deckRandom;
    this.#game = new PokerGame(deckRandom);
    this.#bank = createPracticeBank(this.#game.snapshot().initialTotal);
    this.#bot = options.bot ?? ((o) => chooseAction(o));
    this.#now = options.now ?? Date.now;
    this.#host = host2.id;
    this.#members.set(host2.id, { id: host2.id, name, seat: 0, active: true, connected: true, leaving: false, sequence: 0, lastRequest: null });
  }
  /** Private host disk boundary. Deliberately not toJSON(): accidental owner
   * serialization must remain {}. Copying all three owners together prevents
   * restoring chips without the accepted sequence (which would replay a bet),
   * or restoring a seat without its private-card entitlement. */
  exportHostCheckpoint() {
    return {
      version: 2,
      host: this.#host,
      revision: this.#revision,
      members: [...this.#members.values()].map((m) => ({ ...m })),
      game: this.#game.snapshot(),
      bank: structuredClone(this.#bank)
    };
  }
  static restoreHostCheckpoint(value, options = {}) {
    const invalid = () => new Error("Invalid host checkpoint. Original saved data has been preserved.");
    try {
      if (!record(value) || !keys2(value, value.version === 1 ? ["version", "host", "revision", "members", "game"] : ["version", "host", "revision", "members", "game", "bank"]) || value.version !== 1 && value.version !== 2 || typeof value.host !== "string" || !Number.isSafeInteger(value.revision) || Number(value.revision) < 0 || Number(value.revision) >= Number.MAX_SAFE_INTEGER - 10 || !Array.isArray(value.members) || value.members.length < 1 || value.members.length > 6) throw invalid();
      principal2(value.host);
      const members = [], seats = /* @__PURE__ */ new Set(), ids = /* @__PURE__ */ new Set();
      for (const m of value.members) {
        if (!record(m) || !keys2(m, ["id", "name", "seat", "active", "connected", "leaving", "sequence", "lastRequest"]) || typeof m.id !== "string" || typeof m.name !== "string" || displayName(m.name) !== m.name || !Number.isInteger(m.seat) || Number(m.seat) < 0 || Number(m.seat) > 5 || typeof m.active !== "boolean" || typeof m.connected !== "boolean" || typeof m.leaving !== "boolean" || m.leaving && m.connected || !Number.isSafeInteger(m.sequence) || Number(m.sequence) < 0 || Number(m.sequence) > Number(value.revision) || seats.has(Number(m.seat)) || ids.has(m.id)) throw invalid();
        principal2(m.id);
        if (m.sequence === 0) {
          if (m.lastRequest !== null) throw invalid();
        } else {
          if (typeof m.lastRequest !== "string" || m.lastRequest.length > 256) throw invalid();
          const accepted = intent(JSON.parse(m.lastRequest));
          if (!accepted || JSON.stringify(accepted) !== m.lastRequest || accepted.sequence !== m.sequence || accepted.revision >= Number(value.revision) || value.version === 1 && (accepted.action.type === "borrow" || accepted.action.type === "repay")) throw invalid();
        }
        seats.add(Number(m.seat));
        ids.add(m.id);
        members.push({
          id: m.id,
          name: m.name,
          seat: Number(m.seat),
          active: m.active,
          connected: false,
          leaving: m.leaving,
          sequence: Number(m.sequence),
          lastRequest: m.lastRequest
        });
      }
      const host2 = members.find((m) => m.id === value.host);
      if (!host2 || host2.seat !== 0 || !host2.active || host2.leaving) throw invalid();
      const table = new _HostTable(host2, options);
      const game = PokerGame.restore(value.game, table.#random), state = game.snapshot();
      if (state.players.length !== 6 || state.revision > Number(value.revision) || state.phase === "ready" && members.some((m) => !m.active)) throw invalid();
      table.#game = game;
      table.#members = new Map(members.map((m) => [m.id, m]));
      table.#bank = value.version === 1 ? createPracticeBank(state.initialTotal) : restorePracticeBank(value.bank, state.initialTotal);
      table.#revision = Number(value.revision) + 1;
      return table;
    } catch {
      throw invalid();
    }
  }
  join(id, rawName) {
    principal2(id);
    const name = displayName(rawName);
    if (this.#members.has(id)) throw new Error("Principal already joined; reconnect instead.");
    const occupied = new Set([...this.#members.values()].map((m) => m.seat));
    const seat = [0, 1, 2, 3, 4, 5].find((s) => !occupied.has(s));
    if (seat === void 0) throw new Error("The table is full.");
    this.#members.set(id, {
      id,
      name,
      seat,
      active: this.#game.snapshot().phase === "ready",
      connected: true,
      leaving: false,
      sequence: 0,
      lastRequest: null
    });
    this.#revision++;
    return seat;
  }
  disconnect(id) {
    const member = this.#member(id);
    if (member.connected) {
      member.connected = false;
      this.#revision++;
    }
  }
  reconnect(id) {
    const member = this.#member(id);
    if (member.leaving) throw new Error("This principal has left the table.");
    if (!member.connected) {
      member.connected = true;
      this.#revision++;
    }
  }
  leave(id) {
    if (id === this.#host) throw new Error("The host must close the session, not abandon authority.");
    const member = this.#member(id);
    if (member.leaving) return;
    member.leaving = true;
    member.connected = false;
    this.#revision++;
  }
  start(id, revision) {
    if (id !== this.#host) throw new Error("Only the host can start a hand.");
    if (!this.#member(id).connected) throw new Error("Host is disconnected.");
    if (revision !== this.#revision) throw new Error("Stale session revision.");
    this.#game.startHand();
    for (const [key, m] of this.#members) {
      if (m.leaving) {
        this.#members.delete(key);
        this.#leisure.delete(key);
      } else m.active = true;
    }
    this.#revision++;
  }
  act(id, request) {
    const reply = (code) => ({ ok: code === "accepted" || code === "duplicate", code, revision: this.#revision });
    const m = this.#members.get(id);
    if (!m || m.leaving) return reply("unauthorized");
    const parsed = intent(request);
    if (!parsed) return reply("invalid");
    if (!m.connected) return reply("disconnected");
    const bankCommand = parsed.action.type === "borrow" || parsed.action.type === "repay";
    if (!m.active && !bankCommand) return reply("waiting");
    const fingerprint = JSON.stringify(parsed);
    if (parsed.sequence === m.sequence) return reply(fingerprint === m.lastRequest ? "duplicate" : "sequence-conflict");
    if (parsed.sequence !== m.sequence + 1) return reply("out-of-order");
    if (parsed.revision !== this.#revision) return reply("stale");
    const state = this.#game.snapshot();
    if (parsed.action.type === "borrow" || parsed.action.type === "repay") {
      try {
        const next = planBankTransfer(this.#bank, id, parsed.action, { phase: state.phase, stack: state.players[m.seat].stack, tableTotal: state.initialTotal });
        this.#game.transferBetweenHands(m.seat, next.delta);
        this.#bank = next.bank;
      } catch {
        return reply("illegal");
      }
    } else {
      if (state.actor !== m.seat) return reply("not-your-turn");
      try {
        this.#game.act(m.seat, parsed.action);
      } catch {
        return reply("illegal");
      }
    }
    m.sequence = parsed.sequence;
    m.lastRequest = fingerprint;
    this.#revision++;
    return reply("accepted");
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
  leisure(id, request, context) {
    const reply = (code) => ({ ok: code === "accepted", code });
    const m = this.#members.get(id);
    if (!m || m.leaving) return reply("unauthorized");
    const parsed = leisureRequest(request);
    if (!parsed) return reply("invalid");
    if (!m.connected) return reply("disconnected");
    if (!m.active) return reply("waiting");
    if (context.paused) return reply("paused");
    const at = this.#now(), prior = this.#leisure.get(id) ?? { gesture: null, drinkKind: null, orderedAt: -Infinity };
    if (parsed.action === "order") {
      if (at - prior.orderedAt < LEISURE_LIMITS.orderMs) return reply("rate-limited");
      this.#leisure.set(id, { ...prior, drinkKind: parsed.kind, orderedAt: at });
      return reply("accepted");
    }
    const last = prior.gesture;
    if (last && at - last.at < gestureSpacingMs(last.action)) return reply("busy");
    this.#leisure.set(id, {
      gesture: { seq: ++this.#leisureSeq, action: parsed.action, at },
      drinkKind: parsed.action === "sip" ? parsed.kind : prior.drinkKind,
      orderedAt: prior.orderedAt
    });
    return reply("accepted");
  }
  /** Called by the host scheduler, not a client packet. Timer cancellation alone
   * cannot prevent queued callbacks: revision check makes a late tick harmless.
   * Bots see the existing observe() allowlist, never another player's cards.
   * Pauses/timing and durable saves remain the transport/controller's job. */
  tick(revision) {
    if (revision !== this.#revision) return false;
    const s = this.#game.snapshot();
    if (s.phase === "betting" && s.actor !== null) {
      const owner = [...this.#members.values()].find((m) => m.seat === s.actor);
      if (owner?.active && owner.connected && !owner.leaving) return false;
      this.#game.act(s.actor, this.#bot(observe(s, this.#game.legal())));
    } else if (s.phase === "transition" || s.phase === "showdown") this.#game.advance();
    else return false;
    this.#revision++;
    return true;
  }
  view(id) {
    const member = this.#member(id);
    if (!member.connected || member.leaving) throw new Error("Principal is disconnected or has left.");
    const state = this.#game.snapshot(), privateSeat = member.active ? member.seat : null;
    const at = this.#now();
    const leisure = state.players.map((_, seat) => {
      const occupant = [...this.#members.values()].find((m) => m.seat === seat);
      if (!occupant?.active || !occupant.connected || occupant.leaving) return null;
      const l = this.#leisure.get(occupant.id);
      const g = l?.gesture;
      return {
        seq: g?.seq ?? 0,
        action: g?.action ?? null,
        drinkKind: l?.drinkKind ?? null,
        ageMs: g ? Math.min(LEISURE_LIMITS.maxAgeMs, Math.max(0, Math.floor(at - g.at))) : null
      };
    });
    const view = projectTable(state, privateSeat, this.#game.legal(privateSeat), member.seat, leisure);
    const debt = this.#bank.accounts.find((a) => a.id === id)?.debt ?? 0, stack = state.players[member.seat].stack;
    const boundary = state.phase === "ready" || state.phase === "complete";
    let reason = !boundary ? "Bank transfers are only available between hands." : stack !== 0 ? "Rebuys are available when your stack is empty." : null;
    if (!reason) try {
      planBankTransfer(this.#bank, id, { type: "borrow" }, { phase: state.phase, stack, tableTotal: state.initialTotal });
    } catch (error) {
      reason = error instanceof Error ? error.message : "The practice bank is unavailable.";
    }
    return {
      ...view,
      revision: this.#revision,
      self: {
        seat: member.seat,
        waiting: !member.active,
        nextSequence: member.sequence + 1,
        bank: { debt, borrowAmount: REBUY_CHIPS, canBorrow: !reason, repayMax: boundary ? Math.min(stack, debt) : 0, reason }
      },
      players: view.players.map((p) => {
        const occupant = [...this.#members.values()].find((m) => m.seat === p.seat);
        return {
          ...p,
          name: occupant?.active ? occupant.name : CHARACTERS[p.seat].name,
          kind: occupant?.active ? "human" : "bot",
          connected: !!occupant?.connected && !occupant.leaving,
          pendingName: occupant && !occupant.active ? occupant.name : null
        };
      })
    };
  }
  #member(id) {
    const m = this.#members.get(id);
    if (!m) throw new Error("Unknown principal.");
    return m;
  }
};

// server/persistence/CheckpointStore.ts
import { closeSync, constants, fchmodSync, fsyncSync, fstatSync, lstatSync, mkdirSync, openSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
var LIMIT = 256 * 1024;
var absent = (error) => error.code === "ENOENT";
var CheckpointStore = class {
  #directory;
  #lock;
  #closed = false;
  #failed = false;
  constructor(directory) {
    this.#directory = directory;
    mkdirSync(directory, { recursive: true, mode: 448 });
    try {
      lstatSync(join(directory, "host.lock"));
      throw new Error("Host checkpoint is already owned by a legacy writer; preserve its lock.");
    } catch (error) {
      if (!absent(error)) throw error;
    }
    const lease = join(directory, "host-lease.sqlite");
    try {
      writeFileSync(lease, "", { flag: "wx", mode: 384 });
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
    }
    const stat = lstatSync(lease);
    if (!stat.isFile() || stat.isSymbolicLink() || (stat.mode & 63) !== 0) throw new Error("Invalid private host checkpoint lease.");
    this.#lock = new DatabaseSync(lease);
    try {
      this.#lock.exec("BEGIN EXCLUSIVE");
    } catch {
      this.#lock.close();
      throw new Error("Host checkpoint is already owned or locked. Close the other host before retrying.");
    }
    try {
      const pending = join(directory, "table.pending");
      let staged;
      try {
        staged = lstatSync(pending);
      } catch (error) {
        if (!absent(error)) throw error;
      }
      if (staged) {
        if (!staged.isFile() || staged.isSymbolicLink() || staged.size > LIMIT || (staged.mode & 63) !== 0) throw new Error("Unknown checkpoint staging entry.");
        renameSync(pending, join(directory, `interrupted-${randomUUID()}.json`));
      }
    } catch {
      this.#lock.close();
      throw new Error("Host checkpoint staging cannot be recovered; original data preserved.");
    }
  }
  load() {
    this.#assertOpen();
    let fd;
    try {
      fd = openSync(join(this.#directory, "table.json"), constants.O_RDONLY | constants.O_NOFOLLOW);
    } catch (error) {
      if (absent(error)) return null;
      throw new Error("Host checkpoint cannot be read; original data preserved.");
    }
    try {
      const stat = fstatSync(fd);
      if (!stat.isFile() || stat.size > LIMIT) throw new Error("Invalid checkpoint size.");
      return JSON.parse(readFileSync(fd, "utf8"));
    } catch {
      this.#failed = true;
      throw new Error("Invalid host checkpoint; original data preserved.");
    } finally {
      closeSync(fd);
    }
  }
  commit(value) {
    this.#assertOpen();
    const pending = join(this.#directory, "table.pending");
    let fd, created = false;
    try {
      const bytes = JSON.stringify(value);
      if (bytes === void 0 || Buffer.byteLength(bytes) > LIMIT) throw new Error("Invalid checkpoint size.");
      fd = openSync(pending, "wx", 384);
      created = true;
      fchmodSync(fd, 384);
      writeFileSync(fd, bytes);
      fsyncSync(fd);
      closeSync(fd);
      fd = void 0;
      renameSync(pending, join(this.#directory, "table.json"));
      created = false;
      const directory = openSync(this.#directory, constants.O_RDONLY);
      try {
        fsyncSync(directory);
      } finally {
        closeSync(directory);
      }
    } catch {
      this.#failed = true;
      throw new Error("Host checkpoint could not be committed. Hosting is stopped to protect the table.");
    } finally {
      if (fd !== void 0) closeSync(fd);
      if (created) {
        try {
          unlinkSync(pending);
        } catch {
        }
      }
    }
  }
  #assertOpen() {
    if (this.#closed || this.#failed) throw new Error("Host checkpoint writer is closed or failed.");
  }
  close() {
    if (this.#closed) return;
    this.#closed = true;
    this.#lock.close();
  }
};

// server/http.ts
var HttpFailure = class extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
};
var fail = (status, message) => {
  throw new HttpFailure(status, message);
};
var isLoopback = (address) => address === "127.0.0.1" || address === "::1" || address === "::ffff:127.0.0.1";
var privateV4 = (s) => /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(s);
var lanAddresses = () => Object.values(networkInterfaces()).flatMap((list) => (list ?? []).filter((i) => i.family === "IPv4" && !i.internal && privateV4(i.address)).map((i) => i.address));
var TRANSPORT_HEADER = "x-agent-code-transport";
var literalHost = /^(\d{1,3}(?:\.\d{1,3}){3}):(\d{1,5})$/;
function resolveCaller(request, agentCodeHost, ownHost) {
  const socketPeer = request.socket.remoteAddress?.replace(/^::ffff:/, "");
  const marker = agentCodeHost && isLoopback(socketPeer) ? request.headers[TRANSPORT_HEADER] : void 0;
  if (marker === "lan") {
    if (request.headers.host !== ownHost) fail(403, "Unrecognized host.");
    const peer = request.headers["x-forwarded-for"];
    const host2 = request.headers["x-forwarded-host"];
    const literal = typeof host2 === "string" ? literalHost.exec(host2) : null;
    if (!literal || !(privateV4(literal[1]) || literal[1] === "127.0.0.1")) fail(403, "Unrecognized host.");
    return { peer: typeof peer === "string" ? peer.replace(/^::ffff:/, "") : void 0, host: host2, via: "lan" };
  }
  return { peer: socketPeer, host: request.headers.host, via: marker === "service" ? "service" : "direct" };
}
var object2 = (value) => !!value && typeof value === "object" && !Array.isArray(value);
function shape(value, fields) {
  if (!object2(value) || Object.keys(value).length !== fields.length || fields.some((f) => !Object.hasOwn(value, f))) fail(400, "Invalid request fields.");
}
function admission(value, joining) {
  shape(value, joining ? ["name", "nonce", "code"] : ["name", "nonce"]);
  if (typeof value.name !== "string" || typeof value.nonce !== "string" || !/^[a-f0-9]{64}$/.test(value.nonce) || joining && (typeof value.code !== "string" || value.code.length > 24)) fail(400, "Invalid admission request.");
  return { name: value.name, nonce: value.nonce, code: joining ? String(value.code).trim().toUpperCase().replaceAll("-", "") : "" };
}
function body(request) {
  if (request.headers["content-type"]?.split(";")[0].trim().toLowerCase() !== "application/json") fail(415, "Use application/json.");
  if (Number(request.headers["content-length"] ?? 0) > 4096) {
    request.resume();
    fail(413, "Request is too large.");
  }
  return new Promise((resolve2, reject) => {
    let size = 0, rejected = false;
    const chunks = [];
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > 4096) {
        rejected = true;
        chunks.length = 0;
        reject(new HttpFailure(413, "Request is too large."));
        return;
      }
      if (!rejected) chunks.push(chunk);
    });
    request.on("end", () => {
      if (rejected) return;
      try {
        resolve2(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(new HttpFailure(400, "Invalid JSON."));
      }
    });
    request.on("error", () => reject(new HttpFailure(400, "Request interrupted.")));
  });
}
async function startLanHost(options = {}) {
  const now = options.now ?? Date.now;
  const addresses = ["127.0.0.1", ...options.lan ? lanAddresses() : []];
  const built = new URL("../lan-dist/", import.meta.url);
  const files = (await readdir(built)).filter((file) => /^(?:index\.html|[a-zA-Z0-9_-]+\.(?:js|css))$/.test(file));
  if (!files.includes("index.html") || !files.includes("client.js")) throw new Error("Run npm run build:lan before hosting.");
  const assets = new Map(await Promise.all(files.map(async (file) => [file === "index.html" ? "/" : `/${file}`, {
    bytes: await readFile(new URL(file, built)),
    type: file.endsWith(".js") ? "text/javascript" : file.endsWith(".css") ? "text/css" : "text/html"
  }])));
  let room = null, port = 0, closed = false;
  const generation = randomBytes(16).toString("hex");
  const store = options.checkpointDirectory ? new CheckpointStore(options.checkpointDirectory) : void 0;
  let committed = "null", storageFailed = false;
  const checkpoint = () => room ? {
    version: 1,
    code: room.code,
    host: room.host.id,
    table: room.table.exportHostCheckpoint(),
    credentials: [...room.credentials.values()].map((c) => ({ id: c.id, token: c.token, nonce: c.nonce, name: c.name }))
  } : null;
  try {
    const saved = store?.load() ?? null;
    if (saved !== null) {
      shape(saved, ["version", "code", "host", "table", "credentials"]);
      if (saved.version !== 1 || typeof saved.code !== "string" || !/^[A-F0-9]{10}$/.test(saved.code) || typeof saved.host !== "string" || !Array.isArray(saved.credentials) || saved.credentials.length < 1 || saved.credentials.length > 6) throw new Error();
      const table = HostTable.restoreHostCheckpoint(saved.table, { now }), privateState = table.exportHostCheckpoint();
      if (saved.host !== privateState.host) throw new Error();
      const credentials = /* @__PURE__ */ new Map(), ids = /* @__PURE__ */ new Set(), nonces = /* @__PURE__ */ new Set();
      for (const c of saved.credentials) {
        shape(c, ["id", "token", "nonce", "name"]);
        if (typeof c.id !== "string" || !/^[a-f0-9]{32}$/.test(c.id) || typeof c.token !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(c.token) || typeof c.nonce !== "string" || !/^[a-f0-9]{64}$/.test(c.nonce) || typeof c.name !== "string" || c.name.length > 96 || /[\p{Cc}\p{Cf}]/u.test(c.name) || credentials.has(c.token) || ids.has(c.id) || nonces.has(c.nonce)) throw new Error();
        const member = privateState.members.find((m) => m.id === c.id);
        if (!member || member.leaving || member.name !== c.name.normalize("NFC").trim().replace(/\s+/gu, " ")) throw new Error();
        ids.add(c.id);
        nonces.add(c.nonce);
        credentials.set(c.token, { id: c.id, token: c.token, nonce: c.nonce, name: c.name, connected: false, seen: now() });
      }
      const host2 = [...credentials.values()].find((c) => c.id === saved.host);
      if (!host2 || privateState.members.some((m) => !m.leaving && !ids.has(m.id))) throw new Error();
      room = { table, code: saved.code, host: host2, credentials, paused: true, nextTick: now() + 1e3, observation: 0 };
      committed = JSON.stringify(saved);
    }
  } catch {
    store?.close();
    throw new Error("Invalid host checkpoint. Hosting refused; original saved data has been preserved.");
  }
  const persist = () => {
    if (!store || storageFailed || closed) return;
    try {
      const value = checkpoint(), serialized = JSON.stringify(value);
      if (serialized !== committed) {
        store.commit(value);
        committed = serialized;
      }
    } catch {
      storageFailed = true;
    }
  };
  const buckets = { request: { tokens: 200, time: now() }, admission: { tokens: 20, time: now() } };
  const rate = (kind) => {
    const bucket = buckets[kind], capacity = kind === "request" ? 200 : 20, period = kind === "request" ? 1e4 : 6e4;
    const at = now();
    bucket.tokens = Math.min(capacity, bucket.tokens + Math.max(0, at - bucket.time) * capacity / period);
    bucket.time = at;
    if (bucket.tokens < 1) fail(429, "Too many requests. Wait before retrying.");
    bucket.tokens--;
  };
  const credential = (name, nonce) => ({
    id: randomBytes(16).toString("hex"),
    token: randomBytes(32).toString("base64url"),
    name,
    nonce,
    seen: now(),
    connected: true
  });
  const current = () => room ?? fail(410, "This test session has ended. Create a new table explicitly.");
  const authorize = (request) => {
    const r = current(), value = request.headers.authorization;
    const c = value && /^Bearer [A-Za-z0-9_-]{43}$/.test(value) ? r.credentials.get(value.slice(7)) : void 0;
    if (!c) return fail(401, "Session credential is invalid.");
    if (!c.connected) {
      r.table.reconnect(c.id);
      c.connected = true;
    }
    c.seen = now();
    return { r, c };
  };
  const envelope = (r, c) => ({
    generation,
    observation: ++r.observation,
    view: r.table.view(c.id),
    isHost: c === r.host,
    paused: r.paused || !r.host.connected,
    hostConnected: r.host.connected,
    durable: !!store,
    ...c === r.host ? { code: r.code } : {}
  });
  const send = (response, status, value) => {
    persist();
    if (storageFailed) {
      status = 503;
      value = { error: "Host storage failed. Table frozen; preserve the host save and restart after resolving storage." };
    }
    response.statusCode = status;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(JSON.stringify(value));
  };
  const pulse = () => {
    const r = room;
    if (!r || closed || storageFailed) return;
    const at = now();
    for (const c of r.credentials.values()) if (c.connected && at - c.seen > 15e3) {
      r.table.disconnect(c.id);
      c.connected = false;
    }
    if (r.paused || !r.host.connected || at < r.nextTick) {
      persist();
      return;
    }
    try {
      r.table.tick(r.table.view(r.host.id).revision);
    } catch {
      r.paused = true;
    }
    r.nextTick = at + 1e3;
    persist();
  };
  const server = createServer({ requestTimeout: 5e3, headersTimeout: 5e3, keepAliveTimeout: 2e3, maxHeaderSize: 8192 }, (request, response) => {
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Referrer-Policy", "no-referrer");
    response.setHeader("Content-Security-Policy", "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; media-src data:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
    void (async () => {
      const caller = resolveCaller(request, options.agentCodeHost === true, `127.0.0.1:${port}`);
      const peer = caller.peer;
      if (!isLoopback(peer) && (!peer || !privateV4(peer))) fail(403, "Private-network peers only.");
      const allowed = new Set(addresses.map((address) => `${address}:${port}`));
      if (!caller.host || caller.via !== "lan" && !allowed.has(caller.host)) fail(403, "Unrecognized host.");
      if (caller.via !== "service") {
        const origin = `http://${caller.host}`;
        if (request.headers.origin && request.headers.origin !== origin || request.headers["sec-fetch-site"] === "cross-site") fail(403, "Foreign origin rejected.");
        if (request.method === "POST" && request.headers.origin !== origin) fail(403, "Same-origin request required.");
      }
      rate("request");
      const route = request.url ?? "";
      if (request.method === "GET" && assets.has(route)) {
        const asset = assets.get(route);
        response.setHeader("Content-Type", `${asset.type}; charset=utf-8`);
        response.end(asset.bytes);
        return;
      }
      if (closed || storageFailed) fail(503, "Host closed or storage failed; table frozen.");
      if (request.method === "GET" && route === "/api/state") {
        const { r: r2, c: c2 } = authorize(request);
        send(response, 200, envelope(r2, c2));
        return;
      }
      if (request.method !== "POST" || !["/api/create", "/api/join", "/api/start", "/api/action", "/api/leisure", "/api/pause", "/api/leave"].includes(route)) fail(404, "Not found.");
      if (route === "/api/create" || route === "/api/join") rate("admission");
      const input = await body(request);
      if (closed || storageFailed) fail(503, "Host closed or storage failed; table frozen.");
      if (route === "/api/create") {
        if (!isLoopback(peer)) fail(403, "Create the table on the host computer.");
        const a = admission(input, false);
        if (room) {
          if (room.host.nonce !== a.nonce || room.host.name !== a.name) fail(409, "A table already exists.");
          send(response, 200, { token: room.host.token, code: room.code });
          return;
        }
        const c2 = credential(a.name, a.nonce);
        const table = new HostTable({ id: c2.id, name: a.name }, { now });
        room = {
          table,
          code: randomBytes(5).toString("hex").toUpperCase(),
          host: c2,
          credentials: /* @__PURE__ */ new Map([[c2.token, c2]]),
          paused: false,
          nextTick: now() + 1e3,
          observation: 0
        };
        send(response, 201, { token: c2.token, code: room.code });
        return;
      }
      if (route === "/api/join") {
        const a = admission(input, true), r2 = current();
        const code = Buffer.from(a.code), expected = Buffer.from(r2.code);
        if (code.length !== expected.length || !timingSafeEqual(code, expected)) fail(403, "Lobby code is not valid.");
        const existing = [...r2.credentials.values()].find((c3) => c3.nonce === a.nonce);
        if (existing) {
          if (existing.name !== a.name) fail(409, "Admission retry changed the name.");
          send(response, 200, { token: existing.token });
          return;
        }
        const c2 = credential(a.name, a.nonce);
        r2.table.join(c2.id, a.name);
        r2.credentials.set(c2.token, c2);
        send(response, 201, { token: c2.token });
        return;
      }
      const { r, c } = authorize(request);
      if (route === "/api/leave") {
        shape(input, []);
        if (c === r.host) room = null;
        else {
          r.table.leave(c.id);
          r.credentials.delete(c.token);
        }
        send(response, 200, { left: true });
        return;
      }
      if (route === "/api/pause") {
        if (c !== r.host) fail(403, "Only the host controls pause.");
        shape(input, ["paused"]);
        if (typeof input.paused !== "boolean") fail(400, "Invalid pause state.");
        r.paused = input.paused;
        r.nextTick = now() + 1e3;
        send(response, 200, envelope(r, c));
        return;
      }
      if (route === "/api/leisure") {
        const receipt2 = r.table.leisure(c.id, input, { paused: r.paused || !r.host.connected });
        send(response, receipt2.ok ? 200 : 409, { receipt: receipt2 });
        return;
      }
      if (r.paused || !r.host.connected) fail(409, "The host has paused or disconnected.");
      if (route === "/api/start") {
        if (c !== r.host) fail(403, "Only the host starts a hand.");
        shape(input, ["revision"]);
        if (!Number.isSafeInteger(input.revision)) fail(400, "Invalid revision.");
        r.table.start(c.id, Number(input.revision));
        r.nextTick = now() + 1e3;
        send(response, 200, envelope(r, c));
        return;
      }
      const receipt = r.table.act(c.id, input);
      if (receipt.code === "accepted") r.nextTick = now() + 1e3;
      send(response, receipt.ok ? 200 : 409, { receipt, ...envelope(r, c) });
    })().catch((error) => {
      request.resume();
      if (response.writableEnded || response.destroyed) return;
      if (error instanceof HttpFailure) send(response, error.status, { error: error.message });
      else if (error instanceof Error && /full|name|Principal|Finish this hand|Stale session|table is complete/.test(error.message)) send(response, 409, { error: error.message });
      else send(response, 500, { error: "Host could not complete this request." });
    });
  });
  server.maxConnections = 32;
  server.maxRequestsPerSocket = 200;
  server.setTimeout(5e3, (socket) => socket.destroy());
  try {
    await new Promise((resolve2, reject) => {
      server.once("error", reject);
      server.listen(options.port ?? 5192, options.lan ? "0.0.0.0" : "127.0.0.1", () => {
        server.off("error", reject);
        resolve2();
      });
    });
  } catch (error) {
    store?.close();
    throw error;
  }
  port = server.address().port;
  const timer = options.automaticTicks === false ? void 0 : setInterval(pulse, 250);
  timer?.unref();
  return {
    origin: `http://127.0.0.1:${port}`,
    addresses: addresses.map((a) => `http://${a}:${port}`),
    pulse,
    async close() {
      if (closed) return;
      closed = true;
      if (timer) clearInterval(timer);
      room = null;
      try {
        await new Promise((resolve2, reject) => {
          server.close((error) => error ? reject(error) : resolve2());
          server.closeAllConnections();
        });
      } finally {
        store?.close();
      }
    }
  };
}

// server/service.ts
function entryDirectory() {
  return dirname(fileURLToPath(import.meta.url));
}
function checkpointDirectory() {
  const here = entryDirectory();
  if (here.includes(`${sep}extensions${sep}`)) return resolve(here, "../../..", ".poker-lan");
  return resolve(here, "../.poker-lan");
}
var host = null;
var lanHostService = defineService({
  async start(context) {
    host = await startLanHost({ port: 0, lan: false, agentCodeHost: true, checkpointDirectory: checkpointDirectory() });
    context.onRequest("status", () => ({ origin: host.origin, lanAddresses: lanAddresses() }));
    context.ready([{ name: "http", port: Number(new URL(host.origin).port) }]);
  },
  async stop() {
    await host?.close();
    host = null;
  }
});
if (process.env.AGENT_CODE_POKER_SERVICE_ENTRY !== "0") runService(lanHostService);
export {
  lanHostService
};
