import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { LeisureControls, leisureShortcut } from '../server/client/LeisureControls'

const ready = { blocked:false, available:true, menuOpen:false }
const callbacks = { onSmoke:()=>{}, onSip:()=>{}, onMenuChange:()=>{}, onOrder:()=>{} }
test('LAN leisure exposes the existing authored drinks without a chip purchase or new animation owner', () => {
  const markup = renderToStaticMarkup(createElement(LeisureControls, { ...ready, ...callbacks, kind:'old-fashioned' }))
  assert.match(markup, /Cigar.*<kbd>S<\/kbd>/)
  assert.match(markup, /Old Fashioned.*<kbd>D<\/kbd>/)
  assert.match(markup, /aria-expanded="false"/)
  const opened = renderToStaticMarkup(createElement(LeisureControls, { ...ready, ...callbacks, kind:'water', menuOpen:true }))
  for (const text of ['Old Fashioned','Winter ale','Red wine','Water','No chips spent.']) assert.ok(opened.includes(text))
  assert.match(opened, /aria-label="Drink menu"/)
})

// New event/focus inputs are synthetic. These assertions are not a browser
// key/focus recording or proof that the unreviewed hand art looks correct.
test('S/D shortcuts are table-only deliberate requests, never typing or held-key repeat', () => {
  assert.equal(leisureShortcut({key:'S'},'table',ready), 'smoke')
  assert.equal(leisureShortcut({key:'d'},'table',ready), 'drink')
  for (const key of ['f','c','b',' ','Escape']) assert.equal(leisureShortcut({key},'table',ready), null)
  for (const target of ['editing','control'] as const) assert.equal(leisureShortcut({key:'s'},target,ready), null)
  for (const field of ['repeat','ctrlKey','altKey','metaKey','isComposing']) {
    assert.equal(leisureShortcut({key:'d',[field]:true},'table',ready), null)
  }
  for (const context of [{...ready,blocked:true},{...ready,available:false},{...ready,menuOpen:true}]) {
    assert.equal(leisureShortcut({key:'d'},'table',context), null)
    const markup=renderToStaticMarkup(createElement(LeisureControls,{...context,...callbacks,kind:'old-fashioned'}))
    assert.match(markup, /<button[^>]*disabled=""[^>]*>Cigar/)
    assert.match(markup, /<button[^>]*disabled=""[^>]*>Old Fashioned/)
  }
})

test('blocked ordering cannot be enabled by a stale animation availability callback', () => {
  const markup=renderToStaticMarkup(createElement(LeisureControls,{...ready,...callbacks,kind:'wine',blocked:true,menuOpen:true}))
  assert.equal((markup.match(/aria-pressed="(?:true|false)"/g)??[]).length,4)
  assert.equal((markup.match(/disabled=""/g)??[]).length,7, 'three entry controls and all four orders disabled')
})
