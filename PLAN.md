# Agent Code Poker

Refs #1. Deliver a standalone API-v2 extension: six-seat No-Limit Texas Hold’em against five local opponents in a spacious, procedural block-built 3D card room.

1. Build a deterministic, UI-independent poker engine and exhaustive five-card evaluator used for best-of-seven hands. Protect legal betting, heads-up order, full-raise reopening, side pots, ties, odd chips, and conservation with behavioral tests and simulated tournaments.
2. Give bots only their own cards and public observations. Estimate strength from sampled unseen cards; vary risk and bluff frequency by character.
3. Build an immersive seated/near-first-person dark bar, not an overhead diorama. The user explicitly rejected chunky toy figures: use tiny voxels to model anatomically proportioned humans, detailed faces/hair/hands/clothing, warm practical lights and cool background light. Keep the table in the foreground, opponents at eye level, and controls visually secondary. Keep frame animation separate from rules and honor reduced motion. This is a desktop seated perspective, not headset/WebXR support.
4. Build the complete experience: lobby, table, action controls, raise sizing, opponent turns, street transitions, showdown, results, history, settings, pause and saved session restoration. Persist completed decisions, including the active hand, so closing a view cannot erase a wager.
5. Package independent runtime/view modules with the pinned SDK and committed bundles. Target 1100 × 800 natural content, within the host’s present width ceiling, scaling through the host on smaller displays.
6. Verify engine behavior, typecheck, production artifacts and browser interactions/screenshots; inspect host integration, then commit and open a PR linked to #1. Merge requires explicit user approval.

Visual feedback expanded the current pass: matte non-blooming paper, first-person held cards and cigar with S-key puff, concealed opponent card fans, action-driven gestures and dealing, denomination-correct animated bankroll/bet/pot transfers, chair-local arm-clearance checks, and multisampled postprocessing to address voxel shimmer. Continue refining character anatomy and motion through the live preview; do not equate passing rules tests with finished art direction.

The live website now fills the viewport with compact contextual betting controls; host fullscreen remains deferred. The next interaction pass adds a held-key/clickable inspection view for the player's cards and chips. Establish shared table geometry and raycast-tested card clearance first: the old seat multiplier placed player table cards inside the rail, whose gold boxes also shared planes with the wood. Three independent Claude reviews cover rules, rendering, and interaction design while these corrections proceed. Character asset strategy remains undecided; drinks and cigar interactions will need explicit hand ownership and interruption rules rather than overlapping cosmetic animations.

The user approved the research-led rebuild on September 19. Keep characters self-authored and procedural: anatomical landmarks and tapered volumes first, fine block surface second. Rebuild articulated hands with separate card, cigar, glass, push and resting poses; establish grip contacts and exclusive prop ownership before arm motion. Prove one hand and one seated character before expanding the cast. Add purposeful public-event gaze, private card handling, varied opponent drinks and a player Old Fashioned. Improve materials and motivated bar lighting without making cards luminous. Preserve the fullscreen minimal HUD and engine-owned chip ledger. Verify interruption/pause, private textures, chair/table clearance, animation continuity, source and production previews. No downloaded models or automatic merge.

The initial repository is private. All chips are free practice currency. There are no external assets, network calls, accounts, purchases or requested host permissions. Rules use TDA betting/settlement conventions where applicable; physical casino procedures are represented by legal UI actions.

Keep the rationale near the implementation. The engine owns chip amounts and legal actions; rendering never moves money. Storage failure must be visible and must not silently replace saved progress.

September 20: the user requested a long-running autonomous goal loop and the
staged-decomposition skill. `docs/decomposition/poker-experience.md` is now the
active staged plan. The loop is active; there is no approval pause between
stages and no merge authorization. Current anatomy/Christmas work remains a
provisional substrate. Two real browser traces and nine screenshots establish
the failing baseline: unbounded detached hero reach, bar/tree overlap, flat
facial-hair slab, poor bent fingers, and slow frame delivery. Preserve these
recordings while isolating ownership/coordinates, building the drink menu and
block props, and validating layout, lighting and measured performance.

The next verified D2 checkpoint fits glass/cigar poses against actual skin
surfaces and shares contact frames across the cast. A failing opponent reach
test exposed wrong-side seat coordinates; the corrected vessel frame avoids
clamping without stretching arms. Exact-time four-view inspection, real source
trace and shipped-preview checks preserve this progress. This does not close
the broader anatomy/transition, Christmas layout/lighting or performance gates;
continue from the detailed decomposition's surface-contact checkpoint.
