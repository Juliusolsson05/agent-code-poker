import { useEffect, useRef, type KeyboardEvent } from 'react'
import { DRINKS, DRINK_SECTIONS, TREATS, type DrinkKind, type OrderKind, type TreatKind } from '../scene/props/specs'

/** Roving arrow focus across the order buttons. The card is NOT an ARIA menu:
 * that role promises menu-style focus trapping and typeahead we do not
 * implement. Native buttons in labelled groups already give Tab/Enter/Space
 * and a screen reader's group navigation; arrows are an extra convenience
 * because sixteen-plus buttons are a long Tab walk. Disabled buttons are
 * skipped by the browser's own focus rules, so a blocked menu cannot trap. */
function moveFocus(event: KeyboardEvent<HTMLDivElement>): void {
  const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End']
  if (!keys.includes(event.key)) return
  const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')]
  if (!buttons.length) return
  const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1
    : event.key === 'ArrowDown' ? (index + 1) % buttons.length : (index - 1 + buttons.length) % buttons.length
  // preventDefault stops the scroll container also scrolling by a line; the
  // browser's focus() scrolls the chosen button into view by itself.
  event.preventDefault(); buttons[next].focus()
}

/** A small non-modal order card leaves the poker decision visible. No engine,
 * wallet or storage dependency: ordering is atmosphere, never a wager. Native
 * buttons retain keyboard semantics rather than claiming an ARIA menu without
 * implementing menu-style focus management.
 *
 * Sections come from specs (DRINK_SECTIONS/TREATS), so a new drink appears
 * under its heading without touching this component. The list scrolls INSIDE
 * the card, below a fixed header, so at compact sizes the close button and the
 * status line stay visible while sixteen drinks and two treats scroll. */
export function DrinkMenu({ kind, treat = null, available, onOrder, onClose }: {
  kind: DrinkKind; treat?: TreatKind | null; available: boolean; onOrder: (kind: OrderKind) => void; onClose: () => void
}) {
  // When availability drops (a sip/cigar starts, the table pauses) every option
  // becomes disabled, and a disabled button silently loses focus to <body>, so
  // Tab/Escape stop meaning anything. If focus was in the list, park it on the
  // close button: still inside the card, still one Enter from dismissing it.
  const list = useRef<HTMLDivElement>(null), close = useRef<HTMLButtonElement>(null), focusInList = useRef(false)
  useEffect(() => {
    if (available || !focusInList.current) return
    const active = document.activeElement
    if (!active || active === document.body || list.current?.contains(active)) close.current?.focus()
  }, [available])
  const option = (value: OrderKind, label: string, note: string, current: boolean) =>
    <button key={value} disabled={!available} aria-pressed={current} onClick={() => onOrder(value)}>
      <strong>{label}<span aria-hidden="true">{current ? '✓' : '↗'}</span></strong><small>{note}</small>
    </button>
  return <section className="drink-menu" aria-label="Drink menu">
    <header><div><span>THE RIVER CLUB</span><h3>On the house.</h3></div><button ref={close} autoFocus onClick={onClose} aria-label="Close drink menu">×</button></header>
    <p>Choose a drink. No chips spent.</p>
    <div className="drink-options" ref={list} onKeyDown={moveFocus}
      onFocus={() => { focusInList.current = true }}
      onBlur={event => { if (event.relatedTarget) focusInList.current = list.current?.contains(event.relatedTarget as Node) ?? false }}>
      {DRINK_SECTIONS.map(section => <div key={section.id} role="group" aria-labelledby={`drink-section-${section.id}`}>
        <h4 id={`drink-section-${section.id}`}>{section.title}</h4>
        {(Object.keys(DRINKS) as DrinkKind[]).filter(value => DRINKS[value].section === section.id)
          .map(value => option(value, DRINKS[value].label, DRINKS[value].note, value === kind))}
      </div>)}
      {/* Fictional, cosmetic items (#14). The heading says so up front, so no
          one reads them as anything with real-world meaning or poker effect. */}
      <div role="group" aria-labelledby="drink-section-curiosities">
        <h4 id="drink-section-curiosities">Curiosities <span>cosmetic · no effect on play</span></h4>
        {(Object.keys(TREATS) as TreatKind[]).map(value => option(value, TREATS[value].label, TREATS[value].note, value === treat))}
      </div>
    </div>
    {/* Mention E only when there is a dish to take from; otherwise the hint
        advertises a key that does nothing. */}
    <p role="status">{available ? `Delivered to your table. D sips${treat ? ' · E takes a treat' : ''}.` : 'Finish returning your drink or cigar first.'}</p>
  </section>
}
