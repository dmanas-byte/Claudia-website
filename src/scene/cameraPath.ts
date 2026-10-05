import * as THREE from 'three'
import { SHOT_COUNT } from '../content/shots'
import { STREET, WORLD } from './world'
import { easeInOutCubic } from '../lib/math'

export interface CameraKey {
  pos: [number, number, number]
  target: [number, number, number]
  fov?: number
}
export interface ShotCamera {
  from: CameraKey
  via?: CameraKey[]
  to: CameraKey
  /** easing of the progress inside the shot */
  ease?: (t: number) => number
  /** still used under reduced motion (defaults to the midpoint) */
  still?: CameraKey
}

const linear = (t: number) => t
const [tx, ty, tz] = WORLD.terminalWall.center
const [px, py, pz] = WORLD.phone.center

/**
 * One camera definition per shot. If shot N's `to` ≠ shot N+1's `from`, the
 * boundary is a hard cut (the Flash covers it); otherwise it's continuous.
 */
export const CAMERA: ShotCamera[] = [
  // 01 — The Walkout: eye height, slow dolly toward the backpack
  { from: { pos: [0, 1.6, 4.6], target: [0, 0.45, 0], fov: 42 }, to: { pos: [0, 1.5, 3.3], target: [0, 0.4, 0], fov: 42 }, ease: linear },
  // 02 — Tale of the Tape: 25° orbit around the backpack
  {
    from: { pos: [0, 1.5, 3.3], target: [0, 0.4, 0], fov: 42 },
    via: [{ pos: [0.75, 1.55, 3.22], target: [0, 0.4, 0] }],
    to: { pos: [1.42, 1.6, 3.04], target: [0, 0.4, 0], fov: 42 },
  },
  // 03 — The Backpack: crane up 30 m and tilt down; arena → city block
  {
    from: { pos: [1.42, 1.6, 3.04], target: [0, 0.4, 0], fov: 42 },
    via: [{ pos: [3.2, 9, 7.5], target: [0, 1.5, 0] }],
    to: { pos: [0.5, 32, 11], target: [0, 0, 0], fov: 48 },
    still: { pos: [3.2, 12, 9], target: [0, 2, 0], fov: 46 },
  },
  // 04 — The Record: lateral glide above the city while the posters pass
  {
    from: { pos: [-14, 28, 16], target: [0, 10, -2], fov: 46 },
    to: { pos: [14, 26, 16], target: [0, 8, -2], fov: 46 },
    ease: linear,
    still: { pos: [0, 27, 16], target: [0, 9, -2], fov: 46 },
  },
  // 05 — The Playbook: street level, walking the street between the towers
  {
    from: { pos: [STREET.x, STREET.y, STREET.zStart], target: [0, 1.55, STREET.zStart - 3.2], fov: 44 },
    to: { pos: [STREET.x, STREET.y, STREET.zEnd], target: [0, 1.55, STREET.zEnd - 3.2], fov: 44 },
    ease: linear,
    still: { pos: [STREET.x, STREET.y, 0], target: [0, 1.55, -3.2], fov: 44 },
  },
  // 06 — The Terminal: street level in front of the 40 m data wall
  {
    from: { pos: [tx + 6, 2.2, tz + 16], target: [tx, ty - 1, tz], fov: 46 },
    to: { pos: [tx - 4, 2.6, tz + 11], target: [tx, ty, tz], fov: 46 },
    still: { pos: [tx, 2.4, tz + 13], target: [tx, ty - 0.5, tz], fov: 46 },
  },
  // 07 — The Alert: nearly black, a phone in front of the lens
  {
    from: { pos: [px, py, pz + 1.9], target: [px, py, pz], fov: 40 },
    to: { pos: [px + 0.15, py + 0.05, pz + 1.6], target: [px, py, pz], fov: 40 },
    still: { pos: [px, py, pz + 1.7], target: [px, py, pz], fov: 40 },
  },
  // 08 — The Corner: pull back to reveal the bowl of seats
  {
    from: { pos: [0, 5, 13], target: [0, 2, 0], fov: 46 },
    to: { pos: [0, 19, 36], target: [0, 3, 0], fov: 50 },
    still: { pos: [0, 12, 25], target: [0, 3, 0], fov: 48 },
  },
  // 09 — The 30-Day Challenge: looking up at the lighting rig
  {
    from: { pos: [0, 2.2, 7.5], target: [0, WORLD.lightRig.y - 2, 0], fov: 50 },
    to: { pos: [0, 3.5, 6], target: [0, WORLD.lightRig.y, 0], fov: 50 },
    still: { pos: [0, 2.8, 7], target: [0, WORLD.lightRig.y - 1, 0], fov: 50 },
  },
  // 10 — Apply: slow drift at ground level by the octagon
  { from: { pos: [-9, 2.4, 3], target: [0, 3, 0], fov: 44 }, to: { pos: [-8, 2.8, 5], target: [0, 3.5, 0], fov: 44 } },
  // 11 — Proof wall
  { from: { pos: [9, 3, 4], target: [0, 2.5, 0], fov: 44 }, to: { pos: [10, 4, 6], target: [0, 3, 0], fov: 44 } },
  // 12 — The Crane: up and back until the whole set is visible
  {
    from: { pos: [0, 12, 26], target: [0, 4, 0], fov: 46 },
    to: { pos: [0, 62, 74], target: [0, 6, 0], fov: 50 },
    ease: easeInOutCubic,
    still: { pos: [0, 50, 60], target: [0, 6, 0], fov: 50 },
  },
]

