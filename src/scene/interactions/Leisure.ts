import { Quaternion, Vector3, MathUtils } from 'three'
import type { Action, Calibration, Grip, InteractionPose, Owner, PieceOwner, Pose, Quat, Vec3 } from './contracts'

const v = (p: Vec3) => new Vector3(...p)
const q = (p: Quat) => new Quaternion(...p)
const copy = (p: Pose): Pose => ({ position: [...p.position], rotation: [...p.rotation] })
const blend = (a: Pose, b: Pose, t: number): Pose => {
  const alpha = MathUtils.smoothstep(t, 0, 1)
  return { position: v(a.position).lerp(v(b.position), alpha).toArray(), rotation: q(a.rotation).slerp(q(b.rotation), alpha).toArray() }
}
const point = (pose: Pose, anchor: Vec3) => v(anchor).applyQuaternion(q(pose.rotation)).add(v(pose.position))
const wristAt = (worldContact: Vector3, handContact: Vec3, rotation: Quat): Pose => ({
  position: worldContact.clone().sub(v(handContact).applyQuaternion(q(rotation))).toArray(), rotation: [...rotation],
})

/** The only interaction state machine. It consumes an externally paused visual
 * clock and emits complete WORLD-space snapshots. Sampling an interval does not
 * fire attachment callbacks: a skipped frame still describes exactly one owner
 * for each prop. This is why the old timed reparenting branches cannot remain
 * in either the hero presenter or Room after integration.
 *
 * There are no meshes, browser globals, timers, engine rules or hidden cards
 * here. The sole production consumer is InteractionDirector. */
export class Leisure {
  private active = false
  private requestedInspection = false
  private action: Action = 'idle'
  private startedAt = 0
  private cigarOwner: Owner = 'right-hand'
  private startOwner: Owner = 'right-hand'
  private returning: InteractionPose | null = null
  private returnDuration = .45
  private countedSip = false
  completedSips = 0
  // Treat stock is owned here, beside the action that consumes it, so a
  // renderer or menu can never decrement a piece the hand did not eat.
  private slots: Vec3[] = []
  private remaining = 0
  private countedTreat = false
  completedTreats = 0

  constructor(readonly calibration: Calibration) {}

  canReplaceDrink(now: number): boolean {
    const pose = this.sample(now)
    return this.active && !this.requestedInspection && !pose.busy && pose.drink.owner === 'table'
  }

  /** A fresh dish. Same arbitration as replacing a glass: never while the
   * hand is busy, inspecting or inactive (a held piece cannot be restocked). */
  stockTreat(slots: Vec3[], now: number): boolean {
    if (!this.canReplaceDrink(now)) return false
    this.slots = slots.map(s => [...s] as Vec3); this.remaining = slots.length
    return true
  }
  /** The dish leaves with the session (Room.endNight). Only when idle: a
   * piece still in the fingers keeps a consistent owner until setActive(false)
   * has returned the action to idle, which Room does first. */
  clearTreat(): boolean {
    if (this.action !== 'idle') return false
    this.slots = []; this.remaining = 0; return true
  }
  get treatRemaining(): number { return this.remaining }
  canConsume(now: number): boolean { return this.canReplaceDrink(now) && this.remaining > 0 }

  setActive(active: boolean, now: number): void {
    this.active = active
    if (!active) {
      this.action = 'idle'; this.requestedInspection = false; this.cigarOwner = 'right-hand'
      this.returning = null; this.startedAt = now
    }
  }

  begin(action: 'drink' | 'smoke' | 'consume', now: number): boolean {
    this.sample(now)
    if (!this.active || this.requestedInspection || this.action !== 'idle') return false
    if (action === 'consume' && this.remaining < 1) return false
    this.action = action; this.startedAt = now; this.startOwner = this.cigarOwner; this.countedSip = false; this.countedTreat = false
    return true
  }

  inspect(active: boolean, now: number): void {
    if (active === this.requestedInspection) return
    const current = this.sample(now)
    this.requestedInspection = active
    if (active && current.busy && this.action !== 'return') {
      // Preserve the exact interruption pose, including prop ownership. Returning
      // a held glass finishes its contact first; a hand already clear of both
      // props can simply settle. Turning inspection off does not reverse a half-
      // returned glass or resurrect the interrupted drink action.
      this.returning = current; this.startedAt = now; this.action = 'return'
      this.returnDuration = current.drink.owner === 'right-hand' || current.treat.owner === 'right-hand' ? 1.05 : .45
    }
  }

