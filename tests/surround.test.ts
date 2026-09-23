import test from 'node:test'
import assert from 'node:assert/strict'
import { Box3, Euler, Matrix4, Quaternion, Vector3 } from 'three'
import { createSurroundPlan, WALL, type SurroundBlock } from '../src/scene/environment/Surround'
import { flickerAt } from '../src/scene/environment/SurroundDecor'
import { createRoomPlan, type RoomBlock } from '../src/scene/environment/RoomPlan'
import { CHAIR_BLOCKS, PLAYER_LAYOUT, SEATS, seatYaw } from '../src/scene/environment/layout'
import { Fireplace } from '../src/scene/environment/Fireplace'
import { ChristmasTavern } from '../src/scene/Christmas'
import { FIELD_OF_REGARD, LOOK_LIMITS, SeatedLook, yawLimitForView } from '../src/scene/camera/SeatedLook'

// Axis-aligned envelope of a (possibly yawed) block, shrunk by 1mm so blocks
// that merely touch a wall face are not reported as collisions.
const envelope = (b: SurroundBlock | RoomBlock) => {
  const rot = 'rot' in b && b.rot ? b.rot : 0, c = Math.abs(Math.cos(rot)), s = Math.abs(Math.sin(rot))
  const size = new Vector3(c * b.size[0] + s * b.size[2], b.size[1], s * b.size[0] + c * b.size[2])
  return new Box3().setFromCenterAndSize(new Vector3(...b.position), size).expandByScalar(-.001)
}
const withDocument = <T>(run: () => T): T => {
  const previous = globalThis.document
  globalThis.document = { createElement: () => ({ getContext: () => ({ createRadialGradient: () => ({ addColorStop() {} }), fillRect() {} }) }) } as unknown as Document
  try { return run() } finally { if (previous) globalThis.document = previous; else delete (globalThis as { document?: Document }).document }
}

test('every direction in the 280° field of regard lands on a finished surface', () => {
  // #10's contract. Before the rear wall existed, rays past ~118° from forward
  // left through the missing back of the room into the clear colour. Sample
  // the full sweep at every elevation the seated lens can show, including the
  // bottom image corners with pitch -.25 (about -1.05 rad).
  const plan = createSurroundPlan(), room = createRoomPlan({ fireplace: true }).blocks
  const solids = [...room, ...plan.shell].map(b => new Box3().setFromCenterAndSize(new Vector3(...b.position), new Vector3(...b.size)))
  const eye = new Vector3(...PLAYER_LAYOUT.eye), half = FIELD_OF_REGARD / 2
  const hit = (dir: Vector3) => solids.some(box => {
    let near = -Infinity, far = Infinity
    for (const axis of ['x', 'y', 'z'] as const) {
      if (Math.abs(dir[axis]) < 1e-9) { if (eye[axis] < box.min[axis] || eye[axis] > box.max[axis]) return false; continue }
      const a = (box.min[axis] - eye[axis]) / dir[axis], b = (box.max[axis] - eye[axis]) / dir[axis]
      near = Math.max(near, Math.min(a, b)); far = Math.min(far, Math.max(a, b))
    }
    return near <= far && far > 0 && near < 15
  })
  const misses: string[] = []
  for (let yaw = -half; yaw <= half + 1e-9; yaw += Math.PI / 90) for (let elevation = -1.1; elevation <= .85; elevation += .1) {
    // Yaw 0 looks down -Z; positive yaw turns left (Room rotates about +Y).
    const dir = new Vector3(-Math.sin(yaw) * Math.cos(elevation), Math.sin(elevation), -Math.cos(yaw) * Math.cos(elevation))
    if (!hit(dir)) misses.push(`${(yaw * 180 / Math.PI).toFixed(0)}°/${(elevation * 180 / Math.PI).toFixed(0)}°`)
  }
  assert.deepEqual(misses, [])
})

test('surround decor clears the pinned room, hearth, tree, chairs and table', () => {
  const plan = createSurroundPlan()
  const interior = new Box3(new Vector3(WALL.left, WALL.floor, WALL.back), new Vector3(WALL.right, WALL.ceiling, WALL.rear))
  const decor = [...plan.blocks, ...plan.glows.map(g => ({ color: g.color, position: g.position, size: g.size }))]
  const room = createRoomPlan({ fireplace: true }).blocks.filter(b => b.position[1] > 0) // the floor slab is support
  const fire = new Fireplace()
  const tree = withDocument(() => { const c = new ChristmasTavern(); const r = [c.treeBounds.clone(), ...c.decorBounds.values()]; c.dispose(); return r })
  const chairs = SEATS.slice(1).flatMap(([x, z]) => {
    const m = new Matrix4().compose(new Vector3(x, 0, z), new Quaternion().setFromEuler(new Euler(0, seatYaw(x, z), 0)), new Vector3(1, 1, 1))
    return CHAIR_BLOCKS.map(b => new Box3().setFromCenterAndSize(new Vector3(...b.position), new Vector3(...b.size)).applyMatrix4(m))
  })
  // The table and its rail fit inside this footprint; nothing but the rug may
  // enter it, and the rug stays below the chair feet (y=.01).
  const table = new Box3(new Vector3(-1.95, 0, -1.2), new Vector3(1.95, .9, 1.2))
  for (const b of decor) {
    const box = envelope(b), label = `${b.color} @ ${b.position.map(v => v.toFixed(2))}`
    assert.ok(interior.containsBox(box), `${label} leaves the room`)
    if (box.max.y <= .01) continue // rugs and mats lie on the floor under everything
    for (const r of room) assert.ok(!box.intersectsBox(envelope(r)), `${label} intersects room block ${r.color} @ ${r.position}`)
    for (const s of fire.solidBounds) assert.ok(!box.intersectsBox(s), `${label} intersects the hearth`)
    for (const t of tree) assert.ok(!box.intersectsBox(t), `${label} intersects the Christmas tree/garland`)
    for (const c of chairs) assert.ok(!box.intersectsBox(c), `${label} intersects a seated chair`)
    assert.ok(!box.intersectsBox(table), `${label} intersects the table`)
  }
})

