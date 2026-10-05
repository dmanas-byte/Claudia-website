import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { useScroll } from '../store/useScroll'
import type { BloomEffect, ChromaticAberrationEffect } from 'postprocessing'

/**
 * Desktop-only post: bloom (spikes on hard cuts), a hair of chromatic
 * aberration that grows with scroll speed, and a vignette. Film grain is a
 * DOM overlay so it sits over the type as well.
 */
export function Post() {
  const bloom = useRef<BloomEffect>(null)
  const ca = useRef<ChromaticAberrationEffect>(null)
  const offset = useRef(new THREE.Vector2(0.0006, 0.0004))

  useFrame(() => {
    const s = useScroll.getState()
    if (bloom.current) bloom.current.intensity = 0.75 + s.flash * 2.6
    if (ca.current) {
      const k = 0.0005 + s.wind * 0.0025 + s.flash * 0.004
      offset.current.set(k, k * 0.6)
      ca.current.offset = offset.current
    }
  })

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom ref={bloom} mipmapBlur intensity={0.75} luminanceThreshold={0.72} luminanceSmoothing={0.2} radius={0.7} />
      <ChromaticAberration ref={ca} blendFunction={BlendFunction.NORMAL} offset={offset.current} radialModulation modulationOffset={0.3} />
      <Vignette eskil={false} offset={0.22} darkness={0.75} />
    </EffectComposer>
  )
}
