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
  cvs.width = window.innerWidth;
  cvs.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

var camZoom = 1;
var camX = 0;
var camY = 0;
var dragging = false;
var dragStartX = 0;
var dragStartY = 0;
var camStartX = 0;
var camStartY = 0;

cvs.addEventListener('wheel', function(e) {
  e.preventDefault();
  var delta = e.deltaY > 0 ? 0.9 : 1.1;
  camZoom *= delta;
  if (camZoom < 0.2) camZoom = 0.2;
  if (camZoom > 5) camZoom = 5;
});

cvs.addEventListener('mousedown', function(e) {
  dragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  camStartX = camX;
  camStartY = camY;
});

cvs.addEventListener('mousemove', function(e) {
  if (!dragging) return;
  camX = camStartX + (e.clientX - dragStartX);
  camY = camStartY + (e.clientY - dragStartY);
});

cvs.addEventListener('mouseup', function() {
  dragging = false;
});

cvs.addEventListener('mouseleave', function() {
  dragging = false;
});

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
sat2.name = "Satellite-2";
const sat3 = new Planet(2, 28, 1.8, '#aaa', 4.2, 1, earth);
sat3.name = "Satellite-3";

const planets = [earth, mars, jupiter];
const moons = [moon];
const satellites = [sat1, sat2, sat3];
const sun = {x:0, y:0, m:1000, r:30, c:'yellow', name:'Sun'};

var debrisList = [];
for (var i = 0; i < 120; i++) {
  var angle = Math.random() * Math.PI * 2;
  var dist = 370 + Math.random() * 80;
  var orbitalSpeed = Math.sqrt(1000 * sun.m / dist);
  var d = new Debris(
    Math.cos(angle) * dist,
    Math.sin(angle) * dist,
    -Math.sin(angle) * orbitalSpeed,
    Math.cos(angle) * orbitalSpeed
  );
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
  angVal.innerText = angInput.value;
};
spdInput.oninput = function() {
  spdVal.innerText = spdInput.value;
};

launchBtn.onclick = function() {
  var a = angInput.value * Math.PI / 180;
  var s = Number(spdInput.value);
  sc = new Spacecraft(earth.x + Math.cos(a)*15, earth.y + Math.sin(a)*15, Math.cos(a)*s, Math.sin(a)*s);
  msg.innerText = "";
  msg.style.color = "";
};

function worldToScreen(wx, wy, cx, cy) {
  return {
    sx: cx + wx * camZoom + camX,
    sy: cy + wy * camZoom + camY
  };
}

function screenToWorld(sx, sy, cx, cy) {
  return {
    wx: (sx - cx - camX) / camZoom,
    wy: (sy - cy - camY) / camZoom
  };
}

var gridSpacing = 40;
var gravityWellStrength = 8000;

