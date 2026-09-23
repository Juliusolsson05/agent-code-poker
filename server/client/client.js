import { Fragment, createElement, createRef } from 'react'
import { createRoot } from 'react-dom/client'
import { PokerRoom } from '../../src/scene/Room'
import { BettingControls } from '../../src/components/BettingControls'
import { SeatRecovery } from './SeatRecovery'
import { resumeSeats, seatsForCreate, seatsForResume } from './resumeSeats'
import { ResponseOrder, ObsoleteResponse } from './ResponseOrder'
import { LeisureControls, leisureShortcut } from './LeisureControls'
import { isDrinkKind } from '../../src/scene/props/specs'
import { BankControls } from '../../src/components/BankControls'
import { PokerHeader, TableInfo, SeatContents, PotContents, TableReadout } from '../../src/components/PokerChrome'
import { evaluate } from '../../src/engine/cards'
import { CHARACTERS, STREETS } from '../../src/engine/game'
import { PokerAudio } from '../../src/audio'
import fireplaceRecording from '../../src/assets/audio/fireplace-creator-assets.mp3?inline'
import { FIREPLACE_LAYOUT } from '../../src/scene/environment/layout'
import { TAVERN_FEATURES } from '../../src/scene/environment/features'
import { SEATS } from '../../src/scene/environment/layout'
import { ChatVoice } from './ChatVoice'
import { ChatBubble, ChatInput, ChatLog, FeatureSwitches, VoiceSettingsPanel, bubbleFor, chatShortcut } from './ChatControls'
import { VOICE_FAILURE_TEXT, createElevenLabsProvider, normalizeVoiceSettings } from '../../src/voice/ElevenLabs'
import { browserVoiceSettingsStore } from '../../src/voice/settingsStore'
import { browserVoiceHttp } from '../../src/voice/transports'
import '../../src/styles.css'
import '../../dev/preview.css'
import './style.css'
const el = id => document.getElementById(id)
const recovery = new SeatRecovery(() => sessionStorage, () => localStorage)
const responses = new ResponseOrder()
const hex = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), v => v.toString(16).padStart(2, '0')).join('')
let token = '', admissionNonce = hex(), state = null, pending = false, polling = false, ended = false
let room = null, renderFailed = false, inspected = false, menuOpen = false, connectionLost = false, controlsRevision = 0, authorityRevision = -1
let drinkMenuOpen = false, wagerOpen = false, leisure = { kind: 'old-fashioned', available: false, treat: null, canConsume: false }
const labels = new Map(), bettingRef = createRef(), bettingRoot = createRoot(el('actions'))
const leisureRoot = createRoot(el('leisure'))
const bankRoot = createRoot(el('bank'))
const chatRoot = createRoot(el('chat')), featuresRoot = createRoot(el('features')), voiceRoot = createRoot(el('voice-settings'))
const headerRoot=createRoot(el('header')),hudRoot=createRoot(el('hud')),potRoot=createRoot(el('pot')),infoRoot=createRoot(el('table-info'))
const audio=new PokerAudio(TAVERN_FEATURES.fireplace?fireplaceRecording:undefined,
  [FIREPLACE_LAYOUT.position[0],.4,FIREPLACE_LAYOUT.position[2]+.05])
