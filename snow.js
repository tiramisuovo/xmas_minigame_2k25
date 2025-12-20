let snowCanvas = null;
let snowCtx = null;
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
    if (!snowCtx || !snowCanvas) return;

    snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

    snowflakes.forEach(flake => {
        flake.y += flake.speed;
        flake.x += flake.drift;

        if (flake.y > snowCanvas.height) {
            flake.y = -10;
            flake.x = Math.random() * snowCanvas.width;
        }

        snowCtx.beginPath();
        snowCtx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        snowCtx.fillStyle = "white";
        snowCtx.fill();
    });

    requestAnimationFrame(updateSnow);
}

export function initSnow(canvasElement) {
    snowCanvas = canvasElement;
    snowCtx = snowCanvas.getContext("2d");
    resizeSnow(window.innerWidth, window.innerHeight);
    updateSnow();
}

export function resizeSnow(width, height) {
    if (!snowCanvas) return;
    snowCanvas.width = width;
    snowCanvas.height = height;
    createSnowflakes();
}
