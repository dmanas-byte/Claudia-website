/* generic dark lit solid with a fresnel rim, used for housings, bodies, the keyring torus */
#include rounds-dissolve.glsl;
uniform float uSolid;
uniform vec3 uColor;
uniform vec3 uEmissive;
uniform float uEmissiveStrength;
uniform vec3 uRim;
uniform float uRimStrength;
uniform float uMetal;
uniform vec3 uEdgeColor;
varying vec3 vLocal;
varying vec3 vDis;
varying vec3 vNormal;
varying vec3 vView;
varying float vGlow;
void main() {
  float edge = roundsDissolve(vDis, uSolid);
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vView);
  /* fake key (upper front-left) and cool fill from the right */
  vec3 L1 = normalize(vec3(-0.5, 0.8, 0.6));
  vec3 L2 = normalize(vec3(0.8, 0.1, 0.4));
  float d1 = max(dot(N, L1), 0.0);
  float d2 = max(dot(N, L2), 0.0);
  vec3 H = normalize(L1 + V);
  float spec = pow(max(dot(N, H), 0.0), 36.0) * (0.4 + 0.6 * uMetal);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  vec3 col = uColor * (0.18 + d1 * 0.9 + d2 * 0.25);
  col += vec3(1.0, 0.93, 0.8) * spec * 0.6;
  col += uRim * fres * uRimStrength;
  col += uEmissive * uEmissiveStrength * (0.6 + 0.4 * vGlow);
  col += uEdgeColor * edge * 2.2;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
