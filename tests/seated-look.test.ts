import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { SeatedLook, LOOK_LIMITS } from '../src/scene/camera/SeatedLook'
import { TAVERN_FEATURES } from '../src/scene/environment/features'
import { createHash } from 'node:crypto'

const actual = JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T05-52-49-020Z.json.gz', import.meta.url))).toString())

test('actual browser drag deltas reproduce retained intent and delayed centered sip',()=>{
  const bytes=gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T10-29-18-052Z.json.gz',import.meta.url)))
  assert.equal(createHash('sha256').update(bytes).digest('hex'),'ebf07b9adbaf84beeeaedf8c0b130b0a40354403212634c63361281d4480e57f')
  const trace=JSON.parse(bytes.toString()),entries=trace.entries
  const starts=entries.filter((e:any)=>e.kind==='look-begin')
  assert.deepEqual(starts.map((e:any)=>e.data.accepted),[true,true,false])
  for(const begin of starts.filter((e:any)=>e.data.accepted)) {
    const look=new SeatedLook();look.setContext({playing:true})
    look.begin(begin.data.id,begin.data.x,begin.data.y,true)
    const end=entries.find((e:any)=>e.wallMs>begin.wallMs&&e.kind==='look-input'&&e.data.type==='pointerup')
    const moves=entries.filter((e:any)=>e.kind==='look-move'&&e.wallMs>begin.wallMs&&e.wallMs<end.wallMs)
    assert.equal(moves.length,8)
    for(const e of moves)look.move(e.data.id,e.data.x,e.data.y,e.data.height,e.data.buttons)
    look.end(begin.data.id);look.sample(2)
    const pose=entries.find((e:any)=>e.kind==='pose'&&e.wallMs>end.wallMs+1000)
    assert.deepEqual(look.diagnostic().intent,pose.data.look.intent)
    assert.ok(Math.abs(look.sample(0).yaw-pose.data.look.view.yaw)<.0001)
  }
  const request=entries.find((e:any)=>e.kind==='drink'),start=entries.find((e:any)=>e.kind==='look-leisure-start')
  assert.equal(request.data.queued,true);assert.equal(start.data.accepted,true)
  assert.ok(start.visualSeconds-request.visualSeconds>.3)
  const sipping=entries.filter((e:any)=>e.kind==='pose'&&e.data.hero.action==='drink')
  assert.ok(sipping.length>20)
  assert.ok(sipping.every((e:any)=>Math.abs(e.data.look.view.yaw)<.003&&Math.abs(e.data.look.view.pitch)<.003))
  // This raw baseline has a known diagnostic timestamp reversal; preserve it
  // verbatim, and require later normal-path recordings to be monotonic instead.
  const reversed=entries.filter((e:any,i:number)=>i&&e.wallMs<entries[i-1].wallMs)
  assert.equal(reversed.length,1);assert.equal(reversed[0].kind,'frame')
})

