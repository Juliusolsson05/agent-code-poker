/** Minimal surface the extension LAN view consumes. The full client is a
 *  page-lifetime browser module; only the transport seam is imported. */
export function setApiTransport(transport: (call: {
  path: string
  method: 'GET' | 'POST'
  headers: Record<string, string>
  body: string | undefined
}) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>): void
