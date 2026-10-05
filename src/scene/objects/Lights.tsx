import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { readScene } from '../useSceneUniforms'

/** Basic rig: two follow-spots on the backpack + a dim fill. */
export function Lights() {
  const a = useRef<THREE.SpotLight>(null)
  const b = useRef<THREE.SpotLight>(null)
  const target = useRef(new THREE.Object3D())
  useFrame(() => {
    const r = readScene()
    const k = 1 + r.flash * 2
    if (a.current) a.current.intensity = 260 * k
    if (b.current) b.current.intensity = 220 * k
  })
  return (
    <>
      <primitive object={target.current} position={[0, 0.3, 0]} />
      <ambientLight intensity={0.06} />
      <spotLight ref={a} position={[-4, 8, 3]} angle={0.28} penumbra={0.6} color="#fff3dc" intensity={260} target={target.current} castShadow />
      <spotLight ref={b} position={[4, 8, 3]} angle={0.28} penumbra={0.6} color="#ffe6b8" intensity={220} target={target.current} />
    </>
  )
}
