/* worn canvas: procedural weave bump, mottling and scuffed-edge wear.
   Injected into MeshPhysicalMaterial after <common> (fragment). */
varying vec3 vBagPos;
varying vec3 vBagNrm;
varying float vWear;
/* set by bag-canvas-color, read by bag-canvas-normal */
float vBagScuff = 0.0;

float bagHash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float bagNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(bagHash(i), bagHash(i + vec3(1, 0, 0)), f.x), mix(bagHash(i + vec3(0, 1, 0)), bagHash(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(bagHash(i + vec3(0, 0, 1)), bagHash(i + vec3(1, 0, 1)), f.x), mix(bagHash(i + vec3(0, 1, 1)), bagHash(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
}
/* plain weave height: two thread directions, over/under alternating */
float bagWeave(vec2 p) {
  float warp = abs(sin(p.x * 3.14159));
  float weft = abs(sin(p.y * 3.14159));
  float over = step(0.0, sin(p.x * 1.5708) * sin(p.y * 1.5708));
  return mix(warp * 0.7 + weft * 0.3, weft * 0.7 + warp * 0.3, over);
}
/* triplanar weave in object space, p in metres, f threads per metre */
float bagCanvasHeight(vec3 p, vec3 n, float f) {
  vec3 w = pow(abs(n), vec3(4.0));
  w /= (w.x + w.y + w.z + 1e-4);
  return w.x * bagWeave(p.yz * f) + w.y * bagWeave(p.xz * f) + w.z * bagWeave(p.xy * f);
}
