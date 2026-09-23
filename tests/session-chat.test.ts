import test from 'node:test'
import assert from 'node:assert/strict'
import { CHAT_LIMITS, HostTable, chatText } from '../src/session/HostTable'

// Clock-injected packets against the in-process owner. They prove the chat
// authority contract; the HTTP path is in lan-chat-http.test.ts and two real
// browsers are in the recorded acceptance run.
const ids = Array.from({ length: 6 }, (_, seat) => ({ id: `principal-${seat}`, name: `Guest ${seat}` }))
function table(humans = 3) {
  let clock = 50_000
  const t = new HostTable(ids[0], { random: () => .43, now: () => clock })
  ids.slice(1, humans).forEach(p => t.join(p.id, p.name))
  t.start(ids[0].id, t.view(ids[0].id).revision)
  return { t, advance: (ms: number) => { clock += ms } }
}

test('an accepted line reaches every viewer with the sender seat rotated per viewer, and nothing private', () => {
  const { t, advance } = table()
  const receipt = t.chat(ids[2].id, { text: '  nice   hand  ' })
  assert.equal(receipt.code, 'accepted'); assert.ok(Number.isSafeInteger(receipt.seq))
  advance(1500)
  for (const viewer of [0, 1, 2]) {
    const [line] = t.view(ids[viewer].id).chat
    // Exact key set: the allowlist is the contract. A member id here would be
    // the principal behind a bearer token.
    assert.deepEqual(Object.keys(line).sort(), ['ageMs', 'displaySeat', 'name', 'seat', 'seq', 'text', 'voice'])
    assert.equal(line.text, 'nice hand'); assert.equal(line.name, 'Guest 2'); assert.equal(line.seat, 2)
    assert.equal(line.displaySeat, (2 - viewer + 6) % 6); assert.equal(line.ageMs, 1500); assert.equal(line.voice, false)
    assert.ok(!JSON.stringify(t.view(ids[viewer].id)).includes('principal-'), 'no principal id in any view')
  }
})

test('text is plain, bounded and single-line; markup stays literal text', () => {
  assert.equal(chatText('x'.repeat(CHAT_LIMITS.maxChars)), 'x'.repeat(CHAT_LIMITS.maxChars))
  assert.equal(chatText('x'.repeat(CHAT_LIMITS.maxChars + 1)), null)
  // Code points, not UTF-16 units: 200 emoji are 200 characters.
  assert.equal([...chatText('🂡'.repeat(CHAT_LIMITS.maxChars))!].length, CHAT_LIMITS.maxChars)
  assert.equal(chatText('<script>alert(1)</script>'), '<script>alert(1)</script>', 'stored as typed; renderers use text nodes')
  for (const bad of ['', '   ', 'two\nlines', 'tab\there', 'rtl‮override', 'zero​width', 42, null, 'x'.repeat(5000)])
    assert.equal(chatText(bad), null, JSON.stringify(bad))
  const { t } = table()
  for (const forged of [{ text: 'hi', seat: 5 }, { text: 'hi', name: 'Host' }, { message: 'hi' }, 'hi', null, ['hi']])
    assert.equal(t.chat(ids[1].id, forged).code, 'invalid', JSON.stringify(forged))
})

test('a per-member bucket allows a burst, then one line per refill; other members are unaffected', () => {
  const { t, advance } = table()
  for (let i = 0; i < CHAT_LIMITS.burst; i++) assert.equal(t.chat(ids[1].id, { text: `line ${i}` }).code, 'accepted')
  assert.equal(t.chat(ids[1].id, { text: 'flood' }).code, 'rate-limited')
  assert.equal(t.chat(ids[2].id, { text: 'me too' }).code, 'accepted', 'buckets are per member')
  advance(CHAT_LIMITS.refillMs - 1); assert.equal(t.chat(ids[1].id, { text: 'early' }).code, 'rate-limited')
  advance(1); assert.equal(t.chat(ids[1].id, { text: 'refilled' }).code, 'accepted')
})

test('chat never consumes the wager sequence, the table revision or the private checkpoint', () => {
  const { t } = table()
  const before = t.view(ids[1].id), checkpoint = JSON.stringify(t.exportHostCheckpoint())
  assert.equal(t.chat(ids[1].id, { text: 'hello' }).code, 'accepted')
  const after = t.view(ids[1].id)
  assert.equal(after.revision, before.revision); assert.equal(after.self.nextSequence, before.self.nextSequence)
  assert.equal(JSON.stringify(t.exportHostCheckpoint()), checkpoint, 'volatile: not in the host checkpoint')
})

test('who may talk: queued players yes, unknown/leaving/disconnected no; the log is bounded and ages out', () => {
  const { t, advance } = table()
  t.join('late-arrival', 'Late')
  assert.equal(t.chat('late-arrival', { text: 'waiting for next hand' }).code, 'accepted')
  assert.equal(t.chat('principal-unknown', { text: 'hi' }).code, 'unauthorized')
  t.disconnect(ids[2].id); assert.equal(t.chat(ids[2].id, { text: 'hi' }).code, 'disconnected')
  t.leave(ids[1].id); assert.equal(t.chat(ids[1].id, { text: 'bye' }).code, 'unauthorized')
  for (let i = 0; i < CHAT_LIMITS.keep + 5; i++) { advance(CHAT_LIMITS.refillMs); t.chat(ids[0].id, { text: `n${i}` }) }
  const lines = t.view(ids[0].id).chat
  assert.equal(lines.length, CHAT_LIMITS.project)
  assert.equal(lines.at(-1)!.text, `n${CHAT_LIMITS.keep + 4}`)
  assert.ok(lines.every((line, i) => i === 0 || line.seq > lines[i - 1].seq), 'seq is monotonic')
  advance(CHAT_LIMITS.maxAgeMs + 1); assert.deepEqual(t.view(ids[0].id).chat, [])
})

test('chatSender names the line owner for the voice relay, and the voiced flag comes from the transport', () => {
  const { t } = table()
  const seq = t.chat(ids[2].id, { text: 'speak' }).seq!
  assert.equal(t.chatSender(seq)!.memberId, ids[2].id)
  assert.equal(t.chatSender(seq + 1), null)
  assert.equal(t.view(ids[0].id, { voiced: s => s === seq }).chat[0].voice, true)
})
