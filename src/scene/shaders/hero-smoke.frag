#include hero-noise.glsl;
uniform float uTime;
uniform float uOpacity;
uniform int uOctaves;
uniform float uScale;
uniform float uThreshold;
uniform vec3 uSpotA;
uniform vec3 uSpotB;
uniform vec3 uCursor;
uniform float uLit;
uniform float uCursorLit;
uniform vec3 uColorDark;
uniform vec3 uColorLit;
uniform float uExtent;
varying vec3 vWorld;

float pool(vec2 p, vec3 s) {
  float d = distance(p, s.xy) / max(s.z, 0.001);
  return exp(-d * d * 2.4);
}
void main() {
  vec2 p = vWorld.xz * uScale;
  float t = uTime * 0.02;
  vec2 q = vec2(
    heroFbm(p + vec2(t, t * 0.7), uOctaves),
    heroFbm(p + vec2(5.2, 1.3) - vec2(t * 0.6, t), uOctaves));
  float n = heroFbm(p + 1.7 * q + vec2(t * 0.5, -t * 0.3), uOctaves);
  float dens = smoothstep(uThreshold, uThreshold + 0.55, n);
  float rad = length(vWorld.xz);
  dens *= 1.0 - smoothstep(uExtent * 0.5, uExtent, rad);
  float dc = distance(vWorld, cameraPosition);
  dens *= smoothstep(0.5, 2.2, dc);
  float la = pool(vWorld.xz, uSpotA) * uLit;
  float lb = pool(vWorld.xz, uSpotB) * uLit;
  float lc = pool(vWorld.xz, uCursor) * uCursorLit;
  float lit = la + lb + lc;
  float lit1 = clamp(lit, 0.0, 1.0);
  vec3 col = mix(uColorDark, uColorLit, lit1) * (0.6 + 1.1 * min(lit, 1.6));
  float alpha = dens * uOpacity * (0.4 + 0.6 * lit1);
  gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
