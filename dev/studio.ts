import * as THREE from 'three'
import { FirstPerson, type LeisureAction } from '../src/scene/FirstPerson'
import { buildHuman, humanMaterial, poseHuman } from '../src/scene/Human'
import { createHeldCardFan } from '../src/scene/CardGrip'

/** Inspect the actual production rigs, not prettier stand-in hand meshes. Four
 * simultaneous views and a frozen timeline expose depth/contact failures that a
 * wide game screenshot hides. This module is only imported by the dev adapter;
 * it is not bundled into the installed extension or connected to game saves. */
export function mountStudio(container: HTMLElement): void {
  document.body.classList.add('rig-studio')
  container.innerHTML = '<header><strong>POKER · RIG INSPECTOR</strong><label>Subject <select aria-label="Inspection subject"></select></label><label>Action <select aria-label="Inspection action"><option value="idle">Rest</option><option value="smoke">Cigar</option><option value="drink">Drink</option><option value="bet">Bet</option><option value="fold">Fold</option></select></label><label>Time <input aria-label="Animation time" type="range" min="0" max="6.2" value="0" step="0.02"><output>0.00 s</output></label><label><input type="checkbox" aria-label="Show attachment markers" checked>Joint markers</label><button>Save four-view image</button><a href="/dev/">Back to game</a></header><div class="rig-views"><span>SEATED / FRONT</span><span>SIDE · CONTACT DEPTH</span><span>REAR · WRIST ATTACHMENT</span><span>TOP · FINGER CLEARANCE</span></div><footer>Actual production geometry · drag Time to inspect contact frames · cyan shoulder / magenta elbow / gold wrist · neutral light deliberately exposes flaws</footer>'
  const style = document.createElement('style')
  style.textContent = '.rig-studio{margin:0;background:#20262b;color:#e5e9e9;font:12px system-ui;overflow:hidden}.rig-studio header{height:74px;box-sizing:border-box;padding:14px;display:flex;gap:18px;align-items:center;flex-wrap:wrap;background:#11191e}.rig-studio label{display:flex;gap:6px;align-items:center}.rig-studio select,.rig-studio button{background:#29343b;color:#eee;border:1px solid #60717c;padding:6px}.rig-studio a{color:#b8cfda}.rig-views{position:absolute;inset:74px 0 26px;pointer-events:none;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr}.rig-views span{padding:12px;color:#b9cad3;border:1px solid #46545c}.rig-studio footer{position:fixed;bottom:0;left:0;height:26px;padding-left:14px;line-height:26px;background:#11191e;width:100%}.rig-studio canvas{display:block}'
  document.head.append(style)
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
  renderer.setPixelRatio(Math.min(2, devicePixelRatio)); renderer.setClearColor('#263037')
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1
  container.append(renderer.domElement)
  const scene = new THREE.Scene()
  scene.add(new THREE.HemisphereLight('#d5e4f0', '#76675d', 2))
  for (const [x, y, z, strength] of [[2, 3, 3, 3], [-2, 1, -1, 2]]) {
    const light = new THREE.DirectionalLight('#fff1df', strength); light.position.set(x, y, z); scene.add(light)
  }
  const texture = (value: number | null) => {
    const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 356
    const g = canvas.getContext('2d')!; g.fillStyle = '#e8dfc9'; g.fillRect(0, 0, 256, 356)
    g.fillStyle = '#172823'; g.font = 'bold 60px Georgia'; g.fillText(value === null ? '♠' : value === 0 ? 'A ♠' : 'K ♣', 15, 65)
    g.strokeStyle = '#826d4a'; g.lineWidth = 5; g.strokeRect(8, 8, 240, 340)
    const result = new THREE.CanvasTexture(canvas); result.colorSpace = THREE.SRGBColorSpace; return result
  }
  const geometry = new THREE.BoxGeometry(), hero = new FirstPerson(geometry, texture)
  const seat = new THREE.PerspectiveCamera(70, 1.4, .035, 35)
  seat.position.set(0, 1.43, 1.50); seat.lookAt(0, 1.03, -.6); scene.add(seat, hero.root, hero.tableProps)
  hero.setActive(true); hero.update([0, 12], false, 1, -10)
  const requestedSeat = Number(new URLSearchParams(location.search).get('seat') ?? 2)
  const actorSeat = Number.isInteger(requestedSeat) && requestedSeat >= 1 && requestedSeat <= 5 ? requestedSeat : 2
  const human = buildHuman(actorSeat, geometry, humanMaterial()); human.root.position.set(-1, 0, 0); scene.add(human.root)
  human.cards.add(createHeldCardFan(() => texture(null)).fan)
  const targets: Record<string, THREE.Object3D> = { ...hero.inspectionTargets, 'Opponent whole rig': human.root, 'Opponent left arm': human.leftRig.hand.root, 'Opponent right arm': human.rightRig.hand.root, 'Opponent face': human.head }
  targets['Player drink grip'] = hero.inspectionTargets['Player cigar']
  const subject = container.querySelector('select')!, action = container.querySelectorAll('select')[1]
  Object.keys(targets).forEach(name => { const option = document.createElement('option'); option.textContent = name; subject.append(option) })
  const timeline = container.querySelector('input[type=range]') as HTMLInputElement, markers = container.querySelector('input[type=checkbox]') as HTMLInputElement
  // A range is good for scrubbing, but an exact input makes the same held frame
  // reproducible through keyboard/assistive UI without canvas coordinate hacks.
  const exactTime = document.createElement('input'); exactTime.type = 'number'; exactTime.min = '0'; exactTime.max = '6.2'; exactTime.step = '.02'; exactTime.value = '0'
  exactTime.setAttribute('aria-label', 'Exact animation time'); exactTime.style.width = '60px'; timeline.after(exactTime)
  const joints = new THREE.Group(); human.root.add(joints)
  const dots: THREE.Mesh[] = []
  for (const color of ['#46dddf', '#e280d9', '#ebc879', '#46dddf', '#e280d9', '#ebc879']) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(.009, 12, 8), new THREE.MeshBasicMaterial({ color, depthTest: false }))
    mesh.renderOrder = 10; joints.add(mesh); dots.push(mesh)
  }
  const cameras = Array.from({ length: 4 }, () => new THREE.PerspectiveCamera(32, 1, .005, 30))
  const offsets = [new THREE.Vector3(0, .15, 1), new THREE.Vector3(1, .08, 0), new THREE.Vector3(0, .12, -1), new THREE.Vector3(0, 1, .001)]
  const render = () => {
    const time = Number(timeline.value), selection = subject.value, opponent = selection.startsWith('Opponent')
    container.querySelector('output')!.textContent = time.toFixed(2) + ' s'
    hero.root.visible = !opponent; hero.tableProps.visible = !opponent; human.root.visible = opponent
    hero.resetInteraction(); hero.frame(0, true)
    if (action.value === 'smoke') hero.smokeCigar()
    if (action.value === 'drink') hero.sipDrink()
    hero.frame(time, false)
    hero.showInspectionSubject(opponent ? '' : selection)
    human.sipAt = action.value === 'drink' ? 0 : -100; human.nextSip = 100
    poseHuman(human, time, { reduced: false, active: false, folded: action.value === 'fold', showing: false, hasCards: true, dealt: 1, action: action.value, actionAge: time, gaze: 0 })
    joints.visible = markers.checked
    ;[human.leftRig, human.rightRig].forEach((arm, i) => { dots[i * 3].position.copy(arm.shoulder); dots[i * 3 + 1].position.copy(arm.elbow); dots[i * 3 + 2].position.copy(arm.wrist) })
    scene.updateMatrixWorld(true)
    // SkinnedMesh bounds are cached, but a scrubbed grip is not the bind pose.
    // Refit after the actual bone update or a previous action's bounds can crop
    // the very fingertips we are trying to inspect. This cost is studio-only.
    targets[selection].traverse(o => { if (o instanceof THREE.SkinnedMesh) o.computeBoundingBox() })
    let bounds = new THREE.Box3().setFromObject(targets[selection])
    if (selection === 'Player cigar') bounds.union(new THREE.Box3().setFromObject(hero.tableProps.getObjectByName('player-cigar')!))
    if (selection === 'Player drink grip') bounds.union(new THREE.Box3().setFromObject(hero.inspectionTargets['Old Fashioned']))
    if (selection === 'Opponent left arm' || selection === 'Opponent right arm') {
      const rig = selection.includes('left') ? human.leftRig : human.rightRig
      rig.mesh.computeBoundingBox(); bounds.union(new THREE.Box3().setFromObject(rig.mesh))
    }
    const center = bounds.getCenter(new THREE.Vector3()), size = bounds.getSize(new THREE.Vector3()).length()
    const width = innerWidth, height = Math.max(200, innerHeight - 100)
    renderer.setSize(width, height); renderer.setScissorTest(true)
    cameras.forEach((camera, i) => {
      const w = Math.floor(width / 2), h = Math.floor(height / 2), x = i % 2 * w, y = i < 2 ? h : 0
      camera.aspect = w / h; camera.position.copy(center).addScaledVector(offsets[i], size * 1.9); camera.lookAt(center); camera.updateProjectionMatrix()
      renderer.setViewport(x, y, w, h); renderer.setScissor(x, y, w, h); renderer.render(scene, camera)
    })
  }
  subject.addEventListener('change', render); action.addEventListener('change', render); timeline.addEventListener('input', render); markers.addEventListener('change', render)
  timeline.addEventListener('input', () => { exactTime.value = timeline.value })
  exactTime.addEventListener('input', () => { timeline.value = String(THREE.MathUtils.clamp(Number(exactTime.value), 0, 6.2)); render() })
  container.querySelector('button')!.addEventListener('click', () => {
    render(); const link = document.createElement('a'); link.download = 'poker-rig-' + subject.value.toLowerCase().replaceAll(' ', '-') + '-seat' + actorSeat + '-' + action.value + '-' + timeline.value + '.png'; link.href = renderer.domElement.toDataURL('image/png'); link.click()
  })
  window.addEventListener('resize', render); render()
  import.meta.hot?.dispose(() => {
    window.removeEventListener('resize', render); hero.dispose()
    scene.traverse(o => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose()); if (o instanceof THREE.SkinnedMesh) o.skeleton.dispose() } })
    renderer.dispose(); renderer.domElement.remove(); style.remove()
  })
}
