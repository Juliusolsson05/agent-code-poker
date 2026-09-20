import * as THREE from 'three'
import { AnatomicalHand } from './Hand'
import { anatomyMaterial, VoxelSculpt } from './Voxel'

const UP = new THREE.Vector3(0, 1, 0)
/** A continuous sleeve is skinned over shoulder, elbow and wrist bones. Separate
 * rigid tapered tubes meet only in their bind pose: bending opens triangular
 * holes at elbows and disconnects cuffs from turned wrists. The surface here is
 * still sampled from tiny blocks, but weights deform the same connected sleeve
 * through each bend. IK determines joints; skinning determines their envelope. */
export class SeatedArm {
  readonly upper = new THREE.Bone()
  readonly forearm = new THREE.Bone()
  readonly wristJoint = new THREE.Bone()
  readonly mesh: THREE.SkinnedMesh
  readonly hand: AnatomicalHand
  readonly elbow = new THREE.Vector3()
  readonly wrist = new THREE.Vector3()
  readonly shoulder: THREE.Vector3
  readonly lengths = [.285, .285] as const
  constructor(parent: THREE.Group, side: -1 | 1, skin: string, jacket: string, shirt: string) {
    this.shoulder = new THREE.Vector3(side * .192, 1.195, .025)
    this.hand = new AnatomicalHand(side === -1 ? 'left' : 'right', skin, .0025)
    const sculpt = new VoxelSculpt(.005)
    const shape = (x: number, y: number, z: number) => {
      const t = THREE.MathUtils.clamp(y / .57, 0, 1)
      const width = t < .5 ? THREE.MathUtils.lerp(.055, .041, t * 2) : THREE.MathUtils.lerp(.041, .025, (t - .5) * 2)
      const cap = y < 0 ? (y / .040) ** 2 : 0
      return (x / width) ** 2 + (z / (width * .88)) ** 2 + cap <= 1
    }
    sculpt.volume([-.056, -.040, -.050], [.056, .551, .050], shape, jacket)
    sculpt.volume([-.030, .551, -.028], [.030, .575, .028], shape, shirt)
    const source = sculpt.mesh(anatomyMaterial(.93), { deformable: true }), geometry = source.geometry
    const positions = geometry.getAttribute('position'), weights: number[] = [], indices: number[] = []
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i)
      // Blend across a 10cm elbow region, then into the wrist orientation. A
      // single-bone hard cut recreated a hinge gap even on connected geometry.
      const elbowBlend = THREE.MathUtils.smoothstep(y, .235, .335)
      const wristBlend = THREE.MathUtils.smoothstep(y, .520, .570)
      indices.push(0, 1, 2, 0)
      weights.push(1 - elbowBlend, elbowBlend * (1 - wristBlend), elbowBlend * wristBlend, 0)
    }
    geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(indices, 4))
    geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(weights, 4))
    this.mesh = new THREE.SkinnedMesh(geometry, source.material)
    this.mesh.name = side < 0 ? 'left-continuous-sleeve' : 'right-continuous-sleeve'
    this.mesh.position.copy(this.shoulder); this.mesh.castShadow = true; this.mesh.receiveShadow = true
    this.forearm.position.y = this.lengths[0]; this.wristJoint.position.y = this.lengths[1]
    this.upper.add(this.forearm); this.forearm.add(this.wristJoint); this.mesh.add(this.upper)
    parent.add(this.mesh, this.hand.root); parent.updateMatrixWorld(true)
    this.mesh.bind(new THREE.Skeleton([this.upper, this.forearm, this.wristJoint]))
    // Bone motion invalidates a static bind-pose box. With only ten sleeves it
    // is cheaper and safer to skip frustum culling than recompute every vertex.
    this.mesh.frustumCulled = false
  }
  solve(target: THREE.Vector3, handRotation: THREE.Euler): void {
    const direction = target.clone().sub(this.shoulder), raw = direction.length()
    direction.normalize()
    const [a, b] = this.lengths, distance = THREE.MathUtils.clamp(raw, Math.abs(a - b) + .015, a + b - .002)
    const along = (a * a - b * b + distance * distance) / (2 * distance)
    const pole = new THREE.Vector3(Math.sign(this.shoulder.x) * .6, -.8, .25)
    pole.addScaledVector(direction, -pole.dot(direction)).normalize()
    this.elbow.copy(this.shoulder).addScaledVector(direction, along).addScaledVector(pole, Math.sqrt(Math.max(0, a * a - along * along)))
    this.wrist.copy(this.shoulder).addScaledVector(direction, distance)
    this.poseJoints(this.elbow, this.wrist, handRotation)
  }
  /** A resolved interaction already owns its joints. Re-running IK here would
   * create a second arbitration layer whose clamp/pole could detach a prop
   * despite a valid director snapshot. Legacy independent poses may use solve;
   * the hero's interaction consumes these exact resolved local-space joints. */
  poseJoints(elbow: THREE.Vector3, wrist: THREE.Vector3, handRotation: THREE.Euler): void {
    this.elbow.copy(elbow); this.wrist.copy(wrist)
    const upperRotation = new THREE.Quaternion().setFromUnitVectors(UP, this.elbow.clone().sub(this.shoulder).normalize())
    const foreRotation = new THREE.Quaternion().setFromUnitVectors(UP, this.wrist.clone().sub(this.elbow).normalize())
    const wristRotation = new THREE.Quaternion().setFromEuler(handRotation)
    this.upper.quaternion.copy(upperRotation)
    this.forearm.quaternion.copy(upperRotation).invert().multiply(foreRotation)
    this.wristJoint.quaternion.copy(foreRotation).invert().multiply(wristRotation)
    this.hand.root.position.copy(this.wrist); this.hand.root.quaternion.copy(wristRotation)
    this.hand.updateSkin()
    this.mesh.updateMatrixWorld(true); this.mesh.skeleton.update()
  }
}
