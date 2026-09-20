import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { createServer } from 'vite'

test('production preview serves exact shipped bytes without the source transform cache', async () => {
  // An actual HTTP server catches the stale Vite module-graph failure that a
  // grep of dist or the adapter cannot. Use an OS-assigned port and independent
  // cache so verification never restarts or warms the user's live preview.
  const server = await createServer({ configFile: new URL('../vite.dev.config.ts', import.meta.url).pathname,
    cacheDir: 'node_modules/.vite-preview-contract', logLevel: 'silent', server: { host: '127.0.0.1', port: 0, open: false } })
  try {
    await server.listen()
    const address = server.httpServer.address()
    const url = `http://127.0.0.1:${address.port}/__production/view.js`
    const response = await fetch(url)
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('cache-control'), 'no-store')
    assert.match(response.headers.get('content-type'), /javascript/)
    const disk = await readFile(new URL('../dist/view.js', import.meta.url))
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), disk)
    const again = await fetch(url)
    assert.deepEqual(Buffer.from(await again.arrayBuffer()), disk)
    // The real browser exposed a shared SDK chunk import after the entry bytes
    // matched. Check every emitted JS artifact, not only the entry's status.
    for (const file of await readdir(new URL('../dist/', import.meta.url))) if (file.endsWith('.js')) {
      const chunk = await fetch(url.replace('view.js', file))
      assert.equal(chunk.status, 200)
      assert.deepEqual(Buffer.from(await chunk.arrayBuffer()), await readFile(new URL('../dist/' + file, import.meta.url)))
    }
    assert.equal((await fetch(url.replace('view.js', 'nested/file.js'))).status, 404)
    assert.equal((await fetch(url, { method: 'POST' })).status, 405)
  } finally { await server.close() }
})
