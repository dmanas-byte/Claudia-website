varying vec3 vCol;
varying float vLum;
void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p) * 2.0;
  if (d > 1.0) discard;
  float a = exp(-d * d * 3.6) * (1.0 - smoothstep(0.7, 1.0, d));
  float core = smoothstep(0.42, 0.0, d);
  vec3 c = vCol * (a * 0.7 + core * 1.3) * vLum;
  gl_FragColor = vec4(c, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
