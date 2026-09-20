import { Euler, Matrix4, Quaternion, Vector3 } from 'three'
import { Leisure } from './interactions/Leisure'
import type { Calibration, Quat } from './interactions/contracts'
import { PLAYER_LAYOUT } from './environment/layout'

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
    const glassRotation = basis(new Vector3(0, 1, 0), new Vector3(0, 0, -1), new Vector3(-1, 0, 0))
    const trayRotation = basis(new Vector3(-1, 0, 0), new Vector3(0, 0, -1), new Vector3(0, -1, 0))
    const smokeRotation = rotation(-.39, -.30, -.10)
    const handCigarContact: [number, number, number] = [-.009, .091, .031]
    const bite = new Vector3(-.063, .003, 0).add(new Vector3(...handCigarContact)).applyQuaternion(new Quaternion(...smokeRotation))
    this.calibration = {
      shoulder: [...PLAYER_LAYOUT.shoulder], armLengths: [.285, .285],
      rest: { position: [...PLAYER_LAYOUT.rest], rotation: rotation(-.34, -.45, -.40) },
      cigarHome: { position: [...PLAYER_LAYOUT.cigar], rotation: trayRotation },
      drinkHome: { position: [...PLAYER_LAYOUT.drink], rotation: [0, 0, 0, 1] },
      drinkMouth: { position: [.005, 1.245, 1.32], rotation: rotation(.24, 0, .08) },
      smokeHand: { position: new Vector3(.015, 1.335, 1.37).sub(bite).toArray(), rotation: smokeRotation },
      glassHandRotation: glassRotation, handGlassContact: [-.004, .079, .047], glassContact: [.032, .040, 0], handCigarContact,
    }
    this.leisure = new Leisure(this.calibration)
  }
  setActive(active: boolean, now: number): void { this.leisure.setActive(active, now) }
  begin(action: 'drink' | 'smoke', now: number): boolean { return this.leisure.begin(action, now) }
  inspect(active: boolean, now: number): void { this.leisure.inspect(active, now) }
  sample(now: number) { return this.leisure.sample(now) }
}
