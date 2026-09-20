import { createElement, createRef } from 'react'
import { createRoot } from 'react-dom/client'
import { PokerRoom } from '../../src/scene/Room'
import { BettingControls } from '../../src/components/BettingControls'
import { SeatRecovery } from './SeatRecovery'
import { ResponseOrder, ObsoleteResponse } from './ResponseOrder'
import { LeisureControls, leisureShortcut } from './LeisureControls'
import { BankControls } from '../../src/components/BankControls'
import { PokerHeader, TableInfo, SeatContents, PotContents, TableReadout } from '../../src/components/PokerChrome'
import { evaluate } from '../../src/engine/cards'
import { CHARACTERS, STREETS } from '../../src/engine/game'
import { PokerAudio } from '../../src/audio'
import fireplaceRecording from '../../src/assets/audio/fireplace-creator-assets.mp3?inline'
import { FIREPLACE_LAYOUT } from '../../src/scene/environment/layout'
import { TAVERN_FEATURES } from '../../src/scene/environment/features'
import '../../src/styles.css'
import '../../dev/preview.css'
import './style.css'
const el = id => document.getElementById(id)
const recovery = new SeatRecovery(() => sessionStorage, () => localStorage)
const responses = new ResponseOrder()
const hex = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), v => v.toString(16).padStart(2, '0')).join('')
let token = '', admissionNonce = hex(), state = null, pending = false, polling = false, ended = false
let room = null, renderFailed = false, inspected = false, menuOpen = false, connectionLost = false, controlsRevision = 0, authorityRevision = -1
let drinkMenuOpen = false, wagerOpen = false, leisure = { kind: 'old-fashioned', available: false }
const labels = new Map(), bettingRef = createRef(), bettingRoot = createRoot(el('actions'))
const leisureRoot = createRoot(el('leisure'))
const bankRoot = createRoot(el('bank'))
const headerRoot=createRoot(el('header')),hudRoot=createRoot(el('hud')),potRoot=createRoot(el('pot')),infoRoot=createRoot(el('table-info'))
const audio=new PokerAudio(TAVERN_FEATURES.fireplace?fireplaceRecording:undefined,
  [FIREPLACE_LAYOUT.position[0],.4,FIREPLACE_LAYOUT.position[2]+.05])
