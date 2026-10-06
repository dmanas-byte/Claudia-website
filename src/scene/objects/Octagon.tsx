import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { readScene } from '../useSceneUniforms'
import { postPositions, WORLD } from '../world'
import { LAMP_A, LAMP_B, SPOT_TARGET, rangeLevel, spotLevel } from './Spotlights'
import fenceVert from '../shaders/hero-fence.vert'
import fenceFrag from '../shaders/hero-fence.frag'

const GOLD = new THREE.Color('#D2A64B')
const STEEL = '#35363e'
const PAD = '#16171d'
const N = WORLD.postCount
const H = WORLD.fenceHeight
const EDGE = 2 * WORLD.octagonRadius * Math.sin(Math.PI / N)
const _o = new THREE.Object3D()

/** post + top cap + base plate as one geometry so eight posts are one draw call */
function postGeometry() {
  const shaft = new THREE.CylinderGeometry(0.06, 0.06, H, 10)
  shaft.translate(0, H / 2, 0)
  const cap = new THREE.CylinderGeometry(0.09, 0.075, 0.05, 10)
  cap.translate(0, H + 0.025, 0)
  const base = new THREE.CylinderGeometry(0.11, 0.12, 0.03, 10)
  base.translate(0, 0.015, 0)
  return mergeGeometries([shaft, cap, base]) ?? shaft
}

/** midpoint + facing rotation for the edge between post i and post i+1 */
function edgeTransforms() {
  const posts = postPositions()
  return posts.map((p, i) => {
    const q = posts[(i + 1) % N]
    const mid = new THREE.Vector3((p[0] + q[0]) / 2, 0, (p[2] + q[2]) / 2)
    const a = Math.atan2(mid.z, mid.x)
    // plane normal (+z) → outward direction (cos a, 0, sin a)
    const rotY = Math.PI / 2 - a
    return { mid, rotY }
  })
}

/**
 * The chain-link octagon: eight instanced steel posts with caps at
 * postPositions(), eight fence panels with a procedural chain-link shader
 * (diamond lattice, alpha-tested, metallic sheen, a little gold where the
 * spots hit), a padded top rail per edge, and the gold octagon outline on the
 * floor. Posts and rails hide from 03 local 0.35 (the towers replace them);
 * panels thin out and fade over 03 local 0.3→0.6. The outline is barely there
 * in 01, glows as a street plan from 03 local 0.5, and is strong in 08–12.
 * 4 draw calls.
 */
export function Octagon() {
  const posts = useRef<THREE.InstancedMesh>(null)
  const panels = useRef<THREE.InstancedMesh>(null)
  const rails = useRef<THREE.InstancedMesh>(null)
  const outline = useRef<THREE.InstancedMesh>(null)

  const { postGeo, panelGeo, railGeo, outlineGeo, steelMat, padMat, outlineMat, fenceMat, edges, postList } = useMemo(() => {
    const fenceMat = new THREE.ShaderMaterial({
      vertexShader: fenceVert,
      fragmentShader: fenceFrag,
      uniforms: {
        uSize: { value: new THREE.Vector2(EDGE, H) },
        uPeriod: { value: 0.068 },
        uWire: { value: 0.0034 },
        uFade: { value: 0 },
        uBase: { value: new THREE.Color('#4c4d50') },
        uGold: { value: GOLD.clone() },
        uLampA: { value: LAMP_A.clone() },
        uLampB: { value: LAMP_B.clone() },
        uTarget: { value: SPOT_TARGET.clone() },
        uSpill: { value: 1 },
      },
      side: THREE.DoubleSide,
      fog: false,
    })
    return {
      postGeo: postGeometry(),
      panelGeo: new THREE.PlaneGeometry(EDGE, H),
      railGeo: new THREE.BoxGeometry(EDGE, 0.11, 0.12),
      outlineGeo: new THREE.BoxGeometry(EDGE + 0.1, 0.014, 0.07),
      steelMat: new THREE.MeshStandardMaterial({ color: STEEL, metalness: 0.5, roughness: 0.45 }),
      padMat: new THREE.MeshStandardMaterial({ color: PAD, roughness: 0.95, metalness: 0 }),
      outlineMat: new THREE.MeshBasicMaterial({ color: GOLD.clone() }),
      fenceMat,
      edges: edgeTransforms(),
      postList: postPositions(),
    }
  }, [])

  useLayoutEffect(() => {
    const set = (m: THREE.InstancedMesh | null, place: (i: number) => void) => {
      if (!m) return
      for (let i = 0; i < N; i++) {
        _o.position.set(0, 0, 0)
        _o.rotation.set(0, 0, 0)
        _o.scale.set(1, 1, 1)
        place(i)
        _o.updateMatrix()
        m.setMatrixAt(i, _o.matrix)
      }
      m.instanceMatrix.needsUpdate = true
      m.computeBoundingSphere()
    }
    set(posts.current, (i) => {
      _o.position.set(postList[i][0], 0, postList[i][2])
      _o.rotation.y = (i / N) * Math.PI * 2
    })
    set(panels.current, (i) => {
      _o.position.set(edges[i].mid.x, H / 2, edges[i].mid.z)
      _o.rotation.y = edges[i].rotY
    })
    set(rails.current, (i) => {
      _o.position.set(edges[i].mid.x, H + 0.06, edges[i].mid.z)
      _o.rotation.y = edges[i].rotY
    })
    set(outline.current, (i) => {
      _o.position.set(edges[i].mid.x, 0.008, edges[i].mid.z)
      _o.rotation.y = edges[i].rotY
    })
  }, [edges, postList])

  useFrame(() => {
    const r = readScene()
    const sf = r.shotFloat
    const fade = r.local(2, 0.64, 0.8)
    const structure = sf < 2.66
    if (posts.current) posts.current.visible = structure
    if (rails.current) rails.current.visible = structure
    if (panels.current) {
      panels.current.visible = fade < 1
      fenceMat.uniforms.uFade.value = fade
      fenceMat.uniforms.uSpill.value = spotLevel(r) * (1 + r.flash * 1.5)
    }
    if (outline.current) {
      const plan = r.local(2, 0.34, 0.6)
      const strong = rangeLevel(sf, 7, 12.5, 0.25)
      const k = (0.1 + 0.8 * plan + 0.5 * strong) * (1 + r.flash * 0.6)
      outlineMat.color.copy(GOLD).multiplyScalar(k)
    }
  })

  return (
    <group>
      <instancedMesh ref={posts} args={[postGeo, steelMat, N]} castShadow receiveShadow />
      <instancedMesh ref={panels} args={[panelGeo, fenceMat, N]} />
      <instancedMesh ref={rails} args={[railGeo, padMat, N]} />
      <instancedMesh ref={outline} args={[outlineGeo, outlineMat, N]} />
    </group>
  )
}
