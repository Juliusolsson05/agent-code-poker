# Agent Code Poker

Visibility correction: the user could not see the fireplace because it required
the source-only query flag. The candidate and its licensed audio now appear on
ordinary `/dev/` without flags; only production remains gated pending acceptance.
No save migration or poker-state change. Older opt-in notes below are historical.

New backlog addition (planning only): LAN host/join by lobby code; exactly six
playing seats with humans replacing NPCs and NPCs filling the remainder; display
name entry; self-authored player character models; per-client presentation that
always places the local human at the existing first-person seat; fictional-chip
bank rebuys with tracked fictional debt. Dealer remains separate from six seats.
See the top of `docs/decomposition/poker-experience.md` for numbered requirements,
privacy/accounting contracts and unresolved rules. Current runtime stays local;
this request does not yet start networking or resume hand-animation work.

Latest user scope overrides the broad goal-loop text: stop hand-animation work;
retain folded backs on felt; readable chip lettering; center human dealer;
efficient deliberate mouse-look; actual-drink-only intoxication; proper player/
NPC drinking mechanics without hand-animation iteration; fireplace; licensed
natural fire audio and realistic chip audio; autonomous staged implementation.
The exact numbered list is at the top of `docs/decomposition/poker-experience.md`.
Preserve other existing features, but do not re-add omitted wishlist items.

Latest fireplace direction: larger and offset on the main back wall between the
future dealer and another player, not centered behind a torso or on a side wall.
The source-only `&fireplace` candidate widens it to2.21m atx1.4 with a matching
bar opening. Creator Assets' YouTube fire loop is downloaded from its official
CC0 endpoint and wired locally with pause/mute/focus gates. Initial native-CUA
centered view exposed occlusion; latest offset framing/listening/source-shipped
acceptance remain open. Hand-animation work remains paused.

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

The initial repository is private. All chips are free practice currency. There are no runtime network calls, accounts, purchases or requested host permissions. The September 20 audio addition permits licensed web-sourced fire/chip recordings bundled locally with provenance and attribution; procedural characters/props remain self-authored. Rules use TDA betting/settlement conventions where applicable; physical casino procedures are represented by legal UI actions.

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

D3 now uses a shared production room plan, tests the original seven tree/bar
overlaps, and verifies positive clearance for tree/gifts, garland and wreath.
Warm-room source/production views and a wide diagnostic capture are retained.
50 tests and packaging/preview checks pass. Next prioritize controlled runtime
profiling; current mixed-camera timings are not a performance acceptance. Hand
silhouette, gesture transitions and opponent ownership remain open in D1/D2.

E1 now retains warm source baseline, two fixed-view A/B/A/B profiles and active
source evidence. A 2.5M-pixel render cap retains geometry, shadows and4xMSAA,
reducing measured buffer area about32%; repeated median frame improvements are
real but insufficient. Poor active frame delivery remains an open gate, not a
60Hz claim. Continue with controlled shadow/material/postprocessing isolation,
then close ownership and anatomical presentation; do not endlessly lower detail.

September 20 scope addition: D4 in the staged decomposition now explicitly
requires complete NPC drink-transition recordings and ownership fixes, a
spatially verified block fireplace, natural fire crackle and tactile chip audio.
Follow recording → catalog/contracts → isolated implementation → integration
and listening evidence. Preserve existing mute, add separate ambience/effects
gains, bound voice/resource cost, bundle only redistribution-cleared assets and
verify shipped offline loading. This is planned work, not completed audio/art.
The user's follow-up also requires actual cigar mouth-end/lip alignment (not
only a near-camera hand pose), proper rim-to-mouth drinking, and a gradual,
optional cosmetic intoxication effect from completed alcoholic sips. D4 now
specifies contact/orientation evidence, single sip-event ownership, bounded
readable effects, reduced-motion/off controls and unchanged poker rules.

Latest user feedback reopens whole-hand naturalness despite the provisional
thumb correction. D5 stages a dedicated center dealer and intentional bounded
mouse-look; D6 investigates blurry chip/table lettering. Keep five opponents
and engine seat/button semantics; replan the occupied center presentation seat.
Record current hands, seating, mouse/UI behavior and lettering, then catalog
contracts before implementation. No camera-driven detached props or private
card leaks. These additions are planned, not shipped; actual source/production
visuals and measured resource cost remain required acceptance gates.

User priority override: STOP hand-animation iteration now. Preserve the current
tested checkpoint as provisional; do not continue D2/D5 hand art unless asked.
Proceed with the other requested work. D7 records/fixes folded NPC cards that
vanish instead of remaining face-down on the felt, and connects their eventual
collection to the planned dealer presentation without changing poker rules.

Continuation9 table checkpoint: folded backs now remain above felt, with single
flight ownership, restored settled discards and reduced-motion coverage. Chip
cap/felt artwork is2x with bounded anisotropic sampling and shared textures.
Actual source trace/PNGs and source/shipped action-inspection-restoration checks
are retained;71 tests/build/SDK/exact-byte preview pass. Hand work stays paused.
Dealer collection, center dealer, mouse-look, fireplace/audio, warmer glow,
noticeable snow and measured active-play performance remain open in D4-D7/E.
