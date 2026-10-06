import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { useSettings } from '../../store/useSettings'
import { readScene } from '../useSceneUniforms'
import glowVert from '../shaders/hero-glow.vert'
import glowFrag from '../shaders/hero-glow.frag'

/** world point where the gold particles pour out (the open zipper) */
export const BACKPACK_MOUTH = new THREE.Vector3(0, 0.52, 0)

const CANVAS = '#1e1f26'
const CANVAS_LIGHT = '#272833'
const GOLD = '#D2A64B'

const BODY = { w: 0.36, h: 0.46, d: 0.22 }
const TOP_TAPER_X = 0.14
const TOP_TAPER_Z = 0.1
const TOP = { hx: (BODY.w / 2) * (1 - TOP_TAPER_X), hz: (BODY.d / 2) * (1 - TOP_TAPER_Z) }
const HINGE_Z = -TOP.hz
const FLAP_OPEN_ANGLE = 1.2
const TOOTH_SPACING = 0.016

/** tapered, slightly bellied rounded box with its base on y = 0 */
function bodyGeometry() {
  const g = new RoundedBoxGeometry(BODY.w, BODY.h, BODY.d, 3, 0.035)
  const p = g.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i)
    const y = p.getY(i)
    const z = p.getZ(i)
    const ny = (y + BODY.h / 2) / BODY.h
    const belly = 1 + 0.07 * Math.sin(ny * Math.PI)
    p.setX(i, x * (1 - TOP_TAPER_X * ny) * (1 + 0.02 * Math.sin(ny * Math.PI)))
    p.setZ(i, z * (1 - TOP_TAPER_Z * ny) * belly)
    p.setY(i, y + BODY.h / 2)
  }
  g.computeVertexNormals()
  return g
}

function strapsGeometry() {
  const make = (side: number) => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.085, 0.43, -0.09),
      new THREE.Vector3(side * 0.12, 0.34, -0.2),
      new THREE.Vector3(side * 0.125, 0.2, -0.225),
      new THREE.Vector3(side * 0.1, 0.05, -0.12),
    ])
    return new THREE.TubeGeometry(curve, 18, 0.016, 7, false)
  }
  const merged = mergeGeometries([make(-1), make(1)])
  return merged ?? make(1)
}

/** rest positions of the zipper teeth along the top rim: left side → front → right side */
function zipperPath() {
  const pts: { x: number; z: number; t: number }[] = []
  const sideLen = TOP.hz * 2
  const frontLen = TOP.hx * 2
  const total = sideLen * 2 + frontLen
  const n = Math.floor(total / TOOTH_SPACING)
  for (let i = 0; i <= n; i++) {
    const s = (i / n) * total
    let x: number
    let z: number
    if (s < sideLen) {
      x = -TOP.hx
      z = -TOP.hz + s
    } else if (s < sideLen + frontLen) {
      x = -TOP.hx + (s - sideLen)
      z = TOP.hz
    } else {
      x = TOP.hx
      z = TOP.hz - (s - sideLen - frontLen)
    }
    pts.push({ x, z, t: i / n })
  }
  return pts
}

const _o = new THREE.Object3D()

/**
 * The low-poly backpack at the origin, ~0.5 m tall, all geometry built in
 * code: tapered bevelled body, front pocket, two strap tubes, a hinged top
 * flap and a zipper of small gold instanced boxes along the top rim.
 * Zipper morph: uOpen = r.local(2, 0, 0.45) rotates the flap open around its
 * hinge and spreads the teeth (flap-side teeth travel with the flap); a gold
 * glow grows inside the opening. After r.local(2, 0.4, 0.9) the body shrinks
 * and sinks (it poured into the skyline); hidden from 03 local 0.9 onward.
 * 7 draw calls.
 */
