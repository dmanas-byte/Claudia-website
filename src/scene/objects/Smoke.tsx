import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { readScene, type SceneRead } from '../useSceneUniforms'
import { FLOOR_HIT_A, FLOOR_HIT_B, SPOT_POOL_RADIUS, rangeLevel, spotLevel } from './Spotlights'
import { CURSOR_POOL_RADIUS, cursorSpotLevel, cursorSpotTarget } from './CursorSpot'
import smokeVert from '../shaders/hero-smoke.vert'
import smokeFrag from '../shaders/hero-smoke.frag'

const EXTENT = 120
const COLOR_DARK = '#15161C'
const COLOR_LIT = '#f2eee6'

/** 0..1 how much floor smoke the film wants right now */
export function smokeLevel(r: SceneRead) {
  const sf = r.shotFloat
  // thick in the arena, fading in beat 3 of the journey so the city reads clean
  const hero = rangeLevel(sf, 0, 3.2, 0.3) * (1 - r.local(2, 0.66, 0.95))
  // back thinner for the corner (08), the rig (09) and the crane (12)
  const corner = 0.45 * rangeLevel(sf, 7, 9, 0.2)
  const crane = 0.4 * rangeLevel(sf, 11, 12.5, 0.25)
  return Math.max(hero, corner, crane)
}

function makeSmokeMaterial(threshold: number, scale: number) {
  return new THREE.ShaderMaterial({
    vertexShader: smokeVert,
    fragmentShader: smokeFrag,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uOctaves: { value: 3 },
      uScale: { value: scale },
      uThreshold: { value: threshold },
      uSpotA: { value: new THREE.Vector4(FLOOR_HIT_A.x, FLOOR_HIT_A.z, SPOT_POOL_RADIUS * 0.85, 1) },
      uSpotB: { value: new THREE.Vector4(FLOOR_HIT_B.x, FLOOR_HIT_B.z, SPOT_POOL_RADIUS * 0.85, 1) },
      uCursor: { value: new THREE.Vector4(0, 0, CURSOR_POOL_RADIUS, 1) },
      uColorDark: { value: new THREE.Color(COLOR_DARK) },
      uColorLit: { value: new THREE.Color(COLOR_LIT) },
      uExtent: { value: EXTENT },
      uWind: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    side: THREE.DoubleSide,
    fog: false,
  })
}

/**
 * Floor-level smoke: two large planes just above the floor (y 0.03 dense,
 * y 0.6 sparse) with a domain-warped 3-octave FBM drifting at 0.02 uv/s.
 * The two follow-spots and the cursor spot brighten the smoke where their
 * cones hit the floor. Fewer octaves on r.lowPower; time frozen when
 * r.reduced. 2 draw calls.
 */
export function Smoke() {
  const low = useRef<THREE.Mesh>(null)
  const high = useRef<THREE.Mesh>(null)
  const time = useRef(0)

  const { geo, matLow, matHigh } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(EXTENT, EXTENT, 1, 1)
    return { geo, matLow: makeSmokeMaterial(0.44, 1.2), matHigh: makeSmokeMaterial(0.55, 0.6) }
  }, [])

  useFrame((_, dt) => {
    const r = readScene()
    if (!r.reduced) time.current += Math.min(dt, 0.1)
    const level = smokeLevel(r)
    const on = level > 0.01
    if (low.current) low.current.visible = on
    if (high.current) high.current.visible = on && !r.lowPower
    if (!on) return

    const spots = spotLevel(r) * (1 + r.flash * 1.5)
    const cursor = 0.6 * cursorSpotLevel(r) * (1 + r.flash * 1.2)
    const oct = r.lowPower ? 2 : 3
    for (const [mat, opacity] of [
      [matLow, 0.85],
      [matHigh, 0.38],
    ] as const) {
      mat.uniforms.uTime.value = time.current
      mat.uniforms.uOctaves.value = oct
      mat.uniforms.uOpacity.value = opacity * level
      mat.uniforms.uWind.value = r.wind
      mat.uniforms.uSpotA.value.w = spots
      mat.uniforms.uSpotB.value.w = spots
      const c = mat.uniforms.uCursor.value as THREE.Vector4
      c.set(cursorSpotTarget.x, cursorSpotTarget.z, CURSOR_POOL_RADIUS, cursor)
    }
  })

  return (
    <group>
      <mesh ref={low} geometry={geo} material={matLow} rotation-x={-Math.PI / 2} position-y={0.03} renderOrder={10} frustumCulled={false} />
      <mesh ref={high} geometry={geo} material={matHigh} rotation-x={-Math.PI / 2} position-y={0.6} renderOrder={11} frustumCulled={false} />
    </group>
  )
}
