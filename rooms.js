import Enemy from "./enemy.js";

export const rooms = [


    // -------- ROOM 0 ----------
    {
        playerStart: { x: 50, y: window.innerHeight - 200 },

        // real ground with a missing middle section
        platforms: [
            // left ground
            {
                x: 0,
                y: window.innerHeight - 100,
                width: window.innerWidth - 300,
                height: 20
            },

            // right ground
            {
                x: window.innerWidth - 175,
                y: window.innerHeight - 100,
                width: 200,
                height: 20
            }
        ],

        // fake platform that breaks immediately
        crumblePlatforms: [
            {
                x: window.innerWidth - 290,
                y: window.innerHeight - 100, // SAME level as ground
                width: 65,
                height: 20
            }
        ],

        enemies: [
            new Enemy(window.innerWidth - 400, window.innerHeight - 200)
        ],

        exitDoor: {
            x: window.innerWidth - 100,
            y: window.innerHeight - 160,
            width: 40,
            height: 60
        }
    },



    // -------- ROOM 1 ----------
 {
    playerStart: { x: 60, y: window.innerHeight - 220 },

    platforms: [
        // Ground
        {
            x: 0,
            y: window.innerHeight - 100,
            width: window.innerWidth,
            height: 20
        },

        // Tier 1 – Left platform (easy first jump)
        {
            x: 200,
            y: window.innerHeight - 240,   // very reachable
            width: 320,
            height: 20
        },

        // Tier 2 – Middle platform (big and safe)
        {
            x: window.innerWidth / 2 - 120,
            y: window.innerHeight - 350,
            width: 350,
            height: 20
        },

        // Tier 3 – Right platform (approach to exit)
        {
            x: window.innerWidth - 420,
            y: window.innerHeight - 460,
            width: 350,
            height: 20
        },


        // High platform holding the exit
        {
            x: window.innerWidth - 200,
            y: window.innerHeight - 550,
            width: 300,
            height: 20
        }
    ],

    enemies: [
        // Enemy on Tier 1 (left)
        new Enemy(260, window.innerHeight - 300),

        // Enemy on Tier 2 (center)
        new Enemy(window.innerWidth / 2 - 100, window.innerHeight - 400),

        // Enemy on Tier 3 (right mid)
        new Enemy(window.innerWidth - 300, window.innerHeight - 500)
    ],

    exitDoor: {
        x: window.innerWidth - 100,
        y: window.innerHeight - 610,   
        width: 40,
        height: 60
    }
},


// -------- ROOM 2 (Christmas Tree Boss Arena) ----------
{
    playerStart: { x: window.innerWidth / 2 - 50, y: window.innerHeight - 200 },

    platforms: [
        // GROUND (Tier 0)
        {
            x: 0,
            y: window.innerHeight - 100,
            width: window.innerWidth,
            height: 20
        },

        // TIER 1 (Wide base branches)
        {
            x: window.innerWidth / 2 - 550,
            y: window.innerHeight - 260,
            width: 300,
            height: 20
        },
        {
            x: window.innerWidth / 2 - 100,
            y: window.innerHeight - 260,
            width: 200,
            height: 20
        },
        {
            x: window.innerWidth / 2 + 275,
            y: window.innerHeight - 260,
            width: 300,
            height: 20
        },

        // TIER 2 (Middle branches)
        {
            x: window.innerWidth / 2 - 400,
            y: window.innerHeight - 420,
            width: 270,
            height: 20
        },

        {
            x: window.innerWidth / 2 + 140,
            y: window.innerHeight - 420,
            width: 270,
            height: 20
        },

        // TIER 3 (Upper branches)
        {
            x: window.innerWidth / 2 - 200,
            y: window.innerHeight - 580,
            width: 400,
            height: 20
        },


        // TIER 4 (Mini branch under star)
        {
            x: window.innerWidth / 2 - 60,
            y: window.innerHeight - 740,
            width: 120,
            height: 20
        },

    ],
    
    boss: { 
        x: window.innerWidth / 2 - 80, 
        y: window.innerHeight - 280 
    },

    enemies: [
        // Tier 1 ornaments
        new Enemy(window.innerWidth / 2 - 350, window.innerHeight - 340),
        new Enemy(window.innerWidth / 2 + 260, window.innerHeight - 340),

        // Tier 2 ornaments
        new Enemy(window.innerWidth / 2 - 250, window.innerHeight - 520),
        new Enemy(window.innerWidth / 2 + 190, window.innerHeight - 520),

        // Tier 3 ornaments
        new Enemy(window.innerWidth / 2 - 170, window.innerHeight - 700),
        new Enemy(window.innerWidth / 2 + 130, window.innerHeight - 700),

        // Mini ornament under star
        new Enemy(window.innerWidth / 2 - 20, window.innerHeight - 860)
    ],

    exitDoor: {
        x: window.innerWidth / 2 - 35,
        y: window.innerHeight - 800,
        width: 40,
        height: 60
    }
}
];
