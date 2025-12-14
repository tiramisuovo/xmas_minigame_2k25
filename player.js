export default class Player {
    constructor(x, y, spritePath){
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.scale = 1;

        this.vx = 0
        this.vy = 0
        this.speed = 4
        this.gravity = 0.6
        this.jumpStrength = -15
        this.canJump = true
        this.facing = 1; // 1 for right, -1 for left

        this.image = new Image();
        this.image.src = spritePath;

        this.shootOffsetX = 50;
        this.shootOffsetY =  20;  // move bullet downward

        this.maxHP = 3;
        this.hp = 3;
        this.isInvincible = false;
        this.invincibilityDuration = 1500; // ms
        this.knockback = 10;
    }

    moveLeft(){
        this.vx = -this.speed
        this.facing = -1;
    }

    moveRight(){
        this.vx = this.speed
        this.facing = 1;
    }

    stop(){
        this.vx = 0
    }

    jump(){
        if(this.canJump){
            this.vy = this.jumpStrength
            this.canJump = false;
        }
    }

    update(platforms = []) {
        // Apply horizontal movement
        this.x += this.vx;

        // Apply gravity
        this.vy += this.gravity;
        let nextY = this.y + this.vy;

        let onPlatform = false;

        // FLOOR LANDING CHECK
        for (let p of platforms) {
            const withinX =
                this.x + this.width > p.x &&
                this.x < p.x + p.width;

            const wasAbove = this.y + this.height <= p.y;
            const willFallThrough = nextY + this.height >= p.y;

            if (this.vy >= 0 && withinX && wasAbove && willFallThrough) {
                nextY = p.y - this.height;
                this.vy = 0;
                this.canJump = true;
                onPlatform = true;
                break;
            }
        }

        // CEILING COLLISION (hit underside of platform)
        for (let p of platforms) {
            const withinX =
                this.x + this.width > p.x &&
                this.x < p.x + p.width;

            const hitsBottom =
                this.y >= p.y + p.height &&      // player starts BELOW platform
                nextY <= p.y + p.height &&       // next position would enter platform
                this.vy < 0 &&                   // player moving upward
                withinX;

            if (hitsBottom) {
                nextY = p.y + p.height;          // keep player under platform
                this.vy = 0;                     // cancel upward movement
                break;
            }
        }

        // Apply vertical movement
        this.y = nextY;

        if (!onPlatform && this.vy > 0) {
            this.canJump = false;
        }

        // WALL COLLISIONS
        for (let p of platforms) {
            const hitsY =
                this.y + this.height > p.y &&
                this.y < p.y + p.height;

            // right wall
            if (this.vx > 0) {
                const willHitRight =
                    this.x + this.width > p.x &&
                    this.x < p.x &&
                    hitsY;

                if (willHitRight) {
                    this.x = p.x - this.width;
                    this.vx = 0;
                }
            }

            // left wall
            if (this.vx < 0) {
                const willHitLeft =
                    this.x < p.x + p.width &&
                    this.x + this.width > p.x + p.width &&
                    hitsY;

                if (willHitLeft) {
                    this.x = p.x + p.width;
                    this.vx = 0;
                }
            }
        }
    }

    takeDamage(fromEnemy) {
        if (window.invincibleMode) return; // cannot take damage during i-frames
        if (this.hp <= 0) return;

        this.hp -= 1;
        this.isInvincible = true;

        // Knockback direction (enemy pushes you away)
        if (fromEnemy.x < this.x) {
            this.vx = this.knockback;
        } else {
            this.vx = -this.knockback;
        }

        // small upward bump
        this.vy = -8;

        // Flash or darken sprite if you want
        this.flashTimer = 0;

        // Remove invincibility after duration
        setTimeout(() => {
            this.isInvincible = false;
        }, this.invincibilityDuration);

    }


    draw(ctx) {
        if (!this.image.complete) {
            ctx.fillStyle = "pink";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            return;
        }

        const drawWidth = this.width * this.scale;
        const drawHeight = this.height * this.scale;

        // Lower the sprite slightly to match the ground
        const footOffset = 0;     // <-- adjust this number until the feet look perfect
        const offsetX = (drawWidth - this.width) / 2;
        const offsetY = (drawHeight - this.height) - footOffset;

        ctx.save();


        if (this.isInvincible) {
            if (Math.floor(Date.now() / 100) % 2 === 0) {
                return; // skip drawing → blinking effect
            }
        }
        if (this.facing === -1) {
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.image,
                -(this.x - offsetX + drawWidth),
                this.y - offsetY,
                drawWidth,
                drawHeight
            );
        } else {
            ctx.drawImage(
                this.image,
                this.x - offsetX,
                this.y - offsetY,
                drawWidth,
                drawHeight
            );
        }

        ctx.restore();
    }
        
}
