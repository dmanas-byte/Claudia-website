#include rounds-dissolve.glsl;
uniform float uSolid;
uniform vec3 uColor;
uniform float uIntensity;
uniform vec3 uEdgeColor;
uniform vec3 uGlowColor;
uniform float uGlowLevel;  /* lines whose aGlow < uGlowLevel take uGlowColor (default -1: none) */
uniform float uGlint;      /* position of the glint band along uGlintAxis, normalised (−0.5 .. 1.5) */
uniform vec3 uGlintAxis;   /* object-space axis (scaled by 1/extent) */
uniform float uGlintWidth;
varying vec3 vLocal;
varying float vGlow;
void main() {
  float edge = roundsDissolve(vLocal, uSolid);
  float along = dot(vLocal, uGlintAxis) + 0.5;
  float glint = exp(-pow((along - uGlint) / max(uGlintWidth, 0.001), 2.0) * 4.0);
  float g = smoothstep(vGlow, vGlow + 0.04, uGlowLevel);
  vec3 col = mix(uColor * uIntensity, uGlowColor * (uIntensity + 1.2), g);
  col += vec3(1.0, 0.96, 0.86) * glint * 1.6;
  col += uEdgeColor * edge * 2.0;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
