import { j as c, D as We, d as Xe, g as Ze, p as Qe, r as d, b as et, a as tt, o as E, f as nt, T as st, F as Ee, n as at, q as ce, i as de, C as xe, S as ot, e as it, c as rt, h as lt, k as ct, l as dt, m as ut, B as ft } from "./BankControls-BuMEt0va.js";
import { M as Re, b as ht, V as Le, a as pt, l as mt, c as bt, d as gt, e as qe, n as vt, f as kt } from "./lanView-U_L8zpEQ.js";
const G = "poker-lan-connection-test-v1", F = "poker-lan-saved-seat-v1:";
function $(e, t = !1) {
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
      return $(this.session().getItem(G), !0);
    } catch {
      return null;
    }
  }
  saved() {
    try {
      const t = this.local(), n = [];
      for (let a = 0; a < Math.min(t.length, 4096) && n.length < 64; a++) {
        const o = t.key(a);
        if (!o?.startsWith(F)) continue;
        const l = $(t.getItem(o));
        l?.token && o === F + l.nonce && n.push(l);
      }
      return n;
    } catch {
      return [];
    }
  }
  save(t, n) {
    const a = $(JSON.stringify(t));
    if (!a) return !1;
    let o = !0;
    try {
      this.session().setItem(G, JSON.stringify(a));
    } catch {
      o = !1;
    }
    if (n && a.token)
      try {
        this.local().setItem(F + a.nonce, JSON.stringify(a));
      } catch {
        o = !1;
      }
    return o;
  }
  forget(t) {
    let n = !0;
    try {
      const a = $(this.session().getItem(G), !0);
      a?.nonce === t.nonce && a.token === t.token && this.session().removeItem(G);
    } catch {
      n = !1;
    }
    try {
      const a = this.local();
      $(a.getItem(F + t.nonce))?.token === t.token && a.removeItem(F + t.nonce);
    } catch {
      n = !1;
    }
    return n;
  }
}
class A extends Error {
}
class wt {
  #t = 0;
  #e = 0;
  #n;
  begin() {
    return { epoch: this.#t, version: this.#e, generation: this.#n?.generation };
  }
  reset() {
    this.#t++, this.#e = 0, this.#n = void 0;
  }
  current(t) {
    return t.epoch === this.#t;
  }
  failureCurrent(t) {
    return this.current(t) && t.version === this.#e;
  }
  accept(t, n) {
    if (!this.current(t) || typeof n.generation != "string" || !n.generation || !Number.isSafeInteger(n.observation) || n.observation < 1) return !1;
    const a = this.#n;
    return a && (n.generation === a.generation ? n.observation <= a.observation : t.generation !== a.generation) ? !1 : (this.#n = { generation: n.generation, observation: n.observation }, this.#e++, !0);
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
      We[e.kind].label,
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
  #t = null;
  #e = /* @__PURE__ */ new Set();
  /** Send one line. Text first, always: a voice failure never costs the
   * message. Then, only if the host has voices on and this player configured
   * a provider, synthesise locally, play it for ourselves, and relay it. */
  async send(t, n) {
    let a;
    try {
      const m = await this.deps.hostApi("/api/chat", { text: t });
      if (!Number.isSafeInteger(m?.receipt?.seq)) return { sent: !1, error: "The host did not accept the message." };
      a = Number(m.receipt.seq);
    } catch (m) {
      return { sent: !1, error: m instanceof Error ? m.message : "Message not sent." };
    }
    this.#e.add(a);
    const o = this.deps.provider();
    if (!n || !o) return { sent: !0, seq: a, voice: "off" };
    const l = await o.synthesize(t);
    if (!l.ok) return { sent: !0, seq: a, voice: "off", issue: l.reason };
    if (this.deps.play(l.audio, 0), l.audio.length > Re) return { sent: !0, seq: a, voice: "local-only", issue: "too-long" };
    try {
      return await this.deps.hostApi("/api/voice", { seq: a, mime: Le, data: ht(l.audio) }), { sent: !0, seq: a, voice: "spoken" };
    } catch {
      return { sent: !0, seq: a, voice: "local-only", issue: "relay-refused" };
    }
  }
  /** Feed every poll's chat projection. Returns nothing: playback is the
   * side effect, and each seq is requested at most once per tab. */
  observe(t, n, a) {
    if (this.#t === null) {
      this.#t = new Set(t.map((o) => o.seq));
      for (const o of t) this.#e.add(o.seq);
      return;
    }
    for (const o of t)
      this.#t.has(o.seq) || this.#t.add(o.seq), !(!n || !a || !o.voice || o.displaySeat === 0 || this.#e.has(o.seq)) && (this.#e.add(o.seq), !(o.ageMs > Et) && this.#n(o.seq, o.displaySeat));
    if (this.#e.size > 256) {
      const o = new Set(t.map((l) => l.seq));
      for (const l of this.#e) o.has(l) || this.#e.delete(l);
    }
  }
  /** A new table generation (host restart, a different table) starts a new
   * history; the next observe() treats its lines as already said. */
  reset() {
    this.#t = null, this.#e.clear();
  }
  async #n(t, n) {
    try {
      const a = await this.deps.hostApi(`/api/voice/${t}`);
      if (a?.mime !== Le || typeof a.data != "string") return;
      const o = pt(a.data);
      if (!o || o.length > Re || !mt(o)) return;
      this.deps.play(o, n);
    } catch {
    }
  }
}
const Te = { maxChars: 200 };
function Rt(e, t, n) {
  return t === "table" && !n && !e.repeat && !e.ctrlKey && !e.altKey && !e.metaKey && !e.isComposing && e.key.toLowerCase() === "t";
}
const Lt = (e) => Math.min(14e3, 4e3 + [...e].length * 65), Tt = (e) => e.ageMs < Lt(e.text);
function jt(e, t) {
  for (let n = e.length - 1; n >= 0; n--) if (e[n].displaySeat === t) return Tt(e[n]) ? e[n] : null;
  return null;
}
const At = (e) => e <= 2 ? "start" : e >= 4 ? "end" : "center";
function Nt({ line: e }) {
  return /* @__PURE__ */ c.jsx("div", { className: `chat-bubble ${At(e.displaySeat)}`, "aria-hidden": "true", children: e.text });
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
  }, []), /* @__PURE__ */ c.jsxs("form", { className: "lan-chat-input", onSubmit: (m) => {
    m.preventDefault();
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
          maxLength: Te.maxChars,
          autoComplete: "off",
          spellCheck: !0,
          "aria-describedby": "lan-chat-hint",
          disabled: a,
          onChange: (m) => n(m.target.value),
          onKeyDown: (m) => {
            m.key === "Escape" && (m.preventDefault(), m.stopPropagation(), e.onClose());
          }
        }
      )
    ] }),
    /* @__PURE__ */ c.jsxs("span", { id: "lan-chat-hint", className: "small", children: [
      t.length,
      "/",
      Te.maxChars,
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
const s = (e) => document.getElementById(e), z = new yt(() => sessionStorage, () => localStorage), x = new wt(), ke = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), (e) => e.toString(16).padStart(2, "0")).join("");
let v = "", q = ke(), i = null, b = !1, ue = !1, h = !1, u = null, te = !1, R = !1, g = !1, p = !1, _ = 0, W = -1, C = !1, J = !1, T = { kind: "old-fashioned", available: !1, treat: null, canConsume: !1 };
const X = /* @__PURE__ */ new Map(), He = d.createRef(), je = E.createRoot(s("actions")), fe = E.createRoot(s("leisure")), Ae = E.createRoot(s("bank")), Ne = E.createRoot(s("chat")), Oe = E.createRoot(s("features")), Kt = E.createRoot(s("voice-settings")), Pt = E.createRoot(s("header")), Ie = E.createRoot(s("hud")), Be = E.createRoot(s("pot")), De = E.createRoot(s("table-info")), k = new tt(
  st.fireplace ? nt : void 0,
  [Ee.position[0], 0.4, Ee.position[2] + 0.05]
);
let S = !1, Ke = null, se = document.hasFocus(), K = !0;
const ae = () => k.setAmbienceActive(!!i && !i.paused && !p && !h && !g && !document.hidden && se);
s("app").addEventListener("pointerdown", () => k.unlock());
s("app").addEventListener("keydown", (e) => {
  e.repeat || k.unlock();
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
window.addEventListener("pagehide", () => k.dispose(), { once: !0 });
const N = () => s("app").focus(), H = () => u?.setLookBlocked(J || g || C || P), Mt = (e) => {
  J = e, H(), Ce();
};
let O = { store: bt(() => localStorage), http: kt() }, j = null, I = "", P = !1, ne = "", Z = !1;
const Fe = () => j ? gt(() => j, O.http) : null, Vt = (e) => e === 0 || !ce[e] ? null : [ce[e][0], 1.45, ce[e][1]], M = new xt({
  hostApi: (e, t) => y(e, t),
  provider: Fe,
  play: (e, t) => {
    k.playVoice(e, t, Vt(t));
  }
});
function Qt(e) {
  O = e, j = null, I = "", $e();
}
async function $e() {
  const e = O, t = await e.store.load().catch(() => null);
  e === O && (j = t, f());
}
async function qt(e, t) {
  const n = vt({ apiKey: e, voiceId: t });
  if (!n) {
    I = "That key or voice ID does not look right. Copy both from your ElevenLabs account.", f();
    return;
  }
  const a = await O.store.save(n);
  j = n, I = a ? "Voice saved." : "Could not save it here; it will be used in this tab until you close it.", f();
}
async function Ht() {
  await O.store.clear(), j = null, I = "Key forgotten on this device.", f();
}
async function Ft() {
  const e = Fe();
  if (!e) return;
  I = "Asking ElevenLabs…", f(), k.unlock();
  const t = await e.synthesize("This is how I sound at the table.");
  I = t.ok ? S ? "Voice works. Unmute sound (M) to hear it." : "Voice works." : qe[t.reason], t.ok && k.playVoice(t.audio, 0, null), f();
}
const $t = {
  "rate-limited": "Slow down: one message every few seconds.",
  invalid: "Messages are one line of plain text, up to 200 characters.",
  disconnected: "Reconnecting; message not sent.",
  unauthorized: "You are no longer at this table."
};
async function Ut(e) {
  const t = await M.send(e, !!i?.features?.voices);
  return t.sent ? (ne = t.issue === "too-long" ? "Too long to relay: only you heard it; others see the text." : t.issue === "relay-refused" ? "Others see this line as text only." : t.issue ? qe[t.issue] : "", f(), !0) : (ne = $t[t.error] ?? t.error, f(), !1);
}
function ye(e) {
  P = e, H(), f(), e || N();
}
function _t(e) {
  !i?.isHost || Z || (Z = !0, f(), y("/api/features", e).catch((t) => {
    t instanceof A || (s("error").textContent = t.message);
  }).finally(() => {
    Z = !1, f();
  }));
}
const Q = z.current();
let U = [], Y = Q?.name || "Guest";
Q && (v = Q.token, q = Q.nonce, s("name").value = Y);
const he = [], Pe = (/* @__PURE__ */ new Date()).toISOString();
let Ue = !1;
const oe = () => ({ token: v, nonce: q, name: Y });
function pe(e = !1) {
  z.save(oe(), e) || (s("storage-warning").textContent = "Browser storage is unavailable. You can play, but keep this tab open: your seat may not survive closing or reloading it.");
}
function we(e) {
  z.forget(e) || (s("storage-warning").textContent = "Browser storage blocked cleanup. This device may still remember the seat; clear its poker site data before sharing this browser.");
}
function _e() {
  U = z.saved(), s("recovery").hidden = v || !U.length, s("saved-seats").replaceChildren(...U.map((e, t) => {
    const n = document.createElement("option");
    return n.value = String(t), n.textContent = e.name, n;
  })), s("resume-seat").disabled = s("forget-seat").disabled = b;
}
function Yt(e, t, n) {
  if (he.length >= 512) {
    Ue = !0;
    return;
  }
  const a = n?.view;
  he.push({ at: performance.now(), path: e, status: t, ...a ? {
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
let me = null;
function en(e) {
  me = e;
}
async function y(e, t) {
  const n = x.begin();
  let a, o;
  try {
    a = me ? await me({
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
    throw x.failureCurrent(n) ? l : new A();
  }
  if (!x.current(n)) throw new A();
  if (Yt(e, a.status, o), o.view) {
    if (!x.accept(n, o)) throw new A();
    const l = i && o.generation !== i.generation;
    (l || p) && k.resetEvents(), l && (_++, W = -1, R = !1, u?.setInspection(!1), M.reset()), i = o, p = !1, f();
  } else if (!a.ok && !x.failureCurrent(n))
    throw new A();
  if (v && [401, 410].includes(a.status) && (h = !0, x.reset(), s("forget").hidden = !1), !a.ok) throw new Error(o.error || o.receipt?.code || "Request rejected.");
  return o;
}
function B() {
  return {
    available: T.available,
    menuOpen: C,
    treatsAllowed: !!i?.features?.treats,
    blocked: !i || !u || te || b || p || h || i.paused || i.view.phase === "ready" || i.view.self.waiting || R || g || J
  };
}
function Ce() {
  if (!i) {
    fe.render(null);
    return;
  }
  fe.render(d.createElement(St, {
    ...B(),
    kind: T.kind,
    treat: T.treat,
    canConsume: T.canConsume,
    onSmoke: () => ee("smoke"),
    onSip: () => ee("drink"),
    onConsume: () => ee("consume"),
    onMenuChange: ve,
    onOrder: (e) => {
      const t = B();
      !de(e) && !t.treatsAllowed || !t.blocked && t.available && (de(e) ? u?.orderDrink(e) : u?.orderTreat(e)) && (de(e) && Se({ action: "order", kind: e }), ve(!1));
    }
  }));
}
let be = !1, ge = -1 / 0;
function Se(e) {
  !v || h || (be = !0, ge = performance.now(), y("/api/leisure", e).catch(() => {
  }).finally(() => {
    be = !1;
  }));
}
function zt(e) {
  Se(e === "smoke" ? { action: "smoke" } : { action: "sip", kind: T.kind });
}
function ee(e) {
  const t = B();
  t.blocked || t.menuOpen || !t.available || e === "consume" && !t.treatsAllowed || (e === "smoke" ? u?.smokeCigar() : e === "consume" ? u?.consumeTreat() : u?.sipDrink(), N());
}
function Jt(e) {
  const t = e.players[e.self.seat]?.leisure;
  !t || t.drinkKind === T.kind || be || i.paused || e.self.waiting || p || h || !u || performance.now() - ge < 3e3 || (ge = performance.now(), Se({ action: "order", kind: T.kind }));
}
function ve(e) {
  e && B().blocked || (C = e, _++, H(), f(), e || N());
}
function Me(e, t = !1) {
  const n = t ? -1 : e;
  if (u && Ke !== n) {
    u.dispose(), u = null;
    for (const o of X.values()) o.root.unmount();
    X.clear(), s("labels").replaceChildren();
  }
  if (u || te || document.hidden) return;
  const a = () => {
    te = !0, s("error").textContent = "3D rendering unavailable. Reload this tab to reconnect without losing your seat.";
  };
  try {
    u = new at(s("scene"), a, void 0, (o) => {
      T = o, Ce();
    }, e), u.setLookEnabled(K), u.onLeisureStarted = zt, u.setDrinkEffect(s("drink-effect").value), Ke = n;
    for (let o = 1; o < 6; o++) {
      const l = document.createElement("div");
      l.className = "seat", s("labels").append(l), X.set(o, { node: l, root: E.createRoot(l) }), u.bindWorldLabel(o, l);
    }
    u.bindWorldLabel(-1, s("pot")), u.onAudioListener = (o) => k.setListenerMatrix(o);
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
      S = !S, k.setMuted(S), S || k.unlock(), f();
    } }, S ? "♪̸" : "♪"),
    i && d.createElement("button", { "aria-label": "Settings", title: "Table settings", onClick: () => V(!0) }, "⚙"),
    i && d.createElement("button", { "aria-label": "Recenter view", title: "Drag the room to look · Recenter (R)", disabled: B().blocked || C, onClick: () => {
      u?.recenterLook(), N();
    } }, "⌖"),
    i?.isHost && d.createElement("button", { "aria-label": i.paused ? "Resume table" : "Pause table", disabled: b, onClick: () => L(() => y("/api/pause", { paused: !i.paused })) }, i.paused ? "▶" : "Ⅱ"),
    document.fullscreenEnabled && d.createElement("button", { "aria-label": document.fullscreenElement ? "Exit fullscreen" : "Enter fullscreen", onClick: () => {
      (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {
        s("error").textContent = "Fullscreen unavailable. The game still fills the browser.";
      });
    } }, "⤢")
  )), s("app").classList.toggle("inspecting", R), ae(), s("create").disabled = b || !!v, s("join").disabled = b || !!v, !i) {
    Me(0, !0), u?.setPlaying(!1), je.render(null), k.resetEvents(), Ie.render(null), Be.render(null), De.render(null), s("actions").hidden = s("deal-actions").hidden = !0, R = !1, g = !1, C = !1, J = !1, T = { kind: "old-fashioned", available: !1, treat: null, canConsume: !1 }, p = !1, W = -1, s("menu").hidden = !0, fe.render(null), Ae.render(null), P = !1, ne = "", M.reset(), Ne.render(null), Oe.render(null), Ve(), _e();
    return;
  }
  const e = i.view, t = e.players[e.self.seat];
  e.revision !== W && (W = e.revision, _++), Me(e.self.seat), u?.updateRemote(e, e.self.seat), u?.setPlaying(e.phase !== "ready" && !e.self.waiting), u?.setPaused(i.paused || p || h || g), (i.paused || p || h || g || e.self.waiting) && (C = !1), H(), Ce(), Jt(e);
  for (const r of e.players) if (r.displaySeat !== 0) {
    const w = X.get(r.displaySeat);
    if (!w) continue;
    w.node.classList.toggle("active", e.actor === r.seat), w.node.classList.toggle("folded", r.folded), w.node.classList.toggle("out", r.stack === 0 && !r.committed), w.node.style.setProperty("--seat-color", xe[r.seat].color);
    const le = jt(e.chat ?? [], r.displaySeat);
    w.root.render(d.createElement(d.Fragment, null, d.createElement(ot, {
      name: r.name,
      dealer: e.dealer === r.seat,
      blind: e.smallBlindSeat === r.seat ? "SB" : e.bigBlindSeat === r.seat ? "BB" : "",
      stack: r.stack,
      action: e.actor === r.seat ? r.kind === "human" ? "DECIDING" : "THINKING" : r.action || xe[r.seat].title,
      visibleCards: r.cards.kind === "visible" ? r.cards.values : []
    }), le && d.createElement(Nt, { key: le.seq, line: le })));
  }
  s("labels").hidden = R;
  const n = !!i.features?.voices;
  M.observe(e.chat ?? [], n, !S && !document.hidden), Ne.render(d.createElement(
    d.Fragment,
    null,
    d.createElement(Ot, { lines: e.chat ?? [], status: ne }),
    P && d.createElement(It, {
      onSend: Ut,
      onClose: () => ye(!1),
      voiceHint: n ? j ? "spoken in your voice" : "voices are on: add your key in Table menu" : ""
    })
  )), Oe.render(d.createElement(Bt, { isHost: !!i.isHost, features: i.features ?? { voices: !1, treats: !1 }, pending: Z || b, onChange: _t })), Ve(), s("connection").textContent = p || h ? "Connection interrupted — wagering disabled" : i.hostConnected ? i.paused ? "Table paused" : e.self.waiting ? "Seat reserved — joining next hand" : e.actor === e.self.seat ? "Your move" : "Connected · LAN" : "Host disconnected — table suspended", s("invite").textContent = i.code ? `Lobby code: ${i.code.slice(0, 5)}-${i.code.slice(5)}` : "Six playing seats · empty seats are NPCs", s("host-storage").textContent = i.durable ? "Host saves this table privately. A host restart pauses play until the host resumes." : "Disposable host: stopping its process ends this table.";
  const a = e.phase === "betting" ? ["Pre-flop", "Flop", "Turn", "River"][e.street] : e.phase === "ready" ? "Waiting for host" : e.phase === "complete" ? "Hand complete" : e.phase === "showdown" ? "Showdown" : "Dealing", o = e.phase === "complete" ? e.results.filter((r) => r.won > 0).map((r) => `${e.players[r.seat].name} wins ${r.won}`).join(" · ") : "", l = t.cards.kind === "visible" ? t.cards.values : [], m = e.phase === "complete", D = e.phase === "betting" && e.actor === e.self.seat, re = l.length === 2 && e.board.length >= 3 ? it([...l, ...e.board]).name : "Practice chips", Je = p || h ? "Connection interrupted" : i.paused ? "Table paused" : e.self.waiting ? "Your seat is reserved." : m ? o : D ? "Your move." : e.actor !== null ? `${e.players[e.actor].name} is thinking…` : a;
  De.render(d.createElement(rt, { handNumber: e.handNumber, smallBlind: e.smallBlind, bigBlind: e.bigBlind })), Be.render(d.createElement(lt, { finished: m, amount: m ? e.awards.reduce((r, w) => r + w.amount, 0) : e.pot, sidePots: e.awards.length - 1 })), Ie.render(d.createElement(ct, {
    board: e.board,
    street: dt[e.street],
    ownCards: l,
    stack: t.stack,
    position: `${e.dealer === t.seat ? " · DEALER" : ""}${e.smallBlindSeat === t.seat ? " · SB" : ""}${e.bigBlindSeat === t.seat ? " · BB" : ""}`,
    handLabel: t.folded ? "Folded" : re,
    status: Je,
    detail: b ? "Sending…" : e.self.waiting ? "Joining at the next hand" : t.action,
    winningCards: m ? e.results.find((r) => r.seat === t.seat && r.won > 0)?.hand?.cards ?? [] : [],
    withActions: D || m || e.phase === "ready"
  })), k.observe(
    e.gameRevision,
    {
      hand: e.handNumber,
      phase: e.phase,
      actor: e.actor,
      boardCount: e.board.length,
      players: e.players.map((r) => ({ seat: r.seat, stack: r.stack, bet: r.bet, folded: r.folded, action: r.action }))
    },
    !i.paused && !p && !h && !g && !e.self.waiting && se && !document.hidden,
    e.self.seat
  ), s("players").replaceChildren(...[...e.players].sort((r, w) => r.displaySeat - w.displaySeat).map((r) => {
    const w = document.createElement("li");
    return w.textContent = `${r.name} · ${r.kind}${r.pendingName ? " · next: " + r.pendingName : ""} · ${r.stack} chips · ${r.action || "waiting"}${e.actor === r.seat ? " · to act" : ""}`, w;
  })), s("deal-actions").hidden = !i.isHost || !["ready", "complete"].includes(e.phase) || i.paused || g, s("pause").hidden = !i.isHost, s("start").disabled = b || i.paused || p || h, s("pause").disabled = b, s("pause").textContent = i.paused ? "Resume table" : "Pause table", s("leave").disabled = b, s("leave").textContent = i.isHost ? "End session for everyone" : "Leave table", Ae.render(d.createElement(ut, {
    offer: e.self.bank,
    revision: e.revision,
    blocked: b || i.paused || p || h || !g,
    onConfirm: Wt
  }));
  const Ge = !b && !i.paused && !p && !h && !g && !C && !e.self.waiting && e.actor === e.self.seat && e.phase === "betting";
  s("actions").hidden = !D || i.paused || g || p || h, je.render(d.createElement(ft, {
    ref: He,
    revision: _,
    blocked: !Ge,
    legal: e.legal,
    pot: e.pot,
    currentBet: e.currentBet,
    ownBet: t.bet,
    bigBlind: e.bigBlind,
    onAction: Gt,
    onOpenChange: Mt,
    focusTable: N
  })), s("inspect").disabled = i.paused || e.self.waiting || p || h || g, s("inspect").setAttribute("aria-pressed", String(R)), s("inspect").firstChild.nodeValue = R ? "Look up " : "Cards & chips ";
}
function Ve() {
  Kt.render(d.createElement(Dt, {
    where: O.store.where,
    configured: !!j,
    status: I,
    onSave: (e, t) => {
      qt(e, t);
    },
    onForget: () => {
      Ht();
    },
    onTest: () => {
      Ft();
    }
  }));
}
async function L(e) {
  if (!b) {
    b = !0, s("error").textContent = "", f();
    try {
      await e();
    } catch (t) {
      t instanceof A || (_++, s("error").textContent = t.message);
    } finally {
      b = !1, f();
    }
  }
}
async function Ye(e) {
  Y = s("name").value, pe();
  const t = await y(e ? "/api/join" : "/api/create", { name: Y, nonce: q, ...e ? { code: s("code").value } : {} });
  x.reset(), v = t.token, pe(s("remember").checked), await y("/api/state");
}
s("create").onclick = () => L(() => Ye(!1));
s("join").onclick = () => L(() => Ye(!0));
s("start").onclick = () => L(() => y("/api/start", { revision: i.view.revision }));
s("pause").onclick = () => L(() => y("/api/pause", { paused: !i.paused }));
s("leave").onclick = () => L(async () => {
  await y("/api/leave", {}), x.reset(), we(oe()), v = "", i = null, M.reset(), q = ke(), s("connection").textContent = "Left table";
});
s("forget").onclick = () => {
  x.reset(), we(oe()), v = "", i = null, h = !1, q = ke(), M.reset(), s("forget").hidden = !0, s("error").textContent = "", s("connection").textContent = "Not connected", f();
};
s("resume-seat").onclick = () => {
  const e = U[Number(s("saved-seats").value)];
  e && L(async () => {
    x.reset(), v = e.token, q = e.nonce, Y = e.name, h = !1, te = !1, pe(), await y("/api/state");
  });
};
s("forget-seat").onclick = () => {
  const e = U[Number(s("saved-seats").value)];
  e && (we(e), _e());
};
s("remember-current").onclick = () => {
  z.save(oe(), !0) ? s("seat-note").textContent = "Seat remembered on this browser. Close this tab before resuming it in another." : s("storage-warning").textContent = "Browser storage is unavailable. Keep this tab open; the seat was not safely remembered.";
};
function Gt(e) {
  if (b || h || p || g || C || !i || i.paused || i.view.actor !== i.view.self.seat) return !1;
  const t = i.view;
  return L(() => y("/api/action", { sequence: t.self.nextSequence, revision: t.revision, action: e })), !0;
}
function Wt(e, t) {
  if (b || h || p || !i || i.paused || !g || i.view.revision !== t) return !1;
  const n = i.view, a = n.self.bank;
  return (e.type === "borrow" ? !a.canBorrow : e.amount <= 0 || e.amount > a.repayMax) ? !1 : (L(() => y("/api/action", { sequence: n.self.nextSequence, revision: t, action: e })), !0);
}
function V(e) {
  g = e, s("menu").hidden = !e, H(), f(), e || N();
}
s("details").onclick = () => V(!g);
s("close-menu").onclick = () => V(!1);
for (const e of ["ambience-level", "effects-level"]) s(e).onchange = () => {
  k.setLevels(Number(s("ambience-level").value), Number(s("effects-level").value));
};
s("drink-effect").onchange = () => u?.setDrinkEffect(s("drink-effect").value);
s("look-enabled").onclick = () => {
  K = !K, u?.setLookEnabled(K), s("look-enabled").setAttribute("aria-pressed", String(K)), s("look-enabled").textContent = K ? "On" : "Off";
};
function ie(e) {
  e && (C = !1), R = e, u?.setInspection(e), s("labels").hidden = e, H(), f();
}
s("inspect").onclick = () => {
  ie(!R), N();
};
s("app").addEventListener("keydown", (e) => {
  const t = e.target.closest("input,select,textarea,[contenteditable=true]") ? "editing" : e.target.closest("button,a") ? "control" : "table";
  if (!i || t === "editing" || e.altKey || e.ctrlKey || e.metaKey || e.isComposing) return;
  if (Rt(e, t, !i || h || p || g || C || R || J || P)) {
    e.preventDefault(), ye(!0);
    return;
  }
  if (e.key.toLowerCase() === "m" && !e.repeat) {
    e.preventDefault(), S = !S, k.setMuted(S), S || k.unlock(), f();
    return;
  }
  if (e.key === "Escape" && C) {
    e.preventDefault(), e.stopPropagation(), ve(!1);
    return;
  }
  if (e.key === "Escape" && g) {
    e.preventDefault(), V(!1);
    return;
  }
  if (e.key.toLowerCase() === "r" && t === "table" && !e.repeat && !B().blocked && !C) {
    e.preventDefault(), u?.recenterLook();
    return;
  }
  const n = Ct(e, t, B());
  if (n) {
    e.preventDefault(), ee(n);
    return;
  }
  if (!He.current?.handleKey({
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
    if (e.key === "Escape" && !e.repeat && !b) {
      e.preventDefault(), i.isHost ? L(() => y("/api/pause", { paused: !i.paused })) : V(!0);
      return;
    }
    e.key === " " && t === "table" && !g && !C && !p && !h && !i.paused && !i.view.self.waiting && (e.preventDefault(), ie(!0));
  }
});
s("app").addEventListener("keyup", (e) => {
  e.key === " " && ie(!1);
});
window.addEventListener("blur", () => ie(!1));
s("export").onclick = () => {
  const e = new Blob([JSON.stringify({ source: "actual-browser-lan-3d-client", started: Pe, truncated: Ue, records: he }, null, 2)], { type: "application/json" }), t = URL.createObjectURL(e), n = document.createElement("a");
  n.href = t, n.download = `poker-lan-${Pe.replaceAll(":", "-")}.json`, n.click(), setTimeout(() => URL.revokeObjectURL(t), 1e3);
};
async function ze() {
  if (!(!v || h || b || ue)) {
    ue = !0;
    try {
      await y("/api/state");
    } catch (e) {
      e instanceof A || (p = !0, s("error").textContent = e.message, f());
    } finally {
      ue = !1;
    }
  }
}
s("chat-open").onclick = () => {
  i && !P && ye(!0);
};
setInterval(ze, 500);
f();
ze();
$e();
export {
  en as setApiTransport,
  Qt as setVoiceEnvironment
};
