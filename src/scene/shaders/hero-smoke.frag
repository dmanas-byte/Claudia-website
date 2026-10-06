#include hero-noise.glsl;
uniform float uTime;
uniform float uOpacity;
uniform int uOctaves;
uniform float uScale;
uniform float uThreshold;
/* xy = floor position (x,z), z = pool radius, w = intensity */
uniform vec4 uSpotA;
uniform vec4 uSpotB;
uniform vec4 uCursor;
uniform vec3 uColorDark;
uniform vec3 uColorLit;
uniform float uExtent;
uniform float uWind;
varying vec3 vWorld;

float pool(vec2 p, vec4 s) {
  float d = distance(p, s.xy) / max(s.z, 0.001);
  return exp(-d * d * 2.2) * s.w;
}
void main() {
  vec2 p = vWorld.xz * uScale;
  float t = uTime * (0.02 + uWind * 0.06);
  /* domain warp: two fbm fields displace the sampling point */
  vec2 q = vec2(
    heroFbm(p + vec2(t, t * 0.7), uOctaves),
    heroFbm(p + vec2(5.2, 1.3) - vec2(t * 0.6, t), uOctaves));
  float n = heroFbm(p + 1.9 * q + vec2(t * 0.5, -t * 0.3), uOctaves);
  /* wisps: a soft threshold plus a finer tear so the pools show structure */
  float tear = heroFbm(p * 2.2 - q * 2.0 + vec2(-t * 0.8, t * 0.4), 2);
  float dens = smoothstep(uThreshold, uThreshold + 0.24, n) * (0.25 + 0.75 * smoothstep(0.3, 0.7, tear));
  /* fade at the extent of the plane and when the camera is right on top of it */
  float rad = length(vWorld.xz);
  dens *= 1.0 - smoothstep(uExtent * 0.45, uExtent * 0.95, rad);
  float dc = distance(vWorld, cameraPosition);
  dens *= smoothstep(0.6, 2.4, dc);

  float la = pool(vWorld.xz, uSpotA);
  float lb = pool(vWorld.xz, uSpotB);
  float lc = pool(vWorld.xz, uCursor);
  float lit = la + lb + lc;
  float lit1 = clamp(lit, 0.0, 1.0);
  /* unlit smoke is a dark grey haze; lit smoke glows warm bone */
  vec3 col = mix(uColorDark, uColorLit, lit1) * (0.3 + 0.3 * min(lit, 1.5));
  float alpha = dens * uOpacity * (0.18 + 0.55 * lit1);
  gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
