export default class Player {
    constructor(x, y, spritePath){
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.scale = 1;

        this.vx = 0
        this.vy = 0
        this.speed = 4.6
        this.gravity = 0.57
        this.jumpStrength = -16.5
        this.canJump = true
        this.facing = 1; // 1 for right, -1 for left

        this.image = new Image();
        this.image.src = spritePath;

        this.shootOffsetX = 50;
        this.shootOffsetY =  20;  // move bullet downward

        this.maxHP = 5;
        this.hp = 5;
        this.isInvincible = false;
        this.invincibilityDuration = 1500; // ms
        this.knockback = 10;
        this.coyoteTimer = 0;
        this.coyoteTimeMax = 180; // ms (use 300–420 for assist later)
    }

    applyScale(scaleX, scaleY) {
        const baseWidth = 100;
        const baseHeight = 100;
        const baseSpeed = 4.6;
        const baseGravity = 0.57;
        const baseJump = -16.5;
        const baseShootX = 50;
        const baseShootY = 20;
        const baseKnockback = 10;

        this.width = baseWidth * scaleX;
        this.height = baseHeight * scaleY;
        this.speed = baseSpeed * scaleX;
        this.gravity = baseGravity * scaleY;
        this.jumpStrength = baseJump * scaleY;
        this.shootOffsetX = baseShootX * scaleX;
        this.shootOffsetY = baseShootY * scaleY;
        this.knockback = baseKnockback * scaleX;
        this.scale = 1; // hitbox already scaled
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
        if (this.canJump || this.coyoteTimer > 0){
            this.vy = this.jumpStrength;
            this.canJump = false;
            this.coyoteTimer = 0;
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

        const bottomNow  = this.y + this.height;
        const bottomNext = nextY + this.height;

        const tolerance = 10; // 👈 key: allow a little penetration

        if (
            this.vy >= 0 &&
            withinX &&
            bottomNow <= p.y + tolerance &&
            bottomNext >= p.y
        ) {
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

        // Update coyote timer
        if (this.isInvincible) {
            this.coyoteTimeMax = 500;
            }
        
        if (this.canJump) {
            this.coyoteTimer = this.coyoteTimeMax;
        } else {
            this.coyoteTimer -= 16; // assuming ~60fps
        }
    }

    takeDamage(fromEnemy) {
        if (window.invincibleMode) return; // cannot take damage during i-frames
        if (this.isInvincible) return;     // <- skip during i-frames
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
