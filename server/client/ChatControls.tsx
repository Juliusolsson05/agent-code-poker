import { useEffect, useRef, useState } from 'react'
import { CHAT_LIMITS, type ChatLine } from '../../src/session/HostTable'

/** LAN chat presentation, consumed by client.js. Every string from another
 * player is rendered as a React text child: never innerHTML, never a title
 * attribute built by concatenation. That, not server-side stripping, is what
 * makes "<script>" in a message harmless (HostTable.chatText stores it as typed). */

type Key = { key: string; repeat?: boolean; ctrlKey?: boolean; altKey?: boolean; metaKey?: boolean; isComposing?: boolean }

/** T opens chat. Chosen because it is free: F C B (betting), M (mute), S D E
 * (cigar, drink, treat), R (recenter), Space (inspect), Esc (pause/cancel),
 * Enter (confirm a wager draft), 1–4 and arrows (sizing) are all taken. Table
 * focus only, like every other shortcut, so typing a name never opens chat. */
export function chatShortcut(event: Key, target: 'table' | 'control' | 'editing', blocked: boolean): boolean {
  return target === 'table' && !blocked && !event.repeat && !event.ctrlKey && !event.altKey && !event.metaKey &&
    !event.isComposing && event.key.toLowerCase() === 't'
}

/** How long a bubble stays over a seat: long enough to read at a relaxed pace
 * (~15 chars/s after a 4 s floor), capped so a 200-character line does not sit
 * over a player's stack for half a minute. The log keeps it afterwards. */
export const bubbleMs = (text: string) => Math.min(14_000, 4000 + [...text].length * 65)
export const bubbleVisible = (line: ChatLine) => line.ageMs < bubbleMs(line.text)

/** The newest still-visible line for one display seat, or null. */
export function bubbleFor(lines: readonly ChatLine[], displaySeat: number): ChatLine | null {
  for (let i = lines.length - 1; i >= 0; i--) if (lines[i].displaySeat === displaySeat) return bubbleVisible(lines[i]) ? lines[i] : null
  return null
}

/** Which way a bubble grows from its label. The side seats' labels sit near
 * the viewport edges, so a centred 200px bubble was clipped off-screen (seen
 * in the first acceptance capture). Growing inward keeps it readable without
 * measuring the DOM every frame. Display seats 1–2 are on the left, 4–5 on the
 * right, 3 is opposite. */
export const bubbleAlign = (displaySeat: number): 'start' | 'center' | 'end' => displaySeat <= 2 ? 'start' : displaySeat >= 4 ? 'end' : 'center'

export function ChatBubble({ line }: { line: ChatLine }) {
  // aria-hidden: the same text is announced once by the log's live region;
  // announcing the bubble too would read every line twice.
  return <div className={`chat-bubble ${bubbleAlign(line.displaySeat)}`} aria-hidden="true">{line.text}</div>
}

/** The chat log is the accessible record of the conversation: a polite live
 * region, keyed by seq, so a screen reader hears each new line once even
 * though the whole list re-renders on every 500 ms poll. */
export function ChatLog({ lines, status }: { lines: readonly ChatLine[]; status: string }) {
  return <section className="lan-chat-log" aria-label="Table chat">
    <ol aria-live="polite" aria-relevant="additions">
      {lines.slice(-6).map(line => <li key={line.seq}><b>{line.displaySeat === 0 ? 'You' : line.name}</b> {line.text}</li>)}
    </ol>
    {status && <p className="lan-chat-status" role="status">{status}</p>}
  </section>
}

export function ChatInput(props: { onSend: (text: string) => Promise<boolean>; onClose: () => void; voiceHint: string }) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => { input.current?.focus() }, [])
  return <form className="lan-chat-input" onSubmit={event => {
    event.preventDefault()
    const value = text.trim()
    if (!value || sending) return
    setSending(true)
    void props.onSend(value).then(sent => { setSending(false); if (sent) props.onClose() })
  }}>
    <label>Say <input ref={input} value={text} maxLength={CHAT_LIMITS.maxChars} autoComplete="off" spellCheck
      aria-describedby="lan-chat-hint" disabled={sending}
      onChange={event => setText(event.target.value)}
      // The input is an editing target, so client.js ignores its keys; Esc is
      // handled here and stopped so it cannot also pause the table.
      onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); props.onClose() } }} /></label>
    <span id="lan-chat-hint" className="small">{text.length}/{CHAT_LIMITS.maxChars} · Enter sends · Esc closes{props.voiceHint ? ` · ${props.voiceHint}` : ''}</span>
  </form>
}

/** Host switches. Rendered for everyone: the host gets buttons, guests get the
 * same facts as text, so nobody wonders why a friend's voice is silent. */
export function FeatureSwitches(props: { isHost: boolean; features: { voices: boolean; treats: boolean }; pending: boolean; onChange: (next: { voices: boolean; treats: boolean }) => void }) {
  const row = (name: 'voices' | 'treats', label: string, note: string) => <label key={name}>{label}
    {props.isHost
      ? <button aria-pressed={props.features[name]} disabled={props.pending} onClick={() => props.onChange({ ...props.features, [name]: !props.features[name] })}>{props.features[name] ? 'On' : 'Off'}</button>
      : <span>{props.features[name] ? 'On' : 'Off'} (host decides)</span>}
    <span className="small">{note}</span></label>
  return <section className="lan-features" aria-label="Table features">
    {row('voices', 'Spoken voices', 'Each player’s own ElevenLabs voice reads their chat aloud.')}
    {row('treats', 'Treats', 'Cosmetic mushroom and LSD props on the table.')}
  </section>
}

/** This player's ElevenLabs settings. The key field is write-only: after a
 * save it is cleared and never displayed again, not even partially. */
export function VoiceSettingsPanel(props: {
  where: string; configured: boolean; status: string
  onSave: (apiKey: string, voiceId: string) => void; onForget: () => void; onTest: () => void
}) {
  const [apiKey, setApiKey] = useState('')
  const [voiceId, setVoiceId] = useState('')
  return <section className="lan-voice-settings" aria-label="Your voice">
    <h3>Your voice</h3>
    <p className="small">{props.where}</p>
    <label>ElevenLabs API key <input type="password" value={apiKey} autoComplete="off" spellCheck={false}
      placeholder={props.configured ? 'Saved · type to replace' : 'xi-api-key'} onChange={event => setApiKey(event.target.value)} /></label>
    <label>Voice ID <input value={voiceId} autoComplete="off" spellCheck={false} placeholder="e.g. 21m00Tcm4TlvDq8ikWAM"
      onChange={event => setVoiceId(event.target.value)} /></label>
    <div className="row">
      <button className="secondary" disabled={!apiKey.trim() || !voiceId.trim()} onClick={() => { props.onSave(apiKey, voiceId); setApiKey('') }}>Save voice</button>
      <button className="secondary" disabled={!props.configured} onClick={props.onTest}>Test voice</button>
      <button className="text-button" disabled={!props.configured} onClick={props.onForget}>Forget key</button>
    </div>
    <p className="small" role="status">{props.status}</p>
  </section>
}
