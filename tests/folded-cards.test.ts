import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import * as THREE from 'three'
import { CardField } from '../src/scene/Cards'
import { PokerGame, type GameState } from '../src/engine/game'
import { SEATS } from '../src/scene/environment/layout'
import { TABLE } from '../src/scene/Table'
import { RoomProjection } from '../src/presentation/RoomProjection'
const projection = new RoomProjection()

const trace = JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T04-02-22-844Z.json.gz', import.meta.url))).toString())
const events = trace.entries.filter((entry: any) => entry.kind === 'public-game')
test('actual candidate browser trace retains every settled folded back on the felt', () => {
  const actual = JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T05-52-49-020Z.json.gz', import.meta.url))).toString())
  assert.equal(actual.truncated, false)
  const game = actual.entries.filter((e: any) => e.kind === 'public-game').at(-1)
  const seats = game.data.players.filter((p: any) => p.folded).map((p: any) => p.seat)
  assert.deepEqual(seats, [1, 2, 3])
  // Measured renderer transforms, not replay-generated positions. Wait beyond
  // the final decision to test settled ownership, not a legitimate flight.
  // The accompanying PNG is necessary: positions alone cannot approve art.
  const poses = actual.entries.filter((e: any) => e.kind === 'pose' && e.visualSeconds > game.visualSeconds + 1)
  assert.ok(poses.length > 10)
  for (const pose of poses) {
    const cards = pose.data.tableCards.filter((c: any) => seats.some((s: number) => c.key.startsWith(`seat:${s}:`)))
    assert.equal(cards.length, 6)
    for (const card of cards) {
      assert.equal(card.visible, true); assert.equal(card.moving, false)
      assert.ok(card.position[1] > actual.metadata.scene.table.feltY)
    }
    assert.equal(new Set(cards.map((c: any) => c.position[1])).size, 6)
  }
})
// These real events capture two preflop opponent folds. Private values were
// correctly excluded by the recorder. Fill only the renderer's required shape
// with synthetic engine cards; asserting no face-texture request prevents those
// placeholders from becoming invented evidence about the original deal.
const seed = new PokerGame(() => .43); seed.startHand()
function stateOf(entry: any): GameState {
  const state = seed.snapshot()
  state.handNumber = entry.data.hand; state.phase = entry.data.phase; state.actor = entry.data.actor
  state.players.forEach((player, i) => Object.assign(player, entry.data.players[i]))
  return state
}
function field() {
  const requested: (number | null)[] = [], texture = new THREE.Texture() as THREE.CanvasTexture
  return { cards: new CardField(SEATS, card => { requested.push(card); return texture }), requested }
}
function assertFelt(mesh: THREE.Object3D) {
  assert.ok(mesh.visible, 'folded cards must remain visible after landing')
  mesh.updateWorldMatrix(true, false)
  for (const x of [-.052, .052]) for (const y of [-.0725, .0725]) {
    const corner = mesh.localToWorld(new THREE.Vector3(x, y, 0))
    assert.ok(corner.y >= TABLE.cardY - 1e-8, 'paper corner crossed the felt')
  }
}

test('recorded opponent folds settle face-down and survive later decisions', () => {
  const { cards, requested } = field()
  for (const entry of events) {
    cards.frame(entry.visualSeconds, false)
    cards.update(projection.solo(stateOf(entry)), entry.visualSeconds)
    cards.frame(entry.visualSeconds + 1, false)
    for (const player of entry.data.players.filter((p: any) => p.folded)) {
      for (let i = 0; i < 2; i++) assertFelt(cards.root.children[player.seat * 2 + i])
    }
  }
  assert.equal(events.at(-1).data.players.filter((p: any) => p.folded).length, 2)
  assert.ok(requested.every(card => card === null), 'folding must never request a private face')
  const papers = cards.root.children.filter(mesh => mesh.visible)
  assert.equal(papers.length, 4)
  assert.equal(new Set(papers.map(mesh => mesh.position.y)).size, 4, 'overlapping discard faces need distinct layers')
})

test('restoring the recorded folded state settles immediately without a phantom hand flight', () => {
  const { cards, requested } = field(), state = stateOf(events.at(-1))
  cards.update(projection.solo(state), 100)
  const papers = cards.root.children.filter(mesh => mesh.name.startsWith('seat:4:') || mesh.name.startsWith('seat:5:'))
  assert.equal(papers.length, 4)
  for (const paper of papers) { assertFelt(paper); assert.ok(paper.position.y < TABLE.cardY + .01) }
  const before = papers.map(mesh => mesh.position.toArray())
  cards.update(projection.solo(state), 100); cards.frame(100, false)
  assert.deepEqual(papers.map(mesh => mesh.position.toArray()), before, 'pause/duplicate projection cannot restart folds')
  assert.ok(requested.every(card => card === null))
})

test('synthetic fast-fold boundary supersedes pending deal ownership and clears on next hand', () => {
  const { cards } = field(), state = stateOf(events[0])
  cards.update(projection.solo(state), 0)
  const folded = structuredClone(state); folded.players[5].folded = true; cards.update(projection.solo(folded), .01)
  for (const time of [.2, .5, .9, 1.5, 3]) {
    cards.frame(time, false)
    const papers = cards.root.children.slice(10, 12)
    if (time >= .9) papers.forEach(assertFelt)
  }
  const next = stateOf(events[0]); next.handNumber++
  cards.update(projection.solo(next), 4); cards.frame(10, true)
  assert.equal(cards.root.children.length, 12, 'new hand must replace rather than accumulate paper')
  assert.ok(cards.root.children.every(mesh => !mesh.visible), 'new cards are held, not stale discards')
})

test('synthetic reduced-motion fold settles both backs despite the normal stagger delay', () => {
  const { cards } = field()
  cards.update(projection.solo(stateOf(events[1])), 0); cards.frame(2, true)
  cards.update(projection.solo(stateOf(events[2])), 3); cards.frame(3, true)
  cards.root.children.slice(8, 10).forEach(assertFelt)
})
