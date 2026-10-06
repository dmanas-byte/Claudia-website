import{r as e}from"./rolldown-runtime-hePW80VL.js";import{a as t,n}from"./react-1HyPLV13.js";import{A as r,B as i,C as a,D as o,E as s,F as c,G as l,H as u,I as d,L as f,M as p,N as m,O as h,P as g,R as _,S as v,T as y,U as b,V as x,W as S,_ as ee,a as te,b as ne,c as re,d as C,f as ie,g as w,h as T,i as ae,j as E,k as D,l as oe,m as O,n as se,o as ce,p as le,r as ue,s as de,t as k,u as fe,v as pe,w as me,x as he,y as A,z as ge}from"./three-ByqtLUcr.js";import{a as _e,i as ve,n as ye,o as j,r as M,t as be}from"./index-enNGmwDO.js";var N=e(t(),1),P={octagonRadius:5,fenceHeight:1.85,postCount:8,postAngleOffset:Math.PI/8,towerHeight:34,towerWidth:2.2,cityExtent:90,lightRig:{y:14,cols:6,rows:5,spacing:2.2},terminalWall:{center:[0,6,-40],width:40,height:12},phone:{center:[22,1.6,-22]},seats:{innerRadius:11,outerRadius:26,rows:18},constellation:{center:[0,46,0],size:14}},xe=()=>Array.from({length:P.postCount},(e,t)=>{let n=P.postAngleOffset+t/P.postCount*Math.PI*2;return[Math.cos(n)*P.octagonRadius,0,Math.sin(n)*P.octagonRadius]}),F={x:0,y:1.7,zStart:14,zEnd:-14},Se=e=>{let t=(e-.5)/6;return[.68,1.55,F.zStart+(F.zEnd-F.zStart)*t-3.2]},Ce=(e,t)=>{let n=(t-.5)/6,r=Math.abs(e-n)/.08333333333333333;return Math.max(0,Math.min(1,(1-r)/.55))},we=e=>e,[Te,Ee,De]=P.terminalWall.center,[I,L,R]=P.phone.center,z=[{from:{pos:[.95,1.2,4.15],target:[-.9,-.12,0],fov:42},to:{pos:[.7,1.12,3.35],target:[-.78,-.08,0],fov:42},ease:we,still:{pos:[.85,1.16,3.8],target:[-.84,-.1,0],fov:42}},{from:{pos:[.7,1.12,3.35],target:[-.78,-.08,0],fov:42},via:[{pos:[1.5,1.3,3.1],target:[-.4,.35,0]}],to:{pos:[2.3,1.45,2.6],target:[-.1,.55,0],fov:42},still:{pos:[1.6,1.35,3.3],target:[-.3,.4,0],fov:42}},{from:{pos:[2.3,1.45,2.6],target:[-.1,.55,0],fov:42},via:[{pos:[3.2,9,7.5],target:[0,1.5,0]}],to:{pos:[.5,32,11],target:[0,0,0],fov:48},still:{pos:[3.2,12,9],target:[0,2,0],fov:46}},{from:{pos:[-14,28,16],target:[0,10,-2],fov:46},to:{pos:[14,26,16],target:[0,8,-2],fov:46},ease:we,still:{pos:[0,27,16],target:[0,9,-2],fov:46}},{from:{pos:[F.x,F.y,F.zStart],target:[0,1.55,F.zStart-3.2],fov:44},to:{pos:[F.x,F.y,F.zEnd],target:[0,1.55,F.zEnd-3.2],fov:44},ease:we,still:{pos:[F.x,F.y,0],target:[0,1.55,-3.2],fov:44}},{from:{pos:[Te+6,2.2,De+16],target:[Te,Ee-1,De],fov:46},to:{pos:[Te-4,2.6,De+11],target:[Te,Ee,De],fov:46},still:{pos:[Te,2.4,De+13],target:[Te,Ee-.5,De],fov:46}},{from:{pos:[I-.17,L+.01,R+.72],target:[I-.17,L+.01,R],fov:40},to:{pos:[I-.15,L+.02,R+.56],target:[I-.15,L+.02,R],fov:40},still:{pos:[I-.16,L+.015,R+.62],target:[I-.16,L+.015,R],fov:40},portrait:{pos:[I,L+.1,R+.95],target:[I,L+.1,R],fov:40}},{from:{pos:[0,7,6],target:[0,1.5,0],fov:46},to:{pos:[0,30,33],target:[0,4,0],fov:52},still:{pos:[0,20,22],target:[0,3,0],fov:50}},{from:{pos:[0,2.2,7.5],target:[0,P.lightRig.y-2,0],fov:50},to:{pos:[0,3.5,6],target:[0,P.lightRig.y,0],fov:50},still:{pos:[0,2.8,7],target:[0,P.lightRig.y-1,0],fov:50}},{from:{pos:[-9,2.4,3],target:[0,3,0],fov:44},to:{pos:[-8,2.8,5],target:[0,3.5,0],fov:44}},{from:{pos:[9,3,4],target:[0,2.5,0],fov:44},to:{pos:[10,4,6],target:[0,3,0],fov:44}},{from:{pos:[0,14,30],target:[0,10,0],fov:46},to:{pos:[0,66,78],target:[0,18,0],fov:50},ease:ye,still:{pos:[0,54,64],target:[0,16,0],fov:50}}];if(z.length!==_e)throw Error(`cameraPath: expected ${_e} shots, got ${z.length}`);var Oe=z.map(e=>{let t=[e.from,...e.via??[],e.to].map(e=>new S(...e.pos)),n=[e.from,...e.via??[],e.to].map(e=>new S(...e.target));return{pts:t,tgs:n,pos:t.length>2?new ee(t,!1,`centripetal`):null,tgt:n.length>2?new ee(n,!1,`centripetal`):null}}),ke=new S,Ae=new S;function je(e,t,n,r,i=!1){let a=z[Math.max(0,Math.min(z.length-1,e))],o=Oe[Math.max(0,Math.min(z.length-1,e))];if(i&&a.portrait)return n.set(...a.portrait.pos),r.set(...a.portrait.target),a.portrait.fov??a.from.fov??45;let s=(a.ease??ye)(Math.max(0,Math.min(1,t)));o.pos?o.pos.getPointAt(s,n):n.copy(ke.set(...a.from.pos)).lerp(Ae.set(...a.to.pos),s),o.tgt?o.tgt.getPointAt(s,r):r.copy(ke.set(...a.from.target)).lerp(Ae.set(...a.to.target),s);let c=a.from.fov??45;return c+((a.to.fov??c)-c)*s}function Me(e,t,n,r=!1){let i=z[Math.max(0,Math.min(z.length-1,e))];return r&&i.portrait?(t.set(...i.portrait.pos),n.set(...i.portrait.target),i.portrait.fov??i.from.fov??45):i.still?(t.set(...i.still.pos),n.set(...i.still.target),i.still.fov??i.from.fov??45):je(e,.5,t,n)}function Ne(){let e=ie(e=>e.camera),t=(0,N.useRef)(new S),n=(0,N.useRef)(new S),r=(0,N.useRef)(new S(0,1.6,4.6)),i=(0,N.useRef)(new S(0,.45,0)),a=(0,N.useRef)(-1),o=(0,N.useRef)(42);return C((s,c)=>{let l=be.getState(),u=j.getState().reducedMotion,d=u?0:l.shotProgress,f=e.aspect<1,p;p=u?Me(l.shot,t.current,n.current,f):je(l.shot,d,t.current,n.current,f);let m=l.shot!==a.current;a.current=l.shot;let h=m?1:1-Math.exp(-c*18);if(r.current.lerp(t.current,h),i.current.lerp(n.current,h),o.current+=(p-o.current)*h,e.position.copy(r.current),u)e.lookAt(i.current);else{let t=performance.now()*.001,n=.0087,r=Math.sin(t*.37)*.6+Math.sin(t*.91+1.3)*.4,a=Math.sin(t*.29+.7)*.6+Math.sin(t*1.13)*.4;e.lookAt(i.current),e.rotateY(r*n),e.rotateX(a*n)}let g=e.aspect||1,_=g<1?(1-g)*14:0,v=o.current+_;Math.abs(e.fov-v)>.01&&(e.fov=v,e.updateProjectionMatrix())}),null}var B=n();function Pe(){let e=(0,N.useRef)(null),t=(0,N.useRef)(null),n=(0,N.useRef)(new b(6e-4,4e-4));return C(()=>{let r=be.getState();if(e.current&&(e.current.intensity=.75+r.flash*2.6),t.current){let e=5e-4+r.wind*.0025+r.flash*.004;n.current.set(e,e*.6),t.current.offset=n.current}}),(0,B.jsxs)(te,{multisampling:0,enableNormalPass:!1,children:[(0,B.jsx)(ue,{ref:e,mipmapBlur:!0,intensity:.75,luminanceThreshold:.85,luminanceSmoothing:.2,radius:.7}),(0,B.jsx)(ae,{ref:t,blendFunction:re.NORMAL,offset:n.current,radialModulation:!0,modulationOffset:.3}),(0,B.jsx)(de,{eskil:!1,offset:.22,darkness:.75}),(0,B.jsx)(ce,{mode:oe.ACES_FILMIC})]})}function V(){let e=be.getState(),t=j.getState(),n=e.shotFloat;return{shot:e.shot,shotProgress:e.shotProgress,shotFloat:n,progress:e.progress,wind:e.wind,flash:e.flash,pointer:e.pointer,reduced:t.reducedMotion,lowPower:t.lowPower,local:(e,t=0,r=1)=>{let i=Math.min(1,Math.max(0,n-e));return Math.min(1,Math.max(0,(i-t)/(r-t)))},span:(e,t)=>Math.min(1,Math.max(0,(n-e)/(t+1-e)))}}function Fe(){let{mat:e,uniforms:t}=(0,N.useMemo)(()=>{let e={uOctagon:{value:P.octagonRadius*Math.cos(Math.PI/8)},uGrid:{value:.022},uGridFade:{value:.05}},t=new E({color:`#08080c`,roughness:.4,metalness:.35});return t.onBeforeCompile=t=>{Object.assign(t.uniforms,e),t.vertexShader=t.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vFloorWorld;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vFloorWorld = (modelMatrix * vec4(position, 1.0)).xyz;`),t.fragmentShader=t.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec3 vFloorWorld;
uniform float uOctagon;
uniform float uGrid;
uniform float uGridFade;
float heroFloorHash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float heroFloorNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(heroFloorHash(i), heroFloorHash(i + vec2(1.0, 0.0)), u.x), mix(heroFloorHash(i + vec2(0.0, 1.0)), heroFloorHash(i + vec2(1.0, 1.0)), u.x), u.y);
}`).replace(`#include <color_fragment>`,`#include <color_fragment>
vec2 fp = vFloorWorld.xz;
/* regular octagon with flat edges facing the axes: apothem uOctagon */
vec2 ap = abs(fp);
float octD = max(max(ap.x, ap.y), (ap.x + ap.y) * 0.70710678) - uOctagon;
float heroInside = 1.0 - smoothstep(-0.12, 0.08, octD);
/* canvas: slightly warmer, slightly lighter, a little woven noise */
float weave = heroFloorNoise(fp * 9.0) * 0.5 + heroFloorNoise(fp * 37.0) * 0.5;
vec3 canvas = vec3(0.0075, 0.0068, 0.006) * (0.8 + 0.4 * weave);
diffuseColor.rgb = mix(diffuseColor.rgb, canvas, heroInside);
/* the octagon's edge: a slightly darker seam */
diffuseColor.rgb *= 1.0 - 0.35 * (1.0 - smoothstep(0.0, 0.06, abs(octD)));`).replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.85, heroInside);`).replace(`#include <metalnessmap_fragment>`,`#include <metalnessmap_fragment>
metalnessFactor = mix(metalnessFactor, 0.05, heroInside);`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
{
  vec2 gp = fp - 0.5;
  vec2 gw = fwidth(gp) * 1.2;
  vec2 gl = 1.0 - smoothstep(vec2(0.0), gw, abs(fract(gp) - 0.5));
  float line = max(gl.x, gl.y);
  float dist = distance(vFloorWorld, cameraPosition);
  float fade = exp(-dist * uGridFade);
  /* no grid on the canvas, no grid where the plane is seen nearly edge-on */
  totalEmissiveRadiance += vec3(0.92, 0.9, 0.86) * uGrid * line * fade * (1.0 - heroInside * 0.85);
}`)},t.customProgramCacheKey=()=>`hero-floor-grid`,{mat:t,uniforms:e}},[]);return C(()=>{let e=V();t.uGrid.value=(.02+.022*e.span(2,3))*(1+e.flash*.5),t.uGridFade.value=e.shotFloat>=3?.035:.05}),(0,B.jsx)(`mesh`,{"rotation-x":-Math.PI/2,"position-y":0,receiveShadow:!0,material:e,children:(0,B.jsx)(`planeGeometry`,{args:[P.cityExtent*3,P.cityExtent*3]})})}var Ie=`varying vec3 vNormalW;
varying vec3 vWorld;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Le=`float heroHash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float heroNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = heroHash(i);
  float b = heroHash(i + vec2(1.0, 0.0));
  float c = heroHash(i + vec2(0.0, 1.0));
  float d = heroHash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float heroFbm(vec2 p, int oct) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    if (i >= oct) break;
    v += a * heroNoise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}
uniform vec3 uColor;
uniform float uIntensity;
uniform float uTime;
uniform float uSoft;
varying vec3 vNormalW;
varying vec3 vWorld;
varying vec2 vUv;
void main() {
  vec3 v = normalize(cameraPosition - vWorld);
  float facing = abs(dot(normalize(vNormalW), v));
  
  float along = 1.0 - vUv.y;
  
  float edge = pow(facing, uSoft);
  
  float len = (0.06 + 0.94 * pow(1.0 - along, 2.6)) * (0.3 + 0.7 * smoothstep(0.0, 0.12, along));
  float baseFade = smoothstep(1.0, 0.8, along);
  float flick = 0.92 + 0.08 * sin(uTime * 7.3 + vUv.x * 6.283) * sin(uTime * 3.1);
  float dust = 0.7 + 0.6 * heroFbm(vec2(vUv.x * 6.0 + uTime * 0.05, along * 5.0 - uTime * 0.12), 3);
  float a = edge * len * baseFade * flick * dust * uIntensity;
  gl_FragColor = vec4(uColor * a, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,Re=`varying vec2 vUv;
void main() {
  vUv = uv - 0.5;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,ze=`uniform vec3 uColor;
uniform float uIntensity;
uniform vec2 uFalloff;
uniform float uCore;
varying vec2 vUv;
void main() {
  vec2 p = vUv * 2.0;
  float gx = exp(-p.x * p.x * uFalloff.x);
  float gy = exp(-p.y * p.y * uFalloff.y);
  float streak = gx * gy;
  float core = exp(-dot(p, p) * uCore);
  float a = (streak + core * 0.9) * uIntensity;
  gl_FragColor = vec4(uColor * a, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,Be=new S(-4,8,3),Ve=new S(4,8,3),He=new S(0,.4,0),Ue=1.7,We=`#fff1d6`,Ge=`#ffe3b4`;function Ke(e,t,n){let r=e.y/Math.max(.001,e.y-t.y);return n.copy(t).sub(e).multiplyScalar(r).add(e)}var qe=Ke(Be,He,new S),Je=Ke(Ve,He,new S);function H(e,t,n,r=.15){return h.smoothstep(e,t-r*.5,t+r*.5)*(1-h.smoothstep(e,n-r,n))}function Ye(e){let t=e.shotFloat,n=H(t,0,3,.4),r=1-.75*e.local(2,.3,.9),i=H(t,7,9,.2),a=H(t,11,12.5,.2);return Math.max(.15,n*r,i,a)}var Xe=Ue*1.05,Ze=new S,Qe=new S(0,1,0);function $e(e,t){let n=e.distanceTo(t),r=new S().addVectors(e,t).multiplyScalar(.5);return Ze.subVectors(e,t).normalize(),{len:n,pos:r,quat:new c().setFromUnitVectors(Qe,Ze)}}function et(e){return new f({vertexShader:Ie,fragmentShader:Le,uniforms:{uColor:{value:new A(e)},uIntensity:{value:.5},uTime:{value:0},uSoft:{value:2.2}},transparent:!0,depthWrite:!1,blending:2,side:0,fog:!1})}function tt(e){return new f({vertexShader:Re,fragmentShader:ze,uniforms:{uColor:{value:new A(e)},uIntensity:{value:1},uFalloff:{value:new b(5.5,70)},uCore:{value:22}},transparent:!0,depthWrite:!1,depthTest:!1,blending:2,fog:!1})}function nt(){let e=ie(e=>e.camera),t=(0,N.useRef)(null),n=(0,N.useRef)(null),r=(0,N.useRef)(null),i=(0,N.useRef)(null),a=(0,N.useRef)(null),o=(0,N.useRef)(0),{coneGeo:s,matA:c,matB:l,flareGeo:u,flareMatA:d,flareMatB:f,tA:m,tB:h,fixtureGeo:_,fixtureMat:v,fixtureMatrices:y}=(0,N.useMemo)(()=>{let e=$e(Be,qe),t=$e(Ve,Je),n=new ne(Xe,1,48,1,!0),r=new g(1,1),i=new O(.42,.3,.5),a=new E({color:`#111216`,roughness:.6,metalness:.6}),o=new p,s=[Be,Ve].map(e=>(o.position.copy(e),o.lookAt(He),o.updateMatrix(),o.matrix.clone()));return{coneGeo:n,matA:et(We),matB:et(Ge),flareGeo:r,flareMatA:tt(`#ffe9c4`),flareMatB:tt(`#ffe0a8`),tA:e,tB:t,fixtureGeo:i,fixtureMat:a,fixtureMatrices:s}},[]);return(0,N.useLayoutEffect)(()=>{let e=a.current;e&&(e.setMatrixAt(0,y[0]),e.setMatrixAt(1,y[1]),e.instanceMatrix.needsUpdate=!0)},[y]),C((a,s)=>{let u=V();u.reduced||(o.current+=Math.min(s,.1));let p=Ye(u),m=p*(1+u.flash*1.6),h=p>.02,g=[[t.current,c,.32],[n.current,l,.27]];for(let[e,t,n]of g)e&&(e.visible=h,t.uniforms.uIntensity.value=n*m,t.uniforms.uTime.value=o.current,t.uniforms.uSoft.value=u.lowPower?1.4:1.7);let _=[[r.current,d,.6],[i.current,f,.55]];for(let[t,n,r]of _)t&&(t.visible=h,t.quaternion.copy(e.quaternion),n.uniforms.uIntensity.value=r*m*(.9+.1*Math.sin(o.current*5.1)))}),(0,B.jsxs)(`group`,{children:[(0,B.jsx)(`mesh`,{ref:t,geometry:s,material:c,position:m.pos,quaternion:m.quat,scale:[1,m.len,1],renderOrder:20,frustumCulled:!1}),(0,B.jsx)(`mesh`,{ref:n,geometry:s,material:l,position:h.pos,quaternion:h.quat,scale:[1,h.len,1],renderOrder:20,frustumCulled:!1}),(0,B.jsx)(`mesh`,{ref:r,geometry:u,material:d,position:Be,scale:[3.5,.75,1],renderOrder:30}),(0,B.jsx)(`mesh`,{ref:i,geometry:u,material:f,position:Ve,scale:[3.5,.75,1],renderOrder:30}),(0,B.jsx)(`instancedMesh`,{ref:a,args:[_,v,2],frustumCulled:!1})]})}var rt=new A(`#15161C`),it=new A(`#5a4a36`),at=new A,[ot,st,ct]=P.terminalWall.center;function lt(){let e=j(e=>e.lowPower),t=(0,N.useRef)(null),n=(0,N.useRef)(null),r=(0,N.useRef)(null),i=(0,N.useRef)(null),a=(0,N.useMemo)(()=>{let e=new p;return e.position.copy(He),e},[]);return C(()=>{let e=V(),a=1+e.flash*2.2,o=Ye(e)*a;if(t.current&&(t.current.intensity=1500*o),n.current&&(n.current.intensity=600*o),r.current){let t=e.span(2,3);at.copy(rt).lerp(it,t),r.current.color.copy(at),r.current.intensity=(.14+.5*t)*(1+e.flash*.6)}i.current&&(i.current.intensity=90*H(e.shotFloat,5,6,.15)*a)}),(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)(`primitive`,{object:a}),(0,B.jsx)(`ambientLight`,{intensity:.05,color:`#8b8c93`}),(0,B.jsx)(`spotLight`,{ref:t,position:Be,target:a,color:We,intensity:1500,angle:.19,penumbra:.7,decay:2,distance:0,castShadow:!e,"shadow-mapSize":[1024,1024],"shadow-bias":-4e-4,"shadow-normalBias":.02,"shadow-camera-near":2,"shadow-camera-far":18}),(0,B.jsx)(`spotLight`,{ref:n,position:Ve,target:a,color:Ge,intensity:600,angle:.19,penumbra:.7,decay:2,distance:0}),(0,B.jsx)(`hemisphereLight`,{ref:r,args:[`#15161C`,`#07070A`,.14]}),(0,B.jsx)(`pointLight`,{ref:i,position:[ot,st-2,ct+4],color:`#38E8FF`,intensity:0,distance:45,decay:2})]})}var U=new S(.8,0,1.2),ut=.95,dt=`#fff6e4`;function ft(e){return H(e.shotFloat,0,2.75,.5)}var pt=.12,mt=7.5,ht=1.6,gt=new m(new S(0,1,0),0),_t=new d,vt=new b,yt=new S,bt=new S,xt=new S,St=new S,Ct=new S(0,1,0),wt=new c;function Tt(){let e=ie(e=>e.camera),t=(0,N.useRef)(null),n=(0,N.useRef)(null),r=(0,N.useRef)(0),i=(0,N.useRef)(2.6),a=(0,N.useRef)({x:NaN,y:NaN}),o=(0,N.useRef)(new S(.8,0,1.2)),{coneGeo:s,coneMat:c,discGeo:l,discMat:u}=(0,N.useMemo)(()=>({coneGeo:new ne(ut*1.05,1,40,1,!0),coneMat:new f({vertexShader:Ie,fragmentShader:Le,uniforms:{uColor:{value:new A(dt)},uIntensity:{value:.5},uTime:{value:0},uSoft:{value:2.4}},transparent:!0,depthWrite:!1,blending:2,side:0,fog:!1}),discGeo:new g(1,1),discMat:new f({vertexShader:Re,fragmentShader:ze,uniforms:{uColor:{value:new A(dt)},uIntensity:{value:.6},uFalloff:{value:new b(5.5,5.5)},uCore:{value:9}},transparent:!0,depthWrite:!1,blending:2,fog:!1})}),[]);return C((s,l)=>{let d=V(),f=Math.min(l,.1);d.reduced||(r.current+=f);let p=ft(d),m=p>.01;t.current&&(t.current.visible=m),n.current&&(n.current.visible=m);let g=be.getState().pointerPx,_=g.x>-5e3;if(_&&(g.x!==a.current.x||g.y!==a.current.y)){if(a.current.x=g.x,a.current.y=g.y,i.current=0,vt.set(d.pointer.x,d.pointer.y),_t.setFromCamera(vt,e),_t.ray.intersectPlane(gt,yt)){let e=Math.hypot(yt.x,yt.z);e>mt&&yt.multiplyScalar(mt/e),o.current.set(yt.x,0,yt.z)}}else i.current+=f;let v=j.getState().touch,y=_?v?h.smoothstep(i.current,ht,4.1):0:1,b=r.current;if(bt.copy(o.current),bt.x+=y*(Math.sin(b*.21)*1.3+Math.sin(b*.077+1)*.6),bt.z+=y*(Math.sin(b*.17+2.1)*.9+Math.cos(b*.053)*.5),d.reduced)U.copy(o.current);else{let e=1-Math.exp(-f/pt);U.lerp(bt,e)}if(!m)return;let x=1+d.flash*1.4;if(xt.set(U.x+.35,7,U.z+.25),t.current){let e=xt.distanceTo(U);t.current.position.addVectors(xt,U).multiplyScalar(.5),St.subVectors(xt,U).normalize(),wt.setFromUnitVectors(Ct,St),t.current.quaternion.copy(wt),t.current.scale.set(1,e,1),c.uniforms.uIntensity.value=.2*p*x,c.uniforms.uTime.value=b}if(n.current){n.current.position.set(U.x,.025,U.z);let e=ut*2.6;n.current.scale.set(e,e,1),u.uniforms.uIntensity.value=.1*p*x}}),(0,B.jsxs)(`group`,{children:[(0,B.jsx)(`mesh`,{ref:t,geometry:s,material:c,renderOrder:21,frustumCulled:!1}),(0,B.jsx)(`mesh`,{ref:n,geometry:l,material:u,"rotation-x":-Math.PI/2,renderOrder:12,frustumCulled:!1})]})}var Et=`varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Dt=`float heroHash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float heroNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = heroHash(i);
  float b = heroHash(i + vec2(1.0, 0.0));
  float c = heroHash(i + vec2(0.0, 1.0));
  float d = heroHash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float heroFbm(vec2 p, int oct) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    if (i >= oct) break;
    v += a * heroNoise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}
