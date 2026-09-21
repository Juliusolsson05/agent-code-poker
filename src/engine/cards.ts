// A card is a compact integer so a complete saved hand fits comfortably inside
// the host's bounded JSON transport. Rank is 2..14; suits never break poker ties.
export type Card = number
export const rank = (card: Card) => card % 13 + 2
export const suit = (card: Card) => Math.floor(card / 13)
export const SUITS = ['♣', '♦', '♥', '♠'] as const
export const rankLabel = (card: Card) => ({ 11: 'J', 12: 'Q', 13: 'K', 14: 'A' }[rank(card)] ?? String(rank(card)))
export const cardLabel = (card: Card) => `${rankLabel(card)}${SUITS[suit(card)]}`
export const HAND_NAMES = ['High card', 'One pair', 'Two pair', 'Three of a kind', 'Straight', 'Flush', 'Full house', 'Four of a kind', 'Straight flush']
export type Hand = { score: number; category: number; name: string; cards: Card[] }

export function shuffledDeck(random: () => number): Card[] {
  const deck = Array.from({ length: 52 }, (_, index) => index)
  for (let i = 51; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

/** Exactly five cards. Base-15 digits retain every kicker, so equal categories
 * cannot accidentally tie when their second or fifth relevant rank differs. */
export function evaluateFive(cards: readonly Card[]): Hand {
  if (cards.length !== 5) throw new Error('A five-card hand is required.')
  const ranks = cards.map(rank).sort((a, b) => b - a)
  const counts = new Map<number, number>()
  for (const r of ranks) counts.set(r, (counts.get(r) ?? 0) + 1)
  const groups = [...counts].sort((a, b) => b[1] - a[1] || b[0] - a[0])
  const flush = cards.every(card => suit(card) === suit(cards[0]))
  const straight = counts.size === 5
    ? ranks[0] - ranks[4] === 4 ? ranks[0] : ranks.join(',') === '14,5,4,3,2' ? 5 : 0
    : 0
  let category = 0
  let kickers = ranks
  if (straight && flush) { category = 8; kickers = [straight] }
  else if (groups[0][1] === 4) { category = 7; kickers = groups.map(g => g[0]) }
  else if (groups[0][1] === 3 && groups[1][1] === 2) { category = 6; kickers = groups.map(g => g[0]) }
  else if (flush) category = 5
  else if (straight) { category = 4; kickers = [straight] }
  else if (groups[0][1] === 3) { category = 3; kickers = groups.map(g => g[0]) }
  else if (groups[0][1] === 2 && groups[1][1] === 2) { category = 2; kickers = groups.map(g => g[0]) }
  else if (groups[0][1] === 2) { category = 1; kickers = groups.map(g => g[0]) }
  let score = category
  for (let i = 0; i < 5; i++) score = score * 15 + (kickers[i] ?? 0)
  return { score, category, name: category === 8 && straight === 14 ? 'Royal flush' : HAND_NAMES[category], cards: [...cards] }
}

/** Enumerating 21 subsets makes the rules inspectable and covers playing the
 * board, two triples, and choosing a non-obvious flush kicker without special
 * cases. This bounded cost is negligible at a six-seat showdown. */
export function evaluate(cards: readonly Card[]): Hand {
  if (cards.length < 5 || cards.length > 7 || new Set(cards).size !== cards.length ||
      cards.some(c => !Number.isInteger(c) || c < 0 || c > 51)) throw new Error('Invalid poker cards.')
  let best: Hand | undefined
  for (let a = 0; a < cards.length - 4; a++)
    for (let b = a + 1; b < cards.length - 3; b++)
      for (let c = b + 1; c < cards.length - 2; c++)
        for (let d = c + 1; d < cards.length - 1; d++)
          for (let e = d + 1; e < cards.length; e++) {
            const hand = evaluateFive([cards[a], cards[b], cards[c], cards[d], cards[e]])
            if (!best || hand.score > best.score) best = hand
          }
  return best!
}
