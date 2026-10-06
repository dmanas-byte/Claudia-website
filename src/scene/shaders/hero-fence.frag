uniform vec2 uSize;
uniform float uPeriod;
uniform float uWire;
uniform float uFade;
uniform vec3 uBase;
uniform vec3 uGold;
uniform vec3 uLampA;
uniform vec3 uLampB;
uniform vec3 uTarget;
uniform float uSpill;
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormalW;

float beamSpill(vec3 p, vec3 lamp, vec3 tgt) {
  vec3 d = normalize(tgt - lamp);
  vec3 toP = p - lamp;
  float t = dot(toP, d);
  vec3 c = lamp + d * max(t, 0.0);
  float ang = distance(p, c) / max(t, 0.5);
  return exp(-ang * ang * 9.0);
}
void main() {
  vec2 m = vUv * uSize;
  float s = 0.70710678;
  float u = (m.x + m.y) * s;
  float v = (m.x - m.y) * s;
  float fu = abs(fract(u / uPeriod) - 0.5) * uPeriod;
  float fv = abs(fract(v / uPeriod) - 0.5) * uPeriod;
  float aa = max(fwidth(u), 0.0005) * 0.75;
  float w = uWire * (1.0 - uFade);
  float lu = 1.0 - smoothstep(w - aa, w + aa, fu);
  float lv = 1.0 - smoothstep(w - aa, w + aa, fv);
  float cover = max(lu, lv);
  if (cover < 0.5) discard;
  float shade = lu > lv ? (1.0 - fu / max(w, 0.0001)) : (1.0 - fv / max(w, 0.0001));
  shade = 0.45 + 0.55 * sqrt(clamp(shade, 0.0, 1.0));
  vec3 vdir = normalize(cameraPosition - vWorld);
  vec3 n = normalize(vNormalW);
  float fres = pow(1.0 - abs(dot(n, vdir)), 2.0);
  float spill = (beamSpill(vWorld, uLampA, uTarget) + beamSpill(vWorld, uLampB, uTarget)) * uSpill;
  float heightTone = 0.5 + 0.5 * vUv.y;
  vec3 col = uBase * shade * (0.35 + 0.65 * heightTone) * (1.0 + 0.9 * fres);
  col += uGold * (0.03 + 0.35 * spill) * shade;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