  private glassWrist(glass: Pose): Pose {
    const c = this.calibration
    const rotation = q(glass.rotation).multiply(q(c.glassHandRotation)).toArray()
    return wristAt(point(glass, c.glassContact), c.handGlassContact, rotation)
  }
  /** The piece currently targeted, resting in its dish slot. */
  private piecePick(slot: number): Pose {
    const c = this.calibration, offset = this.slots[slot] ?? [0, 0, 0]
    return { position: v(offset).applyQuaternion(q(c.treatHome.rotation)).add(v(c.treatHome.position)).toArray(), rotation: [...c.treatHome.rotation] }
  }
  /** Mirrors glassWrist: the prop's pose drives the hand, so the pinch stays
   * closed on the piece through the whole lift (no drift between the two). */
  private pinchWrist(piece: Pose): Pose {
    const c = this.calibration
    const rotation = q(piece.rotation).multiply(q(c.treatHome.rotation).invert()).multiply(q(c.pinchRotation)).toArray()
    return wristAt(v(piece.position), c.handPinchContact, rotation)
  }
  private trayWrist(): Pose {
    const c = this.calibration
    return wristAt(v(c.cigarHome.position), c.handCigarContact, c.cigarHome.rotation)
  }
  private cigarAtHand(hand: Pose): Pose {
    return { position: point(hand, this.calibration.handCigarContact).toArray(), rotation: [...hand.rotation] }
  }