function drawGravityMesh(cx, cy) {
  var massiveBodies = [
    {x: sun.x, y: sun.y, m: sun.m},
    {x: earth.x, y: earth.y, m: earth.m},
    {x: mars.x, y: mars.y, m: mars.m},
    {x: jupiter.x, y: jupiter.y, m: jupiter.m}
  ];

  var spacing = gridSpacing;
  var worldLeft = (0 - cx - camX) / camZoom;
  var worldRight = (cvs.width - cx - camX) / camZoom;
  var worldTop = (0 - cy - camY) / camZoom;
  var worldBottom = (cvs.height - cy - camY) / camZoom;

  var startX = Math.floor(worldLeft / spacing) * spacing;
  var endX = Math.ceil(worldRight / spacing) * spacing;
  var startY = Math.floor(worldTop / spacing) * spacing;
  var endY = Math.ceil(worldBottom / spacing) * spacing;

  ctx.strokeStyle = 'rgba(40, 80, 120, 0.25)';
  ctx.lineWidth = 0.5;

  for (var gy = startY; gy <= endY; gy += spacing) {
    ctx.beginPath();
    var firstPoint = true;
    for (var gx = startX; gx <= endX; gx += spacing * 0.5) {
      var offsetX = 0;
      var offsetY = 0;
      for (var b = 0; b < massiveBodies.length; b++) {
        var body = massiveBodies[b];
        var dx = gx - body.x;
        var dy = gy - body.y;
        var distSq = dx * dx + dy * dy;
        var dist = Math.sqrt(distSq);
        if (dist < 5) dist = 5;
        var pull = (gravityWellStrength * body.m) / (distSq + 500);
        offsetX -= (dx / dist) * pull * 0.0008;
        offsetY += pull * 0.015;
      }
      var screenPt = worldToScreen(gx + offsetX, gy + offsetY, cx, cy);
      if (firstPoint) {
        ctx.moveTo(screenPt.sx, screenPt.sy);
        firstPoint = false;
      } else {
        ctx.lineTo(screenPt.sx, screenPt.sy);
      }
    }
    ctx.stroke();
  }

  for (var gx = startX; gx <= endX; gx += spacing) {
    ctx.beginPath();
    var firstPoint = true;
    for (var gy = startY; gy <= endY; gy += spacing * 0.5) {
      var offsetX = 0;
      var offsetY = 0;
      for (var b = 0; b < massiveBodies.length; b++) {
        var body = massiveBodies[b];
        var dx = gx - body.x;
        var dy = gy - body.y;
        var distSq = dx * dx + dy * dy;
        var dist = Math.sqrt(distSq);
        if (dist < 5) dist = 5;
        var pull = (gravityWellStrength * body.m) / (distSq + 500);
        offsetX -= (dx / dist) * pull * 0.0008;
        offsetY += pull * 0.015;
      }
      var screenPt = worldToScreen(gx + offsetX, gy + offsetY, cx, cy);
      if (firstPoint) {
        ctx.moveTo(screenPt.sx, screenPt.sy);
        firstPoint = false;
      } else {
        ctx.lineTo(screenPt.sx, screenPt.sy);
      }
    }
    ctx.stroke();
  }

  ctx.lineWidth = 1;
}

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
    if (keys['w'] || keys['arrowup']) sc.applyThrust(0, -1, dt);
    if (keys['s'] || keys['arrowdown']) sc.applyThrust(0, 1, dt);
    if (keys['a'] || keys['arrowleft']) sc.applyThrust(-1, 0, dt);
    if (keys['d'] || keys['arrowright']) sc.applyThrust(1, 0, dt);

    let bodies = [sun];
    for(let p of planets) bodies.push(p);
    for(let m of moons) bodies.push(m);
    for(let s of satellites) bodies.push(s);
    sc.update(dt, bodies, debrisList, targetBody, msg);
  }

  updateTelemetry(targetBody);

  drawGravityMesh(cx, cy);

  var sunPos = worldToScreen(sun.x, sun.y, cx, cy);
  ctx.beginPath();
  ctx.arc(sunPos.sx, sunPos.sy, 30 * camZoom, 0, 7);
  ctx.fillStyle = 'yellow';
  ctx.fill();
  
  for(let p of planets) {
    drawBody(p, cx, cy);
  }
  for(let m of moons) {
    drawBody(m, cx, cy);
  }
  for(let s of satellites) {
    drawBody(s, cx, cy);
  }
  for(var j = 0; j < debrisList.length; j++) {
    var db = debrisList[j];
    var dp = worldToScreen(db.x, db.y, cx, cy);
    ctx.fillStyle = db.c;
    var sz = Math.max(2, 3 * camZoom);
    ctx.fillRect(dp.sx - sz/2, dp.sy - sz/2, sz, sz);
  }

  drawPrediction(cx, cy);

  if(sc) drawSpacecraft(cx, cy);

  requestAnimationFrame(loop);
}

function drawBody(body, cx, cy) {
  var pos = worldToScreen(body.x, body.y, cx, cy);
  ctx.beginPath();
  ctx.arc(pos.sx, pos.sy, Math.max(1, body.r * camZoom), 0, Math.PI * 2);
  ctx.fillStyle = body.c;
  ctx.fill();
  ctx.closePath();
}

