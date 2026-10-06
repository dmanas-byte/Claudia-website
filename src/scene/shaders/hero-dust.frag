uniform vec3 uColor;
uniform float uIntensity;
uniform float uAmbient;
varying float vLit;
varying float vTw;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d2 = dot(c, c);
  if (d2 > 0.25) discard;
  float disc = exp(-d2 * 14.0);
  float a = disc * vTw * (uAmbient + vLit) * uIntensity;
  gl_FragColor = vec4(uColor * a, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
