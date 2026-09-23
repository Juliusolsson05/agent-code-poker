# Drinks, cosmetic treats and the effect engine

Issues: #13 (drinks), #14 (mushrooms/LSD), #15 (effect engine).
Base: `feat/room-atmosphere` (PR #11, unmerged). This PR is stacked on it.
Backlog: `docs/decomposition/poker-backlog-2026-09.md` sections 6, 7 and 8.

These are one PR because they share the menu, the interaction owner and the
effect engine. Splitting them would mean three passes over the same menu,
`InteractionDirector` and `Room.frame`.

## Boundaries

- Do not touch `src/session/*`, `server/http.ts` or the NPC cigar code (another
  branch adds LAN leisure projection and an opponent cigar rig).
- Do not touch `src/scene/environment/Surround*.ts` (Codex is editing them).
- Treats and effects are local presentation. The poker engine, bots, saves and
  the LAN authority never see them.

## Stage 6: twelve more drinks (#13)

6a. `DRINKS` gains `section`, `alcoholic` and `strength`. `strength` is the
    number of "standard sips" one sip counts as. The original three alcoholic
    drinks stay at 1 so the recorded sip replay keeps the exact tint values.
    The hard-coded `['old-fashioned','wine','beer']` list goes away.

6b. Twelve kinds, all radius .036. Height, liquid colour, translucency and one
    merged garnish sculpt (ice, peel, foam, cream, marshmallows, cinnamon stick,
    citrus wheel, cranberries, bubbles) tell them apart. Hot drinks get a
    separate translucent steam mesh. Budgets stay the same: ≤5 meshes (wall, lip, liquid, garnish, steam), <35k triangles, and solid geometry stays
    inside the rim and radius. Steam is the one exception to the rim bound. It
    is vapour, not a contact surface, so it is tagged `userData.vapour` and the
    bounds test excludes it deliberately.

6c. The menu has sections: "Spirits, wine & beer", "Warm" and "Soft" (plus the
    treats section from stage 7). We deviate slightly from the requested
    "Spirits & wine" label because ale, stout and cider live there too, and a
    heading that hides three items would mislead. Each section is a labelled
    `role="group"`, the item list scrolls inside the card at compact sizes, and
    ↑/↓/Home/End move focus between the native buttons. We do not use an ARIA
    menu role, because we do not implement the full menu focus model.

Tests pinned to four kinds (`lan-leisure`, `props`) are updated with the reason.

## Stage 7: cosmetic mushrooms and LSD (#14)

- `TREATS` in specs: `mushrooms` (a small dish with three voxel caps) and `lsd`
  (a sugar cube on a saucer). The notes are cosmetic flavour only: no doses and
  no real-world information.
- The dish sits on the felt between the ashtray and the coaster. Its home and
  pick slots are shared data, so there is one source of truth.
- `Leisure` gains a `consume` action with its own timeline. Set the cigar down,
  reach, pinch, lift to the lips, consume, return and settle. The same
  single-owner rules apply as for sips: a paused clock never completes it,
  inspection interrupts it and returns the held piece to the dish, and a
  skipped frame still counts once.
- A new `pinch` hand pose (thumb and index pads) is fitted against the real
  deformed skin. `tests/grip-surfaces` gains a pinch clearance test: no skin
  triangle enters the piece envelope, and the thumb and index both support it
  from opposite sides.
- **E** consumes (table focus only), with a matching button when a treat is on
  the table. The same controls exist on LAN.

## Stage 8: effect engine (#15)

- `src/interaction/effects/EffectEngine.ts` is pure (no Three.js, DOM or
  timers) and replaces `DrinkWarmth`. It holds per-source `dose` (what was
  consumed, decaying) and `level` (felt intensity, building toward the dose),
  and advances only by the Room's paused visual delta.
  - Drinks keep the DrinkWarmth maths exactly: +strength/6 per sip, capped at 1,
    fading over 600 s. The edge tint reads the dose immediately (so the sip
    replay test still matches the recorded opacities), while motion builds over
    about 20 s.
  - Mushrooms and LSD have a slower onset and a longer fade.
- `sample(time, reduced)` returns tint, sway and post parameters. It is a pure
  function of state and the visual clock, so it is deterministic and pause
  freezes it.
- Profiles: drinks give warm sway, roll and bob plus a soft double image;
  mushrooms give warm saturation and slow breathing (bob and scale); LSD gives
  slow hue cycling and a gentle wall-breathing UV warp.
- Safety, pinned by tests:
  - every oscillator is ≤0.5 Hz, and no luminance-affecting channel exceeds
    3 Hz;
  - roll is capped;
  - Off clears everything; the settings are Off / Normal / Strong;
  - reduced motion zeroes sway, warp, double vision and hue cycling, leaving
    only a static colour tint;
  - the engine has no path to props or the ledger.
- Room keeps the logical camera for the audio listener, world labels and
  diagnostics. A separate render camera copies it each frame and receives the
  sway. The logical camera is never swayed, so the listener and labels cannot
  jitter.
- `PostProcessing` adds an intoxication `ShaderPass` between bloom and output.
  It is disabled (skipped by the composer) whenever its parameters are zero,
  so a sober frame is byte-identical to before.
- LAN: the table menu gets the same Off/Normal/Strong select. The effect stays
  local, and nothing is sent over the network.

## Verification

- `npm run verify` (tests, both builds, contract and preview tests).
- Rebuild and commit `dist/` and `lan-dist/`. Restore `dist-service/lan-host.mjs`
  if its only diff is a node_modules path comment.
- Headless Chrome captures from the dev preview (port 5304): the sectioned menu
  at desktop and compact sizes, two new drinks held, a treat on the table, and
  the effect at Strong.

## Decisions made during implementation

(appended as they happen)
