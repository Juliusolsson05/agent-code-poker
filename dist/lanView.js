import { d as y } from "./runtime-XLX8az2X.js";
import { s as g } from "./styles-D3FEynTG.js";
const m = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Agent Code Poker · LAN</title><script src="/client.js" type="module"><\/script></head>
<body class="poker-preview"><main id="app" class="poker" tabindex="-1">
<div id="header"></div>
<section class="room" aria-label="Poker room"><div id="scene" class="scene" role="region" aria-label="Multiplayer poker room"></div><div class="room-vignette"></div>
  <section id="entry" class="lobby"><div class="lobby-copy lan-admission"><p class="eyebrow">A PRIVATE TABLE. A LONG NIGHT.</p><h1>The River Club.</h1><p>Pull up a chair. Bring your friends.</p>
    <div class="admission-fields"><label>Your name <input id="name" maxlength="24" autocomplete="off" value="Guest"></label><label>Lobby code <input id="code" maxlength="24" autocomplete="off" spellcheck="false"></label></div>
    <label class="remember"><input id="remember" type="checkbox"> Remember my seat on this browser</label>
    <div class="row"><button class="primary" id="create">Create table on this computer</button><button class="secondary" id="join">Join table</button></div>
    <section id="recovery" hidden><h2>Return to a saved seat</h2><label>Saved player <select id="saved-seats"></select></label><p class="small">Close your previous playing tab first. Resume controls the same seat. Use the same host URL.</p><div class="row"><button class="secondary" id="resume-seat">Resume saved seat</button><button class="text-button" id="forget-seat">Forget selected saved seat</button></div></section>
    <p class="small">Trusted LAN · Practice chips only. Names and codes stay on this host. Remembering stores a private seat key on this device; Leave or Forget before sharing it.</p>
  </div></section>
  <div id="table" hidden><div id="table-info"></div><div id="labels"></div><div id="pot" class="pot-label"></div>
    <div class="room-top-right"><button id="inspect">Cards &amp; chips <kbd>Space</kbd></button><div id="leisure"></div><button id="details">Table menu</button></div>
  </div>
</section>
<div id="hud"></div><section id="actions" class="quick-actions" aria-label="Poker actions" hidden></section>
<section id="deal-actions" class="quick-actions" hidden><button id="start" class="primary">Deal next hand <span>→</span></button></section>
<p id="storage-warning" role="status"></p><p id="error" class="save-alert" role="alert"></p><button id="forget" class="secondary" hidden>Clear ended connection</button>
<div id="menu" class="panel-scrim" hidden><aside class="side-panel" role="dialog" aria-modal="true" aria-label="Table menu">
  <header><span class="eyebrow">THE RIVER CLUB</span><button id="close-menu" aria-label="Close panel">×</button></header><h2>Your table.</h2>
  <p id="connection" role="status">THE RIVER CLUB · LAN</p><p id="invite"></p><p id="host-storage" class="small"></p><ol id="players"></ol><div id="bank"></div>
  <label>Mouse-look <button id="look-enabled" aria-pressed="true">On</button></label><p class="small">Left-drag the room to look. R centers your view. This preference stays on this browser until reload.</p>
  <label>Fire ambience <select id="ambience-level"><option value="0">Off</option><option value="0.5">Quiet</option><option value="1" selected>Normal</option></select></label>
  <label>Game effects <select id="effects-level"><option value="0">Off</option><option value="0.5">Quiet</option><option value="1" selected>Normal</option></select></label><p class="small">Levels last until reload. Sound Off mutes both.</p>
  <div class="row"><button id="pause" class="secondary">Pause table</button><button id="leave" class="secondary">Leave table</button><button id="remember-current" class="secondary">Remember this seat on this browser</button><button id="export" class="text-button">Export public diagnostics</button></div>
  <p id="seat-note" class="small" role="status"></p><p class="small">Diagnostics contain no codes, credentials, names or card values. Leaving as host ends the session for everyone.</p>
