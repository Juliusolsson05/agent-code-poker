import { createElement, createRef } from 'react'
import { createRoot } from 'react-dom/client'
import { PokerRoom } from '../../src/scene/Room'
import { BettingControls } from '../../src/components/BettingControls'
const el = id => document.getElementById(id)
const storageKey = 'poker-lan-connection-test-v1'
const hex = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), v => v.toString(16).padStart(2, '0')).join('')
let token = '', admissionNonce = hex(), state = null, pending = false, polling = false, ended = false
let room = null, renderFailed = false, inspected = false, menuOpen = false, connectionLost = false, controlsRevision = 0, authorityRevision = -1
const labels = new Map(), bettingRef = createRef(), bettingRoot = createRoot(el('actions'))
const focusTable = () => el('app').focus()
const onWagerOpen = open => room?.setLookBlocked(open || menuOpen)
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
  const generationAtStart = state?.generation
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
  const newGeneration = state && data.generation !== state.generation
  // A restarted server begins its observation counter again. Accept its first
  // response only if no newer generation has already replaced the one this
  // request began in; a delayed pre-restart poll cannot switch us back.
  if (data.view && (!state || newGeneration && generationAtStart === state.generation ||
    !newGeneration && data.observation > state.observation)) {
    if (newGeneration) { controlsRevision++; authorityRevision=-1; inspected=false;room?.setInspection(false) }
    state = data; connectionLost = false; render()
  }
  if (!response.ok) throw new Error(data.error || data.receipt?.code || 'Request rejected.')
  return data
}
const card = value => `${({11:'J',12:'Q',13:'K',14:'A'})[value%13+2] || value%13+2}${['♣','♦','♥','♠'][Math.floor(value/13)]}`
function render() {
  el('entry').hidden = !!state; el('table').hidden = !state
  el('inspect').hidden = el('details').hidden = !state
  el('create').disabled = pending; el('join').disabled = pending
  if (!state) {
    room?.dispose(); room=null; labels.clear(); el('labels').replaceChildren(); bettingRoot.render(null)
    inspected=false;menuOpen=false;connectionLost=false;authorityRevision=-1;el('menu').hidden=true; return
  }
  const v = state.view, own = v.players[v.self.seat]
  if(v.revision !== authorityRevision) { authorityRevision=v.revision; controlsRevision++ }
  if (!room && !renderFailed) {
    const failed=()=>{renderFailed=true;el('error').textContent='3D rendering unavailable. Reload this tab to reconnect without losing your seat.'}
    // A GPU failure is not a lost admission response. Preserve the credential
    // and do not repeatedly allocate another renderer on every heartbeat.
    try {
      room = new PokerRoom(el('scene'), failed, undefined, undefined, v.self.seat)
      for(let seat=1;seat<6;seat++) {
        const label=document.createElement('div');label.className='seat-label';el('labels').append(label)
        labels.set(seat,label);room.bindWorldLabel(seat,label)
      }
    } catch { failed() }
  }
  room?.updateRemote(v,v.self.seat);room?.setPlaying(v.phase!=='ready' && !v.self.waiting)
  room?.setPaused(state.paused || connectionLost || ended)
  for(const p of v.players) if(p.displaySeat!==0) {
    const label=labels.get(p.displaySeat)
    if(!label)continue
    label.textContent=`${p.name} · ${p.kind==='human'?'Player':'NPC'}\n${p.stack.toLocaleString()} · ${v.actor===p.seat?'Your turn':p.action || 'Ready'}`
    label.classList.toggle('active',v.actor===p.seat)
  }
  el('labels').hidden=inspected
  el('heading').textContent = `${own.name} · Seat ${v.self.seat+1}`
  el('connection').textContent = connectionLost || ended ? 'Connection interrupted — wagering disabled' : !state.hostConnected ? 'Host disconnected — table suspended' : state.paused ? 'Table paused' : v.self.waiting ? 'Seat reserved — joining next hand' : v.actor===v.self.seat ? 'Your move' : 'Connected · LAN'
  el('invite').textContent = state.code ? `Lobby code: ${state.code.slice(0,5)}-${state.code.slice(5)}` : 'Six playing seats · empty seats are NPCs'
  const phase=v.phase==='betting'?['Pre-flop','Flop','Turn','River'][v.street]:v.phase==='ready'?'Waiting for host':v.phase==='complete'?'Hand complete':v.phase==='showdown'?'Showdown':'Dealing'
  const winners=v.phase==='complete'?v.results.filter(r=>r.won>0).map(r=>`${v.players[r.seat].name} wins ${r.won}`).join(' · '):''
  el('phase').textContent = `Hand ${v.handNumber} · ${phase} · Pot ${v.pot} · Your stack ${own.stack}${winners?' · '+winners:''}`
  const caption=document.createElement('small');caption.textContent='THE BOARD'
  el('board').replaceChildren(caption,...Array.from({length:5},(_,i)=>{const c=document.createElement('span');c.className='board-card';c.textContent=i<v.board.length?card(v.board[i]):'·';return c}))
  el('hand').textContent = `Your cards: ${own.cards.kind === 'visible' ? own.cards.values.map(card).join(' ') : 'not dealt to you yet'}`
  // Names are untrusted text. Never use innerHTML for a roster, including a
  // developer-only lobby: it holds the same bearer token as the eventual game.
  el('players').replaceChildren(...[...v.players].sort((a,b)=>a.displaySeat-b.displaySeat).map(p => {
    const li = document.createElement('li'); li.textContent = `${p.name} · ${p.kind}${p.pendingName ? ' · next: '+p.pendingName : ''} · ${p.stack} chips · ${p.action || 'waiting'}${v.actor===p.seat ? ' · to act' : ''}`; return li
  }))
  el('start').hidden = !state.isHost || !['ready','complete'].includes(v.phase); el('pause').hidden = !state.isHost
  el('start').disabled = pending || state.paused || connectionLost || ended
  el('pause').disabled = pending; el('pause').textContent = state.paused ? 'Resume table' : 'Pause table'
  el('leave').disabled = pending
  el('leave').textContent = state.isHost ? 'End session for everyone' : 'Leave table'
  const canAct = !pending && !state.paused && !connectionLost && !ended && !menuOpen && !v.self.waiting && v.actor === v.self.seat && v.phase === 'betting'
  bettingRoot.render(createElement(BettingControls,{ref:bettingRef, revision:controlsRevision, blocked:!canAct,
    legal:v.legal,pot:v.pot,currentBet:v.currentBet,ownBet:own.bet,bigBlind:v.bigBlind,onAction:wager,
    onOpenChange:onWagerOpen,focusTable}))
  el('inspect').disabled=state.paused || v.self.waiting || ended
}
async function run(work) {
  if (pending) return
  pending = true; el('error').textContent = ''; render()
  try { await work() } catch (error) { controlsRevision++; el('error').textContent = error.message }
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
  if(pending || ended || connectionLost || !state || state.paused || state.view.actor!==state.view.self.seat) return false
  const v = state.view
  void run(() => api('/api/action', { sequence: v.self.nextSequence, revision: v.revision, action }))
  return true
}
function menu(open) {menuOpen=open;el('menu').hidden=!open;room?.setLookBlocked(open);render();if(!open)focusTable()}
el('details').onclick=()=>menu(!menuOpen);el('close-menu').onclick=()=>menu(false)
function inspect(active) {inspected=active;room?.setInspection(active);el('labels').hidden=active}
el('inspect').onclick=()=>{inspect(!inspected);focusTable()}
el('app').addEventListener('keydown',event=>{
  const target=event.target.closest('input,select,textarea,[contenteditable=true]')?'editing':event.target.closest('button,a')?'control':'table'
  if(!state || target==='editing' || event.altKey || event.ctrlKey || event.metaKey || event.isComposing)return
  if(event.key==='Escape' && menuOpen){event.preventDefault();menu(false);return}
  if(bettingRef.current?.handleKey({key:event.key,repeat:event.repeat,shiftKey:event.shiftKey,altKey:event.altKey,ctrlKey:event.ctrlKey,metaKey:event.metaKey,nativeEvent:event,
    preventDefault:()=>event.preventDefault(),stopPropagation:()=>event.stopPropagation()},target))return
  if(event.key===' ' && target==='table' && !menuOpen && !state.paused && !state.view.self.waiting){event.preventDefault();inspect(true)}
})
el('app').addEventListener('keyup',event=>{if(event.key===' '){inspect(false)}})
window.addEventListener('blur',()=>inspect(false))
el('export').onclick = () => {
  const blob = new Blob([JSON.stringify({ source:'actual-browser-lan-3d-client', started, truncated, records },null,2)],{type:'application/json'})
  const url = URL.createObjectURL(blob), link = document.createElement('a'); link.href=url; link.download=`poker-lan-${started.replaceAll(':','-')}.json`; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000)
}
async function poll() {
  // Hidden rendering sleeps, but membership heartbeat must continue: changing
  // tabs is not abandoning a multiplayer table. Closing/losing transport still
  // expires the lease. Chrome can throttle background timers; no fake grace ACK.
  if (!token || ended || pending || polling) return
  polling = true
  try { await api('/api/state') } catch (error) { connectionLost=true;el('error').textContent=error.message;render() }
  finally { polling=false }
}
setInterval(poll,500); render(); void poll()
