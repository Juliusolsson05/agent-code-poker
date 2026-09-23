import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { BoxGeometry, Matrix4, SkinnedMesh, Vector2, Vector3 } from 'three'
import { buildHuman, humanMaterial, npcHandFreeAt, npcHeadContains, NPC_LIPS, NPC_SIP_SECONDS, poseHuman, requestNpcGesture, type Human } from '../src/scene/Human'
import { AnatomicalHand } from '../src/scene/Hand'
import { CIGAR_HAND_CONTACT } from '../src/scene/HandGrips'
import { seatedTorsoContains } from '../src/scene/SeatedBody'
import { TABLE } from '../src/scene/Table'
import { ASHTRAY, CIGAR, DRINKS, GESTURE_SECONDS } from '../src/scene/props/specs'
import { NPC_CIGAR_REST, NPC_FELT_Y, NPC_SMOKE, NPC_SMOKE_SECONDS } from '../src/interaction/npc/CigarApproach'
import { RemoteLeisure } from '../src/scene/RemoteLeisure'
import { HostTable, LEISURE_LIMITS } from '../src/session/HostTable'
import { skinVesselGap } from '../testing/skin-vessel'

// Synthetic, dense time probes of the production rig (actual deformed skin,
// actual IK, actual animated head), NOT browser frames. The two-browser LAN
// acceptance run separately records the same rig reacting to real packets.
const pose = (h: Human, time: number, gaze = 0) =>
  poseHuman(h, time, { reduced: false, active: false, folded: false, showing: false, hasCards: true, dealt: 1, actionAge: time, gaze })
// Voxel envelope of the 1.2mm-step wrapper, the same margin the fitted pinch
// was calibrated against in grip-surfaces.test.ts.
const CORNER = Math.SQRT2 * .0006
// skinVesselGap measures around a vessel's Y axis from y=0; map the cigar's
// local X axis (bite end at minX) onto it. A pure relabelling of axes, so the
// finite, triangle-clipped measurement carries over unchanged.
const CIGAR_AS_VESSEL = new Matrix4().makeTranslation(0, -CIGAR.minX, 0).multiply(new Matrix4().makeRotationZ(Math.PI / 2))
const cigarGap = (h: Human) => {
  const handToCigar = h.cigar.root.matrixWorld.clone().invert().multiply(h.rightRig.hand.root.matrixWorld)
  return skinVesselGap(h.rightRig.hand, CIGAR_AS_VESSEL.clone().multiply(handToCigar), CIGAR.radius, CIGAR.maxX - CIGAR.minX)
}
function smoker(seat: number) {
  const h = buildHuman(seat, new BoxGeometry(), humanMaterial())
  // A turned, displaced seat catches body-local/world mixing.
  h.root.position.set(1.3, 0, -.4); h.root.rotation.y = 1.7
  h.smokeAt = 0; h.nextSmoke = 1e9; h.nextSip = 1e9
  return h
}

test('the bite point sits exactly on the animated lips through every puff frame, without IK clamping', () => {
  for (const seat of [1, 2, 3, 4, 5]) {
    const h = smoker(seat)
    let puffs = 0, brightest = 0
    for (let time = 0; time < NPC_SMOKE_SECONDS; time += .01) {
      // Varying gaze moves the head every frame: a stored mouth would drift.
      pose(h, time, .2 * Math.sin(time * 3)); h.root.updateMatrixWorld(true)
      const c = h.smokeContact!
      assert.ok(c.reachError < 1e-7, `seat ${seat} t${time.toFixed(2)} ${c.phase}: IK clamped ${c.reachError * 1000}mm`)
      if (c.phase !== 'puff') continue
      puffs++; brightest = Math.max(brightest, h.cigar.ember.emissiveIntensity)
      const lips = h.head.localToWorld(new Vector3(...NPC_LIPS)), bite = h.cigar.root.localToWorld(new Vector3(...CIGAR.bite))
      assert.ok(lips.distanceTo(bite) < 1e-7, `seat ${seat} t${time.toFixed(2)}: bite ${lips.distanceTo(bite) * 1000}mm from the lips`)
      // The ember points away from the face, like the hero's, not into it.
      const ember = h.cigar.root.localToWorld(new Vector3(...CIGAR.tip))
      assert.ok(ember.clone().applyMatrix4(h.head.matrixWorld.clone().invert()).z > NPC_LIPS[2] + .1, 'ember must stay well in front of the face')
    }
    assert.ok(puffs > (NPC_SMOKE.puff - NPC_SMOKE.raise) * 90, 'the probe must actually sample the held puff')
    assert.ok(brightest > 1.5, 'the ember glows while drawing')
    pose(h, NPC_SMOKE_SECONDS + 1)
    assert.ok(h.cigar.ember.emissiveIntensity < .31)
  }
})

