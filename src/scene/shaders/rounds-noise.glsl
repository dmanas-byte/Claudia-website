/* shared hash / 3D value noise / cheap curl for the rounds track (SHOT 05) */
float roundsHash(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}
float roundsNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float n000 = roundsHash(i);
  float n100 = roundsHash(i + vec3(1.0, 0.0, 0.0));
  float n010 = roundsHash(i + vec3(0.0, 1.0, 0.0));
  float n110 = roundsHash(i + vec3(1.0, 1.0, 0.0));
  float n001 = roundsHash(i + vec3(0.0, 0.0, 1.0));
  float n101 = roundsHash(i + vec3(1.0, 0.0, 1.0));
  float n011 = roundsHash(i + vec3(0.0, 1.0, 1.0));
  float n111 = roundsHash(i + vec3(1.0, 1.0, 1.0));
  float x00 = mix(n000, n100, u.x);
  float x10 = mix(n010, n110, u.x);
  float x01 = mix(n001, n101, u.x);
  float x11 = mix(n011, n111, u.x);
  return mix(mix(x00, x10, u.y), mix(x01, x11, u.y), u.z);
}
/* a divergence-free-ish swirl built from three offset noise lookups (cheap curl) */
vec3 roundsCurl(vec3 p) {
  float e = 0.35;
  float a = roundsNoise(p + vec3(e, 0.0, 0.0)) - roundsNoise(p - vec3(e, 0.0, 0.0));
  float b = roundsNoise(p + vec3(0.0, e, 0.0)) - roundsNoise(p - vec3(0.0, e, 0.0));
  float c = roundsNoise(p + vec3(0.0, 0.0, e)) - roundsNoise(p - vec3(0.0, 0.0, e));
  return vec3(b - c, c - a, a - b) * (1.0 / (2.0 * e));
}
