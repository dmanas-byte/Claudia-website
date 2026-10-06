/**
 * SHOT 05 / Round 1 — Portfolio Playbook.
 * A dark glass slab (0.7 × 0.45 × 0.04) with a fresnel rim and a scrolling
 * ticker shader on its face: abstract segment glyphs, green/red ticks and
 * bars (never readable data) crossed by a diagonal "sample" hatch band.
 * Condenses from gold particles via useCondense(1). Draw calls: 2.
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useCondense, solidMaterial } from './condense'
import solidVert from '../../shaders/rounds-solid.vert'
import slabFrag from '../../shaders/rounds-slab.frag'

const W = 0.7
const H = 0.45
const D = 0.04

export function Round1() {
  const geometry = useMemo(() => new THREE.BoxGeometry(W, H, D), [])
  const c = useCondense(1, geometry, { radius: 1.0, turn: 'sway', faceYaw: 0.4 })
  const material = useMemo(
    () =>
      solidMaterial(solidVert, slabFrag, c.solidUniforms, {
        uHalf: { value: new THREE.Vector2(W / 2, H / 2) },
        uTicker: { value: 1 },
      }),
    [c.solidUniforms],
  )

  useFrame((state, delta) => {
    const f = c.update(state, delta)
    if (!f.visible) return
    // ticker only lights once the glass is mostly there
    material.uniforms.uTicker.value = Math.min(1, Math.max(0, (f.solid - 0.6) / 0.4))
  })

  return (
    <group ref={c.group} position={c.position}>
      <points ref={c.points} geometry={c.particleGeometry} material={c.particleMaterial} frustumCulled={false} />
      <mesh geometry={geometry} material={material} />
    </group>
  )
}
