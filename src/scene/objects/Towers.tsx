import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { readScene } from '../useSceneUniforms'
import { useSettings } from '../../store/useSettings'
import { postPositions, WORLD } from '../world'
import facadeVert from '../shaders/morph-facade.vert'
import facadeFrag from '../shaders/morph-facade.frag'

/**
 * The eight hero towers: the octagon's fence posts extrude into a skyline
 * during SHOT 03 (index 2) and stay for the rest of the film.
 *
 *  - one InstancedMesh of boxes (WORLD.towerWidth² × WORLD.towerHeight),
 *    anchored at the floor; scale y 0.05 → 1 on r.local(2, 0.25, 0.95) with a
 *    per-tower stagger (see towerRise), lateral scale grows from post width
 *  - procedural window grid (morph-windows.glsl): lit fraction grows over
 *    SHOT 03, then SHOT 04 lights one more floor band per poster (6 steps)
 *  - rooftop gold cap + a tiny ember aviation beacon blinking at 1 Hz, each
 *    one instanced draw (×8)
 *
 * 3 draw calls. On r.lowPower the facade uses a static baked window pattern.
 */

/** per-tower extrusion 0..1 for driver t (0..1); keep in sync with morph-particles.vert */
export const towerRise = (t: number, i: number) => {
  const x = Math.min(1, Math.max(0, (t - i * 0.055) / 0.6))
  return x * x * (3 - 2 * x)
}

const N = WORLD.postCount
const H = WORLD.towerHeight
const W = WORLD.towerWidth
const POST_W = 0.12
const GOLD = new THREE.Color('#D2A64B')
const EMBER = new THREE.Color('#FF5A1F')

export function Towers() {
  const lowPower = useSettings((s) => s.lowPower)
  const body = useRef<THREE.InstancedMesh>(null)
  const caps = useRef<THREE.InstancedMesh>(null)
  const beacons = useRef<THREE.InstancedMesh>(null)
  const last = useRef({ rise: -1, blink: -1, frozen: false })

  const { geo, mat, capGeo, capMat, beaconGeo, beaconMat, posts } = useMemo(() => {
    const geo = new THREE.BoxGeometry(W, H, W)
    geo.translate(0, H / 2, 0)
    const seeds = new Float32Array(N)
    for (let i = 0; i < N; i++) seeds[i] = (i + 1) / N + 0.137 * i
    geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1))
    const mat = new THREE.ShaderMaterial({
      vertexShader: facadeVert,
      fragmentShader: facadeFrag,
      defines: lowPower ? { LOW_POWER: 1 } : {},
      fog: true,
      uniforms: {
        ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),
        uHeight: { value: H },
        uConcrete: { value: new THREE.Color('#1a1b22') },
        uLit: { value: 0 },
        uBands: { value: 0 },
        uTime: { value: 0 },
        uGain: { value: 1.15 },
      },
    })
    const capGeo = new THREE.BoxGeometry(W + 0.12, 0.14, W + 0.12)
    capGeo.translate(0, 0.07, 0)
    const capMat = new THREE.MeshBasicMaterial({ color: GOLD.clone().multiplyScalar(0.75), fog: true })
    const beaconGeo = new THREE.SphereGeometry(0.16, 8, 6)
    const beaconMat = new THREE.MeshBasicMaterial({ color: EMBER.clone().multiplyScalar(2.2), fog: true })
    return { geo, mat, capGeo, capMat, beaconGeo, beaconMat, posts: postPositions() }
  }, [lowPower])

  const m = useMemo(() => new THREE.Matrix4(), [])
  const q = useMemo(() => new THREE.Quaternion(), [])
  const p = useMemo(() => new THREE.Vector3(), [])
  const s = useMemo(() => new THREE.Vector3(), [])

  useFrame((state) => {
    const b = body.current
    const c = caps.current
    const bc = beacons.current
    if (!b || !c || !bc) return
    const r = readScene()
    // posts only start to extrude 25 % into SHOT 03; before that the fence posts stand alone.
    // Reduced motion: SHOT 03 is a still, so hold the extrusion half way like the frozen pour.
    const rise = r.reduced && r.shot === 2 ? 0.8 : r.local(2, 0.66, 1.0)
    const show = r.shotFloat >= 2.62
    b.visible = show
    c.visible = show
    bc.visible = show
    if (!show) return

    const time = r.reduced ? 1000 : state.clock.elapsedTime
    if (!r.reduced || !last.current.frozen) {
      mat.uniforms.uTime.value = time
      last.current.frozen = r.reduced
    }
    // windows: scatter grows over SHOT 03, floors light in six steps across SHOT 04
    mat.uniforms.uLit.value = 0.38 * r.local(2, 0.74, 1.0)
    mat.uniforms.uBands.value = Math.floor(r.local(3, 0.05, 0.97) * 6 + 1e-4) / 6

    if (rise !== last.current.rise) {
      last.current.rise = rise
      for (let i = 0; i < N; i++) {
        const k = towerRise(rise, i)
        const sy = 0.05 + 0.95 * k
        const g = Math.min(1, k / 0.35)
        const sxz = (POST_W + (W - POST_W) * g * g * (3 - 2 * g)) / W
        p.set(posts[i][0], 0, posts[i][2])
        s.set(sxz, sy, sxz)
        b.setMatrixAt(i, m.compose(p, q, s))
        p.y = H * sy
        s.set(sxz, 1, sxz)
        c.setMatrixAt(i, m.compose(p, q, s))
      }
      b.instanceMatrix.needsUpdate = true
      c.instanceMatrix.needsUpdate = true
    }
    // aviation beacons: 1 Hz blink with a per-tower phase; steady under reduced motion
    const blinkKey = r.reduced ? -2 : Math.floor(time * 10)
    if (blinkKey !== last.current.blink || rise !== last.current.rise) {
      last.current.blink = blinkKey
      for (let i = 0; i < N; i++) {
        const k = towerRise(rise, i)
        const on = r.reduced ? 1 : (time + i * 0.37) % 1 < 0.18 ? 1 : 0
        const sc = on * Math.min(1, k * 3)
        p.set(posts[i][0], H * (0.05 + 0.95 * k) + 0.3, posts[i][2])
        s.setScalar(sc > 0 ? sc : 0.0001)
        bc.setMatrixAt(i, m.compose(p, q, s))
      }
      bc.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group>
      <instancedMesh ref={body} args={[geo, mat, N]} frustumCulled={false} castShadow={false} receiveShadow={false} />
      <instancedMesh ref={caps} args={[capGeo, capMat, N]} frustumCulled={false} />
      <instancedMesh ref={beacons} args={[beaconGeo, beaconMat, N]} frustumCulled={false} />
    </group>
  )
}
