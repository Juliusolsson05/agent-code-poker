import test from 'node:test'
import assert from 'node:assert/strict'
import { PokerAudio } from '../src/audio'

test('synthetic device mix keeps gesture, independent levels, mute and teardown ownership',async()=>{
  let contexts=0,starts=0,stops=0,closed=0,fireStarts=0
  const gains:{gain:{value:number;setTargetAtTime:(n:number)=>void}}[]=[]
  const node=()=>({connect(){},disconnect(){}})
  const parameter=()=>({value:0,setTargetAtTime(n:number){this.value=n},setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}})
  class Device {
    state='running';sampleRate=48000;currentTime=1;destination={}
    constructor(){contexts++}
    createGain(){const gain={...node(),gain:parameter()};gains.push(gain);return gain}
    createBuffer(_c:number,n:number){return {copyToChannel(pcm:Float32Array){assert.equal(n,pcm.length)}}}
    createBufferSource(){return {...node(),buffer:null,onended:null,start(){starts++},stop(){stops++}}}
    createOscillator(){return {...node(),frequency:parameter(),type:'',onended:null,start(){starts++},stop(){stops++}}}
    resume(){return Promise.resolve()}
    close(){closed++;return Promise.resolve()}
  }
  const media={volume:0,play(){fireStarts++;return Promise.resolve()},pause(){},removeAttribute(){},load(){}}
  const oldContext=globalThis.AudioContext,oldAudio=globalThis.Audio
  globalThis.AudioContext=Device as unknown as typeof AudioContext
  globalThis.Audio=class {constructor(){return media}} as unknown as typeof Audio
  try {
    const audio=new PokerAudio('bundled-test-only')
    audio.setLevels(.5,.5);audio.setAmbienceActive(true);audio.play('chip')
    assert.equal(contexts,0);assert.equal(fireStarts,0,'preferences are not a gesture')
    audio.unlock();assert.equal(contexts,1);assert.equal(fireStarts,1)
    assert.equal(media.volume,.0225);assert.equal(gains[0].gain.value,.09)
    audio.play('chip');assert.equal(starts,1)
    audio.setLevels(0,1);assert.equal(media.volume,0);assert.equal(gains[0].gain.value,.18)
    audio.setMuted(true);assert.equal(stops,1);assert.equal(gains[0].gain.value,0)
    audio.setLevels(1,.5);assert.equal(gains[0].gain.value,0,'levels cannot defeat master mute')
    audio.play('chip');assert.equal(starts,1)
    audio.setMuted(false);assert.equal(gains[0].gain.value,.09)
    audio.play('chip');audio.setAmbienceActive(false);assert.equal(stops,2,'pause cancels active impact')
    audio.setLevels(1,0);audio.play('chip');assert.equal(starts,2)
    audio.setLevels(NaN,Infinity);audio.play('chip');assert.equal(starts,2,'invalid levels leave preference untouched')
    audio.dispose();audio.dispose();audio.unlock();assert.equal(closed,1);assert.equal(contexts,1)
    await Promise.resolve()
  } finally {globalThis.AudioContext=oldContext;globalThis.Audio=oldAudio}
})
