import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { ChipField } from '../src/scene/Chips'
import { SEATS } from '../src/scene/environment/layout'
import { createFeltPrint } from '../src/scene/TablePrint'

// Canvas drawing is deliberately stubbed: this tests the actual material and
// sampler/resource configuration, NOT glyph rasterization or browser quality.
// The independent visual baseline is the retained 05-43-43 inspection capture.
test('chip denomination textures use bounded angled sampling without per-chip allocations', () => {
  const previous = globalThis.document
  const context = new Proxy({}, { get: () => () => undefined, set: () => true })
  globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => context }) } as unknown as Document
  try {
    for (const maximum of [1, 4, 16]) {
      const chips = new ChipField(SEATS, maximum)
      const textures = new Set<THREE.Texture>()
      assert.equal(chips.root.children.length, 5)
      for (const mesh of chips.root.children as THREE.InstancedMesh[]) {
        const [side, top, bottom] = mesh.material as THREE.MeshStandardMaterial[]
        assert.equal(top, bottom, 'cap materials must remain shared')
        assert.equal(top.map!.anisotropy, Math.min(8, maximum), 'grazing chip lettering needs supported anisotropic filtering')
        assert.equal(top.map!.image.width, 256, 'denomination ink needs more source detail than the old 128px face')
        assert.equal(top.map!.image.height, 256)
        assert.equal(side.map!.image.width, 128, 'unlettered edge should not receive an expensive resolution bump')
        for (const texture of [top.map!, side.map!]) {
          textures.add(texture)
          assert.equal(texture.colorSpace, THREE.SRGBColorSpace)
          assert.equal(texture.minFilter, THREE.LinearMipmapLinearFilter, 'do not remove mipmaps to fake sharpness and cause shimmer')
        }
      }
      assert.equal(textures.size, 10, 'all instances share five cap/edge pairs')
      const felt = createFeltPrint(maximum)
      assert.equal(felt.image.width, 2048); assert.equal(felt.image.height, 1024)
      assert.equal(felt.anisotropy, Math.min(8, maximum))
      assert.equal(felt.minFilter, THREE.LinearMipmapLinearFilter)
      // Allocation-model budget, not measured driver memory. Count all RGBA8
      // mip levels so future "just make it4K" edits cannot silently multiply
      // the whole print set. This adds no inference about runtime frame time.
      const mipBytes = (texture: THREE.Texture) => {
        let w = texture.image.width, h = texture.image.height, bytes = 0
        while (true) { bytes += w * h * 4; if (w === 1 && h === 1) return bytes; w = Math.max(1, w >> 1); h = Math.max(1, h >> 1) }
      }
      assert.ok([...textures, felt].reduce((bytes, texture) => bytes + mipBytes(texture), 0) < 13 * 1024 * 1024)
      felt.dispose()
      let disposed = 0; textures.forEach(texture => texture.addEventListener('dispose', () => disposed++))
      chips.dispose(); assert.equal(disposed, 10)
    }
  } finally {
    if (previous) globalThis.document = previous; else delete (globalThis as { document?: Document }).document
  }
})
