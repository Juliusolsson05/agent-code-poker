import { j as S, D as Ae, d as De, g as je, r as m, o as T, a as $e, f as Ie, T as Ke, F as he, b as Pe, C as pe, S as Me, e as Fe, c as He, h as Ue, k as Je, l as qe, m as Ge, B as We, n as Ye, i as me } from "./BankControls-B9_BNN5D.js";
const U = "poker-lan-connection-test-v1", $ = "poker-lan-saved-seat-v1:";
function I(e, t = !1) {
  if (!e || e.length > 2048) return null;
  try {
    const a = JSON.parse(e), o = t && a?.name === void 0 ? "Saved player" : a?.name;
    if (!a || typeof a.token != "string" || !/^(?:[A-Za-z0-9_-]{43})?$/.test(a.token) || typeof a.nonce != "string" || !/^[a-f0-9]{64}$/.test(a.nonce) || typeof o != "string" || !o.trim() || o.length > 96 || /[\p{Cc}\p{Cf}]/u.test(o)) return null;
    const r = { token: a.token, nonce: a.nonce, name: o };
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
      return I(this.session().getItem(U), !0);
    } catch {
      return null;
    }
  }
  saved() {
    try {
      const t = this.local(), a = [];
      for (let o = 0; o < Math.min(t.length, 4096) && a.length < 64; o++) {
        const r = t.key(o);
        if (!r?.startsWith($)) continue;
        const d = I(t.getItem(r));
        d?.token && r === $ + d.nonce && a.push(d);
      }
      return a.sort((o, r) => (r.at ?? 0) - (o.at ?? 0));
    } catch {
      return [];
    }
  }
  save(t, a) {
    const o = I(JSON.stringify(t));
    if (!o) return !1;
    let r = !0;
    try {
      this.session().setItem(U, JSON.stringify(o));
    } catch {
      r = !1;
    }
    if (a && o.token)
      try {
        this.local().setItem($ + o.nonce, JSON.stringify(o));
      } catch {
        r = !1;
      }
    return r;
  }
  forget(t) {
    let a = !0;
    try {
      const o = I(this.session().getItem(U), !0);
      o?.nonce === t.nonce && o.token === t.token && this.session().removeItem(U);
    } catch {
      a = !1;
    }
    try {
      const o = this.local();
      I(o.getItem($ + t.nonce))?.token === t.token && o.removeItem($ + t.nonce);
    } catch {
      a = !1;
    }
    return a;
  }
}
class A extends Error {
}
class Ve {
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
    const o = this.#t;
    return o && (a.generation === o.generation ? a.observation <= o.observation : t.generation !== o.generation) ? !1 : (this.#t = { generation: a.generation, observation: a.observation }, this.#e++, !0);
  }
}
function _e(e, t, a) {
  if (t !== "table" || a.blocked || !a.available || a.menuOpen || e.repeat || e.ctrlKey || e.altKey || e.metaKey || e.isComposing) return null;
  const o = e.key.toLowerCase();
  return o === "s" ? "smoke" : o === "d" ? "drink" : o === "e" ? "consume" : null;
}
function Xe(e) {
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
const n = (e) => document.getElementById(e), x = new ze(() => sessionStorage, () => localStorage), v = new Ve(), z = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), (e) => e.toString(16).padStart(2, "0")).join("");
let p = "", B = z(), s = null, f = !1, ne = !1, c = !1, l = null, W = !1, R = !1, h = !1, u = !1, M = 0, J = -1, w = !1, V = !1, L = { kind: "old-fashioned", available: !1, treat: null, canConsume: !1 };
const q = /* @__PURE__ */ new Map(), Se = m.createRef(), be = T.createRoot(n("actions")), ae = T.createRoot(n("leisure")), ge = T.createRoot(n("bank")), Ze = T.createRoot(n("header")), ke = T.createRoot(n("hud")), we = T.createRoot(n("pot")), ye = T.createRoot(n("table-info")), g = new $e(
  Ke.fireplace ? Ie : void 0,
  [he.position[0], 0.4, he.position[2] + 0.05]
);
let C = !1, ve = null, _ = document.hasFocus(), O = !0;
const X = () => g.setAmbienceActive(!!s && !s.paused && !u && !c && !h && !document.hidden && _);
n("app").addEventListener("pointerdown", () => g.unlock());
n("app").addEventListener("keydown", (e) => {
  e.repeat || g.unlock();
});
document.addEventListener("visibilitychange", () => {
  X(), document.hidden || k();
});
document.addEventListener("fullscreenchange", () => k());
window.addEventListener("blur", () => {
  _ = !1, X();
});
window.addEventListener("focus", () => {
  _ = !0, X();
});
window.addEventListener("pagehide", () => g.dispose(), { once: !0 });
const D = () => n("app").focus(), H = () => l?.setLookBlocked(V || h || w), Qe = (e) => {
  V = e, H(), ue();
}, K = x.current();
let P = [], F = K?.name || "Guest", Y = K?.code || "";
K && (p = K.token, B = K.nonce, n("name").value = F);
const se = [], Ce = (/* @__PURE__ */ new Date()).toISOString();
let Re = !1;
const Z = () => ({ token: p, nonce: B, name: F, ...Y ? { code: Y } : {}, at: Date.now() }), et = (e) => String(e || "").toUpperCase().replace(/[^A-F0-9]/g, "");
function oe(e = !1) {
  x.save(Z(), e) || (n("storage-warning").textContent = "Browser storage is unavailable. You can play, but keep this tab open: your seat may not survive closing or reloading it.");
}
function Q(e) {
  x.forget(e) || (n("storage-warning").textContent = "Browser storage blocked cleanup. This device may still remember the seat; clear its poker site data before sharing this browser.");
}
function de() {
  P = x.saved(), n("recovery").hidden = p || !P.length, n("saved-seats").replaceChildren(...P.map((e, t) => {
    const a = document.createElement("option");
    a.value = String(t);
    const o = e.at ? new Date(e.at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "earlier";
    return a.textContent = `${e.name} · ${e.code ? `table ${e.code.slice(0, 5)}-${e.code.slice(5)}` : "unknown table"} · ${o}`, a;
  })), n("resume-seat").disabled = n("forget-seat").disabled = f;
}
function tt(e, t, a) {
  if (se.length >= 512) {
    Re = !0;
    return;
  }
  const o = a?.view;
  se.push({ at: performance.now(), path: e, status: t, ...o ? {
    revision: o.revision,
    gameRevision: o.gameRevision,
    phase: o.phase,
    actor: o.actor,
    selfSeat: o.self.seat,
    waiting: o.self.waiting,
    players: o.players.map((r) => ({
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
let re = null;
function it(e) {
  re = e;
}
async function y(e, t) {
  const a = v.begin();
  let o, r;
  try {
    o = re ? await re({
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
    }), r = await o.json();
  } catch (d) {
    throw v.failureCurrent(a) ? d : new A();
  }
  if (!v.current(a)) throw new A();
  if (tt(e, o.status, r), r.view) {
    if (!v.accept(a, r)) throw new A();
    const d = s && r.generation !== s.generation;
    (d || u) && g.resetEvents(), d && (M++, J = -1, R = !1, l?.setInspection(!1)), s = r, u = !1, k();
  } else if (!o.ok && !v.failureCurrent(a))
    throw new A();
  if (p && [401, 410].includes(o.status) && (c = !0, v.reset(), n("forget").hidden = !1), !o.ok) throw new Error(r.error || r.receipt?.code || "Request rejected.");
  return r;
}
function N() {
  return {
    available: L.available,
    menuOpen: w,
    blocked: !s || !l || W || f || u || c || s.paused || s.view.phase === "ready" || s.view.self.waiting || R || h || V
  };
}
function ue() {
  if (!s) {
    ae.render(null);
    return;
  }
  ae.render(m.createElement(Xe, {
    ...N(),
    kind: L.kind,
    treat: L.treat,
    canConsume: L.canConsume,
    onSmoke: () => G("smoke"),
    onSip: () => G("drink"),
    onConsume: () => G("consume"),
    onMenuChange: ce,
    onOrder: (e) => {
      const t = N();
      !t.blocked && t.available && (me(e) ? l?.orderDrink(e) : l?.orderTreat(e)) && (me(e) && fe({ action: "order", kind: e }), ce(!1));
    }
  }));
}
let ie = !1, le = -1 / 0;
function fe(e) {
  !p || c || (ie = !0, le = performance.now(), y("/api/leisure", e).catch(() => {
  }).finally(() => {
    ie = !1;
  }));
}
function nt(e) {
  fe(e === "smoke" ? { action: "smoke" } : { action: "sip", kind: L.kind });
}
function G(e) {
  const t = N();
  t.blocked || t.menuOpen || !t.available || (e === "smoke" ? l?.smokeCigar() : e === "consume" ? l?.consumeTreat() : l?.sipDrink(), D());
}
function at(e) {
  const t = e.players[e.self.seat]?.leisure;
  !t || t.drinkKind === L.kind || ie || s.paused || e.self.waiting || u || c || !l || performance.now() - le < 3e3 || (le = performance.now(), fe({ action: "order", kind: L.kind }));
}
function ce(e) {
  e && N().blocked || (w = e, M++, H(), k(), e || D());
}
function Ee(e, t = !1) {
  const a = t ? -1 : e;
  if (l && ve !== a) {
    l.dispose(), l = null;
    for (const r of q.values()) r.root.unmount();
    q.clear(), n("labels").replaceChildren();
  }
  if (l || W || document.hidden) return;
  const o = () => {
    W = !0, n("error").textContent = "3D rendering unavailable. Reload this tab to reconnect without losing your seat.";
  };
  try {
    l = new Ye(n("scene"), o, void 0, (r) => {
      L = r, ue();
    }, e), l.setLookEnabled(O), l.onLeisureStarted = nt, l.setDrinkEffect(n("drink-effect").value), ve = a;
    for (let r = 1; r < 6; r++) {
      const d = document.createElement("div");
      d.className = "seat", n("labels").append(d), q.set(r, { node: d, root: T.createRoot(d) }), l.bindWorldLabel(r, d);
    }
    l.bindWorldLabel(-1, n("pot")), l.onAudioListener = (r) => g.setListenerMatrix(r);
  } catch {
    o();
  }
}
function k() {
  if (n("entry").hidden = !!s, n("table").hidden = !s, n("inspect").hidden = n("details").hidden = !s, Ze.render(m.createElement(
    Pe,
    { onLobby: () => {
      s && j(!0);
    } },
    m.createElement("button", { "aria-label": C ? "Unmute sound" : "Mute sound", title: "Sound (M)", onClick: () => {
      C = !C, g.setMuted(C), C || g.unlock(), k();
    } }, C ? "♪̸" : "♪"),
    s && m.createElement("button", { "aria-label": "Settings", title: "Table settings", onClick: () => j(!0) }, "⚙"),
    s && m.createElement("button", { "aria-label": "Recenter view", title: "Drag the room to look · Recenter (R)", disabled: N().blocked || w, onClick: () => {
      l?.recenterLook(), D();
    } }, "⌖"),
    s?.isHost && m.createElement("button", { "aria-label": s.paused ? "Resume table" : "Pause table", disabled: f, onClick: () => E(() => y("/api/pause", { paused: !s.paused })) }, s.paused ? "▶" : "Ⅱ"),
    document.fullscreenEnabled && m.createElement("button", { "aria-label": document.fullscreenElement ? "Exit fullscreen" : "Enter fullscreen", onClick: () => {
      (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {
        n("error").textContent = "Fullscreen unavailable. The game still fills the browser.";
      });
    } }, "⤢")
  )), n("app").classList.toggle("inspecting", R), X(), n("create").disabled = f || !!p, n("join").disabled = f || !!p, !s) {
    Ee(0, !0), l?.setPlaying(!1), be.render(null), g.resetEvents(), ke.render(null), we.render(null), ye.render(null), n("actions").hidden = n("deal-actions").hidden = !0, R = !1, h = !1, w = !1, V = !1, L = { kind: "old-fashioned", available: !1, treat: null, canConsume: !1 }, u = !1, J = -1, n("menu").hidden = !0, ae.render(null), ge.render(null), de();
    return;
  }
  const e = s.view, t = e.players[e.self.seat];
  e.revision !== J && (J = e.revision, M++), Ee(e.self.seat), l?.updateRemote(e, e.self.seat), l?.setPlaying(e.phase !== "ready" && !e.self.waiting), l?.setPaused(s.paused || u || c || h), (s.paused || u || c || h || e.self.waiting) && (w = !1), H(), ue(), at(e);
  for (const i of e.players) if (i.displaySeat !== 0) {
    const b = q.get(i.displaySeat);
    if (!b) continue;
    b.node.classList.toggle("active", e.actor === i.seat), b.node.classList.toggle("folded", i.folded), b.node.classList.toggle("out", i.stack === 0 && !i.committed), b.node.style.setProperty("--seat-color", pe[i.seat].color), b.root.render(m.createElement(Me, {
      name: i.name,
      dealer: e.dealer === i.seat,
      blind: e.smallBlindSeat === i.seat ? "SB" : e.bigBlindSeat === i.seat ? "BB" : "",
      stack: i.stack,
      action: e.actor === i.seat ? i.kind === "human" ? "DECIDING" : "THINKING" : i.action || pe[i.seat].title,
      visibleCards: i.cards.kind === "visible" ? i.cards.values : []
    }));
  }
  n("labels").hidden = R, n("connection").textContent = u || c ? "Connection interrupted — wagering disabled" : s.hostConnected ? s.paused ? "Table paused" : e.self.waiting ? "Seat reserved — joining next hand" : e.actor === e.self.seat ? "Your move" : "Connected · LAN" : "Host disconnected — table suspended", n("invite").textContent = s.code ? `Lobby code: ${s.code.slice(0, 5)}-${s.code.slice(5)}` : "Six playing seats · empty seats are NPCs", n("host-storage").textContent = s.durable ? "Host saves this table privately. A host restart pauses play until the host resumes." : "Disposable host: stopping its process ends this table.";
  const a = e.phase === "betting" ? ["Pre-flop", "Flop", "Turn", "River"][e.street] : e.phase === "ready" ? "Waiting for host" : e.phase === "complete" ? "Hand complete" : e.phase === "showdown" ? "Showdown" : "Dealing", o = e.phase === "complete" ? e.results.filter((i) => i.won > 0).map((i) => `${e.players[i.seat].name} wins ${i.won}`).join(" · ") : "", r = t.cards.kind === "visible" ? t.cards.values : [], d = e.phase === "complete", te = e.phase === "betting" && e.actor === e.self.seat, Be = r.length === 2 && e.board.length >= 3 ? Fe([...r, ...e.board]).name : "Practice chips", Ne = u || c ? "Connection interrupted" : s.paused ? "Table paused" : e.self.waiting ? "Your seat is reserved." : d ? o : te ? "Your move." : e.actor !== null ? `${e.players[e.actor].name} is thinking…` : a;
  ye.render(m.createElement(He, { handNumber: e.handNumber, smallBlind: e.smallBlind, bigBlind: e.bigBlind })), we.render(m.createElement(Ue, { finished: d, amount: d ? e.awards.reduce((i, b) => i + b.amount, 0) : e.pot, sidePots: e.awards.length - 1 })), ke.render(m.createElement(Je, {
    board: e.board,
    street: qe[e.street],
    ownCards: r,
    stack: t.stack,
    position: `${e.dealer === t.seat ? " · DEALER" : ""}${e.smallBlindSeat === t.seat ? " · SB" : ""}${e.bigBlindSeat === t.seat ? " · BB" : ""}`,
    handLabel: t.folded ? "Folded" : Be,
    status: Ne,
    detail: f ? "Sending…" : e.self.waiting ? "Joining at the next hand" : t.action,
    winningCards: d ? e.results.find((i) => i.seat === t.seat && i.won > 0)?.hand?.cards ?? [] : [],
    withActions: te || d || e.phase === "ready"
  })), g.observe(
    e.gameRevision,
    {
      hand: e.handNumber,
      phase: e.phase,
      actor: e.actor,
      boardCount: e.board.length,
      players: e.players.map((i) => ({ seat: i.seat, stack: i.stack, bet: i.bet, folded: i.folded, action: i.action }))
    },
    !s.paused && !u && !c && !h && !e.self.waiting && _ && !document.hidden,
    e.self.seat
  ), n("players").replaceChildren(...[...e.players].sort((i, b) => i.displaySeat - b.displaySeat).map((i) => {
    const b = document.createElement("li");
    return b.textContent = `${i.name} · ${i.kind}${i.pendingName ? " · next: " + i.pendingName : ""} · ${i.stack} chips · ${i.action || "waiting"}${e.actor === i.seat ? " · to act" : ""}`, b;
  })), n("deal-actions").hidden = !s.isHost || !["ready", "complete"].includes(e.phase) || s.paused || h, n("pause").hidden = !s.isHost, n("start").disabled = f || s.paused || u || c, n("pause").disabled = f, n("pause").textContent = s.paused ? "Resume table" : "Pause table", n("leave").disabled = f, n("leave").textContent = s.isHost ? "End session for everyone" : "Leave table", ge.render(m.createElement(Ge, {
    offer: e.self.bank,
    revision: e.revision,
    blocked: f || s.paused || u || c || !h,
    onConfirm: ot
  }));
  const Oe = !f && !s.paused && !u && !c && !h && !w && !e.self.waiting && e.actor === e.self.seat && e.phase === "betting";
  n("actions").hidden = !te || s.paused || h || u || c, be.render(m.createElement(We, {
    ref: Se,
    revision: M,
    blocked: !Oe,
    legal: e.legal,
    pot: e.pot,
    currentBet: e.currentBet,
    ownBet: t.bet,
    bigBlind: e.bigBlind,
    onAction: st,
    onOpenChange: Qe,
    focusTable: D
  })), n("inspect").disabled = s.paused || e.self.waiting || u || c || h, n("inspect").setAttribute("aria-pressed", String(R)), n("inspect").firstChild.nodeValue = R ? "Look up " : "Cards & chips ";
}
async function E(e) {
  if (!f) {
    f = !0, n("error").textContent = "", k();
    try {
      await e();
    } catch (t) {
      t instanceof A || (M++, n("error").textContent = t.message);
    } finally {
      f = !1, k();
    }
  }
}
async function Le(e) {
  F = n("name").value, oe();
  let t;
  try {
    t = await y(e ? "/api/join" : "/api/create", { name: F, nonce: B, ...e ? { code: n("code").value } : {} });
  } catch (a) {
    if (!e && /already exists/i.test(a?.message || "") && x.saved().length) {
      if (await xe(x.saved())) return;
      throw new Error("This host already has a table, and none of the seats saved in this browser belong to it. Resume from the browser that created it, or restart the host with a fresh table.");
    }
    throw a;
  }
  Y = et(t.code || (e ? n("code").value : "")), v.reset(), p = t.token, oe(n("remember").checked), await y("/api/state");
}
async function xe(e) {
  for (const t of e) {
    v.reset(), p = t.token, B = t.nonce, F = t.name, Y = t.code || "", c = !1, W = !1;
    try {
      return await y("/api/state"), oe(!0), !0;
    } catch (a) {
      if (!c) throw a;
      Q(t), p = "", c = !1, n("forget").hidden = !0;
    }
  }
  return p = "", B = z(), s = null, de(), !1;
}
n("create").onclick = () => E(() => Le(!1));
n("join").onclick = () => E(() => Le(!0));
n("start").onclick = () => E(() => y("/api/start", { revision: s.view.revision }));
n("pause").onclick = () => E(() => y("/api/pause", { paused: !s.paused }));
n("leave").onclick = () => E(async () => {
  await y("/api/leave", {}), v.reset(), Q(Z()), p = "", s = null, B = z(), n("connection").textContent = "Left table";
});
n("forget").onclick = () => {
  v.reset(), Q(Z()), p = "", s = null, c = !1, B = z(), n("forget").hidden = !0, n("error").textContent = "", n("connection").textContent = "Not connected", k();
};
n("resume-seat").onclick = () => {
  const e = P[Number(n("saved-seats").value)];
  e && E(async () => {
    const t = [e, ...x.saved().filter((a) => a.nonce !== e.nonce)];
    if (!await xe(t)) throw new Error("None of the seats saved in this browser belong to a table on this host. They were removed; create or join a table.");
  });
};
n("forget-seat").onclick = () => {
  const e = P[Number(n("saved-seats").value)];
  e && (Q(e), de());
};
n("remember-current").onclick = () => {
  x.save(Z(), !0) ? n("seat-note").textContent = "Seat remembered on this browser. Close this tab before resuming it in another." : n("storage-warning").textContent = "Browser storage is unavailable. Keep this tab open; the seat was not safely remembered.";
};
function st(e) {
  if (f || c || u || h || w || !s || s.paused || s.view.actor !== s.view.self.seat) return !1;
  const t = s.view;
  return E(() => y("/api/action", { sequence: t.self.nextSequence, revision: t.revision, action: e })), !0;
}
function ot(e, t) {
  if (f || c || u || !s || s.paused || !h || s.view.revision !== t) return !1;
  const a = s.view, o = a.self.bank;
  return (e.type === "borrow" ? !o.canBorrow : e.amount <= 0 || e.amount > o.repayMax) ? !1 : (E(() => y("/api/action", { sequence: a.self.nextSequence, revision: t, action: e })), !0);
}
function j(e) {
  h = e, n("menu").hidden = !e, H(), k(), e || D();
}
n("details").onclick = () => j(!h);
n("close-menu").onclick = () => j(!1);
for (const e of ["ambience-level", "effects-level"]) n(e).onchange = () => {
  g.setLevels(Number(n("ambience-level").value), Number(n("effects-level").value));
};
n("drink-effect").onchange = () => l?.setDrinkEffect(n("drink-effect").value);
n("look-enabled").onclick = () => {
  O = !O, l?.setLookEnabled(O), n("look-enabled").setAttribute("aria-pressed", String(O)), n("look-enabled").textContent = O ? "On" : "Off";
};
function ee(e) {
  e && (w = !1), R = e, l?.setInspection(e), n("labels").hidden = e, H(), k();
}
n("inspect").onclick = () => {
  ee(!R), D();
};
n("app").addEventListener("keydown", (e) => {
  const t = e.target.closest("input,select,textarea,[contenteditable=true]") ? "editing" : e.target.closest("button,a") ? "control" : "table";
  if (!s || t === "editing" || e.altKey || e.ctrlKey || e.metaKey || e.isComposing) return;
  if (e.key.toLowerCase() === "m" && !e.repeat) {
    e.preventDefault(), C = !C, g.setMuted(C), C || g.unlock(), k();
    return;
  }
  if (e.key === "Escape" && w) {
    e.preventDefault(), e.stopPropagation(), ce(!1);
    return;
  }
  if (e.key === "Escape" && h) {
    e.preventDefault(), j(!1);
    return;
  }
  if (e.key.toLowerCase() === "r" && t === "table" && !e.repeat && !N().blocked && !w) {
    e.preventDefault(), l?.recenterLook();
    return;
  }
  const a = _e(e, t, N());
  if (a) {
    e.preventDefault(), G(a);
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
      e.preventDefault(), s.isHost ? E(() => y("/api/pause", { paused: !s.paused })) : j(!0);
      return;
    }
    e.key === " " && t === "table" && !h && !w && !u && !c && !s.paused && !s.view.self.waiting && (e.preventDefault(), ee(!0));
  }
});
n("app").addEventListener("keyup", (e) => {
  e.key === " " && ee(!1);
});
window.addEventListener("blur", () => ee(!1));
n("export").onclick = () => {
  const e = new Blob([JSON.stringify({ source: "actual-browser-lan-3d-client", started: Ce, truncated: Re, records: se }, null, 2)], { type: "application/json" }), t = URL.createObjectURL(e), a = document.createElement("a");
  a.href = t, a.download = `poker-lan-${Ce.replaceAll(":", "-")}.json`, a.click(), setTimeout(() => URL.revokeObjectURL(t), 1e3);
};
async function Te() {
  if (!(!p || c || f || ne)) {
    ne = !0;
    try {
      await y("/api/state");
    } catch (e) {
      e instanceof A || (u = !0, n("error").textContent = e.message, k());
    } finally {
      ne = !1;
    }
  }
}
setInterval(Te, 500);
k();
Te();
export {
  it as setApiTransport
};
