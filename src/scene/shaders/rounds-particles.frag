uniform vec3 uColor;
uniform float uIntensity;
varying float vAlpha;
varying float vHot;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d2 = dot(c, c);
  if (d2 > 0.25) discard;
  float disc = exp(-d2 * 12.0);
  vec3 col = mix(uColor, vec3(1.0, 0.95, 0.85), vHot * 0.4);
  float a = disc * vAlpha * uIntensity;
  gl_FragColor = vec4(col * a, a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
