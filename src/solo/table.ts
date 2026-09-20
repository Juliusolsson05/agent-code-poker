import { PokerGame, type GameState } from '../engine/game'
import { createPracticeBank, restorePracticeBank, planBankTransfer, REBUY_CHIPS, type BankState, type BankOperation } from '../bank/PracticeBank'

export type { BankState, BankOperation }
export type Preferences = { muted:boolean; speed:'relaxed'|'brisk' }
type Save = Preferences & { version:2; table:GameState|null; bank:BankState|null }
const PLAYER='solo-player'

/** Version and bank travel in the existing save key, never a second key that
 * could survive a failed table write or lag behind a preference-only save.
 * Only genuinely pre-bank saves migrate; malformed v2 must not forgive debt.
 * App owns installing the returned pair and freezes on persistence failure. */
export function restoreSoloSave(value:unknown):{game:PokerGame|null;bank:BankState|null}&Preferences {
  if(!value || typeof value!=='object' || Array.isArray(value))throw new Error('Invalid saved table. Saved data has been preserved.')
  const v=value as Record<string,unknown>
  if(typeof v.muted!=='boolean' || v.speed!=='relaxed' && v.speed!=='brisk')throw new Error('Invalid saved preferences. Saved data has been preserved.')
  const legacy=!Object.hasOwn(v,'version') && !Object.hasOwn(v,'bank')
  if(!legacy && v.version!==2)throw new Error('Unsupported saved table version. Saved data has been preserved.')
  const game=v.table===null?null:PokerGame.restore(v.table)
  const bank=game ? legacy?createPracticeBank(game.snapshot().initialTotal):validateBank(v.bank,game.snapshot().initialTotal) : null
  if(!legacy && !game && v.bank!==null)throw new Error('Bank without a table. Saved data has been preserved.')
  return {game,bank,muted:v.muted,speed:v.speed}
}

function validateBank(bank:unknown,total:number):BankState {
  const next=restorePracticeBank(bank,total)
  // Solo has exactly one borrower identity. Importing a LAN checkpoint or
  // quietly accepting an orphan account would hide debt from this player's UI.
  if(next.accounts.some(a=>a.id!==PLAYER))throw new Error('Invalid solo bank owner. Saved data has been preserved.')
  return next
}

export function freshSoloBank(game:PokerGame):BankState {return createPracticeBank(game.snapshot().initialTotal)}

export function soloCheckpoint(table:GameState|null,bank:BankState|null,prefs:Preferences):Save {
  if(!table && bank)throw new Error('Bank without a table.')
  return {version:2,table,bank:table?validateBank(bank,table.initialTotal):null,muted:prefs.muted,speed:prefs.speed}
}

export function soloBankOffer(game:PokerGame,bank:BankState) {
  const s=game.snapshot(),stack=s.players[0].stack,debt=bank.accounts.find(a=>a.id===PLAYER)?.debt??0
  const boundary=s.phase==='ready'||s.phase==='complete'
  let reason:string|null=null
  try {planBankTransfer(bank,PLAYER,{type:'borrow'},{phase:s.phase,stack,tableTotal:s.initialTotal})}
  catch(error){reason=error instanceof Error?error.message:'Bank unavailable.'}
  return {debt,borrowAmount:REBUY_CHIPS,canBorrow:reason===null,repayMax:boundary?Math.min(stack,debt):0,reason}
}

/** Clone at this rare boundary, not every animation frame. If engine validation
 * rejects a proposal, neither live owner changes. After success App installs
 * BOTH synchronously, then its existing lock serializes their one storage write.
 * Retry saves this pair; it must never call transferSoloBank a second time. */
export function transferSoloBank(game:PokerGame,bank:BankState,action:BankOperation,revision:number) {
  const s=game.snapshot()
  if(s.revision!==revision)throw new Error('The table changed. Review the bank transfer again.')
  const proposal=planBankTransfer(validateBank(bank,s.initialTotal),PLAYER,action,{phase:s.phase,stack:s.players[0].stack,tableTotal:s.initialTotal})
  const next=PokerGame.restore(s)
  next.transferBetweenHands(0,proposal.delta)
  return {game:next,bank:proposal.bank}
}
