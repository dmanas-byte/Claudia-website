import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { readScene } from '../useSceneUniforms'
import { WORLD } from '../world'
import vert from '../shaders/term-surface.vert'
import phoneFrag from '../shaders/term-phone.frag'
import haloFrag from '../shaders/term-halo.frag'

const PHONE_W = 0.075
const PHONE_H = 0.16

/**
 * SHOT 07 — The Alert. A phone-sized plane at WORLD.phone.center facing +z:
 * dark body, bone bezel, near-black lock screen. The notification card
 * slides in on r.local(6, 0.25, 0.32); when it lands (uIn crosses 0.95) the
 * screen flashes ember for ~40 ms, the plane shakes ±4 mm for two frames and
 * an ember point light pops. Visible from shot 06 local 0.9 to the end of 07.
 * 2 draw calls + 1 point light.
 */
export function Phone() {
  const [px, py, pz] = WORLD.phone.center
  const group = useRef<THREE.Group>(null)
  const light = useRef<THREE.PointLight>(null)
  const time = useRef(0)
  const ember = useRef(0)
  const armed = useRef(true)
  const shakeFrames = useRef(0)

  const phoneMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: phoneFrag,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uIn: { value: 0 },
          uEmber: { value: 0 },
          uTime: { value: 0 },
          uFade: { value: 0 },
          uComp: { value: 1 },
          uSize: { value: new THREE.Vector2(PHONE_W, PHONE_H) },
          uBone: { value: new THREE.Color('#F2EEE6') },
          uEmberCol: { value: new THREE.Color('#FF5A1F') },
          uTerminal: { value: new THREE.Color('#38E8FF') },
        },
      }),
    [],
  )
  const haloMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: haloFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uCool: { value: new THREE.Color('#38E8FF').lerp(new THREE.Color('#F2EEE6'), 0.6) },
          uEmberCol: { value: new THREE.Color('#FF5A1F') },
          uEmber: { value: 0 },
          uGain: { value: 0 },
        },
      }),
    [],
  )

  useFrame((_, dt) => {
    const r = readScene()
    /* r.shot (not shotFloat) decides membership: a pinned shot's tail reads shotFloat = i+1 */
    const show = (r.shot === 5 && r.shotProgress >= 0.9) || r.shot === 6
    if (group.current) group.current.visible = show
    if (!show) {
      if (light.current) light.current.intensity = 0
      return
    }
    const step = Math.min(dt, 0.05)
    if (!r.reduced) time.current += step
    const fade = r.local(5, 0.9, 1)
    const uIn = r.local(6, 0.25, 0.32)
    /* same curve as Mood.tsx: exposure = 1 - 0.82 * inAlert */
    const inAlert = r.local(6, 0, 0.15) * (1 - r.local(6, 0.85, 1))
    const comp = 1 / (1 - 0.82 * inAlert)

    /* fire once per crossing of 0.95, re-arm below 0.9 */
    if (uIn < 0.9) armed.current = true
    if (armed.current && uIn >= 0.95) {
      armed.current = false
      ember.current = 1
      shakeFrames.current = r.reduced ? 0 : 2
    }
    ember.current *= Math.exp(-step / 0.04)
    if (ember.current < 0.002) ember.current = 0

    if (group.current) {
      if (shakeFrames.current > 0) {
        shakeFrames.current -= 1
        group.current.position.set(px + (Math.random() - 0.5) * 0.008, py + (Math.random() - 0.5) * 0.008, pz)
      } else group.current.position.set(px, py, pz)
    }

    phoneMat.uniforms.uIn.value = uIn
    phoneMat.uniforms.uEmber.value = ember.current
    phoneMat.uniforms.uTime.value = time.current
    phoneMat.uniforms.uFade.value = fade
    phoneMat.uniforms.uComp.value = comp
    haloMat.uniforms.uEmber.value = ember.current
    haloMat.uniforms.uGain.value = fade * comp * (0.045 + 0.03 * uIn + 3.0 * ember.current)
    if (light.current) light.current.intensity = ember.current * 14 * comp
  })

  return (
    <group ref={group} position={[px, py, pz]} visible={false}>
      <mesh material={haloMat} position={[0, 0.01, -0.012]}>
        <planeGeometry args={[0.34, 0.34]} />
      </mesh>
      <mesh material={phoneMat}>
        <planeGeometry args={[PHONE_W, PHONE_H]} />
      </mesh>
      <pointLight ref={light} color="#FF5A1F" intensity={0} distance={4} decay={2} position={[0, 0, 0.25]} />
    </group>
  )
}
