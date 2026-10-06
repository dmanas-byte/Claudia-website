/* soft dark contact shadow under the backpack: elliptical radial gradient */
uniform float uStrength;
varying vec2 vUv;
void main() {
  vec2 p = vUv * 2.0;
  float d = length(p);
  float a = (1.0 - smoothstep(0.25, 1.0, d)) * uStrength;
  gl_FragColor = vec4(0.0, 0.0, 0.0, a);
}