test('the fingertips-first pickup cannot sweep a finger through the cigar, for any descent', () => {
  // Route premise, measured on production skin: the tray pinch points the
  // fingers straight down, so the hand descends along its own +Y onto the
  // cigar. Relative to the hand, the cigar's cross-section then slides from
  // beyond the fingertips down to its contact. Every offset must clear.
  const hand = new AnatomicalHand('right', '#ae8165', .0025); hand.pose('cigar'); hand.updateSkin()
  const skin = hand.root.getObjectByName('articulated-hand-surface') as SkinnedMesh
  const index = skin.geometry.index!, p = new Vector3(), triangles: Vector2[][] = []
  let reach = -Infinity
  for (let i = 0; i < index.count; i += 3) triangles.push([0, 1, 2].map(j => {
    skin.getVertexPosition(index.getX(i + j), p); reach = Math.max(reach, p.y); return new Vector2(p.y, p.z)
  }))
  const gap = (cy: number, cz: number) => Math.min(...triangles.map(tri => {
    const t = tri.map(a => a.clone().sub(new Vector2(cy, cz))), cross = t.map((a, j) => a.cross(t[(j + 1) % 3]))
    let d = cross.every(v => v > 1e-14) || cross.every(v => v < -1e-14) ? 0 : Infinity
    for (let j = 0; j < 3; j++) {
      const a = t[j], e = t[(j + 1) % 3].clone().sub(a), u = Math.max(0, Math.min(1, -a.dot(e) / (e.lengthSq() || 1)))
      d = Math.min(d, e.multiplyScalar(u).add(a).length())
    }
    return d - CIGAR.radius
  }))
  // Beyond this offset the whole cross-section is past the fingertips.
  const beyond = reach + CIGAR.radius - CIGAR_HAND_CONTACT[1]
  assert.ok(beyond < .02, `fingertips reach only ${(reach - CIGAR_HAND_CONTACT[1]) * 1000}mm past the axis`)
  for (let s = 0; s <= beyond + .001; s += .0005)
    assert.ok(gap(CIGAR_HAND_CONTACT[1] + s, CIGAR_HAND_CONTACT[2]) >= CORNER, `skin enters the cigar ${s * 1000}mm before contact`)
  // Negative control: the same pinch lowered palm-first (the hero's palm-down
  // tray frame, moving along hand Z) drives the under-finger through it.
  assert.ok(Math.min(...[.005, .01, .015, .02].map(s => gap(CIGAR_HAND_CONTACT[1], CIGAR_HAND_CONTACT[2] - s))) < -.002)
})

