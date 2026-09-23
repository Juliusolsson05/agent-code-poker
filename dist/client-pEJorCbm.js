import { j as S, D as Ae, d as De, g as je, r as m, o as T, a as $e, f as Ie, T as Ke, F as he, b as Pe, C as pe, S as Fe, e as Me, c as He, h as Ue, k as Je, l as Ge, m as qe, B as We, n as Ye, i as me } from "./BankControls-B9_BNN5D.js";
const G = "poker-lan-connection-test-v1", I = "poker-lan-saved-seat-v1:";
function K(e, t = !1) {
  if (!e || e.length > 2048) return null;
  try {
    const a = JSON.parse(e), s = t && a?.name === void 0 ? "Saved player" : a?.name;
    if (!a || typeof a.token != "string" || !/^(?:[A-Za-z0-9_-]{43})?$/.test(a.token) || typeof a.nonce != "string" || !/^[a-f0-9]{64}$/.test(a.nonce) || typeof s != "string" || !s.trim() || s.length > 96 || /[\p{Cc}\p{Cf}]/u.test(s)) return null;
    const r = { token: a.token, nonce: a.nonce, name: s };
    return typeof a.code == "string" && /^[A-F0-9]{10}$/.test(a.code) && (r.code = a.code), typeof a.at == "number" && Number.isFinite(a.at) && a.at > 0 && (r.at = Math.floor(a.at)), r;
  } catch {
    return null;
  }
}
class ze {
  constructor(t, a) {
    this.session = t, this.local = a;
  }
  session;
  local;
  current() {
    try {
      return K(this.session().getItem(G), !0);
    } catch {
      return null;
    }
  }
  saved() {
    try {
      const t = this.local(), a = [];
      for (let s = 0; s < Math.min(t.length, 4096) && a.length < 64; s++) {
        const r = t.key(s);
        if (!r?.startsWith(I)) continue;
        const d = K(t.getItem(r));
        d?.token && r === I + d.nonce && a.push(d);
      }
      return a.sort((s, r) => (r.at ?? 0) - (s.at ?? 0));
    } catch {
      return [];
    }
  }
  save(t, a) {
    const s = K(JSON.stringify(t));
    if (!s) return !1;
    let r = !0;
    try {
      this.session().setItem(G, JSON.stringify(s));
    } catch {
      r = !1;
    }
    if (a && s.token)
      try {
        this.local().setItem(I + s.nonce, JSON.stringify(s));
      } catch {
        r = !1;
      }
    return r;
  }
  forget(t) {
    let a = !0;
    try {
      const s = K(this.session().getItem(G), !0);
      s?.nonce === t.nonce && s.token === t.token && this.session().removeItem(G);
    } catch {
      a = !1;
    }
    try {
      const s = this.local();
      K(s.getItem(I + t.nonce))?.token === t.token && s.removeItem(I + t.nonce);
    } catch {
      a = !1;
    }
    return a;
  }
}
async function Ve(e, t, a) {
  for (const s of e) {
    if (await t(s) === "accepted") return s;
    a(s);
  }
  return null;
}
function _e(e, t) {
  const a = t.trim();
  return a ? e.filter((s) => s.name.trim() === a) : [];
}
class D extends Error {
}
class Xe {
  #n = 0;
  #e = 0;
  #t;
  begin() {
    return { epoch: this.#n, version: this.#e, generation: this.#t?.generation };
  }
  reset() {
    this.#n++, this.#e = 0, this.#t = void 0;
  }
  current(t) {
    return t.epoch === this.#n;
  }
  failureCurrent(t) {
    return this.current(t) && t.version === this.#e;
  }
  accept(t, a) {
    if (!this.current(t) || typeof a.generation != "string" || !a.generation || !Number.isSafeInteger(a.observation) || a.observation < 1) return !1;
    const s = this.#t;
    return s && (a.generation === s.generation ? a.observation <= s.observation : t.generation !== s.generation) ? !1 : (this.#t = { generation: a.generation, observation: a.observation }, this.#e++, !0);
  }
}
function Ze(e, t, a) {
  if (t !== "table" || a.blocked || !a.available || a.menuOpen || e.repeat || e.ctrlKey || e.altKey || e.metaKey || e.isComposing) return null;
  const s = e.key.toLowerCase();
  return s === "s" ? "smoke" : s === "d" ? "drink" : s === "e" ? "consume" : null;
}
function Qe(e) {
  const t = e.blocked || !e.available || e.menuOpen;
  return /* @__PURE__ */ S.jsxs("div", { className: "lan-leisure", children: [
    /* @__PURE__ */ S.jsxs("button", { disabled: t, onClick: e.onSmoke, children: [
      "Cigar ",
      /* @__PURE__ */ S.jsx("kbd", { children: "S" })
    ] }),
    /* @__PURE__ */ S.jsxs("button", { disabled: t, onClick: e.onSip, children: [
      Ae[e.kind].label,
      " ",
      /* @__PURE__ */ S.jsx("kbd", { children: "D" })
    ] }),
    e.treat && /* @__PURE__ */ S.jsxs("button", { disabled: t || !e.canConsume, onClick: e.onConsume, children: [
      De[e.treat.kind].label,
      " · ",
      e.treat.remaining,
      " ",
      /* @__PURE__ */ S.jsx("kbd", { children: "E" })
    ] }),
    /* @__PURE__ */ S.jsx("button", { disabled: e.blocked, "aria-expanded": e.menuOpen, onClick: () => e.onMenuChange(!e.menuOpen), children: "Drinks ▾" }),
    e.menuOpen && /* @__PURE__ */ S.jsx(
      je,
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
const n = (e) => document.getElementById(e), x = new ze(() => sessionStorage, () => localStorage), y = new Xe(), V = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), (e) => e.toString(16).padStart(2, "0")).join("");
let p = "", O = V(), o = null, f = !1, ae = !1, c = !1, l = null, z = !1, R = !1, h = !1, u = !1, M = 0, q = -1, w = !1, _ = !1, L = { kind: "old-fashioned", available: !1, treat: null, canConsume: !1 };
const W = /* @__PURE__ */ new Map(), Se = m.createRef(), be = T.createRoot(n("actions")), se = T.createRoot(n("leisure")), ge = T.createRoot(n("bank")), et = T.createRoot(n("header")), ke = T.createRoot(n("hud")), we = T.createRoot(n("pot")), ve = T.createRoot(n("table-info")), g = new $e(
  Ke.fireplace ? Ie : void 0,
  [he.position[0], 0.4, he.position[2] + 0.05]
);
let C = !1, ye = null, X = document.hasFocus(), A = !0;
const Z = () => g.setAmbienceActive(!!o && !o.paused && !u && !c && !h && !document.hidden && X);
n("app").addEventListener("pointerdown", () => g.unlock());
n("app").addEventListener("keydown", (e) => {
  e.repeat || g.unlock();
});
document.addEventListener("visibilitychange", () => {
  Z(), document.hidden || k();
});
document.addEventListener("fullscreenchange", () => k());
window.addEventListener("blur", () => {
  X = !1, Z();
});
window.addEventListener("focus", () => {
  X = !0, Z();
});
window.addEventListener("pagehide", () => g.dispose(), { once: !0 });
const j = () => n("app").focus(), J = () => l?.setLookBlocked(_ || h || w), tt = (e) => {
  _ = e, J(), ue();
}, P = x.current();
let F = [], N = P?.name || "Guest", H = P?.code || "";
P && (p = P.token, O = P.nonce, n("name").value = N);
const oe = [], Ce = (/* @__PURE__ */ new Date()).toISOString();
let Re = !1;
const Q = () => ({ token: p, nonce: O, name: N, ...H ? { code: H } : {}, at: Date.now() }), nt = (e) => String(e || "").toUpperCase().replace(/[^A-F0-9]/g, "");
function re(e = !1) {
  x.save(Q(), e) || (n("storage-warning").textContent = "Browser storage is unavailable. You can play, but keep this tab open: your seat may not survive closing or reloading it.");
}
function ee(e) {
  x.forget(e) || (n("storage-warning").textContent = "Browser storage blocked cleanup. This device may still remember the seat; clear its poker site data before sharing this browser.");
}
function U() {
  F = x.saved(), n("recovery").hidden = p || !F.length, n("saved-seats").replaceChildren(...F.map((e, t) => {
    const a = document.createElement("option");
    a.value = String(t);
    const s = e.at ? new Date(e.at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "earlier";
    return a.textContent = `${e.name} · ${e.code ? `table ${e.code.slice(0, 5)}-${e.code.slice(5)}` : "unknown table"} · ${s}`, a;
  })), n("resume-seat").disabled = n("forget-seat").disabled = f;
}
function at(e, t, a) {
  if (oe.length >= 512) {
    Re = !0;
    return;
  }
  const s = a?.view;
  oe.push({ at: performance.now(), path: e, status: t, ...s ? {
    revision: s.revision,
    gameRevision: s.gameRevision,
    phase: s.phase,
    actor: s.actor,
    selfSeat: s.self.seat,
    waiting: s.self.waiting,
    players: s.players.map((r) => ({
      seat: r.seat,
      displaySeat: r.displaySeat,
      kind: r.kind,
      stack: r.stack,
      bet: r.bet,
      folded: r.folded,
      cards: r.cards.kind,
      connected: r.connected
    }))
  } : {} });
}
let ie = null;
function ct(e) {
  ie = e;
}
async function v(e, t) {
  const a = y.begin();
  let s, r;
  try {
    s = ie ? await ie({
      path: e,
      method: t === void 0 ? "GET" : "POST",
      headers: { ...t === void 0 ? {} : { "Content-Type": "application/json" }, ...p ? { Authorization: `Bearer ${p}` } : {} },
      body: t === void 0 ? void 0 : JSON.stringify(t)
    }) : await fetch(e, {
      method: t === void 0 ? "GET" : "POST",
      cache: "no-store",
      headers: { ...t === void 0 ? {} : { "Content-Type": "application/json" }, ...p ? { Authorization: `Bearer ${p}` } : {} },
      body: t === void 0 ? void 0 : JSON.stringify(t),
      signal: AbortSignal.timeout(5e3)
    }), r = await s.json();
  } catch (d) {
    throw y.failureCurrent(a) ? d : new D();
  }
  if (!y.current(a)) throw new D();
  if (at(e, s.status, r), r.view) {
    if (!y.accept(a, r)) throw new D();
    const d = o && r.generation !== o.generation;
    (d || u) && g.resetEvents(), d && (M++, q = -1, R = !1, l?.setInspection(!1)), o = r, u = !1, k();
  } else if (!s.ok && !y.failureCurrent(a))
    throw new D();
  if (p && [401, 410].includes(s.status) && (c = !0, y.reset(), n("forget").hidden = !1), !s.ok) throw Object.assign(new Error(r.error || r.receipt?.code || "Request rejected."), { status: s.status });
  return r;
}
function B() {
  return {
    available: L.available,
    menuOpen: w,
    blocked: !o || !l || z || f || u || c || o.paused || o.view.phase === "ready" || o.view.self.waiting || R || h || _
  };
}
function ue() {
  if (!o) {
    se.render(null);
    return;
  }
  se.render(m.createElement(Qe, {
    ...B(),
    kind: L.kind,
    treat: L.treat,
    canConsume: L.canConsume,
    onSmoke: () => Y("smoke"),
    onSip: () => Y("drink"),
    onConsume: () => Y("consume"),
    onMenuChange: de,
    onOrder: (e) => {
      const t = B();
      !t.blocked && t.available && (me(e) ? l?.orderDrink(e) : l?.orderTreat(e)) && (me(e) && fe({ action: "order", kind: e }), de(!1));
    }
  }));
}
let le = !1, ce = -1 / 0;
function fe(e) {
  !p || c || (le = !0, ce = performance.now(), v("/api/leisure", e).catch(() => {
  }).finally(() => {
    le = !1;
  }));
}
function st(e) {
  fe(e === "smoke" ? { action: "smoke" } : { action: "sip", kind: L.kind });
}
function Y(e) {
  const t = B();
  t.blocked || t.menuOpen || !t.available || (e === "smoke" ? l?.smokeCigar() : e === "consume" ? l?.consumeTreat() : l?.sipDrink(), j());
}
function ot(e) {
  const t = e.players[e.self.seat]?.leisure;
  !t || t.drinkKind === L.kind || le || o.paused || e.self.waiting || u || c || !l || performance.now() - ce < 3e3 || (ce = performance.now(), fe({ action: "order", kind: L.kind }));
}
function de(e) {
  e && B().blocked || (w = e, M++, J(), k(), e || j());
}
function Ee(e, t = !1) {
  const a = t ? -1 : e;
  if (l && ye !== a) {
    l.dispose(), l = null;
    for (const r of W.values()) r.root.unmount();
    W.clear(), n("labels").replaceChildren();
  }
  if (l || z || document.hidden) return;
  const s = () => {
    z = !0, n("error").textContent = "3D rendering unavailable. Reload this tab to reconnect without losing your seat.";
  };
  try {
    l = new Ye(n("scene"), s, void 0, (r) => {
      L = r, ue();
    }, e), l.setLookEnabled(A), l.onLeisureStarted = st, l.setDrinkEffect(n("drink-effect").value), ye = a;
    for (let r = 1; r < 6; r++) {
      const d = document.createElement("div");
      d.className = "seat", n("labels").append(d), W.set(r, { node: d, root: T.createRoot(d) }), l.bindWorldLabel(r, d);
    }
    l.bindWorldLabel(-1, n("pot")), l.onAudioListener = (r) => g.setListenerMatrix(r);
  } catch {
    s();
  }
}
function k() {
  if (n("entry").hidden = !!o, n("table").hidden = !o, n("inspect").hidden = n("details").hidden = !o, et.render(m.createElement(
    Pe,
    { onLobby: () => {
      o && $(!0);
    } },
    m.createElement("button", { "aria-label": C ? "Unmute sound" : "Mute sound", title: "Sound (M)", onClick: () => {
      C = !C, g.setMuted(C), C || g.unlock(), k();
    } }, C ? "♪̸" : "♪"),
    o && m.createElement("button", { "aria-label": "Settings", title: "Table settings", onClick: () => $(!0) }, "⚙"),
    o && m.createElement("button", { "aria-label": "Recenter view", title: "Drag the room to look · Recenter (R)", disabled: B().blocked || w, onClick: () => {
      l?.recenterLook(), j();
    } }, "⌖"),
    o?.isHost && m.createElement("button", { "aria-label": o.paused ? "Resume table" : "Pause table", disabled: f, onClick: () => E(() => v("/api/pause", { paused: !o.paused })) }, o.paused ? "▶" : "Ⅱ"),
    document.fullscreenEnabled && m.createElement("button", { "aria-label": document.fullscreenElement ? "Exit fullscreen" : "Enter fullscreen", onClick: () => {
      (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {
        n("error").textContent = "Fullscreen unavailable. The game still fills the browser.";
      });
    } }, "⤢")
  )), n("app").classList.toggle("inspecting", R), Z(), n("create").disabled = f || !!p, n("join").disabled = f || !!p, !o) {
    Ee(0, !0), l?.setPlaying(!1), be.render(null), g.resetEvents(), ke.render(null), we.render(null), ve.render(null), n("actions").hidden = n("deal-actions").hidden = !0, R = !1, h = !1, w = !1, _ = !1, L = { kind: "old-fashioned", available: !1, treat: null, canConsume: !1 }, u = !1, q = -1, n("menu").hidden = !0, se.render(null), ge.render(null), U();
    return;
  }
  const e = o.view, t = e.players[e.self.seat];
  e.revision !== q && (q = e.revision, M++), Ee(e.self.seat), l?.updateRemote(e, e.self.seat), l?.setPlaying(e.phase !== "ready" && !e.self.waiting), l?.setPaused(o.paused || u || c || h), (o.paused || u || c || h || e.self.waiting) && (w = !1), J(), ue(), ot(e);
  for (const i of e.players) if (i.displaySeat !== 0) {
    const b = W.get(i.displaySeat);
    if (!b) continue;
    b.node.classList.toggle("active", e.actor === i.seat), b.node.classList.toggle("folded", i.folded), b.node.classList.toggle("out", i.stack === 0 && !i.committed), b.node.style.setProperty("--seat-color", pe[i.seat].color), b.root.render(m.createElement(Fe, {
      name: i.name,
      dealer: e.dealer === i.seat,
      blind: e.smallBlindSeat === i.seat ? "SB" : e.bigBlindSeat === i.seat ? "BB" : "",
      stack: i.stack,
      action: e.actor === i.seat ? i.kind === "human" ? "DECIDING" : "THINKING" : i.action || pe[i.seat].title,
      visibleCards: i.cards.kind === "visible" ? i.cards.values : []
    }));
  }
  n("labels").hidden = R, n("connection").textContent = u || c ? "Connection interrupted — wagering disabled" : o.hostConnected ? o.paused ? "Table paused" : e.self.waiting ? "Seat reserved — joining next hand" : e.actor === e.self.seat ? "Your move" : "Connected · LAN" : "Host disconnected — table suspended", n("invite").textContent = o.code ? `Lobby code: ${o.code.slice(0, 5)}-${o.code.slice(5)}` : "Six playing seats · empty seats are NPCs", n("host-storage").textContent = o.durable ? "Host saves this table privately. A host restart pauses play until the host resumes." : "Disposable host: stopping its process ends this table.";
  const a = e.phase === "betting" ? ["Pre-flop", "Flop", "Turn", "River"][e.street] : e.phase === "ready" ? "Waiting for host" : e.phase === "complete" ? "Hand complete" : e.phase === "showdown" ? "Showdown" : "Dealing", s = e.phase === "complete" ? e.results.filter((i) => i.won > 0).map((i) => `${e.players[i.seat].name} wins ${i.won}`).join(" · ") : "", r = t.cards.kind === "visible" ? t.cards.values : [], d = e.phase === "complete", ne = e.phase === "betting" && e.actor === e.self.seat, Ne = r.length === 2 && e.board.length >= 3 ? Me([...r, ...e.board]).name : "Practice chips", Oe = u || c ? "Connection interrupted" : o.paused ? "Table paused" : e.self.waiting ? "Your seat is reserved." : d ? s : ne ? "Your move." : e.actor !== null ? `${e.players[e.actor].name} is thinking…` : a;
  ve.render(m.createElement(He, { handNumber: e.handNumber, smallBlind: e.smallBlind, bigBlind: e.bigBlind })), we.render(m.createElement(Ue, { finished: d, amount: d ? e.awards.reduce((i, b) => i + b.amount, 0) : e.pot, sidePots: e.awards.length - 1 })), ke.render(m.createElement(Je, {
    board: e.board,
    street: Ge[e.street],
    ownCards: r,
    stack: t.stack,
    position: `${e.dealer === t.seat ? " · DEALER" : ""}${e.smallBlindSeat === t.seat ? " · SB" : ""}${e.bigBlindSeat === t.seat ? " · BB" : ""}`,
    handLabel: t.folded ? "Folded" : Ne,
    status: Oe,
    detail: f ? "Sending…" : e.self.waiting ? "Joining at the next hand" : t.action,
    winningCards: d ? e.results.find((i) => i.seat === t.seat && i.won > 0)?.hand?.cards ?? [] : [],
    withActions: ne || d || e.phase === "ready"
  })), g.observe(
    e.gameRevision,
    {
      hand: e.handNumber,
      phase: e.phase,
      actor: e.actor,
      boardCount: e.board.length,
      players: e.players.map((i) => ({ seat: i.seat, stack: i.stack, bet: i.bet, folded: i.folded, action: i.action }))
    },
    !o.paused && !u && !c && !h && !e.self.waiting && X && !document.hidden,
    e.self.seat
  ), n("players").replaceChildren(...[...e.players].sort((i, b) => i.displaySeat - b.displaySeat).map((i) => {
    const b = document.createElement("li");
    return b.textContent = `${i.name} · ${i.kind}${i.pendingName ? " · next: " + i.pendingName : ""} · ${i.stack} chips · ${i.action || "waiting"}${e.actor === i.seat ? " · to act" : ""}`, b;
  })), n("deal-actions").hidden = !o.isHost || !["ready", "complete"].includes(e.phase) || o.paused || h, n("pause").hidden = !o.isHost, n("start").disabled = f || o.paused || u || c, n("pause").disabled = f, n("pause").textContent = o.paused ? "Resume table" : "Pause table", n("leave").disabled = f, n("leave").textContent = o.isHost ? "End session for everyone" : "Leave table", ge.render(m.createElement(qe, {
    offer: e.self.bank,
    revision: e.revision,
    blocked: f || o.paused || u || c || !h,
    onConfirm: it
  }));
  const Be = !f && !o.paused && !u && !c && !h && !w && !e.self.waiting && e.actor === e.self.seat && e.phase === "betting";
  n("actions").hidden = !ne || o.paused || h || u || c, be.render(m.createElement(We, {
    ref: Se,
    revision: M,
    blocked: !Be,
    legal: e.legal,
    pot: e.pot,
    currentBet: e.currentBet,
    ownBet: t.bet,
    bigBlind: e.bigBlind,
    onAction: rt,
    onOpenChange: tt,
    focusTable: j
  })), n("inspect").disabled = o.paused || e.self.waiting || u || c || h, n("inspect").setAttribute("aria-pressed", String(R)), n("inspect").firstChild.nodeValue = R ? "Look up " : "Cards & chips ";
}
async function E(e) {
  if (!f) {
    f = !0, n("error").textContent = "", k();
    try {
      await e();
    } catch (t) {
      t instanceof D || (M++, n("error").textContent = t.message);
    } finally {
      f = !1, k();
    }
  }
}
async function Le(e) {
  N = n("name").value, re();
  let t;
  try {
    t = await v(e ? "/api/join" : "/api/create", { name: N, nonce: O, ...e ? { code: n("code").value } : {} });
  } catch (a) {
    if (!e && a?.status === 409) {
      const s = _e(x.saved(), N);
      if (s.length && await xe(s)) return;
      throw U(), new Error(x.saved().length ? 'This host already has a table. No saved seat under this name belongs to it; choose one under "Return to a saved seat", or restart the host with a fresh table.' : "This host already has a table, and this browser has no saved seat for it. Resume from the browser that created it, or restart the host with a fresh table.");
    }
    throw a;
  }
  H = nt(t.code || (e ? n("code").value : "")), y.reset(), p = t.token, re(n("remember").checked), await v("/api/state");
}
async function xe(e) {
  const t = () => {
    y.reset(), p = "", O = V(), N = n("name").value || "Guest", H = "", o = null, c = !1, n("forget").hidden = !0;
  };
  let a;
  try {
    a = await Ve(e, async (s) => {
      y.reset(), p = s.token, O = s.nonce, N = s.name, H = s.code || "", c = !1, z = !1;
      try {
        return await v("/api/state"), "accepted";
      } catch (r) {
        if (c) return "rejected";
        throw r;
      }
    }, (s) => ee(s));
  } catch (s) {
    throw t(), U(), s;
  }
  return a ? (re(!0), !0) : (t(), U(), !1);
}
n("create").onclick = () => E(() => Le(!1));
n("join").onclick = () => E(() => Le(!0));
n("start").onclick = () => E(() => v("/api/start", { revision: o.view.revision }));
n("pause").onclick = () => E(() => v("/api/pause", { paused: !o.paused }));
n("leave").onclick = () => E(async () => {
  await v("/api/leave", {}), y.reset(), ee(Q()), p = "", o = null, O = V(), n("connection").textContent = "Left table";
});
n("forget").onclick = () => {
  y.reset(), ee(Q()), p = "", o = null, c = !1, O = V(), n("forget").hidden = !0, n("error").textContent = "", n("connection").textContent = "Not connected", k();
};
n("resume-seat").onclick = () => {
  const e = F[Number(n("saved-seats").value)];
  e && E(async () => {
    const t = [e, ...x.saved().filter((a) => a.nonce !== e.nonce)];
    if (!await xe(t)) throw new Error("None of the seats saved in this browser belong to a table on this host. They were removed; create or join a table.");
  });
};
n("forget-seat").onclick = () => {
  const e = F[Number(n("saved-seats").value)];
  e && (ee(e), U());
};
n("remember-current").onclick = () => {
  x.save(Q(), !0) ? n("seat-note").textContent = "Seat remembered on this browser. Close this tab before resuming it in another." : n("storage-warning").textContent = "Browser storage is unavailable. Keep this tab open; the seat was not safely remembered.";
};
function rt(e) {
  if (f || c || u || h || w || !o || o.paused || o.view.actor !== o.view.self.seat) return !1;
  const t = o.view;
  return E(() => v("/api/action", { sequence: t.self.nextSequence, revision: t.revision, action: e })), !0;
}
function it(e, t) {
  if (f || c || u || !o || o.paused || !h || o.view.revision !== t) return !1;
  const a = o.view, s = a.self.bank;
  return (e.type === "borrow" ? !s.canBorrow : e.amount <= 0 || e.amount > s.repayMax) ? !1 : (E(() => v("/api/action", { sequence: a.self.nextSequence, revision: t, action: e })), !0);
}
function $(e) {
  h = e, n("menu").hidden = !e, J(), k(), e || j();
}
n("details").onclick = () => $(!h);
n("close-menu").onclick = () => $(!1);
for (const e of ["ambience-level", "effects-level"]) n(e).onchange = () => {
  g.setLevels(Number(n("ambience-level").value), Number(n("effects-level").value));
};
n("drink-effect").onchange = () => l?.setDrinkEffect(n("drink-effect").value);
n("look-enabled").onclick = () => {
  A = !A, l?.setLookEnabled(A), n("look-enabled").setAttribute("aria-pressed", String(A)), n("look-enabled").textContent = A ? "On" : "Off";
};
function te(e) {
  e && (w = !1), R = e, l?.setInspection(e), n("labels").hidden = e, J(), k();
}
n("inspect").onclick = () => {
  te(!R), j();
};
n("app").addEventListener("keydown", (e) => {
  const t = e.target.closest("input,select,textarea,[contenteditable=true]") ? "editing" : e.target.closest("button,a") ? "control" : "table";
  if (!o || t === "editing" || e.altKey || e.ctrlKey || e.metaKey || e.isComposing) return;
  if (e.key.toLowerCase() === "m" && !e.repeat) {
    e.preventDefault(), C = !C, g.setMuted(C), C || g.unlock(), k();
    return;
  }
  if (e.key === "Escape" && w) {
    e.preventDefault(), e.stopPropagation(), de(!1);
    return;
  }
  if (e.key === "Escape" && h) {
    e.preventDefault(), $(!1);
    return;
  }
  if (e.key.toLowerCase() === "r" && t === "table" && !e.repeat && !B().blocked && !w) {
    e.preventDefault(), l?.recenterLook();
    return;
  }
  const a = Ze(e, t, B());
  if (a) {
    e.preventDefault(), Y(a);
    return;
  }
  if (!Se.current?.handleKey({
    key: e.key,
    repeat: e.repeat,
    shiftKey: e.shiftKey,
    altKey: e.altKey,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    nativeEvent: e,
    preventDefault: () => e.preventDefault(),
    stopPropagation: () => e.stopPropagation()
  }, t)) {
    if (e.key === "Escape" && !e.repeat && !f) {
      e.preventDefault(), o.isHost ? E(() => v("/api/pause", { paused: !o.paused })) : $(!0);
      return;
    }
    e.key === " " && t === "table" && !h && !w && !u && !c && !o.paused && !o.view.self.waiting && (e.preventDefault(), te(!0));
  }
});
n("app").addEventListener("keyup", (e) => {
  e.key === " " && te(!1);
});
window.addEventListener("blur", () => te(!1));
n("export").onclick = () => {
  const e = new Blob([JSON.stringify({ source: "actual-browser-lan-3d-client", started: Ce, truncated: Re, records: oe }, null, 2)], { type: "application/json" }), t = URL.createObjectURL(e), a = document.createElement("a");
  a.href = t, a.download = `poker-lan-${Ce.replaceAll(":", "-")}.json`, a.click(), setTimeout(() => URL.revokeObjectURL(t), 1e3);
};
async function Te() {
  if (!(!p || c || f || ae)) {
    ae = !0;
    try {
      await v("/api/state");
    } catch (e) {
      e instanceof D || (u = !0, n("error").textContent = e.message, k());
    } finally {
      ae = !1;
    }
  }
}
setInterval(Te, 500);
k();
Te();
export {
  ct as setApiTransport
};
