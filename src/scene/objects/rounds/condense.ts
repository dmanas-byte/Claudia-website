/**
 * SHOT 05 — shared "condense" mechanic for the six round hero objects.
 *
 * Each round object owns a gold particle cloud (THREE.Points) sampled on the
 * surface of its geometry and one or more solids. `useCondense(n, geometry)`
 * builds the cloud once and returns an `update()` to call from the object's
 * useFrame. It reads `readScene()`, computes the round's presence
 * (`roundPresence`, only inside shot index 4), and drives:
 *
 *   presence 0    → 0.45  particles swirl in from a sphere, solid hidden
 *   presence 0.45 → 0.7   particles sit on the surface, solid dissolves in
 *   presence 0.7  → 1     solid fully there, particles drift off and fade
 *
 * Everything is a pure function of presence, so it reverses as presence falls.
 * Under reduced motion time is frozen and the condense snaps to a readable
 * still (fully solid once the beat is more than a quarter in).
 */
import { useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import type { RootState } from '@react-three/fiber'
import { useSettings } from '../../../store/useSettings'
import { readScene, type SceneRead } from '../../useSceneUniforms'
import { roundPosition, roundPresence } from '../../world'
import { smoothstep } from '../../../lib/math'
import particlesVert from '../../shaders/rounds-particles.vert'
import particlesFrag from '../../shaders/rounds-particles.frag'

export const ROUNDS_SHOT = 4
export const GOLD = new THREE.Color('#D2A64B')
export const BONE = new THREE.Color('#F2EEE6')
export const ASH = new THREE.Color('#8B8C93')
export const EMBER = new THREE.Color('#FF5A1F')
export const TERMINAL = new THREE.Color('#38E8FF')
export const SMOKE = new THREE.Color('#15161C')

export const PARTICLES_DESKTOP = 2500
export const PARTICLES_LOW = 800

/** deterministic PRNG so the clouds are stable across mounts */
export function mulberry(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const _a = new THREE.Vector3()
const _b = new THREE.Vector3()
const _c = new THREE.Vector3()

/** Area-weighted sampling of `count` points on the triangles of a geometry (object space). */
export function sampleSurface(geometry: THREE.BufferGeometry, count: number, rand: () => number): Float32Array {
  const pos = geometry.getAttribute('position') as THREE.BufferAttribute
  const index = geometry.getIndex()
  const triCount = index ? index.count / 3 : pos.count / 3
  const cdf = new Float32Array(triCount)
  let total = 0
  const tri = (t: number) => {
    const i0 = index ? index.getX(t * 3) : t * 3
    const i1 = index ? index.getX(t * 3 + 1) : t * 3 + 1
    const i2 = index ? index.getX(t * 3 + 2) : t * 3 + 2
    _a.fromBufferAttribute(pos, i0)
    _b.fromBufferAttribute(pos, i1)
    _c.fromBufferAttribute(pos, i2)
  }
  for (let t = 0; t < triCount; t++) {
    tri(t)
    _b.sub(_a)
    _c.sub(_a)
    total += _b.cross(_c).length() * 0.5
    cdf[t] = total
  }
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = rand() * total
    let lo = 0
    let hi = triCount - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (cdf[mid] < r) lo = mid + 1
      else hi = mid
    }
    tri(lo)
    const u = rand()
    const v = rand()
    const su = Math.sqrt(u)
    const w0 = 1 - su
    const w1 = su * (1 - v)
    const w2 = su * v
    out[i * 3] = _a.x * w0 + _b.x * w1 + _c.x * w2
    out[i * 3 + 1] = _a.y * w0 + _b.y * w1 + _c.y * w2
    out[i * 3 + 2] = _a.z * w0 + _b.z * w1 + _c.z * w2
  }
  return out
}

