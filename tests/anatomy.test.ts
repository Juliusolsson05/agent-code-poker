import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { AnatomicalHand } from '../src/scene/Hand'
import { createHeldCardFan } from '../src/scene/CardGrip'
import { buildHuman, humanMaterial, poseHuman } from '../src/scene/Human'

function dispose(root: THREE.Object3D): void {
  root.traverse(o => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose()); if (o instanceof THREE.SkinnedMesh) o.skeleton.dispose() } })
}

test('the actual card fan does not intersect any finger or palm triangle', () => {
  const hand = new AnatomicalHand('left'); hand.pose('cards')
  const texture = new THREE.Texture() as THREE.CanvasTexture, { fan, paper } = createHeldCardFan(() => texture)
  hand.root.add(fan); hand.root.updateMatrixWorld(true)
  const meshes: THREE.Mesh[] = []
  hand.root.traverse(o => { if (o instanceof THREE.Mesh && !paper.includes(o as typeof paper[number])) meshes.push(o) })
  let crossings = 0
  for (const card of paper) for (const mesh of meshes) {
    const transform = card.matrixWorld.clone().invert().multiply(mesh.matrixWorld), positions = mesh.geometry.getAttribute('position'), index = mesh.geometry.index
    const points = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]
    for (let i = 0; i < (index?.count ?? positions.count); i += 3) {
      for (let j = 0; j < 3; j++) {
        const vertex = index ? index.getX(i + j) : i + j
        if (mesh instanceof THREE.SkinnedMesh) mesh.getVertexPosition(vertex, points[j]); else points[j].fromBufferAttribute(positions, vertex)
        points[j].applyMatrix4(transform)
      }
      if (points.every(p => p.z > .00001) || points.every(p => p.z < -.00001)) continue
      for (let j = 0; j < 3; j++) {
        const a = points[j], b = points[(j + 1) % 3]
        if (a.z * b.z >= 0) continue
        const t = a.z / (a.z - b.z), x = THREE.MathUtils.lerp(a.x, b.x, t), y = THREE.MathUtils.lerp(a.y, b.y, t)
        if (Math.abs(x) < .035 && Math.abs(y) < .0505) crossings++
      }
    }
  }
  assert.equal(crossings, 0, 'skin crosses a paper face; moving the camera cannot repair this grip')
  // Also require the index to support the paper: moving the cards far away can
  // pass collision tests while visibly floating. The close-up view checks the
  // shape of the contact; this bound guards its physical scale.
  const tip = hand.tips[0].getWorldPosition(new THREE.Vector3())
  const distance = Math.min(...paper.map(p => Math.abs(p.worldToLocal(tip.clone()).z)))
  assert.ok(distance < .009, `supporting finger is ${distance * 1000}mm from paper`)
  assert.ok(paper.every(p => p.matrixWorld.determinant() > 0), 'left-hand mirroring must not reverse printed ranks')
  dispose(hand.root); texture.dispose()
})

test('continuous sleeves and hand roots meet at the same wrist through rest, betting, folding and sipping', () => {
  const material = humanMaterial(), box = new THREE.BoxGeometry(), human = buildHuman(2, box, material)
  for (const action of ['idle', 'bet', 'fold', 'drink']) for (const time of [0, .4, .8, 1.5, 2.5, 3.7, 4.8, 5.8]) {
    human.sipAt = action === 'drink' ? 0 : -100; human.nextSip = 100
    poseHuman(human, time, { reduced: false, active: false, folded: action === 'fold', showing: false, hasCards: true, dealt: 1, action, actionAge: time, gaze: 0 })
    human.root.updateMatrixWorld(true)
    for (const arm of [human.leftRig, human.rightRig]) {
      arm.mesh.skeleton.update()
      const joint = arm.wristJoint.getWorldPosition(new THREE.Vector3()), hand = arm.hand.root.getWorldPosition(new THREE.Vector3())
      assert.ok(joint.distanceTo(hand) < 1e-7, `${action}/${time}: wrist detached`)
      assert.ok(Math.abs(arm.elbow.distanceTo(arm.shoulder) - arm.lengths[0]) < 1e-7)
      assert.ok(Math.abs(arm.wrist.distanceTo(arm.elbow) - arm.lengths[1]) < 1e-7)
      const positions = arm.mesh.geometry.getAttribute('position'), p = new THREE.Vector3()
      let cuffSamples = 0
      for (let i = 0; i < positions.count; i += 4) {
        arm.mesh.getVertexPosition(i, p).applyMatrix4(arm.mesh.matrixWorld)
        assert.ok(p.z > -.1725, `${action}/${time}: sleeve crosses chair back`)
        if (positions.getY(i) >= .569) {
          arm.hand.root.worldToLocal(p); cuffSamples++
          assert.ok(p.y > -.008 && p.y < .010, `${action}/${time}: cuff separated from wrist`)
          assert.ok(Math.abs(p.x) < .031 && Math.abs(p.z) < .029)
        }
      }
      assert.ok(cuffSamples > 8, 'test must inspect actual deformed cuff vertices, not empty bone groups')
    }
  }
  dispose(human.root); material.dispose(); box.dispose()
})
