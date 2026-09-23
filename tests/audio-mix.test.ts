import test from 'node:test'
import assert from 'node:assert/strict'
import { PokerAudio } from '../src/audio'

test('synthetic device mix keeps gesture, independent levels, mute and teardown ownership',async()=>{
  let contexts=0,starts=0,stops=0,closed=0,fireStarts=0,fireStops=0
  const gains:{gain:{value:number;setTargetAtTime:(n:number)=>void}}[]=[]
  const node=()=>({connect(){},disconnect(){}})
  // Linear ramps collapse to their target: the fire bus fades with them (40 ms).
  const parameter=()=>({value:0,setTargetAtTime(n:number){this.value=n},setValueAtTime(){},cancelScheduledValues(){},linearRampToValueAtTime(n:number){this.value=n},exponentialRampToValueAtTime(){}})
  class Device {
    state='running';sampleRate=48000;currentTime=1;destination={}
    constructor(){contexts++}
    createGain(){const gain={...node(),gain:parameter()};gains.push(gain);return gain}
    createBuffer(_c:number,n:number){return {copyToChannel(pcm:Float32Array){assert.equal(n,pcm.length)}}}
    // The fire is the only LOOPING source; chip cues are one-shot. Counting by
    // `loop` keeps fire and effects accounting separate on one shared device.
    createBufferSource(){return {...node(),buffer:null,loop:false,onended:null,start(){if(this.loop)fireStarts++;else starts++},stop(){if(this.loop)fireStops++;else stops++}}}
    decodeAudioData(){const pcm=new Float32Array(480).fill(.01);return Promise.resolve({numberOfChannels:1,length:480,sampleRate:48000,duration:.01,getChannelData:()=>pcm})}
    createOscillator(){return {...node(),frequency:parameter(),type:'',onended:null,start(){starts++},stop(){stops++}}}
    resume(){return Promise.resolve()}
    close(){closed++;return Promise.resolve()}
  }
  const oldContext=globalThis.AudioContext
  globalThis.AudioContext=Device as unknown as typeof AudioContext
  try {
    // Any base64 payload: the fake device decodes it to a tiny looping bed.
    const audio=new PokerAudio('data:audio/mpeg;base64,AAAA')
    audio.setLevels(.5,.5);audio.setAmbienceActive(true);audio.play('chip')
    assert.equal(contexts,0);assert.equal(fireStarts,0,'preferences are not a gesture')
    audio.unlock();assert.equal(contexts,1);await new Promise(resolve=>setImmediate(resolve));assert.equal(fireStarts,1)
    // gains[0] is the effects master, gains[1] the fire's own ambience bus.
    assert.equal(gains[1].gain.value,.0225);assert.equal(gains[0].gain.value,.09)
    audio.play('chip');assert.equal(starts,1)
    audio.setLevels(0,1);assert.equal(gains[1].gain.value,0);assert.equal(fireStops,1,'Off fire preset stops the loop');assert.equal(gains[0].gain.value,.18)
    audio.setMuted(true);assert.equal(stops,1);assert.equal(gains[0].gain.value,0)
    audio.setLevels(1,.5);assert.equal(gains[0].gain.value,0,'levels cannot defeat master mute')
    audio.play('chip');assert.equal(starts,1)
    audio.setMuted(false);assert.equal(gains[0].gain.value,.09)
    audio.play('chip');audio.setAmbienceActive(false);assert.equal(stops,2,'pause cancels active impact')
    audio.setLevels(1,0);audio.play('chip');assert.equal(starts,2)
    audio.setLevels(NaN,Infinity);audio.play('chip');assert.equal(starts,2,'invalid levels leave preference untouched')
    audio.dispose();audio.dispose();audio.unlock();assert.equal(closed,1);assert.equal(contexts,1)
    await Promise.resolve()
  } finally {globalThis.AudioContext=oldContext}
})
