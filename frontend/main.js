const cvs = document.getElementById('c');
const ctx = cvs.getContext('2d');
const msg = document.getElementById('msg');
const stats = document.getElementById('stats');
const angInput = document.getElementById('ang');
const spdInput = document.getElementById('spd');
const angVal = document.getElementById('angVal');
const spdVal = document.getElementById('spdVal');
const launchBtn = document.getElementById('btn');
const missionSelect = document.getElementById('mission');

function resizeCanvas() {
    var wrap = document.getElementById('canvas-wrap');
    cvs.width = wrap.clientWidth;
    cvs.height = wrap.clientHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const earth = new Planet(10,200,0.5,'blue',0,100);
earth.name = "Earth";
const mars = new Planet(8,300,0.3,'red',1,50);
mars.name = "Mars";
const jupiter = new Planet(20,500,0.1,'orange',3,400);
jupiter.name = "Jupiter";
const moon = new Planet(4, 30, 2.5, '#ccc', 0, 10, earth);
moon.name = "Moon";

const sat1 = new Planet(2, 20, 3.0, '#aaa', 0, 1, earth);
sat1.name = "Satellite-1";
const sat2 = new Planet(2, 24, 2.2, '#aaa', 2.1, 1, earth);
sat2.name = "satellite-2";
const sat3 = new Planet(2, 28, 1.8, '#aaa', 4.2, 1, earth);
sat3.name = "Satellites-3";

const planets = [earth, mars, jupiter];
const moons = [moon];
const Satellites = [sat1, sat2, sat3];
const sun = {x:0, y:0, m:1000, r:30, c:'yellow', name:'Sun'};

var debrisList = [];
for (var i = 0; i < 120; i++) {
    var angle = Math.random() * Math.PI * 2;
    var dist = 370 + Math.random() * 80;
    var orbitalSpeed = Math.sqrt(1000 * sun.m / dist);
    var d = new debrisList(
        Math.cos(angle) * dist,
        Math.sin(angle) * dist,
        -Math.sin(angle) * orbitalSpeed,
        Math.cos(angle) * orbitalSpeed
    )
    debrisList.push(d);
}

let sc = null;

var keys = {};
window.addEventListener('keydown', function(e) {
    keys[e.key.toLowerCase()] = true;
});
window.addEventListener('keyup', function(e) {
    keys[e.key.toLowerCase()] = false;
});

angInput.oninput = function() {
    angVal.innerText = angInput.ariaValueMax;
};
spdInput.oninput = function() {
    spdVal.innerText = spdInput.ariaValueMax;
};

launchBtn.onclick = function() {
    var a = angInput.value * Math.PI /180;
    var s = Number(spdInput.value);
    sc = new Spacecraft(earth.x + Math.cos(a)*15, earth.y + Math.sin(a)*15, Math.cos(a)*s, Math.sin(a)*s);
    msg.innerText = "";
    msg.style.color = "";
};

let last = performance.now();
function loop(t) {
    let dt = (t - last)/1000; last = t; if(dt>0.1) dt=0.1;
    ctx.clearRect(0,0,cvs.width,cvs.height);
    let cx = cvs.width/2, cy = cvs.height/2;

    var targetBody = missionSelect.value;

    for(let p of planets) {
        p.update(dt);
    }
    for(let m of moons) {
        m.update(dt);
    }
    for(let s of satellites) {
        s.update(dt);
    }
    for(var j = 0; j < debrisList.length; j++) {
        debrisList[j].update(dt, sun.m);
    }

    if(sc) {
        if (keys['w'] || keys['arrrrowup']) sc.applyThrust(0, -1, dt);
        if (keys['s'] || keys['arrowdown']) sc.applyThrust(0, 1, dt);
        if (keys['a'] || keys['arrowleft']) sc.applyThrust(-1, 0, dt);
        if (keys['d'] || keys['arrowright']) sc.applyThrust(1, 0, dt);

        let bodies = [sun];
        for(let p of planets) bodies.push(p);
        for(let m of moons) bodies.push(m);
        for(let s of satellites) bodies.push(s);
        sc.update(dt, bodies, debrisList, targetBody, msg);
        var vel = Math.sqrt(sc.vx*sc.vx+sc.vy*sc.vy);
        stats.innerHTML = 'Time: ${sc.tm.toFixed(1)}s<br>Dist: ${sc.dist.toFixed(0)}<br>Vel: ${vel.toFixed(1)}<br>Fuel: ${Math.max(0, sc.fuel).toFixed(0)}%<br>Target: ${targetBody}`;'  
    }

    ctx.beginPath(); ctx.arc(cx, cy, 30, 0, 7); ctx.fillStyle='yellow'; ctx.fill();

    for(let p of planets) {
        p.draw(ctx, cx, cy);
    }
    for(let m of moons) {
        m.draw(ctx, cx, cy);
    }
    for(let s of satellites) {
        s.draw(ctx, cx, cy);
    }
    for(var j = 0; j < debrisList.length; j++) {
        debrisList[j].draw(ctx, cx, cy);
    }

    drawPrediction(cx, cy);

    if(sc) sc.draw(ctx, cx, cy);

    requestAnimationFrame(loop);
}

function drawPrediction(cx, cy) {
    if (sc && sc.active) return;

    var a = angInput.value * Math.PI / 180;
    var s = Number(spdInput.value);

    var px = earth.x + Math.cos(a) * 15;
    var py = earth.y + Math.sin(a) * 15;
    var pvx = Math.cos(a) * s;
    var pvy = Math.sin(a) * s;

    var stepSize = 0.08;
    var totalSteps = 300;

    var allBodies = [sun, earth, mars, jupiter];

    for (var i = 0; i < totalSteps; i++) {
        for (var k = 0; k < allBodies.length; k++) {
            var b = allBodies[k];
            var dx = b.x - px;
            var dy = b.y - py;
            var dSq = dx * dx + dy * dy;
            if (dSq > 1) {
                var f = (1000 * b.m) / dSq;
                var dMag = Math.sqrt(dSq);
                pvx += (dx / dMag * f) * stepSize;
                pvy += (dy / dMag * f) * stepSize;
            }
        }

        px += pvx * stepSize;
        py += pvy * stepSize;

        if (i % 5 === 0) {
            ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
            ctx.fillRect(cx + px -1, cy + py -1, 2, 2);
        }
    }
}

requestAnimationFrame(loop);