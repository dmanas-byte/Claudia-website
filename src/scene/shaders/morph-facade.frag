#include ./morph-noise.glsl
#include ./morph-windows.glsl
uniform vec3 uConcrete;
uniform float uLit;
uniform float uBands;
uniform float uTime;
uniform float uGain;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vSeed;
varying float vYFrac;
varying float vDist;
varying vec3 vView;
#include <fog_pars_fragment>
void main() {
  vec3 n = normalize(vNormal);
  float side = 1.0 - abs(n.y);
  /* lateral coordinate along the face; offset per building so grids never line up */
  float u = abs(n.x) > 0.5 ? vWorld.z : vWorld.x;
  float isWin;
  float facing = abs(dot(n, normalize(vView)));
  vec3 win = morphWindows(u + vSeed * 13.0, vWorld.y, vYFrac, vSeed, uLit, uBands, uTime, vDist, facing, isWin);
  /* dark concrete, one cool key from above-right and a floor-level falloff into the smoke */
  float key = max(0.0, dot(n, normalize(vec3(0.35, 0.8, 0.5))));
  float rim = max(0.0, dot(n, normalize(vec3(-0.6, 0.1, -0.8))));
  float streak = 0.85 + 0.15 * mhash(floor(u * 2.0) + vSeed);
  vec3 base = uConcrete * (0.35 + 0.65 * key + 0.25 * rim) * streak;
  base *= 0.55 + 0.45 * smoothstep(0.0, 6.0, vWorld.y);
  vec3 col = mix(base, win * uGain, isWin * side);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
