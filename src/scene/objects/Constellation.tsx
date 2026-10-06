import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { readScene } from '../useSceneUniforms'
import { WORLD } from '../world'
import { hash } from '../../lib/math'
import vert from '../shaders/morph-constellation.vert'
import frag from '../shaders/morph-constellation.frag'

/**
 * Signature moment 10 — SHOT 12 (index 11). A backpack-shaped constellation
 * of ~1,500 gold points at WORLD.constellation.center, WORLD.constellation.size
 * tall. ~200 bright "stars" sit on the silhouette (the rounded body's edges
 * and rims, the top flap, the front pocket, two strap arcs) and are chained
 * by ~60 thin additive gold lines; the rest is faint dust on the surfaces.
 * The whole thing tilts toward the crane camera and sways gently (frozen
 * under r.reduced). Fades in with r.local(11, 0.1, 0.5); hidden before
 * SHOT 12. Drawn without depth test so the towers never cut it. 2 draw calls.
 */

const COUNT = 1500
const GOLD = new THREE.Color('#D2A64B')
const BONE = new THREE.Color('#F2EEE6')

/* unit-space silhouette: body spans y −0.5..0.5, x ±0.33, z ±0.19 */
const halfW = (y: number) => 0.33 * (1 - 0.22 * (y + 0.5))
const halfD = (y: number) => 0.19 * (1 - 0.3 * (y + 0.5))
const SE = 2 / 3.2
/* superellipse cross-section at height y, angle th */
function rim(y: number, th: number, out: THREE.Vector3) {
  const cs = Math.cos(th)
  const sn = Math.sin(th)
  out.set(halfW(y) * Math.sign(cs) * Math.pow(Math.abs(cs), SE), y, halfD(y) * Math.sign(sn) * Math.pow(Math.abs(sn), SE))
}

/** chains of silhouette stars; consecutive stars in a chain are joined by a line */
function buildStars(): { stars: THREE.Vector3[]; links: [number, number][] } {
  const stars: THREE.Vector3[] = []
  const links: [number, number][] = []
  const chain = (pts: THREE.Vector3[], closed = false) => {
    const start = stars.length
    for (const p of pts) stars.push(p)
    for (let i = 1; i < pts.length; i++) links.push([start + i - 1, start + i])
    if (closed && pts.length > 2) links.push([start + pts.length - 1, start])
  }
  const v = () => new THREE.Vector3()
  // four rounded vertical edges of the body
  for (const th of [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75]) {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 7; i++) {
      const p = v()
      rim(-0.5 + i / 7, th, p)
      pts.push(p)
    }
    chain(pts)
  }
  // top and bottom rims
  for (const y of [0.5, -0.5]) {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i < 10; i++) {
      const p = v()
      rim(y, (i / 10) * Math.PI * 2 + Math.PI / 10, p)
      pts.push(p)
    }
    chain(pts, true)
  }
  // flap: a curved lip over the top front
  {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 6; i++) {
      const u = i / 6
      const x = (u * 2 - 1) * 0.29
      pts.push(v().set(x, 0.24 + (1 - Math.abs(u * 2 - 1)) * 0.02, 0.2 + (1 - (u * 2 - 1) ** 2) * 0.03))
    }
    chain(pts)
    chain([v().set(-0.29, 0.5, 0.17), v().set(-0.29, 0.24, 0.2)])
    chain([v().set(0.29, 0.5, 0.17), v().set(0.29, 0.24, 0.2)])
  }
  // front pocket outline
  {
    const z = 0.21
    chain([v().set(-0.21, -0.42, z), v().set(0.21, -0.42, z), v().set(0.21, -0.12, z), v().set(-0.21, -0.12, z)], true)
  }
  // two strap arcs down the back
  for (const side of [-1, 1]) {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 6; i++) {
      const t = i / 6
      pts.push(v().set(side * (0.12 + 0.12 * Math.sin(t * Math.PI * 0.9)), 0.42 - t * 0.86, -0.19 - 0.09 * Math.sin(t * Math.PI)))
    }
    chain(pts)
  }
  // a little hang loop on top
  chain([v().set(-0.05, 0.5, -0.05), v().set(0, 0.58, -0.05), v().set(0.05, 0.5, -0.05)])
  return { stars, links }
}

