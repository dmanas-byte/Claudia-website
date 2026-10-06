/*
 * Procedural "terminal" data wall. Every glyph is a 3×5 dot-matrix pattern
 * picked by hash — decorative noise, never real data. The DOM overlay says
 * SAMPLE DATA; the diagonal hatch behind the columns says it again.
 */
#include term-hash.glsl;
uniform float uTime;
uniform float uFade;
uniform float uCols;
uniform float uMirror;
uniform float uOpacity;
uniform vec2 uSize;
uniform vec3 uTerminal;
uniform vec3 uBone;
uniform vec3 uAsh;
uniform vec3 uGreen;
uniform vec3 uRed;
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormalW;

/* ten 3×5 bitmaps, 15 bits each (MSB = top-left) */
float digitPattern(float d) {
  if (d < 0.5) return 31599.0;
  if (d < 1.5) return 11415.0;
  if (d < 2.5) return 29671.0;
  if (d < 3.5) return 29647.0;
  if (d < 4.5) return 23497.0;
  if (d < 5.5) return 31183.0;
  if (d < 6.5) return 31215.0;
  if (d < 7.5) return 29257.0;
  if (d < 8.5) return 31727.0;
  return 31695.0;
}

/* c: cell uv in [0,1]², returns dot-matrix coverage of digit d */
float glyph(vec2 c, float d) {
  vec2 g = (c - vec2(0.16, 0.12)) / vec2(0.68, 0.76);
  if (g.x < 0.0 || g.x > 1.0 || g.y < 0.0 || g.y > 1.0) return 0.0;
  vec2 gs = g * vec2(3.0, 5.0);
  vec2 cell = floor(gs);
  float bit = cell.y * 3.0 + (2.0 - cell.x);
  float on = floor(mod(digitPattern(d) / exp2(bit), 2.0));
  vec2 f = fract(gs);
  vec2 e = fwidth(gs) * 0.8;
  float px = smoothstep(0.1, 0.1 + e.x, f.x) * smoothstep(0.9, 0.9 - e.x, f.x) *
             smoothstep(0.1, 0.1 + e.y, f.y) * smoothstep(0.9, 0.9 - e.y, f.y);
  return on * px;
}
float dotGlyph(vec2 c) {
  return step(abs(c.x - 0.5), 0.12) * step(abs(c.y - 0.19), 0.08);
}
float signGlyph(vec2 c, float plus) {
  float h = step(abs(c.x - 0.5), 0.3) * step(abs(c.y - 0.5), 0.07);
  float v = step(abs(c.x - 0.5), 0.07) * step(abs(c.y - 0.5), 0.3);
  return max(h, v * plus);
}
float triGlyph(vec2 c, float up) {
  float y = up > 0.5 ? (c.y - 0.25) / 0.5 : (0.75 - c.y) / 0.5;
  if (y < 0.0 || y > 1.0) return 0.0;
  return step(abs(c.x - 0.5), 0.32 * (1.0 - y));
}

