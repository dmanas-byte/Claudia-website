import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { readScene } from '../useSceneUniforms'
import { useSettings } from '../../store/useSettings'
import { postPositions, WORLD } from '../world'
import { hash } from '../../lib/math'
import vert from '../shaders/morph-particles.vert'
import frag from '../shaders/morph-particles.frag'

/**
 * Signature moment 1 — the pour. 40,000 gold particles (8,000 on r.lowPower)
 * as one THREE.Points with a custom ShaderMaterial. Everything is computed in
 * the vertex shader from a per-particle seed + SHOT 03 progress, so there is
 * no simulation state: scrubbing backwards is free.
 *
 *  p = r.local(2, 0.05, 1.0)
 *   0.05–0.72  emit from the backpack mouth, rise on a curl-noise field in a
 *              column 2–6 m wide up to ~30 m
 *   0.56–0.98  drift to the eight tower positions and settle on their
 *              silhouettes, following the extrusion stagger
 *   0.84–1.0   fade out while the towers' windows take over
 *
 * Hidden outside SHOT 03. Under r.reduced the pour freezes at a mid frame.
 * 1 draw call.
 */

/** the backpack's zipper mouth; mirrors BACKPACK_MOUTH in Backpack.tsx (hero track) */
const MOUTH = new THREE.Vector3(0, 0.52, 0)
const GOLD = new THREE.Color('#D2A64B')
const BONE = new THREE.Color('#F2EEE6')
const REDUCED_P = 0.45
/** window pitch of morph-windows.glsl */
const PITCH = 1.2

export function GoldParticles() {
  const lowPower = useSettings((s) => s.lowPower)
  const points = useRef<THREE.Points>(null)
  const frozen = useRef(false)

  const { geo, mat } = useMemo(() => {
    const count = lowPower ? 8000 : 40000
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count * 4)
    const target = new Float32Array(count * 4)
    const posts = postPositions()
    const hw = WORLD.towerWidth / 2 + 0.1
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] = MOUTH.y
      seed[i * 4] = hash(i * 4 + 1)
      seed[i * 4 + 1] = hash(i * 4 + 2)
      seed[i * 4 + 2] = hash(i * 4 + 3)
      seed[i * 4 + 3] = hash(i * 4 + 4)
      // deal each particle a tower, a face, and a spot inside one of that
      // face's window cells (same 1.2 m grid + per-tower offset as morph-windows.glsl)
      const k = i % posts.length
      const face = Math.floor(hash(i * 7 + 11) * 4)
      const [tx, , tz] = posts[k]
      const towerSeed = (k + 1) / posts.length + 0.137 * k
      const base = face < 2 ? tz : tx
      const u0 = base - WORLD.towerWidth / 2 + hash(i * 7 + 13) * WORLD.towerWidth + towerSeed * 13
      const u = (Math.floor(u0 / PITCH) + 0.22 + 0.56 * hash(i * 7 + 19)) * PITCH - towerSeed * 13
      const along = Math.min(hw, Math.max(-hw, u - base))
      target[i * 4] = tx + (face === 0 ? hw : face === 1 ? -hw : along)
      target[i * 4 + 2] = tz + (face === 2 ? hw : face === 3 ? -hw : along)
      const yCell = Math.floor((0.04 + 0.93 * hash(i * 7 + 17)) * (WORLD.towerHeight / PITCH))
      target[i * 4 + 1] = ((yCell + 0.28 + 0.44 * hash(i * 7 + 23)) * PITCH) / WORLD.towerHeight
      target[i * 4 + 3] = k
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4))
    geo.setAttribute('aTarget', new THREE.BufferAttribute(target, 4))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 18, 0), 40)
    const mat = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uP: { value: 0 },
        uRise: { value: 0 },
        uPixelScale: { value: 1000 },
        uTowerHeight: { value: WORLD.towerHeight },
        uMouth: { value: MOUTH.clone() },
        uGold: { value: GOLD.clone() },
        uBone: { value: BONE.clone() },
        uIntensity: { value: lowPower ? 1.3 : 0.75 },
      },
    })
    return { geo, mat }
  }, [lowPower])

  useFrame((state) => {
    const pts = points.current
    if (!pts) return
    const r = readScene()
    let p = r.local(2, 0.05, 1.0)
    if (r.reduced) p = r.shot === 2 ? REDUCED_P : r.shot < 2 ? 0 : 1
    const show = p > 0 && p < 1
    pts.visible = show
    if (!show) return
    const u = mat.uniforms
    if (r.reduced) {
      if (!frozen.current) {
        u.uTime.value = 1000
        frozen.current = true
      }
    } else {
      u.uTime.value = state.clock.elapsedTime
      frozen.current = false
    }
    u.uP.value = p
    u.uRise.value = r.reduced ? 0.45 : r.local(2, 0.25, 0.95)
    const cam = state.camera as THREE.PerspectiveCamera
    const fov = (cam.fov ?? 45) * (Math.PI / 180)
    u.uPixelScale.value = (state.size.height * state.viewport.dpr) / (2 * Math.tan(fov / 2))
  })

  return <points ref={points} args={[geo, mat]} frustumCulled={false} renderOrder={10} />
}
