# Poker experience: observed failures → explicit contacts → verified room

## Current user scope — supersedes older goal-loop boilerplate

The user explicitly narrowed active work to this exact list. Keep older sections
as evidence/history, not permission to resume their omitted work:

1. Stop hand-animation work; focus on the other features.
2. Folded NPC cards land face-down on the table and remain visible.
3. Fix low-resolution chip lettering.
4. Add a dedicated human dealer opposite the player, in the center.
5. Deliberate mouse-look, with performance efficiency.
10. Intoxication only after actually drinking, never ordering/selecting.
11. Proper player/NPC drinking mechanics without resuming hand-animation work.
12. Add a tavern fireplace.
13. Excellent natural fire crackling using licensed recordings.
14. Satisfying realistic chip audio.
15. Include these in staged decomposition and implement autonomously.

Numbering intentionally preserves the user's list; missing numbers are not
inferred requirements. Board placement, snow and general lighting additions
are not active new tasks here. Preserve already-working features. Fireplace
lighting may support its own presentation, not reopen an unrelated room pass.
The existing engine/privacy, save safety, testing, committed bundles and no-merge
constraints remain in force. Hand/contact art is deferred, not approved.

Status: Stage B baseline captured; C/D1 hero ownership/connected reach implemented
and replayed through actual production bones. Fresh source recording confirms
bounded reach and safe interrupted return. D2 block props and safe ordering are
implemented/browser-checked; D3 decor clearances and warm-room candidate are
verified against production geometry and seated/wide browser views. Grip and
character art, transition ownership and final quality/performance remain open.
The September 20 scope addition below makes NPC/player drinking, cigar-to-lip
contact, an optional intoxication filter, a fireplace and high-quality fire/chip
audio explicit unfinished acceptance gates.
Latest feedback also reopens overall hand naturalness and requests a dedicated
center dealer, deliberate mouse-look and readable chip/table lettering (D5/D6).
Scope: issue #1, `feat/voxel-poker`. Anatomy/Christmas art remains provisional,
not an accepted visual baseline. No automatic merge.

Method: Julius explicitly requested `Juliusolsson05/staged-decomposition`, read at
`001b71068cc975b038fb780a367103a8f3f19fa8`. This repository is below its normal
LOC threshold; applying it is intentional because the user requested it and the
repeated contact/appearance patches have not produced a coherent experience.
The user explicitly requested plans followed by autonomous implementation, so
the skill's approval pause is waived, not its evidence or stage boundaries.

## A — concrete starting point

`src/engine/` and its existing rule tests provide the ledger/legal-action source
of truth. `src/scene/Table.ts` provides the current felt geometry. Neither implies
that the room, contacts, motion or appearance is correct. Engine output remains
read-only to graphics; bots never receive another player's private cards.

`FirstPerson.ts`, `Human.ts`, `Arm.ts`, `Drinks.ts`, `Christmas.ts` and `Room.ts`
are the current observable implementation, not trusted geometry contracts.
The user reports detached/unbounded drink reaches, tree/furniture intersections,
uncozy lighting, poor moustaches, missing ordering and an inadequate ashtray.
Earlier real browser inspection exposed paper penetration and elbow gaps.
`tests/anatomy.test.ts` checks some geometry but does not establish visual quality.
The old forearm test may now inspect empty Bone groups: audit it rather than
counting its green result as proof. No final source/production visual or FPS
acceptance exists for the current uncommitted implementation.

## D — observable destination

A seated player can play legal poker, privately inspect cards, order a free
practice drink, reach/grip/sip/return it, and smoke/rest a cigar in a real recessed
ashtray. Arms remain connected, fingers contact rather than pierce props, props
have one owner, and pause/inspection/frame gaps do not duplicate or strand them.
Opponents have connected believable poses, restrained facial hair and private
cards. Drinks, garnish and smoking props are locally authored fine block forms.
The cozy Christmas room has clear furniture/wall separation, warm readable faces
and cards, restrained snow, stable trim and a visible block-built fireplace.
Natural fire crackle and tactile chip sounds complement rather than overwhelm
the room. The game keeps its unobtrusive UI.

Acceptance includes recorded before/after close-ups and seated motion, meaningful
fixture-driven integration tests, measured frame-time/resource comparisons at
the same viewport/quality, full `npm run verify`, and source AND production
browser checks. No claim of perfect art, target FPS or Electron-host verification
without evidence. No paid drinks, real money, assets downloaded at runtime or
changes to the Agent Code host.

## B — record the substrate before changing it

- **Produces:** `src/scene/diagnostics/` opt-in bounded recorder, dev export UI,
  `testing/fixtures/experience/` raw session traces and a provenance manifest.
  Each trace records input kind/order/time, visual clock, pause/inspection/action,
  camera and relevant world transforms, prop parents, viewport/render settings,
  frame timings/draw counts/triangles and errors. No deck or opponent hole cards.
  Four-view production-rig inspector and normal seated screenshots are paired
  with time/subject/action labels; capture a real reach before any replacement.
- **Verified by:** record a genuine browser interaction, export and inspect the
  raw artifact, correlate key events/poses with screenshots, prove recording is
  bounded and absent by default. Synthetic diagnostic unit tests validate the
  recorder, not the game's quality. Preserve the original trace verbatim.
- **Why separate:** changing the animation before capture destroys the failing
  sequence; guesses about world/camera coordinates then become their own tests.
- **Reality check:** the user's named failures plus actual browser sessions of
  D/S/Space, pause and normal betting. Record frequency and missed observations;
  do not label a scripted mathematical sweep as a human/session recording.

## C — catalog observed cases and fix the contracts

- **Produces:** `testing/fixtures/experience/catalog.json` mapping each observed
  case to trace/frame/image evidence, expected semantics, frequency and status;
  `src/scene/interactions/contracts.ts` and `src/scene/environment/layout.ts`
  defining frames, anchors, room envelopes and contact tolerances.
- **Verified by:** every catalog entry resolves to raw evidence; transform chains
  reproduce the recorded failures without rendering; room bounds are checked
  against production geometry, not independently invented rectangles.
- **Why separate:** a wrist solver cannot correct a drink defined in the wrong
  coordinate frame, and a tree transform cannot correct an unknown bar volume.
- **Reality check:** derive coordinate ranges, reach failures and placement
  overlaps from B. Human semantics already supplied: connected arms, no clipping,
  private cards, block props, cozy room, compact UI. Ordering is cosmetic/free
  and cannot debit the poker ledger. Flag genuinely new product choices instead
  of silently inventing them; user need not approve routine engineering choices.

## D1 — isolate and replace interaction ownership

- **Produces:** `src/scene/interactions/` deterministic pose/ownership sampler
  with explicit input/output snapshots, recorded failing regression tests, and a
  single production consumer `src/scene/InteractionDirector.ts`. One owner
  reconciles actions, pause, inspection, camera changes and prop attachment.
- **Verified by:** tests written from B/C fail on the recorded broken reach,
  then pass with bounded reach, continuous contacts, one prop owner and stable
  pause/cancellation. Direct seeking and skipped frames cannot miss transfers.
  Negative controls must detect deliberately detached wrists/duplicate props.
- **Why separate:** `FirstPerson` and `Human` currently improvise trajectories,
  reparenting and grip offsets. More branches there would retain the wrong
  ownership substrate even if one screenshot improved.
- **Reality check:** replay every captured problematic sequence, then record a
  fresh browser run to ensure replay has not concealed integration differences.

## D2 — block assets, ordering and connected characters

- **Produces:** reusable `src/scene/props/` block asset factories with measured
  grip/rim/rest anchors; Old Fashioned/beer/wine/water menu; recessed ashtray with
  cigar rest; corrected production hands, sleeves and restrained facial hair.
- **Verified by:** recorded ordering/sip/return integration sequences; actual
  production meshes in neutral four-view AND seated tavern captures; bounds,
  contact and mesh-budget checks supplement visual judgment. Menu does not
  obscure betting, debit chips, steal shortcuts from text inputs or create a
  second glass during a sip. Dispose replaced GPU resources.
