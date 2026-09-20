import test from 'node:test'
import assert from 'node:assert/strict'
import { InteractionDirector } from '../src/scene/InteractionDirector'
import { DrinkWarmth } from '../src/interaction/drinking/DrinkWarmth'
import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { createHash } from 'node:crypto'

// Synthetic boundary samples through the production owner, not recorded motion.
test('player receipts occur after the sip interval, once, with the consumed drink identity',()=>{
  const d=new InteractionDirector();d.setActive(true,0)
  assert.equal(d.orderDrink('wine',0),true);assert.equal(d.takeCompletedSip(),null)
  assert.equal(d.begin('drink',0),true)
  for(const t of [0,1,2.1,2.99]){d.sample(t);assert.equal(d.takeCompletedSip(),null)}
  d.sample(3);assert.deepEqual(d.takeCompletedSip(),{id:1,kind:'wine',actor:'player'})
  d.sample(3);d.sample(5.35);assert.equal(d.takeCompletedSip(),null)
  d.orderDrink('water',6);d.begin('drink',6);d.sample(12)
  assert.deepEqual(d.takeCompletedSip(),{id:2,kind:'water',actor:'player'},'skipped frame still has one completion')
  assert.equal(d.takeCompletedSip(),null)
})
test('ordering, smoke, paused clock and interrupted pre-sip reaches never count',()=>{
  const d=new InteractionDirector();d.setActive(true,0)
  d.begin('smoke',0);d.sample(6);assert.equal(d.takeCompletedSip(),null)
  d.begin('drink',6);d.sample(8)
  for(let i=0;i<30;i++)d.sample(8)
  assert.equal(d.takeCompletedSip(),null)
  d.inspect(true,8);d.sample(20);assert.equal(d.takeCompletedSip(),null)
  d.inspect(false,20);d.begin('drink',20);d.setActive(false,22);d.sample(40)
  assert.equal(d.takeCompletedSip(),null)
})
test('sip completed before an inspection return counts once, never again on resume',()=>{
  const d=new InteractionDirector();d.setActive(true,0);d.begin('drink',0)
  d.inspect(true,3.01)
  assert.deepEqual(d.takeCompletedSip(),{id:1,kind:'old-fashioned',actor:'player'})
  d.sample(9);d.inspect(false,9);assert.equal(d.takeCompletedSip(),null)
})
test('cosmetic warmth ignores water/duplicates, caps, decays on active time and clears when off',()=>{
  const w=new DrinkWarmth();w.setLevel('soft')
  w.accept({id:1,actor:'player',kind:'water'});assert.equal(w.opacity,0)
  w.accept({id:2,actor:'player',kind:'old-fashioned'});const one=w.opacity
  assert.ok(one>0);w.accept({id:2,actor:'player',kind:'old-fashioned'});assert.equal(w.opacity,one)
  for(let id=3;id<100;id++)w.accept({id,actor:'player',kind:'beer'})
  assert.equal(w.opacity,.18)
  w.advance(0);assert.equal(w.opacity,.18)
  w.advance(300);assert.ok(Math.abs(w.opacity-.09)<1e-8)
  w.advance(300);assert.equal(w.opacity,0)
  w.accept({id:100,actor:'player',kind:'wine'});w.setLevel('off');assert.equal(w.opacity,0)
  w.accept({id:101,actor:'player',kind:'wine'});w.setLevel('subtle');assert.equal(w.opacity,0)
  w.accept({id:102,actor:'player',kind:'wine'});assert.equal(w.opacity,one/2)
  w.reset();assert.equal(w.opacity,0)
})

test('actual source wine/water receipts replay with one dose and no order-triggered exposure',()=>{
  const bytes=gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T10-19-46-200Z.json.gz',import.meta.url)))
  assert.equal(createHash('sha256').update(bytes).digest('hex'),'b62901f4f2f39766f685a45a3352f1b0f22ff4c19ccfc7cfad5dd59d881747ee')
  const trace=JSON.parse(bytes.toString())
  // Preserve, never sort, this negative-control recording. Both reversals are
  // the new intra-frame receipt followed by the older frame-start timestamp.
  const backwards=trace.entries.filter((e:any,i:number)=>i>0&&e.wallMs<trace.entries[i-1].wallMs)
  assert.equal(backwards.length,2);assert.ok(backwards.every((e:any)=>e.kind==='frame'))
  const director=new InteractionDirector(),warmth=new DrinkWarmth();warmth.setLevel('subtle')
  let previous=0,count=0
  for(const e of trace.entries) {
    warmth.advance(Math.max(0,e.visualSeconds-previous));previous=e.visualSeconds
    if(e.kind==='playing')director.setActive(e.data.playing,e.visualSeconds)
    if(e.kind==='drink')assert.equal(director.begin('drink',e.visualSeconds),e.data.accepted)
    if(e.kind==='order-drink')assert.equal(director.orderDrink(e.data.kind,e.visualSeconds),e.data.accepted)
    if(e.kind==='inspection')director.inspect(e.data.active,e.visualSeconds)
    if(e.kind==='drink-effect-setting')warmth.setLevel(e.data.level)
    if(e.kind==='completed-player-sip') {
      director.sample(e.visualSeconds)
      const receipt=director.takeCompletedSip()
      assert.deepEqual(receipt,{id:e.data.id,actor:'player',kind:e.data.kind})
      warmth.accept(receipt!);assert.ok(Math.abs(warmth.opacity-e.data.opacity)<1e-7)
      assert.equal(director.takeCompletedSip(),null);count++
    }
  }
  assert.equal(count,2);assert.equal(warmth.opacity,0)
})
