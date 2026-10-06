/*
 * 40k gold particles pouring out of the backpack mouth, rising on a curl-noise
 * flow field, then settling onto the eight tower silhouettes.
 *
 *  aSeed    x emission order, y lateral spread, z angle, w size/twinkle
 *  aTarget  xz tower-surface point, y height fraction 0..1, w tower index
 *  uP       SHOT 03 progress (local 0.05..1)
 *  uRise    tower extrusion driver (local 0.25..0.95) — same stagger as Towers
 */
#include ./morph-noise.glsl
attribute vec4 aSeed;
attribute vec4 aTarget;
uniform float uTime;
uniform float uP;
uniform float uRise;
uniform float uPixelScale;
uniform float uTowerHeight;
uniform vec3 uMouth;
varying float vA;
varying float vHot;

/* keep in sync with towerRise() in Towers.tsx */
float towerRise(float t, float k) {
  return smoothstep(0.0, 1.0, clamp((t - k * 0.055) / 0.6, 0.0, 1.0));
}

void main() {
  float e = aSeed.x;
  float pour = clamp(uP / 0.72, 0.0, 1.0);
  /* 0 = still in the mouth, 1 = top of the column; earlier emitters lead */
  float s = clamp(pour * 1.6 - e * 0.7, 0.0, 1.0);
  float sp = pow(s, 0.65);

  /* column: narrow throat fanning to a 2–6 m wide plume ~30 m up, with a slow spiral */
  float ang = aSeed.z * 6.2831853 + sp * 2.2 + uTime * 0.12;
  float fan = sp * sp * (3.0 - 2.0 * sp);
  float rad = mix(0.07, 1.0 + 2.0 * aSeed.y, fan * fan);
  vec3 p = uMouth + vec3(cos(ang) * rad, s * 30.0 + aSeed.w * 3.0 * s, sin(ang) * rad);

  /* curl-noise flow field drifting upward through the column */
  vec3 c = mcurl(p * 0.09 + vec3(aSeed.w * 0.3, -uTime * 0.14, 0.0));
  p += c * (0.06 + 2.6 * fan);
  p.y += (c.y + 0.6) * 0.8 * sp;

  /* settle onto the tower the particle was dealt, following the extrusion */
  float k = aTarget.w;
  float rise = towerRise(uRise, k);
  vec3 tgt = vec3(aTarget.x, 0.4 + aTarget.y * uTowerHeight * rise, aTarget.z);
  float st = smoothstep(0.56 + 0.22 * aSeed.y, 0.88 + 0.1 * aSeed.y, uP);
  st = st * st * (3.0 - 2.0 * st);
  vec3 q = mix(p, tgt, st);
  q.y += sin(st * 3.14159) * (1.5 + 2.0 * aSeed.z);
  /* settled particles keep a faint shimmer against the facade */
  q += c * 0.08 * st;

  vec4 mv = modelViewMatrix * vec4(q, 1.0);
  float tw = 0.6 + 0.4 * sin(uTime * (1.8 + aSeed.w * 3.5) + aSeed.z * 6.2831853);
  float a = smoothstep(0.0, 0.02, s);             /* hide the ones still inside the bag */
  a *= 1.0 - smoothstep(0.82, 0.98, uP);         /* gone by the end of the shot */
  a *= mix(1.0, 0.45, st);                        /* dimmer once they are the windows' light */
  vA = a * tw;
  vHot = step(0.9, aSeed.w);

  float size = (0.035 + 0.065 * aSeed.w) * (0.5 + 0.9 * sp) * mix(1.0, 0.6, st);
  gl_PointSize = clamp(2.0 * size * uPixelScale / max(0.5, -mv.z), 1.0, 14.0);
  gl_Position = projectionMatrix * mv;
}
