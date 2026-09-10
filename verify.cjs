const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync('index.html','utf8'),script=html.split('<script>')[1].split('</script>')[0];
const noop=()=>{},gradient={addColorStop:noop},ctx=new Proxy({createLinearGradient:()=>gradient},{get:(o,k)=>o[k]||noop}),canvas={width:960,height:540,getContext:()=>ctx,getBoundingClientRect:()=>({width:960,height:540})};
const env={document:{querySelector:()=>canvas},devicePixelRatio:1,requestAnimationFrame:noop};vm.createContext(env);vm.runInContext(script,env);
vm.runInContext(`
muted=1;reset();
let first=plat[10].x;reset();if(first===plat[10].x)throw Error('Layout not randomized');
for(let run=0;run<100;run++){
reset();
if(!plat.some(a=>a.move&&a.y>7020))throw Error('Early moving platforms missing');
for(let j=0;j<plat.length;j++){
let a=plat[j],m=a.move||0;
if(a.x-m<0||a.x+a.w+m>WW||!Number.isFinite(a.w)||a.w<=0)throw Error('Invalid platform');
for(let k=j+1;k<plat.length;k++){let b=plat[k],n=b.move||0;if(a.y<b.y+b.h&&a.y+a.h>b.y&&a.x-m<b.x+b.w+n&&a.x+a.w+m>b.x-n)throw Error('Platform motion envelopes overlap')}
}
for(let lane=0;lane<3;lane++)for(let i=1;i<N;i++){
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
if(!e.dead||kills!==1||!Number.isFinite(p.lc))throw Error('Fresh-game held laser failed');
reset();if(p.lc!==0||p.bt!==0)throw Error('Restart timers failed');
K.z=0;for(let y of [9000,6000,3600,1200]){p.y=y;cam=y-270;update(.001);draw();}
reset();p.x=2200;p.y=8800;update(.1);if(camX<=0||p.x<2000)throw Error('Horizontal world camera');draw();
let checkpoint=plat.find(a=>a.side&&a.i===6);cp=plat.indexOf(checkpoint);respawn();if(p.x!==checkpoint.x+checkpoint.w/2||camX<=0)throw Error('Side route respawn');
reset();p.x=450;p.y=220-p.h;p.ground=1;J[' ']=1;for(let i=0;i<15;i++)update(1/60);if(scene!=='win')throw Error('Summit portal unreachable');
scene='title';draw();scene='win';draw();
reset();let moving=plat.find(a=>a.move);p.x=moving.x+30;p.y=moving.y-p.h;p.ground=1;let offset=p.x-moving.x;t+=.1;platformMotion(.1);if(Math.abs(p.x-moving.x-offset)>.001)throw Error('Moving platform carry');
zone=2;p.inv=0;p.hp=8;let roof=plat[30];p.x=roof.x+30;p.y=roof.y+30;rainClock=4.99;regionHazards(.02);if(p.hp!==8)throw Error('Shelter failed');
p.x=950;p.y=2100;p.inv=0;rainClock=4.99;regionHazards(.02);if(p.hp!==7)throw Error('Exposed acid rain failed');
zone=1;let vent=hazards.find(h=>h.type==='vent');p.x=vent.x-15;p.y=vent.y-60;p.hp=8;p.inv=0;t=5-vent.phase+2;regionHazards(.01);if(p.hp!==8)throw Error('Vent warning unsafe');t=5-vent.phase+4;regionHazards(.01);if(p.hp!==7)throw Error('Vent eruption failed');
reset();zone=1;p.x=250;p.y=3500;eruption=1.2;volcano(.2);if(msg!=='VOLCANO ERUPTING'||lavaBalls.length)throw Error('Eruption warning');volcano(1.01);if(lavaBalls.length!==5)throw Error('Lava volley');let ball=lavaBalls[0],vy=ball.vy;volcano(.1);if(ball.vy<=vy)throw Error('Lava gravity');p.x=ball.x-15;p.y=ball.y-12;p.inv=0;let health=p.hp;volcano(0);if(p.hp!==health-1)throw Error('Lava damage');drawLava();zone=2;volcano(.01);if(lavaBalls.length)throw Error('Lava region cleanup');
`,env);
assert(!html.includes('src="http'),'Offline build');console.log('Fresh-game combat, restart and all four region render paths passed');
