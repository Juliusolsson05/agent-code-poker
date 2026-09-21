import { useEffect, useState } from 'react'

type Operation = {type:'borrow'} | {type:'repay';amount:number}
type Offer = {debt:number;borrowAmount:number;canBorrow:boolean;repayMax:number;reason:string|null}
/** Public own-player offer only. The menu never imports the bank ledger or
 * computes credit eligibility. A confirmation binds the observed revision;
 * polling, pause or a pending request cancels it instead of silently rebasing
 * a financial-looking choice. These remain fictional practice chips. */
export function BankControls({offer,revision,blocked,onConfirm,scope='lan'}:{
  offer:Offer;revision:number;blocked:boolean;onConfirm:(action:Operation,revision:number)=>boolean;scope?:'solo'|'lan'
}) {
  const [draft,setDraft]=useState<{action:Operation;revision:number}|null>(null)
  useEffect(()=>setDraft(null),[revision,blocked])
  useEffect(()=>{
    // A bank panel already pauses solo play, so another blur does not change
    // its blocked prop. Explicitly abandon confirmation on focus loss; never
    // leave an old repayment armed when returning from another app.
    const cancel=()=>setDraft(null)
    const hidden=()=>{if(document.hidden)cancel()}
    window.addEventListener('blur',cancel);document.addEventListener('visibilitychange',hidden)
    return ()=>{window.removeEventListener('blur',cancel);document.removeEventListener('visibilitychange',hidden)}
  },[])
  const live=draft?.revision===revision && !blocked ? draft : null
  function confirm() {
    if(!live)return
    setDraft(null)
    onConfirm(live.action,live.revision)
  }
  return <section className="practice-bank" aria-label="Practice-chip bank">
    <h3>Practice bank</h3>
    <p>Owed: <strong>{offer.debt.toLocaleString()} chips</strong> · No interest. No real money.</p>
    {live ? <div role="group" aria-label="Confirm bank transfer">
      <p>{live.action.type==='borrow' ? `Borrow ${offer.borrowAmount.toLocaleString()} chips? This adds the same amount to your debt.` :
        `Repay ${live.action.amount.toLocaleString()} chips from your stack?`}</p>
      <div className="row"><button onClick={confirm}>Confirm transfer</button><button onClick={()=>setDraft(null)}>Cancel transfer</button></div>
    </div> : <div className="row">
      <button disabled={blocked || !offer.canBorrow} onClick={()=>setDraft({action:{type:'borrow'},revision})}>Borrow {offer.borrowAmount.toLocaleString()} chips</button>
      {offer.repayMax>500 && <button disabled={blocked} onClick={()=>setDraft({action:{type:'repay',amount:500},revision})}>Repay 500 chips</button>}
      <button disabled={blocked || offer.repayMax===0} onClick={()=>setDraft({action:{type:'repay',amount:offer.repayMax},revision})}>Repay up to {offer.repayMax.toLocaleString()} chips</button>
    </div>}
    <p className="small">{offer.reason || 'Busted? Borrow between hands to rejoin the next deal.'} {scope==='solo'
      ? 'Debt is saved with this table. Starting a new table ends this practice room and its debt.'
      : 'Debt follows your player for this room, including reconnects. Leaving does not transfer it to another player.'}</p>
  </section>
}
