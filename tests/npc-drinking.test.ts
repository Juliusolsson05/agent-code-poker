import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { BoxGeometry, Euler, Matrix4, Quaternion, SkinnedMesh, Vector3 } from 'three'
import { buildHuman, humanMaterial, poseHuman } from '../src/scene/Human'
import { AnatomicalHand } from '../src/scene/Hand'
import { GLASS_HAND_CONTACT, GLASS_HAND_ROTATION } from '../src/scene/HandGrips'
import { DRINKS } from '../src/scene/props/specs'
import { skinVesselGap } from '../testing/skin-vessel'

const trace=JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T10-29-18-052Z.json.gz',import.meta.url))).toString())
const recorded=trace.entries.find((e:any)=>e.kind==='pose'&&Math.abs(e.visualSeconds-13.177300000004498)<1e-7).data.people.find((p:any)=>p.seat===1)

test('recorded NPC transition reconstructs penetrating skin despite an eventual safe grip',()=>{
  const rest=new Quaternion().setFromEuler(new Euler(Math.PI/2,0,-.12))
  const glass=new Matrix4().fromArray(recorded.drink.local),wrist=new Matrix4().fromArray(recorded.rightHand.local)
  const held=new Quaternion().setFromRotationMatrix(glass).multiply(new Quaternion(...GLASS_HAND_ROTATION))
  const actual=new Quaternion().setFromRotationMatrix(wrist),blend=rest.angleTo(actual)/rest.angleTo(held)
  assert.ok(rest.clone().slerp(held,blend).angleTo(actual)<1e-5)
  assert.ok(Math.abs(blend-.4126504032462785)<1e-8)
  const hand=new AnatomicalHand('right','#ae8165',.0025)
  hand.pose('rest');hand.pose('glass',blend)
  assert.ok(skinVesselGap(hand,glass.clone().invert().multiply(wrist),DRINKS.beer.radius,DRINKS.beer.height)<-.014)
  const resting=trace.entries.find((e:any)=>e.kind==='pose').data.people.find((p:any)=>p.seat===1)
  hand.pose('rest')
  const restTransform=new Matrix4().fromArray(resting.drink.local).invert().multiply(new Matrix4().fromArray(resting.rightHand.local))
  assert.ok(skinVesselGap(hand,restTransform,DRINKS.beer.radius,DRINKS.beer.height)<-.007,
    'the recorded initial resting wrist is itself an intersecting negative control')
})

test('NPC acquisition and release keep actual skin outside finite glasses without changing held contacts',()=>{
  // These dense times are explicit synthetic probes of the observed transition
  // class, not fabricated browser frames. Existing anatomy tests independently
  // require exact grip/mouth contact over the unchanged held interval.
  for(const seat of [1,2,3,4,5]){
    const h=buildHuman(seat,new BoxGeometry(),humanMaterial())
    h.root.position.set(1.3,0,-.4);h.root.rotation.y=1.7
    h.sipAt=0;h.nextSip=100
    for(const time of [...Array.from({length:41},(_,i)=>i*.02),...Array.from({length:61},(_,i)=>4.8+i*.02)]){
      poseHuman(h,time,{reduced:false,active:false,folded:false,showing:false,hasCards:true,dealt:1,actionAge:time,gaze:0})
      h.root.updateMatrixWorld(true)
      const transform=h.drink.root.matrixWorld.clone().invert().multiply(h.rightRig.hand.root.matrixWorld)
      const spec=DRINKS[h.drink.kind],gap=skinVesselGap(h.rightRig.hand,transform,spec.radius,spec.height)
      assert.ok(gap>=Math.SQRT2*.001,`seat${seat} time${time}: skin/vessel gap ${gap*1000}mm`)
      assert.ok(h.drinkContact!.reachError<1e-7,`seat${seat} time${time}: route cannot rely on IK clamping`)
      assert.ok(h.drink.root.position.distanceTo(h.drinkHome)<1e-8,'coaster owns vessel during acquisition/release')
    }
  }
})

