import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { BankControls } from '../src/components/BankControls'

// Static markup only: actual CUA confirmation/focus remains a release gate.
test('bank controls disclose fictional debt and use host eligibility, never a numeric input',()=>{
  const offer={debt:2000,borrowAmount:2000,canBorrow:false,repayMax:1500,reason:'Rebuys are available when your stack is empty.'}
  const html=renderToStaticMarkup(createElement(BankControls,{offer,revision:10,blocked:false,onConfirm:()=>true}))
  assert.match(html,/No interest. No real money./)
  assert.match(html,/Owed: <strong>2,000 chips/)
  assert.match(html,/<button disabled="">Borrow 2,000 chips/)
  assert.match(html,/Repay 500 chips/);assert.match(html,/Repay up to 1,500 chips/)
  assert.equal(html.includes('<input'),false)
  const blocked=renderToStaticMarkup(createElement(BankControls,{offer,revision:10,blocked:true,onConfirm:()=>true}))
  assert.equal((blocked.match(/disabled=""/g)??[]).length,3)
  const solo=renderToStaticMarkup(createElement(BankControls,{offer,revision:10,blocked:false,onConfirm:()=>true,scope:'solo'}))
  assert.match(solo,/Debt is saved with this table/)
  assert.equal(solo.includes('reconnect'),false)
})