- **Why separate:** art detail must consume correct contact anchors, not conceal
  an ownership bug. Material/mesh changes must be profiled independently.
- **Reality check:** before/after the same captured grip and face frames. Keep
  evidence of remaining anatomical defects; green math tests are not signoff.

## D3 — cozy spatially valid environment

Reopened by September 20 user feedback: the current snow is too faint and the
room still needs warmer, softer glow. Existing geometry-clearance approval is
not cozy-lighting approval. Baseline image `04-36-26-293Z-15.305.png` shows the
window flakes as tiny faint specks; current material uses size .010/opacity .40,
84 points, one draw and cached 24Hz uploads. Increase apparent flake size and
controlled contrast first, not particle count; retain aperture clipping, buffer
reuse and reduced-motion freeze. Compare seated motion and same-window crops
at matched viewport/exposure, with actual frame timings. Do not claim constant
GPU cost merely because count/draws remain fixed: larger sprites add overdraw.

For warmth, record the existing exposure/practical settings, then introduce
motivated amber fireplace/string-light bounce and soft source-local glow. Avoid
an indiscriminate orange screen tint, overexposed skin, luminous cards, flickery
bulbs or additional shadow maps. Match seated and wide views, inspect paper,
faces, dark corners and metal trim, and measure the rendering delta. The
fireplace's lighting belongs to this shared budget, not a second independent
lighting system. Final snow visibility and cozy glow remain open acceptance
gates until fresh visual evidence, not just numerical color changes, passes.

- **Produces:** shared room/furniture/decor placement data, non-intersecting tree
  and presents, coherent warm lighting/material settings, bounded exterior snow.
- **Verified by:** production geometry clearance tests against wall/bar/chair
  envelopes; seated and wide environment images; moving camera check for gold
  trim flicker; readable non-blooming cards and faces. Freeze comparable views.
- **Why separate:** tree placement and light balance need room-level envelopes
  and exposures, not arbitrary local offsets added inside a prop builder.
- **Reality check:** B's intersections and images, not an idealized empty room.
  Light changes reviewed on the actual player view and at close contact views.

## D4 — drinking/smoking contact, intoxication, fireplace and tactile audio (September 20)

### Small HUD slice — always-visible community cards

The user additionally requests table cards always visible in the right corner.
Current `App.tsx` hides its five-card board behind `boardOpen` and the “Inspect
community cards” button; selecting Drinks closes it. This observable UI contract
is the baseline, not an engine defect. Replace that toggle with a persistent,
compact bottom-right public board during every active/saved hand, including pause
and inspection. Keep undealt placeholders, street labels and accessible card
names. The component accepts only the public board, never player/deck objects.
Render-state tests cover preflop/flop/turn/river/reset without inventing cards;
actual narrow/wide browser checks must establish no overlap with the drink
menu, action controls or private cards. Dialogs may cover the room; the board
must not intercept gameplay pointers or create a new bottom dashboard.

This is required scope, not a polish wish list. The user reports NPC drinking
still looks broken and explicitly requests a fireplace, convincing downloaded
fire crackle and satisfying chip sounds. Existing held-contact geometry tests
do not approve a reach/sip/return sequence. `Human.ts` still schedules sips with
mutable history, and `audio.ts` currently substitutes short pitched oscillators
for chips: neither is accepted as the finished experience. The subsequent user
report adds an incorrectly angled cigar that never touches the player's lips,
inadequate player drinking mechanics, and a requested intoxication filter when
drinking. Existing reach/grip tests do not establish either mouth contact.

### B4 — capture these specific starting conditions

- **Produces:** real seated and rig close-up motion recordings covering each of
  the five NPCs reaching, lifting, sipping and returning; glass/wrist/elbow/
  shoulder/mouth world transforms, ownership and visibility alongside pause,
  reduced-motion changes, folding/dealing and long frame gaps. Capture both
  entry/exit transitions, not only the attractive held pose. Preserve the
  current unnatural cardless-hand pose as a separate observation.
- **Player contact baseline:** record complete cigar pickup/puff/return and
  drink reach/lift/sip/return in seated and side-on diagnostic views, including
  interrupted and paused phases. Capture the actual cigar's mouth-end and axis,
  ember end, glass rim, mouth/lip frame and hand transforms. Catalog direction
  error, separation, penetration and missed contact separately; a camera near
  plane is not an anatomical mouth anchor. Preserve the user's reported failure
  as unverified until a real recording confirms its measurable shape.
- **Audio baseline:** capture/listen to current chip actions after a genuine
  user gesture; record trigger time versus visible chip arrival, overlapping
  bot actions, pause/mute/hidden/reload behavior. Record sample format, capture
  route and listening judgment. A screenshot or mocked AudioContext is not
  evidence of audible quality; an unavailable audio capture remains an open gate.
- **Environment baseline:** retain seated and wide views and production room
  bounds before choosing a hearth location. Do not assume an empty wall or
  move existing furniture until its real occupied volumes have been checked.
- **Verified by:** immutable raw files plus provenance, reproducible UI steps
  and a catalog separating each observed defect from an untested suspicion.

### C4 — explicit motion, spatial and audio contracts

- **NPC ownership:** consume one deterministic interaction snapshot for both
  arm and vessel. Table/rest, hand-held and returned are exclusive owners;
  targets share a seat-to-world transform. Capture-derived limits govern reach,
  elbow clearance, rim-to-mouth placement and pose continuity. Specify pause,
  reduced-motion and canceled/late-frame behavior before replacing scheduling.
  A prop must never teleport while visible, duplicate, detach or expose cards.
- **Player smoking/drinking:** define one player mouth frame consistently with
  the first-person shoulder/head frame. The cigar mouth-end approaches the lips,
  ember points outward and remains away from skin; the hand's grip is derived
  from that resolved prop pose, not a separately guessed rotation. The glass
  rim reaches the lips before a sip counts; tilt is bounded and liquid remains
  contained. Contact and orientation tolerances come from actual dimensions.
  In a stable sip/puff interval, mouth contact, supporting hand contact and
  bounded shoulder/elbow reach must all hold simultaneously. If infeasible,
  revisit pose/anchor placement rather than stretch limbs or hide clipping.
  Pause, inspection and cancellation preserve single ownership and a safe
  return; restarting must not double-count the same completed sip.
- **Intoxication:** cosmetic-only, optional, gradual and capped, driven by
  explicit completed-sip events from the PLAYER'S drink owner, never by NPC
  drinking, ordering/selecting a drink, merely holding it, key presses,
  held duration or animation frames. Old Fashioned/ale/wine contribute; water
  does not. Interrupted pre-contact reaches do not count. Decide the visual
  decay/reset contract and document it before implementing; never portray it
  as real blood-alcohol simulation. A reversible mild vignette/color/focus
  treatment may build over successive sips without obscuring cards, bets or
  menus. Do not start with camera roll, double vision, strong blur or flashing.
  Reduced-motion and a separate intensity/off control must support a steady,
  readable view, including disabling it while active. No changes to odds,
  legal actions, bot knowledge, input latency, chips or betting judgment prompts.
  Freeze the effect clock on pause/hidden alongside interaction time. The
  effect consumes public cosmetic sip events, not engine state or private cards.
- **Hearth:** one shared layout envelope owns surround, opening, fire/logs and
  mantle. Test production bounds against walls, bar, furniture, Christmas tree,
  gifts and character reach envelopes; intentional mounting against a wall is
  distinct from protruding through it. Keep the fireplace visible from the
  normal seated camera without adding an obstructive foreground object.
- **Audio:** a cosmetic public-event adapter is the sole gameplay consumer;
  sound cannot mutate the ledger or inspect private cards. Separate chip/card
  effects from ambience gains, preserve global mute, and unlock only through a
  genuine gesture. Deduplicate event IDs; synchronize chip contact sound to
  rendered arrival, never to every animation frame. Bound voices and decoded
  buffers, suspend ambience when paused/hidden, and dispose all nodes on exit.
