# LAN visible leisure: see other players smoke and drink

Issue: #16. Backlog: `docs/decomposition/poker-backlog-2026-09.md` §4.
Base: `feat/room-atmosphere` (PR #11, unmerged). This branch is stacked on it
because PR #11 rebuilt the opponent body (`SeatedBody.ts`) and the outer-face
glass grip (`GLASS_HAND_ROTATION_FACING`, `TableDrink` near rim) that the new
cigar rig must sit next to.

## Evidence gathered before writing code

- Remote humans are `buildHuman` NPC bodies (`Room.ts` constructor). Their
  identity follows the authority seat `(display + viewer) % 6`.
- `Human.ts` has no cigar; the NPC sip runs on an ambient timer in `poseHuman`.
- Leisure is local only: `client.js requestLeisure` calls
  `room.smokeCigar()/sipDrink()`; ordering calls `room.orderDrink(kind)`.
- `projectTable` is an explicit allowlist from `GameState`; leisure is not in
  `GameState` and must not be added to it (it is not poker state).
- `HostTable.act` shares one per-member command sequence and the table
  revision with wagers. Anything routed through it would either consume a
  sequence number or bump the revision, which makes every other player's
  in-flight wager `stale`. That is the main reason leisure is a separate method.
- `server/http.ts` persists a checkpoint whenever its serialized form changes;
  keeping leisure out of the checkpoint means a sip never writes to disk.
- The hero's cigar contact (`CIGAR_HAND_CONTACT`, `CIGAR.bite`, the ashtray
  slot height `ASHTRAY.cigarRestY`) is already fitted against production skin
  (`tests/grip-surfaces.test.ts`). Transporting the cigar rigidly with the hand
  frame therefore keeps the held pinch clear by construction; only the route
  onto and off the ashtray needs a new clearance argument.

## Stage 4a — leisure intent in the session

`HostTable.leisure(id, request, { paused })`:
- request shapes are strict: `{action:'smoke'}`, `{action:'sip', kind}`,
  `{action:'order', kind}`; any other key (for example a `seat`) is `invalid`.
  The seat always comes from the authenticated member.
- kinds are checked with `isDrinkKind`, so drinks added to `DRINKS` later work
  without touching this file.
- rejected: unknown/leaving (`unauthorized`), `disconnected`, `waiting` (a
  queued human does not own the body yet — a bot does), `paused`, and
  `rate-limited` (animated actions ≥ 2.5 s apart per member, orders ≥ 1 s).
- never touches `PokerGame`, the bank, the member sequence or `#revision`,
  and is not part of `exportHostCheckpoint` (cosmetic, lost on restart).
- `Options.now` is injected (default `Date.now`) for deterministic tests.

## Stage 4b — public cosmetic projection

`TablePlayer.leisure: { seq, action, ageMs, drinkKind } | null`:
- `null` for bot-controlled seats (including a seat whose human is queued or
  disconnected); renderers keep ambient behaviour there.
- `seq` is table-global, so a new occupant can never repeat the previous
  occupant's number; `ageMs` replaces a host timestamp because the host and
  browser clocks are unrelated. It is capped (60 s) and integral.
- copied field by field in `projectTable` and again in `RoomProjection.remote`
  (which validates with `isDrinkKind` and drops malformed data to `null`).

## Stage 4c — opponent cigar rig

In `Human.ts`, with a pure route helper in `src/interaction/npc/CigarApproach.ts`
mirroring `GlassApproach.ts`:
- Every opponent gets `createAshtray()` + `createCigar()` on the felt at a
  body-local tray home left of the coaster (between the card hand and glass).
- The cigar lies in the tray slots with the ember toward the glass side. The
  hand frame equals the cigar frame (as for the hero), so the held pinch is the
  fitted `CIGAR_HAND_CONTACT`.
- Route: rise from the rest wrist → travel above a point just past the ember
  end, forming the pinch in free air → descend beside the tray → slide along
  the cigar axis until the pinch reaches the cigar (an infinite-cylinder
  clearance proves sliding along the axis cannot enter the skin) → take
  ownership → lift → raise to the animated lip landmark → puff → reverse.
- Smoke frame: shaft forward (+Z), slightly outward and down, as the hero's.
  The bite point is computed from the ANIMATED head every frame, exactly like
  the glass rim, so gaze/tilt cannot open a gap.
- Ember brightens during the puff. Exhale particles are not added (limit).
- Human seats: `Room` feeds projected events (`seq` change → start at
  `now - ageMs`); ambient sip/smoke timers are suppressed for driven seats.
  A gesture arriving while the other one runs starts when the hand is free.
  The glass is replaced only while the hand is not holding it.
- Bots: the existing ambient sip, plus a slower ambient smoke that never
  overlaps a sip.

Tests: bite point at the lip over the whole puff for every seat and a turned
root; `reachError` zero throughout; finger skin vs cigar clearance through the
approach and hold (skin-vessel style, cigar axis mapped to the vessel axis);
hand skin outside the head volume; wrist/elbow and forearm skin never cross the
midline or enter the torso volume (`SeatedBody` exposes its torso predicate).

## Stage 4d — LAN wiring and two-browser acceptance

- `POST /api/leisure` with the same auth, origin, 4 KB cap and pause gate as
  `/api/action`. It answers a small receipt, not an envelope, so it cannot
  reorder or obsolete a concurrent wager response in `ResponseOrder`.
- Client sends after the local room accepts (never instead of it) and does not
  use `run()`/`pending`, so smoking never disables betting controls. A
  mismatch between the projected own `drinkKind` and the local glass (e.g.
  after reload) is healed with one throttled `order`.
- Acceptance: `npm run lan -- --memory-only`, two headless-Chrome sessions via
  CDP, A smokes/sips/orders, B's captured pose diagnostics and screenshots show
  that seat's body doing it.

## Decisions made during implementation

(Updated as the work proceeds.)