test('lighting stays one shadow pass and one aggregate light per decor zone', async () => {
  // The 280° room needs practicals behind and beside the player, but forward
  // shading pays for every light in every lit fragment. Three new zones
  // (nook, sideboard, door) each get ONE light standing in for their candles.
  // Room-wide: rig 6 (incl. felt bounce) + tree 1 + sconces 2 + surround 3 +
  // the production hearth 1 = 13. The hearth was missing from the first count
  // (review of #11). One light per bulb stays forbidden.
  const { createTavernLighting } = await import('../src/scene/environment/Lighting')
  const { Light } = await import('three')
  const lights: InstanceType<typeof Light>[] = []
  createTavernLighting().traverse(o => { if (o instanceof Light) lights.push(o) })
  withDocument(() => { const c = new ChristmasTavern(); c.root.traverse(o => { if (o instanceof Light) lights.push(o) }); c.dispose() })
  new Fireplace().root.traverse(o => { if (o instanceof Light) lights.push(o) })
  const surround = createSurroundPlan().lights
  assert.equal(lights.filter(l => l.castShadow).length, 1)
  assert.equal(surround.length, 3)
  assert.ok(lights.length + createRoomPlan({ fireplace: true }).lights.length + surround.length <= 13)
  const plan = createSurroundPlan(), bulbs = plan.fairy.reduce((n, strand) => n + strand.length, 0)
  assert.ok(plan.glows.length + bulbs > 300, 'candles and bulbs are emissive instances, not lights')
})

test('look-around yaw derives from the lens so the swept edges span 280°', () => {
  for (const aspect of [1.25, 1.6, 16 / 9, 2.4]) {
    const limit = yawLimitForView(70, aspect), half = Math.atan(Math.tan(35 * Math.PI / 180) * aspect)
    assert.ok(Math.abs(2 * limit + 2 * half - FIELD_OF_REGARD) < 1e-9, `aspect ${aspect}`)
  }
  // Never narrower than the original gesture (even an unbounded lens leaves
  // 50° > .85 rad), and bad input keeps the default.
  assert.ok(yawLimitForView(70, 1e6) >= LOOK_LIMITS.yaw)
  assert.equal(yawLimitForView(Number.NaN, 1.6), LOOK_LIMITS.yaw)
  const look = new SeatedLook(); look.setContext({ playing: true })
  look.setYawLimit(yawLimitForView(70, 1.6))
  look.begin(1, 1000, 500, true); look.move(1, -2000, 500, 1000, 1); look.end(1)
  assert.ok(Math.abs(look.diagnostic().intent.yaw - yawLimitForView(70, 1.6)) < 1e-12, 'drag reaches the new limit')
  look.setYawLimit(1)
  assert.equal(look.diagnostic().intent.yaw, 1, 'a narrower window clamps retained intent at once')
})

test('flicker is a pure function of the room clock and stays gentle', () => {
  assert.equal(flickerAt('steady', 12.3, 1), 1)
  for (const kind of ['candle', 'lamp', 'fairy'] as const) for (let t = 0; t < 60; t += .0333) {
    const v = flickerAt(kind, t, .7)
    assert.equal(v, flickerAt(kind, t, .7))
    assert.ok(v > .8 && v < 1.2, `${kind} at ${t}: ${v}`)
  }
})

test('window views and paintings sit in front of every wall finish they overlap', () => {
  // Regressions: the snowy side-window planes were authored 4mm off the wall
  // while wallpaper stands 12–14mm proud (both windows rendered black), and the
  // dado rail/panelling then ran across the bottom of both views.
  const plan = createSurroundPlan()
  for (const p of plan.pictures) {
    const [w, h] = p.size
    const offset = p.facing === '+x' ? p.position[0] - WALL.left : p.facing === '-x' ? WALL.right - p.position[0] : WALL.rear - p.position[2]
    const along = p.facing === '-z' ? 0 : 2
    for (const b of plan.shell) {
      const front = p.facing === '+x' ? b.position[0] + b.size[0] / 2 - WALL.left : p.facing === '-x' ? WALL.right - (b.position[0] - b.size[0] / 2) : WALL.rear - (b.position[2] - b.size[2] / 2)
      if (front > .3) continue // not a finish on this wall
      const overlapsAlong = Math.abs(b.position[along] - p.position[along]) < (b.size[along] + w) / 2
      const overlapsUp = Math.abs(b.position[1] - p.position[1]) < (b.size[1] + h) / 2
      if (overlapsAlong && overlapsUp) assert.ok(front < offset - .001, `${p.kind} at ${p.position} is behind a finish (${b.color}, front ${front.toFixed(4)} ≥ ${offset})`)
    }
  }
})