- **Asset policy:** the user authorizes web audio acquisition only. Prefer CC0;
  otherwise require explicit redistribution/derivative permission compatible
  with this shipped extension, with no account/payment needed. Record original
  URL, author, exact license URL/text, access date, original hash and edits in
  an audio asset manifest; retain required attribution. No ripped video/music,
  ambiguous-license downloads, imported characters or runtime fetching. Bundle
  the licensed audio locally and verify the exact production artifact includes
  it. This is a narrow exception to the earlier all-self-authored asset policy.
- **Verified by:** fixture-derived contract tests with deliberately detached
  wrists, duplicated sounds/props and bad hearth placement as negative controls.
  Synthetic boundary tests supplement, not replace, recorded failures.

### D4 implementation — prove one instance before expanding

1. Fix the player's lip-aligned cigar and full drink sequence, then one NPC's
   full recorded drinking sequence through isolated interaction
   ownership, then apply the verified sampler to every seat and drink. Review
   elbow/sleeve silhouettes and mouth contact in motion from the player's eye.
   Verify approach, stable contact and withdrawal, including cigar orientation
   in side views and glass rim/face separation through tilt, before more detail.
2. Build the block hearth and logs from the verified room plan. Use a bounded,
   low-cost flame/ember treatment and motivated warm light; retain readable
   matte cards, no strobing or added expensive shadow owner. Reduced motion
   uses a calm fire state. Profile with the hearth off/on at the same camera.
3. Audition licensed fire and chip recordings. Fire needs a seamless quiet bed
   with sparse varied crackles, not a conspicuous short repeated loop. Chips
   need distinct light contact, stack/set-down and pot-gather textures, bounded
   variation and believable weight; no piercing tones, constant clatter or
   casino reward fanfare. “Satisfying” means tactile feedback, not manipulative
   reward timing. Handle decoding failure gracefully with silent play available.
4. Isolate audio scheduling/mixing from asset loading and scene presentation.
   Expose compact effects/ambience controls, persist preferences safely, and
   confirm a mute cannot be undone by late decode/resume or tab restoration.
5. Implement the isolated completed-sip effect accumulator and cheap visual
   treatment only after drinking contact/ownership passes. Deduplicate sip IDs,
   clamp intensity, honor off/reduced-motion and use a documented decay/reset
   rule. Compare sober/mid/capped/off views at the same pose; profile its actual
   rendering cost rather than add an unmeasured full-resolution blur chain.

### E4 — integration and perceptual acceptance

- Replay recorded NPC transitions through actual production bones and inspect
  fresh motion for all five seats: attached joints, supported vessel, sensible
  elbow path, clear table/chair/face, uninterrupted private-card concealment.
- Replay player cigar/drink recordings with actual mesh anchors and negative
  controls for a reversed cigar, absent lip contact and duplicated sip events.
  Retain seated plus side close-ups and real motion showing mouth contact
  without face/hand penetration. Test all drink types, successful/canceled sips,
  pause/inspection/hidden transitions, effect cap/decay/off/reduced-motion and
  repeat restoration. Verify readable private cards and action amounts in
  sober, intermediate and capped-effect screenshots. Synthetic effect-state
  tests alone are not approval of comfort, drinking motion or mouth contact.
- Retain seated/wide fireplace images, actual geometry clearance results and
  same-device before/after frame/resource measurements. Budget flame geometry,
  lights, voices and audio bytes explicitly after measuring the first instance.
- Listen to repeated chips, simultaneous actions and at least two fire-loop
  boundaries; record whether seams, clipping, harsh transients or repetition
  remain. Digital peak/loop-boundary analysis is additional evidence, not a
  replacement for listening. Distinguish actual output capture from source-file
  analysis and do not label an unlistened mix approved.
- Test gesture unlock, mute/unmute, independent gains, pause, hidden/resume,
  reduced motion, decode failure and repeated mount/dispose. No duplicate chip
  cue after save restoration and no leaked nodes/background playback.
- Run `npm run verify` and source plus shipped preview flows. Confirm packaged
  assets load without external requests, licenses/attribution ship, and saves,
  engine conservation and private cards remain unchanged. Electron remains a
  separately disclosed check. These gates stay open until recorded evidence
  exists; adding this plan does not claim any implementation or audio approval.

## E — profile, regress and ship the same verified view

- **Produces:** `testing/fixtures/experience/verification.json` with measured
  baseline/candidate frame distributions, draw/triangle/resource counts,
  viewport/device/quality, screenshots and per-case outcomes; updated controls
  docs and committed `dist/`; coherent commits and fully verified PR (no merge).
- **Verified by:** same-device comparisons with warmup and active/idle/hidden
  phases; no unbounded allocations or background render loop; target smooth
  60 Hz on the current machine, report actual p50/p95 rather than promise it.
  Run full verification and actual `/dev/` + `/dev/?production` enter/action/
  inspect/drink/cigar/pause/reload flows. Verify private cards remain private.
- **Why separate:** fewer draw calls alone do not prove smoothness, nor does
  source HMR prove that the committed install artifact is correct.
- **Reality check:** fresh recordings after fixes; keep baseline failures for
  regression. If browser access is temporarily unavailable, continue independent
  work but leave browser gates open rather than manufacture evidence.

## Isolation/import rules

The difficult part is arbitration of transforms, contacts and ownership, not
mesh construction. `interactions/` may depend on math and its own contracts; it
must not import React, engine state, host APIs, DOM, clocks, `Human`, `Room` or
`FirstPerson`. Only `InteractionDirector` imports its runtime API in production;
tests/diagnostics may consume immutable snapshots. Mesh presenters accept one
resolved pose and do not re-arbitrate it. Engine code must not import any scene
module. A structural test enforces these edges. Shared props expose anchors,
not animation policy. The environment layout owns placement envelopes; the
room consumes them instead of duplicating dimensions.

## Unknowns to resolve, not bury

- Actual drink/cigar contact separation and frame-discontinuity magnitudes;
  camera-relative sleeve reach versus a real shoulder-based arm.
- Which interruption sequences fail in practice and how frequently; whether
  inspection should finish returning a held drink or briefly defer inspection.
- Exact production furniture/tree overlap and safe alternative visible location.
- Current GPU versus CPU bottleneck, startup cost and hidden-tab resource use;
  greedy meshing has not yet been measured in the running browser.
- Whether card support, glass wrap and moustache silhouettes remain wrong when
  viewed from the player camera despite the existing geometry tests.
- Browser automation connection availability and clean source/production parity.

## Fixture provenance and stage gate

Stage B creates real recordings through the preview, using isolated `?qa=` saves
so the user's ongoing poker game is untouched. Store raw JSON unedited and pair
screenshots with capture IDs/timestamps; annotate separately. Exclude private
opponent cards and unrelated browsing data. Never replace these with imagined
inputs. Synthetic parameter sweeps are additional mathematical checks and must
be labeled as such. Never weaken a real failing regression to obtain green.

At every stage: verify the named artifact independently, update this status and
issue #1, then proceed. If evidence invalidates the decomposition, revise this
document before more implementation. The goal loop remains active through
unfinished gates; a finite continuation limit is not completion.

### Stage B evidence, 2026-09-20

Two actual isolated Chrome sessions are preserved losslessly in
`testing/fixtures/experience/`, alongside six seated images and three neutral
four-view captures. `manifest.json` describes provenance/measurement limitations;
`catalog.json` maps observed failures to these artifacts. The first session has
1,122 frame samples and 500 pose samples, two accepted drinks, pause/resume,
inspection cancellation, cigar rejection during camera settling, a successful
cigar action and poker betting transitions. No console warnings/errors were
observed in this source session. This is not production acceptance.

Notably, hand/glass contact anchors already coincide numerically during sipping,
but the hero wrist still reaches 1.99m from the camera with no shoulder-based
arm. The next contract must constrain reach/body attachment, not merely anchor
equality. Tree metadata reproduces seven conservative bar-envelope overlaps.
Measured frame p50/p95 is 36/56ms in the instrumented interaction session, not a
controlled benchmark. Recorded facial hair is a floating U-shaped slab. None of
these defects is closed by the recorder or the currently passing math tests.

