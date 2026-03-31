class Planet {
    cosntructor(radius, distance, speed, color, angle, mass, parents) {
        this.r = radius;
        this.d = distance;
        this.s = speed;
        this.c = color;
        this.a = angle;
        this.m = mass;
        this.x = 0;
        this.y = 0;
        this.parent = parent || null;
    }

    update(dt) {
        this.a += this.s * dt;
        var baseX = 0;
        var baseY = 0;
        if (this.parent) {
            baseX = this.parent.x;
            baseY = this.parent.y;
        }
        this.x = baseX + Math.cos(this.a) * this.d;
        this.y = baseY + Math.sin(this.a) * this.d;
    }

    draw(ctx, cx, cy) {
        ctx.beginPath();
        ctx.arc(cx + this.x, cy + this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.c;
        ctx.fill();
        ctx.closePath();
    }
}

class Debris {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.r = 1.5;
        this.m = 0.5;
        this.c = '#777';
    }

    update(dt, sunMass) {
        var dx = 0 - this.x;
        var dy = 0 - this.y;
        var distSq = dx * dx + dy * dy;
        if (distSq > 1) {
            var force = (1000 * sunMass) / distSq;
            var dist = Math.sqrt(distSq);
            this.vx += (dx / dist * force) * dt;
            this.vy += (dy / dist * force) * dt;
        }
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        }

        draw(ctx, cx, cy) {
            ctx.fillStyle = this.c;
            ctx.fillRect(cx + this.x - 1, cy + this.y - 1, 3, 3);
        }
    }
