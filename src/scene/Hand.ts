import * as THREE from 'three'
import { anatomyMaterial, VoxelSculpt } from './Voxel'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

export type HandPose = 'rest' | 'cards' | 'cigar' | 'glass' | 'push'
type Pose = { curl: number[][]; spread: number[]; thumb: [number, number, number] }
const POSES: Record<HandPose, Pose> = {
  rest: { curl: [[.12, .22, .12], [.16, .28, .14], [.21, .34, .19], [.29, .40, .22]], spread: [-.055, -.015, .02, .06], thumb: [-.66, .20, .22] },
  cards: { curl: [[.07, .12, .12], [1.20, 1.30, .80], [1.23, 1.30, .85], [1.25, 1.30, .85]], spread: [-.03, 0, .02, .06], thumb: [-.25, .40, -.25] },
  cigar: { curl: [[.42, .68, .34], [.49, .79, .43], [.86, 1.20, .66], [.94, 1.18, .70]], spread: [-.04, .01, .045, .09], thumb: [-.50, .65, .43] },
  glass: { curl: [[.58, .65, .34], [.65, .72, .38], [.72, .75, .42], [.82, .80, .44]], spread: [-.08, -.025, .025, .07], thumb: [-.90, .45, .35] },
  push: { curl: [[.10, .08, .07], [.10, .07, .06], [.15, .09, .07], [.22, .12, .09]], spread: [-.09, -.02, .025, .085], thumb: [-.82, .16, .16] },
}

/** Canonical hand: wrist at origin, digits along +Y, palm toward +Z. Mirror
 * the whole rig for the left hand, never individual knuckles. Every pose shares
 * bone lengths, so changing grips cannot stretch fingertips or inflate joints.
 * The prop attachment belongs to this rig; the arm must follow the grip rather
 * than moving an unrelated cigar through the finger sculpture. */