test('NPC contact route is isolated from player ownership, camera and poker state',()=>{
  const root=new URL('../src/',import.meta.url)
  const consumers=readdirSync(root,{recursive:true}).filter(p=>/\.tsx?$/.test(String(p)))
    .filter(p=>readFileSync(new URL(String(p),root),'utf8').includes("from '../interaction/npc/GlassApproach'"))
  assert.deepEqual(consumers,['scene/Human.ts'])
  const core=readFileSync(new URL('interaction/npc/GlassApproach.ts',root),'utf8')
  assert.doesNotMatch(core,/from ['"](?!three['"])/)
  assert.doesNotMatch(core,/\b(?:document|window|performance|requestAnimationFrame)\b/)
})

test('actual candidate pickup/release matrices reconstruct exterior skin on all recorded seats',()=>{
  // Unlike the earlier synthetic time sweep, these wrist/vessel/grip samples
  // came from real browser motion. Skin is still reconstructed from production
  // geometry: this is not a captured-vertex or perceptual animation assertion.
  const actual=JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T14-00-40-788Z.json.gz',import.meta.url))).toString())
  const hand=new AnatomicalHand('right','#ae8165',.0025),seats=new Set<number>()
  let samples=0
  for(const entry of actual.entries.filter((e:any)=>e.kind==='pose'))for(const p of entry.data.people){
    if(!['clear','form','approach'].includes(p.drinkContact.phase))continue
    hand.pose('rest');hand.pose('glass',p.drinkContact.grip)
    const spec=DRINKS[p.seat===1||p.seat===5?'beer':p.seat===2?'wine':p.seat===3?'water':'old-fashioned']
    const transform=new Matrix4().fromArray(p.drink.world).invert().multiply(new Matrix4().fromArray(p.rightHand.world))
    const gap=skinVesselGap(hand,transform,spec.radius,spec.height)
    assert.ok(gap>=Math.SQRT2*.001,`recorded seat${p.seat} at${entry.visualSeconds}: ${gap*1000}mm`)
    assert.ok(p.drinkContact.reachError<1e-7)
    seats.add(p.seat);samples++
  }
  assert.equal(samples,222);assert.equal(seats.size,5)
})

test('opponents grip the outer face of their glass, not the side toward their own chest',()=>{
  // Regression for #7. The drinking arm hangs from the +X shoulder and the
  // glass stands at +X, so a natural hold puts the palm on the vessel's +X
  // (outer) face with the wrist nearer the body. The old π turn about Y put the
  // palm on the -X face, making the forearm reach across the chest.
  for(const seat of [1,2,3,4,5]){
    const h=buildHuman(seat,new BoxGeometry(),humanMaterial())
    h.sipAt=0;h.nextSip=100
    for(const time of [.8,1.2,2,2.6,3.3,4.2,4.8]){
      poseHuman(h,time,{reduced:false,active:false,folded:false,showing:false,hasCards:true,dealt:1,actionAge:time,gaze:0})
      h.root.updateMatrixWorld(true)
      const toVessel=h.drink.root.matrixWorld.clone().invert()
      const palm=new Vector3(...GLASS_HAND_CONTACT).applyMatrix4(h.rightRig.hand.root.matrixWorld).applyMatrix4(toVessel)
      const wrist=h.rightRig.hand.root.getWorldPosition(new Vector3()).applyMatrix4(toVessel)
      assert.ok(palm.x>DRINKS[h.drink.kind].radius*.9,`seat${seat} t${time}: palm on the inner face (${palm.x.toFixed(3)})`)
      assert.ok(wrist.z<0,`seat${seat} t${time}: wrist on the far side of the glass`)
      // The flipped wrap must not push fingers under the vessel base, which
      // stands on felt while the hand closes around it.
      if(time<=.8||time>=4.8)assert.ok(lowestSkinY(h)>-.001,`seat${seat} t${time}: fingers under the glass base`)
    }
  }
})

function lowestSkinY(h:ReturnType<typeof buildHuman>):number{
  const mesh=h.rightRig.hand.root.getObjectByName('articulated-hand-surface') as SkinnedMesh
  const toVessel=h.drink.root.matrixWorld.clone().invert(),p=new Vector3()
  let lowest=Infinity
  for(let i=0;i<mesh.geometry.getAttribute('position').count;i++){
    mesh.getVertexPosition(i,p).applyMatrix4(mesh.matrixWorld).applyMatrix4(toVessel)
    // Only skin within the vessel's footprint could sit on/under its base.
    if(Math.hypot(p.x,p.z)<DRINKS[h.drink.kind].radius+.02)lowest=Math.min(lowest,p.y)
  }
  return lowest
}
