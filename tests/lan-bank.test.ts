import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, readFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { HostTable } from '../src/session/HostTable'
import { CheckpointStore } from '../server/persistence/CheckpointStore'
import { startLanHost } from '../server/http'
import recording from '../testing/fixtures/experience/bank-bust-scripted.json'

test('actual HTTP bank commands commit chips/debt/receipt together and recover without duplicate issuance',async t=>{
  const directory=mkdtempSync(join(tmpdir(),'poker-bank-http-'))
  // Deliberately seeded private host state avoids a flaky random all-in tie.
  // This is synthetic setup plus real HTTP/filesystem requests, not a browser
  // or Wi-Fi recording. No private state is retained outside this tempdir.
  const credentials=Array.from({length:6},(_,i)=>({id:String(i).repeat(32),token:String(i).repeat(43),nonce:String(i).repeat(64),name:`Player ${i}`}))
  const owner=new HostTable(credentials[0],{random:()=>.37})
  for(const c of credentials.slice(1))owner.join(c.id,c.name)
  owner.start(credentials[0].id,owner.view(credentials[0].id).revision)
  for(const e of recording.events){const c=credentials[e.seat],v=owner.view(c.id);owner.act(c.id,{sequence:v.self.nextSequence,revision:v.revision,action:e.action})}
  while(owner.view(credentials[0].id).phase!=='complete')owner.tick(owner.view(credentials[0].id).revision)
  const store=new CheckpointStore(directory)
  store.commit({version:1,code:'ABCDEF1234',host:credentials[0].id,table:owner.exportHostCheckpoint(),credentials});store.close()
  let host=await startLanHost({port:0,automaticTicks:false,checkpointDirectory:directory})
  t.after(async()=>{await host.close();rmSync(directory,{recursive:true,force:true})})
  async function api(path:string,input?:object,seat=0) {
    const response=await fetch(host.origin+path,{method:input?'POST':'GET',headers:{Origin:host.origin,'Content-Type':'application/json',Authorization:`Bearer ${credentials[seat].token}`},body:input?JSON.stringify(input):undefined})
    return {status:response.status,data:await response.json()}
  }
  await api('/api/state');await api('/api/pause',{paused:false})
  const before=(await api('/api/state')).data.view
  const request={sequence:before.self.nextSequence,revision:before.revision,action:{type:'borrow'}}
  const accepted=await api('/api/action',request)
  assert.equal(accepted.status,200);assert.equal(accepted.data.receipt.code,'accepted')
  assert.equal(accepted.data.view.self.bank.debt,2000);assert.equal(accepted.data.view.players[0].stack,2000)
  for(const secret of ['accounts','deck','lastRequest',credentials[0].id,credentials[0].token])assert.equal(JSON.stringify(accepted.data).includes(secret),false)
  await host.close();host=await startLanHost({port:0,automaticTicks:false,checkpointDirectory:directory})
  const restored=await api('/api/state')
  assert.equal(restored.data.paused,true);assert.equal(restored.data.view.self.bank.debt,2000)
  await api('/api/pause',{paused:false})
  assert.equal((await api('/api/action',request)).data.receipt.code,'duplicate')
  const now=(await api('/api/state')).data.view
  const repayment={sequence:now.self.nextSequence,revision:now.revision,action:{type:'repay',amount:500}}
  const repaid=await api('/api/action',repayment)
  assert.equal(repaid.data.view.self.bank.debt,1500);assert.equal(repaid.data.view.players[0].stack,1500)
  assert.equal((await api('/api/action',repayment)).data.receipt.code,'duplicate')
  const bytes=readFileSync(join(directory,'table.json'))
  mkdirSync(join(directory,'table.pending')) // deliberate failure of the next atomic checkpoint
  const v=(await api('/api/state')).data.view
  const rejected=await api('/api/action',{sequence:v.self.nextSequence,revision:v.revision,action:{type:'repay',amount:100}})
  assert.equal(rejected.status,503);assert.equal(rejected.data.view,undefined)
  assert.deepEqual(readFileSync(join(directory,'table.json')),bytes,'no bank-only or stack-only persistence')
})
