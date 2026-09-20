/** Fictional chips only. The ceiling matches the engine's existing numeric
 * bound, rather than weakening restore/conservation checks for new issuance.
 * This is a finite outside reserve, not a second mutable player-stack ledger.
 * HostTable is the intended sole runtime consumer; no renderer, client, audio
 * or engine code may import this private identity/debt representation. */
export const BANK_CAPACITY = 1_000_000
export const REBUY_CHIPS = 2000
const MAX_ACCOUNTS = 256
export type BankState = { version: 1; base: number; reserve: number; accounts: { id: string; debt: number }[] }
export type BankOperation = { type: 'borrow' } | { type: 'repay'; amount: number }
type Context = { phase: string; stack: number; tableTotal: number }
const integer = (n: unknown): n is number => Number.isSafeInteger(n) && Number(n) >= 0 && Number(n) <= BANK_CAPACITY
const principal = (id: unknown): id is string => typeof id === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(id)
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)
const keys = (v: Record<string, unknown>, expected: string[]) =>
  Object.keys(v).length === expected.length && expected.every(k => Object.hasOwn(v,k))

export function createPracticeBank(tableTotal: number): BankState {
  if (!integer(tableTotal) || tableTotal === 0) throw new Error('Invalid bank starting chips.')
  return { version: 1, base: tableTotal, reserve: BANK_CAPACITY-tableTotal, accounts: [] }
}

export function restorePracticeBank(value: unknown, tableTotal: number): BankState {
  const invalid = () => new Error('Invalid bank checkpoint. Saved data has been preserved.')
  if (!object(value) || !keys(value,['version','base','reserve','accounts']) || value.version !== 1 ||
    !integer(value.base) || value.base === 0 || !integer(value.reserve) || !integer(tableTotal) ||
    value.reserve+tableTotal !== BANK_CAPACITY || !Array.isArray(value.accounts) || value.accounts.length>MAX_ACCOUNTS) throw invalid()
  const ids=new Set<string>(), accounts: BankState['accounts']=[]
  let debt=0
  for(const entry of value.accounts) {
    if(!object(entry) || !keys(entry,['id','debt']) || !principal(entry.id) || ids.has(entry.id) || !integer(entry.debt) || entry.debt===0) throw invalid()
    ids.add(entry.id);debt+=entry.debt;accounts.push({id:entry.id,debt:entry.debt})
  }
  // Debt is the claim against loans, not extra spendable currency. These two
  // equations catch issuance without debt, debt forgiveness on disconnect,
  // and a restored table that does not belong to this bank checkpoint.
  if(debt!==tableTotal-value.base)throw invalid()
  return {version:1,base:value.base,reserve:value.reserve,accounts}
}

/** Validate a whole transaction without changing either owner. Host integration
 * applies delta through PokerGame's boundary API, then installs this returned
 * bank and the accepted command together in its existing commit-before-ACK.
 * Never mutate a snapshot's stack, persist this proposal independently, or
 * treat it as an accepted transfer before the engine validates it.
 *
 * Debts belong to a principal, not a chair: archived departed borrowers remain
 * until the room ends. Zero accounts are removed after repayment. The bounded
 * count prevents cycling partial repayments/new identities from growing a
 * private checkpoint without limit, even though total chips stay conserved.
 */
export function planBankTransfer(value: BankState, id: string, operation: BankOperation, context: Context): { bank: BankState; delta: number } {
  const bank=restorePracticeBank(value,context.tableTotal)
  if(!principal(id) || !integer(context.stack))throw new Error('Invalid bank player.')
  if(context.phase!=='ready' && context.phase!=='complete')throw new Error('Bank transfers are only available between hands.')
  const account=bank.accounts.find(a=>a.id===id)
  let delta: number
  if(operation.type==='borrow') {
    if(context.stack!==0)throw new Error('Only a busted player can borrow chips.')
    if(bank.reserve<REBUY_CHIPS)throw new Error('The practice bank reserve cannot fund another rebuy.')
    if(!account && bank.accounts.length>=MAX_ACCOUNTS)throw new Error('The practice bank account limit has been reached for this room.')
    delta=REBUY_CHIPS
  } else if(operation.type==='repay') {
    if(!integer(operation.amount) || operation.amount===0 || operation.amount>(account?.debt??0))throw new Error('Repayment exceeds your bank debt.')
    if(operation.amount>context.stack)throw new Error('Repayment exceeds your available chips.')
    delta=-operation.amount
  } else throw new Error('Invalid bank operation.')
  const debt=(account?.debt??0)+delta
  bank.accounts=bank.accounts.filter(a=>a.id!==id)
  if(debt>0)bank.accounts.push({id,debt})
  bank.reserve-=delta
  return {bank:restorePracticeBank(bank,context.tableTotal+delta),delta}
}
