const p = "agent-code-poker.lan-host";
function f() {
  return async ({ path: r, method: n, headers: s, body: t }) => {
    const e = await fetch(`./__service/${p}${r}`, {
      method: n,
      headers: s,
      body: t,
      cache: "no-store"
    });
    return { ok: e.ok, status: e.status, json: () => e.json() };
  };
}
function h(r, n) {
  const s = new URL(n).origin;
  return async ({ path: t, method: e, headers: c, body: i }) => {
    if (!t.startsWith("/")) throw new Error("Invalid service path.");
    const o = await r(`${s}${t}`, {
      // WHY BOTH VERB FIELDS: the SDK 0.9 type names the verb `httpMethod`, but
      // the host's frame and runtime bridges on agent-code origin/main
      // (frameDocument.ts, runtimeDocument.ts) read `init.method`. An
      // SDK-shaped POST therefore left as a GET, carrying a body that fetch
      // refuses. agent-code#1151 reads `httpMethod || method`. Sending both
      // makes guest POSTs correct on hosts before AND after that fix, so in-app
      // guests don't wait on it. Drop `method` once every supported host reads
      // `httpMethod`.
      httpMethod: e,
      method: e,
      // WHY THE GUEST STATES ITS ORIGIN: the host's POST rule is "Origin must
      // name the address you dialed" (server/http.ts). A browser adds that
      // header itself; Agent Code's brokered fetch runs in the host app's main
      // process and adds none, so every guest POST got a 403. The value is the
      // literal origin this adapter dials, which is exactly what a browser on
      // that page would send, so the host's rule is satisfied honestly and not
      // bypassed. It works the same against the standalone CLI host and an
      // in-extension host (whose listener forwards it with the dialed Host).
      headers: [
        ...Object.entries(c).filter(([a]) => a.toLowerCase() !== "origin").map(([a, u]) => ({ name: a, value: u })),
        { name: "Origin", value: s }
      ],
      ...i === void 0 ? {} : { body: i }
    });
    return {
      ok: o.status >= 200 && o.status < 300,
      status: o.status,
      // The broker returns text; the client expects response.json(). The poker
      // host answers JSON on every route (errors included), so parsing here
      // preserves the client's existing error envelope handling exactly.
      json: async () => JSON.parse(o.body)
    };
  };
}
function d(r, n) {
  return h((s, t) => r.fetch(s, t), n);
}
function l(r, n) {
  const s = r?.lanAddresses;
  return Array.isArray(s) ? s.filter((t) => typeof t == "string" && /^\d{1,3}(?:\.\d{1,3}){3}$/.test(t)).map((t) => `http://${t}:${n}`) : [];
}
function $(r, n) {
  return r.length > 0 ? `Friends join at ${r.join(" or ")}` : `Friends join at http://<this-computer’s-Wi-Fi-IP>:${n} (no private network address found)`;
}
export {
  p as S,
  $ as a,
  d as b,
  l,
  f as p
};
