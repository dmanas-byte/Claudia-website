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
  /* cone geometry: uv.y = 1 at the apex, 0 at the base */
  float along = 1.0 - vUv.y;
  float edge = pow(facing, uSoft);
  float len = pow(1.0 - along, 1.35) * (0.35 + 0.65 * smoothstep(0.0, 0.18, along));
  float baseFade = smoothstep(1.0, 0.82, along);
  float flick = 0.9 + 0.1 * sin(uTime * 7.3 + vUv.x * 6.283) * sin(uTime * 3.1);
  float dust = 0.75 + 0.5 * heroFbm(vec2(vUv.x * 5.0 + uTime * 0.05, along * 4.0 - uTime * 0.11), 2);
  float a = edge * len * baseFade * flick * dust * uIntensity;
  gl_FragColor = vec4(uColor * a, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
