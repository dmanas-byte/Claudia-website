/* phone body + lock screen + sliding notification card (text is DOM) */
uniform float uIn;
uniform float uEmber;
uniform float uTime;
uniform float uFade;
uniform float uComp; /* 1/exposure: Mood dims shot 07 to 18 %, the phone must still read */
uniform vec2 uSize;
uniform vec3 uBone;
uniform vec3 uEmberCol;
uniform vec3 uTerminal;
varying vec2 vUv;

float rbox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 p = (vUv - 0.5) * uSize;
  float aa = max(fwidth(p.x), 0.00005) * 1.2;
  float body = rbox(p, uSize * 0.5, 0.011);
  float bodyA = 1.0 - smoothstep(0.0, aa, body);
  float bezel = 1.0 - smoothstep(0.0, aa, abs(body + 0.0011) - 0.00035);
  vec2 sHalf = uSize * 0.5 - vec2(0.0028, 0.0036);
  float screen = rbox(p, sHalf, 0.0075);
  float screenA = 1.0 - smoothstep(0.0, aa, screen);

  /* lock screen: near black, faint cool glow, a blurred smear where a clock would be */
  vec3 scr = vec3(0.012, 0.016, 0.024);
  float glow = exp(-length((p - vec2(0.0, 0.035)) / vec2(0.055, 0.075)) * 1.6);
  scr += mix(uTerminal, uBone, 0.6) * glow * 0.05;
  float smear = exp(-pow(length((p - vec2(0.0, 0.046)) / vec2(0.02, 0.0065)), 2.0));
  scr += uBone * smear * 0.06;
  float island = 1.0 - smoothstep(0.0, aa, rbox(p - vec2(0.0, 0.0705), vec2(0.011, 0.0028), 0.0028));
  scr = mix(scr, vec3(0.0), island);
  float home = 1.0 - smoothstep(0.0, aa, rbox(p - vec2(0.0, -0.0725), vec2(0.011, 0.0004), 0.0004));
  scr += uBone * home * 0.1;

  /* notification card slides down from above the screen top */
  vec2 cardHalf = vec2(sHalf.x - 0.003, 0.0155);
  float yTarget = sHalf.y - 0.0075 - cardHalf.y;
  float yStart = sHalf.y + cardHalf.y + 0.006;
  float x1 = uIn - 1.0;
  float e = 1.0 + 2.2 * x1 * x1 * x1 + 1.2 * x1 * x1; /* back.out(1.2) */
  float cy = mix(yStart, yTarget, e);
  vec2 cp = p - vec2(0.0, cy);
  float card = rbox(cp, cardHalf, 0.0045);
  float cardA = (1.0 - smoothstep(0.0, aa, card)) * step(0.001, uIn);
  float shadow = (1.0 - smoothstep(0.0, 0.006, card)) * 0.55 * step(0.001, uIn);
  scr *= 1.0 - shadow;
  vec3 cardCol = vec3(0.13, 0.13, 0.16);
  float edge = exp(-max(0.0, cp.x + cardHalf.x) / 0.0035);
  cardCol += uEmberCol * edge * 0.55;
  /* faint icon square at left so the block reads as a notification */
  float icon = 1.0 - smoothstep(0.0, aa, rbox(cp - vec2(-cardHalf.x + 0.0095, 0.0), vec2(0.0045), 0.0012));
  cardCol = mix(cardCol, mix(uEmberCol, uBone, 0.25) * 0.28, icon * 0.9);
  scr = mix(scr, cardCol, cardA);

  /* ember flash across the whole screen when the card lands */
  scr += uEmberCol * uEmber * 2.2;

  vec3 col = vec3(0.02, 0.02, 0.025) * bodyA;
  col = mix(col, scr, screenA);
  col += uBone * bezel * 0.11 * bodyA;
  gl_FragColor = vec4(col * uFade * uComp, bodyA * uFade);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
