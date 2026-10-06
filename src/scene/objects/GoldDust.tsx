import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useSettings } from '../../store/useSettings'
import { readScene } from '../useSceneUniforms'
import { LAMP_A, LAMP_B, SPOT_TARGET, rangeLevel, spotLevel } from './Spotlights'
import { CURSOR_LAMP_HEIGHT, cursorSpotTarget } from './CursorSpot'
import dustVert from '../shaders/hero-dust.vert'
import dustFrag from '../shaders/hero-dust.frag'

const GOLD = '#D2A64B'
const BOX = { x: 18, y: 7, z: 18 }
const COUNT_DESKTOP = 16000
const COUNT_LOW = 3000
const POINT_METERS = 0.009

/** ambient presence of the dust per shot index (hard cuts are covered by the flash) */
const LEVEL_BY_SHOT = [1, 1, 0.85, 0.3, 0.35, 0, 0, 0.8, 0.6, 0.5, 0.4, 0.75]

/**
 * Gold dust in the arena air: point sprites drifting in a slow turbulence
 * field, lit where they cross the follow-spot beams, twinkling, pushed by
 * scroll wind. 16k points desktop / 3k on r.lowPower; drift frozen under
 * r.reduced. 1 draw call.
 */
export function GoldDust() {
  const lowPower = useSettings((s) => s.lowPower)
  const points = useRef<THREE.Points>(null)
  const size = useThree((s) => s.size)
  const viewport = useThree((s) => s.viewport)
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const drift = useRef(0)
  const time = useRef(0)
  const level = useRef(1)

  const { geo, mat } = useMemo(() => {
    const count = lowPower ? COUNT_LOW : COUNT_DESKTOP
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count * 4)
    let s = 1234.567
    const rnd = () => {
      s = (s * 9301 + 49297) % 233280
      return s / 233280
    }
    for (let i = 0; i < count; i++) {
      // denser toward the centre of the octagon where the light is
      const a = rnd() * Math.PI * 2
      const rad = Math.pow(rnd(), 0.6) * BOX.x * 0.5
      pos[i * 3] = Math.cos(a) * rad
      pos[i * 3 + 1] = rnd() * BOX.y
      pos[i * 3 + 2] = Math.sin(a) * rad
      seed[i * 4] = rnd()
      seed[i * 4 + 1] = rnd()
      seed[i * 4 + 2] = rnd()
      seed[i * 4 + 3] = rnd()
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, BOX.y / 2, 0), BOX.x)
    const mat = new THREE.ShaderMaterial({
      vertexShader: dustVert,
      fragmentShader: dustFrag,
      uniforms: {
        uTime: { value: 0 },
        uDrift: { value: 0 },
        uWind: { value: 0 },
        uPixelScale: { value: 300 },
        uBeam: { value: 1 },
        uLampA: { value: LAMP_A.clone() },
        uLampB: { value: LAMP_B.clone() },
        uLampC: { value: new THREE.Vector3(0, CURSOR_LAMP_HEIGHT, 0) },
        uTarget: { value: SPOT_TARGET.clone() },
        uTargetC: { value: new THREE.Vector3() },
        uBox: { value: BOX.y },
        uColor: { value: new THREE.Color(GOLD) },
        uIntensity: { value: 1 },
        uAmbient: { value: 0.1 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    })
    return { geo, mat }
  }, [lowPower])

  // the buffers are rebuilt when lowPower flips on resize; free the old ones
  useEffect(
    () => () => {
      geo.dispose()
      mat.dispose()
    },
    [geo, mat],
  )

  useFrame((_, dt) => {
    const r = readScene()
    const step = Math.min(dt, 0.1)
    if (!r.reduced) {
      time.current += step
      drift.current += step * (1 + r.wind * 4)
    }
    const want = (LEVEL_BY_SHOT[r.shot] ?? 0.5) * (r.shot === 2 ? 1 - 0.6 * r.local(2, 0.5, 1) : 1)
    level.current += (want - level.current) * (1 - Math.exp(-step * 4))
    const on = level.current > 0.02
    if (points.current) points.current.visible = on
    if (!on) return

    const u = mat.uniforms
    u.uTime.value = time.current
    u.uDrift.value = drift.current
    u.uWind.value = r.wind
    // meters → pixels at 1 m, so gl_PointSize / depth gives a perspective-correct sprite
    const fovRad = (camera.fov * Math.PI) / 180
    u.uPixelScale.value = ((size.height * viewport.dpr) / (2 * Math.tan(fovRad / 2))) * POINT_METERS
    u.uBeam.value = spotLevel(r) * (1 + r.flash)
    u.uLampC.value.set(cursorSpotTarget.x + 0.35, CURSOR_LAMP_HEIGHT, cursorSpotTarget.z + 0.25)
    u.uTargetC.value.copy(cursorSpotTarget)
    u.uIntensity.value = level.current * (0.65 + r.wind * 1.4) * (1 + r.flash * 1.2)
    u.uAmbient.value = 0.03 + 0.1 * rangeLevel(r.shotFloat, 7, 12.5, 0.2)
  })

  return <points ref={points} geometry={geo} material={mat} renderOrder={25} frustumCulled={false} />
}
