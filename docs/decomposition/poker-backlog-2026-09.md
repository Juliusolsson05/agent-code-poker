# Poker backlog, September 2026: staged decomposition

Tracking document for everything requested on 2026-09-22. Each workstream is
a separate PR unless noted. Order matters: the user asked for workstream 1 to
land before any other. Evidence citations are file:line on `origin/main`
d37e0eb unless noted.

Scale note: the repo is ~10.9k LOC (src 6.1k, server 1.1k, tests 3.7k).
That is below the size where full staged decomposition pays for itself, but
several workstreams cross repositories (agent-code host, extension SDK) and
touch security and networking policy. Those parts get real stages; the
cosmetic parts are listed plainly.

## Status board (updated 2026-09-23, after the final review of c967242)

All eight workstreams are **implemented and merged**. "Merged" means the code,
unit/contract tests and `npm run verify` passed; it does not mean the
acceptance checks below were run. Those are listed separately on purpose, so
a green row is never read as "verified in the installed app".

| # | Workstream | Implementation | Poker PR (issues) | Cross-repo |
|---|---|---|---|---|
| 1 | Room atmosphere: outer glass grip, seated anatomy, lighting, 280° decor | merged | #11 (#7 #8 #9 #10) | none |
| 2 | Fireplace sound inside the Agent Code plugin | merged | #18 (#12) | none (in-page decode, no host CSP change) |
| 3 | LAN play inside the Agent Code plugin | merged | #19 (#17); seat recovery after a host restart #26 (#24) | agent-code #1148 (caller identity through the service proxy and LAN listener) |
| 4 | See other LAN players smoke (and drink) | merged | #21 (#16) | none |
| 5 | LAN chat with bubbles + host-enabled ElevenLabs voices | merged; policy decided (option 1, see §5) | #23 (#22) | agent-code #1151 + SDK #4 (declared network origins, binary fetch bodies, per-extension secrets) |
| 6 | Twelve more drinks | merged | #20 (#13) | none |
| 7 | Orderable cosmetic "mushrooms" and "LSD" effects | merged | #20 (#14) | none |
| 8 | Much stronger drink/intoxication effect with screen wobble | merged | #20 (#15) | none |

Version 0.3.0 is the first release carrying 3–5 together. It needs
Agent Code 0.1.3 or later, which has #1148 and #1151. agent-code #1146 merged
the same day but is unrelated to poker (Agent Management label targeting).

### Outstanding acceptance (not implementation work)

None of these can be closed by tests in this repository. Each needs a person,
real devices or a real key:

- **Installed app.** Load the released build in Agent Code 0.1.3+ and confirm
  the fireplace is audible (2), the LAN host starts and exposes its share
  line (3), and chat plus the voices toggle work in the extension frame (5).
  Browser previews do not count (AGENTS.md).
