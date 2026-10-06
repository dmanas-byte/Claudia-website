/*
 * Procedural emissive window grid shared by the eight hero towers and the
 * background city. World-space coordinates in metres: `u` runs along the
 * facade, `y` is height. ~1.2 m pitch; a window fills ~60 % of its cell.
 *
 *  lit      fraction of windows that are on (random scatter)
 *  bands    0..1 — floors light fully from the bottom up in 6 steps (towers)
 *  yFrac    y / building height for the bands
 *  cadence  windows near the lit threshold blink on/off on a 2 s Poisson-ish slot
 */
const vec3 MW_BONE = vec3(0.949, 0.933, 0.902);
const vec3 MW_GOLD = vec3(0.824, 0.651, 0.294);
const vec3 MW_COOL = vec3(0.220, 0.910, 1.000);

/*  dist     view distance in metres (vertex varying) — drives edge softness and the far blend
 *  facing   |n · viewDir| — edge-on faces blend to the average glow instead of aliasing */
vec3 morphWindows(float u, float y, float yFrac, float seed, float lit, float bands, float time, float dist, float facing, out float isWindow) {
  const float pitch = 1.2;
  vec2 uv = vec2(u, y) / pitch;
  vec2 cell = floor(uv);
  vec2 f = fract(uv);
  /* window rectangle inside the cell; edge softness grows with distance (no derivatives: stable everywhere) */
  float e = 0.012 + dist * 0.0022;
  float wx = smoothstep(0.17 - e, 0.17 + e, f.x) * (1.0 - smoothstep(0.83 - e, 0.83 + e, f.x));
  float wy = smoothstep(0.24 - e, 0.24 + e, f.y) * (1.0 - smoothstep(0.76 - e, 0.76 + e, f.y));
  isWindow = wx * wy;

  ivec2 c = ivec2(cell);
  int bs = int(floor(seed * 1000.0 + 0.5)); /* round: the varying can sit a ulp under an integer */
  float h = mhashi(c, bs);            /* who lights first */
  float h2 = mhashi(c, bs + 7919);    /* colour / brightness */
  float h3 = mhashi(c, bs + 104729);  /* cool 1-in-12 */
#ifdef LOW_POWER
  float thr = lit;
#else
  int slot = int(floor(time * 0.5));
  float fl = mhashi(c, bs + 1301 * slot);
  float thr = lit + (fl - 0.5) * 0.09; /* boundary windows blink on a 2 s cadence */
#endif
  float on = step(h, thr);
  /* whole floors light in sequence (SHOT 04): band k lit when bands*6 > k */
  float band = step(floor(yFrac * 6.0) + 0.999, bands * 6.0);
  on = max(on, band);

  vec3 warm = mix(MW_BONE, MW_GOLD, 0.3 + 0.65 * h2);
  vec3 col = h3 < 0.0833 ? MW_COOL : warm;
  float bright = 0.55 + 0.7 * h2;
  vec3 darkGlass = vec3(0.03, 0.032, 0.04);
  vec3 win = mix(darkGlass, col * bright, on);
#ifndef LOW_POWER
  /* far away the grid aliases: blend to the average lit glow instead */
  float lod = max(smoothstep(70.0, 160.0, dist), 1.0 - smoothstep(0.06, 0.3, facing));
  vec3 avg = mix(darkGlass, MW_GOLD * 0.9, clamp(max(lit, bands * 0.8), 0.0, 1.0));
  win = mix(win, avg, lod);
#endif
  return win;
}
