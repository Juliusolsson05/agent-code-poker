import * as THREE from 'three'
import { SeatedArm } from './Arm'
import { InteractionDirector } from './InteractionDirector'
import { PLAYER_LAYOUT } from './environment/layout'
import { coaster, TableDrink } from './Drinks'
import { TABLE } from './Table'
import type { Card } from '../engine/cards'
import { createHeldCardFan } from './CardGrip'
import { transform } from './diagnostics/SceneCapture'

const smooth = (t: number, a: number, b: number) => THREE.MathUtils.smoothstep(t, a, b)
export type LeisureAction = 'idle' | 'smoke' | 'drink' | 'return'
/** A world-space presenter, not an animation owner. The director resolves each
 * prop and wrist once. Both arms now have shoulder/elbow/wrist chains rather
 * than short sleeves dangling from camera-local hands. Neither camera lean nor
 * a skipped frame can change an attachment or stretch an arm to reach a glass. */
export class FirstPerson {
  readonly root = new THREE.Group()
  readonly tableProps = new THREE.Group()
  private director = new InteractionDirector()
  private resolved = this.director.sample(0)
  private leftRig: SeatedArm
  private rightRig: SeatedArm
  private get left() { return this.leftRig.hand }
  private get right() { return this.rightRig.hand }
  private fan = new THREE.Group()
  private paper: THREE.Mesh[] = []
  private cigar = new THREE.Group()
  private cigarTip = new THREE.Object3D()
  private ember: THREE.MeshStandardMaterial
  private drink = new TableDrink('old-fashioned')
  private drinkHome = new THREE.Vector3(...PLAYER_LAYOUT.drink)
  private cigarHome = new THREE.Vector3(...PLAYER_LAYOUT.cigar)
  private smoke: { mesh: THREE.Sprite; birth: number; seed: number; origin: THREE.Vector3 }[] = []
  private smokeTexture: THREE.CanvasTexture
  private now = 0
  private dealtAt = -100
  private foldAt = -100
  private visibleHand = false
  private lastHand = 0
  private lastEmission = 0
  private active = false
  private inspecting = false
  constructor(_geometry: THREE.BoxGeometry, private texture: (card: Card | null) => THREE.CanvasTexture) {
    this.root.name = 'player-body-world'; this.root.position.set(...PLAYER_LAYOUT.body)
    this.tableProps.name = 'player-props-world'
    this.leftRig = new SeatedArm(this.root, -1, '#ae8165', '#252b2c', '#ada796')
    this.rightRig = new SeatedArm(this.root, 1, '#ae8165', '#252b2c', '#ada796')
    this.left.pose('cards'); this.right.pose('cigar')
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
    this.tableProps.add(this.drink.root, this.cigar)
    this.drink.root.position.copy(this.drinkHome)
    const mat = coaster(); mat.position.copy(this.drinkHome); mat.position.y -= .0015; this.tableProps.add(mat)
    const tray = new THREE.Mesh(new THREE.CylinderGeometry(.060, .060, .026, 32), new THREE.MeshStandardMaterial({ color: '#5b5549', metalness: .65, roughness: .42 }))
    tray.position.copy(this.cigarHome); tray.position.y = TABLE.feltY + .013; this.tableProps.add(tray)
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 64
    const g = canvas.getContext('2d')!, gradient = g.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, '#d7d2c850'); gradient.addColorStop(.4, '#b6b5b021'); gradient.addColorStop(1, '#aab1b000')
    g.fillStyle = gradient; g.fillRect(0, 0, 64, 64); this.smokeTexture = new THREE.CanvasTexture(canvas)
  }
  get leisureAction(): LeisureAction { return this.resolved.action }
  get inspectionReady(): boolean { return this.resolved.inspectionReady }
  diagnosticPose() {
    return { action: this.resolved.action, phase: this.resolved.phase, active: this.active, inspecting: this.inspecting,
      root: transform(this.root), left: transform(this.left.root), right: transform(this.right.root),
      drink: transform(this.drink.root), cigar: transform(this.cigar), table: transform(this.tableProps),
      drinkOwner: this.resolved.drink.owner, cigarOwner: this.resolved.cigar.owner,
      arm: this.resolved.arm, drinkHome: this.drinkHome.toArray(), cigarHome: this.cigarHome.toArray(),
      glassGrip: this.director.calibration.handGlassContact, cigarGrip: this.director.calibration.handCigarContact }
  }
  get inspectionTargets(): Record<string, THREE.Object3D> { return { 'Player cards': this.left.root, 'Player cigar': this.right.root, 'Old Fashioned': this.drink.root } }
  resetInteraction(): void { this.director.setActive(false, 0); this.director.setActive(this.active, 0); this.now = 0; this.inspecting = false }
  setActive(active: boolean): void { this.active = active; this.root.visible = active; this.director.setActive(active, this.now) }
  setInspection(active: boolean): void { this.inspecting = active; this.director.inspect(active, this.now) }
  /** The dev inspector hides unrelated surfaces, but uses these exact meshes.
   * This is display isolation only; it never substitutes a prettier test hand. */
  showInspectionSubject(name: string): void {
    this.leftRig.mesh.visible = name === 'Player cards'
    this.rightRig.mesh.visible = name === 'Player cigar'
    this.left.root.visible = name === 'Player cards'; this.right.root.visible = name === 'Player cigar'
    this.cigar.visible = name === 'Player cigar'; this.drink.root.visible = name === 'Old Fashioned'
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
  smokeCigar(): boolean { return this.director.begin('smoke', this.now) }
  sipDrink(): boolean { return this.director.begin('drink', this.now) }
  frame(now: number, reduced: boolean): void {
    this.now = now; this.resolved = this.director.sample(now)
    const pose = this.resolved
    this.root.visible = this.active && !pose.inspectionReady
    const sinceDeal = now - this.dealtAt, sinceFold = now - this.foldAt
    const fold = this.visibleHand ? 0 : smooth(sinceFold, 0, .7), deal = 1 - smooth(sinceDeal, .8, 1.55)
    const breath = reduced ? 0 : Math.sin(now * 1.1) * .001
    this.left.root.visible = this.visibleHand || sinceFold < .8
    // The left arm lowers through its own shoulder chain. Card ownership stays
    // on the real hand until the separate private-inspection surface is shown.
    const leftWrist = new THREE.Vector3(-.165, 1.15 + breath - Math.max(fold, deal) * .20, 1.10).sub(this.root.position)
    this.leftRig.solve(leftWrist, new THREE.Euler(-.41, .12, -.07 - fold * .4))
    this.right.pose(pose.right.grip)
    this.rightRig.poseJoints(new THREE.Vector3(...pose.arm.elbow).sub(this.root.position), new THREE.Vector3(...pose.arm.wrist).sub(this.root.position),
      new THREE.Euler().setFromQuaternion(new THREE.Quaternion(...pose.right.rotation)))
    // Props stay under an identity world-space parent for their entire lifetime.
    // Ownership is explicit data, not Object3D.parent, so no attach()/add() call
    // can accidentally apply a camera or body transform a second time.
    this.drink.root.position.set(...pose.drink.position); this.drink.root.quaternion.set(...pose.drink.rotation)
    this.cigar.position.set(...pose.cigar.position); this.cigar.quaternion.set(...pose.cigar.rotation)
    this.cigar.visible = this.active && !(pose.inspectionReady && pose.cigar.owner === 'right-hand')
    this.ember.emissiveIntensity = pose.phase === 'puff' ? 1.8 : .3
    const exhale = pose.action === 'smoke' && pose.phase === 'lower-cigar'
    if (this.active && !this.inspecting && !reduced && now - this.lastEmission > (exhale ? .10 : .5) && this.smoke.length < 30) {
      this.lastEmission = now
      const material = new THREE.SpriteMaterial({ map: this.smokeTexture, color: '#b5b6b1', transparent: true, depthWrite: false, opacity: .20 })
      const mesh = new THREE.Sprite(material), seed = now * 71
      this.root.updateWorldMatrix(true, true); this.tableProps.updateWorldMatrix(true, true)
      const origin = this.root.worldToLocal(exhale ? new THREE.Vector3(.015, 1.335, 1.37) : this.cigarTip.getWorldPosition(new THREE.Vector3()))
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
