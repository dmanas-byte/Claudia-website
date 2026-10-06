/* instanced surface with a per-instance intensity */
attribute float aIntensity;
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormalW;
varying float vI;
void main() {
  vUv = uv;
  vI = aIntensity;
  mat4 m = modelMatrix * instanceMatrix;
  vec4 w = m * vec4(position, 1.0);
  vWorld = w.xyz;
  vNormalW = normalize(mat3(m) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}
