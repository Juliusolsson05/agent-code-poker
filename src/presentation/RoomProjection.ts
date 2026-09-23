import type { Card } from '../engine/cards'
import type { GameState, Phase } from '../engine/game'
import type { SeatLeisure, TableView, VisibleCards } from '../session/view'
import { isDrinkKind } from '../scene/props/specs'

export type ScenePlayer = {
  /** seat is a display index only. sourceSeat must never be inferred from it. */
  seat: number; sourceSeat: number; stack: number; bet: number; committed: number
  folded: boolean; action: string; cards: VisibleCards
  /** Cosmetic gestures of a human-controlled opponent; null = ambient NPC. */
  leisure: SeatLeisure | null
}
export type SceneState = {
  dealId: number; revision: number; handNumber: number; phase: Phase; street: number
  initialTotal: number; actor: number | null; dealer: number; publicShowdown: boolean
  board: Card[]; players: ScenePlayer[]; results: { seat: number; won: number }[]
}
export const cardCount = (cards: VisibleCards): number => cards.kind === 'visible' ? cards.values.length : cards.kind === 'hidden' ? cards.count : 0
const copyCards = (cards: VisibleCards): VisibleCards => cards.kind === 'visible' ? {kind:'visible',values:[...cards.values]} : {...cards}
/** The wire is data, not trust. A malformed record (an older host, a proxy, a
 * future field) degrades to null, i.e. the harmless ambient NPC, instead of
 * throwing away the whole poker view or handing the renderer an unknown glass
 * name. drinkKind is checked against DRINKS itself, so adding a drink there is
 * the only change a new menu item needs. */
function copyLeisure(value: unknown): SeatLeisure | null {
  if (!value || typeof value !== 'object') return null
  const l = value as Record<string, unknown>
  const count = (n: unknown) => Number.isSafeInteger(n) && Number(n) >= 0
  if (!count(l.seq) || !(l.action === null || l.action === 'smoke' || l.action === 'sip' || l.action === 'order') ||
    !(l.ageMs === null || count(l.ageMs)) || (l.action === null) !== (l.ageMs === null) ||
    !(l.drinkKind === null || isDrinkKind(l.drinkKind))) return null
  return { seq: Number(l.seq), action: l.action, ageMs: l.ageMs === null ? null : Number(l.ageMs), drinkKind: l.drinkKind as SeatLeisure['drinkKind'] }
}

/** The sole reconciliation boundary into PokerRoom. Consumers receive only a
 * presentation snapshot, never an authoritative GameState with invented hidden
 * cards. Authority seat IDs survive as sourceSeat; all geometric indices rotate
 * together exactly once. A remote action uses its credential, not either index.
 *
 * The solo deck comparison stays PRIVATE to this adapter. It detects replacing
 * a saved hand with a different game at the same hand number without exposing
 * even a deck-derived key to renderers/diagnostics. Remote rooms have no deck
 * and their client must reset this adapter on a new session, never on a poll.
 */
export class RoomProjection {
  private dealId=0
  private lastHand=-1
  private lastViewer=-1
  private mode: 'solo'|'remote'|null=null
  private soloDeck=''
  private generation(mode:'solo'|'remote', hand:number, viewer:number, deck?:readonly Card[]):number {
    const fingerprint=deck?.join(',') ?? ''
    if(this.mode!==mode || this.lastHand!==hand || this.lastViewer!==viewer || mode==='solo' && fingerprint!==this.soloDeck) this.dealId++
    this.mode=mode;this.lastHand=hand;this.lastViewer=viewer;this.soloDeck=fingerprint
    return this.dealId
  }
  solo(state:GameState):SceneState {
    const publicShowdown=state.phase==='showdown' || state.phase==='complete' && state.results.some(r=>r.hand!==null)
    return {
      dealId:this.generation('solo',state.handNumber,0,state.deck),revision:state.revision,handNumber:state.handNumber,
      phase:state.phase,street:state.street,initialTotal:state.initialTotal,actor:state.actor,dealer:state.dealer,publicShowdown,
      board:[...state.board],results:state.results.map(r=>({seat:r.seat,won:r.won})),
      players:state.players.map(p=>({seat:p.seat,sourceSeat:p.seat,stack:p.stack,bet:p.bet,committed:p.committed,folded:p.folded,action:p.action,
        cards:!p.hole.length?{kind:'absent'}:p.seat===0 || publicShowdown && !p.folded?{kind:'visible',values:[...p.hole]}:{kind:'hidden',count:p.hole.length},
        // Solo opponents are all NPCs; their gestures stay on ambient timers.
        leisure:null})),
    }
  }
  remote(view:TableView,viewer:number):SceneState {
    if(!Number.isInteger(viewer)||viewer<0||viewer>=6||view.players.length!==6 ||
      new Set(view.players.map(p=>p.seat)).size!==6 || view.players.some(p=>p.seat<0||p.seat>=6||!Number.isInteger(p.seat)))
      throw new Error('Invalid six-seat presentation.')
    const display=(seat:number)=>seat<0?seat:(seat-viewer+6)%6
    // Do not trust an independently supplied displaySeat to rotate only some
    // fields. Derive actor/button/paper/chips from the same viewer every time.
    return {
      dealId:this.generation('remote',view.handNumber,viewer),revision:view.gameRevision,handNumber:view.handNumber,
      phase:view.phase,street:view.street,initialTotal:view.players.reduce((n,p)=>n+p.stack+p.committed,0),
      actor:view.actor===null?null:display(view.actor),dealer:display(view.dealer),
      publicShowdown:view.phase==='showdown'||view.phase==='complete'&&view.results.some(r=>r.hand!==null),
      board:[...view.board],results:view.results.map(r=>({seat:display(r.seat),won:r.won})),
      players:view.players.map(p=>({seat:display(p.seat),sourceSeat:p.seat,stack:p.stack,bet:p.bet,committed:p.committed,
        folded:p.folded,action:p.action,cards:copyCards(p.cards),leisure:copyLeisure(p.leisure)})).sort((a,b)=>a.seat-b.seat),
    }
  }
}
