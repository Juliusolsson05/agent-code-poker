import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync, readdirSync } from 'node:fs'
import { BettingControls } from '../src/components/BettingControls'

// Synthetic render contracts only: these do not claim actual focus, responsive
// layout, key-repeat ordering or screenshots. CUA sessions must verify those.
test('betting entry exposes keyboard and pointer actions without numeric inputs', () => {
  const props = { revision: 1, blocked: false, legal: { fold: true, check: false, call: 20, raise: true, min: 40, max: 2000, shortOnly: false },
    pot: 90, currentBet: 20, ownBet: 0, bigBlind: 20, onAction: () => false, onOpenChange: () => {}, focusTable: () => {} }
  const html = renderToStaticMarkup(createElement(BettingControls, props))
  for (const text of ['Fold', 'Call 20', 'Raise', '<kbd>F</kbd>', '<kbd>C</kbd>', '<kbd>B</kbd>']) assert.ok(html.includes(text))
  assert.equal((html.match(/<button/g) ?? []).length, 3)
  assert.ok(!html.includes('<input'))
  assert.match(html, /aria-expanded="false"/)
  const blocked = renderToStaticMarkup(createElement(BettingControls, { ...props, blocked: true }))
  assert.equal((blocked.match(/disabled=""/g) ?? []).length, 3)
})

test('draft core has no dependencies and BettingControls is its sole runtime consumer', () => {
  const root = new URL('../src/', import.meta.url)
  const core = readFileSync(new URL('interaction/betting/controller.ts', root), 'utf8')
  assert.ok(!/^import\s/m.test(core), 'isolated draft must not reach rules, timers, DOM or scene')
  const consumers: string[] = []
  for (const entry of readdirSync(root, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !/\.tsx?$/.test(entry.name)) continue
    const path = `${entry.parentPath}/${entry.name}`
    if (/from ['"][^'"]*interaction\/betting\//.test(readFileSync(path, 'utf8'))) consumers.push(entry.name)
  }
  assert.deepEqual(consumers, ['BettingControls.tsx'])
})

test('normal solo play cannot silently fall back to the legacy amount owner', () => {
  // Wiring guard for the observed source/shipped divergence, not proof of
  // keyboard focus. The real browser recordings carry that separate evidence.
  const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8')
  assert.match(app,/<BettingControls ref=\{betting\}/)
  assert.doesNotMatch(app,/betkeys|keyboardBetting|setRaiseTo|raise-slider|id="raise-size"/)
})
