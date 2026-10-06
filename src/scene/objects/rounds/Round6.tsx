/**
 * SHOT 05 / Round 6 — The Network (real-estate deals and partnerships).
 * A keyring: a solid gold torus (r 0.12) with three wireframe keys (torus
 * head + thin shaft + two teeth, EdgesGeometry gold lines) hanging from it
 * and swaying slightly (per-key sway in the line vertex shader). A gold glint
 * sweeps the keys every ~3 s. Particles sample the wire edges and the ring.
 * Draw calls: 3.
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { useCondense, solidMaterial, GOLD, BONE } from './condense'
import solidVert from '../../shaders/rounds-solid.vert'
import solidFrag from '../../shaders/rounds-solid.frag'
import lineVert from '../../shaders/rounds-line.vert'
import lineFrag from '../../shaders/rounds-line.frag'

const RING_R = 0.12
const RING_T = 0.012
const KEY_LEN = 0.27
const LIFT = 0.1 // the ring hangs a little above the beat centre
const PIVOT_Y = LIFT - RING_R // bottom of the ring

/** one key, head centred at the origin, shaft hanging down −y */
function keyGeometry() {
  const head = new THREE.TorusGeometry(0.05, 0.009, 8, 20)
  const shaft = new THREE.BoxGeometry(0.02, KEY_LEN, 0.008)
  shaft.translate(0, -0.05 - KEY_LEN / 2, 0)
  const t1 = new THREE.BoxGeometry(0.045, 0.03, 0.008)
  t1.translate(0.03, -0.05 - KEY_LEN + 0.025, 0)
  const t2 = new THREE.BoxGeometry(0.036, 0.026, 0.008)
  t2.translate(0.026, -0.05 - KEY_LEN + 0.08, 0)
  const solid = mergeGeometries([head.toNonIndexed(), shaft.toNonIndexed(), t1.toNonIndexed(), t2.toNonIndexed()])!
  return new THREE.EdgesGeometry(solid, 20)
}

export function Round6() {
  const built = useMemo(() => {
    const ring = new THREE.TorusGeometry(RING_R, RING_T, 10, 40)
    ring.translate(0, LIFT, 0)
    const key = keyGeometry()
    const keys = [-0.75, 0, 0.75].map((yaw, k) => {
      const m = new THREE.Matrix4()
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0.18 * (k - 1)))
      // the head hooks onto the bottom of the ring
      m.compose(new THREE.Vector3(0, PIVOT_Y - 0.04, 0), q, new THREE.Vector3(1, 1, 1))
      const g = key.clone().applyMatrix4(m)
      const n = g.getAttribute('position').count
      g.setAttribute('aSway', new THREE.BufferAttribute(new Float32Array(n).fill(k + 1), 1))
      return g
    })
    const lines = mergeGeometries(keys)!
    // particles: ring surface sampled as line-ish by using the ring edges + key edges
    const ringEdges = new THREE.EdgesGeometry(ring, 25)
    const sample = mergeGeometries([ringEdges, lines.clone().deleteAttribute('aSway')])!
    return { ring, lines, sample }
  }, [])
  const c = useCondense(6, built.sample, { radius: 0.9, edges: true, turn: 'spin', faceYaw: 0, size: 0.013 })
  const ringMat = useMemo(
    () =>
      solidMaterial(solidVert, solidFrag, c.solidUniforms, {
        uColor: { value: GOLD.clone().multiplyScalar(0.9) },
        uEmissive: { value: GOLD.clone() },
        uEmissiveStrength: { value: 0.18 },
        uRim: { value: BONE.clone() },
        uRimStrength: { value: 0.5 },
        uMetal: { value: 1 },
      }),
    [c.solidUniforms],
  )
  const lineMat = useMemo(
    () =>
      solidMaterial(lineVert, lineFrag, c.solidUniforms, {
        uColor: { value: GOLD.clone() },
        uIntensity: { value: 1.6 },
        uGlowColor: { value: GOLD.clone() },
        uGlowLevel: { value: -1 },
        uGlint: { value: 5 },
        uGlintAxis: { value: new THREE.Vector3(0, -1 / (KEY_LEN + 0.16), 0) },
        uGlintWidth: { value: 0.09 },
        uSway: { value: 0.09 },
        uPivot: { value: new THREE.Vector3(0, PIVOT_Y, 0) },
      }),
    [c.solidUniforms],
  )

  useFrame((state, delta) => {
    const f = c.update(state, delta)
    if (!f.visible) return
    lineMat.uniforms.uSway.value = f.r.reduced ? 0 : 0.09
    // glint runs down the keys every ~3 s
    const t = f.time % 3.0
    lineMat.uniforms.uGlint.value = t < 0.6 ? -0.3 + (t / 0.6) * 1.6 : 5
  })

  return (
    <group ref={c.group} position={c.position}>
      <points ref={c.points} geometry={c.particleGeometry} material={c.particleMaterial} frustumCulled={false} />
      <mesh geometry={built.ring} material={ringMat} />
      <lineSegments geometry={built.lines} material={lineMat} />
    </group>
  )
}