/* one scrolling column of fake quotes: returns rgb */
vec3 numbersColumn(float ci, float cx, float my, float colW, float t, float type) {
  float hc = termHash11(ci * 7.1 + 1.0);
  float cellW = (colW - 0.3) / 11.3;
  float cellH = cellW * 1.55;
  float dir = hc > 0.78 ? -1.0 : 1.0;
  float speed = (0.25 + 0.75 * termHash11(ci * 3.7 + 9.0)) * 0.55 * dir;
  float yy = (my + t * speed) / cellH;
  float ri = floor(yy);
  float fy = fract(yy);
  float xx = (cx - 0.15) / cellW;
  if (xx < 0.0) return vec3(0.0);
  float k = floor(xx);
  float fx = fract(xx);
  vec2 c = vec2(fx, fy);
  float hl = termHash21(vec2(ci, ri));
  if (hl < 0.14) return vec3(0.0); /* blank line */
  float hs = termHash21(vec2(ri * 1.7, ci + 11.0));
  float up = step(0.5, hs);
  vec3 tick = mix(uRed, uGreen, up);
  float d = floor(termHash31(vec3(ci, ri, k)) * 10.0);
  vec3 col = vec3(0.0);
  float g = 0.0;
  if (type < 0.5) {
    /* [4 ash digits] gap [12.34 bone] gap [▲] */
    if (k < 4.0) { g = glyph(c, d); col = uAsh * 0.55; }
    else if (k >= 5.0 && k < 10.0) { g = k == 7.0 ? dotGlyph(c) : glyph(c, d); col = mix(uBone, uTerminal, 0.35) * 1.05; }
    else if (k == 11.0) { g = triGlyph(c, up); col = tick; }
  } else if (type < 1.5) {
    /* [123.4 bone] gap [+1.23 colored] */
    if (k < 5.0) { g = k == 3.0 ? dotGlyph(c) : glyph(c, d); col = mix(uBone, uTerminal, 0.35) * 1.05; }
    else if (k >= 6.0 && k < 11.0) {
      if (k == 6.0) g = signGlyph(c, up); else if (k == 8.0) g = dotGlyph(c); else g = glyph(c, d);
      col = tick * 1.05;
    }
  } else {
    /* [+12.3 colored] gap [bars] */
    if (k < 5.0) {
      if (k == 0.0) g = signGlyph(c, up); else if (k == 3.0) g = dotGlyph(c); else g = glyph(c, d);
      col = tick * 1.05;
    } else if (k >= 6.0 && k < 11.0) {
      float bh = termHash31(vec3(ri, k, ci + 5.0)) * 0.7 + 0.1;
      g = step(abs(c.x - 0.5), 0.28) * step(c.y, bh) * step(0.12, c.y);
      col = tick * 0.6;
    }
  }
  /* a cell blinks bright now and then: the "tick" */
  float blink = step(0.985, termHash31(vec3(ci, ri, floor(t * 3.0) + k * 0.13)));
  col = mix(col, uBone * 1.6, blink * step(0.001, g));
  /* a few rows pulse as if they just updated */
  float fresh = step(0.9, hl) * (0.5 + 0.5 * sin(t * 2.4 + hl * 40.0));
  return col * g * (1.0 + fresh * 0.6);
}

float sparkVal(float i, float p) {
  float h = termHash21(vec2(i, p));
  return 0.5 + 0.2 * sin(i * 0.37 + p * 7.0) + 0.13 * sin(i * 0.91 + p * 3.0) + (h - 0.5) * 0.2;
}

vec3 sparkPanel(float pi, float px, float py, float t) {
  float seed = termHash11(pi * 13.7 + 2.0);
  float spd = 0.5 + 0.5 * seed;
  vec3 col = vec3(0.0);
  /* chart area */
  vec2 q = (vec2(px, py) - vec2(0.06, 0.14)) / vec2(0.88, 0.58);
  float inside = step(0.0, q.x) * step(q.x, 1.0) * step(0.0, q.y) * step(q.y, 1.0);
  float s = q.x * 28.0 + t * spd;
  float i = floor(s);
  float v = mix(sparkVal(i, seed), sparkVal(i + 1.0, seed), fract(s));
  float v0 = sparkVal(floor(t * spd), seed);
  float v1 = sparkVal(floor(28.0 + t * spd), seed);
  vec3 tint = v1 >= v0 ? uGreen : uRed;
  float d = q.y - v;
  float w = fwidth(q.y) * 1.3;
  float line = 1.0 - smoothstep(0.0, w * 1.6, abs(d));
  float glow = exp(-abs(d) * 18.0) * 0.32;
  float fill = step(d, 0.0) * 0.07 * (1.0 + d * 1.5);
  col += tint * (line * 1.15 + glow + max(fill, 0.0)) * inside;
  /* baseline */
  float base = 1.0 - smoothstep(0.0, w * 1.4, abs(q.y)) ;
  col += uAsh * base * inside * 0.35;
  /* label: 4 ash digits top-left, 4 colored top-right */
  vec2 lab = (vec2(px, py) - vec2(0.06, 0.78)) / vec2(0.055, 0.16);
  if (lab.y > 0.0 && lab.y < 1.0 && lab.x > 0.0) {
    float k = floor(lab.x);
    vec2 c = vec2(fract(lab.x), lab.y);
    if (k < 4.0) col += uAsh * 0.6 * glyph(c, floor(termHash21(vec2(pi, k)) * 10.0));
    if (k >= 10.0 && k < 15.0) {
      float g = k == 10.0 ? signGlyph(c, step(v0, v1)) : (k == 12.0 ? dotGlyph(c) : glyph(c, floor(termHash21(vec2(pi + 3.0, k)) * 10.0)));
      col += tint * g;
    }
  }
  return col;
}