- **Two-device LAN game.** A host in the plugin plus a guest on a second
  device on the same network: join, deal, bet, pause, reconnect, host restart
  and seat resume (3, #26), and see each other's smokes/sips (4). Recorded
  two-browser runs on one machine exist (`testing/lan-two-browser.mjs`); a
  second device does not.
- **Real-key voice.** With a real ElevenLabs key and voice ID, hear a line
  spoken locally and relayed to another seat (5). The fixtures are a locally
  encoded MP3 plus recorded no-key error bodies; no real synthesis has been
  heard.
- **Listening and art.** Fire loop seam and mix, and close-up motion of the
  new drinks/treats (1, 2, 6, 7). Listening quality has never been signed off.

Sections 1–8 below are the **pre-implementation decomposition**, kept as the
record of what was planned and why. File:line citations in them point at
`d37e0eb` and are stale; each workstream's `docs/plans/*.md` records what
actually changed from the sketch.

---

## 1. Room atmosphere

Plan: `docs/plans/room-atmosphere.md`. All four stages (grip, anatomy, 280°
decor, then lighting tuned over the finished room) merged in #11.

## 2. Fireplace sound in the plugin

- **A:** `src/audio/FireAmbience.ts` loops an `<audio>` element on a `data:`
  MP3 (`src/audio.ts:20`, `App.tsx:4`). It works on the standalone website,
  whose CSP adds `media-src data:` (`server/http.ts:168`).
- **D:** the installed extension plays the same loop at the same level with
  the same enable conditions.
- **Cause (from code, not yet reproduced in Electron):** the agent-code host's
  frame CSP (`src/main/extensions/frameDocument.ts:75-86` in agent-code) has no
  `media-src`, so it falls back to `default-src 'none'`. The media element's
  `play()` rejects and the rejection is swallowed (`FireAmbience.ts:63`).
  Synthesised chip and tone cues use Web Audio buffers and are unaffected,
  which matches "effects work, fire missing".

| Stage | Produces | Verified by | Why separate | Reality check |
|---|---|---|---|---|
| 2a Reproduce | A captured console/network record from the installed extension showing the CSP violation or the rejected `play()` | Real Electron run with the installed build | Stops the fix being aimed at a guessed cause | Actual installed app, not the preview |
| 2b Decode through Web Audio | FireAmbience plays decoded `AudioBuffer`s from the inlined bytes (base64 → ArrayBuffer → `decodeAudioData`); no media element | The 2a scenario now produces sound; the website still does | A host CSP change is another repo's release train; in-page decoding needs no network or media fetch | 2a recording |
| 2c Re-sync ambience on focus | `App.tsx:120-121` resumes on `focus` as well as blur/visibility | Manual: blur the modal, refocus, fire resumes | Separate small bug found during the investigation | `App.tsx:121` has blur only |

Unknowns: whether the Electron frame allows `decodeAudioData` on
autoplay-locked contexts before a gesture (`unlock()` runs on pointerdown and
enter); whether the loop seam is audible with buffer looping.

## 3. LAN inside the plugin

- **A:** PR #5/#6. The extension declares a `lan-host` service
  (`dist-service/lan-host.mjs`); `lanView.tsx` mounts the real website client
  with a Host/Join overlay. Host uses `proxyTransport`
  (`server/client/inAppTransport.ts:33-40`), join uses `api.net.fetch`
  (`:57-73`). Electron acceptance covered install, service spawn, expose and
  heartbeat only (PLAN.md:656-667).
- **D:** from inside Agent Code a player can host, a second player on
  another device can join, and they can play, pause and reconnect, all in the
  plugin.
- **Suspected blocker (from reading agent-code, not yet run):** the host's
  service proxy and LAN listener forward only `accept` and `content-type`
  (agent-code `serviceTransport.ts:120-124`, `serviceLanListener.ts:79-83`).
  The poker server needs `Authorization: Bearer` (`http.ts:123-131`) and a
  same-origin `Origin` on POST (`http.ts:176`). Expected symptom: 401/403
  after create.

| Stage | Produces | Verified by | Why separate | Reality check |
|---|---|---|---|---|
| 3a Record the real failure | Host-side and service-side request logs from an installed two-seat attempt | Captured status codes and headers | The header theory is from source reading only | Real Electron + a second browser |
| 3b Transport contract | One documented header/auth contract between host proxy and service. Either the host forwards `Authorization` and a synthetic `Origin`, or the poker service accepts a proxy-attested principal | Contract test in agent-code plus a poker server test fed the 3a recordings | Cross-repo: the agent-code change ships separately and needs its own PR | 3a recordings as fixtures |
| 3c Share address | The view shows the real LAN URL instead of the `<this-computer's-Wi-Fi-IP>` placeholder (`lanView.tsx:31,158`), provided by the service's status request | Unit test on the status payload; visual check | The view cannot see the machine's IP; the service can | Status request output |
| 3d Acceptance | Two-device record: host in plugin, guest in plugin, deal, pause, reconnect | Human-driven session per AGENTS.md | The open gates in PLAN.md:640-676 | Real devices |

Isolation: auth and transport arbitration live in one module on each side
(agent-code `serviceTransport`, poker `server/http.ts`); the view never
builds headers itself.

Unknowns: whether the SDK's "WebSockets are not proxied" limit matters (the
client polls, so probably not); whether the modal can host at all while the
app sleeps; README/AGENTS still say the extension has no network API, which
is stale and must be corrected in this PR.

## 4. See other LAN players smoke (and drink)

**Status:** merged in #21 (#16); see
`docs/plans/lan-visible-leisure.md` for what changed from this sketch (notably
`ageMs` instead of `startedAt`, and the from-above pickup route).

