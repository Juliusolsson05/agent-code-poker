# Room atmosphere: lighting, seated anatomy, outer glass grip, 280° decor

Issues: #7 (glass grip), #8 (lighting), #9 (anatomy), #10 (280° decor).
Base: `origin/main` d37e0eb (0.2.0-beta.2), which already ships mouse look.

## Evidence gathered before writing code

- Rig inspector (`/dev/?studio&seat=1`, Drink, t=2.5s): the opponent's palm
  sits on the glass's inner face and the forearm crosses the chest.
- Rig inspector, whole rig: barrel torso on two flattened ellipsoid thighs, no
  pelvis/shins/feet, humped back, square shoulders, shirt opening is a long
  light bar instead of a V between lapels.
- Seated captures at yaw 0 / ±0.85 (headless Chrome, 1600×1000): the side walls
  are already black planes at the current limit; faces, felt and walls share
  one flat brightness.
- Pinned invariants: `createRoomPlan()` must equal recorded `roomBlocks`
  byte-for-byte; one shadow-casting light; bounded light count; bloom threshold
  4; fire light range asserted; NPC skin/vessel clearance sweeps; exact grip
  and mouth contact; sleeve cannot cross the chair back (z > -.1725).

## Stage 1: NPC glass grip (#7)

Root cause: `poseHuman` rotates the drink by π about Y so the rim faces the
opponent. That also carries the grip anchor to the vessel's inner side.

Fix: keep the vessel unrotated about Y, flip only the rim anchor to the near
side, and rotate the hand-in-vessel frame by π about the vessel's radial X axis.
A cylinder is symmetric under that half-turn about a radial line, so the
offline-fitted wrap stays congruent with the wall (clearance sweeps still hold)
while the palm stays on the outer side. `TableDrink` gains an explicit facing
(`near: 1 | -1`) so the mouth anchor stays a property of the prop instead of
being recomputed in the pose code.

Tests: add a side-of-grip regression, and keep the existing contact/clearance
tests green.

## Stage 2: seated anatomy (#9)

Change only the body sculpt in `Human.ts`; the arm rig, hands and head stay as
they are.
- Torso from landmarks: pelvis (seat), waist, chest, shoulder line with a
  trapezius slope into deltoid caps at the existing `SeatedArm` shoulder.
  Flatter back, no rounded bottom.
- Jacket lapels form a V down to the button point; the shirt shows only
  inside the V.
- Seated legs: thighs from hip to knee (z ≈ .36), shins down to the floor,
  shoes.

Tests: feet on floor, pelvis on the seat, legs clear the table body and the
chair, and the arm invariants still hold.

## Stage 3: lighting (#8)

- `Lighting.ts`: lower the hemisphere, warmer and tighter key pool, weaker
  frontal fill, cooler window, subtle felt bounce.
- Fireplace light: stronger, longer reach, slow breath plus fast flutter.
  Deterministic, and reduced motion freezes it.
- Candles/lamps in the new decor flicker from the room clock.
- Bloom strength up (threshold unchanged); warm haze fog.
- Light budget raised deliberately from 8 to 12 with the reason written down:
  one aggregate practical per newly visible zone.

## Stage 4: 280° field of regard and decor (#10)

- `SeatedLook`: the yaw limit derives from the camera's horizontal FOV so
  that `2·yaw + hFOV = 280°`, never below the old 0.85 rad. Room updates it on
  resize.
- New `environment/Surround.ts` (pure data plan, testable without DOM) plus
  `environment/SurroundDecor.ts` (Three builder with flicker). The old room plan
  is untouched.
- Architecture: rear wall, closed corners, beam ends, wainscoting, wallpaper,
  crown and skirting.
- Left: snowy window with candles and wreath, reading nook (wingback chair,
  lamp, side table, books, blanket, footstool), bookshelf, grandfather clock,
  painting with a picture light.
- Right: sideboard (candelabra, gingerbread house, punch bowl, poinsettias),
  painting, second snowy window, coat rack with coats/scarves/hats, bench with
  gifts, sled.
- Rear: upright piano with candelabra and bench; entrance door with wreath and
  lanterns, doormat, boots.
- Ceiling fairy lights strung across the beams; a rug under the table.
- One point light per new zone (3 in total).

Tests: every eye ray across ±140° hits a finished surface; decor clears the
room plan, fireplace, tree, chairs and table; light budget; flicker is a pure
function of the clock.

## Verification

