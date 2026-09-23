import { j as c, D as Qe, d as et, g as tt, p as nt, r as d, o as x, a as at, f as st, T as ot, F as Le, b as rt, C as Te, S as it, e as lt, c as ct, h as dt, k as ut, l as ft, m as ht, B as mt, n as pt, i as he, q as me } from "./BankControls-BGR_gOq3.js";
import { M as Ae, b as bt, V as je, a as gt, l as vt, e as Se, n as yt, c as be, d as kt, f as wt, g as Ct } from "./lanView-3q4ZBEyd.js";
const ee = "poker-lan-connection-test-v1", _ = "poker-lan-saved-seat-v1:";
function z(e, t = !1) {
  if (!e || e.length > 2048) return null;
  try {
    const n = JSON.parse(e), a = t && n?.name === void 0 ? "Saved player" : n?.name;
    if (!n || typeof n.token != "string" || !/^(?:[A-Za-z0-9_-]{43})?$/.test(n.token) || typeof n.nonce != "string" || !/^[a-f0-9]{64}$/.test(n.nonce) || typeof a != "string" || !a.trim() || a.length > 96 || /[\p{Cc}\p{Cf}]/u.test(a)) return null;
    const o = { token: n.token, nonce: n.nonce, name: a };
    return typeof n.code == "string" && /^[A-F0-9]{10}$/.test(n.code) && (o.code = n.code), typeof n.at == "number" && Number.isFinite(n.at) && n.at > 0 && (o.at = Math.floor(n.at)), o;
  } catch {
    return null;
  }
}
class St {
  constructor(t, n) {
    this.session = t, this.local = n;
  }
  session;
  local;
  current() {
    try {
      return z(this.session().getItem(ee), !0);
    } catch {
      return null;
    }
  }
  saved() {
    try {
      const t = this.local(), n = [];
      for (let a = 0; a < Math.min(t.length, 4096) && n.length < 64; a++) {
        const o = t.key(a);
        if (!o?.startsWith(_)) continue;
        const i = z(t.getItem(o));
        i?.token && o === _ + i.nonce && n.push(i);
      }
      return n.sort((a, o) => (o.at ?? 0) - (a.at ?? 0));
    } catch {
      return [];
    }
  }
  save(t, n) {
    const a = z(JSON.stringify(t));
    if (!a) return !1;
    let o = !0;
    try {
      this.session().setItem(ee, JSON.stringify(a));
    } catch {
      o = !1;
    }
    if (n && a.token)
      try {
        this.local().setItem(_ + a.nonce, JSON.stringify(a));
      } catch {
        o = !1;
      }
    return o;
  }
  forget(t) {
    let n = !0;
    try {
      const a = z(this.session().getItem(ee), !0);
      a?.nonce === t.nonce && a.token === t.token && this.session().removeItem(ee);
    } catch {
      n = !1;
    }
    try {
      const a = this.local();
      z(a.getItem(_ + t.nonce))?.token === t.token && a.removeItem(_ + t.nonce);
    } catch {
      n = !1;
    }
    return n;
  }
}
async function Et(e, t, n) {
  for (const a of e) {
    if (await t(a) === "accepted") return a;
    n(a);
  }
  return null;
}
function xt(e, t) {
  const n = t.trim();
  return n ? e.filter((a) => Ue(a.name, n)) : [];
}
function Rt(e, t) {
  return [e, ...t.filter((n) => n.nonce !== e.nonce && Ue(n.name, e.name))];
}
function Ue(e, t) {
  return e.trim() === t.trim();
}
class N extends Error {
}
class Lt {
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
function Tt(e, t, n) {
  if (t !== "table" || n.blocked || !n.available || n.menuOpen || e.repeat || e.ctrlKey || e.altKey || e.metaKey || e.isComposing) return null;
  const a = e.key.toLowerCase();
  return a === "s" ? "smoke" : a === "d" ? "drink" : a === "e" && n.treatsAllowed !== !1 ? "consume" : null;
}
function At(e) {
  const t = e.blocked || !e.available || e.menuOpen, n = e.treatsAllowed !== !1, a = (o) => {
    (n || !nt(o)) && e.onOrder(o);
  };
  return /* @__PURE__ */ c.jsxs("div", { className: n ? "lan-leisure" : "lan-leisure lan-no-treats", children: [
    /* @__PURE__ */ c.jsxs("button", { disabled: t, onClick: e.onSmoke, children: [
      "Cigar ",
      /* @__PURE__ */ c.jsx("kbd", { children: "S" })
    ] }),
    /* @__PURE__ */ c.jsxs("button", { disabled: t, onClick: e.onSip, children: [
      Qe[e.kind].label,
      " ",
      /* @__PURE__ */ c.jsx("kbd", { children: "D" })
    ] }),
    n && e.treat && /* @__PURE__ */ c.jsxs("button", { disabled: t || !e.canConsume, onClick: e.onConsume, children: [
      et[e.treat.kind].label,
      " · ",
      e.treat.remaining,
      " ",
      /* @__PURE__ */ c.jsx("kbd", { children: "E" })
    ] }),
    /* @__PURE__ */ c.jsx("button", { disabled: e.blocked, "aria-expanded": e.menuOpen, onClick: () => e.onMenuChange(!e.menuOpen), children: "Drinks ▾" }),
    e.menuOpen && /* @__PURE__ */ c.jsx(
      tt,
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
const jt = 3e4;
class Nt {
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
  // Bumped by everything that cancels in-flight voice work: voices observed
  // off, and reset(). See contract 4. Never compared for order, only equality.
  #a = 0;
  /** Send one line. Text first, always: a voice failure never costs the
   * message. Then, detached, only if the host has voices on and this player
   * configured a provider: synthesise locally, play it for ourselves, relay it. */
  async send(t, n, a = () => {
  }) {
    const o = this.#a;
    let i;
    try {
      const m = await this.deps.hostApi("/api/chat", { text: t });
      if (!Number.isSafeInteger(m?.receipt?.seq)) return { sent: !1, error: "The host did not accept the message." };
      i = Number(m.receipt.seq);
    } catch (m) {
      return { sent: !1, error: m instanceof Error ? m.message : "Message not sent." };
    }
    return this.#e.add(i), this.#o(i, t, n, o).then(a, () => a({ seq: i, voice: "off", issue: "failed" })), { sent: !0, seq: i };
  }
  async #o(t, n, a, o) {
    const i = this.deps.provider();
    if (!a || !i || !this.#s(o)) return { seq: t, voice: "off" };
    const m = await i.synthesize(n);
    if (!this.#s(o)) return { seq: t, voice: "off" };
    if (!m.ok) return { seq: t, voice: "off", issue: m.reason };
    if (this.deps.play(m.audio, 0), m.audio.length > Ae) return { seq: t, voice: "local-only", issue: "too-long" };
    try {
      return await this.deps.hostApi("/api/voice", { seq: t, mime: je, data: bt(m.audio) }), { seq: t, voice: "spoken" };
    } catch {
      return { seq: t, voice: "local-only", issue: "relay-refused" };
    }
  }
  /** Feed every poll's chat projection. Playback is the side effect; each seq
   * is decided at most once per tab. */
  observe(t, n, a) {
    if (this.#t && !n && this.deps.stopAll(), n || this.#a++, this.#t = n, !this.#n) {
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
        o.voice && (this.#e.add(o.seq), !(o.displaySeat === 0 || o.ageMs > jt) && this.#r(o.seq, o.displaySeat, this.#a));
      }
    if (this.#e.size > 64) {
      const o = new Set(t.map((i) => i.seq));
      for (const i of this.#e) o.has(i) || this.#e.delete(i);
    }
  }
  /** A new table generation (host restart, a different table) starts a new
   * history; the next observe() treats its lines as already said. */
  reset() {
    this.#a++, this.#n = !1, this.#e.clear(), this.#t = !1, this.deps.stopAll();
  }
  /** Test/diagnostic view of the bounded state. */
  get trackedCount() {
    return this.#e.size;
  }
  #s(t) {
    return t === this.#a;
  }
  async #r(t, n, a) {
    try {
      const o = await this.deps.hostApi(`/api/voice/${t}`);
      if (!this.#s(a) || o?.mime !== je || typeof o.data != "string") return;
      const i = gt(o.data);
      if (!i || i.length > Ae || !vt(i)) return;
      this.deps.play(i, n);
    } catch {
    }
  }
}
const Ne = { maxChars: 200 };
function Ot(e, t, n) {
  return t === "table" && !n && !e.repeat && !e.ctrlKey && !e.altKey && !e.metaKey && !e.isComposing && e.key.toLowerCase() === "t";
}
const It = (e) => Math.min(14e3, 4e3 + [...e].length * 65), Dt = (e) => e.ageMs < It(e.text);
function Bt(e, t) {
  for (let n = e.length - 1; n >= 0; n--) if (e[n].displaySeat === t) return Dt(e[n]) ? e[n] : null;
  return null;
}
const Kt = (e) => e <= 2 ? "start" : e >= 4 ? "end" : "center";
function $t({ line: e }) {
  return /* @__PURE__ */ c.jsx("div", { className: `chat-bubble ${Kt(e.displaySeat)}`, "aria-hidden": "true", children: e.text });
}
function Mt({ lines: e, status: t }) {
  return /* @__PURE__ */ c.jsxs("section", { className: "lan-chat-log", "aria-label": "Table chat", children: [
    /* @__PURE__ */ c.jsx("ol", { "aria-live": "polite", "aria-relevant": "additions", children: e.slice(-6).map((n) => /* @__PURE__ */ c.jsxs("li", { children: [
      /* @__PURE__ */ c.jsx("b", { children: n.displaySeat === 0 ? "You" : n.name }),
      " ",
      n.text
    ] }, n.seq)) }),
    t && /* @__PURE__ */ c.jsx("p", { className: "lan-chat-status", role: "status", children: t })
  ] });
}
function Pt(e) {
  const [t, n] = d.useState(""), [a, o] = d.useState(!1), i = d.useRef(null);
  return d.useEffect(() => {
    i.current?.focus();
  }, []), /* @__PURE__ */ c.jsxs("form", { className: "lan-chat-input", onSubmit: (m) => {
    m.preventDefault();
    const A = t.trim();
    !A || a || (o(!0), e.onSend(A).then((q) => {
      o(!1), q && e.onClose();
    }));
  }, children: [
    /* @__PURE__ */ c.jsxs("label", { children: [
      "Say ",
      /* @__PURE__ */ c.jsx(
        "input",
        {
          ref: i,
          value: t,
          maxLength: Ne.maxChars,
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
      Ne.maxChars,
      " · Enter sends · Esc closes",
      e.voiceHint ? ` · ${e.voiceHint}` : ""
    ] })
  ] });
}
function Vt(e) {
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
function Ft(e) {
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
          onChange: (i) => n(i.target.value)
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
          onChange: (i) => o(i.target.value)
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
const s = (e) => document.getElementById(e), j = new St(() => sessionStorage, () => localStorage), E = new Lt(), re = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), (e) => e.toString(16).padStart(2, "0")).join("");
let v = "", I = re(), r = null, b = !1, pe = !1, h = !1, u = null, oe = !1, R = !1, g = !1, p = !1, W = 0, te = -1, C = !1, Q = !1, T = { kind: "old-fashioned", available: !1, treat: null, canConsume: !1 };
const ne = /* @__PURE__ */ new Map(), qe = d.createRef(), Oe = x.createRoot(s("actions")), ge = x.createRoot(s("leisure")), Ie = x.createRoot(s("bank")), De = x.createRoot(s("chat")), Be = x.createRoot(s("features")), Ht = x.createRoot(s("voice-settings")), Ut = x.createRoot(s("header")), Ke = x.createRoot(s("hud")), $e = x.createRoot(s("pot")), Me = x.createRoot(s("table-info")), y = new at(
  ot.fireplace ? st : void 0,
  [Le.position[0], 0.4, Le.position[2] + 0.05]
);
let S = !1, Pe = null, ie = document.hasFocus(), $ = !0;
const le = () => y.setAmbienceActive(!!r && !r.paused && !p && !h && !g && !document.hidden && ie);
s("app").addEventListener("pointerdown", () => y.unlock());
s("app").addEventListener("keydown", (e) => {
  e.repeat || y.unlock();
});
document.addEventListener("visibilitychange", () => {
  le(), document.hidden || f();
});
document.addEventListener("fullscreenchange", () => f());
window.addEventListener("blur", () => {
  ie = !1, le();
});
window.addEventListener("focus", () => {
  ie = !0, le();
});
window.addEventListener("pagehide", () => y.dispose(), { once: !0 });
const D = () => s("app").focus(), U = () => u?.setLookBlocked(Q || g || C || V), qt = (e) => {
  Q = e, U(), xe();
}, _t = { store: Ct(() => localStorage), http: wt() }, M = () => Se.voice ?? _t;
let B = null, P = "", V = !1, Y = "", ae = !1;
const _e = () => B ? kt(() => B, M().http) : null, zt = (e) => e === 0 || !me[e] ? null : [me[e][0], 1.45, me[e][1]], F = new Nt({
  hostApi: (e, t) => k(e, t),
  provider: _e,
  play: (e, t) => {
    y.playVoice(e, t, zt(t));
  },
  stopAll: () => y.stopVoices()
});
async function Yt() {
  const e = M(), t = await e.store.load().catch(() => null);
  e === M() && (B = t, f());
}
async function Jt(e, t) {
  const n = yt({ apiKey: e, voiceId: t });
  if (!n) {
    P = "That key or voice ID does not look right. Copy both from your ElevenLabs account.", f();
    return;
  }
  const a = await M().store.save(n);
  B = n, P = a ? "Voice saved." : "Could not save it here; it will be used in this tab until you close it.", f();
}
async function Gt() {
  await M().store.clear(), B = null, P = "Key forgotten on this device.", f();
}
async function Wt() {
  const e = _e();
  if (!e) return;
  P = "Asking ElevenLabs…", f(), y.unlock();
  const t = await e.synthesize("This is how I sound at the table.");
  P = t.ok ? S ? "Voice works. Unmute sound (M) to hear it." : "Voice works." : be[t.reason], t.ok && y.playVoice(t.audio, 0, null), f();
}
const Xt = {
  "rate-limited": "Slow down: one message every few seconds.",
  invalid: "Messages are one line of plain text, up to 200 characters.",
  disconnected: "Reconnecting; message not sent.",
  unauthorized: "You are no longer at this table."
};
async function Zt(e) {
  const t = await F.send(e, !!r?.features?.voices, (n) => {
    Y = n.issue === "too-long" ? "Too long to relay: only you heard it; others see the text." : n.issue === "relay-refused" ? "Others see this line as text only." : n.issue && be[n.issue] ? be[n.issue] : "", f();
  });
  return t.sent ? (Y = "", f(), !0) : (Y = Xt[t.error] ?? t.error, f(), !1);
}
function Ee(e) {
  V = e, U(), f(), e || D();
}
function Qt(e) {
  !r?.isHost || ae || (ae = !0, f(), k("/api/features", e).catch((t) => {
    t instanceof N || (s("error").textContent = t.message);
  }).finally(() => {
    ae = !1, f();
  }));
}
const J = j.current();
let G = [], O = J?.name || "Guest", X = J?.code || "";
J && (v = J.token, I = J.nonce, s("name").value = O);
const ve = [], Ve = (/* @__PURE__ */ new Date()).toISOString();
let ze = !1;
const ce = () => ({ token: v, nonce: I, name: O, ...X ? { code: X } : {}, at: Date.now() }), en = (e) => String(e || "").toUpperCase().replace(/[^A-F0-9]/g, "");
function ye(e = !1) {
  j.save(ce(), e) || (s("storage-warning").textContent = "Browser storage is unavailable. You can play, but keep this tab open: your seat may not survive closing or reloading it.");
}
function de(e) {
  j.forget(e) || (s("storage-warning").textContent = "Browser storage blocked cleanup. This device may still remember the seat; clear its poker site data before sharing this browser.");
}
function Z() {
  G = j.saved(), s("recovery").hidden = v || !G.length, s("saved-seats").replaceChildren(...G.map((e, t) => {
    const n = document.createElement("option");
    n.value = String(t);
    const a = e.at ? new Date(e.at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "earlier";
    return n.textContent = `${e.name} · ${e.code ? `table ${e.code.slice(0, 5)}-${e.code.slice(5)}` : "unknown table"} · ${a}`, n;
  })), s("resume-seat").disabled = s("forget-seat").disabled = b;
}
function tn(e, t, n) {
  if (ve.length >= 512) {
    ze = !0;
    return;
  }
  const a = n?.view;
  ve.push({ at: performance.now(), path: e, status: t, ...a ? {
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
async function k(e, t) {
  const n = E.begin();
  let a, o;
  try {
    const i = Se.apiTransport;
    a = i ? await i({
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
  } catch (i) {
    throw E.failureCurrent(n) ? i : new N();
  }
  if (!E.current(n)) throw new N();
  if (tn(e, a.status, o), o.view) {
    if (!E.accept(n, o)) throw new N();
    const i = r && o.generation !== r.generation;
    (i || p) && y.resetEvents(), i && (W++, te = -1, R = !1, u?.setInspection(!1), F.reset()), r = o, p = !1, f();
  } else if (!a.ok && !E.failureCurrent(n))
    throw new N();
  if (v && [401, 410].includes(a.status) && (h = !0, E.reset(), s("forget").hidden = !1), !a.ok) throw Object.assign(new Error(o.error || o.receipt?.code || "Request rejected."), { status: a.status });
  return o;
}
function K() {
  return {
    available: T.available,
    menuOpen: C,
    treatsAllowed: !!r?.features?.treats,
    blocked: !r || !u || oe || b || p || h || r.paused || r.view.phase === "ready" || r.view.self.waiting || R || g || Q
  };
}
function xe() {
  if (!r) {
    ge.render(null);
    return;
  }
  ge.render(d.createElement(At, {
    ...K(),
    kind: T.kind,
    treat: T.treat,
    canConsume: T.canConsume,
    onSmoke: () => se("smoke"),
    onSip: () => se("drink"),
    onConsume: () => se("consume"),
    onMenuChange: Ce,
    onOrder: (e) => {
      const t = K();
      !he(e) && !t.treatsAllowed || !t.blocked && t.available && (he(e) ? u?.orderDrink(e) : u?.orderTreat(e)) && (he(e) && Re({ action: "order", kind: e }), Ce(!1));
    }
  }));
}
let ke = !1, we = -1 / 0;
function Re(e) {
  !v || h || (ke = !0, we = performance.now(), k("/api/leisure", e).catch(() => {
  }).finally(() => {
    ke = !1;
  }));
}
function nn(e) {
  Re(e === "smoke" ? { action: "smoke" } : { action: "sip", kind: T.kind });
}
function se(e) {
  const t = K();
  t.blocked || t.menuOpen || !t.available || e === "consume" && !t.treatsAllowed || (e === "smoke" ? u?.smokeCigar() : e === "consume" ? u?.consumeTreat() : u?.sipDrink(), D());
}
function an(e) {
  const t = e.players[e.self.seat]?.leisure;
  !t || t.drinkKind === T.kind || ke || r.paused || e.self.waiting || p || h || !u || performance.now() - we < 3e3 || (we = performance.now(), Re({ action: "order", kind: T.kind }));
}
function Ce(e) {
  e && K().blocked || (C = e, W++, U(), f(), e || D());
}
function Fe(e, t = !1) {
  const n = t ? -1 : e;
  if (u && Pe !== n) {
    u.dispose(), u = null;
    for (const o of ne.values()) o.root.unmount();
    ne.clear(), s("labels").replaceChildren();
  }
  if (u || oe || document.hidden) return;
  const a = () => {
    oe = !0, s("error").textContent = "3D rendering unavailable. Reload this tab to reconnect without losing your seat.";
  };
  try {
    u = new pt(s("scene"), a, void 0, (o) => {
      T = o, xe();
    }, e), u.setLookEnabled($), u.onLeisureStarted = nn, u.setDrinkEffect(s("drink-effect").value), Pe = n;
    for (let o = 1; o < 6; o++) {
      const i = document.createElement("div");
      i.className = "seat", s("labels").append(i), ne.set(o, { node: i, root: x.createRoot(i) }), u.bindWorldLabel(o, i);
    }
    u.bindWorldLabel(-1, s("pot")), u.onAudioListener = (o) => y.setListenerMatrix(o);
  } catch {
    a();
  }
}
function f() {
  if (s("entry").hidden = !!r, s("table").hidden = !r, s("inspect").hidden = s("details").hidden = !r, Ut.render(d.createElement(
    rt,
    { onLobby: () => {
      r && H(!0);
    } },
    d.createElement("button", { "aria-label": S ? "Unmute sound" : "Mute sound", title: "Sound (M)", onClick: () => {
      S = !S, y.setMuted(S), S || y.unlock(), f();
    } }, S ? "♪̸" : "♪"),
    r && d.createElement("button", { "aria-label": "Settings", title: "Table settings", onClick: () => H(!0) }, "⚙"),
    r && d.createElement("button", { "aria-label": "Recenter view", title: "Drag the room to look · Recenter (R)", disabled: K().blocked || C, onClick: () => {
      u?.recenterLook(), D();
    } }, "⌖"),
    r?.isHost && d.createElement("button", { "aria-label": r.paused ? "Resume table" : "Pause table", disabled: b, onClick: () => L(() => k("/api/pause", { paused: !r.paused })) }, r.paused ? "▶" : "Ⅱ"),
    document.fullscreenEnabled && d.createElement("button", { "aria-label": document.fullscreenElement ? "Exit fullscreen" : "Enter fullscreen", onClick: () => {
      (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {
        s("error").textContent = "Fullscreen unavailable. The game still fills the browser.";
      });
    } }, "⤢")
  )), s("app").classList.toggle("inspecting", R), le(), s("create").disabled = b || !!v, s("join").disabled = b || !!v, !r) {
    Fe(0, !0), u?.setPlaying(!1), Oe.render(null), y.resetEvents(), Ke.render(null), $e.render(null), Me.render(null), s("actions").hidden = s("deal-actions").hidden = !0, R = !1, g = !1, C = !1, Q = !1, T = { kind: "old-fashioned", available: !1, treat: null, canConsume: !1 }, p = !1, te = -1, s("menu").hidden = !0, ge.render(null), Ie.render(null), V = !1, Y = "", F.reset(), De.render(null), Be.render(null), He(), Z();
    return;
  }
  const e = r.view, t = e.players[e.self.seat];
  e.revision !== te && (te = e.revision, W++), Fe(e.self.seat), u?.updateRemote(e, e.self.seat), u?.setPlaying(e.phase !== "ready" && !e.self.waiting), u?.setPaused(r.paused || p || h || g), (r.paused || p || h || g || e.self.waiting) && (C = !1), U(), xe(), an(e);
  for (const l of e.players) if (l.displaySeat !== 0) {
    const w = ne.get(l.displaySeat);
    if (!w) continue;
    w.node.classList.toggle("active", e.actor === l.seat), w.node.classList.toggle("folded", l.folded), w.node.classList.toggle("out", l.stack === 0 && !l.committed), w.node.style.setProperty("--seat-color", Te[l.seat].color);
    const fe = Bt(e.chat ?? [], l.displaySeat);
    w.root.render(d.createElement(d.Fragment, null, d.createElement(it, {
      name: l.name,
      dealer: e.dealer === l.seat,
      blind: e.smallBlindSeat === l.seat ? "SB" : e.bigBlindSeat === l.seat ? "BB" : "",
      stack: l.stack,
      action: e.actor === l.seat ? l.kind === "human" ? "DECIDING" : "THINKING" : l.action || Te[l.seat].title,
      visibleCards: l.cards.kind === "visible" ? l.cards.values : []
    }), fe && d.createElement($t, { key: fe.seq, line: fe })));
  }
  s("labels").hidden = R;
  const n = !!r.features?.voices;
  F.observe(e.chat ?? [], n, !S && !document.hidden), De.render(d.createElement(
    d.Fragment,
    null,
    d.createElement(Mt, { lines: e.chat ?? [], status: Y }),
    V && d.createElement(Pt, {
      onSend: Zt,
      onClose: () => Ee(!1),
      voiceHint: n ? B ? "spoken in your voice" : "voices are on: add your key in Table menu" : ""
    })
  )), Be.render(d.createElement(Vt, { isHost: !!r.isHost, features: r.features ?? { voices: !1, treats: !1 }, pending: ae || b, onChange: Qt })), He(), s("connection").textContent = p || h ? "Connection interrupted — wagering disabled" : r.hostConnected ? r.paused ? "Table paused" : e.self.waiting ? "Seat reserved — joining next hand" : e.actor === e.self.seat ? "Your move" : "Connected · LAN" : "Host disconnected — table suspended";
  const a = Se.shareUrls ?? (Array.isArray(r.shareUrls) ? r.shareUrls : []);
  s("invite").textContent = r.code ? `Lobby code: ${r.code.slice(0, 5)}-${r.code.slice(5)}${a.length ? ` · Friends join at ${a.join(" or ")}` : ""}` : "Six playing seats · empty seats are NPCs", s("host-storage").textContent = r.durable ? "Host saves this table privately. A host restart pauses play until the host resumes." : "Disposable host: stopping its process ends this table.";
  const o = e.phase === "betting" ? ["Pre-flop", "Flop", "Turn", "River"][e.street] : e.phase === "ready" ? "Waiting for host" : e.phase === "complete" ? "Hand complete" : e.phase === "showdown" ? "Showdown" : "Dealing", i = e.phase === "complete" ? e.results.filter((l) => l.won > 0).map((l) => `${e.players[l.seat].name} wins ${l.won}`).join(" · ") : "", m = t.cards.kind === "visible" ? t.cards.values : [], A = e.phase === "complete", q = e.phase === "betting" && e.actor === e.self.seat, We = m.length === 2 && e.board.length >= 3 ? lt([...m, ...e.board]).name : "Practice chips", Xe = p || h ? "Connection interrupted" : r.paused ? "Table paused" : e.self.waiting ? "Your seat is reserved." : A ? i : q ? "Your move." : e.actor !== null ? `${e.players[e.actor].name} is thinking…` : o;
  Me.render(d.createElement(ct, { handNumber: e.handNumber, smallBlind: e.smallBlind, bigBlind: e.bigBlind })), $e.render(d.createElement(dt, { finished: A, amount: A ? e.awards.reduce((l, w) => l + w.amount, 0) : e.pot, sidePots: e.awards.length - 1 })), Ke.render(d.createElement(ut, {
    board: e.board,
    street: ft[e.street],
    ownCards: m,
    stack: t.stack,
    position: `${e.dealer === t.seat ? " · DEALER" : ""}${e.smallBlindSeat === t.seat ? " · SB" : ""}${e.bigBlindSeat === t.seat ? " · BB" : ""}`,
    handLabel: t.folded ? "Folded" : We,
    status: Xe,
    detail: b ? "Sending…" : e.self.waiting ? "Joining at the next hand" : t.action,
    winningCards: A ? e.results.find((l) => l.seat === t.seat && l.won > 0)?.hand?.cards ?? [] : [],
    withActions: q || A || e.phase === "ready"
  })), y.observe(
    e.gameRevision,
    {
      hand: e.handNumber,
      phase: e.phase,
      actor: e.actor,
      boardCount: e.board.length,
      players: e.players.map((l) => ({ seat: l.seat, stack: l.stack, bet: l.bet, folded: l.folded, action: l.action }))
    },
    !r.paused && !p && !h && !g && !e.self.waiting && ie && !document.hidden,
    e.self.seat
  ), s("players").replaceChildren(...[...e.players].sort((l, w) => l.displaySeat - w.displaySeat).map((l) => {
    const w = document.createElement("li");
    return w.textContent = `${l.name} · ${l.kind}${l.pendingName ? " · next: " + l.pendingName : ""} · ${l.stack} chips · ${l.action || "waiting"}${e.actor === l.seat ? " · to act" : ""}`, w;
  })), s("deal-actions").hidden = !r.isHost || !["ready", "complete"].includes(e.phase) || r.paused || g, s("pause").hidden = !r.isHost, s("start").disabled = b || r.paused || p || h, s("pause").disabled = b, s("pause").textContent = r.paused ? "Resume table" : "Pause table", s("leave").disabled = b, s("leave").textContent = r.isHost ? "End session for everyone" : "Leave table", Ie.render(d.createElement(ht, {
    offer: e.self.bank,
    revision: e.revision,
    blocked: b || r.paused || p || h || !g,
    onConfirm: on
  }));
  const Ze = !b && !r.paused && !p && !h && !g && !C && !e.self.waiting && e.actor === e.self.seat && e.phase === "betting";
  s("actions").hidden = !q || r.paused || g || p || h, Oe.render(d.createElement(mt, {
    ref: qe,
    revision: W,
    blocked: !Ze,
    legal: e.legal,
    pot: e.pot,
    currentBet: e.currentBet,
    ownBet: t.bet,
    bigBlind: e.bigBlind,
    onAction: sn,
    onOpenChange: qt,
    focusTable: D
  })), s("inspect").disabled = r.paused || e.self.waiting || p || h || g, s("inspect").setAttribute("aria-pressed", String(R)), s("inspect").firstChild.nodeValue = R ? "Look up " : "Cards & chips ";
}
function He() {
  Ht.render(d.createElement(Ft, {
    where: M().store.where,
    configured: !!B,
    status: P,
    onSave: (e, t) => {
      Jt(e, t);
    },
    onForget: () => {
      Gt();
    },
    onTest: () => {
      Wt();
    }
  }));
}
async function L(e) {
  if (!b) {
    b = !0, s("error").textContent = "", f();
    try {
      await e();
    } catch (t) {
      t instanceof N || (W++, s("error").textContent = t.message);
    } finally {
      b = !1, f();
    }
  }
}
async function Ye(e) {
  O = s("name").value, ye();
  let t;
  try {
    t = await k(e ? "/api/join" : "/api/create", { name: O, nonce: I, ...e ? { code: s("code").value } : {} });
  } catch (n) {
    if (!e && n?.status === 409) {
      const a = xt(j.saved(), O);
      if (a.length && await Je(a)) return;
      throw Z(), new Error(j.saved().length ? 'This host already has a table. No saved seat under this name belongs to it; choose one under "Return to a saved seat", or restart the host with a fresh table.' : "This host already has a table, and this browser has no saved seat for it. Resume from the browser that created it, or restart the host with a fresh table.");
    }
    throw n;
  }
  X = en(t.code || (e ? s("code").value : "")), E.reset(), v = t.token, ye(s("remember").checked), await k("/api/state");
}
async function Je(e) {
  const t = () => {
    E.reset(), v = "", I = re(), O = s("name").value || "Guest", X = "", r = null, h = !1, s("forget").hidden = !0;
  };
  let n;
  try {
    n = await Et(e, async (a) => {
      E.reset(), v = a.token, I = a.nonce, O = a.name, X = a.code || "", h = !1, oe = !1;
      try {
        return await k("/api/state"), "accepted";
      } catch (o) {
        if (h) return "rejected";
        throw o;
      }
    }, (a) => de(a));
  } catch (a) {
    throw t(), Z(), a;
  }
  return n ? (ye(!0), !0) : (t(), Z(), !1);
}
s("create").onclick = () => L(() => Ye(!1));
s("join").onclick = () => L(() => Ye(!0));
s("start").onclick = () => L(() => k("/api/start", { revision: r.view.revision }));
s("pause").onclick = () => L(() => k("/api/pause", { paused: !r.paused }));
s("leave").onclick = () => L(async () => {
  await k("/api/leave", {}), E.reset(), de(ce()), v = "", r = null, F.reset(), I = re(), s("connection").textContent = "Left table";
});
s("forget").onclick = () => {
  E.reset(), de(ce()), v = "", r = null, h = !1, I = re(), F.reset(), s("forget").hidden = !0, s("error").textContent = "", s("connection").textContent = "Not connected", f();
};
s("resume-seat").onclick = () => {
  const e = G[Number(s("saved-seats").value)];
  e && L(async () => {
    if (!await Je(Rt(e, j.saved()))) throw new Error(`None of the seats saved as "${e.name}" belong to a table on this host. They were removed; choose another saved seat, or create or join a table.`);
  });
};
s("forget-seat").onclick = () => {
  const e = G[Number(s("saved-seats").value)];
  e && (de(e), Z());
};
s("remember-current").onclick = () => {
  j.save(ce(), !0) ? s("seat-note").textContent = "Seat remembered on this browser. Close this tab before resuming it in another." : s("storage-warning").textContent = "Browser storage is unavailable. Keep this tab open; the seat was not safely remembered.";
};
function sn(e) {
  if (b || h || p || g || C || !r || r.paused || r.view.actor !== r.view.self.seat) return !1;
  const t = r.view;
  return L(() => k("/api/action", { sequence: t.self.nextSequence, revision: t.revision, action: e })), !0;
}
function on(e, t) {
  if (b || h || p || !r || r.paused || !g || r.view.revision !== t) return !1;
  const n = r.view, a = n.self.bank;
  return (e.type === "borrow" ? !a.canBorrow : e.amount <= 0 || e.amount > a.repayMax) ? !1 : (L(() => k("/api/action", { sequence: n.self.nextSequence, revision: t, action: e })), !0);
}
function H(e) {
  g = e, s("menu").hidden = !e, U(), f(), e || D();
}
s("details").onclick = () => H(!g);
s("close-menu").onclick = () => H(!1);
for (const e of ["ambience-level", "effects-level"]) s(e).onchange = () => {
  y.setLevels(Number(s("ambience-level").value), Number(s("effects-level").value));
};
s("drink-effect").onchange = () => u?.setDrinkEffect(s("drink-effect").value);
s("look-enabled").onclick = () => {
  $ = !$, u?.setLookEnabled($), s("look-enabled").setAttribute("aria-pressed", String($)), s("look-enabled").textContent = $ ? "On" : "Off";
};
function ue(e) {
  e && (C = !1), R = e, u?.setInspection(e), s("labels").hidden = e, U(), f();
}
s("inspect").onclick = () => {
  ue(!R), D();
};
s("app").addEventListener("keydown", (e) => {
  const t = e.target.closest("input,select,textarea,[contenteditable=true]") ? "editing" : e.target.closest("button,a") ? "control" : "table";
  if (!r || t === "editing" || e.altKey || e.ctrlKey || e.metaKey || e.isComposing) return;
  if (Ot(e, t, !r || h || p || g || C || R || Q || V)) {
    e.preventDefault(), Ee(!0);
    return;
  }
  if (e.key.toLowerCase() === "m" && !e.repeat) {
    e.preventDefault(), S = !S, y.setMuted(S), S || y.unlock(), f();
    return;
  }
  if (e.key === "Escape" && C) {
    e.preventDefault(), e.stopPropagation(), Ce(!1);
    return;
  }
  if (e.key === "Escape" && g) {
    e.preventDefault(), H(!1);
    return;
  }
  if (e.key.toLowerCase() === "r" && t === "table" && !e.repeat && !K().blocked && !C) {
    e.preventDefault(), u?.recenterLook();
    return;
  }
  const n = Tt(e, t, K());
  if (n) {
    e.preventDefault(), se(n);
    return;
  }
  if (!qe.current?.handleKey({
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
      e.preventDefault(), r.isHost ? L(() => k("/api/pause", { paused: !r.paused })) : H(!0);
      return;
    }
    e.key === " " && t === "table" && !g && !C && !p && !h && !r.paused && !r.view.self.waiting && (e.preventDefault(), ue(!0));
  }
});
s("app").addEventListener("keyup", (e) => {
  e.key === " " && ue(!1);
});
window.addEventListener("blur", () => ue(!1));
s("export").onclick = () => {
  const e = new Blob([JSON.stringify({ source: "actual-browser-lan-3d-client", started: Ve, truncated: ze, records: ve }, null, 2)], { type: "application/json" }), t = URL.createObjectURL(e), n = document.createElement("a");
  n.href = t, n.download = `poker-lan-${Ve.replaceAll(":", "-")}.json`, n.click(), setTimeout(() => URL.revokeObjectURL(t), 1e3);
};
async function Ge() {
  if (!(!v || h || b || pe)) {
    pe = !0;
    try {
      await k("/api/state");
    } catch (e) {
      e instanceof N || (p = !0, s("error").textContent = e.message, f());
    } finally {
      pe = !1;
    }
  }
}
s("chat-open").onclick = () => {
  r && !V && Ee(!0);
};
setInterval(Ge, 500);
f();
Ge();
Yt();