let muted=false,sceneViewer=null,focused=document.hasFocus(),lookEnabled=true
const soundActive=()=>audio.setAmbienceActive(!!state && !state.paused && !connectionLost && !ended && !menuOpen && !document.hidden && focused)
el('app').addEventListener('pointerdown',()=>audio.unlock())
el('app').addEventListener('keydown',event=>{if(!event.repeat)audio.unlock()})
document.addEventListener('visibilitychange',()=>{soundActive();if(!document.hidden)render()})
document.addEventListener('fullscreenchange',()=>render())
window.addEventListener('blur',()=>{focused=false;soundActive()})
window.addEventListener('focus',()=>{focused=true;soundActive()})
window.addEventListener('pagehide',()=>audio.dispose(),{once:true})
const focusTable = () => el('app').focus()
const syncLookBlocked = () => room?.setLookBlocked(wagerOpen || menuOpen || drinkMenuOpen || chatOpen)
const onWagerOpen = open => { wagerOpen=open;syncLookBlocked();renderLeisure() }
// ── Chat and voices ─────────────────────────────────────────────────────────
// This player's ElevenLabs settings live ONLY in this tab/frame (see
// src/voice/settingsStore.ts). The website default is this browser's storage
// and a direct browser fetch; the Agent Code LAN view swaps in the extension's
// secret storage and the host-brokered fetch via setVoiceEnvironment().
let voiceEnv = { store: browserVoiceSettingsStore(() => localStorage), http: browserVoiceHttp() }
let voiceSettings = null, voiceStatus = '', chatOpen = false, chatStatus = '', featuresPending = false
const voiceProvider = () => voiceSettings ? createElevenLabsProvider(() => voiceSettings, voiceEnv.http) : null
// Display seat -> head position. The room is built in display coordinates
// (the viewer always sits at SEATS[0]), so the same index that places a label
// places the voice. Seat 0 is this player: played in-head, no panner.
const speakerPosition = seat => seat === 0 || !SEATS[seat] ? null : [SEATS[seat][0], 1.45, SEATS[seat][1]]
const chatVoice = new ChatVoice({
  hostApi: (path, body) => api(path, body), provider: voiceProvider,
  play: (bytes, seat) => { void audio.playVoice(bytes, seat, speakerPosition(seat)) },
  stopAll: () => audio.stopVoices(),
})
export function setVoiceEnvironment(env) { voiceEnv = env; voiceSettings = null; voiceStatus = ''; void loadVoiceSettings() }
async function loadVoiceSettings() {
  const env = voiceEnv, loaded = await env.store.load().catch(() => null)
  if (env === voiceEnv) { voiceSettings = loaded; render() }
}
async function saveVoiceSettings(apiKey, voiceId) {
  const next = normalizeVoiceSettings({ apiKey, voiceId })
  if (!next) { voiceStatus = 'That key or voice ID does not look right. Copy both from your ElevenLabs account.'; render(); return }
  const saved = await voiceEnv.store.save(next)
  voiceSettings = next
  voiceStatus = saved ? 'Voice saved.' : 'Could not save it here; it will be used in this tab until you close it.'
  render()
}
async function forgetVoiceSettings() { await voiceEnv.store.clear(); voiceSettings = null; voiceStatus = 'Key forgotten on this device.'; render() }
async function testVoice() {
  const provider = voiceProvider()
  if (!provider) return
  voiceStatus = 'Asking ElevenLabs…'; render(); audio.unlock()
  const result = await provider.synthesize('This is how I sound at the table.')
  voiceStatus = !result.ok ? VOICE_FAILURE_TEXT[result.reason] : muted ? 'Voice works. Unmute sound (M) to hear it.' : 'Voice works.'
  if (result.ok) void audio.playVoice(result.audio, 0, null)
  render()
}
const CHAT_REFUSALS = { 'rate-limited': 'Slow down: one message every few seconds.', invalid: 'Messages are one line of plain text, up to 200 characters.',
  disconnected: 'Reconnecting; message not sent.', unauthorized: 'You are no longer at this table.' }
