# LAN chat with per-player ElevenLabs voices and host feature switches

Issue: #22. Backlog: `docs/decomposition/poker-backlog-2026-09.md` §5.
Host capability: Juliusolsson05/agent-code#1150 (declared public HTTPS origins
+ per-extension secret storage). Base: `feat/lan-visible-leisure` (PR #21,
itself stacked on #11). This branch is stacked on #21 because #21 owns the
session/http leisure seam this work extends; later #21 commits are merged in
(normal merge, never rebase).

## Decisions the user made (2026-09-23)

- **Option 1 of §5.** Each player's OWN app calls ElevenLabs text-to-speech with
  their OWN key and voice ID. The key never leaves that player's machine: it is
  never sent to the LAN host, to other players, into logs, saves, diagnostics
  exports, or PR text. Only the resulting audio clip travels, and only when the
  host has voices on.
- **One host switch set, before or during a session**, covering spoken voices
  AND the cosmetic mushroom/LSD treats of PR #20.
- **Chat:** typed text appears as a bubble over the sender's name label for
  everyone; with voices on it is also spoken in the sender's chosen voice.

## Evidence gathered before writing code

- `server/http.ts`: every POST goes through one 4 KB JSON `body()` reader, one
  global rate bucket, the Origin/Host/private-peer gate and bearer `authorize`.
  `paused` is the only host-controlled setting today (`/api/pause`, host-only,
  reflected in `envelope()`); it is transport state, not checkpointed (a
  restart comes back paused). Features follow the same rule: host transport
  state, not checkpointed, default OFF after restart (fail-quiet, not loud).
- `HostTable.leisure` is the model for a cosmetic, principal-bound intent that
  never touches `PokerGame`, the member sequence or `#revision`; its record is
  volatile and outside the checkpoint. Chat is the same kind of thing.
- `projectTable` (`src/session/view.ts`) is an explicit allowlist. Chat is
  projected in `HostTable.view()` next to the table view, field by field.
- Leisure receipts are bare (no envelope) so a cosmetic reply cannot reorder a
  wager reply in `ResponseOrder`. Chat and voice replies follow that rule.
- LAN world labels: `client.js` creates one React root per display seat and
  `room.bindWorldLabel(seat,node)`; `Room.ts` projects the node every frame.
  PR #20 moves that projection to the render camera. Rendering the bubble
  INSIDE the label node reuses whichever projection path is current, so no
  Room.ts change is needed and #20 does not conflict.
- `PokerAudio` owns one AudioContext; `FireAmbience` already drives the shared
  `context.listener` from the camera matrix. A voice PannerNode on the same
  context is spatialised for free. The effects master is 0.18 gain (quiet by
  design), so voice gets its own bus that obeys master mute.
- Keys in use: F C B M S D E(#20) R Space Esc Enter 1–4 arrows. **T** (talk) is
  free and conventional for game chat.
- Transports inside Agent Code: the hosting player talks through the service
  proxy (`fetch('./__service/...')`), a joining player through brokered
  `net.fetch`, whose request body is a string capped at 64 KiB and whose
  response is text. So the voice relay speaks JSON with base64 audio in both
  directions — one format that fits every transport.
- ElevenLabs shapes recorded 2026-09-23 with curl, no key (see
  `testing/fixtures/elevenlabs/`): invalid key → 401
  `detail.status=invalid_api_key`; missing key → 401 `needs_authorization`;
  malformed voice id → 400 `invalid_uid`; CORS preflight allows `*` origin and
  headers (browser fetch from the standalone site works). **No success body or
  quota response could be recorded without a key.** The success fake is a
  locally encoded MP3 in the same `mp3_22050_32` output format; quota handling
  follows the documented `detail.status` values. Live verification is the
  user's step.

## Stage B1 — host features

- `Room.features = { voices: false, treats: false }` in `server/http.ts`.
- `POST /api/features {voices:boolean, treats:boolean}` — host token only
  (403 otherwise), exact shape, same body/rate/origin gates as `/api/pause`.
  Turning voices off drops every relayed clip immediately.
- `envelope()` carries `features` for every member.
- Treats: this base (#21) has no treat kinds anywhere. Leisure carries only
  drink kinds, and the LAN client has no treat control. Adding an unused
  `treats` parameter to `HostTable.leisure` would be dead code. So this branch
  ships the switch, its host-only route and its propagation to every client.
  The gate itself is a documented merge point for when #20's treats reach
  LAN leisure:
  - `HostTable.leisure` takes `features.treats` in its context and returns
    `disabled` for an order of an `isTreatKind` kind while it is off;
  - `client.js` passes `treat: null` to `LeisureControls` while
    `state.features.treats` is false.
  Implementation decision recorded 2026-09-23.

## Stage B2 — chat intent + public projection

`HostTable.chat(id, request)` → `{ ok, code, seq? }`:
- exact shape `{ text: string }`; seat/name come from the authenticated member.
- text: NFC, whitespace runs collapsed, trimmed, 1–200 code points, no
  control/format characters (bidi overrides could disguise who said what).
  Stored and projected as plain text; every renderer uses text nodes. We do not
  strip `<`: escaping is the renderer's job and stripping would be theatre.
- per-member token bucket: 4 messages burst, one more every 3 s → `rate-limited`.
- allowed while paused (talking during a pause is the point of a pause) and
  while queued; refused for unknown/leaving/disconnected members.
- volatile ring of the last 30 messages; never in the checkpoint.
- `view().chat`: last 12 messages newer than 10 min, each copied field by
  field: `{ seq, seat, displaySeat, name, text, ageMs, voice }`. `voice` is
  true only when the host holds a relayed clip for that seq AND voices are on.
  No member id, no token, no clock value from the host.

## Stage B3 — voice relay

`server/VoiceRelay.ts` (pure, injectable clock):
- `put(seq, owner, bytes)`: only the SENDER of `seq`, only within 60 s of the
  message, once per seq, only with voices on (checked by http.ts).
- bytes: decoded ≤ 96 KiB, `audio/mpeg` only, magic bytes `ID3` or an MPEG
  audio frame sync (`src/voice/audioClip.ts`, shared with the client).
- memory only, never disk: TTL 90 s, at most 16 clips (oldest evicted).
- routes: `POST /api/voice {seq, mime:'audio/mpeg', data:base64}` with its own
  132 KiB body cap (the 4 KB JSON cap still applies everywhere else);
  `GET /api/voice/<seq>` → `{ mime, data }` for any authenticated member.
  Both token-authenticated, both under the global rate bucket.

## Stage C — UI

- Chat: **T** on the table opens a single-line input (maxlength 200); Enter
  sends, Esc closes. The input is an editing target, so no gameplay shortcut
  fires while typing. Bubble rendered inside each world label node; own
  messages show in the log. Chat log `<ol aria-live="polite">`.
- Voice settings in the table menu: API key (password field), voice ID, Save,
  Forget, Test voice. In Agent Code the key goes to `api.secrets` and the voice
  ID to `api.storage`; on the website both go to this browser's localStorage,
  and the panel says exactly that.
- Host section of the table menu: Spoken voices on/off, Treats on/off.
  Guests see the current state read-only.
- Playback: `PokerAudio.playVoice(bytes, position)` decodes once, HRTF panner
  at the speaker's display-seat head, separate voice gain that master mute
  silences. A tab only plays a message it first saw arrive live (no replay of
  history after reload or join), one clip at a time per speaker.

## Stage D — ElevenLabs client (`src/voice/`)

- `VoiceProvider { synthesize(text) → {ok:true,audio} | {ok:false,reason} }`.
- `ElevenLabsProvider(settings, transport)`: `POST
  https://api.elevenlabs.io/v1/text-to-speech/{voice_id}?output_format=mp3_22050_32`,
  `xi-api-key`, JSON `{ text, model_id }`, `accept: audio/mpeg`. The lowest MP3
  bitrate keeps a 200-character message under the relay cap.
- errors mapped from `detail.status` then HTTP status: invalid key, quota,
  voice not found, rate limited/busy, network, invalid response, too large.
  Any failure means that one message is text-only; the UI names why.
- transports: website = browser `fetch` (CSP `connect-src 'self'
  https://api.elevenlabs.io` on the standalone server only); Agent Code =
  `api.net.fetch(..., { responseType: 'base64' })` under the host's new
  `net.origins` capability. Only `src/voice/` builds ElevenLabs requests.
- manifest declares `networkOrigins: ["https://api.elevenlabs.io"]` and
  `net.origins`. **Merge order:** a host without agent-code#1150 refuses this
  manifest, so this PR must not ship before that host capability is released.

## Tests (contracts, not counts)

- host-only features (guest 403, shape, envelope propagation, voices-off drops clips);
- chat: exact shape, length (200 ok / 201 refused), control/bidi refused,
  `<script>` stays plain text, rate limit, pause allowed, queued allowed,
  leaving refused, never touches revision/sequence, not in checkpoint;
- projection allowlist: exact key set, no member id/token;
- voice upload: sender-only, voices-off refused, size cap, wrong magic bytes,
  wrong mime, TTL expiry, not written to the checkpoint directory;
- key never leaves the client: a recording fake transport proves the host
  never sees `xi-api-key` or the key string in any request body/header;
- ElevenLabs provider against the recorded error fixtures + the encoded MP3.

## Acceptance

Two headless Chrome browsers against `npm run lan -- --memory-only` on a free
port ≥ 5305, with the fake voice provider installed through a QA hook: host
turns voices on, guest sends a chat, both see the bubble/log, the other side
fetches and decodes the relayed clip. Live ElevenLabs output and listening
quality are the user's step (no key available to this agent).

## Found while wiring the in-app path

- `src/lanView.tsx` built the guest transport as `url => net.fetch(url)`,
  which drops the method, headers and body. Every in-app guest POST therefore
  reached the host as a bare GET without a token. Chat depends on guest POSTs,
  so this branch passes `init` through. PR #19 has the same line; whichever
  merges second resolves a one-line conflict.
- On the Agent Code side, the view broker (`frameProtocol`) did not accept
  `net.fetch` or `service.expose`, and the view/runtime documents read
  `init.method` while the SDK type says `httpMethod`. Both are fixed in the host
  PR for agent-code#1150. The in-app path needs that host build.
