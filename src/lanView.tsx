import { defineView } from 'agent-code-extension-api'

import pageMarkup from '../server/client/index.html?raw'
import baseStyles from './styles.css?inline'
import previewStyles from '../dev/preview.css?inline'
import clientStyles from '../server/client/style.css?inline'
import { privateHostDestination } from '../dev/multiplayer/hostDestination'
import { configureEmbedding } from '../server/client/embedding'
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

const markup = pageMarkup.slice(pageMarkup.indexOf('<main'), pageMarkup.indexOf('</main>') + '</main>'.length)

type ServicesLike = {
  start(id: string): Promise<{ endpoints: Array<{ port: number }> }>
  expose(id: string, lan: boolean): Promise<{ lan: boolean; port?: number }>
  invoke(id: string, name: string, params: Record<string, never>): Promise<unknown>
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
      // On the admission page (#entry), not in the overlay: the overlay is
      // hidden by the time there is anything to share.
      if (!shareLine.isConnected) entry?.append(shareLine)
      shareLine.textContent = text
    }
    const services = (context.api as { services?: ServicesLike }).services
    const net = (context.api as { net?: NetLike }).net
    let booting = false

    // Every path into the shared client goes through here, so the voice
    // environment can never be left on the website default (localStorage +
    // browser fetch, which the frame's CSP would block anyway). Inside Agent
    // Code the ElevenLabs key lives in the host's per-extension secret store
    // and ElevenLabs is reached only through the host broker, under the
    // manifest's declared networkOrigins + net.origins consent.
    const installClient = async (transport: LanTransport, shareUrls: readonly string[] | null = null): Promise<void> => {
      // Configure FIRST, import SECOND: client.js starts polling a saved seat
      // while it evaluates (see server/client/embedding.ts).
      configureEmbedding({
        apiTransport: transport,
        voice: {
          store: agentCodeVoiceSettingsStore(context.api as unknown as AgentCodeStorageApi),
          http: brokeredVoiceHttp(net
            ? (url, init) => net.fetch(url, init) as ReturnType<BrokeredNetFetch>
            : async () => { throw new Error('This Agent Code build does not support brokered fetch.') }),
        },
        shareUrls,
      })
      await import('../server/client/client.js')
    }

    // Hosting has exactly one entry point: the Host button below. An earlier
    // build also offered a palette command ("Host an Agent Code Poker LAN
    // table") that started the service from the runtime with no window, and
    // this view adopted that host from a runtime heartbeat. It was removed for
    // v0.3.0: from the palette it looked like nothing happened, it duplicated
    // the button, and the host frame harness can drive the button instead.
    // Re-clicking Host after reopening the view is safe — services.start is
    // idempotent and joins the already-running service.

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
          // WHY `{}` and not the SDK's optional params: a view's
          // `invoke(id, name)` reaches the host as `params: undefined`, and
          // Agent Code (through 0.1.3) rejects any undefined value with
          // "Extension host request exceeds the JSON limits." — the Host button
          // failed on every click. The runtime channel serializes to JSON and
          // drops the key, which is why the removed host-lan command never hit
          // it. An empty object is valid JSON on every host; the service's
          // `status` handler ignores params.
          const urls = lanShareUrls(await services.invoke(SERVICE_ID, 'status', {}), exposure.port)
          // This view can't see network interfaces; the service can, and its
          // status answer supplies the addresses (see lanShareUrls). They go
          // next to the lobby code in the table menu, and on the admission
          // page before the table exists. The share line used to live in this
          // overlay and was written just AFTER hiding it, so no host ever saw
          // the URL.
          await installClient(proxyTransport(), urls)
          overlay.hidden = true
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
      overlay.remove()
      style.remove()
      // The client is page-lifetime by design (timers, audio, a 3D room).
      // Every view open runs in a fresh frame document, so teardown here is
      // DOM-only; nothing outlives the frame.
    }
  },
})
