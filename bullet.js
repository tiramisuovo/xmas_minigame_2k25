export default class Bullet {
    constructor(x, y, direction, spritePath = "assets/bullet_default.png") {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.drawScale = 1;
        this.offsetX = 0;
        this.offsetY = 0;

        this.speed = 10 * direction;

        // Load bullet sprite
        this.image = new Image();
        this.image.src = spritePath;
    }

    update() {
        this.x += this.speed;
    }

    isOffScreen(width) {
        return this.x < 0 || this.x > width;
    }

    draw(ctx) {
        const drawW = this.width * this.drawScale;
        const drawH = this.height * this.drawScale;

        // ⭐ Align sprite EXACTLY to hitbox top-left
        const drawX = this.x;
        const drawY = this.y;

        if (this.image.complete) {
            ctx.drawImage(this.image, drawX, drawY, drawW, drawH);
        } else {
            ctx.fillStyle = "red";
            ctx.fillRect(drawX, drawY, drawW, drawH);
        }
    }
}
