const stage=root.querySelector('.ts-stage');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const scene=new THREE.Scene();
scene.background=new THREE.Color('#101929');
scene.fog=new THREE.Fog('#101929',1300,2200);
const camera=new THREE.PerspectiveCamera(38,1,.1,1600);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.25;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
stage.appendChild(renderer.domElement);
const world=new THREE.Group();scene.add(world);
const hemi=new THREE.HemisphereLight('#b8d3ff','#747784',2.1);scene.add(hemi);
const moon=new THREE.DirectionalLight('#b4c9ff',2.9);moon.position.set(-160,240,120);moon.castShadow=true;
moon.shadow.mapSize.set(2048,2048);Object.assign(moon.shadow.camera,{left:-220,right:220,top:240,bottom:-240,near:1,far:700});moon.shadow.bias=-.0007;moon.shadow.normalBias=.3;scene.add(moon);
const rim=new THREE.DirectionalLight('#efb7a0',1.8);rim.position.set(200,90,-110);scene.add(rim);
let seed=217;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
const materials=new Map();
function mat(color,roughness=.78,metalness=.1){const key=color+':'+roughness+':'+metalness;if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,roughness,metalness}));return materials.get(key);}
const unitBox=new THREE.BoxGeometry(1,1,1);
function box(parent,w,h,d,x,y,z,material,shadow=true){const mesh=new THREE.Mesh(unitBox,material);mesh.scale.set(w,h,d);mesh.position.set(x,y,z);mesh.castShadow=shadow;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
function cylinder(parent,r1,r2,h,x,y,z,material,sides=12){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,sides),material);mesh.position.set(x,y,z);mesh.castShadow=true;parent.add(mesh);return mesh;}
const dark=mat('#252f40'),concrete=mat('#a0a8b6'),roofMat=mat('#48515f'),steel=mat('#67768b',.42,.55);
function canvasTexture(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);return t;}
const signs=createBillboardTextures(THREE);
Object.values(signs).forEach(t=>{t.anisotropy=8;});
const facadeTextures={};
for(const style of ['glass','stone','dark','brick']){
 facadeTextures[style]=canvasTexture(512,1024,(c,w,h)=>{
   const bg={glass:'#3d5367',stone:'#9b9c9b',dark:'#445063',brick:'#857667'}[style];c.fillStyle=bg;c.fillRect(0,0,w,h);
   const cols=style==='glass'?12:8,rows=32,cw=w/cols,rh=h/rows;
   for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
    const r=rand();c.fillStyle=r>.82?'#fff0bd':r>.62?'#b5c3c0':r>.35?'#405b70':'#263b50';
    c.fillRect(col*cw+cw*.19,row*rh+rh*.15,cw*.61,rh*.72);
    c.fillStyle='#1d2c3930';c.fillRect(col*cw+cw*.19,row*rh+rh*.65,cw*.61,rh*.12);
   }
   if(style==='glass'){c.fillStyle='#adb9c838';for(let i=0;i<cols;i++)c.fillRect(i*cw,0,2,h);c.fillStyle='#87a1b228';for(let r=0;r<rows;r++)c.fillRect(0,r*rh,w,2);}
 });
}
function building(name,x,z,w,d,h,style='glass',color='#bac4d1'){
 const g=new THREE.Group();g.position.set(x,0,z);g.name=name;world.add(g);
 const face=new THREE.MeshStandardMaterial({color,map:facadeTextures[style],emissive:'#a2aec6',emissiveMap:facadeTextures[style],emissiveIntensity:.14,roughness:style==='glass'?.34:.75,metalness:style==='glass'?.3:.12});
 box(g,w,h,d,0,h/2+1,0,[face,face,roofMat,roofMat,face,face]);
 box(g,w+1.2,1.3,d+1.2,0,h+1,0,roofMat);
 box(g,w+1,1,d+1,0,1,0,concrete);
 for(const side of [-1,1]){box(g,w,.7,.7,0,h+2,side*d/2,steel);box(g,.7,.7,d,side*w/2,h+2,0,steel);}
 box(g,w*.32,3,d*.3,w*.12,h+2.5,0,mat('#596373'));
 for(let i=0;i<3;i++){box(g,2.4,1.5,3.3,-w*.22+i*3,h+2,-d*.22,mat('#8a97a4'));}
 if(style!=='glass')for(let y=12;y<h;y+=12)box(g,w+.45,.35,d+.45,0,y,0,concrete,false);
 return g;
}
const screenMaterials=[];
function screen(parent,texture,w,h,x,y,z,angle=0){
 const group=new THREE.Group();group.position.set(x,y,z);group.rotation.y=angle;parent.add(group);
 box(group,w+.9,h+.9,1,0,0,-.65,dark);
 const material=new THREE.MeshBasicMaterial({map:typeof texture==='string'?signs[texture]:texture,toneMapped:false});screenMaterials.push(material);
 const plane=new THREE.Mesh(new THREE.PlaneGeometry(w,h),material);group.add(plane);
 // Narrow lit edges give screens a physical frame without hiding the artwork.
 const edge=new THREE.MeshBasicMaterial({color:'#d5ebff',transparent:true,opacity:.35});
 box(group,w,.12,.1,0,h/2,.1,edge,false);box(group,w,.12,.1,0,-h/2,.1,edge,false);
 return group;
}
const groundTex=canvasTexture(2048,2048,(c,w,h)=>{
 const sx=w/300,sy=h/340,X=x=>(x+150)*sx,Z=z=>(z+170)*sy;
 c.fillStyle='#747c87';c.fillRect(0,0,w,h);
 // Paving joints across each block.
 c.strokeStyle='#505d7030';c.lineWidth=1;
 for(let x=-150;x<150;x+=4){c.beginPath();c.moveTo(X(x),0);c.lineTo(X(x),h);c.stroke();}
 for(let z=-170;z<170;z+=4){c.beginPath();c.moveTo(0,Z(z));c.lineTo(w,Z(z));c.stroke();}
 function line(points,width,color){c.beginPath();points.forEach((p,i)=>i?c.lineTo(X(p[0]),Z(p[1])):c.moveTo(X(p[0]),Z(p[1])));c.strokeStyle=color;c.lineWidth=width*sx;c.stroke();}
 line([[3,-170],[3,170]],19,'#252d3b');line([[-58,-170],[58,170]],19,'#2c3441');
 const cross=[-117,-66,-15,36,87,138];
 cross.forEach(z=>line([[-150,z],[150,z]],13,'#2c3441'));
 line([[3,-170],[3,170]],.25,'#e2c687');
 for(let z=-166;z<165;z+=8){line([[8,z],[8,z+3]],.22,'#bcc5c7');line([[-2,z],[-2,z+3]],.22,'#bcc5c7');}
 cross.forEach(z=>{
  for(const x of [3,z*.34])for(const offset of [-12,12]){
   for(let k=-6;k<=6;k+=2.4){c.fillStyle='#c4ccd0';c.fillRect(X(x+k),Z(z+offset),1.2*sx,4*sy);}
  }
  c.fillStyle='#c9d0d4';c.font='500 22px Arial';c.textAlign='left';c.fillText('W '+Math.round(44-(z-36)/51)+' ST',X(-129),Z(z+1.5));
 });
 // Pedestrian areas follow the bowtie between the two avenues.
 c.fillStyle='#b7b9b8';c.beginPath();[[-26,-99],[-8,-99],[-8,-42]].forEach((p,i)=>i?c.lineTo(X(p[0]),Z(p[1])):c.moveTo(X(p[0]),Z(p[1])));c.closePath();c.fill();
 c.fillStyle='#a1a9ac';c.beginPath();[[14,46],[31,102],[14,102]].forEach((p,i)=>i?c.lineTo(X(p[0]),Z(p[1])):c.moveTo(X(p[0]),Z(p[1])));c.closePath();c.fill();
});
box(world,300,5,340,0,-2.5,0,mat('#2d3748'));
const ground=new THREE.Mesh(new THREE.PlaneGeometry(300,340),new THREE.MeshStandardMaterial({map:groundTex,roughness:.93}));ground.rotation.x=-Math.PI/2;ground.position.y=.08;ground.receiveShadow=true;world.add(ground);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(3000,3000),mat('#101929',.95,0));floor.rotation.x=-Math.PI/2;floor.position.y=-6;floor.receiveShadow=true;scene.add(floor);

