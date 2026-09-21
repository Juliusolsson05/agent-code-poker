import test from 'node:test'
import assert from 'node:assert/strict'
import { PokerGame, type Action } from '../src/engine/game'
import { restoreSoloSave, soloCheckpoint, transferSoloBank, soloBankOffer } from '../src/solo/table'
import recorded from '../testing/fixtures/experience/bank-bust-scripted.json'
import { readdirSync, readFileSync } from 'node:fs'

// Deterministic engine replay, NOT a browser bust or storage-failure recording.
function legacyBust() {
  const game=new PokerGame(()=>.37);game.startHand()
  for(const e of recorded.events)game.act(e.seat,e.action as Action)
  while(game.snapshot().phase!=='complete')game.advance()
  return {table:game.snapshot(),muted:true,speed:'brisk' as const}
}
test('solo legacy migration preserves the completed hand and stages a joint rebuy',()=>{
  const legacy=legacyBust(), restored=restoreSoloSave(legacy)
  assert.deepEqual(restored.game!.snapshot(),legacy.table)
  assert.equal(soloBankOffer(restored.game!,restored.bank!).debt,0)
  const next=transferSoloBank(restored.game!,restored.bank!,{type:'borrow'},legacy.table.revision)
  assert.equal(next.game.snapshot().players[0].stack,2000)
  assert.equal(soloBankOffer(next.game,next.bank).debt,2000)
  assert.deepEqual(restored.game!.snapshot(),legacy.table,'proposal does not mutate live engine')
  assert.deepEqual(next.game.snapshot().history,legacy.table.history,'loan is not poker winnings')
  const saved=soloCheckpoint(next.game.snapshot(),next.bank,legacy)
  const reopened=restoreSoloSave(JSON.parse(JSON.stringify(saved)))
  assert.equal(soloBankOffer(reopened.game!,reopened.bank!).debt,2000)
  assert.equal(reopened.muted,true);assert.equal(reopened.speed,'brisk')
  reopened.game!.startHand()
  assert.equal(reopened.game!.snapshot().players[0].hole.length,2)
})
test('solo stale, duplicate and mid-hand bank proposals cannot change either ledger',()=>{
  const {game,bank}=restoreSoloSave(legacyBust()), revision=game!.snapshot().revision
  assert.throws(()=>transferSoloBank(game!,bank!,{type:'borrow'},revision-1),/changed/)
  const loan=transferSoloBank(game!,bank!,{type:'borrow'},revision), before=loan.game.snapshot()
  assert.throws(()=>transferSoloBank(loan.game,loan.bank,{type:'borrow'},revision),/changed/)
  assert.throws(()=>transferSoloBank(loan.game,loan.bank,{type:'borrow'},before.revision),/busted/)
  assert.deepEqual(loan.game.snapshot(),before)
  const repaid=transferSoloBank(loan.game,loan.bank,{type:'repay',amount:500},before.revision)
  assert.equal(repaid.game.snapshot().players[0].stack,1500)
  assert.equal(soloBankOffer(repaid.game,repaid.bank).debt,1500)
  repaid.game.startHand()
  assert.equal(soloBankOffer(repaid.game,repaid.bank).repayMax,0)
  assert.throws(()=>transferSoloBank(repaid.game,repaid.bank,{type:'repay',amount:500},repaid.game.snapshot().revision),/between hands/)
})
test('solo new-format checkpoints fail closed rather than silently erase debt',()=>{
  const legacy=legacyBust(), {game,bank}=restoreSoloSave(legacy)
  const next=transferSoloBank(game!,bank!,{type:'borrow'},game!.snapshot().revision)
  const saved=soloCheckpoint(next.game.snapshot(),next.bank,legacy)
  for(const invalid of [
    {...saved,bank:undefined},{...saved,bank:null},{...saved,version:3},
    {...saved,bank:{...saved.bank,accounts:[]}}, {...saved,table:null},
    {...saved,bank:{...saved.bank,accounts:[{id:'other-player',debt:2000}]}},
    {...legacy,bank:null}, {...legacy,version:undefined},
  ]) assert.throws(()=>restoreSoloSave(invalid))
  assert.deepEqual(restoreSoloSave({table:null,muted:false,speed:'relaxed'}),{game:null,bank:null,muted:false,speed:'relaxed'})
})
test('synthetic failed storage can retry identical joint checkpoint without issuing chips again',async()=>{
  const legacy=legacyBust(), {game,bank}=restoreSoloSave(legacy)
  const next=transferSoloBank(game!,bank!,{type:'borrow'},game!.snapshot().revision)
  const pending=soloCheckpoint(next.game.snapshot(),next.bank,legacy)
  let disk:unknown=legacy, fail=true
  const write=async(value:unknown)=>{if(fail)throw new Error('disk full');disk=structuredClone(value)}
  await assert.rejects(write(pending));assert.deepEqual(disk,legacy)
  fail=false;await write(pending);await write(pending)
  const restored=restoreSoloSave(disk)
  assert.equal(restored.game!.snapshot().initialTotal,14000)
  assert.equal(soloBankOffer(restored.game!,restored.bank!).debt,2000)
})

test('only solo and host authorities consume the private bank ledger',()=>{
  const root=new URL('../src/',import.meta.url)
  const consumers=readdirSync(root,{recursive:true}).map(String).filter(f=>/\.(ts|tsx)$/.test(f))
    .filter(f=>/from ['"].*bank\/PracticeBank['"]/.test(readFileSync(new URL(f,root),'utf8'))).sort()
  assert.deepEqual(consumers,['session/HostTable.ts','solo/table.ts'])
})
