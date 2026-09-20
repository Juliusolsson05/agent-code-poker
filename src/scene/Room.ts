import * as THREE from 'three'
import { rankLabel, suit, SUITS, type Card } from '../engine/cards'
import { type GameState } from '../engine/game'
import { RoomProjection, cardCount, type SceneState } from '../presentation/RoomProjection'
import { buildHuman, humanMaterial, poseHuman, type Human } from './Human'
import { FirstPerson } from './FirstPerson'
import { ChipField } from './Chips'
import { CardField } from './Cards'
import { createHeldCardFan } from './CardGrip'
import { ChristmasTavern } from './Christmas'
import { Fireplace } from './environment/Fireplace'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import { createTableSurface, dealerPosition, TABLE } from './Table'
import { SceneCapture, transform } from './diagnostics/SceneCapture'
import type { TraceValue } from './diagnostics/Recorder'
import { CHAIR_BLOCKS, PLAYER_LAYOUT, SEATS, seatYaw } from './environment/layout'
import { createFeltPrint } from './TablePrint'
import { SeatedLook } from './camera/SeatedLook'

import { createRoomPlan, type RoomBlock } from './environment/RoomPlan'
import { createTavernLighting, TAVERN_EXPOSURE } from './environment/Lighting'
import { renderPixelRatio } from './rendering/RenderQuality'
import type { ProbeMode } from './diagnostics/RenderProbe'
import { PostProcessing, RENDERER_OPTIONS } from './rendering/PostProcessing'

/** Everything is authored in metres, from a seated human's eye line. The first
 * room was orthographic with toy proportions: that erased physical presence.
 * Fine voxel anatomy and a perspective lens are the foundation here; glow
 * cannot compensate for the wrong scale or viewpoint. */
export class PokerRoom {
  onAudioListener?: (matrix: ArrayLike<number>) => void
  private lastAudioPose = -Infinity
  // Fresh drag/comfort evidence is unavailable while CUA is disconnected.
  // Keep this integration explicitly opt-in until real source/shipped checks
  // pass; a synthetic controller test is not permission to change live play.
  readonly experimentalLook = import.meta.env.DEV && new URLSearchParams(location.search).has('look')
  // The user reviews the ordinary live /dev/ page, not a private QA URL.
  // Show this requested candidate there while keeping release acceptance
  // separate. Gate production only; a hidden query flag made it invisible.
  private readonly experimentalFireplace = import.meta.env.DEV
  private seatedLook = new SeatedLook()
  private lookPlaying = false
  private lookBlocked = false
  private lookPointer: number | null = null
  private worldLabels = new Map<number, HTMLElement>()
  private labelPoint = new THREE.Vector3()
  private worldUp = new THREE.Vector3(0, 1, 0)
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(70, 1.4, .035, 35)
  private labelCamera = new THREE.PerspectiveCamera(70, 1.4, .035, 35)
  private renderer: THREE.WebGLRenderer
  private post: PostProcessing
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
  private state: SceneState | null = null
  private projection = new RoomProjection()
  private signature = ''
  private raf = 0
  private visualTime = 0
  private paused = false
  private pausedRendered = false
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
  private christmas: ChristmasTavern
  private fireplace?: Fireplace
  private stats: HTMLOutputElement | null = null
  private measuredAt = performance.now()
  private measuredFrames = 0
  private measuredCpu = 0
  private capture: SceneCapture | null = null
  private roomBlocks: RoomBlock[] = []
  private diagnosticWide = false
  private probeMode: ProbeMode | null = null

