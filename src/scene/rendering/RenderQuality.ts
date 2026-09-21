export type RenderMode = 'legacy' | 'balanced'

/** Fullscreen retina used to multiply every HDR/MSAA attachment by 1.5625,
 * regardless of screen area. Bound shaded pixels instead of simplifying hands
 * (which reopened skin seams) or removing antialiasing (which shimmered). This
 * is a resolution tradeoff, not free performance. Keep CSS/UI resolution intact.
 * Room is the sole runtime consumer; poker and prop ownership cannot depend on
 * render resolution. Legacy exists only for the opt-in A/B diagnostic. */
export function renderPixelRatio(width: number, height: number, dpr: number, mode: RenderMode = 'balanced'): number {
  const native = Math.min(1.25, Math.max(.1, dpr || 1))
  return mode === 'legacy' ? native : Math.min(native, Math.sqrt(2_500_000 / Math.max(1, width * height)))
}
