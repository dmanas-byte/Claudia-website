import { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { readScene } from '../useSceneUniforms'
import { WORLD } from '../world'

/**
 * Arena floor: a very dark, slightly reflective MeshStandardMaterial (so the
 * real spotlights, shadows and the terminal light work on it) with a 1 m grid
 * at ~4 % brightness fading with distance and a faint matte canvas tone inside
 * the octagon, both injected with onBeforeCompile. 1 draw call.
 */
export function Floor() {
  const { mat, uniforms } = useMemo(() => {
    const uniforms = {
      uOctagon: { value: WORLD.octagonRadius * Math.cos(Math.PI / 8) },
      uGrid: { value: 0.022 },
      uGridFade: { value: 0.05 },
    }
    const mat = new THREE.MeshStandardMaterial({ color: '#08080c', roughness: 0.4, metalness: 0.35 })
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms)
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vFloorWorld;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvFloorWorld = (modelMatrix * vec4(position, 1.0)).xyz;')
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
varying vec3 vFloorWorld;
uniform float uOctagon;
uniform float uGrid;
uniform float uGridFade;
float heroFloorHash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float heroFloorNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(heroFloorHash(i), heroFloorHash(i + vec2(1.0, 0.0)), u.x), mix(heroFloorHash(i + vec2(0.0, 1.0)), heroFloorHash(i + vec2(1.0, 1.0)), u.x), u.y);
}`,
        )
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
vec2 fp = vFloorWorld.xz;
/* regular octagon with flat edges facing the axes: apothem uOctagon */
vec2 ap = abs(fp);
float octD = max(max(ap.x, ap.y), (ap.x + ap.y) * 0.70710678) - uOctagon;
float heroInside = 1.0 - smoothstep(-0.12, 0.08, octD);
/* canvas: slightly warmer, slightly lighter, a little woven noise */
float weave = heroFloorNoise(fp * 9.0) * 0.5 + heroFloorNoise(fp * 37.0) * 0.5;
vec3 canvas = vec3(0.0075, 0.0068, 0.006) * (0.8 + 0.4 * weave);
diffuseColor.rgb = mix(diffuseColor.rgb, canvas, heroInside);
/* the octagon's edge: a slightly darker seam */
diffuseColor.rgb *= 1.0 - 0.35 * (1.0 - smoothstep(0.0, 0.06, abs(octD)));`,
        )
        .replace(
          '#include <roughnessmap_fragment>',
          `#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.85, heroInside);`,
        )
        .replace(
          '#include <metalnessmap_fragment>',
          `#include <metalnessmap_fragment>
metalnessFactor = mix(metalnessFactor, 0.05, heroInside);`,
        )
        .replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
{
  vec2 gp = fp - 0.5;
  vec2 gw = fwidth(gp) * 1.2;
  vec2 gl = 1.0 - smoothstep(vec2(0.0), gw, abs(fract(gp) - 0.5));
  float line = max(gl.x, gl.y);
  float dist = distance(vFloorWorld, cameraPosition);
  float fade = exp(-dist * uGridFade);
  /* no grid on the canvas, no grid where the plane is seen nearly edge-on */
  totalEmissiveRadiance += vec3(0.92, 0.9, 0.86) * uGrid * line * fade * (1.0 - heroInside * 0.85);
}`,
        )
    }
    mat.customProgramCacheKey = () => 'hero-floor-grid'
    return { mat, uniforms }
  }, [])

  useFrame(() => {
    const r = readScene()
    // the grid is a trading-floor tell: barely there in the arena, clearer once the city is up
    uniforms.uGrid.value = (0.02 + 0.022 * r.span(2, 3)) * (1 + r.flash * 0.5)
    uniforms.uGridFade.value = r.shotFloat >= 3 ? 0.035 : 0.05
  })

  return (
    <mesh rotation-x={-Math.PI / 2} position-y={0} receiveShadow material={mat}>
      <planeGeometry args={[WORLD.cityExtent * 3, WORLD.cityExtent * 3]} />
    </mesh>
  )
}
