import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { PokerApi } from './api'
import { PokerAudio } from './audio'
import fireplaceRecording from './assets/audio/fireplace-creator-assets.mp3?inline'
import { evaluate } from './engine/cards'
import { chooseAction, observe } from './engine/bots'
import { CHARACTERS, PokerGame, STREETS, type Action, type GameState, type Legal } from './engine/game'
import { PokerRoom } from './scene/Room'
import { DRINKS, type DrinkKind } from './scene/props/specs'
import { DrinkMenu } from './components/DrinkMenu'
import { PlayingCard } from './components/PlayingCard'
import { CommunityBoard } from './components/CommunityBoard'

const SAVE_KEY = 'poker.table.v1'
type Save = { table: GameState | null; muted: boolean; speed: 'relaxed' | 'brisk' }
const chips = (value: number) => value.toLocaleString('en-US')
const isInput = (target: EventTarget | null) => target instanceof HTMLElement && !!target.closest('button, input, select, textarea, a, [contenteditable]')
const isEditing = (target: EventTarget | null) => target instanceof HTMLElement && !!target.closest('input, select, textarea, [contenteditable]')

export function App({ api }: { api: PokerApi }) {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const game = useRef<PokerGame | null>(null)
  const [loading, setLoading] = useState(true)
  const [lobby, setLobby] = useState(true)
  const [paused, setPaused] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loadFailed, setLoadFailed] = useState(false)
  const [sceneFailed, setSceneFailed] = useState(false)
  const [muted, setMuted] = useState(false)
  const [speed, setSpeed] = useState<Save['speed']>('relaxed')
  const [panel, setPanel] = useState<'history' | 'settings' | 'rules' | null>(null)
  const [confirmNew, setConfirmNew] = useState(false)
  const [raiseTo, setRaiseTo] = useState(40)
  const [raiseOpen, setRaiseOpen] = useState(false)
  const [inspecting, setInspecting] = useState(false)
  const [drinkMenu, setDrinkMenu] = useState(false)
  const [leisure, setLeisure] = useState<{ kind: DrinkKind; available: boolean }>({ kind: 'old-fashioned', available: false })
  const inspectionHeld = useRef(false)
  const [orbit, setOrbit] = useState(0)
  const [lookEnabled, setLookEnabled] = useState(true)
  const [sceneReady, setSceneReady] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const scene = useRef<PokerRoom | null>(null)
  const audio = useRef<PokerAudio | null>(null)
  const alive = useRef(true)
  const locked = useRef(false)
  const preferences = useRef({ muted: false, speed: 'relaxed' as Save['speed'] })

  useEffect(() => {
    alive.current = true
    audio.current = new PokerAudio(import.meta.env.DEV ? fireplaceRecording : undefined)
    let current = true
    void api.storage.get<Save>(SAVE_KEY).then(saved => {
      if (!current) return
      if (saved !== undefined) {
        if (!saved || typeof saved !== 'object' || typeof saved.muted !== 'boolean' || !['relaxed', 'brisk'].includes(saved.speed))
          throw new Error('The saved table format is invalid. Your saved data has been preserved.')
        if (saved.table !== null) { game.current = PokerGame.restore(saved.table); setGameState(game.current.snapshot()) }
        preferences.current = { muted: saved.muted, speed: saved.speed }
        setMuted(saved.muted); setSpeed(saved.speed); audio.current?.setMuted(saved.muted)
      }
      setLoading(false)
    }).catch(reason => {
      if (!current) return
      setError(reason instanceof Error ? reason.message : 'Could not read saved progress.')
      setLoadFailed(true); setLoading(false)
    })
    return () => { current = false; alive.current = false; audio.current?.dispose(); audio.current = null }
  }, [api])

  useEffect(() => {
    let room: PokerRoom | null = null
    const mount = () => {
      // Hot reload reaches every open preview tab. Building five procedural
      // humans in each hidden tab simultaneously caused severe CPU/memory
      // contention even after background rendering stopped. Construct only the
      // visible view; hidden previews initialize when the user actually opens it.
      if (document.hidden || room) return
      try {
        room = new PokerRoom(stage.current!, () => { setSceneFailed(true); setPaused(true) }, () => setSceneReady(n => n + 1), setLeisure)
        scene.current = room; setSceneReady(n => n + 1)
        room.update(game.current?.snapshot() ?? new PokerGame().snapshot())
      } catch (reason) { console.error('Poker room initialization failed', reason); setSceneFailed(true) }
    }
    document.addEventListener('visibilitychange', mount); mount()
    return () => { document.removeEventListener('visibilitychange', mount); room?.dispose(); scene.current = null }
  }, [])
  useEffect(() => {
    try { if (gameState) scene.current?.update(gameState) }
    catch (reason) {
      // Scene projection is never allowed to destroy the rules/UI owner. Keep
      // the saved hand intact and pause visibly if a renderer regression occurs.
      console.error('Poker scene projection failed; saved hand is preserved.', reason)
      setSceneFailed(true); setPaused(true)
    }
  }, [gameState, sceneReady])
  useEffect(() => { scene.current?.setOrbit(orbit); setSceneReady(n => n + 1) }, [orbit])
  useEffect(() => { scene.current?.setPlaying(!lobby) }, [lobby, sceneReady])
  useEffect(() => {
    // The ambience follows the same explicit table pause gates as gameplay.
    // Hide/blur stops the media immediately, not after React commits; returning
    // focus does not resume betting or audio without the existing resume flow.
    const sync = () => audio.current?.setAmbienceActive(!document.hidden && !lobby && !paused && !panel && !confirmNew && !error && !sceneFailed)
    const blur = () => audio.current?.setAmbienceActive(false)
    document.addEventListener('visibilitychange', sync); window.addEventListener('blur', blur); sync()
    return () => { document.removeEventListener('visibilitychange', sync); window.removeEventListener('blur', blur) }
  }, [api, lobby, paused, panel, confirmNew, error, sceneFailed])
  // One paused visual clock preserves the exact grip/deal/chip contact across
  // dialogs and focus loss. Wall-clock animation would teleport to its ending.
  useEffect(() => { scene.current?.setPaused(paused || !!panel || confirmNew || !!error || sceneFailed) }, [paused, panel, confirmNew, error, sceneFailed, sceneReady])
  useEffect(() => { scene.current?.setInspection(inspecting) }, [inspecting, sceneReady])
  useEffect(() => { scene.current?.setLookEnabled(lookEnabled) }, [lookEnabled, sceneReady])
  useEffect(() => { scene.current?.setLookBlocked(drinkMenu || raiseOpen) }, [drinkMenu, raiseOpen, sceneReady])
  useEffect(() => {
    if (lobby || paused || panel || confirmNew || error || sceneFailed) {
      inspectionHeld.current = false; setInspecting(false)
      setDrinkMenu(false)
    }
  }, [lobby, paused, panel, confirmNew, error, sceneFailed])
  useEffect(() => {
    // Key-up must reach us even if focus moves while Space is held. Blur and
    // hidden tabs cancel both the held and toggle form: never resume zoomed in.
    const release = (event: KeyboardEvent) => {
      if (event.code === 'Space' && inspectionHeld.current) { inspectionHeld.current = false; setInspecting(false) }
    }
    const cancel = () => { inspectionHeld.current = false; setInspecting(false) }
    const visibility = () => { if (document.hidden) cancel() }
    window.addEventListener('keyup', release); window.addEventListener('blur', cancel); document.addEventListener('visibilitychange', visibility)
    return () => { window.removeEventListener('keyup', release); window.removeEventListener('blur', cancel); document.removeEventListener('visibilitychange', visibility) }
  }, [])

  const persist = async (state: GameState | null): Promise<void> => {
    locked.current = true; setSaving(true)
    try {
      await api.storage.set(SAVE_KEY, { table: state, ...preferences.current } as never)
      if (alive.current) { setError(''); setLoadFailed(false) }
    } catch {
      if (alive.current) { setError('Your last action is still on this table, but could not be saved. Retry saving to continue.'); setPaused(true) }
    } finally {
      locked.current = false
      if (alive.current) setSaving(false)
    }
  }
  const publish = () => {
    const next = game.current!.snapshot()
    setGameState(next)
    void persist(next)
  }
  const perform = (action: Action) => {
    if (locked.current || !game.current || game.current.snapshot().actor !== 0 || paused || sceneFailed || error) return
    try {
      audio.current?.unlock()
      game.current.act(0, action)
      audio.current?.play(action.type === 'fold' ? 'fold' : 'chip')
      // The clicked action button disappears when the opponent's turn begins.
      // Return focus before that unmount, or it falls onto document.body and all
      // table-scoped shortcuts (including Escape and inspect) silently stop.
      root.current?.focus({ preventScroll: true })
      publish()
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'That action is unavailable.') }
  }

  useEffect(() => {
    if (!gameState || lobby || paused || panel || saving || error || sceneFailed || loading) return
    const { phase, actor } = gameState
    if (phase === 'complete' || phase === 'ready' || phase === 'betting' && actor === 0) return
    const delay = speed === 'brisk' ? phase === 'betting' ? 500 : 850 : phase === 'betting' ? 1150 : 1450
    const timer = window.setTimeout(() => {
      const engine = game.current
      if (!engine || locked.current) return
      try {
        if (phase === 'betting' && actor !== null) {
          engine.act(actor, chooseAction(observe(engine.snapshot(), engine.legal())))
          audio.current?.play('chip')
        } else {
          engine.advance()
          audio.current?.play(engine.snapshot().phase === 'complete' ? 'win' : 'card')
        }
        publish()
      } catch (reason) { setError(reason instanceof Error ? reason.message : 'The table needs attention.'); setPaused(true) }
    }, delay)
    return () => window.clearTimeout(timer)
  }, [gameState, lobby, paused, panel, saving, error, sceneFailed, loading, speed])

  useEffect(() => {
    const suspend = () => { if (game.current && !lobby) setPaused(true) }
    const visibility = () => { if (document.hidden) suspend() }
    window.addEventListener('blur', suspend); document.addEventListener('visibilitychange', visibility)
    return () => { window.removeEventListener('blur', suspend); document.removeEventListener('visibilitychange', visibility) }
  }, [lobby])
  useEffect(() => {
    if (gameState?.actor === 0 && !lobby) audio.current?.play('turn')
    setRaiseOpen(false)
    const min = game.current?.legal().min
    if (min) setRaiseTo(min)
  }, [gameState?.revision, lobby])

  const enter = () => {
    if (loading || locked.current || sceneFailed || loadFailed) return
    audio.current?.unlock()
    if (!game.current) { game.current = new PokerGame(); game.current.startHand(); publish(); audio.current?.play('card') }
    setLobby(false); setPaused(false); root.current?.focus({ preventScroll: true })
  }
  const newTable = () => {
    if (locked.current || loading || sceneFailed) return
    game.current = new PokerGame(); game.current.startHand()
    setConfirmNew(false); setPanel(null); setError(''); setLoadFailed(false); setPaused(false); setLobby(false)
    audio.current?.unlock(); audio.current?.play('card'); root.current?.focus({ preventScroll: true }); publish()
  }
  const nextHand = () => {
    if (locked.current || !game.current || gameState?.phase !== 'complete') return
    game.current.startHand(); audio.current?.play('card'); root.current?.focus({ preventScroll: true }); publish()
  }
  const openPanel = (next: typeof panel) => { setPaused(true); setPanel(next) }
  const toggleMute = () => {
    if (locked.current || loading || loadFailed) return
    const next = !muted; setMuted(next); preferences.current.muted = next
    audio.current?.setMuted(next); if (!next) audio.current?.unlock()
    void persist(game.current?.snapshot() ?? null)
  }

  const s = gameState
  const legal: Legal = game.current?.legal() ?? { fold: false, check: false, call: 0, raise: false, min: 0, max: 0, shortOnly: false }
  const ours = s?.players[0]
  const turn = s?.phase === 'betting' && s.actor === 0
  const blocked = !turn || paused || !!panel || saving || !!error || sceneFailed
  const live = s?.players.filter(p => p.stack > 0).length ?? 6
  const finished = s?.phase === 'complete'
  const champion = finished && live === 1
  const busted = finished && ours?.stack === 0
  const pot = s?.players.reduce((n, p) => n + p.committed, 0) ?? 0
  const awarded = s?.awards.reduce((n, a) => n + a.amount, 0) ?? 0
  const bestHand = ours?.hole.length === 2 && (s?.board.length ?? 0) >= 3 ? evaluate([...ours.hole, ...s!.board]) : null
  const winningCards = finished ? s?.results.find(r => r.seat === 0 && r.won > 0)?.hand?.cards ?? [] : []
  const boundedRaise = Number.isFinite(raiseTo) ? Math.max(legal.min, Math.min(legal.max, Math.floor(raiseTo))) : legal.min
  const showOpponents = s?.phase === 'showdown' || finished && s?.results.some(r => r.hand)
  const status = finished ? champion ? 'The table is yours.' : busted ? 'A good run. Another seat awaits.' : s.history[0]?.summary
    : s?.phase === 'showdown' ? 'Cards on the table.' : s?.phase === 'transition' ? 'The next chapter…'
    : turn ? 'Your move.' : s?.actor != null ? `${CHARACTERS[s.actor].name} is thinking…` : 'Welcome to the club.'

  return <main className={`poker ${inspecting ? 'inspecting' : ''}`} ref={root} tabIndex={-1} data-phase={s?.phase ?? 'lobby'} data-actor={s?.actor ?? ''}
    onPointerDown={() => audio.current?.unlock()}
    onKeyDown={event => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.nativeEvent.isComposing) return
      if (event.key === 'Escape') {
        event.preventDefault(); event.stopPropagation()
        if (confirmNew) setConfirmNew(false)
        else if (drinkMenu) { setDrinkMenu(false); root.current?.focus({ preventScroll: true }) }
        else if (panel) setPanel(null)
        else if (raiseOpen) setRaiseOpen(false)
        else if (inspecting) { inspectionHeld.current = false; setInspecting(false) }
        else if (!lobby) setPaused(value => !value)
        return
      }
      if (drinkMenu) return
      if (event.key.toLowerCase() === 's' && !lobby && !paused && !panel && !confirmNew && !error && !sceneFailed && !(event.target instanceof HTMLElement && event.target.closest('input, select, textarea, [contenteditable]'))) {
        event.preventDefault(); if (!event.repeat) scene.current?.smokeCigar(); return
      }
      if (event.key.toLowerCase() === 'd' && !lobby && !paused && !panel && !confirmNew && !error && !sceneFailed && !(event.target instanceof HTMLElement && event.target.closest('input, select, textarea, [contenteditable]'))) {
        event.preventDefault(); if (!event.repeat) scene.current?.sipDrink(); return
      }
      if (isEditing(event.target)) return
      if (event.key.toLowerCase() === 'r' && scene.current?.experimentalLook && !lobby && !paused && !panel && !raiseOpen && !inspecting) {
        event.preventDefault(); if (!event.repeat) scene.current.recenterLook(); return
      }
      if (event.code === 'Space' && !isInput(event.target) && !lobby && !paused && !panel && !confirmNew && !error && !sceneFailed) {
        event.preventDefault()
        if (!event.repeat) { inspectionHeld.current = true; setInspecting(true) }
        return
      }
      if (event.repeat) return
      const key = event.key.toLowerCase()
      if (key === 'm') { event.preventDefault(); toggleMute() }
      if (!blocked) {
        if (key === 'f') { event.preventDefault(); perform({ type: 'fold' }) }
        if (key === 'c') { event.preventDefault(); perform({ type: legal.check ? 'check' : 'call' }) }
      }
    }}>
    <header className="header">
      <button className="brand" onClick={() => { setLobby(true); setPaused(true) }} aria-label="Back to poker lobby"><span className="brand-mark">♠</span><span>AGENT CODE <b>POKER</b></span></button>
      <span className="header-location"><i /> THE RIVER CLUB <em> / </em> NO-LIMIT HOLD’EM</span>
      <div className="header-tools">
        <button onClick={toggleMute} disabled={loading || saving || loadFailed} aria-label={muted ? 'Unmute sound' : 'Mute sound'} title="Sound (M)">{muted ? '♪̸' : '♪'}</button>
        <button onClick={() => openPanel('rules')} aria-label="How to play" title="How to play">?</button>
        <button onClick={() => openPanel('settings')} aria-label="Settings" title="Settings">⚙</button>
        {!lobby && scene.current?.experimentalLook && <button aria-label="Recenter view" title="Drag the room to look · Recenter (R)" disabled={paused || !!panel || inspecting} onClick={() => { scene.current?.recenterLook(); root.current?.focus({ preventScroll: true }) }}>⌖</button>}
        {!lobby && <button onClick={() => setPaused(value => !value)} aria-label={paused ? 'Resume table' : 'Pause table'} title="Pause (Esc)">{paused ? '▶' : 'Ⅱ'}</button>}
      </div>
    </header>

    <section className="room" aria-label="Poker room">
      <div className="scene" ref={stage} />
      <div className="room-vignette" />
      {!lobby && s && <>
        <div className="table-info"><span className="live-dot" /> TABLE 01 <span>·</span> HAND {String(s.handNumber).padStart(3, '0')} <span>·</span> BLINDS 10 / 20</div>
        <div className="room-top-right">
          <button onClick={() => { setDrinkMenu(false); setInspecting(value => !value); root.current?.focus({ preventScroll: true }) }} disabled={paused || !!panel || !!error || sceneFailed} aria-pressed={inspecting} title="Hold Space to inspect cards and chips">{inspecting ? 'Look up' : 'Cards & chips'} <kbd>Space</kbd></button>
          <button onClick={() => scene.current?.smokeCigar()} disabled={paused || !!panel || !!error || sceneFailed || inspecting || !leisure.available} title="Smoke cigar (S)">Cigar <kbd>S</kbd></button>
          <button onClick={() => { scene.current?.sipDrink(); root.current?.focus({ preventScroll: true }) }} disabled={paused || !!panel || !!error || sceneFailed || inspecting || !leisure.available} title="Sip current drink (D)">{DRINKS[leisure.kind].label} <kbd>D</kbd></button>
          <button onClick={() => setDrinkMenu(value => !value)} disabled={paused || !!panel || !!error || sceneFailed || inspecting} aria-expanded={drinkMenu}>Drinks ▾</button>
          <button onClick={() => openPanel('history')}>Hand history ↗</button>
        </div>
        {drinkMenu && <DrinkMenu kind={leisure.kind} available={leisure.available} onClose={() => { setDrinkMenu(false); root.current?.focus({ preventScroll: true }) }} onOrder={kind => {
          if (scene.current?.orderDrink(kind)) { setDrinkMenu(false); root.current?.focus({ preventScroll: true }) }
        }} />}
        {s.players.map((p, i) => {
          if (i === 0) return null // Your seat is the camera; bankroll/cards already live in the foreground HUD.
          const position = scene.current?.projectSeat(i) ?? { x: 50, y: 50 }
          return <div key={i} ref={element => scene.current?.bindWorldLabel(i, element)} className={`seat ${s.actor === i ? 'active' : ''} ${p.folded ? 'folded' : ''} ${p.stack === 0 && !p.committed ? 'out' : ''}`}
            style={{ left: `${position.x}%`, top: `${position.y}%`, '--seat-color': CHARACTERS[i].color } as CSSProperties}>
            <div className="seat-name"><span className="seat-dot" />{CHARACTERS[i].name}{s.dealer === i && <b className="dealer-badge" title="Dealer button">D</b>}{s.smallBlindSeat === i && <small>SB</small>}{s.bigBlindSeat === i && <small>BB</small>}</div>
            <strong>{chips(p.stack)}</strong><span className="seat-action">{s.actor === i ? i === 0 ? 'YOUR TURN' : 'THINKING' : p.action || CHARACTERS[i].title}</span>
            {showOpponents && i > 0 && !p.folded && <div className="opponent-cards">{p.hole.map(c => <PlayingCard card={c} key={c} small />)}</div>}
          </div>
        })}
        <div className="pot-label" ref={element => scene.current?.bindWorldLabel(-1, element)}><span>{finished ? 'POT AWARDED' : 'IN THE POT'}</span><strong>◈ {chips(finished ? awarded : pot)}</strong>
          {s.awards.length > 1 && <small>{s.awards.length - 1} side pot{s.awards.length > 2 ? 's' : ''}</small>}
        </div>
        <div className="room-caption"><span>THE RIVER CLUB</span><i>Make yourself comfortable.</i></div>
      </>}
      {lobby && <div className="lobby">
        <div className="lobby-copy"><div className="eyebrow"><span /> A PRIVATE TABLE. A LONG NIGHT.</div><h1>The River Club.</h1><p>Pull up a chair. Leave the world outside.</p>
          <button className="primary enter-button" onClick={enter} disabled={loading || saving || sceneFailed || loadFailed}>{loading ? 'Preparing your seat…' : s ? 'Return to your table' : 'Take a seat'} <span>↗</span></button>
          <div className="lobby-details"><span>NO-LIMIT TEXAS HOLD’EM</span><span>2,000 CHIPS TO START</span><span>YOURS TO PLAY. NOTHING TO PAY.</span></div>
        </div>
        <div className="lobby-bottom"><span>EST. BETWEEN COMMITS</span><span>Procedural world · Local opponents · Saved on this device</span></div>
      </div>}
      {!lobby && paused && !panel && !error && !confirmNew && <div className="scrim"><div className="pause-card"><span className="eyebrow">NO RUSH</span><h2>Your seat is saved.</h2><p>The whole table waits for you.</p><button className="primary" onClick={() => { audio.current?.unlock(); setPaused(false); root.current?.focus() }}>Back to the table <span>→</span></button><button className="text-button" onClick={() => setLobby(true)}>Visit the lobby</button></div></div>}
      {sceneFailed && <div className="scrim"><div className="pause-card" role="alert"><h2>The room couldn’t open.</h2><p>WebGL is unavailable. Reopen Poker to try again. Your saved table is kept.</p></div></div>}
    </section>

    {!lobby && s ? <>
      <CommunityBoard board={s.board} street={STREETS[s.street]} winningCards={winningCards} />
      <div className="bankroll-tag"><span>YOUR STACK{s.dealer === 0 ? ' · DEALER' : ''}{s.smallBlindSeat === 0 ? ' · SB' : ''}{s.bigBlindSeat === 0 ? ' · BB' : ''}</span><strong>{chips(ours?.stack ?? 0)}</strong><small>{ours?.folded ? 'Folded' : bestHand?.name ?? 'Practice chips'}</small></div>
      <div className="sr-only" aria-label="Your hand">{ours?.hole.map(c => <PlayingCard card={c} key={c} />)}</div>
      <div className={`table-whisper ${turn || finished ? 'with-actions' : ''}`} role="status" aria-live="polite"><strong>{status}</strong><small>{saving ? 'Saving…' : paused ? 'Paused' : finished ? `Net ${ours!.stack - ours!.startStack >= 0 ? '+' : ''}${chips(ours!.stack - ours!.startStack)}` : s.log.at(-1)}</small></div>
      {(turn || finished) && !paused && !panel && !error && <section className="quick-actions" aria-label="Poker actions">
        {finished ? <button className="primary" disabled={saving || sceneFailed} onClick={champion || busted ? () => setConfirmNew(true) : nextHand}>{champion || busted ? 'New table' : 'Deal next hand'} <span>→</span></button> : <>
          {raiseOpen && <div className="raise-popover" role="group" aria-label="Set your raise">
          <div className="raise-controls"><label htmlFor="raise-size">{s.currentBet === 0 ? 'BET' : 'RAISE'} TO</label><input id="raise-size" type="number" inputMode="numeric" min={legal.min} max={legal.max} step={1} value={raiseTo} onChange={event => setRaiseTo(Number(event.target.value))} disabled={blocked || !legal.raise} />
            <div className="bet-presets">{[['Min', legal.min], ['½ pot', s.currentBet + Math.round((pot + legal.call) / 2)], ['Pot', s.currentBet + pot + legal.call], ['All-in', legal.max]].map(([label, amount]) => <button key={label} disabled={blocked || !legal.raise} onClick={() => setRaiseTo(Math.max(legal.min, Math.min(legal.max, Number(amount))))}>{label}</button>)}</div>
          </div>
          <input className="raise-slider" aria-label="Raise amount" type="range" min={legal.min} max={Math.max(legal.min, legal.max)} value={boundedRaise} step={1} onChange={event => setRaiseTo(Number(event.target.value))} disabled={blocked || !legal.raise} />
          <button className="primary confirm-raise" disabled={blocked || !legal.raise} onClick={() => perform({ type: 'raise', to: boundedRaise })}>{s.currentBet === 0 ? 'Bet' : 'Raise to'} {chips(boundedRaise)}</button>
          </div>}
          <button className="fold-button" onClick={() => perform({ type: 'fold' })} disabled={blocked}>Fold <kbd>F</kbd></button>
          <button className="call-button" onClick={() => perform({ type: legal.check ? 'check' : 'call' })} disabled={blocked}>{legal.check ? 'Check' : `Call ${chips(legal.call)}`} <kbd>C</kbd></button>
          <button className="primary" disabled={blocked || !legal.raise} aria-expanded={raiseOpen} onClick={() => setRaiseOpen(value => !value)}>{s.currentBet === 0 ? 'Bet' : 'Raise'} ▴</button>
        </>}
      </section>}
    </> : <footer className="lobby-footer"><span className="lobby-footer-mark">♣ ♦ ♥ ♠</span><span>A poker room for the moments between.</span><button onClick={() => openPanel('rules')}>New to the table? Learn the rules ↗</button></footer>}

    {panel && <div className="panel-scrim" onClick={() => setPanel(null)}><aside className="side-panel" role="dialog" aria-modal="true" aria-label={panel === 'history' ? 'Hand history' : panel === 'rules' ? 'How to play' : 'Settings'} onClick={event => event.stopPropagation()}>
      <header><span className="eyebrow">THE RIVER CLUB</span><button aria-label="Close panel" onClick={() => setPanel(null)}>×</button></header>
      <h2>{panel === 'history' ? 'The hands we played.' : panel === 'rules' ? 'Find your seat.' : 'Make it yours.'}</h2>
      {panel === 'history' ? <div className="history-list">
        {s && <details open><summary>Hand {s.handNumber} · {finished ? 'Complete' : STREETS[s.street]}</summary>{s.log.map((line, i) => <p key={i}>{line}</p>)}{s.awards.map((a, i) => <p key={`pot${i}`} className="pot-history">{a.label}: {chips(a.amount)} → {a.winners.map((seat, n) => `${CHARACTERS[seat].name} ${chips(a.shares[n])}`).join(', ')}</p>)}</details>}
        {s?.history.filter(h => h.number !== s.handNumber).map(h => <details key={h.number}><summary>Hand {h.number} <b>{h.net >= 0 ? '+' : ''}{chips(h.net)}</b></summary><strong>{h.summary}</strong>{h.log.map((line, i) => <p key={i}>{line}</p>)}</details>)}
        {!s && <p>Your first story starts at the table.</p>}
      </div> : panel === 'settings' ? <div className="settings-content">
        <label>Table pace<select value={speed} disabled={saving || loading || loadFailed} onChange={event => { const value = event.target.value as Save['speed']; setSpeed(value); preferences.current.speed = value; void persist(game.current?.snapshot() ?? null) }}><option value="relaxed">Relaxed</option><option value="brisk">Brisk</option></select></label><p>How long opponents take between decisions.</p>
        <label>Sound<button onClick={toggleMute} disabled={saving || loading || loadFailed} aria-pressed={!muted}>{muted ? 'Off' : 'On'}</button></label>
        <label>Camera angle<input type="range" min={-1} max={1} step={0.1} value={orbit} onChange={event => setOrbit(Number(event.target.value))} /></label>
        {scene.current?.experimentalLook && <><label>Mouse-look<button aria-pressed={lookEnabled} onClick={() => setLookEnabled(value => !value)}>{lookEnabled ? 'On' : 'Off'}</button></label><p>Hold the left mouse button and drag the room. R centers your view. Controls never steer the camera. This setting lasts until reload.</p></>}
        <p>Motion follows your device’s reduced-motion preference.</p>
        <div className="settings-divider" /><h3>A fresh table</h3><p>Start everyone with 2,000 practice chips. This replaces your current table and hand history.</p><button className="secondary" onClick={() => setConfirmNew(true)} disabled={saving || loading}>Start a new table</button>
      </div> : <div className="rules-content"><p>Build the best five-card hand using your two cards and the five shared cards. You can use both, one, or neither of your cards.</p><h3>A hand in four acts</h3><p><b>Pre-flop:</b> two private cards. <b>Flop:</b> three shared cards. <b>Turn:</b> one more. <b>River:</b> the last card. Betting follows each street.</p><h3>Your move</h3><p><b>Check</b> when nothing is owed. <b>Call</b> to match. <b>Raise</b> to increase the total bet for this street. <b>Fold</b> to leave the hand. “Raise to” includes chips you already put in this street.</p><h3>All-in means all-in</h3><p>You can only win the chips you match. Additional bets form side pots. A short all-in may require a call without reopening a raise. Ties split each pot; odd chips go clockwise from the dealer.</p><h3>From strongest to weakest</h3><ol>{['Straight flush', 'Four of a kind', 'Full house', 'Flush', 'Straight', 'Three of a kind', 'Two pair', 'One pair', 'High card'].map(name => <li key={name}>{name}</li>)}</ol><p>Blinds stay at 10/20. Eliminated seats sit out; a moving button rotates through funded seats. Beat the table, or start fresh any time. Bots use their own cards and public information.</p><h3>Keyboard</h3><p><kbd>F</kbd> fold · <kbd>C</kbd> check/call · <kbd>M</kbd> sound · <kbd>Esc</kbd> pause. Buttons and text fields keep their normal keyboard behavior.</p><p>Everything is local. All chips are free practice currency.</p></div>}
    </aside></div>}
    {error && <div className="save-alert" role="alert"><strong>{loadFailed ? 'Saved table needs attention' : 'Table paused'}</strong><p>{error}</p>{!loadFailed && <button className="primary" disabled={saving} onClick={() => void persist(game.current?.snapshot() ?? null)}>Retry save</button>}<button className="text-button" disabled={saving} onClick={() => setConfirmNew(true)}>Start a new table instead</button></div>}
    {confirmNew && <div className="panel-scrim"><div className="confirm-card" role="alertdialog" aria-modal="true" aria-labelledby="fresh-title"><span className="eyebrow">FRESH FELT</span><h2 id="fresh-title">Start a new table?</h2><p>Your current hand, chip stacks, and history will be replaced. Everyone starts with 2,000 practice chips.</p><div><button className="secondary" onClick={() => setConfirmNew(false)}>Keep this table</button><button className="primary" disabled={saving || sceneFailed} onClick={newTable}>Start fresh</button></div></div></div>}
  </main>
}