export function Backpack() {
  const lowPower = useSettings((s) => s.lowPower)
  const root = useRef<THREE.Group>(null)
  const flap = useRef<THREE.Group>(null)
  const teeth = useRef<THREE.InstancedMesh>(null)
  const lining = useRef<THREE.Mesh>(null)
  const mouth = useRef<THREE.Mesh>(null)

  const { bodyGeo, flapGeo, pocketGeo, strapGeo, toothGeo, liningGeo, mouthGeo, path, canvasMat, canvasLightMat, goldMat, liningMat, mouthMat } = useMemo(() => {
    const flapGeo = new RoundedBoxGeometry(TOP.hx * 2 + 0.03, 0.07, TOP.hz * 2 + 0.02, 2, 0.02)
    // hinge at the flap's back-bottom edge
    flapGeo.translate(0, 0.035, TOP.hz + 0.01)
    const pocketGeo = new RoundedBoxGeometry(0.24, 0.19, 0.07, 2, 0.02)
    const toothGeo = new THREE.BoxGeometry(0.013, 0.011, 0.014)
    const liningGeo = new THREE.BoxGeometry(TOP.hx * 2 - 0.03, 0.016, TOP.hz * 2 - 0.03)
    const mouthGeo = new THREE.PlaneGeometry(1, 1)
    const canvasMat = new THREE.MeshStandardMaterial({ color: CANVAS, roughness: 0.72, metalness: 0.08 })
    const canvasLightMat = new THREE.MeshStandardMaterial({ color: CANVAS_LIGHT, roughness: 0.9, metalness: 0.0 })
    const goldMat = new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.35, metalness: 0.5, emissive: new THREE.Color(GOLD), emissiveIntensity: 0.45 })
    const liningMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(GOLD) })
    const mouthMat = new THREE.ShaderMaterial({
      vertexShader: glowVert,
      fragmentShader: glowFrag,
      uniforms: {
        uColor: { value: new THREE.Color(GOLD) },
        uIntensity: { value: 0 },
        uFalloff: { value: new THREE.Vector2(4.5, 7) },
        uCore: { value: 10 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    })
    return {
      bodyGeo: bodyGeometry(),
      flapGeo,
      pocketGeo,
      strapGeo: strapsGeometry(),
      toothGeo,
      liningGeo,
      mouthGeo,
      path: zipperPath(),
      canvasMat,
      canvasLightMat,
      goldMat,
      liningMat,
      mouthMat,
    }
  }, [])

  const placeTeeth = (open: number) => {
    const m = teeth.current
    if (!m) return
    const ang = -open * FLAP_OPEN_ANGLE
    const sinA = Math.sin(ang)
    const cosA = Math.cos(ang)
    for (let i = 0; i < path.length; i++) {
      const p = path[i]
      const onFlap = i % 2 === 1
      let y = BODY.h + 0.004
      let z = p.z
      if (onFlap) {
        // ride along with the flap: rotate about the hinge (x axis through y = BODY.h, z = HINGE_Z)
        const dz = p.z - HINGE_Z
        y = BODY.h + 0.004 - dz * sinA
        z = HINGE_Z + dz * cosA
      } else {
        // body-side teeth sag outward a little as the zipper parts
        y -= open * 0.006
        z += open * 0.004 * Math.sign(p.z)
      }
      _o.position.set(p.x + (onFlap ? 0 : open * 0.004 * Math.sign(p.x)), y, z)
      _o.rotation.set(onFlap ? ang : 0, 0, 0)
      _o.updateMatrix()
      m.setMatrixAt(i, _o.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  }

  useLayoutEffect(() => {
    placeTeeth(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  const lastOpen = useRef(-1)

  useFrame(() => {
    const r = readScene()
    const g = root.current
    if (!g) return
    const gone = r.local(2, 0.4, 0.9)
    g.visible = gone < 1
    if (!g.visible) return
    const openRaw = r.local(2, 0, 0.45)
    const open = openRaw * openRaw * (3 - 2 * openRaw)
    const shrink = 1 - gone * gone
    g.scale.set(shrink, shrink, shrink)
    g.position.y = -gone * 0.15

    if (flap.current) flap.current.rotation.x = -open * FLAP_OPEN_ANGLE
    if (Math.abs(open - lastOpen.current) > 1e-4) {
      placeTeeth(open)
      lastOpen.current = open
    }
    const glow = open * (1 + r.flash * 0.8)
    if (lining.current) {
      lining.current.visible = open > 0.03
      liningMat.color.setRGB(0.82 * (0.4 + 2.4 * glow), 0.65 * (0.4 + 2.4 * glow), 0.29 * (0.4 + 2.4 * glow))
    }
    if (mouth.current) {
      mouth.current.visible = open > 0.03
      mouthMat.uniforms.uIntensity.value = 1.6 * glow
      const s = 0.5 + 0.9 * open
      mouth.current.scale.set(s * 1.3, s, 1)
    }
  })

  return (
    <group ref={root}>
      <mesh geometry={bodyGeo} material={canvasMat} castShadow={!lowPower} receiveShadow />
      <mesh geometry={pocketGeo} material={canvasLightMat} position={[0, 0.17, 0.14]} castShadow={!lowPower} />
      <mesh geometry={strapGeo} material={canvasLightMat} />
      <group ref={flap} position={[0, BODY.h, HINGE_Z]}>
        <mesh geometry={flapGeo} material={canvasMat} castShadow={!lowPower} />
      </group>
      <instancedMesh ref={teeth} args={[toothGeo, goldMat, path.length]} frustumCulled={false} />
      <mesh ref={lining} geometry={liningGeo} material={liningMat} position={[0, BODY.h + 0.006, 0]} visible={false} />
      <mesh ref={mouth} geometry={mouthGeo} material={mouthMat} position={[0, BODY.h + 0.05, 0.02]} rotation-x={-Math.PI / 2} renderOrder={22} visible={false} />
    </group>
  )
}
