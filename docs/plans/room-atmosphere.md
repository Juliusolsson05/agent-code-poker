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
- **Light budget:** rig 6 (+felt bounce) + tree 1 + sconces 2 + surround 3 =
  12, pinned in `tests/surround.test.ts`; still one shadow-casting light.
- **Fire:** 8cd over 7m with ±1.5 breath/flutter (was 1.7cd over 3.2m, which
  never reached a chair).
- **Key light:** moved from behind the player's shoulder to over the table's
  near edge, so opponents' faces get top-down modelling.
- **Window views:** must sit in front of the 12mm wallpaper (a regression test
  pins this after both windows first rendered black).