- **A:** remote humans render as `buildHuman` NPC bodies (`Room.ts:163`).
  `Human.ts` has no cigar at all. Leisure is local only (`client.js:128-131`),
  and `projectTable` (`src/session/view.ts:29`) carries no leisure fields.
  NPC sips run on an ambient timer.
- **D:** when a LAN player smokes or sips, every other player sees that
  seat's body do it within about one poll interval, with the right drink kind.

| Stage | Produces | Verified by | Why separate | Reality check |
|---|---|---|---|---|
| 4a Leisure intent in the session | `HostTable` accepts a rate-limited `leisure` intent (smoke/sip/order kind) per seat; it never touches the ledger | Session tests: accepted only for the principal's seat, rejected when paused, cannot affect chips | Security boundary: must not widen the poker intent path | Existing session tests' principal fixtures |
| 4b Public leisure projection | `projectTable` adds `{seat, action, startedAt, drinkKind}` per seat (public cosmetic data only) | Projection test; the redaction test still passes | Keeps RoomProjection the single local/remote boundary (AGENTS.md) | Recorded session views |
| 4c NPC cigar rig | `Human.ts` gains a cigar prop plus a smoke gesture reusing the hero's contact frames, driven by projected events instead of a timer for human seats | Anatomy-style contact tests (bite point at mouth, no skin penetration) | The hard, visual part; isolated from networking | Rig inspector captures |
| 4d Two-browser acceptance | Recording of player A smoking, seen by player B | Real two-browser session | End-to-end timing | Real session |

## 5. LAN chat with host-enabled ElevenLabs voices

> **Historical: the policy question below is resolved.** On 2026-09-23 the
> user chose **option 1** (each player's own app calls ElevenLabs with that
> player's own key; only finished audio travels through the LAN host's
> in-memory relay). The binding rules are recorded in AGENTS.md ("One
> recorded exception"), and the implementation is #23 with agent-code #1151
> and SDK #4. The text below is kept only as the record of the options
> weighed; its "cannot call api.elevenlabs.io today" facts no longer hold.

Requested behaviour: a LAN chat. A sent message appears as a bubble over
the sender's name label and is spoken aloud with the sender's own ElevenLabs
API key and voice ID. The host decides, before or during the session, whether
the spoken-voice feature is enabled.

**Conflicts with the rules at the time (historical, see the note above):**
- AGENTS.md: "No external assets or runtime networking." The extension frame
  CSP allows `connect-src` self only, and `net.fetch` can reach only literal
  private/loopback IPs. The shipped extension **cannot** call
  `api.elevenlabs.io` today.
- The standalone server's CSP is `connect-src 'self'`, and PLAN.md:543 says
  "no runtime network calls, accounts".
- API keys are secrets. Nothing stores secrets today (only `api.storage` table
  saves and session storage for seat keys).

Options to decide between:
1. **Each player's own client calls ElevenLabs** with their own key, then
   sends only the audio bytes, or nothing (others fetch audio from the host
   relay). Needs a CSP and SDK exception for one public host in the plugin, and
   in the website.
2. **The host's LAN server calls ElevenLabs** using the key each player
   submitted to it. Keys cross the LAN to the host machine; the host sees
   everyone's key. Simplest for the plugin (no new frame permissions), worst
   for key privacy.
3. **Website-only first:** ship chat bubbles everywhere, and voices only on
   the standalone website, with its CSP widened to `api.elevenlabs.io`. The
   plugin gets voices later through an SDK capability.

| Stage | Produces | Verified by | Why separate | Reality check |
|---|---|---|---|---|
| 5a Decision record | The chosen option and the key-handling rules, written into AGENTS.md | User approval | Networking policy change | This section |
| 5b Chat in the session | `chat` intent (length/rate limited, text only, per principal) plus a public message log in the projection, in the 4 KB body cap | Session tests incl. injection/length/flood | Pure LAN feature, no external calls | Session fixtures |
| 5c Bubbles | World-anchored bubble over each seat's name label (reuses `bindWorldLabel` projection, `Room.ts:267`) | Visual capture + DOM test | Pure UI | Captures |
| 5d Host toggle | Host-only setting (like `/api/pause`, `http.ts:228-232`) propagated in the envelope | Session tests: guests cannot change it | The one generic host toggle; reusable later | Envelope shape |
| 5e Voice provider | Isolated `voice/` module: ElevenLabs text-to-speech via the chosen path, key storage per option, playback through the existing audio graph | Contract test against a recorded ElevenLabs response; manual listen | The only external-network code, fenced off | A real recorded API response |

Unknowns: ElevenLabs quotas, latency and error shapes (record real ones in
5e); moderation of spoken text; what happens when a sender has no key (text
only); whether the host toggle should also mute locally.

## 6. Twelve more drinks

- **A:** 4 kinds in `src/scene/props/specs.ts:4-9`, all radius .036 so one
  fitted grip works (`HandGrips.ts:6-10`; `tests/grip-surfaces.test.ts:44`
  asserts equal radii). Kind-specific geometry is in `Drinks.ts:40-56`. The
  alcoholic list is hard-coded in `DrinkWarmth.ts:18`.
- **D:** 16 drinks in the menu, each visually distinct, all held with the
  same tested grip, and the menu still fits at compact sizes.
- Stages: 6a move "alcoholic" and "strength" into `DRINKS` (removes the
  hard-coded list); 6b add 12 kinds that keep the 36mm tumbler profile (mulled
  wine, eggnog, hot toddy, glögg, gin & tonic, negroni, Irish coffee, hot
  chocolate, cider, stout, champagne in a coupe-shaped rim cap within the same
  body, cranberry spritz). Geometry varies by liquid, garnish, foam, steam and
  ice, not by radius. 6c menu layout with sections (alcoholic / warm / soft)
  plus the tests pinning 4 labels (`lan-leisure.test.ts:15,39-40`,
  `props.test.ts:30`).
- Unknowns: whether stemmed glasses (wine, coupe) are wanted. They need a new
  fitted grip, a separate stage with its own skin-clearance evidence.

## 7. Cosmetic "mushrooms" and "LSD"

A fun, fictional cosmetic effect in a practice-chips card game: no real-world
information, no dosing, no rules or odds changes, and bots never know about
it. Ordered from the same menu, then consumed with the same interaction
owner.
- 7a Props: a small dish of voxel mushrooms, and a sugar cube or blotter tab
  on a saucer (tabletop items, not drinks: they need their own simple
  hand-to-mouth contact, since the glass grip does not apply).
- 7b Effect profiles feed stage 8's effect engine (a distinct palette and
  motion per item, e.g. hue-cycling and "breathing" walls for LSD, warm
  saturation and a slow pulse for mushrooms).
