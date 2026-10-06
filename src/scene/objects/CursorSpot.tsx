import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '../../store/useScroll'
import { useSettings } from '../../store/useSettings'
import { readScene, type SceneRead } from '../useSceneUniforms'
import { rangeLevel } from './Spotlights'
import coneVert from '../shaders/hero-cone.vert'
import coneFrag from '../shaders/hero-cone.frag'
import glowVert from '../shaders/hero-glow.vert'
import glowFrag from '../shaders/hero-glow.frag'

/**
 * World-space point on the floor (y = 0) the cursor follow-spot is lighting.
 * Updated every frame; other objects (smoke, floor, dust) read it directly.
 */
export const cursorSpotTarget = new THREE.Vector3(0.8, 0, 1.2)
/** radius of its pool on the floor, meters */
export const CURSOR_POOL_RADIUS = 0.95
export const CURSOR_LAMP_HEIGHT = 7
export const CURSOR_COLOR = '#fff6e4'

/** 0..1 how present the cursor spot is: meaningful in shots 01–03, gone after */
export function cursorSpotLevel(r: SceneRead) {
  return rangeLevel(r.shotFloat, 0, 2.75, 0.5)
}

const LAG_SECONDS = 0.12
const MAX_RADIUS = 7.5
const IDLE_SECONDS = 1.6

const _plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
const _ray = new THREE.Raycaster()
const _ndc = new THREE.Vector2()
const _hit = new THREE.Vector3()
const _goal = new THREE.Vector3()
const _lamp = new THREE.Vector3()
const _dir = new THREE.Vector3()
const _up = new THREE.Vector3(0, 1, 0)
const _quat = new THREE.Quaternion()

/**
 * The follow-spot cursor: a third, smaller spotlight whose floor target follows
 * the pointer with a 120 ms lag (dt-based damping ≈ lerp 0.1 per frame at
 * 60 fps). The pointer is raycast against the floor plane through the camera.
 * Before any pointer event, and on touch devices between touches, the spot
 * drifts slowly along a lissajous path so the hero never shows a static light.
 * Drawn as a volumetric cone from 7 m up plus a soft additive floor disc so it
 * visibly cuts the smoke. 2 draw calls.
 */
export function CursorSpot() {
  const camera = useThree((s) => s.camera)
  const cone = useRef<THREE.Mesh>(null)
  const disc = useRef<THREE.Mesh>(null)
  const time = useRef(0)
  const idle = useRef(IDLE_SECONDS + 1)
  const lastPx = useRef({ x: NaN, y: NaN })
  const anchor = useRef(new THREE.Vector3(0.8, 0, 1.2))

  const { coneGeo, coneMat, discGeo, discMat } = useMemo(() => {
    const coneGeo = new THREE.ConeGeometry(CURSOR_POOL_RADIUS * 1.05, 1, 40, 1, true)
    const coneMat = new THREE.ShaderMaterial({
      vertexShader: coneVert,
      fragmentShader: coneFrag,
      uniforms: {
        uColor: { value: new THREE.Color(CURSOR_COLOR) },
        uIntensity: { value: 0.5 },
        uTime: { value: 0 },
        uSoft: { value: 2.4 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      fog: false,
    })
    const discGeo = new THREE.PlaneGeometry(1, 1)
    const discMat = new THREE.ShaderMaterial({
      vertexShader: glowVert,
      fragmentShader: glowFrag,
      uniforms: {
        uColor: { value: new THREE.Color(CURSOR_COLOR) },
        uIntensity: { value: 0.6 },
        uFalloff: { value: new THREE.Vector2(5.5, 5.5) },
        uCore: { value: 9 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    })
    return { coneGeo, coneMat, discGeo, discMat }
  }, [])

  useFrame((_, dt) => {
    const r = readScene()
    const step = Math.min(dt, 0.1)
    if (!r.reduced) time.current += step
    const level = cursorSpotLevel(r)
    const on = level > 0.01
    if (cone.current) cone.current.visible = on
    if (disc.current) disc.current.visible = on

    // --- where should the light be? ---
    const s = useScroll.getState()
    const px = s.pointerPx
    const hadPointer = px.x > -5000
    const moved = hadPointer && (px.x !== lastPx.current.x || px.y !== lastPx.current.y)
    if (moved) {
      lastPx.current.x = px.x
      lastPx.current.y = px.y
      idle.current = 0
      _ndc.set(r.pointer.x, r.pointer.y)
      _ray.setFromCamera(_ndc, camera)
      if (_ray.ray.intersectPlane(_plane, _hit)) {
        // clamp to the arena so a pointer near the horizon doesn't fling the light away
        const d = Math.hypot(_hit.x, _hit.z)
        if (d > MAX_RADIUS) _hit.multiplyScalar(MAX_RADIUS / d)
        anchor.current.set(_hit.x, 0, _hit.z)
      }
    } else {
      idle.current += step
    }
    // lissajous drift: full before any pointer event; on touch devices it resumes after the
    // last touch goes idle; with a mouse the light stays where the cursor is
    const touch = useSettings.getState().touch
    const drift = !hadPointer ? 1 : touch ? THREE.MathUtils.smoothstep(idle.current, IDLE_SECONDS, IDLE_SECONDS + 2.5) : 0
    const t = time.current
    _goal.copy(anchor.current)
    _goal.x += drift * (Math.sin(t * 0.21) * 1.3 + Math.sin(t * 0.077 + 1.0) * 0.6)
    _goal.z += drift * (Math.sin(t * 0.17 + 2.1) * 0.9 + Math.cos(t * 0.053) * 0.5)
    if (r.reduced) {
      cursorSpotTarget.copy(anchor.current)
    } else {
      const k = 1 - Math.exp(-step / LAG_SECONDS)
      cursorSpotTarget.lerp(_goal, k)
    }
    if (!on) return

    // --- draw it ---
    const flashK = 1 + r.flash * 1.4
    _lamp.set(cursorSpotTarget.x + 0.35, CURSOR_LAMP_HEIGHT, cursorSpotTarget.z + 0.25)
    if (cone.current) {
      const len = _lamp.distanceTo(cursorSpotTarget)
      cone.current.position.addVectors(_lamp, cursorSpotTarget).multiplyScalar(0.5)
      _dir.subVectors(_lamp, cursorSpotTarget).normalize()
      _quat.setFromUnitVectors(_up, _dir)
      cone.current.quaternion.copy(_quat)
      cone.current.scale.set(1, len, 1)
      coneMat.uniforms.uIntensity.value = 0.2 * level * flashK
      coneMat.uniforms.uTime.value = t
    }
    if (disc.current) {
      disc.current.position.set(cursorSpotTarget.x, 0.025, cursorSpotTarget.z)
      const rad = CURSOR_POOL_RADIUS * 2.6
      disc.current.scale.set(rad, rad, 1)
      discMat.uniforms.uIntensity.value = 0.1 * level * flashK
    }
  })

  return (
    <group>
      <mesh ref={cone} geometry={coneGeo} material={coneMat} renderOrder={21} frustumCulled={false} />
      <mesh ref={disc} geometry={discGeo} material={discMat} rotation-x={-Math.PI / 2} renderOrder={12} frustumCulled={false} />
    </group>
  )
}
