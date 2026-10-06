/*
 * Noise dissolve shared by every solid in the rounds track.
 * `solid` is 0 (fully dissolved) .. 1 (fully there). Discards dissolved
 * fragments and returns a 0..1 "edge" factor for the gold glow at the front.
 */
#include rounds-noise.glsl;

float roundsDissolve(vec3 p, float solid) {
  if (solid >= 1.0) return 0.0;
  if (solid <= 0.0) discard;
  float n = roundsNoise(p * 9.0) * 0.65 + roundsNoise(p * 27.0 + 7.3) * 0.35;
  /* threshold sweeps 1.1 → -0.1 so the first and last fragments really do flip */
  float th = 1.1 - solid * 1.2;
  float d = n - th;
  if (d < 0.0) discard;
  float edge = 1.0 - smoothstep(0.0, 0.14, d);
  return edge * (1.0 - smoothstep(0.85, 1.0, solid));
}