Stage-B verification exposed a preview substrate defect before the next stage:
`/dev/?production` has no Old Fashioned control although the freshly built
`dist/view.js` contains it, and Chrome warns about multiple Three.js instances.
The adapter eagerly imports source before conditionally importing the production
bundle; Vite's transformed `dist/view.js?import` response is stale. Repair the
preview isolation before treating any production browser run as evidence. Serve
the exact current dist bytes through a dev-only, no-cache flat JS-only endpoint,
and dynamically import only the selected source OR production entry. Verify
byte identity plus visible controls and absence of the duplicate-Three warning.
The browser additionally exposed the SDK's relative shared runtime chunk; the
endpoint and integration test must cover every emitted JS artifact, not only
the entry. No arbitrary paths, nested paths or non-JS files are served there.

### C/D1 implementation slice: hero leisure ownership

Work per recorded case, with the hero drink/cigar sequence first. The recorded
camera z=2.02 places the eyes almost a metre behind the table edge, so a normal
arm cannot reach the existing drink/tray. The candidate calibration moves the
seated eye to z=1.50, establishes a world-space shoulder frame, and moves both
props to the near felt within a 0.57m arm chain. This is a physical-layout
correction, not a longer stretchy arm. Verify the new player view before final
acceptance. Environment tree/bar contracts remain a separate C/D3 slice.

First produce and replay an isolated director without mesh dependencies, using
the recorded command order/visual times. Then integrate that verified output
into the production hero presenter. Keep these two gates distinct: a correct
sampler does not yet fix the rendered hand. All phases are sampled from absolute
visual time so skipped frames cannot omit a prop transfer. Inspection requests
a short safe return before the camera leans; pause freezes the supplied clock.
The right hand never owns the glass and cigar simultaneously. If inspection
interrupts a sip, the cigar may remain safely on the tray until next requested.

The isolated sampler passed the original 500-pose/command replay before hero
integration. The presenter now consumes resolved joints (not a second IK solve),
and an integration replay checks actual sleeve-bone/hand-root coincidence and
the world-space shoulder frame. A dependency test enforces the single director
consumer and excludes browser/engine/mesh dependencies from the ownership core.

Fresh source capture `2026-09-20T03-39-26-621Z` contains 569 poses, three drink
starts, pause/resume while lifting, safe interrupted glass return, inspection
and cigar pickup from the tray. Maximum actual shoulder-to-wrist distance is
0.553774m in the 0.57m arm chain; no reach correction beyond floating-point
noise. A new replay preserves this real mid-sip interruption and checks against
teleporting prop/wrist movement. Four images preserve visible results and the
remaining poor finger/glass geometry. This closes the hero's unbounded-reach
substrate, not overall hand quality, opponent ownership, or final visual signoff.

C/D1 checkpoint verification: `npm run verify` passes 34 tests, TypeScript/build,
two SDK packaging tests and the real preview HTTP integration. Production QA
reproduces interrupted glass return, inspection then immediate cigar retrieval,
legal call 66, pause/resume and reload preserving hand 1 turn, stack 1,914 and
pot 595. Fresh tab reports no console warnings/errors. The new camera makes
the finger ribbons and slab beards particularly apparent; D2 remains necessary.
Candidate frame p50/p95 27.4/31.8ms is NOT a performance comparison because the
camera/workload differs from baseline. Electron-host verification remains open.

### D2 first slice: deforming surface topology

The recorded card-grip side view shows thin open finger ribbons. A new audit of
the actual production hand at 2.5mm resolution fails with 1,492 unpaired triangle
edges in bind geometry. Greedy rectangle T-junctions do not remain coincident
under nonlinear bone blending; the earlier 20mm patch cap did not fix this.
Use a conforming voxel-face lattice for animated hands/sleeves only, preserving
rigid-object greedy meshing. Verify closed edges in actual posed production
geometry, keep a construction budget, then inspect fresh neutral and seated
views. This fixes surface continuity, not yet anatomical proportions or grips.
Do not claim a frame-rate improvement: the correctness fix increases vertices
and must be included in the later controlled performance comparison.

The topology regression now passes for all five actual production hand poses,
as do actual bent sleeves across color seams. The existing no-paper-penetration
test remains green. Production hand cost is 24,872 vertices/12,436 triangles;
sleeve cost 32,600/16,300, still one draw each. Separately, short beards now paint
occupied face cells instead of adding geometry; neutral four-view evidence
`surface-beard-seat1.png` confirms removal of the floating U-shaped plate.
Three fresh inspector images and source session `2026-09-20T03-53-42-707Z`
(728 frames, 240 poses) preserve the result. This session reports frame p50/p95
28.6/31.9ms, CPU submission 5.2/7.8ms; not a controlled benchmark. Full verify
passes 37 tests plus build/packaging/preview gates. Finger silhouettes, convincing
cigar pinch/glass wrap, and face realism remain open despite closed surfaces.

Next D2 work must make block prop dimensions/contact anchors the source of truth
for grip calibration, rather than tweaking fingers around the old cylinder
meshes. Build a recessed ashtray/cigar rest and block glass/liquid/garnish assets,
then fit/verify grips against actual surfaces and expose safe free ordering.

### D2 block props and safe ordering

`props/specs.ts` now owns vessel radii/rims, cigar endpoints and ashtray rest
height; block factories consume the same dimensions as interaction calibration.
All four drinks use a shared lower tumbler/stemless grip profile with different
heights/contents. The director targets each actual rim at the same mouth point.
No transmission render target or per-block draw call is introduced. Liquid,
ice, orange peel, foam, cigar, coaster and recessed/notched ashtray are sampled
block surfaces. A raycast regression caught the first cigar rest 1mm too low;
the support is now calibrated from the actual tray geometry and shared felt Y.

The non-modal Drinks menu never calls the poker engine or save API. The director
rejects replacement during reach/sip/return/inspection, even when bypassing UI;
the presenter swaps one table-owned glass and disposes its owned geometry and
materials. Availability is published to React only on transitions, not guessed
with a timeout. Drink choice deliberately resets on reload, leaving saved hands
untouched. The user requested ordering, not a persistent cosmetic save migration.

Actual source session `2026-09-20T04-02-22-844Z` records all four orders/sips,
pause/resume, interrupted return/inspection, cigar pickup and a legal call.
It contains 2,303 frame samples, 772 poses and six images. A production-mesh
integration replay covers every order, sole glass ownership, disposal, rejected
mid-motion replacements and zero reach correction for all heights. Full verify
passes 41 tests plus build/packaging/preview integration. Source reload retains
hand 1 flop, stack 1,952 and pot 254. No source console warnings/errors observed.
Frame p50/p95 30/33.5ms is an instrumented workload, not controlled FPS acceptance.
Finger/glass wrap and cigar pinch are still visibly awkward; the new assets
establish the surface contracts for that next grip pass, not final art signoff.

Shipped `/dev/?production&qa=props-production` independently verifies all four
menu choices, ale/wine/water sipping, disabled mid-motion orders, pause/resume,
inspection return and cigar pickup. Orders leave the stack at 2,000; call 20
spends only that legal wager. Reload retains hand 1 flop, stack 1,980 and pot
252. No production console warnings/errors observed. Electron host is separate.

### D2 surface contacts and opposite-facing grips

The block props exposed a false invariant: equal attachment anchors did not
mean the skin touched the correct surface. An offline audit of the a661198
glass pose measured over 20mm of penetration, with the palm 38mm away. Preserve
that authored pose as a negative control. `testing/audit-grip.ts` is a disposable-
process, deterministic calibration aid, not runtime IK. Runtime uses static
grip frames/poses. `grip-surfaces.test.ts` measures the entire deformed triangle
projection against conservative voxel-cylinder envelopes, not only fingertips
or sampled vertices. This caught the first cigar candidate that a sparse vertex
audit missed. Supporting fingers must also stay close, with thumb/fingers or
index/middle on opposing sides; moving the prop out of reach cannot pass.

