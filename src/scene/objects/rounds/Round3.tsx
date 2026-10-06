/**
 * SHOT 05 / Round 3 — Options & Signals (6-week course).
 * Six stacked translucent panes (one InstancedMesh, 0.5 × 0.32, terminal
 * tint at 10 % opacity, 1-px bone edges as one LineSegments) fanned with
 * 0.06 m spacing. Pane k turns gold once presence > 0.5 + k·0.07, so they
 * switch on week by week. Draw calls: 3.
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { useCondense, solidMaterial, GOLD, BONE, TERMINAL } from './condense'
import solidVert from '../../shaders/rounds-solid.vert'
import paneFrag from '../../shaders/rounds-pane.frag'
import lineVert from '../../shaders/rounds-line.vert'
import lineFrag from '../../shaders/rounds-line.frag'

const PW = 0.5
const PH = 0.32
const N = 6
const GAP = 0.06

function paneMatrices() {
  const m = new THREE.Matrix4()
  const out: THREE.Matrix4[] = []
  const q = new THREE.Quaternion()
  const e = new THREE.Euler()
  for (let k = 0; k < N; k++) {
    const t = k - (N - 1) / 2
    e.set(-0.05 * t, 0.3 * t, 0.03 * t)
    q.setFromEuler(e)
    m.compose(new THREE.Vector3(0.12 * t, 0.02 * t, -GAP * t), q, new THREE.Vector3(1, 1, 1))
    out.push(m.clone())
  }
  return out
}

export function Round3() {
  const built = useMemo(() => {
    const plane = new THREE.PlaneGeometry(PW, PH)
    const mats = paneMatrices()
    // merged copy for the particle sampling
    const sample = mergeGeometries(mats.map((m) => plane.clone().applyMatrix4(m)))!
    // edges: one geometry with all six frames, aGlow = threshold per pane
    const edgeBase = new THREE.EdgesGeometry(plane)
    const edges = mats.map((m, k) => {
      const g = edgeBase.clone().applyMatrix4(m)
      const n = g.getAttribute('position').count
      const glow = new Float32Array(n).fill(0.5 + k * 0.07)
      g.setAttribute('aGlow', new THREE.BufferAttribute(glow, 1))
      return g
    })
    const edgeGeo = mergeGeometries(edges)!
    const glow = new Float32Array(N)
    for (let k = 0; k < N; k++) glow[k] = 0.5 + k * 0.07
    plane.setAttribute('aGlow', new THREE.InstancedBufferAttribute(glow, 1))
    return { plane, mats, sample, edgeGeo }
  }, [])
  const c = useCondense(3, built.sample, { radius: 1.0, turn: 'sway', faceYaw: 0.4 })
  const paneMat = useMemo(
    () =>
      solidMaterial(
        solidVert,
        paneFrag,
        c.solidUniforms,
        {
          uTint: { value: TERMINAL.clone() },
          uGlowColor: { value: GOLD.clone() },
          uGlowLevel: { value: 0 },
        },
        { transparent: true, depthWrite: false, side: THREE.DoubleSide },
      ),
    [c.solidUniforms],
  )
  const lineMat = useMemo(
    () =>
      solidMaterial(lineVert, lineFrag, c.solidUniforms, {
        uColor: { value: BONE.clone() },
        uIntensity: { value: 0.9 },
        uGlowColor: { value: GOLD.clone() },
        uGlowLevel: { value: 0 },
        uGlint: { value: 5 },
        uGlintAxis: { value: new THREE.Vector3(1, 0, 0) },
        uGlintWidth: { value: 0.1 },
        uSway: { value: 0 },
        uPivot: { value: new THREE.Vector3() },
      }),
    [c.solidUniforms],
  )
  const inst = useMemo(() => {
    const im = new THREE.InstancedMesh(built.plane, paneMat, N)
    built.mats.forEach((m, k) => im.setMatrixAt(k, m))
    im.instanceMatrix.needsUpdate = true
    im.frustumCulled = false
    return im
  }, [built, paneMat])

  useFrame((state, delta) => {
    const f = c.update(state, delta)
    if (!f.visible) return
    paneMat.uniforms.uGlowLevel.value = f.presence
    lineMat.uniforms.uGlowLevel.value = f.presence
  })

  return (
    <group ref={c.group} position={c.position}>
      <points ref={c.points} geometry={c.particleGeometry} material={c.particleMaterial} frustumCulled={false} />
      <primitive object={inst} />
      <lineSegments geometry={built.edgeGeo} material={lineMat} />
    </group>
  )
}
