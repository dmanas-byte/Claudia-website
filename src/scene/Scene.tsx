import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { useSettings } from '../store/useSettings'
import { useScroll } from '../store/useScroll'
import { CameraRig } from './CameraRig'
import { Post } from './Post'
import { Set } from './Set'
import { Mood } from './Mood'
import './scene.css'

/**
 * One persistent fullscreen canvas fixed behind the DOM. Never unmounts
 * between shots. Under reduced motion the wrapper cross-fades (300 ms) on
 * shot changes so stills swap instead of the camera moving.
 */
export default function Scene() {
  const lowPower = useSettings((s) => s.lowPower)
  const reduced = useSettings((s) => s.reducedMotion)
  const wrap = useRef<HTMLDivElement>(null)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (!reduced) return
    let last = useScroll.getState().shot
    let t = 0
    const unsub = useScroll.subscribe((s) => {
      if (s.shot === last) return
      last = s.shot
      setFading(true)
      window.clearTimeout(t)
      t = window.setTimeout(() => setFading(false), 150)
    })
    return () => {
      unsub()
      window.clearTimeout(t)
    }
  }, [reduced])

  return (
    <div className={`scene ${fading ? 'is-fading' : ''}`} ref={wrap} aria-hidden="true">
      <Canvas
        dpr={[1, lowPower ? 1.5 : 2]}
        gl={{ antialias: !lowPower, powerPreference: 'high-performance', alpha: false, stencil: false, depth: true }}
        camera={{ fov: 42, near: 0.1, far: 400, position: [0, 1.6, 4.6] }}
        shadows={!lowPower}
        frameloop="always"
        onCreated={({ gl }) => {
          gl.setClearColor('#07070a', 1)
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1
        }}
      >
        <color attach="background" args={['#07070a']} />
        <fog attach="fog" args={['#07070a', 30, 160]} />
        <CameraRig />
        <Mood />
        <Suspense fallback={null}>
          <Set />
        </Suspense>
        {!lowPower && !reduced && <Post />}
      </Canvas>
    </div>
  )
}
