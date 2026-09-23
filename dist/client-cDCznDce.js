import { j as S, D as Te, d as Ne, g as Ae, r as h, o as x, a as De, f as je, T as Ie, F as ue, b as Ke, C as fe, S as Pe, e as $e, c as Me, h as He, k as Fe, l as Ue, m as Je, B as qe, n as Ge, i as pe } from "./BankControls-BKBS-DTa.js";
const F = "poker-lan-connection-test-v1", j = "poker-lan-saved-seat-v1:";
function I(e, n = !1) {
  if (!e || e.length > 2048) return null;
  try {
    const s = JSON.parse(e), o = n && s?.name === void 0 ? "Saved player" : s?.name;
    return !s || typeof s.token != "string" || !/^(?:[A-Za-z0-9_-]{43})?$/.test(s.token) || typeof s.nonce != "string" || !/^[a-f0-9]{64}$/.test(s.nonce) || typeof o != "string" || !o.trim() || o.length > 96 || /[\p{Cc}\p{Cf}]/u.test(o) ? null : { token: s.token, nonce: s.nonce, name: o };
  } catch {
    return null;
  }
}
class We {
  constructor(n, s) {
    this.session = n, this.local = s;
  }
  session;
  local;
  current() {
    try {
      return I(this.session().getItem(F), !0);
    } catch {
      return null;
    }
  }
  saved() {
    try {
      const n = this.local(), s = [];
      for (let o = 0; o < Math.min(n.length, 4096) && s.length < 64; o++) {
        const i = n.key(o);
        if (!i?.startsWith(j)) continue;
        const d = I(n.getItem(i));
        d?.token && i === j + d.nonce && s.push(d);
      }
      return s;
    } catch {
      return [];
    }
  }
  save(n, s) {
    const o = I(JSON.stringify(n));
    if (!o) return !1;
    let i = !0;
    try {
      this.session().setItem(F, JSON.stringify(o));
    } catch {
      i = !1;
    }
    if (s && o.token)
      try {
        this.local().setItem(j + o.nonce, JSON.stringify(o));
      } catch {
        i = !1;
      }
    return i;
  }
  forget(n) {
    let s = !0;
    try {
      const o = I(this.session().getItem(F), !0);
      o?.nonce === n.nonce && o.token === n.token && this.session().removeItem(F);
    } catch {
      s = !1;
    }
    try {
      const o = this.local();
      I(o.getItem(j + n.nonce))?.token === n.token && o.removeItem(j + n.nonce);
    } catch {
      s = !1;
    }
    return s;
  }
}
class T extends Error {
}
class Ye {
  #n = 0;
  #e = 0;
  #t;
  begin() {
    return { epoch: this.#n, version: this.#e, generation: this.#t?.generation };
  }
  reset() {
    this.#n++, this.#e = 0, this.#t = void 0;
  }
  current(n) {
    return n.epoch === this.#n;
  }
  failureCurrent(n) {
    return this.current(n) && n.version === this.#e;
  }
  accept(n, s) {
    if (!this.current(n) || typeof s.generation != "string" || !s.generation || !Number.isSafeInteger(s.observation) || s.observation < 1) return !1;
    const o = this.#t;
    return o && (s.generation === o.generation ? s.observation <= o.observation : n.generation !== o.generation) ? !1 : (this.#t = { generation: s.generation, observation: s.observation }, this.#e++, !0);
  }
}
function Ve(e, n, s) {
  if (n !== "table" || s.blocked || !s.available || s.menuOpen || e.repeat || e.ctrlKey || e.altKey || e.metaKey || e.isComposing) return null;
  const o = e.key.toLowerCase();
  return o === "s" ? "smoke" : o === "d" ? "drink" : o === "e" ? "consume" : null;
}
function ze(e) {
  const n = e.blocked || !e.available || e.menuOpen;
  return /* @__PURE__ */ S.jsxs("div", { className: "lan-leisure", children: [
    /* @__PURE__ */ S.jsxs("button", { disabled: n, onClick: e.onSmoke, children: [
      "Cigar ",
      /* @__PURE__ */ S.jsx("kbd", { children: "S" })
    ] }),
    /* @__PURE__ */ S.jsxs("button", { disabled: n, onClick: e.onSip, children: [
      Te[e.kind].label,
      " ",
      /* @__PURE__ */ S.jsx("kbd", { children: "D" })
    ] }),
    e.treat && /* @__PURE__ */ S.jsxs("button", { disabled: n || !e.canConsume, onClick: e.onConsume, children: [
      Ne[e.treat.kind].label,
      " · ",
      e.treat.remaining,
      " ",
      /* @__PURE__ */ S.jsx("kbd", { children: "E" })
    ] }),
    /* @__PURE__ */ S.jsx("button", { disabled: e.blocked, "aria-expanded": e.menuOpen, onClick: () => e.onMenuChange(!e.menuOpen), children: "Drinks ▾" }),
    e.menuOpen && /* @__PURE__ */ S.jsx(
      Ae,
      {
        kind: e.kind,
        treat: e.treat?.kind ?? null,
        available: !e.blocked && e.available,
        onClose: () => e.onMenuChange(!1),
        onOrder: e.onOrder
      }
    )
  ] });
}
const t = (e) => document.getElementById(e), M = new We(() => sessionStorage, () => localStorage), w = new Ye(), ie = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), (e) => e.toString(16).padStart(2, "0")).join("");
let m = "", D = ie(), a = null, f = !1, Q = !1, c = !1, l = null, W = !1, R = !1, p = !1, u = !1, P = 0, U = -1, y = !1, Y = !1, L = { kind: "old-fashioned", available: !1, treat: null, canConsume: !1 };
const J = /* @__PURE__ */ new Map(), Ce = h.createRef(), me = x.createRoot(t("actions")), ee = x.createRoot(t("leisure")), he = x.createRoot(t("bank")), _e = x.createRoot(t("header")), be = x.createRoot(t("hud")), ge = x.createRoot(t("pot")), ke = x.createRoot(t("table-info")), g = new De(
  Ie.fireplace ? je : void 0,
  [ue.position[0], 0.4, ue.position[2] + 0.05]
);
let C = !1, ye = null, V = document.hasFocus(), O = !0;
const z = () => g.setAmbienceActive(!!a && !a.paused && !u && !c && !p && !document.hidden && V);
t("app").addEventListener("pointerdown", () => g.unlock());
t("app").addEventListener("keydown", (e) => {
  e.repeat || g.unlock();
});
document.addEventListener("visibilitychange", () => {
  z(), document.hidden || k();
});
document.addEventListener("fullscreenchange", () => k());
window.addEventListener("blur", () => {
  V = !1, z();
});
window.addEventListener("focus", () => {
  V = !0, z();
});
window.addEventListener("pagehide", () => g.dispose(), { once: !0 });
const N = () => t("app").focus(), H = () => l?.setLookBlocked(Y || p || y), Xe = (e) => {
  Y = e, H(), ce();
}, q = M.current();
let K = [], $ = q?.name || "Guest";
q && (m = q.token, D = q.nonce, t("name").value = $);
const te = [], ve = (/* @__PURE__ */ new Date()).toISOString();
let Ee = !1;
const _ = () => ({ token: m, nonce: D, name: $ });
function ne(e = !1) {
  M.save(_(), e) || (t("storage-warning").textContent = "Browser storage is unavailable. You can play, but keep this tab open: your seat may not survive closing or reloading it.");
}
function le(e) {
  M.forget(e) || (t("storage-warning").textContent = "Browser storage blocked cleanup. This device may still remember the seat; clear its poker site data before sharing this browser.");
}
function Se() {
  K = M.saved(), t("recovery").hidden = m || !K.length, t("saved-seats").replaceChildren(...K.map((e, n) => {
    const s = document.createElement("option");
    return s.value = String(n), s.textContent = e.name, s;
  })), t("resume-seat").disabled = t("forget-seat").disabled = f;
}
function Ze(e, n, s) {
  if (te.length >= 512) {
    Ee = !0;
    return;
  }
  const o = s?.view;
  te.push({ at: performance.now(), path: e, status: n, ...o ? {
    revision: o.revision,
    gameRevision: o.gameRevision,
    phase: o.phase,
    actor: o.actor,
    selfSeat: o.self.seat,
    waiting: o.self.waiting,
    players: o.players.map((i) => ({
      seat: i.seat,
      displaySeat: i.displaySeat,
      kind: i.kind,
      stack: i.stack,
      bet: i.bet,
      folded: i.folded,
      cards: i.cards.kind,
      connected: i.connected
    }))
  } : {} });
}
let ae = null;
function st(e) {
  ae = e;
}
async function v(e, n) {
  const s = w.begin();
  let o, i;
  try {
    o = ae ? await ae({
      path: e,
      method: n === void 0 ? "GET" : "POST",
      headers: { ...n === void 0 ? {} : { "Content-Type": "application/json" }, ...m ? { Authorization: `Bearer ${m}` } : {} },
      body: n === void 0 ? void 0 : JSON.stringify(n)
    }) : await fetch(e, {
      method: n === void 0 ? "GET" : "POST",
      cache: "no-store",
      headers: { ...n === void 0 ? {} : { "Content-Type": "application/json" }, ...m ? { Authorization: `Bearer ${m}` } : {} },
      body: n === void 0 ? void 0 : JSON.stringify(n),
      signal: AbortSignal.timeout(5e3)
    }), i = await o.json();
  } catch (d) {
    throw w.failureCurrent(s) ? d : new T();
  }
  if (!w.current(s)) throw new T();
  if (Ze(e, o.status, i), i.view) {
    if (!w.accept(s, i)) throw new T();
    const d = a && i.generation !== a.generation;
    (d || u) && g.resetEvents(), d && (P++, U = -1, R = !1, l?.setInspection(!1)), a = i, u = !1, k();
  } else if (!o.ok && !w.failureCurrent(s))
    throw new T();
  if (m && [401, 410].includes(o.status) && (c = !0, w.reset(), t("forget").hidden = !1), !o.ok) throw new Error(i.error || i.receipt?.code || "Request rejected.");
  return i;
}
function B() {
  return {
    available: L.available,
    menuOpen: y,
    blocked: !a || !l || W || f || u || c || a.paused || a.view.phase === "ready" || a.view.self.waiting || R || p || Y
  };
}
function ce() {
  if (!a) {
    ee.render(null);
    return;
  }
  ee.render(h.createElement(ze, {
    ...B(),
    kind: L.kind,
    treat: L.treat,
    canConsume: L.canConsume,
    onSmoke: () => G("smoke"),
    onSip: () => G("drink"),
    onConsume: () => G("consume"),
    onMenuChange: re,
    onOrder: (e) => {
      const n = B();
      !n.blocked && n.available && (pe(e) ? l?.orderDrink(e) : l?.orderTreat(e)) && (pe(e) && de({ action: "order", kind: e }), re(!1));
    }
  }));
}
let se = !1, oe = -1 / 0;
function de(e) {
  !m || c || (se = !0, oe = performance.now(), v("/api/leisure", e).catch(() => {
  }).finally(() => {
    se = !1;
  }));
}
function Qe(e) {
  de(e === "smoke" ? { action: "smoke" } : { action: "sip", kind: L.kind });
}
function G(e) {
  const n = B();
  n.blocked || n.menuOpen || !n.available || (e === "smoke" ? l?.smokeCigar() : e === "consume" ? l?.consumeTreat() : l?.sipDrink(), N());
}
function et(e) {
  const n = e.players[e.self.seat]?.leisure;
  !n || n.drinkKind === L.kind || se || a.paused || e.self.waiting || u || c || !l || performance.now() - oe < 3e3 || (oe = performance.now(), de({ action: "order", kind: L.kind }));
}
function re(e) {
  e && B().blocked || (y = e, P++, H(), k(), e || N());
}
function we(e, n = !1) {
  const s = n ? -1 : e;
  if (l && ye !== s) {
    l.dispose(), l = null;
    for (const i of J.values()) i.root.unmount();
    J.clear(), t("labels").replaceChildren();
  }
  if (l || W || document.hidden) return;
  const o = () => {
    W = !0, t("error").textContent = "3D rendering unavailable. Reload this tab to reconnect without losing your seat.";
  };
  try {
    l = new Ge(t("scene"), o, void 0, (i) => {
      L = i, ce();
    }, e), l.setLookEnabled(O), l.onLeisureStarted = Qe, l.setDrinkEffect(t("drink-effect").value), ye = s;
    for (let i = 1; i < 6; i++) {
      const d = document.createElement("div");
      d.className = "seat", t("labels").append(d), J.set(i, { node: d, root: x.createRoot(d) }), l.bindWorldLabel(i, d);
    }
    l.bindWorldLabel(-1, t("pot")), l.onAudioListener = (i) => g.setListenerMatrix(i);
  } catch {
    o();
  }
}
function k() {
  if (t("entry").hidden = !!a, t("table").hidden = !a, t("inspect").hidden = t("details").hidden = !a, _e.render(h.createElement(
    Ke,
    { onLobby: () => {
      a && A(!0);
    } },
    h.createElement("button", { "aria-label": C ? "Unmute sound" : "Mute sound", title: "Sound (M)", onClick: () => {
      C = !C, g.setMuted(C), C || g.unlock(), k();
    } }, C ? "♪̸" : "♪"),
    a && h.createElement("button", { "aria-label": "Settings", title: "Table settings", onClick: () => A(!0) }, "⚙"),
    a && h.createElement("button", { "aria-label": "Recenter view", title: "Drag the room to look · Recenter (R)", disabled: B().blocked || y, onClick: () => {
      l?.recenterLook(), N();
    } }, "⌖"),
    a?.isHost && h.createElement("button", { "aria-label": a.paused ? "Resume table" : "Pause table", disabled: f, onClick: () => E(() => v("/api/pause", { paused: !a.paused })) }, a.paused ? "▶" : "Ⅱ"),
    document.fullscreenEnabled && h.createElement("button", { "aria-label": document.fullscreenElement ? "Exit fullscreen" : "Enter fullscreen", onClick: () => {
      (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {
        t("error").textContent = "Fullscreen unavailable. The game still fills the browser.";
      });
    } }, "⤢")
  )), t("app").classList.toggle("inspecting", R), z(), t("create").disabled = f || !!m, t("join").disabled = f || !!m, !a) {
    we(0, !0), l?.setPlaying(!1), me.render(null), g.resetEvents(), be.render(null), ge.render(null), ke.render(null), t("actions").hidden = t("deal-actions").hidden = !0, R = !1, p = !1, y = !1, Y = !1, L = { kind: "old-fashioned", available: !1, treat: null, canConsume: !1 }, u = !1, U = -1, t("menu").hidden = !0, ee.render(null), he.render(null), Se();
    return;
  }
  const e = a.view, n = e.players[e.self.seat];
  e.revision !== U && (U = e.revision, P++), we(e.self.seat), l?.updateRemote(e, e.self.seat), l?.setPlaying(e.phase !== "ready" && !e.self.waiting), l?.setPaused(a.paused || u || c || p), (a.paused || u || c || p || e.self.waiting) && (y = !1), H(), ce(), et(e);
  for (const r of e.players) if (r.displaySeat !== 0) {
    const b = J.get(r.displaySeat);
    if (!b) continue;
    b.node.classList.toggle("active", e.actor === r.seat), b.node.classList.toggle("folded", r.folded), b.node.classList.toggle("out", r.stack === 0 && !r.committed), b.node.style.setProperty("--seat-color", fe[r.seat].color), b.root.render(h.createElement(Pe, {
      name: r.name,
      dealer: e.dealer === r.seat,
      blind: e.smallBlindSeat === r.seat ? "SB" : e.bigBlindSeat === r.seat ? "BB" : "",
      stack: r.stack,
      action: e.actor === r.seat ? r.kind === "human" ? "DECIDING" : "THINKING" : r.action || fe[r.seat].title,
      visibleCards: r.cards.kind === "visible" ? r.cards.values : []
    }));
  }
  t("labels").hidden = R, t("connection").textContent = u || c ? "Connection interrupted — wagering disabled" : a.hostConnected ? a.paused ? "Table paused" : e.self.waiting ? "Seat reserved — joining next hand" : e.actor === e.self.seat ? "Your move" : "Connected · LAN" : "Host disconnected — table suspended", t("invite").textContent = a.code ? `Lobby code: ${a.code.slice(0, 5)}-${a.code.slice(5)}` : "Six playing seats · empty seats are NPCs", t("host-storage").textContent = a.durable ? "Host saves this table privately. A host restart pauses play until the host resumes." : "Disposable host: stopping its process ends this table.";
  const s = e.phase === "betting" ? ["Pre-flop", "Flop", "Turn", "River"][e.street] : e.phase === "ready" ? "Waiting for host" : e.phase === "complete" ? "Hand complete" : e.phase === "showdown" ? "Showdown" : "Dealing", o = e.phase === "complete" ? e.results.filter((r) => r.won > 0).map((r) => `${e.players[r.seat].name} wins ${r.won}`).join(" · ") : "", i = n.cards.kind === "visible" ? n.cards.values : [], d = e.phase === "complete", Z = e.phase === "betting" && e.actor === e.self.seat, xe = i.length === 2 && e.board.length >= 3 ? $e([...i, ...e.board]).name : "Practice chips", Be = u || c ? "Connection interrupted" : a.paused ? "Table paused" : e.self.waiting ? "Your seat is reserved." : d ? o : Z ? "Your move." : e.actor !== null ? `${e.players[e.actor].name} is thinking…` : s;
  ke.render(h.createElement(Me, { handNumber: e.handNumber, smallBlind: e.smallBlind, bigBlind: e.bigBlind })), ge.render(h.createElement(He, { finished: d, amount: d ? e.awards.reduce((r, b) => r + b.amount, 0) : e.pot, sidePots: e.awards.length - 1 })), be.render(h.createElement(Fe, {
    board: e.board,
    street: Ue[e.street],
    ownCards: i,
    stack: n.stack,
    position: `${e.dealer === n.seat ? " · DEALER" : ""}${e.smallBlindSeat === n.seat ? " · SB" : ""}${e.bigBlindSeat === n.seat ? " · BB" : ""}`,
    handLabel: n.folded ? "Folded" : xe,
    status: Be,
    detail: f ? "Sending…" : e.self.waiting ? "Joining at the next hand" : n.action,
    winningCards: d ? e.results.find((r) => r.seat === n.seat && r.won > 0)?.hand?.cards ?? [] : [],
    withActions: Z || d || e.phase === "ready"
  })), g.observe(
    e.gameRevision,
    {
      hand: e.handNumber,
      phase: e.phase,
      actor: e.actor,
      boardCount: e.board.length,
      players: e.players.map((r) => ({ seat: r.seat, stack: r.stack, bet: r.bet, folded: r.folded, action: r.action }))
    },
    !a.paused && !u && !c && !p && !e.self.waiting && V && !document.hidden,
    e.self.seat
  ), t("players").replaceChildren(...[...e.players].sort((r, b) => r.displaySeat - b.displaySeat).map((r) => {
    const b = document.createElement("li");
    return b.textContent = `${r.name} · ${r.kind}${r.pendingName ? " · next: " + r.pendingName : ""} · ${r.stack} chips · ${r.action || "waiting"}${e.actor === r.seat ? " · to act" : ""}`, b;
  })), t("deal-actions").hidden = !a.isHost || !["ready", "complete"].includes(e.phase) || a.paused || p, t("pause").hidden = !a.isHost, t("start").disabled = f || a.paused || u || c, t("pause").disabled = f, t("pause").textContent = a.paused ? "Resume table" : "Pause table", t("leave").disabled = f, t("leave").textContent = a.isHost ? "End session for everyone" : "Leave table", he.render(h.createElement(Je, {
    offer: e.self.bank,
    revision: e.revision,
    blocked: f || a.paused || u || c || !p,
    onConfirm: nt
  }));
  const Oe = !f && !a.paused && !u && !c && !p && !y && !e.self.waiting && e.actor === e.self.seat && e.phase === "betting";
  t("actions").hidden = !Z || a.paused || p || u || c, me.render(h.createElement(qe, {
    ref: Ce,
    revision: P,
    blocked: !Oe,
    legal: e.legal,
    pot: e.pot,
    currentBet: e.currentBet,
    ownBet: n.bet,
    bigBlind: e.bigBlind,
    onAction: tt,
    onOpenChange: Xe,
    focusTable: N
  })), t("inspect").disabled = a.paused || e.self.waiting || u || c || p, t("inspect").setAttribute("aria-pressed", String(R)), t("inspect").firstChild.nodeValue = R ? "Look up " : "Cards & chips ";
}
async function E(e) {
  if (!f) {
    f = !0, t("error").textContent = "", k();
    try {
      await e();
    } catch (n) {
      n instanceof T || (P++, t("error").textContent = n.message);
    } finally {
      f = !1, k();
    }
  }
}
async function Re(e) {
  $ = t("name").value, ne();
  const n = await v(e ? "/api/join" : "/api/create", { name: $, nonce: D, ...e ? { code: t("code").value } : {} });
  w.reset(), m = n.token, ne(t("remember").checked), await v("/api/state");
}
t("create").onclick = () => E(() => Re(!1));
t("join").onclick = () => E(() => Re(!0));
t("start").onclick = () => E(() => v("/api/start", { revision: a.view.revision }));
t("pause").onclick = () => E(() => v("/api/pause", { paused: !a.paused }));
t("leave").onclick = () => E(async () => {
  await v("/api/leave", {}), w.reset(), le(_()), m = "", a = null, D = ie(), t("connection").textContent = "Left table";
});
t("forget").onclick = () => {
  w.reset(), le(_()), m = "", a = null, c = !1, D = ie(), t("forget").hidden = !0, t("error").textContent = "", t("connection").textContent = "Not connected", k();
};
t("resume-seat").onclick = () => {
  const e = K[Number(t("saved-seats").value)];
  e && E(async () => {
    w.reset(), m = e.token, D = e.nonce, $ = e.name, c = !1, W = !1, ne(), await v("/api/state");
  });
};
t("forget-seat").onclick = () => {
  const e = K[Number(t("saved-seats").value)];
  e && (le(e), Se());
};
t("remember-current").onclick = () => {
  M.save(_(), !0) ? t("seat-note").textContent = "Seat remembered on this browser. Close this tab before resuming it in another." : t("storage-warning").textContent = "Browser storage is unavailable. Keep this tab open; the seat was not safely remembered.";
};
function tt(e) {
  if (f || c || u || p || y || !a || a.paused || a.view.actor !== a.view.self.seat) return !1;
  const n = a.view;
  return E(() => v("/api/action", { sequence: n.self.nextSequence, revision: n.revision, action: e })), !0;
}
function nt(e, n) {
  if (f || c || u || !a || a.paused || !p || a.view.revision !== n) return !1;
  const s = a.view, o = s.self.bank;
  return (e.type === "borrow" ? !o.canBorrow : e.amount <= 0 || e.amount > o.repayMax) ? !1 : (E(() => v("/api/action", { sequence: s.self.nextSequence, revision: n, action: e })), !0);
}
function A(e) {
  p = e, t("menu").hidden = !e, H(), k(), e || N();
}
t("details").onclick = () => A(!p);
t("close-menu").onclick = () => A(!1);
for (const e of ["ambience-level", "effects-level"]) t(e).onchange = () => {
  g.setLevels(Number(t("ambience-level").value), Number(t("effects-level").value));
};
t("drink-effect").onchange = () => l?.setDrinkEffect(t("drink-effect").value);
t("look-enabled").onclick = () => {
  O = !O, l?.setLookEnabled(O), t("look-enabled").setAttribute("aria-pressed", String(O)), t("look-enabled").textContent = O ? "On" : "Off";
};
function X(e) {
  e && (y = !1), R = e, l?.setInspection(e), t("labels").hidden = e, H(), k();
}
t("inspect").onclick = () => {
  X(!R), N();
};
t("app").addEventListener("keydown", (e) => {
  const n = e.target.closest("input,select,textarea,[contenteditable=true]") ? "editing" : e.target.closest("button,a") ? "control" : "table";
  if (!a || n === "editing" || e.altKey || e.ctrlKey || e.metaKey || e.isComposing) return;
  if (e.key.toLowerCase() === "m" && !e.repeat) {
    e.preventDefault(), C = !C, g.setMuted(C), C || g.unlock(), k();
    return;
  }
  if (e.key === "Escape" && y) {
    e.preventDefault(), e.stopPropagation(), re(!1);
    return;
  }
  if (e.key === "Escape" && p) {
    e.preventDefault(), A(!1);
    return;
  }
  if (e.key.toLowerCase() === "r" && n === "table" && !e.repeat && !B().blocked && !y) {
    e.preventDefault(), l?.recenterLook();
    return;
  }
  const s = Ve(e, n, B());
  if (s) {
    e.preventDefault(), G(s);
    return;
  }
  if (!Ce.current?.handleKey({
    key: e.key,
    repeat: e.repeat,
    shiftKey: e.shiftKey,
    altKey: e.altKey,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    nativeEvent: e,
    preventDefault: () => e.preventDefault(),
    stopPropagation: () => e.stopPropagation()
  }, n)) {
    if (e.key === "Escape" && !e.repeat && !f) {
      e.preventDefault(), a.isHost ? E(() => v("/api/pause", { paused: !a.paused })) : A(!0);
      return;
    }
    e.key === " " && n === "table" && !p && !y && !u && !c && !a.paused && !a.view.self.waiting && (e.preventDefault(), X(!0));
  }
});
t("app").addEventListener("keyup", (e) => {
  e.key === " " && X(!1);
});
window.addEventListener("blur", () => X(!1));
t("export").onclick = () => {
  const e = new Blob([JSON.stringify({ source: "actual-browser-lan-3d-client", started: ve, truncated: Ee, records: te }, null, 2)], { type: "application/json" }), n = URL.createObjectURL(e), s = document.createElement("a");
  s.href = n, s.download = `poker-lan-${ve.replaceAll(":", "-")}.json`, s.click(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
};
async function Le() {
  if (!(!m || c || f || Q)) {
    Q = !0;
    try {
      await v("/api/state");
    } catch (e) {
      e instanceof T || (u = !0, t("error").textContent = e.message, k());
    } finally {
      Q = !1;
    }
  }
}
setInterval(Le, 500);
k();
Le();
export {
  st as setApiTransport
};
