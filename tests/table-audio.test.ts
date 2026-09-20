import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { TableSounds, type PublicSoundFrame } from '../src/audio/events/TableSounds'

// Real public state, unchanged and in recorded order. This older recorder did
// not include revision/board length: ordinal revision below is explicitly a
// synthetic delivery envelope, not claimed captured network data.
const raw=JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T05-52-49-020Z.json.gz',import.meta.url))).toString())
const frames:PublicSoundFrame[]=raw.entries.filter((e:{kind:string})=>e.kind==='public-game').map((e:{data:PublicSoundFrame})=>e.data)

test('recorded folds and checks do not masquerade as moving chips',()=>{
  assert.equal(frames.length,9)
  const sounds=new TableSounds()
  assert.deepEqual(frames.map((frame,i)=>sounds.observe(i,frame,true,0)),[
    [],['fold'],['fold'],['fold'],['chip'],['chip'],[],['check'],['check','turn'],
  ])
})

test('synthetic transport duplicate, stale, gap, pause and reset never replay old actions',()=>{
  const sounds=new TableSounds()
  sounds.observe(0,frames[0],true,0)
  assert.deepEqual(sounds.observe(1,frames[1],true,0),['fold'])
  assert.deepEqual(sounds.observe(1,frames[1],true,0),[])
  assert.deepEqual(sounds.observe(0,frames[0],true,0),[])
  assert.deepEqual(sounds.observe(3,frames[3],true,0),[],'missed revisions are snapshots, not an action backlog')
  assert.deepEqual(sounds.observe(4,frames[4],false,0),[])
  assert.deepEqual(sounds.observe(4,frames[4],true,0),[],'resume cannot replay paused wager')
  assert.deepEqual(sounds.observe(5,frames[5],true,0),['chip'])
  sounds.reset()
  assert.deepEqual(sounds.observe(6,frames[6],true,0),[])
})

test('synthetic street/deal/completion edges differ from completed-hand bank movements',()=>{
  const sounds=new TableSounds(),frame=structuredClone(frames[0])
  frame.boardCount=0
  sounds.observe(10,frame,true,0)
  const flop={...frame,boardCount:3,actor:0}
  assert.deepEqual(sounds.observe(11,flop,true,0),['card','turn'])
  const complete={...flop,phase:'complete',actor:null}
  assert.deepEqual(sounds.observe(12,complete,true,0),['win'])
  const rebuy=structuredClone(complete);rebuy.players[0].stack+=2000
  assert.deepEqual(sounds.observe(13,rebuy,true,0),[])
  assert.deepEqual(sounds.observe(14,{...frame,hand:frame.hand+1},true,0),['card'])
})

test('audio reconciliation has exactly one production consumer, no engine/card imports',()=>{
  const root=new URL('../src/',import.meta.url)
  const consumers=readdirSync(root,{recursive:true}).filter(f=>/\.(ts|tsx)$/.test(String(f)))
    .filter(f=>readFileSync(new URL(String(f),root),'utf8').includes("from './audio/events/TableSounds'"))
  assert.deepEqual(consumers,['audio.ts'])
  const isolated=readFileSync(new URL('../src/audio/events/TableSounds.ts',import.meta.url),'utf8')
  assert.doesNotMatch(isolated,/^import /m)
})

test('actual browser mix trace has no submitted effects during the effects-off interval',()=>{
  const trace=JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T14-00-40-788Z.json.gz',import.meta.url))).toString())
  let effects=1,offActions=0,chipCues=0,foldCues=0,previous=-Infinity
  for(const event of trace.entries){
    assert.ok(event.visualSeconds>=previous);previous=event.visualSeconds
    if(event.kind==='audio'){
      if(event.data.effects!==undefined)effects=event.data.effects
      if(event.data.cue){
        assert.ok(effects>0,'muted effects cannot submit a cue')
        if(event.data.cue==='chip')chipCues++
        if(event.data.cue==='fold')foldCues++
      }
    }
    if(event.kind==='public-game'&&effects===0)offActions++
  }
  assert.ok(offActions>=5,'actual poker continued during effects Off')
  assert.ok(chipCues>=5);assert.equal(foldCues,3)
})
