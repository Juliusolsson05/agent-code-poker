import type { ReactNode } from 'react'
import type { Card } from '../engine/cards'
import { CommunityBoard } from './CommunityBoard'
import { PlayingCard } from './PlayingCard'

const chips=(n:number)=>n.toLocaleString('en-US')

/** Original solo presentation, shared verbatim by the network adapter. These
 * components accept display data/callbacks, never GameState or HostTable. The
 * controller keeps authority over actions and private-card entitlement. This
 * boundary exists because a second LAN HTML/CSS implementation drifted into
 * a different game despite sharing the same 3D renderer. */
export function PokerHeader({onLobby,children}:{onLobby:()=>void;children:ReactNode}) {
  return <header className="header">
    <button className="brand" onClick={onLobby} aria-label="Back to poker lobby"><span className="brand-mark">♠</span><span>AGENT CODE <b>POKER</b></span></button>
    <span className="header-location"><i /> THE RIVER CLUB <em> / </em> NO-LIMIT HOLD’EM</span>
    <div className="header-tools">{children}</div>
  </header>
}

export function TableInfo({handNumber,smallBlind,bigBlind}:{handNumber:number;smallBlind:number;bigBlind:number}) {
  return <div className="table-info"><span className="live-dot" /> TABLE 01 <span>·</span> HAND {String(handNumber).padStart(3,'0')} <span>·</span> BLINDS {smallBlind} / {bigBlind}</div>
}

export function SeatContents({name,dealer,blind,stack,action,visibleCards=[]}:{
  name:string;dealer:boolean;blind:string;stack:number;action:string;visibleCards?:readonly Card[]
}) {
  return <><div className="seat-name"><span className="seat-dot" />{name}{dealer && <b className="dealer-badge" title="Dealer button">D</b>}{blind && <small>{blind}</small>}</div>
    <strong>{chips(stack)}</strong><span className="seat-action">{action}</span>
    {visibleCards.length>0 && <div className="opponent-cards">{visibleCards.map(c=><PlayingCard key={c} card={c} small />)}</div>}
  </>
}

export function PotContents({finished,amount,sidePots}:{finished:boolean;amount:number;sidePots:number}) {
  return <><span>{finished?'POT AWARDED':'IN THE POT'}</span><strong>◈ {chips(amount)}</strong>
    {sidePots>0 && <small>{sidePots} side pot{sidePots>1?'s':''}</small>}</>
}

export type TableReadoutProps={
  board:readonly Card[];street:string;winningCards?:readonly Card[];ownCards:readonly Card[]
  stack:number;position:string;handLabel:string;status:string|undefined;detail:string|undefined;withActions:boolean
}
export function TableReadout(p:TableReadoutProps) {
  return <>
    <CommunityBoard board={p.board} street={p.street} winningCards={p.winningCards} />
    <div className="bankroll-tag"><span>YOUR STACK{p.position}</span><strong>{chips(p.stack)}</strong><small>{p.handLabel}</small></div>
    <div className="sr-only" aria-label="Your hand">{p.ownCards.map(c=><PlayingCard card={c} key={c} />)}</div>
    <div className={`table-whisper ${p.withActions?'with-actions':''}`} role="status" aria-live="polite"><strong>{p.status}</strong><small>{p.detail}</small></div>
  </>
}
