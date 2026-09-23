import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { sep } from 'node:path'

import { defineService, runService } from 'agent-code-extension-api'

import { lanAddresses, startLanHost } from './http'

/**
 * The in-extension LAN host service entry. The standalone CLI (server/main.ts)
 * and this entry share one HTTP owner (startLanHost); only the lifecycle shell
 * differs — utilityProcess + the SDK service contract instead of argv + SIGINT.
 *
 * Binding policy: loopback, OS-chosen port. Nothing here binds the LAN itself;
 * when the player shares the table, the Agent Code host's net.listen exposure
 * decides reachability and closes with this process. The bundled website still
 * serves guests' browsers through that host-owned listener.
 */

/** Checkpoints must live OUTSIDE the hashed bundle directory — any write inside
 *  it changes the bundle hash and silently revokes every granted capability.
 *  Installed layout: <extensions>/<id>/<generation>/dist-service/ → checkpoint
 *  at <id>/.poker-lan (survives app restarts, dies with the extension). Repo
 *  layout falls back to the same .poker-lan the CLI uses. */
// ESM bundle (.mjs): import.meta.url is native and always a real file URL —
// the earlier CJS build needed a banner shim for this, which the host's
// .js/.mjs-only entry schema rejected anyway.
function entryDirectory(): string {
  return dirname(fileURLToPath(import.meta.url))
}
function checkpointDirectory(): string {
  const here = entryDirectory()
  if (here.includes(`${sep}extensions${sep}`)) return resolve(here, '../../..', '.poker-lan')
  return resolve(here, '../.poker-lan')
}

type Host = Awaited<ReturnType<typeof startLanHost>>
let host: Host | null = null

export const lanHostService = defineService({
  async start(context) {
    host = await startLanHost({ port: 0, lan: false, checkpointDirectory: checkpointDirectory() })
    // `lanAddresses` feeds the share line. The sandboxed view has no API to
    // enumerate interfaces; this process does. It is read per request, not
    // captured at start, because the laptop may change Wi-Fi mid-session. The
    // port is NOT ours to report: guests dial the host-owned listener, whose
    // port only expose() returns to the caller.
    context.onRequest('status', () => ({ origin: host!.origin, lanAddresses: lanAddresses() }))
    context.ready([{ name: 'http', port: Number(new URL(host.origin).port) }])
  },
  async stop() {
    // The runtime's shutdown path awaits this; the HTTP owner closes sockets,
    // flushes the durable checkpoint and releases the ownership lease.
    await host?.close()
    host = null
  },
})

// Dual-natured file on purpose: the esbuild bundle for dist-service/lan-host.js
// uses this module AS the entry (runService wires process.parentPort), while
// tests import lanHostService directly without a parent port.
if (process.env.AGENT_CODE_POKER_SERVICE_ENTRY !== '0') runService(lanHostService)