test('through the whole smoke, skin stays out of the cigar, tray, felt, head and torso, and the arm stays on its side', () => {
  const female = (seat: number) => seat === 3
  for (const seat of [1, 2, 3, 4, 5]) {
    const h = smoker(seat), skin = h.rightRig.hand.root.getObjectByName('articulated-hand-surface') as SkinnedMesh
    const sleeve = h.rightRig.mesh, sleeveBind = sleeve.geometry.getAttribute('position'), p = new Vector3()
    let minCigar = Infinity, lastCigar: Vector3 | null = null
    for (let time = 0; time < NPC_SMOKE_SECONDS; time += .025) {
      pose(h, time, .15 * Math.sin(time * 2)); h.root.updateMatrixWorld(true)
      const c = h.smokeContact!
      const gap = cigarGap(h); minCigar = Math.min(minCigar, gap)
      assert.ok(gap >= CORNER, `seat ${seat} t${time.toFixed(2)} ${c.phase}: finger skin ${gap * 1000}mm into the cigar`)
      const cigar = h.cigar.root.position.clone()
      if (c.owner === 'table') assert.ok(cigar.distanceTo(new Vector3(...NPC_CIGAR_REST)) < 1e-12, `${c.phase}: tray owns the cigar`)
      // Continuity at the scaled (3.6s) speed: peak hand speed is ~1.7m/s, so
      // .06m per 25ms sample still flags any teleport at an owner switch.
      if (lastCigar) assert.ok(cigar.distanceTo(lastCigar) < .06, `seat ${seat} t${time.toFixed(2)}: cigar jumped ${cigar.distanceTo(lastCigar)}m`)
      lastCigar = cigar
      const toBody = h.root.matrixWorld.clone().invert(), toHead = h.head.matrixWorld.clone().invert(), toTray = h.tray.matrixWorld.clone().invert()
      for (let i = 0; i < skin.geometry.getAttribute('position').count; i++) {
        skin.getVertexPosition(i, p).applyMatrix4(skin.matrixWorld)
        const tray = p.clone().applyMatrix4(toTray), r = Math.hypot(tray.x, tray.z)
        assert.ok(tray.y > 0, `seat ${seat} t${time.toFixed(2)}: skin under the felt`)
        // Conservative tray solid: rim wall plus floor, the open well excepted
        // (the pinch's fingertips legitimately dip into the well).
        assert.ok(!(tray.y < ASHTRAY.height && r < ASHTRAY.radius && !(r < ASHTRAY.wellRadius && tray.y > ASHTRAY.floor)),
          `seat ${seat} t${time.toFixed(2)} ${c.phase}: skin inside the ashtray`)
        const head = p.clone().applyMatrix4(toHead)
        assert.ok(!npcHeadContains(head.x, head.y, head.z), `seat ${seat} t${time.toFixed(2)} ${c.phase}: hand inside the head`)
        const body = p.clone().applyMatrix4(toBody)
        assert.ok(!seatedTorsoContains(body.x, body.y, body.z, female(seat)), `seat ${seat} t${time.toFixed(2)}: hand inside the torso`)
      }
      // Forearm half of the continuous sleeve (bind Y beyond the elbow blend).
      // The upper arm starts inside the deltoid cap by design and is excluded.
      for (let i = 0; i < sleeveBind.count; i++) {
        if (sleeveBind.getY(i) < .3) continue
        sleeve.getVertexPosition(i, p).applyMatrix4(sleeve.matrixWorld).applyMatrix4(toBody)
        assert.ok(p.x > 0, `seat ${seat} t${time.toFixed(2)} ${c.phase}: forearm crosses the midline`)
        assert.ok(!seatedTorsoContains(p.x, p.y, p.z, female(seat)), `seat ${seat} t${time.toFixed(2)} ${c.phase}: forearm inside the chest`)
      }
      assert.ok(h.rightRig.wrist.x > .03 && h.rightRig.elbow.x > .15, `seat ${seat} t${time.toFixed(2)}: arm reaches across the body`)
    }
    // Contact is real, not a hand hovering beside the wrapper.
    assert.ok(minCigar < .004, `seat ${seat}: fingers never come within 4mm of the cigar`)
  }
})

test('the resting cigar and tray are clear of the resting hand, the glass and the sip route', () => {
  const h = smoker(3); h.smokeAt = -100; h.sipAt = 0
  const skin = h.rightRig.hand.root.getObjectByName('articulated-hand-surface') as SkinnedMesh, p = new Vector3()
  const coaster = new Vector2(h.drinkHome.x, h.drinkHome.z), tray = new Vector2(NPC_CIGAR_REST[0], NPC_CIGAR_REST[2])
  assert.ok(coaster.distanceTo(tray) > .051 + ASHTRAY.radius, 'ashtray overlaps the coaster')
  assert.ok(coaster.distanceTo(tray) > DRINKS.beer.radius + CIGAR.maxX + CIGAR.radius, 'ember end reaches the widest glass')
  for (let time = 0; time < NPC_SIP_SECONDS + .5; time += .05) {
    pose(h, time); h.root.updateMatrixWorld(true)
    assert.ok(cigarGap(h) > .01, `t${time.toFixed(2)} ${h.drinkContact!.phase}: drinking hand touches the resting cigar`)
    const toTray = h.tray.matrixWorld.clone().invert()
    for (let i = 0; i < skin.geometry.getAttribute('position').count; i++) {
      const t = skin.getVertexPosition(i, p).applyMatrix4(skin.matrixWorld).applyMatrix4(toTray)
      assert.ok(!(t.y < ASHTRAY.height + .002 && Math.hypot(t.x, t.z) < ASHTRAY.radius + .002), `t${time.toFixed(2)}: drinking hand over the tray rim`)
    }
  }
  assert.equal(NPC_FELT_Y, TABLE.feltY, 'the route and the table must agree on the felt')
  assert.ok(Math.abs(h.tray.position.y - TABLE.feltY) < 1e-12)
})

