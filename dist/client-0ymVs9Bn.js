import { j as L, D as Oe, d as Ne, r as m, m as R, a as Ae, f as Te, T as De, F as de, b as je, C as ue, S as Ie, e as Ke, c as Pe, g as $e, h as Me, i as He, k as Fe, B as Ue, l as Je } from "./BankControls-mEQDJqwz.js";
const F = "poker-lan-connection-test-v1", j = "poker-lan-saved-seat-v1:";
function I(e, n = !1) {
  if (!e || e.length > 2048) return null;
  try {
    const a = JSON.parse(e), o = n && a?.name === void 0 ? "Saved player" : a?.name;
    return !a || typeof a.token != "string" || !/^(?:[A-Za-z0-9_-]{43})?$/.test(a.token) || typeof a.nonce != "string" || !/^[a-f0-9]{64}$/.test(a.nonce) || typeof o != "string" || !o.trim() || o.length > 96 || /[\p{Cc}\p{Cf}]/u.test(o) ? null : { token: a.token, nonce: a.nonce, name: o };
  } catch {
    return null;
  }
}
class qe {
  constructor(n, a) {
    this.session = n, this.local = a;
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
      const n = this.local(), a = [];
      for (let o = 0; o < Math.min(n.length, 4096) && a.length < 64; o++) {
        const i = n.key(o);
        if (!i?.startsWith(j)) continue;
        const d = I(n.getItem(i));
        d?.token && i === j + d.nonce && a.push(d);
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
      this.session().setItem(F, JSON.stringify(o));
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
      const o = I(this.session().getItem(F), !0);
      o?.nonce === n.nonce && o.token === n.token && this.session().removeItem(F);
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
class N extends Error {
}
class Ge {
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
function We(e, n, a) {
  return n !== "table" || a.blocked || !a.available || a.menuOpen || e.repeat || e.ctrlKey || e.altKey || e.metaKey || e.isComposing ? null : e.key.toLowerCase() === "s" ? "smoke" : e.key.toLowerCase() === "d" ? "drink" : null;
}
function Ye(e) {
  const n = e.blocked || !e.available || e.menuOpen;
  return /* @__PURE__ */ L.jsxs("div", { className: "lan-leisure", children: [
    /* @__PURE__ */ L.jsxs("button", { disabled: n, onClick: e.onSmoke, children: [
      "Cigar ",
      /* @__PURE__ */ L.jsx("kbd", { children: "S" })
    ] }),
    /* @__PURE__ */ L.jsxs("button", { disabled: n, onClick: e.onSip, children: [
      Oe[e.kind].label,
      " ",
      /* @__PURE__ */ L.jsx("kbd", { children: "D" })
    ] }),
    /* @__PURE__ */ L.jsx("button", { disabled: e.blocked, "aria-expanded": e.menuOpen, onClick: () => e.onMenuChange(!e.menuOpen), children: "Drinks ▾" }),
    e.menuOpen && /* @__PURE__ */ L.jsx(
      Ne,
      {
        kind: e.kind,
        available: !e.blocked && e.available,
        onClose: () => e.onMenuChange(!1),
        onOrder: e.onOrder
      }
    )
  ] });
}
const t = (e) => document.getElementById(e), M = new qe(() => sessionStorage, () => localStorage), w = new Ge(), re = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), (e) => e.toString(16).padStart(2, "0")).join("");
let h = "", D = re(), s = null, f = !1, Z = !1, c = !1, l = null, G = !1, S = !1, p = !1, u = !1, P = 0, U = -1, y = !1, W = !1, x = { kind: "old-fashioned", available: !1 };
const J = /* @__PURE__ */ new Map(), we = m.createRef(), fe = R.createRoot(t("actions")), Q = R.createRoot(t("leisure")), pe = R.createRoot(t("bank")), Ve = R.createRoot(t("header")), he = R.createRoot(t("hud")), me = R.createRoot(t("pot")), be = R.createRoot(t("table-info")), g = new Ae(
  De.fireplace ? Te : void 0,
  [de.position[0], 0.4, de.position[2] + 0.05]
);
let C = !1, ge = null, Y = document.hasFocus(), O = !0;
const V = () => g.setAmbienceActive(!!s && !s.paused && !u && !c && !p && !document.hidden && Y);
t("app").addEventListener("pointerdown", () => g.unlock());
t("app").addEventListener("keydown", (e) => {
  e.repeat || g.unlock();
});
document.addEventListener("visibilitychange", () => {
  V(), document.hidden || k();
});
document.addEventListener("fullscreenchange", () => k());
window.addEventListener("blur", () => {
  Y = !1, V();
});
window.addEventListener("focus", () => {
  Y = !0, V();
});
window.addEventListener("pagehide", () => g.dispose(), { once: !0 });
const A = () => t("app").focus(), H = () => l?.setLookBlocked(W || p || y), ze = (e) => {
  W = e, H(), le();
}, q = M.current();
let K = [], $ = q?.name || "Guest";
q && (h = q.token, D = q.nonce, t("name").value = $);
const ee = [], ke = (/* @__PURE__ */ new Date()).toISOString();
let Ce = !1;
const z = () => ({ token: h, nonce: D, name: $ });
function te(e = !1) {
  M.save(z(), e) || (t("storage-warning").textContent = "Browser storage is unavailable. You can play, but keep this tab open: your seat may not survive closing or reloading it.");
}
function ie(e) {
  M.forget(e) || (t("storage-warning").textContent = "Browser storage blocked cleanup. This device may still remember the seat; clear its poker site data before sharing this browser.");
}
function Ee() {
  K = M.saved(), t("recovery").hidden = h || !K.length, t("saved-seats").replaceChildren(...K.map((e, n) => {
    const a = document.createElement("option");
    return a.value = String(n), a.textContent = e.name, a;
  })), t("resume-seat").disabled = t("forget-seat").disabled = f;
}
function _e(e, n, a) {
  if (ee.length >= 512) {
    Ce = !0;
    return;
  }
  const o = a?.view;
  ee.push({ at: performance.now(), path: e, status: n, ...o ? {
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
let ne = null;
function tt(e) {
  ne = e;
}
async function v(e, n) {
  const a = w.begin();
  let o, i;
  try {
    o = ne ? await ne({
      path: e,
      method: n === void 0 ? "GET" : "POST",
      headers: { ...n === void 0 ? {} : { "Content-Type": "application/json" }, ...h ? { Authorization: `Bearer ${h}` } : {} },
      body: n === void 0 ? void 0 : JSON.stringify(n)
    }) : await fetch(e, {
      method: n === void 0 ? "GET" : "POST",
      cache: "no-store",
      headers: { ...n === void 0 ? {} : { "Content-Type": "application/json" }, ...h ? { Authorization: `Bearer ${h}` } : {} },
      body: n === void 0 ? void 0 : JSON.stringify(n),
      signal: AbortSignal.timeout(5e3)
    }), i = await o.json();
  } catch (d) {
    throw w.failureCurrent(a) ? d : new N();
  }
  if (!w.current(a)) throw new N();
  if (_e(e, o.status, i), i.view) {
    if (!w.accept(a, i)) throw new N();
    const d = s && i.generation !== s.generation;
    (d || u) && g.resetEvents(), d && (P++, U = -1, S = !1, l?.setInspection(!1)), s = i, u = !1, k();
  } else if (!o.ok && !w.failureCurrent(a))
    throw new N();
  if (h && [401, 410].includes(o.status) && (c = !0, w.reset(), t("forget").hidden = !1), !o.ok) throw new Error(i.error || i.receipt?.code || "Request rejected.");
  return i;
}
function B() {
  return {
    available: x.available,
    menuOpen: y,
    blocked: !s || !l || G || f || u || c || s.paused || s.view.phase === "ready" || s.view.self.waiting || S || p || W
  };
}
function le() {
  if (!s) {
    Q.render(null);
    return;
  }
  Q.render(m.createElement(Ye, {
    ...B(),
    kind: x.kind,
    onSmoke: () => se("smoke"),
    onSip: () => se("drink"),
    onMenuChange: oe,
    onOrder: (e) => {
      const n = B();
      !n.blocked && n.available && l?.orderDrink(e) && (ce({ action: "order", kind: e }), oe(!1));
    }
  }));
}
let ae = !1, ye = -1 / 0;
function ce(e) {
  !h || c || (ae = !0, v("/api/leisure", e).catch(() => {
  }).finally(() => {
    ae = !1;
  }));
}
function se(e) {
  const n = B();
  if (n.blocked || n.menuOpen || !n.available) return;
  (e === "smoke" ? l?.smokeCigar() : l?.sipDrink()) && ce(e === "smoke" ? { action: "smoke" } : { action: "sip", kind: x.kind }), A();
}
function Xe(e) {
  const n = e.players[e.self.seat]?.leisure;
  !n || n.drinkKind === x.kind || ae || s.paused || e.self.waiting || u || c || !l || performance.now() - ye < 3e3 || (ye = performance.now(), ce({ action: "order", kind: x.kind }));
}
function oe(e) {
  e && B().blocked || (y = e, P++, H(), k(), e || A());
}
function ve(e, n = !1) {
  const a = n ? -1 : e;
  if (l && ge !== a) {
    l.dispose(), l = null;
    for (const i of J.values()) i.root.unmount();
    J.clear(), t("labels").replaceChildren();
  }
  if (l || G || document.hidden) return;
  const o = () => {
    G = !0, t("error").textContent = "3D rendering unavailable. Reload this tab to reconnect without losing your seat.";
  };
  try {
    l = new Je(t("scene"), o, void 0, (i) => {
      x = i, le();
    }, e), l.setLookEnabled(O), ge = a;
    for (let i = 1; i < 6; i++) {
      const d = document.createElement("div");
      d.className = "seat", t("labels").append(d), J.set(i, { node: d, root: R.createRoot(d) }), l.bindWorldLabel(i, d);
    }
    l.bindWorldLabel(-1, t("pot")), l.onAudioListener = (i) => g.setListenerMatrix(i);
  } catch {
    o();
  }
}
function k() {
  if (t("entry").hidden = !!s, t("table").hidden = !s, t("inspect").hidden = t("details").hidden = !s, Ve.render(m.createElement(
    je,
    { onLobby: () => {
      s && T(!0);
    } },
    m.createElement("button", { "aria-label": C ? "Unmute sound" : "Mute sound", title: "Sound (M)", onClick: () => {
      C = !C, g.setMuted(C), C || g.unlock(), k();
    } }, C ? "♪̸" : "♪"),
    s && m.createElement("button", { "aria-label": "Settings", title: "Table settings", onClick: () => T(!0) }, "⚙"),
    s && m.createElement("button", { "aria-label": "Recenter view", title: "Drag the room to look · Recenter (R)", disabled: B().blocked || y, onClick: () => {
      l?.recenterLook(), A();
    } }, "⌖"),
    s?.isHost && m.createElement("button", { "aria-label": s.paused ? "Resume table" : "Pause table", disabled: f, onClick: () => E(() => v("/api/pause", { paused: !s.paused })) }, s.paused ? "▶" : "Ⅱ"),
    document.fullscreenEnabled && m.createElement("button", { "aria-label": document.fullscreenElement ? "Exit fullscreen" : "Enter fullscreen", onClick: () => {
      (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {
        t("error").textContent = "Fullscreen unavailable. The game still fills the browser.";
      });
    } }, "⤢")
  )), t("app").classList.toggle("inspecting", S), V(), t("create").disabled = f || !!h, t("join").disabled = f || !!h, !s) {
    ve(0, !0), l?.setPlaying(!1), fe.render(null), g.resetEvents(), he.render(null), me.render(null), be.render(null), t("actions").hidden = t("deal-actions").hidden = !0, S = !1, p = !1, y = !1, W = !1, x = { kind: "old-fashioned", available: !1 }, u = !1, U = -1, t("menu").hidden = !0, Q.render(null), pe.render(null), Ee();
    return;
  }
  const e = s.view, n = e.players[e.self.seat];
  e.revision !== U && (U = e.revision, P++), ve(e.self.seat), l?.updateRemote(e, e.self.seat), l?.setPlaying(e.phase !== "ready" && !e.self.waiting), l?.setPaused(s.paused || u || c || p), (s.paused || u || c || p || e.self.waiting) && (y = !1), H(), le(), Xe(e);
  for (const r of e.players) if (r.displaySeat !== 0) {
    const b = J.get(r.displaySeat);
    if (!b) continue;
    b.node.classList.toggle("active", e.actor === r.seat), b.node.classList.toggle("folded", r.folded), b.node.classList.toggle("out", r.stack === 0 && !r.committed), b.node.style.setProperty("--seat-color", ue[r.seat].color), b.root.render(m.createElement(Ie, {
      name: r.name,
      dealer: e.dealer === r.seat,
      blind: e.smallBlindSeat === r.seat ? "SB" : e.bigBlindSeat === r.seat ? "BB" : "",
      stack: r.stack,
      action: e.actor === r.seat ? r.kind === "human" ? "DECIDING" : "THINKING" : r.action || ue[r.seat].title,
      visibleCards: r.cards.kind === "visible" ? r.cards.values : []
    }));
  }
  t("labels").hidden = S, t("connection").textContent = u || c ? "Connection interrupted — wagering disabled" : s.hostConnected ? s.paused ? "Table paused" : e.self.waiting ? "Seat reserved — joining next hand" : e.actor === e.self.seat ? "Your move" : "Connected · LAN" : "Host disconnected — table suspended", t("invite").textContent = s.code ? `Lobby code: ${s.code.slice(0, 5)}-${s.code.slice(5)}` : "Six playing seats · empty seats are NPCs", t("host-storage").textContent = s.durable ? "Host saves this table privately. A host restart pauses play until the host resumes." : "Disposable host: stopping its process ends this table.";
  const a = e.phase === "betting" ? ["Pre-flop", "Flop", "Turn", "River"][e.street] : e.phase === "ready" ? "Waiting for host" : e.phase === "complete" ? "Hand complete" : e.phase === "showdown" ? "Showdown" : "Dealing", o = e.phase === "complete" ? e.results.filter((r) => r.won > 0).map((r) => `${e.players[r.seat].name} wins ${r.won}`).join(" · ") : "", i = n.cards.kind === "visible" ? n.cards.values : [], d = e.phase === "complete", X = e.phase === "betting" && e.actor === e.self.seat, Le = i.length === 2 && e.board.length >= 3 ? Ke([...i, ...e.board]).name : "Practice chips", xe = u || c ? "Connection interrupted" : s.paused ? "Table paused" : e.self.waiting ? "Your seat is reserved." : d ? o : X ? "Your move." : e.actor !== null ? `${e.players[e.actor].name} is thinking…` : a;
  be.render(m.createElement(Pe, { handNumber: e.handNumber, smallBlind: e.smallBlind, bigBlind: e.bigBlind })), me.render(m.createElement($e, { finished: d, amount: d ? e.awards.reduce((r, b) => r + b.amount, 0) : e.pot, sidePots: e.awards.length - 1 })), he.render(m.createElement(Me, {
    board: e.board,
    street: He[e.street],
    ownCards: i,
    stack: n.stack,
    position: `${e.dealer === n.seat ? " · DEALER" : ""}${e.smallBlindSeat === n.seat ? " · SB" : ""}${e.bigBlindSeat === n.seat ? " · BB" : ""}`,
    handLabel: n.folded ? "Folded" : Le,
    status: xe,
    detail: f ? "Sending…" : e.self.waiting ? "Joining at the next hand" : n.action,
    winningCards: d ? e.results.find((r) => r.seat === n.seat && r.won > 0)?.hand?.cards ?? [] : [],
    withActions: X || d || e.phase === "ready"
  })), g.observe(
    e.gameRevision,
    {
      hand: e.handNumber,
      phase: e.phase,
      actor: e.actor,
      boardCount: e.board.length,
      players: e.players.map((r) => ({ seat: r.seat, stack: r.stack, bet: r.bet, folded: r.folded, action: r.action }))
    },
    !s.paused && !u && !c && !p && !e.self.waiting && Y && !document.hidden,
    e.self.seat
  ), t("players").replaceChildren(...[...e.players].sort((r, b) => r.displaySeat - b.displaySeat).map((r) => {
    const b = document.createElement("li");
    return b.textContent = `${r.name} · ${r.kind}${r.pendingName ? " · next: " + r.pendingName : ""} · ${r.stack} chips · ${r.action || "waiting"}${e.actor === r.seat ? " · to act" : ""}`, b;
  })), t("deal-actions").hidden = !s.isHost || !["ready", "complete"].includes(e.phase) || s.paused || p, t("pause").hidden = !s.isHost, t("start").disabled = f || s.paused || u || c, t("pause").disabled = f, t("pause").textContent = s.paused ? "Resume table" : "Pause table", t("leave").disabled = f, t("leave").textContent = s.isHost ? "End session for everyone" : "Leave table", pe.render(m.createElement(Fe, {
    offer: e.self.bank,
    revision: e.revision,
    blocked: f || s.paused || u || c || !p,
    onConfirm: Qe
  }));
  const Be = !f && !s.paused && !u && !c && !p && !y && !e.self.waiting && e.actor === e.self.seat && e.phase === "betting";
  t("actions").hidden = !X || s.paused || p || u || c, fe.render(m.createElement(Ue, {
    ref: we,
    revision: P,
    blocked: !Be,
    legal: e.legal,
    pot: e.pot,
    currentBet: e.currentBet,
    ownBet: n.bet,
    bigBlind: e.bigBlind,
    onAction: Ze,
    onOpenChange: ze,
    focusTable: A
  })), t("inspect").disabled = s.paused || e.self.waiting || u || c || p, t("inspect").setAttribute("aria-pressed", String(S)), t("inspect").firstChild.nodeValue = S ? "Look up " : "Cards & chips ";
}
async function E(e) {
  if (!f) {
    f = !0, t("error").textContent = "", k();
    try {
      await e();
    } catch (n) {
      n instanceof N || (P++, t("error").textContent = n.message);
    } finally {
      f = !1, k();
    }
  }
}
async function Se(e) {
  $ = t("name").value, te();
  const n = await v(e ? "/api/join" : "/api/create", { name: $, nonce: D, ...e ? { code: t("code").value } : {} });
  w.reset(), h = n.token, te(t("remember").checked), await v("/api/state");
}
t("create").onclick = () => E(() => Se(!1));
t("join").onclick = () => E(() => Se(!0));
t("start").onclick = () => E(() => v("/api/start", { revision: s.view.revision }));
t("pause").onclick = () => E(() => v("/api/pause", { paused: !s.paused }));
t("leave").onclick = () => E(async () => {
  await v("/api/leave", {}), w.reset(), ie(z()), h = "", s = null, D = re(), t("connection").textContent = "Left table";
});
t("forget").onclick = () => {
  w.reset(), ie(z()), h = "", s = null, c = !1, D = re(), t("forget").hidden = !0, t("error").textContent = "", t("connection").textContent = "Not connected", k();
};
t("resume-seat").onclick = () => {
  const e = K[Number(t("saved-seats").value)];
  e && E(async () => {
    w.reset(), h = e.token, D = e.nonce, $ = e.name, c = !1, G = !1, te(), await v("/api/state");
  });
};
t("forget-seat").onclick = () => {
  const e = K[Number(t("saved-seats").value)];
  e && (ie(e), Ee());
};
t("remember-current").onclick = () => {
  M.save(z(), !0) ? t("seat-note").textContent = "Seat remembered on this browser. Close this tab before resuming it in another." : t("storage-warning").textContent = "Browser storage is unavailable. Keep this tab open; the seat was not safely remembered.";
};
function Ze(e) {
  if (f || c || u || p || y || !s || s.paused || s.view.actor !== s.view.self.seat) return !1;
  const n = s.view;
  return E(() => v("/api/action", { sequence: n.self.nextSequence, revision: n.revision, action: e })), !0;
}
function Qe(e, n) {
  if (f || c || u || !s || s.paused || !p || s.view.revision !== n) return !1;
  const a = s.view, o = a.self.bank;
  return (e.type === "borrow" ? !o.canBorrow : e.amount <= 0 || e.amount > o.repayMax) ? !1 : (E(() => v("/api/action", { sequence: a.self.nextSequence, revision: n, action: e })), !0);
}
function T(e) {
  p = e, t("menu").hidden = !e, H(), k(), e || A();
}
t("details").onclick = () => T(!p);
t("close-menu").onclick = () => T(!1);
for (const e of ["ambience-level", "effects-level"]) t(e).onchange = () => {
  g.setLevels(Number(t("ambience-level").value), Number(t("effects-level").value));
};
t("look-enabled").onclick = () => {
  O = !O, l?.setLookEnabled(O), t("look-enabled").setAttribute("aria-pressed", String(O)), t("look-enabled").textContent = O ? "On" : "Off";
};
function _(e) {
  e && (y = !1), S = e, l?.setInspection(e), t("labels").hidden = e, H(), k();
}
t("inspect").onclick = () => {
  _(!S), A();
};
t("app").addEventListener("keydown", (e) => {
  const n = e.target.closest("input,select,textarea,[contenteditable=true]") ? "editing" : e.target.closest("button,a") ? "control" : "table";
  if (!s || n === "editing" || e.altKey || e.ctrlKey || e.metaKey || e.isComposing) return;
  if (e.key.toLowerCase() === "m" && !e.repeat) {
    e.preventDefault(), C = !C, g.setMuted(C), C || g.unlock(), k();
    return;
  }
  if (e.key === "Escape" && y) {
    e.preventDefault(), e.stopPropagation(), oe(!1);
    return;
  }
  if (e.key === "Escape" && p) {
    e.preventDefault(), T(!1);
    return;
  }
  if (e.key.toLowerCase() === "r" && n === "table" && !e.repeat && !B().blocked && !y) {
    e.preventDefault(), l?.recenterLook();
    return;
  }
  const a = We(e, n, B());
  if (a) {
    e.preventDefault(), se(a);
    return;
  }
  if (!we.current?.handleKey({
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
      e.preventDefault(), s.isHost ? E(() => v("/api/pause", { paused: !s.paused })) : T(!0);
      return;
    }
    e.key === " " && n === "table" && !p && !y && !u && !c && !s.paused && !s.view.self.waiting && (e.preventDefault(), _(!0));
  }
});
t("app").addEventListener("keyup", (e) => {
  e.key === " " && _(!1);
});
window.addEventListener("blur", () => _(!1));
t("export").onclick = () => {
  const e = new Blob([JSON.stringify({ source: "actual-browser-lan-3d-client", started: ke, truncated: Ce, records: ee }, null, 2)], { type: "application/json" }), n = URL.createObjectURL(e), a = document.createElement("a");
  a.href = n, a.download = `poker-lan-${ke.replaceAll(":", "-")}.json`, a.click(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
};
async function Re() {
  if (!(!h || c || f || Z)) {
    Z = !0;
    try {
      await v("/api/state");
    } catch (e) {
      e instanceof N || (u = !0, t("error").textContent = e.message, k());
    } finally {
      Z = !1;
    }
  }
}
setInterval(Re, 500);
k();
Re();
export {
  tt as setApiTransport
};
