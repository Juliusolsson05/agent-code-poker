import type { Card } from '../engine/cards'
import { PlayingCard } from './PlayingCard'

/** This persistent readout replaces the hidden board popover. Accept only
 * public cards, not the engine snapshot: a convenient future restyle must not
 * accidentally reveal hole cards or the undealt deck. Five stable slots make
 * preflop and street transitions legible without competing with the 3D table.
 * No open state or pointer handlers: drinking/inspection cannot hide it. */
export function CommunityBoard({ board, street, winningCards = [] }: {
  board: readonly Card[]; street: string; winningCards?: readonly Card[]
}) {
  return <section className="community-board" aria-label="Community cards">
    <header><span>THE BOARD</span><strong>{street}</strong></header>
    <div className="board-cards">{Array.from({ length: 5 }, (_, i) => board[i] !== undefined
      ? <PlayingCard key={i} card={board[i]} small highlight={winningCards.includes(board[i])} />
      : <span className="empty-card" key={i} aria-label={`${i < 3 ? `Flop ${i + 1}` : i === 3 ? 'Turn' : 'River'} not dealt`}>{i < 3 ? '·' : i === 3 ? 'T' : 'R'}</span>)}</div>
  </section>
}
