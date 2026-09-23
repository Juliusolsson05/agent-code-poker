import { j as L, D as Le, d as xe, r as h, m as R, a as Be, f as Oe, T as Ne, F as le, b as Ae, C as ce, S as Te, e as De, c as je, g as Ie, h as Ke, i as Pe, k as $e, B as Me, l as Fe } from "./BankControls-Bk3MOtkt.js";
const F = "poker-lan-connection-test-v1", D = "poker-lan-saved-seat-v1:";
function j(e, n = !1) {
  if (!e || e.length > 2048) return null;
  try {
    const a = JSON.parse(e), o = n && a?.name === void 0 ? "Saved player" : a?.name;
    return !a || typeof a.token != "string" || !/^(?:[A-Za-z0-9_-]{43})?$/.test(a.token) || typeof a.nonce != "string" || !/^[a-f0-9]{64}$/.test(a.nonce) || typeof o != "string" || !o.trim() || o.length > 96 || /[\p{Cc}\p{Cf}]/u.test(o) ? null : { token: a.token, nonce: a.nonce, name: o };
  } catch {
    return null;
  }
}
class He {
  constructor(n, a) {
    this.session = n, this.local = a;
  }
  session;
  local;
  current() {
    try {
      return j(this.session().getItem(F), !0);
    } catch {
      return null;
    }
  }
  saved() {
    try {
      const n = this.local(), a = [];
      for (let o = 0; o < Math.min(n.length, 4096) && a.length < 64; o++) {
        const i = n.key(o);
        if (!i?.startsWith(D)) continue;
        const c = j(n.getItem(i));
        c?.token && i === D + c.nonce && a.push(c);
      }
      return a;
    } catch {
      return [];
    }
  }
  save(n, a) {
    const o = j(JSON.stringify(n));
    if (!o) return !1;
    let i = !0;
    try {
      this.session().setItem(F, JSON.stringify(o));
    } catch {
      i = !1;
    }
    if (a && o.token)
      try {
        this.local().setItem(D + o.nonce, JSON.stringify(o));
      } catch {
        i = !1;
      }
    return i;
  }
  forget(n) {
    let a = !0;
    try {
      const o = j(this.session().getItem(F), !0);
      o?.nonce === n.nonce && o.token === n.token && this.session().removeItem(F);
    } catch {
      a = !1;
    }
    try {
      const o = this.local();
      j(o.getItem(D + n.nonce))?.token === n.token && o.removeItem(D + n.nonce);
    } catch {
      a = !1;
    }
    return a;
  }
}
class O extends Error {
}
class Ue {
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
function Je(e, n, a) {
  return n !== "table" || a.blocked || !a.available || a.menuOpen || e.repeat || e.ctrlKey || e.altKey || e.metaKey || e.isComposing ? null : e.key.toLowerCase() === "s" ? "smoke" : e.key.toLowerCase() === "d" ? "drink" : null;
}
function qe(e) {
  const n = e.blocked || !e.available || e.menuOpen;
  return /* @__PURE__ */ L.jsxs("div", { className: "lan-leisure", children: [
    /* @__PURE__ */ L.jsxs("button", { disabled: n, onClick: e.onSmoke, children: [
      "Cigar ",
      /* @__PURE__ */ L.jsx("kbd", { children: "S" })
    ] }),
    /* @__PURE__ */ L.jsxs("button", { disabled: n, onClick: e.onSip, children: [
      Le[e.kind].label,
      " ",
      /* @__PURE__ */ L.jsx("kbd", { children: "D" })
    ] }),
    /* @__PURE__ */ L.jsx("button", { disabled: e.blocked, "aria-expanded": e.menuOpen, onClick: () => e.onMenuChange(!e.menuOpen), children: "Drinks ▾" }),
    e.menuOpen && /* @__PURE__ */ L.jsx(
      xe,
      {
        kind: e.kind,
        available: !e.blocked && e.available,
        onClose: () => e.onMenuChange(!1),
        onOrder: e.onOrder
      }
    )
  ] });
}
const t = (e) => document.getElementById(e), $ = new He(() => sessionStorage, () => localStorage), w = new Ue(), oe = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), (e) => e.toString(16).padStart(2, "0")).join("");
let b = "", T = oe(), s = null, f = !1, Z = !1, u = !1, l = null, q = !1, S = !1, p = !1, d = !1, K = 0, H = -1, y = !1, G = !1, W = { kind: "old-fashioned", available: !1 };
const U = /* @__PURE__ */ new Map(), ke = h.createRef(), de = R.createRoot(t("actions")), Q = R.createRoot(t("leisure")), ue = R.createRoot(t("bank")), Ge = R.createRoot(t("header")), fe = R.createRoot(t("hud")), pe = R.createRoot(t("pot")), be = R.createRoot(t("table-info")), g = new Be(
  Ne.fireplace ? Oe : void 0,
  [le.position[0], 0.4, le.position[2] + 0.05]
);
let C = !1, he = null, Y = document.hasFocus(), B = !0;
const V = () => g.setAmbienceActive(!!s && !s.paused && !d && !u && !p && !document.hidden && Y);
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
const N = () => t("app").focus(), M = () => l?.setLookBlocked(G || p || y), We = (e) => {
  G = e, M(), ie();
}, J = $.current();
let I = [], P = J?.name || "Guest";
J && (b = J.token, T = J.nonce, t("name").value = P);
const ee = [], me = (/* @__PURE__ */ new Date()).toISOString();
let ye = !1;
const z = () => ({ token: b, nonce: T, name: P });
function te(e = !1) {
  $.save(z(), e) || (t("storage-warning").textContent = "Browser storage is unavailable. You can play, but keep this tab open: your seat may not survive closing or reloading it.");
}
function re(e) {
  $.forget(e) || (t("storage-warning").textContent = "Browser storage blocked cleanup. This device may still remember the seat; clear its poker site data before sharing this browser.");
}
function ve() {
  I = $.saved(), t("recovery").hidden = b || !I.length, t("saved-seats").replaceChildren(...I.map((e, n) => {
    const a = document.createElement("option");
    return a.value = String(n), a.textContent = e.name, a;
  })), t("resume-seat").disabled = t("forget-seat").disabled = f;
}
function Ye(e, n, a) {
  if (ee.length >= 512) {
    ye = !0;
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
function Xe(e) {
  ne = e;
}
async function v(e, n) {
  const a = w.begin();
  let o, i;
  try {
    o = ne ? await ne({
      path: e,
      method: n === void 0 ? "GET" : "POST",
      headers: { ...n === void 0 ? {} : { "Content-Type": "application/json" }, ...b ? { Authorization: `Bearer ${b}` } : {} },
      body: n === void 0 ? void 0 : JSON.stringify(n)
    }) : await fetch(e, {
      method: n === void 0 ? "GET" : "POST",
      cache: "no-store",
      headers: { ...n === void 0 ? {} : { "Content-Type": "application/json" }, ...b ? { Authorization: `Bearer ${b}` } : {} },
      body: n === void 0 ? void 0 : JSON.stringify(n),
      signal: AbortSignal.timeout(5e3)
    }), i = await o.json();
  } catch (c) {
    throw w.failureCurrent(a) ? c : new O();
  }
  if (!w.current(a)) throw new O();
  if (Ye(e, o.status, i), i.view) {
    if (!w.accept(a, i)) throw new O();
    const c = s && i.generation !== s.generation;
    (c || d) && g.resetEvents(), c && (K++, H = -1, S = !1, l?.setInspection(!1)), s = i, d = !1, k();
  } else if (!o.ok && !w.failureCurrent(a))
    throw new O();
  if (b && [401, 410].includes(o.status) && (u = !0, w.reset(), t("forget").hidden = !1), !o.ok) throw new Error(i.error || i.receipt?.code || "Request rejected.");
  return i;
}
function x() {
  return {
    available: W.available,
    menuOpen: y,
    blocked: !s || !l || q || f || d || u || s.paused || s.view.phase === "ready" || s.view.self.waiting || S || p || G
  };
}
function ie() {
  if (!s) {
    Q.render(null);
    return;
  }
  Q.render(h.createElement(qe, {
    ...x(),
    kind: W.kind,
    onSmoke: () => ae("smoke"),
    onSip: () => ae("drink"),
    onMenuChange: se,
    onOrder: (e) => {
      const n = x();
      !n.blocked && n.available && l?.orderDrink(e) && se(!1);
    }
  }));
}
function ae(e) {
  const n = x();
  n.blocked || n.menuOpen || !n.available || (e === "smoke" ? l?.smokeCigar() : l?.sipDrink(), N());
}
function se(e) {
  e && x().blocked || (y = e, K++, M(), k(), e || N());
}
function ge(e, n = !1) {
  const a = n ? -1 : e;
  if (l && he !== a) {
    l.dispose(), l = null;
    for (const i of U.values()) i.root.unmount();
    U.clear(), t("labels").replaceChildren();
  }
  if (l || q || document.hidden) return;
  const o = () => {
    q = !0, t("error").textContent = "3D rendering unavailable. Reload this tab to reconnect without losing your seat.";
  };
  try {
    l = new Fe(t("scene"), o, void 0, (i) => {
      W = i, ie();
    }, e), l.setLookEnabled(B), he = a;
    for (let i = 1; i < 6; i++) {
      const c = document.createElement("div");
      c.className = "seat", t("labels").append(c), U.set(i, { node: c, root: R.createRoot(c) }), l.bindWorldLabel(i, c);
    }
    l.bindWorldLabel(-1, t("pot")), l.onAudioListener = (i) => g.setListenerMatrix(i);
  } catch {
    o();
  }
}
function k() {
  if (t("entry").hidden = !!s, t("table").hidden = !s, t("inspect").hidden = t("details").hidden = !s, Ge.render(h.createElement(
    Ae,
    { onLobby: () => {
      s && A(!0);
    } },
    h.createElement("button", { "aria-label": C ? "Unmute sound" : "Mute sound", title: "Sound (M)", onClick: () => {
      C = !C, g.setMuted(C), C || g.unlock(), k();
    } }, C ? "♪̸" : "♪"),
    s && h.createElement("button", { "aria-label": "Settings", title: "Table settings", onClick: () => A(!0) }, "⚙"),
    s && h.createElement("button", { "aria-label": "Recenter view", title: "Drag the room to look · Recenter (R)", disabled: x().blocked || y, onClick: () => {
      l?.recenterLook(), N();
    } }, "⌖"),
    s?.isHost && h.createElement("button", { "aria-label": s.paused ? "Resume table" : "Pause table", disabled: f, onClick: () => E(() => v("/api/pause", { paused: !s.paused })) }, s.paused ? "▶" : "Ⅱ"),
    document.fullscreenEnabled && h.createElement("button", { "aria-label": document.fullscreenElement ? "Exit fullscreen" : "Enter fullscreen", onClick: () => {
      (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {
        t("error").textContent = "Fullscreen unavailable. The game still fills the browser.";
      });
    } }, "⤢")
  )), t("app").classList.toggle("inspecting", S), V(), t("create").disabled = f || !!b, t("join").disabled = f || !!b, !s) {
    ge(0, !0), l?.setPlaying(!1), de.render(null), g.resetEvents(), fe.render(null), pe.render(null), be.render(null), t("actions").hidden = t("deal-actions").hidden = !0, S = !1, p = !1, y = !1, G = !1, W = { kind: "old-fashioned", available: !1 }, d = !1, H = -1, t("menu").hidden = !0, Q.render(null), ue.render(null), ve();
    return;
  }
  const e = s.view, n = e.players[e.self.seat];
  e.revision !== H && (H = e.revision, K++), ge(e.self.seat), l?.updateRemote(e, e.self.seat), l?.setPlaying(e.phase !== "ready" && !e.self.waiting), l?.setPaused(s.paused || d || u || p), (s.paused || d || u || p || e.self.waiting) && (y = !1), M(), ie();
  for (const r of e.players) if (r.displaySeat !== 0) {
    const m = U.get(r.displaySeat);
    if (!m) continue;
    m.node.classList.toggle("active", e.actor === r.seat), m.node.classList.toggle("folded", r.folded), m.node.classList.toggle("out", r.stack === 0 && !r.committed), m.node.style.setProperty("--seat-color", ce[r.seat].color), m.root.render(h.createElement(Te, {
      name: r.name,
      dealer: e.dealer === r.seat,
      blind: e.smallBlindSeat === r.seat ? "SB" : e.bigBlindSeat === r.seat ? "BB" : "",
      stack: r.stack,
      action: e.actor === r.seat ? r.kind === "human" ? "DECIDING" : "THINKING" : r.action || ce[r.seat].title,
      visibleCards: r.cards.kind === "visible" ? r.cards.values : []
    }));
  }
  t("labels").hidden = S, t("connection").textContent = d || u ? "Connection interrupted — wagering disabled" : s.hostConnected ? s.paused ? "Table paused" : e.self.waiting ? "Seat reserved — joining next hand" : e.actor === e.self.seat ? "Your move" : "Connected · LAN" : "Host disconnected — table suspended", t("invite").textContent = s.code ? `Lobby code: ${s.code.slice(0, 5)}-${s.code.slice(5)}` : "Six playing seats · empty seats are NPCs", t("host-storage").textContent = s.durable ? "Host saves this table privately. A host restart pauses play until the host resumes." : "Disposable host: stopping its process ends this table.";
  const a = e.phase === "betting" ? ["Pre-flop", "Flop", "Turn", "River"][e.street] : e.phase === "ready" ? "Waiting for host" : e.phase === "complete" ? "Hand complete" : e.phase === "showdown" ? "Showdown" : "Dealing", o = e.phase === "complete" ? e.results.filter((r) => r.won > 0).map((r) => `${e.players[r.seat].name} wins ${r.won}`).join(" · ") : "", i = n.cards.kind === "visible" ? n.cards.values : [], c = e.phase === "complete", X = e.phase === "betting" && e.actor === e.self.seat, Ee = i.length === 2 && e.board.length >= 3 ? De([...i, ...e.board]).name : "Practice chips", Se = d || u ? "Connection interrupted" : s.paused ? "Table paused" : e.self.waiting ? "Your seat is reserved." : c ? o : X ? "Your move." : e.actor !== null ? `${e.players[e.actor].name} is thinking…` : a;
  be.render(h.createElement(je, { handNumber: e.handNumber, smallBlind: e.smallBlind, bigBlind: e.bigBlind })), pe.render(h.createElement(Ie, { finished: c, amount: c ? e.awards.reduce((r, m) => r + m.amount, 0) : e.pot, sidePots: e.awards.length - 1 })), fe.render(h.createElement(Ke, {
    board: e.board,
    street: Pe[e.street],
    ownCards: i,
    stack: n.stack,
    position: `${e.dealer === n.seat ? " · DEALER" : ""}${e.smallBlindSeat === n.seat ? " · SB" : ""}${e.bigBlindSeat === n.seat ? " · BB" : ""}`,
    handLabel: n.folded ? "Folded" : Ee,
    status: Se,
    detail: f ? "Sending…" : e.self.waiting ? "Joining at the next hand" : n.action,
    winningCards: c ? e.results.find((r) => r.seat === n.seat && r.won > 0)?.hand?.cards ?? [] : [],
    withActions: X || c || e.phase === "ready"
  })), g.observe(
    e.gameRevision,
    {
      hand: e.handNumber,
      phase: e.phase,
      actor: e.actor,
      boardCount: e.board.length,
      players: e.players.map((r) => ({ seat: r.seat, stack: r.stack, bet: r.bet, folded: r.folded, action: r.action }))
    },
    !s.paused && !d && !u && !p && !e.self.waiting && Y && !document.hidden,
    e.self.seat
  ), t("players").replaceChildren(...[...e.players].sort((r, m) => r.displaySeat - m.displaySeat).map((r) => {
    const m = document.createElement("li");
    return m.textContent = `${r.name} · ${r.kind}${r.pendingName ? " · next: " + r.pendingName : ""} · ${r.stack} chips · ${r.action || "waiting"}${e.actor === r.seat ? " · to act" : ""}`, m;
  })), t("deal-actions").hidden = !s.isHost || !["ready", "complete"].includes(e.phase) || s.paused || p, t("pause").hidden = !s.isHost, t("start").disabled = f || s.paused || d || u, t("pause").disabled = f, t("pause").textContent = s.paused ? "Resume table" : "Pause table", t("leave").disabled = f, t("leave").textContent = s.isHost ? "End session for everyone" : "Leave table", ue.render(h.createElement($e, {
    offer: e.self.bank,
    revision: e.revision,
    blocked: f || s.paused || d || u || !p,
    onConfirm: ze
  }));
  const Re = !f && !s.paused && !d && !u && !p && !y && !e.self.waiting && e.actor === e.self.seat && e.phase === "betting";
  t("actions").hidden = !X || s.paused || p || d || u, de.render(h.createElement(Me, {
    ref: ke,
    revision: K,
    blocked: !Re,
    legal: e.legal,
    pot: e.pot,
    currentBet: e.currentBet,
    ownBet: n.bet,
    bigBlind: e.bigBlind,
    onAction: Ve,
    onOpenChange: We,
    focusTable: N
  })), t("inspect").disabled = s.paused || e.self.waiting || d || u || p, t("inspect").setAttribute("aria-pressed", String(S)), t("inspect").firstChild.nodeValue = S ? "Look up " : "Cards & chips ";
}
async function E(e) {
  if (!f) {
    f = !0, t("error").textContent = "", k();
    try {
      await e();
    } catch (n) {
      n instanceof O || (K++, t("error").textContent = n.message);
    } finally {
      f = !1, k();
    }
  }
}
async function we(e) {
  P = t("name").value, te();
  const n = await v(e ? "/api/join" : "/api/create", { name: P, nonce: T, ...e ? { code: t("code").value } : {} });
  w.reset(), b = n.token, te(t("remember").checked), await v("/api/state");
}
t("create").onclick = () => E(() => we(!1));
t("join").onclick = () => E(() => we(!0));
t("start").onclick = () => E(() => v("/api/start", { revision: s.view.revision }));
t("pause").onclick = () => E(() => v("/api/pause", { paused: !s.paused }));
t("leave").onclick = () => E(async () => {
  await v("/api/leave", {}), w.reset(), re(z()), b = "", s = null, T = oe(), t("connection").textContent = "Left table";
});
t("forget").onclick = () => {
  w.reset(), re(z()), b = "", s = null, u = !1, T = oe(), t("forget").hidden = !0, t("error").textContent = "", t("connection").textContent = "Not connected", k();
};
t("resume-seat").onclick = () => {
  const e = I[Number(t("saved-seats").value)];
  e && E(async () => {
    w.reset(), b = e.token, T = e.nonce, P = e.name, u = !1, q = !1, te(), await v("/api/state");
  });
};
t("forget-seat").onclick = () => {
  const e = I[Number(t("saved-seats").value)];
  e && (re(e), ve());
};
t("remember-current").onclick = () => {
  $.save(z(), !0) ? t("seat-note").textContent = "Seat remembered on this browser. Close this tab before resuming it in another." : t("storage-warning").textContent = "Browser storage is unavailable. Keep this tab open; the seat was not safely remembered.";
};
function Ve(e) {
  if (f || u || d || p || y || !s || s.paused || s.view.actor !== s.view.self.seat) return !1;
  const n = s.view;
  return E(() => v("/api/action", { sequence: n.self.nextSequence, revision: n.revision, action: e })), !0;
}
function ze(e, n) {
  if (f || u || d || !s || s.paused || !p || s.view.revision !== n) return !1;
  const a = s.view, o = a.self.bank;
  return (e.type === "borrow" ? !o.canBorrow : e.amount <= 0 || e.amount > o.repayMax) ? !1 : (E(() => v("/api/action", { sequence: a.self.nextSequence, revision: n, action: e })), !0);
}
function A(e) {
  p = e, t("menu").hidden = !e, M(), k(), e || N();
}
t("details").onclick = () => A(!p);
t("close-menu").onclick = () => A(!1);
for (const e of ["ambience-level", "effects-level"]) t(e).onchange = () => {
  g.setLevels(Number(t("ambience-level").value), Number(t("effects-level").value));
};
t("look-enabled").onclick = () => {
  B = !B, l?.setLookEnabled(B), t("look-enabled").setAttribute("aria-pressed", String(B)), t("look-enabled").textContent = B ? "On" : "Off";
};
function _(e) {
  e && (y = !1), S = e, l?.setInspection(e), t("labels").hidden = e, M(), k();
}
t("inspect").onclick = () => {
  _(!S), N();
};
t("app").addEventListener("keydown", (e) => {
  const n = e.target.closest("input,select,textarea,[contenteditable=true]") ? "editing" : e.target.closest("button,a") ? "control" : "table";
  if (!s || n === "editing" || e.altKey || e.ctrlKey || e.metaKey || e.isComposing) return;
  if (e.key.toLowerCase() === "m" && !e.repeat) {
    e.preventDefault(), C = !C, g.setMuted(C), C || g.unlock(), k();
    return;
  }
  if (e.key === "Escape" && y) {
    e.preventDefault(), e.stopPropagation(), se(!1);
    return;
  }
  if (e.key === "Escape" && p) {
    e.preventDefault(), A(!1);
    return;
  }
  if (e.key.toLowerCase() === "r" && n === "table" && !e.repeat && !x().blocked && !y) {
    e.preventDefault(), l?.recenterLook();
    return;
  }
  const a = Je(e, n, x());
  if (a) {
    e.preventDefault(), ae(a);
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
      e.preventDefault(), s.isHost ? E(() => v("/api/pause", { paused: !s.paused })) : A(!0);
      return;
    }
    e.key === " " && n === "table" && !p && !y && !d && !u && !s.paused && !s.view.self.waiting && (e.preventDefault(), _(!0));
  }
});
t("app").addEventListener("keyup", (e) => {
  e.key === " " && _(!1);
});
window.addEventListener("blur", () => _(!1));
t("export").onclick = () => {
  const e = new Blob([JSON.stringify({ source: "actual-browser-lan-3d-client", started: me, truncated: ye, records: ee }, null, 2)], { type: "application/json" }), n = URL.createObjectURL(e), a = document.createElement("a");
  a.href = n, a.download = `poker-lan-${me.replaceAll(":", "-")}.json`, a.click(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
};
async function Ce() {
  if (!(!b || u || f || Z)) {
    Z = !0;
    try {
      await v("/api/state");
    } catch (e) {
      e instanceof O || (d = !0, t("error").textContent = e.message, k());
    } finally {
      Z = !1;
    }
  }
}
setInterval(Ce, 500);
k();
Ce();
export {
  Xe as setApiTransport
};
