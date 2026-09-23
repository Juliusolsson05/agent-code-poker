import { j as c, D as Ge, d as Xe, g as Ze, p as Qe, r as d, b as et, a as tt, o as E, f as nt, T as st, F as xe, n as at, q as ce, i as de, C as Re, S as ot, e as it, c as rt, h as lt, k as ct, l as dt, m as ut, B as ft } from "./BankControls-aTpI6qRT.js";
import { M as Le, b as ht, V as Te, a as pt, l as mt, c as bt, d as gt, e as fe, n as vt, f as kt } from "./lanView-D8Gs2yEP.js";
const G = "poker-lan-connection-test-v1", $ = "poker-lan-saved-seat-v1:";
function q(e, t = !1) {
  if (!e || e.length > 2048) return null;
  try {
    const n = JSON.parse(e), a = t && n?.name === void 0 ? "Saved player" : n?.name;
    return !n || typeof n.token != "string" || !/^(?:[A-Za-z0-9_-]{43})?$/.test(n.token) || typeof n.nonce != "string" || !/^[a-f0-9]{64}$/.test(n.nonce) || typeof a != "string" || !a.trim() || a.length > 96 || /[\p{Cc}\p{Cf}]/u.test(a) ? null : { token: n.token, nonce: n.nonce, name: a };
  } catch {
    return null;
  }
}
class yt {
  constructor(t, n) {
    this.session = t, this.local = n;
  }
  session;
  local;
  current() {
    try {
      return q(this.session().getItem(G), !0);
    } catch {
      return null;
    }
  }
  saved() {
    try {
      const t = this.local(), n = [];
      for (let a = 0; a < Math.min(t.length, 4096) && n.length < 64; a++) {
        const o = t.key(a);
        if (!o?.startsWith($)) continue;
        const l = q(t.getItem(o));
        l?.token && o === $ + l.nonce && n.push(l);
      }
      return n;
    } catch {
      return [];
    }
  }
  save(t, n) {
    const a = q(JSON.stringify(t));
    if (!a) return !1;
    let o = !0;
    try {
      this.session().setItem(G, JSON.stringify(a));
    } catch {
      o = !1;
    }
    if (n && a.token)
      try {
        this.local().setItem($ + a.nonce, JSON.stringify(a));
      } catch {
        o = !1;
      }
    return o;
  }
  forget(t) {
    let n = !0;
    try {
      const a = q(this.session().getItem(G), !0);
      a?.nonce === t.nonce && a.token === t.token && this.session().removeItem(G);
    } catch {
      n = !1;
    }
    try {
      const a = this.local();
      q(a.getItem($ + t.nonce))?.token === t.token && a.removeItem($ + t.nonce);
    } catch {
      n = !1;
    }
    return n;
  }
}
class j extends Error {
}
class wt {
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
  accept(t, n) {
    if (!this.current(t) || typeof n.generation != "string" || !n.generation || !Number.isSafeInteger(n.observation) || n.observation < 1) return !1;
    const a = this.#t;
    return a && (n.generation === a.generation ? n.observation <= a.observation : t.generation !== a.generation) ? !1 : (this.#t = { generation: n.generation, observation: n.observation }, this.#e++, !0);
  }
}
function Ct(e, t, n) {
  if (t !== "table" || n.blocked || !n.available || n.menuOpen || e.repeat || e.ctrlKey || e.altKey || e.metaKey || e.isComposing) return null;
  const a = e.key.toLowerCase();
  return a === "s" ? "smoke" : a === "d" ? "drink" : a === "e" && n.treatsAllowed !== !1 ? "consume" : null;
}
function St(e) {
  const t = e.blocked || !e.available || e.menuOpen, n = e.treatsAllowed !== !1, a = (o) => {
    (n || !Qe(o)) && e.onOrder(o);
  };
  return /* @__PURE__ */ c.jsxs("div", { className: n ? "lan-leisure" : "lan-leisure lan-no-treats", children: [
    /* @__PURE__ */ c.jsxs("button", { disabled: t, onClick: e.onSmoke, children: [
      "Cigar ",
      /* @__PURE__ */ c.jsx("kbd", { children: "S" })
    ] }),
    /* @__PURE__ */ c.jsxs("button", { disabled: t, onClick: e.onSip, children: [
      Ge[e.kind].label,
      " ",
      /* @__PURE__ */ c.jsx("kbd", { children: "D" })
    ] }),
    n && e.treat && /* @__PURE__ */ c.jsxs("button", { disabled: t || !e.canConsume, onClick: e.onConsume, children: [
      Xe[e.treat.kind].label,
      " · ",
      e.treat.remaining,
      " ",
      /* @__PURE__ */ c.jsx("kbd", { children: "E" })
    ] }),
    /* @__PURE__ */ c.jsx("button", { disabled: e.blocked, "aria-expanded": e.menuOpen, onClick: () => e.onMenuChange(!e.menuOpen), children: "Drinks ▾" }),
    e.menuOpen && /* @__PURE__ */ c.jsx(
      Ze,
      {
        kind: e.kind,
        treat: n ? e.treat?.kind ?? null : null,
        available: !e.blocked && e.available,
        onClose: () => e.onMenuChange(!1),
        onOrder: a
      }
    )
  ] });
}
const Et = 3e4;
class xt {
  constructor(t) {
    this.deps = t;
  }
  deps;
  // False until the first projection: everything present then is history.
  #n = !1;
  // Seqs this tab has decided about (played, skipped or its own). Pruned to
  // the live projection window, so it stays bounded for a long session.
  #e = /* @__PURE__ */ new Set();
  #t = !1;
  /** Send one line. Text first, always: a voice failure never costs the
   * message. Then, detached, only if the host has voices on and this player
   * configured a provider: synthesise locally, play it for ourselves, relay it. */
  async send(t, n, a = () => {
  }) {
    let o;
    try {
      const l = await this.deps.hostApi("/api/chat", { text: t });
      if (!Number.isSafeInteger(l?.receipt?.seq)) return { sent: !1, error: "The host did not accept the message." };
      o = Number(l.receipt.seq);
    } catch (l) {
      return { sent: !1, error: l instanceof Error ? l.message : "Message not sent." };
    }
    return this.#e.add(o), this.#s(o, t, n).then(a, () => a({ seq: o, voice: "off", issue: "failed" })), { sent: !0, seq: o };
  }
  async #s(t, n, a) {
    const o = this.deps.provider();
    if (!a || !o) return { seq: t, voice: "off" };
    const l = await o.synthesize(n);
    if (!l.ok) return { seq: t, voice: "off", issue: l.reason };
    if (this.deps.play(l.audio, 0), l.audio.length > Le) return { seq: t, voice: "local-only", issue: "too-long" };
    try {
      return await this.deps.hostApi("/api/voice", { seq: t, mime: Te, data: ht(l.audio) }), { seq: t, voice: "spoken" };
    } catch {
      return { seq: t, voice: "local-only", issue: "relay-refused" };
    }
  }
  /** Feed every poll's chat projection. Playback is the side effect; each seq
   * is decided at most once per tab. */
  observe(t, n, a) {
    if (this.#t && !n && this.deps.stopAll(), this.#t = n, !this.#n) {
      this.#n = !0;
      for (const o of t) this.#e.add(o.seq);
      return;
    }
    for (const o of t)
      if (!this.#e.has(o.seq)) {
        if (!n || !a) {
          this.#e.add(o.seq);
          continue;
        }
        o.voice && (this.#e.add(o.seq), !(o.displaySeat === 0 || o.ageMs > Et) && this.#a(o.seq, o.displaySeat));
      }
    if (this.#e.size > 64) {
      const o = new Set(t.map((l) => l.seq));
      for (const l of this.#e) o.has(l) || this.#e.delete(l);
    }
  }
  /** A new table generation (host restart, a different table) starts a new
   * history; the next observe() treats its lines as already said. */
  reset() {
    this.#n = !1, this.#e.clear(), this.#t = !1, this.deps.stopAll();
  }
  /** Test/diagnostic view of the bounded state. */
  get trackedCount() {
    return this.#e.size;
  }
  async #a(t, n) {
    try {
      const a = await this.deps.hostApi(`/api/voice/${t}`);
      if (a?.mime !== Te || typeof a.data != "string") return;
      const o = pt(a.data);
      if (!o || o.length > Le || !mt(o)) return;
      this.deps.play(o, n);
    } catch {
    }
  }
}
const Ae = { maxChars: 200 };
function Rt(e, t, n) {
  return t === "table" && !n && !e.repeat && !e.ctrlKey && !e.altKey && !e.metaKey && !e.isComposing && e.key.toLowerCase() === "t";
}
const Lt = (e) => Math.min(14e3, 4e3 + [...e].length * 65), Tt = (e) => e.ageMs < Lt(e.text);
function At(e, t) {
  for (let n = e.length - 1; n >= 0; n--) if (e[n].displaySeat === t) return Tt(e[n]) ? e[n] : null;
  return null;
}
const jt = (e) => e <= 2 ? "start" : e >= 4 ? "end" : "center";
function Nt({ line: e }) {
  return /* @__PURE__ */ c.jsx("div", { className: `chat-bubble ${jt(e.displaySeat)}`, "aria-hidden": "true", children: e.text });
}
function Ot({ lines: e, status: t }) {
  return /* @__PURE__ */ c.jsxs("section", { className: "lan-chat-log", "aria-label": "Table chat", children: [
    /* @__PURE__ */ c.jsx("ol", { "aria-live": "polite", "aria-relevant": "additions", children: e.slice(-6).map((n) => /* @__PURE__ */ c.jsxs("li", { children: [
      /* @__PURE__ */ c.jsx("b", { children: n.displaySeat === 0 ? "You" : n.name }),
      " ",
      n.text
    ] }, n.seq)) }),
    t && /* @__PURE__ */ c.jsx("p", { className: "lan-chat-status", role: "status", children: t })
  ] });
}
function It(e) {
  const [t, n] = d.useState(""), [a, o] = d.useState(!1), l = d.useRef(null);
  return d.useEffect(() => {
    l.current?.focus();
  }, []), /* @__PURE__ */ c.jsxs("form", { className: "lan-chat-input", onSubmit: (y) => {
    y.preventDefault();
    const D = t.trim();
    !D || a || (o(!0), e.onSend(D).then((re) => {
      o(!1), re && e.onClose();
    }));
  }, children: [
    /* @__PURE__ */ c.jsxs("label", { children: [
      "Say ",
      /* @__PURE__ */ c.jsx(
        "input",
        {
          ref: l,
          value: t,
          maxLength: Ae.maxChars,
          autoComplete: "off",
          spellCheck: !0,
          "aria-describedby": "lan-chat-hint",
          disabled: a,
          onChange: (y) => n(y.target.value),
          onKeyDown: (y) => {
            y.key === "Escape" && (y.preventDefault(), y.stopPropagation(), e.onClose());
          }
        }
      )
    ] }),
    /* @__PURE__ */ c.jsxs("span", { id: "lan-chat-hint", className: "small", children: [
      t.length,
      "/",
      Ae.maxChars,
      " · Enter sends · Esc closes",
      e.voiceHint ? ` · ${e.voiceHint}` : ""
    ] })
  ] });
}
function Bt(e) {
  const t = (n, a, o) => /* @__PURE__ */ c.jsxs("label", { children: [
    a,
    e.isHost ? /* @__PURE__ */ c.jsx("button", { "aria-pressed": e.features[n], disabled: e.pending, onClick: () => e.onChange({ ...e.features, [n]: !e.features[n] }), children: e.features[n] ? "On" : "Off" }) : /* @__PURE__ */ c.jsxs("span", { children: [
      e.features[n] ? "On" : "Off",
      " (host decides)"
    ] }),
    /* @__PURE__ */ c.jsx("span", { className: "small", children: o })
  ] }, n);
  return /* @__PURE__ */ c.jsxs("section", { className: "lan-features", "aria-label": "Table features", children: [
    t("voices", "Spoken voices", "Each player’s own ElevenLabs voice reads their chat aloud."),
    t("treats", "Treats", "Cosmetic mushroom and LSD props on the table.")
  ] });
}
function Dt(e) {
  const [t, n] = d.useState(""), [a, o] = d.useState("");
  return /* @__PURE__ */ c.jsxs("section", { className: "lan-voice-settings", "aria-label": "Your voice", children: [
    /* @__PURE__ */ c.jsx("h3", { children: "Your voice" }),
    /* @__PURE__ */ c.jsx("p", { className: "small", children: e.where }),
    /* @__PURE__ */ c.jsxs("label", { children: [
      "ElevenLabs API key ",
      /* @__PURE__ */ c.jsx(
        "input",
        {
          type: "password",
          value: t,
          autoComplete: "off",
          spellCheck: !1,
          placeholder: e.configured ? "Saved · type to replace" : "xi-api-key",
          onChange: (l) => n(l.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ c.jsxs("label", { children: [
      "Voice ID ",
      /* @__PURE__ */ c.jsx(
        "input",
        {
          value: a,
          autoComplete: "off",
          spellCheck: !1,
          placeholder: "e.g. 21m00Tcm4TlvDq8ikWAM",
          onChange: (l) => o(l.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "row", children: [
      /* @__PURE__ */ c.jsx("button", { className: "secondary", disabled: !t.trim() || !a.trim(), onClick: () => {
        e.onSave(t, a), n("");
      }, children: "Save voice" }),
      /* @__PURE__ */ c.jsx("button", { className: "secondary", disabled: !e.configured, onClick: e.onTest, children: "Test voice" }),
      /* @__PURE__ */ c.jsx("button", { className: "text-button", disabled: !e.configured, onClick: e.onForget, children: "Forget key" })
    ] }),
    /* @__PURE__ */ c.jsx("p", { className: "small", role: "status", children: e.status })
  ] });
}
const s = (e) => document.getElementById(e), J = new yt(() => sessionStorage, () => localStorage), x = new wt(), ye = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), (e) => e.toString(16).padStart(2, "0")).join("");
let v = "", H = ye(), i = null, m = !1, ue = !1, h = !1, u = null, ne = !1, R = !1, b = !1, p = !1, Y = 0, X = -1, C = !1, W = !1, T = { kind: "old-fashioned", available: !1, treat: null, canConsume: !1 };
const Z = /* @__PURE__ */ new Map(), Fe = d.createRef(), je = E.createRoot(s("actions")), he = E.createRoot(s("leisure")), Ne = E.createRoot(s("bank")), Oe = E.createRoot(s("chat")), Ie = E.createRoot(s("features")), Kt = E.createRoot(s("voice-settings")), Pt = E.createRoot(s("header")), Be = E.createRoot(s("hud")), De = E.createRoot(s("pot")), Ke = E.createRoot(s("table-info")), g = new tt(
  st.fireplace ? nt : void 0,
  [xe.position[0], 0.4, xe.position[2] + 0.05]
);
let S = !1, Pe = null, se = document.hasFocus(), K = !0;
const ae = () => g.setAmbienceActive(!!i && !i.paused && !p && !h && !b && !document.hidden && se);
s("app").addEventListener("pointerdown", () => g.unlock());
s("app").addEventListener("keydown", (e) => {
  e.repeat || g.unlock();
});
document.addEventListener("visibilitychange", () => {
  ae(), document.hidden || f();
});
document.addEventListener("fullscreenchange", () => f());
window.addEventListener("blur", () => {
  se = !1, ae();
});
window.addEventListener("focus", () => {
  se = !0, ae();
});
window.addEventListener("pagehide", () => g.dispose(), { once: !0 });
const N = () => s("app").focus(), F = () => u?.setLookBlocked(W || b || C || P), Mt = (e) => {
  W = e, F(), Se();
};
let O = { store: bt(() => localStorage), http: kt() }, A = null, I = "", P = !1, U = "", Q = !1;
const $e = () => A ? gt(() => A, O.http) : null, Vt = (e) => e === 0 || !ce[e] ? null : [ce[e][0], 1.45, ce[e][1]], M = new xt({
  hostApi: (e, t) => k(e, t),
  provider: $e,
  play: (e, t) => {
    g.playVoice(e, t, Vt(t));
  },
  stopAll: () => g.stopVoices()
});
function Qt(e) {
  O = e, A = null, I = "", qe();
}
async function qe() {
  const e = O, t = await e.store.load().catch(() => null);
  e === O && (A = t, f());
}
async function Ht(e, t) {
  const n = vt({ apiKey: e, voiceId: t });
  if (!n) {
    I = "That key or voice ID does not look right. Copy both from your ElevenLabs account.", f();
    return;
  }
  const a = await O.store.save(n);
  A = n, I = a ? "Voice saved." : "Could not save it here; it will be used in this tab until you close it.", f();
}
async function Ft() {
  await O.store.clear(), A = null, I = "Key forgotten on this device.", f();
}
async function $t() {
  const e = $e();
  if (!e) return;
  I = "Asking ElevenLabs…", f(), g.unlock();
  const t = await e.synthesize("This is how I sound at the table.");
  I = t.ok ? S ? "Voice works. Unmute sound (M) to hear it." : "Voice works." : fe[t.reason], t.ok && g.playVoice(t.audio, 0, null), f();
}
const qt = {
  "rate-limited": "Slow down: one message every few seconds.",
  invalid: "Messages are one line of plain text, up to 200 characters.",
  disconnected: "Reconnecting; message not sent.",
  unauthorized: "You are no longer at this table."
};
async function Ut(e) {
  const t = await M.send(e, !!i?.features?.voices, (n) => {
    U = n.issue === "too-long" ? "Too long to relay: only you heard it; others see the text." : n.issue === "relay-refused" ? "Others see this line as text only." : n.issue && fe[n.issue] ? fe[n.issue] : "", f();
  });
  return t.sent ? (U = "", f(), !0) : (U = qt[t.error] ?? t.error, f(), !1);
}
function we(e) {
  P = e, F(), f(), e || N();
}
function _t(e) {
  !i?.isHost || Q || (Q = !0, f(), k("/api/features", e).catch((t) => {
    t instanceof j || (s("error").textContent = t.message);
  }).finally(() => {
    Q = !1, f();
  }));
}
const ee = J.current();
let _ = [], z = ee?.name || "Guest";
ee && (v = ee.token, H = ee.nonce, s("name").value = z);
const pe = [], Me = (/* @__PURE__ */ new Date()).toISOString();
let Ue = !1;
const oe = () => ({ token: v, nonce: H, name: z });
function me(e = !1) {
  J.save(oe(), e) || (s("storage-warning").textContent = "Browser storage is unavailable. You can play, but keep this tab open: your seat may not survive closing or reloading it.");
}
function Ce(e) {
  J.forget(e) || (s("storage-warning").textContent = "Browser storage blocked cleanup. This device may still remember the seat; clear its poker site data before sharing this browser.");
}
function _e() {
  _ = J.saved(), s("recovery").hidden = v || !_.length, s("saved-seats").replaceChildren(..._.map((e, t) => {
    const n = document.createElement("option");
    return n.value = String(t), n.textContent = e.name, n;
  })), s("resume-seat").disabled = s("forget-seat").disabled = m;
}
function Yt(e, t, n) {
  if (pe.length >= 512) {
    Ue = !0;
    return;
  }
  const a = n?.view;
  pe.push({ at: performance.now(), path: e, status: t, ...a ? {
    revision: a.revision,
    gameRevision: a.gameRevision,
    phase: a.phase,
    actor: a.actor,
    selfSeat: a.self.seat,
    waiting: a.self.waiting,
    players: a.players.map((o) => ({
      seat: o.seat,
      displaySeat: o.displaySeat,
      kind: o.kind,
      stack: o.stack,
      bet: o.bet,
      folded: o.folded,
      cards: o.cards.kind,
      connected: o.connected
    }))
  } : {} });
}
let be = null;
function en(e) {
  be = e;
}
async function k(e, t) {
  const n = x.begin();
  let a, o;
  try {
    a = be ? await be({
      path: e,
      method: t === void 0 ? "GET" : "POST",
      headers: { ...t === void 0 ? {} : { "Content-Type": "application/json" }, ...v ? { Authorization: `Bearer ${v}` } : {} },
      body: t === void 0 ? void 0 : JSON.stringify(t)
    }) : await fetch(e, {
      method: t === void 0 ? "GET" : "POST",
      cache: "no-store",
      headers: { ...t === void 0 ? {} : { "Content-Type": "application/json" }, ...v ? { Authorization: `Bearer ${v}` } : {} },
      body: t === void 0 ? void 0 : JSON.stringify(t),
      signal: AbortSignal.timeout(5e3)
    }), o = await a.json();
  } catch (l) {
    throw x.failureCurrent(n) ? l : new j();
  }
  if (!x.current(n)) throw new j();
  if (Yt(e, a.status, o), o.view) {
    if (!x.accept(n, o)) throw new j();
    const l = i && o.generation !== i.generation;
    (l || p) && g.resetEvents(), l && (Y++, X = -1, R = !1, u?.setInspection(!1), M.reset()), i = o, p = !1, f();
  } else if (!a.ok && !x.failureCurrent(n))
    throw new j();
  if (v && [401, 410].includes(a.status) && (h = !0, x.reset(), s("forget").hidden = !1), !a.ok) throw new Error(o.error || o.receipt?.code || "Request rejected.");
  return o;
}
function B() {
  return {
    available: T.available,
    menuOpen: C,
    treatsAllowed: !!i?.features?.treats,
    blocked: !i || !u || ne || m || p || h || i.paused || i.view.phase === "ready" || i.view.self.waiting || R || b || W
  };
}
function Se() {
  if (!i) {
    he.render(null);
    return;
  }
  he.render(d.createElement(St, {
    ...B(),
    kind: T.kind,
    treat: T.treat,
    canConsume: T.canConsume,
    onSmoke: () => te("smoke"),
    onSip: () => te("drink"),
    onConsume: () => te("consume"),
    onMenuChange: ke,
    onOrder: (e) => {
      const t = B();
      !de(e) && !t.treatsAllowed || !t.blocked && t.available && (de(e) ? u?.orderDrink(e) : u?.orderTreat(e)) && (de(e) && Ee({ action: "order", kind: e }), ke(!1));
    }
  }));
}
let ge = !1, ve = -1 / 0;
function Ee(e) {
  !v || h || (ge = !0, ve = performance.now(), k("/api/leisure", e).catch(() => {
  }).finally(() => {
    ge = !1;
  }));
}
function zt(e) {
  Ee(e === "smoke" ? { action: "smoke" } : { action: "sip", kind: T.kind });
}
function te(e) {
  const t = B();
  t.blocked || t.menuOpen || !t.available || e === "consume" && !t.treatsAllowed || (e === "smoke" ? u?.smokeCigar() : e === "consume" ? u?.consumeTreat() : u?.sipDrink(), N());
}
function Jt(e) {
  const t = e.players[e.self.seat]?.leisure;
  !t || t.drinkKind === T.kind || ge || i.paused || e.self.waiting || p || h || !u || performance.now() - ve < 3e3 || (ve = performance.now(), Ee({ action: "order", kind: T.kind }));
}
function ke(e) {
  e && B().blocked || (C = e, Y++, F(), f(), e || N());
}
function Ve(e, t = !1) {
  const n = t ? -1 : e;
  if (u && Pe !== n) {
    u.dispose(), u = null;
    for (const o of Z.values()) o.root.unmount();
    Z.clear(), s("labels").replaceChildren();
  }
  if (u || ne || document.hidden) return;
  const a = () => {
    ne = !0, s("error").textContent = "3D rendering unavailable. Reload this tab to reconnect without losing your seat.";
  };
  try {
    u = new at(s("scene"), a, void 0, (o) => {
      T = o, Se();
    }, e), u.setLookEnabled(K), u.onLeisureStarted = zt, u.setDrinkEffect(s("drink-effect").value), Pe = n;
    for (let o = 1; o < 6; o++) {
      const l = document.createElement("div");
      l.className = "seat", s("labels").append(l), Z.set(o, { node: l, root: E.createRoot(l) }), u.bindWorldLabel(o, l);
    }
    u.bindWorldLabel(-1, s("pot")), u.onAudioListener = (o) => g.setListenerMatrix(o);
  } catch {
    a();
  }
}
function f() {
  if (s("entry").hidden = !!i, s("table").hidden = !i, s("inspect").hidden = s("details").hidden = !i, Pt.render(d.createElement(
    et,
    { onLobby: () => {
      i && V(!0);
    } },
    d.createElement("button", { "aria-label": S ? "Unmute sound" : "Mute sound", title: "Sound (M)", onClick: () => {
      S = !S, g.setMuted(S), S || g.unlock(), f();
    } }, S ? "♪̸" : "♪"),
    i && d.createElement("button", { "aria-label": "Settings", title: "Table settings", onClick: () => V(!0) }, "⚙"),
    i && d.createElement("button", { "aria-label": "Recenter view", title: "Drag the room to look · Recenter (R)", disabled: B().blocked || C, onClick: () => {
      u?.recenterLook(), N();
    } }, "⌖"),
    i?.isHost && d.createElement("button", { "aria-label": i.paused ? "Resume table" : "Pause table", disabled: m, onClick: () => L(() => k("/api/pause", { paused: !i.paused })) }, i.paused ? "▶" : "Ⅱ"),
    document.fullscreenEnabled && d.createElement("button", { "aria-label": document.fullscreenElement ? "Exit fullscreen" : "Enter fullscreen", onClick: () => {
      (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {
        s("error").textContent = "Fullscreen unavailable. The game still fills the browser.";
      });
    } }, "⤢")
  )), s("app").classList.toggle("inspecting", R), ae(), s("create").disabled = m || !!v, s("join").disabled = m || !!v, !i) {
    Ve(0, !0), u?.setPlaying(!1), je.render(null), g.resetEvents(), Be.render(null), De.render(null), Ke.render(null), s("actions").hidden = s("deal-actions").hidden = !0, R = !1, b = !1, C = !1, W = !1, T = { kind: "old-fashioned", available: !1, treat: null, canConsume: !1 }, p = !1, X = -1, s("menu").hidden = !0, he.render(null), Ne.render(null), P = !1, U = "", M.reset(), Oe.render(null), Ie.render(null), He(), _e();
    return;
  }
  const e = i.view, t = e.players[e.self.seat];
  e.revision !== X && (X = e.revision, Y++), Ve(e.self.seat), u?.updateRemote(e, e.self.seat), u?.setPlaying(e.phase !== "ready" && !e.self.waiting), u?.setPaused(i.paused || p || h || b), (i.paused || p || h || b || e.self.waiting) && (C = !1), F(), Se(), Jt(e);
  for (const r of e.players) if (r.displaySeat !== 0) {
    const w = Z.get(r.displaySeat);
    if (!w) continue;
    w.node.classList.toggle("active", e.actor === r.seat), w.node.classList.toggle("folded", r.folded), w.node.classList.toggle("out", r.stack === 0 && !r.committed), w.node.style.setProperty("--seat-color", Re[r.seat].color);
    const le = At(e.chat ?? [], r.displaySeat);
    w.root.render(d.createElement(d.Fragment, null, d.createElement(ot, {
      name: r.name,
      dealer: e.dealer === r.seat,
      blind: e.smallBlindSeat === r.seat ? "SB" : e.bigBlindSeat === r.seat ? "BB" : "",
      stack: r.stack,
      action: e.actor === r.seat ? r.kind === "human" ? "DECIDING" : "THINKING" : r.action || Re[r.seat].title,
      visibleCards: r.cards.kind === "visible" ? r.cards.values : []
    }), le && d.createElement(Nt, { key: le.seq, line: le })));
  }
  s("labels").hidden = R;
  const n = !!i.features?.voices;
  M.observe(e.chat ?? [], n, !S && !document.hidden), Oe.render(d.createElement(
    d.Fragment,
    null,
    d.createElement(Ot, { lines: e.chat ?? [], status: U }),
    P && d.createElement(It, {
      onSend: Ut,
      onClose: () => we(!1),
      voiceHint: n ? A ? "spoken in your voice" : "voices are on: add your key in Table menu" : ""
    })
  )), Ie.render(d.createElement(Bt, { isHost: !!i.isHost, features: i.features ?? { voices: !1, treats: !1 }, pending: Q || m, onChange: _t })), He(), s("connection").textContent = p || h ? "Connection interrupted — wagering disabled" : i.hostConnected ? i.paused ? "Table paused" : e.self.waiting ? "Seat reserved — joining next hand" : e.actor === e.self.seat ? "Your move" : "Connected · LAN" : "Host disconnected — table suspended", s("invite").textContent = i.code ? `Lobby code: ${i.code.slice(0, 5)}-${i.code.slice(5)}` : "Six playing seats · empty seats are NPCs", s("host-storage").textContent = i.durable ? "Host saves this table privately. A host restart pauses play until the host resumes." : "Disposable host: stopping its process ends this table.";
  const a = e.phase === "betting" ? ["Pre-flop", "Flop", "Turn", "River"][e.street] : e.phase === "ready" ? "Waiting for host" : e.phase === "complete" ? "Hand complete" : e.phase === "showdown" ? "Showdown" : "Dealing", o = e.phase === "complete" ? e.results.filter((r) => r.won > 0).map((r) => `${e.players[r.seat].name} wins ${r.won}`).join(" · ") : "", l = t.cards.kind === "visible" ? t.cards.values : [], y = e.phase === "complete", D = e.phase === "betting" && e.actor === e.self.seat, re = l.length === 2 && e.board.length >= 3 ? it([...l, ...e.board]).name : "Practice chips", Je = p || h ? "Connection interrupted" : i.paused ? "Table paused" : e.self.waiting ? "Your seat is reserved." : y ? o : D ? "Your move." : e.actor !== null ? `${e.players[e.actor].name} is thinking…` : a;
  Ke.render(d.createElement(rt, { handNumber: e.handNumber, smallBlind: e.smallBlind, bigBlind: e.bigBlind })), De.render(d.createElement(lt, { finished: y, amount: y ? e.awards.reduce((r, w) => r + w.amount, 0) : e.pot, sidePots: e.awards.length - 1 })), Be.render(d.createElement(ct, {
    board: e.board,
    street: dt[e.street],
    ownCards: l,
    stack: t.stack,
    position: `${e.dealer === t.seat ? " · DEALER" : ""}${e.smallBlindSeat === t.seat ? " · SB" : ""}${e.bigBlindSeat === t.seat ? " · BB" : ""}`,
    handLabel: t.folded ? "Folded" : re,
    status: Je,
    detail: m ? "Sending…" : e.self.waiting ? "Joining at the next hand" : t.action,
    winningCards: y ? e.results.find((r) => r.seat === t.seat && r.won > 0)?.hand?.cards ?? [] : [],
    withActions: D || y || e.phase === "ready"
  })), g.observe(
    e.gameRevision,
    {
      hand: e.handNumber,
      phase: e.phase,
      actor: e.actor,
      boardCount: e.board.length,
      players: e.players.map((r) => ({ seat: r.seat, stack: r.stack, bet: r.bet, folded: r.folded, action: r.action }))
    },
    !i.paused && !p && !h && !b && !e.self.waiting && se && !document.hidden,
    e.self.seat
  ), s("players").replaceChildren(...[...e.players].sort((r, w) => r.displaySeat - w.displaySeat).map((r) => {
    const w = document.createElement("li");
    return w.textContent = `${r.name} · ${r.kind}${r.pendingName ? " · next: " + r.pendingName : ""} · ${r.stack} chips · ${r.action || "waiting"}${e.actor === r.seat ? " · to act" : ""}`, w;
  })), s("deal-actions").hidden = !i.isHost || !["ready", "complete"].includes(e.phase) || i.paused || b, s("pause").hidden = !i.isHost, s("start").disabled = m || i.paused || p || h, s("pause").disabled = m, s("pause").textContent = i.paused ? "Resume table" : "Pause table", s("leave").disabled = m, s("leave").textContent = i.isHost ? "End session for everyone" : "Leave table", Ne.render(d.createElement(ut, {
    offer: e.self.bank,
    revision: e.revision,
    blocked: m || i.paused || p || h || !b,
    onConfirm: Gt
  }));
  const We = !m && !i.paused && !p && !h && !b && !C && !e.self.waiting && e.actor === e.self.seat && e.phase === "betting";
  s("actions").hidden = !D || i.paused || b || p || h, je.render(d.createElement(ft, {
    ref: Fe,
    revision: Y,
    blocked: !We,
    legal: e.legal,
    pot: e.pot,
    currentBet: e.currentBet,
    ownBet: t.bet,
    bigBlind: e.bigBlind,
    onAction: Wt,
    onOpenChange: Mt,
    focusTable: N
  })), s("inspect").disabled = i.paused || e.self.waiting || p || h || b, s("inspect").setAttribute("aria-pressed", String(R)), s("inspect").firstChild.nodeValue = R ? "Look up " : "Cards & chips ";
}
function He() {
  Kt.render(d.createElement(Dt, {
    where: O.store.where,
    configured: !!A,
    status: I,
    onSave: (e, t) => {
      Ht(e, t);
    },
    onForget: () => {
      Ft();
    },
    onTest: () => {
      $t();
    }
  }));
}
async function L(e) {
  if (!m) {
    m = !0, s("error").textContent = "", f();
    try {
      await e();
    } catch (t) {
      t instanceof j || (Y++, s("error").textContent = t.message);
    } finally {
      m = !1, f();
    }
  }
}
async function Ye(e) {
  z = s("name").value, me();
  const t = await k(e ? "/api/join" : "/api/create", { name: z, nonce: H, ...e ? { code: s("code").value } : {} });
  x.reset(), v = t.token, me(s("remember").checked), await k("/api/state");
}
s("create").onclick = () => L(() => Ye(!1));
s("join").onclick = () => L(() => Ye(!0));
s("start").onclick = () => L(() => k("/api/start", { revision: i.view.revision }));
s("pause").onclick = () => L(() => k("/api/pause", { paused: !i.paused }));
s("leave").onclick = () => L(async () => {
  await k("/api/leave", {}), x.reset(), Ce(oe()), v = "", i = null, M.reset(), H = ye(), s("connection").textContent = "Left table";
});
s("forget").onclick = () => {
  x.reset(), Ce(oe()), v = "", i = null, h = !1, H = ye(), M.reset(), s("forget").hidden = !0, s("error").textContent = "", s("connection").textContent = "Not connected", f();
};
s("resume-seat").onclick = () => {
  const e = _[Number(s("saved-seats").value)];
  e && L(async () => {
    x.reset(), v = e.token, H = e.nonce, z = e.name, h = !1, ne = !1, me(), await k("/api/state");
  });
};
s("forget-seat").onclick = () => {
  const e = _[Number(s("saved-seats").value)];
  e && (Ce(e), _e());
};
s("remember-current").onclick = () => {
  J.save(oe(), !0) ? s("seat-note").textContent = "Seat remembered on this browser. Close this tab before resuming it in another." : s("storage-warning").textContent = "Browser storage is unavailable. Keep this tab open; the seat was not safely remembered.";
};
function Wt(e) {
  if (m || h || p || b || C || !i || i.paused || i.view.actor !== i.view.self.seat) return !1;
  const t = i.view;
  return L(() => k("/api/action", { sequence: t.self.nextSequence, revision: t.revision, action: e })), !0;
}
function Gt(e, t) {
  if (m || h || p || !i || i.paused || !b || i.view.revision !== t) return !1;
  const n = i.view, a = n.self.bank;
  return (e.type === "borrow" ? !a.canBorrow : e.amount <= 0 || e.amount > a.repayMax) ? !1 : (L(() => k("/api/action", { sequence: n.self.nextSequence, revision: t, action: e })), !0);
}
function V(e) {
  b = e, s("menu").hidden = !e, F(), f(), e || N();
}
s("details").onclick = () => V(!b);
s("close-menu").onclick = () => V(!1);
for (const e of ["ambience-level", "effects-level"]) s(e).onchange = () => {
  g.setLevels(Number(s("ambience-level").value), Number(s("effects-level").value));
};
s("drink-effect").onchange = () => u?.setDrinkEffect(s("drink-effect").value);
s("look-enabled").onclick = () => {
  K = !K, u?.setLookEnabled(K), s("look-enabled").setAttribute("aria-pressed", String(K)), s("look-enabled").textContent = K ? "On" : "Off";
};
function ie(e) {
  e && (C = !1), R = e, u?.setInspection(e), s("labels").hidden = e, F(), f();
}
s("inspect").onclick = () => {
  ie(!R), N();
};
s("app").addEventListener("keydown", (e) => {
  const t = e.target.closest("input,select,textarea,[contenteditable=true]") ? "editing" : e.target.closest("button,a") ? "control" : "table";
  if (!i || t === "editing" || e.altKey || e.ctrlKey || e.metaKey || e.isComposing) return;
  if (Rt(e, t, !i || h || p || b || C || R || W || P)) {
    e.preventDefault(), we(!0);
    return;
  }
  if (e.key.toLowerCase() === "m" && !e.repeat) {
    e.preventDefault(), S = !S, g.setMuted(S), S || g.unlock(), f();
    return;
  }
  if (e.key === "Escape" && C) {
    e.preventDefault(), e.stopPropagation(), ke(!1);
    return;
  }
  if (e.key === "Escape" && b) {
    e.preventDefault(), V(!1);
    return;
  }
  if (e.key.toLowerCase() === "r" && t === "table" && !e.repeat && !B().blocked && !C) {
    e.preventDefault(), u?.recenterLook();
    return;
  }
  const n = Ct(e, t, B());
  if (n) {
    e.preventDefault(), te(n);
    return;
  }
  if (!Fe.current?.handleKey({
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
    if (e.key === "Escape" && !e.repeat && !m) {
      e.preventDefault(), i.isHost ? L(() => k("/api/pause", { paused: !i.paused })) : V(!0);
      return;
    }
    e.key === " " && t === "table" && !b && !C && !p && !h && !i.paused && !i.view.self.waiting && (e.preventDefault(), ie(!0));
  }
});
s("app").addEventListener("keyup", (e) => {
  e.key === " " && ie(!1);
});
window.addEventListener("blur", () => ie(!1));
s("export").onclick = () => {
  const e = new Blob([JSON.stringify({ source: "actual-browser-lan-3d-client", started: Me, truncated: Ue, records: pe }, null, 2)], { type: "application/json" }), t = URL.createObjectURL(e), n = document.createElement("a");
  n.href = t, n.download = `poker-lan-${Me.replaceAll(":", "-")}.json`, n.click(), setTimeout(() => URL.revokeObjectURL(t), 1e3);
};
async function ze() {
  if (!(!v || h || m || ue)) {
    ue = !0;
    try {
      await k("/api/state");
    } catch (e) {
      e instanceof j || (p = !0, s("error").textContent = e.message, f());
    } finally {
      ue = !1;
    }
  }
}
s("chat-open").onclick = () => {
  i && !P && we(!0);
};
setInterval(ze, 500);
f();
ze();
qe();
export {
  en as setApiTransport,
  Qt as setVoiceEnvironment
};
