import { defineRuntime, type ExtensionServiceHandle, type JsonValue } from 'agent-code-extension-api'

import { SERVICE_ID } from '../server/client/inAppTransport'

// A table belongs to its visible document. No opponent should spend chips while
// the room is closed. The view persists decisions and restores a paused table.
//
// host-lan is the one runtime capability: start the declared LAN service,
// expose it through the host-owned listener, and publish live state so the LAN
// view (and the Electron frame harness) can observe it. Hosting stays
// user-initiated — palette command or the view's Host button; nothing
// auto-starts a native process. Re-running the command joins the running
// service (idempotent start) and the heartbeat simply continues.
//
// The heartbeat (900ms republish) is not decorative: a runtime that published
// only once could not prove to a mounted view that it is still alive, and the
// host's frame harness asserts exactly that — state must ADVANCE while no view
// is attached. `at` is the observable; `port` is the product payload.

type LanHostState = { running: true; port: number; at: number }

const HEARTBEAT_MS = 900

export default defineRuntime({
  activate(context) {
    context.registerCommand('agent-code-poker.host-lan', async () => {
      const services = (context.api as {
        services?: {
          start(id: string): Promise<ExtensionServiceHandle>
          expose(id: string, lan: boolean): Promise<{ lan: boolean; port?: number }>
        }
      }).services
      if (!services) throw new Error('This Agent Code build does not support extension services.')
      const started = await services.start(SERVICE_ID)
      const exposure = await services.expose(SERVICE_ID, true)
      if (!exposure.lan || !exposure.port) throw new Error('LAN exposure was not granted by the host.')
      // Loopback endpoint is diagnostics-only; friends use the host-owned LAN
      // listener. Both exist by the time expose() resolved.
      void started.endpoints
      const publish = () => {
        const state: LanHostState = { running: true, port: exposure.port!, at: Date.now() }
        return context.views.publish('agent-code-poker.lan', state as JsonValue)
      }
      await publish()
      // One heartbeat per runtime lifetime, not per command run: duplicates
      // would multiply publications; the guard keeps replays idempotent.
      if (!heartbeat) {
        heartbeat = setInterval(() => { void publish() }, HEARTBEAT_MS)
        context.subscriptions.push({ dispose() { if (heartbeat) { clearInterval(heartbeat); heartbeat = null } } })
      }
      return { port: exposure.port }
    })
  },
})

let heartbeat: ReturnType<typeof setInterval> | null = null