  sample(now: number): InteractionPose {
    const c = this.calibration, age = Math.max(0, now - this.startedAt)
    // Completion belongs to this owner, not to a D-key handler or renderer
    // frame counter. The held-at-mouth interval ends at3s. Crossing it once
    // counts even if a frame skips the boundary; interrupting before it changes
    // action to return and cannot later manufacture a sip. Paused clock = no sip.
    if(this.action==='drink' && age>=3 && !this.countedSip) {
      this.completedSips++;this.countedSip=true
    }
    // Same rule for a treat: it counts when the held-at-lips interval is
    // crossed (2.55s), once, and an interruption before then returns the
    // piece to the dish instead of eating it.
    if (this.action === 'consume' && age >= 2.55 && !this.countedTreat) {
      this.completedTreats++; this.countedTreat = true; this.remaining = Math.max(0, this.remaining - 1)
    }
    const duration = this.action === 'drink' ? 5.35 : this.action === 'consume' ? 4.1 : this.action === 'smoke' ? (this.startOwner === 'table' ? 4.15 : 3.6) : this.returnDuration
    if (this.action !== 'idle' && age >= duration) {
      if (this.action === 'return') this.cigarOwner = this.returning!.cigar.owner
      else this.cigarOwner = 'right-hand'
      this.action = 'idle'; this.returning = null
    }
    let right = copy(c.rest), drink = copy(c.drinkHome), cigar = copy(c.cigarHome)
    let drinkOwner: Owner = 'table', cigarOwner = this.cigarOwner
    let grip: Grip = cigarOwner === 'right-hand' ? 'cigar' : 'rest', phase = 'rest'
    const trayHand = this.trayWrist(), glassHand = this.glassWrist(c.drinkHome)
    // While consuming, `remaining` already excludes an eaten piece, so the
    // targeted slot is fixed from the count at the start of the action.
    const slot = Math.max(0, (this.action === 'consume' && this.countedTreat ? this.remaining + 1 : this.remaining) - 1)
    let treat = this.piecePick(slot), treatOwner: PieceOwner = 'table'

    if (this.action === 'drink') {
      if (age < .6) {
        phase = 'rest-cigar'; right = blend(c.rest, trayHand, age / .6)
        cigarOwner = this.startOwner; grip = cigarOwner === 'right-hand' ? 'cigar' : 'rest'
      } else if (age < 1.15) {
        phase = 'reach-glass'; cigarOwner = 'table'; grip = 'rest'
        right = blend(trayHand, glassHand, (age - .6) / .55)
      } else if (age < 4.2) {
        phase = age < 2.1 ? 'lift-glass' : age < 3 ? 'sip' : 'return-glass'
        cigarOwner = 'table'; drinkOwner = 'right-hand'; grip = 'glass'
        drink = age < 2.1 ? blend(c.drinkHome, c.drinkMouth, (age - 1.15) / .95)
          : age < 3 ? copy(c.drinkMouth) : blend(c.drinkMouth, c.drinkHome, (age - 3) / 1.2)
        right = this.glassWrist(drink)
      } else if (age < 4.75) {
        phase = 'retrieve-cigar'; cigarOwner = 'table'; grip = 'rest'
        right = blend(glassHand, trayHand, (age - 4.2) / .55)
      } else {
        phase = 'settle-cigar'; cigarOwner = 'right-hand'; grip = 'cigar'
        right = blend(trayHand, c.rest, (age - 4.75) / .6)
      }
    } else if (this.action === 'consume') {
      const pick = this.piecePick(slot), pickHand = this.pinchWrist(pick)
      // The piece at the lips carries the hand's mouth rotation; deriving the
      // hand from it (pinchWrist) keeps fingers and piece locked together.
      const mouth = c.treatMouth, mouthHand = this.pinchWrist(mouth)
      if (age < .6) {
        phase = 'rest-cigar'; right = blend(c.rest, trayHand, age / .6)
        cigarOwner = this.startOwner; grip = cigarOwner === 'right-hand' ? 'cigar' : 'rest'
      } else if (age < 1.15) {
        phase = 'reach-treat'; cigarOwner = 'table'; grip = 'rest'
        right = blend(trayHand, pickHand, (age - .6) / .55)
      } else if (age < 2.85) {
        cigarOwner = 'table'; grip = 'pinch'
        phase = age < 1.35 ? 'pinch' : age < 2.25 ? 'lift-treat' : 'consume'
        treat = age < 1.35 ? pick : age < 2.25 ? blend(pick, mouth, (age - 1.35) / .9) : copy(mouth)
        treatOwner = this.countedTreat ? 'consumed' : 'right-hand'
        right = this.pinchWrist(treat)
      } else if (age < 3.5) {
        phase = 'return-hand'; cigarOwner = 'table'; grip = 'rest'; treatOwner = 'consumed'
        right = blend(mouthHand, trayHand, (age - 2.85) / .65)
      } else {
        phase = 'settle-cigar'; cigarOwner = 'right-hand'; grip = 'cigar'; treatOwner = 'consumed'
        right = blend(trayHand, c.rest, (age - 3.5) / .6)
      }
    } else if (this.action === 'smoke') {
      const retrieve = this.startOwner === 'table' ? .55 : 0
      if (age < retrieve) {
        phase = 'retrieve-cigar'; cigarOwner = 'table'; grip = 'rest'
        right = blend(c.rest, trayHand, age / retrieve)
      } else {
        const t = age - retrieve
        cigarOwner = 'right-hand'; grip = 'cigar'
        phase = t < .95 ? 'raise-cigar' : t < 1.8 ? 'puff' : 'lower-cigar'
        right = t < .95 ? blend(retrieve ? trayHand : c.rest, c.smokeHand, t / .95)
          : t < 1.8 ? copy(c.smokeHand) : blend(c.smokeHand, c.rest, (t - 1.8) / 1.2)
      }
    } else if (this.action === 'return') {
      const start = this.returning!
      cigarOwner = start.cigar.owner
      const heldPiece = start.treat.owner === 'right-hand'
      if (start.drink.owner === 'right-hand' && age < .65) {
        phase = 'interrupt-return-glass'; drinkOwner = 'right-hand'; grip = 'glass'
        drink = blend(start.drink, c.drinkHome, age / .65); right = this.glassWrist(drink)
      } else if (heldPiece && age < .65) {
        // An uneaten piece goes back to its own slot, like an unsipped glass.
        phase = 'interrupt-return-treat'; treatOwner = 'right-hand'; grip = 'pinch'
        treat = blend(start.treat, this.piecePick(slot), age / .65); right = this.pinchWrist(treat)
      } else {
        phase = 'interrupt-settle-hand'
        const wasHoldingGlass = start.drink.owner === 'right-hand'
        const from = wasHoldingGlass ? glassHand : heldPiece ? this.pinchWrist(this.piecePick(slot)) : start.right
        right = blend(from, c.rest, wasHoldingGlass || heldPiece ? (age - .65) / .4 : age / .45)
        grip = cigarOwner === 'right-hand' ? 'cigar' : 'rest'
      }
    }

    // Clamp only as a final safety net and expose the error; it is never a way
    // to approve an unreachable home. Owned props follow the resolved wrist as
    // a unit so even a malformed calibration cannot detach glass from fingers.
    // Recorded replay tests require this error to be zero for the real layout.
    const shoulder = v(c.shoulder), direction = v(right.position).sub(shoulder), raw = direction.length()
    if (raw < 1e-9) direction.set(0, -1, 0); else direction.divideScalar(raw)
    const [a, b] = c.armLengths, distance = MathUtils.clamp(raw, Math.abs(a - b) + .015, a + b - .002)
    const wrist = shoulder.clone().addScaledVector(direction, distance), correction = wrist.clone().sub(v(right.position))
    right.position = wrist.toArray()
    if (drinkOwner === 'right-hand') drink.position = v(drink.position).add(correction).toArray()
    if (treatOwner === 'right-hand') treat.position = v(treat.position).add(correction).toArray()
    const along = (a * a - b * b + distance * distance) / (2 * distance)
    const pole = new Vector3(.6, -.8, .25).addScaledVector(direction, -new Vector3(.6, -.8, .25).dot(direction))
    if (pole.lengthSq() < 1e-9) pole.crossVectors(direction, new Vector3(1, 0, 0))
    pole.normalize()
    const elbow = shoulder.clone().addScaledVector(direction, along).addScaledVector(pole, Math.sqrt(Math.max(0, a * a - along * along)))
    if (cigarOwner === 'right-hand') cigar = this.cigarAtHand(right)
    return { space: 'world', action: this.action, phase, right: { ...right, grip },
      arm: { shoulder: [...c.shoulder], elbow: elbow.toArray(), wrist: wrist.toArray(), reachError: correction.length() },
      drink: { ...drink, owner: drinkOwner }, cigar: { ...cigar, owner: cigarOwner },
      treat: { ...treat, owner: treatOwner, slot, remaining: treatOwner === 'table' ? this.remaining : Math.max(0, slot) },
      inspectionReady: this.requestedInspection && this.action === 'idle', busy: this.action !== 'idle' }
  }
}
