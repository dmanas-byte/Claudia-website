/* Round 4 — open additive light cone with a soft radial falloff; brightness travels around the ring */
#include rounds-dissolve.glsl;
uniform float uSolid;
uniform float uTime;
uniform vec3 uEdgeColor;
uniform vec3 uColor;
uniform float uIntensity;
varying vec2 vUv;
varying vec3 vDis;
varying vec3 vNormal;
varying vec3 vView;
varying float vGlow; /* 0..1 phase of this cone around the ring */
void main() {
  float edge = roundsDissolve(vDis, uSolid);
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vView);
  /* brighter where we look through the middle of the cone */
  float body = pow(abs(dot(N, V)), 1.6);
  /* along the cone: uv.y = 1 at the apex (lamp), 0 at the open mouth */
  float along = vUv.y;
  float fade = smoothstep(0.0, 0.25, along) * (0.35 + 0.65 * along);
  /* sequence: a bright pulse runs around the ring every ~2.5 s, plus a small flicker */
  float run = fract(uTime * 0.4 - vGlow);
  float pulse = exp(-run * 6.0);
  float flick = 0.92 + 0.08 * sin(uTime * 23.0 + vGlow * 40.0) * sin(uTime * 7.0 + vGlow * 9.0);
  float b = (0.3 + 1.1 * pulse) * flick;
  float a = body * fade * b * uIntensity;
  vec3 col = uColor * a + uEdgeColor * edge * 1.5;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
