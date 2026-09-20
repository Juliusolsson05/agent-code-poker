import view from '../src/view'
import type { ViewContext } from 'agent-code-extension-api'
import './preview.css'

// A preview-only namespace; it must never read or replace the installed game's
// host-owned save. Production imports only src/view and cannot reach this adapter.
const storage = {
  async get<T>(key: string): Promise<T | undefined> { const raw = localStorage.getItem(`poker-preview:${key}`); return raw === null ? undefined : JSON.parse(raw) },
  async set(key: string, value: unknown) { localStorage.setItem(`poker-preview:${key}`, JSON.stringify(value)) },
  async delete(key: string) { localStorage.removeItem(`poker-preview:${key}`) },
  async keys() { return Object.keys(localStorage).filter(k => k.startsWith('poker-preview:')).map(k => k.slice(14)) },
}
const context = { api: { storage }, view: { id: 'agent-code-poker.open', instanceId: 'preview' } } as unknown as ViewContext
// Website-only fullscreen. The installed extension keeps its host sizing
// contract until Agent Code gains a dedicated fullscreen view surface.
document.body.classList.add('poker-preview')
const fullscreen = document.createElement('button')
fullscreen.className = 'preview-fullscreen'
const status = document.createElement('div')
status.className = 'preview-fullscreen-status'; status.setAttribute('role', 'status')
const syncFullscreen = () => {
  const active = !!document.fullscreenElement
  fullscreen.textContent = active ? '⤡' : '⤢'
  fullscreen.setAttribute('aria-label', active ? 'Exit fullscreen' : 'Enter fullscreen')
  fullscreen.title = active ? 'Exit fullscreen (Esc)' : 'Enter fullscreen'
}
fullscreen.addEventListener('click', async () => {
  fullscreen.disabled = true; status.textContent = ''
  try {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await document.documentElement.requestFullscreen()
  } catch { status.textContent = 'Fullscreen unavailable. The game still fills the browser window.' }
  finally { fullscreen.disabled = false; syncFullscreen() }
})
document.addEventListener('fullscreenchange', syncFullscreen)
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && document.fullscreenElement) event.stopPropagation()
}, true)
syncFullscreen()
if (document.fullscreenEnabled) document.body.append(fullscreen, status)
if (new URLSearchParams(location.search).has('production')) {
  const entry = '/dist/view.js'
  const module = await import(/* @vite-ignore */ entry)
  module.default.mount(document.getElementById('root')!, context)
} else view.mount(document.getElementById('root')!, context)
