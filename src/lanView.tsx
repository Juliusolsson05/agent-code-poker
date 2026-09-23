import { defineView } from 'agent-code-extension-api'

import pageMarkup from '../server/client/index.html?raw'
import baseStyles from './styles.css?inline'
import previewStyles from '../dev/preview.css?inline'
import clientStyles from '../server/client/style.css?inline'
import { privateHostDestination } from '../dev/multiplayer/hostDestination'
import { SERVICE_ID, proxyTransport, brokeredGuestTransport, lanShareText, lanShareUrls, type LanTransport, type NetFetchInit } from '../server/client/inAppTransport'
import { agentCodeVoiceSettingsStore, type AgentCodeStorageApi } from './voice/settingsStore'
import { brokeredVoiceHttp, type BrokeredNetFetch } from './voice/transports'

/** In-extension LAN view: the real multiplayer client, mounted inside the
 *  extension's own frame with its API seam re-routed.
 *
 *  Hosting runs the table in this app's utilityProcess service (service.run)
 *  and shares it through the host-owned listener (net.listen); the local
 *  player talks to it over the origin proxy (service.transport). Joining a
 *  friend's table goes through the brokered net.fetch (net.connect). No code
 *  path here ever sees another player's private cards: the service projects
 *  per-viewer state server-side, exactly as the website does. */

// The website page fills the browser; inside an extension frame the size must
// be CONTENT-driven or the auto-size handshake has nothing to measure. Pin the
// same 1600x1000 stage the solo view uses, appended last so it wins ties.
const stageStyles = `
html,body{margin:0;width:1600px;height:1000px;overflow:hidden}
#app{width:1600px;height:1000px}
`

// The advancing `live` stamp is the frame harness's observable that runtime
// state keeps reaching a mounted view; the URLs are the product payload.
const shareText = (urls: readonly string[], port: number, at: number): string => {
  const time = new Date(at)
  const ms = String(time.getMilliseconds()).padStart(3, '0')
  return `${lanShareText(urls, port)} · live ${time.toLocaleTimeString()}.${ms}`
}

const markup = pageMarkup.slice(pageMarkup.indexOf('<main'), pageMarkup.indexOf('</main>') + '</main>'.length)

type ServicesLike = {
  start(id: string): Promise<{ endpoints: Array<{ port: number }> }>
  expose(id: string, lan: boolean): Promise<{ lan: boolean; port?: number }>
  invoke(id: string, name: string): Promise<unknown>
}
// responseType/bodyEncoding exist on hosts with agent-code#1151 (binary
// bodies for the ElevenLabs voice); older hosts ignore the one and omit the other.
type NetLike = { fetch(url: string, init?: NetFetchInit & { responseType?: 'text' | 'base64' }): Promise<{ status: number; contentType: string; body: string; bodyEncoding?: 'text' | 'base64' }> }

