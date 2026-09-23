import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { Box3, Euler, Light, Matrix4, Mesh, Quaternion, Vector3 } from 'three'
import { Fireplace, FIRE_LIGHT } from '../src/scene/environment/Fireplace'
import { CHAIR_BLOCKS, FIREPLACE_LAYOUT, SEATS, seatYaw } from '../src/scene/environment/layout'
import { createRoomPlan, type RoomBlock } from '../src/scene/environment/RoomPlan'

const actual = JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T04-36-26-293Z.json.gz', import.meta.url))).toString()).metadata.scene
const box = (b: RoomBlock) => new Box3().setFromCenterAndSize(new Vector3(...b.position), new Vector3(...b.size))

test('larger offset fireplace needs a split bar and clears the derived production room and recorded decor', () => {
  const fire = new Fireplace(), bounds = new Box3().setFromObject(fire.root)
  assert.ok(bounds.min.y >= -.010001 && bounds.min.y < .001, 'hearth must stand on the actual floor')
  const padded = bounds.clone().expandByScalar(.03)
  assert.deepEqual(actual.roomBlocks, createRoomPlan().blocks, 'retain the actual unmodified room as baseline')
  assert.ok(actual.roomBlocks.some((b: RoomBlock) => b.position[1] > 0 && bounds.intersectsBox(box(b))), 'moving the hearth alone must reproduce the bar intersection')
  assert.ok(fire.root.position.x > 1 && fire.root.position.x < 1.8); assert.equal(fire.root.rotation.y, 0)
  assert.ok(bounds.max.x - bounds.min.x > 2, 'requested larger hearth, not the former 1.3m width')
  const candidate = createRoomPlan({ fireplace: true })
  for (const b of candidate.blocks) {
    if (b.position[1] <= 0) continue // Floor is support, not an obstacle to levitate above.
    assert.equal(padded.intersectsBox(box(b)), false, `room block ${JSON.stringify(b)}`)
  }
  for (const [color, x, y, z, sx, sy, sz] of candidate.glows) assert.equal(padded.intersectsBox(box({ color, position: [x, y, z], size: [sx, sy, sz] })), false, 'shelf strips cross the chimney')
  // The complete back bar is intentionally redesigned, not clipped. Outside
  // that authored furniture zone the actual wall/window/table remain fixed.
  const outer = (b: RoomBlock) => Math.abs(b.position[0]) > 2.85 || b.position[2] >= -2.75 || b.position[2] <= -5.24 || b.position[1] < 0
  for (const b of (actual.roomBlocks as RoomBlock[]).filter(outer)) assert.ok(candidate.blocks.some(c => JSON.stringify(c) === JSON.stringify(b)), 'outer furniture moved to conceal a collision')
  for (const d of actual.decorBounds) {
    const decor = new Box3(new Vector3(...d.bounds.slice(0, 3)), new Vector3(...d.bounds.slice(3)))
    for (const solid of fire.solidBounds) assert.equal(solid.clone().expandByScalar(.03).intersectsBox(decor), false, d.name)
  }
  for (const [x, z] of SEATS.slice(1)) {
    const transform = new Matrix4().compose(new Vector3(x, 0, z), new Quaternion().setFromEuler(new Euler(0, seatYaw(x, z), 0)), new Vector3(1, 1, 1))
    for (const b of CHAIR_BLOCKS) assert.equal(padded.intersectsBox(box(b).applyMatrix4(transform)), false, 'chair intersection')
  }
})

test('fire uses two opaque batches, one bounded light, no shadow and stable frame buffers', () => {
  const fire = new Fireplace(), meshes: Mesh[] = [], lights: Light[] = []
  fire.root.traverse(o => { if (o instanceof Mesh) meshes.push(o); if (o instanceof Light) lights.push(o) })
  assert.equal(meshes.length, 2); assert.equal(lights.length, 1); assert.equal(lights[0].castShadow, false)
  for (const mesh of meshes) {
    assert.ok(!Array.isArray(mesh.material)); assert.equal((mesh.material as any).transparent, false)
  }
  const geometry = fire.flames.geometry, matrix = fire.flames.instanceMatrix, array = matrix.array
  const envelope = new Box3().setFromObject(fire.root).expandByScalar(.001)
  for (let i = 0; i < 360; i++) {
    fire.frame(i / 60, false)
    fire.flames.computeBoundingBox(); fire.root.updateMatrixWorld(true)
    assert.ok(envelope.containsBox(fire.flames.boundingBox!.clone().applyMatrix4(fire.flames.matrixWorld)), 'flame escapes hearth envelope')
    assert.equal(fire.flames.geometry, geometry); assert.equal(fire.flames.instanceMatrix.array, array)
    assert.ok(Math.abs(fire.light.intensity - FIRE_LIGHT.base) <= FIRE_LIGHT.swing, 'fire light stays a bounded warm flicker')
  }
  assert.equal(fire.flames.count, 128)
  const version = matrix.version
  fire.frame(359 / 60, false)
  assert.equal(matrix.version, version, 'same paused visual time must not upload again')
  fire.frame(20, true); const still = matrix.array.slice(), frozenVersion = matrix.version
  fire.frame(100, true)
  assert.deepEqual(matrix.array, still); assert.equal(matrix.version, frozenVersion)
  assert.equal(fire.light.intensity, FIRE_LIGHT.base, 'reduced motion freezes light as well as flame')
})

test('redesigned left bar has complete shelf ends, bottles and cabinet panels, not clipped fragments', () => {
  const plan = createRoomPlan({ fireplace: true })
  const shelves = plan.blocks.filter(b => b.color === '#4a3526')
  assert.equal(shelves.length, 3)
  for (const shelf of shelves) {
    assert.equal(shelf.size[0], 2.45)
    assert.ok(shelf.position[0] + shelf.size[0] / 2 < FIREPLACE_LAYOUT.bayMinX)
  }
  assert.ok(plan.blocks.some(b => b.color === '#705333' && b.position[0] === .08 && b.size[1] === 2.3), 'shelf needs a finished full-height end upright')
  assert.ok(plan.blocks.some(b => b.color === '#34241c' && b.position[0] === .075 && b.size[2] === .6), 'counter needs an authored side panel')
  const bodies = plan.blocks.filter(b => b.position[2] === -4.87 && b.size[0] === .078)
  assert.equal(bodies.length, 30)
  assert.ok(bodies.every(b => b.position[0] + b.size[0] / 2 < .08), 'no cut bottle beside the shelf end')
})
