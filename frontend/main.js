const cvs = document.getElementById('c');
const ctx = cvs.getContext('2d');
const msg = document.getElementById('msg')
const stats = document.getElementById('stats')
const angInput = document.getElementById('ang')
const spdInput = document.getElementById('spd')
const launchBtn = document.getElementById('btn')

cvs.width = window.innerWidth;
cvs.height = window = window.innerHeight;

window.addEventListener('resize', () => {
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
});

const earth = new Planet(10,200,0.5,'blue',0,100);
const mars = new Planet(8,300,0.3,'red',1,50);
const jupiter = new Planet(20,500,0.1,'orange',3,400);

const planets = [earth, mars, jupiter];
const sun = {x:0, y:0, m:1000, r:30, c:'yellow'};
let sc = null;

launchBtn.onclick = () => {
    let a = angInput.value * Math.PI/180;
    let s = spdInput.value;
    sc = new Spacecraft(earth.x + Math.cos(a)*15, earth.y + Math.sin(a)*15, Math.cos(a)*s, Math.sin(a)*s);
    msg.innerText = "";
    if(msg) msg.style.color = "";
};

let last = performance.now();
function loop(t) {
    let dt = (t - last)/1000; last = t; if(dt>0.1) dt=0.1;
    ctx.clearRect(0,0,cvs.width,cvs.height);
    let cx = cvs.width/2, cy = cvs.height/2;

    for(let p of planets) {
        p.update(dt);
    }

    if(sc) {
        let bodies = [sun];
        for(let p of planets) bodies.push(p);
        sc.update(dt, bodies, msg);
        stats.innerHTML = 'Time: ${sc.tm.toFixed(1)}s<br>Dist: ${sc.dist.toFixed(0)}<br>Vel: ${(Math.sqrt(sc.vx*sc.vx+sc.vy*sc.vy)).toFixed(1)}';
    }

    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, 7);
    ctx.fillStyle='yellow';
    ctx.fill();

    for(let p of planets) {
        p.draw(ctx, cx, cy);
    }

    if(sc) sc.draw(ctx, cx, cy);

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);