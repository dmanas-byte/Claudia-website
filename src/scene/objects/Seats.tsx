import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { readScene } from '../useSceneUniforms'
import { WORLD } from '../world'
import vert from '../shaders/term-seats.vert'
import frag from '../shaders/term-seats.frag'

const SEATS = 20740 /* ≈20 000 after the eight aisles are cut */
const SEATS_LOW = 6000
const TAU = Math.PI * 2

/** radius of a regular octagon (apothem `r`) in direction `a` */
const octRadius = (r: number, a: number) => {
  const s = ((a - WORLD.postAngleOffset + Math.PI / 8) % (Math.PI / 4) + Math.PI / 4) % (Math.PI / 4)
  return r / Math.cos(s - Math.PI / 8)
}

/* mulberry32: deterministic layout */
const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

/**
 * SHOT 08 — The Corner. 20 000 point sprites (6 000 on lowPower, as a
 * drawRange prefix of a shuffled layout) in a rising bowl of concentric
 * octagonal rings between WORLD.seats.innerRadius and outerRadius, each a
 * small warm light pulsing in a slow wave around the bowl; plus the dark
 * bowl structure: one InstancedMesh of 8 wedge slabs. Visible from shot 07
 * local 0.9 through 08, dim in 12. 2 draw calls.
 */
export function Seats() {
  const { innerRadius, outerRadius, rows } = WORLD.seats
  const group = useRef<THREE.Group>(null)
  const points = useRef<THREE.Points>(null)
  const time = useRef(0)

  const geom = useMemo(() => {
    const rand = rng(1337)
    const pos: number[] = []
    const seed: number[] = []
    const ang: number[] = []
    /* perimeter-weighted row counts */
    const radii = Array.from({ length: rows }, (_, i) => innerRadius + ((outerRadius - innerRadius) * i) / (rows - 1))
    const perim = radii.reduce((a, r) => a + r, 0)
    for (let i = 0; i < rows; i++) {
      const r = radii[i]
      const n = Math.round((SEATS * r) / perim)
      const y = 1 + 13 * Math.pow(i / (rows - 1), 1.12)
      for (let j = 0; j < n; j++) {
        const a = (j + 0.5) / n * TAU
        /* eight radial aisles, 1.6° wide, between the fence posts */
        const aisle = ((a - WORLD.postAngleOffset) % (Math.PI / 4) + Math.PI / 4) % (Math.PI / 4)
        if (Math.abs(aisle - Math.PI / 8) < 0.014) continue
        const rr = octRadius(r + (rand() - 0.5) * 0.5, a)
        pos.push(Math.cos(a) * rr, y + (rand() - 0.5) * 0.25, Math.sin(a) * rr)
        seed.push(rand())
        ang.push(a)
      }
    }
    /* shuffle so the first 6k is a uniform sample of the bowl */
    const n = seed.length
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1))
      for (let k = 0; k < 3; k++) {
        const t = pos[i * 3 + k]
        pos[i * 3 + k] = pos[j * 3 + k]
        pos[j * 3 + k] = t
      }
      ;[seed[i], seed[j]] = [seed[j], seed[i]]
      ;[ang[i], ang[j]] = [ang[j], ang[i]]
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new THREE.Float32BufferAttribute(seed, 1))
    g.setAttribute('aAngle', new THREE.Float32BufferAttribute(ang, 1))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 7.5, 0), outerRadius + 8)
    return g
  }, [innerRadius, outerRadius, rows])

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uScale: { value: 450 },
          uIntensity: { value: 0 },
          uSizeM: { value: 0.42 },
        },
      }),
    [],
  )

  /* bowl: one wedge slab (sloped prism) instanced 8 times */
  const slabGeom = useMemo(() => {
    const ri = innerRadius - 0.6
    const ro = outerRadius + 0.8
    const yi = 0.55
    const yo = 13.7
    const half = Math.PI / 8 - 0.012 /* leave a sliver for the aisles */
    const ci = ri / Math.cos(Math.PI / 8)
    const co = ro / Math.cos(Math.PI / 8)
    const P = (r: number, a: number, y: number) => [Math.cos(a) * r, y, Math.sin(a) * r]
    const a0 = -half
    const a1 = half
    const tl = P(ci, a0, yi), tr = P(ci, a1, yi), TL = P(co, a0, yo), TR = P(co, a1, yo)
    const bl = P(ci, a0, 0), br = P(ci, a1, 0), BL = P(co, a0, 0), BR = P(co, a1, 0)
    const quads: number[][][] = [
      [tl, tr, TR, TL], // top (sloped)
      [bl, BL, BR, br], // bottom
      [tl, TL, BL, bl], // side a0
      [tr, br, BR, TR], // side a1
      [tl, bl, br, tr], // inner face
      [TL, TR, BR, BL], // outer face
    ]
    const v: number[] = []
    for (const [a, b, c, d] of quads) v.push(...a, ...b, ...c, ...a, ...c, ...d)
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3))
    g.computeVertexNormals()
    return g
  }, [innerRadius, outerRadius])
  const slabMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0c0c11', roughness: 0.92, metalness: 0.05 }), [])
  const slabMatrices = useMemo(() => {
    const out: THREE.Matrix4[] = []
    for (let i = 0; i < 8; i++) {
      const a = WORLD.postAngleOffset + (i / 8) * TAU
      out.push(new THREE.Matrix4().makeRotationY(-a))
    }
    return out
  }, [])

  useFrame(({ camera, gl }) => {
    const r = readScene()
    const inCorner = (r.shot === 6 && r.shotProgress >= 0.9) || r.shot === 7
    const inFinale = r.shot === 11
    const show = inCorner || inFinale
    if (group.current) group.current.visible = show
    if (!show) return
    if (!r.reduced) time.current = performance.now() * 0.001
    const fade = inFinale ? 0.3 : r.local(6, 0.9, 1)
    const cam = camera as THREE.PerspectiveCamera
    const h = gl.domElement.height
    mat.uniforms.uScale.value = h / (2 * Math.tan((cam.fov * Math.PI) / 360))
    mat.uniforms.uTime.value = time.current
    mat.uniforms.uIntensity.value = fade
    geom.setDrawRange(0, Math.min(geom.attributes.position.count, r.lowPower ? SEATS_LOW : SEATS))
  })

  return (
    <group ref={group} visible={false}>
      <points ref={points} geometry={geom} material={mat} frustumCulled={false} />
      <instancedMesh
        ref={(el) => {
          if (!el) return
          slabMatrices.forEach((m, i) => el.setMatrixAt(i, m))
          el.instanceMatrix.needsUpdate = true
        }}
        args={[slabGeom, slabMat, 8]}
        receiveShadow
      />
      <pointLight color="#ffd9a8" intensity={60} distance={45} decay={2} position={[0, 9, 0]} />
    </group>
  )
}
