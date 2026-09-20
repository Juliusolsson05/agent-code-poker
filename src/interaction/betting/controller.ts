/** A disposable wager draft, not another poker engine. Only public legal
 * bounds enter this module; no deck, player object, storage, DOM or timers.
 * The caller must still ask the engine to execute every emitted action. */
export type BettingContext = {
  revision: number; blocked: boolean; pot: number; currentBet: number; coarseStep: number
  legal: { fold: boolean; check: boolean; call: number; raise: boolean; min: number; max: number; shortOnly: boolean }
}
export type Draft = { revision: number; open: boolean; amount: number; submitted: boolean }
export type Command = 'open' | 'cancel' | 'confirm' | 'fold' | 'call' | 'min' | 'half' | 'pot' | 'all'
  | { step: -1 | 1; coarse: boolean }
export type Intent = { type: 'fold' | 'check' | 'call' } | { type: 'raise'; to: number }
export type KeyInput = { key: string; repeat: boolean; shift: boolean; modified: boolean; composing: boolean; target: 'table' | 'control' | 'editing' }

const clamp = (value: number, c: BettingContext) => Math.max(c.legal.min, Math.min(c.legal.max, Math.floor(value)))
export const initialDraft = (c: BettingContext): Draft => ({ revision: c.revision, open: false, amount: c.legal.min, submitted: false })

export function currentDraft(d: Draft, c: BettingContext): Draft {
  if (d.revision !== c.revision) return initialDraft(c)
  // Closing on interruption is intentional: resuming must not leave a stale
  // all-in amount one accidental Enter away. Keep the submission latch until a
  // new engine revision, however, so pause cannot re-enable the same wager.
  return { ...d, open: d.open && !c.blocked && c.legal.raise, amount: c.blocked ? c.legal.min : clamp(d.amount, c) }
}

export function presetAmount(preset: 'min' | 'half' | 'pot' | 'all', c: BettingContext): number {
  // Raise-to includes this street's existing bet. Pot fractions are calculated
  // AFTER matching the outstanding call; using only the visible pot undersizes
  // a raise facing a bet. Clamping also handles the engine's short-all-in min.
  const amounts = { min: c.legal.min, half: c.currentBet + Math.round((c.pot + c.legal.call) / 2),
    pot: c.currentBet + c.pot + c.legal.call, all: c.legal.max }
  return clamp(amounts[preset], c)
}

export function commandForKey(k: KeyInput, open: boolean): Command | null {
  if (k.modified || k.composing || k.target === 'editing') return null
  const key = k.key.toLowerCase()
  // Do not steal Enter from a focused preset, cancel or other native button.
  // The adapter also suppresses repeated native activation. Arrow repeat is
  // useful for sizing; repeated F/C/B/Enter must never commit another decision.
  if (open && key.startsWith('arrow') && ['arrowleft', 'arrowright', 'arrowup', 'arrowdown'].includes(key))
    return { step: key === 'arrowleft' || key === 'arrowdown' ? -1 : 1, coarse: k.shift }
  if (k.repeat) return null
  if (key === 'b') return 'open'
  if (key === 'f') return 'fold'
  if (key === 'c') return 'call'
  if (!open) return null
  if (key === 'escape') return 'cancel'
  if (key === 'enter' && k.target === 'table') return 'confirm'
  const presets: Record<string, Command> = { '1': 'min', '2': 'half', '3': 'pot', '4': 'all' }
  return presets[key] ?? null
}

export function reduceBetting(draft: Draft, c: BettingContext, command: Command): { draft: Draft; intent?: Intent } {
  let d = currentDraft(draft, c)
  if (command === 'cancel') return { draft: { ...d, open: false } }
  if (c.blocked || d.submitted) return { draft: d }
  let intent: Intent | undefined
  if (command === 'fold' && c.legal.fold) intent = { type: 'fold' }
  else if (command === 'call' && (c.legal.check || c.legal.call > 0)) intent = { type: c.legal.check ? 'check' : 'call' }
  else if (c.legal.raise) {
    if (command === 'open') d = { ...d, open: true }
    else if (d.open) {
      if (command === 'confirm') intent = { type: 'raise', to: d.amount }
      else if (typeof command === 'object') d = { ...d, amount: clamp(d.amount + command.step * (command.coarse ? c.coarseStep : 1), c) }
      else if (['min', 'half', 'pot', 'all'].includes(command)) d = { ...d, amount: presetAmount(command as 'min' | 'half' | 'pot' | 'all', c) }
    }
  }
  // Synchronous latch closes the gap before React renders saving=true. It is
  // not a substitute for App's lock or engine validation; it prevents a second
  // UI dispatch while those authoritative owners publish their next state.
  return { draft: intent ? { ...d, open: false, submitted: true } : d, intent }
}
