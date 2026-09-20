import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { BoxGeometry, Euler, Matrix4, Quaternion } from 'three'
import { buildHuman, humanMaterial, poseHuman } from '../src/scene/Human'
import { AnatomicalHand } from '../src/scene/Hand'
import { GLASS_HAND_ROTATION } from '../src/scene/HandGrips'
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
