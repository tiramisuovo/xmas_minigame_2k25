import Player from "./Player.js";
import Bullet from "./bullet.js";
import Enemy from "./enemy.js";
import { buildRooms } from "./rooms.js";
import Gift from "./Gift.js";
import Boss from "./Boss.js";
import Snowball from "./Snowball.js";

// ----- SNOW EFFECT -----
const snowCanvas = document.getElementById("snowCanvas");
const snowCtx = snowCanvas.getContext("2d");

snowCanvas.width = window.innerWidth;
snowCanvas.height = window.innerHeight;

let snowflakes = [];

function createSnowflakes(count = 120) {
    snowflakes = [];
    for (let i = 0; i < count; i++) {
        snowflakes.push({
            x: Math.random() * snowCanvas.width,
            y: Math.random() * snowCanvas.height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 1 + 0.5,
            drift: (Math.random() - 0.5) * 0.5
        });
    }
}

function updateSnow() {
    snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

    snowflakes.forEach(flake => {
        flake.y += flake.speed;
        flake.x += flake.drift;

        if (flake.y > snowCanvas.height) {
            flake.y = -10;                // restart from top
            flake.x = Math.random() * snowCanvas.width;
        }

        snowCtx.beginPath();
        snowCtx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        snowCtx.fillStyle = "white";
        snowCtx.fill();
    });

    requestAnimationFrame(updateSnow);
}

createSnowflakes();
updateSnow();

