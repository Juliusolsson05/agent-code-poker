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
 * `origin` is validated upstream (privateHostDestination) before this adapter
 * is constructed; the adapter itself still prefixes only paths that begin with
 * '/', so a path can never smuggle a second absolute URL past the policy.
 */
export function netFetchTransport(netFetch: NetFetch, origin: string): LanTransport {
  return async ({ path, method, headers, body }) => {
    if (!path.startsWith('/')) throw new Error('Invalid service path.')
    const result = await netFetch(`${origin}${path}`, {
      httpMethod: method,
      headers: Object.entries(headers).map(([name, value]) => ({ name, value })),
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
