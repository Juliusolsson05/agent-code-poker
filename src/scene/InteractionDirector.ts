import { Euler, Matrix4, Quaternion, Vector3 } from 'three'
import { Leisure } from './interactions/Leisure'
import type { Calibration, Quat } from './interactions/contracts'
import { PLAYER_LAYOUT } from './environment/layout'
import { CIGAR, drinkAnchors, isDrinkKind, type DrinkKind } from './props/specs'
import { CIGAR_HAND_CONTACT, GLASS_HAND_CONTACT, GLASS_HAND_ROTATION } from './HandGrips'

export type { InteractionPose } from './interactions/contracts'
const rotation = (x: number, y: number, z: number): Quat => new Quaternion().setFromEuler(new Euler(x, y, z)).toArray()
const basis = (x: Vector3, y: Vector3, z: Vector3): Quat => new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(x, y, z)).toArray()

/** Single production boundary for the ownership sampler. Renderers consume its
 * resolved poses rather than reaching into phase timers. Calibration lives at
 * this boundary so replacing a glass shape means updating its anchors, not
 * teaching every actor about another set of wrist offsets. */
export class InteractionDirector {
  readonly calibration: Calibration
  private leisure: Leisure
  constructor() {
    const trayRotation = basis(new Vector3(-1, 0, 0), new Vector3(0, 0, -1), new Vector3(0, -1, 0))
    const smokeRotation = rotation(-.39, -.30, -.10)
    const handCigarContact: [number, number, number] = [...CIGAR_HAND_CONTACT]
    const bite = new Vector3(...CIGAR.bite).add(new Vector3(...handCigarContact)).applyQuaternion(new Quaternion(...smokeRotation))
    this.calibration = {
      shoulder: [...PLAYER_LAYOUT.shoulder], armLengths: [.285, .285],
      rest: { position: [...PLAYER_LAYOUT.rest], rotation: rotation(-.34, -.45, -.40) },
      cigarHome: { position: [...PLAYER_LAYOUT.cigar], rotation: trayRotation },
      drinkHome: { position: [...PLAYER_LAYOUT.drink], rotation: [0, 0, 0, 1] },
      drinkMouth: { position: [.005, 1.245, 1.32], rotation: rotation(.24, 0, .08) },
      smokeHand: { position: new Vector3(.015, 1.335, 1.37).sub(bite).toArray(), rotation: smokeRotation },
      glassHandRotation: [...GLASS_HAND_ROTATION], handGlassContact: [...GLASS_HAND_CONTACT], glassContact: [.032, .040, 0], handCigarContact,
    }
    this.leisure = new Leisure(this.calibration)
    this.calibrateDrink('old-fashioned')
  }
  private calibrateDrink(kind: DrinkKind): void {
    const anchors = drinkAnchors(kind)
    this.calibration.glassContact = anchors.grip
    this.calibration.drinkMouth.position = new Vector3(.005, 1.335, 1.365)
      .sub(new Vector3(...anchors.rim).applyQuaternion(new Quaternion(...this.calibration.drinkMouth.rotation))).toArray()
  }
  canOrder(now: number): boolean { return this.leisure.canReplaceDrink(now) }
  orderDrink(kind: DrinkKind, now: number): boolean {
    // A menu may be stale by the time its click arrives. Arbitration, not UI
    // disabled styling, guarantees that an owned/in-flight glass cannot change.
    if (!isDrinkKind(kind) || !this.canOrder(now)) return false
    this.calibrateDrink(kind); return true
  }
  setActive(active: boolean, now: number): void { this.leisure.setActive(active, now) }
  begin(action: 'drink' | 'smoke', now: number): boolean { return this.leisure.begin(action, now) }
  inspect(active: boolean, now: number): void { this.leisure.inspect(active, now) }
  sample(now: number) { return this.leisure.sample(now) }
}