// Landmark positions and silhouettes are simplified from NYC Planning references.
const one=building('One Times Square',24,108,19,30,83,'dark');
screen(one,'timesSquare',18,28,0,61,-15.6,Math.PI);
screen(one,'wave',18,22,0,34,-15.6,Math.PI);
screen(one,'cola',18,13,0,15,-15.6,Math.PI);
screen(one,'fashion',25,30,-10.2,58,0,-Math.PI/2);
screen(one,'garden',25,22,-10.2,29,0,-Math.PI/2);
screen(one,'broadway',25,36,10.2,52,0,Math.PI/2);
screen(one,'timesSquare',18,15,0,73,15.6,0);
screen(one,'fashion',18,26,0,50,15.6,0);
screen(one,'cola',18,16,0,25,15.6,0);
box(one,12,5,17,0,87,0,dark);
cylinder(one,.38,.38,16,0,97,-6,steel);
const ball=new THREE.Mesh(new THREE.IcosahedronGeometry(2.9,2),new THREE.MeshStandardMaterial({color:'#d7ffff',emissive:'#9effff',emissiveIntensity:1.7,metalness:.65,roughness:.2}));ball.position.set(0,101,-6);one.add(ball);
const ballWire=new THREE.LineSegments(new THREE.EdgesGeometry(ball.geometry),new THREE.LineBasicMaterial({color:'#e1ffff'}));ball.add(ballWire);