// ===============================
// TYPEWRITER EFFECT
function typeWriter(element, text, speed = 40) {
    element.innerText = "";
    let i = 0;

    function typing() {
        if (i < text.length) {
            element.innerText += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }

    typing();
}


// ===============================
// MUSIC
const bgm = document.getElementById("bgm");
const muteBtn = document.getElementById("muteBtn");

// Start music after user interaction (browser rule)
window.addEventListener("click", () => {
    if (bgm.paused) bgm.play();
}, { once: true });

// Toggle mute
muteBtn.addEventListener("click", () => {
    bgm.muted = !bgm.muted;
    muteBtn.textContent = bgm.muted ? "🔇" : "🔊";
});


// ===============================
// STARTUP SCREENS + NAME SYSTEM
// ===============================

// Elements
const loadingScreen = document.getElementById("loadingScreen");
const storyScreen = document.getElementById("storyScreen");
const gameCanvas = document.getElementById("game");

const startButton = document.getElementById("startBtn");
const nameInput = document.getElementById("playerName");

const beginGameBtn = document.getElementById("beginGameBtn");

let rawName = "";
let playerName = "";
let gameStarted = false;

// -------------------------------
// STEP 1 — ENTER NAME
// -------------------------------
startButton.addEventListener("click", () => {
    rawName = nameInput.value.trim().toLowerCase();
    playerName = rawName[0]+rawName[1] || ""; // first two letters
    if (!playerName) return;

    // Hide the loading screen
    loadingScreen.style.display = "none";

    // Show story screen
    storyScreen.style.display = "flex";

    let inGameName = "";
    // Custom story message based on name
    if (playerName === "je") {
        inGameName = "tiramisu 🍰";
    }
    else if (playerName === "cr") {
        inGameName = "the BEST NEUROSURGEON 🧠";
    }
    else if (playerName === "an") {
        inGameName = "red panda cuddler 🧡";
    }
    else if (playerName === "sh") {
        inGameName = "iced capp queen 🧋";
    }
    else if (playerName === "yi") {
        inGameName = "Princess of Tomatoes 🍅";
    }
    else if (playerName === "se") {
        inGameName = "bestie forever ✨";
    }
    else {
        inGameName = playerName;
    }
    typeWriter(
        document.getElementById("storyText"),
        `Welcome, ${inGameName}.`,
        60
    );

    setTimeout(() => {
        typeWriter(
            document.getElementById("storyLine2"),
            "The cat has been kidnapped, apparently.",
            60
        );
        document.getElementById("storyLine2").style.opacity = 1;
    }, 2500);

    setTimeout(() => {
        typeWriter(
            document.getElementById("storyLine3"),
            "Please save her... and stay alive... maybe :)",
            60
        );
        document.getElementById("storyLine3").style.opacity = 1;
    }, 5000);

    if (playerName === "cr" || playerName === "an" || playerName === "sh" || playerName === "se") {
        setTimeout(() => {
            typeWriter(
                document.getElementById("storyLine4"),
                "Just for you: press 1 anytime to toggle assist mode & don't tell anyone shushhhhh",
                60
            );
            document.getElementById("storyLine4").style.opacity = 1;
        }, 7500)};

    setTimeout(() => {
        const btn = document.getElementById("beginGameBtn");
        btn.style.opacity = 1;
        btn.style.pointerEvents = "auto";
    }, 8000);
});

const postCallScreen = document.getElementById("postCallScreen");
const postCallYes = document.getElementById("postCallYes");
const postCallNo = document.getElementById("postCallNo");

const easyModeQuestion = document.getElementById("easyModeQuestion");
const easyModeButtons = document.getElementById("easyModeButtons");
const finalResponse = document.getElementById("finalResponse");
const continueGameBtn = document.getElementById("continueGameBtn");

// Both YES and NO do the same thing (because residency)
function triggerEasyModeQuestion() {
    easyModeQuestion.style.display = "block";

    setTimeout(() => {
        easyModeButtons.style.display = "block";
    }, 800);
}

postCallYes.addEventListener("click", triggerEasyModeQuestion);
postCallNo.addEventListener("click", triggerEasyModeQuestion);

// Both "No" buttons
document.querySelectorAll(".noBtn").forEach(btn => {
    btn.addEventListener("click", () => {
        easyModeButtons.style.display = "none";

        finalResponse.style.display = "block";

        setTimeout(() => {
            continueGameBtn.style.display = "block";
        }, 1000);
    });
});

// Actually start game
continueGameBtn.addEventListener("click", () => {
    postCallScreen.style.display = "none";
    startGame();
});
// -------------------------------
// STEP 2 — START GAME AFTER STORY
// -------------------------------
beginGameBtn.addEventListener("click", () => {
    if (gameStarted) return;

    // Hide story screen
    storyScreen.style.display = "none";

    // Only certain people get interrogated
    if (postCallEligibleNames.includes(playerName)) {
        document.getElementById("postCallScreen").style.display = "flex";
        return;
    }

    // Everyone else goes straight to game
    startGame();
});

function startGame() {
    if (gameStarted) return;
    gameStarted = true;

    gameCanvas.style.display = "block";
    loadRoom(0);
    gameLoop();
}

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let rooms = buildRooms(canvas.width, canvas.height);

// ---------------------------
// GLOBAL STATE
// ---------------------------
let currentRoomIndex = 0;
let player;
let platforms = [];
let enemies = [];
let bullets = [];
let keys = {};
let crumblePlatforms = [];
let showTrapMessage = false;
let trapTriggered = false;
let isLoading = true;
let lastShotTime = 0;
const SHOT_COOLDOWN = 250; // milliseconds
let gameEnded = false;
let gameLoopId;
let defeatInProgress = false;

const iceTile = new Image();
iceTile.src = "assets/ground_tile.png"; 
const doorImg = new Image();
doorImg.src = "assets/door.png";

let doorLoaded = false;

doorImg.onload = () => {
    doorLoaded = true;
    console.log("Door image loaded!");
};

doorImg.onerror = () => {
    console.error("Failed to load door.png — check path!");
};

let gifts = [];
let giftCount = 0;
let boss = null;
let snowballs = [];

const cat = document.getElementById("endingCat");
const bubble = document.getElementById("catBubble");

let catClicks = 0;

const postCallEligibleNames = [
    "cr",
    "an",
    "sh",
];

const bulletSkins = {
    "yi": "assets/tomato.png",
    "default": "assets/snowflake.png"
};

const invertControlPlayer = "yi"; 
let invertControls = false;
let invertTriggered = false;

let respectText = "";
let respectTextVisible = false;

const invinciblePlayers = ["cr", "an", "sh", "se"];
let invincibleMode = false;

let assistText = "";
let assistTextVisible = false;
window.invincibleMode = invincibleMode;

function applyRoomLayout(room) {
    platforms = room.platforms.map(p => ({ ...p }));
    crumblePlatforms = room.crumblePlatforms
        ? room.crumblePlatforms.map(c => ({ ...c }))
        : [];

    platforms.push(
        { x: -50, y: 0, width: 50, height: canvas.height, invisible: true },
        { x: canvas.width, y: 0, width: 50, height: canvas.height, invisible: true }
    );
}

function scaleActiveEntities(scaleX, scaleY) {
    if (player) {
        player.x *= scaleX;
        player.y *= scaleY;
    }

    enemies.forEach(e => {
        e.x *= scaleX;
        e.y *= scaleY;
    });

    bullets.forEach(b => {
        b.x *= scaleX;
        b.y *= scaleY;
    });

    gifts.forEach(g => {
        g.x *= scaleX;
        g.y *= scaleY;
    });

    snowballs.forEach(sb => {
        sb.x *= scaleX;
        sb.y *= scaleY;
    });

    if (boss) {
        boss.x *= scaleX;
        boss.y *= scaleY;
    }
}

function handleResize() {
    const prevWidth = canvas.width;
    const prevHeight = canvas.height;

    snowCanvas.width = window.innerWidth;
    snowCanvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const scaleX = prevWidth ? canvas.width / prevWidth : 1;
    const scaleY = prevHeight ? canvas.height / prevHeight : 1;

    rooms = buildRooms(canvas.width, canvas.height);

    if (gameStarted && !gameEnded) {
        scaleActiveEntities(scaleX, scaleY);
        applyRoomLayout(rooms[currentRoomIndex]);
    }

    createSnowflakes();
}

window.addEventListener("resize", handleResize);

// ---------------------------
// INPUT
// ---------------------------
window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});
window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

