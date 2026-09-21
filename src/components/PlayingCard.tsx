import { cardLabel, rankLabel, SUITS, suit, type Card } from '../engine/cards'

export function PlayingCard({ card, small = false, highlight = false }: { card: Card | null; small?: boolean; highlight?: boolean }) {
  return <span className={`playing-card ${small ? 'small' : ''} ${card === null ? 'back' : ''} ${highlight ? 'winning' : ''} ${card !== null && [1, 2].includes(suit(card)) ? 'red' : ''}`}
    aria-label={card === null ? 'Face-down card' : cardLabel(card)}>
    {card !== null ? <><b>{rankLabel(card)}</b><span>{SUITS[suit(card)]}</span><i>{SUITS[suit(card)]}</i></> : <span>◆</span>}
  </span>
}
