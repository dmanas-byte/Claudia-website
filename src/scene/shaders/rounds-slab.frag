/* Round 1 — glass slab: dark glossy body, fresnel rim, abstract ticker on the front face */
#include rounds-dissolve.glsl;
uniform float uSolid;
uniform float uTime;
uniform vec3 uEdgeColor;
uniform vec2 uHalf;      /* half width / half height of the face */
uniform float uTicker;   /* 0..1 ticker brightness */
varying vec2 vUv;
varying vec3 vLocal;
varying vec3 vDis;
varying vec3 vNormal;
varying vec3 vView;

float cellHash(vec2 c) { return roundsHash(vec3(c, 3.7)); }

/* abstract 7-segment-ish glyph: segments chosen by hash bits, never a real digit */
float glyph(vec2 f, vec2 id) {
  float h = cellHash(id);
  float bits = floor(h * 127.0);
  float s = 0.0;
  /* three horizontals */
  float hx = step(0.15, f.x) * step(f.x, 0.85);
  s += hx * step(0.80, f.y) * step(0.5, mod(bits, 2.0));
  s += hx * step(0.44, f.y) * step(f.y, 0.56) * step(0.5, mod(floor(bits / 2.0), 2.0));
  s += hx * step(f.y, 0.20) * step(0.5, mod(floor(bits / 4.0), 2.0));
  /* four verticals */
  float vy1 = step(0.52, f.y) * step(f.y, 0.95);
  float vy0 = step(0.05, f.y) * step(f.y, 0.48);
  float lx = step(0.08, f.x) * step(f.x, 0.26);
  float rx = step(0.74, f.x) * step(f.x, 0.92);
  s += lx * vy1 * step(0.5, mod(floor(bits / 8.0), 2.0));
  s += rx * vy1 * step(0.5, mod(floor(bits / 16.0), 2.0));
  s += lx * vy0 * step(0.5, mod(floor(bits / 32.0), 2.0));
  s += rx * vy0 * step(0.5, mod(floor(bits / 64.0), 2.0));
  return clamp(s, 0.0, 1.0);
}

vec3 ticker(vec2 uv) {
  /* inset face with a margin */
  vec2 m = vec2(0.06, 0.08);
  if (uv.x < m.x || uv.x > 1.0 - m.x || uv.y < m.y || uv.y > 1.0 - m.y) return vec3(0.0);
  vec2 q = (uv - m) / (1.0 - 2.0 * m);
  float rows = 7.0;
  float y = q.y * rows + uTime * 0.9; /* scroll up */
  float row = floor(y);
  float fy = fract(y);
  float rh = cellHash(vec2(row, 11.0));
  vec3 col = vec3(0.0);
  /* row baseline: faint rule */
  col += vec3(0.95, 0.93, 0.9) * 0.05 * step(0.94, fy);
  float cellH = fy > 0.18 && fy < 0.86 ? 1.0 : 0.0;
  float gy = (fy - 0.18) / 0.68;
  /* 4 glyph cells on the left (symbol block) */
  float cols = 12.0;
  float cx = q.x * cols;
  float cell = floor(cx);
  float fx = fract(cx);
  if (cell < 4.0) {
    float g = glyph(vec2(fx, gy), vec2(cell, row)) * cellH;
    col += vec3(0.95, 0.92, 0.86) * g * 1.6;
  } else if (cell == 4.0) {
    /* tick: up (green) or down (soft red) triangle */
    float up = step(0.5, rh);
    float ty = up == 1.0 ? gy : 1.0 - gy;
    float tri = step(abs(fx - 0.5), (1.0 - ty) * 0.42) * step(0.1, ty) * cellH;
    col += mix(vec3(0.88, 0.38, 0.3), vec3(0.25, 0.82, 0.55), up) * tri * 1.6;
  } else if (cell >= 5.0 && cell < 9.0) {
    /* 4 numeric-looking glyph cells, dimmer */
    float g = glyph(vec2(fx, gy), vec2(cell + 40.0, row)) * cellH;
    col += vec3(0.7, 0.7, 0.74) * g * 1.3;
  } else if (cell >= 9.5 && cell < 11.5) {
    /* bar: length from hash, gold when the row is "up", ash otherwise */
    float len = 0.3 + 0.7 * cellHash(vec2(row, 29.0));
    float bx = (cx - 9.5) / 2.0;
    float bar = step(bx, len) * step(0.35, gy) * step(gy, 0.65) * cellH;
    col += mix(vec3(0.35, 0.36, 0.4), vec3(0.82, 0.65, 0.3), step(0.5, rh)) * bar * 0.9;
  }
  /* soft fade at top/bottom so rows appear to emerge */
  float fade = smoothstep(0.0, 0.12, q.y) * (1.0 - smoothstep(0.88, 1.0, q.y));
  col *= fade;
  /* diagonal "sample" hatch band so it cannot be read as real data */
  float band = q.x + q.y * 0.6;
  float inBand = step(0.55, band) * step(band, 0.78);
  float hatch = step(0.5, fract((q.x - q.y) * 28.0));
  col = mix(col, col * 0.35 + vec3(0.82, 0.65, 0.3) * 0.22 * hatch, inBand);
  /* scanline shimmer */
  col *= 0.85 + 0.15 * sin(q.y * 140.0 + uTime * 6.0);
  return col;
}

void main() {
  float edge = roundsDissolve(vDis, uSolid);
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vView);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.5);
  vec3 L1 = normalize(vec3(-0.5, 0.8, 0.6));
  vec3 H = normalize(L1 + V);
  float spec = pow(max(dot(N, H), 0.0), 90.0);
  vec3 body = vec3(0.07, 0.072, 0.09);
  vec3 col = body * (0.6 + 0.4 * max(dot(N, L1), 0.0));
  col += vec3(0.82, 0.65, 0.3) * fres * 0.9;
  col += vec3(1.0, 0.95, 0.85) * spec * 0.5;
  /* front (+z) and back (−z) faces carry the ticker */
  if (abs(vLocal.z) > 0.019) {
    vec2 uv = vec2(vLocal.x / (2.0 * uHalf.x) + 0.5, vLocal.y / (2.0 * uHalf.y) + 0.5);
    if (vLocal.z < 0.0) uv.x = 1.0 - uv.x;
    vec3 t = ticker(uv) * uTicker;
    col += t * (1.0 - fres * 0.6);
    /* soft inner glow around glyphs */
    col += vec3(0.82, 0.65, 0.3) * 0.02;
  }
  col += uEdgeColor * edge * 2.4;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
