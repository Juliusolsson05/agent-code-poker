import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { buildHuman, humanMaterial } from '../src/scene/Human'
import { CardField } from '../src/scene/Cards'
import { PokerGame } from '../src/engine/game'
import { ChipLedger } from '../src/scene/ChipLedger'
import { createTableSurface, tableCardPosition, dealerPosition, TABLE } from '../src/scene/Table'

test('dealer button sits on felt and is not buried in the rail at any seat', () => {
  const table = createTableSurface(), rail = table.getObjectByName('table-rail')!
  table.updateMatrixWorld(true)
  const seats: [number, number][] = [[0, 1.7], [-1.91, -.43], [-1.15, -1.13], [0, -1.40], [1.15, -1.13], [1.91, -.43]]
  for (let seat = 0; seat < seats.length; seat++) {
    const center = dealerPosition(seat, seats)
    assert.ok(Math.abs(center.y - .006 - TABLE.feltY) < 1e-9)
    for (let i = 0; i < 16; i++) {
      const point = center.clone().add(new THREE.Vector3(Math.cos(i / 8 * Math.PI) * .039, .006, Math.sin(i / 8 * Math.PI) * .039))
      assert.ok((Math.abs(point.x) / TABLE.feltX) ** TABLE.exponent + (Math.abs(point.z) / TABLE.feltZ) ** TABLE.exponent < 1, `button ${seat} overlaps rail`)
      const eye = new THREE.Vector3(0, 1.43, 2.02)
      assert.equal(new THREE.Raycaster(eye, point.clone().sub(eye).normalize(), 0, eye.distanceTo(point)).intersectObject(rail).length, 0)
    }
  }
  table.traverse(o => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose()) } })
})

test('player table cards clear the actual rail mesh across seated camera extremes', () => {
  assert.ok(TABLE.cardY > TABLE.feltY && TABLE.cardY - TABLE.feltY < .001, 'paper must rest on the felt, not float a centimetre above it')
  const table = createTableSurface(), rail = table.getObjectByName('table-rail')!
  table.updateMatrixWorld(true)
  const seats: [number, number][] = [[0, 1.7]]
  // Check the entire paper footprint, not only its centre. The former z=.918
  // centre was embedded in the rail, and merely moving that centre onto felt
  // would still leave the near edge hidden from a low seated viewpoint.
  for (const orbit of [-1, 0, 1]) for (const index of [0, 1]) {
    const eye = new THREE.Vector3(orbit * .12, 1.43, 2.02)
    for (const dx of [-.052, 0, .052]) for (const dz of [-.0725, 0, .0725]) {
      const p = tableCardPosition(0, index, seats).add(new THREE.Vector3(dx, 0, dz))
      assert.ok((Math.abs(p.x) / TABLE.feltX) ** TABLE.exponent + (Math.abs(p.z) / TABLE.feltZ) ** TABLE.exponent < 1)
      const distance = eye.distanceTo(p), ray = new THREE.Raycaster(eye, p.clone().sub(eye).normalize(), 0, distance - .0001)
      assert.equal(ray.intersectObject(rail).length, 0, `rail hides card ${index}, corner ${dx}/${dz}, orbit ${orbit}`)
    }
  }
  // Prove this fixture detects the original reported placement, rather than
  // passing because the table has no raycastable geometry or reversed faces.
  const old = new THREE.Vector3(-.043, .803, .918), eye = new THREE.Vector3(0, 1.43, 2.02)
  assert.ok(new THREE.Raycaster(eye, old.clone().sub(eye).normalize(), 0, eye.distanceTo(old)).intersectObject(rail).length > 0)
  table.traverse(o => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose()) } })
})

test('restoring a public showdown shows table-card faces instead of replaying hidden deal backs', () => {
  const game = new PokerGame(() => .43); game.startHand()
  while (!['showdown', 'complete'].includes(game.snapshot().phase)) {
    if (game.snapshot().phase === 'betting') game.act(game.snapshot().actor!, { type: game.legal().check ? 'check' : 'call' })
    else game.advance()
  }
  const textures = new Map<number | null, THREE.CanvasTexture>(), state = game.snapshot()
  const seats: [number, number][] = [[0, 1.7], [-1.9, -.4], [-1.1, -1.1], [0, -1.4], [1.1, -1.1], [1.9, -.4]]
  const field = new CardField(seats, card => {
    if (!textures.has(card)) textures.set(card, new THREE.Texture() as THREE.CanvasTexture)
    return textures.get(card)!
  })
  field.update(state); field.frame(performance.now() / 1000 + 4, true)
  assert.equal(field.root.children.filter(c => c.visible).length, 17)
  assert.equal(textures.has(null), false, 'only public faces belong in the restored showdown')
  for (const child of field.root.children as THREE.Mesh[]) { child.geometry.dispose(); (child.material as THREE.Material).dispose() }
  textures.forEach(t => t.dispose())
})

