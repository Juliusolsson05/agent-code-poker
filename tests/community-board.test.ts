import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CommunityBoard } from '../src/components/CommunityBoard'
import { cardLabel, type Card } from '../src/engine/cards'

// These are explicitly synthetic render-contract cases, not screenshots or
// browser layout approval. The component cannot receive private state at all.
test('public corner board always renders five readable slots across streets and reset', () => {
  const dealt: Card[] = [0, 14, 28, 42, 12]
  for (const [count, street] of [[0, 'Pre-flop'], [3, 'Flop'], [4, 'Turn'], [5, 'River'], [0, 'Pre-flop']] as const) {
    const board = dealt.slice(0, count)
    const html = renderToStaticMarkup(createElement(CommunityBoard, { board, street }))
    assert.match(html, /aria-label="Community cards"/)
    assert.ok(html.includes(`<strong>${street}</strong>`))
    assert.equal((html.match(/class="playing-card /g) ?? []).length, count)
    assert.equal((html.match(/class="empty-card"/g) ?? []).length, 5 - count)
    for (const card of board) assert.ok(html.includes(`aria-label="${cardLabel(card)}"`))
    assert.ok(!html.includes('<button'), 'the board has no toggle to accidentally hide it')
    assert.deepEqual(board, dealt.slice(0, count), 'presenter cannot change the engine board')
  }
})

test('winning highlights apply only to actually dealt public cards', () => {
  const html = renderToStaticMarkup(createElement(CommunityBoard, { board: [0, 14, 28], street: 'Flop', winningCards: [0, 51] }))
  assert.equal((html.match(/ winning /g) ?? []).length, 1)
  assert.ok(!html.includes(`aria-label="${cardLabel(51)}"`))
})
