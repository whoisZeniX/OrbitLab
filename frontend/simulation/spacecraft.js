class Spacecraft {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;

        this.path = [];
        this.pathTimer = 0;
        this.active = true;
        this.success = falsse;
        this.hitTarget = "";

        this.tm = 0;
        this.dist = 0;
        this.fuel = 100;
        this.thrusting = false;
    }

    applyThrust(dirX, dirY, dt) {
        if (this.fuel <= 0 || !this.active) return;
        var thrustPower = 40;
        this.vx += dirX * thrustPower * dt;
        this.vy += dirY * thrustPower * dt;
        this.fuel -= 12 * dt;
        if (this.fuel < 0) this.fuel = 0;
        this.thrusting = true;
    }

    checkCllision(body) {
        var dx = body.x - this.x;
        var dy = body.y - this.y;
        var distSq = dx * dx + dy * dy;
        var hitRadius = body.r + 3;
        if (distSq < hitRadius * hitRadius) {
            return true;
        }
        return false;
    }

    update(dt, bodies, debridList, targetName, msgElement) {
        if (!this.active) return;
        this.thrusting = false;

        this.tm += dt;
        var oldX = this.x;
        var oldY = this.y;

        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];
            var dx = body.x - this.x;
            var dy = body.y - this.y;
            var distSq = dx * dx + dy * dy;

            if (this.checkCollision(body)) {
                this.active = false;
                var bodyName = body.name || "unknown";

                if (bodyName === targetName) {
                    this.success = true;
                    this.hitTarget = bodyName;
                    if (msgElement) {
                      msgElement.innerText = "Reached " + bodyName + "!";
                      msgElement.style.color = "lime";    
                    }
                } else {
                    this.hitTarget = bodyName;
                    if (msgElement) {
                        msgElement.innerText = "Crashed into " + bodyName + "!";
                        msgElement.style.color = "red";
                    }
                }
                return;
            }  

            if (distSq > 1) {
                var force = (1000 * body.m) / distSq;
                var distMag = Math.sqrt(distSq);
                this.vx += (dx / distMag * force) * dt;
                this.vy += (dy / distMag * force) * dt;
            }
        }

        for (var j = 0; j < debrisList.length; j++) {
            var debris = debrisList[j];
            var ddx = debris.x - this.x;
            var ddy = debris.y - this.y;
            var dDistSq = ddx * ddx + ddy * ddy;
            if (dDistSq < 25) {
                this.active = false;
                this.hitTarget = "asteroid";
                if (msgElement) {
                    msgElement.innerText = "Hit an asteroid!";
                    msgElement.style.color = "orange";
                }
                return;
            }
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        var pathDx = this.x - oldX;
        var pathDy = this.y - oldY;
        this.dist += Math.sqrt(pathDx * pathDx + pathDy * pathDy);

        this.pathTimer += dt;
        if (this.pathTimer > 0.1) {
            this.path.push({ x: this.x, y: this.y });
            this.pathTimer = 0;
            if (this.path.length > 500) {
                this.path.shift();
            }
        }
    }

    draw(ctx, cx, cy) {
      if (this.path.length > 1) {
        ctx.beginPath();
        ctx.moveTo(cx + this.path[0].x, cy + this.path[0].y);;
        for (var i = 1; i < this.path.length; i++) {
            ctx.lineTo(cx + this.path[i].x, cy + this.path[i].y);
        }
        ctx.strokeStyle = 'white';
        ctx.stroke();
      }  

      if (this.thrusting && this.active) {
        ctx.beginPath();
        ctx.arc(cx + this.x, cy + this.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 150, 0, 0.4)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(cx + this.x, cy + this.y, 4, 0, Math.PI *2);
      if (this.success) {
        ctx.fillStyle = 'lime';
      } else if (!this.active) {
        ctx.fillStyle = 'red';
      } else {
        ctx.fillStyle = 'white';
      }
      ctx.fill();
      ctx.closePath();
    }
}
