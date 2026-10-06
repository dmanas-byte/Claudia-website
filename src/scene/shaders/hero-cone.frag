#include hero-noise.glsl;
uniform vec3 uColor;
uniform float uIntensity;
uniform float uTime;
uniform float uSoft;
varying vec3 vNormalW;
varying vec3 vWorld;
varying vec2 vUv;
void main() {
  vec3 v = normalize(cameraPosition - vWorld);
  float facing = abs(dot(normalize(vNormalW), v));
  /* cone geometry: uv.y = 1 at the apex (lamp), 0 at the base (floor) */
  float along = 1.0 - vUv.y;
  /* soft silhouette: fades where the surface turns edge-on to the camera */
  float edge = pow(facing, uSoft);
  /* bright near the lamp, thinning toward the floor, with a short ramp at the apex */
  float len = (0.06 + 0.94 * pow(1.0 - along, 2.6)) * (0.3 + 0.7 * smoothstep(0.0, 0.12, along));
  float baseFade = smoothstep(1.0, 0.8, along);
  float flick = 0.92 + 0.08 * sin(uTime * 7.3 + vUv.x * 6.283) * sin(uTime * 3.1);
  float dust = 0.7 + 0.6 * heroFbm(vec2(vUv.x * 6.0 + uTime * 0.05, along * 5.0 - uTime * 0.12), 3);
  float a = edge * len * baseFade * flick * dust * uIntensity;
  gl_FragColor = vec4(uColor * a, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
