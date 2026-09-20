import * as THREE from 'three'
import { AnatomicalHand } from './Hand'
import { anatomyMaterial, VoxelSculpt } from './Voxel'
import { coaster, TableDrink } from './Drinks'
import { TABLE } from './Table'
import type { Card } from '../engine/cards'
import { createHeldCardFan } from './CardGrip'
import { transform } from './diagnostics/SceneCapture'

const smooth = (t: number, a: number, b: number) => THREE.MathUtils.smoothstep(t, a, b)
export type LeisureAction = 'idle' | 'smoke' | 'drink'
/** One right hand, one interaction owner. The visual clock is supplied by the
 * room so pause freezes contacts instead of skipping a sip when focus returns.
 * Inspection cancels leisure actions to stable homes; it never leaves a glass
 * parented to an invisible hand or a cigar hanging in space. */
export class FirstPerson {
  readonly root = new THREE.Group()
  readonly tableProps = new THREE.Group()
  private left = new AnatomicalHand('left')
  private right = new AnatomicalHand('right')
  private fan = new THREE.Group()
  private paper: THREE.Mesh[] = []
  private cigar = new THREE.Group()
  private cigarTip = new THREE.Object3D()
  private bite = new THREE.Vector3(-.063, .003, 0)
  private ember: THREE.MeshStandardMaterial
  private drink = new TableDrink('old-fashioned')
  private drinkHome = new THREE.Vector3(.89, TABLE.feltY + .003, .53)
  private cigarHome = new THREE.Vector3(1.10, TABLE.feltY + .013, .53)
  private smoke: { mesh: THREE.Sprite; birth: number; seed: number; origin: THREE.Vector3 }[] = []
  private smokeTexture: THREE.CanvasTexture
  private action: LeisureAction = 'idle'
  private actionAt = -100
  private now = 0
  private dealtAt = -100
  private foldAt = -100
  private visibleHand = false
  private lastHand = 0
  private lastEmission = 0
  private active = false
  private inspecting = false
  private restRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(-.15, -.45, -.40))
  private mouthRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(-.20, -.30, -.10))
  private cigarGrip = new THREE.Vector3(-.009, .091, .031)
  private glassGrip = new THREE.Vector3(-.004, .079, .047)

  constructor(_geometry: THREE.BoxGeometry, private texture: (card: Card | null) => THREE.CanvasTexture) {
    this.root.add(this.left.root, this.right.root)
    this.left.pose('cards'); this.right.pose('cigar')
    for (const hand of [this.left, this.right]) {
      const sleeve = new VoxelSculpt(.004)
      sleeve.volume([-.033, -.19, -.024], [.033, -.008, .028], (x, y, z) => {
        const width = THREE.MathUtils.lerp(.030, .023, (y + .19) / .182)
        return (x / width) ** 4 + (z / .023) ** 4 < 1
      }, '#252b2c')
      sleeve.volume([-.025, -.020, -.018], [.025, -.004, .018], (x, _y, z) => (x / .025) ** 4 + (z / .018) ** 4 < 1, '#ada796')
      hand.root.add(sleeve.mesh(anatomyMaterial(.93)))
    }
    const held = createHeldCardFan(texture); this.fan = held.fan; this.paper = held.paper; this.left.root.add(this.fan)
    const cylinder = (r: number, length: number, color: string, x: number, roughness = .8) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, length, 20), new THREE.MeshStandardMaterial({ color, roughness }))
      mesh.rotation.z = -Math.PI / 2; mesh.position.x = x; this.cigar.add(mesh); return mesh
    }
    this.cigar.name = 'player-cigar'
    cylinder(.0062, .126, '#513423', 0, .93)
    cylinder(.00645, .015, '#b49a58', -.028, .45)
    cylinder(.00635, .013, '#79756a', .068)
    this.ember = new THREE.MeshStandardMaterial({ color: '#762c19', emissive: '#d73910', emissiveIntensity: .3, roughness: 1 })
    const ember = new THREE.Mesh(new THREE.CylinderGeometry(.0059, .0059, .0015, 20), this.ember)
    ember.rotation.z = -Math.PI / 2; ember.position.x = .075; this.cigar.add(ember)
    this.cigarTip.position.x = .077; this.cigar.add(this.cigarTip)
    this.right.root.add(this.cigar); this.cigar.position.copy(this.cigarGrip)
    this.tableProps.add(this.drink.root)
    this.drink.root.position.copy(this.drinkHome)
    const mat = coaster(); mat.position.copy(this.drinkHome); mat.position.y -= .0015; this.tableProps.add(mat)
    const tray = new THREE.Mesh(new THREE.CylinderGeometry(.060, .060, .009, 32), new THREE.MeshStandardMaterial({ color: '#5b5549', metalness: .65, roughness: .42 }))
    tray.position.copy(this.cigarHome); tray.position.y -= .008; this.tableProps.add(tray)
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 64
    const g = canvas.getContext('2d')!, gradient = g.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, '#d7d2c850'); gradient.addColorStop(.4, '#b6b5b021'); gradient.addColorStop(1, '#aab1b000')
    g.fillStyle = gradient; g.fillRect(0, 0, 64, 64); this.smokeTexture = new THREE.CanvasTexture(canvas)
  }
  get leisureAction(): LeisureAction { return this.action }
  diagnosticPose() {
    return { action: this.action, actionAt: this.actionAt, active: this.active, inspecting: this.inspecting,
      root: transform(this.root), left: transform(this.left.root), right: transform(this.right.root),
      drink: transform(this.drink.root), cigar: transform(this.cigar), table: transform(this.tableProps),
      drinkHome: this.drinkHome.toArray(), cigarHome: this.cigarHome.toArray(), glassGrip: this.glassGrip.toArray(), cigarGrip: this.cigarGrip.toArray() }
  }
  get inspectionTargets(): Record<string, THREE.Object3D> { return { 'Player cards': this.left.root, 'Player cigar': this.right.root, 'Old Fashioned': this.drink.root } }
  resetInteraction(): void { this.cancel(); this.now = 0 }
  setActive(active: boolean): void { this.active = active; this.root.visible = active; if (!active) this.cancel() }
  setInspection(active: boolean): void { if (active && !this.inspecting) this.cancel(); this.inspecting = active }
  private cancel(): void {
    this.action = 'idle'; this.tableProps.add(this.drink.root); this.drink.root.position.copy(this.drinkHome); this.drink.root.quaternion.identity()
    this.right.root.add(this.cigar); this.cigar.position.copy(this.cigarGrip); this.cigar.quaternion.identity()
    for (const puff of this.smoke) { puff.mesh.removeFromParent(); puff.mesh.material.dispose() }
    this.smoke = []
  }
  update(cards: Card[], folded: boolean, hand: number, now = this.now): void {
    if (hand !== this.lastHand) { this.dealtAt = now; this.lastHand = hand }
    if (folded && this.visibleHand) this.foldAt = now
    this.visibleHand = cards.length === 2 && !folded
    cards.forEach((card, i) => {
      const material = this.paper[i].material as THREE.MeshBasicMaterial
      material.map = this.texture(card); material.needsUpdate = true
    })
  }
  smokeCigar(): boolean { return this.begin('smoke') }
  sipDrink(): boolean { return this.begin('drink') }
  private begin(action: LeisureAction): boolean {
    if (!this.active || this.inspecting || this.action !== 'idle') return false
    this.action = action; this.actionAt = this.now; return true
  }
  /** Solve wrist translation from a point of contact, not from eyeballed camera
   * offsets. The same transform works at every aspect ratio and inspection yaw. */
  private placeGrip(contact: THREE.Vector3, local: THREE.Vector3, rotation: THREE.Quaternion): THREE.Vector3 {
    return contact.clone().sub(local.clone().applyQuaternion(rotation))
  }
  private tablePoint(point: THREE.Vector3): THREE.Vector3 {
    this.root.updateWorldMatrix(true, false); this.tableProps.updateWorldMatrix(true, false)
    return this.root.worldToLocal(this.tableProps.localToWorld(point.clone()))
  }
  frame(now: number, reduced: boolean): void {
    this.now = now
    const age = now - this.actionAt, sinceDeal = now - this.dealtAt, sinceFold = now - this.foldAt
    const breath = reduced ? 0 : Math.sin(now * 1.1) * .001
    const fold = this.visibleHand ? 0 : smooth(sinceFold, 0, .7), deal = 1 - smooth(sinceDeal, .8, 1.55)
    this.left.root.visible = this.visibleHand || sinceFold < .8
    this.left.root.position.set(-.165, -.19 + breath - Math.max(fold, deal) * .24, -.43)
    this.left.root.rotation.set(-.22, .12, -.07 - fold * .4)
    this.right.root.position.set(.205, -.215 + breath, -.47); this.right.root.quaternion.copy(this.restRotation)
    this.right.pose('cigar')
    let puff = 0
    if (this.action === 'smoke') {
      puff = age < .9 ? smooth(age, 0, .9) : age < 1.8 ? 1 : 1 - smooth(age, 1.8, 3.0)
      if (!reduced) {
        const localBite = this.bite.clone().add(this.cigarGrip)
        const target = this.placeGrip(new THREE.Vector3(.015, -.095, -.14), localBite, this.mouthRotation)
        this.right.root.position.lerp(target, puff); this.right.root.quaternion.slerp(this.mouthRotation, puff)
      }
      if (age >= 3.8) this.action = 'idle'
    }
    if (this.action === 'drink') {
      // Table -> grip -> mouth -> table is explicit. Ownership changes only at
      // contact boundaries, so a glass cannot exist simultaneously in two places.
      const tray = this.tablePoint(this.cigarHome), glassBase = this.tablePoint(this.drinkHome)
      const rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(-.10, -.55, -1.18))
      const trayWrist = this.placeGrip(tray, this.cigarGrip, this.restRotation)
      const gripPoint = glassBase.clone().add(new THREE.Vector3(.038, .038, .015))
      const glassWrist = this.placeGrip(gripPoint, this.glassGrip, rotation)
      if (age < .65) this.right.root.position.lerp(trayWrist, smooth(age, 0, .65))
      else if (age < 1.25) {
        this.tableProps.add(this.cigar); this.cigar.position.copy(this.cigarHome); this.cigar.quaternion.identity()
        this.right.pose('rest'); this.right.root.position.lerpVectors(trayWrist, glassWrist, smooth(age, .65, 1.25))
        this.right.root.quaternion.slerp(rotation, smooth(age, .65, 1.25))
      } else if (age < 4.8) {
        this.right.pose('glass')
        const lift = age < 2.3 ? smooth(age, 1.25, 2.3) : age < 3.25 ? 1 : 1 - smooth(age, 3.25, 4.8)
        // The glass itself owns the sip arc. Wrist position is derived from its
        // grip anchor each frame, making it impossible for fingers to lag behind.
        this.root.add(this.drink.root)
        this.drink.root.position.lerpVectors(glassBase, new THREE.Vector3(.025, -.165, -.20), reduced ? 0 : lift)
        this.drink.root.rotation.set(reduced ? 0 : .36 * lift, 0, reduced ? 0 : -.12 * lift)
        const contact = new THREE.Vector3(.038, .038, .015).applyQuaternion(this.drink.root.quaternion).add(this.drink.root.position)
        this.right.root.quaternion.copy(rotation).premultiply(this.drink.root.quaternion)
        this.right.root.position.copy(this.placeGrip(contact, this.glassGrip, this.right.root.quaternion))
      } else if (age < 5.4) {
        this.tableProps.add(this.drink.root); this.drink.root.position.copy(this.drinkHome); this.drink.root.quaternion.identity()
        this.right.pose('rest'); this.right.root.position.lerpVectors(glassWrist, trayWrist, smooth(age, 4.8, 5.4))
        this.right.root.quaternion.copy(rotation).slerp(this.restRotation, smooth(age, 4.8, 5.4))
      } else {
        this.right.root.add(this.cigar); this.cigar.position.copy(this.cigarGrip); this.cigar.quaternion.identity()
        this.right.root.position.lerpVectors(trayWrist, new THREE.Vector3(.205, -.215, -.47), smooth(age, 5.4, 6.1))
        if (age >= 6.1) this.action = 'idle'
      }
    }
    this.ember.emissiveIntensity = .3 + puff * 1.5
    const exhale = this.action === 'smoke' && age > 1.8 && age < 3.6
    if (this.active && !this.inspecting && !reduced && now - this.lastEmission > (exhale ? .10 : .5) && this.smoke.length < 30) {
      this.lastEmission = now
      const material = new THREE.SpriteMaterial({ map: this.smokeTexture, color: '#b5b6b1', transparent: true, depthWrite: false, opacity: .20 })
      const mesh = new THREE.Sprite(material), seed = now * 71
      this.root.updateWorldMatrix(true, true); this.tableProps.updateWorldMatrix(true, true)
      const origin = exhale ? new THREE.Vector3(0, -.025, -.20) : this.root.worldToLocal(this.cigarTip.getWorldPosition(new THREE.Vector3()))
      mesh.position.copy(origin); this.root.add(mesh); this.smoke.push({ mesh, birth: now, seed, origin })
    }
    for (let i = this.smoke.length - 1; i >= 0; i--) {
      const p = this.smoke[i], life = now - p.birth
      if (life > 2.6 || !this.active || this.inspecting || reduced) { p.mesh.material.dispose(); p.mesh.removeFromParent(); this.smoke.splice(i, 1); continue }
      p.mesh.position.copy(p.origin).add(new THREE.Vector3(Math.sin(life * 2 + p.seed) * life * .018, life * .048, -life * .04))
      p.mesh.scale.setScalar(.017 + life * .032); p.mesh.material.rotation = p.seed + life * .3
      p.mesh.material.opacity = Math.sin(life / 2.6 * Math.PI) * .20
    }
  }
  dispose(): void { this.smokeTexture.dispose() }
}
