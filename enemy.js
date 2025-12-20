export default class Enemy {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;

        this.speed = 1.95;
        this.jumpSpeed = 4;       // horizontal boost during jump
        this.vx = 0;
        this.vy = 0;
        this.gravity = 0.6;
        this.jumpStrength = -15;
        this.canJump = false;     // set true when landing
    
        this.image = new Image();
        this.image.src = "assets/snowman.png";
        this.facing = 1;  
        this.scale = 1; 
        this.drawScale = 1;
    }

    applyScale(scaleX, scaleY) {
        const baseWidth = 100;
        const baseHeight = 100;
        const baseSpeed = 1.95;
        const baseJumpSpeed = 4;
        const baseGravity = 0.6;
        const baseJumpStrength = -15;

        this.width = baseWidth * scaleX;
        this.height = baseHeight * scaleY;
        this.speed = baseSpeed * scaleX;
        this.jumpSpeed = baseJumpSpeed * scaleX;
        this.gravity = baseGravity * scaleY;
        this.jumpStrength = baseJumpStrength * scaleY;
        this.scale = 1;
        this.drawScale = 1;
    }

    _maxJumpHeight() {
        // h = v^2 / (2g); jumpStrength is negative so square it
        return (this.jumpStrength * this.jumpStrength) / (2 * this.gravity);
    }

    _maxHorizontalReach() {
        // time in air ~ time up + time down
        const totalAirTime = Math.abs(this.jumpStrength / this.gravity) * 2;
        return this.jumpSpeed * totalAirTime;
    }

    _getSupportingPlatform(entity, platforms) {
        const feetY = entity.y + entity.height;
        for (let p of platforms) {
            const alignedX =
                entity.x + entity.width > p.x &&
                entity.x < p.x + p.width;

            if (!alignedX) continue;

            if (Math.abs(feetY - p.y) <= 2) {
                return p;
            }
        }

        return null;
    }

    _shouldJump(player, platforms) {
        if (!this.canJump) return false;

        const enemyPlatform = this._getSupportingPlatform(this, platforms);
        if (!enemyPlatform) return false;

        const playerPlatform = this._getSupportingPlatform(player, platforms);
        const targetSurfaceY = playerPlatform ? playerPlatform.y : player.y + player.height;
        const heightDiff = enemyPlatform.y - targetSurfaceY;

        // player must be significantly higher than enemy
        if (heightDiff <= 10) return false;

        if (heightDiff > this._maxJumpHeight()) return false;

        const enemyCenterX = this.x + this.width / 2;
        const playerCenterX = player.x + player.width / 2;
        const direction = playerCenterX >= enemyCenterX ? 1 : -1;

        // must be moving toward the player
        if ((direction > 0 && this.vx < 0) || (direction < 0 && this.vx > 0)) {
            return false;
        }

        const horizontalDistance = Math.abs(playerCenterX - enemyCenterX);
        const maxReach = this._maxHorizontalReach();

        if (horizontalDistance > maxReach) return false;

        if (playerPlatform) {
            const minReachX = this.x - maxReach;
            const maxReachX = this.x + this.width + maxReach;
            const overlapsReach =
                playerPlatform.x < maxReachX &&
                playerPlatform.x + playerPlatform.width > minReachX;

            if (!overlapsReach) return false;
        }

        return true;
    }

    update(player, platforms = []) {
        // Horizontal chase
        if (player.x < this.x - 5) {
            this.vx = -this.speed;
        } else if (player.x > this.x + 5) {
            this.vx = this.speed;
        } else {
            this.vx = 0;
        }

        // SMART JUMP LOGIC
        if (this._shouldJump(player, platforms)) {
            this.vy = this.jumpStrength;
            this.canJump = false;

            // apply horizontal jump boost (dash jump)
            if (this.vx > 0) this.vx = this.jumpSpeed;
            if (this.vx < 0) this.vx = -this.jumpSpeed;
        }

        // gravity
        this.vy += this.gravity;

        let nextX = this.x + this.vx;
        let nextY = this.y + this.vy;

        let onPlatform = false;

    // LANDING (fixed)
    for (let p of platforms) {

        const withinX =
            nextX + this.width > p.x &&
            nextX < p.x + p.width;

        const bottomNow  = this.y + this.height;
        const bottomNext = nextY + this.height;

        // allow up to 10px penetration margin
        const tolerance = 10;

        if (
            this.vy >= 0 &&
            withinX &&
            bottomNow <= p.y + tolerance &&   // was above or slightly inside
            bottomNext >= p.y                 // crossing line
        ) {

            nextY = p.y - this.height;  // snap onto platform
            this.vy = 0;
            this.canJump = true;
            break;
        }
    }


        // CEILING COLLISION
        for (let p of platforms) {
            const withinX =
                nextX + this.width > p.x &&
                nextX < p.x + p.width;

            const hitsBottom =
                this.y >= p.y + p.height &&
                nextY <= p.y + p.height &&
                this.vy < 0 &&
                withinX;

            if (hitsBottom) {
                nextY = p.y + p.height;
                this.vy = 0;
                break;
            }
        }

        // APPLY
        this.x = nextX;
        this.y = nextY;
    }

    draw(ctx) {
        if (!this.image.complete) {
            ctx.fillStyle = "red";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            return;
        }

        const drawW = this.width * this.drawScale;
        const drawH = this.height * this.drawScale;

        // draw EXACTLY at hitbox.x , hitbox.y (top-left anchor)
        const drawX = this.x;
        const drawY = this.y;

        ctx.save();

        if (this.facing === -1) {
            ctx.translate(drawX + drawW / 2, drawY + drawH / 2);
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, -drawW / 2, -drawH / 2, drawW, drawH);
        } else {
            ctx.drawImage(this.image, drawX, drawY, drawW, drawH);
        }

        ctx.restore();
    }
}
