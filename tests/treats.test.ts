import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import * as THREE from 'three'
import { InteractionDirector } from '../src/scene/InteractionDirector'
import { TableTreat } from '../src/scene/props/Treats'
import { TREATS, type TreatKind } from '../src/scene/props/specs'
import { TREAT_PINCH_ENVELOPE } from '../src/scene/HandGrips'
import { PLAYER_LAYOUT } from '../src/scene/environment/layout'
import { TableDrink } from '../src/scene/Drinks'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { DrinkMenu } from '../src/components/DrinkMenu'

const v = (p: number[]) => new THREE.Vector3(...p)
const kinds = Object.keys(TREATS) as TreatKind[]

test('every treat piece fits the fitted pinch envelope and rests in its dish', () => {
  for (const kind of kinds) {
    const treat = new TableTreat(kind)
    treat.root.updateMatrixWorld(true)
    for (const [i, piece] of treat.pieces.entries()) {
      const positions = piece.geometry.getAttribute('position'), p = new THREE.Vector3()
      let radius = 0
      for (let j = 0; j < positions.count; j++) radius = Math.max(radius, p.fromBufferAttribute(positions, j).length())
      assert.ok(radius <= TREAT_PINCH_ENVELOPE, `${kind} piece ${i}: ${radius * 1000}mm exceeds the pinch envelope`)
      // Resting, not floating or sunk: the piece's lowest face meets the dish.
      const bottom = new THREE.Box3().setFromObject(piece).min.y
      const dish = treat.root.getObjectByName('block-treat-dish')!
      const floor = (() => { const ray = new THREE.Raycaster(new THREE.Vector3(piece.position.x, .1, piece.position.z), new THREE.Vector3(0, -1, 0)); return ray.intersectObject(dish, false)[0].point.y })()
      assert.ok(bottom >= floor - .0006 && bottom - floor < .0025, `${kind} piece ${i} floats ${(bottom - floor) * 1000}mm`)
    }
    assert.ok(treat.root.children.length <= 4, 'dish plus at most three pieces')
    treat.dispose()
  }
})

test('consume is one reachable, single-owner action that counts once, after the lips', () => {
  for (const kind of kinds) {
    const d = new InteractionDirector(); d.setActive(true, 0)
    assert.equal(d.begin('consume', 0), false, 'no dish, nothing to take')
    assert.equal(d.orderTreat(kind, 0), true); assert.equal(d.takeCompletedTreat(), null, 'ordering is not consuming')
    const pieces = TREATS[kind].slots.length
    for (let n = 0; n < pieces; n++) {
      const t0 = n * 5
      assert.equal(d.begin('consume', t0), true)
      let lips = 0
      for (let t = t0; t <= t0 + 4.2; t += 1 / 30) {
        const pose = d.sample(t)
        assert.ok(pose.arm.reachError < 1e-6, `${kind} t${t}: dish or lips unreachable (${pose.arm.reachError})`)
        assert.ok(!(pose.treat.owner === 'right-hand' && (pose.cigar.owner === 'right-hand' || pose.drink.owner === 'right-hand')), 'one hand, one prop')
        if (pose.treat.owner === 'right-hand') {
          // The piece is exactly at the pinch centre of the rendered hand.
          const centre = v(d.calibration.handPinchContact).applyQuaternion(new THREE.Quaternion(...pose.right.rotation)).add(v(pose.right.position))
          assert.ok(centre.distanceTo(v(pose.treat.position)) < 1e-6, 'piece detached from the pinch')
          assert.equal(pose.right.grip, 'pinch')
        }
        if (pose.phase === 'consume') { lips++; assert.ok(v(pose.treat.position).distanceTo(v(PLAYER_LAYOUT.mouth)) < .01, 'piece misses the lips') }
        if (t < t0 + 2.55 - 1e-9) assert.equal(d.takeCompletedTreat(), null, 'counted before reaching the lips')
      }
      assert.ok(lips > 5)
      assert.deepEqual(d.takeCompletedTreat(), { id: n + 1, actor: 'player', kind })
      assert.equal(d.takeCompletedTreat(), null)
      assert.equal(d.treat?.remaining, pieces - n - 1)
    }
    assert.equal(d.begin('consume', 100), false, 'an empty dish cannot be consumed')
  }
})

