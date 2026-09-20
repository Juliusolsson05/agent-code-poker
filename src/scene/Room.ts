import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { rankLabel, suit, SUITS, type Card } from '../engine/cards'
import { type GameState } from '../engine/game'
import { buildHuman, humanMaterial, type Human } from './Human'
import { FirstPerson } from './FirstPerson'
import { ChipField } from './Chips'
import { CardField } from './Cards'
import { createTableSurface, dealerPosition, TABLE } from './Table'

export const SEATS: [number, number][] = [[0, 1.7], [-1.91, -.43], [-1.15, -1.13], [0, -1.40], [1.15, -1.13], [1.91, -.43]]
type Block = { color: string; position: [number, number, number]; size: [number, number, number] }

/** Everything is authored in metres, from a seated human's eye line. The first
 * room was orthographic with toy proportions: that erased physical presence.
 * Fine voxel anatomy and a perspective lens are the foundation here; glow
 * cannot compensate for the wrong scale or viewpoint. */
export class PokerRoom {
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(70, 1.4, .035, 35)
  private labelCamera = new THREE.PerspectiveCamera(70, 1.4, .035, 35)
  private renderer: THREE.WebGLRenderer
  private composer: EffectComposer
  private bloom: UnrealBloomPass
  private output: OutputPass
  private geometry = new THREE.BoxGeometry(1, 1, 1)
  private materials = new Map<string, THREE.MeshStandardMaterial>()
  private textures = new Map<string, THREE.CanvasTexture>()
  private people: Human[] = []
  private hero: FirstPerson
  private chips: ChipField
  private cardField: CardField
  private dealer: THREE.Mesh
  private gestures = new Map<number, { kind: string; time: number }>()
  private handTime = 0
  private state: GameState | null = null
  private signature = ''
  private raf = 0
  private start = performance.now()
  private reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  private observer: ResizeObserver
  private alive = true
  private orbit = 0
  private inspecting = false
  private inspectionBlend = 0
  private lastFrame = performance.now()
  private pointer = new THREE.Vector2()
  private gaze = new THREE.Vector2()
  private dust: THREE.Points

