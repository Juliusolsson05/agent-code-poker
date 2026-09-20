import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type KeyboardEvent } from 'react'
import type { Action, Legal } from '../engine/game'
import { commandForKey, currentDraft, initialDraft, presetAmount, reduceBetting, type Command } from '../interaction/betting/controller'

export type BettingHandle = {
  handleKey: (event: KeyboardEvent, target: 'table' | 'control' | 'editing') => boolean
  snapshot: () => { open: boolean; amount: number }
}
type Props = {
  revision: number; blocked: boolean; legal: Legal; pot: number; currentBet: number; ownBet: number; bigBlind: number
  onAction: (action: Action) => boolean; onOpenChange: (open: boolean) => void; focusTable: () => void
}
const chips = (n: number) => n.toLocaleString('en-US')

/** Sole runtime adapter for the isolated betting contract. App still owns
 * engine execution/persistence. Ref-backed dispatch is synchronous so rapid
 * pointer + keyboard activation cannot race React's next render. All buttons
 * take the same command path as keys; none independently calculate a wager. */
export const BettingControls = forwardRef<BettingHandle, Props>(function BettingControls(p, ref) {
  const c = { ...p, coarseStep: p.bigBlind }
  const draft = useRef(initialDraft(c))
  const [, render] = useState(0)
  draft.current = currentDraft(draft.current, c)
  const d = draft.current
  useEffect(() => { p.onOpenChange(d.open) }, [d.open, p.onOpenChange])
  useEffect(() => () => p.onOpenChange(false), [p.onOpenChange])

  const dispatch = (command: Command, keyboard = false) => {
    const result = reduceBetting(draft.current, c, command)
    draft.current = result.draft
    render(value => value + 1)
    // An explicit B or cancel returns focus to the table. Do not autofocus on
    // amount changes: Tab users must be able to browse presets/cancel/confirm.
    if (command === 'cancel' || command === 'open' && keyboard) p.focusTable()
    // A preference save can acquire App's lock before blocked=true renders.
    // If App rejects that narrow race, release our latch: no engine revision
    // will arrive to reset it, and otherwise this turn becomes unplayable.
    if (result.intent && !p.onAction(result.intent)) draft.current = { ...result.draft, submitted: false }
  }
  useImperativeHandle(ref, () => ({
    snapshot: () => ({ open: draft.current.open, amount: draft.current.amount }),
    handleKey: (event, target) => {
      const command = commandForKey({ key: event.key, repeat: event.repeat, shift: event.shiftKey,
        modified: event.altKey || event.ctrlKey || event.metaKey, composing: event.nativeEvent.isComposing, target }, draft.current.open)
      if (!command) return false
      event.preventDefault(); event.stopPropagation(); dispatch(command, true); return true
    },
  }))

  const disabled = p.blocked || d.submitted
  return <div className="keyboard-betting" onKeyDownCapture={event => {
    // Native button Enter can autorepeat click without going through our key
    // resolver. Suppress that default, not the first native activation.
    if (event.repeat && (event.key === 'Enter' || event.key === ' ')) event.preventDefault()
  }}>
    {d.open && <div className="betting-tray" role="group" aria-label="Choose wager">
      <div className="wager-heading"><span>{p.currentBet === 0 ? 'BET' : 'RAISE'} TO</span><button onClick={() => dispatch('cancel')} aria-label="Cancel wager">Cancel <kbd>Esc</kbd></button></div>
      <div className="wager-stepper">
        <button disabled={disabled || d.amount <= p.legal.min} onClick={() => dispatch({ step: -1, coarse: false })} aria-label="Decrease wager by one">−</button>
        <output aria-live="polite" aria-label="Selected wager">{chips(d.amount)}</output>
        <button disabled={disabled || d.amount >= p.legal.max} onClick={() => dispatch({ step: 1, coarse: false })} aria-label="Increase wager by one">+</button>
      </div>
      <div className="wager-details">{chips(d.amount - p.ownBet)} from your stack{p.legal.shortOnly ? ' · Short all-in' : ''}</div>
      <div className="wager-presets">{(['min', 'half', 'pot', 'all'] as const).map((preset, i) => <button key={preset}
        disabled={disabled} aria-pressed={d.amount === presetAmount(preset, c)} onClick={() => dispatch(preset)}>
        {['Min', '½ pot', 'Pot', 'All-in'][i]} <kbd>{i + 1}</kbd>
      </button>)}</div>
      <div className="wager-hint">← → 1 chip · Shift + arrows {chips(p.bigBlind)} chips</div>
      <button className="primary confirm-raise" disabled={disabled} onClick={() => dispatch('confirm')}>
        {p.currentBet === 0 ? 'Bet' : 'Raise to'} {chips(d.amount)} <kbd>Enter</kbd>
      </button>
    </div>}
    <button className="fold-button" disabled={disabled || !p.legal.fold} onClick={() => dispatch('fold')}>Fold <kbd>F</kbd></button>
    <button className="call-button" disabled={disabled || !p.legal.check && p.legal.call === 0} onClick={() => dispatch('call')}>
      {p.legal.check ? 'Check' : `Call ${chips(p.legal.call)}`} <kbd>C</kbd></button>
    <button className="primary" disabled={disabled || !p.legal.raise} aria-expanded={d.open} onClick={() => dispatch(d.open ? 'cancel' : 'open')}>
      {p.currentBet === 0 ? 'Bet' : 'Raise'} <kbd>B</kbd></button>
  </div>
})