export default defineView({
  mount(element, context) {
    const style = document.createElement('style')
    style.textContent = previewStyles + baseStyles + clientStyles + stageStyles
    document.head.append(style)
    // Static, first-party markup from this repository's own page — never user
    // text. The client module grabs these ids at import time.
    element.innerHTML = markup
    document.body.classList.add('poker-preview')

    // Choice overlay: hosting starts a service; joining installs the guest
    // transport. Both hide the overlay and boot the unmodified client, whose
    // lobby (name/code/create/join) then works over the chosen transport.
    const overlay = document.createElement('section')
    overlay.className = 'panel-scrim'
    overlay.style.position = 'absolute'
    overlay.style.zIndex = '40'
    overlay.innerHTML = `
      <aside class="side-panel" role="dialog" aria-modal="true" aria-label="Play over LAN">
        <header><span class="eyebrow">THE RIVER CLUB · LAN</span></header>
        <h2>Bring the table to your friends.</h2>
        <p class="small">Host on this computer — friends join from any browser on your network. Or join a friend who is hosting.</p>
        <div class="row">
          <button class="primary" id="lan-host">Host on this computer</button>
        </div>
        <form id="lan-join" class="row"><input id="lan-address" placeholder="http://192.168.1.42:5192" autocomplete="off" spellcheck="false" style="flex:1;padding:10px;border:1px solid #786b5355;border-radius:4px;background:#171a17;color:#e7dcc8">
          <button class="secondary" type="submit">Join friend</button></form>
        <p id="lan-error" role="alert" style="color:#e2a79c;min-height:1em"></p>
        <p class="small">Practice chips only · trusted local network only.</p>
      </aside>`
    const entry = element.querySelector('#entry')
    entry?.append(overlay)

    const errorText = overlay.querySelector('#lan-error') as HTMLElement
    // Created on demand: an empty #lan-share that exists before adoption would
    // read as "host running, no port" to the frame harness (and to users).
    const shareLine: HTMLElement = document.createElement('p')
    shareLine.id = 'lan-share'
    shareLine.setAttribute('role', 'status')
    shareLine.style.color = '#c1db9c'
    const share = (text: string): void => {
      // Appending on first use (not at markup build) so the element's EXISTENCE
      // means "a live host state arrived" — what the frame harness and a human
      // both wait for; an ever-present empty node would read as no-signal.
      if (!shareLine.isConnected) overlay.querySelector('.side-panel')!.append(shareLine)
      shareLine.textContent = text
    }
    const services = (context.api as { services?: ServicesLike }).services
    const net = (context.api as { net?: NetLike }).net
    let booting = false
    let adoptedRuntimeHost = false

    // Every path into the shared client goes through here, so the voice
    // environment can never be left on the website default (localStorage +
    // browser fetch, which the frame's CSP would block anyway). Inside Agent
    // Code the ElevenLabs key lives in the host's per-extension secret store
    // and ElevenLabs is reached only through the host broker, under the
    // manifest's declared networkOrigins + net.origins consent.
    const installClient = async (transport: LanTransport): Promise<void> => {
      const client = await import('../server/client/client.js')
      client.setVoiceEnvironment({
        store: agentCodeVoiceSettingsStore(context.api as unknown as AgentCodeStorageApi),
        http: brokeredVoiceHttp(net
          ? (url, init) => net.fetch(url, init) as ReturnType<BrokeredNetFetch>
          : async () => { throw new Error('This Agent Code build does not support brokered fetch.') }),
      })
      client.setApiTransport(transport)
    }

    // Adopt a host that the RUNTIME already started (palette command or a
    // previous view): skip the role panel entirely, route through the proxy,
    // and keep the share line alive with the runtime heartbeat. The share
    // line's advancing timestamp is also the Electron frame harness's
    // observable that runtime state reaches a mounted view.
    const adoptRuntimeHost = async (urls: readonly string[], port: number, at: number): Promise<void> => {
      if (adoptedRuntimeHost) {
        share(shareText(urls, port, at))
        return
      }
      adoptedRuntimeHost = true
      booting = true
      try {
        // Say the port BEFORE the heavy client import: an observer (human or
        // harness) must never wait on the 3D bundle to learn hosting is live.
        share(shareText(urls, port, at))
        await installClient(proxyTransport())
        overlay.hidden = true
        booting = false
      } catch (error) {
        booting = false
        adoptedRuntimeHost = false
        fail(error instanceof Error ? error.message : String(error))
      }
    }
    // `urls` may be absent from a runtime built before it existed; the text
    // then falls back to the placeholder shape rather than failing adoption.
    type HostState = { running?: boolean; port?: number; at?: number; urls?: unknown }
    // Published state is untyped JSON: keep only strings shaped like the URLs
    // lanShareUrls produces, so the share line can never render arbitrary text.
    const urlsOf = (state: HostState): string[] => Array.isArray(state.urls)
      ? state.urls.filter((url): url is string => typeof url === 'string' && /^http:\/\/\d{1,3}(?:\.\d{1,3}){3}:\d{1,5}$/.test(url))
      : []
    const initial = context.runtime.state() as HostState | undefined
    if (initial?.running && initial.port) void adoptRuntimeHost(urlsOf(initial), initial.port, initial.at ?? Date.now())
    const unsubscribeRuntime = context.runtime.subscribe(next => {
      const state = next as HostState | undefined
      if (state?.running && state.port) void adoptRuntimeHost(urlsOf(state), state.port, state.at ?? Date.now())
    })

    const fail = (message: string) => { errorText.textContent = message }

    async function boot(install: () => Promise<void>, share?: string) {
      if (booting) return
      booting = true
      try {
        await install()
        overlay.hidden = true
        if (share) { shareLine.hidden = false; shareLine.textContent = share; shareLine.style.color = '#c1db9c' }
      } catch (error) {
        booting = false
        fail(error instanceof Error ? error.message : String(error))
      }
    }

    overlay.querySelector('#lan-host')!.addEventListener('click', () => {
      if (!services) { fail('This Agent Code build does not support extension services.'); return }
      if (booting) return
      booting = true
      errorText.textContent = 'Starting LAN host…'
      void (async () => {
        try {
          await services.start(SERVICE_ID)
          const exposure = await services.expose(SERVICE_ID, true)
          if (!exposure.lan || !exposure.port) throw new Error('LAN exposure was not granted.')
          const urls = lanShareUrls(await services.invoke(SERVICE_ID, 'status'), exposure.port)
          await installClient(proxyTransport())
          overlay.hidden = true
          // This view can't see network interfaces; the service can, and its
          // status answer supplies the addresses (see lanShareUrls).
          share(`${lanShareText(urls, exposure.port)} — then use Create table below.`)
        } catch (error) {
          booting = false
          fail(error instanceof Error ? error.message : String(error))
        }
      })()
    })

    overlay.querySelector('#lan-join')!.addEventListener('submit', event => {
      event.preventDefault()
      if (!net) { fail('This Agent Code build does not support brokered fetch.'); return }
      const input = overlay.querySelector('#lan-address') as HTMLInputElement
      let origin: string
      try { origin = privateHostDestination(input.value) } catch (reason) { fail(reason instanceof Error ? reason.message : 'Invalid host address.'); return }
      void boot(async () => {
        // Pass init THROUGH (see brokeredGuestTransport).
        await installClient(brokeredGuestTransport(net, origin))
      })
    })

    return () => {
      unsubscribeRuntime()
      overlay.remove()
      style.remove()
      // The client is page-lifetime by design (timers, audio, a 3D room).
      // Every view open runs in a fresh frame document, so teardown here is
      // DOM-only; nothing outlives the frame.
    }
  },
})
