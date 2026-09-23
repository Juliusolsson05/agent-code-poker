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

test('chat voices: spatial at the speaker, one voice per speaker, silenced by master mute but not by the effects level',async()=>{
  const log:string[]=[]
  const parameter=()=>({value:0,setTargetAtTime(n:number){this.value=n},setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}})
  let decodeFails=false
  class Device {
    state='running';currentTime=1;destination={name:'destination'}
    listener={positionX:parameter(),positionY:parameter(),positionZ:parameter(),forwardX:parameter(),forwardY:parameter(),forwardZ:parameter(),upX:parameter(),upY:parameter(),upZ:parameter()}
    createGain(){return {connect(){},disconnect(){},gain:parameter()}}
    createPanner(){const p={panningModel:'',distanceModel:'',refDistance:0,maxDistance:0,rolloffFactor:0,positionX:parameter(),positionY:parameter(),positionZ:parameter(),
      connect(){},disconnect(){log.push('panner-off')}};log.push('panner');return p}
    createBufferSource(){const s={buffer:null as unknown,onended:null as null|(()=>void),connect(target:{panningModel?:string}){log.push(target.panningModel!==undefined?'to-panner':'to-bus')},
      disconnect(){},start(){log.push('start')},stop(){log.push('stop')}};return s}
    decodeAudioData(buffer:ArrayBuffer){log.push(`decode:${buffer.byteLength}`);return decodeFails?Promise.reject(new Error('bad')):Promise.resolve({duration:1})}
    createOscillator(){throw new Error('unused')}
    resume(){return Promise.resolve()}
    close(){return Promise.resolve()}
  }
  const oldContext=globalThis.AudioContext
  globalThis.AudioContext=Device as unknown as typeof AudioContext
  try {
    const audio=new PokerAudio(),clip=new Uint8Array([0xff,0xf3,0x40,0xc4])
    assert.equal(await audio.playVoice(clip,2,[1,1.45,-1]),false,'no context before a gesture: autoplay policy')
    audio.unlock();audio.setListenerMatrix([1,0,0,0,0,1,0,0,0,0,1,0,0,1.2,1.7,1])
    assert.equal(await audio.playVoice(clip,2,[1,1.45,-1]),true)
    assert.deepEqual(log,['decode:4','panner','to-panner','start'])
    assert.equal(clip[0],0xff,'the caller\'s bytes are not detached by decodeAudioData')
    log.length=0;assert.equal(await audio.playVoice(clip,2,[1,1.45,-1]),true)
    assert.deepEqual(log,['decode:4','stop','panner-off','panner','to-panner','start'],'a newer line from the same speaker replaces the older one')
    log.length=0;assert.equal(await audio.playVoice(clip,0,null),true);assert.deepEqual(log,['decode:4','to-bus','start'],'own voice is in-head')
    audio.setLevels(1,0);log.length=0;assert.equal(await audio.playVoice(clip,3,null),true,'effects Off does not silence friends')
    log.length=0;audio.setMuted(true);assert.deepEqual(log.filter(e=>e==='stop').length,3,'mute stops every playing voice')
    assert.equal(await audio.playVoice(clip,4,null),false)
    audio.setMuted(false);decodeFails=true;assert.equal(await audio.playVoice(clip,4,null),false,'undecodable bytes fall back to the bubble')
    audio.dispose()
  } finally {globalThis.AudioContext=oldContext}
})
