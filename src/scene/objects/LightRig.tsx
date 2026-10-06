import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { readScene } from '../useSceneUniforms'
import { WORLD } from '../world'
import instVert from '../shaders/term-inst.vert'
import coneFrag from '../shaders/term-cone.frag'
import lensFrag from '../shaders/term-lens.frag'

const { cols, rows, spacing, y: RIG_Y } = WORLD.lightRig
const COUNT = cols * rows
const CONE_H = 13.2
const CONE_R = 1.9
const OVERSHOOT_S = 0.06

/**
 * SHOT 09 — the 30-light rig above the octagon: 6 × 5 instanced fixtures
 * (dark housing + emissive lens), a truss grid, and one InstancedMesh of
 * additive volumetric cones. Light k fires when r.local(8, 0, 0.8) * 30 > k
 * (hard step, 60 ms overshoot); all on + a pulse over r.local(8, 0.8, 1).
 * Visible from shot 07 local 0.95 through 09, and dim/all-on in 12.
 * 4 draw calls + 1 point light (the flood).
 */
export function LightRig() {
  const group = useRef<THREE.Group>(null)
  const flood = useRef<THREE.PointLight>(null)
  const lens = useRef<THREE.InstancedMesh>(null)
  const cone = useRef<THREE.InstancedMesh>(null)
  const firedAt = useMemo(() => new Float32Array(COUNT).fill(-1), [])
  const time = useRef(0)

  /* fixture positions, row-major from the front (+z) */
  const positions = useMemo(() => {
    const out: THREE.Vector3[] = []
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) out.push(new THREE.Vector3((c - (cols - 1) / 2) * spacing, RIG_Y, ((rows - 1) / 2 - r) * spacing))
    return out
  }, [])

  const housingGeom = useMemo(() => new THREE.CylinderGeometry(0.2, 0.22, 0.3, 14, 1), [])
  const housingMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#15161c', metalness: 0.75, roughness: 0.45 }), [])
  const lensGeom = useMemo(() => {
    const g = new THREE.CircleGeometry(0.165, 20)
    g.setAttribute('aIntensity', new THREE.InstancedBufferAttribute(new Float32Array(COUNT), 1))
    return g
  }, [])
  const lensMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: instVert,
        fragmentShader: lensFrag,
        uniforms: { uColor: { value: new THREE.Color('#fff4e0') } },
      }),
    [],
  )
  const coneGeom = useMemo(() => {
    const g = new THREE.ConeGeometry(CONE_R, CONE_H, 28, 1, true)
    g.setAttribute('aIntensity', new THREE.InstancedBufferAttribute(new Float32Array(COUNT), 1))
    return g
  }, [])
  const coneMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: instVert,
        fragmentShader: coneFrag,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: new THREE.Color('#fff1d6') }, uGain: { value: 0.065 }, uTime: { value: 0 } },
      }),
    [],
  )
  /* truss: longitudinal + lateral bars at y 14.32, four drop cables */
  const trussGeom = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])
  const trussMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1a1b22', metalness: 0.8, roughness: 0.4 }), [])
  const trussMatrices = useMemo(() => {
    const out: THREE.Matrix4[] = []
    const w = (cols - 1) * spacing + 0.8
    const d = (rows - 1) * spacing + 0.8
    const y = RIG_Y + 0.32
    const q = new THREE.Quaternion()
    for (let c = 0; c < cols; c++) out.push(new THREE.Matrix4().compose(new THREE.Vector3((c - (cols - 1) / 2) * spacing, y, 0), q, new THREE.Vector3(0.09, 0.09, d)))
    for (let r = 0; r < rows; r++) out.push(new THREE.Matrix4().compose(new THREE.Vector3(0, y, ((rows - 1) / 2 - r) * spacing), q, new THREE.Vector3(w, 0.09, 0.09)))
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]])
      out.push(new THREE.Matrix4().compose(new THREE.Vector3((sx * w) / 2, y + 9, (sz * d) / 2), q, new THREE.Vector3(0.035, 18, 0.035)))
    return out
  }, [])
  const TRUSS_N = cols + rows + 4

  const setMatrices = (el: THREE.InstancedMesh | null, yOff: number, rotX: number, scale = 1) => {
    if (!el) return
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(rotX, 0, 0))
    const s = new THREE.Vector3(scale, scale, scale)
    positions.forEach((p, i) => el.setMatrixAt(i, m.compose(new THREE.Vector3(p.x, p.y + yOff, p.z), q, s)))
    el.instanceMatrix.needsUpdate = true
  }

  useFrame((_, dt) => {
    const r = readScene()
    const inRig = (r.shot === 6 && r.shotProgress >= 0.95) || r.shot === 7 || r.shot === 8
    const inFinale = r.shot === 11
    const show = inRig || inFinale
    if (group.current) group.current.visible = show
    if (!show) {
      if (flood.current) flood.current.intensity = 0
      return
    }
    const step = Math.min(dt, 0.05)
    if (!r.reduced) time.current += step
    const now = time.current
    const p = r.local(8, 0, 0.8)
    const q = r.local(8, 0.8, 1)
    const pulse = 1 + 0.9 * Math.sin(Math.PI * q)
    const lensArr = (lensGeom.getAttribute('aIntensity') as THREE.InstancedBufferAttribute).array as Float32Array
    const coneArr = (coneGeom.getAttribute('aIntensity') as THREE.InstancedBufferAttribute).array as Float32Array
    let lit = 0
    for (let k = 0; k < COUNT; k++) {
      let I = 0
      if (inFinale) I = 0.35
      else {
        const on = p * 30 > k
        if (on && firedAt[k] < 0) firedAt[k] = now
        if (!on) firedAt[k] = -1
        if (on) {
          const age = now - firedAt[k]
          const over = r.reduced ? 0 : Math.max(0, 1 - age / OVERSHOOT_S) * 1.4
          I = (1 + over) * pulse
          lit++
        }
      }
      lensArr[k] = I
      coneArr[k] = I
    }
    lensGeom.getAttribute('aIntensity').needsUpdate = true
    coneGeom.getAttribute('aIntensity').needsUpdate = true
    coneMat.uniforms.uTime.value = now
    coneMat.uniforms.uGain.value = r.lowPower ? 0.05 : 0.065
    if (flood.current) flood.current.intensity = inFinale ? 90 : 300 * (lit / COUNT) * pulse
  })

  return (
    <group ref={group} visible={false}>
      <instancedMesh ref={(el) => setMatrices(el, 0.05, 0)} args={[housingGeom, housingMat, COUNT]} />
      <instancedMesh
        ref={(el) => {
          lens.current = el
          setMatrices(el, -0.11, Math.PI / 2)
        }}
        args={[lensGeom, lensMat, COUNT]}
      />
      <instancedMesh
        ref={(el) => {
          cone.current = el
          setMatrices(el, -0.12 - CONE_H / 2, 0)
        }}
        args={[coneGeom, coneMat, COUNT]}
        frustumCulled={false}
        renderOrder={2}
      />
      <instancedMesh
        ref={(el) => {
          if (!el) return
          trussMatrices.forEach((m, i) => el.setMatrixAt(i, m))
          el.instanceMatrix.needsUpdate = true
        }}
        args={[trussGeom, trussMat, TRUSS_N]}
      />
      <pointLight ref={flood} color="#fff1d6" intensity={0} distance={70} decay={2} position={[0, RIG_Y - 2.5, 0]} />
    </group>
  )
}
