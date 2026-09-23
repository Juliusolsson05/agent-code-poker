// Manual two-browser LAN acceptance for chat + voices (#22). NOT part of
// `npm test`: it needs a local Google Chrome and a real GPU.
//
//   npm run lan -- --memory-only --port=5305
//   node testing/lan-chat-two-browser.mjs <out-dir> [origin]
//
// Two separate headless Chrome profiles play as real website clients: B hosts,
// A joins. Everything runs through the shipped UI (T, typing, Enter, the table
// menu's buttons and fields), the real client code and the real host.
//
// THE FAKE VOICE PROVIDER IS AT THE NETWORK EDGE, not in the product: each
// browser's CDP Fetch domain intercepts https://api.elevenlabs.io/* and answers
// with the locally encoded MP3 fixture (testing/fixtures/elevenlabs/). So the
// real ElevenLabs client, CSP, relay upload, relay download, decode and audio
// graph all run; only ElevenLabs itself is replaced. No real key is used.
//
// Evidence recorded:
// - every request each browser sent (Network domain), to prove the fake key
//   went to ElevenLabs only and never to the LAN host;
// - the ElevenLabs request shape the client produced;
// - decodeAudioData successes, counted by a harness-only wrapper added before
//   the page loads (Page.addScriptToEvaluateOnNewDocument);
// - DOM text of the bubble/log on both sides and screenshots.
//
// Same GPU trap as lan-two-browser.mjs: keep --use-angle=metal.
import { spawn } from 'node:child_process'
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const OUT = process.argv[2], ORIGIN = process.argv[3] ?? 'http://127.0.0.1:5305'
if (!OUT) throw new Error('Usage: node testing/lan-chat-two-browser.mjs <out-dir> [origin]')
mkdirSync(OUT, { recursive: true })
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const MP3 = readFileSync(new URL('./fixtures/elevenlabs/fake-tts-mp3_22050_32.mp3', import.meta.url)).toString('base64')
const KEYS = { A: 'sk_acceptance_fake_key_for_A_000', B: 'sk_acceptance_fake_key_for_B_000' }
const VOICE = '21m00Tcm4TlvDq8ikWAM'
const sleep = ms => new Promise(r => setTimeout(r, ms))
const log = (...a) => console.log(new Date().toISOString().slice(11, 23), ...a)
const report = { elevenlabsRequests: [], hostRequests: { A: [], B: [] }, checks: [] }
const check = (name, ok, detail) => { report.checks.push({ name, ok: !!ok, detail }); log(ok ? 'PASS' : 'FAIL', name, detail ?? '') }

