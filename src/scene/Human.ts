import * as THREE from 'three'
import { anatomyMaterial, VoxelSculpt } from './Voxel'
import { sculptSeatedBody } from './SeatedBody'
import { SeatedArm } from './Arm'
import { coaster, TableDrink, type DrinkKind } from './Drinks'
import { CIGAR_HAND_CONTACT, GLASS_HAND_CONTACT, GLASS_HAND_ROTATION_FACING } from './HandGrips'
import { glassApproach, NPC_REST_ROTATION, NPC_REST_WRIST } from '../interaction/npc/GlassApproach'
import { cigarRoute, type CigarFrame, NPC_CIGAR_REST, NPC_CIGAR_TRAY_ROTATION, NPC_SMOKE_SECONDS } from '../interaction/npc/CigarApproach'
import { createAshtray, createCigar } from './props/Smoking'
import { ASHTRAY } from './props/specs'

export const humanMaterial = () => anatomyMaterial(.91)
// Ties and trousers vary by person so a row of seated bodies does not read as
// one repeated costume. Seat 3 wears a blouse under the jacket, so no tie.
const PEOPLE = [
  { skin: '#bb8565', shadow: '#916047', hair: '#281b16', jacket: '#202824', shirt: '#b7b2a2', tie: '#5e1f24', trousers: '#1f2321' },
  { skin: '#b58b70', shadow: '#986a54', hair: '#30231e', jacket: '#392f28', shirt: '#978877', trousers: '#2a241f' },
  { skin: '#bca08a', shadow: '#947764', hair: '#59544b', jacket: '#283435', shirt: '#bab5a5', tie: '#23402f', trousers: '#1d2425' },
  { skin: '#b78b72', shadow: '#8d6150', hair: '#201b1c', jacket: '#46303a', shirt: '#343335', trousers: '#221d20' },
  { skin: '#825b47', shadow: '#5d3b2f', hair: '#171515', jacket: '#29323d', shirt: '#b7ae9c', tie: '#6b4a1f', trousers: '#1b2028' },
  { skin: '#c1a084', shadow: '#9b7760', hair: '#a79a82', jacket: '#3b4037', shirt: '#a49b84', tie: '#6a2226', trousers: '#262a24' },
]
/** Head-local lip landmark. The glass rim and the cigar's bite point both
 * meet THIS point, recomputed from the animated head every frame, so gaze and
 * tilt can never open a gap between prop and mouth. */
export const NPC_LIPS = [0, -.046, .076] as const
export const NPC_SIP_SECONDS = 6
export type NpcGesture = 'sip' | 'smoke'
export type Human = {
  root: THREE.Group; head: THREE.Group; leftArm: THREE.Bone; rightArm: THREE.Bone;
  leftRig: SeatedArm; rightRig: SeatedArm; cards: THREE.Group; eyes: THREE.Group; pupils: THREE.Group;
  drink: TableDrink; drinkHome: THREE.Vector3; seat: number;
  sipAt: number; nextSip: number;
  drinkContact?: { phase: string; grip: number; sipAge: number; reachError: number };
  cigar: ReturnType<typeof createCigar>; tray: THREE.Group; smokeAt: number; nextSmoke: number;
  smokeContact?: { phase: string; grip: number; smokeAge: number; owner: 'table' | 'hand'; reachError: number };
  /** The character's own glass, restored when a human hands the seat back. */
  characterDrink: DrinkKind; wantDrink: DrinkKind;
  /** A real LAN player controls this body: ambient timers are suppressed and
   * only projected gestures (requestNpcGesture) animate it. */
  driven: boolean;
  /** One queued gesture that arrived while the hand was busy. */
  pending: NpcGesture | null;
}