window.addEventListener("keydown", (e) => {
    // Ctrl + Shift + N → skip forward
    if (e.key.toLowerCase() === "n") {
        devSkipForward();
    }
});

window.addEventListener("keydown", (e) => {
    if (
        e.key === "1" &&
        invinciblePlayers.includes(playerName)
    ) {
        invincibleMode = !invincibleMode;
        window.invincibleMode = invincibleMode;

        showAssistText(
            invincibleMode
                ? "assist mode enabled."
                : "assist mode disabled."
        );
    }
});
// ---------------------------
// TEST MODE
// ---------------------------
function devSkipForward() {
    console.log("⏭ Dev skip forward");

    // If still in intro screens → jump to game
    if (loadingScreen.style.display !== "none") {
        loadingScreen.style.display = "none";
        storyScreen.style.display = "none";
        gameCanvas.style.display = "block";

        loadRoom(0);
        gameLoop();
        return;
    }

    // If in game → next room
    if (!gameEnded && currentRoomIndex + 1 < rooms.length) {
        loadRoom(currentRoomIndex + 1);
        return;
    }

    // If last room → ending
    if (!gameEnded) {
        endGame();
    }
}

// ---------------------------
// COLLISION HELPER
// ---------------------------
function isColliding(a, b) {
    const ax = a.x;
    const ay = a.y + (a.hitboxOffsetY || 0);

    const bx = b.x;
    const by = b.y + (b.hitboxOffsetY || 0);

    return (
        ax < bx + b.width &&
        ax + a.width > bx &&
        ay < by + b.height &&
        ay + a.height > by
    );
}

// ---------------------------
// LOAD A ROOM
// ---------------------------
function loadRoom(index) {
    invertControls = false;
    currentRoomIndex = index;
    const room = rooms[index];

    let spritePath = "assets/player.png";

    // player start
    player = new Player(room.playerStart.x, room.playerStart.y, spritePath);

    // invert control
    if (
        playerName === invertControlPlayer &&
        index === 1 &&
        !invertTriggered
    ) {
        invertTriggered = true;
        invertControls = true;
        triggerRespectText();
    }

    applyRoomLayout(room);

    // clone enemies
    enemies = room.enemies.map(e => new Enemy(e.x, e.y));

    bullets = [];

    // boss
    if (room.boss && room.boss.x !== undefined) {
        boss = new Boss(room.boss.x, room.boss.y);
    } else {
        boss = null;
    }
}

