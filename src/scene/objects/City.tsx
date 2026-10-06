import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { readScene } from '../useSceneUniforms'
import { useSettings } from '../../store/useSettings'
import { WORLD } from '../world'
import { hash } from '../../lib/math'
import facadeVert from '../shaders/morph-facade.vert'
import facadeFrag from '../shaders/morph-facade.frag'

/**
 * The background city block: ~400 instanced boxes on a jittered grid between
 * radius 9 m and WORLD.cityExtent, 4–28 m tall with a few towers to ~44 m.
 * The street |x| < 4 (SHOT 05 walks it) and the band z < −32 (the data wall)
 * stay clear. Shares the window facade with Towers at lower density and a
 * darker base so the eight hero towers pop.
 *
 * Rises with r.local(2, 0.5, 1.0), staggered per block, and stays for the
 * rest of the film. Hidden before it starts rising. 1 draw call.
 */

const PITCH = 6.2
const STREET_HALF = 4
const WALL_Z = -32
const INNER = 9

interface Block {
  x: number
  z: number
  w: number
  d: number
  h: number
  /** 0..1 stagger of the rise */
  delay: number
}

export const cityBlocks = (): Block[] => {
  const out: Block[] = []
  const n = Math.ceil(WORLD.cityExtent / PITCH)
  let id = 0
  for (let gx = -n; gx <= n; gx++) {
    for (let gz = -n; gz <= n; gz++) {
      id++
      const x = gx * PITCH + (hash(id * 5 + 1) - 0.5) * 3.0
      const z = gz * PITCH + (hash(id * 5 + 2) - 0.5) * 3.0
      const w = 2.6 + hash(id * 5 + 3) * 3.2
      const d = 2.6 + hash(id * 5 + 4) * 3.2
      const r = Math.hypot(x, z)
      if (r < INNER + Math.max(w, d) / 2 || r > WORLD.cityExtent) continue
      if (Math.abs(x) < STREET_HALF + w / 2) continue
      if (z - d / 2 < WALL_Z) continue
      if (hash(id * 5 + 5) < 0.12) continue
      const t = hash(id * 9 + 7)
      let h = 4 + 24 * t * t
      if (hash(id * 9 + 8) < 0.06) h = 28 + hash(id * 9 + 9) * 16
      out.push({ x, z, w, d, h, delay: hash(id * 9 + 10) })
    }
  }
  return out
}

export function City() {
  const lowPower = useSettings((s) => s.lowPower)
  const mesh = useRef<THREE.InstancedMesh>(null)
  const lastRise = useRef(-1)
  const frozen = useRef(false)

  const { geo, mat, blocks } = useMemo(() => {
    const blocks = cityBlocks()
    const geo = new THREE.BoxGeometry(1, 1, 1)
    geo.translate(0, 0.5, 0)
    const seeds = new Float32Array(blocks.length)
    for (let i = 0; i < blocks.length; i++) seeds[i] = hash(i * 3 + 2) * 10
    geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1))
    const mat = new THREE.ShaderMaterial({
      vertexShader: facadeVert,
      fragmentShader: facadeFrag,
      defines: lowPower ? { LOW_POWER: 1 } : {},
      fog: true,
      uniforms: {
        ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),
        // unit box scaled per instance: the band logic reads instance scale y
        uHeight: { value: 1 },
        uConcrete: { value: new THREE.Color('#0d0d12') },
        uLit: { value: 0 },
        uBands: { value: 0 },
        uTime: { value: 0 },
        uGain: { value: 0.75 },
      },
    })
    return { geo, mat, blocks }
  }, [lowPower])

  const m = useMemo(() => new THREE.Matrix4(), [])
  const q = useMemo(() => new THREE.Quaternion(), [])
  const p = useMemo(() => new THREE.Vector3(), [])
  const s = useMemo(() => new THREE.Vector3(), [])

  useFrame((state) => {
    const im = mesh.current
    if (!im) return
    const r = readScene()
    const rise = r.reduced && r.shot === 2 ? 0.5 : r.local(2, 0.5, 1.0)
    const show = rise > 0
    im.visible = show
    if (!show) return
    if (r.reduced) {
      if (!frozen.current) {
        mat.uniforms.uTime.value = 1000
        frozen.current = true
      }
    } else {
      mat.uniforms.uTime.value = state.clock.elapsedTime
      frozen.current = false
    }
    // sparse scatter that keeps growing a little as the film goes on
    mat.uniforms.uLit.value = 0.22 * r.local(2, 0.55, 1.0) + 0.1 * r.local(3) + 0.06 * r.local(4)
    if (rise !== lastRise.current) {
      lastRise.current = rise
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i]
        const t = Math.min(1, Math.max(0, (rise - b.delay * 0.45) / 0.55))
        const k = 1 - Math.pow(1 - t, 3)
        p.set(b.x, 0, b.z)
        s.set(b.w, Math.max(0.001, b.h * k), b.d)
        im.setMatrixAt(i, m.compose(p, q, s))
      }
      im.instanceMatrix.needsUpdate = true
    }
  })

  return <instancedMesh ref={mesh} args={[geo, mat, blocks.length]} frustumCulled={false} />
}
