export default class Boss {
    constructor(x, y, maxY = Infinity, isYi = false) {
        this.x = x;
        this.y = y;

        this.width = 180;
        this.height = 180;
        this.maxY = maxY

        this.maxHP = isYi ? 10 : 6;
        this.hp = this.maxHP;

        this.vx = 0;
        this.vy = 0;
        this.speed = isYi ? 2.4 : 1.5;
        this.gravity = 0.6;

        this.jumpStrength = -18;
        this.canJump = true;

        this.image = new Image();
        this.image.src = "assets/boss_golem.png";

        this.facing = 1;

        // Snowball attack timers
        this.shootCooldown = isYi ? 3000 : 4000;
        this.lastShot = 0;

        // For summoning minions (optional)
        this.summonCooldown = isYi ? 6500 : 9000;
        this.lastSummon = 0;

        this.alive = true;
    }

    update(player, platforms, spawnEnemyCallback, shootCallback) {
        if (!this.alive) return;

        // Chase horizontally
        if (player.x < this.x) {
            this.vx = -this.speed;
            this.facing = -1;
        } else {
            this.vx = this.speed;
            this.facing = 1;
        }

        // Gravity
        this.vy += this.gravity;

        let nextX = this.x + this.vx;
        let nextY = this.y + this.vy;
        let landed = false;


        // Platform landing
        for (let p of platforms) {
            const withinX =
                nextX + this.width > p.x &&
                nextX < p.x + p.width;

            const wasAbove = this.y + this.height <= p.y;
            const willFallThrough = nextY + this.height >= p.y;

            if (this.vy >= 0 && withinX && wasAbove && willFallThrough) {
                nextY = p.y - this.height;
                this.vy = 0;
                this.canJump = true;
                landed = true;
                break;
            }
        }

        // Occasional jumping to pressure player
        if (this.canJump && this.y >= this.maxY && Math.random() < 0.01) {
            this.vy = this.jumpStrength;  // Let it jump if it's on the bottom platforms
            this.canJump = false;
        }

        // Apply movement
        this.x = nextX;
        this.y = nextY;

        // Attack 1: Snowball shooting
        const now = performance.now();
        if (now - this.lastShot > this.shootCooldown) {
            this.lastShot = now;
            shootCallback(this.x + this.width / 2, this.y + 60, this.facing);
        }

        // Attack 2: Summon little minions (optional)
        if (now - this.lastSummon > this.summonCooldown) {
            this.lastSummon = now;
            spawnEnemyCallback(this.x, this.y);  // call back to main
        }
    }

    takeDamage() {
        if (!this.alive) return;
        this.hp--;
        if (this.hp <= 0) {
            this.alive = false;
        }
    }

    draw(ctx) {
        if (!this.alive) return;

        if (!this.image.complete) {
            ctx.fillStyle = "purple";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            return;
        }

        const drawX = this.x;
        const drawY = this.y;

        ctx.drawImage(this.image, drawX, drawY, this.width, this.height);
    }
}
