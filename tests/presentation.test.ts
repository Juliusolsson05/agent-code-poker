import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import * as THREE from 'three'
import { PokerGame, type Action } from '../src/engine/game'
import { projectTable } from '../src/session/view'
import { RoomProjection } from '../src/presentation/RoomProjection'
import { CardField } from '../src/scene/Cards'
import { ChipLedger } from '../src/scene/ChipLedger'
import { SEATS } from '../src/scene/environment/layout'
import { TABLE } from '../src/scene/Table'

test('recorded public wagers retain chip accounts and folded paper through all six display rotations', () => {
  const trace = JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T05-52-49-020Z.json.gz', import.meta.url))).toString())
  const events = trace.entries.filter((e: any) => e.kind === 'public-game')
  const game = new PokerGame(() => .43); game.startHand()
  for (const seat of [3,4,5]) game.act(seat, {type:'call'})
  game.act(0, {type:'raise', to:500})
  const follow: Action[] = [{type:'fold'}, {type:'fold'}, {type:'fold'}, {type:'call'}, {type:'call'}]
  const viewers = Array.from({length:6}, () => ({ projection:new RoomProjection(), chips:new ChipLedger(),
    cards:new CardField(SEATS, () => new THREE.Texture() as THREE.CanvasTexture) }))
  events.forEach((event: any, index: number) => {
    if (index > 0 && index <= 5) game.act(index, follow[index-1])
    if (index === 6) game.advance()
    if (index > 6) game.act(index-3, {type:'check'})
    viewers.forEach(({projection,chips,cards}, viewer) => {
      const scene = projection.remote(projectTable(game.snapshot(), viewer, game.legal(viewer)), viewer)
      assert.equal(scene.actor, event.data.actor === null ? null : (event.data.actor-viewer+6)%6)
      const inventory = chips.sync(scene); cards.update(scene,index*3); cards.frame(index*3+2,true)
      for (const actual of event.data.players) {
        const display = (actual.seat-viewer+6)%6, p = scene.players[display]
        assert.equal(p.sourceSeat,actual.seat); assert.equal(p.stack,actual.stack); assert.equal(p.folded,actual.folded)
        assert.equal(inventory.filter(c=>c.account===`bank:${display}`).reduce((n,c)=>n+c.value,0),actual.stack)
        assert.equal(inventory.filter(c=>c.account===`bet:${display}`).reduce((n,c)=>n+c.value,0),actual.bet)
        if (actual.folded) for (let i=0;i<2;i++) {
          const paper=cards.root.getObjectByName(`seat:${display}:${i}`)!
          assert.ok(paper.visible); assert.ok(paper.position.y>=TABLE.cardY)
        }
      }
      assert.equal(inventory.reduce((n,c)=>n+c.value,0),12000)
      assert.equal(scene.players[0].sourceSeat,viewer)
    })
  })
  assert.equal(events.length,9)
})

test('synthetic queued viewer cannot request old NPC card faces through inspection', () => {
  const game=new PokerGame(()=>.43); game.startHand()
  const scene=new RoomProjection().remote(projectTable(game.snapshot(),null,game.legal(null),2),2)
  const faces:(number|null)[]=[], cards=new CardField(SEATS, value=>{faces.push(value);return new THREE.Texture() as THREE.CanvasTexture})
  cards.update(scene,0); cards.setInspection(true); cards.frame(3,true)
  assert.ok(faces.every(v=>v===null)); assert.equal(scene.players[0].cards.kind,'hidden')
  assert.equal(cards.root.children.filter(c=>c.name==='player-inspection-card' && c.visible).length,0)
  for(const secret of ['deck','cursor','pending','history','hole']) assert.equal(JSON.stringify(scene).includes(`"${secret}"`),false)
})

test('synthetic private renderer input never contains opponent values and copies allowed arrays', () => {
  const game=new PokerGame(()=>.43);game.startHand()
  const original=game.snapshot(), projection=new RoomProjection(), scene=projection.solo(original)
  assert.deepEqual(scene.players[0].cards,{kind:'visible',values:original.players[0].hole})
  assert.ok(scene.players.slice(1).every(p=>p.cards.kind==='hidden'))
  if(scene.players[0].cards.kind==='visible') scene.players[0].cards.values.reverse()
  assert.deepEqual(original,game.snapshot())
  assert.equal('deck' in scene,false)
  const duplicate=projection.solo(original)
  assert.equal(duplicate.dealId,scene.dealId)
  const replacement=structuredClone(original);replacement.deck.reverse()
  assert.notEqual(projection.solo(replacement).dealId,scene.dealId,'replacement hand with same number must clear old paper')
})

test('synthetic public showdown rotation maps awards to display seats without rewriting authority', () => {
  const game=new PokerGame(()=>.43,[200,100,50,200,100,50]);game.startHand()
  while(game.snapshot().phase!=='complete') {
    const s=game.snapshot(),l=game.legal()
    if(s.phase==='betting')game.act(s.actor!,l.raise?{type:'raise',to:l.max}:{type:l.call?'call':'check'})
    else game.advance()
  }
  const original=game.snapshot()
  for(let viewer=0;viewer<6;viewer++) {
    const wire=projectTable(original,viewer,game.legal(viewer)), copy=structuredClone(wire)
    const scene=new RoomProjection().remote(wire,viewer)
    assert.equal(scene.publicShowdown,true)
    assert.equal(scene.dealer,(original.dealer-viewer+6)%6)
    assert.deepEqual(scene.results.map(r=>r.seat),original.results.map(r=>(r.seat-viewer+6)%6))
    assert.deepEqual(wire,copy,'presentation must never rotate an authoritative input in place')
  }
})
