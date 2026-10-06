/**
 * SHOT 05 / Round 5 — Airbnb Portfolio.
 * A wireframe house (EdgesGeometry of a merged box + prism roof, gold lines)
 * with four small emissive window planes that warm from dark → bone → gold as
 * presence passes 0.6, plus a tiny warm point light inside. Particles sample
 * the wire edges. Draw calls: 3.
 */
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { useCondense, solidMaterial, GOLD, BONE } from './condense'
import solidVert from '../../shaders/rounds-solid.vert'
import solidFrag from '../../shaders/rounds-solid.frag'
import lineVert from '../../shaders/rounds-line.vert'
import lineFrag from '../../shaders/rounds-line.frag'

const W = 0.6
const H = 0.42
const D = 0.5
const ROOF = 0.28
const WIN = [
  [-0.17, 0.06],
  [0.17, 0.06],
  [-0.17, -0.1],
  [0.17, -0.1],
] as const
const DARK = new THREE.Color('#1a1712')

/** triangular prism roof: ridge along x */
function prism(w: number, d: number, h: number, y0: number) {
  const hw = w / 2
  const hd = d / 2
  const v = [
    // front triangle (+z)
    -hw, y0, hd, hw, y0, hd, 0, y0 + h, hd,
    // back triangle (−z)
    hw, y0, -hd, -hw, y0, -hd, 0, y0 + h, -hd,
    // left slope
    -hw, y0, hd, 0, y0 + h, hd, 0, y0 + h, -hd,
    -hw, y0, hd, 0, y0 + h, -hd, -hw, y0, -hd,
    // right slope
    hw, y0, hd, hw, y0, -hd, 0, y0 + h, -hd,
    hw, y0, hd, 0, y0 + h, -hd, 0, y0 + h, hd,
  ]
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3))
  g.computeVertexNormals()
  return g
}

export function Round5() {
  const built = useMemo(() => {
    const box = new THREE.BoxGeometry(W, H, D)
    box.deleteAttribute('uv') // the prism carries no uv; merged geometries must share attributes
    const roof = prism(W + 0.06, D + 0.06, ROOF, H / 2)
    const body = mergeGeometries([box.toNonIndexed(), roof])!
    const edges = new THREE.EdgesGeometry(body, 10)
    // door on the front face + a chimney, as extra segments
    const extra: number[] = []
    const seg = (a: number[], b: number[]) => extra.push(...a, ...b)
    const z = D / 2 + 0.001
    seg([-0.05, -H / 2, z], [-0.05, -H / 2 + 0.17, z])
    seg([0.05, -H / 2, z], [0.05, -H / 2 + 0.17, z])
    seg([-0.05, -H / 2 + 0.17, z], [0.05, -H / 2 + 0.17, z])
    const cx = 0.16
    const cz = -0.1
    const cy0 = H / 2 + ROOF * 0.45
    const cy1 = H / 2 + ROOF + 0.06
    for (const [dx, dz] of [
      [-0.03, -0.03],
      [0.03, -0.03],
      [0.03, 0.03],
      [-0.03, 0.03],
    ]) {
      seg([cx + dx, cy0, cz + dz], [cx + dx, cy1, cz + dz])
    }
    seg([cx - 0.03, cy1, cz - 0.03], [cx + 0.03, cy1, cz - 0.03])
    seg([cx + 0.03, cy1, cz - 0.03], [cx + 0.03, cy1, cz + 0.03])
    seg([cx + 0.03, cy1, cz + 0.03], [cx - 0.03, cy1, cz + 0.03])
    seg([cx - 0.03, cy1, cz + 0.03], [cx - 0.03, cy1, cz - 0.03])
    const extraGeo = new THREE.BufferGeometry()
    extraGeo.setAttribute('position', new THREE.Float32BufferAttribute(extra, 3))
    const lines = mergeGeometries([edges, extraGeo])!
    const win = new THREE.PlaneGeometry(0.09, 0.1)
    const mats = WIN.map(([x, y]) => new THREE.Matrix4().makeTranslation(x, y, D / 2 + 0.002))
    return { lines, win, mats }
  }, [])
  const c = useCondense(5, built.lines, { radius: 1.05, edges: true, turn: 'spin', faceYaw: 0.5, size: 0.015 })
  const lineMat = useMemo(
    () =>
      solidMaterial(lineVert, lineFrag, c.solidUniforms, {
        uColor: { value: GOLD.clone() },
        uIntensity: { value: 1.7 },
        uGlowColor: { value: GOLD.clone() },
        uGlowLevel: { value: -1 },
        uGlint: { value: 5 },
        uGlintAxis: { value: new THREE.Vector3(1 / (W + 0.06), 0, 0) },
        uGlintWidth: { value: 0.08 },
        uSway: { value: 0 },
        uPivot: { value: new THREE.Vector3() },
      }),
    [c.solidUniforms],
  )
  const winMat = useMemo(
    () =>
      solidMaterial(
        solidVert,
        solidFrag,
        c.solidUniforms,
        {
          uColor: { value: DARK.clone() },
          uEmissive: { value: DARK.clone() },
          uEmissiveStrength: { value: 0 },
          uRim: { value: GOLD.clone() },
          uRimStrength: { value: 0.1 },
          uMetal: { value: 0 },
        },
        { side: THREE.DoubleSide },
      ),
    [c.solidUniforms],
  )
  const windows = useMemo(() => {
    const im = new THREE.InstancedMesh(built.win, winMat, WIN.length)
    built.mats.forEach((m, k) => im.setMatrixAt(k, m))
    im.instanceMatrix.needsUpdate = true
    im.frustumCulled = false
    return im
  }, [built, winMat])
  const light = useRef<THREE.PointLight>(null)

  useFrame((state, delta) => {
    const f = c.update(state, delta)
    if (!f.visible) {
      if (light.current) light.current.intensity = 0
      return
    }
    // windows warm up: dark → bone (0.6..0.75) → gold (0.75..0.95)
    const warm = Math.min(1, Math.max(0, (f.presence - 0.6) / 0.15))
    const gold = Math.min(1, Math.max(0, (f.presence - 0.75) / 0.2))
    const e = winMat.uniforms.uEmissive.value as THREE.Color
    e.copy(DARK).lerp(BONE, warm).lerp(GOLD, gold * 0.8)
    const flicker = f.r.reduced ? 1 : 0.94 + 0.06 * Math.sin(f.time * 9.0) * Math.sin(f.time * 3.7)
    winMat.uniforms.uEmissiveStrength.value = (warm * 1.1 + gold * 0.9) * flicker
    if (light.current) light.current.intensity = (warm * 0.8 + gold * 1.2) * flicker
    // the gold glint rides the ridge every ~3 s
    const t = f.time % 3.2
    lineMat.uniforms.uGlint.value = t < 0.7 ? -0.4 + (t / 0.7) * 1.8 : 5
  })

  return (
    <group ref={c.group} position={c.position}>
      <points ref={c.points} geometry={c.particleGeometry} material={c.particleMaterial} frustumCulled={false} />
      <lineSegments geometry={built.lines} material={lineMat} />
      <primitive object={windows} />
      <pointLight ref={light} color="#f2c98a" intensity={0} distance={2.4} decay={2} position={[0, 0.05, 0]} />
    </group>
  )
}
