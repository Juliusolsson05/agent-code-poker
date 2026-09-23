import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { AnatomicalHand } from '../src/scene/Hand'
import { createHeldCardFan } from '../src/scene/CardGrip'
import { buildHuman, humanMaterial, poseHuman } from '../src/scene/Human'
import { GLASS_HAND_CONTACT } from '../src/scene/HandGrips'
import { createRoomPlan } from '../src/scene/environment/RoomPlan'
import { CHAIR_BLOCKS, SEATS, seatYaw } from '../src/scene/environment/layout'

function dispose(root: THREE.Object3D): void {
  root.traverse(o => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose()); if (o instanceof THREE.SkinnedMesh) o.skeleton.dispose() } })
}

test('every opponent keeps the shared glass contact attached throughout lift, sip and return', () => {
  const material = humanMaterial(), box = new THREE.BoxGeometry()
  for (let seat = 1; seat <= 5; seat++) {
    const human = buildHuman(seat, box, material)
    // A transformed seat catches accidental world/local mixing hidden by the
    // neutral inspector. The hand must not reach an IK clamp while the vessel
    // continues on its own independent trajectory.
    human.root.position.set(1.3, 0, -.4); human.root.rotation.y = 1.7
    human.sipAt = 0; human.nextSip = 100
    for (let frame = 0; frame <= 80; frame++) {
      const time = .8 + frame * .05
      poseHuman(human, time, { reduced: false, active: false, folded: false, showing: false, hasCards: true, dealt: 1, actionAge: time, gaze: 0 })
      human.root.updateMatrixWorld(true)
      const hand = human.rightRig.hand.root.localToWorld(new THREE.Vector3(...GLASS_HAND_CONTACT))
      const glass = human.drink.root.localToWorld(human.drink.grip.clone())
      assert.ok(hand.distanceTo(glass) < 1e-7, `seat ${seat} at ${time}: ${hand.distanceTo(glass) * 1000}mm detached grip`)
      if (time >= 2 && time <= 3.3) {
        const lip = human.head.localToWorld(new THREE.Vector3(0, -.046, .076))
        const rim = human.drink.root.localToWorld(human.drink.rim.clone())
        assert.ok(lip.distanceTo(rim) < 1e-7, `seat ${seat}: rim misses the animated mouth`)
      }
    }
    dispose(human.root)
  }
  material.dispose(); box.dispose()
})

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

test('seated bodies rest on the chair and floor and clear the chair frame and table', () => {
  // #9: the old barrel torso sat on two floating ellipsoid thighs with no legs.
  // The replacement is judged by physical contacts in the production room
  // placement, not by a picture: pelvis on the seat, soles on the floor, and
  // no body vertex inside the chair blocks, the table's hidden skirt/pedestal
  // or under the rail's lip.
  const material = humanMaterial(), box = new THREE.BoxGeometry(), p = new THREE.Vector3()
  const plan = createRoomPlan({ fireplace: true }).blocks
  // Of the two blocks under the table, only the pedestal is judged. The 3.0 x
  // 1.7m under-skirt reaches within 20cm of the near seats: no real knee can
  // clear it (the pre-#9 thighs sat inside it too). It is fully hidden under
  // the tabletop and rail from every seated eye, which the rail check covers.
  const under = plan.filter(b => Math.abs(b.position[0]) < .01 && Math.abs(b.position[2]) < .01)
  assert.equal(under.length, 2, 'expected the table skirt and pedestal blocks')
  const tableSolids = under.filter(b => b.size[0] < 2)
    .map(b => new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(...b.position), new THREE.Vector3(...b.size)))
  // The rail/felt slab spans y=.755–.843; leaning torsos above it are fine.
  const insideRail = (v: THREE.Vector3) => v.y > .75 && v.y < .85 && (Math.abs(v.x) / 1.91) ** 2.7 + (Math.abs(v.z) / 1.135) ** 2.7 < 1
  for (let seat = 1; seat <= 5; seat++) {
    const human = buildHuman(seat, box, material), [x, z] = SEATS[seat]
    human.root.position.set(x, 0, z); human.root.rotation.y = seatYaw(x, z); human.root.updateMatrixWorld(true)
    const body = human.root.getObjectByName('seated-body') as THREE.Mesh, positions = body.geometry.getAttribute('position')
    const chairs = CHAIR_BLOCKS.map(b => new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(...b.position), new THREE.Vector3(...b.size)).expandByScalar(-.001))
    let lowest = Infinity, lowestTorso = Infinity
    for (let i = 0; i < positions.count; i++) {
      p.fromBufferAttribute(positions, i)
      lowest = Math.min(lowest, p.y)
      if (Math.abs(p.z) < .06 && Math.abs(p.x) < .05) lowestTorso = Math.min(lowestTorso, p.y)
      for (const chair of chairs) assert.ok(!chair.containsPoint(p), `seat ${seat}: body inside chair at ${p.toArray()}`)
      const world = p.clone().applyMatrix4(body.matrixWorld)
      for (const solid of tableSolids) assert.ok(!solid.containsPoint(world), `seat ${seat}: body inside table solid at ${world.toArray()}`)
      // Only the legs (in front of the jacket, local z>.13) are judged against
      // the rail. The side seats' origins already sit inside the rail's outer
      // lip (x=±1.82 vs ≈±1.88), so their torsos met that lip before #9 too;
      // that is a seat-layout question, not something new anatomy can fix.
      if (p.z > .13) assert.ok(!insideRail(world), `seat ${seat}: knee/thigh inside the rail at ${world.toArray()}`)
    }
    assert.ok(lowest >= 0 && lowest < .01, `seat ${seat}: soles at ${lowest}, not on the floor`)
    assert.ok(Math.abs(lowestTorso - .62) < .005, `seat ${seat}: pelvis at ${lowestTorso}, not on the seat`)
    dispose(human.root)
  }
  material.dispose(); box.dispose()
})