</aside></div>
</main></body></html>
`, w = "html:has(body.poker-preview),body.poker-preview{margin:0;width:100%;height:100%;background:#08090b;overflow:hidden}body.poker-preview #root{width:100%;height:100dvh}body.poker-preview .poker{width:100%;height:100dvh;border-radius:0}body.poker-preview .poker .room{height:100%}body.poker-preview .header{padding-right:70px}body.poker-preview .betting-controls{max-width:760px;margin-left:auto}body.poker-preview .your-hand{width:330px}.preview-fullscreen{position:fixed;z-index:40;top:12px;right:22px;width:31px;height:31px;display:grid;place-items:center;padding:0;background:#131414b0;border:1px solid #a2917030;border-radius:4px;color:#b7aa94;font:24px/1 sans-serif;cursor:pointer}.preview-fullscreen:hover{background:#50453388}.preview-fullscreen:focus-visible{outline:2px solid #c9ad80;outline-offset:3px}.preview-fullscreen-status{position:fixed;z-index:50;right:20px;top:60px;max-width:320px;color:#e4d7bf;background:#24221e;font:12px/1.5 sans-serif;border-radius:4px}.preview-fullscreen-status:not(:empty){padding:12px 16px;border:1px solid #b9a07866}body.poker-preview .website-multiplayer{display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;margin:10px 0 0 12px;border:1px solid #b9a07880;border-radius:4px;color:#e7d8ba;background:#151a15d9;text-decoration:none;font:500 14px/1.4 sans-serif}body.poker-preview .website-multiplayer:hover{background:#3c3b2b}body.poker-preview .website-multiplayer:focus-visible{outline:2px solid #e6c795;outline-offset:4px}@media(min-width:1400px){body.poker-preview .action-deck,body.poker-preview .table-strip{padding-left:4vw;padding-right:4vw}}@media(max-width:850px){body.poker-preview .header-location{display:none}body.poker-preview .header-tools{margin-left:auto}body.poker-preview .your-hand{width:250px;gap:12px}body.poker-preview .action-deck{gap:16px;padding-left:16px;padding-right:16px}body.poker-preview .bet-presets button{padding:6px 8px}body.poker-preview .table-strip{gap:10px}}", k = "[hidden]{display:none!important}#header,#hud,#table-info,#leisure,.lan-leisure{display:contents}.lan-admission{max-height:calc(100dvh - 100px);overflow:auto;max-width:680px;margin:0 auto;padding:20px!important;background:#111414cf;border:1px solid #b9a07835;border-radius:6px}.admission-fields{display:flex;justify-content:center;gap:14px;flex-wrap:wrap}.admission-fields label{display:grid;gap:7px;text-align:left;font-size:11px}.admission-fields input,#saved-seats{font:inherit;padding:10px;border:1px solid #786b5355;border-radius:4px;background:#171a17;color:#e7dcc8}.row{display:flex;flex-wrap:wrap;gap:10px}.lan-admission .row{justify-content:center;margin:12px 0}.remember{display:flex;justify-content:center;align-items:center;gap:8px;margin:14px 0;font-size:11px;color:#b3a997}.remember input{width:16px;height:16px}.small{font-size:11px;line-height:1.6}#recovery{margin:16px 0;border-top:1px solid #b9a07835;padding-top:14px}#error:empty,#storage-warning:empty{display:none}#storage-warning{position:absolute;top:110px;left:20px;right:20px;z-index:12;background:#282314f2;color:#f1dda9;padding:10px;font-size:12px}#forget{position:absolute;top:160px;left:20px;z-index:13}#menu ol{padding-left:20px}#menu li{padding:5px 0;font-size:12px}";
function L(d) {
  const r = d.trim(), o = /^http:\/\/(localhost|(?:\d{1,3}\.){3}\d{1,3})(?::([1-9]\d{0,4}))?\/?$/.exec(r), e = () => new Error("Paste the host’s printed http:// private IPv4 address and port, without a path, code or password.");
  if (!o) throw e();
  const [, n, l] = o;
  if (l && Number(l) > 65535) throw e();
  if (n !== "localhost") {
    const i = n.split(".");
    if (i.some((a) => String(Number(a)) !== a || Number(a) > 255)) throw e();
    const [s, p] = i.map(Number);
    if (!(s === 127 || s === 10 || s === 192 && p === 168 || s === 172 && p >= 16 && p <= 31)) throw e();
  }
  return new URL(r).origin + "/";
}
const v = "agent-code-poker.lan-host";
function E() {
  return async ({ path: d, method: r, headers: o, body: e }) => {
    const n = await fetch(`./__service/${v}${d}`, {
      method: r,
      headers: o,
      body: e,
      cache: "no-store"
    });
    return { ok: n.ok, status: n.status, json: () => n.json() };
  };
}
function T(d, r) {
  return async ({ path: o, method: e, headers: n, body: l }) => {
    if (!o.startsWith("/")) throw new Error("Invalid service path.");
    const i = await d(`${r}${o}`, {
      httpMethod: e,
      headers: Object.entries(n).map(([s, p]) => ({ name: s, value: p })),
      ...l === void 0 ? {} : { body: l }
    });
    return {
      ok: i.status >= 200 && i.status < 300,
      status: i.status,
      // The broker returns text; the client expects response.json(). The poker
      // host answers JSON on every route (errors included), so parsing here
      // preserves the client's existing error envelope handling exactly.
      json: async () => JSON.parse(i.body)
    };
  };
}
const C = `
html,body{margin:0;width:1600px;height:1000px;overflow:hidden}
#app{width:1600px;height:1000px}
`, N = m.slice(m.indexOf("<main"), m.indexOf("</main>") + 7), A = y({
  mount(d, r) {
    const o = document.createElement("style");
    o.textContent = w + g + k + C, document.head.append(o), d.innerHTML = N, document.body.classList.add("poker-preview");
    const e = document.createElement("section");
    e.className = "panel-scrim", e.style.position = "absolute", e.style.zIndex = "40", e.innerHTML = `
      <aside class="side-panel" role="dialog" aria-modal="true" aria-label="Play over LAN">
        <header><span class="eyebrow">THE RIVER CLUB · LAN</span></header>
        <h2>Bring the table to your friends.</h2>
        <p class="small">Host on this computer — friends join from any browser on your network. Or join a friend who is hosting.</p>
        <div class="row">
          <button class="primary" id="lan-host">Host on this computer</button>
        </div>
        <form id="lan-join" class="row"><input id="lan-address" placeholder="http://192.168.1.42:5192" autocomplete="off" spellcheck="false" style="flex:1;padding:10px;border:1px solid #786b5355;border-radius:4px;background:#171a17;color:#e7dcc8">
          <button class="secondary" type="submit">Join friend</button></form>
        <p id="lan-error" role="alert" style="color:#e2a79c;min-height:1em"></p>
        <p id="lan-share" role="status" hidden></p>
        <p class="small">Practice chips only · trusted local network only.</p>
      </aside>`, d.querySelector("#entry")?.append(e);
    const l = e.querySelector("#lan-error"), i = e.querySelector("#lan-share"), s = r.api.services, p = r.api.net;
    let a = !1;
    const u = (t) => {
      l.textContent = t;
    };
    async function f(t, b) {
      if (!a) {
        a = !0;
        try {
          await t(), e.hidden = !0;
        } catch (c) {
          a = !1, u(c instanceof Error ? c.message : String(c));
        }
      }
    }
    return e.querySelector("#lan-host").addEventListener("click", () => {
      if (!s) {
        u("This Agent Code build does not support extension services.");
        return;
      }
      a || (a = !0, l.textContent = "Starting LAN host…", (async () => {
        try {
          await s.start(v);
          const t = await s.expose(v, !0);
          if (!t.lan || !t.port) throw new Error("LAN exposure was not granted.");
          const { setApiTransport: b } = await import("./client-BXRLvBPC.js");
          b(E()), e.hidden = !0, i.hidden = !1, i.style.color = "#c1db9c", i.textContent = `Friends join at http://<this-computer’s-Wi-Fi-IP>:${t.port} — then use Create table below.`;
        } catch (t) {
          a = !1, u(t instanceof Error ? t.message : String(t));
        }
      })());
    }), e.querySelector("#lan-join").addEventListener("submit", (t) => {
      if (t.preventDefault(), !p) {
        u("This Agent Code build does not support brokered fetch.");
        return;
      }
      const b = e.querySelector("#lan-address");
      let c;
      try {
        c = L(b.value);
      } catch (h) {
        u(h instanceof Error ? h.message : "Invalid host address.");
        return;
      }
      f(async () => {
        const { setApiTransport: h } = await import("./client-BXRLvBPC.js");
        h(T((x) => p.fetch(x), c));
      });
    }), () => {
      e.remove(), o.remove();
    };
  }
});
export {
  A as default
};
