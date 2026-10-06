/* soft additive halo behind the phone: cool lock-screen spill, ember on the flash */
uniform vec3 uCool;
uniform vec3 uEmberCol;
uniform float uEmber;
uniform float uGain;
varying vec2 vUv;
void main() {
  vec2 q = (vUv - 0.5) * 2.0;
  q.x *= 1.6;
  float d = length(q);
  float a = exp(-d * d * 3.2) * (1.0 - smoothstep(0.75, 1.0, d));
  vec3 c = mix(uCool, uEmberCol, clamp(uEmber * 1.5, 0.0, 1.0)) * a * uGain;
  gl_FragColor = vec4(c, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
