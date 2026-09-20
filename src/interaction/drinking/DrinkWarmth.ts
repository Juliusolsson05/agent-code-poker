import type { DrinkKind } from '../../scene/props/specs'
export type CompletedSip={id:number;actor:'player';kind:DrinkKind}
export type DrinkEffectLevel='off'|'subtle'|'soft'

/** Cosmetic feedback, never a blood-alcohol model. Only the player's ownership
 * director can supply these receipts; NPC pose timers/order UI have no path in.
 * One monotonic high-water mark deduplicates without an unbounded ID set.
 * Room supplies its paused visual delta, not wall time or a second timer. */
export class DrinkWarmth {
  private amount=0
  private seen=0
  private level:DrinkEffectLevel='off'
  setLevel(level:DrinkEffectLevel) {this.level=level;if(level==='off')this.amount=0}
  accept(sip:CompletedSip) {
    if(!Number.isSafeInteger(sip.id)||sip.id<=this.seen)return
    this.seen=sip.id
    if(this.level==='off'||sip.actor!=='player'||sip.kind==='water')return
    if(!['old-fashioned','wine','beer'].includes(sip.kind))return
    this.amount=Math.min(1,this.amount+1/6)
  }
  advance(seconds:number) {if(Number.isFinite(seconds)&&seconds>0)this.amount=Math.max(0,this.amount-seconds/600)}
  reset(){this.amount=0} // Keep receipt high-water: leaving cannot replay a sip.
  get opacity(){return this.level==='off'?0:this.amount*(this.level==='subtle'?.09:.18)}
}
