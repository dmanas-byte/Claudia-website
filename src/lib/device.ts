export function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    return !!gl
  } catch {
    return false
  }
}

export const isTouchDevice = () =>
  typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window)

export const isMobileViewport = () => typeof window !== 'undefined' && window.innerWidth < 900

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Rough "low power" heuristic: mobile viewport, coarse pointer or few cores. */
export const isLowPower = () => {
  if (typeof navigator === 'undefined') return false
  const cores = navigator.hardwareConcurrency ?? 4
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  return isMobileViewport() || (isTouchDevice() && cores <= 4) || cores <= 2 || mem <= 2
}
