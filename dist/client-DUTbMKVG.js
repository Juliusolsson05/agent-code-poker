import { j as c, D as Ze, d as Qe, g as et, p as tt, r as d, b as nt, a as at, o as x, f as st, T as ot, F as Le, n as rt, q as he, i as me, C as Te, S as it, e as lt, c as ct, h as dt, k as ut, l as ft, m as ht, B as mt } from "./BankControls-CgH75kin.js";
import { M as Ae, b as pt, V as je, a as bt, l as gt, c as vt, d as yt, e as be, n as kt, f as wt } from "./lanView-Cumi6Alx.js";
const Q = "poker-lan-connection-test-v1", U = "poker-lan-saved-seat-v1:";
function _(e, t = !1) {
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
class Ct {
  constructor(t, n) {
    this.session = t, this.local = n;
  }
  session;
  local;
  current() {
    try {
      return _(this.session().getItem(Q), !0);
    } catch {
      return null;
    }
  }
  saved() {
    try {
      const t = this.local(), n = [];
      for (let a = 0; a < Math.min(t.length, 4096) && n.length < 64; a++) {
        const o = t.key(a);
        if (!o?.startsWith(U)) continue;
        const l = _(t.getItem(o));
        l?.token && o === U + l.nonce && n.push(l);
      }
      return n.sort((a, o) => (o.at ?? 0) - (a.at ?? 0));
    } catch {
      return [];
    }
  }
  save(t, n) {
    const a = _(JSON.stringify(t));
    if (!a) return !1;
    let o = !0;
    try {
      this.session().setItem(Q, JSON.stringify(a));
    } catch {
      o = !1;
    }
    if (n && a.token)
      try {
        this.local().setItem(U + a.nonce, JSON.stringify(a));
      } catch {
        o = !1;
      }
    return o;
  }
  forget(t) {
    let n = !0;
    try {
      const a = _(this.session().getItem(Q), !0);
      a?.nonce === t.nonce && a.token === t.token && this.session().removeItem(Q);
    } catch {
      n = !1;
    }
    try {
      const a = this.local();
      _(a.getItem(U + t.nonce))?.token === t.token && a.removeItem(U + t.nonce);
    } catch {
      n = !1;
    }
    return n;
  }
}
async function St(e, t, n) {
  for (const a of e) {
    if (await t(a) === "accepted") return a;
    n(a);
  }
  return null;
}
function Et(e, t) {
  const n = t.trim();
  return n ? e.filter((a) => a.name.trim() === n) : [];
}
class N extends Error {
}
class xt {
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
function Rt(e, t, n) {
  if (t !== "table" || n.blocked || !n.available || n.menuOpen || e.repeat || e.ctrlKey || e.altKey || e.metaKey || e.isComposing) return null;
  const a = e.key.toLowerCase();
  return a === "s" ? "smoke" : a === "d" ? "drink" : a === "e" && n.treatsAllowed !== !1 ? "consume" : null;
}
function Lt(e) {
  const t = e.blocked || !e.available || e.menuOpen, n = e.treatsAllowed !== !1, a = (o) => {
    (n || !tt(o)) && e.onOrder(o);
  };
  return /* @__PURE__ */ c.jsxs("div", { className: n ? "lan-leisure" : "lan-leisure lan-no-treats", children: [
    /* @__PURE__ */ c.jsxs("button", { disabled: t, onClick: e.onSmoke, children: [
      "Cigar ",
      /* @__PURE__ */ c.jsx("kbd", { children: "S" })
    ] }),
    /* @__PURE__ */ c.jsxs("button", { disabled: t, onClick: e.onSip, children: [
      Ze[e.kind].label,
      " ",
      /* @__PURE__ */ c.jsx("kbd", { children: "D" })
    ] }),
    n && e.treat && /* @__PURE__ */ c.jsxs("button", { disabled: t || !e.canConsume, onClick: e.onConsume, children: [
      Qe[e.treat.kind].label,
      " · ",
      e.treat.remaining,
      " ",
      /* @__PURE__ */ c.jsx("kbd", { children: "E" })
    ] }),
    /* @__PURE__ */ c.jsx("button", { disabled: e.blocked, "aria-expanded": e.menuOpen, onClick: () => e.onMenuChange(!e.menuOpen), children: "Drinks ▾" }),
    e.menuOpen && /* @__PURE__ */ c.jsx(
      et,
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
const Tt = 3e4;
class At {
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
    return this.#e.add(o), this.#a(o, t, n).then(a, () => a({ seq: o, voice: "off", issue: "failed" })), { sent: !0, seq: o };
  }
  async #a(t, n, a) {
    const o = this.deps.provider();
    if (!a || !o) return { seq: t, voice: "off" };
    const l = await o.synthesize(n);
    if (!l.ok) return { seq: t, voice: "off", issue: l.reason };
    if (this.deps.play(l.audio, 0), l.audio.length > Ae) return { seq: t, voice: "local-only", issue: "too-long" };
    try {
      return await this.deps.hostApi("/api/voice", { seq: t, mime: je, data: pt(l.audio) }), { seq: t, voice: "spoken" };
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
        o.voice && (this.#e.add(o.seq), !(o.displaySeat === 0 || o.ageMs > Tt) && this.#s(o.seq, o.displaySeat));
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
  async #s(t, n) {
    try {
      const a = await this.deps.hostApi(`/api/voice/${t}`);
      if (a?.mime !== je || typeof a.data != "string") return;
      const o = bt(a.data);
      if (!o || o.length > Ae || !gt(o)) return;
      this.deps.play(o, n);
    } catch {
    }
  }
}
const Ne = { maxChars: 200 };
function jt(e, t, n) {
  return t === "table" && !n && !e.repeat && !e.ctrlKey && !e.altKey && !e.metaKey && !e.isComposing && e.key.toLowerCase() === "t";
}
const Nt = (e) => Math.min(14e3, 4e3 + [...e].length * 65), Ot = (e) => e.ageMs < Nt(e.text);
function It(e, t) {
  for (let n = e.length - 1; n >= 0; n--) if (e[n].displaySeat === t) return Ot(e[n]) ? e[n] : null;
  return null;
}
const Dt = (e) => e <= 2 ? "start" : e >= 4 ? "end" : "center";
function Bt({ line: e }) {
  return /* @__PURE__ */ c.jsx("div", { className: `chat-bubble ${Dt(e.displaySeat)}`, "aria-hidden": "true", children: e.text });
}
function Kt({ lines: e, status: t }) {
  return /* @__PURE__ */ c.jsxs("section", { className: "lan-chat-log", "aria-label": "Table chat", children: [
    /* @__PURE__ */ c.jsx("ol", { "aria-live": "polite", "aria-relevant": "additions", children: e.slice(-6).map((n) => /* @__PURE__ */ c.jsxs("li", { children: [
      /* @__PURE__ */ c.jsx("b", { children: n.displaySeat === 0 ? "You" : n.name }),
      " ",
      n.text
    ] }, n.seq)) }),
    t && /* @__PURE__ */ c.jsx("p", { className: "lan-chat-status", role: "status", children: t })
  ] });
}
function Mt(e) {
  const [t, n] = d.useState(""), [a, o] = d.useState(!1), l = d.useRef(null);
  return d.useEffect(() => {
    l.current?.focus();
  }, []), /* @__PURE__ */ c.jsxs("form", { className: "lan-chat-input", onSubmit: (k) => {
    k.preventDefault();
    const P = t.trim();
    !P || a || (o(!0), e.onSend(P).then((ue) => {
      o(!1), ue && e.onClose();
    }));
  }, children: [
    /* @__PURE__ */ c.jsxs("label", { children: [
      "Say ",
      /* @__PURE__ */ c.jsx(
        "input",
        {
          ref: l,
          value: t,
          maxLength: Ne.maxChars,
          autoComplete: "off",
          spellCheck: !0,
          "aria-describedby": "lan-chat-hint",
          disabled: a,
          onChange: (k) => n(k.target.value),
          onKeyDown: (k) => {
            k.key === "Escape" && (k.preventDefault(), k.stopPropagation(), e.onClose());
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
function Pt(e) {
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
function Vt(e) {
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
const s = (e) => document.getElementById(e), A = new Ct(() => sessionStorage, () => localStorage), E = new xt(), oe = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), (e) => e.toString(16).padStart(2, "0")).join("");
let g = "", I = oe(), r = null, p = !1, pe = !1, h = !1, u = null, se = !1, R = !1, b = !1, m = !1, G = 0, ee = -1, C = !1, Z = !1, T = { kind: "old-fashioned", available: !1, treat: null, canConsume: !1 };
const te = /* @__PURE__ */ new Map(), qe = d.createRef(), Oe = x.createRoot(s("actions")), ge = x.createRoot(s("leisure")), Ie = x.createRoot(s("bank")), De = x.createRoot(s("chat")), Be = x.createRoot(s("features")), $t = x.createRoot(s("voice-settings")), Ft = x.createRoot(s("header")), Ke = x.createRoot(s("hud")), Me = x.createRoot(s("pot")), Pe = x.createRoot(s("table-info")), v = new at(
  ot.fireplace ? st : void 0,
  [Le.position[0], 0.4, Le.position[2] + 0.05]
);
let S = !1, Ve = null, re = document.hasFocus(), V = !0;
const ie = () => v.setAmbienceActive(!!r && !r.paused && !m && !h && !b && !document.hidden && re);
s("app").addEventListener("pointerdown", () => v.unlock());
s("app").addEventListener("keydown", (e) => {
  e.repeat || v.unlock();
});
document.addEventListener("visibilitychange", () => {
  ie(), document.hidden || f();
});
document.addEventListener("fullscreenchange", () => f());
window.addEventListener("blur", () => {
  re = !1, ie();
});
window.addEventListener("focus", () => {
  re = !0, ie();
});
window.addEventListener("pagehide", () => v.dispose(), { once: !0 });
const D = () => s("app").focus(), q = () => u?.setLookBlocked(Z || b || C || $), Ht = (e) => {
  Z = e, q(), xe();
};
let B = { store: vt(() => localStorage), http: wt() }, j = null, K = "", $ = !1, z = "", ne = !1;
const Ue = () => j ? yt(() => j, B.http) : null, qt = (e) => e === 0 || !he[e] ? null : [he[e][0], 1.45, he[e][1]], F = new At({
  hostApi: (e, t) => y(e, t),
  provider: Ue,
  play: (e, t) => {
    v.playVoice(e, t, qt(t));
  },
  stopAll: () => v.stopVoices()
});
function sn(e) {
  B = e, j = null, K = "", _e();
}
async function _e() {
  const e = B, t = await e.store.load().catch(() => null);
  e === B && (j = t, f());
}
async function Ut(e, t) {
  const n = kt({ apiKey: e, voiceId: t });
  if (!n) {
    K = "That key or voice ID does not look right. Copy both from your ElevenLabs account.", f();
    return;
  }
  const a = await B.store.save(n);
  j = n, K = a ? "Voice saved." : "Could not save it here; it will be used in this tab until you close it.", f();
}
async function _t() {
  await B.store.clear(), j = null, K = "Key forgotten on this device.", f();
}
async function zt() {
  const e = Ue();
  if (!e) return;
  K = "Asking ElevenLabs…", f(), v.unlock();
  const t = await e.synthesize("This is how I sound at the table.");
  K = t.ok ? S ? "Voice works. Unmute sound (M) to hear it." : "Voice works." : be[t.reason], t.ok && v.playVoice(t.audio, 0, null), f();
}
const Yt = {
  "rate-limited": "Slow down: one message every few seconds.",
  invalid: "Messages are one line of plain text, up to 200 characters.",
  disconnected: "Reconnecting; message not sent.",
  unauthorized: "You are no longer at this table."
};
async function Jt(e) {
  const t = await F.send(e, !!r?.features?.voices, (n) => {
    z = n.issue === "too-long" ? "Too long to relay: only you heard it; others see the text." : n.issue === "relay-refused" ? "Others see this line as text only." : n.issue && be[n.issue] ? be[n.issue] : "", f();
  });
  return t.sent ? (z = "", f(), !0) : (z = Yt[t.error] ?? t.error, f(), !1);
}
function Ee(e) {
  $ = e, q(), f(), e || D();
}
function Gt(e) {
  !r?.isHost || ne || (ne = !0, f(), y("/api/features", e).catch((t) => {
    t instanceof N || (s("error").textContent = t.message);
  }).finally(() => {
    ne = !1, f();
  }));
}
const Y = A.current();
let J = [], O = Y?.name || "Guest", W = Y?.code || "";
Y && (g = Y.token, I = Y.nonce, s("name").value = O);
const ve = [], $e = (/* @__PURE__ */ new Date()).toISOString();
let ze = !1;
const le = () => ({ token: g, nonce: I, name: O, ...W ? { code: W } : {}, at: Date.now() }), Wt = (e) => String(e || "").toUpperCase().replace(/[^A-F0-9]/g, "");
function ye(e = !1) {
  A.save(le(), e) || (s("storage-warning").textContent = "Browser storage is unavailable. You can play, but keep this tab open: your seat may not survive closing or reloading it.");
}
function ce(e) {
  A.forget(e) || (s("storage-warning").textContent = "Browser storage blocked cleanup. This device may still remember the seat; clear its poker site data before sharing this browser.");
}
function X() {
  J = A.saved(), s("recovery").hidden = g || !J.length, s("saved-seats").replaceChildren(...J.map((e, t) => {
    const n = document.createElement("option");
    n.value = String(t);
    const a = e.at ? new Date(e.at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "earlier";
    return n.textContent = `${e.name} · ${e.code ? `table ${e.code.slice(0, 5)}-${e.code.slice(5)}` : "unknown table"} · ${a}`, n;
  })), s("resume-seat").disabled = s("forget-seat").disabled = p;
}
function Xt(e, t, n) {
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
let ke = null;
function on(e) {
  ke = e;
}
async function y(e, t) {
  const n = E.begin();
  let a, o;
  try {
    a = ke ? await ke({
      path: e,
      method: t === void 0 ? "GET" : "POST",
      headers: { ...t === void 0 ? {} : { "Content-Type": "application/json" }, ...g ? { Authorization: `Bearer ${g}` } : {} },
      body: t === void 0 ? void 0 : JSON.stringify(t)
    }) : await fetch(e, {
      method: t === void 0 ? "GET" : "POST",
      cache: "no-store",
      headers: { ...t === void 0 ? {} : { "Content-Type": "application/json" }, ...g ? { Authorization: `Bearer ${g}` } : {} },
      body: t === void 0 ? void 0 : JSON.stringify(t),
      signal: AbortSignal.timeout(5e3)
    }), o = await a.json();
  } catch (l) {
    throw E.failureCurrent(n) ? l : new N();
  }
  if (!E.current(n)) throw new N();
  if (Xt(e, a.status, o), o.view) {
    if (!E.accept(n, o)) throw new N();
    const l = r && o.generation !== r.generation;
    (l || m) && v.resetEvents(), l && (G++, ee = -1, R = !1, u?.setInspection(!1), F.reset()), r = o, m = !1, f();
  } else if (!a.ok && !E.failureCurrent(n))
    throw new N();
  if (g && [401, 410].includes(a.status) && (h = !0, E.reset(), s("forget").hidden = !1), !a.ok) throw Object.assign(new Error(o.error || o.receipt?.code || "Request rejected."), { status: a.status });
  return o;
}
function M() {
  return {
    available: T.available,
    menuOpen: C,
    treatsAllowed: !!r?.features?.treats,
    blocked: !r || !u || se || p || m || h || r.paused || r.view.phase === "ready" || r.view.self.waiting || R || b || Z
  };
}
function xe() {
  if (!r) {
    ge.render(null);
    return;
  }
  ge.render(d.createElement(Lt, {
    ...M(),
    kind: T.kind,
    treat: T.treat,
    canConsume: T.canConsume,
    onSmoke: () => ae("smoke"),
    onSip: () => ae("drink"),
    onConsume: () => ae("consume"),
    onMenuChange: Se,
    onOrder: (e) => {
      const t = M();
      !me(e) && !t.treatsAllowed || !t.blocked && t.available && (me(e) ? u?.orderDrink(e) : u?.orderTreat(e)) && (me(e) && Re({ action: "order", kind: e }), Se(!1));
    }
  }));
}
let we = !1, Ce = -1 / 0;
function Re(e) {
  !g || h || (we = !0, Ce = performance.now(), y("/api/leisure", e).catch(() => {
  }).finally(() => {
    we = !1;
  }));
}
function Zt(e) {
  Re(e === "smoke" ? { action: "smoke" } : { action: "sip", kind: T.kind });
}
function ae(e) {
  const t = M();
  t.blocked || t.menuOpen || !t.available || e === "consume" && !t.treatsAllowed || (e === "smoke" ? u?.smokeCigar() : e === "consume" ? u?.consumeTreat() : u?.sipDrink(), D());
}
function Qt(e) {
  const t = e.players[e.self.seat]?.leisure;
  !t || t.drinkKind === T.kind || we || r.paused || e.self.waiting || m || h || !u || performance.now() - Ce < 3e3 || (Ce = performance.now(), Re({ action: "order", kind: T.kind }));
}
function Se(e) {
  e && M().blocked || (C = e, G++, q(), f(), e || D());
}
function Fe(e, t = !1) {
  const n = t ? -1 : e;
  if (u && Ve !== n) {
    u.dispose(), u = null;
    for (const o of te.values()) o.root.unmount();
    te.clear(), s("labels").replaceChildren();
  }
  if (u || se || document.hidden) return;
  const a = () => {
    se = !0, s("error").textContent = "3D rendering unavailable. Reload this tab to reconnect without losing your seat.";
  };
  try {
    u = new rt(s("scene"), a, void 0, (o) => {
      T = o, xe();
    }, e), u.setLookEnabled(V), u.onLeisureStarted = Zt, u.setDrinkEffect(s("drink-effect").value), Ve = n;
    for (let o = 1; o < 6; o++) {
      const l = document.createElement("div");
      l.className = "seat", s("labels").append(l), te.set(o, { node: l, root: x.createRoot(l) }), u.bindWorldLabel(o, l);
    }
    u.bindWorldLabel(-1, s("pot")), u.onAudioListener = (o) => v.setListenerMatrix(o);
  } catch {
    a();
  }
}
function f() {
  if (s("entry").hidden = !!r, s("table").hidden = !r, s("inspect").hidden = s("details").hidden = !r, Ft.render(d.createElement(
    nt,
    { onLobby: () => {
      r && H(!0);
    } },
    d.createElement("button", { "aria-label": S ? "Unmute sound" : "Mute sound", title: "Sound (M)", onClick: () => {
      S = !S, v.setMuted(S), S || v.unlock(), f();
    } }, S ? "♪̸" : "♪"),
    r && d.createElement("button", { "aria-label": "Settings", title: "Table settings", onClick: () => H(!0) }, "⚙"),
    r && d.createElement("button", { "aria-label": "Recenter view", title: "Drag the room to look · Recenter (R)", disabled: M().blocked || C, onClick: () => {
      u?.recenterLook(), D();
    } }, "⌖"),
    r?.isHost && d.createElement("button", { "aria-label": r.paused ? "Resume table" : "Pause table", disabled: p, onClick: () => L(() => y("/api/pause", { paused: !r.paused })) }, r.paused ? "▶" : "Ⅱ"),
    document.fullscreenEnabled && d.createElement("button", { "aria-label": document.fullscreenElement ? "Exit fullscreen" : "Enter fullscreen", onClick: () => {
      (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {
        s("error").textContent = "Fullscreen unavailable. The game still fills the browser.";
      });
    } }, "⤢")
  )), s("app").classList.toggle("inspecting", R), ie(), s("create").disabled = p || !!g, s("join").disabled = p || !!g, !r) {
    Fe(0, !0), u?.setPlaying(!1), Oe.render(null), v.resetEvents(), Ke.render(null), Me.render(null), Pe.render(null), s("actions").hidden = s("deal-actions").hidden = !0, R = !1, b = !1, C = !1, Z = !1, T = { kind: "old-fashioned", available: !1, treat: null, canConsume: !1 }, m = !1, ee = -1, s("menu").hidden = !0, ge.render(null), Ie.render(null), $ = !1, z = "", F.reset(), De.render(null), Be.render(null), He(), X();
    return;
  }
  const e = r.view, t = e.players[e.self.seat];
  e.revision !== ee && (ee = e.revision, G++), Fe(e.self.seat), u?.updateRemote(e, e.self.seat), u?.setPlaying(e.phase !== "ready" && !e.self.waiting), u?.setPaused(r.paused || m || h || b), (r.paused || m || h || b || e.self.waiting) && (C = !1), q(), xe(), Qt(e);
  for (const i of e.players) if (i.displaySeat !== 0) {
    const w = te.get(i.displaySeat);
    if (!w) continue;
    w.node.classList.toggle("active", e.actor === i.seat), w.node.classList.toggle("folded", i.folded), w.node.classList.toggle("out", i.stack === 0 && !i.committed), w.node.style.setProperty("--seat-color", Te[i.seat].color);
    const fe = It(e.chat ?? [], i.displaySeat);
    w.root.render(d.createElement(d.Fragment, null, d.createElement(it, {
      name: i.name,
      dealer: e.dealer === i.seat,
      blind: e.smallBlindSeat === i.seat ? "SB" : e.bigBlindSeat === i.seat ? "BB" : "",
      stack: i.stack,
      action: e.actor === i.seat ? i.kind === "human" ? "DECIDING" : "THINKING" : i.action || Te[i.seat].title,
      visibleCards: i.cards.kind === "visible" ? i.cards.values : []
    }), fe && d.createElement(Bt, { key: fe.seq, line: fe })));
  }
  s("labels").hidden = R;
  const n = !!r.features?.voices;
  F.observe(e.chat ?? [], n, !S && !document.hidden), De.render(d.createElement(
    d.Fragment,
    null,
    d.createElement(Kt, { lines: e.chat ?? [], status: z }),
    $ && d.createElement(Mt, {
      onSend: Jt,
      onClose: () => Ee(!1),
      voiceHint: n ? j ? "spoken in your voice" : "voices are on: add your key in Table menu" : ""
    })
  )), Be.render(d.createElement(Pt, { isHost: !!r.isHost, features: r.features ?? { voices: !1, treats: !1 }, pending: ne || p, onChange: Gt })), He(), s("connection").textContent = m || h ? "Connection interrupted — wagering disabled" : r.hostConnected ? r.paused ? "Table paused" : e.self.waiting ? "Seat reserved — joining next hand" : e.actor === e.self.seat ? "Your move" : "Connected · LAN" : "Host disconnected — table suspended", s("invite").textContent = r.code ? `Lobby code: ${r.code.slice(0, 5)}-${r.code.slice(5)}` : "Six playing seats · empty seats are NPCs", s("host-storage").textContent = r.durable ? "Host saves this table privately. A host restart pauses play until the host resumes." : "Disposable host: stopping its process ends this table.";
  const a = e.phase === "betting" ? ["Pre-flop", "Flop", "Turn", "River"][e.street] : e.phase === "ready" ? "Waiting for host" : e.phase === "complete" ? "Hand complete" : e.phase === "showdown" ? "Showdown" : "Dealing", o = e.phase === "complete" ? e.results.filter((i) => i.won > 0).map((i) => `${e.players[i.seat].name} wins ${i.won}`).join(" · ") : "", l = t.cards.kind === "visible" ? t.cards.values : [], k = e.phase === "complete", P = e.phase === "betting" && e.actor === e.self.seat, ue = l.length === 2 && e.board.length >= 3 ? lt([...l, ...e.board]).name : "Practice chips", We = m || h ? "Connection interrupted" : r.paused ? "Table paused" : e.self.waiting ? "Your seat is reserved." : k ? o : P ? "Your move." : e.actor !== null ? `${e.players[e.actor].name} is thinking…` : a;
  Pe.render(d.createElement(ct, { handNumber: e.handNumber, smallBlind: e.smallBlind, bigBlind: e.bigBlind })), Me.render(d.createElement(dt, { finished: k, amount: k ? e.awards.reduce((i, w) => i + w.amount, 0) : e.pot, sidePots: e.awards.length - 1 })), Ke.render(d.createElement(ut, {
    board: e.board,
    street: ft[e.street],
    ownCards: l,
    stack: t.stack,
    position: `${e.dealer === t.seat ? " · DEALER" : ""}${e.smallBlindSeat === t.seat ? " · SB" : ""}${e.bigBlindSeat === t.seat ? " · BB" : ""}`,
    handLabel: t.folded ? "Folded" : ue,
    status: We,
    detail: p ? "Sending…" : e.self.waiting ? "Joining at the next hand" : t.action,
    winningCards: k ? e.results.find((i) => i.seat === t.seat && i.won > 0)?.hand?.cards ?? [] : [],
    withActions: P || k || e.phase === "ready"
  })), v.observe(
    e.gameRevision,
    {
      hand: e.handNumber,
      phase: e.phase,
      actor: e.actor,
      boardCount: e.board.length,
      players: e.players.map((i) => ({ seat: i.seat, stack: i.stack, bet: i.bet, folded: i.folded, action: i.action }))
    },
    !r.paused && !m && !h && !b && !e.self.waiting && re && !document.hidden,
    e.self.seat
  ), s("players").replaceChildren(...[...e.players].sort((i, w) => i.displaySeat - w.displaySeat).map((i) => {
    const w = document.createElement("li");
    return w.textContent = `${i.name} · ${i.kind}${i.pendingName ? " · next: " + i.pendingName : ""} · ${i.stack} chips · ${i.action || "waiting"}${e.actor === i.seat ? " · to act" : ""}`, w;
  })), s("deal-actions").hidden = !r.isHost || !["ready", "complete"].includes(e.phase) || r.paused || b, s("pause").hidden = !r.isHost, s("start").disabled = p || r.paused || m || h, s("pause").disabled = p, s("pause").textContent = r.paused ? "Resume table" : "Pause table", s("leave").disabled = p, s("leave").textContent = r.isHost ? "End session for everyone" : "Leave table", Ie.render(d.createElement(ht, {
    offer: e.self.bank,
    revision: e.revision,
    blocked: p || r.paused || m || h || !b,
    onConfirm: tn
  }));
  const Xe = !p && !r.paused && !m && !h && !b && !C && !e.self.waiting && e.actor === e.self.seat && e.phase === "betting";
  s("actions").hidden = !P || r.paused || b || m || h, Oe.render(d.createElement(mt, {
    ref: qe,
    revision: G,
    blocked: !Xe,
    legal: e.legal,
    pot: e.pot,
    currentBet: e.currentBet,
    ownBet: t.bet,
    bigBlind: e.bigBlind,
    onAction: en,
    onOpenChange: Ht,
    focusTable: D
  })), s("inspect").disabled = r.paused || e.self.waiting || m || h || b, s("inspect").setAttribute("aria-pressed", String(R)), s("inspect").firstChild.nodeValue = R ? "Look up " : "Cards & chips ";
}
function He() {
  $t.render(d.createElement(Vt, {
    where: B.store.where,
    configured: !!j,
    status: K,
    onSave: (e, t) => {
      Ut(e, t);
    },
    onForget: () => {
      _t();
    },
    onTest: () => {
      zt();
    }
  }));
}
async function L(e) {
  if (!p) {
    p = !0, s("error").textContent = "", f();
    try {
      await e();
    } catch (t) {
      t instanceof N || (G++, s("error").textContent = t.message);
    } finally {
      p = !1, f();
    }
  }
}
async function Ye(e) {
  O = s("name").value, ye();
  let t;
  try {
    t = await y(e ? "/api/join" : "/api/create", { name: O, nonce: I, ...e ? { code: s("code").value } : {} });
  } catch (n) {
    if (!e && n?.status === 409) {
      const a = Et(A.saved(), O);
      if (a.length && await Je(a)) return;
      throw X(), new Error(A.saved().length ? 'This host already has a table. No saved seat under this name belongs to it; choose one under "Return to a saved seat", or restart the host with a fresh table.' : "This host already has a table, and this browser has no saved seat for it. Resume from the browser that created it, or restart the host with a fresh table.");
    }
    throw n;
  }
  W = Wt(t.code || (e ? s("code").value : "")), E.reset(), g = t.token, ye(s("remember").checked), await y("/api/state");
}
async function Je(e) {
  const t = () => {
    E.reset(), g = "", I = oe(), O = s("name").value || "Guest", W = "", r = null, h = !1, s("forget").hidden = !0;
  };
  let n;
  try {
    n = await St(e, async (a) => {
      E.reset(), g = a.token, I = a.nonce, O = a.name, W = a.code || "", h = !1, se = !1;
      try {
        return await y("/api/state"), "accepted";
      } catch (o) {
        if (h) return "rejected";
        throw o;
      }
    }, (a) => ce(a));
  } catch (a) {
    throw t(), X(), a;
  }
  return n ? (ye(!0), !0) : (t(), X(), !1);
}
s("create").onclick = () => L(() => Ye(!1));
s("join").onclick = () => L(() => Ye(!0));
s("start").onclick = () => L(() => y("/api/start", { revision: r.view.revision }));
s("pause").onclick = () => L(() => y("/api/pause", { paused: !r.paused }));
s("leave").onclick = () => L(async () => {
  await y("/api/leave", {}), E.reset(), ce(le()), g = "", r = null, F.reset(), I = oe(), s("connection").textContent = "Left table";
});
s("forget").onclick = () => {
  E.reset(), ce(le()), g = "", r = null, h = !1, I = oe(), F.reset(), s("forget").hidden = !0, s("error").textContent = "", s("connection").textContent = "Not connected", f();
};
s("resume-seat").onclick = () => {
  const e = J[Number(s("saved-seats").value)];
  e && L(async () => {
    const t = [e, ...A.saved().filter((n) => n.nonce !== e.nonce)];
    if (!await Je(t)) throw new Error("None of the seats saved in this browser belong to a table on this host. They were removed; create or join a table.");
  });
};
s("forget-seat").onclick = () => {
  const e = J[Number(s("saved-seats").value)];
  e && (ce(e), X());
};
s("remember-current").onclick = () => {
  A.save(le(), !0) ? s("seat-note").textContent = "Seat remembered on this browser. Close this tab before resuming it in another." : s("storage-warning").textContent = "Browser storage is unavailable. Keep this tab open; the seat was not safely remembered.";
};
function en(e) {
  if (p || h || m || b || C || !r || r.paused || r.view.actor !== r.view.self.seat) return !1;
  const t = r.view;
  return L(() => y("/api/action", { sequence: t.self.nextSequence, revision: t.revision, action: e })), !0;
}
function tn(e, t) {
  if (p || h || m || !r || r.paused || !b || r.view.revision !== t) return !1;
  const n = r.view, a = n.self.bank;
  return (e.type === "borrow" ? !a.canBorrow : e.amount <= 0 || e.amount > a.repayMax) ? !1 : (L(() => y("/api/action", { sequence: n.self.nextSequence, revision: t, action: e })), !0);
}
function H(e) {
  b = e, s("menu").hidden = !e, q(), f(), e || D();
}
s("details").onclick = () => H(!b);
s("close-menu").onclick = () => H(!1);
for (const e of ["ambience-level", "effects-level"]) s(e).onchange = () => {
  v.setLevels(Number(s("ambience-level").value), Number(s("effects-level").value));
};
s("drink-effect").onchange = () => u?.setDrinkEffect(s("drink-effect").value);
s("look-enabled").onclick = () => {
  V = !V, u?.setLookEnabled(V), s("look-enabled").setAttribute("aria-pressed", String(V)), s("look-enabled").textContent = V ? "On" : "Off";
};
function de(e) {
  e && (C = !1), R = e, u?.setInspection(e), s("labels").hidden = e, q(), f();
}
s("inspect").onclick = () => {
  de(!R), D();
};
s("app").addEventListener("keydown", (e) => {
  const t = e.target.closest("input,select,textarea,[contenteditable=true]") ? "editing" : e.target.closest("button,a") ? "control" : "table";
  if (!r || t === "editing" || e.altKey || e.ctrlKey || e.metaKey || e.isComposing) return;
  if (jt(e, t, !r || h || m || b || C || R || Z || $)) {
    e.preventDefault(), Ee(!0);
    return;
  }
  if (e.key.toLowerCase() === "m" && !e.repeat) {
    e.preventDefault(), S = !S, v.setMuted(S), S || v.unlock(), f();
    return;
  }
  if (e.key === "Escape" && C) {
    e.preventDefault(), e.stopPropagation(), Se(!1);
    return;
  }
  if (e.key === "Escape" && b) {
    e.preventDefault(), H(!1);
    return;
  }
  if (e.key.toLowerCase() === "r" && t === "table" && !e.repeat && !M().blocked && !C) {
    e.preventDefault(), u?.recenterLook();
    return;
  }
  const n = Rt(e, t, M());
  if (n) {
    e.preventDefault(), ae(n);
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
    if (e.key === "Escape" && !e.repeat && !p) {
      e.preventDefault(), r.isHost ? L(() => y("/api/pause", { paused: !r.paused })) : H(!0);
      return;
    }
    e.key === " " && t === "table" && !b && !C && !m && !h && !r.paused && !r.view.self.waiting && (e.preventDefault(), de(!0));
  }
});
s("app").addEventListener("keyup", (e) => {
  e.key === " " && de(!1);
});
window.addEventListener("blur", () => de(!1));
s("export").onclick = () => {
  const e = new Blob([JSON.stringify({ source: "actual-browser-lan-3d-client", started: $e, truncated: ze, records: ve }, null, 2)], { type: "application/json" }), t = URL.createObjectURL(e), n = document.createElement("a");
  n.href = t, n.download = `poker-lan-${$e.replaceAll(":", "-")}.json`, n.click(), setTimeout(() => URL.revokeObjectURL(t), 1e3);
};
async function Ge() {
  if (!(!g || h || p || pe)) {
    pe = !0;
    try {
      await y("/api/state");
    } catch (e) {
      e instanceof N || (m = !0, s("error").textContent = e.message, f());
    } finally {
      pe = !1;
    }
  }
}
s("chat-open").onclick = () => {
  r && !$ && Ee(!0);
};
setInterval(Ge, 500);
f();
Ge();
_e();
export {
  on as setApiTransport,
  sn as setVoiceEnvironment
};
