import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { TableDrink } from '../src/scene/Drinks'
import { createAshtray, createCigar } from '../src/scene/props/Smoking'
import { ASHTRAY, DRINKS, type DrinkKind } from '../src/scene/props/specs'
import { InteractionDirector } from '../src/scene/InteractionDirector'

function blockFaces(root: THREE.Object3D): number {
  let triangles = 0
  root.traverse(o => {
    if (!(o instanceof THREE.Mesh)) return
    const positions = o.geometry.getAttribute('position'), index = o.geometry.index!
    assert.ok(positions.count > 0, `${o.name}: empty prop`)
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3()
    for (let i = 0; i < index.count; i += 3) {
      a.fromBufferAttribute(positions, index.getX(i)); b.fromBufferAttribute(positions, index.getX(i + 1)); c.fromBufferAttribute(positions, index.getX(i + 2))
      const normal = b.sub(a).cross(c.sub(a)).normalize()
      assert.ok(normal.toArray().filter(n => Math.abs(n) > 1e-6).length === 1, `${o.name}: non-block triangle`)
      triangles++
    }
  })
  return triangles
}
function dispose(root: THREE.Object3D) {
  root.traverse(o => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); (o.material as THREE.Material).dispose() } })
}

test('all four drinks use bounded block surfaces and rim/grip anchors on the actual vessel', () => {
  for (const kind of Object.keys(DRINKS) as DrinkKind[]) {
    const drink = new TableDrink(kind)
    assert.ok(blockFaces(drink.root) < 35_000, `${kind}: prop triangle budget`)
    const bounds = new THREE.Box3().setFromObject(drink.root)
    assert.ok(Math.abs(bounds.max.y - drink.rim.y) < .0021)
    assert.ok(Math.abs(bounds.max.x - drink.grip.x) < .0021)
    assert.ok(bounds.min.y >= 0)
    assert.ok(drink.root.children.length <= 5, 'do not draw one mesh per block')
    let disposed = 0, materialsDisposed = 0
    drink.root.traverse(o => { if (o instanceof THREE.Mesh) {
      o.geometry.addEventListener('dispose', () => disposed++)
      ;(o.material as THREE.Material).addEventListener('dispose', () => materialsDisposed++)
    } })
    const count = drink.root.children.length
    drink.dispose(); assert.equal(disposed, count); assert.equal(materialsDisposed, count)
  }
})

test('block ashtray has a real recessed floor and lowered cigar supports', () => {
  const tray = createAshtray(), cigar = createCigar()
  blockFaces(tray); blockFaces(cigar.root)
  tray.updateMatrixWorld(true)
  const ray = new THREE.Raycaster(), heightAt = (x: number, z: number) => {
    ray.set(new THREE.Vector3(x, .1, z), new THREE.Vector3(0, -1, 0))
    return ray.intersectObject(tray.getObjectByName('recessed-tray')!, false)[0]?.point.y
  }
  const floor = heightAt(0, 0)!, rim = heightAt(0, .050)!, rest = heightAt(.050, 0)!
  assert.ok(floor < .009 && rim - floor > .015, 'ashtray must not be a filled puck')
  assert.ok(rest < rim - .003, 'cigar support is a lowered slot')
  // The tray pose maps cigar-local Z onto vertical Y; voxel faces extend half
  // a cell beyond sample centres, so use actual mesh bounds, not nominal radius.
  const underside = ASHTRAY.cigarRestY + new THREE.Box3().setFromObject(cigar.root).min.z
  assert.ok(underside >= rest - .0006 && underside - rest < .002, 'cigar must rest on the actual support, not float or pierce it')
  dispose(tray); dispose(cigar.root)
})

test('ordering cannot replace a drink during a reach, held sip or interrupted return', () => {
  const director = new InteractionDirector(); director.setActive(true, 0)
  for (const kind of Object.keys(DRINKS) as DrinkKind[]) {
    assert.equal(director.orderDrink(kind, 0), true)
    const c = director.calibration, rim = new THREE.Vector3(0, DRINKS[kind].height, DRINKS[kind].radius)
    rim.applyQuaternion(new THREE.Quaternion(...c.drinkMouth.rotation)).add(new THREE.Vector3(...c.drinkMouth.position))
    assert.ok(rim.distanceTo(new THREE.Vector3(.005, 1.335, 1.365)) < 1e-7, 'sip targets the actual rim, not the old glass height')
  }
  director.begin('drink', 0)
  for (const time of [.3, 1, 2.5, 3.8]) {
    const before = structuredClone(director.calibration)
    assert.equal(director.orderDrink('beer', time), false)
    assert.deepEqual(director.calibration, before)
  }
  director.inspect(true, 3.9)
  assert.equal(director.orderDrink('beer', 4), false)
  director.sample(6); assert.equal(director.orderDrink('beer', 6), false)
  director.inspect(false, 6); assert.equal(director.orderDrink('beer', 6), true)
})