/** Length-weighted sampling along the segments of a LineSegments geometry (pairs of vertices). */
export function sampleEdges(geometry: THREE.BufferGeometry, count: number, rand: () => number): Float32Array {
  const pos = geometry.getAttribute('position') as THREE.BufferAttribute
  const segCount = Math.floor(pos.count / 2)
  const cdf = new Float32Array(segCount)
  let total = 0
  for (let s = 0; s < segCount; s++) {
    _a.fromBufferAttribute(pos, s * 2)
    _b.fromBufferAttribute(pos, s * 2 + 1)
    total += _a.distanceTo(_b)
    cdf[s] = total
  }
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = rand() * total
    let lo = 0
    let hi = segCount - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (cdf[mid] < r) lo = mid + 1
      else hi = mid
    }
    _a.fromBufferAttribute(pos, lo * 2)
    _b.fromBufferAttribute(pos, lo * 2 + 1)
    const t = rand()
    out[i * 3] = _a.x + (_b.x - _a.x) * t
    out[i * 3 + 1] = _a.y + (_b.y - _a.y) * t
    out[i * 3 + 2] = _a.z + (_b.z - _a.z) * t
  }
  return out
}

export interface CondenseOptions {
  /** radius of the sphere the particles start on (m) */
  radius?: number
  /** sample along line segments (wireframe objects) instead of triangles */
  edges?: boolean
  /** 'spin': continuous 0.15 rad/s turn; 'sway': ±0.3 rad yaw at 0.15 rad/s peak so a face stays readable */
  turn?: 'spin' | 'sway'
  /** base yaw (rad) so the object faces the street; added to the turn */
  faceYaw?: number
  /** particle world size (m) */
  size?: number
  /** particle brightness */
  intensity?: number
}

export interface CondenseFrame {
  r: SceneRead
  /** 0..1 raw presence of this round (0 outside shot 05) */
  presence: number
  /** 0..1 solid amount (smoothstep 0.45→0.7 of presence) */
  solid: number
  /** group visible this frame */
  visible: boolean
  /** scene time (frozen under reduced motion) */
  time: number
  /** frame delta (0 under reduced motion) */
  dt: number
}

export interface Condense {
  group: RefObject<THREE.Group | null>
  points: RefObject<THREE.Points | null>
  particleGeometry: THREE.BufferGeometry
  particleMaterial: THREE.ShaderMaterial
  position: [number, number, number]
  /** uniforms shared by solid shaders in this object: uSolid, uTime, uEdgeColor */
  solidUniforms: { uSolid: { value: number }; uTime: { value: number }; uEdgeColor: { value: THREE.Color } }
  update: (state: RootState, delta: number) => CondenseFrame
}

const SNAP_REDUCED = 0.25

