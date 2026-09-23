import { C as $, e as ye, P as Q, r as i, a as st, f as at, T as ot, F as Be, j as e, b as lt, c as it, D as ct, d as dt, g as ut, i as ht, S as ft, h as bt, k as pt, l as Re, B as mt, m as xt, n as kt, o as yt } from "./BankControls-BuMEt0va.js";
import { d as gt } from "./runtime-XLX8az2X.js";
import { s as jt } from "./styles-DJYLcAU6.js";
function vt(r, a) {
  const l = r.actor;
  return {
    seat: l,
    hole: [...r.players[l].hole],
    board: [...r.board],
    opponents: r.players.filter((n) => n.seat !== l && !n.folded && n.hole.length === 2).length,
    pot: r.players.reduce((n, d) => n + d.committed, 0),
    bigBlind: r.bigBlind,
    currentBet: r.currentBet,
    bet: r.players[l].bet,
    legal: { ...a }
  };
}
function wt(r, a, l = 56) {
  const n = /* @__PURE__ */ new Set([...r.hole, ...r.board]), d = Array.from({ length: 52 }, (f, c) => c).filter((f) => !n.has(f));
  let k = 0;
  for (let f = 0; f < l; f++) {
    const c = [...d], T = 5 - r.board.length + r.opponents * 2;
    for (let v = 0; v < T; v++) {
      const E = v + Math.floor(a() * (c.length - v));
      [c[v], c[E]] = [c[E], c[v]];
    }
    let b = 5 - r.board.length;
    const w = [...r.board, ...c.slice(0, b)], j = ye([...r.hole, ...w]).score;
    let U = 1, p = !1;
    for (let v = 0; v < r.opponents; v++) {
      const E = ye([c[b++], c[b++], ...w]).score;
      if (E > j) {
        p = !0;
        break;
      }
      E === j && U++;
    }
    p || (k += 1 / U);
  }
  return k / l;
}
function Et(r, a = Math.random) {
  const l = $[r.seat].style, n = l === "loose" ? 0.11 : l === "tight" ? -0.05 : l === "aggressive" ? 0.06 : 0, d = wt(r, a) + n + (a() - 0.5) * 0.1, k = r.legal.call / Math.max(1, r.pot + r.legal.call), f = a() < (l === "aggressive" ? 0.15 : l === "tight" ? 0.025 : 0.07);
  if (r.legal.raise && (d > Math.max(0.48, 1 / (r.opponents + 1) + 0.2) || f)) {
    const c = Math.round((r.pot + r.legal.call) * (l === "aggressive" ? 0.8 : 0.55));
    return { type: "raise", to: Math.min(r.legal.max, Math.max(r.legal.min, r.currentBet + Math.max(r.bigBlind, c))) };
  }
  return r.legal.check ? { type: "check" } : d >= k + (l === "tight" ? 0.08 : 0.015) || r.legal.call <= r.bigBlind && d > 0.14 ? { type: "call" } : { type: "fold" };
}
const ve = 1e6, ge = 2e3, Ie = 256, H = (r) => Number.isSafeInteger(r) && Number(r) >= 0 && Number(r) <= ve, De = (r) => typeof r == "string" && /^[a-zA-Z0-9_-]{1,128}$/.test(r), Ae = (r) => !!r && typeof r == "object" && !Array.isArray(r), Oe = (r, a) => Object.keys(r).length === a.length && a.every((l) => Object.hasOwn(r, l));
function Fe(r) {
  if (!H(r) || r === 0) throw new Error("Invalid bank starting chips.");
  return { version: 1, base: r, reserve: ve - r, accounts: [] };
}
function je(r, a) {
  const l = () => new Error("Invalid bank checkpoint. Saved data has been preserved.");
  if (!Ae(r) || !Oe(r, ["version", "base", "reserve", "accounts"]) || r.version !== 1 || !H(r.base) || r.base === 0 || !H(r.reserve) || !H(a) || r.reserve + a !== ve || !Array.isArray(r.accounts) || r.accounts.length > Ie) throw l();
  const n = /* @__PURE__ */ new Set(), d = [];
  let k = 0;
  for (const f of r.accounts) {
    if (!Ae(f) || !Oe(f, ["id", "debt"]) || !De(f.id) || n.has(f.id) || !H(f.debt) || f.debt === 0) throw l();
    n.add(f.id), k += f.debt, d.push({ id: f.id, debt: f.debt });
  }
  if (k !== a - r.base) throw l();
  return { version: 1, base: r.base, reserve: r.reserve, accounts: d };
}
function Ke(r, a, l, n) {
  const d = je(r, n.tableTotal);
  if (!De(a) || !H(n.stack)) throw new Error("Invalid bank player.");
  if (n.phase !== "ready" && n.phase !== "complete") throw new Error("Bank transfers are only available between hands.");
  const k = d.accounts.find((T) => T.id === a);
  let f;
  if (l.type === "borrow") {
    if (n.stack !== 0) throw new Error("Only a busted player can borrow chips.");
    if (d.reserve < ge) throw new Error("The practice bank reserve cannot fund another rebuy.");
    if (!k && d.accounts.length >= Ie) throw new Error("The practice bank account limit has been reached for this room.");
    f = ge;
  } else if (l.type === "repay") {
    if (!H(l.amount) || l.amount === 0 || l.amount > (k?.debt ?? 0)) throw new Error("Repayment exceeds your bank debt.");
    if (l.amount > n.stack) throw new Error("Repayment exceeds your available chips.");
    f = -l.amount;
  } else throw new Error("Invalid bank operation.");
  const c = (k?.debt ?? 0) + f;
  return d.accounts = d.accounts.filter((T) => T.id !== a), c > 0 && d.accounts.push({ id: a, debt: c }), d.reserve -= f, { bank: je(d, n.tableTotal + f), delta: f };
}
const ae = "solo-player";
function St(r) {
  if (!r || typeof r != "object" || Array.isArray(r)) throw new Error("Invalid saved table. Saved data has been preserved.");
  const a = r;
  if (typeof a.muted != "boolean" || a.speed !== "relaxed" && a.speed !== "brisk") throw new Error("Invalid saved preferences. Saved data has been preserved.");
  const l = !Object.hasOwn(a, "version") && !Object.hasOwn(a, "bank");
  if (!l && a.version !== 2) throw new Error("Unsupported saved table version. Saved data has been preserved.");
  const n = a.table === null ? null : Q.restore(a.table), d = n ? l ? Fe(n.snapshot().initialTotal) : we(a.bank, n.snapshot().initialTotal) : null;
  if (!l && !n && a.bank !== null) throw new Error("Bank without a table. Saved data has been preserved.");
  return { game: n, bank: d, muted: a.muted, speed: a.speed };
}
function we(r, a) {
  const l = je(r, a);
  if (l.accounts.some((n) => n.id !== ae)) throw new Error("Invalid solo bank owner. Saved data has been preserved.");
  return l;
}
function Pe(r) {
  return Fe(r.snapshot().initialTotal);
}
function Ct(r, a, l) {
  if (!r && a) throw new Error("Bank without a table.");
  return { version: 2, table: r, bank: r ? we(a, r.initialTotal) : null, muted: l.muted, speed: l.speed };
}
function Nt(r, a) {
  const l = r.snapshot(), n = l.players[0].stack, d = a.accounts.find((c) => c.id === ae)?.debt ?? 0, k = l.phase === "ready" || l.phase === "complete";
  let f = null;
  try {
    Ke(a, ae, { type: "borrow" }, { phase: l.phase, stack: n, tableTotal: l.initialTotal });
  } catch (c) {
    f = c instanceof Error ? c.message : "Bank unavailable.";
  }
  return { debt: d, borrowAmount: ge, canBorrow: f === null, repayMax: k ? Math.min(n, d) : 0, reason: f };
}
function Tt(r, a, l, n) {
  const d = r.snapshot();
  if (d.revision !== n) throw new Error("The table changed. Review the bank transfer again.");
  const k = Ke(we(a, d.initialTotal), ae, l, { phase: d.phase, stack: d.players[0].stack, tableTotal: d.initialTotal }), f = Q.restore(d);
  return f.transferBetweenHands(0, k.delta), { game: f, bank: k.bank };
}
const He = "poker.table.v1", q = (r) => r.toLocaleString("en-US"), ke = (r) => r instanceof HTMLElement && !!r.closest("button, input, select, textarea, a, [contenteditable]"), Me = (r) => r instanceof HTMLElement && !!r.closest("input, select, textarea, [contenteditable]");
function Lt({ api: r }) {
  const [a, l] = i.useState(null), n = i.useRef(null), d = i.useRef(null), [k, f] = i.useState(!0), [c, T] = i.useState(!0), [b, w] = i.useState(!1), [j, U] = i.useState(!1), [p, v] = i.useState(""), [E, oe] = i.useState(!1), [m, le] = i.useState(!1), [_, Ee] = i.useState(!1), [X, Ye] = i.useState(1), [Z, $e] = i.useState(1), [ie, Se] = i.useState("relaxed"), [h, G] = i.useState(null), [g, M] = i.useState(!1), [V, ce] = i.useState(!1), J = i.useRef(null), [C, I] = i.useState(!1), [O, D] = i.useState(!1), [L, Ue] = i.useState({ kind: "old-fashioned", available: !1, treat: null, canConsume: !1 }), F = i.useRef(!1), [de, _e] = i.useState(0), [ee, Ge] = i.useState(!0), [ue, Ve] = i.useState("normal"), [P, he] = i.useState(0), Ce = i.useRef(null), S = i.useRef(null), x = i.useRef(null), y = i.useRef(null), z = i.useRef(!0), R = i.useRef(!1), te = i.useRef({ muted: !1, speed: "relaxed" });
  i.useEffect(() => {
    z.current = !0, y.current = new st(
      ot.fireplace ? at : void 0,
      [Be.position[0], 0.4, Be.position[2] + 0.05]
    );
    let t = !0;
    return r.storage.get(He).then((s) => {
      if (t) {
        if (s !== void 0) {
          const u = St(s);
          n.current = u.game, d.current = u.bank, n.current && l(n.current.snapshot()), te.current = { muted: u.muted, speed: u.speed }, Ee(u.muted), Se(u.speed), y.current?.setMuted(u.muted);
        }
        f(!1);
      }
    }).catch((s) => {
      t && (v(s instanceof Error ? s.message : "Could not read saved progress."), oe(!0), f(!1));
    }), () => {
      t = !1, z.current = !1, y.current?.dispose(), y.current = null;
    };
  }, [r]), i.useEffect(() => {
    let t = null;
    const s = () => {
      if (!(document.hidden || t))
        try {
          t = new kt(Ce.current, () => {
            le(!0), w(!0);
          }, () => he((u) => u + 1), Ue), t.onAudioListener = (u) => y.current?.setListenerMatrix(u), y.current && (y.current.onCue = (u) => t?.recordAudio({ cue: u })), x.current = t, he((u) => u + 1), t.update(n.current?.snapshot() ?? new Q().snapshot());
        } catch (u) {
          console.error("Poker room initialization failed", u), le(!0);
        }
    };
    return document.addEventListener("visibilitychange", s), s(), () => {
      document.removeEventListener("visibilitychange", s), t?.dispose(), x.current = null;
    };
  }, []), i.useEffect(() => {
    try {
      a && x.current?.update(a);
    } catch (t) {
      console.error("Poker scene projection failed; saved hand is preserved.", t), le(!0), w(!0);
    }
  }, [a, P]), i.useEffect(() => {
    x.current?.setOrbit(de), he((t) => t + 1);
  }, [de]), i.useEffect(() => {
    x.current?.setPlaying(!c);
  }, [c, P]), i.useEffect(() => {
    const t = () => y.current?.setAmbienceActive(!document.hidden && !c && !b && !h && !g && !p && !m), s = () => y.current?.setAmbienceActive(!1);
    return document.addEventListener("visibilitychange", t), window.addEventListener("blur", s), t(), () => {
      document.removeEventListener("visibilitychange", t), window.removeEventListener("blur", s);
    };
  }, [r, c, b, h, g, p, m]), i.useEffect(() => {
    y.current?.setLevels(X, Z);
  }, [X, Z]), i.useEffect(() => {
    a && y.current?.observe(
      a.revision,
      {
        hand: a.handNumber,
        phase: a.phase,
        actor: a.actor,
        boardCount: a.board.length,
        players: a.players.map((t) => ({ seat: t.seat, stack: t.stack, bet: t.bet, folded: t.folded, action: t.action }))
      },
      !c && !b && !h && !g && !p && !m && !document.hidden && document.hasFocus(),
      0
    );
  }, [a, c, b, h, g, p, m]), i.useEffect(() => {
    x.current?.setPaused(b || !!h || g || !!p || m);
  }, [b, h, g, p, m, P]), i.useEffect(() => {
    x.current?.setInspection(C);
  }, [C, P]), i.useEffect(() => {
    x.current?.setLookEnabled(ee);
  }, [ee, P]), i.useEffect(() => {
    x.current?.setDrinkEffect(ue);
  }, [ue, P]), i.useEffect(() => {
    x.current?.setLookBlocked(O || V);
  }, [O, V, P]), i.useEffect(() => {
    (c || b || h || g || p || m) && (F.current = !1, I(!1), D(!1));
  }, [c, b, h, g, p, m]), i.useEffect(() => {
    const t = (A) => {
      A.code === "Space" && F.current && (F.current = !1, I(!1));
    }, s = () => {
      F.current = !1, I(!1);
    }, u = () => {
      document.hidden && s();
    };
    return window.addEventListener("keyup", t), window.addEventListener("blur", s), document.addEventListener("visibilitychange", u), () => {
      window.removeEventListener("keyup", t), window.removeEventListener("blur", s), document.removeEventListener("visibilitychange", u);
    };
  }, []);
  const re = async (t) => {
    R.current = !0, U(!0);
    try {
      await r.storage.set(He, Ct(t, d.current, te.current)), z.current && (v(""), oe(!1));
    } catch {
      z.current && (v("Your last action is still on this table, but could not be saved. Retry saving to continue."), w(!0));
    } finally {
      R.current = !1, z.current && U(!1);
    }
  }, K = () => {
    const t = n.current.snapshot();
    l(t), re(t);
  }, ze = (t) => {
    if (R.current || !n.current || n.current.snapshot().actor !== 0 || b || h || g || O || c || m || p) return !1;
    try {
      return y.current?.unlock(), n.current.act(0, t), S.current?.focus({ preventScroll: !0 }), K(), !0;
    } catch (s) {
      return v(s instanceof Error ? s.message : "That action is unavailable."), !1;
    }
  };
  i.useEffect(() => {
    if (!a || c || b || h || j || p || m || k) return;
    const { phase: t, actor: s } = a;
    if (t === "complete" || t === "ready" || t === "betting" && s === 0) return;
    const u = ie === "brisk" ? t === "betting" ? 500 : 850 : t === "betting" ? 1150 : 1450, A = window.setTimeout(() => {
      const W = n.current;
      if (!(!W || R.current))
        try {
          t === "betting" && s !== null ? W.act(s, Et(vt(W.snapshot(), W.legal()))) : W.advance(), K();
        } catch (Le) {
          v(Le instanceof Error ? Le.message : "The table needs attention."), w(!0);
        }
    }, u);
    return () => window.clearTimeout(A);
  }, [a, c, b, h, j, p, m, k, ie]), i.useEffect(() => {
    const t = () => {
      n.current && !c && w(!0);
    }, s = () => {
      document.hidden && t();
    };
    return window.addEventListener("blur", t), document.addEventListener("visibilitychange", s), () => {
      window.removeEventListener("blur", t), document.removeEventListener("visibilitychange", s);
    };
  }, [c]), i.useEffect(() => {
    ce(!1);
  }, [a?.revision, c]);
  const We = () => {
    k || R.current || m || E || (y.current?.unlock(), n.current || (n.current = new Q(), d.current = Pe(n.current), n.current.startHand(), K(), y.current?.play("card")), T(!1), w(!1), S.current?.focus({ preventScroll: !0 }));
  }, qe = () => {
    R.current || k || m || (n.current = new Q(), d.current = Pe(n.current), n.current.startHand(), y.current?.resetEvents(), x.current?.endNight(), M(!1), G(null), v(""), oe(!1), w(!1), T(!1), y.current?.unlock(), y.current?.play("card"), S.current?.focus({ preventScroll: !0 }), K());
  }, Qe = () => {
    R.current || !n.current || a?.phase !== "complete" || (n.current.startHand(), S.current?.focus({ preventScroll: !0 }), K());
  }, Y = (t) => {
    w(!0), G(t);
  }, Xe = (t, s) => {
    if (R.current || !n.current || !d.current || h !== "bank" || p || E || m || g) return !1;
    try {
      const u = Tt(n.current, d.current, t, s);
      return n.current = u.game, d.current = u.bank, K(), !0;
    } catch (u) {
      return v(u instanceof Error ? u.message : "Bank transfer unavailable."), !1;
    }
  }, fe = () => {
    if (R.current || k || E) return;
    const t = !_;
    Ee(t), te.current.muted = t, y.current?.setMuted(t), t || y.current?.unlock(), re(n.current?.snapshot() ?? null);
  }, o = a, be = n.current?.legal() ?? { fold: !1, check: !1, call: 0, raise: !1, min: 0, max: 0, shortOnly: !1 }, B = o?.players[0], ne = o?.phase === "betting" && o.actor === 0, Ne = !ne || b || !!h || j || !!p || m || O || g || c, Ze = o?.players.filter((t) => t.stack > 0).length ?? 6, N = o?.phase === "complete", pe = N && Ze === 1 && (B?.stack ?? 0) > 0, me = N && B?.stack === 0, se = n.current && d.current ? Nt(n.current, d.current) : null, Te = o?.history.find((t) => t.number === o.handNumber)?.net ?? 0, xe = o?.players.reduce((t, s) => t + s.committed, 0) ?? 0, Je = o?.awards.reduce((t, s) => t + s.amount, 0) ?? 0, et = B?.hole.length === 2 && (o?.board.length ?? 0) >= 3 ? ye([...B.hole, ...o.board]) : null, tt = N ? o?.results.find((t) => t.seat === 0 && t.won > 0)?.hand?.cards ?? [] : [], rt = o?.phase === "showdown" || N && o?.results.some((t) => t.hand), nt = N ? pe ? "The table is yours." : me ? "A good run. Another seat awaits." : o.history[0]?.summary : o?.phase === "showdown" ? "Cards on the table." : o?.phase === "transition" ? "The next chapter…" : ne ? "Your move." : o?.actor != null ? `${$[o.actor].name} is thinking…` : "Welcome to the club.";
  return /* @__PURE__ */ e.jsxs(
    "main",
    {
      className: `poker ${C ? "inspecting" : ""}`,
      ref: S,
      tabIndex: -1,
      "data-phase": o?.phase ?? "lobby",
      "data-actor": o?.actor ?? "",
      onPointerDown: () => y.current?.unlock(),
      onKeyDown: (t) => {
        const s = Me(t.target), u = t.key.toLowerCase();
        if ((s || ["b", "f", "c", "r", "1", "2", "3", "4", "arrowleft", "arrowright", "arrowup", "arrowdown", "enter", "escape", "tab"].includes(u)) && x.current?.recordBettingInput({
          key: s ? "editing" : u,
          target: s ? "editing" : ke(t.target) ? "control" : "table",
          repeat: t.repeat,
          shift: t.shiftKey,
          modified: t.altKey || t.ctrlKey || t.metaKey,
          revision: o?.revision ?? -1,
          open: J.current?.snapshot().open ?? !1,
          amount: J.current?.snapshot().amount ?? be.min,
          blocked: Ne,
          legal: { ...be },
          currentBet: o?.currentBet ?? 0,
          pot: xe,
          ownBet: B?.bet ?? 0,
          stack: B?.stack ?? 0
        }), !(t.metaKey || t.ctrlKey || t.altKey || t.nativeEvent.isComposing) && !J.current?.handleKey(t, s ? "editing" : ke(t.target) ? "control" : "table")) {
          if (t.key === "Escape") {
            t.preventDefault(), t.stopPropagation(), g ? M(!1) : O ? (D(!1), S.current?.focus({ preventScroll: !0 })) : h ? G(null) : V ? ce(!1) : C ? (F.current = !1, I(!1)) : c || w((A) => !A);
            return;
          }
          if (!O && !(V && ["s", "d", "e", "r", " "].includes(u))) {
            if (t.key.toLowerCase() === "s" && !c && !b && !h && !g && !p && !m && !(t.target instanceof HTMLElement && t.target.closest("input, select, textarea, [contenteditable]"))) {
              t.preventDefault(), t.repeat || x.current?.smokeCigar();
              return;
            }
            if (t.key.toLowerCase() === "d" && !c && !b && !h && !g && !p && !m && !(t.target instanceof HTMLElement && t.target.closest("input, select, textarea, [contenteditable]"))) {
              t.preventDefault(), t.repeat || x.current?.sipDrink();
              return;
            }
            if (t.key.toLowerCase() === "e" && L.treat && !c && !b && !h && !g && !p && !m && !(t.target instanceof HTMLElement && t.target.closest("input, select, textarea, [contenteditable]"))) {
              t.preventDefault(), t.repeat || x.current?.consumeTreat();
              return;
            }
            if (!Me(t.target)) {
              if (t.key.toLowerCase() === "r" && x.current?.experimentalLook && !c && !b && !h && !V && !C) {
                t.preventDefault(), t.repeat || x.current.recenterLook();
                return;
              }
              if (t.code === "Space" && !ke(t.target) && !c && !b && !h && !g && !p && !m) {
                t.preventDefault(), t.repeat || (F.current = !0, I(!0));
                return;
              }
              t.repeat || u === "m" && (t.preventDefault(), fe());
            }
          }
        }
      },
      children: [
        /* @__PURE__ */ e.jsxs(lt, { onLobby: () => {
          T(!0), w(!0);
        }, children: [
          /* @__PURE__ */ e.jsx("button", { onClick: fe, disabled: k || j || E, "aria-label": _ ? "Unmute sound" : "Mute sound", title: "Sound (M)", children: _ ? "♪̸" : "♪" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => Y("rules"), "aria-label": "How to play", title: "How to play", children: "?" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => Y("settings"), "aria-label": "Settings", title: "Settings", children: "⚙" }),
          !c && x.current?.experimentalLook && /* @__PURE__ */ e.jsx("button", { "aria-label": "Recenter view", title: "Drag the room to look · Recenter (R)", disabled: b || !!h || C, onClick: () => {
            x.current?.recenterLook(), S.current?.focus({ preventScroll: !0 });
          }, children: "⌖" }),
          !c && /* @__PURE__ */ e.jsx("button", { onClick: () => w((t) => !t), "aria-label": b ? "Resume table" : "Pause table", title: "Pause (Esc)", children: b ? "▶" : "Ⅱ" })
        ] }),
        /* @__PURE__ */ e.jsxs("section", { className: "room", "aria-label": "Poker room", children: [
          /* @__PURE__ */ e.jsx("div", { className: "scene", ref: Ce }),
          /* @__PURE__ */ e.jsx("div", { className: "room-vignette" }),
          !c && o && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx(it, { handNumber: o.handNumber, smallBlind: o.smallBlind, bigBlind: o.bigBlind }),
            /* @__PURE__ */ e.jsxs("div", { className: "room-top-right", children: [
              /* @__PURE__ */ e.jsxs("button", { onClick: () => {
                D(!1), I((t) => !t), S.current?.focus({ preventScroll: !0 });
              }, disabled: b || !!h || !!p || m, "aria-pressed": C, title: "Hold Space to inspect cards and chips", children: [
                C ? "Look up" : "Cards & chips",
                " ",
                /* @__PURE__ */ e.jsx("kbd", { children: "Space" })
              ] }),
              /* @__PURE__ */ e.jsxs("button", { onClick: () => x.current?.smokeCigar(), disabled: b || !!h || !!p || m || C || !L.available, title: "Smoke cigar (S)", children: [
                "Cigar ",
                /* @__PURE__ */ e.jsx("kbd", { children: "S" })
              ] }),
              /* @__PURE__ */ e.jsxs("button", { onClick: () => {
                x.current?.sipDrink(), S.current?.focus({ preventScroll: !0 });
              }, disabled: b || !!h || !!p || m || C || !L.available, title: "Sip current drink (D)", children: [
                ct[L.kind].label,
                " ",
                /* @__PURE__ */ e.jsx("kbd", { children: "D" })
              ] }),
              L.treat && /* @__PURE__ */ e.jsxs("button", { onClick: () => {
                x.current?.consumeTreat(), S.current?.focus({ preventScroll: !0 });
              }, disabled: b || !!h || !!p || m || C || !L.canConsume, title: "Take a cosmetic treat (E)", children: [
                dt[L.treat.kind].label,
                " · ",
                L.treat.remaining,
                " ",
                /* @__PURE__ */ e.jsx("kbd", { children: "E" })
              ] }),
              /* @__PURE__ */ e.jsx("button", { onClick: () => D((t) => !t), disabled: b || !!h || !!p || m || C, "aria-expanded": O, children: "Drinks ▾" }),
              /* @__PURE__ */ e.jsxs("button", { onClick: () => Y("bank"), disabled: j || !!p || m, children: [
                "Bank",
                se?.debt ? ` · ${q(se.debt)} owed` : ""
              ] }),
              /* @__PURE__ */ e.jsx("button", { onClick: () => Y("history"), children: "Hand history ↗" })
            ] }),
            O && /* @__PURE__ */ e.jsx(ut, { kind: L.kind, treat: L.treat?.kind ?? null, available: L.available, onClose: () => {
              D(!1), S.current?.focus({ preventScroll: !0 });
            }, onOrder: (t) => {
              (ht(t) ? x.current?.orderDrink(t) : x.current?.orderTreat(t)) && (D(!1), S.current?.focus({ preventScroll: !0 }));
            } }),
            o.players.map((t, s) => {
              if (s === 0) return null;
              const u = x.current?.projectSeat(s) ?? { x: 50, y: 50 };
              return /* @__PURE__ */ e.jsx(
                "div",
                {
                  ref: (A) => x.current?.bindWorldLabel(s, A),
                  className: `seat ${o.actor === s ? "active" : ""} ${t.folded ? "folded" : ""} ${t.stack === 0 && !t.committed ? "out" : ""}`,
                  style: { left: `${u.x}%`, top: `${u.y}%`, "--seat-color": $[s].color },
                  children: /* @__PURE__ */ e.jsx(
                    ft,
                    {
                      name: $[s].name,
                      dealer: o.dealer === s,
                      blind: o.smallBlindSeat === s ? "SB" : o.bigBlindSeat === s ? "BB" : "",
                      stack: t.stack,
                      action: o.actor === s ? "THINKING" : t.action || $[s].title,
                      visibleCards: rt && !t.folded ? t.hole : []
                    }
                  )
                },
                s
              );
            }),
            /* @__PURE__ */ e.jsx("div", { className: "pot-label", ref: (t) => x.current?.bindWorldLabel(-1, t), children: /* @__PURE__ */ e.jsx(bt, { finished: N, amount: N ? Je : xe, sidePots: o.awards.length - 1 }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "room-caption", children: [
              /* @__PURE__ */ e.jsx("span", { children: "THE RIVER CLUB" }),
              /* @__PURE__ */ e.jsx("i", { children: "Make yourself comfortable." })
            ] })
          ] }),
          c && /* @__PURE__ */ e.jsxs("div", { className: "lobby", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "lobby-copy", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "eyebrow", children: [
                /* @__PURE__ */ e.jsx("span", {}),
                " A PRIVATE TABLE. A LONG NIGHT."
              ] }),
              /* @__PURE__ */ e.jsx("h1", { children: "The River Club." }),
              /* @__PURE__ */ e.jsx("p", { children: "Pull up a chair. Leave the world outside." }),
              /* @__PURE__ */ e.jsxs("button", { className: "primary enter-button", onClick: We, disabled: k || j || m || E, children: [
                k ? "Preparing your seat…" : o ? "Return to your table" : "Take a seat",
                " ",
                /* @__PURE__ */ e.jsx("span", { children: "↗" })
              ] }),
              /* @__PURE__ */ e.jsx("a", { className: "website-multiplayer", href: "/dev/multiplayer.html", target: "_blank", rel: "noopener noreferrer", children: "Play with friends · LAN ↗" }),
              /* @__PURE__ */ e.jsxs("div", { className: "lobby-details", children: [
                /* @__PURE__ */ e.jsx("span", { children: "NO-LIMIT TEXAS HOLD’EM" }),
                /* @__PURE__ */ e.jsx("span", { children: "2,000 CHIPS TO START" }),
                /* @__PURE__ */ e.jsx("span", { children: "YOURS TO PLAY. NOTHING TO PAY." })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "lobby-bottom", children: [
              /* @__PURE__ */ e.jsx("span", { children: "EST. BETWEEN COMMITS" }),
              /* @__PURE__ */ e.jsx("span", { children: "Procedural world · Local opponents · Saved on this device" })
            ] })
          ] }),
          !c && b && !h && !p && !g && /* @__PURE__ */ e.jsx("div", { className: "scrim", children: /* @__PURE__ */ e.jsxs("div", { className: "pause-card", children: [
            /* @__PURE__ */ e.jsx("span", { className: "eyebrow", children: "NO RUSH" }),
            /* @__PURE__ */ e.jsx("h2", { children: "Your seat is saved." }),
            /* @__PURE__ */ e.jsx("p", { children: "The whole table waits for you." }),
            /* @__PURE__ */ e.jsxs("button", { className: "primary", onClick: () => {
              y.current?.unlock(), w(!1), S.current?.focus();
            }, children: [
              "Back to the table ",
              /* @__PURE__ */ e.jsx("span", { children: "→" })
            ] }),
            /* @__PURE__ */ e.jsx("button", { className: "text-button", onClick: () => T(!0), children: "Visit the lobby" })
          ] }) }),
          m && /* @__PURE__ */ e.jsx("div", { className: "scrim", children: /* @__PURE__ */ e.jsxs("div", { className: "pause-card", role: "alert", children: [
            /* @__PURE__ */ e.jsx("h2", { children: "The room couldn’t open." }),
            /* @__PURE__ */ e.jsx("p", { children: "WebGL is unavailable. Reopen Poker to try again. Your saved table is kept." })
          ] }) })
        ] }),
        !c && o ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(
            pt,
            {
              board: o.board,
              street: Re[o.street],
              winningCards: tt,
              ownCards: B?.hole ?? [],
              stack: B?.stack ?? 0,
              position: `${o.dealer === 0 ? " · DEALER" : ""}${o.smallBlindSeat === 0 ? " · SB" : ""}${o.bigBlindSeat === 0 ? " · BB" : ""}`,
              handLabel: B?.folded ? "Folded" : et?.name ?? "Practice chips",
              status: nt,
              withActions: ne || N,
              detail: j ? "Saving…" : b ? "Paused" : N ? `Net ${Te >= 0 ? "+" : ""}${q(Te)}` : o.log.at(-1)
            }
          ),
          (ne || N) && !b && !h && !p && /* @__PURE__ */ e.jsx("section", { className: "quick-actions", "aria-label": "Poker actions", children: N ? /* @__PURE__ */ e.jsxs("button", { className: "primary", disabled: j || m, onClick: me ? () => Y("bank") : pe ? () => M(!0) : Qe, children: [
            me ? "Rebuy · practice bank" : pe ? "New table" : "Deal next hand",
            " ",
            /* @__PURE__ */ e.jsx("span", { children: "→" })
          ] }) : /* @__PURE__ */ e.jsx(
            mt,
            {
              ref: J,
              revision: o.revision,
              blocked: Ne,
              legal: be,
              pot: xe,
              currentBet: o.currentBet,
              ownBet: B?.bet ?? 0,
              bigBlind: o.bigBlind,
              onAction: ze,
              onOpenChange: ce,
              focusTable: () => S.current?.focus({ preventScroll: !0 })
            }
          ) })
        ] }) : /* @__PURE__ */ e.jsxs("footer", { className: "lobby-footer", children: [
          /* @__PURE__ */ e.jsx("span", { className: "lobby-footer-mark", children: "♣ ♦ ♥ ♠" }),
          /* @__PURE__ */ e.jsx("span", { children: "A poker room for the moments between." }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => Y("rules"), children: "New to the table? Learn the rules ↗" })
        ] }),
        h && /* @__PURE__ */ e.jsx("div", { className: "panel-scrim", onClick: () => G(null), children: /* @__PURE__ */ e.jsxs("aside", { className: "side-panel", role: "dialog", "aria-modal": "true", "aria-label": h === "bank" ? "Practice bank" : h === "history" ? "Hand history" : h === "rules" ? "How to play" : "Settings", onClick: (t) => t.stopPropagation(), children: [
          /* @__PURE__ */ e.jsxs("header", { children: [
            /* @__PURE__ */ e.jsx("span", { className: "eyebrow", children: "THE RIVER CLUB" }),
            /* @__PURE__ */ e.jsx("button", { "aria-label": "Close panel", onClick: () => G(null), children: "×" })
          ] }),
          /* @__PURE__ */ e.jsx("h2", { children: h === "bank" ? "Stay at the table." : h === "history" ? "The hands we played." : h === "rules" ? "Find your seat." : "Make it yours." }),
          h === "bank" && se && o ? /* @__PURE__ */ e.jsx(xt, { scope: "solo", offer: se, revision: o.revision, blocked: j || !!p || m || g, onConfirm: Xe }) : h === "history" ? /* @__PURE__ */ e.jsxs("div", { className: "history-list", children: [
            o && /* @__PURE__ */ e.jsxs("details", { open: !0, children: [
              /* @__PURE__ */ e.jsxs("summary", { children: [
                "Hand ",
                o.handNumber,
                " · ",
                N ? "Complete" : Re[o.street]
              ] }),
              o.log.map((t, s) => /* @__PURE__ */ e.jsx("p", { children: t }, s)),
              o.awards.map((t, s) => /* @__PURE__ */ e.jsxs("p", { className: "pot-history", children: [
                t.label,
                ": ",
                q(t.amount),
                " → ",
                t.winners.map((u, A) => `${$[u].name} ${q(t.shares[A])}`).join(", ")
              ] }, `pot${s}`))
            ] }),
            o?.history.filter((t) => t.number !== o.handNumber).map((t) => /* @__PURE__ */ e.jsxs("details", { children: [
              /* @__PURE__ */ e.jsxs("summary", { children: [
                "Hand ",
                t.number,
                " ",
                /* @__PURE__ */ e.jsxs("b", { children: [
                  t.net >= 0 ? "+" : "",
                  q(t.net)
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("strong", { children: t.summary }),
              t.log.map((s, u) => /* @__PURE__ */ e.jsx("p", { children: s }, u))
            ] }, t.number)),
            !o && /* @__PURE__ */ e.jsx("p", { children: "Your first story starts at the table." })
          ] }) : h === "settings" ? /* @__PURE__ */ e.jsxs("div", { className: "settings-content", children: [
            /* @__PURE__ */ e.jsxs("label", { children: [
              "Table pace",
              /* @__PURE__ */ e.jsxs("select", { value: ie, disabled: j || k || E, onChange: (t) => {
                const s = t.target.value;
                Se(s), te.current.speed = s, re(n.current?.snapshot() ?? null);
              }, children: [
                /* @__PURE__ */ e.jsx("option", { value: "relaxed", children: "Relaxed" }),
                /* @__PURE__ */ e.jsx("option", { value: "brisk", children: "Brisk" })
              ] })
            ] }),
            /* @__PURE__ */ e.jsx("p", { children: "How long opponents take between decisions." }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              "Sound",
              /* @__PURE__ */ e.jsx("button", { onClick: fe, disabled: j || k || E, "aria-pressed": !_, children: _ ? "Off" : "On" })
            ] }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              "Fire ambience",
              /* @__PURE__ */ e.jsxs("select", { value: X, onChange: (t) => {
                const s = Number(t.target.value);
                Ye(s), x.current?.recordAudio({ ambience: s, effects: Z });
              }, children: [
                /* @__PURE__ */ e.jsx("option", { value: 0, children: "Off" }),
                /* @__PURE__ */ e.jsx("option", { value: 0.5, children: "Quiet" }),
                /* @__PURE__ */ e.jsx("option", { value: 1, children: "Normal" })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              "Game effects",
              /* @__PURE__ */ e.jsxs("select", { value: Z, onChange: (t) => {
                const s = Number(t.target.value);
                $e(s), x.current?.recordAudio({ ambience: X, effects: s });
              }, children: [
                /* @__PURE__ */ e.jsx("option", { value: 0, children: "Off" }),
                /* @__PURE__ */ e.jsx("option", { value: 0.5, children: "Quiet" }),
                /* @__PURE__ */ e.jsx("option", { value: 1, children: "Normal" })
              ] })
            ] }),
            /* @__PURE__ */ e.jsx("p", { children: "Fire and game sounds have separate levels. Sound Off mutes both. Levels last until reload." }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              "Drink & treat effect",
              /* @__PURE__ */ e.jsxs("select", { "aria-label": "Drink and treat effect", value: ue, onChange: (t) => Ve(t.target.value), children: [
                /* @__PURE__ */ e.jsx("option", { value: "off", children: "Off" }),
                /* @__PURE__ */ e.jsx("option", { value: "normal", children: "Normal" }),
                /* @__PURE__ */ e.jsx("option", { value: "strong", children: "Strong" })
              ] })
            ] }),
            /* @__PURE__ */ e.jsx("p", { children: "Builds only after your own completed alcoholic sips and treats: a slow sway, soft double vision and colour shifts. It never flashes, never moves chips or props, and fades over several minutes. Reduced-motion devices get a colour tint only. Off clears it at once; this lasts until reload." }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              "Camera angle",
              /* @__PURE__ */ e.jsx("input", { type: "range", min: -1, max: 1, step: 0.1, value: de, onChange: (t) => _e(Number(t.target.value)) })
            ] }),
            x.current?.experimentalLook && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsxs("label", { children: [
                "Mouse-look",
                /* @__PURE__ */ e.jsx("button", { "aria-pressed": ee, onClick: () => Ge((t) => !t), children: ee ? "On" : "Off" })
              ] }),
              /* @__PURE__ */ e.jsx("p", { children: "Hold the left mouse button and drag the room. R centers your view. Controls never steer the camera. This setting lasts until reload." })
            ] }),
            /* @__PURE__ */ e.jsx("p", { children: "Motion follows your device’s reduced-motion preference." }),
            /* @__PURE__ */ e.jsx("div", { className: "settings-divider" }),
            /* @__PURE__ */ e.jsx("h3", { children: "A fresh table" }),
            /* @__PURE__ */ e.jsx("p", { children: "Start everyone with 2,000 practice chips. This replaces your current table and hand history." }),
            /* @__PURE__ */ e.jsx("button", { className: "secondary", onClick: () => M(!0), disabled: j || k, children: "Start a new table" })
          ] }) : /* @__PURE__ */ e.jsxs("div", { className: "rules-content", children: [
            /* @__PURE__ */ e.jsx("p", { children: "Build the best five-card hand using your two cards and the five shared cards. You can use both, one, or neither of your cards." }),
            /* @__PURE__ */ e.jsx("h3", { children: "A hand in four acts" }),
            /* @__PURE__ */ e.jsxs("p", { children: [
              /* @__PURE__ */ e.jsx("b", { children: "Pre-flop:" }),
              " two private cards. ",
              /* @__PURE__ */ e.jsx("b", { children: "Flop:" }),
              " three shared cards. ",
              /* @__PURE__ */ e.jsx("b", { children: "Turn:" }),
              " one more. ",
              /* @__PURE__ */ e.jsx("b", { children: "River:" }),
              " the last card. Betting follows each street."
            ] }),
            /* @__PURE__ */ e.jsx("h3", { children: "Your move" }),
            /* @__PURE__ */ e.jsxs("p", { children: [
              /* @__PURE__ */ e.jsx("b", { children: "Check" }),
              " when nothing is owed. ",
              /* @__PURE__ */ e.jsx("b", { children: "Call" }),
              " to match. ",
              /* @__PURE__ */ e.jsx("b", { children: "Raise" }),
              " to increase the total bet for this street. ",
              /* @__PURE__ */ e.jsx("b", { children: "Fold" }),
              " to leave the hand. “Raise to” includes chips you already put in this street."
            ] }),
            /* @__PURE__ */ e.jsx("h3", { children: "All-in means all-in" }),
            /* @__PURE__ */ e.jsx("p", { children: "You can only win the chips you match. Additional bets form side pots. A short all-in may require a call without reopening a raise. Ties split each pot; odd chips go clockwise from the dealer." }),
            /* @__PURE__ */ e.jsx("h3", { children: "From strongest to weakest" }),
            /* @__PURE__ */ e.jsx("ol", { children: ["Straight flush", "Four of a kind", "Full house", "Flush", "Straight", "Three of a kind", "Two pair", "One pair", "High card"].map((t) => /* @__PURE__ */ e.jsx("li", { children: t }, t)) }),
            /* @__PURE__ */ e.jsx("p", { children: "Blinds stay at 10/20. Eliminated seats sit out; a moving button rotates through funded seats. Beat the table, or start fresh any time. Bots use their own cards and public information." }),
            /* @__PURE__ */ e.jsx("h3", { children: "Keyboard" }),
            /* @__PURE__ */ e.jsxs("p", { children: [
              /* @__PURE__ */ e.jsx("kbd", { children: "F" }),
              " fold · ",
              /* @__PURE__ */ e.jsx("kbd", { children: "C" }),
              " check/call · ",
              /* @__PURE__ */ e.jsx("kbd", { children: "B" }),
              " open wager. Arrows adjust by one chip; Shift + arrows adjust by one big blind. Keys 1–4 choose minimum, half-pot, pot or all-in. ",
              /* @__PURE__ */ e.jsx("kbd", { children: "Enter" }),
              " confirms only a visible wager with table focus. ",
              /* @__PURE__ */ e.jsx("kbd", { children: "Esc" }),
              " cancels sizing before it pauses. Buttons and text fields keep their normal Enter/Space behavior."
            ] }),
            /* @__PURE__ */ e.jsxs("p", { children: [
              /* @__PURE__ */ e.jsx("kbd", { children: "M" }),
              " sound · ",
              /* @__PURE__ */ e.jsx("kbd", { children: "Space" }),
              " inspect cards · ",
              /* @__PURE__ */ e.jsx("kbd", { children: "S" }),
              " cigar · ",
              /* @__PURE__ */ e.jsx("kbd", { children: "D" }),
              " sip. Sizing does not move chips until you confirm."
            ] }),
            /* @__PURE__ */ e.jsx("p", { children: "Everything is local. All chips are free practice currency." })
          ] })
        ] }) }),
        p && /* @__PURE__ */ e.jsxs("div", { className: "save-alert", role: "alert", children: [
          /* @__PURE__ */ e.jsx("strong", { children: E ? "Saved table needs attention" : "Table paused" }),
          /* @__PURE__ */ e.jsx("p", { children: p }),
          !E && /* @__PURE__ */ e.jsx("button", { className: "primary", disabled: j, onClick: () => {
            re(n.current?.snapshot() ?? null);
          }, children: "Retry save" }),
          /* @__PURE__ */ e.jsx("button", { className: "text-button", disabled: j, onClick: () => M(!0), children: "Start a new table instead" })
        ] }),
        g && /* @__PURE__ */ e.jsx("div", { className: "panel-scrim", children: /* @__PURE__ */ e.jsxs("div", { className: "confirm-card", role: "alertdialog", "aria-modal": "true", "aria-labelledby": "fresh-title", children: [
          /* @__PURE__ */ e.jsx("span", { className: "eyebrow", children: "FRESH FELT" }),
          /* @__PURE__ */ e.jsx("h2", { id: "fresh-title", children: "Start a new table?" }),
          /* @__PURE__ */ e.jsx("p", { children: "Your current hand, chip stacks, history and fictional bank debt will be replaced. Everyone starts with 2,000 practice chips and no debt." }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("button", { className: "secondary", onClick: () => M(!1), children: "Keep this table" }),
            /* @__PURE__ */ e.jsx("button", { className: "primary", disabled: j || m, onClick: qe, children: "Start fresh" })
          ] })
        ] }) })
      ]
    }
  );
}
const Ot = gt({
  mount(r, a) {
    const l = document.createElement("style");
    l.textContent = jt, document.head.append(l);
    const n = yt.createRoot(r);
    return n.render(/* @__PURE__ */ e.jsx(Lt, { api: a.api })), () => {
      n.unmount(), l.remove();
    };
  }
});
export {
  Ot as default
};
