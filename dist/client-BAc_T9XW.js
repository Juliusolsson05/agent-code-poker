import { j as S, D as Le, d as xe, g as Be, r as b, o as L, a as Oe, f as Te, T as Ne, F as le, b as Ae, C as ce, S as De, e as je, c as Ie, h as Ke, k as Pe, l as $e, m as Me, B as Fe, n as He, i as Ue } from "./BankControls-V-2DpMuh.js";
const H = "poker-lan-connection-test-v1", j = "poker-lan-saved-seat-v1:";
function I(e, n = !1) {
  if (!e || e.length > 2048) return null;
  try {
    const a = JSON.parse(e), o = n && a?.name === void 0 ? "Saved player" : a?.name;
    return !a || typeof a.token != "string" || !/^(?:[A-Za-z0-9_-]{43})?$/.test(a.token) || typeof a.nonce != "string" || !/^[a-f0-9]{64}$/.test(a.nonce) || typeof o != "string" || !o.trim() || o.length > 96 || /[\p{Cc}\p{Cf}]/u.test(o) ? null : { token: a.token, nonce: a.nonce, name: o };
  } catch {
    return null;
  }
}
class Je {
  constructor(n, a) {
    this.session = n, this.local = a;
  }
  session;
  local;
  current() {
    try {
      return I(this.session().getItem(H), !0);
    } catch {
      return null;
    }
  }
  saved() {
    try {
      const n = this.local(), a = [];
      for (let o = 0; o < Math.min(n.length, 4096) && a.length < 64; o++) {
        const i = n.key(o);
        if (!i?.startsWith(j)) continue;
        const c = I(n.getItem(i));
        c?.token && i === j + c.nonce && a.push(c);
      }
      return a;
    } catch {
      return [];
    }
  }
  save(n, a) {
    const o = I(JSON.stringify(n));
    if (!o) return !1;
    let i = !0;
    try {
      this.session().setItem(H, JSON.stringify(o));
    } catch {
      i = !1;
    }
    if (a && o.token)
      try {
        this.local().setItem(j + o.nonce, JSON.stringify(o));
      } catch {
        i = !1;
      }
    return i;
  }
  forget(n) {
    let a = !0;
    try {
      const o = I(this.session().getItem(H), !0);
      o?.nonce === n.nonce && o.token === n.token && this.session().removeItem(H);
    } catch {
      a = !1;
    }
    try {
      const o = this.local();
      I(o.getItem(j + n.nonce))?.token === n.token && o.removeItem(j + n.nonce);
    } catch {
      a = !1;
    }
    return a;
  }
}
class O extends Error {
}
class qe {
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
  accept(n, a) {
    if (!this.current(n) || typeof a.generation != "string" || !a.generation || !Number.isSafeInteger(a.observation) || a.observation < 1) return !1;
    const o = this.#t;
    return o && (a.generation === o.generation ? a.observation <= o.observation : n.generation !== o.generation) ? !1 : (this.#t = { generation: a.generation, observation: a.observation }, this.#e++, !0);
  }
}
function Ge(e, n, a) {
  if (n !== "table" || a.blocked || !a.available || a.menuOpen || e.repeat || e.ctrlKey || e.altKey || e.metaKey || e.isComposing) return null;
  const o = e.key.toLowerCase();
  return o === "s" ? "smoke" : o === "d" ? "drink" : o === "e" ? "consume" : null;
}
function We(e) {
  const n = e.blocked || !e.available || e.menuOpen;
  return /* @__PURE__ */ S.jsxs("div", { className: "lan-leisure", children: [
    /* @__PURE__ */ S.jsxs("button", { disabled: n, onClick: e.onSmoke, children: [
      "Cigar ",
      /* @__PURE__ */ S.jsx("kbd", { children: "S" })
    ] }),
    /* @__PURE__ */ S.jsxs("button", { disabled: n, onClick: e.onSip, children: [
      Le[e.kind].label,
      " ",
      /* @__PURE__ */ S.jsx("kbd", { children: "D" })
    ] }),
    e.treat && /* @__PURE__ */ S.jsxs("button", { disabled: n || !e.canConsume, onClick: e.onConsume, children: [
      xe[e.treat.kind].label,
      " · ",
      e.treat.remaining,
      " ",
      /* @__PURE__ */ S.jsx("kbd", { children: "E" })
    ] }),
    /* @__PURE__ */ S.jsx("button", { disabled: e.blocked, "aria-expanded": e.menuOpen, onClick: () => e.onMenuChange(!e.menuOpen), children: "Drinks ▾" }),
    e.menuOpen && /* @__PURE__ */ S.jsx(
      Be,
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
const t = (e) => document.getElementById(e), M = new Je(() => sessionStorage, () => localStorage), w = new qe(), oe = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), (e) => e.toString(16).padStart(2, "0")).join("");
let m = "", D = oe(), s = null, f = !1, Q = !1, u = !1, l = null, W = !1, R = !1, p = !1, d = !1, P = 0, U = -1, v = !1, Y = !1, T = { kind: "old-fashioned", available: !1, treat: null, canConsume: !1 };
const J = /* @__PURE__ */ new Map(), ke = b.createRef(), de = L.createRoot(t("actions")), ee = L.createRoot(t("leisure")), ue = L.createRoot(t("bank")), Ye = L.createRoot(t("header")), fe = L.createRoot(t("hud")), pe = L.createRoot(t("pot")), me = L.createRoot(t("table-info")), g = new Oe(
  Ne.fireplace ? Te : void 0,
  [le.position[0], 0.4, le.position[2] + 0.05]
);
let C = !1, be = null, V = document.hasFocus(), B = !0;
const z = () => g.setAmbienceActive(!!s && !s.paused && !d && !u && !p && !document.hidden && V);
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
const N = () => t("app").focus(), F = () => l?.setLookBlocked(Y || p || v), Ve = (e) => {
  Y = e, F(), ie();
}, q = M.current();
let K = [], $ = q?.name || "Guest";
q && (m = q.token, D = q.nonce, t("name").value = $);
const te = [], he = (/* @__PURE__ */ new Date()).toISOString();
let ve = !1;
const _ = () => ({ token: m, nonce: D, name: $ });
function ne(e = !1) {
  M.save(_(), e) || (t("storage-warning").textContent = "Browser storage is unavailable. You can play, but keep this tab open: your seat may not survive closing or reloading it.");
}
function re(e) {
  M.forget(e) || (t("storage-warning").textContent = "Browser storage blocked cleanup. This device may still remember the seat; clear its poker site data before sharing this browser.");
}
function ye() {
  K = M.saved(), t("recovery").hidden = m || !K.length, t("saved-seats").replaceChildren(...K.map((e, n) => {
    const a = document.createElement("option");
    return a.value = String(n), a.textContent = e.name, a;
  })), t("resume-seat").disabled = t("forget-seat").disabled = f;
}
function ze(e, n, a) {
  if (te.length >= 512) {
    ve = !0;
    return;
  }
  const o = a?.view;
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
function Qe(e) {
  ae = e;
}
async function y(e, n) {
  const a = w.begin();
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
  } catch (c) {
    throw w.failureCurrent(a) ? c : new O();
  }
  if (!w.current(a)) throw new O();
  if (ze(e, o.status, i), i.view) {
    if (!w.accept(a, i)) throw new O();
    const c = s && i.generation !== s.generation;
    (c || d) && g.resetEvents(), c && (P++, U = -1, R = !1, l?.setInspection(!1)), s = i, d = !1, k();
  } else if (!o.ok && !w.failureCurrent(a))
    throw new O();
  if (m && [401, 410].includes(o.status) && (u = !0, w.reset(), t("forget").hidden = !1), !o.ok) throw new Error(i.error || i.receipt?.code || "Request rejected.");
  return i;
}
function x() {
  return {
    available: T.available,
    menuOpen: v,
    blocked: !s || !l || W || f || d || u || s.paused || s.view.phase === "ready" || s.view.self.waiting || R || p || Y
  };
}
function ie() {
  if (!s) {
    ee.render(null);
    return;
  }
  ee.render(b.createElement(We, {
    ...x(),
    kind: T.kind,
    treat: T.treat,
    canConsume: T.canConsume,
    onSmoke: () => G("smoke"),
    onSip: () => G("drink"),
    onConsume: () => G("consume"),
    onMenuChange: se,
    onOrder: (e) => {
      const n = x();
      !n.blocked && n.available && (Ue(e) ? l?.orderDrink(e) : l?.orderTreat(e)) && se(!1);
    }
  }));
}
function G(e) {
  const n = x();
  n.blocked || n.menuOpen || !n.available || (e === "smoke" ? l?.smokeCigar() : e === "consume" ? l?.consumeTreat() : l?.sipDrink(), N());
}
function se(e) {
  e && x().blocked || (v = e, P++, F(), k(), e || N());
}
function ge(e, n = !1) {
  const a = n ? -1 : e;
  if (l && be !== a) {
    l.dispose(), l = null;
    for (const i of J.values()) i.root.unmount();
    J.clear(), t("labels").replaceChildren();
  }
  if (l || W || document.hidden) return;
  const o = () => {
    W = !0, t("error").textContent = "3D rendering unavailable. Reload this tab to reconnect without losing your seat.";
  };
  try {
    l = new He(t("scene"), o, void 0, (i) => {
      T = i, ie();
    }, e), l.setLookEnabled(B), l.setDrinkEffect(t("drink-effect").value), be = a;
    for (let i = 1; i < 6; i++) {
      const c = document.createElement("div");
      c.className = "seat", t("labels").append(c), J.set(i, { node: c, root: L.createRoot(c) }), l.bindWorldLabel(i, c);
    }
    l.bindWorldLabel(-1, t("pot")), l.onAudioListener = (i) => g.setListenerMatrix(i);
  } catch {
    o();
  }
}
function k() {
  if (t("entry").hidden = !!s, t("table").hidden = !s, t("inspect").hidden = t("details").hidden = !s, Ye.render(b.createElement(
    Ae,
    { onLobby: () => {
      s && A(!0);
    } },
    b.createElement("button", { "aria-label": C ? "Unmute sound" : "Mute sound", title: "Sound (M)", onClick: () => {
      C = !C, g.setMuted(C), C || g.unlock(), k();
    } }, C ? "♪̸" : "♪"),
    s && b.createElement("button", { "aria-label": "Settings", title: "Table settings", onClick: () => A(!0) }, "⚙"),
    s && b.createElement("button", { "aria-label": "Recenter view", title: "Drag the room to look · Recenter (R)", disabled: x().blocked || v, onClick: () => {
      l?.recenterLook(), N();
    } }, "⌖"),
    s?.isHost && b.createElement("button", { "aria-label": s.paused ? "Resume table" : "Pause table", disabled: f, onClick: () => E(() => y("/api/pause", { paused: !s.paused })) }, s.paused ? "▶" : "Ⅱ"),
    document.fullscreenEnabled && b.createElement("button", { "aria-label": document.fullscreenElement ? "Exit fullscreen" : "Enter fullscreen", onClick: () => {
      (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {
        t("error").textContent = "Fullscreen unavailable. The game still fills the browser.";
      });
    } }, "⤢")
  )), t("app").classList.toggle("inspecting", R), z(), t("create").disabled = f || !!m, t("join").disabled = f || !!m, !s) {
    ge(0, !0), l?.setPlaying(!1), de.render(null), g.resetEvents(), fe.render(null), pe.render(null), me.render(null), t("actions").hidden = t("deal-actions").hidden = !0, R = !1, p = !1, v = !1, Y = !1, T = { kind: "old-fashioned", available: !1, treat: null, canConsume: !1 }, d = !1, U = -1, t("menu").hidden = !0, ee.render(null), ue.render(null), ye();
    return;
  }
  const e = s.view, n = e.players[e.self.seat];
  e.revision !== U && (U = e.revision, P++), ge(e.self.seat), l?.updateRemote(e, e.self.seat), l?.setPlaying(e.phase !== "ready" && !e.self.waiting), l?.setPaused(s.paused || d || u || p), (s.paused || d || u || p || e.self.waiting) && (v = !1), F(), ie();
  for (const r of e.players) if (r.displaySeat !== 0) {
    const h = J.get(r.displaySeat);
    if (!h) continue;
    h.node.classList.toggle("active", e.actor === r.seat), h.node.classList.toggle("folded", r.folded), h.node.classList.toggle("out", r.stack === 0 && !r.committed), h.node.style.setProperty("--seat-color", ce[r.seat].color), h.root.render(b.createElement(De, {
      name: r.name,
      dealer: e.dealer === r.seat,
      blind: e.smallBlindSeat === r.seat ? "SB" : e.bigBlindSeat === r.seat ? "BB" : "",
      stack: r.stack,
      action: e.actor === r.seat ? r.kind === "human" ? "DECIDING" : "THINKING" : r.action || ce[r.seat].title,
      visibleCards: r.cards.kind === "visible" ? r.cards.values : []
    }));
  }
  t("labels").hidden = R, t("connection").textContent = d || u ? "Connection interrupted — wagering disabled" : s.hostConnected ? s.paused ? "Table paused" : e.self.waiting ? "Seat reserved — joining next hand" : e.actor === e.self.seat ? "Your move" : "Connected · LAN" : "Host disconnected — table suspended", t("invite").textContent = s.code ? `Lobby code: ${s.code.slice(0, 5)}-${s.code.slice(5)}` : "Six playing seats · empty seats are NPCs", t("host-storage").textContent = s.durable ? "Host saves this table privately. A host restart pauses play until the host resumes." : "Disposable host: stopping its process ends this table.";
  const a = e.phase === "betting" ? ["Pre-flop", "Flop", "Turn", "River"][e.street] : e.phase === "ready" ? "Waiting for host" : e.phase === "complete" ? "Hand complete" : e.phase === "showdown" ? "Showdown" : "Dealing", o = e.phase === "complete" ? e.results.filter((r) => r.won > 0).map((r) => `${e.players[r.seat].name} wins ${r.won}`).join(" · ") : "", i = n.cards.kind === "visible" ? n.cards.values : [], c = e.phase === "complete", Z = e.phase === "betting" && e.actor === e.self.seat, Ee = i.length === 2 && e.board.length >= 3 ? je([...i, ...e.board]).name : "Practice chips", Se = d || u ? "Connection interrupted" : s.paused ? "Table paused" : e.self.waiting ? "Your seat is reserved." : c ? o : Z ? "Your move." : e.actor !== null ? `${e.players[e.actor].name} is thinking…` : a;
  me.render(b.createElement(Ie, { handNumber: e.handNumber, smallBlind: e.smallBlind, bigBlind: e.bigBlind })), pe.render(b.createElement(Ke, { finished: c, amount: c ? e.awards.reduce((r, h) => r + h.amount, 0) : e.pot, sidePots: e.awards.length - 1 })), fe.render(b.createElement(Pe, {
    board: e.board,
    street: $e[e.street],
    ownCards: i,
    stack: n.stack,
    position: `${e.dealer === n.seat ? " · DEALER" : ""}${e.smallBlindSeat === n.seat ? " · SB" : ""}${e.bigBlindSeat === n.seat ? " · BB" : ""}`,
    handLabel: n.folded ? "Folded" : Ee,
    status: Se,
    detail: f ? "Sending…" : e.self.waiting ? "Joining at the next hand" : n.action,
    winningCards: c ? e.results.find((r) => r.seat === n.seat && r.won > 0)?.hand?.cards ?? [] : [],
    withActions: Z || c || e.phase === "ready"
  })), g.observe(
    e.gameRevision,
    {
      hand: e.handNumber,
      phase: e.phase,
      actor: e.actor,
      boardCount: e.board.length,
      players: e.players.map((r) => ({ seat: r.seat, stack: r.stack, bet: r.bet, folded: r.folded, action: r.action }))
    },
    !s.paused && !d && !u && !p && !e.self.waiting && V && !document.hidden,
    e.self.seat
  ), t("players").replaceChildren(...[...e.players].sort((r, h) => r.displaySeat - h.displaySeat).map((r) => {
    const h = document.createElement("li");
    return h.textContent = `${r.name} · ${r.kind}${r.pendingName ? " · next: " + r.pendingName : ""} · ${r.stack} chips · ${r.action || "waiting"}${e.actor === r.seat ? " · to act" : ""}`, h;
  })), t("deal-actions").hidden = !s.isHost || !["ready", "complete"].includes(e.phase) || s.paused || p, t("pause").hidden = !s.isHost, t("start").disabled = f || s.paused || d || u, t("pause").disabled = f, t("pause").textContent = s.paused ? "Resume table" : "Pause table", t("leave").disabled = f, t("leave").textContent = s.isHost ? "End session for everyone" : "Leave table", ue.render(b.createElement(Me, {
    offer: e.self.bank,
    revision: e.revision,
    blocked: f || s.paused || d || u || !p,
    onConfirm: Xe
  }));
  const Re = !f && !s.paused && !d && !u && !p && !v && !e.self.waiting && e.actor === e.self.seat && e.phase === "betting";
  t("actions").hidden = !Z || s.paused || p || d || u, de.render(b.createElement(Fe, {
    ref: ke,
    revision: P,
    blocked: !Re,
    legal: e.legal,
    pot: e.pot,
    currentBet: e.currentBet,
    ownBet: n.bet,
    bigBlind: e.bigBlind,
    onAction: _e,
    onOpenChange: Ve,
    focusTable: N
  })), t("inspect").disabled = s.paused || e.self.waiting || d || u || p, t("inspect").setAttribute("aria-pressed", String(R)), t("inspect").firstChild.nodeValue = R ? "Look up " : "Cards & chips ";
}
async function E(e) {
  if (!f) {
    f = !0, t("error").textContent = "", k();
    try {
      await e();
    } catch (n) {
      n instanceof O || (P++, t("error").textContent = n.message);
    } finally {
      f = !1, k();
    }
  }
}
async function we(e) {
  $ = t("name").value, ne();
  const n = await y(e ? "/api/join" : "/api/create", { name: $, nonce: D, ...e ? { code: t("code").value } : {} });
  w.reset(), m = n.token, ne(t("remember").checked), await y("/api/state");
}
t("create").onclick = () => E(() => we(!1));
t("join").onclick = () => E(() => we(!0));
t("start").onclick = () => E(() => y("/api/start", { revision: s.view.revision }));
t("pause").onclick = () => E(() => y("/api/pause", { paused: !s.paused }));
t("leave").onclick = () => E(async () => {
  await y("/api/leave", {}), w.reset(), re(_()), m = "", s = null, D = oe(), t("connection").textContent = "Left table";
});
t("forget").onclick = () => {
  w.reset(), re(_()), m = "", s = null, u = !1, D = oe(), t("forget").hidden = !0, t("error").textContent = "", t("connection").textContent = "Not connected", k();
};
t("resume-seat").onclick = () => {
  const e = K[Number(t("saved-seats").value)];
  e && E(async () => {
    w.reset(), m = e.token, D = e.nonce, $ = e.name, u = !1, W = !1, ne(), await y("/api/state");
  });
};
t("forget-seat").onclick = () => {
  const e = K[Number(t("saved-seats").value)];
  e && (re(e), ye());
};
t("remember-current").onclick = () => {
  M.save(_(), !0) ? t("seat-note").textContent = "Seat remembered on this browser. Close this tab before resuming it in another." : t("storage-warning").textContent = "Browser storage is unavailable. Keep this tab open; the seat was not safely remembered.";
};
function _e(e) {
  if (f || u || d || p || v || !s || s.paused || s.view.actor !== s.view.self.seat) return !1;
  const n = s.view;
  return E(() => y("/api/action", { sequence: n.self.nextSequence, revision: n.revision, action: e })), !0;
}
function Xe(e, n) {
  if (f || u || d || !s || s.paused || !p || s.view.revision !== n) return !1;
  const a = s.view, o = a.self.bank;
  return (e.type === "borrow" ? !o.canBorrow : e.amount <= 0 || e.amount > o.repayMax) ? !1 : (E(() => y("/api/action", { sequence: a.self.nextSequence, revision: n, action: e })), !0);
}
function A(e) {
  p = e, t("menu").hidden = !e, F(), k(), e || N();
}
t("details").onclick = () => A(!p);
t("close-menu").onclick = () => A(!1);
for (const e of ["ambience-level", "effects-level"]) t(e).onchange = () => {
  g.setLevels(Number(t("ambience-level").value), Number(t("effects-level").value));
};
t("drink-effect").onchange = () => l?.setDrinkEffect(t("drink-effect").value);
t("look-enabled").onclick = () => {
  B = !B, l?.setLookEnabled(B), t("look-enabled").setAttribute("aria-pressed", String(B)), t("look-enabled").textContent = B ? "On" : "Off";
};
function X(e) {
  e && (v = !1), R = e, l?.setInspection(e), t("labels").hidden = e, F(), k();
}
t("inspect").onclick = () => {
  X(!R), N();
};
t("app").addEventListener("keydown", (e) => {
  const n = e.target.closest("input,select,textarea,[contenteditable=true]") ? "editing" : e.target.closest("button,a") ? "control" : "table";
  if (!s || n === "editing" || e.altKey || e.ctrlKey || e.metaKey || e.isComposing) return;
  if (e.key.toLowerCase() === "m" && !e.repeat) {
    e.preventDefault(), C = !C, g.setMuted(C), C || g.unlock(), k();
    return;
  }
  if (e.key === "Escape" && v) {
    e.preventDefault(), e.stopPropagation(), se(!1);
    return;
  }
  if (e.key === "Escape" && p) {
    e.preventDefault(), A(!1);
    return;
  }
  if (e.key.toLowerCase() === "r" && n === "table" && !e.repeat && !x().blocked && !v) {
    e.preventDefault(), l?.recenterLook();
    return;
  }
  const a = Ge(e, n, x());
  if (a) {
    e.preventDefault(), G(a);
    return;
  }
  if (!ke.current?.handleKey({
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
      e.preventDefault(), s.isHost ? E(() => y("/api/pause", { paused: !s.paused })) : A(!0);
      return;
    }
    e.key === " " && n === "table" && !p && !v && !d && !u && !s.paused && !s.view.self.waiting && (e.preventDefault(), X(!0));
  }
});
t("app").addEventListener("keyup", (e) => {
  e.key === " " && X(!1);
});
window.addEventListener("blur", () => X(!1));
t("export").onclick = () => {
  const e = new Blob([JSON.stringify({ source: "actual-browser-lan-3d-client", started: he, truncated: ve, records: te }, null, 2)], { type: "application/json" }), n = URL.createObjectURL(e), a = document.createElement("a");
  a.href = n, a.download = `poker-lan-${he.replaceAll(":", "-")}.json`, a.click(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
};
async function Ce() {
  if (!(!m || u || f || Q)) {
    Q = !0;
    try {
      await y("/api/state");
    } catch (e) {
      e instanceof O || (d = !0, t("error").textContent = e.message, k());
    } finally {
      Q = !1;
    }
  }
}
setInterval(Ce, 500);
k();
Ce();
export {
  Qe as setApiTransport
};
