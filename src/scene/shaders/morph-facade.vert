attribute float aSeed;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vSeed;
varying float vYFrac;
varying float vDist;
varying vec3 vView;
uniform float uHeight;
#include <fog_pars_vertex>
void main() {
  vSeed = aSeed;
  mat4 im = modelMatrix * instanceMatrix;
  vec4 wp = im * vec4(position, 1.0);
  vWorld = wp.xyz;
  /* axis-aligned boxes with axis-aligned scale: direction survives normalisation */
  vNormal = normalize(mat3(im) * normal);
  /* height of the full (unscaled) box in world units for the band logic */
  vYFrac = wp.y / max(0.001, uHeight * im[1][1]);
  vec4 mvPosition = viewMatrix * wp;
  vDist = -mvPosition.z;
  vView = cameraPosition - wp.xyz;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