uniform float uTime;
uniform float uOpacity;
uniform int uOctaves;
uniform float uScale;
uniform float uThreshold;

uniform vec4 uSpotA;
uniform vec4 uSpotB;
uniform vec4 uCursor;
uniform vec3 uColorDark;
uniform vec3 uColorLit;
uniform float uExtent;
uniform float uWind;
varying vec3 vWorld;

float pool(vec2 p, vec4 s) {
  float d = distance(p, s.xy) / max(s.z, 0.001);
  return exp(-d * d * 2.2) * s.w;
}
void main() {
  vec2 p = vWorld.xz * uScale;
  float t = uTime * (0.02 + uWind * 0.06);
  
  vec2 q = vec2(
    heroFbm(p + vec2(t, t * 0.7), uOctaves),
    heroFbm(p + vec2(5.2, 1.3) - vec2(t * 0.6, t), uOctaves));
  float n = heroFbm(p + 1.9 * q + vec2(t * 0.5, -t * 0.3), uOctaves);
  
  float tear = heroFbm(p * 2.2 - q * 2.0 + vec2(-t * 0.8, t * 0.4), 2);
  float dens = smoothstep(uThreshold, uThreshold + 0.24, n) * (0.25 + 0.75 * smoothstep(0.3, 0.7, tear));
  
  float rad = length(vWorld.xz);
  dens *= 1.0 - smoothstep(uExtent * 0.45, uExtent * 0.95, rad);
  float dc = distance(vWorld, cameraPosition);
  dens *= smoothstep(0.6, 2.4, dc);

  float la = pool(vWorld.xz, uSpotA);
  float lb = pool(vWorld.xz, uSpotB);
  float lc = pool(vWorld.xz, uCursor);
  float lit = la + lb + lc;
  float lit1 = clamp(lit, 0.0, 1.0);
  
  vec3 col = mix(uColorDark, uColorLit, lit1) * (0.3 + 0.3 * min(lit, 1.5));
  float alpha = dens * uOpacity * (0.18 + 0.55 * lit1);
  gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,Ot=120,kt=`#15161C`,At=`#f2eee6`;function jt(e){let t=e.shotFloat,n=H(t,0,3.2,.3)*(1-e.local(2,.3,.9)),r=.45*H(t,7,9,.2),i=.4*H(t,11,12.5,.25);return Math.max(n,r,i)}function Mt(e,t){return new f({vertexShader:Et,fragmentShader:Dt,uniforms:{uTime:{value:0},uOpacity:{value:1},uOctaves:{value:3},uScale:{value:t},uThreshold:{value:e},uSpotA:{value:new l(qe.x,qe.z,Ue*.85,1)},uSpotB:{value:new l(Je.x,Je.z,Ue*.85,1)},uCursor:{value:new l(0,0,ut,1)},uColorDark:{value:new A(kt)},uColorLit:{value:new A(At)},uExtent:{value:Ot},uWind:{value:0}},transparent:!0,depthWrite:!1,blending:1,side:2,fog:!1})}function Nt(){let e=(0,N.useRef)(null),t=(0,N.useRef)(null),n=(0,N.useRef)(0),{geo:r,matLow:i,matHigh:a}=(0,N.useMemo)(()=>({geo:new g(Ot,Ot,1,1),matLow:Mt(.44,1.2),matHigh:Mt(.55,.6)}),[]);return C((r,o)=>{let s=V();s.reduced||(n.current+=Math.min(o,.1));let c=jt(s),l=c>.01;if(e.current&&(e.current.visible=l),t.current&&(t.current.visible=l&&!s.lowPower),!l)return;let u=Ye(s)*(1+s.flash*1.5),d=.6*ft(s)*(1+s.flash*1.2),f=s.lowPower?2:3;for(let[e,t]of[[i,.85],[a,.38]])e.uniforms.uTime.value=n.current,e.uniforms.uOctaves.value=f,e.uniforms.uOpacity.value=t*c,e.uniforms.uWind.value=s.wind,e.uniforms.uSpotA.value.w=u,e.uniforms.uSpotB.value.w=u,e.uniforms.uCursor.value.set(U.x,U.z,ut,d)}),(0,B.jsxs)(`group`,{children:[(0,B.jsx)(`mesh`,{ref:e,geometry:r,material:i,"rotation-x":-Math.PI/2,"position-y":.03,renderOrder:10,frustumCulled:!1}),(0,B.jsx)(`mesh`,{ref:t,geometry:r,material:a,"rotation-x":-Math.PI/2,"position-y":.6,renderOrder:11,frustumCulled:!1})]})}var Pt=`attribute vec4 aSeed;
uniform float uTime;
uniform float uDrift;
uniform float uWind;
uniform float uPixelScale;
uniform float uBeam;
uniform vec3 uLampA;
uniform vec3 uLampB;
uniform vec3 uLampC;
uniform vec3 uTarget;
uniform vec3 uTargetC;
uniform float uBox;
varying float vLit;
varying float vTw;

float beam(vec3 p, vec3 lamp, vec3 tgt, float r) {
  vec3 d = tgt - lamp;
  float L = length(d);
  d /= L;
  float t = clamp(dot(p - lamp, d), 0.0, L);
  vec3 c = lamp + d * t;
  float rad = r * (0.08 + 0.92 * t / L);
  float q = distance(p, c) / rad;
  return exp(-q * q * 2.0);
}
void main() {
  float ph = aSeed.x * 6.2831;
  float sp = 0.4 + aSeed.y * 0.8;
  vec3 p = position;
  float t = uDrift * sp;
  
  p.x += sin(t * 0.37 + ph) * 0.6 + sin(t * 0.11 + ph * 2.0) * 1.2 + uWind * 1.5 * sin(ph);
  p.y += sin(t * 0.23 + ph * 1.7) * 0.35 + uDrift * 0.03 * sp;
  p.z += cos(t * 0.29 + ph * 0.6) * 0.6;
  
  p.y = mod(p.y, uBox);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float lit = beam(p, uLampA, uTarget, 2.4) + beam(p, uLampB, uTarget, 2.4) + beam(p, uLampC, uTargetC, 1.1) * 0.8;
  vLit = clamp(lit * uBeam, 0.0, 1.0);
  vTw = 0.5 + 0.5 * sin(uTime * (1.5 + aSeed.z * 3.0) + ph);
  float size = (0.7 + aSeed.w * 1.5) * uPixelScale;
  gl_PointSize = clamp(size / max(0.5, -mv.z), 1.0, 14.0);
  gl_Position = projectionMatrix * mv;
}`,Ft=`uniform vec3 uColor;
uniform float uIntensity;
uniform float uAmbient;
varying float vLit;
varying float vTw;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d2 = dot(c, c);
  if (d2 > 0.25) discard;
  float disc = exp(-d2 * 14.0);
  float a = disc * vTw * (uAmbient + vLit) * uIntensity;
  gl_FragColor = vec4(uColor * a, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,It=`#D2A64B`,Lt={x:18,y:7,z:18},Rt=16e3,zt=3e3,Bt=.009,Vt=[1,1,.85,.3,.35,0,0,.8,.6,.5,.4,.75];function Ht(){let e=j(e=>e.lowPower),t=(0,N.useRef)(null),n=ie(e=>e.size),r=ie(e=>e.viewport),i=ie(e=>e.camera),a=(0,N.useRef)(0),o=(0,N.useRef)(0),s=(0,N.useRef)(1),{geo:c,mat:l}=(0,N.useMemo)(()=>{let t=e?zt:Rt,n=new Float32Array(t*3),r=new Float32Array(t*4),i=1234.567,a=()=>(i=(i*9301+49297)%233280,i/233280);for(let e=0;e<t;e++){let t=a()*Math.PI*2,i=a()**.6*Lt.x*.5;n[e*3]=Math.cos(t)*i,n[e*3+1]=a()*Lt.y,n[e*3+2]=Math.sin(t)*i,r[e*4]=a(),r[e*4+1]=a(),r[e*4+2]=a(),r[e*4+3]=a()}let o=new w;return o.setAttribute(`position`,new T(n,3)),o.setAttribute(`aSeed`,new T(r,4)),o.boundingSphere=new _(new S(0,Lt.y/2,0),Lt.x),{geo:o,mat:new f({vertexShader:Pt,fragmentShader:Ft,uniforms:{uTime:{value:0},uDrift:{value:0},uWind:{value:0},uPixelScale:{value:300},uBeam:{value:1},uLampA:{value:Be.clone()},uLampB:{value:Ve.clone()},uLampC:{value:new S(0,7,0)},uTarget:{value:He.clone()},uTargetC:{value:new S},uBox:{value:Lt.y},uColor:{value:new A(It)},uIntensity:{value:1},uAmbient:{value:.1}},transparent:!0,depthWrite:!1,blending:2,fog:!1})}},[e]);return(0,N.useEffect)(()=>()=>{c.dispose(),l.dispose()},[c,l]),C((e,c)=>{let u=V(),d=Math.min(c,.1);u.reduced||(o.current+=d,a.current+=d*(1+u.wind*4));let f=(Vt[u.shot]??.5)*(u.shot===2?1-.6*u.local(2,.5,1):1);s.current+=(f-s.current)*(1-Math.exp(-d*4));let p=s.current>.02;if(t.current&&(t.current.visible=p),!p)return;let m=l.uniforms;m.uTime.value=o.current,m.uDrift.value=a.current,m.uWind.value=u.wind;let h=i.fov*Math.PI/180;m.uPixelScale.value=n.height*r.dpr/(2*Math.tan(h/2))*Bt,m.uBeam.value=Ye(u)*(1+u.flash),m.uLampC.value.set(U.x+.35,7,U.z+.25),m.uTargetC.value.copy(U),m.uIntensity.value=s.current*(.65+u.wind*1.4)*(1+u.flash*1.2),m.uAmbient.value=.03+.1*H(u.shotFloat,7,12.5,.2)}),(0,B.jsx)(`points`,{ref:t,geometry:c,material:l,renderOrder:25,frustumCulled:!1})}new S(0,.52,0);var Ut=`#1e1f26`,Wt=`#272833`,Gt=`#D2A64B`,W={w:.36,h:.46,d:.22},Kt=.14,qt=.1,G={hx:W.w/2*.86,hz:W.d/2*.9},Jt=-G.hz,Yt=1.2,Xt=.016;function Zt(){let e=new se(W.w,W.h,W.d,3,.035),t=e.attributes.position;for(let e=0;e<t.count;e++){let n=t.getX(e),r=t.getY(e),i=t.getZ(e),a=(r+W.h/2)/W.h,o=1+.07*Math.sin(a*Math.PI);t.setX(e,n*(1-Kt*a)*(1+.02*Math.sin(a*Math.PI))),t.setZ(e,i*(1-qt*a)*o),t.setY(e,r+W.h/2)}return e.computeVertexNormals(),e}function Qt(){let e=e=>{let t=new ee([new S(e*.085,.43,-.09),new S(e*.12,.34,-.2),new S(e*.125,.2,-.225),new S(e*.1,.05,-.12)]);return new x(t,18,.016,7,!1)};return k([e(-1),e(1)])??e(1)}function $t(){let e=[],t=G.hz*2,n=G.hx*2,r=t*2+n,i=Math.floor(r/Xt);for(let a=0;a<=i;a++){let o=a/i*r,s,c;o<t?(s=-G.hx,c=-G.hz+o):o<t+n?(s=-G.hx+(o-t),c=G.hz):(s=G.hx,c=G.hz-(o-t-n)),e.push({x:s,z:c,t:a/i})}return e}var en=new p;function tn(){let e=j(e=>e.lowPower),t=(0,N.useRef)(null),n=(0,N.useRef)(null),i=(0,N.useRef)(null),a=(0,N.useRef)(null),o=(0,N.useRef)(null),{bodyGeo:s,flapGeo:c,pocketGeo:l,strapGeo:u,toothGeo:d,liningGeo:p,mouthGeo:m,path:h,canvasMat:_,canvasLightMat:v,goldMat:y,liningMat:x,mouthMat:S}=(0,N.useMemo)(()=>{let e=new se(G.hx*2+.03,.07,G.hz*2+.02,2,.02);e.translate(0,.035,G.hz+.01);let t=new se(.24,.19,.07,2,.02),n=new O(.013,.011,.014),i=new O(G.hx*2-.03,.016,G.hz*2-.03),a=new g(1,1),o=new E({color:Ut,roughness:.72,metalness:.08}),s=new E({color:Wt,roughness:.9,metalness:0}),c=new E({color:Gt,roughness:.35,metalness:.5,emissive:new A(Gt),emissiveIntensity:.45}),l=new r({color:new A(Gt)}),u=new f({vertexShader:Re,fragmentShader:ze,uniforms:{uColor:{value:new A(Gt)},uIntensity:{value:0},uFalloff:{value:new b(4.5,7)},uCore:{value:10}},transparent:!0,depthWrite:!1,blending:2,fog:!1});return{bodyGeo:Zt(),flapGeo:e,pocketGeo:t,strapGeo:Qt(),toothGeo:n,liningGeo:i,mouthGeo:a,path:$t(),canvasMat:o,canvasLightMat:s,goldMat:c,liningMat:l,mouthMat:u}},[]),ee=e=>{let t=i.current;if(!t)return;let n=-e*Yt,r=Math.sin(n),a=Math.cos(n);for(let i=0;i<h.length;i++){let o=h[i],s=i%2==1,c=W.h+.004,l=o.z;if(s){let e=o.z-Jt;c=W.h+.004-e*r,l=Jt+e*a}else c-=e*.006,l+=e*.004*Math.sign(o.z);en.position.set(o.x+(s?0:e*.004*Math.sign(o.x)),c,l),en.rotation.set(s?n:0,0,0),en.updateMatrix(),t.setMatrixAt(i,en.matrix)}t.instanceMatrix.needsUpdate=!0};(0,N.useLayoutEffect)(()=>{ee(0)},[h]);let te=(0,N.useRef)(-1);return C(()=>{let e=V(),r=t.current;if(!r)return;let i=e.local(2,.4,.9);if(r.visible=i<1,!r.visible)return;let s=e.local(2,0,.45),c=s*s*(3-2*s),l=1-i*i;r.scale.set(l,l,l),r.position.y=-i*.15,n.current&&(n.current.rotation.x=-c*Yt),Math.abs(c-te.current)>1e-4&&(ee(c),te.current=c);let u=c*(1+e.flash*.8);if(a.current&&(a.current.visible=c>.03,x.color.setRGB(.82*(.4+2.4*u),.65*(.4+2.4*u),.29*(.4+2.4*u))),o.current){o.current.visible=c>.03,S.uniforms.uIntensity.value=1.6*u;let e=.5+.9*c;o.current.scale.set(e*1.3,e,1)}}),(0,B.jsxs)(`group`,{ref:t,children:[(0,B.jsx)(`mesh`,{geometry:s,material:_,castShadow:!e,receiveShadow:!0}),(0,B.jsx)(`mesh`,{geometry:l,material:v,position:[0,.17,.14],castShadow:!e}),(0,B.jsx)(`mesh`,{geometry:u,material:v}),(0,B.jsx)(`group`,{ref:n,position:[0,W.h,Jt],children:(0,B.jsx)(`mesh`,{geometry:c,material:_,castShadow:!e})}),(0,B.jsx)(`instancedMesh`,{ref:i,args:[d,y,h.length],frustumCulled:!1}),(0,B.jsx)(`mesh`,{ref:a,geometry:p,material:x,position:[0,W.h+.006,0],visible:!1}),(0,B.jsx)(`mesh`,{ref:o,geometry:m,material:S,position:[0,W.h+.05,.02],"rotation-x":-Math.PI/2,renderOrder:22,visible:!1})]})}var nn=`varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormalW;
void main() {
  vUv = uv;
  vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vNormalW = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,rn=`uniform vec2 uSize;
uniform float uPeriod;
uniform float uWire;
uniform float uFade;
uniform vec3 uBase;
uniform vec3 uGold;
uniform vec3 uLampA;
uniform vec3 uLampB;
uniform vec3 uTarget;
uniform float uSpill;
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormalW;

float beamSpill(vec3 p, vec3 lamp, vec3 tgt) {
  vec3 d = normalize(tgt - lamp);
  vec3 toP = p - lamp;
  float t = dot(toP, d);
  vec3 c = lamp + d * max(t, 0.0);
  float ang = distance(p, c) / max(t, 0.5);
  return exp(-ang * ang * 30.0);
}
void main() {
  vec2 m = vUv * uSize;
  float s = 0.70710678;
  float u = (m.x + m.y) * s;
  float v = (m.x - m.y) * s;
  float fu = abs(fract(u / uPeriod) - 0.5) * uPeriod;
  float fv = abs(fract(v / uPeriod) - 0.5) * uPeriod;
  float aa = max(fwidth(u), 0.0005) * 0.75;
  float w = uWire * (1.0 - uFade);
  float lu = 1.0 - smoothstep(w - aa, w + aa, fu);
  float lv = 1.0 - smoothstep(w - aa, w + aa, fv);
  float cover = max(lu, lv);
  if (cover < 0.5) discard;
  
  float shade = lu > lv ? (1.0 - fu / max(w, 0.0001)) : (1.0 - fv / max(w, 0.0001));
  shade = 0.4 + 0.6 * sqrt(clamp(shade, 0.0, 1.0));
  vec3 vdir = normalize(cameraPosition - vWorld);
  vec3 n = normalize(vNormalW);
  float fres = pow(1.0 - abs(dot(n, vdir)), 2.0);
  float spill = (beamSpill(vWorld, uLampA, uTarget) + beamSpill(vWorld, uLampB, uTarget)) * uSpill;
  
  float heightTone = 0.45 + 0.55 * vUv.y;
  vec3 col = uBase * shade * (0.35 + 0.65 * heightTone) * (1.0 + 0.6 * fres) * (1.0 - uFade);
  col += uGold * (0.008 + 0.4 * spill) * shade * (1.0 - uFade);
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,an=new A(`#D2A64B`),on=`#35363e`,sn=`#16171d`,K=P.postCount,cn=P.fenceHeight,ln=2*P.octagonRadius*Math.sin(Math.PI/K),q=new p;function un(){let e=new he(.06,.06,cn,10);e.translate(0,cn/2,0);let t=new he(.09,.075,.05,10);t.translate(0,cn+.025,0);let n=new he(.11,.12,.03,10);return n.translate(0,.015,0),k([e,t,n])??e}function dn(){let e=xe();return e.map((t,n)=>{let r=e[(n+1)%K],i=new S((t[0]+r[0])/2,0,(t[2]+r[2])/2),a=Math.atan2(i.z,i.x);return{mid:i,rotY:Math.PI/2-a}})}function fn(){let e=(0,N.useRef)(null),t=(0,N.useRef)(null),n=(0,N.useRef)(null),i=(0,N.useRef)(null),{postGeo:a,panelGeo:o,railGeo:s,outlineGeo:c,steelMat:l,padMat:u,outlineMat:d,fenceMat:p,edges:m,postList:h}=(0,N.useMemo)(()=>{let e=new f({vertexShader:nn,fragmentShader:rn,uniforms:{uSize:{value:new b(ln,cn)},uPeriod:{value:.068},uWire:{value:.0034},uFade:{value:0},uBase:{value:new A(`#4c4d50`)},uGold:{value:an.clone()},uLampA:{value:Be.clone()},uLampB:{value:Ve.clone()},uTarget:{value:He.clone()},uSpill:{value:1}},side:2,fog:!1});return{postGeo:un(),panelGeo:new g(ln,cn),railGeo:new O(ln,.11,.12),outlineGeo:new O(ln+.1,.014,.07),steelMat:new E({color:on,metalness:.5,roughness:.45}),padMat:new E({color:sn,roughness:.95,metalness:0}),outlineMat:new r({color:an.clone()}),fenceMat:e,edges:dn(),postList:xe()}},[]);return(0,N.useLayoutEffect)(()=>{let r=(e,t)=>{if(e){for(let n=0;n<K;n++)q.position.set(0,0,0),q.rotation.set(0,0,0),q.scale.set(1,1,1),t(n),q.updateMatrix(),e.setMatrixAt(n,q.matrix);e.instanceMatrix.needsUpdate=!0,e.computeBoundingSphere()}};r(e.current,e=>{q.position.set(h[e][0],0,h[e][2]),q.rotation.y=e/K*Math.PI*2}),r(t.current,e=>{q.position.set(m[e].mid.x,cn/2,m[e].mid.z),q.rotation.y=m[e].rotY}),r(n.current,e=>{q.position.set(m[e].mid.x,cn+.06,m[e].mid.z),q.rotation.y=m[e].rotY}),r(i.current,e=>{q.position.set(m[e].mid.x,.008,m[e].mid.z),q.rotation.y=m[e].rotY})},[m,h]),C(()=>{let r=V(),a=r.shotFloat,o=r.local(2,.3,.6),s=a<2.35;if(e.current&&(e.current.visible=s),n.current&&(n.current.visible=s),t.current&&(t.current.visible=o<1,p.uniforms.uFade.value=o,p.uniforms.uSpill.value=Ye(r)*(1+r.flash*1.5)),i.current){let e=r.local(2,.5,1),t=H(a,7,12.5,.25),n=(.1+.8*e+.5*t)*(1+r.flash*.6);d.color.copy(an).multiplyScalar(n)}}),(0,B.jsxs)(`group`,{children:[(0,B.jsx)(`instancedMesh`,{ref:e,args:[a,l,K],castShadow:!0,receiveShadow:!0}),(0,B.jsx)(`instancedMesh`,{ref:t,args:[o,p,K]}),(0,B.jsx)(`instancedMesh`,{ref:n,args:[s,u,K]}),(0,B.jsx)(`instancedMesh`,{ref:i,args:[c,d,K]})]})}var pn=`attribute float aSeed;
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
  
  vNormal = normalize(mat3(im) * normal);
  
  vYFrac = wp.y / max(0.001, uHeight * im[1][1]);
  vec4 mvPosition = viewMatrix * wp;
  vDist = -mvPosition.z;
  vView = cameraPosition - wp.xyz;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,mn=`uint mmix(uint x) {
  x ^= x >> 16u;
  x *= 0x7feb352du;
  x ^= x >> 15u;
  x *= 0x846ca68bu;
  x ^= x >> 16u;
  return x;
}

float mhashi(ivec2 c, int salt) {
  uint h = mmix(uint(c.x + 32768) * 0x9E3779B1u ^ mmix(uint(c.y + 32768) + uint(salt) * 0x85ebca6bu));
  return float(h) * (1.0 / 4294967295.0);
}

float mhash(float n) {
  n = fract(n * 0.1031);
  n *= n + 33.33;
  n *= n + n;
  return fract(n);
}
float mhash2(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float mhash3(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

vec3 mmod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mmod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mpermute(vec4 x) { return mmod289(((x * 34.0) + 1.0) * x); }
vec4 mtaylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float msnoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mmod289(i);
  vec4 p = mpermute(mpermute(mpermute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = mtaylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

vec3 msnoise3(vec3 p) {
  return vec3(msnoise(p), msnoise(p + vec3(31.416, 17.2, -9.1)), msnoise(p + vec3(-12.3, 44.8, 23.5)));
}

vec3 mcurl(vec3 p) {
  const float e = 0.08;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);
  vec3 px0 = msnoise3(p - dx);
  vec3 px1 = msnoise3(p + dx);
  vec3 py0 = msnoise3(p - dy);
  vec3 py1 = msnoise3(p + dy);
  vec3 pz0 = msnoise3(p - dz);
  vec3 pz1 = msnoise3(p + dz);
  float x = py1.z - py0.z - pz1.y + pz0.y;
  float y = pz1.x - pz0.x - px1.z + px0.z;
  float z = px1.y - px0.y - py1.x + py0.x;
  return vec3(x, y, z) / (2.0 * e);
}
const vec3 MW_BONE = vec3(0.949, 0.933, 0.902);
const vec3 MW_GOLD = vec3(0.824, 0.651, 0.294);
const vec3 MW_COOL = vec3(0.220, 0.910, 1.000);

vec3 morphWindows(float u, float y, float yFrac, float seed, float lit, float bands, float time, float dist, float facing, out float isWindow) {
  const float pitch = 1.2;
  vec2 uv = vec2(u, y) / pitch;
  vec2 cell = floor(uv);
  vec2 f = fract(uv);
  
  float e = 0.012 + dist * 0.0022;
  float wx = smoothstep(0.17 - e, 0.17 + e, f.x) * (1.0 - smoothstep(0.83 - e, 0.83 + e, f.x));
  float wy = smoothstep(0.24 - e, 0.24 + e, f.y) * (1.0 - smoothstep(0.76 - e, 0.76 + e, f.y));
  isWindow = wx * wy;

  ivec2 c = ivec2(cell);
  int bs = int(floor(seed * 1000.0 + 0.5)); 
  float h = mhashi(c, bs);            
  float h2 = mhashi(c, bs + 7919);    
  float h3 = mhashi(c, bs + 104729);  
#ifdef LOW_POWER
  float thr = lit;
#else
  int slot = int(floor(time * 0.5));
  float fl = mhashi(c, bs + 1301 * slot);
  float thr = lit + (fl - 0.5) * 0.09; 
#endif
  float on = step(h, thr);
  
  float band = step(floor(yFrac * 6.0) + 0.999, bands * 6.0);
  on = max(on, band);

  vec3 warm = mix(MW_BONE, MW_GOLD, 0.3 + 0.65 * h2);
  vec3 col = h3 < 0.0833 ? MW_COOL : warm;
  float bright = 0.55 + 0.7 * h2;
  vec3 darkGlass = vec3(0.03, 0.032, 0.04);
  vec3 win = mix(darkGlass, col * bright, on);
#ifndef LOW_POWER
  
  float lod = max(smoothstep(70.0, 160.0, dist), 1.0 - smoothstep(0.06, 0.3, facing));
  vec3 avg = mix(darkGlass, MW_GOLD * 0.9, clamp(max(lit, bands * 0.8), 0.0, 1.0));
  win = mix(win, avg, lod);
#endif
  return win;
}
uniform vec3 uConcrete;
uniform float uLit;
uniform float uBands;
uniform float uTime;
uniform float uGain;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vSeed;
varying float vYFrac;
varying float vDist;
varying vec3 vView;
#include <fog_pars_fragment>
void main() {
  vec3 n = normalize(vNormal);
  float side = 1.0 - abs(n.y);
  
  float u = abs(n.x) > 0.5 ? vWorld.z : vWorld.x;
  float isWin;
  float facing = abs(dot(n, normalize(vView)));
  vec3 win = morphWindows(u + vSeed * 13.0, vWorld.y, vYFrac, vSeed, uLit, uBands, uTime, vDist, facing, isWin);
  
  float key = max(0.0, dot(n, normalize(vec3(0.35, 0.8, 0.5))));
  float rim = max(0.0, dot(n, normalize(vec3(-0.6, 0.1, -0.8))));
  float streak = 0.85 + 0.15 * mhash(floor(u * 2.0) + vSeed);
  vec3 base = uConcrete * (0.35 + 0.65 * key + 0.25 * rim) * streak;
  base *= 0.55 + 0.45 * smoothstep(0.0, 6.0, vWorld.y);
  vec3 col = mix(base, win * uGain, isWin * side);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,hn=(e,t)=>{let n=Math.min(1,Math.max(0,(e-t*.055)/.6));return n*n*(3-2*n)},J=P.postCount,gn=P.towerHeight,_n=P.towerWidth,vn=.12,yn=new A(`#D2A64B`),bn=new A(`#FF5A1F`);function xn(){let e=j(e=>e.lowPower),t=(0,N.useRef)(null),n=(0,N.useRef)(null),i=(0,N.useRef)(null),a=(0,N.useRef)({rise:-1,blink:-1,frozen:!1}),{geo:o,mat:s,capGeo:l,capMat:d,beaconGeo:p,beaconMat:m,posts:h}=(0,N.useMemo)(()=>{let t=new O(_n,gn,_n);t.translate(0,gn/2,0);let n=new Float32Array(J);for(let e=0;e<J;e++)n[e]=(e+1)/J+.137*e;t.setAttribute(`aSeed`,new y(n,1));let i=new f({vertexShader:pn,fragmentShader:mn,defines:e?{LOW_POWER:1}:{},fog:!0,uniforms:{...u.clone(le.fog),uHeight:{value:gn},uConcrete:{value:new A(`#1a1b22`)},uLit:{value:0},uBands:{value:0},uTime:{value:0},uGain:{value:1.15}}}),a=new O(_n+.12,.14,_n+.12);return a.translate(0,.07,0),{geo:t,mat:i,capGeo:a,capMat:new r({color:yn.clone().multiplyScalar(.75),fog:!0}),beaconGeo:new ge(.16,8,6),beaconMat:new r({color:bn.clone().multiplyScalar(2.2),fog:!0}),posts:xe()}},[e]),g=(0,N.useMemo)(()=>new D,[]),_=(0,N.useMemo)(()=>new c,[]),v=(0,N.useMemo)(()=>new S,[]),b=(0,N.useMemo)(()=>new S,[]);return C(e=>{let r=t.current,o=n.current,c=i.current;if(!r||!o||!c)return;let l=V(),u=l.reduced&&l.shot===2?.45:l.local(2,.25,.95),d=l.shotFloat>=2.2;if(r.visible=d,o.visible=d,c.visible=d,!d)return;let f=l.reduced?1e3:e.clock.elapsedTime;if((!l.reduced||!a.current.frozen)&&(s.uniforms.uTime.value=f,a.current.frozen=l.reduced),s.uniforms.uLit.value=.38*l.local(2,.45,1),s.uniforms.uBands.value=Math.floor(l.local(3,.05,.97)*6+1e-4)/6,u!==a.current.rise){a.current.rise=u;for(let e=0;e<J;e++){let t=hn(u,e),n=.05+.95*t,i=Math.min(1,t/.35),a=(vn+(_n-vn)*i*i*(3-2*i))/_n;v.set(h[e][0],0,h[e][2]),b.set(a,n,a),r.setMatrixAt(e,g.compose(v,_,b)),v.y=gn*n,b.set(a,1,a),o.setMatrixAt(e,g.compose(v,_,b))}r.instanceMatrix.needsUpdate=!0,o.instanceMatrix.needsUpdate=!0}let p=l.reduced?-2:Math.floor(f*10);if(p!==a.current.blink||u!==a.current.rise){a.current.blink=p;for(let e=0;e<J;e++){let t=hn(u,e),n=(l.reduced?1:+((f+e*.37)%1<.18))*Math.min(1,t*3);v.set(h[e][0],gn*(.05+.95*t)+.3,h[e][2]),b.setScalar(n>0?n:1e-4),c.setMatrixAt(e,g.compose(v,_,b))}c.instanceMatrix.needsUpdate=!0}}),(0,B.jsxs)(`group`,{children:[(0,B.jsx)(`instancedMesh`,{ref:t,args:[o,s,J],frustumCulled:!1,castShadow:!1,receiveShadow:!1}),(0,B.jsx)(`instancedMesh`,{ref:n,args:[l,d,J],frustumCulled:!1}),(0,B.jsx)(`instancedMesh`,{ref:i,args:[p,m,J],frustumCulled:!1})]})}var Sn=6.2,Cn=4,wn=-32,Tn=9,En=()=>{let e=[],t=Math.ceil(P.cityExtent/Sn),n=0;for(let r=-t;r<=t;r++)for(let i=-t;i<=t;i++){n++;let t=r*Sn+(M(n*5+1)-.5)*3,a=i*Sn+(M(n*5+2)-.5)*3,o=2.6+M(n*5+3)*3.2,s=2.6+M(n*5+4)*3.2,c=Math.hypot(t,a);if(c<Tn+Math.max(o,s)/2||c>P.cityExtent||Math.abs(t)<Cn+o/2||a-s/2<wn||M(n*5+5)<.12)continue;let l=M(n*9+7),u=4+24*l*l;M(n*9+8)<.06&&(u=28+M(n*9+9)*16),e.push({x:t,z:a,w:o,d:s,h:u,delay:M(n*9+10)})}return e};function Dn(){let e=j(e=>e.lowPower),t=(0,N.useRef)(null),n=(0,N.useRef)(-1),r=(0,N.useRef)(!1),{geo:i,mat:a,blocks:o}=(0,N.useMemo)(()=>{let t=En(),n=new O(1,1,1);n.translate(0,.5,0);let r=new Float32Array(t.length);for(let e=0;e<t.length;e++)r[e]=M(e*3+2)*10;return n.setAttribute(`aSeed`,new y(r,1)),{geo:n,mat:new f({vertexShader:pn,fragmentShader:mn,defines:e?{LOW_POWER:1}:{},fog:!0,uniforms:{...u.clone(le.fog),uHeight:{value:1},uConcrete:{value:new A(`#0d0d12`)},uLit:{value:0},uBands:{value:0},uTime:{value:0},uGain:{value:.75}}}),blocks:t}},[e]),s=(0,N.useMemo)(()=>new D,[]),l=(0,N.useMemo)(()=>new c,[]),d=(0,N.useMemo)(()=>new S,[]),p=(0,N.useMemo)(()=>new S,[]);return C(e=>{let i=t.current;if(!i)return;let c=V(),u=c.reduced&&c.shot===2?.5:c.local(2,.5,1),f=u>0;if(i.visible=f,f&&(c.reduced?r.current||=(a.uniforms.uTime.value=1e3,!0):(a.uniforms.uTime.value=e.clock.elapsedTime,r.current=!1),a.uniforms.uLit.value=.22*c.local(2,.55,1)+.1*c.local(3)+.06*c.local(4),u!==n.current)){n.current=u;for(let e=0;e<o.length;e++){let t=o[e],n=1-(1-Math.min(1,Math.max(0,(u-t.delay*.45)/.55)))**3;d.set(t.x,0,t.z),p.set(t.w,Math.max(.001,t.h*n),t.d),i.setMatrixAt(e,s.compose(d,l,p))}i.instanceMatrix.needsUpdate=!0}}),(0,B.jsx)(`instancedMesh`,{ref:t,args:[i,a,o.length],frustumCulled:!1})}var On=`uint mmix(uint x) {
  x ^= x >> 16u;
  x *= 0x7feb352du;
  x ^= x >> 15u;
  x *= 0x846ca68bu;
  x ^= x >> 16u;
  return x;
}

float mhashi(ivec2 c, int salt) {
  uint h = mmix(uint(c.x + 32768) * 0x9E3779B1u ^ mmix(uint(c.y + 32768) + uint(salt) * 0x85ebca6bu));
  return float(h) * (1.0 / 4294967295.0);
}

float mhash(float n) {
  n = fract(n * 0.1031);
  n *= n + 33.33;
  n *= n + n;
  return fract(n);
}
float mhash2(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float mhash3(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

vec3 mmod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mmod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mpermute(vec4 x) { return mmod289(((x * 34.0) + 1.0) * x); }
vec4 mtaylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float msnoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mmod289(i);
  vec4 p = mpermute(mpermute(mpermute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = mtaylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

vec3 msnoise3(vec3 p) {
  return vec3(msnoise(p), msnoise(p + vec3(31.416, 17.2, -9.1)), msnoise(p + vec3(-12.3, 44.8, 23.5)));
}

vec3 mcurl(vec3 p) {
  const float e = 0.08;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);
  vec3 px0 = msnoise3(p - dx);
  vec3 px1 = msnoise3(p + dx);
  vec3 py0 = msnoise3(p - dy);
  vec3 py1 = msnoise3(p + dy);
  vec3 pz0 = msnoise3(p - dz);
  vec3 pz1 = msnoise3(p + dz);
  float x = py1.z - py0.z - pz1.y + pz0.y;
  float y = pz1.x - pz0.x - px1.z + px0.z;
  float z = px1.y - px0.y - py1.x + py0.x;
  return vec3(x, y, z) / (2.0 * e);
}
attribute vec4 aSeed;
attribute vec4 aTarget;
uniform float uTime;
uniform float uP;
uniform float uRise;
uniform float uPixelScale;
uniform float uTowerHeight;
uniform vec3 uMouth;
varying float vA;
varying float vHot;

float towerRise(float t, float k) {
  return smoothstep(0.0, 1.0, clamp((t - k * 0.055) / 0.6, 0.0, 1.0));
}

void main() {
  float e = aSeed.x;
  float pour = clamp(uP / 0.72, 0.0, 1.0);
  
  float s = clamp(pour * 1.6 - e * 0.7, 0.0, 1.0);
  float sp = pow(s, 0.65);

  
  float ang = aSeed.z * 6.2831853 + sp * 2.2 + uTime * 0.12;
  float fan = sp * sp * (3.0 - 2.0 * sp);
  float rad = mix(0.07, 1.0 + 2.0 * aSeed.y, fan * fan);
  vec3 p = uMouth + vec3(cos(ang) * rad, s * 30.0 + aSeed.w * 3.0 * s, sin(ang) * rad);

  
  vec3 c = mcurl(p * 0.09 + vec3(aSeed.w * 0.3, -uTime * 0.14, 0.0));
  p += c * (0.06 + 2.6 * fan);
  p.y += (c.y + 0.6) * 0.8 * sp;

  
  float k = aTarget.w;
  float rise = towerRise(uRise, k);
  vec3 tgt = vec3(aTarget.x, 0.4 + aTarget.y * uTowerHeight * rise, aTarget.z);
  float st = smoothstep(0.56 + 0.22 * aSeed.y, 0.88 + 0.1 * aSeed.y, uP);
  st = st * st * (3.0 - 2.0 * st);
  vec3 q = mix(p, tgt, st);
  q.y += sin(st * 3.14159) * (1.5 + 2.0 * aSeed.z);
  
  q += c * 0.08 * st;

  vec4 mv = modelViewMatrix * vec4(q, 1.0);
  float tw = 0.6 + 0.4 * sin(uTime * (1.8 + aSeed.w * 3.5) + aSeed.z * 6.2831853);
  float a = smoothstep(0.0, 0.02, s);             
  a *= 1.0 - smoothstep(0.82, 0.98, uP);         
  a *= mix(1.0, 0.45, st);                        
  vA = a * tw;
  vHot = step(0.9, aSeed.w);

  float size = (0.035 + 0.065 * aSeed.w) * (0.5 + 0.9 * sp) * mix(1.0, 0.6, st);
  gl_PointSize = clamp(2.0 * size * uPixelScale / max(0.5, -mv.z), 1.0, 14.0);
  gl_Position = projectionMatrix * mv;
}`,kn=`uniform vec3 uGold;
uniform vec3 uBone;
uniform float uIntensity;
varying float vA;
varying float vHot;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d2 = dot(c, c);
  if (d2 > 0.25) discard;
  float disc = exp(-d2 * 12.0) * (1.0 - d2 * 4.0);
  vec3 col = mix(uGold, uBone, vHot * 0.65);
  float a = disc * vA * uIntensity;
  gl_FragColor = vec4(col * a, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,An=new S(0,.52,0),jn=new A(`#D2A64B`),Mn=new A(`#F2EEE6`),Nn=.45,Pn=1.2;function Fn(){let e=j(e=>e.lowPower),t=(0,N.useRef)(null),n=(0,N.useRef)(!1),{geo:r,mat:i}=(0,N.useMemo)(()=>{let t=e?8e3:4e4,n=new Float32Array(t*3),r=new Float32Array(t*4),i=new Float32Array(t*4),a=xe(),o=P.towerWidth/2+.1;for(let e=0;e<t;e++){n[e*3+1]=An.y,r[e*4]=M(e*4+1),r[e*4+1]=M(e*4+2),r[e*4+2]=M(e*4+3),r[e*4+3]=M(e*4+4);let t=e%a.length,s=Math.floor(M(e*7+11)*4),[c,,l]=a[t],u=(t+1)/a.length+.137*t,d=s<2?l:c,f=d-P.towerWidth/2+M(e*7+13)*P.towerWidth+u*13,p=(Math.floor(f/Pn)+.22+.56*M(e*7+19))*Pn-u*13,m=Math.min(o,Math.max(-o,p-d));i[e*4]=c+(s===0?o:s===1?-o:m),i[e*4+2]=l+(s===2?o:s===3?-o:m);let h=Math.floor((.04+.93*M(e*7+17))*(P.towerHeight/Pn));i[e*4+1]=(h+.28+.44*M(e*7+23))*Pn/P.towerHeight,i[e*4+3]=t}let s=new w;return s.setAttribute(`position`,new T(n,3)),s.setAttribute(`aSeed`,new T(r,4)),s.setAttribute(`aTarget`,new T(i,4)),s.boundingSphere=new _(new S(0,18,0),40),{geo:s,mat:new f({vertexShader:On,fragmentShader:kn,transparent:!0,depthWrite:!1,depthTest:!0,blending:2,uniforms:{uTime:{value:0},uP:{value:0},uRise:{value:0},uPixelScale:{value:1e3},uTowerHeight:{value:P.towerHeight},uMouth:{value:An.clone()},uGold:{value:jn.clone()},uBone:{value:Mn.clone()},uIntensity:{value:e?1.3:.75}}})}},[e]);return C(e=>{let r=t.current;if(!r)return;let a=V(),o=a.local(2,.05,1);a.reduced&&(o=a.shot===2?Nn:a.shot<2?0:1);let s=o>0&&o<1;if(r.visible=s,!s)return;let c=i.uniforms;a.reduced?n.current||=(c.uTime.value=1e3,!0):(c.uTime.value=e.clock.elapsedTime,n.current=!1),c.uP.value=o,c.uRise.value=a.reduced?.45:a.local(2,.25,.95);let l=(e.camera.fov??45)*(Math.PI/180);c.uPixelScale.value=e.size.height*e.viewport.dpr/(2*Math.tan(l/2))}),(0,B.jsx)(`points`,{ref:t,args:[r,i],frustumCulled:!1,renderOrder:10})}var In=`attribute float aSeed;
uniform float uTime;
uniform float uFade;
uniform float uPixelScale;
varying float vA;
varying float vHot;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float ph = aSeed * 6.2831853;
  float tw = 0.65 + 0.35 * sin(uTime * (0.9 + aSeed * 1.6) + ph);
  
  float in1 = smoothstep(aSeed * 0.6, aSeed * 0.6 + 0.4, uFade);
  vHot = step(0.86, aSeed);
  
  vA = tw * in1 * mix(0.16, 1.0, vHot);
  float size = mix(0.1 + 0.1 * fract(aSeed * 7.31), 0.32 + 0.1 * fract(aSeed * 7.31), vHot);
  gl_PointSize = clamp(2.0 * size * uPixelScale / max(0.5, -mv.z), 1.0, 12.0);
  gl_Position = projectionMatrix * mv;
}`,Ln=`uniform vec3 uGold;
uniform vec3 uBone;
uniform float uIntensity;
varying float vA;
varying float vHot;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d2 = dot(c, c);
  if (d2 > 0.25) discard;
  float disc = exp(-d2 * 10.0) * (1.0 - d2 * 4.0);
  vec3 col = mix(uGold, uBone, vHot * 0.6);
  gl_FragColor = vec4(col * disc * vA * uIntensity, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,Rn=1500,zn=new A(`#D2A64B`),Bn=new A(`#F2EEE6`),Vn=e=>.33*(1-.22*(e+.5)),Hn=e=>.19*(1-.3*(e+.5)),Un=2/3.2;function Wn(e,t,n){let r=Math.cos(t),i=Math.sin(t);n.set(Vn(e)*Math.sign(r)*Math.abs(r)**+Un,e,Hn(e)*Math.sign(i)*Math.abs(i)**+Un)}function Gn(){let e=[],t=[],n=(n,r=!1)=>{let i=e.length;for(let t of n)e.push(t);for(let e=1;e<n.length;e++)t.push([i+e-1,i+e]);r&&n.length>2&&t.push([i+n.length-1,i])},r=()=>new S;for(let e of[Math.PI*.25,Math.PI*.75,Math.PI*1.25,Math.PI*1.75]){let t=[];for(let n=0;n<=7;n++){let i=r();Wn(-.5+n/7,e,i),t.push(i)}n(t)}for(let e of[.5,-.5]){let t=[];for(let n=0;n<10;n++){let i=r();Wn(e,n/10*Math.PI*2+Math.PI/10,i),t.push(i)}n(t,!0)}{let e=[];for(let t=0;t<=6;t++){let n=t/6,i=(n*2-1)*.29;e.push(r().set(i,.24+(1-Math.abs(n*2-1))*.02,.2+(1-(n*2-1)**2)*.03))}n(e),n([r().set(-.29,.5,.17),r().set(-.29,.24,.2)]),n([r().set(.29,.5,.17),r().set(.29,.24,.2)])}{let e=.21;n([r().set(-.21,-.42,e),r().set(.21,-.42,e),r().set(.21,-.12,e),r().set(-.21,-.12,e)],!0)}for(let e of[-1,1]){let t=[];for(let n=0;n<=6;n++){let i=n/6;t.push(r().set(e*(.12+.12*Math.sin(i*Math.PI*.9)),.42-i*.86,-.19-.09*Math.sin(i*Math.PI)))}n(t)}return n([r().set(-.05,.5,-.05),r().set(0,.58,-.05),r().set(.05,.5,-.05)]),{stars:e,links:t}}function Kn(e,t){let n=M(e*11+1),r=M(e*11+2),i=M(e*11+4);if(i<.74){let e=-.5+n;Wn(e,r*Math.PI*2,t),t.z>0&&(t.z+=.04*Math.max(0,1-Math.abs(e+.15)*2.5))}else if(i<.86){let e=n*2-1;t.set(e*.29*(1-.1*r),.5-r*.26,.17+r*.03+(1-e*e)*.03)}else{let e=i<.93?-1:1,a=n,o=(r-.5)*.05;t.set(e*(.12+.12*Math.sin(a*Math.PI*.9))+o,.42-a*.86,-.19-.09*Math.sin(a*Math.PI)-Math.abs(o)*.3)}}function qn(){let e=(0,N.useRef)(null),t=(0,N.useRef)(!1),{geo:n,mat:r,lineGeo:i,lineMat:a,linkCount:s}=(0,N.useMemo)(()=>{let e=P.constellation.size,{stars:t,links:n}=Gn(),r=new Float32Array(Rn*3),i=new Float32Array(Rn),a=new S;for(let n=0;n<Rn;n++)n<t.length?a.copy(t[n]):Kn(n,a),a.multiplyScalar(e),r[n*3]=a.x,r[n*3+1]=a.y,r[n*3+2]=a.z,i[n]=n<t.length?.86+.14*M(n*13+5):.86*M(n*13+5);let s=new w;s.setAttribute(`position`,new T(r,3)),s.setAttribute(`aSeed`,new T(i,1)),s.boundingSphere=new _(new S,e);let c=new f({vertexShader:In,fragmentShader:Ln,transparent:!0,depthWrite:!1,depthTest:!1,blending:2,uniforms:{uTime:{value:0},uFade:{value:0},uPixelScale:{value:1e3},uGold:{value:zn.clone()},uBone:{value:Bn.clone()},uIntensity:{value:1.2}}}),l=new Float32Array(n.length*6);n.forEach(([n,r],i)=>{l.set([t[n].x*e,t[n].y*e,t[n].z*e,t[r].x*e,t[r].y*e,t[r].z*e],i*6)});let u=new w;return u.setAttribute(`position`,new T(l,3)),u.boundingSphere=new _(new S,e),{geo:s,mat:c,lineGeo:u,lineMat:new o({color:zn.clone(),transparent:!0,opacity:0,depthWrite:!1,depthTest:!1,blending:2,fog:!1}),linkCount:n.length}},[]);C(n=>{let i=e.current;if(!i)return;let o=V(),s=o.local(11,.1,.5),c=s>0;if(i.visible=c,!c)return;let l=o.reduced?1e3:n.clock.elapsedTime;(!o.reduced||!t.current)&&(r.uniforms.uTime.value=l,i.rotation.set(-.5,Math.sin(l*.22)*.4,0),t.current=o.reduced),r.uniforms.uFade.value=s,a.opacity=.6*s*s;let u=(n.camera.fov??45)*(Math.PI/180);r.uniforms.uPixelScale.value=n.size.height*n.viewport.dpr/(2*Math.tan(u/2))});let[c,l,u]=P.constellation.center;return(0,B.jsxs)(`group`,{ref:e,position:[c,l,u],userData:{links:s},children:[(0,B.jsx)(`points`,{args:[n,r],frustumCulled:!1,renderOrder:20}),(0,B.jsx)(`lineSegments`,{args:[i,a],frustumCulled:!1,renderOrder:19})]})}var Jn=`varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormalW;
void main() {
  vUv = uv;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Yn=`float termHash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}
float termHash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float termHash31(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}
float termNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = termHash21(i);
  float b = termHash21(i + vec2(1.0, 0.0));
  float c = termHash21(i + vec2(0.0, 1.0));
  float d = termHash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
uniform float uTime;
uniform float uFade;
uniform float uCols;
uniform float uMirror;
uniform float uOpacity;
uniform vec2 uSize;
uniform vec3 uTerminal;
uniform vec3 uBone;
uniform vec3 uAsh;
uniform vec3 uGreen;
uniform vec3 uRed;
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormalW;

float digitPattern(float d) {
  if (d < 0.5) return 31599.0;
  if (d < 1.5) return 11415.0;
  if (d < 2.5) return 29671.0;
  if (d < 3.5) return 29647.0;
  if (d < 4.5) return 23497.0;
  if (d < 5.5) return 31183.0;
  if (d < 6.5) return 31215.0;
  if (d < 7.5) return 29257.0;
  if (d < 8.5) return 31727.0;
  return 31695.0;
}

float glyph(vec2 c, float d) {
  vec2 g = (c - vec2(0.16, 0.12)) / vec2(0.68, 0.76);
  if (g.x < 0.0 || g.x > 1.0 || g.y < 0.0 || g.y > 1.0) return 0.0;
  vec2 gs = g * vec2(3.0, 5.0);
  vec2 cell = floor(gs);
  float bit = cell.y * 3.0 + (2.0 - cell.x);
  float on = floor(mod(digitPattern(d) / exp2(bit), 2.0));
  vec2 f = fract(gs);
  vec2 e = fwidth(gs) * 0.8;
  float px = smoothstep(0.1, 0.1 + e.x, f.x) * smoothstep(0.9, 0.9 - e.x, f.x) *
             smoothstep(0.1, 0.1 + e.y, f.y) * smoothstep(0.9, 0.9 - e.y, f.y);
  return on * px;
}
float dotGlyph(vec2 c) {
  return step(abs(c.x - 0.5), 0.12) * step(abs(c.y - 0.19), 0.08);
}
float signGlyph(vec2 c, float plus) {
  float h = step(abs(c.x - 0.5), 0.3) * step(abs(c.y - 0.5), 0.07);
  float v = step(abs(c.x - 0.5), 0.07) * step(abs(c.y - 0.5), 0.3);
  return max(h, v * plus);
}
float triGlyph(vec2 c, float up) {
  float y = up > 0.5 ? (c.y - 0.25) / 0.5 : (0.75 - c.y) / 0.5;
  if (y < 0.0 || y > 1.0) return 0.0;
  return step(abs(c.x - 0.5), 0.32 * (1.0 - y));
}

vec3 numbersColumn(float ci, float cx, float my, float colW, float t, float type) {
  float hc = termHash11(ci * 7.1 + 1.0);
  float cellW = (colW - 0.3) / 11.3;
  float cellH = cellW * 1.55;
  float dir = hc > 0.78 ? -1.0 : 1.0;
  float speed = (0.25 + 0.75 * termHash11(ci * 3.7 + 9.0)) * 0.55 * dir;
  float yy = (my + t * speed) / cellH;
  float ri = floor(yy);
  float fy = fract(yy);
  float xx = (cx - 0.15) / cellW;
  if (xx < 0.0) return vec3(0.0);
  float k = floor(xx);
  float fx = fract(xx);
  vec2 c = vec2(fx, fy);
  float hl = termHash21(vec2(ci, ri));
  if (hl < 0.14) return vec3(0.0); 
  float hs = termHash21(vec2(ri * 1.7, ci + 11.0));
  float up = step(0.5, hs);
  vec3 tick = mix(uRed, uGreen, up);
  float d = floor(termHash31(vec3(ci, ri, k)) * 10.0);
  vec3 col = vec3(0.0);
  float g = 0.0;
  if (type < 0.5) {
    
    if (k < 4.0) { g = glyph(c, d); col = uAsh * 0.55; }
    else if (k >= 5.0 && k < 10.0) { g = k == 7.0 ? dotGlyph(c) : glyph(c, d); col = mix(uBone, uTerminal, 0.35) * 1.05; }
    else if (k == 11.0) { g = triGlyph(c, up); col = tick; }
  } else if (type < 1.5) {
    
    if (k < 5.0) { g = k == 3.0 ? dotGlyph(c) : glyph(c, d); col = mix(uBone, uTerminal, 0.35) * 1.05; }
    else if (k >= 6.0 && k < 11.0) {
      if (k == 6.0) g = signGlyph(c, up); else if (k == 8.0) g = dotGlyph(c); else g = glyph(c, d);
      col = tick * 1.05;
    }
  } else {
    
    if (k < 5.0) {
      if (k == 0.0) g = signGlyph(c, up); else if (k == 3.0) g = dotGlyph(c); else g = glyph(c, d);
      col = tick * 1.05;
    } else if (k >= 6.0 && k < 11.0) {
      float bh = termHash31(vec3(ri, k, ci + 5.0)) * 0.7 + 0.1;
      g = step(abs(c.x - 0.5), 0.28) * step(c.y, bh) * step(0.12, c.y);
      col = tick * 0.6;
    }
  }
  
  float blink = step(0.985, termHash31(vec3(ci, ri, floor(t * 3.0) + k * 0.13)));
  col = mix(col, uBone * 1.6, blink * step(0.001, g));
  
  float fresh = step(0.9, hl) * (0.5 + 0.5 * sin(t * 2.4 + hl * 40.0));
  return col * g * (1.0 + fresh * 0.6);
}

float sparkVal(float i, float p) {
  float h = termHash21(vec2(i, p));
  return 0.5 + 0.2 * sin(i * 0.37 + p * 7.0) + 0.13 * sin(i * 0.91 + p * 3.0) + (h - 0.5) * 0.2;
}

vec3 sparkPanel(float pi, float px, float py, float t) {
  float seed = termHash11(pi * 13.7 + 2.0);
  float spd = 0.5 + 0.5 * seed;
  vec3 col = vec3(0.0);
  
  vec2 q = (vec2(px, py) - vec2(0.06, 0.14)) / vec2(0.88, 0.58);
  float inside = step(0.0, q.x) * step(q.x, 1.0) * step(0.0, q.y) * step(q.y, 1.0);
  float s = q.x * 28.0 + t * spd;
  float i = floor(s);
  float v = mix(sparkVal(i, seed), sparkVal(i + 1.0, seed), fract(s));
  float v0 = sparkVal(floor(t * spd), seed);
  float v1 = sparkVal(floor(28.0 + t * spd), seed);
  vec3 tint = v1 >= v0 ? uGreen : uRed;
  float d = q.y - v;
  float w = fwidth(q.y) * 1.3;
  float line = 1.0 - smoothstep(0.0, w * 1.6, abs(d));
  float glow = exp(-abs(d) * 18.0) * 0.32;
  float fill = step(d, 0.0) * 0.07 * (1.0 + d * 1.5);
  col += tint * (line * 1.15 + glow + max(fill, 0.0)) * inside;
  
  float base = 1.0 - smoothstep(0.0, w * 1.4, abs(q.y)) ;
  col += uAsh * base * inside * 0.35;
  
  vec2 lab = (vec2(px, py) - vec2(0.06, 0.78)) / vec2(0.055, 0.16);
  if (lab.y > 0.0 && lab.y < 1.0 && lab.x > 0.0) {
    float k = floor(lab.x);
    vec2 c = vec2(fract(lab.x), lab.y);
    if (k < 4.0) col += uAsh * 0.6 * glyph(c, floor(termHash21(vec2(pi, k)) * 10.0));
    if (k >= 10.0 && k < 15.0) {
      float g = k == 10.0 ? signGlyph(c, step(v0, v1)) : (k == 12.0 ? dotGlyph(c) : glyph(c, floor(termHash21(vec2(pi + 3.0, k)) * 10.0)));
      col += tint * g;
    }
  }
  return col;
}

vec3 headerTicker(float mx, float my, float bandH, float t) {
  float cellW = 0.5;
  float cellH = 0.82;
  float x = (mx + t * 1.1) / cellW;
  float k = floor(x);
  float g = floor(k / 13.0);
  float kk = mod(k, 13.0);
  vec2 c = vec2(fract(x), (my - (bandH - cellH) * 0.5) / cellH);
  if (c.y < 0.0 || c.y > 1.0) return vec3(0.0);
  float hs = termHash11(g * 5.3 + 0.5);
  float up = step(0.5, hs);
  vec3 tick = mix(uRed, uGreen, up);
  float d = floor(termHash21(vec2(g, kk)) * 10.0);
  float gl = 0.0;
  vec3 col = vec3(0.0);
  if (kk < 4.0) { gl = glyph(c, d); col = uBone * 1.1; }
  else if (kk >= 5.0 && kk < 10.0) {
    if (kk == 5.0) gl = signGlyph(c, up); else if (kk == 7.0) gl = dotGlyph(c); else gl = glyph(c, d);
    col = tick * 1.1;
  } else if (kk == 10.0) { gl = triGlyph(c, up); col = tick; }
  return col * gl;
}

void main() {
  vec2 uv = mix(vUv, vec2(vUv.x, 1.0 - vUv.y), uMirror);
  vec2 m = uv * uSize;
  float t = uTime;
  vec3 col = vec3(0.0);

  
  col += vec3(0.008, 0.014, 0.020);
  float hatch = smoothstep(0.42, 0.5, fract((m.x + m.y) * 0.32)) * smoothstep(0.98, 0.9, fract((m.x + m.y) * 0.32));
  col += uTerminal * 0.022 * hatch;
  col += uTerminal * 0.018;

  float colW = uSize.x / uCols;
  float ci = floor(uv.x * uCols);
  float cx = m.x - ci * colW;
  float wX = fwidth(m.x) * 1.4;
  float wY = fwidth(m.y) * 1.4;

  
  if (uv.y < 0.56) {
    float type = mod(ci, 3.0);
    col += numbersColumn(ci, cx, m.y, colW, t, type);
    
    col += uAsh * 0.22 * (1.0 - smoothstep(0.0, wX, cx)) ;
  } else if (uv.y > 0.60 && uv.y < 0.80) {
    float nP = max(2.0, floor(uCols * 0.5));
    float pw = uSize.x / nP;
    float pi = floor(uv.x * nP);
    float px = (m.x - pi * pw) / pw;
    float py = (uv.y - 0.60) / 0.20;
    col += sparkPanel(pi, px, py, t);
    col += uAsh * 0.22 * (1.0 - smoothstep(0.0, wX / pw, px));
  } else if (uv.y > 0.84) {
    float bandH = 0.16 * uSize.y;
    col += headerTicker(m.x, m.y - 0.84 * uSize.y, bandH, t);
  }
  
  float r1 = 1.0 - smoothstep(0.0, wY, abs(m.y - 0.58 * uSize.y));
  float r2 = 1.0 - smoothstep(0.0, wY, abs(m.y - 0.82 * uSize.y));
  col += uAsh * 0.3 * max(r1, r2);

  
  float scan = 0.9 + 0.1 * sin(m.y * 95.0 - t * 0.8);
  float bar = exp(-pow((uv.y - fract(-t * 0.06)) * 9.0, 2.0)) * 0.07;
  float vig = pow(16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y), 0.14);
  col = (col + uTerminal * bar) * scan * vig;

  
  vec3 vdir = normalize(cameraPosition - vWorld);
  float fres = pow(1.0 - abs(dot(normalize(vNormalW), vdir)), 3.0);
  col += uTerminal * fres * 0.05 * (1.0 - uMirror);

  float fade = uFade * mix(1.0, 1.0 - uv.y * 0.85, uMirror);
  gl_FragColor = vec4(col * fade, uOpacity * fade);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;function Xn(){let[e,t,n]=P.terminalWall.center,r=P.terminalWall.width,i=P.terminalWall.height,a=(0,N.useRef)(null),o=(0,N.useRef)(0),s=(e,t)=>({uTime:{value:0},uFade:{value:0},uCols:{value:18},uMirror:{value:e},uOpacity:{value:t},uSize:{value:new b(r,i)},uTerminal:{value:new A(`#38E8FF`)},uBone:{value:new A(`#F2EEE6`)},uAsh:{value:new A(`#8B8C93`)},uGreen:{value:new A(`#39d98a`)},uRed:{value:new A(`#ff5f6a`)}}),l=(0,N.useMemo)(()=>new f({vertexShader:Jn,fragmentShader:Yn,uniforms:s(0,1)}),[]),u=(0,N.useMemo)(()=>new f({vertexShader:Jn,fragmentShader:Yn,uniforms:s(1,.15),transparent:!0,depthWrite:!1,blending:2}),[]),d=(0,N.useMemo)(()=>new O(1,1,1),[]),p=(0,N.useMemo)(()=>new E({color:`#101117`,metalness:.7,roughness:.4}),[]),m=(0,N.useRef)(null),h=(0,N.useMemo)(()=>{let e=new D,t=.32,n=.5;return[[0,i/2+t/2,0,r+t*2,t,n],[0,-i/2-t/2,0,r+t*2,t,n],[-r/2-t/2,0,0,t,i,n],[r/2+t/2,0,0,t,i,n]].map(([t,n,r,i,a,o])=>e.clone().compose(new S(t,n,r),new c,new S(i,a,o)))},[r,i]);return C((e,t)=>{let n=V(),r=n.local(4,.8,1)*(1-n.local(6,0,.15)),i=r>.002&&(n.shot===4&&n.shotProgress>=.8||n.shot===5||n.shot===6&&n.shotProgress<.15);if(a.current&&(a.current.visible=i),!i)return;n.reduced||(o.current+=Math.min(t,.05));let s=n.lowPower?9:18;for(let e of[l,u])e.uniforms.uTime.value=o.current,e.uniforms.uFade.value=r,e.uniforms.uCols.value=s;m.current&&m.current.count!==4&&(m.current.count=4)}),(0,B.jsxs)(`group`,{ref:a,position:[e,t,n],visible:!1,children:[(0,B.jsx)(`mesh`,{material:l,children:(0,B.jsx)(`planeGeometry`,{args:[r,i]})}),(0,B.jsx)(`instancedMesh`,{ref:e=>{m.current=e,e&&(h.forEach((t,n)=>e.setMatrixAt(n,t)),e.instanceMatrix.needsUpdate=!0)},args:[d,p,4]}),(0,B.jsx)(`mesh`,{material:u,position:[0,-t+.01,i/2],"rotation-x":-Math.PI/2,renderOrder:1,children:(0,B.jsx)(`planeGeometry`,{args:[r,i]})})]})}var Zn=`uniform float uIn;
uniform float uEmber;
uniform float uTime;
uniform float uFade;
uniform float uComp; 
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

  
  vec3 scr = vec3(0.012, 0.016, 0.024);
  float glow = exp(-length((p - vec2(0.0, 0.035)) / vec2(0.055, 0.075)) * 1.6);
  scr += mix(uTerminal, uBone, 0.6) * glow * 0.05;
  float smear = exp(-pow(length((p - vec2(0.0, 0.046)) / vec2(0.02, 0.0065)), 2.0));
  scr += uBone * smear * 0.06;
  float island = 1.0 - smoothstep(0.0, aa, rbox(p - vec2(0.0, 0.0705), vec2(0.011, 0.0028), 0.0028));
  scr = mix(scr, vec3(0.0), island);
  float home = 1.0 - smoothstep(0.0, aa, rbox(p - vec2(0.0, -0.0725), vec2(0.011, 0.0004), 0.0004));
  scr += uBone * home * 0.1;

  
  vec2 cardHalf = vec2(sHalf.x - 0.003, 0.0155);
  float yTarget = sHalf.y - 0.0075 - cardHalf.y;
  float yStart = sHalf.y + cardHalf.y + 0.006;
  float x1 = uIn - 1.0;
  float e = 1.0 + 2.2 * x1 * x1 * x1 + 1.2 * x1 * x1; 
  float cy = mix(yStart, yTarget, e);
  vec2 cp = p - vec2(0.0, cy);
  float card = rbox(cp, cardHalf, 0.0045);
  float cardA = (1.0 - smoothstep(0.0, aa, card)) * step(0.001, uIn);
  float shadow = (1.0 - smoothstep(0.0, 0.006, card)) * 0.55 * step(0.001, uIn);
  scr *= 1.0 - shadow;
  vec3 cardCol = vec3(0.13, 0.13, 0.16);
  float edge = exp(-max(0.0, cp.x + cardHalf.x) / 0.0035);
  cardCol += uEmberCol * edge * 0.55;
  
  float icon = 1.0 - smoothstep(0.0, aa, rbox(cp - vec2(-cardHalf.x + 0.0095, 0.0), vec2(0.0045), 0.0012));
  cardCol = mix(cardCol, mix(uEmberCol, uBone, 0.25) * 0.28, icon * 0.9);
  scr = mix(scr, cardCol, cardA);

  
  scr += uEmberCol * uEmber * 2.2;

  vec3 col = vec3(0.02, 0.02, 0.025) * bodyA;
  col = mix(col, scr, screenA);
  col += uBone * bezel * 0.11 * bodyA;
  gl_FragColor = vec4(col * uFade * uComp, bodyA * uFade);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,Qn=`uniform vec3 uCool;
uniform vec3 uEmberCol;
uniform float uEmber;
uniform float uGain;
varying vec2 vUv;
void main() {
  vec2 q = (vUv - 0.5) * 2.0;
  q.x *= 1.6;
  float d = length(q);
  float a = exp(-d * d * 3.2) * (1.0 - smoothstep(0.75, 1.0, d));
  vec3 c = mix(uCool, uEmberCol, clamp(uEmber * 1.5, 0.0, 1.0)) * a * uGain;
  gl_FragColor = vec4(c, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,$n=.075,er=.16;function tr(){let[e,t,n]=P.phone.center,r=(0,N.useRef)(null),i=(0,N.useRef)(null),a=(0,N.useRef)(0),o=(0,N.useRef)(0),s=(0,N.useRef)(!0),c=(0,N.useRef)(0),l=(0,N.useMemo)(()=>new f({vertexShader:Jn,fragmentShader:Zn,transparent:!0,depthWrite:!1,uniforms:{uIn:{value:0},uEmber:{value:0},uTime:{value:0},uFade:{value:0},uComp:{value:1},uSize:{value:new b($n,er)},uBone:{value:new A(`#F2EEE6`)},uEmberCol:{value:new A(`#FF5A1F`)},uTerminal:{value:new A(`#38E8FF`)}}}),[]),u=(0,N.useMemo)(()=>new f({vertexShader:Jn,fragmentShader:Qn,transparent:!0,depthWrite:!1,blending:2,uniforms:{uCool:{value:new A(`#38E8FF`).lerp(new A(`#F2EEE6`),.6)},uEmberCol:{value:new A(`#FF5A1F`)},uEmber:{value:0},uGain:{value:0}}}),[]);return C((d,f)=>{let p=V(),m=p.shot===5&&p.shotProgress>=.9||p.shot===6;if(r.current&&(r.current.visible=m),!m){i.current&&(i.current.intensity=0);return}let h=Math.min(f,.05);p.reduced||(a.current+=h);let g=p.local(5,.9,1),_=p.local(6,.25,.32),v=1/(1-.82*(p.local(6,0,.15)*(1-p.local(6,.85,1))));_<.9&&(s.current=!0),s.current&&_>=.95&&(s.current=!1,o.current=1,c.current=p.reduced?0:2),o.current*=Math.exp(-h/.04),o.current<.002&&(o.current=0),r.current&&(c.current>0?(--c.current,r.current.position.set(e+(Math.random()-.5)*.008,t+(Math.random()-.5)*.008,n)):r.current.position.set(e,t,n)),l.uniforms.uIn.value=_,l.uniforms.uEmber.value=o.current,l.uniforms.uTime.value=a.current,l.uniforms.uFade.value=g,l.uniforms.uComp.value=v,u.uniforms.uEmber.value=o.current,u.uniforms.uGain.value=g*v*(.045+.03*_+3*o.current),i.current&&(i.current.intensity=o.current*14*v)}),(0,B.jsxs)(`group`,{ref:r,position:[e,t,n],visible:!1,children:[(0,B.jsx)(`mesh`,{material:u,position:[0,.01,-.012],children:(0,B.jsx)(`planeGeometry`,{args:[.34,.34]})}),(0,B.jsx)(`mesh`,{material:l,children:(0,B.jsx)(`planeGeometry`,{args:[$n,er]})}),(0,B.jsx)(`pointLight`,{ref:i,color:`#FF5A1F`,intensity:0,distance:4,decay:2,position:[0,0,.25]})]})}var nr=`attribute float aSeed;
attribute float aAngle;
uniform float uTime;
uniform float uScale;
uniform float uIntensity;
uniform float uSizeM;
varying vec3 vCol;
varying float vLum;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float wave = 0.5 + 0.5 * sin(aAngle - uTime * 1.0472 + (aSeed - 0.5) * 1.6);
  wave = pow(wave, 2.4);
  float wave2 = 0.5 + 0.5 * sin(-2.0 * aAngle + uTime * 0.6 + aSeed * 3.0);
  float flick = 0.82 + 0.18 * sin(uTime * (1.5 + aSeed * 5.0) + aSeed * 97.0);
  float dist = length(mv.xyz);
  float fog = 1.0 - smoothstep(30.0, 160.0, dist);
  vLum = (0.12 + 0.7 * wave + 0.18 * wave2 * wave2) * flick * uIntensity * fog;
  vec3 warm = mix(vec3(1.0, 0.72, 0.42), vec3(1.0, 0.9, 0.74), fract(aSeed * 7.31));
  vec3 cool = vec3(0.85, 0.96, 1.0);
  vCol = mix(warm, cool, step(0.965, aSeed));
  float size = uSizeM * (0.8 + 0.4 * fract(aSeed * 13.7));
  gl_PointSize = clamp(size * uScale / max(0.5, -mv.z), 1.0, 9.0);
  gl_Position = projectionMatrix * mv;
}`,rr=`varying vec3 vCol;
varying float vLum;
void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p) * 2.0;
  if (d > 1.0) discard;
  float a = exp(-d * d * 3.6) * (1.0 - smoothstep(0.7, 1.0, d));
  float core = smoothstep(0.42, 0.0, d);
  vec3 c = vCol * (a * 0.7 + core * 1.3) * vLum;
  gl_FragColor = vec4(c, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,ir=20740,ar=6e3,or=Math.PI*2,sr=(e,t)=>{let n=((t-P.postAngleOffset+Math.PI/8)%(Math.PI/4)+Math.PI/4)%(Math.PI/4);return e/Math.cos(n-Math.PI/8)},cr=e=>()=>{e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296};function lr(){let{innerRadius:e,outerRadius:t,rows:n}=P.seats,r=(0,N.useRef)(null),i=(0,N.useRef)(null),a=(0,N.useRef)(0),o=(0,N.useMemo)(()=>{let r=cr(1337),i=[],a=[],o=[],s=Array.from({length:n},(r,i)=>e+(t-e)*i/(n-1)),c=s.reduce((e,t)=>e+t,0);for(let e=0;e<n;e++){let t=s[e],l=Math.round(ir*t/c),u=1+13*(e/(n-1))**1.12;for(let e=0;e<l;e++){let n=(e+.5)/l*or,s=((n-P.postAngleOffset)%(Math.PI/4)+Math.PI/4)%(Math.PI/4);if(Math.abs(s-Math.PI/8)<.014)continue;let c=sr(t+(r()-.5)*.5,n);i.push(Math.cos(n)*c,u+(r()-.5)*.25,Math.sin(n)*c),a.push(r()),o.push(n)}}let l=a.length;for(let e=l-1;e>0;e--){let t=Math.floor(r()*(e+1));for(let n=0;n<3;n++){let r=i[e*3+n];i[e*3+n]=i[t*3+n],i[t*3+n]=r}[a[e],a[t]]=[a[t],a[e]],[o[e],o[t]]=[o[t],o[e]]}let u=new w;return u.setAttribute(`position`,new me(i,3)),u.setAttribute(`aSeed`,new me(a,1)),u.setAttribute(`aAngle`,new me(o,1)),u.boundingSphere=new _(new S(0,7.5,0),t+8),u},[e,t,n]),s=(0,N.useMemo)(()=>new f({vertexShader:nr,fragmentShader:rr,transparent:!0,depthWrite:!1,blending:2,uniforms:{uTime:{value:0},uScale:{value:450},uIntensity:{value:0},uSizeM:{value:.42}}}),[]),c=(0,N.useMemo)(()=>{let n=e-.6,r=t+.8,i=.55,a=13.7,o=Math.PI/8-.012,s=n/Math.cos(Math.PI/8),c=r/Math.cos(Math.PI/8),l=(e,t,n)=>[Math.cos(t)*e,n,Math.sin(t)*e],u=-o,d=o,f=l(s,u,i),p=l(s,d,i),m=l(c,u,a),h=l(c,d,a),g=l(s,u,0),_=l(s,d,0),v=l(c,u,0),y=l(c,d,0),b=[[f,p,h,m],[g,v,y,_],[f,m,v,g],[p,_,y,h],[f,g,_,p],[m,h,y,v]],x=[];for(let[e,t,n,r]of b)x.push(...e,...t,...n,...e,...n,...r);let S=new w;return S.setAttribute(`position`,new me(x,3)),S.computeVertexNormals(),S},[e,t]),l=(0,N.useMemo)(()=>new E({color:`#0c0c11`,roughness:.92,metalness:.05}),[]),u=(0,N.useMemo)(()=>{let e=[];for(let t=0;t<8;t++){let n=P.postAngleOffset+t/8*or;e.push(new D().makeRotationY(-n))}return e},[]);return C(({camera:e,gl:t})=>{let n=V(),i=n.shot===6&&n.shotProgress>=.9||n.shot===7,c=n.shot===11,l=i||c;if(r.current&&(r.current.visible=l),!l)return;n.reduced||(a.current=performance.now()*.001);let u=c?.3:n.local(6,.9,1),d=e,f=t.domElement.height;s.uniforms.uScale.value=f/(2*Math.tan(d.fov*Math.PI/360)),s.uniforms.uTime.value=a.current,s.uniforms.uIntensity.value=u,o.setDrawRange(0,Math.min(o.attributes.position.count,n.lowPower?ar:ir))}),(0,B.jsxs)(`group`,{ref:r,visible:!1,children:[(0,B.jsx)(`points`,{ref:i,geometry:o,material:s,frustumCulled:!1}),(0,B.jsx)(`instancedMesh`,{ref:e=>{e&&(u.forEach((t,n)=>e.setMatrixAt(n,t)),e.instanceMatrix.needsUpdate=!0)},args:[c,l,8],receiveShadow:!0}),(0,B.jsx)(`pointLight`,{color:`#ffd9a8`,intensity:60,distance:45,decay:2,position:[0,9,0]})]})}var ur=`attribute float aIntensity;
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
}`,dr=`float termHash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}
float termHash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float termHash31(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}
float termNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = termHash21(i);
  float b = termHash21(i + vec2(1.0, 0.0));
  float c = termHash21(i + vec2(0.0, 1.0));
  float d = termHash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
uniform vec3 uColor;
uniform float uGain;
uniform float uTime;
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormalW;
varying float vI;
void main() {
  if (vI <= 0.001) discard;
  vec3 v = normalize(cameraPosition - vWorld);
  float facing = abs(dot(normalize(vNormalW), v));
  float along = 1.0 - vUv.y; 
  float edge = pow(facing, 1.6);
  float len = pow(1.0 - along, 1.5) * (0.3 + 0.7 * smoothstep(0.0, 0.1, along));
  float baseFade = smoothstep(1.0, 0.8, along);
  float dust = 0.8 + 0.4 * termNoise(vec2(vUv.x * 6.0 + uTime * 0.04, along * 5.0 - uTime * 0.09));
  float dist = length(cameraPosition - vWorld);
  float fog = 1.0 - smoothstep(30.0, 160.0, dist);
  float a = edge * len * baseFade * dust * vI * uGain * fog;
  gl_FragColor = vec4(uColor * a, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,fr=`uniform vec3 uColor;
varying vec2 vUv;
varying float vI;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  float ring = 1.0 - smoothstep(0.86, 1.0, d);
  float lens = mix(1.0, 0.55, d * d);
  vec3 off = vec3(0.045, 0.045, 0.05) * lens;
  vec3 on = uColor * (2.6 * lens + 0.8 * (1.0 - smoothstep(0.0, 0.35, d)));
  vec3 c = mix(off, on, clamp(vI, 0.0, 1.0)) + on * max(0.0, vI - 1.0) * 0.6;
  gl_FragColor = vec4(c * ring + off * (1.0 - ring), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,{cols:pr,rows:mr,spacing:hr,y:gr}=P.lightRig,_r=pr*mr,vr=13.2,yr=1.9,br=.06;function xr(){let e=(0,N.useRef)(null),t=(0,N.useRef)(null),n=(0,N.useRef)(null),r=(0,N.useRef)(null),i=(0,N.useMemo)(()=>new Float32Array(_r).fill(-1),[]),o=(0,N.useRef)(0),s=(0,N.useMemo)(()=>{let e=[];for(let t=0;t<mr;t++)for(let n=0;n<pr;n++)e.push(new S((n-(pr-1)/2)*hr,gr,((mr-1)/2-t)*hr));return e},[]),l=(0,N.useMemo)(()=>new he(.2,.22,.3,14,1),[]),u=(0,N.useMemo)(()=>new E({color:`#15161c`,metalness:.75,roughness:.45}),[]),d=(0,N.useMemo)(()=>{let e=new pe(.165,20);return e.setAttribute(`aIntensity`,new y(new Float32Array(_r),1)),e},[]),p=(0,N.useMemo)(()=>new f({vertexShader:ur,fragmentShader:fr,uniforms:{uColor:{value:new A(`#fff4e0`)}}}),[]),m=(0,N.useMemo)(()=>{let e=new ne(yr,vr,28,1,!0);return e.setAttribute(`aIntensity`,new y(new Float32Array(_r),1)),e},[]),h=(0,N.useMemo)(()=>new f({vertexShader:ur,fragmentShader:dr,transparent:!0,depthWrite:!1,side:2,blending:2,uniforms:{uColor:{value:new A(`#fff1d6`)},uGain:{value:.065},uTime:{value:0}}}),[]),g=(0,N.useMemo)(()=>new O(1,1,1),[]),_=(0,N.useMemo)(()=>new E({color:`#1a1b22`,metalness:.8,roughness:.4}),[]),v=(0,N.useMemo)(()=>{let e=[],t=(pr-1)*hr+.8,n=(mr-1)*hr+.8,r=gr+.32,i=new c;for(let t=0;t<pr;t++)e.push(new D().compose(new S((t-(pr-1)/2)*hr,r,0),i,new S(.09,.09,n)));for(let n=0;n<mr;n++)e.push(new D().compose(new S(0,r,((mr-1)/2-n)*hr),i,new S(t,.09,.09)));for(let[a,o]of[[-1,-1],[1,-1],[-1,1],[1,1]])e.push(new D().compose(new S(a*t/2,r+9,o*n/2),i,new S(.035,18,.035)));return e},[]),b=pr+mr+4,x=(e,t,n,r=1)=>{if(!e)return;let i=new D,o=new c().setFromEuler(new a(n,0,0)),l=new S(r,r,r);s.forEach((n,r)=>e.setMatrixAt(r,i.compose(new S(n.x,n.y+t,n.z),o,l))),e.instanceMatrix.needsUpdate=!0};return C((n,r)=>{let a=V(),s=a.shot===6&&a.shotProgress>=.95||a.shot===7||a.shot===8,c=a.shot===11,l=s||c;if(e.current&&(e.current.visible=l),!l){t.current&&(t.current.intensity=0);return}let u=Math.min(r,.05);a.reduced||(o.current+=u);let f=o.current,p=a.local(8,0,.8),g=a.local(8,.8,1),_=1+.9*Math.sin(Math.PI*g),v=d.getAttribute(`aIntensity`).array,y=m.getAttribute(`aIntensity`).array,b=0;for(let e=0;e<_r;e++){let t=0;if(c)t=.35;else{let n=p*30>e;if(n&&i[e]<0&&(i[e]=f),n||(i[e]=-1),n){let n=f-i[e];t=(1+(a.reduced?0:Math.max(0,1-n/br)*1.4))*_,b++}}v[e]=t,y[e]=t}d.getAttribute(`aIntensity`).needsUpdate=!0,m.getAttribute(`aIntensity`).needsUpdate=!0,h.uniforms.uTime.value=f,h.uniforms.uGain.value=a.lowPower?.05:.065,t.current&&(t.current.intensity=c?90:b/_r*300*_)}),(0,B.jsxs)(`group`,{ref:e,visible:!1,children:[(0,B.jsx)(`instancedMesh`,{ref:e=>x(e,.05,0),args:[l,u,_r]}),(0,B.jsx)(`instancedMesh`,{ref:e=>{n.current=e,x(e,-.11,Math.PI/2)},args:[d,p,_r]}),(0,B.jsx)(`instancedMesh`,{ref:e=>{r.current=e,x(e,-.12-vr/2,0)},args:[m,h,_r],frustumCulled:!1,renderOrder:2}),(0,B.jsx)(`instancedMesh`,{ref:e=>{e&&(v.forEach((t,n)=>e.setMatrixAt(n,t)),e.instanceMatrix.needsUpdate=!0)},args:[g,_,b]}),(0,B.jsx)(`pointLight`,{ref:t,color:`#fff1d6`,intensity:0,distance:70,decay:2,position:[0,gr-2.5,0]})]})}var Sr=`float roundsHash(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}
float roundsNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float n000 = roundsHash(i);
  float n100 = roundsHash(i + vec3(1.0, 0.0, 0.0));
  float n010 = roundsHash(i + vec3(0.0, 1.0, 0.0));
  float n110 = roundsHash(i + vec3(1.0, 1.0, 0.0));
  float n001 = roundsHash(i + vec3(0.0, 0.0, 1.0));
  float n101 = roundsHash(i + vec3(1.0, 0.0, 1.0));
  float n011 = roundsHash(i + vec3(0.0, 1.0, 1.0));
  float n111 = roundsHash(i + vec3(1.0, 1.0, 1.0));
  float x00 = mix(n000, n100, u.x);
  float x10 = mix(n010, n110, u.x);
  float x01 = mix(n001, n101, u.x);
  float x11 = mix(n011, n111, u.x);
  return mix(mix(x00, x10, u.y), mix(x01, x11, u.y), u.z);
}

vec3 roundsCurl(vec3 p) {
  float e = 0.35;
  float a = roundsNoise(p + vec3(e, 0.0, 0.0)) - roundsNoise(p - vec3(e, 0.0, 0.0));
  float b = roundsNoise(p + vec3(0.0, e, 0.0)) - roundsNoise(p - vec3(0.0, e, 0.0));
  float c = roundsNoise(p + vec3(0.0, 0.0, e)) - roundsNoise(p - vec3(0.0, 0.0, e));
  return vec3(b - c, c - a, a - b) * (1.0 / (2.0 * e));
}

attribute vec3 aSphere; 
attribute vec4 aSeed;   
uniform float uTime;
uniform float uCondense;   
uniform float uPixelScale; 
uniform float uSize;       
uniform float uRadius;     
varying float vAlpha;
varying float vHot;

void main() {
  float c = uCondense;
  
  float gather = smoothstep(0.0, 0.45, c);
  
  float g = pow(gather, 1.6);
  float spread = 1.0 - g;
  vec3 start = aSphere * uRadius;
  
  float ang = uTime * (0.5 + aSeed.x * 0.6) + aSeed.y * 6.2831;
  mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
  start.xz = rot * start.xz;
  start.y += sin(uTime * 0.9 + aSeed.z * 6.2831) * 0.12;
  vec3 p = mix(start, position, g);
  
  vec3 curl = roundsCurl(position * 2.5 + aSeed.xyz * 3.0 + vec3(0.0, uTime * 0.25, 0.0));
  p += curl * 0.22 * spread * spread;
  
  float rel = smoothstep(0.7, 1.0, c);
  vec3 away = normalize(aSphere) * 0.35 + vec3(0.0, 0.45, 0.0);
  p += away * rel * rel + curl * 0.15 * rel;
  
  float sit = gather * (1.0 - rel);
  p += vec3(sin(uTime * 3.0 + aSeed.w * 20.0), cos(uTime * 2.3 + aSeed.x * 17.0), 0.0) * 0.004 * sit;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float fadeIn = smoothstep(0.0, 0.1, c);
  float fadeOut = 1.0 - smoothstep(0.72, 0.9, c);
  float tw = 0.7 + 0.3 * sin(uTime * (2.0 + aSeed.z * 4.0) + aSeed.w * 6.2831);
  vAlpha = fadeIn * fadeOut * tw * (0.55 + 0.45 * aSeed.y);
  
  vHot = smoothstep(0.35, 0.5, c) * (1.0 - smoothstep(0.55, 0.75, c));
  float size = uSize * (0.7 + aSeed.w * 0.9) * (1.0 + 0.6 * vHot);
  gl_PointSize = clamp(size * uPixelScale / max(0.3, -mv.z), 1.0, 14.0);
  gl_Position = projectionMatrix * mv;
}`,Cr=`uniform vec3 uColor;
uniform float uIntensity;
varying float vAlpha;
varying float vHot;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d2 = dot(c, c);
  if (d2 > 0.25) discard;
  float disc = exp(-d2 * 12.0);
  vec3 col = mix(uColor, vec3(1.0, 0.95, 0.85), vHot * 0.4);
  float a = disc * vAlpha * uIntensity;
  gl_FragColor = vec4(col * a, a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,Y=new A(`#D2A64B`),wr=new A(`#F2EEE6`);new A(`#8B8C93`);var Tr=new A(`#FF5A1F`),Er=new A(`#38E8FF`),Dr=new A(`#15161C`),Or=2500;function kr(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var X=new S,Z=new S,Ar=new S;function jr(e,t,n){let r=e.getAttribute(`position`),i=e.getIndex(),a=i?i.count/3:r.count/3,o=new Float32Array(a),s=0,c=e=>{let t=i?i.getX(e*3):e*3,n=i?i.getX(e*3+1):e*3+1,a=i?i.getX(e*3+2):e*3+2;X.fromBufferAttribute(r,t),Z.fromBufferAttribute(r,n),Ar.fromBufferAttribute(r,a)};for(let e=0;e<a;e++)c(e),Z.sub(X),Ar.sub(X),s+=Z.cross(Ar).length()*.5,o[e]=s;let l=new Float32Array(t*3);for(let e=0;e<t;e++){let t=n()*s,r=0,i=a-1;for(;r<i;){let e=r+i>>1;o[e]<t?r=e+1:i=e}c(r);let u=n(),d=n(),f=Math.sqrt(u),p=1-f,m=f*(1-d),h=f*d;l[e*3]=X.x*p+Z.x*m+Ar.x*h,l[e*3+1]=X.y*p+Z.y*m+Ar.y*h,l[e*3+2]=X.z*p+Z.z*m+Ar.z*h}return l}function Mr(e,t,n){let r=e.getAttribute(`position`),i=Math.floor(r.count/2),a=new Float32Array(i),o=0;for(let e=0;e<i;e++)X.fromBufferAttribute(r,e*2),Z.fromBufferAttribute(r,e*2+1),o+=X.distanceTo(Z),a[e]=o;let s=new Float32Array(t*3);for(let e=0;e<t;e++){let t=n()*o,c=0,l=i-1;for(;c<l;){let e=c+l>>1;a[e]<t?c=e+1:l=e}X.fromBufferAttribute(r,c*2),Z.fromBufferAttribute(r,c*2+1);let u=n();s[e*3]=X.x+(Z.x-X.x)*u,s[e*3+1]=X.y+(Z.y-X.y)*u,s[e*3+2]=X.z+(Z.z-X.z)*u}return s}var Nr=.25;function Pr(e,t,n={}){let r=j(e=>e.lowPower),i=(0,N.useRef)(null),a=(0,N.useRef)(null),o=(0,N.useRef)(0),s=(0,N.useRef)(0),{radius:c=1.1,edges:l=!1,turn:u=`spin`,faceYaw:d=0,size:p=.014,intensity:m=.8}=n,g=(0,N.useMemo)(()=>{let n=r?800:Or,i=kr(1e3+e*7919),a=l?Mr(t,n,i):jr(t,n,i),o=new Float32Array(n*3),s=new Float32Array(n*4);for(let e=0;e<n;e++){let t=i()*2-1,n=i()*Math.PI*2,r=Math.sqrt(1-t*t),a=.75+i()*.5;o[e*3]=r*Math.cos(n)*a,o[e*3+1]=t*a*.8+.1,o[e*3+2]=r*Math.sin(n)*a,s[e*4]=i(),s[e*4+1]=i(),s[e*4+2]=i(),s[e*4+3]=i()}let u=new w;return u.setAttribute(`position`,new T(a,3)),u.setAttribute(`aSphere`,new T(o,3)),u.setAttribute(`aSeed`,new T(s,4)),u.boundingSphere=new _(new S(0,.1,0),c*1.6),{particleGeometry:u,particleMaterial:new f({vertexShader:Sr,fragmentShader:Cr,uniforms:{uTime:{value:0},uCondense:{value:0},uPixelScale:{value:1e3},uSize:{value:p},uRadius:{value:c},uColor:{value:Y.clone()},uIntensity:{value:m}},transparent:!0,depthWrite:!1,depthTest:!0,blending:2}),solidUniforms:{uSolid:{value:0},uTime:{value:0},uEdgeColor:{value:Y.clone()}}}},[t,r,e,l,c,p,m]),v=(0,N.useMemo)(()=>Se(e),[e]);return{group:i,points:a,particleGeometry:g.particleGeometry,particleMaterial:g.particleMaterial,position:v,solidUniforms:g.solidUniforms,update:(t,n)=>{let r=V(),c=r.shot===4?Ce(r.shotProgress,e):0;r.reduced&&(c=+(c>Nr));let l=r.reduced?0:Math.min(n,.05);r.reduced||(s.current+=l);let f=r.reduced?7:s.current,p=c>.001,m=i.current;if(m&&(m.visible=p,p)){let e=t.size.width/Math.max(1,t.size.height),n=Math.min(1,Math.max(.3,e/1.6));m.position.set(v[0]*n,v[1]+(1-n)*.45,v[2]),u===`spin`?o.current+=.15*l:o.current=.3*Math.sin(f*.5),m.rotation.y=d+o.current}let _=ve(.45,.7,c),y=p&&c<.92,b=g.particleMaterial;b.uniforms.uTime.value=f,b.uniforms.uCondense.value=c;let x=t.camera;if(b.uniforms.uPixelScale.value=t.size.height*t.gl.getPixelRatio()/(2*Math.tan(h.degToRad(x.fov)*.5)),a.current&&(a.current.visible=y),g.solidUniforms.uSolid.value=_,g.solidUniforms.uTime.value=f,m&&p)for(let e of m.children)e!==a.current&&(e.isLight||(e.visible=_>0));return{r,presence:c,solid:_,visible:p,time:f,dt:l}}}}function Q(e,t,n,r,i={}){return new f({vertexShader:e,fragmentShader:t,uniforms:{...n,...r},...i})}var $=`attribute float aGlow; 
varying vec2 vUv;
varying vec3 vLocal;   
varying vec3 vDis;     
varying vec3 vNormal;  
varying vec3 vView;    
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
}`,Fr=`float roundsHash(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}
float roundsNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float n000 = roundsHash(i);
  float n100 = roundsHash(i + vec3(1.0, 0.0, 0.0));
  float n010 = roundsHash(i + vec3(0.0, 1.0, 0.0));
  float n110 = roundsHash(i + vec3(1.0, 1.0, 0.0));
  float n001 = roundsHash(i + vec3(0.0, 0.0, 1.0));
  float n101 = roundsHash(i + vec3(1.0, 0.0, 1.0));
  float n011 = roundsHash(i + vec3(0.0, 1.0, 1.0));
  float n111 = roundsHash(i + vec3(1.0, 1.0, 1.0));
  float x00 = mix(n000, n100, u.x);
  float x10 = mix(n010, n110, u.x);
  float x01 = mix(n001, n101, u.x);
  float x11 = mix(n011, n111, u.x);
  return mix(mix(x00, x10, u.y), mix(x01, x11, u.y), u.z);
}

vec3 roundsCurl(vec3 p) {
  float e = 0.35;
  float a = roundsNoise(p + vec3(e, 0.0, 0.0)) - roundsNoise(p - vec3(e, 0.0, 0.0));
  float b = roundsNoise(p + vec3(0.0, e, 0.0)) - roundsNoise(p - vec3(0.0, e, 0.0));
  float c = roundsNoise(p + vec3(0.0, 0.0, e)) - roundsNoise(p - vec3(0.0, 0.0, e));
  return vec3(b - c, c - a, a - b) * (1.0 / (2.0 * e));
}

float roundsDissolve(vec3 p, float solid) {
  if (solid >= 1.0) return 0.0;
  if (solid <= 0.0) discard;
  float n = roundsNoise(p * 9.0) * 0.65 + roundsNoise(p * 27.0 + 7.3) * 0.35;
  
  float th = 1.1 - solid * 1.2;
  float d = n - th;
  if (d < 0.0) discard;
  float edge = 1.0 - smoothstep(0.0, 0.14, d);
  return edge * (1.0 - smoothstep(0.85, 1.0, solid));
}
uniform float uSolid;
uniform float uTime;
uniform vec3 uEdgeColor;
uniform vec2 uHalf;      
uniform float uTicker;   
varying vec2 vUv;
varying vec3 vLocal;
varying vec3 vDis;
varying vec3 vNormal;
varying vec3 vView;

float cellHash(vec2 c) { return roundsHash(vec3(c, 3.7)); }

float glyph(vec2 f, vec2 id) {
  float h = cellHash(id);
  float bits = floor(h * 127.0);
  float s = 0.0;
  
  float hx = step(0.15, f.x) * step(f.x, 0.85);
  s += hx * step(0.80, f.y) * step(0.5, mod(bits, 2.0));
  s += hx * step(0.44, f.y) * step(f.y, 0.56) * step(0.5, mod(floor(bits / 2.0), 2.0));
  s += hx * step(f.y, 0.20) * step(0.5, mod(floor(bits / 4.0), 2.0));
  
  float vy1 = step(0.52, f.y) * step(f.y, 0.95);
  float vy0 = step(0.05, f.y) * step(f.y, 0.48);
  float lx = step(0.08, f.x) * step(f.x, 0.26);
  float rx = step(0.74, f.x) * step(f.x, 0.92);
  s += lx * vy1 * step(0.5, mod(floor(bits / 8.0), 2.0));
  s += rx * vy1 * step(0.5, mod(floor(bits / 16.0), 2.0));
  s += lx * vy0 * step(0.5, mod(floor(bits / 32.0), 2.0));
  s += rx * vy0 * step(0.5, mod(floor(bits / 64.0), 2.0));
  return clamp(s, 0.0, 1.0);
}

vec3 ticker(vec2 uv) {
  
  vec2 m = vec2(0.06, 0.08);
  if (uv.x < m.x || uv.x > 1.0 - m.x || uv.y < m.y || uv.y > 1.0 - m.y) return vec3(0.0);
  vec2 q = (uv - m) / (1.0 - 2.0 * m);
  float rows = 7.0;
  float y = q.y * rows + uTime * 0.9; 
  float row = floor(y);
  float fy = fract(y);
  float rh = cellHash(vec2(row, 11.0));
  vec3 col = vec3(0.0);
  
  col += vec3(0.95, 0.93, 0.9) * 0.05 * step(0.94, fy);
  float cellH = fy > 0.18 && fy < 0.86 ? 1.0 : 0.0;
  float gy = (fy - 0.18) / 0.68;
  
  float cols = 12.0;
  float cx = q.x * cols;
  float cell = floor(cx);
  float fx = fract(cx);
  if (cell < 4.0) {
    float g = glyph(vec2(fx, gy), vec2(cell, row)) * cellH;
    col += vec3(0.95, 0.92, 0.86) * g * 1.6;
  } else if (cell == 4.0) {
    
    float up = step(0.5, rh);
    float ty = up == 1.0 ? gy : 1.0 - gy;
    float tri = step(abs(fx - 0.5), (1.0 - ty) * 0.42) * step(0.1, ty) * cellH;
    col += mix(vec3(0.88, 0.38, 0.3), vec3(0.25, 0.82, 0.55), up) * tri * 1.6;
  } else if (cell >= 5.0 && cell < 9.0) {
    
    float g = glyph(vec2(fx, gy), vec2(cell + 40.0, row)) * cellH;
    col += vec3(0.7, 0.7, 0.74) * g * 1.3;
  } else if (cell >= 9.5 && cell < 11.5) {
    
    float len = 0.3 + 0.7 * cellHash(vec2(row, 29.0));
    float bx = (cx - 9.5) / 2.0;
    float bar = step(bx, len) * step(0.35, gy) * step(gy, 0.65) * cellH;
    col += mix(vec3(0.35, 0.36, 0.4), vec3(0.82, 0.65, 0.3), step(0.5, rh)) * bar * 0.9;
  }
  
  float fade = smoothstep(0.0, 0.12, q.y) * (1.0 - smoothstep(0.88, 1.0, q.y));
  col *= fade;
  
  float band = q.x + q.y * 0.6;
  float inBand = step(0.55, band) * step(band, 0.78);
  float hatch = step(0.5, fract((q.x - q.y) * 28.0));
  col = mix(col, col * 0.35 + vec3(0.82, 0.65, 0.3) * 0.22 * hatch, inBand);
  
  col *= 0.85 + 0.15 * sin(q.y * 140.0 + uTime * 6.0);
  return col;
}

void main() {
  float edge = roundsDissolve(vDis, uSolid);
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vView);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.5);
  vec3 L1 = normalize(vec3(-0.5, 0.8, 0.6));
  vec3 H = normalize(L1 + V);
  float spec = pow(max(dot(N, H), 0.0), 90.0);
  vec3 body = vec3(0.07, 0.072, 0.09);
  vec3 col = body * (0.6 + 0.4 * max(dot(N, L1), 0.0));
  col += vec3(0.82, 0.65, 0.3) * fres * 0.9;
  col += vec3(1.0, 0.95, 0.85) * spec * 0.5;
  
  if (abs(vLocal.z) > 0.019) {
    vec2 uv = vec2(vLocal.x / (2.0 * uHalf.x) + 0.5, vLocal.y / (2.0 * uHalf.y) + 0.5);
    if (vLocal.z < 0.0) uv.x = 1.0 - uv.x;
    vec3 t = ticker(uv) * uTicker;
    col += t * (1.0 - fres * 0.6);
    
    col += vec3(0.82, 0.65, 0.3) * 0.02;
  }
  col += uEdgeColor * edge * 2.4;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,Ir=.7,Lr=.45,Rr=.04;function zr(){let e=(0,N.useMemo)(()=>new O(Ir,Lr,Rr),[]),t=Pr(1,e,{radius:1,turn:`sway`,faceYaw:.4}),n=(0,N.useMemo)(()=>Q($,Fr,t.solidUniforms,{uHalf:{value:new b(Ir/2,Lr/2)},uTicker:{value:1}}),[t.solidUniforms]);return C((e,r)=>{let i=t.update(e,r);i.visible&&(n.uniforms.uTicker.value=Math.min(1,Math.max(0,(i.solid-.6)/.4)))}),(0,B.jsxs)(`group`,{ref:t.group,position:t.position,children:[(0,B.jsx)(`points`,{ref:t.points,geometry:t.particleGeometry,material:t.particleMaterial,frustumCulled:!1}),(0,B.jsx)(`mesh`,{geometry:e,material:n})]})}var Br=`float roundsHash(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}
float roundsNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float n000 = roundsHash(i);
  float n100 = roundsHash(i + vec3(1.0, 0.0, 0.0));
  float n010 = roundsHash(i + vec3(0.0, 1.0, 0.0));
  float n110 = roundsHash(i + vec3(1.0, 1.0, 0.0));
  float n001 = roundsHash(i + vec3(0.0, 0.0, 1.0));
  float n101 = roundsHash(i + vec3(1.0, 0.0, 1.0));
  float n011 = roundsHash(i + vec3(0.0, 1.0, 1.0));
  float n111 = roundsHash(i + vec3(1.0, 1.0, 1.0));
  float x00 = mix(n000, n100, u.x);
  float x10 = mix(n010, n110, u.x);
  float x01 = mix(n001, n101, u.x);
  float x11 = mix(n011, n111, u.x);
  return mix(mix(x00, x10, u.y), mix(x01, x11, u.y), u.z);
}

vec3 roundsCurl(vec3 p) {
  float e = 0.35;
  float a = roundsNoise(p + vec3(e, 0.0, 0.0)) - roundsNoise(p - vec3(e, 0.0, 0.0));
  float b = roundsNoise(p + vec3(0.0, e, 0.0)) - roundsNoise(p - vec3(0.0, e, 0.0));
  float c = roundsNoise(p + vec3(0.0, 0.0, e)) - roundsNoise(p - vec3(0.0, 0.0, e));
  return vec3(b - c, c - a, a - b) * (1.0 / (2.0 * e));
}

float roundsDissolve(vec3 p, float solid) {
  if (solid >= 1.0) return 0.0;
  if (solid <= 0.0) discard;
  float n = roundsNoise(p * 9.0) * 0.65 + roundsNoise(p * 27.0 + 7.3) * 0.35;
  
  float th = 1.1 - solid * 1.2;
  float d = n - th;
  if (d < 0.0) discard;
  float edge = 1.0 - smoothstep(0.0, 0.14, d);
  return edge * (1.0 - smoothstep(0.85, 1.0, solid));
}
uniform float uSolid;
uniform float uTime;
uniform vec3 uEdgeColor;
uniform vec2 uHalf;         
uniform float uRadius;      
uniform float uBezel;       
uniform vec3 uBezelColor;
uniform vec3 uFill;
uniform vec3 uAccent;       
uniform float uAccentStrength;
uniform float uLines;       
uniform float uGloss;
varying vec2 vUv;
varying vec3 vLocal;
varying vec3 vDis;
varying vec3 vNormal;
varying vec3 vView;

float rrect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  float d = rrect(vLocal.xy, uHalf, uRadius);
  if (d > 0.0) discard;
  float edge = roundsDissolve(vDis, uSolid);
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vView);
  vec3 col = uFill;
  
  col *= 0.85 + 0.3 * (vLocal.y / max(uHalf.y, 0.001) * 0.5 + 0.5);
  
  col += vec3(0.16, 0.17, 0.22) * smoothstep(-0.2, 1.0, vLocal.y / max(uHalf.y, 0.001)) * (1.0 - step(0.5, uLines));
  
  float bez = uBezel > 0.0 ? smoothstep(-uBezel - 0.002, -uBezel, d) : 0.0;
  col = mix(col, uBezelColor, bez);
  
  col += vec3(0.95, 0.92, 0.86) * 0.25 * smoothstep(-0.0015, 0.0, d);
  
  float lx = (vLocal.x + uHalf.x) / (2.0 * uHalf.x);
  col += uAccent * uAccentStrength * exp(-lx * 22.0);
  col += uAccent * uAccentStrength * 0.35 * (1.0 - smoothstep(0.0, 0.08, lx)) ;
  
  if (uLines > 0.5) {
    vec2 q = (vLocal.xy + uHalf) / (2.0 * uHalf);
    float row = floor(q.y * (uLines + 1.0));
    float fy = fract(q.y * (uLines + 1.0));
    float len = 0.55 + 0.35 * roundsHash(vec3(row, 5.0, 1.0));
    float bar = step(0.42, fy) * step(fy, 0.58) * step(0.12, q.x) * step(q.x, len) * step(0.5, row) * step(row, uLines);
    col += vec3(0.6, 0.6, 0.64) * bar * 0.55;
  }
  
  vec3 L1 = normalize(vec3(-0.5, 0.8, 0.6));
  vec3 H = normalize(L1 + V);
  float spec = pow(max(dot(N, H), 0.0), 60.0);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 4.0);
  col += (vec3(1.0, 0.95, 0.85) * spec * 0.35 + vec3(0.82, 0.65, 0.3) * fres * 0.5) * uGloss;
  col += uEdgeColor * edge * 2.2;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,Vr=.3,Hr=.64,Ur=.24,Wr=.1,Gr=.75,Kr=(e,t=1.7)=>{let n=e-1;return n*n*((t+1)*n+t)+1};function qr(){let e=(0,N.useMemo)(()=>new g(Vr,Hr),[]),t=(0,N.useMemo)(()=>new g(Ur,Wr),[]),n=Pr(2,e,{radius:.95,turn:`sway`,faceYaw:-.4}),r=(0,N.useMemo)(()=>Q($,Br,n.solidUniforms,{uHalf:{value:new b(Vr/2,Hr/2)},uRadius:{value:.04},uBezel:{value:.006},uBezelColor:{value:new A(`#3a3b44`)},uFill:{value:new A(`#0b0b10`)},uAccent:{value:Tr.clone()},uAccentStrength:{value:0},uLines:{value:0},uGloss:{value:1}}),[n.solidUniforms]),i=(0,N.useMemo)(()=>Q($,Br,n.solidUniforms,{uHalf:{value:new b(Ur/2,Wr/2)},uRadius:{value:.02},uBezel:{value:0},uBezelColor:{value:wr.clone()},uFill:{value:new A(`#1c1d26`)},uAccent:{value:Tr.clone()},uAccentStrength:{value:1.2},uLines:{value:2},uGloss:{value:.3}}),[n.solidUniforms]),a=(0,N.useRef)(null),o=(0,N.useRef)(null),s=(0,N.useRef)(-1);return C((e,t)=>{let i=n.update(e,t),c=a.current,l=o.current;if(!i.visible){s.current=-1,l&&(l.intensity=0);return}let u=i.presence>Gr;u&&s.current<0&&(s.current=i.time),u||(s.current=-1);let d=0,f=0;if(u){d=Kr(i.r.reduced?1:Math.min(1,(i.time-s.current)/.45));let e=i.time-s.current;f=i.r.reduced?.3:Math.exp(-e*3.2)*(.6+.4*Math.sin(e*30))}c&&(c.visible=d>.001,c.scale.setScalar(Math.max(1e-4,d))),l&&(l.intensity=f*3.5),r.uniforms.uAccentStrength.value=f*.6}),(0,B.jsxs)(`group`,{ref:n.group,position:n.position,children:[(0,B.jsx)(`points`,{ref:n.points,geometry:n.particleGeometry,material:n.particleMaterial,frustumCulled:!1}),(0,B.jsx)(`mesh`,{geometry:e,material:r}),(0,B.jsx)(`mesh`,{ref:a,geometry:t,material:i,position:[0,Hr*.26,.012]}),(0,B.jsx)(`pointLight`,{ref:o,color:Tr,intensity:0,distance:2.2,decay:2,position:[0,Hr*.26,.15]})]})}var Jr=`float roundsHash(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}
float roundsNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float n000 = roundsHash(i);
  float n100 = roundsHash(i + vec3(1.0, 0.0, 0.0));
  float n010 = roundsHash(i + vec3(0.0, 1.0, 0.0));
  float n110 = roundsHash(i + vec3(1.0, 1.0, 0.0));
  float n001 = roundsHash(i + vec3(0.0, 0.0, 1.0));
  float n101 = roundsHash(i + vec3(1.0, 0.0, 1.0));
  float n011 = roundsHash(i + vec3(0.0, 1.0, 1.0));
  float n111 = roundsHash(i + vec3(1.0, 1.0, 1.0));
  float x00 = mix(n000, n100, u.x);
  float x10 = mix(n010, n110, u.x);
  float x01 = mix(n001, n101, u.x);
  float x11 = mix(n011, n111, u.x);
  return mix(mix(x00, x10, u.y), mix(x01, x11, u.y), u.z);
}

vec3 roundsCurl(vec3 p) {
  float e = 0.35;
  float a = roundsNoise(p + vec3(e, 0.0, 0.0)) - roundsNoise(p - vec3(e, 0.0, 0.0));
  float b = roundsNoise(p + vec3(0.0, e, 0.0)) - roundsNoise(p - vec3(0.0, e, 0.0));
  float c = roundsNoise(p + vec3(0.0, 0.0, e)) - roundsNoise(p - vec3(0.0, 0.0, e));
  return vec3(b - c, c - a, a - b) * (1.0 / (2.0 * e));
}

float roundsDissolve(vec3 p, float solid) {
  if (solid >= 1.0) return 0.0;
  if (solid <= 0.0) discard;
  float n = roundsNoise(p * 9.0) * 0.65 + roundsNoise(p * 27.0 + 7.3) * 0.35;
  
  float th = 1.1 - solid * 1.2;
  float d = n - th;
  if (d < 0.0) discard;
  float edge = 1.0 - smoothstep(0.0, 0.14, d);
  return edge * (1.0 - smoothstep(0.85, 1.0, solid));
}
uniform float uSolid;
uniform float uTime;
uniform vec3 uEdgeColor;
uniform vec3 uTint;
uniform vec3 uGlowColor;
uniform float uGlowLevel;
varying vec2 vUv;
varying vec3 vDis;
varying vec3 vNormal;
varying vec3 vView;
varying float vGlow;
void main() {
  float edge = roundsDissolve(vDis, uSolid);
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vView);
  float fres = pow(1.0 - abs(dot(N, V)), 2.5);
  float g = smoothstep(vGlow, vGlow + 0.05, uGlowLevel);
  
  float sweep = exp(-pow((vUv.x - (uGlowLevel - vGlow) * 12.0 + 0.5) * 3.0, 2.0)) * step(0.001, g) * (1.0 - g * 0.6);
  vec3 col = mix(uTint, uGlowColor, g);
  float alpha = mix(0.10, 0.16, g) + fres * 0.2 + sweep * 0.5;
  
  float gx = step(0.985, fract(vUv.x * 6.0)) + step(0.97, fract(vUv.y * 4.0));
  col += vec3(0.95, 0.93, 0.9) * gx * 0.15 * (0.4 + g);
  col += vec3(1.0, 0.96, 0.86) * sweep * 0.8;
  col += uEdgeColor * edge * 2.0;
  alpha = max(alpha, edge);
  gl_FragColor = vec4(col * (0.9 + g * 0.5), alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,Yr=`attribute float aSway;  
attribute float aGlow;  
uniform float uTime;
uniform float uSway;    
uniform vec3 uPivot;    
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
}`,Xr=`float roundsHash(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}
float roundsNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float n000 = roundsHash(i);
  float n100 = roundsHash(i + vec3(1.0, 0.0, 0.0));
  float n010 = roundsHash(i + vec3(0.0, 1.0, 0.0));
  float n110 = roundsHash(i + vec3(1.0, 1.0, 0.0));
  float n001 = roundsHash(i + vec3(0.0, 0.0, 1.0));
  float n101 = roundsHash(i + vec3(1.0, 0.0, 1.0));
  float n011 = roundsHash(i + vec3(0.0, 1.0, 1.0));
  float n111 = roundsHash(i + vec3(1.0, 1.0, 1.0));
  float x00 = mix(n000, n100, u.x);
  float x10 = mix(n010, n110, u.x);
  float x01 = mix(n001, n101, u.x);
  float x11 = mix(n011, n111, u.x);
  return mix(mix(x00, x10, u.y), mix(x01, x11, u.y), u.z);
}

vec3 roundsCurl(vec3 p) {
  float e = 0.35;
  float a = roundsNoise(p + vec3(e, 0.0, 0.0)) - roundsNoise(p - vec3(e, 0.0, 0.0));
  float b = roundsNoise(p + vec3(0.0, e, 0.0)) - roundsNoise(p - vec3(0.0, e, 0.0));
  float c = roundsNoise(p + vec3(0.0, 0.0, e)) - roundsNoise(p - vec3(0.0, 0.0, e));
  return vec3(b - c, c - a, a - b) * (1.0 / (2.0 * e));
}

float roundsDissolve(vec3 p, float solid) {
  if (solid >= 1.0) return 0.0;
  if (solid <= 0.0) discard;
  float n = roundsNoise(p * 9.0) * 0.65 + roundsNoise(p * 27.0 + 7.3) * 0.35;
  
  float th = 1.1 - solid * 1.2;
  float d = n - th;
  if (d < 0.0) discard;
  float edge = 1.0 - smoothstep(0.0, 0.14, d);
  return edge * (1.0 - smoothstep(0.85, 1.0, solid));
}
uniform float uSolid;
uniform vec3 uColor;
uniform float uIntensity;
uniform vec3 uEdgeColor;
uniform vec3 uGlowColor;
uniform float uGlowLevel;  
uniform float uGlint;      
uniform vec3 uGlintAxis;   
uniform float uGlintWidth;
varying vec3 vLocal;
varying float vGlow;
void main() {
  float edge = roundsDissolve(vLocal, uSolid);
  float along = dot(vLocal, uGlintAxis) + 0.5;
  float glint = exp(-pow((along - uGlint) / max(uGlintWidth, 0.001), 2.0) * 4.0);
  float g = smoothstep(vGlow, vGlow + 0.04, uGlowLevel);
  vec3 col = mix(uColor * uIntensity, uGlowColor * (uIntensity + 1.2), g);
  col += vec3(1.0, 0.96, 0.86) * glint * 1.6;
  col += uEdgeColor * edge * 2.0;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,Zr=.5,Qr=.32,$r=6;function ei(){let e=new D,t=[],n=new c,r=new a;for(let i=0;i<$r;i++){let a=i-5/2;r.set(-.05*a,.3*a,.03*a),n.setFromEuler(r),e.compose(new S(.12*a,.02*a,-.06*a),n,new S(1,1,1)),t.push(e.clone())}return t}function ti(){let e=(0,N.useMemo)(()=>{let e=new g(Zr,Qr),t=ei(),n=k(t.map(t=>e.clone().applyMatrix4(t))),r=new v(e),i=t.map((e,t)=>{let n=r.clone().applyMatrix4(e),i=n.getAttribute(`position`).count,a=new Float32Array(i).fill(.5+t*.07);return n.setAttribute(`aGlow`,new T(a,1)),n}),a=k(i),o=new Float32Array($r);for(let e=0;e<$r;e++)o[e]=.5+e*.07;return e.setAttribute(`aGlow`,new y(o,1)),{plane:e,mats:t,sample:n,edgeGeo:a}},[]),t=Pr(3,e.sample,{radius:1,turn:`sway`,faceYaw:.4}),n=(0,N.useMemo)(()=>Q($,Jr,t.solidUniforms,{uTint:{value:Er.clone()},uGlowColor:{value:Y.clone()},uGlowLevel:{value:0}},{transparent:!0,depthWrite:!1,side:2}),[t.solidUniforms]),r=(0,N.useMemo)(()=>Q(Yr,Xr,t.solidUniforms,{uColor:{value:wr.clone()},uIntensity:{value:.9},uGlowColor:{value:Y.clone()},uGlowLevel:{value:0},uGlint:{value:5},uGlintAxis:{value:new S(1,0,0)},uGlintWidth:{value:.1},uSway:{value:0},uPivot:{value:new S}}),[t.solidUniforms]),i=(0,N.useMemo)(()=>{let t=new s(e.plane,n,$r);return e.mats.forEach((e,n)=>t.setMatrixAt(n,e)),t.instanceMatrix.needsUpdate=!0,t.frustumCulled=!1,t},[e,n]);return C((e,i)=>{let a=t.update(e,i);a.visible&&(n.uniforms.uGlowLevel.value=a.presence,r.uniforms.uGlowLevel.value=a.presence)}),(0,B.jsxs)(`group`,{ref:t.group,position:t.position,children:[(0,B.jsx)(`points`,{ref:t.points,geometry:t.particleGeometry,material:t.particleMaterial,frustumCulled:!1}),(0,B.jsx)(`primitive`,{object:i}),(0,B.jsx)(`lineSegments`,{geometry:e.edgeGeo,material:r})]})}var ni=`float roundsHash(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}
float roundsNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float n000 = roundsHash(i);
  float n100 = roundsHash(i + vec3(1.0, 0.0, 0.0));
  float n010 = roundsHash(i + vec3(0.0, 1.0, 0.0));
  float n110 = roundsHash(i + vec3(1.0, 1.0, 0.0));
  float n001 = roundsHash(i + vec3(0.0, 0.0, 1.0));
  float n101 = roundsHash(i + vec3(1.0, 0.0, 1.0));
  float n011 = roundsHash(i + vec3(0.0, 1.0, 1.0));
  float n111 = roundsHash(i + vec3(1.0, 1.0, 1.0));
  float x00 = mix(n000, n100, u.x);
  float x10 = mix(n010, n110, u.x);
  float x01 = mix(n001, n101, u.x);
  float x11 = mix(n011, n111, u.x);
  return mix(mix(x00, x10, u.y), mix(x01, x11, u.y), u.z);
}

vec3 roundsCurl(vec3 p) {
  float e = 0.35;
  float a = roundsNoise(p + vec3(e, 0.0, 0.0)) - roundsNoise(p - vec3(e, 0.0, 0.0));
  float b = roundsNoise(p + vec3(0.0, e, 0.0)) - roundsNoise(p - vec3(0.0, e, 0.0));
  float c = roundsNoise(p + vec3(0.0, 0.0, e)) - roundsNoise(p - vec3(0.0, 0.0, e));
  return vec3(b - c, c - a, a - b) * (1.0 / (2.0 * e));
}

float roundsDissolve(vec3 p, float solid) {
  if (solid >= 1.0) return 0.0;
  if (solid <= 0.0) discard;
  float n = roundsNoise(p * 9.0) * 0.65 + roundsNoise(p * 27.0 + 7.3) * 0.35;
  
  float th = 1.1 - solid * 1.2;
  float d = n - th;
  if (d < 0.0) discard;
  float edge = 1.0 - smoothstep(0.0, 0.14, d);
  return edge * (1.0 - smoothstep(0.85, 1.0, solid));
}
uniform float uSolid;
uniform vec3 uColor;
uniform vec3 uEmissive;
uniform float uEmissiveStrength;
uniform vec3 uRim;
uniform float uRimStrength;
uniform float uMetal;
uniform vec3 uEdgeColor;
varying vec3 vLocal;
varying vec3 vDis;
varying vec3 vNormal;
varying vec3 vView;
varying float vGlow;
void main() {
  float edge = roundsDissolve(vDis, uSolid);
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vView);
  
  vec3 L1 = normalize(vec3(-0.5, 0.8, 0.6));
  vec3 L2 = normalize(vec3(0.8, 0.1, 0.4));
  float d1 = max(dot(N, L1), 0.0);
  float d2 = max(dot(N, L2), 0.0);
  vec3 H = normalize(L1 + V);
  float spec = pow(max(dot(N, H), 0.0), 36.0) * (0.4 + 0.6 * uMetal);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  vec3 col = uColor * (0.18 + d1 * 0.9 + d2 * 0.25);
  col += vec3(1.0, 0.93, 0.8) * spec * 0.6;
  col += uRim * fres * uRimStrength;
  col += uEmissive * uEmissiveStrength * (0.6 + 0.4 * vGlow);
  col += uEdgeColor * edge * 2.2;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,ri=`float roundsHash(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}
float roundsNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float n000 = roundsHash(i);
  float n100 = roundsHash(i + vec3(1.0, 0.0, 0.0));
  float n010 = roundsHash(i + vec3(0.0, 1.0, 0.0));
  float n110 = roundsHash(i + vec3(1.0, 1.0, 0.0));
  float n001 = roundsHash(i + vec3(0.0, 0.0, 1.0));
  float n101 = roundsHash(i + vec3(1.0, 0.0, 1.0));
  float n011 = roundsHash(i + vec3(0.0, 1.0, 1.0));
  float n111 = roundsHash(i + vec3(1.0, 1.0, 1.0));
  float x00 = mix(n000, n100, u.x);
  float x10 = mix(n010, n110, u.x);
  float x01 = mix(n001, n101, u.x);
  float x11 = mix(n011, n111, u.x);
  return mix(mix(x00, x10, u.y), mix(x01, x11, u.y), u.z);
}

vec3 roundsCurl(vec3 p) {
  float e = 0.35;
  float a = roundsNoise(p + vec3(e, 0.0, 0.0)) - roundsNoise(p - vec3(e, 0.0, 0.0));
  float b = roundsNoise(p + vec3(0.0, e, 0.0)) - roundsNoise(p - vec3(0.0, e, 0.0));
  float c = roundsNoise(p + vec3(0.0, 0.0, e)) - roundsNoise(p - vec3(0.0, 0.0, e));
  return vec3(b - c, c - a, a - b) * (1.0 / (2.0 * e));
}

float roundsDissolve(vec3 p, float solid) {
  if (solid >= 1.0) return 0.0;
  if (solid <= 0.0) discard;
  float n = roundsNoise(p * 9.0) * 0.65 + roundsNoise(p * 27.0 + 7.3) * 0.35;
  
  float th = 1.1 - solid * 1.2;
  float d = n - th;
  if (d < 0.0) discard;
  float edge = 1.0 - smoothstep(0.0, 0.14, d);
  return edge * (1.0 - smoothstep(0.85, 1.0, solid));
}
uniform float uSolid;
uniform float uTime;
uniform vec3 uEdgeColor;
uniform vec3 uColor;
uniform float uIntensity;
varying vec2 vUv;
varying vec3 vDis;
varying vec3 vNormal;
varying vec3 vView;
varying float vGlow; 
void main() {
  float edge = roundsDissolve(vDis, uSolid);
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vView);
  
  float body = pow(abs(dot(N, V)), 1.6);
  
  float along = vUv.y;
  float fade = smoothstep(0.0, 0.25, along) * (0.35 + 0.65 * along);
  
  float run = fract(uTime * 0.4 - vGlow);
  float pulse = exp(-run * 6.0);
  float flick = 0.92 + 0.08 * sin(uTime * 23.0 + vGlow * 40.0) * sin(uTime * 7.0 + vGlow * 9.0);
  float b = (0.3 + 1.1 * pulse) * flick;
  float a = body * fade * b * uIntensity;
  vec3 col = uColor * a + uEdgeColor * edge * 1.5;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,ii=10,ai=.45,oi=.4;function si(){let e=(0,N.useMemo)(()=>{let e=new he(.03,.042,.09,12,1,!1),t=new ne(.11,oi,18,1,!0);t.translate(0,-.4/2,0),t.rotateX(Math.PI);let n=new ge(.035,16,12),r=[],i=new c,a=new S(0,1,0),o=new S,s=new S;for(let e=0;e<ii;e++){let t=e/ii*Math.PI*2;s.set(Math.cos(t)*ai,Math.sin(t)*ai,0),o.copy(s).negate().normalize(),i.setFromUnitVectors(a,o),r.push(new D().compose(s,i,new S(1,1,1)))}let l=k([...r.map(t=>e.clone().applyMatrix4(t)),...r.map(e=>{let t=new ne(.07,oi*.7,10,1,!0);return t.translate(0,-.27999999999999997/2,0),t.rotateX(Math.PI),t.applyMatrix4(e)}),n.clone()]),u=new Float32Array(ii);for(let e=0;e<ii;e++)u[e]=e/ii;return e.setAttribute(`aGlow`,new y(u,1)),t.setAttribute(`aGlow`,new y(u.slice(),1)),{housing:e,cone:t,core:n,mats:r,sample:l}},[]),t=Pr(4,e.sample,{radius:1.1,turn:`spin`,faceYaw:0,size:.013}),n=(0,N.useMemo)(()=>Q($,ni,t.solidUniforms,{uColor:{value:Dr.clone().multiplyScalar(1.4)},uEmissive:{value:Y.clone()},uEmissiveStrength:{value:.08},uRim:{value:Y.clone()},uRimStrength:{value:.7},uMetal:{value:.9}}),[t.solidUniforms]),r=(0,N.useMemo)(()=>Q($,ri,t.solidUniforms,{uColor:{value:wr.clone().lerp(Y,.6)},uIntensity:{value:.55}},{transparent:!0,depthWrite:!1,blending:2,side:2}),[t.solidUniforms]),i=(0,N.useMemo)(()=>Q($,ni,t.solidUniforms,{uColor:{value:Y.clone()},uEmissive:{value:Y.clone()},uEmissiveStrength:{value:1.6},uRim:{value:wr.clone()},uRimStrength:{value:.6},uMetal:{value:1}}),[t.solidUniforms]),a=(0,N.useMemo)(()=>{let t=new s(e.housing,n,ii);return e.mats.forEach((e,n)=>t.setMatrixAt(n,e)),t.instanceMatrix.needsUpdate=!0,t.frustumCulled=!1,t},[e,n]),o=(0,N.useMemo)(()=>{let t=new s(e.cone,r,ii);return e.mats.forEach((e,n)=>t.setMatrixAt(n,e)),t.instanceMatrix.needsUpdate=!0,t.frustumCulled=!1,t},[e,r]);return C((e,n)=>{let r=t.update(e,n);r.visible&&(i.uniforms.uEmissiveStrength.value=1.2+.6*Math.sin(r.time*2.5))}),(0,B.jsxs)(`group`,{ref:t.group,position:t.position,children:[(0,B.jsx)(`points`,{ref:t.points,geometry:t.particleGeometry,material:t.particleMaterial,frustumCulled:!1}),(0,B.jsxs)(`group`,{rotation:[-.55,0,0],children:[(0,B.jsx)(`primitive`,{object:a}),(0,B.jsx)(`primitive`,{object:o}),(0,B.jsx)(`mesh`,{geometry:e.core,material:i})]})]})}var ci=.6,li=.42,ui=.5,di=.28,fi=[[-.17,.06],[.17,.06],[-.17,-.1],[.17,-.1]],pi=new A(`#1a1712`);function mi(e,t,n,r){let i=e/2,a=t/2,o=[-i,r,a,i,r,a,0,r+n,a,i,r,-a,-i,r,-a,0,r+n,-a,-i,r,a,0,r+n,a,0,r+n,-a,-i,r,a,0,r+n,-a,-i,r,-a,i,r,a,i,r,-a,0,r+n,-a,i,r,a,0,r+n,-a,0,r+n,a],s=new w;return s.setAttribute(`position`,new me(o,3)),s.computeVertexNormals(),s}function hi(){let e=(0,N.useMemo)(()=>{let e=new O(ci,li,ui);e.deleteAttribute(`uv`);let t=mi(.6599999999999999,.56,di,li/2),n=k([e.toNonIndexed(),t]),r=new v(n,10),i=[],a=(e,t)=>i.push(...e,...t),o=.251;a([-.05,-.42/2,o],[-.05,-.42/2+.17,o]),a([.05,-.42/2,o],[.05,-.42/2+.17,o]),a([-.05,-.42/2+.17,o],[.05,-.42/2+.17,o]);let s=.16,c=-.1,l=.55;for(let[e,t]of[[-.03,-.03],[.03,-.03],[.03,.03],[-.03,.03]])a([s+e,.336,c+t],[s+e,l,c+t]);a([.13,l,-.13],[.19,l,-.13]),a([.19,l,-.13],[.19,l,-.07]),a([.19,l,-.07],[.13,l,-.07]),a([.13,l,-.07],[.13,l,-.13]);let u=new w;return u.setAttribute(`position`,new me(i,3)),{lines:k([r,u]),win:new g(.09,.1),mats:fi.map(([e,t])=>new D().makeTranslation(e,t,.252))}},[]),t=Pr(5,e.lines,{radius:1.05,edges:!0,turn:`spin`,faceYaw:.5,size:.015}),n=(0,N.useMemo)(()=>Q(Yr,Xr,t.solidUniforms,{uColor:{value:Y.clone()},uIntensity:{value:1.7},uGlowColor:{value:Y.clone()},uGlowLevel:{value:-1},uGlint:{value:5},uGlintAxis:{value:new S(1/.6599999999999999,0,0)},uGlintWidth:{value:.08},uSway:{value:0},uPivot:{value:new S}}),[t.solidUniforms]),r=(0,N.useMemo)(()=>Q($,ni,t.solidUniforms,{uColor:{value:pi.clone()},uEmissive:{value:pi.clone()},uEmissiveStrength:{value:0},uRim:{value:Y.clone()},uRimStrength:{value:.1},uMetal:{value:0}},{side:2}),[t.solidUniforms]),i=(0,N.useMemo)(()=>{let t=new s(e.win,r,fi.length);return e.mats.forEach((e,n)=>t.setMatrixAt(n,e)),t.instanceMatrix.needsUpdate=!0,t.frustumCulled=!1,t},[e,r]),a=(0,N.useRef)(null);return C((e,i)=>{let o=t.update(e,i);if(!o.visible){a.current&&(a.current.intensity=0);return}let s=Math.min(1,Math.max(0,(o.presence-.6)/.15)),c=Math.min(1,Math.max(0,(o.presence-.75)/.2));r.uniforms.uEmissive.value.copy(pi).lerp(wr,s).lerp(Y,c*.8);let l=o.r.reduced?1:.94+.06*Math.sin(o.time*9)*Math.sin(o.time*3.7);r.uniforms.uEmissiveStrength.value=(s*1.1+c*.9)*l,a.current&&(a.current.intensity=(s*.8+c*1.2)*l);let u=o.time%3.2;n.uniforms.uGlint.value=u<.7?-.4+u/.7*1.8:5}),(0,B.jsxs)(`group`,{ref:t.group,position:t.position,children:[(0,B.jsx)(`points`,{ref:t.points,geometry:t.particleGeometry,material:t.particleMaterial,frustumCulled:!1}),(0,B.jsx)(`lineSegments`,{geometry:e.lines,material:n}),(0,B.jsx)(`primitive`,{object:i}),(0,B.jsx)(`pointLight`,{ref:a,color:`#f2c98a`,intensity:0,distance:2.4,decay:2,position:[0,.05,0]})]})}var gi=.12,_i=.012,vi=.27,yi=.1,bi=-.01999999999999999;function xi(){let e=new i(.05,.009,8,20),t=new O(.02,vi,.008);t.translate(0,-.05-vi/2,0);let n=new O(.045,.03,.008);n.translate(.03,-.295,0);let r=new O(.036,.026,.008);r.translate(.026,-.24,0);let a=k([e.toNonIndexed(),t.toNonIndexed(),n.toNonIndexed(),r.toNonIndexed()]);return new v(a,20)}function Si(){let e=(0,N.useMemo)(()=>{let e=new i(gi,_i,10,40);e.translate(0,yi,0);let t=xi(),n=[-.75,0,.75].map((e,n)=>{let r=new D,i=new c().setFromEuler(new a(0,e,.18*(n-1)));r.compose(new S(0,-.05999999999999999,0),i,new S(1,1,1));let o=t.clone().applyMatrix4(r),s=o.getAttribute(`position`).count;return o.setAttribute(`aSway`,new T(new Float32Array(s).fill(n+1),1)),o}),r=k(n),o=new v(e,25);return{ring:e,lines:r,sample:k([o,r.clone().deleteAttribute(`aSway`)])}},[]),t=Pr(6,e.sample,{radius:.9,edges:!0,turn:`spin`,faceYaw:0,size:.013}),n=(0,N.useMemo)(()=>Q($,ni,t.solidUniforms,{uColor:{value:Y.clone().multiplyScalar(.9)},uEmissive:{value:Y.clone()},uEmissiveStrength:{value:.18},uRim:{value:wr.clone()},uRimStrength:{value:.5},uMetal:{value:1}}),[t.solidUniforms]),r=(0,N.useMemo)(()=>Q(Yr,Xr,t.solidUniforms,{uColor:{value:Y.clone()},uIntensity:{value:1.6},uGlowColor:{value:Y.clone()},uGlowLevel:{value:-1},uGlint:{value:5},uGlintAxis:{value:new S(0,-1/.43000000000000005,0)},uGlintWidth:{value:.09},uSway:{value:.09},uPivot:{value:new S(0,bi,0)}}),[t.solidUniforms]);return C((e,n)=>{let i=t.update(e,n);if(!i.visible)return;r.uniforms.uSway.value=i.r.reduced?0:.09;let a=i.time%3;r.uniforms.uGlint.value=a<.6?-.3+a/.6*1.6:5}),(0,B.jsxs)(`group`,{ref:t.group,position:t.position,children:[(0,B.jsx)(`points`,{ref:t.points,geometry:t.particleGeometry,material:t.particleMaterial,frustumCulled:!1}),(0,B.jsx)(`mesh`,{geometry:e.ring,material:n}),(0,B.jsx)(`lineSegments`,{geometry:e.lines,material:r})]})}function Ci(){return(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)(lt,{}),(0,B.jsx)(Fe,{}),(0,B.jsx)(Nt,{}),(0,B.jsx)(nt,{}),(0,B.jsx)(Tt,{}),(0,B.jsx)(Ht,{}),(0,B.jsx)(fn,{}),(0,B.jsx)(tn,{}),(0,B.jsx)(Fn,{}),(0,B.jsx)(xn,{}),(0,B.jsx)(Dn,{}),(0,B.jsx)(qn,{}),(0,B.jsx)(Xn,{}),(0,B.jsx)(tr,{}),(0,B.jsx)(lr,{}),(0,B.jsx)(xr,{}),(0,B.jsx)(zr,{}),(0,B.jsx)(qr,{}),(0,B.jsx)(ti,{}),(0,B.jsx)(si,{}),(0,B.jsx)(hi,{}),(0,B.jsx)(Si,{})]})}function wi(){let e=ie(e=>e.gl);return C(()=>{let t=V(),n=1-.82*(t.local(6,0,.15)*(1-t.local(6,.85,1)));e.toneMappingExposure=n+t.flash*.9}),null}function Ti(){let e=j(e=>e.lowPower),t=j(e=>e.reducedMotion),n=(0,N.useRef)(null),[r,i]=(0,N.useState)(!1);return(0,N.useEffect)(()=>{if(!t)return;let e=be.getState().shot,n=0,r=be.subscribe(t=>{t.shot!==e&&(e=t.shot,i(!0),window.clearTimeout(n),n=window.setTimeout(()=>i(!1),150))});return()=>{r(),window.clearTimeout(n)}},[t]),(0,B.jsx)(`div`,{className:`scene ${r?`is-fading`:``}`,ref:n,"aria-hidden":`true`,children:(0,B.jsxs)(fe,{dpr:[1,e?1.5:2],gl:{antialias:!e,powerPreference:`high-performance`,alpha:!1,stencil:!1,depth:!0},camera:{fov:42,near:.1,far:400,position:[0,1.6,4.6]},shadows:!e,frameloop:`always`,onCreated:({gl:e})=>{e.setClearColor(`#07070a`,1),e.toneMapping=4,e.toneMappingExposure=1},children:[(0,B.jsx)(`color`,{attach:`background`,args:[`#07070a`]}),(0,B.jsx)(`fog`,{attach:`fog`,args:[`#07070a`,30,160]}),(0,B.jsx)(Ne,{}),(0,B.jsx)(wi,{}),(0,B.jsx)(N.Suspense,{fallback:null,children:(0,B.jsx)(Ci,{})}),!e&&!t&&(0,B.jsx)(Pe,{})]})})}export{Ti as default};