vec3 headerTicker(float mx, float my, float bandH, float t) {
  float cellW = 0.5;
  float cellH = 0.82;
  float x = (mx + t * 1.1) / cellW;
  float k = floor(x);
  float g = floor(k / 13.0);
  float kk = mod(k, 13.0);
  vec2 c = vec2(fract(x), (my - (bandH - cellH) * 0.5) / cellH);
  if (c.y < 0.0 || c.y > 1.0) return vec3(0.0);
  float hs = termHash11(g * 5.3 + 0.5);
  float up = step(0.5, hs);
  vec3 tick = mix(uRed, uGreen, up);
  float d = floor(termHash21(vec2(g, kk)) * 10.0);
  float gl = 0.0;
  vec3 col = vec3(0.0);
  if (kk < 4.0) { gl = glyph(c, d); col = uBone * 1.1; }
  else if (kk >= 5.0 && kk < 10.0) {
    if (kk == 5.0) gl = signGlyph(c, up); else if (kk == 7.0) gl = dotGlyph(c); else gl = glyph(c, d);
    col = tick * 1.1;
  } else if (kk == 10.0) { gl = triGlyph(c, up); col = tick; }
  return col * gl;
}

void main() {
  vec2 uv = mix(vUv, vec2(vUv.x, 1.0 - vUv.y), uMirror);
  vec2 m = uv * uSize;
  float t = uTime;
  vec3 col = vec3(0.0);

  /* glass base + faint diagonal "sample data" hatch behind everything */
  col += vec3(0.008, 0.014, 0.020);
  float hatch = smoothstep(0.42, 0.5, fract((m.x + m.y) * 0.32)) * smoothstep(0.98, 0.9, fract((m.x + m.y) * 0.32));
  col += uTerminal * 0.022 * hatch;
  col += uTerminal * 0.018;

  float colW = uSize.x / uCols;
  float ci = floor(uv.x * uCols);
  float cx = m.x - ci * colW;
  float wX = fwidth(m.x) * 1.4;
  float wY = fwidth(m.y) * 1.4;

  /* bands: numbers 0–0.56, sparklines 0.60–0.80, header 0.84–1 */
  if (uv.y < 0.56) {
    float type = mod(ci, 3.0);
    col += numbersColumn(ci, cx, m.y, colW, t, type);
    /* column rules */
    col += uAsh * 0.22 * (1.0 - smoothstep(0.0, wX, cx)) ;
  } else if (uv.y > 0.60 && uv.y < 0.80) {
    float nP = max(2.0, floor(uCols * 0.5));
    float pw = uSize.x / nP;
    float pi = floor(uv.x * nP);
    float px = (m.x - pi * pw) / pw;
    float py = (uv.y - 0.60) / 0.20;
    col += sparkPanel(pi, px, py, t);
    col += uAsh * 0.22 * (1.0 - smoothstep(0.0, wX / pw, px));
  } else if (uv.y > 0.84) {
    float bandH = 0.16 * uSize.y;
    col += headerTicker(m.x, m.y - 0.84 * uSize.y, bandH, t);
  }
  /* band rules */
  float r1 = 1.0 - smoothstep(0.0, wY, abs(m.y - 0.58 * uSize.y));
  float r2 = 1.0 - smoothstep(0.0, wY, abs(m.y - 0.82 * uSize.y));
  col += uAsh * 0.3 * max(r1, r2);

  /* CRT: scanlines, a slow refresh bar, vignette */
  float scan = 0.9 + 0.1 * sin(m.y * 95.0 - t * 0.8);
  float bar = exp(-pow((uv.y - fract(-t * 0.06)) * 9.0, 2.0)) * 0.07;
  float vig = pow(16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y), 0.14);
  col = (col + uTerminal * bar) * scan * vig;

  /* glass fresnel (wall only) */
  vec3 vdir = normalize(cameraPosition - vWorld);
  float fres = pow(1.0 - abs(dot(normalize(vNormalW), vdir)), 3.0);
  col += uTerminal * fres * 0.05 * (1.0 - uMirror);

  float fade = uFade * mix(1.0, 1.0 - uv.y * 0.85, uMirror);
  gl_FragColor = vec4(col * fade, uOpacity * fade);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
