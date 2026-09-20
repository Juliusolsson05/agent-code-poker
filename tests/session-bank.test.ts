import test from 'node:test'
import assert from 'node:assert/strict'
import { HostTable } from '../src/session/HostTable'
import recording from '../testing/fixtures/experience/bank-bust-scripted.json'

const id=(seat:number)=>`bank-seat-${seat}`
function bustTable() {
  const table=new HostTable({id:id(0),name:'Host'},{random:()=>.37})
  for(let i=1;i<6;i++)table.join(id(i),`Guest ${i}`)
  table.start(id(0),table.view(id(0)).revision)
  for(const e of recording.events){const v=table.view(id(e.seat));assert.equal(table.act(id(e.seat),{sequence:v.self.nextSequence,revision:v.revision,action:e.action}).code,'accepted')}
  while(table.view(id(0)).phase!=='complete')table.tick(table.view(id(0)).revision)
  return table
}
const intent=(table:HostTable,seat:number,action:object)=>{const v=table.view(id(seat));return {sequence:v.self.nextSequence,revision:v.revision,action}}

test('host rebuy and partial repayment share wager sequence protection and survive private restore',()=>{
  let table=bustTable()
  assert.equal(table.view(id(0)).self.bank.canBorrow,true)
  const borrow=intent(table,0,{type:'borrow'})
  assert.equal(table.act(id(0),borrow).code,'accepted')
  assert.equal(table.view(id(0)).self.bank.debt,2000)
  assert.equal(table.view(id(0)).players[0].stack,2000)
  assert.equal(table.act(id(0),borrow).code,'duplicate')
  assert.equal(table.act(id(0),{...borrow,action:{type:'repay',amount:1}}).code,'sequence-conflict')
  table=HostTable.restoreHostCheckpoint(table.exportHostCheckpoint());table.reconnect(id(0))
  assert.equal(table.act(id(0),borrow).code,'duplicate')
  const repay=intent(table,0,{type:'repay',amount:700})
  assert.equal(table.act(id(0),repay).code,'accepted')
  const v=table.view(id(0))
  assert.equal(v.players[0].stack,1300);assert.equal(v.self.bank.debt,1300)
  assert.equal(table.act(id(0),repay).code,'duplicate')
  assert.equal(JSON.stringify(v).includes('accounts'),false)
  assert.equal(JSON.stringify(v).includes(id(0)),false,'private principal IDs never become bank UI fields')
})

test('bank commands cannot fund live hands, forge identity or partially repay without enough chips',()=>{
  const table=bustTable(), before=table.view(id(0))
  assert.equal(table.act(id(0),{...intent(table,0,{type:'borrow'}),seat:1}).code,'invalid')
  assert.equal(table.act(id(0),intent(table,0,{type:'repay',amount:1})).code,'illegal')
  assert.equal(table.act(id(3),intent(table,3,{type:'borrow'})).code,'illegal')
  assert.deepEqual(table.view(id(0)),before)
  table.act(id(0),intent(table,0,{type:'borrow'}));table.start(id(0),table.view(id(0)).revision)
  const live=table.view(id(0))
  assert.equal(table.act(id(0),intent(table,0,{type:'repay',amount:100})).code,'illegal')
  assert.deepEqual(table.view(id(0)),live)
  assert.equal(live.self.bank.canBorrow,false);assert.equal(live.self.bank.repayMax,0)
})

test('legacy no-bank checkpoints migrate without changing chips and corrupt bank equations fail closed',()=>{
  const table=bustTable(), legacy:any=table.exportHostCheckpoint()
  legacy.version=1;delete legacy.bank
  const restored=HostTable.restoreHostCheckpoint(legacy);restored.reconnect(id(0))
  assert.equal(restored.view(id(0)).self.bank.debt,0)
  assert.deepEqual(restored.view(id(0)).players.map(p=>p.stack),table.view(id(0)).players.map(p=>p.stack))
  const corrupt=table.exportHostCheckpoint();corrupt.bank.reserve--
  assert.throws(()=>HostTable.restoreHostCheckpoint(corrupt),/checkpoint/)
})

test('departing debt is archived by identity and a new occupant does not inherit it',()=>{
  const table=bustTable()
  table.act(id(1),intent(table,1,{type:'borrow'}));table.leave(id(1))
  table.start(id(0),table.view(id(0)).revision)
  table.join('replacement','Replacement')
  assert.equal(table.view('replacement').self.bank.debt,0)
  assert.equal(table.exportHostCheckpoint().bank.accounts.find(a=>a.id===id(1))?.debt,2000)
})
