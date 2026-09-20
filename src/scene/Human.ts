import * as THREE from 'three'
import { anatomyMaterial, VoxelSculpt } from './Voxel'
import { SeatedArm } from './Arm'
import { coaster, TableDrink, type DrinkKind } from './Drinks'
import { GLASS_HAND_CONTACT, GLASS_HAND_ROTATION } from './HandGrips'

export const humanMaterial = () => anatomyMaterial(.91)
const PEOPLE = [
  { skin: '#bb8565', shadow: '#916047', hair: '#281b16', jacket: '#202824', shirt: '#b7b2a2' },
  { skin: '#b58b70', shadow: '#986a54', hair: '#30231e', jacket: '#392f28', shirt: '#978877' },
  { skin: '#bca08a', shadow: '#947764', hair: '#59544b', jacket: '#283435', shirt: '#bab5a5' },
  { skin: '#b78b72', shadow: '#8d6150', hair: '#201b1c', jacket: '#46303a', shirt: '#343335' },
  { skin: '#825b47', shadow: '#5d3b2f', hair: '#171515', jacket: '#29323d', shirt: '#b7ae9c' },
  { skin: '#c1a084', shadow: '#9b7760', hair: '#a79a82', jacket: '#3b4037', shirt: '#a49b84' },
]
export type Human = {
  root: THREE.Group; head: THREE.Group; leftArm: THREE.Bone; rightArm: THREE.Bone;
  leftRig: SeatedArm; rightRig: SeatedArm; cards: THREE.Group; eyes: THREE.Group; pupils: THREE.Group;
  drink: TableDrink; drinkHome: THREE.Vector3; seat: number;
  sipAt: number; nextSip: number;
}

/** A seated person is constructed from landmarks and tailored sections, not a
 * pile of shoulder/cheek spheres. Continuous anatomy is authored before sampling
 * into fine blocks; skin, cloth, eyes and hair have independent light response.
 * No anatomy or expressive pose reads private poker state. */
