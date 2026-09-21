import { defineView } from 'agent-code-extension-api'

import pageMarkup from '../server/client/index.html?raw'
import baseStyles from './styles.css?inline'
import previewStyles from '../dev/preview.css?inline'
import clientStyles from '../server/client/style.css?inline'
import { privateHostDestination } from '../dev/multiplayer/hostDestination'
import { SERVICE_ID, proxyTransport, netFetchTransport } from '../server/client/inAppTransport'

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
}
type NetLike = { fetch(url: string, init?: { httpMethod?: 'GET' | 'POST'; headers?: Array<{ name: string; value: string }>; body?: string }): Promise<{ status: number; contentType: string; body: string }> }

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
        <p id="lan-share" role="status" hidden></p>
        <p class="small">Practice chips only · trusted local network only.</p>
      </aside>`
    const entry = element.querySelector('#entry')
    entry?.append(overlay)

    const errorText = overlay.querySelector('#lan-error') as HTMLElement
    const shareLine = overlay.querySelector('#lan-share') as HTMLElement
    const services = (context.api as { services?: ServicesLike }).services
    const net = (context.api as { net?: NetLike }).net
    let booting = false

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
          const { setApiTransport } = await import('../server/client/client.js')
          setApiTransport(proxyTransport())
          overlay.hidden = true
          // The LAN address of THIS machine is deliberately not exposed to
          // sandboxed views; name the share shape the way the CLI host does.
          shareLine.hidden = false
          shareLine.style.color = '#c1db9c'
          shareLine.textContent = `Friends join at http://<this-computer’s-Wi-Fi-IP>:${exposure.port} — then use Create table below.`
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
        const { setApiTransport } = await import('../server/client/client.js')
        setApiTransport(netFetchTransport(url => net.fetch(url), origin))
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
