import { d as O } from "./runtime-XLX8az2X.js";
import { s as N } from "./styles-DJYLcAU6.js";
import { S as L, p as T, n as V } from "./inAppTransport-CvkJA9Og.js";
const v = `<!doctype html>
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
`, P = "html:has(body.poker-preview),body.poker-preview{margin:0;width:100%;height:100%;background:#08090b;overflow:hidden}body.poker-preview #root{width:100%;height:100dvh}body.poker-preview .poker{width:100%;height:100dvh;border-radius:0}body.poker-preview .poker .room{height:100%}body.poker-preview .header{padding-right:70px}body.poker-preview .betting-controls{max-width:760px;margin-left:auto}body.poker-preview .your-hand{width:330px}.preview-fullscreen{position:fixed;z-index:40;top:12px;right:22px;width:31px;height:31px;display:grid;place-items:center;padding:0;background:#131414b0;border:1px solid #a2917030;border-radius:4px;color:#b7aa94;font:24px/1 sans-serif;cursor:pointer}.preview-fullscreen:hover{background:#50453388}.preview-fullscreen:focus-visible{outline:2px solid #c9ad80;outline-offset:3px}.preview-fullscreen-status{position:fixed;z-index:50;right:20px;top:60px;max-width:320px;color:#e4d7bf;background:#24221e;font:12px/1.5 sans-serif;border-radius:4px}.preview-fullscreen-status:not(:empty){padding:12px 16px;border:1px solid #b9a07866}body.poker-preview .website-multiplayer{display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;margin:10px 0 0 12px;border:1px solid #b9a07880;border-radius:4px;color:#e7d8ba;background:#151a15d9;text-decoration:none;font:500 14px/1.4 sans-serif}body.poker-preview .website-multiplayer:hover{background:#3c3b2b}body.poker-preview .website-multiplayer:focus-visible{outline:2px solid #e6c795;outline-offset:4px}@media(min-width:1400px){body.poker-preview .action-deck,body.poker-preview .table-strip{padding-left:4vw;padding-right:4vw}}@media(max-width:850px){body.poker-preview .header-location{display:none}body.poker-preview .header-tools{margin-left:auto}body.poker-preview .your-hand{width:250px;gap:12px}body.poker-preview .action-deck{gap:16px;padding-left:16px;padding-right:16px}body.poker-preview .bet-presets button{padding:6px 8px}body.poker-preview .table-strip{gap:10px}}", z = '[hidden]{display:none!important}#header,#hud,#table-info,#leisure,.lan-leisure{display:contents}.lan-admission{max-height:calc(100dvh - 100px);overflow:auto;max-width:680px;margin:0 auto;padding:20px!important;background:#111414cf;border:1px solid #b9a07835;border-radius:6px}.admission-fields{display:flex;justify-content:center;gap:14px;flex-wrap:wrap}.admission-fields label{display:grid;gap:7px;text-align:left;font-size:11px}.admission-fields input,#saved-seats{font:inherit;padding:10px;border:1px solid #786b5355;border-radius:4px;background:#171a17;color:#e7dcc8}.row{display:flex;flex-wrap:wrap;gap:10px}.lan-admission .row{justify-content:center;margin:12px 0}.remember{display:flex;justify-content:center;align-items:center;gap:8px;margin:14px 0;font-size:11px;color:#b3a997}.remember input{width:16px;height:16px}.small{font-size:11px;line-height:1.6}#recovery{margin:16px 0;border-top:1px solid #b9a07835;padding-top:14px}#error:empty,#storage-warning:empty{display:none}#storage-warning{position:absolute;top:110px;left:20px;right:20px;z-index:12;background:#282314f2;color:#f1dda9;padding:10px;font-size:12px}#forget{position:absolute;top:160px;left:20px;z-index:13}#menu ol{padding-left:20px}#menu li{padding:5px 0;font-size:12px}.chat-bubble{position:absolute;left:50%;bottom:calc(100% + 9px);transform:translate(-50%);width:max-content;max-width:220px;padding:7px 10px;border-radius:10px;background:#f1e6cdf2;color:#1b1a16;font-size:12px;line-height:1.35;text-align:left;overflow-wrap:anywhere;box-shadow:0 4px 14px #0006}.chat-bubble:after{content:"";position:absolute;left:50%;top:100%;transform:translate(-50%);border:6px solid transparent;border-top-color:#f1e6cdf2}.chat-bubble.start{left:0;transform:none}.chat-bubble.start:after{left:22px}.chat-bubble.end{left:auto;right:0;transform:none}.chat-bubble.end:after{left:auto;right:10px;transform:none}.lan-chat{position:absolute;left:18px;bottom:150px;z-index:8;width:min(360px,calc(100% - 36px));display:grid;gap:6px}.lan-chat-log ol{list-style:none;margin:0;padding:0;display:grid;gap:3px}.lan-chat-log li{font-size:12px;line-height:1.4;color:#e6dcc5;background:#11141299;padding:3px 8px;border-radius:3px;overflow-wrap:anywhere}.lan-chat-log b{color:#d8b77e;font-weight:600;margin-right:4px}.lan-chat-status{margin:0;font-size:11px;color:#f1dda9}.lan-chat-input{display:grid;gap:4px;background:#111414e6;border:1px solid #b9a07855;border-radius:4px;padding:8px}.lan-chat-input label{display:flex;gap:8px;align-items:center;font-size:11px}.lan-chat-input input,.lan-voice-settings input{flex:1;font:inherit;padding:8px;border:1px solid #786b5355;border-radius:4px;background:#171a17;color:#e7dcc8}.lan-features,.lan-voice-settings{border-top:1px solid #b9a07835;margin-top:12px;padding-top:10px;display:grid;gap:8px}.lan-features label,.lan-voice-settings label{display:grid;gap:5px;font-size:12px}.lan-voice-settings h3{margin:0;font-size:13px}.lan-no-treats [aria-labelledby=drink-section-curiosities]{display:none}';
function B(e) {
  const t = e.trim(), o = /^http:\/\/(localhost|(?:\d{1,3}\.){3}\d{1,3})(?::([1-9]\d{0,4}))?\/?$/.exec(t), n = () => new Error("Paste the host’s printed http:// private IPv4 address and port, without a path, code or password.");
  if (!o) throw n();
  const [, a, c] = o;
  if (c && Number(c) > 65535) throw n();
  if (a !== "localhost") {
    const l = a.split(".");
    if (l.some((u) => String(Number(u)) !== u || Number(u) > 255)) throw n();
    const [d, b] = l.map(Number);
    if (!(d === 127 || d === 10 || d === 192 && b === 168 || d === 172 && b >= 16 && b <= 31)) throw n();
  }
  return new URL(t).origin + "/";
}
const ee = "audio/mpeg", te = 96 * 1024;
function M(e) {
  if (e.length < 4) return !1;
  if (e[0] === 73 && e[1] === 68 && e[2] === 51) return e[3] >= 2 && e[3] <= 4;
  if (e[0] !== 255 || (e[1] & 224) !== 224) return !1;
  const t = e[1] >> 3 & 3, o = e[1] >> 1 & 3, n = e[2] >> 4, a = e[2] >> 2 & 3;
  return t !== 1 && o !== 0 && n !== 15 && a !== 3;
}
function oe(e) {
  let t = "";
  for (let o = 0; o < e.length; o += 32768) t += String.fromCharCode(...e.subarray(o, o + 32768));
  return btoa(t);
}
function D(e) {
  if (typeof e != "string" || e.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(e)) return null;
  try {
    const t = atob(e), o = new Uint8Array(t.length);
    for (let n = 0; n < t.length; n++) o[n] = t.charCodeAt(n);
    return o;
  } catch {
    return null;
  }
}
const j = "https://api.elevenlabs.io", q = "mp3_22050_32", H = "eleven_flash_v2_5", ne = {
  "not-configured": "Add your ElevenLabs API key and voice ID in the table menu to speak.",
  "invalid-key": "ElevenLabs refused the API key. Check it in the table menu.",
  quota: "Your ElevenLabs quota is used up. Messages stay text-only.",
  "voice-not-found": "ElevenLabs did not recognise that voice ID.",
  busy: "ElevenLabs is busy. This message stays text-only.",
  network: "Could not reach ElevenLabs. This message stays text-only.",
  "invalid-response": "ElevenLabs returned something that is not audio.",
  failed: "ElevenLabs could not speak this message."
}, U = /^[A-Za-z0-9]{8,64}$/, K = /^[\x21-\x7e]{8,256}$/;
function A(e) {
  const t = typeof e.apiKey == "string" ? e.apiKey.trim() : "", o = typeof e.voiceId == "string" ? e.voiceId.trim() : "";
  return K.test(t) && U.test(o) ? { apiKey: t, voiceId: o } : null;
}
const F = 512 * 1024;
function $(e, t) {
  let o = "";
  try {
    const n = JSON.parse(new TextDecoder().decode(t.subarray(0, 4096)));
    typeof n?.detail?.status == "string" && (o = n.detail.status);
  } catch {
  }
  return o === "quota_exceeded" || e === 402 ? "quota" : o === "invalid_api_key" || o === "needs_authorization" || e === 401 ? "invalid-key" : o === "voice_not_found" || o === "invalid_uid" || e === 404 ? "voice-not-found" : e === 429 || o === "too_many_concurrent_requests" || o === "system_busy" ? "busy" : "failed";
}
function ae(e, t) {
  return {
    async synthesize(o) {
      const n = e();
      if (!n) return { ok: !1, reason: "not-configured" };
      let a;
      try {
        a = await t({
          // voiceId passed VOICE_ID, so it cannot add a path segment or query.
          url: `${j}/v1/text-to-speech/${n.voiceId}?output_format=${q}`,
          headers: { "xi-api-key": n.apiKey, "content-type": "application/json", accept: "audio/mpeg" },
          body: JSON.stringify({ text: o, model_id: H })
        });
      } catch {
        return { ok: !1, reason: "network" };
      }
      return a.status < 200 || a.status >= 300 ? { ok: !1, reason: $(a.status, a.bytes) } : a.bytes.length > F || !M(a.bytes) ? { ok: !1, reason: "invalid-response" } : { ok: !0, audio: a.bytes };
    }
  };
}
const x = "poker-lan-elevenlabs-key", w = "poker-lan-elevenlabs-voice";
function re(e) {
  return {
    where: "Saved in this browser’s local storage on this computer only. It is never sent to the table host or other players. Use Forget before sharing this browser.",
    async load() {
      try {
        return A({ apiKey: e().getItem(x), voiceId: e().getItem(w) });
      } catch {
        return null;
      }
    },
    async save(t) {
      try {
        return e().setItem(x, t.apiKey), e().setItem(w, t.voiceId), !0;
      } catch {
        return !1;
      }
    },
    async clear() {
      try {
        e().removeItem(x), e().removeItem(w);
      } catch {
      }
    }
  };
}
const k = "elevenlabs.apiKey", E = "lan.elevenlabsVoiceId";
function Y(e) {
  const t = e.secrets;
  return {
    where: t ? "Your key is encrypted by Agent Code with this computer’s keychain and readable only by this extension. It is never sent to the table host or other players." : "This Agent Code build has no secret storage. Update Agent Code to save a key; voices stay text-only until then.",
    async load() {
      if (!t) return null;
      try {
        return A({ apiKey: await t.get(k), voiceId: await e.storage.get(E) });
      } catch {
        return null;
      }
    },
    async save(o) {
      if (!t) return !1;
      try {
        return await t.set(k, o.apiKey), await e.storage.set(E, o.voiceId), !0;
      } catch {
        return !1;
      }
    },
    async clear() {
      await Promise.allSettled([t?.delete(k), e.storage.delete(E)]);
    }
  };
}
function ie(e = (...t) => fetch(...t)) {
  return async ({ url: t, headers: o, body: n }) => {
    const a = await e(t, {
      method: "POST",
      headers: o,
      body: n,
      cache: "no-store",
      // No cookies, no referrer: the request carries only what we set.
      credentials: "omit",
      referrerPolicy: "no-referrer",
      signal: AbortSignal.timeout(15e3)
    });
    return { status: a.status, contentType: a.headers.get("content-type") ?? "", bytes: new Uint8Array(await a.arrayBuffer()) };
  };
}
function G(e) {
  return async ({ url: t, headers: o, body: n }) => {
    const a = await e(t, {
      httpMethod: "POST",
      body: n,
      responseType: "base64",
      headers: Object.entries(o).map(([l, d]) => ({ name: l, value: d }))
    });
    if (a.bodyEncoding !== "base64") throw new Error("This Agent Code build cannot return binary responses.");
    const c = D(a.body);
    if (!c) throw new Error("The host returned an invalid body.");
    return { status: a.status, contentType: a.contentType, bytes: c };
  };
}
const J = `
html,body{margin:0;width:1600px;height:1000px;overflow:hidden}
#app{width:1600px;height:1000px}
`, I = (e, t) => {
  const o = new Date(t), n = String(o.getMilliseconds()).padStart(3, "0");
  return `Friends join at http://<this-computer’s-Wi-Fi-IP>:${e} · live ${o.toLocaleTimeString()}.${n}`;
}, W = v.slice(v.indexOf("<main"), v.indexOf("</main>") + 7), se = O({
  mount(e, t) {
    const o = document.createElement("style");
    o.textContent = P + N + z + J, document.head.append(o), e.innerHTML = W, document.body.classList.add("poker-preview");
    const n = document.createElement("section");
    n.className = "panel-scrim", n.style.position = "absolute", n.style.zIndex = "40", n.innerHTML = `
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
      </aside>`, e.querySelector("#entry")?.append(n);
    const c = n.querySelector("#lan-error"), l = document.createElement("p");
    l.id = "lan-share", l.setAttribute("role", "status"), l.style.color = "#c1db9c";
    const d = (r) => {
      l.isConnected || n.querySelector(".side-panel").append(l), l.textContent = r;
    }, b = t.api.services, u = t.api.net;
    let p = !1, y = !1;
    const g = async (r) => {
      const i = await import("./client-T-PPms0F.js");
      i.setVoiceEnvironment({
        store: Y(t.api),
        http: G(u ? (s, f) => u.fetch(s, f) : async () => {
          throw new Error("This Agent Code build does not support brokered fetch.");
        })
      }), i.setApiTransport(r);
    }, S = async (r, i) => {
      if (y) {
        d(I(r, i));
        return;
      }
      y = !0, p = !0;
      try {
        d(I(r, i)), await g(T()), n.hidden = !0, p = !1;
      } catch (s) {
        p = !1, y = !1, h(s instanceof Error ? s.message : String(s));
      }
    }, m = t.runtime.state();
    m?.running && m.port && S(m.port, m.at ?? Date.now());
    const C = t.runtime.subscribe((r) => {
      const i = r;
      i?.running && i.port && S(i.port, i.at ?? Date.now());
    }), h = (r) => {
      c.textContent = r;
    };
    async function _(r, i) {
      if (!p) {
        p = !0;
        try {
          await r(), n.hidden = !0;
        } catch (s) {
          p = !1, h(s instanceof Error ? s.message : String(s));
        }
      }
    }
    return n.querySelector("#lan-host").addEventListener("click", () => {
      if (!b) {
        h("This Agent Code build does not support extension services.");
        return;
      }
      p || (p = !0, c.textContent = "Starting LAN host…", (async () => {
        try {
          await b.start(L);
          const r = await b.expose(L, !0);
          if (!r.lan || !r.port) throw new Error("LAN exposure was not granted.");
          await g(T()), n.hidden = !0, d(`Friends join at http://<this-computer’s-Wi-Fi-IP>:${r.port} — then use Create table below.`);
        } catch (r) {
          p = !1, h(r instanceof Error ? r.message : String(r));
        }
      })());
    }), n.querySelector("#lan-join").addEventListener("submit", (r) => {
      if (r.preventDefault(), !u) {
        h("This Agent Code build does not support brokered fetch.");
        return;
      }
      const i = n.querySelector("#lan-address");
      let s;
      try {
        s = B(i.value);
      } catch (f) {
        h(f instanceof Error ? f.message : "Invalid host address.");
        return;
      }
      _(async () => {
        await g(V((f, R) => u.fetch(f, R), s));
      });
    }), () => {
      C(), n.remove(), o.remove();
    };
  }
});
export {
  te as M,
  ee as V,
  D as a,
  oe as b,
  re as c,
  ae as d,
  ne as e,
  ie as f,
  se as g,
  M as l,
  A as n
};
