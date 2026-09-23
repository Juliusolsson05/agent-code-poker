import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { LeisureControls, leisureShortcut } from '../server/client/LeisureControls'
import { DRINKS, DRINK_SECTIONS, TREATS } from '../src/scene/props/specs'

const escape = (text: string) => text.replaceAll('&', '&amp;')
const ORDERABLE = Object.keys(DRINKS).length + Object.keys(TREATS).length

const ready = { blocked:false, available:true, menuOpen:false }
const callbacks = { onSmoke:()=>{}, onSip:()=>{}, onMenuChange:()=>{}, onOrder:()=>{} }
test('LAN leisure exposes the existing authored drinks without a chip purchase or new animation owner', () => {
  const markup = renderToStaticMarkup(createElement(LeisureControls, { ...ready, ...callbacks, kind:'old-fashioned' }))
  assert.match(markup, /Cigar.*<kbd>S<\/kbd>/)
  assert.match(markup, /Old Fashioned.*<kbd>D<\/kbd>/)
  assert.match(markup, /aria-expanded="false"/)
  const opened = renderToStaticMarkup(createElement(LeisureControls, { ...ready, ...callbacks, kind:'water', menuOpen:true }))
  // Every authored drink and treat is orderable on LAN too, grouped under
  // labelled sections (#13/#14). Driven from specs, so a new kind is checked.
  for (const text of [...Object.values(DRINKS).map(d => d.label), ...Object.values(TREATS).map(t => t.label), 'No chips spent.'])
    assert.ok(opened.includes(escape(text)), text)
  for (const section of [...DRINK_SECTIONS.map(s => s.title), 'Curiosities']) assert.ok(opened.includes(escape(section)), section)
  assert.equal((opened.match(/role="group"/g) ?? []).length, DRINK_SECTIONS.length + 1)
  assert.match(opened, /aria-label="Drink menu"/)
})

// New event/focus inputs are synthetic. These assertions are not a browser
// key/focus recording or proof that the unreviewed hand art looks correct.
test('S/D shortcuts are table-only deliberate requests, never typing or held-key repeat', () => {
  assert.equal(leisureShortcut({key:'S'},'table',ready), 'smoke')
  assert.equal(leisureShortcut({key:'d'},'table',ready), 'drink')
  assert.equal(leisureShortcut({key:'E'},'table',ready), 'consume')
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
  // Was 4 orders / 7 disabled when the menu had four drinks. Now every
  // drink and treat (18) must be disabled together with the two entry
  // controls; the Drinks toggle is disabled too because blocked=true.
  assert.equal((markup.match(/aria-pressed="(?:true|false)"/g)??[]).length,ORDERABLE)
  assert.equal((markup.match(/disabled=""/g)??[]).length,3+ORDERABLE, 'three entry controls and every order disabled')
})

test('a treat on the table adds an E control gated by the director, never by the menu', () => {
  const markup=renderToStaticMarkup(createElement(LeisureControls,{...ready,...callbacks,kind:'old-fashioned',treat:{kind:'mushrooms',remaining:2},canConsume:true}))
  assert.match(markup, /Mushrooms · 2 <kbd>E<\/kbd>/)
  assert.doesNotMatch(markup, /disabled=""[^>]*>Mushrooms/)
  const empty=renderToStaticMarkup(createElement(LeisureControls,{...ready,...callbacks,kind:'old-fashioned',treat:{kind:'lsd',remaining:0},canConsume:false}))
  assert.match(empty, /<button[^>]*disabled=""[^>]*>LSD · 0/)
  const none=renderToStaticMarkup(createElement(LeisureControls,{...ready,...callbacks,kind:'old-fashioned'}))
  assert.doesNotMatch(none, /<kbd>E<\/kbd>/)
})
