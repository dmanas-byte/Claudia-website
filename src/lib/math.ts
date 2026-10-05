export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const remap = (v: number, inMin: number, inMax: number, outMin = 0, outMax = 1) =>
  inMax === inMin ? outMin : outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin)
export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0))
  return t * t * (3 - 2 * t)
}
export const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
/** exponential damping, framerate independent */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt))
/** deterministic pseudo random 0..1 from an integer seed */
export const hash = (n: number) => {
  let x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}