async function browser(port, name) {
  const profile = mkdtempSync(join(tmpdir(), `poker-chat-${name}-`))
  const proc = spawn(CHROME, [`--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--headless=new', '--no-first-run',
    '--no-default-browser-check', '--window-size=1280,800', '--use-angle=metal', '--autoplay-policy=no-user-gesture-required',
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', 'about:blank'],
    { stdio: 'ignore' })
  let targets
  for (let i = 0; i < 100; i++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (targets.some(t => t.type === 'page')) break } catch {} await sleep(200) }
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
  listeners.push(m => { if (m.method === 'Runtime.consoleAPICalled' || m.method === 'Runtime.exceptionThrown') consoleLines.push(JSON.stringify(m.params).slice(0, 400)) })
  // Every request this browser makes, with headers and body, for the key audit.
  listeners.push(m => {
    if (m.method !== 'Network.requestWillBeSent') return
    const { url, method, headers, postData } = m.params.request
    // The audit runs on the full request below; only the recorded copy drops
    // bearer tokens (host rule: tokens never appear in diagnostic records).
    if (!url.startsWith(ORIGIN)) return
    const raw = JSON.stringify({ headers, postData })
    report.hostRequests[name].push({ url: url.slice(ORIGIN.length), method, carriedKey: raw.includes(KEYS.A) || raw.includes(KEYS.B),
      headers: Object.fromEntries(Object.entries(headers).map(([k, v]) => [k, k.toLowerCase() === 'authorization' ? '<bearer redacted>' : v])),
      postData: postData && postData.length > 300 ? postData.slice(0, 120) + '…' : postData })
  })
  // The fake ElevenLabs: fulfil at the network edge with the fixture MP3.
  listeners.push(m => {
    if (m.method !== 'Fetch.requestPaused') return
    const { requestId, request } = m.params
    const cors = [{ name: 'access-control-allow-origin', value: '*' }, { name: 'access-control-allow-headers', value: '*' }, { name: 'access-control-allow-methods', value: 'POST, OPTIONS' }]
    if (request.method === 'OPTIONS') { void send('Fetch.fulfillRequest', { requestId, responseCode: 200, responseHeaders: cors, body: '' }); return }
    report.elevenlabsRequests.push({ browser: name, url: request.url, method: request.method, headers: request.headers, body: request.postData })
    void send('Fetch.fulfillRequest', { requestId, responseCode: 200, responseHeaders: [...cors, { name: 'content-type', value: 'audio/mpeg' }], body: MP3 })
  })
  await send('Runtime.enable'); await send('Page.enable'); await send('Network.enable', { maxPostDataSize: 300_000 })
  await send('Fetch.enable', { patterns: [{ urlPattern: 'https://api.elevenlabs.io/*' }] })
  // Harness-only instrumentation: count decoded clips. Not product code.
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__voiceDecodes=0;const d=BaseAudioContext.prototype.decodeAudioData;BaseAudioContext.prototype.decodeAudioData=function(...a){return d.apply(this,a).then(b=>{window.__voiceDecodes++;window.__voiceSeconds=b.duration;return b})}` })
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false })
  const shot = async file => { const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(join(OUT, file), Buffer.from(r.data, 'base64')) }
  const key = async (k, code = 'Key' + k.toUpperCase()) => {
    for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: k, code, text: type === 'keyDown' ? (k === 'Enter' ? '\r' : k.length === 1 ? k : undefined) : undefined, windowsVirtualKeyCode: k === 'Enter' ? 13 : k.toUpperCase().charCodeAt(0) })
  }
  const type = async (selector, text) => { await evaluate(`document.querySelector(${JSON.stringify(selector)}).focus()`); await send('Input.insertText', { text }) }
  const click = text => evaluate(`(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.trim().startsWith(${JSON.stringify(text)}));if(!b)throw new Error('no button '+${JSON.stringify(text)});b.click();return b.textContent})()`)
  return { name, proc, send, evaluate, shot, key, type, click, consoleLines, close: () => proc.kill() }
}