// Head-local solids (before the per-seat head scale). The face sculpt samples
// exactly these, and contact tests ask the same functions, so a cigar hand is
// judged against the real skull, jaw and nose instead of a hand-tuned sphere.
const skullAndJaw = (x: number, y: number, z: number) => {
  const skull = (x / .081) ** 2 + ((y - .021) / .105) ** 2 + ((z + .008) / .079) ** 2 < 1
  const jaw = (x / .066) ** 2 + ((y + .035) / .070) ** 2 + ((z - .012) / .059) ** 2 < 1
  const front = .066 + .008 * (1 - Math.abs(x) / .081) - (y < -.021 && Math.abs(x) > .036 ? .007 : 0)
  return (skull || jaw) && z < front
}
const nose = (x: number, y: number, z: number) => {
  const t = (y + .028) / .067
  return Math.abs(x) < .007 + (1 - t) * .008 && z < .093 - t * .023
}
/** Conservative head solid for clearance tests: eye sockets count as filled. */
export const npcHeadContains = (x: number, y: number, z: number): boolean => skullAndJaw(x, y, z) ||
  Math.abs(x) <= .016 && y >= -.028 && y <= .039 && z >= .060 && z <= .099 && nose(x, y, z)

/** A seated person is constructed from landmarks and tailored sections, not a
 * pile of shoulder/cheek spheres. Continuous anatomy is authored before sampling
 * into fine blocks; skin, cloth, eyes and hair have independent light response.
 * No anatomy or expressive pose reads private poker state. */
