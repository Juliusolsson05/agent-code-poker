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

- **Human seats are never `null`.** A human who has not gestured yet projects
  `{seq: 0, action: null, ageMs: null, drinkKind: null}`. Without that, the
  renderer cannot tell a real person from a bot and would keep playing ambient
  sips on a player's avatar. `null` means bot-controlled only (no human, or
  queued / disconnected / leaving, the same rule `tick()` uses).
- **Sip carries its kind.** `{action:'sip', kind}` records what the player is
  actually lifting, so a viewer who missed the order still shows the right glass.
- **`seq` is seeded from the host clock** (`max(prev + 1, now)`). Leisure is
  volatile, so a host restart resets the counter; a clock-seeded seq keeps a
  post-restart gesture from equalling one a browser saw before and being skipped.
- **Pickup route changed from the plan (4c).** Sliding along the cigar axis
  does not work: the fitted pinch has one finger under the shaft, and any axial
  or sideways approach pushes it through the tray wall. A cigar with its grip
  outside the rim would be a cantilever that tips. The final route rests the
  cigar across both notches (the hero's rest) and lifts it from above with the
  fingers pointing down (a flexed wrist, palm to the body). Relative to the
  hand, the cigar then enters between the finger pads from the tips. The swept
  clearance is measured on production skin for every descent (min 1.27mm, with
  a palm-first negative control). The fingertips dip 6.6mm into the open well.
- **Tray placement.** Right of the glass is out of reach or inside the glass
  for that grip. In front of the body at `(.05, .41)` it is an easy .51m reach
  and clears the resting hand and the coaster. Known limitation: chip stacks
  are laid out in world space and there is no spot in front of an opponent
  that clears every seat's stack. The coaster and resting hand already overlap
  some stacks; fixing that means moving the stack anchors, a separate change.
- **Smoke frame rolled 38° about the shaft.** The mirrored hero frame put the
  heel of the hand ~1300 skin vertices into the upper chest. A sweep over
  shaft direction and roll (hand vs torso, head and midline; seats 1/3/5; three
  gazes) found a clear region. The chosen point `(.20,-.05,1)`, roll .66 rad,
  sits in its middle. `seatedTorsoContains` and `npcHeadContains` are now
  exported from the sculpts they define, so the tests ask the real surfaces.
- **No exhale particles on opponents** (limit, as planned).
- **Acceptance harness traps.** SwiftShader renders the room at 2.5fps; a
  screenshot then blocks the host's page for ~20s, its lease expires and the
  table pauses (looking exactly like refused leisure). `captureScreenshot`
  loops also slow the watcher's visual clock (Room caps dt at .1s). The harness
  uses Metal plus `Page.startScreencast`, and measures sender-to-host latency
  from Node. Recorded run: accepted 140ms after the key press; the watcher's own
  read had it 213ms after the press; the watcher's screen shows the puff at
  2.6-3.4s, matching the 2.54-3.54s the timeline predicts.

## Review round (PR #21)

- **Broadcast only on a real start.** With mouse-look, S/D only queue a
  gesture until the view re-centres. The client used to broadcast on request,
  so an interrupted queue (pause, hand end, panel, inspection) was shown to
  everyone. Now `LeisureStarts` (camera/, next to SeatedLook) is the only place
  that starts a local gesture, and `Room.onLeisureStarted` fires only on a
  real start. Tested against the real SeatedLook; the two-browser run has an
  interrupted smoke that never reaches the host.
- **One spacing rule.** `GESTURE_SECONDS` in props/specs is the only source of
  gesture lengths. The hero reads it through `Calibration.durations` (the
  interactions core may not import props). Opponent sip and smoke timelines are
  scaled to it: the smoke went from 5.8s to 3.6s and the sip from 6s to 5.35s,
  with clearances re-verified at the new speed. The host refuses a new gesture
  (`busy`) while the previous one is within its length minus 250ms of jitter.
  An honest client can't overlap its own gestures, so a real one is never
  refused (except after a local interruption cut one short: then the next is
  missed, never a phantom). Remote copies never outlast their originals, so
  chains don't drift. The pending slot is a FIFO that keeps each gesture's own
  start, and a start is never earlier than the moment the hand is free.
- **Orders never hide a gesture.** The per-seat record keeps the last animated
  gesture (`seq/action/ageMs`) separate from `drinkKind`, and `action` no
  longer has an `order` value.
- **Wall-time anchoring.** `RemoteLeisure` records each new gesture's wall-clock
  start and converts it only in a rendering frame. A gesture that finished
  while the tab was hidden or paused is dropped rather than replayed.
- **Random seq start** (32-bit), no longer the host clock.
- **Follow-up, not changed here:** the HTTP host's request rate bucket is global
  to the table (200 per 10s across every client). It predates this work.
