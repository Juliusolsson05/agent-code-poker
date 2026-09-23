import { Euler, Matrix4, Quaternion, Vector3 } from 'three'
import { Leisure } from './interactions/Leisure'
import type { Calibration, Quat } from './interactions/contracts'
import { PLAYER_LAYOUT } from './environment/layout'
import { CIGAR, drinkAnchors, isDrinkKind, isTreatKind, TREATS, type DrinkKind, type TreatKind } from './props/specs'
import { CIGAR_HAND_CONTACT, GLASS_HAND_CONTACT, GLASS_HAND_ROTATION, PINCH_HAND_CONTACT } from './HandGrips'
import type { CompletedSip, CompletedTreat } from '../interaction/effects/EffectEngine'

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
  private kind:DrinkKind='old-fashioned'
  private observedSips=0
  private completed:CompletedSip|null=null
  private treatKind: TreatKind | null = null
  private observedTreats = 0
  private completedTreat: CompletedTreat | null = null
  private collectSip():void {
    if(this.leisure.completedSips!==this.observedSips) {
      this.observedSips=this.leisure.completedSips
      this.completed={id:this.observedSips,actor:'player',kind:this.kind}
    }
    // Treat receipts mirror sips: the id is the owner's completion count, so
    // the effect engine's high-water mark deduplicates without a set.
    if (this.leisure.completedTreats !== this.observedTreats && this.treatKind) {
      this.observedTreats = this.leisure.completedTreats
      this.completedTreat = { id: this.observedTreats, actor: 'player', kind: this.treatKind }
    }
  }
  takeCompletedSip():CompletedSip|null {this.collectSip();const event=this.completed;this.completed=null;return event}
  takeCompletedTreat(): CompletedTreat | null { this.collectSip(); const event = this.completedTreat; this.completedTreat = null; return event }
  get treat(): { kind: TreatKind; remaining: number } | null { return this.treatKind ? { kind: this.treatKind, remaining: this.leisure.treatRemaining } : null }
  constructor() {
    const trayRotation = basis(new Vector3(-1, 0, 0), new Vector3(0, 0, -1), new Vector3(0, -1, 0))
    // The recorded Euler pose aimed the ember +Z, back toward the eyes, while
    // a grip-only test still passed. Solve the PROP's outward shaft first, then
    // transport its fitted hand frame. Local +X runs bite -> ember; world -Z
    // faces the table. Keep a slight right/down cant, not a sideways cigarette.
    const shaft = new Vector3(.28, -.10, -1).normalize()
    const up = new Vector3(0, 1, 0).addScaledVector(shaft, -shaft.y).normalize()
    const smokeRotation = basis(shaft, up, new Vector3().crossVectors(shaft, up))
    const handCigarContact: [number, number, number] = [...CIGAR_HAND_CONTACT]
    const bite = new Vector3(...CIGAR.bite).add(new Vector3(...handCigarContact)).applyQuaternion(new Quaternion(...smokeRotation))
    // Pinch frames (#14). At the dish the fingers point forward-down with the
    // palm turned inward (like the glass wrap, tilted down), so the thumb
    // comes from below and the index from above. At the lips the fingers turn
    // back toward the face. Hand X is derived (Y×Z) so both are proper
    // rotations; the pinch centre itself was fitted offline (HandGrips.ts).
    const frame = (fingers: Vector3, palm: Vector3): Quat => {
      const y = fingers.normalize(), z = palm.addScaledVector(y, -palm.dot(y)).normalize()
      return basis(new Vector3().crossVectors(y, z), y, z)
    }
    const pinchRotation = frame(new Vector3(0, -.6, -.8), new Vector3(-1, 0, 0))
    const mouthHand = frame(new Vector3(-.35, .45, 1), new Vector3(-1, 0, .2))
    // The piece's rotation at the lips is whatever keeps the SAME pinch closed
    // on it with the hand in its mouth frame: piece = hand · pinch⁻¹.
    const pieceAtMouth = new Quaternion(...mouthHand).multiply(new Quaternion(...pinchRotation).invert()).toArray() as Quat
    this.calibration = {
      shoulder: [...PLAYER_LAYOUT.shoulder], armLengths: [.285, .285],
      rest: { position: [...PLAYER_LAYOUT.rest], rotation: rotation(-.34, -.45, -.40) },
      cigarHome: { position: [...PLAYER_LAYOUT.cigar], rotation: trayRotation },
      drinkHome: { position: [...PLAYER_LAYOUT.drink], rotation: [0, 0, 0, 1] },
      drinkMouth: { position: [.005, 1.245, 1.32], rotation: rotation(.24, 0, .08) },
      smokeHand: { position: new Vector3(...PLAYER_LAYOUT.mouth).sub(bite).toArray(), rotation: smokeRotation },
      glassHandRotation: [...GLASS_HAND_ROTATION], handGlassContact: [...GLASS_HAND_CONTACT], glassContact: [.032, .040, 0], handCigarContact,
      treatHome: { position: [...PLAYER_LAYOUT.treat], rotation: [0, 0, 0, 1] },
      // 8mm in front of the lip landmark: the piece touches the lips, it does
      // not pass through the (unrendered) face into the camera near plane.
      treatMouth: { position: new Vector3(...PLAYER_LAYOUT.mouth).add(new Vector3(0, 0, -.008)).toArray(), rotation: pieceAtMouth },
      pinchRotation, handPinchContact: [...PINCH_HAND_CONTACT],
    }
    this.leisure = new Leisure(this.calibration)
    this.calibrateDrink('old-fashioned')
  }
  private calibrateDrink(kind: DrinkKind): void {
    const anchors = drinkAnchors(kind)
    this.calibration.glassContact = anchors.grip
    this.calibration.drinkMouth.position = new Vector3(...PLAYER_LAYOUT.mouth)
      .sub(new Vector3(...anchors.rim).applyQuaternion(new Quaternion(...this.calibration.drinkMouth.rotation))).toArray()
  }
  canOrder(now: number): boolean { const allowed=this.leisure.canReplaceDrink(now);this.collectSip();return allowed }
  orderDrink(kind: DrinkKind, now: number): boolean {
    // A menu may be stale by the time its click arrives. Arbitration, not UI
    // disabled styling, guarantees that an owned/in-flight glass cannot change.
    if (!isDrinkKind(kind) || !this.canOrder(now)) return false
    this.calibrateDrink(kind); this.kind=kind; return true
  }
  /** A fresh dish of a cosmetic treat. Same atomic arbitration as a drink
   * order: a stale menu click during a reach or held piece is refused here. */
  orderTreat(kind: TreatKind, now: number): boolean {
    if (!isTreatKind(kind) || !this.leisure.stockTreat(TREATS[kind].slots.map(s => [...s] as [number, number, number]), now)) return false
    this.collectSip(); this.treatKind = kind; return true
  }
  canConsume(now: number): boolean { const allowed = this.leisure.canConsume(now); this.collectSip(); return allowed }
  setActive(active: boolean, now: number): void { this.leisure.setActive(active, now) }
  begin(action: 'drink' | 'smoke' | 'consume', now: number): boolean { return this.leisure.begin(action, now) }
  inspect(active: boolean, now: number): void { this.leisure.inspect(active, now) }
  sample(now: number) { const pose=this.leisure.sample(now);this.collectSip();return pose }
}