// ---------------------------
// ROOM EXIT CHECK
// ---------------------------
function checkExit() {
    const room = rooms[currentRoomIndex];
    const door = room.exitDoor;

    if (!door) return;

    // 🔒 Lock door if boss exists and is still alive
    if (room.boss && boss && boss.alive) {
        return;
    }

    // Normal exit logic
    if (isColliding(player, door)) {
        if (currentRoomIndex + 1 < rooms.length) {
            loadRoom(currentRoomIndex + 1);
        } else {
            endGame();
        }
    }
}


function drawLoadingScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ---------------------------
// EASTER EGG
// ---------------------------
const catDialog = {
    1: "meow",
    2: "ok, thank you",
    3: "that's enough",
    4: "...stop",
    5: "STOP IT, HUMAN",
    14: "alright fine fine...",
    15: "tiramisu says",
    16: "see you next year"
};

cat.addEventListener("click", () => {
    catClicks++;

    let message = catDialog[catClicks];

    // SPECIAL CASE
    if (playerName === "yi" && catClicks === 17) {
        message = "senpai";
    }

    if (message) {
        bubble.innerText = message;
        bubble.style.opacity = 1;

        if (catClicks !== 16) {
            setTimeout(() => {
                bubble.style.opacity = 0;
            }, 1800);
        }
    }

    cat.style.transform = "scale(1.05)";
    setTimeout(() => {
        cat.style.transform = "scale(1)";
    }, 120);
});

// ---------------------------
// INVERSE CONTROL
// ---------------------------
function triggerRespectText() {
    const lines = [
        "someone once said going easy is disrespectful.",
        "guess I should show some respect.",
        "AHAHAHA"
    ];

    let i = 0;
    respectTextVisible = true;

    setTimeout(() => {
        respectTextVisible = true;

        function next() {
            if (i >= lines.length) {
                respectTextVisible = false;
                respectText = "";
                return;
            }

            respectText = lines[i];
            i++;

            setTimeout(next, i === 3 ? 1200 : 2200);
        }

        next();
    }, 1000); // 1 second delay
}

// ---------------------------
// INVINCIBLE MODE ASSIST TEXT
// ---------------------------
function showAssistText(text) {
    assistText = text;
    assistTextVisible = true;

    setTimeout(() => {
        assistTextVisible = false;
        assistText = "";
    }, 1800);
}

// ---------------------------
// DEFEATED
// ---------------------------
const defeatTexts = [
    "oops.",
    "that was unfortunate.",
    "almost.",
    "let’s pretend that didn’t happen.",
    "interesting strategy.",
    "ambitious.",
    "that was bold.",
    "effort was admirable.",
    "the cat is waiting."
];

function handleDefeat() {
    defeatInProgress = true;
    const text = defeatTexts[Math.floor(Math.random() * defeatTexts.length)];

    // Stop gameplay
    cancelAnimationFrame(gameLoopId);

    // White screen
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Giant text
    ctx.fillStyle = "black";
    ctx.font = "bold 72px 'Playfair Display'";
    ctx.textAlign = "center";
    ctx.fillText(
        text,
        canvas.width / 2,
        canvas.height / 2
    );

    // Pause, then restart room
    setTimeout(() => {
        restartRoom();
    }, 1200);
}

function restartRoom() {
    defeatInProgress = false;

    // Reload same room
    loadRoom(currentRoomIndex);

    // Resume loop
    gameLoop();
}

