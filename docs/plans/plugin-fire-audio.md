# Plan: fireplace ambience plays inside the Agent Code extension

Issue: #12. Decomposition source: `poker-backlog-2026-09.md`, section 2.

## Problem

The fire loop is an `HTMLAudioElement` on a `data:audio/mpeg` URL. The
agent-code host frame CSP (`childFrameCsp`, `src/main/extensions/frameDocument.ts`)
has no `media-src`, so the media load falls back to `default-src 'none'` and is
blocked. `play()` rejects and the rejection is swallowed on purpose. The
standalone website sends `media-src data:`, which is why it plays there.

## Approach

1. **No media element.** `FireAmbience` takes the inlined bytes, decodes them
   once in the page (base64 via `atob`, then `ArrayBuffer`, then
   `AudioContext.decodeAudioData`), and loops an `AudioBufferSourceNode` through
   the same gain (plus HRTF panner when positioned) graph. No CSP directive
   governs in-memory Web Audio buffers. `fetch(dataUrl)` is not an option: that
   is `connect-src`, which also blocks `data:`.
2. **Same audible contract.** The level stays at 0.045 (Normal), the
   Off/Quiet/Normal presets map through `PokerAudio.setLevels`, master mute
   pauses the fire, the gesture/active/pause/hidden gates stay the same, and
   the loop position is kept across pauses.
3. **Autoplay-locked contexts.** The context is created in `unlock()` (on
   pointerdown or Enter). Decoding does not need a running context. A source
   started on a suspended context plays once `resume()` succeeds. A decode
   failure is logged once and leaves the fire silent without breaking the hand.
4. **Loop seam.** At decode time, scan the buffer once for leading and trailing
   near-silence (MP3 encoder delay/padding plus the file's own ~160 ms lead-in)
   and loop between `loopStart` and `loopEnd` inside that window. No per-frame
   work. Listener updates still write AudioParams only.
5. **Focus resync.** `App.tsx` also re-syncs ambience on window `focus`, which
   matches the LAN client.
6. **Tests.** Rewrite `tests/fire-audio.test.ts` and the fire parts of
   `tests/audio-mix.test.ts` against a fake `AudioContext`. Poison `Audio`,
   `createMediaElementSource` and `fetch`, so any regression to a media element
   or `data:` media URL fails. Assert that the decoded bytes are exactly the
   bundled MP3.

## Out of scope

- A host CSP change (`media-src`) in agent-code: that is another repo's release train.
- A listening check in the installed Electron app: the user does that manually.
