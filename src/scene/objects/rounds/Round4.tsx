/**
 * SHOT 05 / Round 4 — Live Weekly Calls.
 * A ring of 10 small spotlights (two InstancedMeshes: housing + open additive
 * cone) on a 0.45 m ring tilted toward the camera, all pointing at a central
 * gold core. The cones flicker and brighten in sequence around the ring.
 * Draw calls: 4.
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { useCondense, solidMaterial, GOLD, SMOKE, BONE } from './condense'
import solidVert from '../../shaders/rounds-solid.vert'
import solidFrag from '../../shaders/rounds-solid.frag'
import coneFrag from '../../shaders/rounds-cone.frag'

const COUNT = 10
const RING = 0.45
const CONE_LEN = 0.4

export function Round4() {
  const built = useMemo(() => {
    // housing: a short cylinder along +y (lens toward +y) with a back cap
    const housing = new THREE.CylinderGeometry(0.03, 0.042, 0.09, 12, 1, false)
    // open cone: apex at the lamp (y = 0), mouth toward the centre; ConeGeometry has apex at +h/2 so flip
    const cone = new THREE.ConeGeometry(0.11, CONE_LEN, 18, 1, true)
    cone.translate(0, -CONE_LEN / 2, 0) // apex at origin
    cone.rotateX(Math.PI) // open end along +y
    const core = new THREE.SphereGeometry(0.035, 16, 12)
    const mats: THREE.Matrix4[] = []
    const q = new THREE.Quaternion()
    const up = new THREE.Vector3(0, 1, 0)
    const dir = new THREE.Vector3()
    const pos = new THREE.Vector3()
    for (let k = 0; k < COUNT; k++) {
      const a = (k / COUNT) * Math.PI * 2
      pos.set(Math.cos(a) * RING, Math.sin(a) * RING, 0)
      dir.copy(pos).negate().normalize() // point at the centre
      q.setFromUnitVectors(up, dir)
      mats.push(new THREE.Matrix4().compose(pos, q, new THREE.Vector3(1, 1, 1)))
    }
    const sample = mergeGeometries([
      ...mats.map((m) => housing.clone().applyMatrix4(m)),
      ...mats.map((m) => {
        const g = new THREE.ConeGeometry(0.07, CONE_LEN * 0.7, 10, 1, true)
        g.translate(0, -(CONE_LEN * 0.7) / 2, 0)
        g.rotateX(Math.PI)
        return g.applyMatrix4(m)
      }),
      core.clone(),
    ])!
    // per-instance phase around the ring (set after the sample merge: merged geometries must share attributes)
    const phase = new Float32Array(COUNT)
    for (let k = 0; k < COUNT; k++) phase[k] = k / COUNT
    housing.setAttribute('aGlow', new THREE.InstancedBufferAttribute(phase, 1))
    cone.setAttribute('aGlow', new THREE.InstancedBufferAttribute(phase.slice(), 1))
    return { housing, cone, core, mats, sample }
  }, [])
  const c = useCondense(4, built.sample, { radius: 1.1, turn: 'spin', faceYaw: 0, size: 0.013 })
  const housingMat = useMemo(
    () =>
      solidMaterial(solidVert, solidFrag, c.solidUniforms, {
        uColor: { value: SMOKE.clone().multiplyScalar(1.4) },
        uEmissive: { value: GOLD.clone() },
        uEmissiveStrength: { value: 0.08 },
        uRim: { value: GOLD.clone() },
        uRimStrength: { value: 0.7 },
        uMetal: { value: 0.9 },
      }),
    [c.solidUniforms],
  )
  const coneMat = useMemo(
    () =>
      solidMaterial(
        solidVert,
        coneFrag,
        c.solidUniforms,
        { uColor: { value: BONE.clone().lerp(GOLD, 0.6) }, uIntensity: { value: 0.55 } },
        { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide },
      ),
    [c.solidUniforms],
  )
  const coreMat = useMemo(
    () =>
      solidMaterial(solidVert, solidFrag, c.solidUniforms, {
        uColor: { value: GOLD.clone() },
        uEmissive: { value: GOLD.clone() },
        uEmissiveStrength: { value: 1.6 },
        uRim: { value: BONE.clone() },
        uRimStrength: { value: 0.6 },
        uMetal: { value: 1 },
      }),
    [c.solidUniforms],
  )
  const housings = useMemo(() => {
    const im = new THREE.InstancedMesh(built.housing, housingMat, COUNT)
    built.mats.forEach((m, k) => im.setMatrixAt(k, m))
    im.instanceMatrix.needsUpdate = true
    im.frustumCulled = false
    return im
  }, [built, housingMat])
  const cones = useMemo(() => {
    const im = new THREE.InstancedMesh(built.cone, coneMat, COUNT)
    built.mats.forEach((m, k) => im.setMatrixAt(k, m))
    im.instanceMatrix.needsUpdate = true
    im.frustumCulled = false
    return im
  }, [built, coneMat])

  useFrame((state, delta) => {
    const f = c.update(state, delta)
    if (!f.visible) return
    // the core breathes with the ring's pulse
    coreMat.uniforms.uEmissiveStrength.value = 1.2 + 0.6 * Math.sin(f.time * 2.5)
  })

  return (
    <group ref={c.group} position={c.position}>
      <points ref={c.points} geometry={c.particleGeometry} material={c.particleMaterial} frustumCulled={false} />
      {/* ring plane tilted ~35° back toward the camera */}
      <group rotation={[-0.55, 0, 0]}>
        <primitive object={housings} />
        <primitive object={cones} />
        <mesh geometry={built.core} material={coreMat} />
      </group>
    </group>
  )
}