The glass now sits closer to the palm and the thumb opposes the finger wrap.
The cigar has an index/middle pinch and less tightly curled unused fingers.
`HandGrips.ts` is the shared contact-frame source for hero and opponents. A new
cast-wide test failed at 64.829mm wrist/glass separation: opponents face local
+Z, unlike the hero's -Z. Rotating the complete vessel/contact frame to its
near side fixes the reach assumption without changing arm lengths, moving the
coaster, or independently clamping the held prop. All five opponents now retain
contact at 81 samples across lift/sip/return; their actual rim targets the
animated head's mouth rather than a separately guessed height. Their legacy
scheduling/ownership still needs migration and interruption/reduced-motion work.

The studio now isolates the actual hand AND glass together, with an exact-time
numeric control for repeatable contact frames. Three fresh four-view PNGs show
hero glass/cigar and the complete opponent sip. Sleeves are explicitly hidden
only in hand close-ups, never in the complete rig or live game. Finger silhouette
remains angular, the card pose is stiff, and transition collision sweeps are not
yet accepted. Research reference: Blender's official Armature Modifier manual
describes volume loss under ordinary rotational blending; that supports keeping
deformation quality separate from collision tests, not claiming a new volume-
preserving skinning implementation (none was added):
https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/armature.html

Source browser checks include sip/pause/inspection return/cigar, legal call20,
and reload retaining hand1 preflop stack1980 pot70, with no warnings/errors.
The first live trace export did not appear on disk (only its paused-sip PNG did);
do not invent that missing trace. A new actual recording was exported and
confirmed: `2026-09-20T04-23-47-481Z`, 219 frames/155 poses. Its inputs are replayed
through the production hero alongside the original failing baseline. Frame
p50/p95 86.5/140.2ms and CPU submission6.2/8.5ms are poor, uncontrolled samples
on a busy desktop, not a controlled comparison or GPU timing. Performance is
still an explicit open gate. No source/production artwork is called perfect.

Final `npm run verify` passes 46 tests, TypeScript/build, two SDK contract checks
and exact-byte production-preview HTTP integration. The shipped bundle was
independently exercised for sip, interrupted return/inspection, cigar, call20,
pause and reload retaining hand1 preflop stack1980 pot90. No warnings/errors
observed. Three rig PNGs, one seated PNG and the raw trace are committed with
their honest provenance; production screenshots were inspected in CUA only.
Electron host remains unverified. Next gates: grip/ownership transition sweeps,
card-hand/character silhouette, then Christmas clearance/light and controlled
performance profiling (do not carry this poor uncontrolled timing as baseline).

### C/D3 next slice: room contracts before atmosphere

D2's held-contact checkpoint is verified but its transition/anatomy gates stay
open. The independent recorded tree/bar defect can now progress through C/D3:
first reproduce the seven recorded overlaps, then extract the actual room's
block/fixture placement data into a DOM-free environment plan. Test authored
tree/present bounds against those same production blocks and oriented chair
envelopes, preserving the old location as a negative control. Move the complete
tree, gifts and its practical illumination together into a measured clear bay;
do not move furniture just to make a tree assertion pass. Then review warm,
motivated lighting in the seated and wide views, without extra shadow maps or
per-bulb lights. Compare actual images; geometry assertions do not approve
coziness or performance. Preserve source/production smoke/drink/poker checks.

### D3 clearance and warm-room checkpoint

`RoomPlan.ts` now supplies the actual furniture/architecture blocks, practical
fixture placements and signs. Its extraction is checked against every recorded
baseline block, so no furniture was moved to make a tree test green. The old
tree still reproduces seven bar-envelope overlaps as a negative control. The
complete tree and gifts now occupy the bay between the 2.85m counter edge and
4.74m wall face, at 84% scale, with a tested 12cm margin. Shared oriented chair
placements are included in clearance checks. Garland/wreath envelopes exposed
additional bottle/mirror/beam risks; both now have tested 2cm room clearance.
Conservative box overlap is not a claim that every enclosed triangle intersects.

`Lighting.ts` centralizes the warm key, reduced frontal/hemisphere fill, amber
bar bounce and restrained window-blue fill. The tree bounce moved outside the
foliage: its former near-zero-distance light produced the recorded white hotspot.
Small steady bulbs remain instanced emissive meshes; there are at most eight
lights and exactly one shadow owner. Wreath sprigs/berries and a tied bow break
its smooth ring silhouette without per-leaf draw calls. These are visual changes,
not a measured frame-rate optimization. Snow remains 84 soft points in the
window, a reused buffer, capped at 24Hz; reduced-motion buffer stability and long
time aperture bounds are tested independently of game interaction preferences.

The opt-in recorder now provides Wide room / Seated view controls. These move
only the inspection camera; the installed game remains first-person. Actual
source recording `2026-09-20T04-36-26-293Z` retains 196 frames, 87 poses, all three
decor envelopes, wide/seated PNGs, sip/pause/return/inspection/cigar and call70.
A separate raw-bounds integration check confirms the browser used the same room
plan and collision-free decor. A before-lighting PNG retains the tree hotspot;
it is a different animation instant, not a pixel-aligned golden comparison.
The two final canvas exports were opened and inspected, as well as browser UI
views. Warm practicals read clearly and paper stays matte; character shape is
still visibly provisional. No obvious trim flashing was observed during the
inspection/return camera motion, not a general all-camera flicker guarantee.

`npm run verify` passes 50 tests, TypeScript/build, two SDK packaging checks and
exact-byte production-preview HTTP integration. Source reload preserves hand1
preflop stack1930, pot568 after call70 and subsequent bot actions. Production
independently verifies the warm room, held cards/cigar, paused sip, inspection
return, call20 and reload preserving hand1 preflop stack1980, pot90. No console
warnings/errors observed in either; QA left paused. Electron host remains
separately unverified and host fullscreen deferred.

This short mixed-camera session reports frame p50/p95 40.3/79.1ms, CPU submission
5.7/9.2ms. Those are NOT comparable to the prior busy-desktop grip trace or proof
of 60Hz. Next work starts with a controlled warm, same-camera performance
recording and bottleneck isolation, preserving these visual results. After that,
close gesture transition/ownership and hand/card/character silhouette gates;
do not reinterpret the environment checkpoint as overall game completion.

### E1: repeatable render-cost measurement

The warm lobby currently reports about 46 FPS with 3–4ms CPU submission. Record
that real baseline before altering quality. This is not GPU timing. Add an
opt-in, lobby-only fixed-pose A/B/A/B probe with warmup excluded from each timed
window, identical camera/scene, and explicit viewport/buffer/quality metadata.
Its artifact is a raw local JSON download; reject interrupted/hidden/resized
runs rather than interpreting them as faster frames. Verify its timing contract
independently with recorded frame intervals plus labeled synthetic boundaries.

Then isolate render sizing in `rendering/RenderQuality.ts`, consumed only by
Room. Compare the existing 1.25 DPR cap with a 2.5-million-pixel cap, retaining
4x MSAA, materials, shadow resolution and geometry. Tests must use the actual
recorded viewport, while browser images judge the loss of supersampling. Do not
claim equivalent resolution or general gameplay 60Hz from a static lobby probe.
Only adopt a candidate after repeated same-session results and visible card/hand
inspection, then run active source/production and pause/restore checks. Engine,
interactions and React must not import the sizing policy or diagnostic probe.

E1 outcome: actual warm-lobby baseline `04-43-40-879Z` retains383 frames and
102poses (frame p50/p95 21.5/30.3ms), before the fixed-scene protocol. Two raw
profile exports (`04-46-33-937Z`, `04-50-10-044Z`) each hold four full windows,
same2133×1104 CSS viewport, centered seated view, fixed visual time12,300draws
and1,145,166triangles every sample. First non-GPU-query run frame medians:
92.7→76.8ms,77.5→65.1ms. Second sparse-GPU-query run:82.7→66.2ms,75.8→63ms;
p95:99.4→74.4ms,92.4→68.7ms. CPU submission medians6.3–6.5ms in that run.
Strong baseline drift and the large difference from the earlier animated lobby
show desktop/session conditions remain material. These are paired reductions,
NOT general game FPS or a claim that the broader performance gate passed.

