const el = id => document.getElementById(id)
const storageKey = 'poker-lan-connection-test-v1'
const hex = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), v => v.toString(16).padStart(2, '0')).join('')
let token = '', admissionNonce = hex(), state = null, pending = false, polling = false, ended = false
try { const saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null'); token = saved?.token || ''; admissionNonce = saved?.nonce || admissionNonce } catch { /* Leave unrelated storage untouched. */ }
const records = [], started = new Date().toISOString()
let truncated = false
function save() { sessionStorage.setItem(storageKey, JSON.stringify({ token, nonce: admissionNonce })) }
function record(path, status, data) {
  if (records.length >= 512) { truncated = true; return }
  const v = data?.view
  records.push({ at: performance.now(), path, status, ...(v ? { revision: v.revision, gameRevision: v.gameRevision,
    phase: v.phase, actor: v.actor, selfSeat: v.self.seat, waiting: v.self.waiting,
    players: v.players.map(p => ({ seat: p.seat, displaySeat: p.displaySeat, kind: p.kind, stack: p.stack,
      bet: p.bet, folded: p.folded, cards: p.cards.kind, connected: p.connected })) } : {}) })
}
async function api(path, body) {
  const credentialAtStart = token
  const response = await fetch(path, { method: body === undefined ? 'GET' : 'POST', cache: 'no-store',
    headers: { ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(5000) })
  const data = await response.json()
  // An old in-flight poll must not resurrect the table after explicit leave or
  // local cleanup. Observation ordering only compares responses within a room.
  if (token !== credentialAtStart) throw new Error('Previous connection response ignored.')
  record(path, response.status, data)
  // A definitive credential/session rejection is different from a timeout.
  // Keep transient failures resumable; only offer explicit local cleanup after
  // the host has told this tab its connection can no longer be used.
  if (token && [401,410].includes(response.status)) { ended = true; el('forget').hidden = false }
  if (data.view && (!state || data.observation > state.observation)) { state = data; render() }
  if (!response.ok) throw new Error(data.error || data.receipt?.code || 'Request rejected.')
  return data
}
const card = value => `${({11:'J',12:'Q',13:'K',14:'A'})[value%13+2] || value%13+2}${['♣','♦','♥','♠'][Math.floor(value/13)]}`
function render() {
  el('entry').hidden = !!state; el('table').hidden = !state
  el('create').disabled = pending; el('join').disabled = pending
  if (!state) return
  const v = state.view, own = v.players[v.self.seat]
  el('heading').textContent = `${own.name} · Seat ${v.self.seat+1}`
  el('connection').textContent = !state.hostConnected ? 'Host disconnected — table suspended' : state.paused ? 'Table paused' : v.self.waiting ? 'Seat reserved — joining next hand' : 'Connected'
  el('invite').textContent = state.code ? `Lobby code: ${state.code.slice(0,5)}-${state.code.slice(5)}` : 'Six playing seats · empty seats are NPCs'
  el('phase').textContent = `Hand ${v.handNumber} · ${v.phase} · Pot ${v.pot} · Your stack ${own.stack}`
  el('board').textContent = `Board: ${v.board.map(card).join(' ') || 'not dealt'}`
  el('hand').textContent = `Your cards: ${own.cards.kind === 'visible' ? own.cards.values.map(card).join(' ') : 'not dealt to you yet'}`
  // Names are untrusted text. Never use innerHTML for a roster, including a
  // developer-only lobby: it holds the same bearer token as the eventual game.
  el('players').replaceChildren(...[...v.players].sort((a,b)=>a.displaySeat-b.displaySeat).map(p => {
    const li = document.createElement('li'); li.textContent = `${p.name} · ${p.kind}${p.pendingName ? ' · next: '+p.pendingName : ''} · ${p.stack} chips · ${p.action || 'waiting'}${v.actor===p.seat ? ' · to act' : ''}`; return li
  }))
  el('start').hidden = !state.isHost; el('pause').hidden = !state.isHost
  el('start').disabled = pending || state.paused || !['ready','complete'].includes(v.phase)
  el('pause').disabled = pending; el('pause').textContent = state.paused ? 'Resume table' : 'Pause table'
  el('leave').disabled = pending
  const canAct = !pending && !state.paused && !v.self.waiting && v.actor === v.self.seat && v.phase === 'betting'
  el('fold').disabled = !canAct || !v.legal.fold
  el('call').disabled = !canAct || !v.legal.check && !v.legal.call
  el('call').textContent = v.legal.check ? 'Check' : `Call ${v.legal.call}`
  el('raise').disabled = !canAct || !v.legal.raise; el('raise').textContent = `Raise to ${v.legal.min}`
}
async function run(work) {
  if (pending) return
  pending = true; el('error').textContent = ''; render()
  try { await work() } catch (error) { el('error').textContent = error.message; el('connection').textContent = 'Needs attention — no automatic new table' }
  finally { pending = false; render() }
}
async function enter(joining) {
  const result = await api(joining ? '/api/join' : '/api/create', { name: el('name').value, nonce: admissionNonce, ...(joining ? { code: el('code').value } : {}) })
  token = result.token; save(); await api('/api/state')
}
el('create').onclick = () => run(() => enter(false)); el('join').onclick = () => run(() => enter(true))
el('start').onclick = () => run(() => api('/api/start', { revision: state.view.revision }))
el('pause').onclick = () => run(() => api('/api/pause', { paused: !state.paused }))
el('leave').onclick = () => run(async () => { await api('/api/leave', {}); token=''; state=null; admissionNonce=hex(); save(); el('connection').textContent='Left table' })
el('forget').onclick = () => {
  token=''; state=null; ended=false; admissionNonce=hex(); save()
  el('forget').hidden=true; el('error').textContent=''; el('connection').textContent='Not connected'; render()
}
function wager(action) {
  // Capture one intent before awaiting. Never silently update its revision or
  // resubmit a different wager after a failed request; refresh and let the human
  // decide. Host idempotency is a second barrier, not permission to auto-bet.
  const v = state.view
  return run(() => api('/api/action', { sequence: v.self.nextSequence, revision: v.revision, action }))
}
el('fold').onclick = () => wager({type:'fold'})
el('call').onclick = () => wager({type:state.view.legal.check?'check':'call'})
el('raise').onclick = () => wager({type:'raise',to:state.view.legal.min})
el('export').onclick = () => {
  const blob = new Blob([JSON.stringify({ source:'actual-browser-lan-connection-test', started, truncated, records },null,2)],{type:'application/json'})
  const url = URL.createObjectURL(blob), link = document.createElement('a'); link.href=url; link.download=`poker-lan-${started.replaceAll(':','-')}.json`; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000)
}
async function poll() {
  if (!token || ended || pending || polling || document.hidden) return
  polling = true
  try { await api('/api/state') } catch (error) { el('error').textContent=error.message; el('connection').textContent='Connection interrupted — session not replaced' }
  finally { polling=false }
}
setInterval(poll,500); render(); void poll()