test('a realistic chain of one player\'s gestures plays on another screen in order, none dropped, drift bounded by jitter', () => {
  // Host + projection + RemoteLeisure + the real opponent body, driven the way
  // Room drives them: the viewer polls every 500ms (own phase), renders 60fps,
  // and each frame starts newly arrived gestures. The sender starts each local
  // gesture the moment the previous one ends (the fastest an honest client
  // can go), with 0-200ms network delay per request.
  let wall = 0
  const table = new HostTable({ id: 'host', name: 'Host' }, { random: () => .43, now: () => wall })
  table.join('smoker', 'Smoker'); table.join('viewer', 'Viewer')
  table.start('host', table.view('host').revision)
  const h = buildHuman(1, new BoxGeometry(), humanMaterial()), remote = new RemoteLeisure<Human>()
  const local = { smoke: GESTURE_SECONDS.smoke, sip: GESTURE_SECONDS.drink } as const
  const chain: ('smoke' | 'sip')[] = ['smoke', 'sip', 'smoke', 'smoke', 'sip', 'sip', 'smoke']
  const delays = [120, 10, 190, 60, 200, 0, 140]
  const sends: { at: number; action: 'smoke' | 'sip' }[] = []
  let localStart = 1000
  chain.forEach((action, i) => { sends.push({ at: localStart + delays[i], action }); localStart += local[action] * 1000 })
  // One dishonest early request (mid-gesture) must be refused, not queued.
  sends.push({ at: sends[2].at + 1000, action: 'sip' }); sends.sort((a, b) => a.at - b.at)
  const accepted: { at: number; action: 'smoke' | 'sip' }[] = [], starts: { at: number; action: 'smoke' | 'sip' }[] = []
  let lastSip = h.sipAt, lastSmoke = h.smokeAt, nextPoll = 230
  for (wall = 0; wall < localStart + 8000; wall += 1000 / 60) {
    while (sends.length && sends[0].at <= wall) {
      const s = sends.shift()!
      const code = table.leisure('smoker', s.action === 'smoke' ? { action: 'smoke' } : { action: 'sip', kind: 'beer' }, { paused: false }).code
      if (code === 'accepted') accepted.push({ at: wall, action: s.action }); else assert.equal(code, 'busy')
    }
    if (wall >= nextPoll) { nextPoll += 500; const l = table.view('viewer').players.find(p => p.seat === 1)!.leisure; h.driven = !!l; remote.observe(h, l, wall) }
    const t = wall / 1000
    for (const g of remote.take(wall)) requestNpcGesture(g.key, g.action, t - g.ageSeconds, t)
    pose(h, t)
    if (h.sipAt !== lastSip) { starts.push({ at: h.sipAt, action: 'sip' }); lastSip = h.sipAt }
    if (h.smokeAt !== lastSmoke) { starts.push({ at: h.smokeAt, action: 'smoke' }); lastSmoke = h.smokeAt }
  }
  assert.equal(accepted.length, chain.length, 'every honest gesture accepted, the early one refused')
  assert.deepEqual(starts.map(s => s.action), accepted.map(a => a.action), 'none dropped, none overwritten, same order')
  starts.forEach((s, i) => {
    // Each copy starts at its own host time or, if the previous copy still
    // held the hand for a sub-jitter moment, right when it let go. Bounded by
    // the jitter allowance per gesture; it cannot accumulate along the chain.
    const lag = s.at - accepted[i].at / 1000
    assert.ok(lag > -1e-6 && lag <= LEISURE_LIMITS.jitterMs / 1000 + 1e-6, `gesture ${i} lag ${lag.toFixed(3)}s`)
    if (i) assert.ok(s.at >= starts[i - 1].at + (starts[i - 1].action === 'sip' ? NPC_SIP_SECONDS : NPC_SMOKE_SECONDS) - 1e-6, `gesture ${i} overlaps the previous one`)
  })
  assert.equal(h.pending.length, 0)
})