const B = await browser(9331, 'B'), A = await browser(9332, 'A')
try {
  await B.send('Page.navigate', { url: ORIGIN + '/' }); await A.send('Page.navigate', { url: ORIGIN + '/' })
  await sleep(3000)
  await B.evaluate(`document.getElementById('name').value='Bea';document.getElementById('create').click()`)
  let code = ''
  for (let i = 0; i < 40 && !code; i++) { await sleep(250); code = (await B.evaluate(`document.getElementById('invite').textContent`)).match(/Lobby code: (\S+)/)?.[1] ?? '' }
  log('lobby', code)
  await A.evaluate(`document.getElementById('name').value='Ari';document.getElementById('code').value=${JSON.stringify(code)};document.getElementById('join').click()`)
  await sleep(3000)

  // Both players save their own (fake) key through the real settings panel.
  for (const s of [A, B]) {
    await s.evaluate(`document.getElementById('details').click()`); await sleep(300)
    await s.type('.lan-voice-settings input[type=password]', KEYS[s.name])
    await s.type('.lan-voice-settings input:not([type=password])', VOICE)
    await s.click('Save voice'); await sleep(300)
    check(`${s.name} saved voice settings`, /Voice saved/.test(await s.evaluate(`document.querySelector('.lan-voice-settings [role=status]').textContent`)))
  }
  // Guest cannot switch; host can.
  check('guest sees read-only switches', await A.evaluate(`!document.querySelector('.lan-features button') && /host decides/.test(document.querySelector('.lan-features').textContent)`))
  await B.evaluate(`[...document.querySelectorAll('.lan-features button')][0].click()`)
  await sleep(1200)
  check('host turned voices on; guest sees it', await A.evaluate(`document.querySelector('.lan-features').textContent.includes('Spoken voicesOn')`))
  // Test voice in A's panel: one real provider call, decoded locally.
  await A.click('Test voice'); await sleep(1500)
  check('test voice works', /Voice works/.test(await A.evaluate(`document.querySelector('.lan-voice-settings [role=status]').textContent`)))
  check('test voice decoded the clip locally', await A.evaluate('window.__voiceDecodes') === 1)
  await A.shot('a-00-menu-guest.png'); await B.shot('b-00-menu-host.png')
  for (const s of [A, B]) { await s.evaluate(`document.getElementById('close-menu').click()`); await sleep(200) }
  await B.evaluate(`document.getElementById('start').click()`); await sleep(2500)
  await B.shot('b-00-table.png')

  // A real pointer press on B's room: browsers only start audio after a user
  // gesture, and PokerAudio unlocks on pointerdown exactly like a player's click.
  for (const type of ['mousePressed', 'mouseReleased']) await B.send('Input.dispatchMouseEvent', { type, x: 640, y: 420, button: 'left', clickCount: 1 })
  await sleep(300)
  const decodesBefore = await B.evaluate('window.__voiceDecodes')
  // A: T opens chat, type, Enter.
  await A.evaluate(`document.getElementById('app').focus()`); await A.key('t'); await sleep(300)
  check('T opens the chat box focused', await A.evaluate(`document.activeElement?.closest('.lan-chat-input')!==null`))
  await A.send('Input.insertText', { text: 'Raise you <b>twenty</b> 🂡' }); await A.key('Enter', 'Enter')
  await sleep(2500)
  const bubbleB = await B.evaluate(`[...document.querySelectorAll('#labels .chat-bubble')].map(b=>b.textContent)`)
  check('B sees A\'s bubble over A\'s label, as text', bubbleB.includes('Raise you <b>twenty</b> 🂡'), bubbleB)
  check('B\'s bubble contains no parsed markup', await B.evaluate(`!document.querySelector('#labels .chat-bubble b')`))
  check('B\'s chat log is a polite live region with the line', await B.evaluate(`(()=>{const ol=document.querySelector('.lan-chat-log ol');return ol.getAttribute('aria-live')==='polite'&&ol.textContent.includes('Ari Raise you')})()`))
  check('A\'s log labels its own line "You"', await A.evaluate(`document.querySelector('.lan-chat-log ol').textContent.includes('You Raise you')`))
  await B.shot('b-01-bubble.png'); await A.shot('a-01-sent.png')
  const decodesAfter = await B.evaluate('window.__voiceDecodes')
  check('B fetched and decoded A\'s relayed clip', decodesAfter > decodesBefore, { decodesBefore, decodesAfter, seconds: await B.evaluate('window.__voiceSeconds') })
  check('B fetched the clip from the host relay', report.hostRequests.B.some(r => /^\/api\/voice\/\d+$/.test(r.url) && r.method === 'GET'))
  check('A uploaded its clip to the relay', report.hostRequests.A.some(r => r.url === '/api/voice' && r.method === 'POST'))

  // Voices off mid-session: next line is text only, no ElevenLabs call.
  await B.evaluate(`document.getElementById('details').click()`); await sleep(300)
  await B.evaluate(`[...document.querySelectorAll('.lan-features button')][0].click()`); await sleep(1200)
  await B.evaluate(`document.getElementById('close-menu').click()`); await sleep(300)
  const elevenBefore = report.elevenlabsRequests.length
  await A.evaluate(`document.getElementById('app').focus()`); await A.key('t'); await sleep(300)
  await A.send('Input.insertText', { text: 'quiet now' }); await A.key('Enter', 'Enter'); await sleep(2000)
  check('voices off: no ElevenLabs call for the next line', report.elevenlabsRequests.length === elevenBefore)
  check('voices off: the line still arrives as text', (await B.evaluate(`[...document.querySelectorAll('#labels .chat-bubble')].map(b=>b.textContent)`)).includes('quiet now'))

  // THE KEY AUDIT.
  const hostRequests = [...report.hostRequests.A, ...report.hostRequests.B]
  check('no request to the LAN host carried either key', hostRequests.length > 10 && hostRequests.every(r => !r.carriedKey), { hostRequests: hostRequests.length })
  check('every ElevenLabs request carried only its own browser\'s key', report.elevenlabsRequests.every(r => r.headers['xi-api-key'] === KEYS[r.browser]))
  check('ElevenLabs request shape', report.elevenlabsRequests.every(r => r.url === `https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_22050_32` && r.method === 'POST'),
    report.elevenlabsRequests.map(r => ({ url: r.url, body: r.body })))
  log('console A', A.consoleLines.slice(0, 10)); log('console B', B.consoleLines.slice(0, 10))
} finally {
  // Keys are fake, but redact anyway so the recorded evidence never models
  // storing a key next to traffic.
  // Polls dominate the traffic; keep the evidence file readable.
  for (const side of ['A', 'B']) report.hostRequests[side] = report.hostRequests[side].filter(r => r.url !== '/api/state')
  writeFileSync(join(OUT, 'report.json'), JSON.stringify(report, null, 1).replaceAll(KEYS.A, '<fake key A>').replaceAll(KEYS.B, '<fake key B>'))
  A.close(); B.close()
}
