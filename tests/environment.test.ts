import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { Box3, BufferAttribute, Euler, Light, Matrix4, Points, Quaternion, Vector3 } from 'three'
import { ChristmasTavern } from '../src/scene/Christmas'
import { createRoomPlan, type RoomBlock } from '../src/scene/environment/RoomPlan'
import { CHAIR_BLOCKS, CHRISTMAS_LAYOUT, SEATS, seatYaw } from '../src/scene/environment/layout'
import { createTavernLighting } from '../src/scene/environment/Lighting'

const recorded = JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T03-21-27-774Z.json.gz', import.meta.url))).toString()).metadata.scene
const box = (block: RoomBlock) => new Box3().setFromCenterAndSize(new Vector3(...block.position), new Vector3(...block.size))
test('room plan extraction preserves every actual recorded production block', () => {
  assert.deepEqual(createRoomPlan().blocks, recorded.roomBlocks)
})

test('recorded tree location overlaps seven real bar/furniture envelopes', () => {
  const bounds = new Box3(new Vector3(...recorded.treeBounds.slice(0, 3)), new Vector3(...recorded.treeBounds.slice(3)))
  assert.equal(createRoomPlan().blocks.filter(b => bounds.intersectsBox(box(b))).length, 7)
})

test('actual corrected browser scene records the same room plan and collision-free decor', () => {
  const scene = JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T04-36-26-293Z.json.gz', import.meta.url))).toString()).metadata.scene
  assert.deepEqual(scene.roomBlocks, createRoomPlan().blocks, 'renderer did not consume the tested room plan')
  assert.deepEqual(scene.decorBounds.map((d: { name: string }) => d.name).sort(), ['bar-garland', 'bar-wreath', 'christmas-tree'])
  for (const entry of scene.decorBounds) {
    const bounds = new Box3(new Vector3(...entry.bounds.slice(0, 3)), new Vector3(...entry.bounds.slice(3)))
    assert.equal(scene.roomBlocks.filter((b: RoomBlock) => bounds.intersectsBox(box(b))).length, 0, `${entry.name}: actual browser placement differs from isolated geometry`)
  }
})

test('complete authored tree and gifts clear the actual room furniture and walls', () => {
  const previous = globalThis.document
  globalThis.document = { createElement: () => ({ getContext: () => ({ createRadialGradient: () => ({ addColorStop() {} }), fillRect() {} }) }) } as unknown as Document
  try {
    const decor = new ChristmasTavern()
    for (const [name, bounds] of decor.decorBounds) {
      const overlaps = createRoomPlan().blocks.filter(b => bounds.intersectsBox(box(b)))
      assert.equal(overlaps.length, 0, `${name} intersects ${JSON.stringify(overlaps)}`)
      if (name !== 'christmas-tree') assert.equal(createRoomPlan().blocks.filter(b => bounds.clone().expandByScalar(.02).intersectsBox(box(b))).length, 0, `${name} needs 2cm clearance`)
    }
    const collisions = createRoomPlan().blocks.filter(b => decor.treeBounds.intersectsBox(box(b)))
    assert.equal(collisions.length, 0, `tree bounds ${decor.treeBounds.min.toArray()} .. ${decor.treeBounds.max.toArray()} intersect ${JSON.stringify(collisions)}`)
    // Floor is an intentional support. Other envelopes must leave a usable
    // margin, not merely avoid an exact equality at one floating-point sample.
    const padded = decor.treeBounds.clone().expandByScalar(CHRISTMAS_LAYOUT.clearance)
    assert.equal(createRoomPlan().blocks.filter(b => b.position[1] > 0 && padded.intersectsBox(box(b))).length, 0)
    for (const [x, z] of SEATS.slice(1)) {
      const transform = new Matrix4().compose(new Vector3(x, 0, z), new Quaternion().setFromEuler(new Euler(0, seatYaw(x, z), 0)), new Vector3(1, 1, 1))
      for (const chair of CHAIR_BLOCKS) assert.equal(padded.intersectsBox(box(chair).applyMatrix4(transform)), false, 'tree enters an oriented seated chair')
    }
    const glow = decor.root.getObjectByName('tree-string-bounce')!
    assert.equal(decor.treeBounds.containsPoint(glow.getWorldPosition(new Vector3())), false, 'aggregate tree bounce inside a branch creates a near-distance hotspot')
    const rig = createTavernLighting(), lights: Light[] = []
    rig.traverse(o => { if (o instanceof Light) lights.push(o) }); decor.root.traverse(o => { if (o instanceof Light) lights.push(o) })
    assert.equal(lights.filter(l => l.castShadow).length, 1, 'Christmas lighting must not add shadow passes')
    assert.ok(lights.length + createRoomPlan().lights.length <= 8, 'one light per bulb would overwhelm fragment shading')
    const snow = decor.root.getObjectByName('window-snow') as Points, positions = snow.geometry.getAttribute('position') as BufferAttribute
    assert.equal(positions.count, 84, 'snow budget must not silently become a screen-filling blizzard')
    const originalArray = positions.array
    for (const time of [0, .02, 1, 100, 100000]) {
      decor.frame(time, false)
      assert.equal(positions.array, originalArray, 'snow should reuse its bounded buffer')
      for (let i = 0; i < positions.count; i++) {
        assert.ok(positions.getX(i) >= -4.145001 && positions.getX(i) <= -2.944999)
        assert.ok(positions.getY(i) >= 1.039999 && positions.getY(i) <= 2.940001)
        assert.ok(Math.abs(positions.getZ(i) + 5.017) < 1e-6, 'snow must stay behind the mullions, not cross the tavern')
      }
    }
    decor.frame(100, true); const version = positions.version, frozen = positions.array.slice()
    decor.frame(1000, true)
    assert.equal(positions.version, version, 'reduced motion must not upload an unchanged snow buffer')
    assert.deepEqual(positions.array, frozen)
    decor.dispose()
  } finally {
    if (previous) globalThis.document = previous; else delete (globalThis as { document?: Document }).document
  }
})
