/* Round 3 — translucent terminal-tinted panes that turn gold one by one */
#include rounds-dissolve.glsl;
uniform float uSolid;
uniform float uTime;
uniform vec3 uEdgeColor;
uniform vec3 uTint;
uniform vec3 uGlowColor;
uniform float uGlowLevel;
varying vec2 vUv;
varying vec3 vDis;
varying vec3 vNormal;
varying vec3 vView;
varying float vGlow;
void main() {
  float edge = roundsDissolve(vDis, uSolid);
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vView);
  float fres = pow(1.0 - abs(dot(N, V)), 2.5);
  float g = smoothstep(vGlow, vGlow + 0.05, uGlowLevel);
  /* a sweep crosses the pane as it turns on */
  float sweep = exp(-pow((vUv.x - (uGlowLevel - vGlow) * 12.0 + 0.5) * 3.0, 2.0)) * step(0.001, g) * (1.0 - g * 0.6);
  vec3 col = mix(uTint, uGlowColor, g);
  float alpha = mix(0.10, 0.16, g) + fres * 0.2 + sweep * 0.5;
  /* faint grid inside the pane so it reads as a slide / week card */
  float gx = step(0.985, fract(vUv.x * 6.0)) + step(0.97, fract(vUv.y * 4.0));
  col += vec3(0.95, 0.93, 0.9) * gx * 0.15 * (0.4 + g);
  col += vec3(1.0, 0.96, 0.86) * sweep * 0.8;
  col += uEdgeColor * edge * 2.0;
  alpha = max(alpha, edge);
  gl_FragColor = vec4(col * (0.9 + g * 0.5), alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