const two=building('Two Times Square',-14,-136,31,28,67,'stone');
screen(two,'cola',31,16,0,64,14.7);screen(two,'wave',31,20,0,45,14.7);screen(two,'broadway',31,17,0,24,14.7);screen(two,'ticker',31,5,0,11,14.8);
screen(two,'fashion',25,35,16.2,43,0,Math.PI/2);screen(two,'garden',25,30,-16.2,42,0,-Math.PI/2);
const tsx=building('TSX Broadway',41,-91,38,38,113,'glass','#9baabd');
box(tsx,42,21,43,0,12,0,dark);screen(tsx,'wave',42,18,0,22,22);screen(tsx,'wave',42,18,-21.8,22,0,-Math.PI/2);
screen(tsx,'fashion',28,34,-19.8,56,0,-Math.PI/2);screen(tsx,'garden',28,34,0,56,19.8);
const marquis=building('Marriott Marquis',-69,-38,56,47,100,'stone','#a0adb8');
box(marquis,18,105,43,0,53,1,mat('#34485c',.35,.3));
for(let y=15;y<100;y+=4)box(marquis,18.5,.5,44,0,y,1,steel,false);
box(marquis,61,17,52,0,9,0,dark);screen(marquis,'sunset',48,17,30.9,20,0,Math.PI/2);
screen(marquis,'timesSquare',44,14,0,17,26.6);
const wHotel=building('W Times Square',-69,-91,30,38,96,'glass','#abb9c9');
screen(wHotel,'fashion',29,25,0,28,19.7);screen(wHotel,'cola',32,26,15.7,28,0,Math.PI/2);
const paramount=building('Paramount Building',-51,69,39,36,64,'stone','#c1b5a4');
box(paramount,28,20,27,0,75,0,mat('#b8ac9b'));box(paramount,21,16,20,0,92,0,mat('#c6baa7'));box(paramount,15,12,15,0,106,0,mat('#c2b6a7'));
const clockTex=canvasTexture(256,256,(c,w,h)=>{c.fillStyle='#dcd4be';c.fillRect(0,0,w,h);c.strokeStyle='#333f4b';c.lineWidth=9;c.beginPath();c.arc(128,128,113,0,Math.PI*2);c.stroke();for(let i=0;i<12;i++){let a=i*Math.PI/6;c.beginPath();c.moveTo(128+Math.sin(a)*92,128-Math.cos(a)*92);c.lineTo(128+Math.sin(a)*103,128-Math.cos(a)*103);c.stroke();}c.lineWidth=10;c.beginPath();c.moveTo(83,100);c.lineTo(128,128);c.lineTo(163,60);c.stroke();});
for(let i=0;i<4;i++){let a=i*Math.PI/2;screen(paramount,clockTex,9,9,Math.sin(a)*7.8,106,Math.cos(a)*7.8,a);}
cylinder(paramount,0,8,13,0,118,0,mat('#687b82'),4);
const globe=new THREE.Mesh(new THREE.SphereGeometry(3.4,16,12),mat('#bedee1',.3,.4));globe.position.set(0,127,0);paramount.add(globe);
screen(paramount,'broadway',31,14,20.2,19,0,Math.PI/2);

