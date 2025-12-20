import Player from "./player.js";
import Bullet from "./bullet.js";
import Enemy from "./enemy.js";
import { buildRooms } from "./rooms.js";
import Gift from "./gift.js";
import Boss from "./boss.js";
import Snowball from "./snowball.js";
import { initSnow, resizeSnow } from "./snow.js";
import { setupAudio } from "./audio.js";

// Typewriter effect helper -------------------------------------
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


// Music controls ------------------------------------------------
const bgm = document.getElementById("bgm");
const endgameMusic = document.getElementById("endgameMusic");
const muteBtn = document.getElementById("muteBtn");
const audioControls = setupAudio({ bgm, endgameMusic, muteBtn });


// Startup flow + name system ------------------------------------
const loadingScreen = document.getElementById("loadingScreen");
const storyScreen = document.getElementById("storyScreen");
const gameCanvas = document.getElementById("game");
const introOverlay = document.getElementById("introOverlay");
const introMoveLine = document.getElementById("introMove");
const introShootLine = document.getElementById("introShoot");
const introNoteLine = document.getElementById("introNote");
const trapOverlay = document.getElementById("trapOverlay");
const invertOverlay = document.getElementById("invertOverlay");
const invertText = document.getElementById("invertText");
const receiptOverlay = document.getElementById("receiptOverlay");
const receiptName = document.getElementById("receiptName");
const receiptGifts = document.getElementById("receiptGifts");
const receiptGiftMsg = document.getElementById("receiptGiftMsg");
const receiptClose = document.getElementById("receiptClose");
const openReceiptBtn = document.getElementById("openReceiptBtn");
const receiptStamp = document.getElementById("receiptStamp");

const startButton = document.getElementById("startBtn");
const nameInput = document.getElementById("playerName");

const beginGameBtn = document.getElementById("beginGameBtn");

let rawName = "";
let playerName = "";
let gameStarted = false;
let greetingName = "";