if (CAMERA.length !== SHOT_COUNT) {
  throw new Error(`cameraPath: expected ${SHOT_COUNT} shots, got ${CAMERA.length}`)
}

const curves = CAMERA.map((c) => {
  const pts = [c.from, ...(c.via ?? []), c.to].map((k) => new THREE.Vector3(...k.pos))
  const tgs = [c.from, ...(c.via ?? []), c.to].map((k) => new THREE.Vector3(...k.target))
  const pos = pts.length > 2 ? new THREE.CatmullRomCurve3(pts, false, 'centripetal') : null
  const tgt = tgs.length > 2 ? new THREE.CatmullRomCurve3(tgs, false, 'centripetal') : null
  return { pts, tgs, pos, tgt }
})

const _a = new THREE.Vector3()
const _b = new THREE.Vector3()

/** Evaluate the camera for shot index `i` at local progress `t` (0..1). */
export function evaluateCamera(i: number, t: number, outPos: THREE.Vector3, outTarget: THREE.Vector3): number {
  const c = CAMERA[Math.max(0, Math.min(CAMERA.length - 1, i))]
  const cv = curves[Math.max(0, Math.min(CAMERA.length - 1, i))]
  const e = (c.ease ?? easeInOutCubic)(Math.max(0, Math.min(1, t)))
  if (cv.pos) cv.pos.getPointAt(e, outPos)
  else outPos.copy(_a.set(...c.from.pos)).lerp(_b.set(...c.to.pos), e)
  if (cv.tgt) cv.tgt.getPointAt(e, outTarget)
  else outTarget.copy(_a.set(...c.from.target)).lerp(_b.set(...c.to.target), e)
  const f0 = c.from.fov ?? 45
  const f1 = c.to.fov ?? f0
  return f0 + (f1 - f0) * e
}

/** Still frame for reduced motion. */
export function stillCamera(i: number, outPos: THREE.Vector3, outTarget: THREE.Vector3): number {
  const c = CAMERA[Math.max(0, Math.min(CAMERA.length - 1, i))]
  if (c.still) {
    outPos.set(...c.still.pos)
    outTarget.set(...c.still.target)
    return c.still.fov ?? c.from.fov ?? 45
  }
  return evaluateCamera(i, 0.5, outPos, outTarget)
}