test('pause, inspection and leaving never manufacture a consumed piece', () => {
  const d = new InteractionDirector(); d.setActive(true, 0); d.orderTreat('mushrooms', 0)
  d.begin('consume', 0)
  for (let i = 0; i < 50; i++) d.sample(2)  // paused clock repeats one visual time
  assert.equal(d.takeCompletedTreat(), null)
  // Inspection mid-lift returns the uneaten piece to its own slot.
  d.inspect(true, 2); const back = d.sample(2.4)
  assert.equal(back.phase, 'interrupt-return-treat'); assert.equal(back.treat.owner, 'right-hand')
  const rest = d.sample(10); assert.equal(rest.treat.owner, 'table'); assert.equal(rest.treat.remaining, 3)
  assert.ok(v(rest.treat.position).distanceTo(v(PLAYER_LAYOUT.treat).add(v([...TREATS.mushrooms.slots[2]]))) < 1e-9)
  assert.equal(d.takeCompletedTreat(), null)
  // Orders are arbitrated like drinks: never during a reach or held piece.
  d.inspect(false, 10); d.begin('consume', 10)
  for (const t of [10.3, 11, 12]) assert.equal(d.orderTreat('lsd', t), false)
  d.setActive(false, 12); d.sample(40)
  assert.equal(d.takeCompletedTreat(), null, 'leaving mid-lift does not eat the piece')
  assert.equal(d.treat?.remaining, 3)
})

test('treats stay out of the engine, bots, saves and LAN authority', () => {
  // Cosmetic items must not become poker state. Only presentation modules and
  // the local UI may import them; the session/engine/server authority never.
  const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(resolve(dir, e.name)) : [resolve(dir, e.name)])
  for (const file of [...walk(resolve('src/engine')), ...walk(resolve('src/session')), ...walk(resolve('src/solo')), ...walk(resolve('src/bank')), resolve('server/http.ts'), resolve('server/service.ts')]) {
    if (!/\.(ts|tsx|js)$/.test(file)) continue
    const text = readFileSync(file, 'utf8')
    for (const word of ['TREATS', 'TreatKind', 'EffectEngine', 'mushroom', 'lsd']) assert.ok(!text.includes(word), `${file} references ${word}`)
  }
})

test('ending the night removes the dish and its count, so no stale "· 0" survives', () => {
  const d = new InteractionDirector(); d.setActive(true, 0); d.orderTreat('lsd', 0)
  d.begin('consume', 0); d.sample(5); d.takeCompletedTreat()
  assert.deepEqual(d.treat, { kind: 'lsd', remaining: 0 })
  d.setActive(false, 5); d.clearTreat()
  assert.equal(d.treat, null); assert.equal(d.canConsume(5), false)
  // Mid-lift, the owner refuses to drop a held piece; Room deactivates first.
  const busy = new InteractionDirector(); busy.setActive(true, 0); busy.orderTreat('mushrooms', 0); busy.begin('consume', 0); busy.sample(1.5)
  busy.clearTreat(); assert.equal(busy.treat?.kind, 'mushrooms')
  // Room.endNight is the single place the effect and the dish both end, and
  // both leaving the table and starting a fresh one go through it.
  const room = readFileSync(resolve('src/scene/Room.ts'), 'utf8'), app = readFileSync(resolve('src/App.tsx'), 'utf8')
  const endNight = room.slice(room.indexOf('endNight(): void {'), room.indexOf('}', room.indexOf('endNight(): void {')))
  assert.match(endNight, /this\.hero\.clearTreat\(\)/); assert.match(endNight, /this\.effects\.reset\(\)/)
  assert.match(room, /if \(!playing\) \{[^}]*this\.endNight\(\)/)
  assert.match(app.slice(app.indexOf('const newTable'), app.indexOf('const newTable') + 600), /endNight\(\)/)
})

test('steam fades out as the glass is lifted toward the eye', () => {
  const drink = new TableDrink('mulled-wine')
  drink.frame(3, false, 0); assert.ok(drink.vapourOpacity > .05)
  drink.frame(3, false, .5); const mid = drink.vapourOpacity
  drink.frame(3, false, 1); assert.equal(drink.vapourOpacity, 0, 'no vapour sheet across the near plane at the sip')
  assert.ok(mid > 0 && mid < .1)
  drink.dispose()
})

test('the menu only advertises E when a dish exists, and headings keep their own style', () => {
  const noDish = renderToStaticMarkup(createElement(DrinkMenu, { kind: 'wine', available: true, onOrder: () => {}, onClose: () => {} }))
  assert.doesNotMatch(noDish, /E takes a treat/); assert.match(noDish, /D sips\./)
  const dish = renderToStaticMarkup(createElement(DrinkMenu, { kind: 'wine', treat: 'mushrooms', available: true, onOrder: () => {}, onClose: () => {} }))
  assert.match(dish, /E takes a treat/)
  assert.doesNotMatch(dish, /<h4[^>]*>[^<]*<small/, 'heading note must not inherit the option-note style')
})
