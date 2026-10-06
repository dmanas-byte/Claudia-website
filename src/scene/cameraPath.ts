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
  /** optional fixed framing for portrait viewports (phones), overrides from/to */
  portrait?: CameraKey
  /**
   * optional time-keyed beats: [t 0..1, key]. Overrides from/via/to for
   * evaluation (from/to must still equal the first/last key for continuity).
   */
  beats?: [number, CameraKey][]
  /** beats used on portrait viewports instead of `beats` */
  portraitBeats?: [number, CameraKey][]
}

const linear = (t: number) => t
const [tx, ty, tz] = WORLD.terminalWall.center
const [px, py, pz] = WORLD.phone.center

/**
 * One camera definition per shot. If shot N's `to` ≠ shot N+1's `from`, the
 * boundary is a hard cut (the Flash covers it); otherwise it's continuous.
 */
export const CAMERA: ShotCamera[] = [
  // 01 — The Walkout: eye height, slow dolly toward the backpack, which sits
  // right of centre and above the copy block (the copy is bottom-left)
  {
    from: { pos: [0.85, 1.1, 3.55], target: [-0.95, -0.1, 0], fov: 42 },
    to: { pos: [0.62, 1.0, 2.9], target: [-0.82, -0.05, 0], fov: 42 },
    ease: linear,
    still: { pos: [0.75, 1.05, 3.25], target: [-0.9, -0.08, 0], fov: 42 },
    // phones: the bag sits in the top third, copy below it
    portrait: { pos: [0.3, 1.0, 3.4], target: [0, -0.95, 0], fov: 42 },
  },
  // 02 — Tale of the Tape: 25° orbit around the backpack (copy is centred, so the bag sits low)
  {
    from: { pos: [0.62, 1.0, 2.9], target: [-0.82, -0.05, 0], fov: 42 },
    via: [{ pos: [1.5, 1.3, 3.1], target: [-0.4, 0.35, 0] }],
    to: { pos: [2.3, 1.45, 2.6], target: [-0.1, 0.55, 0], fov: 42 },
    still: { pos: [1.6, 1.35, 3.3], target: [-0.3, 0.4, 0], fov: 42 },
  },
  // 03 — The Journey, three beats: the backpack alone (0–0.34), the whole cage
  // lit (0.34–0.66), the city rising out of the octagon (0.66–1). Copy is left.
  {
    from: { pos: [1.35, 0.95, 2.1], target: [-0.75, 0.2, 0], fov: 42 },
    to: { pos: [16, 18, 30], target: [-5, 9, 0], fov: 48 },
    beats: [
      [0, { pos: [1.35, 0.95, 2.1], target: [-0.75, 0.2, 0], fov: 42 }],
      [0.3, { pos: [1.12, 0.82, 1.72], target: [-0.66, 0.2, 0], fov: 42 }],
      [0.5, { pos: [7.5, 5.5, 9.5], target: [-2.2, 0.6, 0], fov: 44 }],
      [0.64, { pos: [8.3, 6.4, 10.6], target: [-2.4, 0.8, 0], fov: 44 }],
      [1, { pos: [16, 18, 30], target: [-5, 9, 0], fov: 48 }],
    ],
    still: { pos: [16, 18, 30], target: [-5, 9, 0], fov: 48 },
    // phones: the copy fills the top two thirds, so the picture sits low and centred
    portraitBeats: [
      [0, { pos: [0.3, 1.1, 4.06], target: [0.1, 1.4, 0], fov: 42 }],
      [0.3, { pos: [0.28, 1.05, 3.8], target: [0.1, 1.33, 0], fov: 42 }],
      [0.5, { pos: [4, 8, 14], target: [0, 3, 0], fov: 44 }],
      [0.64, { pos: [4.4, 8.6, 15], target: [0, 3.2, 0], fov: 44 }],
      [1, { pos: [8, 6, 22], target: [-1, 14, 0], fov: 48 }],
    ],
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
  // 07 — The Alert: nearly black, the phone fills the right of the frame (copy is centre-left)
  {
    from: { pos: [px - 0.17, py + 0.01, pz + 0.72], target: [px - 0.17, py + 0.01, pz], fov: 40 },
    to: { pos: [px - 0.15, py + 0.02, pz + 0.56], target: [px - 0.15, py + 0.02, pz], fov: 40 },
    still: { pos: [px - 0.16, py + 0.015, pz + 0.62], target: [px - 0.16, py + 0.015, pz], fov: 40 },
    portrait: { pos: [px, py + 0.1, pz + 0.95], target: [px, py + 0.1, pz], fov: 40 },
  },
  // 08 — The Corner: pull up and back, staying above the bowl so the seats read as a crowd
  {
    from: { pos: [0, 7, 6], target: [0, 1.5, 0], fov: 46 },
    to: { pos: [0, 30, 33], target: [0, 4, 0], fov: 52 },
    still: { pos: [0, 20, 22], target: [0, 3, 0], fov: 50 },
  },
  // 09 — The Rig: looking up at the lighting rig as it powers on
  {
    from: { pos: [0, 2.2, 7.5], target: [0, WORLD.lightRig.y - 2, 0], fov: 50 },
    to: { pos: [0, 3.5, 6], target: [0, WORLD.lightRig.y, 0], fov: 50 },
    still: { pos: [0, 2.8, 7], target: [0, WORLD.lightRig.y - 1, 0], fov: 50 },
  },
  // 10 — Apply: slow drift at ground level by the octagon
  { from: { pos: [-9, 2.4, 3], target: [0, 3, 0], fov: 44 }, to: { pos: [-8, 2.8, 5], target: [0, 3.5, 0], fov: 44 } },
  // 11 — Proof wall
  { from: { pos: [9, 3, 4], target: [0, 2.5, 0], fov: 44 }, to: { pos: [10, 4, 6], target: [0, 3, 0], fov: 44 } },
  // 12 — The Crane: up and back until the whole set is visible, constellation in frame
  {
    from: { pos: [0, 14, 30], target: [0, 10, 0], fov: 46 },
    to: { pos: [0, 66, 78], target: [0, 18, 0], fov: 50 },
    ease: easeInOutCubic,
    still: { pos: [0, 54, 64], target: [0, 16, 0], fov: 50 },
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
export function evaluateCamera(i: number, t: number, outPos: THREE.Vector3, outTarget: THREE.Vector3, portrait = false): number {
  const c = CAMERA[Math.max(0, Math.min(CAMERA.length - 1, i))]
  const cv = curves[Math.max(0, Math.min(CAMERA.length - 1, i))]
  if (portrait && c.portrait) {
    outPos.set(...c.portrait.pos)
    outTarget.set(...c.portrait.target)
    return c.portrait.fov ?? c.from.fov ?? 45
  }
  const beats = portrait && c.portraitBeats ? c.portraitBeats : c.beats
  if (beats) {
    const tt = Math.max(0, Math.min(1, t))
    const b = beats
    let k = 1
    while (k < b.length - 1 && tt > b[k][0]) k++
    const [t0, a] = b[k - 1]
    const [t1, z] = b[k]
    const u = t1 > t0 ? Math.max(0, Math.min(1, (tt - t0) / (t1 - t0))) : 1
    const s = u * u * (3 - 2 * u)
    outPos.set(...a.pos).lerp(_b.set(...z.pos), s)
    outTarget.set(...a.target).lerp(_b.set(...z.target), s)
    const fa = a.fov ?? 45
    return fa + ((z.fov ?? fa) - fa) * s
  }
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
export function stillCamera(i: number, outPos: THREE.Vector3, outTarget: THREE.Vector3, portrait = false): number {
  const c = CAMERA[Math.max(0, Math.min(CAMERA.length - 1, i))]
  if (portrait && c.portrait) {
    outPos.set(...c.portrait.pos)
    outTarget.set(...c.portrait.target)
    return c.portrait.fov ?? c.from.fov ?? 45
  }
  if (c.still) {
    outPos.set(...c.still.pos)
    outTarget.set(...c.still.target)
    return c.still.fov ?? c.from.fov ?? 45
  }
  return evaluateCamera(i, 0.5, outPos, outTarget)
}
