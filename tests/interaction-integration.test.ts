import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve, relative } from 'node:path'
import { gunzipSync } from 'node:zlib'
import * as THREE from 'three'
import ts from 'typescript'
import { FirstPerson } from '../src/scene/FirstPerson'

test('real recorded inputs drive the actual hero mesh with attached wrists and world-space props', () => {
  // Canvas rasterization is not tested here. A minimal canvas supplies only the
  // smoke texture constructor; actual production bones, skin, transforms and
  // interaction entry points run unchanged. Browser images remain art evidence.
  const previous = globalThis.document
  globalThis.document = { createElement: (name: string) => {
    assert.equal(name, 'canvas')
    return { width: 0, height: 0, getContext: () => ({ createRadialGradient: () => ({ addColorStop() {} }), fillRect() {}, fillStyle: '' }) }
  } } as unknown as Document
  const scene = new THREE.Group(), texture = new THREE.Texture() as THREE.CanvasTexture
  let hero: FirstPerson | undefined
  try {
    hero = new FirstPerson(new THREE.BoxGeometry(), () => texture)
    scene.add(hero.root, hero.tableProps)
    const trace = JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T03-19-01-705Z.json.gz', import.meta.url))).toString())
    const sleeve = hero.root.getObjectByName('right-continuous-sleeve') as THREE.SkinnedMesh
    assert.ok(sleeve.isSkinnedMesh && sleeve.geometry.getAttribute('position').count > 100)
    let samples = 0
    for (const entry of trace.entries) {
      if (entry.kind === 'playing') hero.setActive(entry.data.playing)
      if (entry.kind === 'drink') hero.sipDrink()
      if (entry.kind === 'smoke') hero.smokeCigar()
      if (entry.kind === 'inspection') hero.setInspection(entry.data.active)
      // Production Room also supplies visual clock samples before UI commands.
      // Input timing is preserved by sampling at each captured event timestamp.
      if (entry.kind === 'frame' || entry.kind === 'pose') hero.frame(entry.visualSeconds, false)
      if (entry.kind !== 'pose') continue
      const result = hero.diagnosticPose(), hand = result.right as { world: number[] }
      const position = new THREE.Vector3().setFromMatrixPosition(new THREE.Matrix4().fromArray(hand.world))
      const endpoint = sleeve.skeleton.bones[2].getWorldPosition(new THREE.Vector3())
      assert.ok(sleeve.skeleton.bones[0].getWorldPosition(new THREE.Vector3()).distanceTo(new THREE.Vector3(...result.arm.shoulder)) < 1e-6, 'body and director disagree about shoulder frame')
      assert.ok(position.distanceTo(endpoint) < 1e-6, 'rendered hand detached from actual sleeve wrist bone')
      assert.ok(position.distanceTo(new THREE.Vector3(...result.arm.shoulder)) <= .568001, 'renderer applied a camera/body transform twice')
      assert.ok(position.distanceTo(new THREE.Vector3(...result.arm.wrist)) < 1e-6)
      assert.ok(result.arm.reachError < 1e-6)
      assert.equal(hero.root.parent, scene); assert.equal(hero.tableProps.parent, scene)
      samples++
    }
    assert.equal(samples, 500)
  } finally {
    hero?.dispose(); texture.dispose()
    scene.traverse(o => { if (o instanceof THREE.Mesh || o instanceof THREE.Sprite) {
      o.geometry.dispose(); (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose())
      if (o instanceof THREE.SkinnedMesh) o.skeleton.dispose()
    } })
    if (previous) globalThis.document = previous; else delete (globalThis as { document?: Document }).document
  }
})

test('ownership core has one production consumer and cannot import renderers, rules or browser APIs', () => {
  const source = resolve('src'), core = resolve('src/scene/interactions'), consumers = new Set<string>()
  const walk = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(resolve(directory, e.name)) : /\.tsx?$/.test(e.name) ? [resolve(directory, e.name)] : [])
  for (const file of walk(source)) {
    const ast = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true)
    const inside = file.startsWith(core + '/')
    for (const statement of ast.statements) if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      const name = statement.moduleSpecifier.text, target = name.startsWith('.') ? resolve(dirname(file), name) : name
      if (!inside && target.startsWith(core + '/')) consumers.add(relative(source, file))
      if (inside) assert.ok(name === 'three' || target.startsWith(core + '/'), `forbidden core dependency ${name}`)
      if (file.includes('/engine/')) assert.ok(!target.includes('/scene/'), 'rules cannot depend on presentation')
    }
    if (inside) {
      const visit = (node: ts.Node) => {
        if (ts.isIdentifier(node)) assert.ok(!['document', 'window', 'performance', 'requestAnimationFrame', 'setTimeout', 'Date', 'Mesh', 'Object3D'].includes(node.text), `core uses ${node.text}`)
        ts.forEachChild(node, visit)
      }
      visit(ast)
    }
  }
  assert.deepEqual([...consumers], ['scene/InteractionDirector.ts'])
})
