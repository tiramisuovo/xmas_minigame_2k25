export default class Gift {
    constructor(x, y, sprite = null) {
        this.x = x;
        this.y = y;

        this.width = 60;
        this.height = 60;

        this.opacity = 1;
        this.fadeSpeed = 0.003;   // fades slowly so player can collect
        this.bobTime = 0;

        this.collected = false;

        if (sprite instanceof HTMLImageElement) {
        this.img = sprite;
        } else {
        this.img = new Image();
        this.img.src = "assets/gift.png";
        }
    }

    update() {
        // cute bobbing animation
        this.bobTime += 0.05;
        const bobOffset = Math.sin(this.bobTime) * 3;
        this.renderY = this.y + bobOffset;

        // fade
        if (!this.collected) {
            this.opacity -= this.fadeSpeed;
        }
    }

    draw(ctx) {
        if (this.opacity <= 0) return;

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(this.img, this.x, this.renderY, this.width, this.height);
        ctx.restore();
    }

    isGone() {
        return this.opacity <= 0;
    }

    collidesWith(player) {
        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.renderY + this.height &&
            player.y + player.height > this.renderY
        );
    }
}