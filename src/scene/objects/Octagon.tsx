import { postPositions, WORLD } from '../world'

/**
 * PLACEHOLDER — the octagon fence posts and a plain fence. The hero build
 * replaces this with a chain-link shader. Keep export name and post layout.
 */
export function Octagon() {
  const posts = postPositions()
  return (
    <group>
      {posts.map((p, i) => (
        <mesh key={i} position={[p[0], WORLD.fenceHeight / 2, p[2]]}>
          <cylinderGeometry args={[0.06, 0.06, WORLD.fenceHeight, 8]} />
          <meshStandardMaterial color="#2a2b33" metalness={0.8} roughness={0.35} />
        </mesh>
      ))}
    </group>
  )
}
