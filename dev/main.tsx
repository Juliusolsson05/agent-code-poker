import type { ViewContext } from 'agent-code-extension-api'
import './preview.css'

// A preview-only namespace; it must never read or replace the installed game's
// host-owned save. Production imports only src/view and cannot reach this adapter.
// Browser QA must not overwrite the table the user is actively playing in a
// neighboring tab. An explicit preview-only namespace isolates those saves.
const previewId = new URLSearchParams(location.search).get('qa')?.replace(/[^a-z0-9-]/gi, '').slice(0, 40)
const namespace = previewId ? `poker-qa:${previewId}:` : 'poker-preview:'
const storage = {
  async get<T>(key: string): Promise<T | undefined> { const raw = localStorage.getItem(`${namespace}${key}`); return raw === null ? undefined : JSON.parse(raw) },
  async set(key: string, value: unknown) { localStorage.setItem(`${namespace}${key}`, JSON.stringify(value)) },
  async delete(key: string) { localStorage.removeItem(`${namespace}${key}`) },
  async keys() { return Object.keys(localStorage).filter(k => k.startsWith(namespace)).map(k => k.slice(namespace.length)) },
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
if (new URLSearchParams(location.search).has('studio')) {
  fullscreen.remove(); status.remove(); document.body.classList.remove('poker-preview')
  const { mountStudio } = await import('./studio'); mountStudio(document.getElementById('root')!)
} else if (new URLSearchParams(location.search).has('production')) {
  // Vite caches transformed modules in its module graph and does not watch the
  // generated dist directory like source. Importing /dist/view.js?import could
  // keep yesterday's view alive after a successful build. This dev-only route
  // serves the exact on-disk bundle without a second transform/cache layer.
  const entry = '/__production/view.js'
  const module = await import(/* @vite-ignore */ entry)
  module.default.mount(document.getElementById('root')!, context)
} else {
  // Eagerly importing source even on the production route created a second
  // Three.js instance and made parity checks run two renderer dependency trees.
  const { default: view } = await import('../src/view')
  view.mount(document.getElementById('root')!, context)
}
