import { d as V } from "./runtime-XLX8az2X.js";
import { s as P } from "./styles-DJYLcAU6.js";
import { S as v, l as z, p as I, a as C, b as M } from "./inAppTransport-z84GxgS3.js";
const x = `<!doctype html>
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
    <div class="room-top-right"><button id="inspect">Cards &amp; chips <kbd>Space</kbd></button><div id="leisure"></div><button id="chat-open">Chat <kbd>T</kbd></button><button id="details">Table menu</button></div>
    <div id="chat" class="lan-chat"></div>
  </div>
</section>
<div id="hud"></div><section id="actions" class="quick-actions" aria-label="Poker actions" hidden></section>
<section id="deal-actions" class="quick-actions" hidden><button id="start" class="primary">Deal next hand <span>→</span></button></section>
<p id="storage-warning" role="status"></p><p id="error" class="save-alert" role="alert"></p><button id="forget" class="secondary" hidden>Clear ended connection</button>
<div id="menu" class="panel-scrim" hidden><aside class="side-panel" role="dialog" aria-modal="true" aria-label="Table menu">
  <header><span class="eyebrow">THE RIVER CLUB</span><button id="close-menu" aria-label="Close panel">×</button></header><h2>Your table.</h2>
  <p id="connection" role="status">THE RIVER CLUB · LAN</p><p id="invite"></p><p id="host-storage" class="small"></p><ol id="players"></ol><div id="bank"></div><div id="features"></div><div id="voice-settings"></div>
  <label>Mouse-look <button id="look-enabled" aria-pressed="true">On</button></label><p class="small">Left-drag the room to look. R centers your view. This preference stays on this browser until reload.</p>
  <label>Fire ambience <select id="ambience-level"><option value="0">Off</option><option value="0.5">Quiet</option><option value="1" selected>Normal</option></select></label>
  <label>Game effects <select id="effects-level"><option value="0">Off</option><option value="0.5">Quiet</option><option value="1" selected>Normal</option></select></label><p class="small">Levels last until reload. Sound Off mutes both.</p>
  <label>Drink &amp; treat effect <select id="drink-effect" aria-label="Drink and treat effect"><option value="off">Off</option><option value="normal" selected>Normal</option><option value="strong">Strong</option></select></label><p class="small">Only after your own sips and treats, only on your screen. Never flashes; reduced motion gets a tint only.</p>
  <div class="row"><button id="pause" class="secondary">Pause table</button><button id="leave" class="secondary">Leave table</button><button id="remember-current" class="secondary">Remember this seat on this browser</button><button id="export" class="text-button">Export public diagnostics</button></div>
  <p id="seat-note" class="small" role="status"></p><p class="small">Diagnostics contain no codes, credentials, names or card values. Leaving as host ends the session for everyone.</p>
</aside></div>
</main></body></html>
`, B = "html:has(body.poker-preview),body.poker-preview{margin:0;width:100%;height:100%;background:#08090b;overflow:hidden}body.poker-preview #root{width:100%;height:100dvh}body.poker-preview .poker{width:100%;height:100dvh;border-radius:0}body.poker-preview .poker .room{height:100%}body.poker-preview .header{padding-right:70px}body.poker-preview .betting-controls{max-width:760px;margin-left:auto}body.poker-preview .your-hand{width:330px}.preview-fullscreen{position:fixed;z-index:40;top:12px;right:22px;width:31px;height:31px;display:grid;place-items:center;padding:0;background:#131414b0;border:1px solid #a2917030;border-radius:4px;color:#b7aa94;font:24px/1 sans-serif;cursor:pointer}.preview-fullscreen:hover{background:#50453388}.preview-fullscreen:focus-visible{outline:2px solid #c9ad80;outline-offset:3px}.preview-fullscreen-status{position:fixed;z-index:50;right:20px;top:60px;max-width:320px;color:#e4d7bf;background:#24221e;font:12px/1.5 sans-serif;border-radius:4px}.preview-fullscreen-status:not(:empty){padding:12px 16px;border:1px solid #b9a07866}body.poker-preview .website-multiplayer{display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;margin:10px 0 0 12px;border:1px solid #b9a07880;border-radius:4px;color:#e7d8ba;background:#151a15d9;text-decoration:none;font:500 14px/1.4 sans-serif}body.poker-preview .website-multiplayer:hover{background:#3c3b2b}body.poker-preview .website-multiplayer:focus-visible{outline:2px solid #e6c795;outline-offset:4px}@media(min-width:1400px){body.poker-preview .action-deck,body.poker-preview .table-strip{padding-left:4vw;padding-right:4vw}}@media(max-width:850px){body.poker-preview .header-location{display:none}body.poker-preview .header-tools{margin-left:auto}body.poker-preview .your-hand{width:250px;gap:12px}body.poker-preview .action-deck{gap:16px;padding-left:16px;padding-right:16px}body.poker-preview .bet-presets button{padding:6px 8px}body.poker-preview .table-strip{gap:10px}}", D = '[hidden]{display:none!important}#header,#hud,#table-info,#leisure,.lan-leisure{display:contents}.lan-admission{max-height:calc(100dvh - 100px);overflow:auto;max-width:680px;margin:0 auto;padding:20px!important;background:#111414cf;border:1px solid #b9a07835;border-radius:6px}.admission-fields{display:flex;justify-content:center;gap:14px;flex-wrap:wrap}.admission-fields label{display:grid;gap:7px;text-align:left;font-size:11px}.admission-fields input,#saved-seats{font:inherit;padding:10px;border:1px solid #786b5355;border-radius:4px;background:#171a17;color:#e7dcc8}.row{display:flex;flex-wrap:wrap;gap:10px}.lan-admission .row{justify-content:center;margin:12px 0}.remember{display:flex;justify-content:center;align-items:center;gap:8px;margin:14px 0;font-size:11px;color:#b3a997}.remember input{width:16px;height:16px}.small{font-size:11px;line-height:1.6}#recovery{margin:16px 0;border-top:1px solid #b9a07835;padding-top:14px}#error:empty,#storage-warning:empty{display:none}#storage-warning{position:absolute;top:110px;left:20px;right:20px;z-index:12;background:#282314f2;color:#f1dda9;padding:10px;font-size:12px}#forget{position:absolute;top:160px;left:20px;z-index:13}#menu ol{padding-left:20px}#menu li{padding:5px 0;font-size:12px}.chat-bubble{position:absolute;left:50%;bottom:calc(100% + 9px);transform:translate(-50%);width:max-content;max-width:220px;padding:7px 10px;border-radius:10px;background:#f1e6cdf2;color:#1b1a16;font-size:12px;line-height:1.35;text-align:left;overflow-wrap:anywhere;box-shadow:0 4px 14px #0006}.chat-bubble:after{content:"";position:absolute;left:50%;top:100%;transform:translate(-50%);border:6px solid transparent;border-top-color:#f1e6cdf2}.chat-bubble.start{left:0;transform:none}.chat-bubble.start:after{left:22px}.chat-bubble.end{left:auto;right:0;transform:none}.chat-bubble.end:after{left:auto;right:10px;transform:none}.lan-chat{position:absolute;left:18px;bottom:150px;z-index:8;width:min(360px,calc(100% - 36px));display:grid;gap:6px}.lan-chat-log ol{list-style:none;margin:0;padding:0;display:grid;gap:3px}.lan-chat-log li{font-size:12px;line-height:1.4;color:#e6dcc5;background:#11141299;padding:3px 8px;border-radius:3px;overflow-wrap:anywhere}.lan-chat-log b{color:#d8b77e;font-weight:600;margin-right:4px}.lan-chat-status{margin:0;font-size:11px;color:#f1dda9}.lan-chat-input{display:grid;gap:4px;background:#111414e6;border:1px solid #b9a07855;border-radius:4px;padding:8px}.lan-chat-input label{display:flex;gap:8px;align-items:center;font-size:11px}.lan-chat-input input,.lan-voice-settings input{flex:1;font:inherit;padding:8px;border:1px solid #786b5355;border-radius:4px;background:#171a17;color:#e7dcc8}.lan-features,.lan-voice-settings{border-top:1px solid #b9a07835;margin-top:12px;padding-top:10px;display:grid;gap:8px}.lan-features label,.lan-voice-settings label{display:grid;gap:5px;font-size:12px}.lan-voice-settings h3{margin:0;font-size:13px}.lan-no-treats [aria-labelledby=drink-section-curiosities]{display:none}';
function U(e) {
  const t = e.trim(), n = /^http:\/\/(localhost|(?:\d{1,3}\.){3}\d{1,3})(?::([1-9]\d{0,4}))?\/?$/.exec(t), o = () => new Error("Paste the host’s printed http:// private IPv4 address and port, without a path, code or password.");
  if (!n) throw o();
  const [, r, b] = n;
  if (b && Number(b) > 65535) throw o();
  if (r !== "localhost") {
    const d = r.split(".");
    if (d.some((c) => String(Number(c)) !== c || Number(c) > 255)) throw o();
    const [s, p] = d.map(Number);
    if (!(s === 127 || s === 10 || s === 192 && p === 168 || s === 172 && p >= 16 && p <= 31)) throw o();
  }
  return new URL(t).origin + "/";
}
const ne = "audio/mpeg", ae = 96 * 1024;
function q(e) {
  if (e.length < 4) return !1;
  if (e[0] === 73 && e[1] === 68 && e[2] === 51) return e[3] >= 2 && e[3] <= 4;
  if (e[0] !== 255 || (e[1] & 224) !== 224) return !1;
  const t = e[1] >> 3 & 3, n = e[1] >> 1 & 3, o = e[2] >> 4, r = e[2] >> 2 & 3;
  return t !== 1 && n !== 0 && o !== 15 && r !== 3;
}
function re(e) {
  let t = "";
  for (let n = 0; n < e.length; n += 32768) t += String.fromCharCode(...e.subarray(n, n + 32768));
  return btoa(t);
}
function H(e) {
  if (typeof e != "string" || e.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(e)) return null;
  try {
    const t = atob(e), n = new Uint8Array(t.length);
    for (let o = 0; o < t.length; o++) n[o] = t.charCodeAt(o);
    return n;
  } catch {
    return null;
  }
}
const j = "https://api.elevenlabs.io", K = "mp3_22050_32", $ = "eleven_flash_v2_5", ie = {
  "not-configured": "Add your ElevenLabs API key and voice ID in the table menu to speak.",
  "invalid-key": "ElevenLabs refused the API key. Check it in the table menu.",
  quota: "Your ElevenLabs quota is used up. Messages stay text-only.",
  "voice-not-found": "ElevenLabs did not recognise that voice ID.",
  busy: "ElevenLabs is busy. This message stays text-only.",
  network: "Could not reach ElevenLabs. This message stays text-only.",
  "invalid-response": "ElevenLabs returned something that is not audio.",
  failed: "ElevenLabs could not speak this message."
}, Y = /^[A-Za-z0-9]{8,64}$/, G = /^[\x21-\x7e]{8,256}$/;
function _(e) {
  const t = typeof e.apiKey == "string" ? e.apiKey.trim() : "", n = typeof e.voiceId == "string" ? e.voiceId.trim() : "";
  return G.test(t) && Y.test(n) ? { apiKey: t, voiceId: n } : null;
}
const F = 512 * 1024;
function J(e, t) {
  let n = "";
  try {
    const o = JSON.parse(new TextDecoder().decode(t.subarray(0, 4096)));
    typeof o?.detail?.status == "string" && (n = o.detail.status);
  } catch {
  }
  return n === "quota_exceeded" || e === 402 ? "quota" : n === "invalid_api_key" || n === "needs_authorization" || e === 401 ? "invalid-key" : n === "voice_not_found" || n === "invalid_uid" || e === 404 ? "voice-not-found" : e === 429 || n === "too_many_concurrent_requests" || n === "system_busy" ? "busy" : "failed";
}
function se(e, t) {
  return {
    async synthesize(n) {
      const o = e();
      if (!o) return { ok: !1, reason: "not-configured" };
      let r;
      try {
        r = await t({
          // voiceId passed VOICE_ID, so it cannot add a path segment or query.
          url: `${j}/v1/text-to-speech/${o.voiceId}?output_format=${K}`,
          headers: { "xi-api-key": o.apiKey, "content-type": "application/json", accept: "audio/mpeg" },
          body: JSON.stringify({ text: n, model_id: $ })
        });
      } catch {
        return { ok: !1, reason: "network" };
      }
      return r.status < 200 || r.status >= 300 ? { ok: !1, reason: J(r.status, r.bytes) } : r.bytes.length > F || !q(r.bytes) ? { ok: !1, reason: "invalid-response" } : { ok: !0, audio: r.bytes };
    }
  };
}
const w = "poker-lan-elevenlabs-key", k = "poker-lan-elevenlabs-voice";
function le(e) {
  return {
    where: "Saved in this browser’s local storage on this computer only. It is never sent to the table host or other players. Use Forget before sharing this browser.",
    async load() {
      try {
        return _({ apiKey: e().getItem(w), voiceId: e().getItem(k) });
      } catch {
        return null;
      }
    },
    async save(t) {
      try {
        return e().setItem(w, t.apiKey), e().setItem(k, t.voiceId), !0;
      } catch {
        return !1;
      }
    },
    async clear() {
      try {
        e().removeItem(w), e().removeItem(k);
      } catch {
      }
    }
  };
}
const E = "elevenlabs.apiKey", T = "lan.elevenlabsVoiceId";
function X(e) {
  const t = e.secrets;
  return {
    where: t ? "Your key is encrypted by Agent Code with this computer’s keychain and readable only by this extension. It is never sent to the table host or other players." : "This Agent Code build has no secret storage. Update Agent Code to save a key; voices stay text-only until then.",
    async load() {
      if (!t) return null;
      try {
        return _({ apiKey: await t.get(E), voiceId: await e.storage.get(T) });
      } catch {
        return null;
      }
    },
    async save(n) {
      if (!t) return !1;
      try {
        return await t.set(E, n.apiKey), await e.storage.set(T, n.voiceId), !0;
      } catch {
        return !1;
      }
    },
    async clear() {
      await Promise.allSettled([t?.delete(E), e.storage.delete(T)]);
    }
  };
}
function de(e = (...t) => fetch(...t)) {
  return async ({ url: t, headers: n, body: o }) => {
    const r = await e(t, {
      method: "POST",
      headers: n,
      body: o,
      cache: "no-store",
      // No cookies, no referrer: the request carries only what we set.
      credentials: "omit",
      referrerPolicy: "no-referrer",
      signal: AbortSignal.timeout(O)
    });
    return { status: r.status, contentType: r.headers.get("content-type") ?? "", bytes: new Uint8Array(await r.arrayBuffer()) };
  };
}
const O = 15e3;
function Q(e, t = O) {
  return async ({ url: n, headers: o, body: r }) => {
    let b;
    const d = new Promise((c, l) => {
      b = setTimeout(() => l(new Error("Voice request timed out.")), t);
    }), s = await Promise.race([e(n, {
      httpMethod: "POST",
      body: r,
      responseType: "base64",
      headers: Object.entries(o).map(([c, l]) => ({ name: c, value: l }))
    }), d]).finally(() => clearTimeout(b));
    if (s.bodyEncoding !== "base64") throw new Error("This Agent Code build cannot return binary responses.");
    const p = H(s.body);
    if (!p) throw new Error("The host returned an invalid body.");
    return { status: s.status, contentType: s.contentType, bytes: p };
  };
}
const W = `
html,body{margin:0;width:1600px;height:1000px;overflow:hidden}
#app{width:1600px;height:1000px}
`, A = (e, t, n) => {
  const o = new Date(n), r = String(o.getMilliseconds()).padStart(3, "0");
  return `${C(e, t)} · live ${o.toLocaleTimeString()}.${r}`;
}, Z = x.slice(x.indexOf("<main"), x.indexOf("</main>") + 7), pe = V({
  mount(e, t) {
    const n = document.createElement("style");
    n.textContent = B + P + D + W, document.head.append(n), e.innerHTML = Z, document.body.classList.add("poker-preview");
    const o = document.createElement("section");
    o.className = "panel-scrim", o.style.position = "absolute", o.style.zIndex = "40", o.innerHTML = `
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
        <p class="small">Practice chips only · trusted local network only.</p>
      </aside>`, e.querySelector("#entry")?.append(o);
    const b = o.querySelector("#lan-error"), d = document.createElement("p");
    d.id = "lan-share", d.setAttribute("role", "status"), d.style.color = "#c1db9c";
    const s = (a) => {
      d.isConnected || o.querySelector(".side-panel").append(d), d.textContent = a;
    }, p = t.api.services, c = t.api.net;
    let l = !1, y = !1;
    const g = async (a) => {
      const i = await import("./client-C0iYxuSZ.js");
      i.setVoiceEnvironment({
        store: X(t.api),
        http: Q(c ? (u, h) => c.fetch(u, h) : async () => {
          throw new Error("This Agent Code build does not support brokered fetch.");
        })
      }), i.setApiTransport(a);
    }, S = async (a, i, u) => {
      if (y) {
        s(A(a, i, u));
        return;
      }
      y = !0, l = !0;
      try {
        s(A(a, i, u)), await g(I()), o.hidden = !0, l = !1;
      } catch (h) {
        l = !1, y = !1, f(h instanceof Error ? h.message : String(h));
      }
    }, L = (a) => Array.isArray(a.urls) ? a.urls.filter((i) => typeof i == "string" && /^http:\/\/\d{1,3}(?:\.\d{1,3}){3}:\d{1,5}$/.test(i)) : [], m = t.runtime.state();
    m?.running && m.port && S(L(m), m.port, m.at ?? Date.now());
    const R = t.runtime.subscribe((a) => {
      const i = a;
      i?.running && i.port && S(L(i), i.port, i.at ?? Date.now());
    }), f = (a) => {
      b.textContent = a;
    };
    async function N(a, i) {
      if (!l) {
        l = !0;
        try {
          await a(), o.hidden = !0;
        } catch (u) {
          l = !1, f(u instanceof Error ? u.message : String(u));
        }
      }
    }
    return o.querySelector("#lan-host").addEventListener("click", () => {
      if (!p) {
        f("This Agent Code build does not support extension services.");
        return;
      }
      l || (l = !0, b.textContent = "Starting LAN host…", (async () => {
        try {
          await p.start(v);
          const a = await p.expose(v, !0);
          if (!a.lan || !a.port) throw new Error("LAN exposure was not granted.");
          const i = z(await p.invoke(v, "status"), a.port);
          await g(I()), o.hidden = !0, s(`${C(i, a.port)} — then use Create table below.`);
        } catch (a) {
          l = !1, f(a instanceof Error ? a.message : String(a));
        }
      })());
    }), o.querySelector("#lan-join").addEventListener("submit", (a) => {
      if (a.preventDefault(), !c) {
        f("This Agent Code build does not support brokered fetch.");
        return;
      }
      const i = o.querySelector("#lan-address");
      let u;
      try {
        u = U(i.value);
      } catch (h) {
        f(h instanceof Error ? h.message : "Invalid host address.");
        return;
      }
      N(async () => {
        await g(M(c, u));
      });
    }), () => {
      R(), o.remove(), n.remove();
    };
  }
});
export {
  ae as M,
  ne as V,
  H as a,
  re as b,
  le as c,
  se as d,
  ie as e,
  de as f,
  pe as g,
  q as l,
  _ as n
};
