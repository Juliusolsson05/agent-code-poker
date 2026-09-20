import test from 'node:test'
import assert from 'node:assert/strict'
import { PokerGame, type Action } from '../src/engine/game'
import { createPracticeBank, planBankTransfer, restorePracticeBank, BANK_CAPACITY, REBUY_CHIPS } from '../src/session/bank/PracticeBank'
import recorded from '../testing/fixtures/experience/bank-bust-scripted.json'

function settled() {
  const game=new PokerGame(()=>.37)
  game.startHand()
  for(const event of recorded.events)game.act(event.seat,event.action as Action)
  while(game.snapshot().phase!=='complete')game.advance()
  assert.deepEqual(game.snapshot().players.map(({seat,stack,bet,committed})=>({seat,stack,bet,committed})),recorded.complete.players)
  return game
}
const context=(game:PokerGame,seat=0)=>{const s=game.snapshot();return {phase:s.phase,stack:s.players[seat].stack,tableTotal:s.initialTotal}}

test('recorded scripted bust may borrow at a boundary without rewriting the completed hand',()=>{
  const game=settled(), before=game.snapshot(), bank=createPracticeBank(before.initialTotal)
  assert.throws(()=>game.startHand(),/complete/)
  const loan=planBankTransfer(bank,'borrower',{type:'borrow'},context(game))
  assert.equal(loan.delta,2000)
  game.transferBetweenHands(0,loan.delta)
  const after=game.snapshot()
  assert.equal(after.players[0].stack,2000)
  assert.equal(after.initialTotal+loan.bank.reserve,BANK_CAPACITY)
  assert.deepEqual(after.history,before.history)
  assert.deepEqual(after.results,before.results)
  assert.deepEqual(after.awards,before.awards)
  assert.deepEqual(after.deck,before.deck)
  assert.equal(after.players[0].startStack,before.players[0].startStack,'historical net is not redefined')
  assert.equal(PokerGame.restore(after).snapshot().initialTotal,14000)
  assert.deepEqual(restorePracticeBank(loan.bank,after.initialTotal),loan.bank)
  game.startHand()
  assert.equal(game.snapshot().players[0].hole.length,2,'rebought player can enter the next hand')
})

test('synthetic repayment moves chips back to the reserve and cannot repay another identity',()=>{
  const game=settled(), original=createPracticeBank(12000)
  const loan=planBankTransfer(original,'alice',{type:'borrow'},context(game))
  game.transferBetweenHands(0,loan.delta)
  assert.throws(()=>planBankTransfer(loan.bank,'bob',{type:'repay',amount:500},context(game)),/debt/)
  const repayment=planBankTransfer(loan.bank,'alice',{type:'repay',amount:500},context(game))
  game.transferBetweenHands(0,repayment.delta)
  assert.deepEqual(repayment.bank.accounts,[{id:'alice',debt:1500}])
  assert.equal(repayment.bank.reserve+game.snapshot().initialTotal,BANK_CAPACITY)
  assert.equal(game.snapshot().players[0].stack,1500)
  const final=planBankTransfer(repayment.bank,'alice',{type:'repay',amount:1500},context(game))
  game.transferBetweenHands(0,final.delta)
  assert.deepEqual(final.bank,original)
  assert.deepEqual(loan.bank.accounts,[{id:'alice',debt:2000}],'planning never mutates the prior ledger')
})

test('synthetic illegal issuance and engine transfers fail atomically',()=>{
  const game=settled(), bank=createPracticeBank(12000), before=game.snapshot()
  for(const delta of [0,NaN,Infinity,1.5,-1,1_000_000]) {
    assert.throws(()=>game.transferBetweenHands(0,delta))
    assert.deepEqual(game.snapshot(),before)
  }
  assert.throws(()=>game.transferBetweenHands(6,2000))
  assert.throws(()=>planBankTransfer(bank,'a',{type:'borrow'},context(game,3)),/busted/)
  assert.throws(()=>planBankTransfer(bank,'a',{type:'borrow'},{...context(game),phase:'betting'}),/between hands/)
  const loan=planBankTransfer(bank,'a',{type:'borrow'},context(game))
  game.transferBetweenHands(0,loan.delta);game.startHand()
  const live=game.snapshot()
  assert.throws(()=>game.transferBetweenHands(0,2000),/between hands/)
  assert.deepEqual(game.snapshot(),live)
})

test('synthetic invalid private bank checkpoints are rejected without repair or aliasing',()=>{
  const bank=planBankTransfer(createPracticeBank(12000),'a',{type:'borrow'},{phase:'complete',stack:0,tableTotal:12000}).bank
  for(const corrupt of [
    {...bank,reserve:bank.reserve+1}, {...bank,accounts:[]}, {...bank,accounts:[...bank.accounts,...bank.accounts]},
    {...bank,accounts:[{id:'a',debt:NaN}]}, {...bank,extra:true}, {...bank,base:14000},
  ])assert.throws(()=>restorePracticeBank(corrupt,14000),/bank/)
  const restored=restorePracticeBank(bank,14000);restored.accounts[0].debt=1
  assert.equal(bank.accounts[0].debt,2000)
})

test('synthetic reserve exhaustion and departed-borrower capacity are bounded, never reset',()=>{
  const nearlyEmpty=createPracticeBank(BANK_CAPACITY-1000)
  assert.throws(()=>planBankTransfer(nearlyEmpty,'a',{type:'borrow'},{phase:'complete',stack:0,tableTotal:BANK_CAPACITY-1000}),/reserve/)
  let bank=createPracticeBank(12000),tableTotal=12000
  for(let i=0;i<256;i++) {
    bank=planBankTransfer(bank,`departed-${i}`,{type:'borrow'},{phase:'complete',stack:0,tableTotal}).bank
    tableTotal+=REBUY_CHIPS
  }
  assert.throws(()=>planBankTransfer(bank,'new-player',{type:'borrow'},{phase:'complete',stack:0,tableTotal}),/account limit/)
  assert.equal(bank.accounts.length,256)
  assert.equal(bank.reserve+tableTotal,BANK_CAPACITY)
})