export class AnatomicalHand {
  readonly root = new THREE.Group()
  readonly fingers: THREE.Bone[][] = []
  readonly thumb: THREE.Bone[] = []
  readonly grip = new THREE.Group()
  readonly tips: THREE.Object3D[] = []
  private last: HandPose = 'rest'
  private skin!: THREE.SkinnedMesh
  constructor(side: 'left' | 'right', skin = '#ae8165', step = .0018) {
    const material = anatomyMaterial(), nailMaterial = new THREE.MeshStandardMaterial({ color: '#bc9984', roughness: .48 })
    this.root.name = `${side}-anatomical-hand`; this.root.scale.x = side === 'left' ? -1 : 1
    const palm = new VoxelSculpt(step)
    palm.volume([-.035, -.014, -.014], [.035, .073, .018], (x, y, z) => {
      const t = THREE.MathUtils.clamp((y + .012) / .085, 0, 1)
      const width = THREE.MathUtils.lerp(.024, .035, Math.sin(t * Math.PI * .68))
      // A wedge with a shallow cup; a single palm ellipsoid looked like a fist
      // even with extended fingers. The wrist is narrower than the knuckle row.
      const depth = .0105 + .003 * Math.sin(t * Math.PI)
      const cup = -.0025 * (1 - Math.abs(x) / width)
      return (x / width) ** 6 + ((z - cup) / depth) ** 4 <= 1 && y < .067 - Math.abs(x) * .14
    }, skin)
    palm.ellipsoid([-.023, .023, .005], [.014, .027, .011], skin)
    const base = new THREE.Bone(); this.root.add(base); base.add(palm.mesh(material))
    const lengths = [[.036, .024, .018], [.039, .027, .019], [.036, .025, .018], [.028, .019, .016]]
    const widths = [.0072, .0075, .0070, .0060]
    for (let digit = 0; digit < 4; digit++) {
      let parent: THREE.Object3D = base
      const joints: THREE.Bone[] = []
      for (let joint = 0; joint < 3; joint++) {
        const bone = new THREE.Bone(); bone.name = `finger-${digit}-joint-${joint}`
        bone.position.set(joint ? 0 : -.026 + digit * .018, joint ? lengths[digit][joint - 1] : .059 - Math.abs(digit - 1) * .004, 0)
        const width = widths[digit] * (1 - joint * .14), length = lengths[digit][joint]
        if (joint === 0) {
          // One uninterrupted finger envelope avoids the exposed caps and
          // mechanical knuckle gaps of three rigid little cylinders.
          const surface = new VoxelSculpt(step).segment(lengths[digit].reduce((a, b) => a + b, 0), width, width * .83, skin, .66).mesh(material)
          surface.userData.jointLengths = lengths[digit]; bone.add(surface)
        }
        parent.add(bone); parent = bone; joints.push(bone)
        if (joint === 2) {
          const nail = new THREE.Mesh(new THREE.BoxGeometry(width * 1.25, length * .57, .0012), nailMaterial)
          nail.position.set(0, length * .58, -width * .82); bone.add(nail)
          const tip = new THREE.Object3D(); tip.position.y = length; bone.add(tip); this.tips.push(tip)
        }
      }
      this.fingers.push(joints)
    }
    let parent: THREE.Object3D = base
    for (let j = 0; j < 3; j++) {
      const bone = new THREE.Bone(); const length = [.030, .025, .022][j]
      bone.position.set(j ? 0 : -.026, j ? [.030, .025][j - 1] : .025, j ? 0 : .003)
      if (j === 0) {
        const surface = new VoxelSculpt(step).segment(.077, .0105, .009, skin, .68).mesh(material)
        surface.userData.jointLengths = [.030, .025, .022]; bone.add(surface)
      }
      parent.add(bone); parent = bone; this.thumb.push(bone)
    }
    // One draw per hand instead of one draw per phalanx/nail. Five opponents
    // previously multiplied dozens of tiny meshes into hundreds of submissions
    // for objects only a few pixels wide. Bone indices preserve articulation;
    // merging is a render optimization, not a new lower-detail surrogate model.
    const bones = [base, ...this.fingers.flat(), ...this.thumb], parts: THREE.BufferGeometry[] = []
    const originals: THREE.Mesh[] = []
    this.root.updateMatrixWorld(true)
    const inverse = this.root.matrixWorld.clone().invert()
    base.traverse(o => {
      if (!(o instanceof THREE.Mesh)) return
      originals.push(o)
      const geometry = o.geometry.clone().applyMatrix4(inverse.clone().multiply(o.matrixWorld)), count = geometry.getAttribute('position').count
      if (!geometry.getAttribute('color')) {
        const color = (o.material as THREE.MeshStandardMaterial).color, colors = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) colors.set([color.r, color.g, color.b], i * 3)
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      }
      geometry.deleteAttribute('uv')
      const boneIndex = bones.indexOf(o.parent as THREE.Bone), indices = new Uint16Array(count * 4), weights = new Float32Array(count * 4)
      const lengths = o.userData.jointLengths as number[] | undefined
      for (let i = 0; i < count; i++) {
        if (lengths) {
          const y = o.geometry.getAttribute('position').getY(i)
          const first = THREE.MathUtils.smoothstep(y, lengths[0] - .009, lengths[0] + .009)
          const second = THREE.MathUtils.smoothstep(y, lengths[0] + lengths[1] - .007, lengths[0] + lengths[1] + .007)
          indices.set([boneIndex, boneIndex + 1, boneIndex + 2, 0], i * 4)
          weights.set([1 - first, first * (1 - second), first * second, 0], i * 4)
        } else { indices[i * 4] = Math.max(0, boneIndex); weights[i * 4] = 1 }
      }
      geometry.setAttribute('skinIndex', new THREE.BufferAttribute(indices, 4)); geometry.setAttribute('skinWeight', new THREE.BufferAttribute(weights, 4)); parts.push(geometry)
    })
    const merged = mergeGeometries(parts)!
    parts.forEach(g => g.dispose()); originals.forEach(o => { o.geometry.dispose(); o.removeFromParent() }); nailMaterial.dispose()
    this.skin = new THREE.SkinnedMesh(merged, material); this.skin.name = 'articulated-hand-surface'
    this.skin.add(base); this.root.add(this.skin); this.root.updateMatrixWorld(true)
    this.skin.bind(new THREE.Skeleton(bones)); this.skin.frustumCulled = false; this.skin.castShadow = true; this.skin.receiveShadow = true
    this.grip.position.set(-.006, .084, .025); this.root.add(this.grip); this.pose('rest')
  }
  pose(name: HandPose, blend = 1): void {
    const target = POSES[name]
    for (let f = 0; f < 4; f++) for (let j = 0; j < 3; j++) {
      const bone = this.fingers[f][j]
      bone.rotation.x = THREE.MathUtils.lerp(bone.rotation.x, target.curl[f][j], blend)
      bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, j ? 0 : target.spread[f], blend)
    }
    this.thumb[0].rotation.z = THREE.MathUtils.lerp(this.thumb[0].rotation.z, name === 'cards' ? -.40 : -.75, blend)
    this.thumb[0].rotation.y = THREE.MathUtils.lerp(this.thumb[0].rotation.y, target.thumb[0], blend)
    this.thumb[0].rotation.x = THREE.MathUtils.lerp(this.thumb[0].rotation.x, target.thumb[1], blend)
    this.thumb[1].rotation.x = THREE.MathUtils.lerp(this.thumb[1].rotation.x, target.thumb[2], blend)
    this.thumb[2].rotation.x = THREE.MathUtils.lerp(this.thumb[2].rotation.x, target.thumb[2] * (name === 'cards' ? .48 : .7), blend)
    this.last = name
    this.updateSkin()
  }
  updateSkin(): void { this.root.updateWorldMatrix(true, true); this.skin.skeleton.update() }
  get poseName(): HandPose { return this.last }
}
