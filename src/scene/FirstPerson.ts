import * as THREE from 'three'
import { Sculpture, humanMaterial } from './Human'
import type { Card } from '../engine/cards'

/** Camera-local anatomy gives a stable physical relationship between your eyes,
 * hands and cards. These are rendered objects, not pictures pasted over the HUD.
 * This class owns only presentation; smoking never changes poker state. */
export class FirstPerson {
  readonly root = new THREE.Group()
  private left = new THREE.Group()
  private right = new THREE.Group()
  private fan = new THREE.Group()
  private paper: THREE.Mesh[] = []
  private smoke: { mesh: THREE.Sprite; birth: number; seed: number; origin: THREE.Vector3 }[] = []
  private ember: THREE.MeshStandardMaterial
  private cigarTip: THREE.Object3D
  private smokeTexture: THREE.CanvasTexture
  private smokingAt = -100
  private dealtAt = -100
  private foldAt = -100
  private visibleHand = false
  private lastHand = 0
  private lastEmission = 0
  private active = false
  private inspecting = false
  private mouthLocal = new THREE.Vector3()
  private restingRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(.10, -.35, -.08))
  private smokingRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(.04, -.10, -.06))

  constructor(geometry: THREE.BoxGeometry, private texture: (card: Card | null) => THREE.CanvasTexture) {
    const material = humanMaterial()
    for (const [group, cigar] of [[this.left, false], [this.right, true]] as const) {
      const sculpt = new Sculpture(.0022), skin = '#a9846b'
      sculpt.limb([cigar ? .04 : -.04, -.17, .045], [0, -.010, 0], [.029, .039, .026], '#272b2c')
      sculpt.ellipsoid([0, -.007, 0], [.029, .018, .025], '#aaa391')
      sculpt.ellipsoid([0, .028, 0], [.032, .044, .017], skin)
      if (!cigar) {
        // A pinch grip, not four straight fingers pasted over the card faces:
        // the index supports the BACK of the lower edge, the thumb crosses its
        // front, and the other fingers curl into the palm below that edge.
        sculpt.limb([-.022, .052, -.009], [-.018, .085, -.018], [.009, .013, .009], skin)
        sculpt.limb([-.018, .085, -.018], [.010, .093, -.014], [.008, .009, .008], skin)
        for (let f = 0; f < 3; f++) {
          const x = -.010 + f * .014, y = .055 - f * .008
          sculpt.limb([x, y, -.004], [x, y + .012, -.030], [.008, .010, .012], skin)
          sculpt.limb([x, y + .012, -.030], [x, y - .005, -.038], [.008, .012, .008], skin)
        }
        sculpt.limb([.027, .021, .004], [.039, .052, .016], [.012, .017, .012], skin)
        sculpt.limb([.039, .052, .016], [.012, .078, .013], [.012, .013, .009], skin)
        sculpt.ellipsoid([.012, .079, .021], [.008, .010, .0018], '#c0a78e')
      } else {
        // The index/middle fingers straddle the cigar, ring/pinky stay curled.
        // Separate joints make the contact visible from the side of the hand.
        for (let f = 0; f < 4; f++) {
          const x = -.022 + f * .014, y = f < 2 ? .077 + f * .003 : .057 - (f - 2) * .01
          sculpt.limb([x, .055, 0], [x - .005, y + .008, -.012], [.0075, .012, .010], skin)
          sculpt.limb([x - .005, y + .008, -.012], [x - .011, y - .003, -.038], [.0075, .009, .013], skin)
          sculpt.ellipsoid([x - .012, y - .003, -.047], [.0055, .007, .0015], '#bda087')
        }
        sculpt.limb([-.027, .023, .007], [-.040, .045, .014], [.012, .016, .012], skin)
        sculpt.limb([-.040, .045, .014], [-.022, .055, -.010], [.010, .010, .014], skin)
      }
      group.add(sculpt.mesh(geometry, material)); this.root.add(group)
    }
    this.fan.position.set(-.010, .124, 0); this.left.add(this.fan)
    for (let i = 0; i < 2; i++) {
      // A bounded unlit paper material deliberately opts out of scene exposure.
      // Strong table lights must never turn white stock into a bloom emitter.
      const card = new THREE.Mesh(new THREE.PlaneGeometry(.072, .101), new THREE.MeshBasicMaterial({ color: '#bcb6aa', side: THREE.DoubleSide }))
      card.position.set((i - .5) * .025, 0, i * .001); card.rotation.z = (i - .5) * -.16
      this.fan.add(card); this.paper.push(card)
    }
    const cigar = new THREE.Group(); cigar.position.set(-.019, .079, -.029)
    cigar.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, .08, -.25).normalize())
    cigar.scale.setScalar(.78); this.right.add(cigar)
    this.mouthLocal.set(0, -.073 * .78, 0).applyQuaternion(cigar.quaternion).add(cigar.position)
    const wrapper = new THREE.Mesh(new THREE.CylinderGeometry(.0075, .008, .145, 14), new THREE.MeshStandardMaterial({ color: '#52311f', roughness: .92 }))
    cigar.add(wrapper)
    for (let i = 0; i < 14; i++) {
      const seam = new THREE.Mesh(new THREE.TorusGeometry(.0077, .00045, 3, 14), new THREE.MeshStandardMaterial({ color: '#39261c', roughness: 1 }))
      seam.rotation.x = Math.PI / 2; seam.position.y = -.061 + i * .009; cigar.add(seam)
    }
    const band = new THREE.Mesh(new THREE.CylinderGeometry(.0081, .0081, .018, 14), new THREE.MeshStandardMaterial({ color: '#b79751', roughness: .4, metalness: .4 }))
    band.position.y = -.035; cigar.add(band)
    const ash = new THREE.Mesh(new THREE.CylinderGeometry(.0078, .0075, .018, 14), new THREE.MeshStandardMaterial({ color: '#68615a', roughness: 1 }))
    ash.position.y = .076; cigar.add(ash)
    this.ember = new THREE.MeshStandardMaterial({ color: '#842711', emissive: '#ed4012', emissiveIntensity: .5, roughness: 1 })
    const ember = new THREE.Mesh(new THREE.CylinderGeometry(.0072, .0072, .002, 14), this.ember); ember.position.y = .086; cigar.add(ember); this.cigarTip = ember
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 64
    const g = canvas.getContext('2d')!, gradient = g.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, '#d7d2c860'); gradient.addColorStop(.4, '#b6b5b028'); gradient.addColorStop(1, '#aab1b000')
    g.fillStyle = gradient; g.fillRect(0, 0, 64, 64)
    this.smokeTexture = new THREE.CanvasTexture(canvas)
  }
  setActive(active: boolean): void { this.active = active; this.root.visible = active }
  setInspection(active: boolean): void {
    if (active && !this.inspecting) this.smokingAt = -100
    this.inspecting = active
  }
  update(cards: Card[], folded: boolean, hand: number): void {
    const now = performance.now() / 1000
    if (hand !== this.lastHand) { this.dealtAt = now; this.lastHand = hand }
    if (folded && this.visibleHand) this.foldAt = now
    this.visibleHand = cards.length === 2 && !folded
    cards.forEach((card, i) => {
      const material = this.paper[i].material as THREE.MeshBasicMaterial
      material.map = this.texture(card); material.needsUpdate = true
    })
  }
  smokeCigar(): boolean {
    const now = performance.now() / 1000
    if (!this.active || this.inspecting || now - this.smokingAt < 4.2) return false
    this.smokingAt = now; return true
  }
  frame(now: number, reduced: boolean): void {
    const sincePuff = now - this.smokingAt, sinceDeal = now - this.dealtAt, sinceFold = now - this.foldAt
    const lift = sincePuff < .9 ? THREE.MathUtils.smoothstep(sincePuff, 0, .9) : sincePuff < 2 ? 1 : 1 - THREE.MathUtils.smoothstep(sincePuff, 2, 3.2)
    const breath = reduced ? 0 : Math.sin(now * 1.1) * .0015
    const fold = this.visibleHand ? 0 : THREE.MathUtils.smoothstep(sinceFold, 0, .7)
    const deal = 1 - THREE.MathUtils.smoothstep(sinceDeal, .35, 1.25)
    this.left.visible = this.visibleHand || sinceFold < .8
    this.left.position.set(-.205, -.205 + breath - Math.max(fold, deal) * .24, -.47)
    this.left.rotation.set(-.18, .24, .10 + fold * .55)
    // Solve the bite-end position against the mouth below the camera's eyes.
    // Arbitrarily moving a cigar towards screen centre made it stab the lens.
    const mouth = new THREE.Vector3(0, -.12, -.16)
    const atMouth = mouth.sub(this.mouthLocal.clone().applyQuaternion(this.smokingRotation))
    this.right.position.lerpVectors(new THREE.Vector3(.235, -.19 + breath, -.50), atMouth, lift)
    this.right.quaternion.slerpQuaternions(this.restingRotation, this.smokingRotation, lift)
    this.ember.emissiveIntensity = .5 + lift * 2.5
    const exhale = sincePuff > 1.8 && sincePuff < 3.8
    if (this.active && !this.inspecting && !reduced && now - this.lastEmission > (exhale ? .07 : .25)) {
      this.lastEmission = now
      const material = new THREE.SpriteMaterial({ map: this.smokeTexture, color: '#b5b6b1', transparent: true, depthWrite: false, opacity: .25 })
      const mesh = new THREE.Sprite(material), seed = now * 71
      this.root.updateWorldMatrix(true, true)
      const origin = exhale ? new THREE.Vector3(.0, -.02, -.22) : this.root.worldToLocal(this.cigarTip.getWorldPosition(new THREE.Vector3()))
      mesh.position.copy(origin); this.root.add(mesh); this.smoke.push({ mesh, birth: now, seed, origin })
    }
    for (let i = this.smoke.length - 1; i >= 0; i--) {
      const p = this.smoke[i], age = now - p.birth
      // Smoke is camera-parented with the held cigar. Clear it on inspection;
      // otherwise invisible puffs below the felt jump back into view on return.
      if (age > 2.6 || !this.active || this.inspecting || reduced) { p.mesh.material.dispose(); p.mesh.removeFromParent(); this.smoke.splice(i, 1); continue }
      p.mesh.position.copy(p.origin).add(new THREE.Vector3(Math.sin(age * 2 + p.seed) * age * .024, age * .055, -age * .045))
      p.mesh.scale.setScalar(.021 + age * .04); p.mesh.material.rotation = p.seed + age * .3
      p.mesh.material.opacity = Math.sin(age / 2.6 * Math.PI) * .27
    }
  }
  dispose(): void { this.smokeTexture.dispose() }
}
