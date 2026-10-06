varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormalW;
void main() {
  vUv = uv;
  vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vNormalW = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}
