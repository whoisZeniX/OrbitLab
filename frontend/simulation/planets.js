class Planet {
    constructor(radius, distance, speed, color, angle, mass){
        this.r = radius;
        this.d = distance;
        this.s = speed;
        this.c = color;
        this.a = angle;
        this.m = mass;
        this.x = 0;
        this.y = 0;
    }

    update(dt) {
        this.a += this.s * dt;
        this.x = Math.cos(this.a) * this.d;
        this.y = Math.sin(this.a) * this.d;
    }

    draw(ctx, cx, cy) {
        ctx.beginPath();
        ctx.arc(cx + this.x, cy + this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.c;
        ctx.fill();
        ctx.closePath();
    }
}