// ---------------------------
// GAME LOOP
// ---------------------------
function gameLoop() {
    if (gameEnded) return;
    if (player && player.hp === 0 && !defeatInProgress) {
        handleDefeat();
        return;
    }

    // MOVEMENT
    const leftKey = invertControls ? "ArrowRight" : "ArrowLeft";
    const rightKey = invertControls ? "ArrowLeft" : "ArrowRight";

    if (keys[leftKey]) {
        player.moveLeft();
    } else if (keys[rightKey]) {
        player.moveRight();
    } else {
        player.stop();
    }

    if (keys["ArrowUp"]) {
        player.jump();
    }

    if (keys[" "]) {
        const now = performance.now();

        if (now - lastShotTime > SHOT_COOLDOWN) {
            lastShotTime = now;

            // Pick bullet image based on player name
            let skin = bulletSkins[playerName] || bulletSkins["default"];

            bullets.push(new Bullet(
                player.x + player.width / 2 + (player.facing === 1 ? player.shootOffsetX : -player.shootOffsetX),
                player.y + player.shootOffsetY,
                player.facing,
                skin            // <-- NEW
            ));
        }
    }
    // UPDATE PLAYER PHYSICS
    player.update(platforms);

    // Instant breakable platforms
    for (let c of crumblePlatforms) {
        if (isColliding(player, c)) {

            // REMOVE crumble platform
            crumblePlatforms = crumblePlatforms.filter(cp => cp !== c);
            platforms = platforms.filter(p => !(p.x === c.x && p.y === c.y));

            // TRIGGER MESSAGE ONLY ONCE
            if (!trapTriggered) {
                trapTriggered = true;

                // Show message 1 sec later
                setTimeout(() => {
                    showTrapMessage = true;

                    // Hide message after 2 sec
                    setTimeout(() => {
                        showTrapMessage = false;
                    }, 2000);

                }, 1000); // 1 sec delay



                // ⭐ TELEPORT TO ROOM 2
                // After 2.5 seconds (fall + message timing)
                setTimeout(() => {
                    loadRoom(1);
                }, 4000);
            }

            break;
        }
    }

    // UPDATE ENEMIES
    enemies.forEach(e => {
        if (!e.isDead) e.update(player, platforms);
    });

    // Update Boss
    if (boss && boss.alive) {
        boss.update(
            player,
            platforms,

            // spawnEnemyCallback
            (x, y) => {
                enemies.push(new Enemy(x, y - 50));
            },

            // shootCallback
            (x, y, direction) => {
                snowballs.push(new Snowball(x, y, direction));
            }
        );
    }
    // UPDATE BULLETS
    bullets.forEach(b => b.update());
    bullets = bullets.filter(b => !b.isOffScreen(canvas.width));

    // BULLET → ENEMY DAMAGE
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (!enemies[j].isDead && isColliding(bullets[i], enemies[j])) {  
                bullets.splice(i, 1);
                enemies[j].isDead = true;
                gifts.push(new Gift(enemies[j].x, enemies[j].y - 20));
                break;
            }
        }
    }

    // BULLET → BOSS DAMAGE
    if (boss && boss.alive) {
        for (let i = bullets.length - 1; i >= 0; i--) {
            if (isColliding(bullets[i], boss)) {
                bullets.splice(i, 1);
                boss.takeDamage();
            }
        }
    }

    // ENEMY → PLAYER DAMAGE
    for (let e of enemies) {
        if (!e.isDead && isColliding(player, e)) {
            player.takeDamage(e);
        }
    }

    // BOSS -> PLAYER DAMAGE
    if (boss && boss.alive && isColliding(player, boss)) {
        player.takeDamage(boss);
    }

    // SNOWBALL -> PLAYER DAMAGE
    snowballs.forEach(sb => sb.update());
    snowballs = snowballs.filter(sb => !sb.isOffScreen(canvas.width));

    for (let sb of snowballs) {
        if (isColliding(player, sb)) {
            player.takeDamage(sb);
        }
    }

    // UPDATE GIFTS (fade + bob)
    gifts.forEach(g => g.update());

    // PLAYER COLLECTS GIFT
    for (let i = gifts.length - 1; i >= 0; i--) {
        const g = gifts[i];

        // if collected
        if (g.collidesWith(player)) {
            giftCount++;
            g.collected = true;
            gifts.splice(i, 1);
            continue;
        }

        // if faded away
        if (g.isGone()) {
            gifts.splice(i, 1);
        }
    }

    // CHECK ROOM EXIT
    checkExit();


    // ---------------------------
    // DRAW
    // ---------------------------
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    platforms.forEach(p => {
         if (p.invisible) return;
         
         const tileW = 64;  // ← width of your ice tile
        const tileH = 32;  // ← height of your tile image

        for (let x = 0; x < p.width; x += tileW) {
            ctx.drawImage(iceTile, p.x + x, p.y, tileW, tileH);
        }
    });

    // Draw crumble platforms (look identical)
    crumblePlatforms.forEach(c => {
        const tileW = 64;  // ← width of your ice tile
        const tileH = 32;  // ← height of your tile image
        for (let x = 0; x < c.width; x += tileW) {
            ctx.drawImage(iceTile, c.x + x, c.y, tileW, tileH);
        }
    });

    // Draw exit door (image)
    const door = rooms[currentRoomIndex].exitDoor;

    if (doorLoaded) {
        ctx.drawImage(doorImg, door.x, door.y - 60, door.width *2, door.height *2);
    } else {
        ctx.fillStyle = "gold";
        ctx.fillRect(door.x, door.y, door.width, door.height);
    }

    // Inivincible assist text
    if (assistTextVisible && assistText) {
        ctx.fillStyle = "black";
        ctx.font = "28px 'Playfair Display'";
        ctx.textAlign = "center";
        ctx.fillText(
            assistText,
            canvas.width / 2,
            canvas.height / 2 - 120
        );
    }

    // Gifts
    gifts.forEach(g => g.draw(ctx));

    // Player
    player.draw(ctx);

    // HP
    ctx.fillStyle = "black";
    ctx.font = "30px 'Playfair Display'";
    ctx.fillText(`❤️ HP: ${player.hp}`, 40, 50);

    // Gifts Collected
    ctx.fillStyle = "black";
    ctx.font = "30px 'Playfair Display'";
    ctx.fillText(`🎁 Gifts: ${giftCount}`, 40, 90);

    // Boss HP
    if (boss && boss.alive) {
        const barWidth = 400;
        const hpRatio = boss.hp / boss.maxHP;

        ctx.fillStyle = "black";
        ctx.fillRect(canvas.width / 2 - barWidth / 2, 40, barWidth, 20);

        ctx.fillStyle = "red";
        ctx.fillRect(canvas.width / 2 - barWidth / 2, 40, barWidth * hpRatio, 20);

        ctx.strokeStyle = "white";
        ctx.strokeRect(canvas.width / 2 - barWidth / 2, 40, barWidth, 20);
    }

    //  Boss
    if (boss && boss.alive) {
        boss.draw(ctx);
    }
    
    // Enemies
    enemies.forEach(e => {
        if (!e.isDead) e.draw(ctx);
    });


    // Bullets
    bullets.forEach(b => b.draw(ctx));

    // Snowball
    snowballs.forEach(sb => sb.draw(ctx));

    if (showTrapMessage) {
        ctx.fillStyle = "black";          // text color
        ctx.font = "28px 'Playfair Display'";         // text size
        ctx.textAlign = "center";
        ctx.fillText("oops...forgot to patch the floor...", canvas.width / 2 + 200, window.innerHeight - 200);
    }

    if (respectTextVisible && respectText) {
        ctx.fillStyle = "black";
        ctx.font = "28px 'Playfair Display'";
        ctx.textAlign = "center";
        ctx.fillText(
            respectText,
            canvas.width / 2,
            canvas.height / 2
        );
    }

    gameLoopId = requestAnimationFrame(gameLoop);
}

function endGame() {
    gameEnded = true;

    // Stop rendering logic
    cancelAnimationFrame(gameLoopId);

    // Hide canvas
    gameCanvas.style.display = "none";

    // Show ending screen
    const ending = document.getElementById("endingScreen");
    ending.style.display = "flex";

}

// ---------------------------
// START GAME
// ---------------------------
// DO NOT start game until name is entered
//drawLoadingScreen();

// Skip loading + story screens → start game instantly
//storyScreen.style.display = "none";
//loadingScreen.style.display = "none";
//gameCanvas.style.display = "block";


//loadRoom(0);
//gameLoop();
