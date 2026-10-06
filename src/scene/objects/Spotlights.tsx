import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { readScene, type SceneRead } from '../useSceneUniforms'
import coneVert from '../shaders/hero-cone.vert'
import coneFrag from '../shaders/hero-cone.frag'
import glowVert from '../shaders/hero-glow.vert'
import glowFrag from '../shaders/hero-glow.frag'

/**
 * The two arena follow-spots. Shared by the rest of the hero track (smoke,
 * dust, fence, floor) so every object agrees on where the light comes from.
 */
export const LAMP_A = new THREE.Vector3(-4, 8, 3)
export const LAMP_B = new THREE.Vector3(4, 8, 3)
export const SPOT_TARGET = new THREE.Vector3(0, 0.4, 0)
/** radius of the pool of light on the floor, in meters */
export const SPOT_POOL_RADIUS = 1.7
export const SPOT_COLOR_A = '#fff1d6'
export const SPOT_COLOR_B = '#ffe3b4'

/** where the ray lamp → target meets the floor (y = 0) */
export function spotFloorHit(lamp: THREE.Vector3, target: THREE.Vector3, out: THREE.Vector3) {
  const t = lamp.y / Math.max(1e-3, lamp.y - target.y)
  return out.copy(target).sub(lamp).multiplyScalar(t).add(lamp)
}
export const FLOOR_HIT_A = spotFloorHit(LAMP_A, SPOT_TARGET, new THREE.Vector3())
export const FLOOR_HIT_B = spotFloorHit(LAMP_B, SPOT_TARGET, new THREE.Vector3())

/**
 * 1 inside [a, b) of shotFloat with soft edges of `fade` shots, 0 outside.
 * Used for "visible in shots 08–09" style ranges that span a cut.
 */
export function rangeLevel(sf: number, a: number, b: number, fade = 0.15) {
  const i = THREE.MathUtils.smoothstep(sf, a - fade * 0.5, a + fade * 0.5)
  const o = 1 - THREE.MathUtils.smoothstep(sf, b - fade, b)
  return i * o
}

/** 0.15 dim → 1 full: how hard the two follow-spots are working at this point of the film */
export function spotLevel(r: SceneRead) {
  const sf = r.shotFloat
  const hero = rangeLevel(sf, 0, 3, 0.4)
  // beat 3 of the journey: the spots idle down as the city rises
  const heroDim = 1 - 0.75 * r.local(2, 0.66, 0.95)
  const corner = rangeLevel(sf, 7, 9, 0.2)
  const crane = rangeLevel(sf, 11, 12.5, 0.2)
  return Math.max(0.15, hero * heroDim, corner, crane)
}

const CONE_BASE_RADIUS = SPOT_POOL_RADIUS * 1.05
const _dir = new THREE.Vector3()
const _up = new THREE.Vector3(0, 1, 0)

function coneTransform(lamp: THREE.Vector3, floorHit: THREE.Vector3) {
  const len = lamp.distanceTo(floorHit)
  const pos = new THREE.Vector3().addVectors(lamp, floorHit).multiplyScalar(0.5)
  _dir.subVectors(lamp, floorHit).normalize()
  const quat = new THREE.Quaternion().setFromUnitVectors(_up, _dir)
  return { len, pos, quat }
}

function makeConeMaterial(color: string) {
  return new THREE.ShaderMaterial({
    vertexShader: coneVert,
    fragmentShader: coneFrag,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uIntensity: { value: 0.5 },
      uTime: { value: 0 },
      uSoft: { value: 2.2 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
    fog: false,
  })
}

function makeFlareMaterial(color: string) {
  return new THREE.ShaderMaterial({
    vertexShader: glowVert,
    fragmentShader: glowFrag,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uIntensity: { value: 1 },
      uFalloff: { value: new THREE.Vector2(5.5, 70) },
      uCore: { value: 22 },
    },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    fog: false,
  })
}

/**
 * Two volumetric follow-spots: open additive cones from the lamps to the
 * floor, soft-edged with a radial + length falloff and a noise flicker, plus
 * an anamorphic streak at each lamp and a tiny dark fixture so the light has
 * a source. Full in shots 01–03, 08–09 and 12; idling at 15 % elsewhere;
 * spikes with r.flash. ~5 draw calls.
 */