export function useCondense(n: number, geometry: THREE.BufferGeometry, opts: CondenseOptions = {}): Condense {
  const lowPower = useSettings((s) => s.lowPower)
  const group = useRef<THREE.Group>(null)
  const points = useRef<THREE.Points>(null)
  const turnRef = useRef(0)
  const timeRef = useRef(0)
  const { radius = 1.1, edges = false, turn = 'spin', faceYaw = 0, size = 0.014, intensity = 0.8 } = opts

  const built = useMemo(() => {
    const count = lowPower ? PARTICLES_LOW : PARTICLES_DESKTOP
    const rand = mulberry(1000 + n * 7919)
    const surface = edges ? sampleEdges(geometry, count, rand) : sampleSurface(geometry, count, rand)
    const sphere = new Float32Array(count * 3)
    const seed = new Float32Array(count * 4)
    for (let i = 0; i < count; i++) {
      // uniform direction on the sphere, loose shell 0.75..1.25 r
      const z = rand() * 2 - 1
      const a = rand() * Math.PI * 2
      const rr = Math.sqrt(1 - z * z)
      const k = 0.75 + rand() * 0.5
      sphere[i * 3] = rr * Math.cos(a) * k
      sphere[i * 3 + 1] = z * k * 0.8 + 0.1
      sphere[i * 3 + 2] = rr * Math.sin(a) * k
      seed[i * 4] = rand()
      seed[i * 4 + 1] = rand()
      seed[i * 4 + 2] = rand()
      seed[i * 4 + 3] = rand()
    }
    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(surface, 3))
    particleGeometry.setAttribute('aSphere', new THREE.BufferAttribute(sphere, 3))
    particleGeometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4))
    particleGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0.1, 0), radius * 1.6)
    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: particlesVert,
      fragmentShader: particlesFrag,
      uniforms: {
        uTime: { value: 0 },
        uCondense: { value: 0 },
        uPixelScale: { value: 1000 },
        uSize: { value: size },
        uRadius: { value: radius },
        uColor: { value: GOLD.clone() },
        uIntensity: { value: intensity },
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
    })
    const solidUniforms = {
      uSolid: { value: 0 },
      uTime: { value: 0 },
      uEdgeColor: { value: GOLD.clone() },
    }
    return { particleGeometry, particleMaterial, solidUniforms }
  }, [geometry, lowPower, n, edges, radius, size, intensity])

  const position = useMemo(() => roundPosition(n), [n])

  const update = (state: RootState, delta: number): CondenseFrame => {
    const r = readScene()
    let presence = r.shot === ROUNDS_SHOT ? roundPresence(r.shotProgress, n) : 0
    if (r.reduced) presence = presence > SNAP_REDUCED ? 1 : 0
    const dt = r.reduced ? 0 : Math.min(delta, 0.05)
    if (!r.reduced) timeRef.current += dt
    const time = r.reduced ? 7.0 : timeRef.current
    const visible = presence > 0.001
    const g = group.current
    if (g) {
      g.visible = visible
      if (visible) {
        // Narrow viewports: roundPosition() puts the object ±1.35 m off the street axis, which is
        // outside a portrait frustum at the 3.2 m beat distance. Pull it toward the axis and lift it
        // a little so it clears the copy. Desktop (aspect ≥ 1.6) is exactly roundPosition(n).
        const aspect = state.size.width / Math.max(1, state.size.height)
        const k = Math.min(1, Math.max(0.3, aspect / 1.6))
        g.position.set(position[0] * k, position[1] + (1 - k) * 0.45, position[2])
        if (turn === 'spin') turnRef.current += 0.15 * dt
        else turnRef.current = 0.3 * Math.sin(time * 0.5)
        g.rotation.y = faceYaw + turnRef.current
      }
    }
    const solid = smoothstep(0.45, 0.7, presence)
    const particlesOn = visible && presence < 0.92
    const pm = built.particleMaterial
    pm.uniforms.uTime.value = time
    pm.uniforms.uCondense.value = presence
    const cam = state.camera as THREE.PerspectiveCamera
    pm.uniforms.uPixelScale.value = (state.size.height * state.gl.getPixelRatio()) / (2 * Math.tan(THREE.MathUtils.degToRad(cam.fov) * 0.5))
    if (points.current) points.current.visible = particlesOn
    built.solidUniforms.uSolid.value = solid
    built.solidUniforms.uTime.value = time
    if (g && visible) {
      for (const child of g.children) {
        if (child === points.current) continue
        if ((child as THREE.Light).isLight) continue
        child.visible = solid > 0
      }
    }
    return { r, presence, solid, visible, time, dt }
  }

  return {
    group,
    points,
    particleGeometry: built.particleGeometry,
    particleMaterial: built.particleMaterial,
    position,
    solidUniforms: built.solidUniforms,
    update,
  }
}

/** Build a ShaderMaterial with the shared solid uniforms merged in. */
export function solidMaterial(
  vertexShader: string,
  fragmentShader: string,
  shared: Condense['solidUniforms'],
  uniforms: Record<string, { value: unknown }>,
  extra: Partial<THREE.ShaderMaterialParameters> = {},
) {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: { ...shared, ...uniforms },
    ...extra,
  })
}