  private leisureKey = ''
  constructor(private container: HTMLElement, private onFailure: () => void, private onLayout: () => void = () => {},
    private onLeisure: (value: { kind: import('./props/specs').DrinkKind; available: boolean }) => void = () => {}, viewerSeat = 0) {
    // The first pixel comparison inherited NPC sip history and was invalid.
    // Keep the established canvas setting in shipped/live play until a fresh
    // canonical pair passes; allocation reasoning alone is not visual signoff.
    const resolvedCanvas = import.meta.env.DEV && new URLSearchParams(location.search).has('resolved-canvas-aa')
    this.renderer = new THREE.WebGLRenderer(resolvedCanvas ? RENDERER_OPTIONS : { ...RENDERER_OPTIONS, antialias: true })
    if (import.meta.env.DEV && new URLSearchParams(location.search).has('stats')) {
      this.stats = document.createElement('output'); this.stats.setAttribute('aria-label', 'Rendering performance')
      this.stats.style.cssText = 'position:absolute;left:16px;top:94px;z-index:20;padding:8px;background:#0a1010dc;color:#cee3c2;font:12px monospace;pointer-events:none'
      container.append(this.stats); this.renderer.info.autoReset = false
    }
    this.renderer.setPixelRatio(Math.min(1.25, window.devicePixelRatio || 1))
    this.renderer.setClearColor('#090a0c'); this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = TAVERN_EXPOSURE
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.domElement.setAttribute('aria-label', 'Seated first-person view of a dimly lit poker table, detailed voxel opponents, and an amber-lit bar')
    this.renderer.domElement.setAttribute('role', 'img'); container.append(this.renderer.domElement)
    this.renderer.domElement.addEventListener('webglcontextlost', this.lost)
    container.parentElement?.addEventListener('pointermove', this.look)
    container.parentElement?.addEventListener('pointerleave', this.centerLook)
    container.parentElement?.addEventListener('pointerdown', this.recordLookInput)
    container.parentElement?.addEventListener('pointerup', this.recordLookInput)
    if (this.experimentalLook) {
      this.renderer.domElement.addEventListener('pointerdown', this.beginLook)
      this.renderer.domElement.addEventListener('pointermove', this.moveLook)
      this.renderer.domElement.addEventListener('pointerup', this.endLook)
      this.renderer.domElement.addEventListener('pointercancel', this.cancelLook)
      this.renderer.domElement.addEventListener('lostpointercapture', this.cancelLook)
      window.addEventListener('blur', this.suspendLook)
      this.renderer.domElement.style.touchAction = 'none'
      this.renderer.domElement.style.cursor = 'grab'
    }
    this.scene.fog = new THREE.FogExp2('#0a0b10', .048)
    RectAreaLightUniformsLib.init()
    this.scene.add(createTavernLighting())
    this.buildRoom()
    this.christmas = new ChristmasTavern(); this.scene.add(this.christmas.root)
    // Clearance/resource tests cannot approve composition or fire motion.
    // Live development exposes the candidate for user review; the shipped
    // room stays separate until browser/listening acceptance is retained.
    if (this.experimentalFireplace) {
      this.fireplace = new Fireplace(); this.scene.add(this.fireplace.root)
    }
    const skinMaterial = humanMaterial(); this.materials.set('humans', skinMaterial)
    for (let seat = 1; seat < 6; seat++) {
      // Identity follows the authority seat, geometry follows the viewer slot.
      // Source seat0 has an authored model: guests must see the host too.
      const human = buildHuman((seat + viewerSeat) % 6, this.geometry, skinMaterial); human.seat = seat
      const [x, z] = SEATS[seat]
      human.root.position.set(x, 0, z); human.root.rotation.y = seatYaw(x, z)
      this.people.push(human); this.scene.add(human.root)
      const chair = new THREE.Group(); chair.position.copy(human.root.position); chair.rotation.copy(human.root.rotation)
      // Chairs share their occupant's orientation, but not their animated rig.
      // The old globally aligned backs crossed side players' forearms.
      CHAIR_BLOCKS.forEach(block => this.box(chair, block.color, ...block.position, ...block.size))
      this.scene.add(chair)
      // Both sides receive only the back texture, including in the inspector.
      human.cards.add(createHeldCardFan(() => this.cardTexture(null)).fan)
    }
    this.hero = new FirstPerson(this.geometry, c => this.cardTexture(c)); this.scene.add(this.camera, this.hero.root, this.hero.tableProps)
    this.chips = new ChipField(SEATS, this.renderer.capabilities.getMaxAnisotropy()); this.scene.add(this.chips.root)
    this.cardField = new CardField(SEATS, c => this.cardTexture(c)); this.scene.add(this.cardField.root)
    this.dealer = new THREE.Mesh(new THREE.CylinderGeometry(.039, .039, .012, 32), this.material('#b9af99')); this.dealer.visible = false; this.scene.add(this.dealer)
    const dustGeometry = new THREE.BufferGeometry(), positions = new Float32Array(150 * 3)
    for (let i = 0; i < 150; i++) { positions[i * 3] = Math.sin(i * 78.23) * 3.4; positions[i * 3 + 1] = .85 + (Math.sin(i * 12.87) + 1) * 1.2; positions[i * 3 + 2] = Math.cos(i * 61.23) * 2.7 - 1.5 }
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: '#b69a70', size: .005, transparent: true, opacity: .26, depthWrite: false })); this.scene.add(this.dust)
    this.post = new PostProcessing(this.renderer, this.scene, this.camera)
    if (import.meta.env.DEV && new URLSearchParams(location.search).has('record')) {
      this.renderer.info.autoReset = false
      this.capture = new SceneCapture(this.renderer, () => this.visualTime, () => ({
        poseSampleHz: 15, camera: transform(this.camera), hero: this.hero.diagnosticPose(),
        christmasBounds: new THREE.Box3().setFromObject(this.christmas.root).min.toArray().concat(new THREE.Box3().setFromObject(this.christmas.root).max.toArray()),
        treeBounds: this.christmas.treeBounds.min.toArray().concat(this.christmas.treeBounds.max.toArray()),
        decorBounds: [...this.christmas.decorBounds].map(([name, bounds]) => ({ name, bounds: bounds.min.toArray().concat(bounds.max.toArray()) })),
        roomBlocks: this.roomBlocks,
        fireplace: this.fireplace ? {
          bounds: new THREE.Box3().setFromObject(this.fireplace.root).min.toArray().concat(new THREE.Box3().setFromObject(this.fireplace.root).max.toArray()),
          flameInstances: this.fireplace.flames.count, geometryBatches: 2, extraShadowPasses: 0,
        } : null,
        table: { feltY: TABLE.feltY }, exposure: this.renderer.toneMappingExposure, pipeline: this.post.diagnostics(),
        prints: { chips: this.chips.printDiagnostics(), felt: {
          width: this.textures.get('felt')!.image.width, height: this.textures.get('felt')!.image.height,
          anisotropy: this.textures.get('felt')!.anisotropy,
        } },
      }), wide => { this.diagnosticWide = wide; this.pausedRendered = false }, mode => {
        // Timed comparison is deliberately lobby-only: freezing a live poker
        // clock would let betting timers race the visual ownership director.
        if (mode && this.state && this.state.handNumber > 0) return false
        this.probeMode = mode; this.post.setBloomEnabled(mode !== 'no-bloom')
        const shadows = mode !== 'no-shadows'
        if (this.renderer.shadowMap.enabled !== shadows) {
          this.renderer.shadowMap.enabled = shadows
          // Three caches a material program across frames. Merely skipping the
          // depth pass can leave the previous shadow-sampling shader active;
          // that would measure frozen shadows, not the named no-shadow ablation.
          this.scene.traverse(object => {
            if (object instanceof THREE.Mesh) for (const material of Array.isArray(object.material) ? object.material : [object.material]) material.needsUpdate = true
          })
        }
        this.resize(); return true
      })
    }
    document.addEventListener('visibilitychange', this.visibility)
    this.observer = new ResizeObserver(() => this.resize()); this.observer.observe(container); this.resize(); this.frame()
  }
  private lost = (event: Event) => { event.preventDefault(); this.onFailure() }
  private recordLookInput = (event: PointerEvent) => {
    this.capture?.event('look-input', { type: event.type, x: event.clientX, y: event.clientY, buttons: event.buttons,
      scene: event.target === this.renderer.domElement })
  }
  private look = (event: PointerEvent) => {
    if (this.experimentalLook) return
    const bounds = this.container.getBoundingClientRect()
    this.pointer.set((event.clientX - bounds.left) / bounds.width - .5, (event.clientY - bounds.top) / bounds.height - .5)
  }
  private centerLook = () => this.pointer.set(0, 0)
  private syncLook(): void {
    this.seatedLook.setContext({ playing: this.lookPlaying, paused: this.paused, blocked: this.lookBlocked,
      inspection: this.inspecting, busy: !this.hero.leisureAvailable, reduced: this.reduced.matches })
  }
  private beginLook = (event: PointerEvent) => {
    this.syncLook()
    const accepted = this.seatedLook.begin(event.pointerId, event.clientX, event.clientY,
      event.target === this.renderer.domElement && event.button === 0 && event.pointerType === 'mouse' && event.isPrimary)
    this.capture?.event('look-begin', { id: event.pointerId, x: event.clientX, y: event.clientY, accepted })
    if (!accepted) return
    event.preventDefault(); this.lookPointer = event.pointerId
    this.renderer.domElement.setPointerCapture(event.pointerId)
    this.renderer.domElement.style.cursor = 'grabbing'
    this.container.closest<HTMLElement>('.poker')?.focus({ preventScroll: true })
  }
  private moveLook = (event: PointerEvent) => {
    if (!this.seatedLook.dragging) return
    this.seatedLook.move(event.pointerId, event.clientX, event.clientY, this.container.clientHeight, event.buttons)
    this.capture?.event('look-move', { id: event.pointerId, x: event.clientX, y: event.clientY, height: this.container.clientHeight, buttons: event.buttons })
  }
  private endLook = (event: PointerEvent) => {
    this.seatedLook.end(event.pointerId)
    if (this.lookPointer === event.pointerId) this.cancelLook()
  }
  private cancelLook = () => {
    this.seatedLook.cancel()
    const id = this.lookPointer; this.lookPointer = null
    if (id !== null && this.renderer.domElement.hasPointerCapture(id)) this.renderer.domElement.releasePointerCapture(id)
    if (this.experimentalLook) this.renderer.domElement.style.cursor = 'grab'
  }
  private suspendLook = () => { this.cancelLook(); this.seatedLook.cancelContact() }
  setLookEnabled(enabled: boolean): void { this.seatedLook.setContext({ enabled }); this.cancelLook(); this.capture?.event('look-enabled', { enabled }) }
  setLookBlocked(blocked: boolean): void {
    this.lookBlocked = blocked
    if (blocked) this.suspendLook()
    this.seatedLook.setContext({ blocked })
  }
  recenterLook(): void { this.cancelLook(); this.seatedLook.recenter(); this.capture?.event('look-recenter', null) }
  bindWorldLabel(seat: number, element: HTMLElement | null): void {
    if (element) this.worldLabels.set(seat, element); else this.worldLabels.delete(seat)
  }
  private visibility = () => {
    // A hidden retina fullscreen composer otherwise keeps hundreds of MB of
    // multisampled half-float attachments alive. Keep CPU scene state, but shrink
    // the offscreen buffers until this particular tab is actually visible again.
    if (document.hidden) { this.suspendLook(); this.renderer.setPixelRatio(1); this.renderer.setSize(1, 1, false); this.post.setSize(1, 1, 1) }
    else this.resize()
  }
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
    const plan = createRoomPlan({ fireplace: this.experimentalFireplace }), blocks = this.roomBlocks = plan.blocks
    plan.glows.forEach(args => this.glow(...args))
    plan.signs.forEach(args => this.sign(...args))
    plan.lights.forEach(([color, power, x, y, z]) => {
      const light = new THREE.PointLight(color, power, 2.5, 1.5)
      light.position.set(x, y, z); this.scene.add(light)
    })
    this.scene.add(createTableSurface())
    const mesh = new THREE.InstancedMesh(this.geometry, new THREE.MeshStandardMaterial({ roughness: .83 }), blocks.length), dummy = new THREE.Object3D()
    blocks.forEach((block, i) => { dummy.position.set(...block.position); dummy.scale.set(...block.size); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix); mesh.setColorAt(i, new THREE.Color(block.color)) })
    mesh.castShadow = true; mesh.receiveShadow = true; this.scene.add(mesh); this.feltMark()
  }
  private feltMark(): void {
    const texture = createFeltPrint(this.renderer.capabilities.getMaxAnisotropy()); this.textures.set('felt', texture)
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
  setOrbit(value: number): void { this.capture?.cancelProbe('camera-changed'); this.orbit = value; this.resize() }
  setInspection(active: boolean): void {
    this.capture?.event('inspection', { active }); this.inspecting = active
    if (active) this.suspendLook()
    this.seatedLook.setContext({ inspection: active })
  }
  projectSeat(seat: number): { x: number; y: number } {
    if (seat === 0) return { x: 12, y: 83 }
    // Labels are hidden during inspection. Their resting projection must not
    // capture an intermediate lean when React renders the Look-up click; that
    // left labels stranded offscreen until the next poker action.
    const [x, z] = SEATS[seat], point = new THREE.Vector3(x, 1.79, z).project(this.labelCamera)
    return { x: Math.max(7, Math.min(93, (point.x + 1) * 50)), y: (-point.y + 1) * 50 }
  }
  private resize(): void {
    this.pausedRendered = false
    const width = this.container.clientWidth, height = Math.max(1, this.container.clientHeight)
    const ratio = renderPixelRatio(width, height, window.devicePixelRatio, this.probeMode === 'legacy' ? 'legacy' : 'balanced')
    this.renderer.setPixelRatio(ratio); this.post.setSize(width, height, ratio)
    this.camera.aspect = width / height; this.camera.position.set(this.orbit * .12, PLAYER_LAYOUT.eye[1], PLAYER_LAYOUT.eye[2]); this.camera.lookAt(this.orbit * .3, PLAYER_LAYOUT.look[1], PLAYER_LAYOUT.look[2])
    this.camera.updateProjectionMatrix(); this.camera.updateMatrixWorld(); this.renderer.setSize(width, height)
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
  setPlaying(playing: boolean): void { if (playing) this.capture?.cancelProbe('entered-game'); this.capture?.event('playing', { playing }); this.hero.setActive(playing); this.lookPlaying = playing; this.seatedLook.setContext({ playing }); if (!playing) this.suspendLook() }
  setPaused(paused: boolean): void { if (paused) { this.capture?.cancelProbe('paused'); this.suspendLook() } this.capture?.event('pause', { paused }); this.paused = paused; this.seatedLook.setContext({ paused }); this.pausedRendered = false }
  private publishLeisure(): void {
    const value = { kind: this.hero.drinkKind, available: !this.paused && !this.inspecting && !this.seatedLook.contactPending && this.hero.leisureAvailable }
    const key = value.kind + ':' + value.available
    // React only hears transitions, not every animation frame. The renderer
    // owns availability; a UI timeout cannot predict interrupted return length.
    if (key !== this.leisureKey) { this.leisureKey = key; this.onLeisure(value) }
  }
  private requestLeisure(kind: 'smoke' | 'drink'): boolean {
    if (this.paused || this.inspecting || this.seatedLook.contactPending) return false
    if (!this.experimentalLook) return kind === 'smoke' ? this.hero.smokeCigar() : this.hero.sipDrink()
    // Queue a request, not a prop animation. Body contacts stay exactly where
    // their established owner authored them; begin only after the view centers.
    this.syncLook()
    const accepted = this.seatedLook.requestContact(kind)
    if (accepted) this.cancelLook()
    return accepted
  }
  smokeCigar(): boolean { const accepted = this.requestLeisure('smoke'); this.capture?.event('smoke', { accepted, queued: this.experimentalLook }); this.publishLeisure(); return accepted }
  sipDrink(): boolean { const accepted = this.requestLeisure('drink'); this.capture?.event('drink', { accepted, queued: this.experimentalLook }); this.publishLeisure(); return accepted }
  orderDrink(kind: import('./props/specs').DrinkKind): boolean {
    const accepted = !this.paused && !this.inspecting && !this.seatedLook.contactPending && this.hero.orderDrink(kind)
    this.capture?.event('order-drink', { kind, accepted }); this.publishLeisure(); return accepted
  }
  recordBettingInput(data: { [key: string]: TraceValue }): void {
    // Only opt-in local QA has a capture. The UI supplies bounded command/focus
    // categories and public legal amounts, never DOM values or private cards.
    this.capture?.event('betting-input', data)
  }
  update(state: GameState): void {
    this.present(this.projection.solo(state))
  }
  updateRemote(view: Parameters<RoomProjection['remote']>[0], viewer: number): void {
    this.present(this.projection.remote(view, viewer))
  }
  private present(state: SceneState): void {
    this.capture?.event('public-game', { hand: state.handNumber, phase: state.phase, actor: state.actor,
      players: state.players.map(p => ({ seat: p.seat, stack: p.stack, bet: p.bet, folded: p.folded, action: p.action })) })
    const old = this.state, now = this.visualTime
    if (old?.dealId !== state.dealId) { this.handTime = now; this.gestures.clear() }
    for (const p of state.players) {
      const before = old?.players[p.seat]
      if (!before || old?.dealId !== state.dealId) continue
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
    this.chips.update(state, now)
    const signature = JSON.stringify([state.dealId, state.board, state.phase, state.players.map(p => [p.cards, p.folded, p.stack, p.bet]), state.dealer])
    if (signature === this.signature) return
    this.signature = signature
    const hero = state.players[0], heroCards = hero.cards.kind === 'visible' ? hero.cards.values : []
    this.hero.update(heroCards, hero.folded || state.publicShowdown, state.dealId, now)
    this.cardField.update(state, now)
    this.dealer.visible = state.dealer >= 0
    if (state.dealer >= 0) this.dealer.position.copy(dealerPosition(state.dealer, SEATS))
  }
  private frame = (): void => {
    if (!this.alive) return
    const wallTime = performance.now()
    // Development commonly leaves several game tabs open. Rendering a frozen
    // full-resolution shadow/bloom scene in every background tab starves the
    // active inspector's GPU. Pause must stop GPU work as well as game timers.
    if (document.hidden || this.paused && this.pausedRendered) {
      this.measuredAt = wallTime; this.measuredFrames = 0; this.measuredCpu = 0
      this.lastFrame = wallTime; this.raf = requestAnimationFrame(this.frame); return
    }
    const frameMs = wallTime - this.lastFrame
    const dt = this.paused ? 0 : Math.min(.1, frameMs / 1000); this.lastFrame = wallTime
    if (!this.probeMode) this.visualTime += dt
    const t = this.probeMode ? 12 : this.visualTime, now = t * 1000
    this.hero.setInspection(this.inspecting); this.hero.frame(t, this.reduced.matches)
    this.publishLeisure()
    // Inspection is a presentation-only lean, never a second gameplay mode.
    // Time-based damping avoids different transition speeds on 60/144Hz screens.
    this.inspectionBlend = this.reduced.matches ? Number(this.hero.inspectionReady)
      : THREE.MathUtils.lerp(this.inspectionBlend, Number(this.hero.inspectionReady), 1 - Math.exp(-dt * 12))
    const peek = this.inspectionBlend
    if (this.experimentalLook) this.syncLook()
    const look = this.experimentalLook ? this.seatedLook.sample(dt) : null
    const contact = this.experimentalLook ? this.seatedLook.takeContact() : null
    if (contact) {
      const kind = contact
      const accepted = kind === 'smoke' ? this.hero.smokeCigar() : this.hero.sipDrink()
      this.capture?.event('look-leisure-start', { kind, accepted })
    }
    if (this.probeMode) this.gaze.set(0, 0)
    else this.gaze.lerp(this.reduced.matches ? new THREE.Vector2() : this.pointer, .045)
    this.camera.position.set(this.orbit * .12 * (1 - peek), THREE.MathUtils.lerp(PLAYER_LAYOUT.eye[1], 1.95, peek), THREE.MathUtils.lerp(PLAYER_LAYOUT.eye[2], 1.05, peek))
    this.camera.lookAt(THREE.MathUtils.lerp(this.orbit * .30 + this.gaze.x * .11, .14, peek), THREE.MathUtils.lerp(1.03 - this.gaze.y * .055, .793, peek), THREE.MathUtils.lerp(-.6, .30, peek))
    if (look && !this.probeMode) {
      // Yaw around room-up, not the pitched camera's local Y: the latter rolls
      // the horizon at sideways limits and makes seated looking feel unsteady.
      this.camera.rotateOnWorldAxis(this.worldUp, look.yaw * (1 - peek)); this.camera.rotateX(look.pitch * (1 - peek))
    }
    this.camera.fov = THREE.MathUtils.lerp(70, 55, peek); this.camera.updateProjectionMatrix()
    // Dev-only inspection exposes complete furniture/decor placement. It moves
    // only the camera, never actors or props; production gameplay stays seated.
    if (this.diagnosticWide && !this.probeMode) {
      this.camera.position.set(3.8, 2.7, 2.8); this.camera.lookAt(0, 1.35, -3.15)
      this.camera.fov = 75; this.camera.updateProjectionMatrix()
    }
    if (t - this.lastAudioPose >= 1 / 30 || this.lastAudioPose > t) {
      this.lastAudioPose = t; this.camera.updateMatrixWorld()
      this.onAudioListener?.(this.camera.matrixWorld.elements)
    }
    if (this.experimentalLook) {
      // Project labels in the same frame as the scene without React frame
      // updates. Out-of-view anchors disappear instead of sticking to an edge.
      this.camera.updateMatrixWorld()
      for (const [seat, element] of this.worldLabels) {
        const point = seat < 0 ? this.labelPoint.set(0, .94, -.36) : this.labelPoint.set(SEATS[seat][0], 1.79, SEATS[seat][1])
        point.project(this.camera)
        element.style.visibility = Math.abs(point.x) > .94 || Math.abs(point.y) > .9 || point.z > 1 || point.z < -1 ? 'hidden' : ''
        element.style.left = `${(point.x + 1) * 50}%`; element.style.top = `${(1 - point.y) * 50}%`
      }
    }
    // The director returns held props before allowing the lean. Body/prop poses
    // stay world-space; the camera never translates the arm or re-parents glass.
    this.cardField.setInspection(peek > .45)
    this.people.forEach(human => {
      const seat = human.seat, player = this.state?.players[seat], gesture = this.gestures.get(seat)
      const showing = this.state?.publicShowdown
      const targetSeat = this.state?.actor ?? 0
      poseHuman(human, t, {
        // Fixed time alone still inherits the opponent's earlier sip schedule.
        // Use the real resting/reduced-motion branch for reproducible pipeline
        // comparisons, not fake image tolerances that hide different arm poses.
        reduced: this.reduced.matches || !!this.probeMode, active: this.state?.actor === seat, folded: !!player?.folded,
        showing: !!showing, hasCards: !!player && cardCount(player.cards) > 0,
        dealt: THREE.MathUtils.smoothstep(t - this.handTime, 1 + seat * .08, 1.7 + seat * .08),
        action: gesture?.kind, actionAge: t - (gesture?.time ?? -100),
        gaze: (SEATS[targetSeat][0] - SEATS[seat][0]) * .075,
      })
    })
    this.dust.rotation.y = this.reduced.matches ? 0 : Math.sin(t * .02) * .08
    this.christmas.frame(t, this.reduced.matches)
    this.fireplace?.frame(t, this.reduced.matches)
    this.chips.frame(now / 1000, this.reduced.matches); this.cardField.frame(now / 1000, this.reduced.matches)
    if (this.stats || this.capture) this.renderer.info.reset()
    this.capture?.beforeRender()
    if (this.probeMode === 'direct') this.renderer.render(this.scene, this.camera)
    else this.post.render()
    this.capture?.afterRender()
    this.capture?.frame(wallTime, frameMs, performance.now() - wallTime, () => ({
      camera: transform(this.camera), hero: this.hero.diagnosticPose(), paused: this.paused, inspectionBlend: this.inspectionBlend,
      tableCards: this.cardField.diagnosticPose(),
      look: this.experimentalLook ? this.seatedLook.diagnostic() : null,
      people: this.people.map(h => ({ seat: h.seat, root: transform(h.root), drink: transform(h.drink.root),
        rightHand: transform(h.rightRig.hand.root), shoulder: h.rightRig.shoulder.toArray(), elbow: h.rightRig.elbow.toArray(), wrist: h.rightRig.wrist.toArray() })),
    }))
    if (this.stats) {
      this.measuredFrames++; this.measuredCpu += performance.now() - wallTime
      if (wallTime - this.measuredAt > 1000) {
        const info = this.renderer.info.render
        this.stats.textContent = `${Math.round(this.measuredFrames * 1000 / (wallTime - this.measuredAt))} FPS · ${(this.measuredCpu / this.measuredFrames).toFixed(1)} ms CPU · ${info.calls} draws · ${(info.triangles / 1000).toFixed(0)}k triangles incl. shadows`
        this.measuredAt = wallTime; this.measuredFrames = 0; this.measuredCpu = 0
      }
    }
    this.pausedRendered = this.paused; this.raf = requestAnimationFrame(this.frame)
  }
  dispose(): void {
    this.alive = false; cancelAnimationFrame(this.raf); this.observer.disconnect(); this.renderer.domElement.removeEventListener('webglcontextlost', this.lost)
    document.removeEventListener('visibilitychange', this.visibility)
    this.container.parentElement?.removeEventListener('pointermove', this.look); this.container.parentElement?.removeEventListener('pointerleave', this.centerLook)
    this.container.parentElement?.removeEventListener('pointerdown', this.recordLookInput)
    this.container.parentElement?.removeEventListener('pointerup', this.recordLookInput)
    this.cancelLook(); this.worldLabels.clear()
    this.renderer.domElement.removeEventListener('pointerdown', this.beginLook)
    this.renderer.domElement.removeEventListener('pointermove', this.moveLook)
    this.renderer.domElement.removeEventListener('pointerup', this.endLook)
    this.renderer.domElement.removeEventListener('pointercancel', this.cancelLook)
    this.renderer.domElement.removeEventListener('lostpointercapture', this.cancelLook)
    window.removeEventListener('blur', this.suspendLook)
    const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>()
    this.scene.traverse(object => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Sprite) {
        geometries.add(object.geometry); for (const m of Array.isArray(object.material) ? object.material : [object.material]) materials.add(m)
        if (object instanceof THREE.InstancedMesh) object.dispose()
        if (object instanceof THREE.SkinnedMesh) object.skeleton.dispose()
      }
    }); geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); this.materials.forEach(m => m.dispose()); this.textures.forEach(t => t.dispose())
    this.capture?.dispose(); this.hero.dispose(); this.chips.dispose(); this.christmas.dispose(); this.post.dispose(); this.renderer.dispose(); this.renderer.domElement.remove(); this.stats?.remove()
  }
}
