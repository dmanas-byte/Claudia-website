/* open additive light cone aimed down from a rig fixture; radial + length falloff */
#include term-hash.glsl;
uniform vec3 uColor;
uniform float uGain;
uniform float uTime;
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormalW;
varying float vI;
void main() {
  if (vI <= 0.001) discard;
  vec3 v = normalize(cameraPosition - vWorld);
  float facing = abs(dot(normalize(vNormalW), v));
  float along = 1.0 - vUv.y; /* 0 at the apex (lens), 1 at the floor */
  float edge = pow(facing, 1.6);
  float len = pow(1.0 - along, 1.5) * (0.3 + 0.7 * smoothstep(0.0, 0.1, along));
  float baseFade = smoothstep(1.0, 0.8, along);
  float dust = 0.8 + 0.4 * termNoise(vec2(vUv.x * 6.0 + uTime * 0.04, along * 5.0 - uTime * 0.09));
  float dist = length(cameraPosition - vWorld);
  float fog = 1.0 - smoothstep(30.0, 160.0, dist);
  float a = edge * len * baseFade * dust * vI * uGain * fog;
  gl_FragColor = vec4(uColor * a, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
