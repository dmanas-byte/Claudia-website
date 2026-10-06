/* after <normal_fragment_maps>: perturb the view-space normal with the weave
   (screen-space derivatives of the procedural height, as bumpmap does) */
#ifndef BAG_CHEAP
{
  float weave = bagCanvasHeight(vBagPos, vBagNrm, 240.0);
  /* threads fade out as they shrink below ~3 px so they never sparkle */
  float px = fwidth(vBagPos.x + vBagPos.y + vBagPos.z);
  float threads = weave * (1.0 - smoothstep(0.0012, 0.0045, px));
  /* crinkles and slubs: the soft creasing of worn cotton */
  float crinkle = bagNoise(vBagPos * 38.0) * 0.6 + bagNoise(vBagPos * 95.0) * 0.4;
  float h = threads * 0.35 + crinkle * 0.65;
  float bumpScale = 0.0016 * (1.0 + 0.5 * vBagScuff);
  float dHdx = dFdx(h) * bumpScale;
  float dHdy = dFdy(h) * bumpScale;
  vec3 vSigmaX = dFdx(-vViewPosition);
  vec3 vSigmaY = dFdy(-vViewPosition);
  vec3 vN = normal;
  vec3 R1 = cross(vSigmaY, vN);
  vec3 R2 = cross(vN, vSigmaX);
  float fDet = dot(vSigmaX, R1);
  vec3 vGrad = sign(fDet) * (dHdx * R1 + dHdy * R2);
  normal = normalize(abs(fDet) * normal - vGrad);
}
#endif