function drawSpacecraft(cx, cy) {
  if (sc.path.length > 1) {
    ctx.beginPath();
    var p0 = worldToScreen(sc.path[0].x, sc.path[0].y, cx, cy);
    ctx.moveTo(p0.sx, p0.sy);
    for (var i = 1; i < sc.path.length; i++) {
      var pt = worldToScreen(sc.path[i].x, sc.path[i].y, cx, cy);
      ctx.lineTo(pt.sx, pt.sy);
    }
    ctx.strokeStyle = 'white';
    ctx.stroke();
  }

  var sp = worldToScreen(sc.x, sc.y, cx, cy);

  if (sc.thrusting && sc.active) {
    ctx.beginPath();
    ctx.arc(sp.sx, sp.sy, 8 * camZoom, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 150, 0, 0.4)';
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(sp.sx, sp.sy, Math.max(2, 4 * camZoom), 0, Math.PI * 2);
  if (sc.success) {
    ctx.fillStyle = 'lime';
  } else if (!sc.active) {
    ctx.fillStyle = 'red';
  } else {
    ctx.fillStyle = 'white';
  }
  ctx.fill();
  ctx.closePath();
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
      var pp = worldToScreen(px, py, cx, cy);
      ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
      ctx.fillRect(pp.sx - 1, pp.sy - 1, 2, 2);
    }
  }
}

function getTargetObj(name) {
  if (name === "Mars") return mars;
  if (name === "Jupiter") return jupiter;
  if (name === "Moon") return moon;
  return mars;
}

function updateTelemetry(targetName) {
  if (!sc) {
    var target = getTargetObj(missionSelect.value);
    var earthToTarget = Math.sqrt(
      (earth.x - target.x) * (earth.x - target.x) +
      (earth.y - target.y) * (earth.y - target.y)
    );
    stats.innerHTML =
      "Status: Pre-Launch<br>" +
      "Mission: " + missionSelect.value + "<br>" +
      "Angle: " + angInput.value + " deg<br>" +
      "Speed: " + spdInput.value + "<br>" +
      "Earth-" + missionSelect.value + ": " + earthToTarget.toFixed(0) + "<br>" +
      "Zoom: " + (camZoom * 100).toFixed(0) + "%";
    return;
  }

  var vel = Math.sqrt(sc.vx * sc.vx + sc.vy * sc.vy);
  var earthDx = sc.x - earth.x;
  var earthDy = sc.y - earth.y;
  var distFromEarth = Math.sqrt(earthDx * earthDx + earthDy * earthDy);

  var target = getTargetObj(targetName);
  var targDx = sc.x - target.x;
  var targDy = sc.y - target.y;
  var distToTarget = Math.sqrt(targDx * targDx + targDy * targDy);

  var sunDx = sc.x - sun.x;
  var sunDy = sc.y - sun.y;
  var distFromSun = Math.sqrt(sunDx * sunDx + sunDy * sunDy);

  var missionStatus = "In Flight";
  if (sc.success) {
    missionStatus = "SUCCESS";
  } else if (!sc.active) {
    missionStatus = "FAILED - " + sc.hitTarget;
  }

  stats.innerHTML =
    "Time: " + sc.tm.toFixed(1) + "s<br>" +
    "Velocity: " + vel.toFixed(1) + "<br>" +
    "Fuel: " + Math.max(0, sc.fuel).toFixed(0) + "%<br>" +
    "Dist Traveled: " + sc.dist.toFixed(0) + "<br>" +
    "From Earth: " + distFromEarth.toFixed(0) + "<br>" +
    "From Sun: " + distFromSun.toFixed(0) + "<br>" +
    "To " + targetName + ": " + distToTarget.toFixed(0) + "<br>" +
    "Status: " + missionStatus + "<br>" +
    "Zoom: " + (camZoom * 100).toFixed(0) + "%";
}

requestAnimationFrame(loop);
