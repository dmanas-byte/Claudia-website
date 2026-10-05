import { WORLD } from '../world'

/** Arena floor: near-black, slightly glossy so the spots read on it. */
export function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={0} receiveShadow>
      <planeGeometry args={[WORLD.cityExtent * 3, WORLD.cityExtent * 3]} />
      <meshStandardMaterial color="#0a0a0e" roughness={0.55} metalness={0.25} />
    </mesh>
  )
}
