export default class Snowball {
    constructor(x, y, direction, speedMultiplier = 1, sprite = null) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;

        this.speed = 6 * direction * speedMultiplier;

        if (sprite instanceof HTMLImageElement) {
        this.image = sprite;
        } else {
        this.image = new Image();
        this.image.src = "assets/snowball.png";
        }
    }

    update() {
        this.x += this.speed;
    }

    isOffScreen(width) {
        return this.x < 0 || this.x > width;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}