export function buildHuman(seat: number, _geometry: THREE.BoxGeometry, material: THREE.MeshStandardMaterial): Human {
  const p = PEOPLE[seat], female = seat === 3
  const root = new THREE.Group(), head = new THREE.Group(), eyes = new THREE.Group(), pupils = new THREE.Group(), cards = new THREE.Group()
  const skin = anatomyMaterial(.65), hairMaterial = anatomyMaterial(.90)
  // Landmark-built seated torso, lapels and legs live in SeatedBody so their
  // chair/table contract can be tested without the head and arm rigs.
  const torso = sculptSeatedBody(p, { female, seat }).mesh(material); torso.name = 'seated-body'; root.add(torso)
  const neck = new VoxelSculpt(.004)
  neck.ellipsoid([0, 1.29, .002], [.043, .083, .043], p.skin); root.add(neck.mesh(skin))
  for (const side of [-1, 1]) {
    const collar = new THREE.Mesh(new THREE.BoxGeometry(.035, .065, .009), new THREE.MeshStandardMaterial({ color: p.shirt, roughness: .9 }))
    collar.position.set(side * .036, 1.262, .074); collar.rotation.z = side * -.40; root.add(collar)
  }
  // One jacket button at the V's point and one below it: the buttoned front is
  // what closes the V. The old three shirt buttons floated on the light bar.
  for (const y of [.955, .875]) {
    const button = new THREE.Mesh(new THREE.CylinderGeometry(.0065, .0065, .003, 12), new THREE.MeshStandardMaterial({ color: '#2a221c', roughness: .5 }))
    button.rotation.x = Math.PI / 2; button.position.set(0, y, y > .9 ? .102 : .098); root.add(button)
  }
  const leftRig = new SeatedArm(root, -1, p.skin, p.jacket, p.shirt)
  const rightRig = new SeatedArm(root, 1, p.skin, p.jacket, p.shirt)
  leftRig.solve(new THREE.Vector3(-.14, .975, .31), new THREE.Euler(.12, -.15, .10))
  rightRig.solve(new THREE.Vector3(.20, .855, .385), new THREE.Euler(Math.PI / 2, 0, -.12))
  leftRig.hand.pose('cards'); rightRig.hand.pose('rest')
  leftRig.hand.root.add(cards)

  const face = new VoxelSculpt(.0035)
  // Eye sockets and cheek hollows are removed from the primary volume. Adding
  // ever more skin ellipsoids could only enlarge the old face; it could never
  // produce a cheekbone plane or a recessed orbit.
  const socket = (x: number, y: number, z: number) =>
    ((Math.abs(x) - .032) / .022) ** 2 + ((y - .022) / .012) ** 2 + ((z - .077) / .020) ** 2 < 1
  face.volume([-.087, -.108, -.090], [.087, .126, .084], (x, y, z) => skullAndJaw(x, y, z) && !socket(x, y, z), p.skin)
  for (const side of [-1, 1]) {
    face.ellipsoid([side * .080, -.005, -.006], [.010, .025, .014], p.skin)
    face.ellipsoid([side * .084, -.006, .004], [.0035, .015, .006], p.shadow)
    face.volume([side < 0 ? -.055 : .012, .030, .063], [side < 0 ? -.012 : .055, .048, .081],
      (x, y, z) => Math.abs(y - (.041 - Math.abs(Math.abs(x) - .027) * .17)) < .004 && z < .077, p.hair)
    // Eyelid rims are flesh, not bright rings drawn around an entire eyeball.
    face.volume([side < 0 ? -.052 : .013, .009, .065], [side < 0 ? -.013 : .052, .014, .077],
      (x, _y, z) => z < .075 - Math.abs(Math.abs(x) - .032) * .12, p.skin)
  }
  face.volume([-.016, -.028, .060], [.016, .039, .099], nose, p.skin)
  face.ellipsoid([0, -.021, .088], [.012, .009, .010], p.skin)
  for (const side of [-1, 1]) face.ellipsoid([side * .010, -.028, .085], [.003, .0025, .003], p.shadow)
  face.ellipsoid([0, -.046, .067], [.023, .004, .006], female ? '#925e57' : '#916851')
  face.ellipsoid([0, -.052, .066], [.022, .0035, .006], '#a57965')
  face.volume([-.021, -.049, .069], [.021, -.047, .074], () => true, '#60483d')
  if (seat === 1 || seat === 4) {
    // Close-cropped facial hair follows the occupied jaw, including its sides.
    // The previous rectangular volume floated in front of the chin and looked
    // like a U-shaped strap. Keep the lips/nose bare and soften the color with
    // skin: millimetre-scale stubble is not an opaque helmet on a small face.
    const stubble = new THREE.Color(p.hair).lerp(new THREE.Color(p.skin), seat === 1 ? .34 : .22)
    face.paint((x, y, z) => {
      const cheekLine = -.029 - Math.max(0, .060 - Math.abs(x)) * .55
      const jaw = y < cheekLine && y > -.103 && z > -.028
      const lips = Math.abs(x) < .026 && y > -.059
      const moustache = Math.abs(x) > .004 && Math.abs(x) < .023 && y > -.043 && y < -.034 && z > .054
      return jaw && !lips || moustache
    }, '#' + stubble.getHexString())
  }
  head.add(face.mesh(skin))
  const hair = new VoxelSculpt(.004)
  hair.volume([-.088, -.05, -.095], [.088, .135, .080], (x, y, z) =>
    (x / .086) ** 2 + ((y - .025) / .111) ** 2 + ((z + .014) / .084) ** 2 < 1 &&
    (z < -.030 || y > .077 + Math.sin(x * 24 + seat) * .009 || Math.abs(x) > .075 && y > -.015), p.hair)
  if (female) for (const side of [-1, 1]) hair.ellipsoid([side * .079, -.018, -.035], [.022, .114, .051], p.hair)
  head.add(hair.mesh(hairMaterial))
  const whites = new VoxelSculpt(.0018)
  for (const side of [-1, 1]) {
    whites.ellipsoid([side * .032, .021, .071], [.016, .006, .007], '#a8a596')
    const iris = new THREE.Mesh(new THREE.SphereGeometry(.005, 12, 8), new THREE.MeshStandardMaterial({ color: seat === 2 ? '#65736b' : '#4d4033', roughness: .33 }))
    iris.scale.set(1, 1, .32); iris.position.set(side * .032, .021, .077); pupils.add(iris)
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(.0025, 10, 8), new THREE.MeshStandardMaterial({ color: '#111714', roughness: .23 }))
    pupil.scale.z = .25; pupil.position.set(side * .032, .021, .0785); pupils.add(pupil)
  }
  eyes.add(whites.mesh(anatomyMaterial(.38)), pupils); head.add(eyes)
  if (seat === 2 || seat === 5) {
    const metal = new THREE.MeshStandardMaterial({ color: '#736957', metalness: .6, roughness: .37 })
    for (const side of [-1, 1]) {
      const lens = new THREE.Mesh(new THREE.TorusGeometry(.020, .0014, 5, 24), metal)
      lens.scale.y = .69; lens.position.set(side * .032, .021, .087); head.add(lens)
      const temple = new THREE.Mesh(new THREE.BoxGeometry(.002, .002, .081), metal)
      temple.position.set(side * .055, .024, .045); head.add(temple)
    }
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(.024, .002, .002), metal); bridge.position.set(0, .024, .087); head.add(bridge)
  }
  head.scale.set(female ? .94 : seat === 1 ? 1.04 : seat === 2 ? .94 : 1, seat === 5 ? 1.06 : seat === 4 ? .98 : 1, 1)
  head.position.set(0, 1.405, .004); root.add(head)
  // Drinks are character-specific, while animation cadence is driven by public
  // time/actions only. A sip is never a hidden-strength tell.
  const kinds: DrinkKind[] = ['old-fashioned', 'beer', 'wine', 'water', 'old-fashioned', 'beer']
  const drink = new TableDrink(kinds[seat], -1), drinkHome = new THREE.Vector3(.27, .796, .46)
  drink.root.position.copy(drinkHome); root.add(drink.root)
  const mat = coaster(); mat.position.copy(drinkHome); mat.position.y -= .002; root.add(mat)
  // Every opponent has the hero's cigar and ashtray. The pose (not this
  // builder) owns where the cigar is each frame; this is only the rest.
  const cigar = createCigar(); cigar.root.name = 'opponent-cigar'
  cigar.root.position.set(...NPC_CIGAR_REST); cigar.root.quaternion.copy(NPC_CIGAR_TRAY_ROTATION); root.add(cigar.root)
  const tray = createAshtray(); tray.position.set(NPC_CIGAR_REST[0], NPC_CIGAR_REST[1] - ASHTRAY.cigarRestY, NPC_CIGAR_REST[2]); root.add(tray)
  // First ambient smoke well after the first sip window: never the same beat
  // for every seat, and never inside the <6s probes existing tests pose.
  return { root, head, leftArm: leftRig.forearm, rightArm: rightRig.forearm, leftRig, rightRig, cards, eyes, pupils, drink, drinkHome, seat,
    sipAt: -100, nextSip: 4 + seat * 3.7, cigar, tray, smokeAt: -100, nextSmoke: 17 + seat * 5.3,
    characterDrink: kinds[seat], wantDrink: kinds[seat], driven: false, pending: null }
}