/** faint dust on the surfaces between the stars */
function sampleDust(i: number, out: THREE.Vector3) {
  const a = hash(i * 11 + 1)
  const b = hash(i * 11 + 2)
  const part = hash(i * 11 + 4)
  if (part < 0.74) {
    const y = -0.5 + a
    rim(y, b * Math.PI * 2, out)
    if (out.z > 0) out.z += 0.04 * Math.max(0, 1 - Math.abs(y + 0.15) * 2.5)
  } else if (part < 0.86) {
    const u = a * 2 - 1
    out.set(u * 0.29 * (1 - 0.1 * b), 0.5 - b * 0.26, 0.17 + b * 0.03 + (1 - u * u) * 0.03)
  } else {
    const side = part < 0.93 ? -1 : 1
    const t = a
    const w = (b - 0.5) * 0.05
    out.set(side * (0.12 + 0.12 * Math.sin(t * Math.PI * 0.9)) + w, 0.42 - t * 0.86, -0.19 - 0.09 * Math.sin(t * Math.PI) - Math.abs(w) * 0.3)
  }
}

export function Constellation() {
  const group = useRef<THREE.Group>(null)
  const frozen = useRef(false)

  const { geo, mat, lineGeo, lineMat, linkCount } = useMemo(() => {
    const size = WORLD.constellation.size
    const { stars, links } = buildStars()
    const pos = new Float32Array(COUNT * 3)
    const seed = new Float32Array(COUNT)
    const v = new THREE.Vector3()
    for (let i = 0; i < COUNT; i++) {
      if (i < stars.length) v.copy(stars[i])
      else sampleDust(i, v)
      v.multiplyScalar(size)
      pos[i * 3] = v.x
      pos[i * 3 + 1] = v.y
      pos[i * 3 + 2] = v.z
      // stars: seed ≥ 0.86 is drawn hotter and bigger in the shader; dust stays below
      seed[i] = i < stars.length ? 0.86 + 0.14 * hash(i * 13 + 5) : 0.86 * hash(i * 13 + 5)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), size)
    const mat = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uFade: { value: 0 },
        uPixelScale: { value: 1000 },
        uGold: { value: GOLD.clone() },
        uBone: { value: BONE.clone() },
        uIntensity: { value: 1.2 },
      },
    })

    const lp = new Float32Array(links.length * 6)
    links.forEach(([a, b], i) => {
      lp.set([stars[a].x * size, stars[a].y * size, stars[a].z * size, stars[b].x * size, stars[b].y * size, stars[b].z * size], i * 6)
    })
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(lp, 3))
    lineGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), size)
    const lineMat = new THREE.LineBasicMaterial({
      color: GOLD.clone(),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    })
    return { geo, mat, lineGeo, lineMat, linkCount: links.length }
  }, [])

  useFrame((state) => {
    const g = group.current
    if (!g) return
    const r = readScene()
    const fade = r.local(11, 0.1, 0.5)
    const show = fade > 0
    g.visible = show
    if (!show) return
    const time = r.reduced ? 1000 : state.clock.elapsedTime
    if (!r.reduced || !frozen.current) {
      mat.uniforms.uTime.value = time
      // face the crane camera (above and in front) and sway instead of spinning away
      g.rotation.set(-0.5, Math.sin(time * 0.22) * 0.4, 0)
      frozen.current = r.reduced
    }
    mat.uniforms.uFade.value = fade
    lineMat.opacity = 0.6 * fade * fade
    const cam = state.camera as THREE.PerspectiveCamera
    const fov = (cam.fov ?? 45) * (Math.PI / 180)
    mat.uniforms.uPixelScale.value = (state.size.height * state.viewport.dpr) / (2 * Math.tan(fov / 2))
  })

  const [cx, cy, cz] = WORLD.constellation.center
  return (
    <group ref={group} position={[cx, cy, cz]} userData={{ links: linkCount }}>
      <points args={[geo, mat]} frustumCulled={false} renderOrder={20} />
      <lineSegments args={[lineGeo, lineMat]} frustumCulled={false} renderOrder={19} />
    </group>
  )
}
