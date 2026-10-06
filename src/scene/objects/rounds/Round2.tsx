/**
 * SHOT 05 / Round 2 — Real-Time Trade Alerts.
 * A floating phone plane (dark, thin bezel) with a message-bubble block that
 * pops in (scale 0 → 1 with overshoot) once presence > 0.75, plus a tiny
 * ember point-light pulse on the pop. Text is DOM. Draw calls: 3.
 *
 * Note: the brief says a literal phone (0.075 × 0.16 m); at the 3.2 m beat
 * distance that is ~55 px tall, so the plane is scaled to 0.3 × 0.64 m
 * (same proportions) to stay readable as a hero object.
 */
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useCondense, solidMaterial, EMBER, BONE } from './condense'
import solidVert from '../../shaders/rounds-solid.vert'
import panelFrag from '../../shaders/rounds-panel.frag'

const PW = 0.3
const PH = 0.64
const BW = 0.24
const BH = 0.1
const POP_AT = 0.75
const backOut = (t: number, s = 1.7) => {
  const u = t - 1
  return u * u * ((s + 1) * u + s) + 1
}

export function Round2() {
  const geometry = useMemo(() => new THREE.PlaneGeometry(PW, PH), [])
  const bubbleGeo = useMemo(() => new THREE.PlaneGeometry(BW, BH), [])
  const c = useCondense(2, geometry, { radius: 0.95, turn: 'sway', faceYaw: -0.4 })
  const phoneMat = useMemo(
    () =>
      solidMaterial(solidVert, panelFrag, c.solidUniforms, {
        uHalf: { value: new THREE.Vector2(PW / 2, PH / 2) },
        uRadius: { value: 0.04 },
        uBezel: { value: 0.006 },
        uBezelColor: { value: new THREE.Color('#3a3b44') },
        uFill: { value: new THREE.Color('#0b0b10') },
        uAccent: { value: EMBER.clone() },
        uAccentStrength: { value: 0 },
        uLines: { value: 0 },
        uGloss: { value: 1 },
      }),
    [c.solidUniforms],
  )
  const bubbleMat = useMemo(
    () =>
      solidMaterial(solidVert, panelFrag, c.solidUniforms, {
        uHalf: { value: new THREE.Vector2(BW / 2, BH / 2) },
        uRadius: { value: 0.02 },
        uBezel: { value: 0 },
        uBezelColor: { value: BONE.clone() },
        uFill: { value: new THREE.Color('#1c1d26') },
        uAccent: { value: EMBER.clone() },
        uAccentStrength: { value: 1.2 },
        uLines: { value: 2 },
        uGloss: { value: 0.3 },
      }),
    [c.solidUniforms],
  )
  const bubble = useRef<THREE.Mesh>(null)
  const light = useRef<THREE.PointLight>(null)
  const popT = useRef(-1)

  useFrame((state, delta) => {
    const f = c.update(state, delta)
    const b = bubble.current
    const l = light.current
    if (!f.visible) {
      popT.current = -1
      if (l) l.intensity = 0
      return
    }
    const armed = f.presence > POP_AT
    if (armed && popT.current < 0) popT.current = f.time
    if (!armed) popT.current = -1
    let s = 0
    let pulse = 0
    if (armed) {
      const t = f.r.reduced ? 1 : Math.min(1, (f.time - popT.current) / 0.45)
      s = backOut(t)
      const age = f.time - popT.current
      pulse = f.r.reduced ? 0.3 : Math.exp(-age * 3.2) * (0.6 + 0.4 * Math.sin(age * 30))
    }
    if (b) {
      b.visible = s > 0.001
      b.scale.setScalar(Math.max(0.0001, s))
    }
    if (l) l.intensity = pulse * 3.5
    // the screen itself warms with the ember when the alert lands
    phoneMat.uniforms.uAccentStrength.value = pulse * 0.6
  })

  return (
    <group ref={c.group} position={c.position}>
      <points ref={c.points} geometry={c.particleGeometry} material={c.particleMaterial} frustumCulled={false} />
      <mesh geometry={geometry} material={phoneMat} />
      <mesh ref={bubble} geometry={bubbleGeo} material={bubbleMat} position={[0, PH * 0.26, 0.012]} />
      <pointLight ref={light} color={EMBER} intensity={0} distance={2.2} decay={2} position={[0, PH * 0.26, 0.15]} />
    </group>
  )
}