test('inspection exposes only our live cards, leaves rules untouched, and clears after folding', () => {
  const game = new PokerGame(() => .43); game.startHand()
  const seen: (number | null)[] = [], textures: THREE.Texture[] = []
  const field = new CardField([[0, 1.7], [-1.9, -.4], [-1.1, -1.1], [0, -1.4], [1.1, -1.1], [1.9, -.4]], card => {
    seen.push(card); const texture = new THREE.Texture(); textures.push(texture); return texture as THREE.CanvasTexture
  })
  field.update(game.snapshot()); seen.length = 0
  const before = game.snapshot()
  field.setInspection(true)
  assert.deepEqual(seen, before.players[0].hole, 'a new viewpoint must not request any opponent face')
  assert.deepEqual(game.snapshot(), before, 'inspection must not act, advance or change any chip balance')
  const papers = field.root.children.filter(c => c.name === 'player-inspection-card')
  assert.equal(papers.length, 2); assert.ok(papers.every(p => p.visible))
  field.setInspection(false); assert.ok(papers.every(p => !p.visible))
  field.setInspection(true)
  while (game.snapshot().actor !== 0) game.act(game.snapshot().actor!, { type: 'call' })
  game.act(0, { type: 'fold' }); field.update(game.snapshot())
  assert.ok(papers.every(p => !p.visible), 'folded cards cannot persist in the inspection view')
  field.root.traverse(o => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); (o.material as THREE.Material).dispose() } })
  textures.forEach(t => t.dispose())
})

test('visible chip denominations exactly represent every possible 12,000-chip table amount', () => {
  // Exercise the actual production inventory rather than the retired display
  // decomposition helper. The projection must represent even zero or winner-
  // takes-all account distributions; these fixtures test amounts, not legality.
  for (let amount = 0; amount <= 12000; amount++) {
    const state = new PokerGame().snapshot()
    state.players.forEach((p, seat) => { p.stack = seat === 0 ? amount : seat === 1 ? 12000 - amount : 0 })
    const inventory = new ChipLedger().sync(state)
    assert.equal(inventory.filter(c => c.account === 'bank:0').reduce((sum, c) => sum + c.value, 0), amount)
    assert.equal(inventory.reduce((sum, c) => sum + c.value, 0), 12000)
    for (const value of [500, 100, 25, 5, 1]) assert.ok(inventory.filter(c => c.value === value).length < 512)
  }
})

test('restoring a saved hand after the initial ready scene rebuilds stacks without spending an empty pot', () => {
  const game = new PokerGame(() => .43), ledger = new ChipLedger()
  ledger.sync(game.snapshot()); game.startHand()
  game.act(game.snapshot().actor!, { type: 'raise', to: 100 })
  while (game.snapshot().phase === 'betting') game.act(game.snapshot().actor!, { type: game.legal().check ? 'check' : 'call' })
  game.advance()
  const restored = ledger.sync(PokerGame.restore(game.snapshot()).snapshot())
  assert.equal(restored.filter(c => c.account === 'pot').reduce((n, c) => n + c.value, 0), 600)
  assert.equal(restored.reduce((n, c) => n + c.value, 0), 12000)
})

