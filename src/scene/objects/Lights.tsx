import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useSettings } from '../../store/useSettings'
import { readScene } from '../useSceneUniforms'
import { WORLD } from '../world'
import { LAMP_A, LAMP_B, SPOT_COLOR_A, SPOT_COLOR_B, SPOT_TARGET, rangeLevel, spotLevel } from './Spotlights'

const SKY_ARENA = new THREE.Color('#15161C')
const SKY_CITY = new THREE.Color('#5a4a36')
const _sky = new THREE.Color()
const [tx, ty, tz] = WORLD.terminalWall.center

/**
 * The real lighting rig (5 lights, the budget):
 *  - two SpotLights on the backpack, from the same lamps as the volumetric
 *    cones (A casts shadows on desktop)
 *  - a dim ambient so nothing is pure black
 *  - a hemisphere light that warms as the arena becomes a city (03→04)
 *  - a terminal-blue point light by the data wall that only matters in 06
 * Intensities spike with r.flash. Lights never toggle `visible` (that would
 * recompile every material); they go to zero instead.
 */
export function Lights() {
  const lowPower = useSettings((s) => s.lowPower)
  const a = useRef<THREE.SpotLight>(null)
  const b = useRef<THREE.SpotLight>(null)
  const hemi = useRef<THREE.HemisphereLight>(null)
  const terminal = useRef<THREE.PointLight>(null)
  const target = useMemo(() => {
    const o = new THREE.Object3D()
    o.position.copy(SPOT_TARGET)
    return o
  }, [])

  useFrame(() => {
    const r = readScene()
    const flash = 1 + r.flash * 2.2
    const spots = spotLevel(r) * flash
    if (a.current) a.current.intensity = 1500 * spots
    if (b.current) b.current.intensity = 600 * spots
    if (hemi.current) {
      const city = r.span(2, 3)
      _sky.copy(SKY_ARENA).lerp(SKY_CITY, city)
      hemi.current.color.copy(_sky)
      hemi.current.intensity = (0.14 + 0.5 * city) * (1 + r.flash * 0.6)
    }
    if (terminal.current) {
      terminal.current.intensity = 90 * rangeLevel(r.shotFloat, 5, 6, 0.15) * flash
    }
  })

  return (
    <>
      <primitive object={target} />
      <ambientLight intensity={0.05} color="#8b8c93" />
      <spotLight
        ref={a}
        position={LAMP_A}
        target={target}
        color={SPOT_COLOR_A}
        intensity={1500}
        angle={0.19}
        penumbra={0.7}
        decay={2}
        distance={0}
        castShadow={!lowPower}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-near={2}
        shadow-camera-far={18}
      />
      <spotLight ref={b} position={LAMP_B} target={target} color={SPOT_COLOR_B} intensity={600} angle={0.19} penumbra={0.7} decay={2} distance={0} />
      <hemisphereLight ref={hemi} args={['#15161C', '#07070A', 0.14]} />
      <pointLight ref={terminal} position={[tx, ty - 2, tz + 4]} color="#38E8FF" intensity={0} distance={45} decay={2} />
    </>
  )
}
