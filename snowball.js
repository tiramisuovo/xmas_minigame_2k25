export default class Snowball {
    constructor(x, y, direction, speedMultiplier = 1) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;

        this.speed = 6 * direction * speedMultiplier;

        this.image = new Image();
        this.image.src = "assets/snowball.png";
    }

    update() {
        this.x += this.speed;
    }

    isOffScreen(width) {
        return this.x < 0 || this.x > width;
    }

    draw(ctx) {
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = "blue";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
