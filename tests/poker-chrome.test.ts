import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { HostTable } from '../src/session/HostTable'
import { TableReadout, SeatContents } from '../src/components/PokerChrome'
import { cardLabel } from '../src/engine/cards'
import { TAVERN_FEATURES } from '../src/scene/environment/features'

test('shared readout renders only the authenticated viewer hand and public board through seat rotations',()=>{
  const table=new HostTable({id:'host',name:'Host'},{random:()=>.37})
  table.join('guest','Guest');table.start('host',table.view('host').revision)
  for(const id of ['host','guest']) {
    const v=table.view(id),own=v.players[v.self.seat]
    const ownCards=own.cards.kind==='visible'?own.cards.values:[]
    const html=renderToStaticMarkup(createElement(TableReadout,{board:v.board,street:'Pre-flop',ownCards,stack:own.stack,position:'',handLabel:'Practice chips',status:'Your move.',detail:undefined,withActions:true}))
    assert.match(html,/class="community-board"/);assert.match(html,/class="bankroll-tag"/)
    assert.match(html,/class="table-whisper with-actions"/)
    assert.equal((html.match(/class="playing-card /g)||[]).length,2)
    for(const card of ownCards)assert.ok(html.includes(`aria-label="${cardLabel(card)}"`))
    for(const p of v.players.filter(p=>p.seat!==v.self.seat)) {
      const label=renderToStaticMarkup(createElement(SeatContents,{name:'<script>not HTML</script>',dealer:false,blind:'',stack:p.stack,action:p.action,visibleCards:p.cards.kind==='visible'?p.cards.values:[]}))
      assert.doesNotMatch(label,/class="playing-card |<script>/)
      assert.match(label,/&lt;script&gt;/)
    }
  }
})

test('original and LAN controllers share presentation and the product fireplace does not depend on DEV',()=>{
  const text=(file:string)=>readFileSync(new URL('../'+file,import.meta.url),'utf8')
  for(const file of ['src/App.tsx','server/client/client.js'])assert.match(text(file),/PokerChrome/)
  assert.match(text('server/client/client.js'),/src\/styles\.css/)
  assert.equal(TAVERN_FEATURES.fireplace,true)
  assert.match(text('src/scene/Room.ts'),/experimentalFireplace = TAVERN_FEATURES.fireplace/)
  assert.doesNotMatch(text('src/App.tsx'),/import\.meta\.env\.DEV \? fireplaceRecording/)
})