- Unknowns: whether the host should be able to disable these on LAN (likely
  yes, reusing the 5d host toggle).

## 8. Stronger effects with screen wobble

- **A:** `DrinkWarmth` is an edge tint only (max opacity .18). README says
  "no blur, sway". The design doc says "Do not start with camera roll, double
  vision, strong blur or flashing" (`poker-experience.md:1478`). The user now
  explicitly asks for a Sea of Thieves-style wobble.
- **D:** after several drinks the camera visibly sways and rolls, the image
  gets a warm, slightly doubled or blurred edge, and it builds and decays
  over time. It is off under `prefers-reduced-motion`, has an in-settings Off,
  and never moves props or the ledger.
- Stages: 8a effect engine (one owner computing intensity per effect source
  from sips, mushrooms and LSD; replaces DrinkWarmth's single scalar); 8b
  camera wobble applied in `Room.frame` after look yaw/pitch (`Room.ts:470`),
  kept off the audio listener and world labels so they don't jitter; 8c post
  pass (a chromatic or double-image shader in `PostProcessing`, fully bypassed
  at zero intensity); 8d settings (Off / Normal / Strong) plus reduced-motion
  override; 8e LAN: effect stays local to the drinker.
- Safety rules: no flashing above 3 Hz (photosensitivity); roll amplitude
  capped; wobble frequencies under 0.5 Hz; Off always one click away.

## Fixture plan

- Workstreams 2 and 3: real Electron recordings (console, network, service
  logs) captured before the fix.
- Workstream 4: session view recordings from a two-browser run.
- Workstream 5: a real ElevenLabs response recorded once (with a test key)
  and replayed.
- Workstreams 6–8: production geometry through the rig inspector and
  headless captures; skin/vessel clearance tests reuse `testing/skin-vessel.ts`.
