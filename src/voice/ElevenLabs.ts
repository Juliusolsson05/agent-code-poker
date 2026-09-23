import { looksLikeMpegAudio } from './audioClip'

/** THE ONLY MODULE THAT BUILDS AN ELEVENLABS REQUEST.
 *
 * The user chose (2026-09-23, backlog §5 option 1): each player's own app calls
 * ElevenLabs with that player's own key. So this file runs in the player's
 * browser/frame, never in the LAN host, and the key it receives is used for
 * exactly one header on exactly one origin. Nothing here logs, throws, or
 * returns anything derived from the key; failures are a closed set of reasons.
 *
 * WHY a `VoiceHttp` seam instead of calling fetch directly: the two worlds
 * reach the network differently. The standalone website uses the browser's
 * fetch (its CSP allows exactly this origin). Inside Agent Code the frame has
 * no network at all; the host brokers the call through `api.net.fetch` under
 * the `net.origins` capability, returning base64. Tests use a recorded-shape
 * fake. All three satisfy the same four-field contract, and none of them can
 * change the URL this module chose. */
export const ELEVENLABS_ORIGIN = 'https://api.elevenlabs.io'

/** Documented TTS output format. The lowest MP3 bitrate on purpose: a clip is
 * relayed through a LAN host with a 96 KiB cap and, inside Agent Code, through
 * a 64 KiB brokered request body; 32 kbps keeps a 200-character message under
 * both. Speech intelligibility at 22.05 kHz is fine for table talk. */
export const ELEVENLABS_OUTPUT_FORMAT = 'mp3_22050_32'
/** Low-latency documented model: a chat line should be heard while the bubble
 * is still up. Not user-selectable yet (no evidence anyone needs it). */
export const ELEVENLABS_MODEL = 'eleven_flash_v2_5'

export type VoiceSettings = { apiKey: string; voiceId: string }
export type VoiceHttpRequest = { url: string; headers: Record<string, string>; body: string }
export type VoiceHttpResponse = { status: number; contentType: string; bytes: Uint8Array }
export type VoiceHttp = (request: VoiceHttpRequest) => Promise<VoiceHttpResponse>

export type VoiceFailure = 'not-configured' | 'invalid-key' | 'quota' | 'voice-not-found' | 'busy' | 'network' | 'invalid-response' | 'failed'
export type VoiceResult = { ok: true; audio: Uint8Array } | { ok: false; reason: VoiceFailure }
/** The one interface the chat UI depends on. Tests and the automated
 * two-browser acceptance install a fake that satisfies exactly this. */
export type VoiceProvider = { synthesize(text: string): Promise<VoiceResult> }

/** Product copy for each failure. Deliberately generic about the key: "was
 * refused", never an echo of what was typed. */
export const VOICE_FAILURE_TEXT: Record<VoiceFailure, string> = {
  'not-configured': 'Add your ElevenLabs API key and voice ID in the table menu to speak.',
  'invalid-key': 'ElevenLabs refused the API key. Check it in the table menu.',
  quota: 'Your ElevenLabs quota is used up. Messages stay text-only.',
  'voice-not-found': 'ElevenLabs did not recognise that voice ID.',
  busy: 'ElevenLabs is busy. This message stays text-only.',
  network: 'Could not reach ElevenLabs. This message stays text-only.',
  'invalid-response': 'ElevenLabs returned something that is not audio.',
  failed: 'ElevenLabs could not speak this message.',
}

// Voice IDs are opaque alphanumerics (20 chars today). Validating before the
// request keeps a pasted URL or path from being interpolated into ours.
const VOICE_ID = /^[A-Za-z0-9]{8,64}$/
// Printable ASCII without spaces: a header value cannot carry CR/LF, and a key
// pasted with a trailing newline is trimmed rather than refused.
const API_KEY = /^[\x21-\x7e]{8,256}$/

export function normalizeVoiceSettings(raw: { apiKey?: unknown; voiceId?: unknown }): VoiceSettings | null {
  const apiKey = typeof raw.apiKey === 'string' ? raw.apiKey.trim() : ''
  const voiceId = typeof raw.voiceId === 'string' ? raw.voiceId.trim() : ''
  return API_KEY.test(apiKey) && VOICE_ID.test(voiceId) ? { apiKey, voiceId } : null
}

/** Bound what a misbehaving endpoint can make us hold. Far above any real
 * clip (a 200-char message is ~60 KB at the chosen format). */
const MAX_RESPONSE_BYTES = 512 * 1024

/** Map a non-2xx response. `detail.status` first (recorded shapes:
 * tests/fixtures/elevenlabs/), HTTP status second, because ElevenLabs uses 401
 * for BOTH a bad key and an exhausted quota; only the body tells them apart. */
export function classifyElevenLabsError(status: number, bytes: Uint8Array): VoiceFailure {
  let detail = ''
  try {
    const parsed = JSON.parse(new TextDecoder().decode(bytes.subarray(0, 4096))) as { detail?: { status?: unknown } }
    if (typeof parsed?.detail?.status === 'string') detail = parsed.detail.status
  } catch { /* Non-JSON error page: fall through to the HTTP status. */ }
  if (detail === 'quota_exceeded' || status === 402) return 'quota'
  if (detail === 'invalid_api_key' || detail === 'needs_authorization' || status === 401) return 'invalid-key'
  if (detail === 'voice_not_found' || detail === 'invalid_uid' || status === 404) return 'voice-not-found'
  if (status === 429 || detail === 'too_many_concurrent_requests' || detail === 'system_busy') return 'busy'
  return 'failed'
}

export function createElevenLabsProvider(settings: () => VoiceSettings | null, http: VoiceHttp): VoiceProvider {
  return {
    async synthesize(text) {
      const current = settings()
      if (!current) return { ok: false, reason: 'not-configured' }
      let response: VoiceHttpResponse
      try {
        response = await http({
          // voiceId passed VOICE_ID, so it cannot add a path segment or query.
          url: `${ELEVENLABS_ORIGIN}/v1/text-to-speech/${current.voiceId}?output_format=${ELEVENLABS_OUTPUT_FORMAT}`,
          headers: { 'xi-api-key': current.apiKey, 'content-type': 'application/json', accept: 'audio/mpeg' },
          body: JSON.stringify({ text, model_id: ELEVENLABS_MODEL }),
        })
      } catch {
        // The transport's own error text is dropped on purpose: a broker or
        // browser message is not product copy, and nothing downstream may
        // surface an error object that ever held the request.
        return { ok: false, reason: 'network' }
      }
      if (response.status < 200 || response.status >= 300) return { ok: false, reason: classifyElevenLabsError(response.status, response.bytes) }
      if (response.bytes.length > MAX_RESPONSE_BYTES || !looksLikeMpegAudio(response.bytes)) return { ok: false, reason: 'invalid-response' }
      return { ok: true, audio: response.bytes }
    },
  }
}
