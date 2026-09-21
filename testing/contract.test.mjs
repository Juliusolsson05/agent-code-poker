import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
test('API-v2 modal ships loadable production runtime and view entries', async () => {
  const manifest = JSON.parse(await readFile(resolve(root, 'agent-code.extension.json'), 'utf8'))
  assert.equal(manifest.apiVersion, 2)
  assert.equal(manifest.contributes.views[0].mount, 'modal')
  assert.ok(manifest.activationEvents.includes(`onView:${manifest.contributes.views[0].id}`))
  for (const entry of [manifest.entry, manifest.contributes.views[0].entry]) {
    const module = await import(resolve(root, entry))
    assert.equal(typeof module.default, 'object')
  }
  const view = await import(resolve(root, manifest.contributes.views[0].entry))
  assert.equal(typeof view.default.mount, 'function')
})

test('bundles have no Node process assumptions, React dev transforms, or bare module imports', async () => {
  for (const file of await readdir(resolve(root, 'dist'))) {
    if (!file.endsWith('.js')) continue
    const js = await readFile(resolve(root, 'dist', file), 'utf8')
    assert.doesNotMatch(js, /process\.env|jsxDEV|react\/jsx-dev-runtime/)
    for (const match of js.matchAll(/(?:from\s*|import\s*)["']([^"']+)["']/g))
      assert.ok(match[1].startsWith('./'), `non-relative dependency: ${match[1]}`)
  }
})
