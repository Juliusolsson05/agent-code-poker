import test from 'node:test'
import assert from 'node:assert/strict'
import { BoxGeometry } from 'three'
import { SeatedLook } from '../src/scene/camera/SeatedLook'
import { LeisureStarts } from '../src/scene/camera/LeisureStarts'
import { RemoteLeisure } from '../src/scene/RemoteLeisure'
import { buildHuman, humanMaterial, poseHuman, requestNpcGesture, type Human } from '../src/scene/Human'
import { NPC_SMOKE_SECONDS } from '../src/interaction/npc/CigarApproach'

// Synthetic drives of the real SeatedLook contact queue: the fake is only the
// hero's start function, which records what would have been broadcast.
function rig(heroAccepts = () => true) {
  const look = new SeatedLook(); look.setContext({ playing: true })
  const started: string[] = [], sent: string[] = []
  const starts = new LeisureStarts(look, kind => { started.push(kind); return heroAccepts() })
  starts.onStarted = kind => sent.push(kind)
  // Look away first, so a request really has to wait for the re-centre.
  look.begin(1, 0, 0, true); look.move(1, -300, 0, 800, 1); look.end(1)
  for (let i = 0; i < 30; i++) look.sample(1 / 60)
  assert.equal(look.centered, false)
  const settle = (frames = 120) => { for (let i = 0; i < frames; i++) { look.sample(1 / 60); starts.frame() } }
  return { look, starts, started, sent, settle }
}

test('a queued mouse-look gesture is announced when it starts, not when it is requested', () => {
  const { starts, sent, started, settle, look } = rig()
  assert.equal(starts.request('smoke'), true, 'queued')
  assert.deepEqual(sent, [], 'a queued request is not a started gesture')
  look.sample(1 / 60); assert.equal(starts.frame(), null, 'still re-centring')
  assert.deepEqual(sent, [])
  settle()
  assert.deepEqual(started, ['smoke']); assert.deepEqual(sent, ['smoke'])
})

for (const [name, interrupt] of [
  ['a pause arriving from a poll', (l: SeatedLook) => l.setContext({ paused: true })],
  ['the hand ending (not playing)', (l: SeatedLook) => l.setContext({ playing: false })],
  ['the wager or drink panel blocking the look', (l: SeatedLook) => l.setContext({ blocked: true })],
  ['inspection', (l: SeatedLook) => l.setContext({ inspection: true })],
] as const) test(`an interrupted queue announces nothing: ${name}`, () => {
  const { starts, sent, started, settle, look } = rig()
  assert.equal(starts.request('drink'), true)
  look.sample(1 / 60); interrupt(look)
  // Even after the interruption clears, the dropped request never resumes.
  look.setContext({ paused: false, playing: true, blocked: false, inspection: false })
  settle()
  assert.deepEqual(started, []); assert.deepEqual(sent, [], 'nothing may be broadcast for a gesture that never played')
})

test('a start the hero refuses is not announced; without mouse-look a start is immediate', () => {
  const refused = rig(() => false)
  refused.starts.request('smoke'); refused.settle()
  assert.deepEqual(refused.started, ['smoke']); assert.deepEqual(refused.sent, [])
  const sent: string[] = [], direct = new LeisureStarts(null, () => true)
  direct.onStarted = kind => sent.push(kind)
  assert.equal(direct.request('drink'), true); assert.deepEqual(sent, ['drink'])
  assert.equal(direct.frame(), null)
})

test('a gesture received while the tab was hidden is dropped, not replayed in full when it becomes visible', () => {
  const pose = (h: Human, t: number) => poseHuman(h, t, { reduced: false, active: false, folded: false, showing: false, hasCards: true, dealt: 1, actionAge: 100, gaze: 0 })
  const run = (hiddenMs: number) => {
    const h = buildHuman(1, new BoxGeometry(), humanMaterial()), remote = new RemoteLeisure<Human>()
    h.driven = true
    // Poll arrives at wall 10s with the gesture 120ms old; the visual clock
    // stands at 3s and does NOT advance while hidden (no frames render).
    remote.observe(h, { seq: 7, action: 'smoke', ageMs: 120, drinkKind: null }, 10_000)
    const t = 3, results = remote.take(10_000 + hiddenMs).map(g => requestNpcGesture(g.key, g.action, t - g.ageSeconds, t))
    pose(h, t)
    // The same record polled again must not restart it.
    remote.observe(h, { seq: 7, action: 'smoke', ageMs: 900, drinkKind: null }, 10_800)
    assert.deepEqual(remote.take(10_900), [])
    return { h, results }
  }
  const visible = run(16)
  assert.deepEqual(visible.results, ['started'])
  assert.ok(Math.abs(visible.h.smokeContact!.smokeAge - .136) < 1e-6, 'joins at the sender\'s moment')
  const hidden = run(NPC_SMOKE_SECONDS * 1000 + 5_000)
  assert.deepEqual(hidden.results, ['finished'])
  assert.equal(hidden.h.smokeContact!.phase, 'rest', 'no late full replay after becoming visible')
  // Hidden for part of it: it continues at the right point, not from the start.
  const partial = run(1_500)
  assert.ok(Math.abs(partial.h.smokeContact!.smokeAge - 1.62) < 1e-6)
})
