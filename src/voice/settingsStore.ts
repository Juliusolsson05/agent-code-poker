import { normalizeVoiceSettings, type VoiceSettings } from './ElevenLabs'

/** Where THIS player's ElevenLabs key and voice ID live. Never the LAN host:
 * nothing in this module takes a transport, and the key is read only by the
 * ElevenLabs provider running in the same frame/tab.
 *
 * Two worlds, two honest answers, and the settings panel prints `where`
 * verbatim so the player knows which one they got:
 * - Inside Agent Code the key goes to `api.secrets` (the host encrypts it with
 *   the OS keychain, per extension). The voice ID is not secret and uses the
 *   ordinary extension storage.
 * - On the standalone website there is no keychain. localStorage is the only
 *   durable option a web page has; it is readable by anything that runs on
 *   this host's origin in this browser profile, which the panel says. */
export type VoiceSettingsStore = {
  where: string
  load(): Promise<VoiceSettings | null>
  /** Resolves false when storage refused the write (quota, private mode, a
   * host without secret storage). The caller keeps the settings for this tab
   * only and says so, instead of pretending they were saved. */
  save(settings: VoiceSettings): Promise<boolean>
  clear(): Promise<void>
}

const BROWSER_KEY = 'poker-lan-elevenlabs-key', BROWSER_VOICE = 'poker-lan-elevenlabs-voice'

export function browserVoiceSettingsStore(storage: () => Storage): VoiceSettingsStore {
  return {
    where: 'Saved in this browser’s local storage on this computer only. It is never sent to the table host or other players. Use Forget before sharing this browser.',
    async load() {
      try { return normalizeVoiceSettings({ apiKey: storage().getItem(BROWSER_KEY), voiceId: storage().getItem(BROWSER_VOICE) }) }
      catch { return null }
    },
    async save(settings) {
      try { storage().setItem(BROWSER_KEY, settings.apiKey); storage().setItem(BROWSER_VOICE, settings.voiceId); return true }
      catch { return false }
    },
    async clear() {
      try { storage().removeItem(BROWSER_KEY); storage().removeItem(BROWSER_VOICE) } catch { /* Nothing stored. */ }
    },
  }
}

/** Structural subset of the Agent Code v2 view API. `secrets` exists only on
 * hosts with agent-code#1150; its absence is reported, never worked around by
 * falling back to plain storage (that would silently downgrade a keychain
 * promise to a JSON file). */
export type AgentCodeStorageApi = {
  storage: { get(key: string): Promise<unknown>; set(key: string, value: string): Promise<void>; delete(key: string): Promise<void> }
  secrets?: { get(key: string): Promise<string | null>; set(key: string, value: string): Promise<void>; delete(key: string): Promise<void> }
}
const SECRET_KEY = 'elevenlabs.apiKey', STORAGE_VOICE = 'lan.elevenlabsVoiceId'

export function agentCodeVoiceSettingsStore(api: AgentCodeStorageApi): VoiceSettingsStore {
  const secrets = api.secrets
  return {
    where: secrets
      ? 'Your key is encrypted by Agent Code with this computer’s keychain and readable only by this extension. It is never sent to the table host or other players.'
      : 'This Agent Code build has no secret storage. Update Agent Code to save a key; voices stay text-only until then.',
    async load() {
      if (!secrets) return null
      try { return normalizeVoiceSettings({ apiKey: await secrets.get(SECRET_KEY), voiceId: await api.storage.get(STORAGE_VOICE) }) }
      catch { return null }
    },
    async save(settings) {
      if (!secrets) return false
      try { await secrets.set(SECRET_KEY, settings.apiKey); await api.storage.set(STORAGE_VOICE, settings.voiceId); return true }
      catch { return false }
    },
    async clear() {
      await Promise.allSettled([secrets?.delete(SECRET_KEY), api.storage.delete(STORAGE_VOICE)])
    },
  }
}
