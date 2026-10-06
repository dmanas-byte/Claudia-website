/* 20k crowd lights: slow wave by angle (period ~6 s) + per-seat jitter */
attribute float aSeed;
attribute float aAngle;
uniform float uTime;
uniform float uScale;
uniform float uIntensity;
uniform float uSizeM;
varying vec3 vCol;
varying float vLum;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float wave = 0.5 + 0.5 * sin(aAngle - uTime * 1.0472 + (aSeed - 0.5) * 1.6);
  wave = pow(wave, 2.4);
  float wave2 = 0.5 + 0.5 * sin(-2.0 * aAngle + uTime * 0.6 + aSeed * 3.0);
  float flick = 0.82 + 0.18 * sin(uTime * (1.5 + aSeed * 5.0) + aSeed * 97.0);
  float dist = length(mv.xyz);
  float fog = 1.0 - smoothstep(30.0, 160.0, dist);
  vLum = (0.12 + 0.7 * wave + 0.18 * wave2 * wave2) * flick * uIntensity * fog;
  vec3 warm = mix(vec3(1.0, 0.72, 0.42), vec3(1.0, 0.9, 0.74), fract(aSeed * 7.31));
  vec3 cool = vec3(0.85, 0.96, 1.0);
  vCol = mix(warm, cool, step(0.965, aSeed));
  float size = uSizeM * (0.8 + 0.4 * fract(aSeed * 13.7));
  gl_PointSize = clamp(size * uScale / max(0.5, -mv.z), 1.0, 9.0);
  gl_Position = projectionMatrix * mv;
}
