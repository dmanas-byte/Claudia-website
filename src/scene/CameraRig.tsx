import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '../store/useScroll'
import { useSettings } from '../store/useSettings'
import { evaluateCamera, stillCamera } from './cameraPath'

/**
 * Drives the camera from scroll. One continuous move per shot, hard cuts
 * between shots when the keys don't line up. 0.5° handheld sway from layered
 * sines (noise-like, cheap). Reduced motion: one still per shot.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const pos = useRef(new THREE.Vector3())
  const tgt = useRef(new THREE.Vector3())
  const smoothPos = useRef(new THREE.Vector3(0, 1.6, 4.6))
  const smoothTgt = useRef(new THREE.Vector3(0, 0.45, 0))
  const lastShot = useRef(-1)
  const fov = useRef(42)

  useFrame((_, dt) => {
    const s = useScroll.getState()
    const reduced = useSettings.getState().reducedMotion
    const t = reduced ? 0 : s.shotProgress
    let f: number
    if (reduced) f = stillCamera(s.shot, pos.current, tgt.current)
    else f = evaluateCamera(s.shot, t, pos.current, tgt.current)

    const cut = s.shot !== lastShot.current
    lastShot.current = s.shot
    // snap on cuts, otherwise damp a touch for scroll smoothing
    const k = cut ? 1 : 1 - Math.exp(-dt * 18)
    smoothPos.current.lerp(pos.current, k)
    smoothTgt.current.lerp(tgt.current, k)
    fov.current += (f - fov.current) * k

    camera.position.copy(smoothPos.current)
    if (!reduced) {
      // handheld sway: ~0.5° amplitude, slow, two incommensurate frequencies
      const time = performance.now() * 0.001
      const sway = 0.0087 // rad ≈ 0.5°
      const yaw = Math.sin(time * 0.37) * 0.6 + Math.sin(time * 0.91 + 1.3) * 0.4
      const pitch = Math.sin(time * 0.29 + 0.7) * 0.6 + Math.sin(time * 1.13) * 0.4
      camera.lookAt(smoothTgt.current)
      camera.rotateY(yaw * sway)
      camera.rotateX(pitch * sway)
    } else {
      camera.lookAt(smoothTgt.current)
    }
    if (Math.abs(camera.fov - fov.current) > 0.01) {
      camera.fov = fov.current
      camera.updateProjectionMatrix()
    }
  })
  return null
}