The candidate caps scene pixels at2.5M (buffer2197×1137 versus2666×1380 here,
about32% fewer pixels), preserving4xMSAA,2048shadow,lighting/materials/geometry.
HTML controls remain native resolution. No adaptive resolution changes during a
gesture. Sizing has one production consumer, Room. The pure probe retains raw
intervals, excludes warmup and is independently replayed against real intervals;
actual A/B counts/buffers and immutable raw hashes are checked. No CI FPS threshold
is fabricated from these historical recordings.

`&record` exposes the lobby-only probe, aborting hidden/resized/paused/entered-game
runs rather than blessing contaminated windows. `&gpu` separately opts into
sparse asynchronous EXT_disjoint_timer_query_webgl2 samples (one per30frames,
at most8pending, no blocking wait; unsupported/disjoint results aren't invented).
The real second run has15driver elapsed samples101.5–220.3ms, distinct from frame
intervals and not exclusive shader cost. Unit tests cover driver lifecycle with
a labeled fake, not invented GPU performance. Protocol follows Khronos:
https://registry.khronos.org/webgl/extensions/EXT_disjoint_timer_query_webgl2/

Source active trace `04-52-11-274Z` and three PNGs retain279frames/189poses,
sip/pause/resume/inspection return/cigar/call20. Readable cards, warm lighting,
hand edges and paper inspected; angular card fingers/character art remain open.
Source reload returns hand1preflop,stack1980,pot110. Shipped preview independently
checks the same interactions, call59 and reload returning hand1/stack1941;
subsequent observed public pot336 includes Juno's raise178. No warnings/errors
observed; production QA left paused. Electron host remains unverified.
The active trace is still slow: frame p50/p95 70/149.9ms, CPU5.1/8.3ms, with
camera/export/pause overhead. Do not hide this behind the paired percentage gain.

Next: isolate shadows, postprocessing and material cost with the same probe,
including a simpler render pipeline comparison, before trading away any more
fine anatomy or antialiasing. A coherent render pipeline may matter more than
another DPR tweak. D1/D2 ownership/transitions and hand/card/face work stay open.

Final E1 check passes55tests/build/SDK/preview checks. Actual UI negative control
`04-58-59-194Z` starts profiling then immediately changes to Wide room: the raw
export says camera-changed with zero measured frames, not successful performance
evidence. Other guarded abort reasons are not independently browser-recorded.

### E2: isolate pipeline cost before changing the picture

E1's retained paired profiles show a pixel-area effect but poor absolute timing.
Extend the existing probe with a separate five-window ablation: balanced baseline,
bloom disabled, shadows disabled, direct antialiased renderer, repeated balanced
baseline. Keep camera, pose, pixel budget and geometry fixed. Each gets4s warmup
and6s samples; raw mode/count/buffer evidence, not an FPS assertion, is the artifact.
These diagnostic omissions are NOT candidate art decisions. Review measured cost
first, then isolate the production pipeline in `rendering/` if a simpler route
preserves matte cards, warm practicals, stable fine edges and depth in actual views.
Room is the only pipeline consumer; rules/interactions must never import it.
Protect output color/tone mapping, resize, disposal and paused/hidden behavior;
compare source and shipped gameplay after any adoption. Do not lower geometry
detail or remove the one shadow owner merely to hit a synthetic static score.

First ablation `05-03-34-188Z` invalidates a simple winner: balanced baseline
p50 drifts16.7→82.6ms. Do not choose direct rendering from these samples. Preserve
the warm picture and instead remove a demonstrably redundant allocation: the
canvas is multisampled even though only a fullscreen already-resolved composer
image reaches it. Capture identical fixed-pose PNGs before/after disabling canvas
MSAA while retaining the actual scene target's4xMSAA. Pixel comparison and actual
context/target settings verify that boundary independently of unstable FPS.
Isolate the unchanged post chain in `rendering/PostProcessing.ts`; one owner must
resize/dispose its targets and passes. Add a benchmark drift assessment so a
completed run with moving baselines cannot silently be called a fair comparison.

The first fixed PNG pair differs only around two opponents' arms/glasses:
the old diagnostic froze time but inherited stateful sip scheduling. Do NOT
accept its small average pixel difference as pipeline equivalence. Canonical
comparisons must sample the real rig's existing reduced-motion/rest behavior at
time12, independent of prior sip history, on both canvas-context configurations.
Retain the failed pair as an explicit diagnostic negative control. This corrects
test substrate, not the still-open opponent ownership design. Expanded QA buttons
also covered the lobby CTA; move that opt-in panel above gameplay controls.

E2 checkpoint: preserve the real rejected five-window profile and invalid PNG
pair in the manifest. Browser connection interruptions prevented a fresh
canonical pair and updated source/shipped interaction verification. Therefore
canvas-MSAA removal is DEV-only via `&resolved-canvas-aa`; ordinary and shipped
play retain the established canvas setting. The extracted post chain keeps HDR,
bloom and scene4xMSAA. 59 tests/build/SDK/exact-byte preview passed before the
subsequent persistent-board slice; run full verification again before commit.
No new performance or visual-equivalence acceptance is claimed.

### D4a — recorded player mouth-contact correction

Real source recording `05-26-21-152Z` retains667frames/465poses, one complete
smoke and one Old Fashioned sip. Seven puff samples show cigar axis
[.95056,.01946,.30992]: the burning tip points sideways and BACK toward the
eye, not outward over the table. Bite point is [.015,1.335,1.37]; eleven sip
samples use [.005,1.335,1.365]. Attachment passes but these are two invented
mouths roughly13cm forward of eyes[0,1.43,1.50]. This is the wrong calibration
substrate, not a reason to add phase offsets to the hand renderer.

Contract: define one body-local/world-rest lip landmark 95mm below and55mm
forward of the seated eyes (an explicit authored anatomy choice, not a measured
real person). Both props and exhalation consume it. Resolve cigar mouth-end at
that landmark and its +X shaft outward toward negative worldZ; derive the hand
from the existing surface-fitted grip. Glass rim uses the same landmark for
each drink height. First write recorded replay tests for endpoint/direction and
zero reach correction, preserving the old matrices as negative controls. Then
integrate shared calibration without changing ownership clocks, arm lengths,
card transforms or engine rules. Actual presenter and browser motion remain
separate gates: a pure endpoint test cannot approve a silhouette or comfort.

### D2 thumb silhouette reopened from user image

User screenshot `user-thumb-silhouette-before.png` shows the cigar-pose thumb
curling as a raised hook across the palm, with a bulbous base and no visible
thumbnail. This is actual user evidence, not a synthetic golden. Preserve it
and compare the same production hand. The cigar is supported by index/middle,
so the thumb should rest abducted along the palm's side, not oppose an absent
glass. Isolate cigar-pose splay from the necessary glass-opposition pose; flatten
the thenar mound, taper the thumb and add a small dorsal nail for anatomical
readability. Verify existing glass/cigar triangle clearance, closed deformation
and card nonpenetration unchanged. A thumb-tip side-of-palm test protects this
specific pose error, but only actual images can approve the overall silhouette.

### D5 — natural hands, a center dealer and seated mouse-look

**A / evidence:** the user reports that the revised hand still looks unnatural.
The thumb-side correction is a provisional contact fix, NOT anatomy approval.
Preserve the original user screenshot and revised production-rig image.
`Room.look` normalizes cursor position, then uses .11m/.055m look-target offsets
with frame-dependent .045 lerp: parallax, not deliberate looking. `SEATS[3]`
already occupies the opposite center at [0,-1.25]; a new dealer there would
overlap an opponent. Room's existing `dealer` is a button, not a human.

**D / destination:** a relaxed, proportional hand supports the cigar without a
hooked central thumb, rigid extended fingers or wrist distortion. Other grips
remain functional. A distinct fine-block human dealer sits opposite the player
in the middle, with purposeful dealing/collecting gestures. Five opponents stay
players; the dealer has no bankroll, hole cards or turn. Deliberate mouse-look
lets the player explore the tavern and comfortably return to cards/controls.

#### D5-B — capture the actual substrate

- **Produces:** raw source input/camera traces and seated/four-view images under
  `testing/fixtures/experience/`: cigar rest/puff/return, card/drink grips, center
  seating, and cursor movement over scene versus controls. Extend the bounded
  recorder with drag/focus/inspection events before replacing camera input.
- **Verified by:** retained exports with times, viewport and provenance; inputs
  correlate to visible poses and camera matrices. The latest verbal complaint
  is user evidence, not a new screenshot or measured joint angle.
- **Why separate:** another thumb offset cannot establish anatomy; moving seats
  before capture erases the existing framing and collision baseline.
- **Reality check:** user screenshot, revised production rig, actual center
  opponent and real mouse/UI sessions. Mark missing observations unrecorded.

#### D5-C — catalog and isolate the contracts

- **Produces:** catalog cases for anatomical grip posture, dealer-station
  clearance/public events and camera input arbitration. Evaluate finger cascade,
  palm/knuckle proportions and side-emerging thumb with the whole wrist visible.
  Extend shared room layout; redistribute opponent presentation positions while
  preserving engine seat IDs and the rotating dealer button.
- **Verified by:** recorded cases replay against contact/clearance contracts;
  station envelopes fit table/chairs/people/furniture. Menu, pause and focus loss
  outrank look input; inspection and mouth contact have explicit transitions.
  Negative controls catch center overlap, duplicate cards and stuck dragging.
- **Why separate:** rules own dealing, interactions own held props, camera owns
  looking. Mixing them produces duplicate cards or arms chasing the camera.
- **Reality check:** D5-B recordings and existing public hand traces. Unexercised
  edge cases are labeled synthetic probes, not claimed recorded behavior.

#### D5-D — implement behind explicit boundaries

- **Produces:** revised production hand evaluated in existing inspection tooling;
  `scene/dealer/` public-event pose sampler with one dealer-presenter consumer;
  `scene/camera/` deterministic camera arbitration with Room as sole consumer.
  Engine/bots/storage import neither subsystem; hands/props never read raw mouse
  input. Room composes outputs rather than becoming a second gesture owner.
- **Verified by:** tests written from the recorded failures before replacement;
  retain closed skin topology, triangle contacts and bounded shoulder/wrist
  reach. Dealer consumes sanitized public events and the existing card/chip
  presentation timeline, never independently deals, awards chips or gates legal
  actions. Pause, reload and skipped frames cannot repeat transfers.
- **Why separate:** adding an ordinary drinking/card-holding NPC is not a dealer;
  patching camera offsets into each prop and label breaks shared coordinates.
- **Reality check:** implement one cataloged case at a time, then inspect actual
  presenter output; mathematical endpoint tests do not approve hand naturalness.

Mouse-look default proposal: hold left mouse and drag on unobstructed scene
background, not controls or clickable props; retain bounded yaw/pitch on release
and provide explicit recenter. No mandatory pointer lock or camera swing while
choosing a bet. Tune limits/sensitivity in real full-screen and narrow trials;
offer reduced-motion/off behavior and non-drag recenter. Cancel drag on pointer
cancel, blur, pause and disposal. Use elapsed-time damping, not per-frame lerp.
For initial contact safety, sip/puff smoothly recenter before mouth contact and
suspend look until return. Do not pretend a body-fixed mouth follows a turned
head. Inspection saves/restores look intent through the single camera owner.
Head-following contacts would require separately verified neck/reach contracts.

#### D5-E — verify integrated play and cost

- **Produces:** actual source AND shipped QA traces/images/motion inspection of
  grips, dealer actions, look extremes, menus, inspection, sip/puff, pause/focus
  loss and reload. Matched frame/resource profiles bracket the added character.
- **Verified by:** convincing full-hand silhouette and connected wrist without
  prop penetration; a centered distinct dealer without furniture/seat overlap.
  Look extremes cannot expose private card faces. World labels follow anchors
  or hide offscreen; the bottom-right public board stays readable/fixed. Controls
  do not steer the view; recenter/return does not jump. Run full verification.
- **Why separate:** rig stills cannot establish camera comfort; a seventh human
  can materially worsen the already-open active performance gate.
- **Reality check:** recorded real play plus paired fixed-scene profiles, clearly
  distinguished from studio stills and synthetic safety tests.

**Unknowns:** final natural hand silhouette/proportions; center dealer/table bay
and five-opponent spacing; comfortable sensitivity/limits; dealer timing during
fast all-ins and restore; newly visible private-card sightlines; incremental
geometry/shadow cost. Documentation does not solve these. D1–D4/E remain open.

### D6 — readable chip and table lettering

The user reports low-resolution lettering on table chips. First distinguish
chip denomination textures, felt lettering and final render-buffer resolution;
do not assume every blurred mark has the same source.

- **Produces (record):** actual seated and inspection close-ups at known viewport,
  DPR, buffer size and texture settings; retain full image plus labeled crops.
  Audit the production chip/felt texture generation and filtering paths.
- **Verified by:** correlate each reported mark to the real texture and projected
  size. Record texture dimensions, filtering/mipmaps and grazing angle. Do not
  mistake a crop enlargement for additional source detail.
- **Why separate:** blindly increasing global DPR increases render cost without
  recovering detail missing from a texture or fixing oblique minification.
- **Reality check:** current production textures and actual QA captures; latest
  complaint is recorded separately from any still-uncollected close-up.

Then catalog each observed cause and isolate texture creation/quality policy in
the existing chip/table material owners. Write regression checks for confirmed
source-detail or sampler mistakes before changing them. Preserve shared/cached
textures, correct denomination mapping, matte materials and engine-owned chips.
Integrate candidate resolution/filter changes one at a time, compare matched
source/shipped views and measure memory/draw/frame cost. Acceptance is readable
denominations in normal inspection, stable edges at seated grazing angles and
no shimmer/glow regression—not universally pixel-sharp distant tiny text. Final
texture sizes/filter settings stay unknown until this evidence is collected.

Source audit: `Chips.ts` authors each cap at128×128 with28px Georgia numerals;
its CanvasTexture uses no explicit anisotropy. Felt artwork in `Room.ts` is
1024×512 with26px/16px lettering and likewise no anisotropy, whereas card
textures already use the renderer's maximum supported anisotropy. This is a
specific likely grazing-angle blur contributor, not yet an image-proven sole
cause. The2.5M render-pixel cap also limits projected detail; isolate texture
sampling before spending more fullscreen pixels. No lettering fix is claimed.

### Priority override — hand animation paused

The user explicitly stopped hand-animation work after D5/D6 were planned.
Preserve the current tested contact/thumb checkpoint as provisional. Do not
iterate hand art, poses or gesture animation further without a new request.
Continue table behavior, dealer, mouse-look, lettering, room ambience, snow,
fireplace, audio and other non-hand work. D5 hand acceptance remains open/deferred,
not silently passed; necessary future camera/prop integration must not disguise
another hand-animation project.

### D7 — folded cards remain on the felt

**A:** the user sees folded NPC cards disappear through the table. Code confirms
`Human.cards.visible` turns off immediately on fold, while `CardField` starts a
face-down flight from a guessed height and marks it `disappear:true` at .68s.
It is disappearance, not evidence of an actual below-felt vertex. Preserve this
distinction and inspect the real flight before changing the presentation.
**D:** folded cards land face-down above the felt, stay visible in a coherent
discard area, and are only cleared by a visible dealer collection or next-hand
reset. Never reveal folded faces, resurrect held cards or change the ledger.

- **Produces (record/catalog):** actual public fold transitions from retained
  browser traces, a new live fold capture where available, and a catalog entry
  mapping the disappearance to table-card ownership. Record held-to-table
  handoff, flight end, pause/reload and subsequent street transitions separately.
- **Verified by:** fixture replay reconstructs only presentation inputs from
  sanitized public state; private card placeholders are explicitly synthetic
  and must never be requested as face textures. A failing test observes that
  folded paper becomes hidden at flight end in the original implementation.
- **Why separate:** setting a mesh visible is insufficient if an old deal flight
  still owns it or restoration starts a new fold animation from invented hands.
- **Reality check:** the user report, actual public trace events, current
  `Cards.ts` and a fresh browser observation, each labeled by provenance.

Then isolate lifecycle ownership within the existing CardField (Room remains
its sole production consumer). A per-card presentation transfer supersedes any
older flight for that mesh. Folded backs settle in a layered, felt-safe discard
area and survive later state projections and pause; reload restores settled
backs without re-dealing. New hands dispose them once. Add recorded regression
tests plus labeled synthetic timing/restore probes before implementation.
Dealer collection later consumes this same lifecycle; no second set of cards.
Integration gates: source/shipped visible fold landing/retention, no below-felt
corners or coplanar overlapping discards, no private texture request, unchanged
engine/save state and bounded mesh counts across hands. This does not authorize
resuming the paused hand-animation pass.

Frozen hand/contact checkpoint: recorded replay now targets one authored lip
landmark with an outward cigar; thumb side-rest and shallower palm pad are
provisional. `npm run verify` passes65 tests/build/2SDK checks/exact-byte preview.
Three actual studio exports retain the revised silhouette/full sleeves, not
live motion approval. User rejected naturalness and stopped this work; keep it
deferred. Source baseline smoke/sip was recorded; fresh source/shipped contact
acceptance remains open after CUA tab-reconnection timeout. No further hand
changes are part of the next table-card slice.

Continuation9 table checkpoint: real retained events `04-02-22-844Z` capture
seat4/5 folds at20.4149/21.5804s. New tests first fail because paper is hidden on
landing; candidate retains layered backs, cancels stale deal ownership and
restores settled discards immediately. Synthetic fast-fold and reduced-motion
probes additionally guard lifecycle boundaries. No hand animation was changed.

Actual source inspection capture `05-43-43-579Z-40.700.png` is retained as
`table-lettering-before.png` (2137×1169). Felt line stair-stepping is visible;
player100 denominations can already be read, so do not exaggerate the defect.
Candidate doubles chip cap and felt source resolution, retains edge resolution,
mipmaps, materials and draw count, and caps supported anisotropy at8. Estimated
RGBA8+mipmap increment is9.25MiB, NOT a driver-memory measurement or free speedup.
Three's texture reference documents the clarity/sample-cost tradeoff:
https://threejs.org/docs/pages/Texture.html#anisotropy
The pinned r169 sampler code was also inspected. Chip tests verify actual shared
material/texture configuration with a labeled canvas stub, not raster quality.

Full verify passes70 tests/build/SDK/exact-byte preview at this checkpoint.
Source hand entry/inspection and baseline PNG were captured, but repeated browser
timeouts then debugger detachment interrupted follow-up. The user is actively
playing their own tab; do not switch it for QA. Candidate source/shipped fold
landing, matched lettering images and measured sampling cost remain OPEN.
New opt-in recorder metadata includes print configuration and table-card poses
without values/textures, to make the next actual session more diagnostic.

Continuation9 acceptance follow-up supersedes the interrupted checks above:
source `05-52-49-020Z` now retains1151 frames,512 poses,two PNGs and the complete
untruncated raw trace with SHA256 in the manifest. Raise500 yields three folds,
two calls and a flop; six backs remain visibly face-down above felt through
later decisions. A distinct actual-pose assertion complements renderer replay.
Production QA also raises500, observes all five folds/ten backs, inspection,
pause and reload/Return restoring the completed hand and stack2090. Source
reload loses the CUA debugger, so that final source check remains open.

Before/after inspection views share the saved hand and camera, not random chip
rotations/NPC poses; smoother felt lettering is visible, but this is not a
pixel-aligned golden. Actual metadata confirms capped8x filtering and doubled
source artwork. Frame p50/p95 34.1/110.2ms and CPU5.2/9.4ms are instrumented mixed
workload observations, NOT performance improvement. No fresh console export,
Electron verification or hand-motion acceptance. Keep existing quality and
performance gates open; center dealer/mouse-look/fireplace/audio remain next.

Source restoration recovery: fresh isolated tab321804218 loaded the same QA save
after the debugger failure. Return to table restores hand1/flop K♥3♦9♥,
stack1500/pot1550 and six visible folded backs; CUA screenshot inspected, then
left paused. No new trace is claimed for this restoration screenshot. This
closes the source restoration check above, not the console/performance gates.

Final continuation9 verify:71 tests pass, TypeScript/build,2SDK checks and
exact-byte production-preview integration pass. No dependency/lockfile change.

### D5 camera slice — continuation10

Browser baseline instrumentation now records pointer down/up target category
and coordinates before changing input. Fresh CUA recording is unavailable:
the QA tab times out and browser inventory becomes empty. Do not invent that
missing drag trace. Existing05-52-49 raw source evidence contains325 seated
poses with camera yaw -0.01391…0.01899 radians, plus real inspection transitions.
This verifies the tiny parallax substrate, not the unrecorded pointer cause.

- **Produces:** camera baseline catalog, retained-trace measurement test, and
  an isolated `scene/camera/SeatedLook.ts` controller; then a DEV-only `&look`
  adapter in Room. Normal/shipped play keeps its verified camera until live
  input/comfort/privacy/restore checks pass.
- **Verified by:** existing recorded camera/inspection samples plus explicitly
  synthetic drag/cancel/frame-rate boundaries. Tests precede implementation.
  Room is the sole runtime consumer; engine/props/hands/React cannot import it.
- **Why separate:** camera arbitration must not make hands chase the camera,
  accept controls as drag surfaces, or start sipping while turned away. No
  world-space prop or gesture pose changes are authorized by this slice.
- **Reality check:** actual05-52-49 trace and current Room/App code; fresh drag
  and source/shipped browser acceptance remain unrecorded, not synthetic proof.

Candidate contract: primary mouse drag on canvas only, bounded yaw/pitch,
retain angle on release, explicit R/recenter and session-only off toggle.
Elapsed-time damping; no inertia after release. Pause/focus/menu/inspection/
busy leisure cancel drag. Inspection temporarily centers but retains intent;
R or a leisure request discards intent and centers. Sip/puff requests wait until
centered before calling the existing hero API; pause/menu/inspection cancel a
pending request. Reduced motion applies direct input without easing. World
labels project through the live camera and hide outside its frustum; fixed
community cards/controls remain untouched. Do not add a persisted-save field.

Camera implementation checkpoint: seven isolated tests pass (retained real
baseline and inspection/pause inputs plus explicitly synthetic drag/contact
boundaries). The pending-contact contract first failed because the API was
absent; no claim that it reproduced a recorded camera-drag failure. Room consumes
one controller, including one-shot centering requests; App exposes R/recenter,
session off and menu blocking. No hand/arm/prop pose code changed. World-up yaw
avoids unintended roll; label projection reuses a vector, without React frame
updates. Normal/shipped camera remains unchanged behind DEV-only `&look`.

CUA recovered briefly: actual source QA `look-13` entered a fresh hand8♦4♠ and
displayed Recenter view. The subsequent real drag could not execute because the
browser disconnected. No raw export or successful drag/comfort/production
acceptance is claimed from that attempted recording. Continue this precise
browser gate when connected; do not count it as a passing motion test.

Full camera-candidate checkpoint: `npm run verify` passes78 tests, TypeScript,
production build,2SDK checks and exact-byte HTTP preview. Actual source hand
entry/control visibility is the only fresh browser observation; the browser
inventory subsequently returned empty. Production browser verification remains
open. No dependency or lockfile change. Do not enable this candidate by default
until real drag/interruption/restore and camera-extreme privacy checks pass.
