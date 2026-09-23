import type { VoiceSettingsStore } from '../../src/voice/settingsStore'
import type { VoiceHttp } from '../../src/voice/ElevenLabs'
import type { LanTransport } from './inAppTransport'

/**
 * How the LAN client reaches its table, its voice settings and ElevenLabs when
 * it runs INSIDE Agent Code instead of on the standalone website.
 *
 * WHY A SEPARATE MODULE, CONFIGURED BEFORE client.js IS IMPORTED: client.js is
 * a page-lifetime module whose top level starts working at once. It restores a
 * saved seat and calls `poll()` during evaluation. It used to export setters
 * (setApiTransport, setVoiceEnvironment) that the LAN view called after
 * `await import('client.js')` resolved, which is too late. With a saved seat,
 * the first poll went out with no transport, as a plain fetch to the
 * extension's own origin. Agent Code answered with a text "not found", and the
 * player saw `Unexpected token 'o', "not found" is not valid JSON`.
 *
 * The view now fills this object first and imports client.js second. client.js
 * reads the fields on every use, not once at load, so a later reconfiguration
 * (Host after a failed Join, say) still takes effect in the cached module.
 *
 * Every field is null on the standalone website, where client.js uses its
 * defaults: same-origin fetch, this browser's storage, and a direct browser
 * fetch to ElevenLabs.
 */
export type Embedding = {
  /** Service proxy when hosting, brokered net.fetch when joining a friend. */
  apiTransport: LanTransport | null
  /** Extension secret storage and the host-brokered ElevenLabs fetch. */
  voice: { store: VoiceSettingsStore; http: VoiceHttp } | null
  /** The address friends type in, shown to the host next to the lobby code.
   *  Only the view knows it in Agent Code, because it is the port of the host
   *  app's LAN listener (services.expose), not the service's own port. */
  shareUrls: readonly string[] | null
}

export const embedding: Embedding = { apiTransport: null, voice: null, shareUrls: null }

export function configureEmbedding(next: Partial<Embedding>): void {
  Object.assign(embedding, next)
}
