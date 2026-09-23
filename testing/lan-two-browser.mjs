// Manual two-browser LAN acceptance for visible leisure (#16). NOT part of
// `npm test`: it needs a local Google Chrome and a real GPU.
//
//   npm run lan -- --memory-only        (or any memory-only host)
//   node testing/lan-two-browser.mjs <out-dir> [origin]
//
// Two separate headless Chrome profiles play as real website clients. B
// creates the table (seat 0); two throwaway admissions take seats 1-2 and go
// idle, so bots take them over after the 15s lease; A joins at seat 3, which
// puts each player directly opposite the other. A presses S, then D, then
// orders Red wine through the real menu; B presses S. Each watcher's screen is
// streamed with Page.startScreencast (frames stamped ms-since-key-press) and
// its projected /api/state is sampled; the sender->host latency is measured
// from Node with the sender's own token.
//
// Two traps this harness already fell into, do not reintroduce them:
// - --use-angle=metal (or another real GPU backend). SwiftShader renders this
//   room at ~2.5fps; each screenshot then blocks the HOST's page for ~20s, its
//   polls stop, the host lease expires and the whole table pauses, which looks
//   exactly like leisure being refused.
// - Page.captureScreenshot in a loop forces extra renders; Room caps dt at .1s
//   per frame, so the watcher's visual clock falls behind wall time and every
//   gesture looks late. The screencast delivers frames as they are rendered.
// The CDP key dispatch itself can take ~1s on a loaded machine; judge the
// product's latency from the measured host-accept time, not from the press.
import { spawn } from 'node:child_process'
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomBytes } from 'node:crypto'

const OUT = process.argv[2], ORIGIN = process.argv[3] ?? 'http://127.0.0.1:5192'
if (!OUT) throw new Error('Usage: node testing/lan-two-browser.mjs <out-dir> [origin]')
mkdirSync(OUT, { recursive: true })
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const sleep = ms => new Promise(r => setTimeout(r, ms))
const log = (...a) => console.log(new Date().toISOString().slice(11, 23), ...a)

