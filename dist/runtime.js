import { a as p } from "./runtime-XLX8az2X.js";
import { S as n } from "./inAppTransport-CvkJA9Og.js";
const u = 900, c = p({
  activate(e) {
    e.registerCommand("agent-code-poker.host-lan", async () => {
      const s = e.api.services;
      if (!s) throw new Error("This Agent Code build does not support extension services.");
      const a = await s.start(n), r = await s.expose(n, !0);
      if (!r.lan || !r.port) throw new Error("LAN exposure was not granted by the host.");
      a.endpoints;
      const o = () => {
        const i = { running: !0, port: r.port, at: Date.now() };
        return e.views.publish("agent-code-poker.lan", i);
      };
      return await o(), t || (t = setInterval(() => {
        o();
      }, u), e.subscriptions.push({ dispose() {
        t && (clearInterval(t), t = null);
      } })), { port: r.port };
    });
  }
});
let t = null;
export {
  c as default
};
