uniform vec3 uGold;
uniform vec3 uBone;
uniform float uIntensity;
varying float vA;
varying float vHot;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d2 = dot(c, c);
  if (d2 > 0.25) discard;
  float disc = exp(-d2 * 10.0) * (1.0 - d2 * 4.0);
  vec3 col = mix(uGold, uBone, vHot * 0.6);
  gl_FragColor = vec4(col * disc * vA * uIntensity, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
