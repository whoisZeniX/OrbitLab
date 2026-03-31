class Planet {
    constructor(radius, distance, speed, color, angle, mass, parent) {
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
        if ( this.parent) {
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