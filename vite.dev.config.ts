import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFile } from 'node:fs/promises'

export default defineConfig({ plugins: [react(), {
  name: 'exact-production-preview',
  configureServer(server) {
    // A flat JS-only dist namespace, never an arbitrary filesystem path. Install archives
    // execute these bytes directly, so the preview must neither transform them
    // with dev plugins nor keep an old version in Vite's module graph. Register
    // before Vite's transform middleware and explicitly prohibit HTTP caching.
    server.middlewares.use(async (request, response, next) => {
      const route = request.url?.split('?')[0] ?? ''
      if (!route.startsWith('/__production/')) { next(); return }
      const file = /^\/__production\/([a-zA-Z0-9_-]+\.js)$/.exec(route)?.[1]
      if (!file) { response.statusCode = 404; response.end(); return }
      if (request.method !== 'GET' && request.method !== 'HEAD') { response.statusCode = 405; response.end(); return }
      try {
        // The SDK emits a shared hashed runtime chunk referenced relatively by
        // view.js. Serving only the entry made HTTP byte checks pass while the
        // browser correctly rejected its missing transitive import.
        const bundle = await readFile(new URL('./dist/' + file, import.meta.url))
        response.setHeader('Content-Type', 'text/javascript; charset=utf-8')
        response.setHeader('Cache-Control', 'no-store')
        response.end(request.method === 'HEAD' ? undefined : bundle)
      } catch {
        response.statusCode = 503; response.end('throw new Error("Build the production view with npm run build first")')
      }
    })
  },
}], server: { port: 5191 } })
