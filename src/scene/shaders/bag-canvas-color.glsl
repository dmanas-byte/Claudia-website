/* after <color_fragment>: mottled dye, dust in the creases, scuffed edges */
{
  float mottle = bagNoise(vBagPos * 16.0) * 0.6 + bagNoise(vBagPos * 47.0) * 0.4;
  diffuseColor.rgb *= 0.84 + 0.32 * mottle;
  /* sun-faded top surfaces */
  diffuseColor.rgb *= 1.0 + 0.12 * max(0.0, vBagNrm.y);
  /* scuffs: lighter, warmer, where the vertex wear mask and a noise mask agree */
  float scuffMask = smoothstep(0.3, 0.8, bagNoise(vBagPos * 23.0 + 7.0) * 0.6 + bagNoise(vBagPos * 90.0) * 0.4);
  float scuff = clamp(vWear * (0.35 + 0.9 * scuffMask), 0.0, 1.0);
  vec3 scuffColor = vec3(0.13, 0.115, 0.09);
  diffuseColor.rgb = mix(diffuseColor.rgb, scuffColor * (0.7 + 0.6 * mottle), scuff * 0.5);
  vBagScuff = scuff;
}