test('normal source and shipped mouse-look use the same product capability',()=>{
  assert.equal(TAVERN_FEATURES.mouseLook,true)
  const room=readFileSync(new URL('../src/scene/Room.ts',import.meta.url),'utf8')
  assert.match(room,/readonly experimentalLook = TAVERN_FEATURES.mouseLook/)
  assert.doesNotMatch(room,/has\(['"]look['"]\)/)
})

test('retained real camera baseline is parallax, not evidence of deliberate drag input', () => {
  const poses = actual.entries.filter((e: any) => e.kind === 'pose' && e.data.inspectionBlend < .001)
  assert.equal(poses.length, 325)
  const yaw = poses.map((e: any) => Math.atan2(e.data.camera.world[8], e.data.camera.world[10]))
  assert.ok(Math.max(...yaw) - Math.min(...yaw) < .04)
  assert.ok(!actual.entries.some((e: any) => e.kind === 'look-input'), 'do not invent missing pointer provenance')
})

function turned() {
  const look = new SeatedLook()
  look.setContext({ playing: true })
  assert.ok(look.begin(7, 100, 100, true))
  look.move(7, 500, 170, 800, 1); look.end(7); look.sample(1)
  return look
}

test('synthetic drag contract ignores hover/control/secondary pointers and retains bounded intent', () => {
  const look = new SeatedLook(); look.setContext({ playing: true })
  look.move(1, 500, 500, 800, 1)
  assert.deepEqual(look.sample(1), { yaw: 0, pitch: 0 })
  assert.equal(look.begin(1, 0, 0, false), false)
  assert.ok(look.begin(1, 100, 100, true))
  look.move(2, 500, 200, 800, 1)
  assert.deepEqual(look.sample(1), { yaw: 0, pitch: 0 })
  look.move(1, 10000, -10000, 800, 1); look.end(1)
  const pose = look.sample(2)
  assert.ok(Math.abs(pose.yaw) <= LOOK_LIMITS.yaw && pose.yaw < -.1)
  assert.ok(pose.pitch <= LOOK_LIMITS.up && pose.pitch > 0)
  assert.deepEqual(look.sample(1), pose)
  look.move(1, -10000, 10000, 800, 0)
  assert.deepEqual(look.sample(1), pose, 'release must retain view without hover steering')
})

test('actual inspection command order temporarily centers synthetic look intent without touching props', () => {
  // Only inspection ordering comes from real play. The initial turned view is
  // explicitly a synthetic new-feature probe, not a claimed old drag session.
  const look = turned(), initial = look.sample(1)
  const commands = actual.entries.filter((e: any) => e.kind === 'inspection')
  assert.deepEqual(commands.map((e: any) => e.data.active), [true, false])
  for (const command of commands) {
    look.setContext({ inspection: command.data.active })
    const pose = look.sample(2)
    if (command.data.active) assert.deepEqual(pose, { yaw: 0, pitch: 0 })
    else assert.deepEqual(pose, initial)
  }
})

test('synthetic interruptions cancel drag; pause freezes settling and centering gates leisure', () => {
  for (const key of ['paused', 'blocked', 'inspection', 'busy'] as const) {
    const look = turned(); look.begin(7, 0, 0, true)
    look.setContext({ [key]: true }); assert.equal(look.dragging, false)
    assert.equal(look.begin(7, 0, 0, true), false)
    look.setContext({ [key]: false }); look.move(7, 1000, 1000, 800, 1)
    assert.equal(look.dragging, false, 'old pointer must not resume after interruption')
  }
  const look = turned(); look.recenter(); assert.equal(look.centered, false)
  look.setContext({ paused: true }); const before = look.sample(0)
  assert.deepEqual(look.sample(10), before)
  look.setContext({ paused: false }); look.sample(2)
  assert.ok(look.centered)
  look.setContext({ enabled: false }); assert.equal(look.begin(7, 0, 0, true), false)
})

test('synthetic elapsed-time damping is frame-rate independent; reduced motion has no easing tail', () => {
  const run = (hz: number) => {
    const look = new SeatedLook(); look.setContext({ playing: true })
    look.begin(7, 0, 0, true); look.move(7, 500, 100, 800, 1); look.end(7)
    for (let i = 0; i < hz / 2; i++) look.sample(1 / hz)
    return look.sample(0)
  }
  assert.ok(Math.abs(run(30).yaw - run(120).yaw) < 1e-10)
  const look = turned(); look.setContext({ reduced: true }); look.recenter()
  assert.deepEqual(look.sample(.01), { yaw: 0, pitch: 0 })
  look.begin(1, 0, 0, true); look.move(1, NaN, Infinity, 0, 1)
  assert.deepEqual(look.sample(.01), { yaw: 0, pitch: 0 })
})

test('synthetic contact requests wait for centering, dispatch once and cancel on real pause input', () => {
  const look = turned()
  assert.ok(look.requestContact('drink')); assert.equal(look.requestContact('smoke'), false)
  assert.equal(look.takeContact(), null, 'cannot sip while looking sideways')
  assert.equal(look.begin(7, 0, 0, true), false)
  look.sample(2); assert.equal(look.takeContact(), 'drink'); assert.equal(look.takeContact(), null)
  const pause = actual.entries.find((e: any) => e.kind === 'pause')
  assert.equal(pause.data.paused, true)
  assert.ok(look.requestContact('smoke')); look.setContext(pause.data)
  assert.equal(look.contactPending, false); assert.equal(look.takeContact(), null)
  look.setContext({ paused: false, enabled: false })
  assert.ok(look.requestContact('drink'), 'turning off mouse-look must not disable drinking')
  look.setContext({ blocked: true }); assert.equal(look.contactPending, false)
  look.setContext({ blocked: false }); assert.ok(look.requestContact('smoke'))
  look.setContext({ inspection: true }); assert.equal(look.takeContact(), null)
})

test('camera arbitration has one production consumer and no engine, DOM or prop ownership', () => {
  const root = new URL('../src/', import.meta.url)
  const consumers = readdirSync(root, { recursive: true }).filter(p => /\.tsx?$/.test(String(p)))
    .filter(p => readFileSync(new URL(String(p), root), 'utf8').includes("from './camera/SeatedLook'"))
  assert.deepEqual(consumers, ['scene/Room.ts'])
  const core = readFileSync(new URL('../src/scene/camera/SeatedLook.ts', import.meta.url), 'utf8')
  assert.ok(!/\bimport\b|\bdocument\b|\bwindow\b|Date\.|performance\./.test(core))
})
