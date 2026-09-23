import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { HostTable } from '../src/session/HostTable'
import { ChatBubble, ChatLog, FeatureSwitches, VoiceSettingsPanel, bubbleFor, bubbleMs, chatShortcut } from '../server/client/ChatControls'
import { leisureShortcut } from '../server/client/LeisureControls'

test('chat renders another player\'s markup as text in the log and the bubble; the log is a polite live region', () => {
  let clock = 1000
  const t = new HostTable({ id: 'host', name: 'Host' }, { now: () => clock })
  t.join('guest', '<b>Guest</b>'); t.start('host', t.view('host').revision)
  t.chat('guest', { text: '<img src=x onerror=alert(1)>' }); clock += 500
  const lines = t.view('host').chat
  const log = renderToStaticMarkup(createElement(ChatLog, { lines, status: '' }))
  assert.match(log, /<ol aria-live="polite" aria-relevant="additions">/)
  assert.match(log, /&lt;b&gt;Guest&lt;\/b&gt;/); assert.match(log, /&lt;img src=x onerror=alert\(1\)&gt;/)
  assert.doesNotMatch(log, /<img|<b>Guest/)
  const bubble = bubbleFor(lines, 1)!
  const html = renderToStaticMarkup(createElement(ChatBubble, { line: bubble }))
  assert.equal(html, '<div class="chat-bubble start" aria-hidden="true">&lt;img src=x onerror=alert(1)&gt;</div>', 'announced once, by the log; grows inward from a left seat')
  // The sender sees its own line labelled "You", not its display name.
  assert.match(renderToStaticMarkup(createElement(ChatLog, { lines: t.view('guest').chat, status: '' })), /<b>You<\/b>/)
})

test('a bubble shows only the newest line of that seat, and only while it is fresh', () => {
  const line = (seq: number, displaySeat: number, ageMs: number, text = 'hi') => ({ seq, seat: displaySeat, displaySeat, name: 'P', text, ageMs, voice: false })
  assert.equal(bubbleFor([line(1, 2, 10), line(2, 2, 5, 'newer')], 2)!.text, 'newer')
  assert.equal(bubbleFor([line(1, 2, 10)], 3), null)
  assert.equal(bubbleFor([line(1, 2, bubbleMs('hi'))], 2), null, 'expired')
  assert.equal(bubbleFor([line(1, 2, 0), line(2, 2, bubbleMs('hi') + 1)], 2), null, 'an expired newer line is not replaced by an older one')
  assert.ok(bubbleMs('x'.repeat(200)) <= 14_000)
})

test('T opens chat only from the table and never collides with an existing gameplay key', () => {
  const context = { blocked: false, available: true, menuOpen: false }
  assert.equal(chatShortcut({ key: 't' }, 'table', false), true)
  assert.equal(chatShortcut({ key: 'T' }, 'table', false), true)
  for (const [event, target, blocked] of [[{ key: 't' }, 'editing', false], [{ key: 't' }, 'control', false], [{ key: 't' }, 'table', true],
    [{ key: 't', repeat: true }, 'table', false], [{ key: 't', metaKey: true }, 'table', false], [{ key: 't', isComposing: true }, 'table', false]] as const)
    assert.equal(chatShortcut(event, target, blocked), false, JSON.stringify([event, target, blocked]))
  // No existing key opens chat, and T triggers no leisure action.
  for (const key of ['f', 'c', 'b', 'm', 's', 'd', 'e', 'r', ' ', 'Escape', 'Enter', '1', '2', '3', '4', 'ArrowUp'])
    assert.equal(chatShortcut({ key }, 'table', false), false, key)
  assert.equal(leisureShortcut({ key: 't' }, 'table', context), null)
  const source = readFileSync(new URL('../src/interaction/betting/controller.ts', import.meta.url), 'utf8')
  assert.doesNotMatch(source, /key === 't'/, 'the wager tray does not claim T')
})

test('host switches are buttons for the host and read-only facts for guests', () => {
  const features = { voices: true, treats: false }
  const host = renderToStaticMarkup(createElement(FeatureSwitches, { isHost: true, features, pending: false, onChange: () => {} }))
  assert.equal((host.match(/<button/g) || []).length, 2); assert.match(host, /aria-pressed="true"/)
  const guest = renderToStaticMarkup(createElement(FeatureSwitches, { isHost: false, features, pending: false, onChange: () => {} }))
  assert.doesNotMatch(guest, /<button/); assert.match(guest, /host decides/)
})

test('the voice panel states where the key lives and never renders a saved key', () => {
  const html = renderToStaticMarkup(createElement(VoiceSettingsPanel, { where: 'Saved in this browser’s local storage', configured: true, status: '', onSave: () => {}, onForget: () => {}, onTest: () => {} }))
  assert.match(html, /local storage/); assert.match(html, /type="password"/); assert.match(html, /value=""/)
  assert.match(html, /Test voice/)
})
