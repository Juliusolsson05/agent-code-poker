import { d as P } from "./runtime-XLX8az2X.js";
import { s as z } from "./styles-DJYLcAU6.js";
import { S as g, l as q, p as S, a as C, b as M } from "./inAppTransport-z84GxgS3.js";
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
  const o = e.trim(), n = /^http:\/\/(localhost|(?:\d{1,3}\.){3}\d{1,3})(?::([1-9]\d{0,4}))?\/?$/.exec(o), t = () => new Error("Paste the host’s printed http:// private IPv4 address and port, without a path, code or password.");
  if (!n) throw t();
  const [, a, b] = n;
  if (b && Number(b) > 65535) throw t();
  if (a !== "localhost") {
    const d = a.split(".");
    if (d.some((c) => String(Number(c)) !== c || Number(c) > 255)) throw t();
    const [s, p] = d.map(Number);
    if (!(s === 127 || s === 10 || s === 192 && p === 168 || s === 172 && p >= 16 && p <= 31)) throw t();
  }
  return new URL(o).origin + "/";
}
const ie = "audio/mpeg", ae = 96 * 1024;
function j(e) {
  if (e.length < 4) return !1;
  if (e[0] === 73 && e[1] === 68 && e[2] === 51) return e[3] >= 2 && e[3] <= 4;
  if (e[0] !== 255 || (e[1] & 224) !== 224) return !1;
  const o = e[1] >> 3 & 3, n = e[1] >> 1 & 3, t = e[2] >> 4, a = e[2] >> 2 & 3;
  return o !== 1 && n !== 0 && t !== 15 && a !== 3;
}
function re(e) {
  let o = "";
  for (let n = 0; n < e.length; n += 32768) o += String.fromCharCode(...e.subarray(n, n + 32768));
  return btoa(o);
}
function H(e) {
  if (typeof e != "string" || e.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(e)) return null;
  try {
    const o = atob(e), n = new Uint8Array(o.length);
    for (let t = 0; t < o.length; t++) n[t] = o.charCodeAt(t);
    return n;
  } catch {
    return null;
  }
}
const K = "https://api.elevenlabs.io", $ = "mp3_22050_32", Y = "eleven_flash_v2_5", se = {
  "not-configured": "Add your ElevenLabs API key and voice ID in the table menu to speak.",
  "invalid-key": "ElevenLabs does not recognise this API key. Check it in the table menu.",
  "missing-permissions": "Your ElevenLabs key lacks Text to Speech permission. Enable it for this key in ElevenLabs → API keys.",
  "unusual-activity": "ElevenLabs blocked this account for unusual activity. This is common on free plans behind a VPN or proxy: turn it off, or use a paid plan.",
  plan: "Your ElevenLabs plan does not include this voice or model. Pick a voice you own, or upgrade the plan.",
  quota: "Your ElevenLabs quota is used up. Messages stay text-only.",
  "voice-not-found": "ElevenLabs did not recognise that voice ID.",
  busy: "ElevenLabs is busy. This message stays text-only.",
  refused: "ElevenLabs refused this request for a reason this table does not recognise. Check the key’s permissions and plan in ElevenLabs.",
  network: "Could not reach ElevenLabs. This message stays text-only.",
  "invalid-response": "ElevenLabs returned something that is not audio.",
  failed: "ElevenLabs could not speak this message."
}, G = /^[A-Za-z0-9]{8,64}$/, F = /^[\x21-\x7e]{8,256}$/;
function O(e) {
  const o = typeof e.apiKey == "string" ? e.apiKey.trim() : "", n = typeof e.voiceId == "string" ? e.voiceId.trim() : "";
  return F.test(o) && G.test(n) ? { apiKey: o, voiceId: n } : null;
}
const J = 512 * 1024, I = {
  invalid_api_key: "invalid-key",
  missing_api_key: "invalid-key",
  needs_authorization: "invalid-key",
  invalid_authorization_header: "invalid-key",
  missing_permissions: "missing-permissions",
  insufficient_permissions: "missing-permissions",
  detected_unusual_activity: "unusual-activity",
  subscription_required: "plan",
  feature_not_available: "plan",
  voice_access_denied: "plan",
  model_access_denied: "plan",
  quota_exceeded: "quota",
  insufficient_credits: "quota",
  payment_required: "quota",
  voice_not_found: "voice-not-found",
  invalid_uid: "voice-not-found",
  invalid_voice_id: "voice-not-found",
  too_many_concurrent_requests: "busy",
  concurrent_limit_exceeded: "busy",
  rate_limit_exceeded: "busy",
  system_busy: "busy",
  service_unavailable: "busy",
  maintenance: "busy"
};
function X(e, o) {
  let n = {};
  try {
    const t = JSON.parse(new TextDecoder().decode(o.subarray(0, 4096)));
    t?.detail && typeof t.detail == "object" && (n = t.detail);
  } catch {
  }
  for (const t of [n.status, n.code])
    if (typeof t == "string" && Object.hasOwn(I, t)) return I[t];
  return e === 402 ? "quota" : e === 404 ? "voice-not-found" : e === 429 || e === 503 ? "busy" : e === 401 || e === 403 ? "refused" : "failed";
}
function le(e, o) {
  return {
    async synthesize(n) {
      const t = e();
      if (!t) return { ok: !1, reason: "not-configured" };
      let a;
      try {
        a = await o({
          // voiceId passed VOICE_ID, so it cannot add a path segment or query.
          url: `${K}/v1/text-to-speech/${t.voiceId}?output_format=${$}`,
          headers: { "xi-api-key": t.apiKey, "content-type": "application/json", accept: "audio/mpeg" },
          body: JSON.stringify({ text: n, model_id: Y })
        });
      } catch {
        return { ok: !1, reason: "network" };
      }
      return a.status < 200 || a.status >= 300 ? { ok: !1, reason: X(a.status, a.bytes) } : a.bytes.length > J || !j(a.bytes) ? { ok: !1, reason: "invalid-response" } : { ok: !0, audio: a.bytes };
    }
  };
}
const w = "poker-lan-elevenlabs-key", k = "poker-lan-elevenlabs-voice";
function de(e) {
  return {
    where: "Saved in this browser’s local storage on this computer only. It is never sent to the table host or other players. Use Forget before sharing this browser.",
    async load() {
      try {
        return O({ apiKey: e().getItem(w), voiceId: e().getItem(k) });
      } catch {
        return null;
      }
    },
    async save(o) {
      try {
        return e().setItem(w, o.apiKey), e().setItem(k, o.voiceId), !0;
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
const E = "elevenlabs.apiKey", _ = "lan.elevenlabsVoiceId";
function Q(e) {
  const o = e.secrets;
  return {
    where: o ? "Your key is encrypted by Agent Code with this computer’s keychain and readable only by this extension. It is never sent to the table host or other players." : "This Agent Code build has no secret storage. Update Agent Code to save a key; voices stay text-only until then.",
    async load() {
      if (!o) return null;
      try {
        return O({ apiKey: await o.get(E), voiceId: await e.storage.get(_) });
      } catch {
        return null;
      }
    },
    async save(n) {
      if (!o) return !1;
      try {
        return await o.set(E, n.apiKey), await e.storage.set(_, n.voiceId), !0;
      } catch {
        return !1;
      }
    },
    async clear() {
      await Promise.allSettled([o?.delete(E), e.storage.delete(_)]);
    }
  };
}
function pe(e = (...o) => fetch(...o)) {
  return async ({ url: o, headers: n, body: t }) => {
    const a = await e(o, {
      method: "POST",
      headers: n,
      body: t,
      cache: "no-store",
      // No cookies, no referrer: the request carries only what we set.
      credentials: "omit",
      referrerPolicy: "no-referrer",
      signal: AbortSignal.timeout(R)
    });
    return { status: a.status, contentType: a.headers.get("content-type") ?? "", bytes: new Uint8Array(await a.arrayBuffer()) };
  };
}
const R = 15e3;
function W(e, o = R) {
  return async ({ url: n, headers: t, body: a }) => {
    let b;
    const d = new Promise((c, l) => {
      b = setTimeout(() => l(new Error("Voice request timed out.")), o);
    }), s = await Promise.race([e(n, {
      httpMethod: "POST",
      body: a,
      responseType: "base64",
      headers: Object.entries(t).map(([c, l]) => ({ name: c, value: l }))
    }), d]).finally(() => clearTimeout(b));
    if (s.bodyEncoding !== "base64") throw new Error("This Agent Code build cannot return binary responses.");
    const p = H(s.body);
    if (!p) throw new Error("The host returned an invalid body.");
    return { status: s.status, contentType: s.contentType, bytes: p };
  };
}
const Z = `
html,body{margin:0;width:1600px;height:1000px;overflow:hidden}
#app{width:1600px;height:1000px}
`, A = (e, o, n) => {
  const t = new Date(n), a = String(t.getMilliseconds()).padStart(3, "0");
  return `${C(e, o)} · live ${t.toLocaleTimeString()}.${a}`;
}, ee = x.slice(x.indexOf("<main"), x.indexOf("</main>") + 7), ce = P({
  mount(e, o) {
    const n = document.createElement("style");
    n.textContent = B + z + D + Z, document.head.append(n), e.innerHTML = ee, document.body.classList.add("poker-preview");
    const t = document.createElement("section");
    t.className = "panel-scrim", t.style.position = "absolute", t.style.zIndex = "40", t.innerHTML = `
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
      </aside>`, e.querySelector("#entry")?.append(t);
    const b = t.querySelector("#lan-error"), d = document.createElement("p");
    d.id = "lan-share", d.setAttribute("role", "status"), d.style.color = "#c1db9c";
    const s = (i) => {
      d.isConnected || t.querySelector(".side-panel").append(d), d.textContent = i;
    }, p = o.api.services, c = o.api.net;
    let l = !1, y = !1;
    const v = async (i) => {
      const r = await import("./client-DqdyO20Q.js");
      r.setVoiceEnvironment({
        store: Q(o.api),
        http: W(c ? (u, h) => c.fetch(u, h) : async () => {
          throw new Error("This Agent Code build does not support brokered fetch.");
        })
      }), r.setApiTransport(i);
    }, T = async (i, r, u) => {
      if (y) {
        s(A(i, r, u));
        return;
      }
      y = !0, l = !0;
      try {
        s(A(i, r, u)), await v(S()), t.hidden = !0, l = !1;
      } catch (h) {
        l = !1, y = !1, f(h instanceof Error ? h.message : String(h));
      }
    }, L = (i) => Array.isArray(i.urls) ? i.urls.filter((r) => typeof r == "string" && /^http:\/\/\d{1,3}(?:\.\d{1,3}){3}:\d{1,5}$/.test(r)) : [], m = o.runtime.state();
    m?.running && m.port && T(L(m), m.port, m.at ?? Date.now());
    const N = o.runtime.subscribe((i) => {
      const r = i;
      r?.running && r.port && T(L(r), r.port, r.at ?? Date.now());
    }), f = (i) => {
      b.textContent = i;
    };
    async function V(i, r) {
      if (!l) {
        l = !0;
        try {
          await i(), t.hidden = !0;
        } catch (u) {
          l = !1, f(u instanceof Error ? u.message : String(u));
        }
      }
    }
    return t.querySelector("#lan-host").addEventListener("click", () => {
      if (!p) {
        f("This Agent Code build does not support extension services.");
        return;
      }
      l || (l = !0, b.textContent = "Starting LAN host…", (async () => {
        try {
          await p.start(g);
          const i = await p.expose(g, !0);
          if (!i.lan || !i.port) throw new Error("LAN exposure was not granted.");
          const r = q(await p.invoke(g, "status"), i.port);
          await v(S()), t.hidden = !0, s(`${C(r, i.port)} — then use Create table below.`);
        } catch (i) {
          l = !1, f(i instanceof Error ? i.message : String(i));
        }
      })());
    }), t.querySelector("#lan-join").addEventListener("submit", (i) => {
      if (i.preventDefault(), !c) {
        f("This Agent Code build does not support brokered fetch.");
        return;
      }
      const r = t.querySelector("#lan-address");
      let u;
      try {
        u = U(r.value);
      } catch (h) {
        f(h instanceof Error ? h.message : "Invalid host address.");
        return;
      }
      V(async () => {
        await v(M(c, u));
      });
    }), () => {
      N(), t.remove(), n.remove();
    };
  }
});
export {
  ae as M,
  ie as V,
  H as a,
  re as b,
  de as c,
  le as d,
  se as e,
  pe as f,
  ce as g,
  j as l,
  O as n
};
