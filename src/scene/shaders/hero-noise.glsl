/* shared hash / value noise / 3-octave fbm for the hero track */
float heroHash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float heroNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = heroHash(i);
  float b = heroHash(i + vec2(1.0, 0.0));
  float c = heroHash(i + vec2(0.0, 1.0));
  float d = heroHash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float heroFbm(vec2 p, int oct) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 3; i++) {
    if (i >= oct) break;
    v += a * heroNoise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}
