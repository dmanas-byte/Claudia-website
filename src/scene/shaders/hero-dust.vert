attribute vec4 aSeed;
uniform float uTime;
uniform float uDrift;
uniform float uWind;
uniform float uPixelScale;
uniform float uBeam;
uniform vec3 uLampA;
uniform vec3 uLampB;
uniform vec3 uLampC;
uniform vec3 uTarget;
uniform vec3 uTargetC;
uniform float uBox;
varying float vLit;
varying float vTw;

float beam(vec3 p, vec3 lamp, vec3 tgt, float r) {
  vec3 d = tgt - lamp;
  float L = length(d);
  d /= L;
  float t = clamp(dot(p - lamp, d), 0.0, L);
  vec3 c = lamp + d * t;
  float rad = r * (0.08 + 0.92 * t / L);
  float q = distance(p, c) / rad;
  return exp(-q * q * 2.0);
}
void main() {
  float ph = aSeed.x * 6.2831;
  float sp = 0.4 + aSeed.y * 0.8;
  vec3 p = position;
  float t = uDrift * sp;
  p.x += sin(t * 0.37 + ph) * 0.6 + sin(t * 0.11 + ph * 2.0) * 1.2;
  p.y += sin(t * 0.23 + ph * 1.7) * 0.35 + uDrift * 0.03 * sp;
  p.z += cos(t * 0.29 + ph * 0.6) * 0.6;
  /* wrap the vertical drift into the box */
  p.y = mod(p.y, uBox);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float lit = beam(p, uLampA, uTarget, 2.6) + beam(p, uLampB, uTarget, 2.6) + beam(p, uLampC, uTargetC, 1.2) * 0.8;
  vLit = clamp(lit * uBeam, 0.0, 1.0);
  vTw = 0.55 + 0.45 * sin(uTime * (1.5 + aSeed.z * 3.0) + ph);
  float size = (0.8 + aSeed.w * 1.4) * uPixelScale;
  gl_PointSize = clamp(size / max(0.5, -mv.z), 1.0, 16.0);
  gl_Position = projectionMatrix * mv;
}
