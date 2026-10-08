import{n as e,t}from"./index-RN1Wv0Ou.js";var n=e(),r=t();function i({SIM_RESOLUTION:e=96,DYE_RESOLUTION:t=640,DENSITY_DISSIPATION:i=4.2,VELOCITY_DISSIPATION:a=2.4,PRESSURE:o=.1,PRESSURE_ITERATIONS:s=16,CURL:c=2.4,SPLAT_RADIUS:l=.16,SPLAT_FORCE:u=5200,SHADING:d=!0,COLOR:ee=`#6d5ef0`,IDLE_TIMEOUT:f=1500}){let p=(0,n.useRef)(null),m=(0,n.useRef)(null);return(0,n.useEffect)(()=>{let n=p.current;if(!n||window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches)return;let r=!0,h=!1,g=0,_={SIM_RESOLUTION:e,DYE_RESOLUTION:t,DENSITY_DISSIPATION:i,VELOCITY_DISSIPATION:a,PRESSURE:o,PRESSURE_ITERATIONS:s,CURL:c,SPLAT_RADIUS:l,SPLAT_FORCE:u,SHADING:d,COLOR:ee},v={texcoordX:0,texcoordY:0,prevTexcoordX:0,prevTexcoordY:0,deltaX:0,deltaY:0,moved:!1,color:{r:0,g:0,b:0}};function y(e,t,n,r){if(!te(e,t,n,r))switch(t){case e.R16F:return y(e,e.RG16F,e.RG,r);case e.RG16F:return y(e,e.RGBA16F,e.RGBA,r);default:return null}return{internalFormat:t,format:n}}function te(e,t,n,r){let i=e.createTexture();e.bindTexture(e.TEXTURE_2D,i),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,t,4,4,0,n,r,null);let a=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,a),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,i,0),e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE}function ne(e){let t={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1},n=e.getContext(`webgl2`,t),r=!!n;if(r||(n=e.getContext(`webgl`,t)||e.getContext(`experimental-webgl`,t)),!n)return null;let i,a;r?(n.getExtension(`EXT_color_buffer_float`),a=n.getExtension(`OES_texture_float_linear`)):(i=n.getExtension(`OES_texture_half_float`),a=n.getExtension(`OES_texture_half_float_linear`)),n.clearColor(0,0,0,1);let o=r?n.HALF_FLOAT:i&&i.HALF_FLOAT_OES,s,c,l;return r?(s=y(n,n.RGBA16F,n.RGBA,o),c=y(n,n.RG16F,n.RG,o),l=y(n,n.R16F,n.RED,o)):(s=y(n,n.RGBA,n.RGBA,o),c=s,l=s),{gl:n,ext:{formatRGBA:s,formatRG:c,formatR:l,halfFloatTexType:o,supportLinearFiltering:a}}}let b=ne(n);if(!b)return;let{gl:x,ext:S}=b;S.supportLinearFiltering||(_.DYE_RESOLUTION=256,_.SHADING=!1);function C(e,t,n){let r=n?n.map(e=>`#define ${e}\n`).join(``):``,i=x.createShader(e);return x.shaderSource(i,r+t),x.compileShader(i),i}function re(e,t){let n=x.createProgram();return x.attachShader(n,e),x.attachShader(n,t),x.linkProgram(n),n}function ie(e){let t={},n=x.getProgramParameter(e,x.ACTIVE_UNIFORMS);for(let r=0;r<n;r+=1){let n=x.getActiveUniform(e,r).name;t[n]=x.getUniformLocation(e,n)}return t}class w{constructor(e,t){this.program=re(e,t),this.uniforms=ie(this.program)}bind(){x.useProgram(this.program)}}let T=C(x.VERTEX_SHADER,`
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;
        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `),ae=C(x.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        void main () { gl_FragColor = texture2D(uTexture, vUv); }
      `),oe=C(x.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;
        void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
      `),se=C(x.FRAGMENT_SHADER,`
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uTexture;
        uniform vec2 texelSize;
        void main () {
            vec3 c = texture2D(uTexture, vUv).rgb;
            #ifdef SHADING
                vec3 lc = texture2D(uTexture, vL).rgb;
                vec3 rc = texture2D(uTexture, vR).rgb;
                vec3 tc = texture2D(uTexture, vT).rgb;
                vec3 bc = texture2D(uTexture, vB).rgb;
                float dx = length(rc) - length(lc);
                float dy = length(tc) - length(bc);
                vec3 n = normalize(vec3(dx, dy, length(texelSize)));
                vec3 l = vec3(0.0, 0.0, 1.0);
                float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
                c *= diffuse;
            #endif
            float a = max(c.r, max(c.g, c.b));
            gl_FragColor = vec4(c, a);
        }
      `,_.SHADING?[`SHADING`]:null),ce=C(x.FRAGMENT_SHADER,`
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;
        void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
      `),le=C(x.FRAGMENT_SHADER,`
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform vec2 dyeTexelSize;
        uniform float dt;
        uniform float dissipation;
        vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
            vec2 st = uv / tsize - 0.5;
            vec2 iuv = floor(st);
            vec2 fuv = fract(st);
            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }
        void main () {
            #ifdef MANUAL_FILTERING
                vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                vec4 result = bilerp(uSource, coord, dyeTexelSize);
            #else
                vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                vec4 result = texture2D(uSource, coord);
            #endif
            float decay = 1.0 + dissipation * dt;
            gl_FragColor = result / decay;
        }
      `,S.supportLinearFiltering?null:[`MANUAL_FILTERING`]),ue=C(x.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;
        void main () {
            float L = texture2D(uVelocity, vL).x;
            float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y;
            float B = texture2D(uVelocity, vB).y;
            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.0) { L = -C.x; }
            if (vR.x > 1.0) { R = -C.x; }
            if (vT.y > 1.0) { T = -C.y; }
            if (vB.y < 0.0) { B = -C.y; }
            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
      `),de=C(x.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;
        void main () {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
      `),fe=C(x.FRAGMENT_SHADER,`
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;
        void main () {
            float L = texture2D(uCurl, vL).x;
            float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;
            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            force.y *= -1.0;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity += force * dt;
            velocity = min(max(velocity, -1000.0), 1000.0);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `),pe=C(x.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;
        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
      `),me=C(x.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;
        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity.xy -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `),E=(x.bindBuffer(x.ARRAY_BUFFER,x.createBuffer()),x.bufferData(x.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),x.STATIC_DRAW),x.bindBuffer(x.ELEMENT_ARRAY_BUFFER,x.createBuffer()),x.bufferData(x.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),x.STATIC_DRAW),x.vertexAttribPointer(0,2,x.FLOAT,!1,0,0),x.enableVertexAttribArray(0),(e,t=!1)=>{e==null?(x.viewport(0,0,x.drawingBufferWidth,x.drawingBufferHeight),x.bindFramebuffer(x.FRAMEBUFFER,null)):(x.viewport(0,0,e.width,e.height),x.bindFramebuffer(x.FRAMEBUFFER,e.fbo)),t&&(x.clearColor(0,0,0,1),x.clear(x.COLOR_BUFFER_BIT)),x.drawElements(x.TRIANGLES,6,x.UNSIGNED_SHORT,0)}),D,O,k,A,j,he=new w(T,ae),M=new w(T,oe),N=new w(T,ce),P=new w(T,le),F=new w(T,ue),I=new w(T,de),L=new w(T,fe),R=new w(T,pe),z=new w(T,me),B=new w(T,se);function V(e,t,n,r,i,a){x.activeTexture(x.TEXTURE0);let o=x.createTexture();x.bindTexture(x.TEXTURE_2D,o),x.texParameteri(x.TEXTURE_2D,x.TEXTURE_MIN_FILTER,a),x.texParameteri(x.TEXTURE_2D,x.TEXTURE_MAG_FILTER,a),x.texParameteri(x.TEXTURE_2D,x.TEXTURE_WRAP_S,x.CLAMP_TO_EDGE),x.texParameteri(x.TEXTURE_2D,x.TEXTURE_WRAP_T,x.CLAMP_TO_EDGE),x.texImage2D(x.TEXTURE_2D,0,n,e,t,0,r,i,null);let s=x.createFramebuffer();return x.bindFramebuffer(x.FRAMEBUFFER,s),x.framebufferTexture2D(x.FRAMEBUFFER,x.COLOR_ATTACHMENT0,x.TEXTURE_2D,o,0),x.viewport(0,0,e,t),x.clear(x.COLOR_BUFFER_BIT),{texture:o,fbo:s,width:e,height:t,texelSizeX:1/e,texelSizeY:1/t,attach(e){return x.activeTexture(x.TEXTURE0+e),x.bindTexture(x.TEXTURE_2D,o),e}}}function H(e,t,n,r,i,a){let o=V(e,t,n,r,i,a),s=V(e,t,n,r,i,a);return{width:e,height:t,texelSizeX:o.texelSizeX,texelSizeY:o.texelSizeY,get read(){return o},set read(e){o=e},get write(){return s},set write(e){s=e},swap(){let e=o;o=s,s=e}}}function ge(e,t,n,r,i,a,o){let s=V(t,n,r,i,a,o);return he.bind(),x.uniform1i(he.uniforms.uTexture,e.attach(0)),E(s),s}function _e(e,t,n,r,i,a,o){return e.width===t&&e.height===n?e:(e.read=ge(e.read,t,n,r,i,a,o),e.write=V(t,n,r,i,a,o),e.width=t,e.height=n,e.texelSizeX=1/t,e.texelSizeY=1/n,e)}function U(e){let t=x.drawingBufferWidth/x.drawingBufferHeight;t<1&&(t=1/t);let n=Math.round(e),r=Math.round(e*t);return x.drawingBufferWidth>x.drawingBufferHeight?{width:r,height:n}:{width:n,height:r}}function W(){let e=U(_.SIM_RESOLUTION),t=U(_.DYE_RESOLUTION),n=S.halfFloatTexType,r=S.formatRGBA,i=S.formatRG,a=S.formatR,o=S.supportLinearFiltering?x.LINEAR:x.NEAREST;x.disable(x.BLEND),D=D?_e(D,t.width,t.height,r.internalFormat,r.format,n,o):H(t.width,t.height,r.internalFormat,r.format,n,o),O=O?_e(O,e.width,e.height,i.internalFormat,i.format,n,o):H(e.width,e.height,i.internalFormat,i.format,n,o),k=V(e.width,e.height,a.internalFormat,a.format,n,x.NEAREST),A=V(e.width,e.height,a.internalFormat,a.format,n,x.NEAREST),j=H(e.width,e.height,a.internalFormat,a.format,n,x.NEAREST)}function G(e){let t=Math.min(window.devicePixelRatio||1,1.5);return Math.floor(e*t)}function K(){let e=G(n.clientWidth),t=G(n.clientHeight);return n.width!==e||n.height!==t?(n.width=e,n.height=t,!0):!1}function ve(e){let t=e.replace(`#`,``),n=t.length===3?t.split(``).map(e=>e+e).join(``):t;return{r:parseInt(n.slice(0,2),16)/255,g:parseInt(n.slice(2,4),16)/255,b:parseInt(n.slice(4,6),16)/255}}let q=ve(_.COLOR);function J(){let e=.12+Math.random()*.07;return{r:q.r*e,g:q.g*e,b:q.b*e}}function ye(e){let t=n.width/n.height;return t>1?e*t:e}function be(e){let t=n.width/n.height;return t<1?e*t:e}function xe(e){let t=n.width/n.height;return t>1?e/t:e}function Se(e,t,r,i,a){N.bind(),x.uniform1i(N.uniforms.uTarget,O.read.attach(0)),x.uniform1f(N.uniforms.aspectRatio,n.width/n.height),x.uniform2f(N.uniforms.point,e,t),x.uniform3f(N.uniforms.color,r,i,0),x.uniform1f(N.uniforms.radius,ye(_.SPLAT_RADIUS/100)),E(O.write),O.swap(),x.uniform1i(N.uniforms.uTarget,D.read.attach(0)),x.uniform3f(N.uniforms.color,a.r,a.g,a.b),E(D.write),D.swap()}function Ce(e){x.disable(x.BLEND),I.bind(),x.uniform2f(I.uniforms.texelSize,O.texelSizeX,O.texelSizeY),x.uniform1i(I.uniforms.uVelocity,O.read.attach(0)),E(A),L.bind(),x.uniform2f(L.uniforms.texelSize,O.texelSizeX,O.texelSizeY),x.uniform1i(L.uniforms.uVelocity,O.read.attach(0)),x.uniform1i(L.uniforms.uCurl,A.attach(1)),x.uniform1f(L.uniforms.curl,_.CURL),x.uniform1f(L.uniforms.dt,e),E(O.write),O.swap(),F.bind(),x.uniform2f(F.uniforms.texelSize,O.texelSizeX,O.texelSizeY),x.uniform1i(F.uniforms.uVelocity,O.read.attach(0)),E(k),M.bind(),x.uniform1i(M.uniforms.uTexture,j.read.attach(0)),x.uniform1f(M.uniforms.value,_.PRESSURE),E(j.write),j.swap(),R.bind(),x.uniform2f(R.uniforms.texelSize,O.texelSizeX,O.texelSizeY),x.uniform1i(R.uniforms.uDivergence,k.attach(0));for(let e=0;e<_.PRESSURE_ITERATIONS;e+=1)x.uniform1i(R.uniforms.uPressure,j.read.attach(1)),E(j.write),j.swap();z.bind(),x.uniform2f(z.uniforms.texelSize,O.texelSizeX,O.texelSizeY),x.uniform1i(z.uniforms.uPressure,j.read.attach(0)),x.uniform1i(z.uniforms.uVelocity,O.read.attach(1)),E(O.write),O.swap(),P.bind(),x.uniform2f(P.uniforms.texelSize,O.texelSizeX,O.texelSizeY),S.supportLinearFiltering||x.uniform2f(P.uniforms.dyeTexelSize,O.texelSizeX,O.texelSizeY);let t=O.read.attach(0);x.uniform1i(P.uniforms.uVelocity,t),x.uniform1i(P.uniforms.uSource,t),x.uniform1f(P.uniforms.dt,e),x.uniform1f(P.uniforms.dissipation,_.VELOCITY_DISSIPATION),E(O.write),O.swap(),S.supportLinearFiltering||x.uniform2f(P.uniforms.dyeTexelSize,D.texelSizeX,D.texelSizeY),x.uniform1i(P.uniforms.uVelocity,O.read.attach(0)),x.uniform1i(P.uniforms.uSource,D.read.attach(1)),x.uniform1f(P.uniforms.dissipation,_.DENSITY_DISSIPATION),E(D.write),D.swap()}function we(){x.blendFunc(x.ONE,x.ONE_MINUS_SRC_ALPHA),x.enable(x.BLEND),B.bind(),_.SHADING&&x.uniform2f(B.uniforms.texelSize,1/x.drawingBufferWidth,1/x.drawingBufferHeight),x.uniform1i(B.uniforms.uTexture,D.read.attach(0)),E(null)}K(),W();let Y=Date.now();function Te(){if(!r)return;let e=Date.now();if(e-g>f){h=!1,m.current=null;return}let t=(e-Y)/1e3;t=Math.min(t,.016666),Y=e,K()&&W(),v.moved&&(v.moved=!1,Se(v.texcoordX,v.texcoordY,v.deltaX*_.SPLAT_FORCE,v.deltaY*_.SPLAT_FORCE,v.color)),Ce(t),we(),m.current=requestAnimationFrame(Te)}function Ee(){g=Date.now(),!h&&r&&(h=!0,Y=Date.now(),m.current=requestAnimationFrame(Te))}let X=!1;function Z(){K()&&W()}function Q(e,t){Z(),v.texcoordX=G(e)/n.width,v.texcoordY=1-G(t)/n.height,v.prevTexcoordX=v.texcoordX,v.prevTexcoordY=v.texcoordY,X=!0}function De(e,t){Z(),v.prevTexcoordX=v.texcoordX,v.prevTexcoordY=v.texcoordY,v.texcoordX=G(e)/n.width,v.texcoordY=1-G(t)/n.height,v.deltaX=be(v.texcoordX-v.prevTexcoordX),v.deltaY=xe(v.texcoordY-v.prevTexcoordY),v.moved=Math.abs(v.deltaX)>0||Math.abs(v.deltaY)>0,v.color=J(),Ee()}function Oe(e){if(!X){Q(e.clientX,e.clientY);return}De(e.clientX,e.clientY)}function ke(e){Q(e.clientX,e.clientY);let t=J();Ee(),Se(v.texcoordX,v.texcoordY,14*(Math.random()-.5),34*(Math.random()-.5),{r:t.r*5,g:t.g*5,b:t.b*5})}function Ae(e){let t=e.targetTouches[0];if(t){if(!X){Q(t.clientX,t.clientY);return}De(t.clientX,t.clientY)}}function je(){document.hidden&&(g=0)}function $(){Z()}return window.addEventListener(`mousemove`,Oe),window.addEventListener(`mousedown`,ke),window.addEventListener(`touchmove`,Ae,{passive:!0}),window.addEventListener(`resize`,$),document.addEventListener(`visibilitychange`,je),()=>{r=!1,h=!1,m.current&&=(cancelAnimationFrame(m.current),null),window.removeEventListener(`mousemove`,Oe),window.removeEventListener(`mousedown`,ke),window.removeEventListener(`touchmove`,Ae),window.removeEventListener(`resize`,$),document.removeEventListener(`visibilitychange`,je)}},[e,t,i,a,o,s,c,l,u,d,ee,f]),(0,r.jsx)(`div`,{className:`splash-cursor`,"aria-hidden":`true`,children:(0,r.jsx)(`canvas`,{ref:p})})}export{i as default};