// Context buildings make the square a street canyon from every direction.
const context=[
 [-115,-128,28,35,54,'brick'],[-112,-78,31,45,79,'stone'],[-120,-22,24,42,43,'brick'],[-112,28,29,32,66,'glass'],[-112,77,35,41,49,'stone'],[-112,126,30,27,37,'brick'],
 [103,-133,36,27,73,'stone'],[111,-90,36,42,88,'glass'],[104,-37,41,41,54,'stone'],[108,20,37,40,70,'glass'],[112,76,31,40,93,'dark'],[105,127,40,32,49,'stone'],
 [47,-40,38,40,58,'dark'],[45,15,37,37,67,'stone'],[65,70,27,38,51,'glass'],[70,126,26,30,34,'brick'],[-57,16,45,37,42,'brick'],[-63,124,46,31,38,'stone'],[43,-142,29,23,51,'glass'],[-73,-142,45,26,60,'stone']
];
context.forEach((b,i)=>{const dims=[...b];if(i<12)dims[4]*=.74;const g=building('Midtown block '+(i+1),...dims);if(i>11){const side=b[0]>0?-1:1;screen(g,['garden','sunset','fashion','broadway'][i%4],b[3]*.8,15,side*(b[2]/2+.6),16,0,side*Math.PI/2);if(i%2)screen(g,'ticker',b[2]*.85,5,0,6,b[3]/2+.65);}});

// TKTS: red glass steps climb north, with silver handrails.
const steps=new THREE.Group();steps.position.set(-19,0,-96);world.add(steps);
const stepMat=new THREE.MeshStandardMaterial({color:'#bd143c',emissive:'#ff2340',emissiveIntensity:.36,roughness:.45});
for(let i=0;i<13;i++){box(steps,15,.34*(i+1),1.25,0,.17*(i+1)+.15,8-i*1.25,stepMat);box(steps,15,.08,.1,0,.34*(i+1)+.17,8.6-i*1.25,mat('#fa526b'),false);}
for(const x of [-7.2,0,7.2])for(let i=0;i<7;i++)cylinder(steps,.06,.06,1.1,x,.7+i*.65,8-i*2.5,steel,6);
const tktsTex=canvasTexture(512,256,(c,w,h)=>{c.fillStyle='#a8102b';c.fillRect(0,0,w,h);c.fillStyle='#fff3eb';c.font='bold 130px Arial';c.textAlign='center';c.fillText('tkts',w/2,170);});
screen(steps,tktsTex,12,3.8,0,2,-8.5,Math.PI);
function statue(x,z){box(world,2,2,2,x,1,z,mat('#bac0c3'));cylinder(world,.42,.62,2.8,x,3.3,z,mat('#526969'),8);const head=new THREE.Mesh(new THREE.SphereGeometry(.44,8,8),mat('#647a73'));head.position.set(x,5,z);world.add(head);}
statue(-19,-76);statue(-9,-32);

