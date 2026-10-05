import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { readScene } from '../useSceneUniforms'

/**
 * PLACEHOLDER — the low-poly backpack. Replaced by the hero build with a
 * proper low-poly mesh and a zipper morph. Keep the export name and position.
 */
export function Backpack() {
  const g = useRef<THREE.Group>(null)
  useFrame(() => {
    if (!g.current) return
    const r = readScene()
    // fades out as it pours into the skyline (shot 03) and comes back as a constellation later
    const gone = r.local(2, 0.35, 0.9)
    g.current.scale.setScalar(1 - gone * 0.999)
    g.current.visible = gone < 1
  })
  return (
    <group ref={g} position={[0, 0, 0]}>
      <mesh position={[0, 0.27, 0]} castShadow>
        <boxGeometry args={[0.36, 0.54, 0.22]} />
        <meshStandardMaterial color="#1e1f26" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.3, 0.14]}>
        <boxGeometry args={[0.26, 0.3, 0.08]} />
        <meshStandardMaterial color="#232430" roughness={0.8} />
      </mesh>
    </group>
  )
}