/** When the right hand is next free of BOTH gestures (a sip and a smoke share
 * one hand; overlapping them would teleport the glass or the cigar). */
export function npcHandFreeAt(h: Human): number {
  return Math.max(h.sipAt + NPC_SIP_SECONDS, h.smokeAt + NPC_SMOKE_SECONDS)
}

/** Start a projected gesture that began at `startedAt` (visual seconds; may be
 * in the past so every viewer shows the same moment of it). A gesture that is
 * already over is skipped rather than replayed late; one that arrives while
 * the hand is busy waits and then plays from its beginning. */
export function requestNpcGesture(h: Human, gesture: NpcGesture, startedAt: number, now: number): 'started' | 'queued' | 'finished' {
  const duration = gesture === 'sip' ? NPC_SIP_SECONDS : NPC_SMOKE_SECONDS
  if (startedAt + duration <= now) return 'finished'
  if (npcHandFreeAt(h) > Math.max(startedAt, now - 1e-9)) { h.pending = gesture; return 'queued' }
  begin(h, gesture, startedAt)
  return 'started'
}
function begin(h: Human, gesture: NpcGesture, at: number): void {
  if (gesture === 'sip') { swapDrink(h); h.sipAt = at } else h.smokeAt = at
}
/** The glass may only change while no hand holds it; otherwise a new vessel
 * would appear in the fingers mid-sip. Returns whether the glass is current. */
function swapDrink(h: Human): boolean {
  if (h.drink.kind === h.wantDrink) return true
  const parent = h.drink.root.parent
  h.drink.dispose()
  h.drink = new TableDrink(h.wantDrink, -1); h.drink.root.position.copy(h.drinkHome); parent?.add(h.drink.root)
  return true
}

