import { useFrame, useThree } from '@react-three/fiber'
import { readScene } from './useSceneUniforms'

/**
 * Global exposure per shot: the Alert (07) goes almost black, the cold-open
 * and cut flashes spike it. Objects should NOT change renderer state
 * themselves; they read `readScene()` and drive their own uniforms.
 * Tone-mapping mode is set once in Scene (ACES); with postprocessing on, the
 * composer's final ToneMapping effect applies the same curve and exposure.
 */
export function Mood() {
  const gl = useThree((s) => s.gl)
  useFrame(() => {
    const r = readScene()
    // dim to 18% inside shot 07 (ease in/out at the edges of the shot)
    const inAlert = r.local(6, 0, 0.15) * (1 - r.local(6, 0.85, 1))
    const base = 1 - 0.82 * inAlert
    gl.toneMappingExposure = base + r.flash * 0.9
  })
  return null
}
