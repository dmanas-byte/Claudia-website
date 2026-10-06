/*
 * Shared noise for the morph track: hashes, 3D simplex noise (Ashima/Gustavson)
 * and a curl-noise flow field built from three offset simplex samples.
 */
/* integer bit-mixing hash (lowbias32): exact, so a window never flickers between pixels */
uint mmix(uint x) {
  x ^= x >> 16u;
  x *= 0x7feb352du;
  x ^= x >> 15u;
  x *= 0x846ca68bu;
  x ^= x >> 16u;
  return x;
}
/* 0..1 from integer cell coordinates and an integer salt */
float mhashi(ivec2 c, int salt) {
  uint h = mmix(uint(c.x + 32768) * 0x9E3779B1u ^ mmix(uint(c.y + 32768) + uint(salt) * 0x85ebca6bu));
  return float(h) * (1.0 / 4294967295.0);
}

/* fract-based hashes (Hoskins): stable on every GPU, no large sin() arguments */
float mhash(float n) {
  n = fract(n * 0.1031);
  n *= n + 33.33;
  n *= n + n;
  return fract(n);
}
float mhash2(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float mhash3(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

vec3 mmod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mmod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mpermute(vec4 x) { return mmod289(((x * 34.0) + 1.0) * x); }
vec4 mtaylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

/* 3D simplex noise, -1..1 */
float msnoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mmod289(i);
  vec4 p = mpermute(mpermute(mpermute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = mtaylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

/* three decorrelated noise channels = a vector potential */
vec3 msnoise3(vec3 p) {
  return vec3(msnoise(p), msnoise(p + vec3(31.416, 17.2, -9.1)), msnoise(p + vec3(-12.3, 44.8, 23.5)));
}

/* curl of the potential field: divergence-free, so particles swirl instead of clumping */
vec3 mcurl(vec3 p) {
  const float e = 0.08;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);
  vec3 px0 = msnoise3(p - dx);
  vec3 px1 = msnoise3(p + dx);
  vec3 py0 = msnoise3(p - dy);
  vec3 py1 = msnoise3(p + dy);
  vec3 pz0 = msnoise3(p - dz);
  vec3 pz1 = msnoise3(p + dz);
  float x = py1.z - py0.z - pz1.y + pz0.y;
  float y = pz1.x - pz0.x - px1.z + px0.z;
  float z = px1.y - px0.y - py1.x + py0.x;
  return vec3(x, y, z) / (2.0 * e);
}
