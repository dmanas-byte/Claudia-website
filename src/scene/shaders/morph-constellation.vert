attribute float aSeed;
uniform float uTime;
uniform float uFade;
uniform float uPixelScale;
varying float vA;
varying float vHot;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float ph = aSeed * 6.2831853;
  float tw = 0.65 + 0.35 * sin(uTime * (0.9 + aSeed * 1.6) + ph);
  /* stars light up in a scatter as the fade comes in */
  float in1 = smoothstep(aSeed * 0.6, aSeed * 0.6 + 0.4, uFade);
  vHot = step(0.86, aSeed);
  /* dust is faint; the silhouette stars carry the drawing */
  vA = tw * in1 * mix(0.16, 1.0, vHot);
  float size = mix(0.1 + 0.1 * fract(aSeed * 7.31), 0.32 + 0.1 * fract(aSeed * 7.31), vHot);
  gl_PointSize = clamp(2.0 * size * uPixelScale / max(0.5, -mv.z), 1.0, 12.0);
  gl_Position = projectionMatrix * mv;
}