// Street furniture and warm lights at human scale.
const lampMaterial=new THREE.MeshBasicMaterial({color:'#ffdf9d'});
for(const z of [-109,-79,-49,-19,11,41,71,101,131])for(const side of [-1,1]){
 const x=side<0?z*.34-11:15;
 cylinder(world,.15,.22,7,x,3.5,z,steel,8);box(world,2.8,.2,.25,x+1.3,7,z,steel,false);box(world,1,.25,.5,x+2.2,6.9,z,lampMaterial,false);
}
for(const z of [-66,-15,36,87])for(const x of [-8,14]){
 cylinder(world,.13,.13,5,x,2.5,z-8,steel,6);box(world,.7,1.7,.6,x,4.8,z-8,mat('#ca9a34'));box(world,.4,.4,.08,x,5.3,z-7.65,new THREE.MeshBasicMaterial({color:'#f56143'}),false);
}
for(let z=-105;z<133;z+=6){for(const x of [14,z*.34-11])cylinder(world,.22,.28,.85,x,.42,z,steel,6);}
const leaf=mat('#596e58'),planter=mat('#727f89');
for(const [x,z] of [[-16,-57],[-24,-104],[-9,-21],[20,57],[28,89],[-42,30],[28,-48],[27,-17]]){
 cylinder(world,1.2,1.2,1,x,.5,z,planter);cylinder(world,.11,.17,3.4,x,2.1,z,mat('#706050'),6);
 const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(1.7,1),leaf);crown.position.set(x,4,z);world.add(crown);
}
for(let i=0;i<12;i++){const z=-95+i*5.2,x=-9.5+rand()*2;cylinder(world,.7,.7,.12,x,.95,z,mat('#deca79'),10);cylinder(world,.1,.12,.85,x,.43,z,steel,6);}

// Instanced people preserve detail without hundreds of separate draw calls.
const peopleGeo=new THREE.CylinderGeometry(.25,.31,1.05,6);
const people=new THREE.InstancedMesh(peopleGeo,mat('#b8c3cf'),220);
const heads=new THREE.InstancedMesh(new THREE.SphereGeometry(.2,6,5),mat('#c9af96'),220);
const dummy=new THREE.Object3D();const personColors=['#ecb69e','#d7dfdd','#d7a333','#809bae','#854861','#c5c9a8','#566575'];
for(let i=0;i<220;i++){
 let z=-110+rand()*240,x;
 if(i<90){z=-104+rand()*65;x=z*.34+10+rand()*Math.max(2,-z*.34-18);}
 else{x=rand()>.5?17+rand()*3:z*.34-15-rand()*3;}
 dummy.position.set(x,.82,z);dummy.scale.setScalar(.85+rand()*.25);dummy.updateMatrix();people.setMatrixAt(i,dummy.matrix);people.setColorAt(i,new THREE.Color(personColors[i%personColors.length]));dummy.position.y=1.53;dummy.updateMatrix();heads.setMatrixAt(i,dummy.matrix);
}
world.add(people,heads);
const traffic=[];
function car(x,z,color,speed){const g=new THREE.Group();world.add(g);g.position.set(x,0,z);box(g,1.8,.7,4.1,0,.65,0,mat(color,.32,.35));box(g,1.55,.6,2.2,0,1.2,-.05,mat('#617b8f',.2,.5));box(g,1.5,.1,1.8,0,1.55,-.05,mat(color));for(const a of [-1,1])for(const b of [-1,1]){const wheel=cylinder(g,.35,.35,.2,a*.87,.4,b*1.2,dark,8);wheel.rotation.z=Math.PI/2;}for(const a of [-1,1]){box(g,.4,.2,.1,a*.5,.7,2.06,new THREE.MeshBasicMaterial({color:'#ffe2b2'}),false);box(g,.4,.2,.1,a*.5,.7,-2.06,new THREE.MeshBasicMaterial({color:'#ff524f'}),false);}if(color==='#e4ac38')box(g,.7,.2,.4,0,1.7,0,mat('#fff5d1'));traffic.push({g,speed});}
for(let i=0;i<14;i++)car(i%2?-.8:7,-155+i*22,i%3?'#e4ac38':'#8995a4',i%2?-2.3:2.8);
for(const [x,y,z,color,intensity,range] of [[-4,14,-116,'#f94789',190,55],[20,18,-75,'#6bbfff',180,55],[-37,14,-34,'#f7b169',180,50],[12,15,78,'#9c80ff',150,55]]){const l=new THREE.PointLight(color,intensity,range,2);l.position.set(x,y,z);world.add(l);}

