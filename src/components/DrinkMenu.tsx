import { DRINKS, type DrinkKind } from '../scene/props/specs'

/** A small non-modal order card leaves the poker decision visible. No engine,
 * wallet or storage dependency: ordering is atmosphere, never a wager. Native
 * buttons retain keyboard semantics rather than claiming an ARIA menu without
 * implementing menu-style focus management. */
export function DrinkMenu({ kind, available, onOrder, onClose }: {
  kind: DrinkKind; available: boolean; onOrder: (kind: DrinkKind) => void; onClose: () => void
}) {
  return <section className="drink-menu" aria-label="Drink menu">
    <header><div><span>THE RIVER CLUB</span><h3>On the house.</h3></div><button autoFocus onClick={onClose} aria-label="Close drink menu">×</button></header>
    <p>Choose a drink. No chips spent.</p>
    <div className="drink-options">{(Object.keys(DRINKS) as DrinkKind[]).map(value =>
      <button key={value} disabled={!available} aria-pressed={kind === value} onClick={() => onOrder(value)}>
        <strong>{DRINKS[value].label}<span>{value === kind ? '✓' : '↗'}</span></strong><small>{DRINKS[value].note}</small>
      </button>)}</div>
    <p role="status">{available ? 'Delivered to your coaster. Press D to sip.' : 'Finish returning your drink or cigar first.'}</p>
  </section>
}
