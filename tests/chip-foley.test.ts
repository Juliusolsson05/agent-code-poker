import test from 'node:test'
import assert from 'node:assert/strict'
import { ChipFoley, chipSamples } from '../src/audio/ChipFoley'

test('synthetic authored impacts have bounded PCM, finite peaks and click-free edges',()=>{
  const variants=[0,1,2].map(v=>chipSamples(48000,v))
  for(const pcm of variants){
    assert.ok(pcm.length<=48000*.2)
    assert.equal(pcm[0],0);assert.equal(pcm.at(-1),0)
    assert.ok(pcm.every(n=>Number.isFinite(n)&&Math.abs(n)<=.8))
    const energy=pcm.reduce((sum,v)=>sum+v*v,0)/pcm.length
    assert.ok(energy>.0001&&energy<.05,'an audible bounded impact, not silence or a full-scale sustained tone')
  }
  assert.notDeepEqual(variants[0],variants[1]);assert.notDeepEqual(variants[1],variants[2])
})

test('synthetic device caches buffers, caps voices, releases nodes and never plays after disposal',()=>{
  let buffers=0,starts=0,stops=0,disconnects=0
  const sources:{onended:null|(()=>void);connect:()=>void;disconnect:()=>void;start:()=>void;stop:()=>void;buffer:unknown}[]=[]
  const context={sampleRate:48000,currentTime:0,createBuffer(_channels:number,length:number){buffers++;return {copyToChannel(pcm:Float32Array){assert.equal(pcm.length,length)}}},
    createBufferSource(){const source={buffer:null as unknown,onended:null as null|(()=>void),connect(){},disconnect(){disconnects++},start(){starts++},stop(){stops++}};sources.push(source);return source}}
  const foley=new ChipFoley(context as unknown as AudioContext,{} as AudioNode)
  for(let i=0;i<30;i++)foley.play()
  assert.equal(buffers,3);assert.equal(starts,30);assert.equal(stops,24)
  assert.equal(disconnects,24)
  sources.at(-1)!.onended!();assert.equal(disconnects,25)
  foley.stop();assert.equal(disconnects,30)
  foley.play();assert.equal(buffers,3);assert.equal(starts,31)
  foley.dispose();assert.equal(disconnects,31)
  foley.play();assert.equal(starts,31)
})
