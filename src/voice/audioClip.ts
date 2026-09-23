/** A 4-byte prologue check shared by the browser client (before upload) and
 * the LAN host (on upload).
 * Pure: no DOM, no Node Buffer, so the same bytes rule runs on both sides and a
 * clip the sender believes is valid can never be refused for a different
 * reason by the host.
 *
 * WHY magic bytes and not the declared type: the upload's `mime` field is the
 * sender's claim. The host relays these bytes into every other player's audio
 * decoder, so "audio/mpeg" must be a property of the bytes. We accept exactly
 * what ElevenLabs' mp3_* output formats produce: an ID3v2 tag ("ID3") or a
 * bare MPEG audio frame (11-bit frame sync 0xFFE). Anything else (HTML, a
 * WAV/Ogg container, a zip) is refused before it is stored.
 *
 * WHAT THIS IS NOT: it inspects only the first four bytes (an ID3v2 prologue or
 * one MPEG frame header). It does not parse the stream, so "passes" means
 * "starts like MP3", not "is a valid MP3". Anything after those four bytes is
 * unchecked, which is why decodeAudioData on the receiving side is wrapped in
 * try/catch and an undecodable clip simply falls back to the bubble. */
export const VOICE_MIME = 'audio/mpeg'

/** Decoded clip cap. 96 KiB holds ~24 s of mp3_22050_32 (4 KB/s), comfortably
 * more than a 200-character message (~13–15 s). The relay's JSON body cap is
 * derived from this (base64 is 4/3 larger). A clip over the cap is not an
 * error for the sender: it still hears it locally; the others get text only. */
export const MAX_VOICE_BYTES = 96 * 1024

export function looksLikeMpegAudio(bytes: Uint8Array): boolean {
  if (bytes.length < 4) return false
  // ID3v2: "ID3", then major version 2–4 (0xFF is never a valid version byte).
  if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) return bytes[3] >= 2 && bytes[3] <= 4
  // MPEG audio frame header: sync 0xFFE, version != reserved (01), layer != reserved (00),
  // bitrate index != 1111, sample-rate index != 11. Rejecting the reserved
  // values stops any random 0xFF-prefixed blob from passing as audio.
  if (bytes[0] !== 0xff || (bytes[1] & 0xe0) !== 0xe0) return false
  const version = (bytes[1] >> 3) & 0b11, layer = (bytes[1] >> 1) & 0b11
  const bitrate = bytes[2] >> 4, sampleRate = (bytes[2] >> 2) & 0b11
  return version !== 0b01 && layer !== 0b00 && bitrate !== 0b1111 && sampleRate !== 0b11
}

// Base64 without Node's Buffer (the browser bundle) and without the
// btoa(String.fromCharCode(...bytes)) spread, which overflows the call stack for
// a 96 KiB array. Chunked so each fromCharCode call stays small.
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(binary)
}

/** Strict: any non-alphabet character (whitespace, URL-safe variants, a data:
 * prefix) is refused instead of being silently skipped, so the size check the
 * caller does on the result is a check on what was actually sent. */
export function base64ToBytes(value: string): Uint8Array | null {
  if (typeof value !== 'string' || value.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(value)) return null
  try {
    const binary = atob(value), bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return bytes
  } catch { return null }
}
