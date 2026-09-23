const p = "agent-code-poker.lan-host";
function h() {
  return async ({ path: n, method: r, headers: s, body: t }) => {
    const e = await fetch(`./__service/${p}${n}`, {
      method: r,
      headers: s,
      body: t,
      cache: "no-store"
    });
    return { ok: e.ok, status: e.status, json: () => e.json() };
  };
}
function d(n, r) {
  const s = new URL(r).origin;
  return async ({ path: t, method: e, headers: c, body: i }) => {
    if (!t.startsWith("/")) throw new Error("Invalid service path.");
    const a = await n(`${s}${t}`, {
      httpMethod: e,
      // WHY THE GUEST STATES ITS ORIGIN: the host's POST rule is "Origin must
      // name the address you dialed" (server/http.ts). A browser adds that
      // header itself; Agent Code's brokered fetch runs in the host app's main
      // process and adds none, so every guest POST got a 403. The value is the
      // literal origin this adapter dials, which is exactly what a browser on
      // that page would send, so the host's rule is satisfied honestly and not
      // bypassed. It works the same against the standalone CLI host and an
      // in-extension host (whose listener forwards it with the dialed Host).
      headers: [
        ...Object.entries(c).filter(([o]) => o.toLowerCase() !== "origin").map(([o, u]) => ({ name: o, value: u })),
        { name: "Origin", value: s }
      ],
      ...i === void 0 ? {} : { body: i }
    });
    return {
      ok: a.status >= 200 && a.status < 300,
      status: a.status,
      // The broker returns text; the client expects response.json(). The poker
      // host answers JSON on every route (errors included), so parsing here
      // preserves the client's existing error envelope handling exactly.
      json: async () => JSON.parse(a.body)
    };
  };
}
function l(n, r) {
  const s = n?.lanAddresses;
  return Array.isArray(s) ? s.filter((t) => typeof t == "string" && /^\d{1,3}(?:\.\d{1,3}){3}$/.test(t)).map((t) => `http://${t}:${r}`) : [];
}
function f(n, r) {
  return n.length > 0 ? `Friends join at ${n.join(" or ")}` : `Friends join at http://<this-computer’s-Wi-Fi-IP>:${r} (no private network address found)`;
}
export {
  p as S,
  f as a,
  l,
  d as n,
  h as p
};