async function browser(port, name) {
  const profile = mkdtempSync(join(tmpdir(), `poker-${name}-`))
  const proc = spawn(CHROME, [`--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--headless=new', '--no-first-run',
    '--no-default-browser-check', '--window-size=1280,800', '--use-angle=metal',
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', 'about:blank'],
    { stdio: 'ignore' })
  let targets
  for (let i = 0; i < 50; i++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (targets.some(t => t.type === 'page')) break } catch {} await sleep(200) }
  const page = targets.find(t => t.type === 'page')
  const ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise(r => ws.addEventListener('open', r, { once: true }))
  let id = 0; const pending = new Map(), listeners = []
  ws.addEventListener('message', e => {
    const m = JSON.parse(e.data)
    if (m.id && pending.has(m.id)) { const { resolve, reject } = pending.get(m.id); pending.delete(m.id); m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result) }
    else listeners.forEach(l => l(m))
  })
  const send = (method, params = {}) => new Promise((resolve, reject) => { const n = ++id; pending.set(n, { resolve, reject }); ws.send(JSON.stringify({ id: n, method, params })) })
  const evaluate = async expression => { const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails)); return r.result.value }
  const consoleLines = []
  const self = {}
  listeners.push(m => { if (m.method === 'Page.screencastFrame') { send('Page.screencastFrameAck', { sessionId: m.params.sessionId }); self.onFrame?.(m.params) } })
  listeners.push(m => { if (m.method === 'Runtime.consoleAPICalled' || m.method === 'Runtime.exceptionThrown') consoleLines.push(JSON.stringify(m.params).slice(0, 400)) })
  await send('Runtime.enable'); await send('Page.enable')
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false })
  const shot = async file => { const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(join(OUT, file), Buffer.from(r.data, 'base64')) }
  const key = async k => {
    await evaluate(`document.getElementById('app').focus()`)
    for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: k, code: 'Key' + k.toUpperCase(), text: type === 'keyDown' ? k : undefined, windowsVirtualKeyCode: k.toUpperCase().charCodeAt(0) })
  }
  const view = () => evaluate(`(async()=>{const t=JSON.parse(sessionStorage.getItem('poker-lan-connection-test-v1')).token;return (await (await fetch('/api/state',{headers:{Authorization:'Bearer '+t}})).json()).view})()`)
  return Object.assign(self, { name, proc, send, evaluate, shot, key, view, consoleLines, close: () => proc.kill() })
}

const B = await browser(9311, 'B'), A = await browser(9312, 'A')
try {
  await B.send('Page.navigate', { url: ORIGIN + '/' }); await A.send('Page.navigate', { url: ORIGIN + '/' })
  await sleep(2500)
  await B.evaluate(`document.getElementById('name').value='Bea';document.getElementById('create').click()`)
  let code = ''
  for (let i = 0; i < 40 && !code; i++) { await sleep(250); code = (await B.evaluate(`document.getElementById('invite').textContent`)).match(/Lobby code: (\S+)/)?.[1] ?? '' }
  log('lobby', code)
  for (const name of ['Idle one', 'Idle two']) {
    const r = await fetch(ORIGIN + '/api/join', { method: 'POST', headers: { origin: ORIGIN, 'content-type': 'application/json' }, body: JSON.stringify({ name, nonce: randomBytes(32).toString('hex'), code }) })
    log('throwaway join', r.status)
  }
  await A.evaluate(`document.getElementById('name').value='Ari';document.getElementById('code').value=${JSON.stringify(code)};document.getElementById('join').click()`)
  await sleep(2500)
  log('A seat', (await A.view()).self.seat)
  await B.evaluate(`document.getElementById('start').click()`)
  await sleep(4000)
  const cigarEnabled = s => s.evaluate(`[...document.querySelectorAll('#leisure button')].map(b=>b.textContent+':'+(b.disabled?'off':'on')).join(' | ')`)
  log('A leisure controls', await cigarEnabled(A))
  await B.shot('b-00-before.png'); await A.shot('a-00-before.png')

  // Fast, zoomed captures of the opposite seat, stamped with ms since the key
  // press; the projection is read on its own slower loop so it never delays
  // a frame (and never starves the host's own polling).
  // Screencast frames are delivered as the page renders them; unlike
  // captureScreenshot they do not force extra renders, so the viewer's visual
  // clock (Room caps dt at .1s per frame) keeps pace with wall time. Each frame
  // is stamped with ms since the key press. The projection is read on its own
  // slower loop so it never delays a frame or starves the host's own polling.
  const watch = async (viewer, subjectSeat, label, seconds, t0) => {
    const samples = []
    let done = false, n = 0
    viewer.onFrame = f => {
      const ms = Date.now() - t0
      writeFileSync(join(OUT, `${label}-${String(n++).padStart(3, '0')}-${ms}ms.jpg`), Buffer.from(f.data, 'base64'))
    }
    await viewer.send('Page.startScreencast', { format: 'jpeg', quality: 85, everyNthFrame: 4 })
    const poll = (async () => { while (!done) { const v = await viewer.view(); samples.push({ ms: Date.now() - t0, leisure: v.players[subjectSeat].leisure, revision: v.revision }); await sleep(700) } })()
    while (Date.now() - t0 < seconds * 1000) await sleep(100)
    done = true; await viewer.send('Page.stopScreencast'); viewer.onFrame = null; await poll
    return samples
  }
  // Measure the sender->host leg from Node with A's own token, polling every
  // 25ms, independently of either page's render loop.
  const tokenA = await A.evaluate(`JSON.parse(sessionStorage.getItem('poker-lan-connection-test-v1')).token`)
  const hostSeq = async () => (await (await fetch(ORIGIN + '/api/state', { headers: { origin: ORIGIN, authorization: 'Bearer ' + tokenA } })).json()).view.players[3].leisure
  const before = (await hostSeq()).seq
  log('A presses S')
  let t0 = Date.now(); await A.key('s')
  const keyMs = Date.now() - t0
  let accepted = null
  while (Date.now() - t0 < 3000) { const l = await hostSeq(); if (l.seq !== before) { accepted = { seenAt: Date.now() - t0, ageMs: l.ageMs }; break } await sleep(25) }
  log('key dispatch ms', keyMs, 'host accepted', accepted, '=> accept at press +', accepted && accepted.seenAt - accepted.ageMs, 'ms')
  const smoke = await watch(B, 3, 'b-smoke', 7.5, t0)
  log('B saw seat 3 leisure', JSON.stringify(smoke.map(s => [s.ms, s.leisure?.action, s.leisure?.ageMs, s.leisure?.seq])))
  await sleep(500)
  log('A leisure controls', await cigarEnabled(A))
  log('A presses D')
  t0 = Date.now(); await A.key('d')
  const sip = await watch(B, 3, 'b-sip', 7.5, t0)
  log('B saw seat 3 leisure', JSON.stringify(sip.map(s => [s.ms, s.leisure?.action, s.leisure?.ageMs, s.leisure?.drinkKind])))
  await sleep(800)
  // Order through the real menu: the drink button opens it, then Red wine.
  await A.evaluate(`[...document.querySelectorAll('#leisure button')].find(b=>b.getAttribute('aria-expanded')!==null).click()`)
  await sleep(400)
  log('menu', await A.evaluate(`[...document.querySelectorAll('#leisure button')].map(b=>b.textContent).join(' | ')`))
  await A.evaluate(`[...document.querySelectorAll('#leisure button')].find(b=>b.textContent.includes('Red wine')).click()`)
  await sleep(1500)
  await B.send('Page.captureScreenshot', { format: 'png', clip: { x: 520, y: 230, width: 260, height: 230, scale: 2 } }).then(r => writeFileSync(join(OUT, 'b-order-wine.png'), Buffer.from(r.data, 'base64')))
  log('B sees drinkKind', (await B.view()).players[3].leisure)
  // Reverse direction: B smokes, A watches B opposite.
  await sleep(1500)
  log('B presses S')
  t0 = Date.now(); await B.key('s')
  const reverse = await watch(A, 0, 'a-smoke', 6.5, t0)
  log('A saw seat 0 leisure', JSON.stringify(reverse.map(s => [s.ms, s.leisure?.action, s.leisure?.ageMs])))
  // Interrupted smoke (review of #21): with mouse-look, S only QUEUES the
  // gesture until the view re-centres. Look far away, press S and then Space
  // (inspection) in the same task, so the queue is certainly cancelled before
  // it starts. Nothing may reach the host or the other player.
  const lookAway = async s => {
    await s.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 640, y: 420, button: 'left', buttons: 1, clickCount: 1 })
    for (const x of [560, 460, 360, 260]) await s.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y: 420, button: 'left', buttons: 1 })
    await s.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 260, y: 420, button: 'left', buttons: 0, clickCount: 1 })
    await sleep(600)
  }
  const keys = list => `(()=>{const a=document.getElementById('app');a.focus();for(const [type,key] of ${JSON.stringify(list)})a.dispatchEvent(new KeyboardEvent(type,{key,bubbles:true}))})()`
  await sleep(1500)
  const beforeInterrupt = await hostSeq()
  await lookAway(A)
  t0 = Date.now(); await A.evaluate(keys([['keydown', 's'], ['keydown', ' ']]))
  await sleep(400); await A.evaluate(keys([['keyup', ' ']]))
  const interrupted = await watch(B, 3, 'b-interrupted', 6, t0)
  const afterInterrupt = await hostSeq()
  log('interrupted smoke: host seq before/after', beforeInterrupt.seq, afterInterrupt.seq, 'B saw', JSON.stringify(interrupted.map(s => [s.ms, s.leisure?.seq])))
  if (afterInterrupt.seq !== beforeInterrupt.seq || interrupted.some(s => s.leisure?.seq !== beforeInterrupt.seq)) throw new Error('interrupted smoke reached the other player')
  // Positive control on the same path: look away, S, let it re-centre. The
  // host must hear it only once it actually starts, after the re-centre.
  await lookAway(A)
  t0 = Date.now(); await A.evaluate(keys([['keydown', 's']]))
  let queuedAccept = null
  while (Date.now() - t0 < 4000) { const l = await hostSeq(); if (l.seq !== afterInterrupt.seq) { queuedAccept = { seenAt: Date.now() - t0, ageMs: l.ageMs }; break } await sleep(25) }
  log('queued smoke: host accepted at press +', queuedAccept && queuedAccept.seenAt - queuedAccept.ageMs, 'ms (after the re-centre)')
  if (!queuedAccept) throw new Error('queued smoke never reached the host')
  const queued = await watch(B, 3, 'b-queued', 6, t0)
  writeFileSync(join(OUT, 'samples.json'), JSON.stringify({ smoke, sip, reverse, interrupted, queuedAccept, queued }, null, 1))
  log('console A', A.consoleLines.slice(0, 10)); log('console B', B.consoleLines.slice(0, 10))
} finally { A.close(); B.close() }