let muted=false,lastSoundView=null,sceneViewer=null,focused=document.hasFocus()
const soundActive=()=>audio.setAmbienceActive(!!state && !state.paused && !connectionLost && !ended && !menuOpen && !document.hidden && focused)
el('app').addEventListener('pointerdown',()=>audio.unlock())
el('app').addEventListener('keydown',event=>{if(!event.repeat)audio.unlock()})
document.addEventListener('visibilitychange',()=>{soundActive();if(!document.hidden)render()})
document.addEventListener('fullscreenchange',()=>render())
window.addEventListener('blur',()=>{focused=false;soundActive()})
window.addEventListener('focus',()=>{focused=true;soundActive()})
window.addEventListener('pagehide',()=>audio.dispose(),{once:true})
const focusTable = () => el('app').focus()
const syncLookBlocked = () => room?.setLookBlocked(wagerOpen || menuOpen || drinkMenuOpen)
const onWagerOpen = open => { wagerOpen=open;syncLookBlocked();renderLeisure() }
const currentKey = recovery.current()
let savedKeys = [], playerName = currentKey?.name || 'Guest'
if (currentKey) { token = currentKey.token; admissionNonce = currentKey.nonce; el('name').value = playerName }
const records = [], started = new Date().toISOString()
let truncated = false
const seatKey = () => ({ token, nonce: admissionNonce, name: playerName })
function save(remember = false) {
  if (!recovery.save(seatKey(), remember)) el('storage-warning').textContent = 'Browser storage is unavailable. You can play, but keep this tab open: your seat may not survive closing or reloading it.'
}
function forget(key) {
  if (!recovery.forget(key)) el('storage-warning').textContent = 'Browser storage blocked cleanup. This device may still remember the seat; clear its poker site data before sharing this browser.'
}
function showSaved() {
  savedKeys = recovery.saved()
  el('recovery').hidden = token || !savedKeys.length
  el('saved-seats').replaceChildren(...savedKeys.map((key, index) => {
    const option = document.createElement('option'); option.value = String(index); option.textContent = key.name; return option
  }))
  el('resume-seat').disabled = el('forget-seat').disabled = pending
}
function record(path, status, data) {
  if (records.length >= 512) { truncated = true; return }
  const v = data?.view
  records.push({ at: performance.now(), path, status, ...(v ? { revision: v.revision, gameRevision: v.gameRevision,
    phase: v.phase, actor: v.actor, selfSeat: v.self.seat, waiting: v.self.waiting,
    players: v.players.map(p => ({ seat: p.seat, displaySeat: p.displaySeat, kind: p.kind, stack: p.stack,
      bet: p.bet, folded: p.folded, cards: p.cards.kind, connected: p.connected })) } : {}) })
}
async function api(path, body) {
  const request = responses.begin()
  let response, data
  try {
    response = await fetch(path, { method: body === undefined ? 'GET' : 'POST', cache: 'no-store',
      headers: { ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(5000) })
    data = await response.json()
  } catch (error) {
    if (!responses.failureCurrent(request)) throw new ObsoleteResponse()
    throw error
  }
  if (!responses.current(request)) throw new ObsoleteResponse()
  record(path, response.status, data)
  // A definitive credential/session rejection is different from a timeout.
  // Keep transient failures resumable; only offer explicit local cleanup after
  // the host has told this tab its connection can no longer be used.
  if (data.view) {
    if (!responses.accept(request, data)) throw new ObsoleteResponse()
    const newGeneration = state && data.generation !== state.generation
    if (newGeneration) { controlsRevision++; authorityRevision=-1;lastSoundView=null; inspected=false;room?.setInspection(false) }
    state = data; connectionLost = false; render()
  } else if (!response.ok && !responses.failureCurrent(request)) {
    throw new ObsoleteResponse()
  }
  if (token && [401,410].includes(response.status)) { ended = true; responses.reset(); el('forget').hidden = false }
  if (!response.ok) throw new Error(data.error || data.receipt?.code || 'Request rejected.')
  return data
}
function leisureContext() {
  return { available: leisure.available, menuOpen: drinkMenuOpen,
    blocked: !state || !room || renderFailed || pending || connectionLost || ended ||
      state.paused || state.view.phase==='ready' || state.view.self.waiting || inspected || menuOpen || wagerOpen }
}
function renderLeisure() {
  if (!state) { leisureRoot.render(null);return }
  leisureRoot.render(createElement(LeisureControls,{...leisureContext(),kind:leisure.kind,
    onSmoke:()=>requestLeisure('smoke'),onSip:()=>requestLeisure('drink'),onMenuChange:drinkMenu,
    onOrder:kind=>{
      // Recheck current context on dispatch, not the last React frame. Polls
      // may pause/disconnect the table between rendering and a queued click.
      const context=leisureContext()
      if(!context.blocked && context.available && room?.orderDrink(kind)) drinkMenu(false)
    }}))
}
function requestLeisure(kind) {
  const context=leisureContext()
  if(context.blocked || context.menuOpen || !context.available)return
  if(kind==='smoke')room?.smokeCigar();else room?.sipDrink()
  focusTable()
}
function drinkMenu(open) {
  if(open && leisureContext().blocked)return
  drinkMenuOpen=open;controlsRevision++;syncLookBlocked();render()
  if(!open)focusTable()
}
function ensureRoom(viewer,neutral=false) {
  const identity=neutral?-1:viewer
  if(room && sceneViewer!==identity) {
    room.dispose();room=null;for(const label of labels.values())label.root.unmount();labels.clear();el('labels').replaceChildren()
  }
  if(room || renderFailed || document.hidden)return
  const failed=()=>{renderFailed=true;el('error').textContent='3D rendering unavailable. Reload this tab to reconnect without losing your seat.'}
  try {
    // The lobby is an undealt room, not a manufactured engine snapshot. Entering
    // a real seat replaces that neutral rig exactly once so avatar identities
    // follow authority even for non-host viewers. Hidden tabs allocate no GPU.
    room=new PokerRoom(el('scene'),failed,undefined,value=>{leisure=value;renderLeisure()},viewer)
    sceneViewer=identity
    for(let seat=1;seat<6;seat++) {
      const node=document.createElement('div');node.className='seat';el('labels').append(node)
      labels.set(seat,{node,root:createRoot(node)});room.bindWorldLabel(seat,node)
    }
    room.bindWorldLabel(-1,el('pot'));room.onAudioListener=matrix=>audio.setListenerMatrix(matrix)
  } catch { failed() }
}
function render() {
  el('entry').hidden = !!state; el('table').hidden = !state
  el('inspect').hidden = el('details').hidden = !state
  headerRoot.render(createElement(PokerHeader,{onLobby:()=>{if(state)menu(true)}},
    createElement('button',{'aria-label':muted?'Unmute sound':'Mute sound',title:'Sound (M)',onClick:()=>{muted=!muted;audio.setMuted(muted);if(!muted)audio.unlock();render()}},muted?'♪̸':'♪'),
    state&&createElement('button',{'aria-label':'Settings',title:'Table settings',onClick:()=>menu(true)},'⚙'),
    state?.isHost&&createElement('button',{'aria-label':state.paused?'Resume table':'Pause table',disabled:pending,onClick:()=>run(()=>api('/api/pause',{paused:!state.paused}))},state.paused?'▶':'Ⅱ'),
    document.fullscreenEnabled&&createElement('button',{'aria-label':document.fullscreenElement?'Exit fullscreen':'Enter fullscreen',onClick:()=>{void (document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()).catch(()=>{el('error').textContent='Fullscreen unavailable. The game still fills the browser.'})}},'⤢')))
  el('app').classList.toggle('inspecting',inspected)
  soundActive()
  el('create').disabled = pending || !!token; el('join').disabled = pending || !!token
  if (!state) {
    ensureRoom(0,true);room?.setPlaying(false);bettingRoot.render(null);lastSoundView=null
    hudRoot.render(null);potRoot.render(null);infoRoot.render(null);el('actions').hidden=el('deal-actions').hidden=true
    inspected=false;menuOpen=false;drinkMenuOpen=false;wagerOpen=false;leisure={kind:'old-fashioned',available:false}
    connectionLost=false;authorityRevision=-1;el('menu').hidden=true;leisureRoot.render(null);bankRoot.render(null);showSaved(); return
  }
  const v = state.view, own = v.players[v.self.seat]
  if(v.revision !== authorityRevision) { authorityRevision=v.revision; controlsRevision++ }
  ensureRoom(v.self.seat)
  room?.updateRemote(v,v.self.seat);room?.setPlaying(v.phase!=='ready' && !v.self.waiting)
  room?.setPaused(state.paused || connectionLost || ended || menuOpen)
  // Closing a menu must not resume a queued leisure request after an authority
  // interruption. The existing Room clock/owner handles held prop continuity.
  if(state.paused || connectionLost || ended || menuOpen || v.self.waiting) drinkMenuOpen=false
  syncLookBlocked();renderLeisure()
  for(const p of v.players) if(p.displaySeat!==0) {
    const label=labels.get(p.displaySeat)
    if(!label)continue
    label.node.classList.toggle('active',v.actor===p.seat);label.node.classList.toggle('folded',p.folded)
    label.node.classList.toggle('out',p.stack===0 && !p.committed);label.node.style.setProperty('--seat-color',CHARACTERS[p.seat].color)
    label.root.render(createElement(SeatContents,{name:p.name,dealer:v.dealer===p.seat,blind:v.smallBlindSeat===p.seat?'SB':v.bigBlindSeat===p.seat?'BB':'',
      stack:p.stack,action:v.actor===p.seat?(p.kind==='human'?'DECIDING':'THINKING'):p.action||CHARACTERS[p.seat].title,
      visibleCards:p.cards.kind==='visible'?p.cards.values:[]}))
  }
  el('labels').hidden=inspected
  el('connection').textContent = connectionLost || ended ? 'Connection interrupted — wagering disabled' : !state.hostConnected ? 'Host disconnected — table suspended' : state.paused ? 'Table paused' : v.self.waiting ? 'Seat reserved — joining next hand' : v.actor===v.self.seat ? 'Your move' : 'Connected · LAN'
  el('invite').textContent = state.code ? `Lobby code: ${state.code.slice(0,5)}-${state.code.slice(5)}` : 'Six playing seats · empty seats are NPCs'
  el('host-storage').textContent = state.durable ? 'Host saves this table privately. A host restart pauses play until the host resumes.' : 'Disposable host: stopping its process ends this table.'
  const phase=v.phase==='betting'?['Pre-flop','Flop','Turn','River'][v.street]:v.phase==='ready'?'Waiting for host':v.phase==='complete'?'Hand complete':v.phase==='showdown'?'Showdown':'Dealing'
  const winners=v.phase==='complete'?v.results.filter(r=>r.won>0).map(r=>`${v.players[r.seat].name} wins ${r.won}`).join(' · '):''
  const ownCards=own.cards.kind==='visible'?own.cards.values:[],finished=v.phase==='complete',turn=v.phase==='betting'&&v.actor===v.self.seat
  const hand=ownCards.length===2&&v.board.length>=3?evaluate([...ownCards,...v.board]).name:'Practice chips'
  const status=connectionLost||ended?'Connection interrupted':state.paused?'Table paused':v.self.waiting?'Your seat is reserved.':finished?winners:turn?'Your move.':v.actor!==null?`${v.players[v.actor].name} is thinking…`:phase
  infoRoot.render(createElement(TableInfo,{handNumber:v.handNumber,smallBlind:v.smallBlind,bigBlind:v.bigBlind}))
  potRoot.render(createElement(PotContents,{finished,amount:finished?v.awards.reduce((n,a)=>n+a.amount,0):v.pot,sidePots:v.awards.length-1}))
  hudRoot.render(createElement(TableReadout,{board:v.board,street:STREETS[v.street],ownCards,stack:own.stack,
    position:`${v.dealer===own.seat?' · DEALER':''}${v.smallBlindSeat===own.seat?' · SB':''}${v.bigBlindSeat===own.seat?' · BB':''}`,
    handLabel:own.folded?'Folded':hand,status,detail:pending?'Sending…':v.self.waiting?'Joining at the next hand':own.action,
    winningCards:finished?v.results.find(r=>r.seat===own.seat&&r.won>0)?.hand?.cards??[]:[],withActions:turn||finished||v.phase==='ready'}))
  // Polls and reconnect snapshots are not new chip sounds. Prime once, then
  // emit only for a later game revision while connected; no audio ledger.
  if(lastSoundView && v.gameRevision>lastSoundView.revision && !state.paused&&!connectionLost&&focused&&!document.hidden) {
    if(v.handNumber!==lastSoundView.hand || v.board.length!==lastSoundView.board)audio.play('card')
    else if(finished&&!lastSoundView.finished)audio.play('win')
    else if(turn&&!lastSoundView.turn)audio.play('turn')
    else if(!finished)audio.play('chip')
    // A complete-hand bank transfer is NOT another poker win.
  }
  lastSoundView={revision:v.gameRevision,hand:v.handNumber,board:v.board.length,finished,turn}
  // Names are untrusted text. Never use innerHTML for a roster, including a
  // developer-only lobby: it holds the same bearer token as the eventual game.
  el('players').replaceChildren(...[...v.players].sort((a,b)=>a.displaySeat-b.displaySeat).map(p => {
    const li = document.createElement('li'); li.textContent = `${p.name} · ${p.kind}${p.pendingName ? ' · next: '+p.pendingName : ''} · ${p.stack} chips · ${p.action || 'waiting'}${v.actor===p.seat ? ' · to act' : ''}`; return li
  }))
  el('deal-actions').hidden = !state.isHost || !['ready','complete'].includes(v.phase) || state.paused || menuOpen; el('pause').hidden = !state.isHost
  el('start').disabled = pending || state.paused || connectionLost || ended
  el('pause').disabled = pending; el('pause').textContent = state.paused ? 'Resume table' : 'Pause table'
  el('leave').disabled = pending
  el('leave').textContent = state.isHost ? 'End session for everyone' : 'Leave table'
  bankRoot.render(createElement(BankControls,{offer:v.self.bank,revision:v.revision,
    blocked:pending || state.paused || connectionLost || ended || !menuOpen,onConfirm:bankTransfer}))
  const canAct = !pending && !state.paused && !connectionLost && !ended && !menuOpen && !drinkMenuOpen && !v.self.waiting && v.actor === v.self.seat && v.phase === 'betting'
  el('actions').hidden=!turn || state.paused || menuOpen || connectionLost || ended
  bettingRoot.render(createElement(BettingControls,{ref:bettingRef, revision:controlsRevision, blocked:!canAct,
    legal:v.legal,pot:v.pot,currentBet:v.currentBet,ownBet:own.bet,bigBlind:v.bigBlind,onAction:wager,
    onOpenChange:onWagerOpen,focusTable}))
  el('inspect').disabled=state.paused || v.self.waiting || connectionLost || ended || menuOpen
  el('inspect').setAttribute('aria-pressed',String(inspected));el('inspect').firstChild.nodeValue=inspected?'Look up ':'Cards & chips '
}
async function run(work) {
  if (pending) return
  pending = true; el('error').textContent = ''; render()
  try { await work() } catch (error) {
    if (!(error instanceof ObsoleteResponse)) { controlsRevision++; el('error').textContent = error.message }
  }
  finally { pending = false; render() }
}
async function enter(joining) {
  playerName = el('name').value
  // Save the retry identity before sending. A lost admission response must not
  // become a second player when this tab reloads and retries with the same name.
  save()
  const result = await api(joining ? '/api/join' : '/api/create', { name: playerName, nonce: admissionNonce, ...(joining ? { code: el('code').value } : {}) })
  responses.reset(); token = result.token; save(el('remember').checked); await api('/api/state')
}
el('create').onclick = () => run(() => enter(false)); el('join').onclick = () => run(() => enter(true))
el('start').onclick = () => run(() => api('/api/start', { revision: state.view.revision }))
el('pause').onclick = () => run(() => api('/api/pause', { paused: !state.paused }))
el('leave').onclick = () => run(async () => { await api('/api/leave', {}); responses.reset();forget(seatKey());token=''; state=null; admissionNonce=hex(); el('connection').textContent='Left table' })
el('forget').onclick = () => {
  responses.reset();forget(seatKey());token=''; state=null; ended=false; admissionNonce=hex()
  el('forget').hidden=true; el('error').textContent=''; el('connection').textContent='Not connected'; render()
}
el('resume-seat').onclick = () => {
  const selected = savedKeys[Number(el('saved-seats').value)]
  if (!selected) return
  void run(async () => {
    responses.reset();token=selected.token;admissionNonce=selected.nonce;playerName=selected.name;ended=false;renderFailed=false
    save(); await api('/api/state')
  })
}
el('forget-seat').onclick = () => {
  const selected = savedKeys[Number(el('saved-seats').value)]
  if (selected) { forget(selected);showSaved() }
}
el('remember-current').onclick = () => {
  if (recovery.save(seatKey(), true)) el('seat-note').textContent = 'Seat remembered on this browser. Close this tab before resuming it in another.'
  else el('storage-warning').textContent = 'Browser storage is unavailable. Keep this tab open; the seat was not safely remembered.'
}
function wager(action) {
  // Capture one intent before awaiting. Never silently update its revision or
  // resubmit a different wager after a failed request; refresh and let the human
  // decide. Host idempotency is a second barrier, not permission to auto-bet.
  if(pending || ended || connectionLost || menuOpen || drinkMenuOpen || !state || state.paused || state.view.actor!==state.view.self.seat) return false
  const v = state.view
  void run(() => api('/api/action', { sequence: v.self.nextSequence, revision: v.revision, action }))
  return true
}
function bankTransfer(action,revision) {
  if(pending || ended || connectionLost || !state || state.paused || !menuOpen || state.view.revision!==revision)return false
  const v=state.view,offer=v.self.bank
  if(action.type==='borrow' ? !offer.canBorrow : action.amount<=0 || action.amount>offer.repayMax)return false
  // Same authenticated command sequence as wagers; no client balance/debt
  // mutation, separate bank save or retry after a lost acknowledgement.
  void run(()=>api('/api/action',{sequence:v.self.nextSequence,revision,action}))
  return true
}
function menu(open) {menuOpen=open;el('menu').hidden=!open;syncLookBlocked();render();if(!open)focusTable()}
el('details').onclick=()=>menu(!menuOpen);el('close-menu').onclick=()=>menu(false)
function inspect(active) {if(active)drinkMenuOpen=false;inspected=active;room?.setInspection(active);el('labels').hidden=active;syncLookBlocked();render()}
el('inspect').onclick=()=>{inspect(!inspected);focusTable()}
el('app').addEventListener('keydown',event=>{
  const target=event.target.closest('input,select,textarea,[contenteditable=true]')?'editing':event.target.closest('button,a')?'control':'table'
  if(!state || target==='editing' || event.altKey || event.ctrlKey || event.metaKey || event.isComposing)return
  if(event.key.toLowerCase()==='m'&&!event.repeat){event.preventDefault();muted=!muted;audio.setMuted(muted);if(!muted)audio.unlock();render();return}
  if(event.key==='Escape' && drinkMenuOpen){event.preventDefault();event.stopPropagation();drinkMenu(false);return}
  if(event.key==='Escape' && menuOpen){event.preventDefault();menu(false);return}
  const leisureAction=leisureShortcut(event,target,leisureContext())
  if(leisureAction){event.preventDefault();requestLeisure(leisureAction);return}
  if(bettingRef.current?.handleKey({key:event.key,repeat:event.repeat,shiftKey:event.shiftKey,altKey:event.altKey,ctrlKey:event.ctrlKey,metaKey:event.metaKey,nativeEvent:event,
    preventDefault:()=>event.preventDefault(),stopPropagation:()=>event.stopPropagation()},target))return
  if(event.key==='Escape'&&!event.repeat&&!pending){event.preventDefault();if(state.isHost)void run(()=>api('/api/pause',{paused:!state.paused}));else menu(true);return}
  if(event.key===' ' && target==='table' && !menuOpen && !drinkMenuOpen && !connectionLost && !ended && !state.paused && !state.view.self.waiting){event.preventDefault();inspect(true)}
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
  try { await api('/api/state') } catch (error) {
    if (!(error instanceof ObsoleteResponse)) { connectionLost=true;el('error').textContent=error.message;render() }
  }
  finally { polling=false }
}
setInterval(poll,500); render(); void poll()