test('a busy hand queues, a finished gesture is skipped, and the glass only changes on the coaster', () => {
  const h = buildHuman(2, new BoxGeometry(), humanMaterial())
  h.driven = true
  for (let time = 0; time < 120; time += .5) { pose(h, time); assert.equal(h.smokeContact!.phase, 'rest'); assert.equal(h.drinkContact!.phase, 'rest') }
  assert.equal(requestNpcGesture(h, 'smoke', 100 - NPC_SMOKE_SECONDS, 100), 'finished', 'an old gesture is not replayed late')
  assert.equal(requestNpcGesture(h, 'smoke', 119.5, 120), 'started')
  pose(h, 120); assert.ok(Math.abs(h.smokeContact!.smokeAge - .5) < 1e-9, 'starts part-way, in step with the sender')
  assert.equal(requestNpcGesture(h, 'sip', 121, 121), 'queued')
  assert.deepEqual(h.pending, [{ gesture: 'sip', at: 121 }])
  pose(h, 122); assert.equal(h.drinkContact!.phase, 'rest', 'the sip waits for the cigar to go back')
  const free = npcHandFreeAt(h)
  assert.ok(Math.abs(free - (119.5 + NPC_SMOKE_SECONDS)) < 1e-9)
  pose(h, free + .1)
  assert.ok(Math.abs(h.sipAt - free) < 1e-9, 'queued sip starts exactly when the hand is free, not at the next frame')
  assert.notEqual(h.drinkContact!.phase, 'rest'); assert.equal(h.pending.length, 0)
  h.wantDrink = 'wine'; pose(h, free + 1)
  assert.equal(h.drink.kind, h.characterDrink, 'held glass is not swapped mid-sip')
  pose(h, free + NPC_SIP_SECONDS + .1); assert.equal(h.drink.kind, 'wine')
})

test('ambient NPC sips and smokes keep their scheduling windows apart', () => {
  const bot = buildHuman(4, new BoxGeometry(), humanMaterial())
  const windows: { start: number; end: number; kind: string }[] = []
  let lastSip = bot.sipAt, lastSmoke = bot.smokeAt
  for (let time = 0; time < 240; time += .1) {
    pose(bot, time)
    if (bot.sipAt !== lastSip) { lastSip = bot.sipAt; windows.push({ start: bot.sipAt, end: bot.sipAt + NPC_SIP_SECONDS, kind: 'sip' }) }
    if (bot.smokeAt !== lastSmoke) { lastSmoke = bot.smokeAt; windows.push({ start: bot.smokeAt, end: bot.smokeAt + NPC_SMOKE_SECONDS, kind: 'smoke' }) }
  }
  windows.sort((a, b) => a.start - b.start)
  for (let i = 1; i < windows.length; i++)
    assert.ok(windows[i].start >= windows[i - 1].end - 1e-9, `${windows[i].kind} at ${windows[i].start} starts inside ${windows[i - 1].kind} ${windows[i - 1].start}-${windows[i - 1].end}`)
  assert.ok(windows.filter(w => w.kind === 'sip').length >= 3 && windows.filter(w => w.kind === 'smoke').length >= 3, JSON.stringify(windows))
  // A driven seat has no ambient schedule at all.
  const person = buildHuman(4, new BoxGeometry(), humanMaterial()); person.driven = true
  for (let time = 0; time < 240; time += .5) pose(person, time)
  assert.equal(person.sipAt, -100); assert.equal(person.smokeAt, -100)
})

test('the NPC cigar route is isolated from player ownership, camera and poker state', () => {
  const root = new URL('../src/', import.meta.url)
  const consumers = readdirSync(root, { recursive: true }).filter(p => /\.tsx?$/.test(String(p)))
    .filter(p => readFileSync(new URL(String(p), root), 'utf8').includes("from '../interaction/npc/CigarApproach'"))
  assert.deepEqual(consumers, ['scene/Human.ts'])
  const core = readFileSync(new URL('interaction/npc/CigarApproach.ts', root), 'utf8')
  for (const source of core.matchAll(/^import .* from ['"]([^'"]+)['"]/gm))
    assert.ok(['three', '../../scene/props/specs', '../../scene/HandGrips', './GlassApproach'].includes(source[1]), source[1])
  assert.doesNotMatch(core, /\b(?:document|window|performance|requestAnimationFrame|Date)\b/)
  assert.equal(NPC_SMOKE_SECONDS, NPC_SMOKE.settle)
})
