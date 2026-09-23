import { j as c, D as Qe, d as et, g as tt, p as nt, r as d, b as at, a as st, o as x, f as ot, T as rt, F as Le, n as it, q as he, i as me, C as Te, S as lt, e as ct, c as dt, h as ut, k as ft, l as ht, m as mt, B as pt } from "./BankControls-BGR_gOq3.js";
import { M as Ae, b as bt, V as je, a as gt, l as vt, c as yt, d as kt, e as be, n as wt, f as Ct } from "./lanView-xEmsc15V.js";
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
class St {
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
async function Et(e, t, n) {
  for (const a of e) {
    if (await t(a) === "accepted") return a;
    n(a);
  }
  return null;
}
function xt(e, t) {
  const n = t.trim();
  return n ? e.filter((a) => qe(a.name, n)) : [];
}
function Rt(e, t) {
  return [e, ...t.filter((n) => n.nonce !== e.nonce && qe(n.name, e.name))];
}
function qe(e, t) {
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
    let l;
    try {
      const f = await this.deps.hostApi("/api/chat", { text: t });
      if (!Number.isSafeInteger(f?.receipt?.seq)) return { sent: !1, error: "The host did not accept the message." };
      l = Number(f.receipt.seq);
    } catch (f) {
      return { sent: !1, error: f instanceof Error ? f.message : "Message not sent." };
    }
    return this.#e.add(l), this.#o(l, t, n, o).then(a, () => a({ seq: l, voice: "off", issue: "failed" })), { sent: !0, seq: l };
  }
  async #o(t, n, a, o) {
    const l = this.deps.provider();
    if (!a || !l || !this.#s(o)) return { seq: t, voice: "off" };
    const f = await l.synthesize(n);
    if (!this.#s(o)) return { seq: t, voice: "off" };
    if (!f.ok) return { seq: t, voice: "off", issue: f.reason };
    if (this.deps.play(f.audio, 0), f.audio.length > Ae) return { seq: t, voice: "local-only", issue: "too-long" };
    try {
      return await this.deps.hostApi("/api/voice", { seq: t, mime: je, data: bt(f.audio) }), { seq: t, voice: "spoken" };
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
      const o = new Set(t.map((l) => l.seq));
      for (const l of this.#e) o.has(l) || this.#e.delete(l);
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
      const l = gt(o.data);
      if (!l || l.length > Ae || !vt(l)) return;
      this.deps.play(l, n);
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
function Mt({ line: e }) {
  return /* @__PURE__ */ c.jsx("div", { className: `chat-bubble ${Kt(e.displaySeat)}`, "aria-hidden": "true", children: e.text });
}
function Pt({ lines: e, status: t }) {
  return /* @__PURE__ */ c.jsxs("section", { className: "lan-chat-log", "aria-label": "Table chat", children: [
    /* @__PURE__ */ c.jsx("ol", { "aria-live": "polite", "aria-relevant": "additions", children: e.slice(-6).map((n) => /* @__PURE__ */ c.jsxs("li", { children: [
      /* @__PURE__ */ c.jsx("b", { children: n.displaySeat === 0 ? "You" : n.name }),
      " ",
      n.text
    ] }, n.seq)) }),
    t && /* @__PURE__ */ c.jsx("p", { className: "lan-chat-status", role: "status", children: t })
  ] });
}
function Vt(e) {
  const [t, n] = d.useState(""), [a, o] = d.useState(!1), l = d.useRef(null);
  return d.useEffect(() => {
    l.current?.focus();
  }, []), /* @__PURE__ */ c.jsxs("form", { className: "lan-chat-input", onSubmit: (f) => {
    f.preventDefault();
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
          onChange: (f) => n(f.target.value),
          onKeyDown: (f) => {
            f.key === "Escape" && (f.preventDefault(), f.stopPropagation(), e.onClose());
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
function $t(e) {
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
const s = (e) => document.getElementById(e), A = new St(() => sessionStorage, () => localStorage), E = new Lt(), oe = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), (e) => e.toString(16).padStart(2, "0")).join("");
let v = "", I = oe(), r = null, b = !1, pe = !1, m = !1, u = null, se = !1, R = !1, g = !1, p = !1, G = 0, ee = -1, C = !1, Z = !1, T = { kind: "old-fashioned", available: !1, treat: null, canConsume: !1 };
const te = /* @__PURE__ */ new Map(), Ue = d.createRef(), Oe = x.createRoot(s("actions")), ge = x.createRoot(s("leisure")), Ie = x.createRoot(s("bank")), De = x.createRoot(s("chat")), Be = x.createRoot(s("features")), Ht = x.createRoot(s("voice-settings")), qt = x.createRoot(s("header")), Ke = x.createRoot(s("hud")), Me = x.createRoot(s("pot")), Pe = x.createRoot(s("table-info")), y = new st(
  rt.fireplace ? ot : void 0,
  [Le.position[0], 0.4, Le.position[2] + 0.05]
);
let S = !1, Ve = null, re = document.hasFocus(), V = !0;
const ie = () => y.setAmbienceActive(!!r && !r.paused && !p && !m && !g && !document.hidden && re);
s("app").addEventListener("pointerdown", () => y.unlock());
s("app").addEventListener("keydown", (e) => {
  e.repeat || y.unlock();
});
document.addEventListener("visibilitychange", () => {
  ie(), document.hidden || h();
});
document.addEventListener("fullscreenchange", () => h());
window.addEventListener("blur", () => {
  re = !1, ie();
});
window.addEventListener("focus", () => {
  re = !0, ie();
});
window.addEventListener("pagehide", () => y.dispose(), { once: !0 });
const D = () => s("app").focus(), q = () => u?.setLookBlocked(Z || g || C || $), Ut = (e) => {
  Z = e, q(), xe();
};
let B = { store: yt(() => localStorage), http: Ct() }, j = null, K = "", $ = !1, z = "", ne = !1;
const _e = () => j ? kt(() => j, B.http) : null, _t = (e) => e === 0 || !he[e] ? null : [he[e][0], 1.45, he[e][1]], F = new Nt({
  hostApi: (e, t) => k(e, t),
  provider: _e,
  play: (e, t) => {
    y.playVoice(e, t, _t(t));
  },
  stopAll: () => y.stopVoices()
});
function rn(e) {
  B = e, j = null, K = "", ze();
}
async function ze() {
  const e = B, t = await e.store.load().catch(() => null);
  e === B && (j = t, h());
}
async function zt(e, t) {
  const n = wt({ apiKey: e, voiceId: t });
  if (!n) {
    K = "That key or voice ID does not look right. Copy both from your ElevenLabs account.", h();
    return;
  }
  const a = await B.store.save(n);
  j = n, K = a ? "Voice saved." : "Could not save it here; it will be used in this tab until you close it.", h();
}
async function Yt() {
  await B.store.clear(), j = null, K = "Key forgotten on this device.", h();
}
async function Jt() {
  const e = _e();
  if (!e) return;
  K = "Asking ElevenLabs…", h(), y.unlock();
  const t = await e.synthesize("This is how I sound at the table.");
  K = t.ok ? S ? "Voice works. Unmute sound (M) to hear it." : "Voice works." : be[t.reason], t.ok && y.playVoice(t.audio, 0, null), h();
}
const Gt = {
  "rate-limited": "Slow down: one message every few seconds.",
  invalid: "Messages are one line of plain text, up to 200 characters.",
  disconnected: "Reconnecting; message not sent.",
  unauthorized: "You are no longer at this table."
};
async function Wt(e) {
  const t = await F.send(e, !!r?.features?.voices, (n) => {
    z = n.issue === "too-long" ? "Too long to relay: only you heard it; others see the text." : n.issue === "relay-refused" ? "Others see this line as text only." : n.issue && be[n.issue] ? be[n.issue] : "", h();
  });
  return t.sent ? (z = "", h(), !0) : (z = Gt[t.error] ?? t.error, h(), !1);
}
function Ee(e) {
  $ = e, q(), h(), e || D();
}
function Xt(e) {
  !r?.isHost || ne || (ne = !0, h(), k("/api/features", e).catch((t) => {
    t instanceof N || (s("error").textContent = t.message);
  }).finally(() => {
    ne = !1, h();
  }));
}
const Y = A.current();
let J = [], O = Y?.name || "Guest", W = Y?.code || "";
Y && (v = Y.token, I = Y.nonce, s("name").value = O);
const ve = [], $e = (/* @__PURE__ */ new Date()).toISOString();
let Ye = !1;
const le = () => ({ token: v, nonce: I, name: O, ...W ? { code: W } : {}, at: Date.now() }), Zt = (e) => String(e || "").toUpperCase().replace(/[^A-F0-9]/g, "");
function ye(e = !1) {
  A.save(le(), e) || (s("storage-warning").textContent = "Browser storage is unavailable. You can play, but keep this tab open: your seat may not survive closing or reloading it.");
}
function ce(e) {
  A.forget(e) || (s("storage-warning").textContent = "Browser storage blocked cleanup. This device may still remember the seat; clear its poker site data before sharing this browser.");
}
function X() {
  J = A.saved(), s("recovery").hidden = v || !J.length, s("saved-seats").replaceChildren(...J.map((e, t) => {
    const n = document.createElement("option");
    n.value = String(t);
    const a = e.at ? new Date(e.at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "earlier";
    return n.textContent = `${e.name} · ${e.code ? `table ${e.code.slice(0, 5)}-${e.code.slice(5)}` : "unknown table"} · ${a}`, n;
  })), s("resume-seat").disabled = s("forget-seat").disabled = b;
}
function Qt(e, t, n) {
  if (ve.length >= 512) {
    Ye = !0;
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
function ln(e) {
  ke = e;
}
async function k(e, t) {
  const n = E.begin();
  let a, o;
  try {
    a = ke ? await ke({
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
    throw E.failureCurrent(n) ? l : new N();
  }
  if (!E.current(n)) throw new N();
  if (Qt(e, a.status, o), o.view) {
    if (!E.accept(n, o)) throw new N();
    const l = r && o.generation !== r.generation;
    (l || p) && y.resetEvents(), l && (G++, ee = -1, R = !1, u?.setInspection(!1), F.reset()), r = o, p = !1, h();
  } else if (!a.ok && !E.failureCurrent(n))
    throw new N();
  if (v && [401, 410].includes(a.status) && (m = !0, E.reset(), s("forget").hidden = !1), !a.ok) throw Object.assign(new Error(o.error || o.receipt?.code || "Request rejected."), { status: a.status });
  return o;
}
function M() {
  return {
    available: T.available,
    menuOpen: C,
    treatsAllowed: !!r?.features?.treats,
    blocked: !r || !u || se || b || p || m || r.paused || r.view.phase === "ready" || r.view.self.waiting || R || g || Z
  };
}
function xe() {
  if (!r) {
    ge.render(null);
    return;
  }
  ge.render(d.createElement(At, {
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
  !v || m || (we = !0, Ce = performance.now(), k("/api/leisure", e).catch(() => {
  }).finally(() => {
    we = !1;
  }));
}
function en(e) {
  Re(e === "smoke" ? { action: "smoke" } : { action: "sip", kind: T.kind });
}
function ae(e) {
  const t = M();
  t.blocked || t.menuOpen || !t.available || e === "consume" && !t.treatsAllowed || (e === "smoke" ? u?.smokeCigar() : e === "consume" ? u?.consumeTreat() : u?.sipDrink(), D());
}
function tn(e) {
  const t = e.players[e.self.seat]?.leisure;
  !t || t.drinkKind === T.kind || we || r.paused || e.self.waiting || p || m || !u || performance.now() - Ce < 3e3 || (Ce = performance.now(), Re({ action: "order", kind: T.kind }));
}
function Se(e) {
  e && M().blocked || (C = e, G++, q(), h(), e || D());
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
    u = new it(s("scene"), a, void 0, (o) => {
      T = o, xe();
    }, e), u.setLookEnabled(V), u.onLeisureStarted = en, u.setDrinkEffect(s("drink-effect").value), Ve = n;
    for (let o = 1; o < 6; o++) {
      const l = document.createElement("div");
      l.className = "seat", s("labels").append(l), te.set(o, { node: l, root: x.createRoot(l) }), u.bindWorldLabel(o, l);
    }
    u.bindWorldLabel(-1, s("pot")), u.onAudioListener = (o) => y.setListenerMatrix(o);
  } catch {
    a();
  }
}
function h() {
  if (s("entry").hidden = !!r, s("table").hidden = !r, s("inspect").hidden = s("details").hidden = !r, qt.render(d.createElement(
    at,
    { onLobby: () => {
      r && H(!0);
    } },
    d.createElement("button", { "aria-label": S ? "Unmute sound" : "Mute sound", title: "Sound (M)", onClick: () => {
      S = !S, y.setMuted(S), S || y.unlock(), h();
    } }, S ? "♪̸" : "♪"),
    r && d.createElement("button", { "aria-label": "Settings", title: "Table settings", onClick: () => H(!0) }, "⚙"),
    r && d.createElement("button", { "aria-label": "Recenter view", title: "Drag the room to look · Recenter (R)", disabled: M().blocked || C, onClick: () => {
      u?.recenterLook(), D();
    } }, "⌖"),
    r?.isHost && d.createElement("button", { "aria-label": r.paused ? "Resume table" : "Pause table", disabled: b, onClick: () => L(() => k("/api/pause", { paused: !r.paused })) }, r.paused ? "▶" : "Ⅱ"),
    document.fullscreenEnabled && d.createElement("button", { "aria-label": document.fullscreenElement ? "Exit fullscreen" : "Enter fullscreen", onClick: () => {
      (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {
        s("error").textContent = "Fullscreen unavailable. The game still fills the browser.";
      });
    } }, "⤢")
  )), s("app").classList.toggle("inspecting", R), ie(), s("create").disabled = b || !!v, s("join").disabled = b || !!v, !r) {
    Fe(0, !0), u?.setPlaying(!1), Oe.render(null), y.resetEvents(), Ke.render(null), Me.render(null), Pe.render(null), s("actions").hidden = s("deal-actions").hidden = !0, R = !1, g = !1, C = !1, Z = !1, T = { kind: "old-fashioned", available: !1, treat: null, canConsume: !1 }, p = !1, ee = -1, s("menu").hidden = !0, ge.render(null), Ie.render(null), $ = !1, z = "", F.reset(), De.render(null), Be.render(null), He(), X();
    return;
  }
  const e = r.view, t = e.players[e.self.seat];
  e.revision !== ee && (ee = e.revision, G++), Fe(e.self.seat), u?.updateRemote(e, e.self.seat), u?.setPlaying(e.phase !== "ready" && !e.self.waiting), u?.setPaused(r.paused || p || m || g), (r.paused || p || m || g || e.self.waiting) && (C = !1), q(), xe(), tn(e);
  for (const i of e.players) if (i.displaySeat !== 0) {
    const w = te.get(i.displaySeat);
    if (!w) continue;
    w.node.classList.toggle("active", e.actor === i.seat), w.node.classList.toggle("folded", i.folded), w.node.classList.toggle("out", i.stack === 0 && !i.committed), w.node.style.setProperty("--seat-color", Te[i.seat].color);
    const fe = Bt(e.chat ?? [], i.displaySeat);
    w.root.render(d.createElement(d.Fragment, null, d.createElement(lt, {
      name: i.name,
      dealer: e.dealer === i.seat,
      blind: e.smallBlindSeat === i.seat ? "SB" : e.bigBlindSeat === i.seat ? "BB" : "",
      stack: i.stack,
      action: e.actor === i.seat ? i.kind === "human" ? "DECIDING" : "THINKING" : i.action || Te[i.seat].title,
      visibleCards: i.cards.kind === "visible" ? i.cards.values : []
    }), fe && d.createElement(Mt, { key: fe.seq, line: fe })));
  }
  s("labels").hidden = R;
  const n = !!r.features?.voices;
  F.observe(e.chat ?? [], n, !S && !document.hidden), De.render(d.createElement(
    d.Fragment,
    null,
    d.createElement(Pt, { lines: e.chat ?? [], status: z }),
    $ && d.createElement(Vt, {
      onSend: Wt,
      onClose: () => Ee(!1),
      voiceHint: n ? j ? "spoken in your voice" : "voices are on: add your key in Table menu" : ""
    })
  )), Be.render(d.createElement($t, { isHost: !!r.isHost, features: r.features ?? { voices: !1, treats: !1 }, pending: ne || b, onChange: Xt })), He(), s("connection").textContent = p || m ? "Connection interrupted — wagering disabled" : r.hostConnected ? r.paused ? "Table paused" : e.self.waiting ? "Seat reserved — joining next hand" : e.actor === e.self.seat ? "Your move" : "Connected · LAN" : "Host disconnected — table suspended", s("invite").textContent = r.code ? `Lobby code: ${r.code.slice(0, 5)}-${r.code.slice(5)}` : "Six playing seats · empty seats are NPCs", s("host-storage").textContent = r.durable ? "Host saves this table privately. A host restart pauses play until the host resumes." : "Disposable host: stopping its process ends this table.";
  const a = e.phase === "betting" ? ["Pre-flop", "Flop", "Turn", "River"][e.street] : e.phase === "ready" ? "Waiting for host" : e.phase === "complete" ? "Hand complete" : e.phase === "showdown" ? "Showdown" : "Dealing", o = e.phase === "complete" ? e.results.filter((i) => i.won > 0).map((i) => `${e.players[i.seat].name} wins ${i.won}`).join(" · ") : "", l = t.cards.kind === "visible" ? t.cards.values : [], f = e.phase === "complete", P = e.phase === "betting" && e.actor === e.self.seat, ue = l.length === 2 && e.board.length >= 3 ? ct([...l, ...e.board]).name : "Practice chips", Xe = p || m ? "Connection interrupted" : r.paused ? "Table paused" : e.self.waiting ? "Your seat is reserved." : f ? o : P ? "Your move." : e.actor !== null ? `${e.players[e.actor].name} is thinking…` : a;
  Pe.render(d.createElement(dt, { handNumber: e.handNumber, smallBlind: e.smallBlind, bigBlind: e.bigBlind })), Me.render(d.createElement(ut, { finished: f, amount: f ? e.awards.reduce((i, w) => i + w.amount, 0) : e.pot, sidePots: e.awards.length - 1 })), Ke.render(d.createElement(ft, {
    board: e.board,
    street: ht[e.street],
    ownCards: l,
    stack: t.stack,
    position: `${e.dealer === t.seat ? " · DEALER" : ""}${e.smallBlindSeat === t.seat ? " · SB" : ""}${e.bigBlindSeat === t.seat ? " · BB" : ""}`,
    handLabel: t.folded ? "Folded" : ue,
    status: Xe,
    detail: b ? "Sending…" : e.self.waiting ? "Joining at the next hand" : t.action,
    winningCards: f ? e.results.find((i) => i.seat === t.seat && i.won > 0)?.hand?.cards ?? [] : [],
    withActions: P || f || e.phase === "ready"
  })), y.observe(
    e.gameRevision,
    {
      hand: e.handNumber,
      phase: e.phase,
      actor: e.actor,
      boardCount: e.board.length,
      players: e.players.map((i) => ({ seat: i.seat, stack: i.stack, bet: i.bet, folded: i.folded, action: i.action }))
    },
    !r.paused && !p && !m && !g && !e.self.waiting && re && !document.hidden,
    e.self.seat
  ), s("players").replaceChildren(...[...e.players].sort((i, w) => i.displaySeat - w.displaySeat).map((i) => {
    const w = document.createElement("li");
    return w.textContent = `${i.name} · ${i.kind}${i.pendingName ? " · next: " + i.pendingName : ""} · ${i.stack} chips · ${i.action || "waiting"}${e.actor === i.seat ? " · to act" : ""}`, w;
  })), s("deal-actions").hidden = !r.isHost || !["ready", "complete"].includes(e.phase) || r.paused || g, s("pause").hidden = !r.isHost, s("start").disabled = b || r.paused || p || m, s("pause").disabled = b, s("pause").textContent = r.paused ? "Resume table" : "Pause table", s("leave").disabled = b, s("leave").textContent = r.isHost ? "End session for everyone" : "Leave table", Ie.render(d.createElement(mt, {
    offer: e.self.bank,
    revision: e.revision,
    blocked: b || r.paused || p || m || !g,
    onConfirm: an
  }));
  const Ze = !b && !r.paused && !p && !m && !g && !C && !e.self.waiting && e.actor === e.self.seat && e.phase === "betting";
  s("actions").hidden = !P || r.paused || g || p || m, Oe.render(d.createElement(pt, {
    ref: Ue,
    revision: G,
    blocked: !Ze,
    legal: e.legal,
    pot: e.pot,
    currentBet: e.currentBet,
    ownBet: t.bet,
    bigBlind: e.bigBlind,
    onAction: nn,
    onOpenChange: Ut,
    focusTable: D
  })), s("inspect").disabled = r.paused || e.self.waiting || p || m || g, s("inspect").setAttribute("aria-pressed", String(R)), s("inspect").firstChild.nodeValue = R ? "Look up " : "Cards & chips ";
}
function He() {
  Ht.render(d.createElement(Ft, {
    where: B.store.where,
    configured: !!j,
    status: K,
    onSave: (e, t) => {
      zt(e, t);
    },
    onForget: () => {
      Yt();
    },
    onTest: () => {
      Jt();
    }
  }));
}
async function L(e) {
  if (!b) {
    b = !0, s("error").textContent = "", h();
    try {
      await e();
    } catch (t) {
      t instanceof N || (G++, s("error").textContent = t.message);
    } finally {
      b = !1, h();
    }
  }
}
async function Je(e) {
  O = s("name").value, ye();
  let t;
  try {
    t = await k(e ? "/api/join" : "/api/create", { name: O, nonce: I, ...e ? { code: s("code").value } : {} });
  } catch (n) {
    if (!e && n?.status === 409) {
      const a = xt(A.saved(), O);
      if (a.length && await Ge(a)) return;
      throw X(), new Error(A.saved().length ? 'This host already has a table. No saved seat under this name belongs to it; choose one under "Return to a saved seat", or restart the host with a fresh table.' : "This host already has a table, and this browser has no saved seat for it. Resume from the browser that created it, or restart the host with a fresh table.");
    }
    throw n;
  }
  W = Zt(t.code || (e ? s("code").value : "")), E.reset(), v = t.token, ye(s("remember").checked), await k("/api/state");
}
async function Ge(e) {
  const t = () => {
    E.reset(), v = "", I = oe(), O = s("name").value || "Guest", W = "", r = null, m = !1, s("forget").hidden = !0;
  };
  let n;
  try {
    n = await Et(e, async (a) => {
      E.reset(), v = a.token, I = a.nonce, O = a.name, W = a.code || "", m = !1, se = !1;
      try {
        return await k("/api/state"), "accepted";
      } catch (o) {
        if (m) return "rejected";
        throw o;
      }
    }, (a) => ce(a));
  } catch (a) {
    throw t(), X(), a;
  }
  return n ? (ye(!0), !0) : (t(), X(), !1);
}
s("create").onclick = () => L(() => Je(!1));
s("join").onclick = () => L(() => Je(!0));
s("start").onclick = () => L(() => k("/api/start", { revision: r.view.revision }));
s("pause").onclick = () => L(() => k("/api/pause", { paused: !r.paused }));
s("leave").onclick = () => L(async () => {
  await k("/api/leave", {}), E.reset(), ce(le()), v = "", r = null, F.reset(), I = oe(), s("connection").textContent = "Left table";
});
s("forget").onclick = () => {
  E.reset(), ce(le()), v = "", r = null, m = !1, I = oe(), F.reset(), s("forget").hidden = !0, s("error").textContent = "", s("connection").textContent = "Not connected", h();
};
s("resume-seat").onclick = () => {
  const e = J[Number(s("saved-seats").value)];
  e && L(async () => {
    if (!await Ge(Rt(e, A.saved()))) throw new Error(`None of the seats saved as "${e.name}" belong to a table on this host. They were removed; choose another saved seat, or create or join a table.`);
  });
};
s("forget-seat").onclick = () => {
  const e = J[Number(s("saved-seats").value)];
  e && (ce(e), X());
};
s("remember-current").onclick = () => {
  A.save(le(), !0) ? s("seat-note").textContent = "Seat remembered on this browser. Close this tab before resuming it in another." : s("storage-warning").textContent = "Browser storage is unavailable. Keep this tab open; the seat was not safely remembered.";
};
function nn(e) {
  if (b || m || p || g || C || !r || r.paused || r.view.actor !== r.view.self.seat) return !1;
  const t = r.view;
  return L(() => k("/api/action", { sequence: t.self.nextSequence, revision: t.revision, action: e })), !0;
}
function an(e, t) {
  if (b || m || p || !r || r.paused || !g || r.view.revision !== t) return !1;
  const n = r.view, a = n.self.bank;
  return (e.type === "borrow" ? !a.canBorrow : e.amount <= 0 || e.amount > a.repayMax) ? !1 : (L(() => k("/api/action", { sequence: n.self.nextSequence, revision: t, action: e })), !0);
}
function H(e) {
  g = e, s("menu").hidden = !e, q(), h(), e || D();
}
s("details").onclick = () => H(!g);
s("close-menu").onclick = () => H(!1);
for (const e of ["ambience-level", "effects-level"]) s(e).onchange = () => {
  y.setLevels(Number(s("ambience-level").value), Number(s("effects-level").value));
};
s("drink-effect").onchange = () => u?.setDrinkEffect(s("drink-effect").value);
s("look-enabled").onclick = () => {
  V = !V, u?.setLookEnabled(V), s("look-enabled").setAttribute("aria-pressed", String(V)), s("look-enabled").textContent = V ? "On" : "Off";
};
function de(e) {
  e && (C = !1), R = e, u?.setInspection(e), s("labels").hidden = e, q(), h();
}
s("inspect").onclick = () => {
  de(!R), D();
};
s("app").addEventListener("keydown", (e) => {
  const t = e.target.closest("input,select,textarea,[contenteditable=true]") ? "editing" : e.target.closest("button,a") ? "control" : "table";
  if (!r || t === "editing" || e.altKey || e.ctrlKey || e.metaKey || e.isComposing) return;
  if (Ot(e, t, !r || m || p || g || C || R || Z || $)) {
    e.preventDefault(), Ee(!0);
    return;
  }
  if (e.key.toLowerCase() === "m" && !e.repeat) {
    e.preventDefault(), S = !S, y.setMuted(S), S || y.unlock(), h();
    return;
  }
  if (e.key === "Escape" && C) {
    e.preventDefault(), e.stopPropagation(), Se(!1);
    return;
  }
  if (e.key === "Escape" && g) {
    e.preventDefault(), H(!1);
    return;
  }
  if (e.key.toLowerCase() === "r" && t === "table" && !e.repeat && !M().blocked && !C) {
    e.preventDefault(), u?.recenterLook();
    return;
  }
  const n = Tt(e, t, M());
  if (n) {
    e.preventDefault(), ae(n);
    return;
  }
  if (!Ue.current?.handleKey({
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
    e.key === " " && t === "table" && !g && !C && !p && !m && !r.paused && !r.view.self.waiting && (e.preventDefault(), de(!0));
  }
});
s("app").addEventListener("keyup", (e) => {
  e.key === " " && de(!1);
});
window.addEventListener("blur", () => de(!1));
s("export").onclick = () => {
  const e = new Blob([JSON.stringify({ source: "actual-browser-lan-3d-client", started: $e, truncated: Ye, records: ve }, null, 2)], { type: "application/json" }), t = URL.createObjectURL(e), n = document.createElement("a");
  n.href = t, n.download = `poker-lan-${$e.replaceAll(":", "-")}.json`, n.click(), setTimeout(() => URL.revokeObjectURL(t), 1e3);
};
async function We() {
  if (!(!v || m || b || pe)) {
    pe = !0;
    try {
      await k("/api/state");
    } catch (e) {
      e instanceof N || (p = !0, s("error").textContent = e.message, h());
    } finally {
      pe = !1;
    }
  }
}
s("chat-open").onclick = () => {
  r && !$ && Ee(!0);
};
setInterval(We, 500);
h();
We();
ze();
export {
  ln as setApiTransport,
  rn as setVoiceEnvironment
};