async function sendChat(text) {
  // Resolves on the host's receipt; the voice outcome reports later, so the
  // box is free again while ElevenLabs works.
  const outcome = await chatVoice.send(text, !!state?.features?.voices, voice => {
    chatStatus = voice.issue === 'too-long' ? 'Too long to relay: only you heard it; others see the text.'
      : voice.issue === 'relay-refused' ? 'Others see this line as text only.'
      : voice.issue && VOICE_FAILURE_TEXT[voice.issue] ? VOICE_FAILURE_TEXT[voice.issue] : ''
    render()
  })
  if (!outcome.sent) { chatStatus = CHAT_REFUSALS[outcome.error] ?? outcome.error; render(); return false }
  chatStatus = ''; render(); return true
}
function openChat(open) { chatOpen = open; syncLookBlocked(); render(); if (!open) focusTable() }
function setFeatures(next) {
  if (!state?.isHost || featuresPending) return
  featuresPending = true; render()
  void api('/api/features', next).catch(error => { if (!(error instanceof ObsoleteResponse)) el('error').textContent = error.message })
    .finally(() => { featuresPending = false; render() })
}
const currentKey = recovery.current()
let savedKeys = [], playerName = currentKey?.name || 'Guest', tableCode = currentKey?.code || ''
if (currentKey) { token = currentKey.token; admissionNonce = currentKey.nonce; el('name').value = playerName }
const records = [], started = new Date().toISOString()
let truncated = false
// The table code and save time are labels for the saved-seat picker (#24),
// never credentials; the host authenticates only the token.
const seatKey = () => ({ token, nonce: admissionNonce, name: playerName, ...(tableCode ? { code: tableCode } : {}), at: Date.now() })
const normalizeCode = value => String(value || '').toUpperCase().replace(/[^A-F0-9]/g, '')
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
    const option = document.createElement('option'); option.value = String(index)
    const when = key.at ? new Date(key.at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'earlier'
    option.textContent = `${key.name} · ${key.code ? `table ${key.code.slice(0,5)}-${key.code.slice(5)}` : 'unknown table'} · ${when}`; return option
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
// The website calls its own origin with fetch. The Agent Code extension view
// installs an adapter first (service proxy when hosting, brokered net.fetch
// when joining a friend) so admission, polling and poker actions flow through
// ONE seam without the client knowing which world it runs in.
let apiTransport = null
export function setApiTransport(transport) { apiTransport = transport }
async function api(path, body) {
  const request = responses.begin()
  let response, data
  try {
    response = apiTransport ? await apiTransport({
      path, method: body === undefined ? 'GET' : 'POST',
      headers: { ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    }) : await fetch(path, { method: body === undefined ? 'GET' : 'POST', cache: 'no-store',
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
    if (newGeneration || connectionLost) audio.resetEvents()
    if (newGeneration) { controlsRevision++; authorityRevision=-1; inspected=false;room?.setInspection(false);chatVoice.reset() }
    state = data; connectionLost = false; render()
  } else if (!response.ok && !responses.failureCurrent(request)) {
    throw new ObsoleteResponse()
  }
  if (token && [401,410].includes(response.status)) { ended = true; responses.reset(); el('forget').hidden = false }
  // Carry the HTTP status: callers branch on it (409 on create, #24) instead
  // of matching message text that a copy edit could silently break.
  if (!response.ok) throw Object.assign(new Error(data.error || data.receipt?.code || 'Request rejected.'), { status: response.status })
  return data
}
function leisureContext() {
  return { available: leisure.available, menuOpen: drinkMenuOpen, treatsAllowed: !!state?.features?.treats,
    blocked: !state || !room || renderFailed || pending || connectionLost || ended ||
      state.paused || state.view.phase==='ready' || state.view.self.waiting || inspected || menuOpen || wagerOpen }
}
function renderLeisure() {
  if (!state) { leisureRoot.render(null);return }
  leisureRoot.render(createElement(LeisureControls,{...leisureContext(),kind:leisure.kind,treat:leisure.treat,canConsume:leisure.canConsume,
    onSmoke:()=>requestLeisure('smoke'),onSip:()=>requestLeisure('drink'),onConsume:()=>requestLeisure('consume'),onMenuChange:drinkMenu,
    onOrder:kind=>{
      // Recheck current context on dispatch, not the last React frame. Polls
      // may pause/disconnect the table between rendering and a queued click.
      // Treats (#14) are local cosmetic props exactly like drinks: nothing is
      // sent to the host, and the effect they feed stays on this screen.
      const context=leisureContext()
      // Only drink orders reach the host (other players see the glass); a treat
      // order stays local like the treat itself (see Room.onLeisureStarted).
      if(!isDrinkKind(kind) && !context.treatsAllowed)return
      if(!context.blocked && context.available && (isDrinkKind(kind)?room?.orderDrink(kind):room?.orderTreat(kind))) {
        if(isDrinkKind(kind))sendLeisure({action:'order',kind})
        drinkMenu(false)
      }
    }}))
}
// Other players only see this avatar's gestures through the host. Sent from
// the room's onLeisureStarted (wired in ensureRoom), i.e. when the gesture
// ACTUALLY starts locally, never at request time: with mouse-look a request is
// only queued until the view re-centres, and an interruption before that
// (pause, hand end, a panel, inspection) must not have been broadcast. Outside
// run()/pending, so a cigar can never disable wagering or show "Sending…".
// Fire-and-forget: the reply is a bare receipt (no envelope), the next poll
// carries the projected result, and a refusal only means the others miss one
// cosmetic gesture. Never retried: replaying a puff late is worse than missing it.
let leisureSending=false,lastLeisureHeal=-Infinity
function sendLeisure(body) {
  if(!token || ended)return
  // Any send already tells the host our glass; do not let the heal fire a
  // redundant order right behind a user's own sip or order.
  leisureSending=true;lastLeisureHeal=performance.now()
  void api('/api/leisure',body).catch(()=>{}).finally(()=>{leisureSending=false})
}
function leisureStarted(kind) {
  // publishLeisure ran synchronously before the start, so leisure.kind is the
  // glass actually being lifted, which is what the others must see.
  sendLeisure(kind==='smoke'?{action:'smoke'}:{action:'sip',kind:leisure.kind})
}
function requestLeisure(kind) {
  const context=leisureContext()
  if(context.blocked || context.menuOpen || !context.available)return
  // Treats off (host switch): the E button is hidden and leisureShortcut drops
  // E, and this is the last check before the Room, for any other caller.
  if(kind==='consume' && !context.treatsAllowed)return
  if(kind==='smoke')room?.smokeCigar();else if(kind==='consume')room?.consumeTreat();else room?.sipDrink()
  focusTable()
}
/** The host remembers the drink it last heard about; this tab's glass resets
 * on reload (and a newcomer never ordered at all). One throttled order heals
 * the difference so the others see the glass this player actually holds. */
function healProjectedDrink(v) {
  const projected=v.players[v.self.seat]?.leisure
  if(!projected || projected.drinkKind===leisure.kind || leisureSending || state.paused || v.self.waiting ||
    connectionLost || ended || !room || performance.now()-lastLeisureHeal<3000)return
  lastLeisureHeal=performance.now();sendLeisure({action:'order',kind:leisure.kind})
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
    // Viewer changes rebuild the room, but should not undo this browser's
    // comfort preference. It stays local: camera settings are never host state.
    room.setLookEnabled(lookEnabled);room.onLeisureStarted=leisureStarted
    // Rebuilt rooms keep the chosen effect level too (a new room starts Off).
    room.setDrinkEffect(el('drink-effect').value)
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
    state&&createElement('button',{'aria-label':'Recenter view',title:'Drag the room to look · Recenter (R)',disabled:leisureContext().blocked || drinkMenuOpen,onClick:()=>{room?.recenterLook();focusTable()}},'⌖'),
    state?.isHost&&createElement('button',{'aria-label':state.paused?'Resume table':'Pause table',disabled:pending,onClick:()=>run(()=>api('/api/pause',{paused:!state.paused}))},state.paused?'▶':'Ⅱ'),
    document.fullscreenEnabled&&createElement('button',{'aria-label':document.fullscreenElement?'Exit fullscreen':'Enter fullscreen',onClick:()=>{void (document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()).catch(()=>{el('error').textContent='Fullscreen unavailable. The game still fills the browser.'})}},'⤢')))
  el('app').classList.toggle('inspecting',inspected)
  soundActive()
  el('create').disabled = pending || !!token; el('join').disabled = pending || !!token
  if (!state) {
    ensureRoom(0,true);room?.setPlaying(false);bettingRoot.render(null);audio.resetEvents()
    hudRoot.render(null);potRoot.render(null);infoRoot.render(null);el('actions').hidden=el('deal-actions').hidden=true
    inspected=false;menuOpen=false;drinkMenuOpen=false;wagerOpen=false;leisure={kind:'old-fashioned',available:false,treat:null,canConsume:false}
    connectionLost=false;authorityRevision=-1;el('menu').hidden=true;leisureRoot.render(null);bankRoot.render(null)
    chatOpen=false;chatStatus='';chatVoice.reset();chatRoot.render(null);featuresRoot.render(null);renderVoiceSettings();showSaved(); return
  }
  const v = state.view, own = v.players[v.self.seat]
  if(v.revision !== authorityRevision) { authorityRevision=v.revision; controlsRevision++ }
  ensureRoom(v.self.seat)
  room?.updateRemote(v,v.self.seat);room?.setPlaying(v.phase!=='ready' && !v.self.waiting)
  room?.setPaused(state.paused || connectionLost || ended || menuOpen)
  // Closing a menu must not resume a queued leisure request after an authority
  // interruption. The existing Room clock/owner handles held prop continuity.
  if(state.paused || connectionLost || ended || menuOpen || v.self.waiting) drinkMenuOpen=false
  syncLookBlocked();renderLeisure();healProjectedDrink(v)
  for(const p of v.players) if(p.displaySeat!==0) {
    const label=labels.get(p.displaySeat)
    if(!label)continue
    label.node.classList.toggle('active',v.actor===p.seat);label.node.classList.toggle('folded',p.folded)
    label.node.classList.toggle('out',p.stack===0 && !p.committed);label.node.style.setProperty('--seat-color',CHARACTERS[p.seat].color)
    // The bubble is a child of the label node, so it rides whatever projection
    // Room applies to that node (since PR #20, the render camera's projection); chat
    // needs no second world-to-screen path that could drift from the label.
    const bubble=bubbleFor(v.chat??[],p.displaySeat)
    label.root.render(createElement(Fragment,null,createElement(SeatContents,{name:p.name,dealer:v.dealer===p.seat,blind:v.smallBlindSeat===p.seat?'SB':v.bigBlindSeat===p.seat?'BB':'',
      stack:p.stack,action:v.actor===p.seat?(p.kind==='human'?'DECIDING':'THINKING'):p.action||CHARACTERS[p.seat].title,
      visibleCards:p.cards.kind==='visible'?p.cards.values:[]}),bubble&&createElement(ChatBubble,{key:bubble.seq,line:bubble})))
  }
  el('labels').hidden=inspected
  const voicesOn=!!state.features?.voices
  chatVoice.observe(v.chat??[],voicesOn,!muted&&!document.hidden)
  chatRoot.render(createElement(Fragment,null,createElement(ChatLog,{lines:v.chat??[],status:chatStatus}),
    chatOpen&&createElement(ChatInput,{onSend:sendChat,onClose:()=>openChat(false),
      voiceHint:voicesOn?(voiceSettings?'spoken in your voice':'voices are on: add your key in Table menu'):''})))
  featuresRoot.render(createElement(FeatureSwitches,{isHost:!!state.isHost,features:state.features??{voices:false,treats:false},pending:featuresPending||pending,onChange:setFeatures}))
  renderVoiceSettings()
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
  // Authority seats, not rotated display slots. Polls/menus/restore must not
  // fabricate chip sounds; shared owner silently advances inaudible snapshots.
  audio.observe(v.gameRevision,{hand:v.handNumber,phase:v.phase,actor:v.actor,boardCount:v.board.length,
    players:v.players.map(p=>({seat:p.seat,stack:p.stack,bet:p.bet,folded:p.folded,action:p.action}))},
    !state.paused&&!connectionLost&&!ended&&!menuOpen&&!v.self.waiting&&focused&&!document.hidden,v.self.seat)
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
function renderVoiceSettings() {
  voiceRoot.render(createElement(VoiceSettingsPanel,{where:voiceEnv.store.where,configured:!!voiceSettings,status:voiceStatus,
    onSave:(key,voice)=>{void saveVoiceSettings(key,voice)},onForget:()=>{void forgetVoiceSettings()},onTest:()=>{void testVoice()}}))
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
  let result
  try {
    result = await api(joining ? '/api/join' : '/api/create', { name: playerName, nonce: admissionNonce, ...(joining ? { code: el('code').value } : {}) })
  } catch (error) {
    // Only the host computer can create, and a 409 there means this host
    // already holds a table (usually restored after a restart). The player on
    // this computer almost certainly owns a saved seat for it, so try those
    // before dead-ending on "table already exists" (#24).
    if (!joining && error?.status === 409) {
      const mine = seatsForCreate(recovery.saved(), playerName)
      if (mine.length && await resumeSaved(mine)) return
      showSaved()
      throw new Error(recovery.saved().length
        ? 'This host already has a table. No saved seat under this name belongs to it; choose one under "Return to a saved seat", or restart the host with a fresh table.'
        : 'This host already has a table, and this browser has no saved seat for it. Resume from the browser that created it, or restart the host with a fresh table.')
    }
    throw error
  }
  tableCode = normalizeCode(result.code || (joining ? el('code').value : ''))
  responses.reset(); token = result.token; save(el('remember').checked); await api('/api/state')
}
/** Try saved seats in order until the host accepts one. A 401/410 proves that
 * seat belongs to a table this host no longer has, so it is forgotten and the
 * next is tried. Any other failure (host down, timeout) proves nothing about
 * the seat and stops the loop with the seat intact. */
async function resumeSaved(candidates) {
  const disconnect = () => { responses.reset(); token=''; admissionNonce=hex(); playerName=el('name').value || 'Guest'; tableCode=''; state=null; ended=false; el('forget').hidden=true }
  let found
  try {
    found = await resumeSeats(candidates, async key => {
      responses.reset();token=key.token;admissionNonce=key.nonce;playerName=key.name;tableCode=key.code||'';ended=false;renderFailed=false
      try { await api('/api/state'); return 'accepted' }
      catch (error) { if (ended) return 'rejected'; throw error }
    }, key => forget(key))
  } catch (error) {
    // Never keep a borrowed seat after a transient failure: polling would
    // otherwise seat this tab as that player once the network heals.
    disconnect(); showSaved(); throw error
  }
  if (found) { save(true); return true }
  disconnect(); showSaved(); return false
}
el('create').onclick = () => run(() => enter(false)); el('join').onclick = () => run(() => enter(true))
el('start').onclick = () => run(() => api('/api/start', { revision: state.view.revision }))
el('pause').onclick = () => run(() => api('/api/pause', { paused: !state.paused }))
el('leave').onclick = () => run(async () => { await api('/api/leave', {}); responses.reset();forget(seatKey());token=''; state=null;chatVoice.reset(); admissionNonce=hex(); el('connection').textContent='Left table' })
el('forget').onclick = () => {
  responses.reset();forget(seatKey());token=''; state=null; ended=false; admissionNonce=hex();chatVoice.reset()
  el('forget').hidden=true; el('error').textContent=''; el('connection').textContent='Not connected'; render()
}
el('resume-seat').onclick = () => {
  const selected = savedKeys[Number(el('saved-seats').value)]
  if (!selected) return
  // The chosen seat first, then only other seats saved under the SAME name,
  // newest first: after a restart the player should not have to guess which of
  // several "Bigj" entries is live, but a dead "Alice" seat must never fall
  // through to Bob's live one (#27, see seatsForResume).
  void run(async () => {
    if (!await resumeSaved(seatsForResume(selected, recovery.saved()))) throw new Error(`None of the seats saved as "${selected.name}" belong to a table on this host. They were removed; choose another saved seat, or create or join a table.`)
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
for(const id of ['ambience-level','effects-level'])el(id).onchange=()=>{
  audio.setLevels(Number(el('ambience-level').value),Number(el('effects-level').value))
}
// Same local setting and engine as solo (#15). It only reacts to THIS
// browser's completed sips/treats; no peer can drive another screen's effect.
el('drink-effect').onchange=()=>room?.setDrinkEffect(el('drink-effect').value)
el('look-enabled').onclick=()=>{
  lookEnabled=!lookEnabled;room?.setLookEnabled(lookEnabled)
  el('look-enabled').setAttribute('aria-pressed',String(lookEnabled))
  el('look-enabled').textContent=lookEnabled?'On':'Off'
}
function inspect(active) {if(active)drinkMenuOpen=false;inspected=active;room?.setInspection(active);el('labels').hidden=active;syncLookBlocked();render()}
el('inspect').onclick=()=>{inspect(!inspected);focusTable()}
el('app').addEventListener('keydown',event=>{
  const target=event.target.closest('input,select,textarea,[contenteditable=true]')?'editing':event.target.closest('button,a')?'control':'table'
  if(!state || target==='editing' || event.altKey || event.ctrlKey || event.metaKey || event.isComposing)return
  if(chatShortcut(event,target,!state || ended || connectionLost || menuOpen || drinkMenuOpen || inspected || wagerOpen || chatOpen)){event.preventDefault();openChat(true);return}
  if(event.key.toLowerCase()==='m'&&!event.repeat){event.preventDefault();muted=!muted;audio.setMuted(muted);if(!muted)audio.unlock();render();return}
  if(event.key==='Escape' && drinkMenuOpen){event.preventDefault();event.stopPropagation();drinkMenu(false);return}
  if(event.key==='Escape' && menuOpen){event.preventDefault();menu(false);return}
  // A sizing tray owns keys while open. R must not steal native input focus,
  // bypass inspection/contact arbitration, or mutate a shared poker revision.
  if(event.key.toLowerCase()==='r' && target==='table' && !event.repeat && !leisureContext().blocked && !drinkMenuOpen){event.preventDefault();room?.recenterLook();return}
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
el('chat-open').onclick=()=>{if(state&&!chatOpen)openChat(true)}
setInterval(poll,500); render(); void poll(); void loadVoiceSettings()
