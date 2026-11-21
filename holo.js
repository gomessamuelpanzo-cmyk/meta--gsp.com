var Holo=(function(){
 var VS='precision highp float;attribute vec2 aPos;varying vec2 vUv;varying vec2 vP;varying vec2 vEL;varying vec2 vER;varying vec2 vMo;'
 +'uniform vec2 uSize;uniform vec2 uHead;uniform float uShiftX;uniform float uBreath;uniform float uSway;uniform float uMouth;uniform float uSmile;uniform float uBrow;uniform vec4 uArms;'
 +'vec2 rot(vec2 p,vec2 c,float a){float s=sin(a);float k=cos(a);vec2 d=p-c;return c+vec2(d.x*k-d.y*s,d.x*s+d.y*k);}'
 +'vec2 warp(vec2 p){vec2 q=p;'
 +'float gx=1.0-smoothstep(22.0,62.0,abs(p.x-500.0));'
 +'q.y+=uMouth*11.0*smoothstep(167.0,179.0,p.y)*(1.0-smoothstep(196.0,226.0,p.y))*gx;'
 +'float cx=exp(-pow((abs(p.x-500.0)-25.0)/9.0,2.0))*exp(-pow((p.y-171.0)/11.0,2.0));q.y-=uSmile*3.5*cx;'
 +'float bx=smoothstep(14.0,28.0,abs(p.x-500.0))*(1.0-smoothstep(62.0,86.0,abs(p.x-500.0)));q.y-=uBrow*4.0*bx*exp(-pow((p.y-98.0)/9.0,2.0));'
 +'float wh=(1.0-smoothstep(205.0,262.0,p.y))*(1.0-smoothstep(105.0,215.0,abs(p.x-500.0)));'
 +'q=rot(q,vec2(500.0,238.0),uHead.x*wh);q+=vec2(uShiftX,uHead.y)*wh;'
 +'float vl=smoothstep(250.0,330.0,p.y)*(1.0-smoothstep(900.0,990.0,p.y));'
 +'float wl=(1.0-smoothstep(348.0,394.0,p.x))*smoothstep(205.0,258.0,p.x)*vl;'
 +'vec2 shl=vec2(350.0,292.0);vec2 ell=rot(vec2(306.0,540.0),shl,uArms.x);'
 +'q=rot(q,shl,uArms.x*wl);q=rot(q,ell,uArms.y*wl*smoothstep(500.0,590.0,p.y));'
 +'float wr=smoothstep(606.0,652.0,p.x)*(1.0-smoothstep(742.0,795.0,p.x))*vl;'
 +'vec2 shr=vec2(650.0,292.0);vec2 elr=rot(vec2(714.0,540.0),shr,uArms.z);'
 +'q=rot(q,shr,uArms.z*wr);q=rot(q,elr,uArms.w*wr*smoothstep(500.0,590.0,p.y));'
 +'float wt=smoothstep(250.0,340.0,p.y)*(1.0-smoothstep(560.0,760.0,p.y))*(1.0-smoothstep(150.0,310.0,abs(p.x-500.0)));'
 +'q.y-=uBreath*5.0*wt;q.x+=(p.x-500.0)*uBreath*0.006*wt;'
 +'q=rot(q,vec2(500.0,1400.0),uSway);return q;}'
 +'void main(){vec2 q=warp(aPos);vUv=aPos/uSize;vP=q;vEL=warp(vec2(471.7,115.7));vER=warp(vec2(529.0,115.0));vMo=warp(vec2(500.7,166.0));'
 +'gl_Position=vec4(q.x/uSize.x*2.0-1.0,1.0-q.y/uSize.y*2.0,0.0,1.0);}';
 var FS='precision mediump float;varying vec2 vUv;varying vec2 vP;varying vec2 vEL;varying vec2 vER;varying vec2 vMo;'
 +'uniform sampler2D uTex;uniform float uTime;uniform float uGlitch;uniform float uWeak;uniform float uGlow;uniform float uBlink;uniform float uMouthF;uniform float uMouthW;uniform vec3 uSkin;'
 +'float lidMask(vec2 p,vec2 c,float b){vec2 q=(p-c)/vec2(17.0,8.5);float inside=1.0-smoothstep(0.82,1.0,length(q));float edge=c.y-8.5+17.0*b;return inside*smoothstep(edge+1.2,edge-1.2,p.y);}'
 +'void main(){vec2 uv=vUv;float row=floor(vP.y/22.0);'
 +'float gl=uGlitch*step(0.6,fract(sin(row*12.9898+floor(uTime*16.0))*43758.5453));'
 +'uv.x+=gl*0.012*(fract(sin(row*78.233)*437.58)-0.5)*2.0;'
 +'float ca=0.0010+uGlitch*0.004+uWeak*0.0015;'
 +'vec3 col;col.r=texture2D(uTex,uv+vec2(ca,0.0)).r;col.g=texture2D(uTex,uv).g;col.b=texture2D(uTex,uv-vec2(ca,0.0)).b;'
 +'float lid=max(lidMask(vP,vEL,uBlink),lidMask(vP,vER,uBlink));col=mix(col,uSkin*0.9,lid*0.97);'
 +'float eg=max(1.0-smoothstep(0.0,1.3,abs(vP.y-(vEL.y-8.5+17.0*uBlink)))*1.0,0.0);'
 +'if(uBlink>0.25){float le=(1.0-smoothstep(0.82,1.0,length((vP-vEL)/vec2(17.0,8.5))))*smoothstep(1.3,0.0,abs(vP.y-(vEL.y-8.5+17.0*uBlink)));col=mix(col,vec3(0.05,0.03,0.03),le*0.8);'
 +'float lr=(1.0-smoothstep(0.82,1.0,length((vP-vER)/vec2(17.0,8.5))))*smoothstep(1.3,0.0,abs(vP.y-(vER.y-8.5+17.0*uBlink)));col=mix(col,vec3(0.05,0.03,0.03),lr*0.8);}'
 +'float h=uMouthF*10.5;if(h>0.6){vec2 mc=vMo+vec2(0.0,h*0.5+0.8);vec2 q=(vP-mc)/vec2(13.0+uMouthW*3.5,max(h*0.5,0.5));float m=1.0-smoothstep(0.72,1.0,length(q));'
 +'vec3 ins=mix(vec3(0.07,0.01,0.02),vec3(0.42,0.10,0.12),smoothstep(-0.2,1.0,q.y));ins=mix(vec3(0.86,0.86,0.9),ins,smoothstep(-1.0,-0.45,q.y));col=mix(col,ins,m*0.96);}'
 +'float scan=0.91+0.09*sin(gl_FragCoord.y*1.7-uTime*3.0);'
 +'float band=exp(-pow((fract(uTime*0.11)-vUv.y)*16.0,2.0));'
 +'col*=scan;col+=vec3(0.15,0.55,0.95)*band*0.16*(0.4+uGlow);'
 +'col=mix(col,vec3(dot(col,vec3(0.3,0.59,0.11))),uWeak*0.7);'
 +'col*=0.975+0.025*sin(uTime*47.0)*sin(uTime*13.0);col=mix(col,col*vec3(0.80,1.0,1.16),0.26);col+=vec3(0.0,0.09,0.17)*uGlow*0.22;'
 +'float a=(1.0-smoothstep(0.40,0.50,abs(vUv.x-0.5)))*smoothstep(0.0,0.03,vUv.y)*(1.0-smoothstep(0.97,1.0,vUv.y));a*=1.0-0.35*uWeak;'
 +'gl_FragColor=vec4(col*a,a);}';
 var W=1024,H=1536,GX=96,GY=144;
 var cv=null,gl=null,pr=null,U={},ok=false,tried=false,mount=null,raf=0,lastT=0,loaded=false,tex=null,idx=0,resizeObserver=null;
 var S={roll:0,nod:0,shx:0,breath:0,sway:0,mouth:0,mouthW:.5,smile:.12,brow:0,blink:0,glitch:0,weak:0,glow:.4,aLU:0,aLF:0,aRU:0,aRF:0};
 var state='idle',nextBlink=2,blinkT=-1,gest=null,nextGest=1.5,nextGlitch=7,glitchT=-9,beatT=-9,waveT=-9,over=null,skin=[.62,.42,.33];
 var GESTS=[[.06,.34,-.06,-.34],[0,0,-.10,-.42],[.10,.42,0,0],[.04,.18,-.04,-.18]];
 var api={lipFn:null,ok:false};
 function mk(type,src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s}
 function init(src){
  if(tried)return ok;tried=true;
  try{
   cv=document.createElement('canvas');cv.className='holo';cv.setAttribute('aria-hidden','true');
   gl=cv.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false,depth:false,stencil:false,powerPreference:'low-power',preserveDrawingBuffer:false});
   if(!gl)throw new Error('sem webgl');
   pr=gl.createProgram();gl.attachShader(pr,mk(gl.VERTEX_SHADER,VS));gl.attachShader(pr,mk(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);
   if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(pr));
   gl.useProgram(pr);
   ['uSize','uHead','uShiftX','uBreath','uSway','uMouth','uSmile','uBrow','uArms','uTex','uTime','uGlitch','uWeak','uGlow','uBlink','uMouthW','uMouthF','uSkin'].forEach(function(n){U[n]=gl.getUniformLocation(pr,n)});
   var pos=new Float32Array((GX+1)*(GY+1)*2),k=0;
   for(var j=0;j<=GY;j++)for(var i=0;i<=GX;i++){pos[k++]=i/GX*W;pos[k++]=j/GY*H}
   var ind=new Uint16Array(GX*GY*6),n=0;
   for(var j2=0;j2<GY;j2++)for(var i2=0;i2<GX;i2++){var a=j2*(GX+1)+i2,b=a+1,c=a+GX+1,d=c+1;ind[n++]=a;ind[n++]=b;ind[n++]=c;ind[n++]=b;ind[n++]=d;ind[n++]=c}
   idx=n;
   var vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,pos,gl.STATIC_DRAW);
   var al=gl.getAttribLocation(pr,'aPos');gl.enableVertexAttribArray(al);gl.vertexAttribPointer(al,2,gl.FLOAT,false,0,0);
   var ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,ind,gl.STATIC_DRAW);
   gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(0,0,0,0);
   var im=new Image();
   im.onload=function(){
    try{
     tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);
     gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);
     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
     var c2=document.createElement('canvas');c2.width=im.naturalWidth;c2.height=im.naturalHeight;var x=c2.getContext('2d');x.drawImage(im,0,0);
     var sx=im.naturalWidth/W,sy=im.naturalHeight/H,d=x.getImageData(Math.round(466*sx),Math.round(105*sy),Math.round(14*sx),Math.round(3*sy)).data,r=0,g=0,b=0,m=d.length/4;
     for(var q=0;q<d.length;q+=4){r+=d[q];g+=d[q+1];b+=d[q+2]}
     skin=[r/m/255,g/m/255,b/m/255];loaded=true;
    }catch(e){ok=false;api.ok=false;api.err=String(e&&e.message||e);console.error('Holo tex:',api.err);if(cv.parentNode)cv.parentNode.removeChild(cv)}
   };
   im.onerror=function(){ok=false;api.ok=false;api.err='Não foi possível carregar '+src};
   im.src=src;ok=true;api.ok=true;
  }catch(e){ok=false;api.ok=false;api.err=String(e&&e.message||e);console.error('Holo:',api.err)}
  return ok;
 }
 function fit(){
  if(!mount||!cv)return;
  var h=mount.clientHeight||300,dpr=Math.min(window.devicePixelRatio||1,1.5),ph=Math.max(64,Math.min(2048,Math.round(h*dpr))),pw=Math.round(ph*2/3);
  if(cv.width!==pw||cv.height!==ph){cv.width=pw;cv.height=ph}
 }
 function lerp(a,b,k){return a+(b-a)*k}
 function step(t,dt){
  var lip=api.lipFn?api.lipFn():0,T={roll:0,nod:0,shx:0,smile:.12,brow:0,glow:.4,weak:0,glitch:0};
  var iR=Math.sin(t*.43)*.012+Math.sin(t*.91)*.006,iN=Math.sin(t*.67)*.8,beat=Math.max(0,1-(t-beatT)/.28)*2.6;
  if(state==='listening'){T.roll=.035+iR*.5;T.nod=2.5+iN*.5;T.brow=.35;T.smile=.22;T.glow=.7}
  else if(state==='thinking'){T.roll=-.03+iR*.5;T.nod=-2;T.brow=.75;T.smile=0;T.glow=.9}
  else if(state==='speaking'){T.roll=Math.sin(t*1.9)*.02+iR;T.nod=iN+lip*2.4+beat;T.brow=.15+lip*.35;T.smile=.2+lip*.1;T.glow=.8+lip*.4;T.shx=Math.sin(t*.8)*1.5}
  else if(state==='weak'){T.weak=1;T.glitch=.6;T.roll=iR;T.nod=iN;T.glow=.2}
  else{T.roll=iR;T.nod=iN}
  var aT=[Math.sin(t*.9)*.008,0,-Math.sin(t*.9+1)*.008,0];
  if(state==='speaking'&&!gest&&t>=nextGest){var g=GESTS[Math.floor(Math.random()*GESTS.length)],dur=1.1+Math.random()*.9;gest={t0:t,dur:dur,a:g};nextGest=t+dur+.5+Math.random()*1.8}
  if(gest){var p=(t-gest.t0)/gest.dur;if(p>=1)gest=null;else{var e=Math.pow(Math.sin(Math.PI*p),.85);for(var i=0;i<4;i++)aT[i]+=gest.a[i]*e}}
  var wv=(t-waveT)/1.9;if(wv>=0&&wv<1){var we=Math.pow(Math.sin(Math.PI*wv),.6);aT[2]+=-.20*we;aT[3]+=-(.42+.28*Math.sin((t-waveT)*9))*we;T.smile=Math.max(T.smile,.6*we);T.brow=Math.max(T.brow,.4*we)}
  if(t>=nextBlink&&blinkT<0){blinkT=t;nextBlink=t+2.2+Math.random()*3.2}
  var bl=0;if(blinkT>=0){var bp=(t-blinkT)/.2;if(bp>=1)blinkT=-1;else bl=Math.sin(Math.PI*bp)}
  if(t>=nextGlitch){glitchT=t;nextGlitch=t+8+Math.random()*7}
  if(t-glitchT<.3)T.glitch=Math.max(T.glitch,.8);
  var k=1-Math.exp(-dt*8),km=1-Math.exp(-dt*26);
  S.roll=lerp(S.roll,T.roll,k);S.nod=lerp(S.nod,T.nod,k);S.shx=lerp(S.shx,T.shx,k);S.smile=lerp(S.smile,T.smile,k);S.brow=lerp(S.brow,T.brow,k);
  S.glow=lerp(S.glow,T.glow,k);S.weak=lerp(S.weak,T.weak,k);S.glitch=lerp(S.glitch,T.glitch,1-Math.exp(-dt*14));
  S.mouth=lerp(S.mouth,state==='speaking'?Math.min(1,lip*1.15):0,km);S.mouthW=.5+.5*Math.sin(t*9.3)*Math.sin(t*3.1);
  S.aLU=lerp(S.aLU,aT[0],k);S.aLF=lerp(S.aLF,aT[1],k);S.aRU=lerp(S.aRU,aT[2],k);S.aRF=lerp(S.aRF,aT[3],k);
  S.breath=Math.sin(t*1.25);S.sway=Math.sin(t*.5)*.004;S.blink=bl;
  if(over)for(var n in over)S[n]=over[n];
 }
 function draw(t){
  if(!loaded)return;fit();
  gl.viewport(0,0,cv.width,cv.height);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(pr);
  gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);gl.uniform1i(U.uTex,0);
  gl.uniform2f(U.uSize,W,H);gl.uniform2f(U.uHead,S.roll,S.nod);gl.uniform1f(U.uShiftX,S.shx);gl.uniform1f(U.uBreath,S.breath);gl.uniform1f(U.uSway,S.sway);
  gl.uniform1f(U.uMouth,S.mouth);gl.uniform1f(U.uMouthF,S.mouth);gl.uniform1f(U.uSmile,S.smile);gl.uniform1f(U.uBrow,S.brow);gl.uniform4f(U.uArms,S.aLU,S.aLF,S.aRU,S.aRF);
  gl.uniform1f(U.uTime,t%1000);gl.uniform1f(U.uGlitch,S.glitch);gl.uniform1f(U.uWeak,S.weak);gl.uniform1f(U.uGlow,S.glow);gl.uniform1f(U.uBlink,S.blink);gl.uniform1f(U.uMouthW,S.mouthW);
  gl.uniform3f(U.uSkin,skin[0],skin[1],skin[2]);
  gl.drawElements(gl.TRIANGLES,idx,gl.UNSIGNED_SHORT,0);
 }
 function frame(now){
  if(!raf)return;
  if(document.hidden||!mount){raf=0;return}
  raf=requestAnimationFrame(frame);
  var t=now/1000;if(t-lastT<.033)return;var dt=Math.min(.1,t-lastT);lastT=t;
  step(t,dt);draw(t);
 }
 api.init=init;
 api.attach=function(el,src){
  if(!el)return false;
  if(!init(src||'avatar-gomezardo.webp'))return false;
  mount=el;if(cv.parentNode!==el)el.insertBefore(cv,el.firstChild);
  if(window.ResizeObserver){if(resizeObserver)resizeObserver.disconnect();resizeObserver=new ResizeObserver(fit);resizeObserver.observe(el)}
  fit();if(!raf&&!document.hidden){lastT=0;raf=requestAnimationFrame(frame)}return true;
 };
 api.detach=function(){if(raf){cancelAnimationFrame(raf);raf=0}if(resizeObserver){resizeObserver.disconnect();resizeObserver=null}if(cv&&cv.parentNode)cv.parentNode.removeChild(cv);mount=null};
 api.setState=function(s){state=s};
 api.beat=function(){beatT=performance.now()/1000};
 api.wave=function(){waveT=performance.now()/1000};
 api.pose=function(o){over=o};
 api.frame=function(){var t=performance.now()/1000;step(t,.033);draw(t)};
 api.loaded=function(){return loaded};
 api.error=function(){return api.err||null};
 document.addEventListener('visibilitychange',function(){if(!document.hidden&&mount&&!raf){lastT=0;raf=requestAnimationFrame(frame)}});
 return api;
})();
