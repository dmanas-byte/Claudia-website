#include rounds-noise.glsl;
/* position = a point sampled on the object's surface (object space) */
attribute vec3 aSphere; /* start position on a loose sphere around the object */
attribute vec4 aSeed;   /* random 0..1 ×4 */
uniform float uTime;
uniform float uCondense;   /* presence 0..1 */
uniform float uPixelScale; /* viewport px per world metre at 1 m */
uniform float uSize;       /* particle world size (m) */
uniform float uRadius;     /* sphere radius */
varying float vAlpha;
varying float vHot;

void main() {
  float c = uCondense;
  /* 0 → 0.45: gather from the sphere onto the surface */
  float gather = smoothstep(0.0, 0.45, c);
  /* ease so the last stretch snaps */
  float g = pow(gather, 1.6);
  float spread = 1.0 - g;
  vec3 start = aSphere * uRadius;
  /* swirl: the sphere turns and breathes while loose */
  float ang = uTime * (0.5 + aSeed.x * 0.6) + aSeed.y * 6.2831;
  mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
  start.xz = rot * start.xz;
  start.y += sin(uTime * 0.9 + aSeed.z * 6.2831) * 0.12;
  vec3 p = mix(start, position, g);
  /* curl offset shrinking to zero as it lands */
  vec3 curl = roundsCurl(position * 2.5 + aSeed.xyz * 3.0 + vec3(0.0, uTime * 0.25, 0.0));
  p += curl * 0.22 * spread * spread;
  /* 0.7 → 1: release — drift up and off the surface and fade */
  float rel = smoothstep(0.7, 1.0, c);
  vec3 away = normalize(aSphere) * 0.35 + vec3(0.0, 0.45, 0.0);
  p += away * rel * rel + curl * 0.15 * rel;
  /* a touch of shimmer while sitting on the surface */
  float sit = gather * (1.0 - rel);
  p += vec3(sin(uTime * 3.0 + aSeed.w * 20.0), cos(uTime * 2.3 + aSeed.x * 17.0), 0.0) * 0.004 * sit;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float fadeIn = smoothstep(0.0, 0.1, c);
  float fadeOut = 1.0 - smoothstep(0.72, 0.9, c);
  float tw = 0.7 + 0.3 * sin(uTime * (2.0 + aSeed.z * 4.0) + aSeed.w * 6.2831);
  vAlpha = fadeIn * fadeOut * tw * (0.55 + 0.45 * aSeed.y);
  /* hotter (whiter) right at the snap */
  vHot = smoothstep(0.35, 0.5, c) * (1.0 - smoothstep(0.55, 0.75, c));
  float size = uSize * (0.7 + aSeed.w * 0.9) * (1.0 + 0.6 * vHot);
  gl_PointSize = clamp(size * uPixelScale / max(0.3, -mv.z), 1.0, 14.0);
  gl_Position = projectionMatrix * mv;
}
