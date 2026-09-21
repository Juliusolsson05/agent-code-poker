import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { AnatomicalHand, type HandPose } from '../src/scene/Hand'
import { SeatedArm } from '../src/scene/Arm'
import { VoxelSculpt, anatomyMaterial } from '../src/scene/Voxel'

/** The recorded card-grip SIDE view exposes open ribbon-like fingers. A bone
 * coincidence test cannot see this: greedy voxel faces have T-junctions which
 * only share an edge geometrically in bind pose. Nonlinear skinning pulls the
 * intervening vertex off its neighbour's unsplit edge. Weld *positions* only
 * for this audit (production retains material/normal seams), then count actual
 * triangle edge partners in both bind and deformed production geometry.
 * This is a topology regression, not a claim of realistic hand appearance. */
function unpairedEdges(mesh: THREE.SkinnedMesh, deformed: boolean): number {
  const positions = mesh.geometry.getAttribute('position'), index = mesh.geometry.index!
  const ids: number[] = [], vertices = new Map<string, number>(), edges = new Map<string, number>()
  const p = new THREE.Vector3()
  for (let i = 0; i < positions.count; i++) {
    if (deformed) mesh.getVertexPosition(i, p); else p.fromBufferAttribute(positions, i)
    const key = p.toArray().map(n => Math.round(n * 1e6)).join(',')
    if (!vertices.has(key)) vertices.set(key, vertices.size)
    ids.push(vertices.get(key)!)
  }
  for (let i = 0; i < index.count; i += 3) for (let j = 0; j < 3; j++) {
    const a = ids[index.getX(i + j)], b = ids[index.getX(i + (j + 1) % 3)]
    const key = a < b ? `${a}:${b}` : `${b}:${a}`
    edges.set(key, (edges.get(key) ?? 0) + 1)
  }
  return [...edges.values()].filter(n => n === 1).length
}

test('actual hand triangle surfaces stay closed through recorded grip poses', () => {
  const hand = new AnatomicalHand('right', '#ae8165', .0025)
  const mesh = hand.root.getObjectByName('articulated-hand-surface') as THREE.SkinnedMesh
  assert.equal(unpairedEdges(mesh, false), 0, 'bind mesh has unsplit T-junction edges; skinning will open them')
  for (const pose of ['cards', 'cigar', 'glass', 'rest', 'push'] as HandPose[]) {
    hand.pose(pose)
    assert.equal(unpairedEdges(mesh, true), 0, `${pose}: deformed surface has an open edge`)
  }
  // A one-draw mesh still needs a bounded vertex budget. This is a construction
  // guard, not a GPU frame-rate benchmark; profile all twelve hands separately.
  assert.ok(mesh.geometry.getAttribute('position').count < 100_000)
  mesh.geometry.dispose(); mesh.skeleton.dispose(); (mesh.material as THREE.Material).dispose()
})

test('sleeve color seams and bent elbows retain matching triangle edges', () => {
  const arm = new SeatedArm(new THREE.Group(), 1, '#ae8165', '#252b2c', '#ada796')
  assert.equal(unpairedEdges(arm.mesh, false), 0)
  for (const wrist of [[.2, .85, .385], [.29, .92, .46], [.04, 1.30, .16]]) {
    arm.solve(new THREE.Vector3(...wrist), new THREE.Euler(-.4, .2, -.7))
    assert.equal(unpairedEdges(arm.mesh, true), 0, 'posed sleeve has an open edge')
  }
  arm.mesh.parent!.traverse(o => {
    if (o instanceof THREE.Mesh) { o.geometry.dispose(); (o.material as THREE.Material).dispose() }
    if (o instanceof THREE.SkinnedMesh) o.skeleton.dispose()
  })
})

test('surface-painted facial hair cannot enlarge or detach from the jaw', () => {
  const material = anatomyMaterial()
  const sculpt = () => new VoxelSculpt(.0035).ellipsoid([0, -.035, .012], [.066, .07, .059], '#b58b70')
  const bare = sculpt().mesh(material)
  const beard = sculpt().paint((x, y, z) => y < -.03 && z > -.028, '#514037').mesh(material)
  bare.geometry.computeBoundingBox(); beard.geometry.computeBoundingBox()
  assert.deepEqual(beard.geometry.boundingBox, bare.geometry.boundingBox)
  // Color boundaries may split greedy patches; compare occupied exposed surface
  // area rather than requiring identical triangulation or a magic vertex count.
  const area = (mesh: THREE.Mesh) => {
    const p = mesh.geometry.getAttribute('position'), ix = mesh.geometry.index!, triangle = new THREE.Triangle()
    let result = 0
    for (let i = 0; i < ix.count; i += 3) {
      triangle.a.fromBufferAttribute(p, ix.getX(i)); triangle.b.fromBufferAttribute(p, ix.getX(i + 1)); triangle.c.fromBufferAttribute(p, ix.getX(i + 2))
      result += triangle.getArea()
    }
    return result
  }
  assert.ok(Math.abs(area(beard) - area(bare)) < 1e-8)
  assert.ok(new Set(Array.from(beard.geometry.getAttribute('color').array)).size > 3, 'paint must affect visible colors')
  bare.geometry.dispose(); beard.geometry.dispose(); material.dispose()
})
