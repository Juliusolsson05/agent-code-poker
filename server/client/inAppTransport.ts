/** The declared service id from agent-code.extension.json. One constant shared
 *  by the view, the proxy path and tests — a mismatch fails silently (404
 *  proxy responses), so it must not be retyped anywhere. */
export const SERVICE_ID = 'agent-code-poker.lan-host'

/** What the LAN client's api() hands a transport for every call. */
export type TransportCall = {
  path: string
  method: 'GET' | 'POST'
  headers: Record<string, string>
  body: string | undefined
}

/** The minimal Response surface the client consumes. */
export type TransportResponse = {
  ok: boolean
  status: number
  json(): Promise<unknown>
}

export type LanTransport = (call: TransportCall) => Promise<TransportResponse>

/**
 * Hosting adapter: route the client's calls onto this extension's own origin,
 * where the Agent Code service.transport proxy answers from the running LAN
 * service. Same-origin fetch keeps the frame's CSP untouched — no network
 * capability is exercised on this path, only the namespace right.
 *
 * The path is APPENDED, never interpolated: the proxy dial is
 * `./__service/<id>/api/...`, and a hostile path value can only address the
 * extension's own service, exactly the boundary the host enforces anyway.
 */
export function proxyTransport(): LanTransport {
  return async ({ path, method, headers, body }) => {
    const response = await fetch(`./__service/${SERVICE_ID}${path}`, {
      method, headers, body, cache: 'no-store',
    })
    return { ok: response.ok, status: response.status, json: () => response.json() }
  }
}

type NetFetch = (url: string, init?: {
  httpMethod?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Array<{ name: string; value: string }>
  body?: string
}) => Promise<{ status: number; contentType: string; body: string }>

/**
 * Guest adapter: join a table hosted by a friend's Agent Code (or the standalone
 * CLI) through the brokered net.fetch capability. The sandbox still opens no
 * sockets — main enforces the private-literal-IP policy on every call.
 *
 * `destination` is validated upstream (privateHostDestination) before this adapter
 * is constructed; the adapter itself still prefixes only paths that begin with
 * '/', so a path can never smuggle a second absolute URL past the policy.
 */
export function netFetchTransport(netFetch: NetFetch, destination: string): LanTransport {
  // privateHostDestination() hands back `http://a.b.c.d:port/` WITH a trailing
  // slash. Appending '/api/…' to that produced '//api/…', which the host's
  // exact-path router answers 404, and an Origin with a slash no browser would
  // send. Reduce it once to the bare origin both uses need.
  const origin = new URL(destination).origin
  return async ({ path, method, headers, body }) => {
    if (!path.startsWith('/')) throw new Error('Invalid service path.')
    const result = await netFetch(`${origin}${path}`, {
      httpMethod: method,
      // WHY THE GUEST STATES ITS ORIGIN: the host's POST rule is "Origin must
      // name the address you dialed" (server/http.ts). A browser adds that
      // header itself; Agent Code's brokered fetch runs in the host app's main
      // process and adds none, so every guest POST got a 403. The value is the
      // literal origin this adapter dials, which is exactly what a browser on
      // that page would send, so the host's rule is satisfied honestly and not
      // bypassed. It works the same against the standalone CLI host and an
      // in-extension host (whose listener forwards it with the dialed Host).
      headers: [
        ...Object.entries(headers).filter(([name]) => name.toLowerCase() !== 'origin').map(([name, value]) => ({ name, value })),
        { name: 'Origin', value: origin },
      ],
      ...(body === undefined ? {} : { body }),
    })
    return {
      ok: result.status >= 200 && result.status < 300,
      status: result.status,
      // The broker returns text; the client expects response.json(). The poker
      // host answers JSON on every route (errors included), so parsing here
      // preserves the client's existing error envelope handling exactly.
      json: async () => JSON.parse(result.body),
    }
  }
}

/**
 * Turn the LAN service's `status` answer into the URLs friends type in.
 *
 * WHY THE SERVICE REPORTS THE ADDRESS AND THE CALLER THE PORT: the sandboxed
 * view and runtime can't enumerate network interfaces, but the service is an
 * ordinary Node process and can (server/service.ts). The port friends dial,
 * though, belongs to the Agent Code host's listener, and only expose() returns
 * it. So each side contributes the fact only it knows.
 *
 * The answer crosses a process boundary as untyped JSON, so only
 * dotted-quad strings survive. A malformed status yields [] and the caller
 * falls back to the placeholder wording instead of printing garbage.
 */
export function lanShareUrls(status: unknown, port: number): string[] {
  const list = (status as { lanAddresses?: unknown } | null | undefined)?.lanAddresses
  if (!Array.isArray(list)) return []
  return list
    .filter((address): address is string => typeof address === 'string' && /^\d{1,3}(?:\.\d{1,3}){3}$/.test(address))
    .map(address => `http://${address}:${port}`)
}

/** The share-line wording, shared by the view's Host button and runtime adoption. */
export function lanShareText(urls: readonly string[], port: number): string {
  // No private IPv4 interface (offline, or on a public/IPv6-only network): say
  // the shape honestly rather than invent an address.
  return urls.length > 0
    ? `Friends join at ${urls.join(' or ')}`
    : `Friends join at http://<this-computer’s-Wi-Fi-IP>:${port} (no private network address found)`
}