const labelData=[
 ['One Times Square',24,106,108],['TKTS red steps',-19,9,-96],['TSX Broadway',41,122,-91],['Paramount',-51,137,69]
];
const labels=labelData.map(([text,x,y,z])=>{const el=document.createElement('div');el.className='ts-marker';el.textContent=text;el.setAttribute('aria-hidden','true');root.appendChild(el);return {el,p:new THREE.Vector3(x,y,z)};});
let width=0,height=0,mode='overview',autoRotate=false,hasInteracted=false,lastTime=0,visible=true,frame=0;
const view={theta:.32,phi:.87,radius:460,target:new THREE.Vector3(0,33,0),fov:38};
const goal={theta:.32,phi:.87,radius:460,target:new THREE.Vector3(0,33,0),fov:38};
function announce(text){root.querySelector('.ts-live').textContent=text;}
function interact(){hasInteracted=true;root.querySelector('.ts-gesture').style.opacity='0';}
function overviewRadius(){return THREE.MathUtils.clamp(470*Math.max(1,980/width),470,1000);}
function size(){width=stage.clientWidth;height=stage.clientHeight;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();if(mode==='overview'){goal.radius=overviewRadius();}}
const resizeObserver=new ResizeObserver(size);resizeObserver.observe(stage);size();view.radius=goal.radius;
const clamp=THREE.MathUtils.clamp;
function setMode(next){mode=next;interact();autoRotate=false;root.querySelector('[data-action="rotate"]').setAttribute('aria-pressed','false');root.querySelector('[data-action="overview"]').setAttribute('aria-pressed',String(next==='overview'));root.querySelector('[data-action="street"]').setAttribute('aria-pressed',String(next==='street'));
 if(next==='street'){goal.target.set(-14,2.3,-69);goal.theta=0;goal.phi=1.7;goal.radius=.1;goal.fov=76;announce('Street level. Drag to look around from Duffy Square.');}
 else{goal.target.set(0,33,0);goal.theta=.32;goal.phi=.87;goal.radius=overviewRadius();goal.fov=38;announce('Overview. Drag to rotate the model.');}
}
function zoom(delta){interact();if(mode==='street')goal.fov=clamp(goal.fov+delta*15,35,95);else goal.radius=clamp(goal.radius*(1+delta*.25),150,850);}
root.querySelector('.ts-tools').addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;const a=b.dataset.action;interact();if(a==='overview'||a==='street')setMode(a);if(a==='left')goal.theta-=Math.PI/6;if(a==='right')goal.theta+=Math.PI/6;if(a==='zoom-in')zoom(-1);if(a==='zoom-out')zoom(1);if(a==='rotate'){autoRotate=!autoRotate;b.setAttribute('aria-pressed',String(autoRotate));announce(autoRotate?'Automatic rotation on.':'Automatic rotation off.');}});
const pointers=new Map();let previousDistance=0;
stage.addEventListener('pointerdown',e=>{interact();autoRotate=false;root.querySelector('[data-action="rotate"]').setAttribute('aria-pressed','false');pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});stage.setPointerCapture(e.pointerId);previousDistance=0;});
stage.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;const old=pointers.get(e.pointerId);const dx=e.clientX-old.x,dy=e.clientY-old.y;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===1){goal.theta-=dx*.005;goal.phi=clamp(goal.phi+dy*.004,mode==='street'?.2:.25,mode==='street'?2.65:1.47);}else{const p=[...pointers.values()];const d=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);if(previousDistance){if(mode==='street')goal.fov=clamp(goal.fov*previousDistance/d,35,95);else goal.radius=clamp(goal.radius*previousDistance/d,150,850);}previousDistance=d;}});
function endPointer(e){pointers.delete(e.pointerId);previousDistance=0;}
stage.addEventListener('pointerup',endPointer);stage.addEventListener('pointercancel',endPointer);stage.addEventListener('lostpointercapture',endPointer);
// Some embedded browsers expose mouse dragging without Pointer Events.
let mouseDrag=null;
stage.addEventListener('mousedown',e=>{if(pointers.size||e.button!==0)return;interact();mouseDrag={x:e.clientX,y:e.clientY};});
stage.addEventListener('mousemove',e=>{if(!mouseDrag||pointers.size)return;goal.theta-=(e.clientX-mouseDrag.x)*.005;goal.phi=clamp(goal.phi+(e.clientY-mouseDrag.y)*.004,mode==='street'?.2:.25,mode==='street'?2.65:1.47);mouseDrag={x:e.clientX,y:e.clientY};});
stage.addEventListener('mouseup',()=>{mouseDrag=null;});stage.addEventListener('mouseleave',()=>{mouseDrag=null;});
stage.addEventListener('wheel',e=>{e.preventDefault();zoom(clamp(e.deltaY*.004,-.5,.5));},{passive:false});
root.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(e.key))return;e.preventDefault();interact();if(e.key==='ArrowLeft')goal.theta-=.12;if(e.key==='ArrowRight')goal.theta+=.12;if(e.key==='ArrowUp')goal.phi=clamp(goal.phi-.08,.25,mode==='street'?2.65:1.47);if(e.key==='ArrowDown')goal.phi=clamp(goal.phi+.08,.25,mode==='street'?2.65:1.47);if(e.key==='+')zoom(-1);if(e.key==='-')zoom(1);});
const compass=root.querySelector('.ts-compass i');
const projected=new THREE.Vector3();
function updateLabels(){const used=[];labels.forEach(({el,p})=>{projected.copy(p).project(camera);const x=(projected.x*.5+.5)*width,y=(-projected.y*.5+.5)*height;
 let show=mode==='overview'&&projected.z<1&&x>50&&x<width-50&&y>155&&y<height-150;
 if(width<500&&el.textContent!=='TKTS red steps'&&el.textContent!=='One Times Square')show=false;
 if(used.some(q=>Math.abs(x-q.x)<125&&Math.abs(y-q.y)<35))show=false;
 el.style.display=show?'block':'none';if(show){el.style.left=x+'px';el.style.top=y+'px';used.push({x,y});}
 });}
