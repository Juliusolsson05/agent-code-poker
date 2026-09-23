/** Minimal surface the extension LAN view consumes. The full client is a
 *  page-lifetime browser module; only the transport seam is imported. */
export function setApiTransport(transport: (call: {
  path: string
  method: 'GET' | 'POST'
  headers: Record<string, string>
  body: string | undefined
}) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>): void

/** Replace where this player's ElevenLabs settings live and how the tab
 *  reaches ElevenLabs. The website default is browser storage + browser
 *  fetch; the Agent Code LAN view installs extension secrets + brokered fetch. */
export function setVoiceEnvironment(env: {
  store: import('../../src/voice/settingsStore').VoiceSettingsStore
  http: import('../../src/voice/ElevenLabs').VoiceHttp
}): void