export function Spotlights() {
  const camera = useThree((s) => s.camera)
  const coneA = useRef<THREE.Mesh>(null)
  const coneB = useRef<THREE.Mesh>(null)
  const flareA = useRef<THREE.Mesh>(null)
  const flareB = useRef<THREE.Mesh>(null)
  const fixtures = useRef<THREE.InstancedMesh>(null)
  const time = useRef(0)

  const { coneGeo, matA, matB, flareGeo, flareMatA, flareMatB, tA, tB, fixtureGeo, fixtureMat, fixtureMatrices } = useMemo(() => {
    const tA = coneTransform(LAMP_A, FLOOR_HIT_A)
    const tB = coneTransform(LAMP_B, FLOOR_HIT_B)
    // unit-length cone; scaled per lamp so one geometry serves both
    const coneGeo = new THREE.ConeGeometry(CONE_BASE_RADIUS, 1, 48, 1, true)
    const flareGeo = new THREE.PlaneGeometry(1, 1)
    const fixtureGeo = new THREE.BoxGeometry(0.42, 0.3, 0.5)
    const fixtureMat = new THREE.MeshStandardMaterial({ color: '#111216', roughness: 0.6, metalness: 0.6 })
    const o = new THREE.Object3D()
    const fixtureMatrices = [LAMP_A, LAMP_B].map((lamp) => {
      o.position.copy(lamp)
      o.lookAt(SPOT_TARGET)
      o.updateMatrix()
      return o.matrix.clone()
    })
    return {
      coneGeo,
      matA: makeConeMaterial(SPOT_COLOR_A),
      matB: makeConeMaterial(SPOT_COLOR_B),
      flareGeo,
      flareMatA: makeFlareMaterial('#ffe9c4'),
      flareMatB: makeFlareMaterial('#ffe0a8'),
      tA,
      tB,
      fixtureGeo,
      fixtureMat,
      fixtureMatrices,
    }
  }, [])

  useLayoutEffect(() => {
    const m = fixtures.current
    if (!m) return
    m.setMatrixAt(0, fixtureMatrices[0])
    m.setMatrixAt(1, fixtureMatrices[1])
    m.instanceMatrix.needsUpdate = true
  }, [fixtureMatrices])

  useFrame((_, dt) => {
    const r = readScene()
    if (!r.reduced) time.current += Math.min(dt, 0.1)
    const level = spotLevel(r)
    const k = level * (1 + r.flash * 1.6)
    const on = level > 0.02

    const cones: [THREE.Mesh | null, THREE.ShaderMaterial, number][] = [
      [coneA.current, matA, 0.32],
      [coneB.current, matB, 0.27],
    ]
    for (const [mesh, mat, base] of cones) {
      if (!mesh) continue
      mesh.visible = on
      mat.uniforms.uIntensity.value = base * k
      mat.uniforms.uTime.value = time.current
      mat.uniforms.uSoft.value = r.lowPower ? 1.4 : 1.7
    }

    const flares: [THREE.Mesh | null, THREE.ShaderMaterial, number][] = [
      [flareA.current, flareMatA, 0.6],
      [flareB.current, flareMatB, 0.55],
    ]
    for (const [mesh, mat, base] of flares) {
      if (!mesh) continue
      mesh.visible = on
      mesh.quaternion.copy(camera.quaternion)
      // the streak is a lens artefact: tightest when looking straight at the lamp
      mat.uniforms.uIntensity.value = base * k * (0.9 + 0.1 * Math.sin(time.current * 5.1))
    }
  })

  return (
    <group>
      <mesh ref={coneA} geometry={coneGeo} material={matA} position={tA.pos} quaternion={tA.quat} scale={[1, tA.len, 1]} renderOrder={20} frustumCulled={false} />
      <mesh ref={coneB} geometry={coneGeo} material={matB} position={tB.pos} quaternion={tB.quat} scale={[1, tB.len, 1]} renderOrder={20} frustumCulled={false} />
      <mesh ref={flareA} geometry={flareGeo} material={flareMatA} position={LAMP_A} scale={[3.5, 0.75, 1]} renderOrder={30} />
      <mesh ref={flareB} geometry={flareGeo} material={flareMatB} position={LAMP_B} scale={[3.5, 0.75, 1]} renderOrder={30} />
      <instancedMesh ref={fixtures} args={[fixtureGeo, fixtureMat, 2]} frustumCulled={false} />
    </group>
  )
}
