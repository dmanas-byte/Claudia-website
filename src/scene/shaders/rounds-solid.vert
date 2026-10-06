/* shared vertex stage for every rounds solid (meshes and instanced meshes) */
attribute float aGlow; /* optional per-instance 0..1 */
varying vec2 vUv;
varying vec3 vLocal;   /* object space, before the instance transform */
varying vec3 vDis;     /* dissolve coordinate (object space + instance offset) */
varying vec3 vNormal;  /* view space */
varying vec3 vView;    /* view-space position */
varying float vGlow;
void main() {
  vUv = uv;
  vLocal = position;
  vec3 n = normal;
  vec4 p = vec4(position, 1.0);
  vec3 off = vec3(0.0);
  #ifdef USE_INSTANCING
    p = instanceMatrix * p;
    n = mat3(instanceMatrix) * n;
    off = instanceMatrix[3].xyz;
  #endif
  vDis = position + off * 3.1;
  vNormal = normalize(normalMatrix * n);
  vec4 mv = modelViewMatrix * p;
  vView = mv.xyz;
  vGlow = aGlow;
  gl_Position = projectionMatrix * mv;
}
