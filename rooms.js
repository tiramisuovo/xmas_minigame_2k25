const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;

const roomTemplates = [
    // -------- ROOM 0 ----------
    {
        playerStart: { x: 50, y: BASE_HEIGHT - 200 },

        // real ground with a missing middle section
        platforms: [
            // left ground
            {
                x: 0,
                y: BASE_HEIGHT - 100,
                width: BASE_WIDTH - 400,
                height: 20
            },

            // right ground
            {
                x: BASE_WIDTH - 175,
                y: BASE_HEIGHT - 100,
                width: 200,
                height: 20
            }
        ],

        // fake platform that breaks immediately
        crumblePlatforms: [
            {
                x: BASE_WIDTH - 400,
                y: BASE_HEIGHT - 100, // SAME level as ground
                width: 300,
                height: 20
            }
        ],

        enemies: [
            { x: BASE_WIDTH - 420, y: BASE_HEIGHT - 200 }
        ],

        exitDoor: {
            x: BASE_WIDTH - 100,
            y: BASE_HEIGHT - 160,
            width: 40,
            height: 60
        }
    },



    // -------- ROOM 1 ----------
 {
    playerStart: { x: 60, y: BASE_HEIGHT - 220 },

    platforms: [
        // Ground
        {
            x: 0,
            y: BASE_HEIGHT - 100,
            width: BASE_WIDTH,
            height: 20
        },

        // Tier 1 ƒ?" Left platform (easy first jump)
        {
            x: 275,
            y: BASE_HEIGHT - 220,
            width: 525,
            height: 20
        },

        // Tier 2 ƒ?" Middle platform (big and safe)
        {
            x: BASE_WIDTH / 2 - 130,
            y: BASE_HEIGHT - 340,
            width: 565,
            height: 20
        },

        // Tier 3 ƒ?" Right platform (approach to exit)
        {
            x: BASE_WIDTH - 500,
            y: BASE_HEIGHT - 450,
            width: 575,
            height: 20
        },


        // High platform holding the exit
        {
            x: BASE_WIDTH - 200,
            y: BASE_HEIGHT - 550,
            width: 300,
            height: 20
        }
    ],

    enemies: [
        // Enemy far right on ground
        { x: BASE_WIDTH - 100, y: BASE_HEIGHT - 220 },

        // Enemy on Tier 1
        { x: BASE_WIDTH / 2 - 300, y: BASE_HEIGHT - 340 },

        // Enemy on Tier 2
        { x: BASE_WIDTH - 600, y: BASE_HEIGHT - 450 },

        // Enemy on Tier 3
        { x: BASE_WIDTH - 200, y: BASE_HEIGHT - 550 },

    ],

    exitDoor: {
        x: BASE_WIDTH - 100,
        y: BASE_HEIGHT - 610,   
        width: 40,
        height: 60
    }
},


// -------- ROOM 2 (Christmas Tree Boss Arena) ----------
{
    playerStart: { x: 50, y: BASE_HEIGHT - 200 },

    platforms: [
        // GROUND (Tier 0)
        {
            x: 0,
            y: BASE_HEIGHT - 100,
            width: BASE_WIDTH,
            height: 20
        },

        // TIER 1 (Wide base branches)
        {
            x: BASE_WIDTH / 2 - 550,
            y: BASE_HEIGHT - 260,
            width: 300,
            height: 20
        },
        {
            x: BASE_WIDTH / 2 - 100,
            y: BASE_HEIGHT - 260,
            width: 200,
            height: 20
        },
        {
            x: BASE_WIDTH / 2 + 275,
            y: BASE_HEIGHT - 260,
            width: 300,
            height: 20
        },

        // TIER 2 (Middle branches)
        {
            x: BASE_WIDTH / 2 - 400,
            y: BASE_HEIGHT - 415,
            width: 270,
            height: 20
        },

        {
            x: BASE_WIDTH / 2 + 140,
            y: BASE_HEIGHT - 415,
            width: 270,
            height: 20
        },

        // TIER 3 (Upper branches)
        {
            x: BASE_WIDTH / 2 - 200,
            y: BASE_HEIGHT - 565,
            width: 400,
            height: 20
        },


        // TIER 4 (Mini branch under star)
        {
            x: BASE_WIDTH / 2 - 60,
            y: BASE_HEIGHT - 720,
            width: 120,
            height: 20
        },

    ],
    
    boss: { 
        x: BASE_WIDTH / 2 - 80, 
        y: BASE_HEIGHT - 730,
        maxY: BASE_HEIGHT - 650
    },

    enemies: [
        // Tier 1 ornaments
        { x: BASE_WIDTH / 2 - 350, y: BASE_HEIGHT - 340 },
        { x: BASE_WIDTH / 2 + 260, y: BASE_HEIGHT - 340 },

        // Tier 2 ornaments
        //{ x: BASE_WIDTH / 2 - 250, y: BASE_HEIGHT - 520 },
        { x: BASE_WIDTH / 2 + 190, y: BASE_HEIGHT - 520 },

        // Tier 3 ornaments
        //{ x: BASE_WIDTH / 2 - 170, y: BASE_HEIGHT - 700 },
        //{ x: BASE_WIDTH / 2 + 130, y: BASE_HEIGHT - 700 },

        // Mini ornament under star
        { x: BASE_WIDTH / 2 - 20, y: BASE_HEIGHT - 860 }
    ],
        exitDoor: {
            x: BASE_WIDTH / 2 - 20,
            y: BASE_HEIGHT - 780,
            width: 40,
            height: 60
        }
}
];

function scaleRect(rect, scaleX, scaleY) {
    return {
        ...rect,
        x: rect.x * scaleX,
        y: rect.y * scaleY,
        width: rect.width * scaleX,
        height: rect.height * scaleY
    };
}

function scalePoint(point, scaleX, scaleY) {
    return {
        ...point,
        x: point.x * scaleX,
        y: point.y * scaleY
    };
}

export function buildRooms(viewWidth, viewHeight) {
    const scaleX = viewWidth / BASE_WIDTH;
    const scaleY = viewHeight / BASE_HEIGHT;

    return roomTemplates.map(room => ({
        playerStart: scalePoint(room.playerStart, scaleX, scaleY),
        platforms: room.platforms.map(p => scaleRect(p, scaleX, scaleY)),
        crumblePlatforms: room.crumblePlatforms
            ? room.crumblePlatforms.map(c => scaleRect(c, scaleX, scaleY))
            : [],
        enemies: room.enemies.map(e => scalePoint(e, scaleX, scaleY)),
        exitDoor: scaleRect(room.exitDoor, scaleX, scaleY),
        boss: room.boss ? scalePoint(room.boss, scaleX, scaleY) : null
    }));
}
