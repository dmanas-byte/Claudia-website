/* Round 2 — rounded dark panel: phone body (bezel) or message bubble (ember left edge) */
#include rounds-dissolve.glsl;
uniform float uSolid;
uniform float uTime;
uniform vec3 uEdgeColor;
uniform vec2 uHalf;         /* half size of the plane */
uniform float uRadius;      /* corner radius */
uniform float uBezel;       /* bezel width (0 = none) */
uniform vec3 uBezelColor;
uniform vec3 uFill;
uniform vec3 uAccent;       /* left-edge glow color */
uniform float uAccentStrength;
uniform float uLines;       /* number of faint abstract bars inside (0 = none) */
uniform float uGloss;
varying vec2 vUv;
varying vec3 vLocal;
varying vec3 vDis;
varying vec3 vNormal;
varying vec3 vView;

float rrect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  float d = rrect(vLocal.xy, uHalf, uRadius);
  if (d > 0.0) discard;
  float edge = roundsDissolve(vDis, uSolid);
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vView);
  vec3 col = uFill;
  /* subtle vertical gradient on the fill */
  col *= 0.85 + 0.3 * (vLocal.y / max(uHalf.y, 0.001) * 0.5 + 0.5);
  /* soft screen glow near the top where the alert lands */
  col += vec3(0.16, 0.17, 0.22) * smoothstep(-0.2, 1.0, vLocal.y / max(uHalf.y, 0.001)) * (1.0 - step(0.5, uLines));
  /* bezel band */
  float bez = uBezel > 0.0 ? smoothstep(-uBezel - 0.002, -uBezel, d) : 0.0;
  col = mix(col, uBezelColor, bez);
  /* thin highlight on the very rim */
  col += vec3(0.95, 0.92, 0.86) * 0.25 * smoothstep(-0.0015, 0.0, d);
  /* ember left edge */
  float lx = (vLocal.x + uHalf.x) / (2.0 * uHalf.x);
  col += uAccent * uAccentStrength * exp(-lx * 22.0);
  col += uAccent * uAccentStrength * 0.35 * (1.0 - smoothstep(0.0, 0.08, lx)) ;
  /* faint abstract bars (no glyphs, no text) */
  if (uLines > 0.5) {
    vec2 q = (vLocal.xy + uHalf) / (2.0 * uHalf);
    float row = floor(q.y * (uLines + 1.0));
    float fy = fract(q.y * (uLines + 1.0));
    float len = 0.55 + 0.35 * roundsHash(vec3(row, 5.0, 1.0));
    float bar = step(0.42, fy) * step(fy, 0.58) * step(0.12, q.x) * step(q.x, len) * step(0.5, row) * step(row, uLines);
    col += vec3(0.6, 0.6, 0.64) * bar * 0.55;
  }
  /* glossy screen */
  vec3 L1 = normalize(vec3(-0.5, 0.8, 0.6));
  vec3 H = normalize(L1 + V);
  float spec = pow(max(dot(N, H), 0.0), 60.0);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 4.0);
  col += (vec3(1.0, 0.95, 0.85) * spec * 0.35 + vec3(0.82, 0.65, 0.3) * fres * 0.5) * uGloss;
  col += uEdgeColor * edge * 2.2;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