export function poseHuman(h: Human, time: number, options: { reduced: boolean; active: boolean; folded: boolean; showing: boolean; hasCards: boolean; dealt: number; action?: string; actionAge: number; gaze: number }): void {
  const { seat, head, eyes, pupils, leftRig, rightRig, drinkHome } = h
  const moving = !options.reduced, beat = options.actionAge < 1.25 ? Math.sin(Math.min(1, options.actionAge / 1.25) * Math.PI) : 0
  const peek = moving && options.active ? .5 + .5 * Math.sin(time * 1.1 + seat) : 0
  h.cards.visible = options.hasCards && !options.folded && !options.showing && options.dealt > .98
  const leftTarget = new THREE.Vector3(-.14, .975 + peek * .025, .31)
  if (options.folded || options.showing) leftTarget.set(-.20, .855, .385)
  if (options.action === 'fold' && beat) leftTarget.z += beat * .10
  leftRig.solve(leftTarget, new THREE.Euler(options.folded || options.showing ? Math.PI / 2 : .12 + peek * .14, -.15, .10))
  leftRig.hand.pose(options.folded || options.showing ? 'rest' : 'cards')
  // Attention goes eyes -> head with deliberately different response rates.
  // Public actor position is the only input; no private hand-strength tells.
  const look = THREE.MathUtils.clamp(options.gaze, -.20, .20)
  const idleTilt = seat === 1 ? .035 : seat === 3 ? -.025 : .012
  head.rotation.y = moving ? THREE.MathUtils.lerp(head.rotation.y, look, .055) : 0
  head.rotation.x = moving ? peek * .10 : 0
  head.rotation.z = moving ? idleTilt : 0
  pupils.position.x = moving ? THREE.MathUtils.clamp(look - head.rotation.y, -.003, .003) : 0
  const blink = (time + seat * 1.73) % (4.7 + seat * .31)
  eyes.scale.y = moving && blink < .17 ? Math.max(.08, Math.abs(blink - .085) / .085) : 1
  // Scale around the eye line, not the chin; the old origin-scale moved the eyes
  // down the face during a blink. A stationary eye center preserves the sockets.
  eyes.position.y = .021 * (1 - eyes.scale.y)
  const free = time >= npcHandFreeAt(h)
  if (free && h.pending) { begin(h, h.pending, time); h.pending = null }
  // Ambient timers belong to NPCs only. A seat driven by a real LAN player
  // animates only what that player chose (requestNpcGesture).
  else if (!h.driven && moving && free && !options.active && options.actionAge > 2) {
    if (time >= h.nextSip && time - h.sipAt > 7) { h.sipAt = time; h.nextSip = time + 23 + seat * 3.3 }
    else if (time >= h.nextSmoke) { h.smokeAt = time; h.nextSmoke = time + 34 + seat * 4.1 }
  }
  const sipAge = time - h.sipAt, sipping = moving && sipAge >= 0 && sipAge < NPC_SIP_SECONDS
  const smokeAge = time - h.smokeAt, smoking = moving && !sipping && smokeAge >= 0 && smokeAge < NPC_SMOKE_SECONDS
  if (!sipping) swapDrink(h)
  const drink = h.drink
  let cigarFrame: CigarFrame | null = null
  let rightTarget = new THREE.Vector3(...NPC_REST_WRIST), rightRotation = new THREE.Euler(...NPC_REST_ROTATION)
  h.drinkContact = { phase:'rest',grip:0,sipAge,reachError:0 }
  rightRig.hand.pose('rest')
  // The hero faces local -Z; an opponent faces local +Z. The vessel itself is
  // round and stays unturned: its near (mouth) rim is authored on -Z by the
  // TableDrink facing, and the hand uses the half-turned contact frame. Copying
  // the hero's frame verbatim sent the wrist behind the far rim (IK clamp 65mm
  // short); spinning the whole vessel π about Y fixed the rim but put the palm
  // on the inner face, so opponents held glasses from the inside (#7).
  drink.root.position.copy(drinkHome); drink.root.rotation.set(0, 0, 0)
  if (sipping) {
    const lift = sipAge < 2 ? THREE.MathUtils.smoothstep(sipAge, .8, 2) : sipAge < 3.3 ? 1 : 1 - THREE.MathUtils.smoothstep(sipAge, 3.3, 4.8)
    const grip = sipAge < .8 ? THREE.MathUtils.smoothstep(sipAge, 0, .8) : sipAge < 4.8 ? 1 : 1 - THREE.MathUtils.smoothstep(sipAge, 4.8, 6)
    head.rotation.x -= lift * .035
    // Negative X tips the top toward -Z, the opponent's mouth side.
    drink.root.rotation.x = -.24 * lift
    head.updateWorldMatrix(true, false)
    const mouth = h.root.worldToLocal(head.localToWorld(new THREE.Vector3(...NPC_LIPS)))
      .sub(drink.rim.clone().applyQuaternion(drink.root.quaternion))
    drink.root.position.lerp(mouth, lift)
    // The same local hand/glass frame must apply to hero and opponents. An
    // unrelated Euler wrist rotation matched one point while rotating fingers
    // through the vessel. The prop's rotation transports the entire grip frame.
    const wristRotation = drink.root.quaternion.clone().multiply(new THREE.Quaternion(...GLASS_HAND_ROTATION_FACING))
    const contact = drink.grip.clone().applyQuaternion(drink.root.quaternion).add(drink.root.position)
    const wrist = contact.sub(new THREE.Vector3(...GLASS_HAND_CONTACT).applyQuaternion(wristRotation))
    // During the held interval the original full contact remains exact. Only
    // the coaster-owned acquisition/release path changes; interpolating wrist
    // and curl together used to pass fingers through the glass interior.
    const approach = glassApproach(grip,wrist,wristRotation,drinkHome.y+drink.rim.y)
    rightTarget.copy(approach.wrist);rightRotation.setFromQuaternion(approach.rotation)
    rightRig.hand.pose('glass',approach.grip)
    h.drinkContact = { phase:grip===1?'held':approach.phase,grip:approach.grip,sipAge,reachError:0 }
  } else if (smoking) {
    // The lips are recomputed from the animated head (after this frame's gaze
    // and tilt above), exactly like the glass rim. A lean mid-puff moves the
    // mouth and the hand follows; no stored mouth can drift from the face.
    head.updateWorldMatrix(true, false)
    const lips = h.root.worldToLocal(head.localToWorld(new THREE.Vector3(...NPC_LIPS)))
    const frame = cigarFrame = cigarRoute(smokeAge, lips)
    rightTarget.copy(frame.wrist); rightRotation.setFromQuaternion(frame.rotation)
    rightRig.hand.pose('cigar', frame.grip)
    h.smokeContact = { phase: frame.phase, grip: frame.grip, smokeAge, owner: frame.owner, reachError: 0 }
  } else if (moving && options.action === 'bet' && beat) {
    rightTarget.add(new THREE.Vector3(-beat * .035, beat * .025, beat * .11)); rightRig.hand.pose('push')
  } else if (moving && options.action === 'check' && options.actionAge < .7) {
    rightTarget.y += Math.abs(Math.sin(options.actionAge * Math.PI * 5)) * .013
  }
  rightRig.solve(rightTarget, rightRotation)
  h.drinkContact.reachError=rightRig.wrist.distanceTo(rightTarget)
  // The cigar is placed from the SOLVED hand, never from the route target: if
  // IK ever clamped, the prop would still sit in the fingers (and the test's
  // zero reach error would fail loudly) instead of floating at a target.
  if (cigarFrame?.owner === 'hand') {
    h.cigar.root.position.copy(new THREE.Vector3(...CIGAR_HAND_CONTACT).applyQuaternion(rightRig.hand.root.quaternion).add(rightRig.hand.root.position))
    h.cigar.root.quaternion.copy(rightRig.hand.root.quaternion)
  } else { h.cigar.root.position.set(...NPC_CIGAR_REST); h.cigar.root.quaternion.copy(NPC_CIGAR_TRAY_ROTATION) }
  h.cigar.ember.emissiveIntensity = .3 + 1.5 * (cigarFrame?.ember ?? 0)
  if (cigarFrame && h.smokeContact) h.smokeContact.reachError = rightRig.wrist.distanceTo(rightTarget)
  else h.smokeContact = { phase: 'rest', grip: 0, smokeAge, owner: 'table', reachError: 0 }
}