function animate(time){if(!root.isConnected){dispose();return;}frame=requestAnimationFrame(animate);if(!visible)return;const dt=Math.min((time-lastTime)/1000,.05);lastTime=time;
 if(autoRotate)goal.theta+=dt*.12;
 const s=reducedMotion?1:1-Math.exp(-dt*8);
 for(const key of ['theta','phi','radius','fov'])view[key]+=(goal[key]-view[key])*s;
 view.target.lerp(goal.target,s);
 if(mode==='street'&&view.radius<1){camera.position.copy(view.target);const direction=new THREE.Vector3(Math.sin(view.phi)*Math.sin(view.theta),-Math.cos(view.phi),-Math.sin(view.phi)*Math.cos(view.theta));camera.lookAt(view.target.clone().add(direction));}
 else{camera.position.set(view.target.x+view.radius*Math.sin(view.phi)*Math.sin(view.theta),view.target.y+view.radius*Math.cos(view.phi),view.target.z+view.radius*Math.sin(view.phi)*Math.cos(view.theta));camera.lookAt(view.target);}
 if(Math.abs(camera.fov-view.fov)>.01){camera.fov=view.fov;camera.updateProjectionMatrix();}
 if(!reducedMotion)traffic.forEach(({g,speed})=>{g.position.z+=speed*dt;if(g.position.z>165)g.position.z=-165;if(g.position.z< -165)g.position.z=165;});
 compass.style.transform='rotate('+(-view.theta)+'rad)';renderer.render(scene,camera);updateLabels();
}
const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;lastTime=performance.now();});observer.observe(root);
let disposed=false;
function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);resizeObserver.disconnect();observer.disconnect();const geometries=new Set(),mats=new Set(),textures=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>mats.add(m));});mats.forEach(m=>{if(m.map)textures.add(m.map);if(m.emissiveMap)textures.add(m.emissiveMap);m.dispose();});geometries.forEach(g=>g.dispose());textures.forEach(t=>t.dispose());renderer.dispose();}
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();loading.hidden=false;loading.innerHTML='<span>The 3D view was paused.</span><span>Reopen the preview to continue exploring.</span>';});
lastTime=performance.now();animate(lastTime);loading.hidden=true;
root.dataset.ready='true';