export function buildHuman(seat: number, _geometry: THREE.BoxGeometry, material: THREE.MeshStandardMaterial): Human {
  const p = PEOPLE[seat], female = seat === 3
  const root = new THREE.Group(), head = new THREE.Group(), eyes = new THREE.Group(), pupils = new THREE.Group(), cards = new THREE.Group()
  const skin = anatomyMaterial(.65), hairMaterial = anatomyMaterial(.90)
  const body = new VoxelSculpt(.008)
  body.volume([-.235, .63, -.115], [.235, 1.285, .125], (x, y, z) => {
    const t = (y - .63) / .655, width = .154 + .066 * Math.sin(t * Math.PI * .7)
    const depth = .093 + .013 * Math.sin(t * Math.PI)
    return (x / width) ** 4 + ((z + .006) / depth) ** 4 < 1 && y < 1.285 - .095 * (Math.abs(x) / .215) ** 1.6
  }, p.jacket)
  // The shirt is an inset opening, not a second chest-sized inflated ellipsoid.
  body.volume([-.09, .88, .075], [.09, 1.26, .112], (x, y, z) =>
    Math.abs(x) < .018 + (y - .88) * .15 && z < .104, p.shirt)
  for (const side of [-1, 1]) {
    body.volume([side < 0 ? -.12 : .038, .93, .096], [side < 0 ? -.038 : .12, 1.24, .121], (x, y, z) =>
      Math.abs(Math.abs(x) - (.035 + (1.24 - y) * .22)) < .022 && z < .114, seat === 1 ? '#564637' : '#424644')
    body.ellipsoid([side * .10, .63, .13], [.096, .083, .25], '#222726')
  }
  root.add(body.mesh(material))
  const neck = new VoxelSculpt(.004)
  neck.ellipsoid([0, 1.29, .002], [.043, .083, .043], p.skin); root.add(neck.mesh(skin))
  for (const side of [-1, 1]) {
    const collar = new THREE.Mesh(new THREE.BoxGeometry(.035, .065, .009), new THREE.MeshStandardMaterial({ color: p.shirt, roughness: .9 }))
    collar.position.set(side * .038, 1.25, .070); collar.rotation.z = side * -.40; root.add(collar)
  }
  for (let i = 0; i < 3; i++) {
    const button = new THREE.Mesh(new THREE.CylinderGeometry(.004, .004, .002, 10), new THREE.MeshStandardMaterial({ color: '#77634c', roughness: .55 }))
    button.rotation.x = Math.PI / 2; button.position.set(.019, 1.04 - i * .075, .115); root.add(button)
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
  face.volume([-.087, -.108, -.090], [.087, .126, .084], (x, y, z) => {
    const skull = (x / .081) ** 2 + ((y - .021) / .105) ** 2 + ((z + .008) / .079) ** 2 < 1
    const jaw = (x / .066) ** 2 + ((y + .035) / .070) ** 2 + ((z - .012) / .059) ** 2 < 1
    const front = .066 + .008 * (1 - Math.abs(x) / .081) - (y < -.021 && Math.abs(x) > .036 ? .007 : 0)
    return (skull || jaw) && z < front && !socket(x, y, z)
  }, p.skin)
  for (const side of [-1, 1]) {
    face.ellipsoid([side * .080, -.005, -.006], [.010, .025, .014], p.skin)
    face.ellipsoid([side * .084, -.006, .004], [.0035, .015, .006], p.shadow)
    face.volume([side < 0 ? -.055 : .012, .030, .063], [side < 0 ? -.012 : .055, .048, .081],
      (x, y, z) => Math.abs(y - (.041 - Math.abs(Math.abs(x) - .027) * .17)) < .004 && z < .077, p.hair)
    // Eyelid rims are flesh, not bright rings drawn around an entire eyeball.
    face.volume([side < 0 ? -.052 : .013, .009, .065], [side < 0 ? -.013 : .052, .014, .077],
      (x, _y, z) => z < .075 - Math.abs(Math.abs(x) - .032) * .12, p.skin)
  }
  face.volume([-.016, -.028, .060], [.016, .039, .099], (x, y, z) => {
    const t = (y + .028) / .067
    return Math.abs(x) < .007 + (1 - t) * .008 && z < .093 - t * .023
  }, p.skin)
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
  const drink = new TableDrink(kinds[seat]), drinkHome = new THREE.Vector3(.27, .796, .46)
  drink.root.position.copy(drinkHome); drink.root.rotation.y = Math.PI; root.add(drink.root)
  const mat = coaster(); mat.position.copy(drinkHome); mat.position.y -= .002; root.add(mat)
  return { root, head, leftArm: leftRig.forearm, rightArm: rightRig.forearm, leftRig, rightRig, cards, eyes, pupils, drink, drinkHome, seat, sipAt: -100, nextSip: 4 + seat * 3.7 }
}

export function poseHuman(h: Human, time: number, options: { reduced: boolean; active: boolean; folded: boolean; showing: boolean; hasCards: boolean; dealt: number; action?: string; actionAge: number; gaze: number }): void {
  const { seat, head, eyes, pupils, leftRig, rightRig, drink, drinkHome } = h
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
  if (moving && time >= h.nextSip && !options.active && options.actionAge > 2 && time - h.sipAt > 7) {
    h.sipAt = time; h.nextSip = time + 23 + seat * 3.3
  }
  const sipAge = time - h.sipAt, sipping = moving && sipAge >= 0 && sipAge < 6
  let rightTarget = new THREE.Vector3(.20, .857, .385), rightRotation = new THREE.Euler(Math.PI / 2, 0, -.12)
  rightRig.hand.pose('rest')
  // The hero faces local -Z; an opponent faces local +Z. Rotate the complete
  // vessel/contact frame, not just the wrist, so its near rim and grip remain on
  // the body side. Copying the hero's unrotated frame sent the opponent wrist
  // behind the far rim and hit the reach clamp 65mm before contact.
  drink.root.position.copy(drinkHome); drink.root.rotation.set(0, Math.PI, 0)
  if (sipping) {
    const lift = sipAge < 2 ? THREE.MathUtils.smoothstep(sipAge, .8, 2) : sipAge < 3.3 ? 1 : 1 - THREE.MathUtils.smoothstep(sipAge, 3.3, 4.8)
    const grip = sipAge < .8 ? THREE.MathUtils.smoothstep(sipAge, 0, .8) : sipAge < 4.8 ? 1 : 1 - THREE.MathUtils.smoothstep(sipAge, 4.8, 6)
    head.rotation.x -= lift * .035
    drink.root.rotation.x = -.24 * lift
    head.updateWorldMatrix(true, false)
    const mouth = h.root.worldToLocal(head.localToWorld(new THREE.Vector3(0, -.046, .076)))
      .sub(drink.rim.clone().applyQuaternion(drink.root.quaternion))
    drink.root.position.lerp(mouth, lift)
    // The same local hand/glass frame must apply to hero and opponents. An
    // unrelated Euler wrist rotation matched one point while rotating fingers
    // through the vessel. The prop's rotation transports the entire grip frame.
    const wristRotation = drink.root.quaternion.clone().multiply(new THREE.Quaternion(...GLASS_HAND_ROTATION))
    const contact = drink.grip.clone().applyQuaternion(drink.root.quaternion).add(drink.root.position)
    const wrist = contact.sub(new THREE.Vector3(...GLASS_HAND_CONTACT).applyQuaternion(wristRotation))
    rightTarget.lerp(wrist, grip)
    rightRotation.setFromQuaternion(new THREE.Quaternion().setFromEuler(rightRotation).slerp(wristRotation, grip))
    rightRig.hand.pose('glass', grip)
  } else if (moving && options.action === 'bet' && beat) {
    rightTarget.add(new THREE.Vector3(-beat * .035, beat * .025, beat * .11)); rightRig.hand.pose('push')
  } else if (moving && options.action === 'check' && options.actionAge < .7) {
    rightTarget.y += Math.abs(Math.sin(options.actionAge * Math.PI * 5)) * .013
  }
  rightRig.solve(rightTarget, rightRotation)
}
