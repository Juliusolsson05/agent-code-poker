import { DrinkMenu } from '../../src/components/DrinkMenu'
import { DRINKS, TREATS, type DrinkKind, type OrderKind, type TreatKind } from '../../src/scene/props/specs'

type Context = { blocked: boolean; available: boolean; menuOpen: boolean }
type Key = { key: string; repeat?: boolean; ctrlKey?: boolean; altKey?: boolean; metaKey?: boolean; isComposing?: boolean }

/** A request to the existing Room owner, never a consumption event. In
 * particular neither this button nor ordering may apply intoxication; only a
 * future verified completed-sip event can do that. Native button keys and name
 * entry belong to the browser, so shortcuts are table-focus only. */
export function leisureShortcut(event: Key, target: 'table' | 'control' | 'editing', context: Context): 'smoke' | 'drink' | 'consume' | null {
  if (target !== 'table' || context.blocked || !context.available || context.menuOpen ||
    event.repeat || event.ctrlKey || event.altKey || event.metaKey || event.isComposing) return null
  const key = event.key.toLowerCase()
  // E (cosmetic treat, #14) is only a request: Room still refuses it when the
  // dish is empty, so the shortcut never needs its own copy of that state.
  return key === 's' ? 'smoke' : key === 'd' ? 'drink' : key === 'e' ? 'consume' : null
}

/** LAN presentation only, consumed by client.js. Availability comes from the
 * same InteractionDirector as solo play; an optimistic UI timer would permit
 * glass replacement while the old vessel was still held. No network, poker
 * authority, persistence or animation imports are allowed here. */
export function LeisureControls(props: Context & {
  kind: DrinkKind; onSmoke: () => void; onSip: () => void;
  onMenuChange: (open: boolean) => void; onOrder: (kind: OrderKind) => void;
  treat?: { kind: TreatKind; remaining: number } | null; canConsume?: boolean; onConsume?: () => void;
}) {
  const disabled = props.blocked || !props.available || props.menuOpen
  return <div className="lan-leisure">
    <button disabled={disabled} onClick={props.onSmoke}>Cigar <kbd>S</kbd></button>
    <button disabled={disabled} onClick={props.onSip}>{DRINKS[props.kind].label} <kbd>D</kbd></button>
    {props.treat && <button disabled={disabled || !props.canConsume} onClick={props.onConsume}>{TREATS[props.treat.kind].label} · {props.treat.remaining} <kbd>E</kbd></button>}
    <button disabled={props.blocked} aria-expanded={props.menuOpen} onClick={() => props.onMenuChange(!props.menuOpen)}>Drinks ▾</button>
    {props.menuOpen && <DrinkMenu kind={props.kind} treat={props.treat?.kind ?? null} available={!props.blocked && props.available}
      onClose={() => props.onMenuChange(false)} onOrder={props.onOrder} />}
  </div>
}
