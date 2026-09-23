import { base64ToBytes } from './audioClip'
import type { VoiceHttp } from './ElevenLabs'

/** Standalone website: the browser dials ElevenLabs itself. The LAN server's
 * CSP names exactly https://api.elevenlabs.io in connect-src for this, and
 * ElevenLabs answers CORS with `*` (recorded preflight, see the plan). The
 * request goes browser → ElevenLabs; the LAN host never sees it. */
export function browserVoiceHttp(fetchImpl: typeof fetch = (...args) => fetch(...args)): VoiceHttp {
  return async ({ url, headers, body }) => {
    const response = await fetchImpl(url, {
      method: 'POST', headers, body, cache: 'no-store',
      // No cookies, no referrer: the request carries only what we set.
      credentials: 'omit', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(15_000),
    })
    return { status: response.status, contentType: response.headers.get('content-type') ?? '', bytes: new Uint8Array(await response.arrayBuffer()) }
  }
}

/** The subset of Agent Code's `api.net.fetch` this transport uses. Declared
 * here rather than imported from the SDK because the pinned SDK (v0.9.0)
 * predates `responseType`; a host without agent-code#1150 ignores it and
 * returns text, which the bodyEncoding check below turns into a clean failure
 * instead of feeding mangled bytes to the decoder. */
export type BrokeredNetFetch = (url: string, init: {
  httpMethod: 'POST'
  headers: Array<{ name: string; value: string }>
  body: string
  responseType: 'base64'
}) => Promise<{ status: number; contentType: string; body: string; bodyEncoding?: 'text' | 'base64' }>

/** Inside Agent Code: the frame has no network; the host performs the request
 * under the `net.origins` capability after checking the target against the
 * manifest's declared `networkOrigins`. The key rides in one header of a
 * request that main sends to that one origin; main never logs headers. */
export function brokeredVoiceHttp(netFetch: BrokeredNetFetch): VoiceHttp {
  return async ({ url, headers, body }) => {
    const result = await netFetch(url, {
      httpMethod: 'POST', body, responseType: 'base64',
      headers: Object.entries(headers).map(([name, value]) => ({ name, value })),
    })
    if (result.bodyEncoding !== 'base64') throw new Error('This Agent Code build cannot return binary responses.')
    const bytes = base64ToBytes(result.body)
    if (!bytes) throw new Error('The host returned an invalid body.')
    return { status: result.status, contentType: result.contentType, bytes }
  }
}
