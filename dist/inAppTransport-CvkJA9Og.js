const i = "agent-code-poker.lan-host";
function p() {
  return async ({ path: n, method: r, headers: s, body: a }) => {
    const t = await fetch(`./__service/${i}${n}`, {
      method: r,
      headers: s,
      body: a,
      cache: "no-store"
    });
    return { ok: t.ok, status: t.status, json: () => t.json() };
  };
}
function h(n, r) {
  return async ({ path: s, method: a, headers: t, body: o }) => {
    if (!s.startsWith("/")) throw new Error("Invalid service path.");
    const e = await n(`${r}${s}`, {
      httpMethod: a,
      headers: Object.entries(t).map(([c, u]) => ({ name: c, value: u })),
      ...o === void 0 ? {} : { body: o }
    });
    return {
      ok: e.status >= 200 && e.status < 300,
      status: e.status,
      // The broker returns text; the client expects response.json(). The poker
      // host answers JSON on every route (errors included), so parsing here
      // preserves the client's existing error envelope handling exactly.
      json: async () => JSON.parse(e.body)
    };
  };
}
export {
  i as S,
  h as n,
  p
};