test('physical chips retain identity through calls and match every account across 100 seeded hands', () => {
  let seed = 125; const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
  for (let run = 0; run < 100; run++) {
    const game = new PokerGame(random), ledger = new ChipLedger()
    ledger.sync(game.snapshot()); game.startHand()
    let chips = ledger.sync(game.snapshot())
    const untouched = chips.filter(c => c.account === 'bank:0').map(c => c.id)
    game.act(3, { type: 'call' }); chips = ledger.sync(game.snapshot())
    assert.deepEqual(chips.filter(c => c.account === 'bank:0').map(c => c.id), untouched)
    for (let step = 0; game.snapshot().phase !== 'complete'; step++) {
      assert.ok(step < 250)
      const s = game.snapshot(), l = game.legal()
      if (s.phase !== 'betting') game.advance()
      else if (random() < .15) game.act(s.actor!, { type: 'fold' })
      else if (l.raise && random() < .3) game.act(s.actor!, { type: 'raise', to: l.min + Math.floor(random() * (l.max - l.min + 1)) })
      else game.act(s.actor!, { type: l.check ? 'check' : 'call' })
      chips = ledger.sync(game.snapshot())
      const next = game.snapshot()
      for (const p of next.players) {
        assert.equal(chips.filter(c => c.account === `bank:${p.seat}`).reduce((n, c) => n + c.value, 0), p.stack)
        assert.equal(chips.filter(c => c.account === `bet:${p.seat}`).reduce((n, c) => n + c.value, 0), p.bet)
      }
      assert.equal(chips.reduce((n, c) => n + c.value, 0), 12000)
    }
  }
})

test('reprojecting an unchanged hand preserves chip identity instead of simulating a restore', () => {
  const game = new PokerGame(() => .43), ledger = new ChipLedger()
  game.startHand()
  const first = ledger.sync(game.snapshot())
  assert.deepEqual(ledger.sync(game.snapshot()), first, 'a resize must not respawn the bankroll')
  game.act(game.snapshot().actor!, { type: 'call' })
  const moved = ledger.sync(game.snapshot())
  assert.deepEqual(ledger.sync(game.snapshot()), moved, 'duplicate projection must not cancel an in-flight bet')
})

test('articulated forearms stay in front of the chair back through their full motion envelope', () => {
  const geometry = new THREE.BoxGeometry(), material = humanMaterial(), human = buildHuman(2, geometry, material)
  // The chair and character share the same yaw, so this local-space check also
  // applies to the two angled seats. Their old unrotated chairs violated that
  // premise and passed straight through elbows during apparently harmless moves.
  for (const arm of [human.leftArm, human.rightArm]) for (const x of [-.33, -.18, 0, .42, .62]) for (const y of [-.16, 0, .035]) {
    arm.rotation.set(x, y, 0); human.root.updateMatrixWorld(true)
    const bounds = new THREE.Box3().setFromObject(arm)
    assert.ok(bounds.min.z > -.1725, `forearm clips chair at rotation ${x}, ${y}`)
  }
  human.root.traverse(o => { if (o instanceof THREE.InstancedMesh) { o.geometry.dispose(); o.dispose() } })
  geometry.dispose(); material.dispose()
})

test('dealing persists across decisions, private cards never use face textures, and paper cannot emit bloom', () => {
  const seen: (number | null)[] = [], textures = new Map<number | null, THREE.CanvasTexture>()
  const field = new CardField([[0, 1.7], [-1.9, -.4], [-1.1, -1.1], [0, -1.4], [1.1, -1.1], [1.9, -.4]], card => {
    seen.push(card)
    if (!textures.has(card)) textures.set(card, new THREE.Texture() as THREE.CanvasTexture)
    return textures.get(card)!
  })
  const game = new PokerGame(() => .43); game.startHand(); field.update(game.snapshot())
  assert.equal(seen.length, 12); assert.ok(seen.every(c => c === null))
  const now = performance.now() / 1000; field.frame(now + .25, false)
  const card = field.root.children[0] as THREE.Mesh
  assert.ok(card.position.y > .803, 'dealing card should be in flight')
  game.act(game.snapshot().actor!, { type: 'call' }); field.update(game.snapshot())
  assert.equal(field.root.children.length, 12, 'an action must not respawn cards')
  field.frame(now + 3, false)
  assert.ok(field.root.children.every(c => !c.visible), 'cards are picked up, not duplicated on the felt')
  while (game.snapshot().phase === 'betting') game.act(game.snapshot().actor!, { type: game.legal().check ? 'check' : 'call' })
  game.advance(); field.update(game.snapshot()); field.frame(performance.now() / 1000 + 3, false)
  assert.equal(field.root.children.filter(c => c.visible).length, 3)
  assert.deepEqual(seen.filter(c => c !== null), game.snapshot().board)
  for (const child of field.root.children as THREE.Mesh[]) {
    assert.ok(child.material instanceof THREE.MeshBasicMaterial)
    child.geometry.dispose(); (child.material as THREE.Material).dispose()
  }
  textures.forEach(t => t.dispose())
})