`npm run verify`, `tsc`, before/after headless captures at yaw 0, ±90°, the
extremes and the rig inspector. Rebuild `dist/` and `lan-dist/` (committed
artifacts).

## Decisions made during implementation

- **Grip (#7):** `TableDrink` authors the near rim per drinker
  (`near: -1` for opponents). The vessel is no longer turned at all.
- **Anatomy (#9):** the chair seat is tall (.62), so thighs rest level and
  flattened on the seat, heels lift and toes touch the floor. A sloped-thigh
  pass cut into the seat, and a horizontal pass with flat feet needed .56m
  shins. The table's 3.0×1.7m under-skirt block is exempt from the contact
  test: no real knee clears it, the pre-existing thighs sat in it too, and the
  tabletop hides it. Side seats' origins sit inside the rail's outer lip;
  that seat-layout overlap predates this work and is only noted, not changed.
- **Light budget:** rig 6 (including felt bounce) + tree 1 + sconces 2 + surround 3 + hearth 1 =
  13, pinned in `tests/surround.test.ts`; still one shadow-casting light.
- **Fire:** 8cd over 7m with ±1.5 breath/flutter (was 1.7cd over 3.2m, which
  never reached a chair).
- **Key light:** moved from behind the player's shoulder to over the table's
  near edge, so opponents' faces get top-down modelling.
- **Window views:** must sit in front of the 13mm masonry finish (a regression test
  pins this after both windows first rendered black).

## Surround quality pass for PR #11

The original surround met the coverage checklist but its large box furniture,
flat canvas pictures and bright snowy cutouts did not match the crafted hearth.
The user asked for fireplace-like warmth, much darker windows, richer walls,
detailed side furniture and a more festive rear wall. Cozy game atmosphere
is the visual target; bright physically plausible winter light is not.

- Keep `createRoomPlan()` byte-for-byte unchanged. Rounded furniture volumes
  live in the pure surround plan and are sampled by `VoxelSculpt` into one
  mesh: tufted wingback leather, rolled arms, cushions, clock crown, piano,
  cabinet insets, bench padding and stockings. Fine joinery, book bindings,
  brass handles, piano pedals, ceramic mug detail and textile hems stay in
  the existing instanced batches.
- Replace wallpaper motifs with individually varied, staggered warm bricks
  over dark mortar, above walnut panels with recessed moulding and grain.
  Rear timber bays, evergreen swags and a framed wreath/stocking hanging
  finish the entrance and piano wall.
- Rebuild the entrance with an opaque rebate, fluted casing, cornice dentils,
  raised panels, recessed glass, hinges, handles, keyholes and threshold.
  The old backing shared its front face with the dado moulding at 60mm,
  causing flashing during camera movement. The new backing covers every
  finish with positive depth separation; a regression test checks this.
- All three windows show dark procedural voxel landscapes with snowy firs,
  layered hills, cabins, footprints, frost and glass reflections. The main
  window has a hanging amber lantern behind its original snowfall. Its
  relief is compressed into the gap between existing panes and snow, leaving
  the pinned room plan and original particles intact. Side snowfall uses
  fewer, dimmer flakes. Snow and flicker follow the room clock and freeze
  under reduced motion.
- Windows use an authored low night luminance. Framed art, music and the
  clock dial use ordinary lit materials, so they cannot become glowing
  monitors. The three aggregate practicals stay warm and localized; there
  is no uniform emissive fill on furniture or walls. Table pendant diffusers
  render as subdued amber glass instead of white ceiling plates.
- No external assets or new lights. The surround, including all three winter
  views, remains within 18 mesh batches. The room retains at most 13 lights
  and exactly one shadow caster. Collision, full 280° coverage, finish depth,
  snow determinism and reduced-motion tests protect the construction.

### Final validation and integration

Committed the surround work before normally merging `origin/feat/room-atmosphere`
with PR #20's drinks/effects. The Room.ts merge preserves its render camera and
label projection as well as the amber pendant change. Rebuilt `dist/` and
`lan-dist/` from source rather than resolving generated bundle conflicts by hand.
The node_modules-path-only comment in `dist-service/lan-host.mjs` is restored.

- 26 focused tests pass after integration: surround, environment, effects and
  post-processing. These include the 13-light/one-shadow budget, pinned room
  plan, closed room rays, clearance, door depth and snowfall regressions.
- `npm run build` passes (typecheck plus SDK, LAN and service builds); both SDK
  contract tests and the exact-byte production preview test pass.
- `npm run verify` was attempted before and after integration. Each run was
  stopped at 120 seconds in the unit-test phase without reporting results.
  The full suite is **not verified** in this pass. Per the user's request,
  do not leave repeated unbounded test runs consuming the machine.
- Fresh source and shipped-production browser captures cover centre, both
  look-around extremes and the ceiling. Production smoke checks exercise
  card inspection, cigar, a legal fold, pause/resume and saved-table restore.
  These are browser checks, not installed Electron acceptance or measured FPS.

| View | Before | After (merged production build) |
| --- | --- | --- |
| Reading nook / piano | [Before](../evidence/room-atmosphere/before-left.png) | [After](../evidence/room-atmosphere/after-left.png) |
| Sideboard / entrance | [Before](../evidence/room-atmosphere/before-right.png) | [After](../evidence/room-atmosphere/after-right.png) |

Also: [main window and hearth](../evidence/room-atmosphere/after-main.png),
[ceiling lighting](../evidence/room-atmosphere/after-ceiling.png).

### Review round (PR #11 surround): mount cost, relief depth, clearance

One adversarial review, four findings, all fixed; no second round.

**F1 — mount-time stall (major).** `new SurroundDecor()` runs synchronously in
the `PokerRoom` constructor. The review measured ~1.5–1.8s on a loaded machine
(furniture sculpt 902ms, windows 566ms, relief 108ms). Re-measured here with a
timing script interleaving a pristine copy of 65516a8 against the fix (node,
5 builds per run, 6 runs, machine load average 3–6):

| Stage | Before (median) | After (median) | Triangles |
| --- | --- | --- | --- |
| Furniture sculpt | 148–198ms | 66–80ms | 61,240 (unchanged) |
| Window landscapes | 135–201ms | 66–82ms | 137,732 (unchanged) |
| Picture relief | 10–15ms | 6–7ms | 8,452 → 10,088 (F2) |
| Whole `SurroundDecor` | ~300–320ms | ~120–160ms | |

Headless Chrome (Vite source, 3 builds): `SurroundDecor` 351/294/254ms before →
152/114/82ms after; furniture 171/155/154 → 55/56/35; windows 163/185/134 → 63/55/44.

Every speed-up keeps the geometry **byte-identical** (hashes of position,
normal, colour and index buffers compared before/after, for the furniture,
windows, and deformable/rigid anatomy sculpts):
- `VoxelSculpt.mesh` answers occupancy from a dense bitset over the cells'
  bounding box instead of `Map.has` on heap-double keys, uses numeric patch
  keys, and allocates nothing per normal sample. This also speeds every
  character sculpt.
- `SnowyWindows` hoists per-window tree tables out of the per-cell sampler
  (~80 `Math.sin` per cell), parses each palette hex once, and writes quads
  straight into the arrays.

Rejected: coarser furniture or fewer window columns (visible loss, and the
lookup cost, not triangle count, was the problem); greedy merges for 25mm
decor (changes smooth-normal shading near rounded edges, for little CPU gain);
deferring the build to an idle frame (the main window view would pop in at
yaw 0, and probe/capture modes need the full room on their first frame).
`tests/surround.test.ts` now pins triangle caps (~3% headroom) and a generous
1s best-of-two build budget.

**F2 — relief parallax did not exist.** Layers 5–12mm apart shared the 25mm
grid, so they collapsed onto one or two planes. They are now authored in whole
grid levels (0/1/2 = one/two/three voxels proud), filled down to the backing
as bas-relief. The backing's front sits exactly on level 0's culled back
face, so there is no z-fight and no see-through slot. A finer relief step
was rejected because it would cost ~4× the cells. Landscape: 2 real planes.
Village: 3. Hound, clock (hands proud of a painted dial) and sheet music: 2.
The sheet-music note heads (7mm) had never landed on a sample; seven one-voxel
heads replace them.

**F3 — clearance test scope.** The test now also audits the mounted scene
graph per instance: sprigs, berries, bows, fairy wire and every glow class,
the pendulum swing (±.08 rad union), each picture's backing and relief, the
side winter views including 60s of snowfall, and `MAIN_WINTER_VIEW`. The main
view is exempt only from room blocks, because it sits inside the pinned window
assembly by design; the snowfall test pins that ordering. A mutation (sag
3.3m) fails it.

**F4 — poinsettia bracts.** Odd (darker) bracts sit 1mm higher, so no two
overlapping, differently coloured bracts share a top plane.
