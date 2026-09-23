import { a as u } from "./runtime-XLX8az2X.js";
import { S as a, l as c } from "./inAppTransport-K7SvMopF.js";
const d = 900, w = u({
  activate(r) {
    r.registerCommand("agent-code-poker.host-lan", async () => {
      const s = r.api.services;
      if (!s) throw new Error("This Agent Code build does not support extension services.");
      const l = await s.start(a), t = await s.expose(a, !0);
      if (!t.lan || !t.port) throw new Error("LAN exposure was not granted by the host.");
      l.endpoints;
      const n = c(await s.invoke(a, "status"), t.port);
      o = { port: t.port, urls: n };
      const i = () => {
        if (!o) return Promise.resolve();
        const p = { running: !0, port: o.port, at: Date.now(), urls: o.urls };
        return r.views.publish("agent-code-poker.lan", p);
      };
      return await i(), e || (e = setInterval(() => {
        i();
      }, d), r.subscriptions.push({ dispose() {
        e && (clearInterval(e), e = null);
      } })), { port: t.port, urls: n };
    });
  }
});
let e = null, o = null;
export {
  w as default
};
