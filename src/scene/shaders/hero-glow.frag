uniform vec3 uColor;
uniform float uIntensity;
uniform vec2 uFalloff;
uniform float uCore;
varying vec2 vUv;
void main() {
  vec2 p = vUv * 2.0;
  float gx = exp(-p.x * p.x * uFalloff.x);
  float gy = exp(-p.y * p.y * uFalloff.y);
  float streak = gx * gy;
  float core = exp(-dot(p, p) * uCore);
  float a = (streak + core * 0.9) * uIntensity;
  gl_FragColor = vec4(uColor * a, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
