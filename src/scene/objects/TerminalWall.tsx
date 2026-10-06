import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { readScene } from '../useSceneUniforms'
import { WORLD } from '../world'
import vert from '../shaders/term-surface.vert'
import frag from '../shaders/term-wall.frag'

/**
 * SHOT 06 — The Terminal. A 40 m × 12 m glass wall at WORLD.terminalWall
 * covered in a procedural Bloomberg-style shader (scrolling dot-matrix
 * numerals, sparklines, ticks; all hashed noise), a thin dark frame, and a
 * faint floor reflection. Visible from shot 05 local 0.8 through shot 06,
 * fading out across the first 15 % of shot 07. 3 draw calls.
 */
export function TerminalWall() {
  const [cx, cy, cz] = WORLD.terminalWall.center
  const W = WORLD.terminalWall.width
  const H = WORLD.terminalWall.height
  const group = useRef<THREE.Group>(null)
  const time = useRef(0)

  const makeUniforms = (mirror: number, opacity: number) => ({
    uTime: { value: 0 },
    uFade: { value: 0 },
    uCols: { value: 18 },
    uMirror: { value: mirror },
    uOpacity: { value: opacity },
    uSize: { value: new THREE.Vector2(W, H) },
    uTerminal: { value: new THREE.Color('#38E8FF') },
    uBone: { value: new THREE.Color('#F2EEE6') },
    uAsh: { value: new THREE.Color('#8B8C93') },
    uGreen: { value: new THREE.Color('#39d98a') },
    uRed: { value: new THREE.Color('#ff5f6a') },
  })

  const wallMat = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms: makeUniforms(0, 1) }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const mirrorMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: makeUniforms(1, 0.15),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  /* frame: four dark bars as one InstancedMesh */
  const frameGeom = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])
  const frameMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#101117', metalness: 0.7, roughness: 0.4 }), [])
  const frame = useRef<THREE.InstancedMesh>(null)
  const frameMatrices = useMemo(() => {
    const m = new THREE.Matrix4()
    const t = 0.32
    const d = 0.5
    const bars: [number, number, number, number, number, number][] = [
      [0, H / 2 + t / 2, 0, W + t * 2, t, d],
      [0, -H / 2 - t / 2, 0, W + t * 2, t, d],
      [-W / 2 - t / 2, 0, 0, t, H, d],
      [W / 2 + t / 2, 0, 0, t, H, d],
    ]
    return bars.map(([x, y, z, sx, sy, sz]) => m.clone().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion(), new THREE.Vector3(sx, sy, sz)))
  }, [W, H])

  useFrame((_, dt) => {
    const r = readScene()
    const fade = r.local(4, 0.8, 1) * (1 - r.local(6, 0, 0.15))
    const show = fade > 0.002 && ((r.shot === 4 && r.shotProgress >= 0.8) || r.shot === 5 || (r.shot === 6 && r.shotProgress < 0.15))
    if (group.current) group.current.visible = show
    if (!show) return
    if (!r.reduced) time.current += Math.min(dt, 0.05)
    const cols = r.lowPower ? 9 : 18
    for (const mat of [wallMat, mirrorMat]) {
      mat.uniforms.uTime.value = time.current
      mat.uniforms.uFade.value = fade
      mat.uniforms.uCols.value = cols
    }
    if (frame.current && frame.current.count !== 4) {
      // (never hit: matrices are set once below) — keeps instanceMatrix valid if hot-reloaded
      frame.current.count = 4
    }
  })

  return (
    <group ref={group} position={[cx, cy, cz]} visible={false}>
      <mesh material={wallMat}>
        <planeGeometry args={[W, H]} />
      </mesh>
      <instancedMesh
        ref={(el) => {
          frame.current = el
          if (!el) return
          frameMatrices.forEach((mm, i) => el.setMatrixAt(i, mm))
          el.instanceMatrix.needsUpdate = true
        }}
        args={[frameGeom, frameMat, 4]}
      />
      {/* floor reflection: lies on the floor from the wall foot toward the camera */}
      <mesh material={mirrorMat} position={[0, -cy + 0.01, H / 2]} rotation-x={-Math.PI / 2} renderOrder={1}>
        <planeGeometry args={[W, H]} />
      </mesh>
    </group>
  )
}