startButton.addEventListener("click", () => {
    rawName = nameInput.value.trim().toLowerCase();
    playerName = rawName[0]+rawName[1] || ""; // first two letters
    if (!playerName) return;

    loadingScreen.style.display = "none";
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
    else if (playerName === "ge") {
        inGameName = "the not thicc gamer 🎮";
    }
    else if (playerName === "so") {
        inGameName = "the craft-making scientist 🔬";
    }
    else if (playerName === "ma") {
        inGameName = "the keeper of melodies 🎵";
    }
    else if (playerName === "ch") {
        inGameName = "有金矿的晋江读者 📚";
    }
    else if (playerName === "am") {
        inGameName = "米哈游的忠实粉丝 🐋";
    }
    else {
        inGameName = playerName;
    }
    greetingName = inGameName;
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

    if (playerName === "cr" || playerName === "an" || playerName === "sh" || playerName === "se" || playerName === "je" || playerName === "so" || playerName === "ma") {
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

// Both answers lead to the easy-mode question
function triggerEasyModeQuestion() {
    easyModeQuestion.style.display = "block";

    setTimeout(() => {
        easyModeButtons.style.display = "block";
    }, 800);
}

postCallYes.addEventListener("click", triggerEasyModeQuestion);
postCallNo.addEventListener("click", triggerEasyModeQuestion);

document.querySelectorAll(".noBtn").forEach(btn => {
    btn.addEventListener("click", () => {
        easyModeButtons.style.display = "none";

        finalResponse.style.display = "block";

        setTimeout(() => {
            continueGameBtn.style.display = "block";
        }, 1000);
    });
});

continueGameBtn.addEventListener("click", () => {
    postCallScreen.style.display = "none";
    startGame();
});

if (openReceiptBtn) {
    openReceiptBtn.addEventListener("click", () => {
        populateReceipt();
        animateReceiptStamp();
        toggleReceiptOverlay(true);
    });
}

if (receiptClose) {
    receiptClose.addEventListener("click", () => {
        toggleReceiptOverlay(false);
    });
}

if (receiptOverlay) {
    receiptOverlay.addEventListener("click", (e) => {
        if (e.target === receiptOverlay) {
            toggleReceiptOverlay(false);
        }
    });
}
// Start game after the story is done ---------------------------
beginGameBtn.addEventListener("click", () => {
    if (gameStarted) return;

    storyScreen.style.display = "none";

    if (postCallEligibleNames.includes(playerName)) {
        document.getElementById("postCallScreen").style.display = "flex";
        return;
    }

    startGame();
});

function startGame() {
    if (gameStarted) return;
    gameStarted = true;

    invincibleMode = false;
    window.invincibleMode = invincibleMode;

    endgameMusic.pause();
    endgameMusic.currentTime = 0;
    endgameMusic.muted = bgm.muted;
    bgm.currentTime = 0;
    bgm.play().catch(() => {});

    toggleReceiptOverlay(false);

    gameCanvas.style.display = "block";
    loadRoom(0);
    gameLoop();
}

const snowCanvas = document.getElementById("snowCanvas");
initSnow(snowCanvas);

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let rooms = buildRooms(canvas.width, canvas.height);

// Global state --------------------------------------------------
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
    "ge",
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

const invinciblePlayers = ["cr", "an", "sh", "se", "je", "so", "ma"];
let invincibleMode = false;

let assistText = "";
let assistTextVisible = false;
window.invincibleMode = invincibleMode;
let hasShownYiDefeatMessage = false;

function toggleIntroOverlay(show) {
    if (!introOverlay) return;
    introOverlay.classList.toggle("visible", show);
}

function toggleTrapOverlay(show) {
    if (!trapOverlay) return;
    trapOverlay.classList.toggle("visible", show);
}

function toggleInvertOverlay(show, text = "") {
    if (!invertOverlay || !invertText) return;
    invertText.textContent = text;
    invertOverlay.classList.toggle("visible", show);
}

function toggleReceiptOverlay(show) {
    if (!receiptOverlay) return;
    receiptOverlay.classList.toggle("visible", show);
}

function populateReceipt() {
    if (!receiptName || !receiptGifts) return;
    const nameText = greetingName || playerName || "Traveler";
    receiptName.textContent = nameText;
    receiptGifts.textContent = giftCount.toString();

    if (receiptGiftMsg) {
        let msg = "A symbolic receipt.";
        if (giftCount >= 13) {
            msg = "The cat is impressed.";
        } else if (giftCount >= 9) {
            msg = "Well above seasonal expectations.";
        } else if (giftCount >= 4) {
            msg = "Consistent effort detected.";
        } else if (giftCount >= 1) {
            msg = "Proof of participation.";
        }
        receiptGiftMsg.textContent = msg;
    }
}

function animateReceiptStamp() {
    if (!receiptStamp) return;
    receiptStamp.classList.remove("animate");
    // force reflow
    void receiptStamp.offsetWidth;
    receiptStamp.classList.add("animate");
}

function setIntroTextForPlayer() {
    if (!introMoveLine || !introShootLine || !introNoteLine) return;

    introMoveLine.textContent = "Move with Left/Right arrows, jump with Up";

    if (playerName === "yi") {
        introShootLine.textContent = "Press space to launch tomatoes";
        introNoteLine.textContent = "(to use up those tomatoes from costco)";
        introNoteLine.style.display = "block";
    } else {
        introShootLine.textContent = "Press space to shoot snowflakes";
        introNoteLine.style.display = "none";
    }
}

const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;

function getEntityScale() {
    return {
        x: canvas.width / BASE_WIDTH,
        y: canvas.height / BASE_HEIGHT
    };
}

function applyEntityScale(scale) {
    if (player && typeof player.applyScale === "function") {
        player.applyScale(scale.x, scale.y);
    }
    enemies.forEach(e => {
        if (typeof e.applyScale === "function") {
            e.applyScale(scale.x, scale.y);
        }
    });
    if (boss && typeof boss.applyScale === "function") {
        boss.applyScale(scale.x, scale.y);
    }
}

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

function snapPlayerToPlatform() {
    if (!player || !platforms.length) return;

    const support = getSupportPlatform(player.x + player.width / 2);
    if (!support) return;

    player.y = support.y - player.height;
    player.vy = 0;
    player.canJump = true;
}

function getSupportPlatform(centerX, minY = -Infinity) {
    const tolerance = 20;
    const candidates = platforms.filter(p =>
        !p.invisible &&
        centerX >= p.x - tolerance &&
        centerX <= p.x + p.width + tolerance &&
        p.y >= minY
    );

    if (candidates.length) {
        return candidates.reduce((closest, current) =>
            current.y < closest.y ? current : closest
        );
    }

    const visibles = platforms.filter(p => !p.invisible);
    if (!visibles.length) return null;
    return visibles.reduce((lowest, current) =>
        current.y > lowest.y ? current : lowest
    );
}

function snapEnemiesToPlatforms() {
    enemies.forEach(e => {
        const feet = e.y + e.height;
        const support = getSupportPlatform(e.x + e.width / 2, feet - 5);
        if (support) {
            e.y = support.y - e.height;
            e.vy = 0;
        }
    });
}

function keepEnemiesGrounded() {
    // no-op after removing per-frame grounding for enemies
}

function alignDoorToGround() {
    const room = rooms[currentRoomIndex];
    if (!room || !room.exitDoor) return;

    const door = room.exitDoor;
    const support = getSupportPlatform(door.x + door.width / 2, door.y);
    if (support) {
        door.y = support.y - door.height;
    }
}

function placeEntityOnPlatform(entity, platform) {
    entity.x = Math.min(
        Math.max(entity.x, platform.x),
        platform.x + platform.width - entity.width
    );
    entity.y = platform.y - entity.height;
}

function keepPlayerGrounded() {
    if (!player) return;
    const support = getSupportPlatform(player.x + player.width / 2);
    if (support) {
        player.y = support.y - player.height;
        player.vy = 0;
        player.canJump = true;
    }
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

    resizeSnow(window.innerWidth, window.innerHeight);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const scaleX = prevWidth ? canvas.width / prevWidth : 1;
    const scaleY = prevHeight ? canvas.height / prevHeight : 1;

    rooms = buildRooms(canvas.width, canvas.height);

    if (gameStarted && !gameEnded) {
        scaleActiveEntities(scaleX, scaleY);
        applyRoomLayout(rooms[currentRoomIndex]);
        applyEntityScale(getEntityScale());
        snapPlayerToPlatform();
        snapEnemiesToPlatforms();
        alignDoorToGround();
        keepPlayerGrounded();
    }

}

window.addEventListener("resize", handleResize);

// Input handling ------------------------------------------------
window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});
window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

window.addEventListener("keydown", (e) => {
    // Dev skip forward shortcut
    if (e.key.toLowerCase() === "0") {
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
// Dev/test helpers ----------------------------------------------
function devSkipForward() {
    console.log("⏭ Dev skip forward");

    // If still in intro screens, jump to the game
    if (loadingScreen.style.display !== "none") {
        loadingScreen.style.display = "none";
        storyScreen.style.display = "none";
        gameCanvas.style.display = "block";

        loadRoom(0);
        gameLoop();
        return;
    }

    // If in game, skip to next room
    if (!gameEnded && currentRoomIndex + 1 < rooms.length) {
        loadRoom(currentRoomIndex + 1);
        return;
    }

    // If last room, trigger ending
    if (!gameEnded) {
        endGame();
    }
}

// Collision helper ----------------------------------------------
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

// Load a room ---------------------------------------------------
function loadRoom(index) {
    invertControls = false;
    currentRoomIndex = index;
    const room = rooms[index];

    toggleInvertOverlay(false, "");

    if (index === 0) {
        setIntroTextForPlayer();
    }
    toggleIntroOverlay(index === 0);

    let spritePath = "assets/player.png";

    player = new Player(room.playerStart.x, room.playerStart.y, spritePath);
    player.vy = 0;

    // Invert controls for the special player in room 2
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

    enemies = room.enemies.map(e => new Enemy(e.x, e.y));

    bullets = [];

    if (room.boss && room.boss.x !== undefined) {
        const tougherYiBoss = playerName === "yi";
        boss = new Boss(room.boss.x, room.boss.y, room.boss.maxY, tougherYiBoss);
    } else {
        boss = null;
    }

    applyEntityScale(getEntityScale());
    player.x = Math.min(Math.max(player.x, 0), canvas.width - player.width);
    snapPlayerToPlatform();
    snapEnemiesToPlatforms();
    alignDoorToGround();
    keepPlayerGrounded();
}

// Room exit check ----------------------------------------------
function checkExit() {
    const room = rooms[currentRoomIndex];
    const door = room.exitDoor;

    if (!door) return;

    // Lock door if boss exists and is still alive
    if (room.boss && boss && boss.alive) {
        return;
    }

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

// Cat easter egg ------------------------------------------------
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

    // Special case for Yi
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

// Inverse control overlay text ---------------------------------
function triggerRespectText() {
    const lines = [
        "someone once said going easy is disrespectful.",
        "guess I should show some respect.",
        "AHAHAHA"
    ];

    let i = 0;

    setTimeout(() => {
        const showLine = () => {
            if (i >= lines.length) {
                toggleInvertOverlay(false, "");
                return;
            }

            toggleInvertOverlay(true, lines[i]);
            i++;

            setTimeout(showLine, i === lines.length ? 1200 : 2200);
        };

        showLine();
    }, 1000); // 1 second delay
}

// Invincible mode assist text ----------------------------------
function showAssistText(text) {
    assistText = text;
    assistTextVisible = true;

    setTimeout(() => {
        assistTextVisible = false;
        assistText = "";
    }, 1800);
}

// Defeat handling ----------------------------------------------
const defeatTexts = [
    "oops.",
    "that was unfortunate.",
    "almost.",
    "let's pretend that didn't happen.",
    "interesting strategy.",
    "ambitious.",
    "that was bold.",
    "effort was admirable.",
    "the cat is waiting."
];

function handleDefeat() {
    defeatInProgress = true;
    let text;

    if (playerName === "yi" && !hasShownYiDefeatMessage) {
        text = "Skill issues, Mr. Grandmaster?";
        hasShownYiDefeatMessage = true;
    } else {
        text = defeatTexts[Math.floor(Math.random() * defeatTexts.length)];
    }

    cancelAnimationFrame(gameLoopId);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.font = "bold 72px 'Playfair Display'";
    ctx.textAlign = "center";
    ctx.fillText(
        text,
        canvas.width / 2,
        canvas.height / 2
    );

    setTimeout(() => {
        restartRoom();
    }, 1200);
}

function restartRoom() {
    defeatInProgress = false;

    loadRoom(currentRoomIndex);
    gameLoop();
}

// Game loop -----------------------------------------------------
function gameLoop() {
    if (gameEnded) return;
    if (player && player.hp === 0 && !defeatInProgress) {
        handleDefeat();
        return;
    }

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

            // Use name-based bullet skin
            let skin = bulletSkins[playerName] || bulletSkins.default;

            bullets.push(new Bullet(
                player.x + player.width / 2 + (player.facing === 1 ? player.shootOffsetX : -player.shootOffsetX),
                player.y + player.shootOffsetY,
                player.facing,
                skin
            ));
        }
    }
    player.update(platforms);

    // Crumble platforms disappear on contact and trigger trap once
    for (let c of crumblePlatforms) {
        if (isColliding(player, c)) {

            crumblePlatforms = crumblePlatforms.filter(cp => cp !== c);
            platforms = platforms.filter(p => !(p.x === c.x && p.y === c.y));

            if (!trapTriggered) {
                trapTriggered = true;

                setTimeout(() => {
                    showTrapMessage = true;
                    toggleTrapOverlay(true);

                    setTimeout(() => {
                        showTrapMessage = false;
                        toggleTrapOverlay(false);
                    }, 2000);

                }, 1000);

                // Teleport to the next room after the trap resolves
                setTimeout(() => {
                    loadRoom(1);
                }, 4000);
            }

            break;
        }
    }

    enemies.forEach(e => {
        if (!e.isDead) e.update(player, platforms);
    });

    // Boss AI update
    if (boss && boss.alive) {
        boss.update(
            player,
            platforms,

            // Spawn minions during the fight
            (x, y) => {
                const minion = new Enemy(x, y - 50);
                if (typeof minion.applyScale === "function") {
                    minion.applyScale(getEntityScale());
                }
                enemies.push(minion);
            },

            // Boss projectile callback
            (x, y, direction) => {
                const speedBoost = playerName === "yi" ? 1.25 : 1;
                snowballs.push(new Snowball(x, y, direction, speedBoost));
            }
        );
    }

    
    bullets.forEach(b => b.update());
    bullets = bullets.filter(b => !b.isOffScreen(canvas.width));

    // Bullet vs enemy damage
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

    // Bullet vs boss damage
    if (boss && boss.alive) {
        for (let i = bullets.length - 1; i >= 0; i--) {
            if (isColliding(bullets[i], boss)) {
                bullets.splice(i, 1);
                boss.takeDamage();
            }
        }
    }

    // Enemy vs player damage
    for (let e of enemies) {
        if (!e.isDead && isColliding(player, e)) {
            player.takeDamage(e);
        }
    }

    if (boss && boss.alive && isColliding(player, boss)) {
        player.takeDamage(boss);
    }

    snowballs.forEach(sb => sb.update());
    snowballs = snowballs.filter(sb => !sb.isOffScreen(canvas.width));

    for (let sb of snowballs) {
        if (isColliding(player, sb)) {
            player.takeDamage(sb);
        }
    }

    gifts.forEach(g => g.update());

    for (let i = gifts.length - 1; i >= 0; i--) {
        const g = gifts[i];

        if (g.collidesWith(player)) {
            giftCount++;
            g.collected = true;
            gifts.splice(i, 1);
            continue;
        }

        if (g.isGone()) {
            gifts.splice(i, 1);
        }
    }

    checkExit();


    // Draw -------------------------------------------------------
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    platforms.forEach(p => {
        if (p.invisible) return;

        const tileW = 64;
        const tileH = 32;

        for (let x = 0; x < p.width; x += tileW) {
            ctx.drawImage(iceTile, p.x + x, p.y, tileW, tileH);
        }
    });

    // Draw crumble platforms
    crumblePlatforms.forEach(c => {
        const tileW = 64;
        const tileH = 32;
        for (let x = 0; x < c.width; x += tileW) {
            ctx.drawImage(iceTile, c.x + x, c.y, tileW, tileH);
        }
    });

    // Draw exit door
    const door = rooms[currentRoomIndex].exitDoor;

    if (doorLoaded) {
        ctx.drawImage(doorImg, door.x, door.y - 60, door.width *2, door.height *2);
    } else {
        ctx.fillStyle = "gold";
        ctx.fillRect(door.x, door.y, door.width, door.height);
    }

    // Assist mode text
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

    gifts.forEach(g => g.draw(ctx));

    player.draw(ctx);

    ctx.fillStyle = "black";
    ctx.font = "30px 'Playfair Display'";
    ctx.fillText(`❤️ HP: ${player.hp}`, 40, 50);

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

    if (boss && boss.alive) {
        boss.draw(ctx);
    }
    
    enemies.forEach(e => {
        if (!e.isDead) e.draw(ctx);
    });


    bullets.forEach(b => b.draw(ctx));

    snowballs.forEach(sb => sb.draw(ctx));

    gameLoopId = requestAnimationFrame(gameLoop);
}

function endGame() {
    gameEnded = true;

    cancelAnimationFrame(gameLoopId);

    // Swap to ending music
    bgm.pause();
    endgameMusic.currentTime = 0;
    endgameMusic.play().catch(() => {});

    gameCanvas.style.display = "none";

    // Show ending screen
    const ending = document.getElementById("endingScreen");
    ending.style.display = "flex";
    if (openReceiptBtn) openReceiptBtn.style.display = "inline-flex";

}
