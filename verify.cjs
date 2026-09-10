const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync('index.html','utf8'),script=html.split('<script>')[1].split('</script>')[0];
const noop=()=>{},gradient={addColorStop:noop},ctx=new Proxy({createLinearGradient:()=>gradient},{get:(o,k)=>o[k]||noop}),canvas={width:960,height:540,getContext:()=>ctx,getBoundingClientRect:()=>({width:960,height:540})};
const env={document:{querySelector:()=>canvas},devicePixelRatio:1,requestAnimationFrame:noop};vm.createContext(env);vm.runInContext(script,env);
vm.runInContext(`
muted=1;reset();
document.pointerLockElement=c;mouse.down=1;document.onpointerlockchange();if(!mouse.down)throw Error('Lock acquisition cancels held fire');mouse.ax=1;mouse.ay=0;
onkeydown({code:'KeyW',key:'w',repeat:false,preventDefault(){}});J.w=0;
for(let i=0;i<60;i++){onkeydown({code:'KeyW',key:'w',repeat:true,preventDefault(){}});update(1/60);if(!p.beam)throw Error('Held W interrupts fire');if(J.w)throw Error('Repeat queues jump')}
onkeyup({code:'KeyW',key:'w'});document.pointerLockElement=null;document.onpointerlockchange();reset();
cp=6;p.hp=1;p.inv=0;damage();if(scene!=='play'||p.hp!==8||p.y!==plat[cp].y-p.h||p.jump!==2)throw Error('Fatal checkpoint respawn');
p.y+=700;p.inv=1;damage(1,1);if(p.y!==plat[cp].y-p.h)throw Error('Invulnerable fall respawn');
reset();weapon=3;mouse.active=1;mouse.x=p.x+200;mouse.y=p.y+10-cam;p.vx=-150;fireWeapon();if(p.vx!==-150)throw Error('Aim changes horizontal movement');mouse.active=0;reset();
document.pointerLockElement=c;mouse.ax=1;mouse.ay=0;mouse.active=1;mouse.down=1;
for(let k of ['w','a','s','d'])K[k]=1;
update(.016);if(!p.beam||Math.abs(p.beam.ty-p.beam.y)>.01)throw Error('Movement interferes with locked beam');
c.onpointermove({movementX:0,movementY:50});if(aimVector()[1]<=0)throw Error('Relative aim');
document.pointerLockElement=null;mouse.active=0;mouse.down=0;for(let k in K)K[k]=0;reset();
for(let input of ['key','mouse']){
reset();E.length=Q.length=0;p.energy=.1;K.z=input==='key';mouse.down=input==='mouse';
for(let i=0;i<120;i++){update(1/60);if(p.beam||p.energy!==0)throw Error('Empty beam fires or recharges while held')}
K.z=0;mouse.down=0;update(1/60);if(p.energy<=0)throw Error('Released beam fails to recharge');
}
reset();
mouse.active=1;mouse.x=p.x+15-camX+100;mouse.y=p.y+10-cam-100;
let av=aimVector();if(Math.abs(av[0]-Math.SQRT1_2)>.001||Math.abs(av[1]+Math.SQRT1_2)>.001)throw Error('Mouse angle');
let angled=E[0];angled.x=p.x+15+100;angled.y=p.y+10-100-13;let hp=angled.hp;laser();if(angled.hp!==hp-1)throw Error('Angled laser');crosshair();
mouse.down=1;onpointerup();if(mouse.down)throw Error('Pointer release');mouse.active=0;reset();
let victim=E[0];victim.x=p.x+100;victim.y=p.y;let distant=E[1];distant.y=cam-100;bubblePower();if(orbs.length)throw Error('Uncharged special');p.charge=45;bubblePower();if(!victim.trapped||distant.trapped||p.shield!==6||p.charge!==0)throw Error('Bubble special');let shieldHP=p.hp;damage();if(p.hp!==shieldHP)throw Error('Shield protection');updateOrbs(.4);updateOrbs(4);if(!victim.dead)throw Error('Bubble pop');
reset();weapon=2;victim=E[0];victim.x=p.x+90;victim.y=p.y;fireWeapon();if(!victim.dead)throw Error('Whip damage');drawWeapons();
reset();weapon=3;K.arrowdown=1;fireWeapon();if(p.vy>=0)throw Error('Blast recoil');K.arrowdown=0;drawWeapons();
reset();victim=E[0];victim.x=p.x+120;victim.y=p.y;let beforeX=victim.x;update(.02);if(victim.x>=beforeX)throw Error('Blob pursuit');
reset();if(orbs.length||weapon||attack)throw Error('Weapon reset');
if(U<11000)throw Error('Expanded map missing');
let first=plat[10].x;reset();if(first===plat[10].x)throw Error('Layout not randomized');
for(let run=0;run<100;run++){
reset();
if(!plat.some(a=>a.move&&a.y>7020))throw Error('Early moving platforms missing');
for(let j=0;j<plat.length;j++){
let a=plat[j],m=a.move||0;
if(a.x-m<0||a.x+a.w+m>WW||!Number.isFinite(a.w)||a.w<=0)throw Error('Invalid platform');
for(let k=j+1;k<plat.length;k++){let b=plat[k],n=b.move||0;if(a.y<b.y+b.h&&a.y+a.h>b.y&&a.x-m<b.x+b.w+n&&a.x+a.w+m>b.x-n)throw Error('Platform motion envelopes overlap')}
}
for(let lane=0;lane<1;lane++)for(let i=1;i<N;i++){
let a=plat[lane*N+i-1],b=plat[lane*N+i],rise=a.y-b.y;
let airtime=(600+Math.sqrt(600*600-2*1450*rise))/1450;
let distance=Math.abs(a.x+a.w/2-b.x-b.w/2)+(a.move||0)+(b.move||0);
if(rise>110||distance>260*airtime+b.w/2-30)throw Error('Unreachable route jump');
}
}
reset();
// Exercise normal held-key updates; never initialize or override the cooldown here.
let e=E[0],a=plat[4];p.x=e.x-90;p.y=a.y-p.h;p.face=1;K.z=1;
for(let i=0;i<40;i++)update(1/60);
if(!e.dead||kills<1||!Number.isFinite(p.lc))throw Error('Fresh-game held laser failed');
reset();if(p.lc!==0||p.bt!==0)throw Error('Restart timers failed');
K.z=0;for(let y of [9000,6000,3600,1200]){p.y=y;cam=y-270;update(.001);draw();}
reset();p.x=900;p.y=8800;update(.1);if(camX!==0||p.x>WW-p.w)throw Error('Single-screen camera');draw();
let checkpoint=plat.find(a=>a.i===6);cp=plat.indexOf(checkpoint);respawn();if(p.x!==checkpoint.x+(checkpoint.w-p.w)/2||camX!==0)throw Error('Side route respawn');
reset();p.x=450;p.y=220-p.h;p.ground=1;J[' ']=1;for(let i=0;i<15;i++)update(1/60);if(scene!=='win')throw Error('Summit portal unreachable');
scene='title';draw();scene='win';draw();
reset();let moving=plat.find(a=>a.move);p.x=moving.x+30;p.y=moving.y-p.h;p.ground=1;let offset=p.x-moving.x;t+=.1;platformMotion(.1);if(Math.abs(p.x-moving.x-offset)>.001)throw Error('Moving platform carry');
zone=2;p.inv=0;p.hp=8;let roof=plat[30];p.x=roof.x+30;p.y=roof.y+30;rainClock=4.99;regionHazards(.02);if(p.hp!==8)throw Error('Shelter failed');
p.x=950;p.y=2100;p.inv=0;rainClock=4.99;regionHazards(.02);if(p.hp!==7)throw Error('Exposed acid rain failed');
zone=1;let vent=hazards.find(h=>h.type==='vent');p.x=vent.x-15;p.y=vent.y-60;p.hp=8;p.inv=0;t=5-vent.phase+2;regionHazards(.01);if(p.hp!==8)throw Error('Vent warning unsafe');t=5-vent.phase+4;regionHazards(.01);if(p.hp!==7)throw Error('Vent eruption failed');
reset();zone=1;p.x=250;p.y=3500;eruption=1.2;volcano(.2);if(msg!=='VOLCANO ERUPTING'||lavaBalls.length)throw Error('Eruption warning');volcano(1.01);if(lavaBalls.length!==5)throw Error('Lava volley');let ball=lavaBalls[0],vy=ball.vy;volcano(.1);if(ball.vy<=vy)throw Error('Lava gravity');p.x=ball.x-15;p.y=ball.y-12;p.inv=0;let health=p.hp;volcano(0);if(p.hp!==health-1)throw Error('Lava damage');drawLava();zone=2;volcano(.01);if(lavaBalls.length)throw Error('Lava region cleanup');
`,env);
assert(!html.includes('src="http'),'Offline build');console.log('Fresh-game combat, restart and all four region render paths passed');
