import { CanvasTexture, SRGBColorSpace } from 'three'

/** Room owns this one reusable ink texture. The original1024px artwork left
 * the ellipse visibly stair-stepped even in the normal inspection capture.
 * Rasterize the same design at2x, not a larger physical mark or brighter ink.
 * Keep mipmaps plus bounded anisotropy: nearest/no-mip "sharpness" would restore
 * crawling edges when leaning back across the felt. No per-frame canvas work.
 * Texture sampling tradeoff: https://threejs.org/docs/pages/Texture.html#anisotropy */
export function createFeltPrint(maxAnisotropy: number): CanvasTexture {
  const canvas = document.createElement('canvas'); canvas.width = 2048; canvas.height = 1024
  const g = canvas.getContext('2d')!; g.scale(2, 2)
  g.textAlign = 'center'; g.strokeStyle = '#d6c18a50'; g.lineWidth = 2
  g.beginPath(); g.ellipse(512, 256, 445, 180, 0, 0, Math.PI * 2); g.stroke()
  g.fillStyle = '#d6c18a75'; g.font = '26px Georgia'; g.fillText('T H E   R I V E R   C L U B', 512, 337)
  g.font = '16px Georgia'; g.fillText('NO LIMIT  ·  GOOD COMPANY', 512, 365)
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace
  texture.anisotropy = Math.max(1, Math.min(8, maxAnisotropy))
  return texture
}
