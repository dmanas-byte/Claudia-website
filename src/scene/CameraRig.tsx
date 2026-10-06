import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '../store/useScroll'
import { useSettings } from '../store/useSettings'
import { CAMERA, evaluateCamera, stillCamera } from './cameraPath'

/** 0 = clear, 1 = black. Written here, read by Mood to dip exposure on camera cuts. */
export const cutDip = { dark: 0 }

const OUT = 0.18 // s to black
const IN = 0.45 // s back up

const near = (a: [number, number, number], b: [number, number, number]) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 0.05

/** Adjacent shots whose camera keys meet continue without a cut. */
function continuous(from: number, to: number, portrait: boolean) {
  if (Math.abs(from - to) !== 1) return false
  const [a, b] = from < to ? [CAMERA[from], CAMERA[to]] : [CAMERA[to], CAMERA[from]]
  if (portrait && (a.portrait || b.portrait)) return false
  return near(a.to.pos, b.from.pos) && near(a.to.target, b.from.target)
}

const ease = (x: number) => x * x * (3 - 2 * x)

/**
 * Drives the camera from scroll. One continuous move per shot. When the next
 * shot starts somewhere else on the set, the picture dips briefly through
 * black, the camera jumps while it is dark, then fades back up. No flashes.
 * 0.5° handheld sway from layered sines. Reduced motion: one still per shot.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const pos = useRef(new THREE.Vector3())
  const tgt = useRef(new THREE.Vector3())
  const smoothPos = useRef(new THREE.Vector3(0, 1.6, 4.6))
  const smoothTgt = useRef(new THREE.Vector3(0, 0.45, 0))
  const fov = useRef(42)
  const shown = useRef(-1) // shot the camera is currently filming
  const phase = useRef<'idle' | 'out' | 'in'>('idle')
  const phaseT = useRef(0)

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1)
    const s = useScroll.getState()
    const reduced = useSettings.getState().reducedMotion
    const portrait = camera.aspect < 1
    let snap = false

    if (shown.current < 0) {
      shown.current = s.shot
      snap = true
    } else if (s.shot !== shown.current && phase.current !== 'out') {
      if (reduced || continuous(shown.current, s.shot, portrait)) {
        shown.current = s.shot
      } else {
        // start (or restart) the dip from wherever the fade-in had got to
        phase.current = 'out'
        phaseT.current = OUT * (1 - cutDip.dark)
      }
    }

    if (phase.current === 'out') {
      phaseT.current += dt
      cutDip.dark = ease(Math.min(1, phaseT.current / OUT))
      if (phaseT.current >= OUT) {
        shown.current = s.shot
        snap = true
        phase.current = 'in'
        phaseT.current = 0
      }
    } else if (phase.current === 'in') {
      phaseT.current += dt
      cutDip.dark = 1 - ease(Math.min(1, phaseT.current / IN))
      if (phaseT.current >= IN) {
        phase.current = 'idle'
        cutDip.dark = 0
      }
    }

    // film the shot we're on; while fading out of it, hold its edge frame
    const i = shown.current
    const t = reduced ? 0 : i === s.shot ? s.shotProgress : i < s.shot ? 1 : 0
    const f = reduced ? stillCamera(i, pos.current, tgt.current, portrait) : evaluateCamera(i, t, pos.current, tgt.current, portrait)

    const k = snap ? 1 : 1 - Math.exp(-dt * 18)
    smoothPos.current.lerp(pos.current, k)
    smoothTgt.current.lerp(tgt.current, k)
    fov.current += (f - fov.current) * k

    camera.position.copy(smoothPos.current)
    camera.lookAt(smoothTgt.current)
    if (!reduced) {
      // handheld sway: ~0.5° amplitude, slow, two incommensurate frequencies
      const time = performance.now() * 0.001
      const sway = 0.0087
      camera.rotateY((Math.sin(time * 0.37) * 0.6 + Math.sin(time * 0.91 + 1.3) * 0.4) * sway)
      camera.rotateX((Math.sin(time * 0.29 + 0.7) * 0.6 + Math.sin(time * 1.13) * 0.4) * sway)
    }
    // portrait: the horizontal frustum is tiny, so widen the lens a little
    const aspect = camera.aspect || 1
    const wantFov = fov.current + (aspect < 1 ? (1 - aspect) * 14 : 0)
    if (Math.abs(camera.fov - wantFov) > 0.01) {
      camera.fov = wantFov
      camera.updateProjectionMatrix()
    }
  })
  return null
}
