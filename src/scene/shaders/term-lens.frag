/* emissive lens disc: bone-white when the fixture is on (bloom catches it) */
uniform vec3 uColor;
varying vec2 vUv;
varying float vI;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  float ring = 1.0 - smoothstep(0.86, 1.0, d);
  float lens = mix(1.0, 0.55, d * d);
  vec3 off = vec3(0.045, 0.045, 0.05) * lens;
  vec3 on = uColor * (2.6 * lens + 0.8 * (1.0 - smoothstep(0.0, 0.35, d)));
  vec3 c = mix(off, on, clamp(vI, 0.0, 1.0)) + on * max(0.0, vI - 1.0) * 0.6;
  gl_FragColor = vec4(c * ring + off * (1.0 - ring), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
