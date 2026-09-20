# Poker experience: observed failures → explicit contacts → verified room

Status: Stage B baseline captured and independently inspected; Stage C catalog
written. Interaction/layout contracts and replacement implementation are next.
Scope: issue #1, `feat/voxel-poker`. Existing uncommitted anatomy/Christmas work is
provisional, not an accepted baseline. No automatic merge.

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
and cards, restrained snow and stable trim. The game keeps its unobtrusive UI.

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

- **Produces:** shared room/furniture/decor placement data, non-intersecting tree
  and presents, coherent warm lighting/material settings, bounded exterior snow.
- **Verified by:** production geometry clearance tests against wall/bar/chair
  envelopes; seated and wide environment images; moving camera check for gold
  trim flicker; readable non-blooming cards and faces. Freeze comparable views.
- **Why separate:** tree placement and light balance need room-level envelopes
  and exposures, not arbitrary local offsets added inside a prop builder.
- **Reality check:** B's intersections and images, not an idealized empty room.
  Light changes reviewed on the actual player view and at close contact views.

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
