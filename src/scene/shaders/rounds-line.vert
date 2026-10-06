/* wireframe lines: optional per-vertex sway (keys) and glow threshold (panes) */
attribute float aSway;  /* 0 = rigid, k>0 = sways with phase k */
attribute float aGlow;  /* glow threshold compared against uGlowLevel */
uniform float uTime;
uniform float uSway;    /* sway amplitude (rad) */
uniform vec3 uPivot;    /* object-space pivot for the sway */
varying vec3 vLocal;
varying float vGlow;
void main() {
  vec3 p = position;
  if (aSway > 0.5) {
    float a = uSway * sin(uTime * 1.3 + aSway * 2.1) ;
    vec3 q = p - uPivot;
    float ca = cos(a), sa = sin(a);
    q.xy = mat2(ca, -sa, sa, ca) * q.xy;
    p = q + uPivot;
  }
  vLocal = position;
  vGlow = aGlow;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
