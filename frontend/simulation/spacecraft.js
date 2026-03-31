class Spacecraft {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;

        this.path = [];
        this.pathTimer = 0;
        this.active = true;
        this.success = false;

        this.tm = 0;
        this.dist = 0;
    }

    update(dt, bodies, msgElement) {
        if (!this.active) return;

        this.tm += dt;
        const oldX = this.x;
        const oldY = this.y;

        for (let body of bodies) {
            const dx = body.x - this.x;
            const dy = body.y - this.y;
            const distSq = dx * dx + dy * dy;

            if (body.c === 'red' && distSq < (body.r + 10) * (body.r + 10)) {
                this.success = true;
                this.active = false;
                if (msgElement) {
                    msgElement.innerText = "Success!";
                    msgElement.style.color = "lime";
                }
                return;
            }

            if (distSq < body.r * body.r) {
                this.active = false;
                if (msgElement) {
                    msgElement.innerText = "Crashed!";
                    msgElement.style.color = "red";
                }
                return;
            }

            if (distSq > 1) {
                const force = (1000 * body.m) / distSq;
                const distMag = Math.sqrt(distsq);

                this.vx += (dx / distMag * force) * dt;
                this.vy += (dy / distMag * force) * dt;
            }
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        const pathDx = this.x - oldX;
        const pathDy = this.y -oldY;
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
            ctx.moveTo(cx +this.path[0].x, cy + this.path[0].y);
            for (let i = 1; i < this.path.length; i++) {
                ctx.lineTo(cx + this.path[i].x, cy + this.path[i].y);
            }
            ctx.strokeStyle = 'white';
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(cx + this.x, cy + this.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = this.success ? 'lime' : 'white';
        ctx.fill();
        ctx.closePath();
    }
}