  constructor(private container: HTMLElement, private onFailure: () => void, private onLayout: () => void = () => {}) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1))
    this.renderer.setClearColor('#090a0c'); this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.28
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.domElement.setAttribute('aria-label', 'Seated first-person view of a dimly lit poker table, detailed voxel opponents, and an amber-lit bar')
    this.renderer.domElement.setAttribute('role', 'img'); container.append(this.renderer.domElement)
    this.renderer.domElement.addEventListener('webglcontextlost', this.lost)
    container.parentElement?.addEventListener('pointermove', this.look)
    container.parentElement?.addEventListener('pointerleave', this.centerLook)
    this.scene.fog = new THREE.FogExp2('#0a0b10', .048)
    this.scene.add(new THREE.HemisphereLight('#96abc1', '#241a14', .43))
    // Broad warm key illuminates eyes/hands from the player's side. Dim cool
    // backlight separates dark jackets from the room. Only one light shadows.
    const key = new THREE.SpotLight('#ffdeb7', 25, 12, .91, .78, 1.6)
    key.position.set(-.65, 3.05, 1.2); key.target.position.set(0, .82, -.30)
    key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -.00008; key.shadow.normalBias = .013
    this.scene.add(key, key.target)
    for (const [color, power, x, y, z] of [['#e6bd91', 4, 1.8, 1.9, 1.4], ['#728dca', 9, -2.7, 2.3, -2.5], ['#ef9e4b', 7, .3, 1.9, -3.3]] as const) {
      const light = new THREE.PointLight(color, power, 8, 1.5); light.position.set(x, y, z); this.scene.add(light)
    }
    this.buildRoom()
    const skinMaterial = humanMaterial(); this.materials.set('humans', skinMaterial)
    for (let seat = 1; seat < 6; seat++) {
      const human = buildHuman(seat, this.geometry, skinMaterial); const [x, z] = SEATS[seat]
      human.root.position.set(x, 0, z); human.root.rotation.y = Math.atan2(-x * .8, .65 - z)
      this.people.push(human); this.scene.add(human.root)
      const chair = new THREE.Group(); chair.position.copy(human.root.position); chair.rotation.copy(human.root.rotation)
      // Chairs share their occupant's orientation, but not their animated rig.
      // The old globally aligned backs crossed side players' forearms.
      this.box(chair, '#211d1a', 0, .57, -.04, .46, .10, .40)
      this.box(chair, '#28231e', 0, 1.00, -.205, .44, .75, .065)
      for (const dx of [-.18, .18]) this.box(chair, '#292824', dx, .29, -.04, .030, .56, .03)
      this.scene.add(chair)
      for (let i = 0; i < 2; i++) {
        // Opponent held cards use ONLY a back texture on BOTH sides. Even a
        // camera lean or animation cannot accidentally expose private ranks.
        const card = new THREE.Mesh(new THREE.PlaneGeometry(.070, .103), new THREE.MeshBasicMaterial({ map: this.cardTexture(null), color: '#d0c4ae', side: THREE.DoubleSide }))
        card.position.set((i - .5) * .031, 0, i * .002); card.rotation.z = (i - .5) * -.23; human.cards.add(card)
      }
    }
    this.hero = new FirstPerson(this.geometry, c => this.cardTexture(c)); this.camera.add(this.hero.root); this.scene.add(this.camera)
    this.chips = new ChipField(SEATS); this.scene.add(this.chips.root)
    this.cardField = new CardField(SEATS, c => this.cardTexture(c)); this.scene.add(this.cardField.root)
    this.dealer = new THREE.Mesh(new THREE.CylinderGeometry(.039, .039, .012, 32), this.material('#b9af99')); this.dealer.visible = false; this.scene.add(this.dealer)
    const dustGeometry = new THREE.BufferGeometry(), positions = new Float32Array(150 * 3)
    for (let i = 0; i < 150; i++) { positions[i * 3] = Math.sin(i * 78.23) * 3.4; positions[i * 3 + 1] = .85 + (Math.sin(i * 12.87) + 1) * 1.2; positions[i * 3 + 2] = Math.cos(i * 61.23) * 2.7 - 1.5 }
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: '#b69a70', size: .005, transparent: true, opacity: .26, depthWrite: false })); this.scene.add(this.dust)
    // Renderer antialias:true only affects its default framebuffer. Once bloom
    // renders offscreen it provides no MSAA. Multisample the actual composer
    // target to stop fine voxel silhouettes/shadow edges sparkling in motion.
    const target = new THREE.WebGLRenderTarget(1100, 800, { type: THREE.HalfFloatType, samples: 4 })
    this.composer = new EffectComposer(this.renderer, target); this.composer.addPass(new RenderPass(this.scene, this.camera))
    // Threshold above skin/felt luminance restricts bloom to practical fixtures.
    // The room must stay dark rather than washing everything in a hazy filter.
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1100, 800), .18, .45, 4.0); this.output = new OutputPass()
    this.composer.addPass(this.bloom); this.composer.addPass(this.output)
    this.observer = new ResizeObserver(() => this.resize()); this.observer.observe(container); this.resize(); this.frame()
  }
  private lost = (event: Event) => { event.preventDefault(); this.onFailure() }
  private look = (event: PointerEvent) => {
    const bounds = this.container.getBoundingClientRect()
    this.pointer.set((event.clientX - bounds.left) / bounds.width - .5, (event.clientY - bounds.top) / bounds.height - .5)
  }
  private centerLook = () => this.pointer.set(0, 0)
  private material(color: string): THREE.MeshStandardMaterial {
    let m = this.materials.get(color)
    if (!m) { m = new THREE.MeshStandardMaterial({ color, roughness: .72 }); this.materials.set(color, m) }
    return m
  }
  private box(parent: THREE.Object3D, color: string, x: number, y: number, z: number, sx: number, sy: number, sz: number): THREE.Mesh {
    const mesh = new THREE.Mesh(this.geometry, this.material(color)); mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz)
    mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh
  }
  private glow(color: string, x: number, y: number, z: number, sx: number, sy: number, sz: number, strength = 3): void {
    const mesh = new THREE.Mesh(this.geometry, new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: strength }))
    mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz); this.scene.add(mesh)
  }
  private buildRoom(): void {
    const blocks: Block[] = []
    const b = (color: string, x: number, y: number, z: number, sx: number, sy: number, sz: number) => blocks.push({ color, position: [x, y, z], size: [sx, sy, sz] })
    b('#151311', 0, -.06, -1, 12, .1, 13)
    for (let row = 0; row < 28; row++) for (let col = 0; col < 25; col++)
      b(['#322821', '#2b2421', '#352a25', '#292420'][(col * 7 + row * 3) % 4], (col - 12) * .39 + row % 2 * .19, row * .13 + .04, -5.3, .377, .117, .12)
    b('#161716', -4.8, 1.8, -1.2, .12, 3.6, 8); b('#181614', 4.8, 1.8, -1.2, .12, 3.6, 8); b('#10100f', 0, 3.6, -1.2, 10, .12, 9)
    for (let x = -4; x <= 4; x++) b('#221d18', x, 3.40, -1.1, .12, .23, 8)
    // Dark back-bar mirror, brass uprights and individually labelled bottles
    // supply scale/depth. Their highlights stay subordinate to faces and felt.
    b('#14181a', 0, 1.93, -5.15, 4.50, 2.5, .08)
    for (const x of [-2.3, -.76, .76, 2.3]) b('#705333', x, 1.87, -5.00, .035, 2.3, .10)
    for (const y of [1.13, 1.80, 2.48]) {
      b('#4a3526', 0, y, -4.89, 4.65, .055, .47); this.glow('#f2b269', 0, y - .032, -4.95, 4.3, .012, .03)
      for (let i = 0; i < 20; i++) {
        const x = -2.10 + i * .22, h = .22 + i % 4 * .038, color = ['#574125', '#253e30', '#65452a', '#334132', '#604029'][i % 5]
        b(color, x, y + h / 2 + .032, -4.87, .078, h, .078); b(color, x, y + h + .06, -4.87, .039, .076, .039)
        b('#a49673', x, y + h + .106, -4.87, .043, .018, .043); b(i % 3 ? '#9c8863' : '#3c332a', x, y + h * .47, -4.825, .063, h * .34, .003)
      }
    }
    b('#201712', 0, .55, -3.82, 5.4, 1.1, .68)
    for (let x = -2.5; x < 2.6; x += .39) { b('#34241c', x, .54, -3.46, .35, .91, .027); b('#6b5032', x, .91, -3.44, .30, .016, .016) }
    b('#392e26', 0, 1.12, -3.76, 5.7, .10, .92); b('#8b673d', 0, .16, -3.18, 5.3, .035, .035)
    for (const x of [-1.7, -.55, .65, 1.8]) {
      b('#171818', x, .36, -2.98, .036, .69, .036); b('#2b201c', x, .72, -2.98, .36, .09, .36); b('#27221d', x, .045, -2.98, .34, .06, .34)
    }
    b('#151719', -3.55, 2.01, -5.17, 1.35, 2.15, .15)
    for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) {
      b('#26303d', -3.96 + x * .41, 1.34 + y * .65, -5.05, .37, .60, .05)
      for (let r = 0; r < 6; r++) b('#354355', -4.10 + x * .41 + r * .055, 1.26 + y * .65 + Math.sin(r * 7) * .2, -5.015, .003, .12 + r * .021, .002)
    }
    for (const x of [-3, 3]) {
      b('#705232', x, 2.25, -5.04, .07, .36, .13); b('#a47d46', x, 2.30, -4.89, .26, .22, .19)
      this.glow('#ffce8d', x, 2.16, -4.90, .17, .035, .12)
      const light = new THREE.PointLight('#eaaa65', 2, 2.5, 1.5); light.position.set(x, 2.14, -4.60); this.scene.add(light)
    }
    this.sign('THE RIVER', 3.55, 2.33, -5.08, 1.85, .42); this.sign('PRIVATE CARD ROOM', 3.55, 1.98, -5.07, 1.85, .18, true)
    this.scene.add(createTableSurface())
    b('#211a16', 0, .65, 0, 3.0, .20, 1.7); b('#181615', 0, .32, 0, 1.6, .6, .65)
    for (const x of [-1.08, 1.08]) {
      b('#5a4936', x, 3.12, -.06, .012, .90, .012)
      for (let row = 0; row < 9; row++) b('#51412d', x, 2.76 - row * .014, -.06, .18 + row * .040, .015, .15 + row * .027)
      this.glow('#ffdca1', x, 2.637, -.06, .42, .008, .29, 5)
    }
    const mesh = new THREE.InstancedMesh(this.geometry, new THREE.MeshStandardMaterial({ roughness: .83 }), blocks.length), dummy = new THREE.Object3D()
    blocks.forEach((block, i) => { dummy.position.set(...block.position); dummy.scale.set(...block.size); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix); mesh.setColorAt(i, new THREE.Color(block.color)) })
    mesh.castShadow = true; mesh.receiveShadow = true; this.scene.add(mesh); this.feltMark()
  }
  private feltMark(): void {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 512
    const g = canvas.getContext('2d')!; g.textAlign = 'center'; g.strokeStyle = '#d6c18a50'; g.lineWidth = 2
    g.beginPath(); g.ellipse(512, 256, 445, 180, 0, 0, Math.PI * 2); g.stroke()
    g.fillStyle = '#d6c18a75'; g.font = '26px Georgia'; g.fillText('T H E   R I V E R   C L U B', 512, 337); g.font = '16px Georgia'; g.fillText('NO LIMIT  ·  GOOD COMPANY', 512, 365)
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; this.textures.set('felt', texture)
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 1.35), new THREE.MeshStandardMaterial({ map: texture, transparent: true, depthWrite: false, roughness: 1 }))
    mesh.rotation.x = -Math.PI / 2; mesh.position.set(0, TABLE.feltY + .0001, 0); this.scene.add(mesh)
  }
  private sign(text: string, x: number, y: number, z: number, width: number, height: number, small = false): void {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 160
    const g = canvas.getContext('2d')!; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = small ? '#c8a471' : '#e9be87'; g.font = `${small ? 40 : 80}px Georgia`; g.fillText(text, 512, 80)
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; this.textures.set(text, texture)
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: texture, color: small ? '#8d785c' : '#ffd49b', transparent: true, toneMapped: false }))
    mesh.position.set(x, y, z); this.scene.add(mesh)
  }
  setOrbit(value: number): void { this.orbit = value; this.resize() }
  setInspection(active: boolean): void { this.inspecting = active }
  projectSeat(seat: number): { x: number; y: number } {
    if (seat === 0) return { x: 12, y: 83 }
    // Labels are hidden during inspection. Their resting projection must not
    // capture an intermediate lean when React renders the Look-up click; that
    // left labels stranded offscreen until the next poker action.
    const [x, z] = SEATS[seat], point = new THREE.Vector3(x, 1.79, z).project(this.labelCamera)
    return { x: Math.max(7, Math.min(93, (point.x + 1) * 50)), y: (-point.y + 1) * 50 }
  }
  private resize(): void {
    const width = this.container.clientWidth, height = Math.max(1, this.container.clientHeight)
    this.camera.aspect = width / height; this.camera.position.set(this.orbit * .12, 1.43, 2.02); this.camera.lookAt(this.orbit * .3, 1.03, -.60)
    this.camera.updateProjectionMatrix(); this.camera.updateMatrixWorld(); this.renderer.setSize(width, height); this.composer.setSize(width, height)
    this.labelCamera.aspect = this.camera.aspect; this.labelCamera.position.copy(this.camera.position)
    this.labelCamera.lookAt(this.orbit * .3, 1.03, -.60); this.labelCamera.updateProjectionMatrix(); this.labelCamera.updateMatrixWorld()
    this.onLayout()
  }
  private cardTexture(card: Card | null): THREE.CanvasTexture {
    const key = card === null ? 'back' : String(card), existing = this.textures.get(key); if (existing) return existing
    const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 356; const g = canvas.getContext('2d')!
    g.fillStyle = card === null ? '#65412f' : '#e8dfc9'; g.fillRect(0, 0, 256, 356)
    g.strokeStyle = card === null ? '#a68d5d' : '#cdbf9d'; g.lineWidth = 6; g.strokeRect(10, 10, 236, 336)
    if (card === null) {
      g.strokeStyle = '#a48a584f'; g.lineWidth = 1
      for (let x = -300; x < 550; x += 14) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 356, 356); g.stroke(); g.beginPath(); g.moveTo(x, 0); g.lineTo(x - 356, 356); g.stroke() }
      g.fillStyle = '#b9a176'; g.textAlign = 'center'; g.font = '50px Georgia'; g.fillText('♠', 128, 190)
    } else {
      g.fillStyle = [1, 2].includes(suit(card)) ? '#a22f29' : '#172823'; g.font = 'bold 63px Georgia'; g.fillText(rankLabel(card), 18, 68)
      g.font = '48px Georgia'; g.fillText(SUITS[suit(card)], 19, 119); g.font = '115px Georgia'; g.textAlign = 'center'; g.fillText(SUITS[suit(card)], 133, 247)
      g.save(); g.translate(256, 356); g.rotate(Math.PI); g.textAlign = 'left'; g.font = 'bold 43px Georgia'; g.fillText(rankLabel(card), 16, 52); g.restore()
    }
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy(); this.textures.set(key, texture); return texture
  }
  setPlaying(playing: boolean): void { this.hero.setActive(playing) }
  smokeCigar(): boolean { return !this.inspecting && this.hero.smokeCigar() }
  update(state: GameState): void {
    const old = this.state, now = performance.now() / 1000
    if (old?.handNumber !== state.handNumber) { this.handTime = now; this.gestures.clear() }
    for (const p of state.players) {
      const before = old?.players[p.seat]
      if (!before || old?.handNumber !== state.handNumber) continue
      if (p.folded && !before.folded) this.gestures.set(p.seat, { kind: 'fold', time: now })
      else if (p.committed > before.committed) this.gestures.set(p.seat, { kind: 'bet', time: now })
      else if (p.action === 'Check' && before.action !== 'Check') this.gestures.set(p.seat, { kind: 'check', time: now })
      if (state.phase === 'complete' && old.phase !== 'complete' && state.results.some(r => r.seat === p.seat && r.won > 0))
        this.gestures.set(p.seat, { kind: 'win', time: now })
    }
    this.state = state
    // Checks change engine revision without changing any visible amount. The
    // physical ledger still needs that revision; skipping it made the next bet
    // look like a restore and replaced the entire inventory instead of sliding
    // the existing chips. Only static card projection is signature-deduplicated.
    this.chips.update(state)
    const signature = JSON.stringify([state.handNumber, state.board, state.phase, state.players.map(p => [p.hole, p.folded, p.stack, p.bet]), state.dealer])
    if (signature === this.signature) return
    this.signature = signature
    const publicShowdown = state.phase === 'showdown' || state.phase === 'complete' && state.results.some(r => r.hand)
    this.hero.update(state.players[0].hole, state.players[0].folded || publicShowdown, state.handNumber)
    this.cardField.update(state)
    this.dealer.visible = state.dealer >= 0
    if (state.dealer >= 0) this.dealer.position.copy(dealerPosition(state.dealer, SEATS))
  }
  private frame = (): void => {
    if (!this.alive) return
    const now = performance.now(), t = (now - this.start) / 1000
    const dt = Math.min(.1, (now - this.lastFrame) / 1000); this.lastFrame = now
    // Inspection is a presentation-only lean, never a second gameplay mode.
    // Time-based damping avoids different transition speeds on 60/144Hz screens.
    this.inspectionBlend = this.reduced.matches ? Number(this.inspecting)
      : THREE.MathUtils.lerp(this.inspectionBlend, Number(this.inspecting), 1 - Math.exp(-dt * 12))
    const peek = this.inspectionBlend
    this.gaze.lerp(this.reduced.matches ? new THREE.Vector2() : this.pointer, .045)
    this.camera.position.set(this.orbit * .12 * (1 - peek), THREE.MathUtils.lerp(1.43, 1.95, peek), THREE.MathUtils.lerp(2.02, 1.05, peek))
    this.camera.lookAt(THREE.MathUtils.lerp(this.orbit * .30 + this.gaze.x * .11, .14, peek), THREE.MathUtils.lerp(1.03 - this.gaze.y * .055, .793, peek), THREE.MathUtils.lerp(-.6, .30, peek))
    this.camera.fov = THREE.MathUtils.lerp(70, 55, peek); this.camera.updateProjectionMatrix()
    // Camera-parented hands cannot follow the lean into the table: lower them
    // out of view while the dedicated own-card inspection surface takes over.
    this.hero.root.position.y = -peek * .8
    this.hero.setInspection(this.inspecting || peek > .01)
    this.cardField.setInspection(peek > .45)
    this.people.forEach(({ root, head, leftArm, rightArm, cards, eyes, seat }) => {
      const active = this.state?.actor === seat, player = this.state?.players[seat], gesture = this.gestures.get(seat)
      const age = now / 1000 - (gesture?.time ?? -100), moving = !this.reduced.matches
      const beat = age < 1.25 ? Math.sin(Math.min(1, age / 1.25) * Math.PI) : 0
      const peek = active ? Math.max(0, Math.sin(t * 1.6 + seat)) : Math.max(0, Math.sin(t * .42 + seat * 2.1) - .75) * 2
      const deal = THREE.MathUtils.smoothstep(now / 1000 - this.handTime, 1.0 + seat * .08, 1.7 + seat * .08)
      const showing = this.state?.phase === 'showdown' || this.state?.phase === 'complete' && this.state.results.some(r => r.hand)
      cards.visible = !!player?.hole.length && !player.folded && !showing && deal > .3
      root.position.y = this.reduced.matches ? 0 : Math.sin(t * 1.05 + seat * 1.7) * .0015
      // Distinct gaze cadence, card peeks, chip pushes and knuckle taps are tied
      // to public actions. No gesture or facial tell depends on hidden strength.
      const targetSeat = this.state?.actor ?? 0, targetX = SEATS[targetSeat][0]
      head.rotation.y = moving ? Math.sin(t * .27 + seat * 1.3) * .045 + (active ? -.06 : THREE.MathUtils.clamp((targetX - SEATS[seat][0]) * .045, -.13, .13)) : 0
      head.rotation.x = moving ? peek * .15 + (gesture?.kind === 'win' ? -beat * .06 : 0) : 0
      leftArm.rotation.x = moving ? -.10 - peek * .23 + (1 - deal) * .35 : -.10
      leftArm.rotation.y = moving ? Math.sin(t * .4 + seat) * .035 : 0
      if (player?.folded || showing) leftArm.rotation.x = .42
      if (gesture?.kind === 'fold' && age < 1.25 && moving) leftArm.rotation.x = -.18 + beat * .8
      rightArm.rotation.y = moving && gesture?.kind === 'bet' ? -beat * .16 : 0
      rightArm.rotation.x = moving && gesture?.kind === 'bet' ? -beat * .16 : moving && gesture?.kind === 'check' && age < .8 ? Math.sin(age * Math.PI * 6) * .045 : 0
      rightArm.position.z = .16 + (moving && gesture?.kind === 'bet' ? beat * .012 : 0)
      head.rotation.z = moving ? (seat === 1 ? .035 : seat === 3 ? -.025 : 0) + Math.sin(t * .35 + seat) * .012 : 0
      eyes.scale.y = !this.reduced.matches && (t + seat * 1.73) % 5.4 < .13 ? .08 : 1
    }); this.dust.rotation.y = this.reduced.matches ? 0 : Math.sin(t * .02) * .08
    this.hero.frame(now / 1000, this.reduced.matches); this.chips.frame(now / 1000, this.reduced.matches); this.cardField.frame(now / 1000, this.reduced.matches)
    this.composer.render(); this.raf = requestAnimationFrame(this.frame)
  }
  dispose(): void {
    this.alive = false; cancelAnimationFrame(this.raf); this.observer.disconnect(); this.renderer.domElement.removeEventListener('webglcontextlost', this.lost)
    this.container.parentElement?.removeEventListener('pointermove', this.look); this.container.parentElement?.removeEventListener('pointerleave', this.centerLook)
    const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>()
    this.scene.traverse(object => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Sprite) {
        geometries.add(object.geometry); for (const m of Array.isArray(object.material) ? object.material : [object.material]) materials.add(m)
        if (object instanceof THREE.InstancedMesh) object.dispose()
      }
    }); geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); this.materials.forEach(m => m.dispose()); this.textures.forEach(t => t.dispose())
    this.hero.dispose(); this.chips.dispose(); this.bloom.dispose(); this.output.dispose(); this.composer.dispose(); this.renderer.dispose(); this.renderer.domElement.remove()
  }
}
