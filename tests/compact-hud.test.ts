import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

type Rect = { left: number; right: number; top: number; bottom: number }
const load = (file: string) => JSON.parse(readFileSync(new URL('../testing/fixtures/experience/' + file, import.meta.url), 'utf8'))
const overlaps = (a: Rect, b: Rect) => Math.min(a.right,b.right)>Math.max(a.left,b.left) && Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top)

test('actual compact browser baseline reproduces both hidden-board and metadata collisions', () => {
  // A box audit preserves the observed failure independent of later CSS. It is
  // not a CSS layout engine: new acceptance needs fresh real browser bounds,
  // and these original bad boxes must never be rewritten into a passing golden.
  const {rects:r}=load('compact-hud-before.json')
  assert.ok(overlaps(r['community-board'],r['betting-tray']))
  assert.ok(overlaps(r['table-info'],r['room-top-right']))
  assert.ok(r['betting-tray'].right-r['community-board'].left>60)
})

for(const mode of ['source','production'])test(`actual accepted compact ${mode} boxes leave board, stack and decisions separately readable`, () => {
  const {rects:r,viewport:[width,height]}=load(`compact-hud-${mode}.json`)
  for(const [a,b] of [['community-board','betting-tray'],['table-info','room-top-right'],['bankroll-tag','betting-tray'],['bankroll-tag','community-board'],['bankroll-tag','quick-actions']]) {
    assert.equal(overlaps(r[a],r[b]),false,`${a} overlaps ${b}`)
  }
  for(const [name,rect] of Object.entries(r) as [string,Rect][]){
    assert.ok(rect.left>=0&&rect.right<=width&&rect.top>=0&&rect.bottom<=height,`${name} outside viewport`)
  }
  // This protects the recorded acceptance, not future stylesheet rendering.
  // A new CSS change still requires the real CUA source/shipped layout check.
})
