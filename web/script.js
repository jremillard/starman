const canvas = document.getElementById('screensaverCanvas');
const ctx = canvas.getContext('2d');

// --- Fast Math Lookups (Ported from FAST_MAT.CPP) ---
// Removed sin_lookup, cos_lookup, Dfast_sin, Dfast_cos

// --- Helper function for BGI colors (approximate) ---
const BGI_COLORS = [
    'black', 'blue', 'green', 'cyan', 'red', 'magenta', 'brown', 'lightgray',
    'darkgray', 'lightblue', 'lightgreen', 'lightcyan', 'lightcoral', 'lightpink', // Approximations
    'yellow', 'white'
];

function setCanvasColor(colorIndex) {
    ctx.fillStyle = BGI_COLORS[colorIndex] || 'white';
    ctx.strokeStyle = BGI_COLORS[colorIndex] || 'white';
}

// --- Class Definitions ---

// --- Star Class (Ported from STARCL.H/CPP) ---
class Star {
    constructor() {
        this.reset();
        this.color = 'white'; // Default color
        this.resetTimer = 30 + Math.random() * 300;
        this.count = Math.random() * this.resetTimer; // Start at random point in cycle
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vel = 0;
        this.acc = 0;
        this.angle = 0;
        this.count = 0;
        this.color = 'white';
        this.resetTimer = 30 + Math.random() * 300;
    }

    fall() {
        this.count = 0;
        this.vel = -4; // Original was -4, adjust if needed
        this.acc = 0.1; // Original was 1, scaled down for smoother animation
        this.angle = 90;
        this.color = 'lightblue'; // Falling star color
    }

    race() {
        this.count = 0;
        this.angle = 1 + Math.random() * 359;
        this.vel = 5; // Speed of racing star
        this.acc = 0;
        this.color = 'red'; // Racing star color
    }

    update() {
        // Check for global commands first
        if (makeStarsFall) {
            this.fall();
        }
        if (makeStarsRace) {
            this.race();
        }

        this.count++;
        if (this.count > this.resetTimer) {
            this.reset();
            // Randomly trigger fall or race
            if (Math.random() < 1/300) { // Approx random(300) == 3
                this.fall();
            } else if (fireflyMode && Math.random() < 1/10) { // Firefly mode check
                 this.race();
            } else if (Math.random() < 1/700) { // Approx random(700) == 1
                 this.race();
            }
        }

        if (this.vel !== 0 || this.acc !== 0) {
            const angleRad = this.angle * Math.PI / 180; // Convert angle to radians
            this.x += Math.cos(angleRad) * this.vel;
            this.y += Math.sin(angleRad) * this.vel;
            this.vel += this.acc;
            // Original code added acc twice? Simulating that, adjust if looks wrong
            this.vel += this.acc;

            // Boundary checks (simplified)
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset(); // Reset if out of bounds
            }
        }
    }

    draw(ctx) {
        const x = Math.floor(this.x);
        const y = Math.floor(this.y);
        // Explicitly check if the coordinates are within the canvas bounds before drawing
        if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
            ctx.fillStyle = this.color;
            ctx.fillRect(x, y, 1, 1); // Draw a 1x1 pixel
        }
        // Otherwise, do nothing for this star this frame if it's outside
    }
}

// --- Space Ship Class (Ported from SPACESHP.H/CPP) ---
class SpaceShip {
    constructor() {
        this.x = -canvas.width; // Start off-screen left
        this.y = Math.random() * (canvas.height / 2);
        this.colorIndex = 15; // White
    }

    // Original put_image logic using Canvas API
    _drawImage() {
        setCanvasColor(this.colorIndex);
        ctx.beginPath();
        // line(xcor,ycor,xcor+12,ycor);
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + 12, this.y);
        // line(xcor+4,ycor-4,xcor+12,ycor);
        ctx.moveTo(this.x + 4, this.y - 4);
        ctx.lineTo(this.x + 12, this.y);
        // line(xcor-4,ycor+4,xcor+12,ycor);
        ctx.moveTo(this.x - 4, this.y + 4);
        ctx.lineTo(this.x + 12, this.y);
        // line(xcor,ycor+4,xcor+12,ycor);
        ctx.moveTo(this.x, this.y + 4);
        ctx.lineTo(this.x + 12, this.y);
        // line(xcor,ycor+2,xcor,ycor+4);
        ctx.moveTo(this.x, this.y + 2);
        ctx.lineTo(this.x, this.y + 4);
        // line(xcor+4,ycor-4,xcor-4,ycor+4);
        ctx.moveTo(this.x + 4, this.y - 4);
        ctx.lineTo(this.x - 4, this.y + 4);
        ctx.stroke();
    }

    // Original clear logic
    clear() {
        // In canvas, clearing is done globally, but we can simulate
        // by drawing black if needed, though usually not necessary
        // setCanvasColor(0);
        // this._drawImage();
        // setCanvasColor(15); // Reset to default drawing color
    }

    update() {
        // No need to explicitly clear in canvas per object
        // this.clear();

        this.x += 3; // Move right
        this.y += Math.random() * 4 - 1; // Slight vertical drift

        // Reset if moved far off-screen right
        if (this.x > canvas.width * 1.2) { // Adjusted reset condition
            this.x = -100;
            this.y = Math.random() * (canvas.height / 2);
        }
    }

    draw() {
        this._drawImage();
    }
}

// --- Moon Class (Ported from MOON.H/CPP) ---
class Moon {
    constructor() {
        this.angle = 0;
        this.y = 50 + Math.random() * 70;
        this.x = canvas.width * 2; // Start far right
        this.colorIndex = 15; // White
    }

    _drawImage() {
        if (this.x > canvas.width + 80 || this.x < -80 ||
            this.y > canvas.height + 80 || this.y < -80) {
            return; // Don't draw if way off-screen
        }

        setCanvasColor(this.colorIndex);

        // fillellipse(xcor,ycor,10,10);
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, 10, 10, 0, 0, 2 * Math.PI);
        ctx.fill();

        // ellipse(xcor,ycor,-45,45,15,3); // Ring segments
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, 15, 3, 0, -45 * Math.PI / 180, 45 * Math.PI / 180);
        ctx.stroke();
        // ellipse(xcor,ycor,135,225,15,3);
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, 15, 3, 0, 135 * Math.PI / 180, 225 * Math.PI / 180);
        ctx.stroke();

        // Satellite logic
        const angleRad = this.angle * Math.PI / 180; // Convert angle to radians
        const angle2Rad = (2 * this.angle) * Math.PI / 180; // Convert 2*angle to radians
        let r = 30 + 9 * Math.cos(angle2Rad);
        let satX = r * Math.cos(angleRad) + this.x;
        let satY = r * Math.sin(angleRad) + this.y + Math.cos(angleRad) * 20; // Original y offset logic

        // ellipse(satX, satY, 0, 360, 3, 4); -> circle(satX, satY, 3 or 4?) Assuming radius 3
        setCanvasColor(14); // Yellow for satellite?
        ctx.beginPath();
        ctx.arc(satX, satY, 3, 0, 2 * Math.PI);
        ctx.fill(); // Original used ellipse, fill seems appropriate
    }

    update() {
        this.angle += 1;
        this.x -= 1; // Move left

        if (this.x < -80) { // Reset if moved off-screen left
            this.angle = 0;
            this.x = canvas.width * 2 + Math.random() * canvas.width; // Reset further right
            this.y = 50 + Math.random() * 70;
        }
    }

    draw() {
        this._drawImage();
    }
}


// --- Man Class (Ported from MAN.H/CPP) ---
class Man {
    constructor() {
        this.angle = 0;
        this.y = Math.random() * (canvas.height / 2);
        this.x = canvas.width * 1.5 + Math.random() * canvas.width; // Start far right
        this.colorIndex = 15; // White
    }

     _drawImage() {
        if (this.x > canvas.width + 40 || this.x < -40 ||
            this.y > canvas.height + 40 || this.y < -40) {
            return; // Don't draw if way off-screen
        }

        setCanvasColor(this.colorIndex);
        const angleRad = this.angle * Math.PI / 180; // Convert angle to radians
        let xadj = Math.cos(angleRad);
        let yadj = Math.sin(angleRad);

        ctx.beginPath();
        // circle(xcor,ycor,5);
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.stroke(); // Draw head outline

        ctx.beginPath();
        // line(xcor+(xadj *4),ycor+(yadj * 3),xcor+(xadj * 25),ycor+(yadj * 19)); // Body
        ctx.moveTo(this.x + (xadj * 4), this.y + (yadj * 3));
        ctx.lineTo(this.x + (xadj * 25), this.y + (yadj * 19));
        // line(xcor+(xadj *10),ycor+(yadj * 6),xcor+(xadj * 16),ycor-(yadj * 5)); // top Arm
        ctx.moveTo(this.x + (xadj * 10), this.y + (yadj * 6));
        ctx.lineTo(this.x + (xadj * 16), this.y - (yadj * 5));
        // line(xcor-(xadj *3),ycor+(yadj * 13),xcor+(xadj * 10),ycor+(yadj * 6)); // bottom arm
        ctx.moveTo(this.x - (xadj * 3), this.y + (yadj * 13));
        ctx.lineTo(this.x + (xadj * 10), this.y + (yadj * 6));
        // line(xcor+(xadj * 25),ycor+(yadj * 19),xcor+(xadj * 34),ycor+(yadj * 13)); // top leg
        ctx.moveTo(this.x + (xadj * 25), this.y + (yadj * 19));
        ctx.lineTo(this.x + (xadj * 34), this.y + (yadj * 13));
        // line(xcor+(xadj * 25),ycor+(yadj * 19),xcor+(xadj * 25),ycor+(yadj * 29)); // bottem leg
        ctx.moveTo(this.x + (xadj * 25), this.y + (yadj * 19));
        ctx.lineTo(this.x + (xadj * 25), this.y + (yadj * 29));
        ctx.stroke();
    }

    update() {
        this.angle += 1;
        this.x -= 1 + Math.random() * 2; // Move left (variable speed)
        this.y += Math.random() * 3 - 1; // Slight vertical drift

        if (this.x < -50) { // Reset if moved off-screen left
            this.angle = 0;
            this.x = canvas.width * 1.5 + Math.random() * canvas.width; // Reset further right
            this.y = Math.random() * (canvas.height / 2);
        }
    }

    draw() {
        this._drawImage();
    }
}

// --- Wish Worm Class (Ported from WISHWORM.H/CPP) ---
class WishWorm {
    constructor() {
        this.colorIndex = this._getRandomColor();
        this.y = Math.random() * canvas.height;
        this.x = canvas.width * 1.2 + Math.random() * canvas.width; // Start off-screen right
        this.step = Math.floor(Math.random() * 30);
        this.turn = Math.random() * 360; // Initial direction
    }

    _getRandomColor() {
        let color;
        do {
            color = Math.floor(Math.random() * 15) + 1; // 1 to 15
        } while (color === 8); // Avoid dark gray
        return color;
    }

    _drawImage() {
         if (this.x > canvas.width + 40 || this.x < -40 ||
            this.y > canvas.height + 40 || this.y < -40) {
            // console.log("Worm _drawImage skipped (off-screen)"); // Add log
            return; // Don't draw if way off-screen
        }
        // console.log("Worm _drawImage executing"); // Add log

        setCanvasColor(this.colorIndex);

        let legAngleDeg;
        // Leg angle logic based on step
        if (this.step < 17) {
            const angles = [90, 58, 39, 27, 21, 17, 14, 13, 12, 11, 11, 11, 11, 11, 11, 11, 11, 11];
            legAngleDeg = angles[this.step] || 11;
        } else {
            legAngleDeg = 6 * (this.step - 15);
        }

        const turnRad = this.turn * Math.PI / 180; // Convert turn to radians
        const legAngleRad = legAngleDeg * Math.PI / 180; // Convert leg angle to radians
        const combinedAngleRad = (this.turn + legAngleDeg) * Math.PI / 180;
        const diffAngleRad = (this.turn - legAngleDeg) * Math.PI / 180;
        const antennaAngle1Rad = (20 + this.turn) * Math.PI / 180;
        const antennaAngle2Rad = (-20 + this.turn) * Math.PI / 180;


        let sin_angle = Math.sin(combinedAngleRad);
        let cos_angle = Math.cos(combinedAngleRad);
        let cos_turn = Math.cos(turnRad);
        let sin_turn = Math.sin(turnRad);

        ctx.beginPath();
        // circle(xcor,ycor,5);
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.stroke(); // Head

        ctx.beginPath();
        // line(xcor,ycor,xcor - 5 * Dfast_cos(20+turn),ycor - 5 * Dfast_sin(20+turn)); // Antenna 1
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - 5 * Math.cos(antennaAngle1Rad), this.y - 5 * Math.sin(antennaAngle1Rad));
        // line(xcor,ycor,xcor - 5 * Dfast_cos(-20+turn),ycor - 5 * Dfast_sin(-20+turn)); // Antenna 2
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - 5 * Math.cos(antennaAngle2Rad), this.y - 5 * Math.sin(antennaAngle2Rad));
        // line(xcor+5 * Dfast_cos(turn),ycor + 5 * Dfast_sin(turn),xcor+10*Dfast_cos(turn),ycor + 10*Dfast_sin(turn)); // Body segment
        ctx.moveTo(this.x + 5 * cos_turn, this.y + 5 * sin_turn);
        ctx.lineTo(this.x + 10 * cos_turn, this.y + 10 * sin_turn);

        let xleg = this.x + 10 * cos_turn;
        let yleg = this.y + 10 * sin_turn;
        // line(xleg,yleg,xleg + cos_angle * 12,yleg + sin_angle * 12); // Leg 1
        ctx.moveTo(xleg, yleg);
        ctx.lineTo(xleg + cos_angle * 12, yleg + sin_angle * 12);
        // line(xleg,yleg,xleg + Dfast_cos(turn - angle) * 12,yleg + Dfast_sin(turn - angle) * 12); // Leg 2
        ctx.moveTo(xleg, yleg);
        ctx.lineTo(xleg + Math.cos(diffAngleRad) * 12, yleg + Math.sin(diffAngleRad) * 12);
        ctx.stroke();
    }

    update() {
        const turnRad = this.turn * Math.PI / 180; // Convert turn to radians
        let cos_dir = Math.cos(turnRad);
        let sin_dir = Math.sin(turnRad);

        this.step++;
        if (this.step > 30) {
            this.step = 0;
        }

        // Store previous position for logging
        // const prevX = this.x, prevY = this.y;

        // Apply movement directly based on step, mirroring C++ logic
        switch (this.step) {
            // ... movement cases ...
            case 1: this.x -= 1 * cos_dir; this.y -= 1 * sin_dir; break;
            case 2: this.x -= 3 * cos_dir; this.y -= 3 * sin_dir; break;
            case 3: this.x -= 5 * cos_dir; this.y -= 5 * sin_dir; break;
            case 4: this.x -= 4 * cos_dir; this.y -= 4 * sin_dir; break;
            case 5: this.x -= 3 * cos_dir; this.y -= 3 * sin_dir; break;
            case 6: this.x -= 2 * cos_dir; this.y -= 2 * sin_dir; break;
            case 7: this.x -= 2 * cos_dir; this.y -= 2 * sin_dir; break;
            case 8:
            case 9:
            case 10:
            case 11:
            case 12: this.x -= 1 * cos_dir; this.y -= 1 * sin_dir; break;
            case 20: this.x += 1 * cos_dir; this.y += 1 * sin_dir; break;
            default: break;
        }

        //console.log(`Worm update: (${prevX.toFixed(1)},${prevY.toFixed(1)}) -> (${this.x.toFixed(1)},${this.y.toFixed(1)}), step=${this.step}, turn=${this.turn.toFixed(1)}`); // Add log

        // Boundary check and redirection
        const MARGIN = 40; // Increased margin slightly
        let needsRedirect = false;
 
        // Check based on actual direction components (cos_dir, sin_dir)
        // Use standard math angles (sin > 0 is up, sin < 0 is down)
        // Movement is generally x -= K*cos_dir, y -= K*sin_dir
        if (this.x < -MARGIN && cos_dir > 0) { needsRedirect = true; } // Off left edge AND moving left (cos_dir > 0 because movement is -= K*cos_dir)
        else if (this.x > canvas.width + MARGIN && cos_dir < 0) { needsRedirect = true; } // Off right edge AND moving right (cos_dir < 0 because movement is -= K*cos_dir)
        else if (this.y < -MARGIN && sin_dir > 0) { needsRedirect = true; } // Off top edge AND moving up (sin_dir > 0 because movement is -= K*sin_dir)
        else if (this.y > canvas.height + MARGIN && sin_dir < 0) { needsRedirect = true; } // Off bottom edge AND moving down (sin_dir < 0 because movement is -= K*sin_dir)

        if (needsRedirect) {
            // console.log("Worm redirecting!"); // Add log
            this.turn = Math.random() * 360;
            const newTurnRad = this.turn * Math.PI / 180;
            const cos_new_dir = Math.cos(newTurnRad);
            const sin_new_dir = Math.sin(newTurnRad);

            // Reset position far off-screen based on the *new* direction
            // Place it roughly 1.5 screen dimensions away along the new vector,
            // starting from the center, plus some randomness like the original.
            const resetDist = Math.max(canvas.width, canvas.height) * 1.5;
            const randomOffsetX = (Math.random() - 0.5) * canvas.width * 0.5; // Random offset
            const randomOffsetY = (Math.random() - 0.5) * canvas.height * 0.5; // Random offset

            this.x = canvas.width / 2 + cos_new_dir * resetDist + randomOffsetX;
            this.y = canvas.height / 2 + sin_new_dir * resetDist + randomOffsetY;

            this.colorIndex = this._getRandomColor();
            console.log(`Worm redirected to: x=${this.x.toFixed(1)}, y=${this.y.toFixed(1)}, newTurn=${this.turn.toFixed(1)}`); // Add log
        }
    }

    draw(ctx) {
        //console.log(`Worm draw attempt: x=${this.x.toFixed(1)}, y=${this.y.toFixed(1)}`); // Add log
        this._drawImage();
    }
}


// --- Tic Toc Clock Class (Ported from TIC_TOC.H/CPP) ---
class TicToc {
    constructor() {
        this.refresh = 0;
        this.xvel = (Math.random() > 0.5) ? 1 : -1; // Start moving horizontally
        this.yvel = (Math.random() > 0.5) ? 1 : -1; // Start moving vertically
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.xping = 0; // Animation state for x-bounce
        this.yping = 0; // Animation state for y-bounce
        this.xscale = 1.0;
        this.yscale = 1.0;
        this.radius = 15;
        this.colorIndex = 15; // White
        this._updateTime();
    }

    _updateTime() {
        const now = new Date();
        this.hour = now.getHours();
        this.min = now.getMinutes();
        this.sec = now.getSeconds();
    }

    _drawImage() {
        setCanvasColor(this.colorIndex);

        // ellipse(xcor,ycor,0,360,15*fabs(xscale),15 * fabs(yscale)); // Clock face
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(Math.abs(this.xscale), Math.abs(this.yscale));
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();

        // Hour hand
        let hourAngleDeg = (((this.hour % 12) + this.min / 60) / 12) * 360 - 90;
        let hourAngleRad = hourAngleDeg * Math.PI / 180; // Convert to radians
        let hourLen = 8;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + Math.cos(hourAngleRad) * hourLen * this.xscale,
                   this.y + Math.sin(hourAngleRad) * hourLen * this.yscale);
        ctx.stroke();

        // Minute hand
        let minAngleDeg = (this.min / 60) * 360 - 90;
        let minAngleRad = minAngleDeg * Math.PI / 180; // Convert to radians
        let minLen = 11;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + Math.cos(minAngleRad) * minLen * this.xscale,
                   this.y + Math.sin(minAngleRad) * minLen * this.yscale);
        ctx.stroke();

        // Second hand (tick mark at the end)
        let secAngleDeg = (this.sec / 60) * 360 - 90;
        let secAngleRad = secAngleDeg * Math.PI / 180; // Convert to radians
        let secLenStart = 11;
        let secLenEnd = 15;
        ctx.beginPath();
        ctx.moveTo(this.x + Math.cos(secAngleRad) * secLenStart * this.xscale,
                   this.y + Math.sin(secAngleRad) * secLenStart * this.yscale);
        ctx.lineTo(this.x + Math.cos(secAngleRad) * secLenEnd * this.xscale,
                   this.y + Math.sin(secAngleRad) * secLenEnd * this.yscale);
        ctx.stroke();
    }

    update() {
        // Bounce animation logic
        if (this.xping > 0) {
            this.xping++;
            // Original used 199.0 / sqrt(sqrt(xping)), approximating effect
            // Using standard Math.cos for squish effect
            this.yscale = Math.cos((this.xping / 20) * (Math.PI / 2));
            if (this.xping > 20) { // Shorter animation
                this.yscale = 1.0;
                this.xping = 0;
            }
        }
         if (this.yping > 0) {
            this.yping++;
            // Using standard Math.cos for squish effect
            this.xscale = Math.cos((this.yping / 20) * (Math.PI / 2));
            if (this.yping > 20) {
                this.xscale = 1.0;
                this.yping = 0;
            }
        }

        this.refresh++;
        this.x += this.xvel;
        this.y += this.yvel;

        // Boundary collision detection and bounce
        const effectiveRadiusX = this.radius * Math.abs(this.xscale);
        const effectiveRadiusY = this.radius * Math.abs(this.yscale);

        if (this.x + effectiveRadiusX > canvas.width) {
            this.x = canvas.width - effectiveRadiusX; // Prevent sticking
            this.xvel = -1;
            this.yping = 1; // Start y-squish (original logic)
        }
        if (this.x - effectiveRadiusX < 0) {
             this.x = effectiveRadiusX; // Prevent sticking
            this.xvel = 1;
            this.yping = 1; // Start y-squish (original logic)
        }
        if (this.y - effectiveRadiusY < 0) {
            this.y = effectiveRadiusY; // Prevent sticking
            this.yvel = 1;
            this.xping = 1; // Start x-squish (original logic)
        }
        if (this.y + effectiveRadiusY > canvas.height) {
            this.y = canvas.height - effectiveRadiusY; // Prevent sticking
            this.yvel = -1;
            this.xping = 1; // Start x-squish (original logic)
        }

        // Update time periodically (original checked every 20 frames)
        if (this.refresh > 20) {
            this.refresh = 0;
            this._updateTime();
        }
    }

    draw() {
        this._drawImage();
    }
}

// --- Global Variables ---
let stars = [];
const NUM_STARS = 150;
let spaceShip;
let moon;
let man;
let wishWorms = [];
const NUM_WORMS = 3;
let ticToc;

// Keyboard mode flags
let fireflyMode = false;
let makeStarsFall = false;
let makeStarsRace = false;
let showClock = true;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Reinitialize stars on resize if needed, or adjust positions
    // For simplicity, let's reinitialize here
    setup();
}

// Initial resize
resizeCanvas();

// Resize canvas when window size changes
window.addEventListener('resize', resizeCanvas);

// --- Animation Loop ---
function setup() {
    stars = [];
    for (let i = 0; i < NUM_STARS; i++) {
        stars.push(new Star());
    }
    spaceShip = new SpaceShip();
    moon = new Moon();
    man = new Man();
    wishWorms = [];
    for (let i = 0; i < NUM_WORMS; i++) {
        wishWorms.push(new WishWorm());
    }
    ticToc = new TicToc();
}

function draw() {
    // Clear the canvas (black background)
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw stars
    stars.forEach(star => {
        star.update();
        star.draw(ctx);
    });

    // Reset global flags after processing stars
    makeStarsFall = false;
    makeStarsRace = false;

    // Update and draw other objects
    moon.update();
    moon.draw();

    spaceShip.update();
    spaceShip.draw();

    man.update();
    man.draw();

    wishWorms.forEach(worm => {
        worm.update();
        worm.draw(ctx);
    });

    // Only update and draw clock if flag is true
    if (showClock) {
        // Ensure ticToc exists (it might have been toggled off)
        if (!ticToc) ticToc = new TicToc();
        ticToc.update();
        ticToc.draw();
    } else {
        // If clock is toggled off, ensure it's nullified
        // (Clearing is handled by the main canvas clear)
        ticToc = null;
    }

    // Request the next frame
    requestAnimationFrame(draw);
}

// --- Keyboard Event Listener ---
document.addEventListener('keydown', (event) => {
    const key = event.key.toUpperCase(); // Normalize to uppercase

    if (key === 'F') {
        fireflyMode = !fireflyMode;
        console.log("Firefly Mode:", fireflyMode);
    }
    if (event.code === 'Space' || key === ' ') { // Check space bar
        makeStarsFall = true;
        console.log("Make Stars Fall");
    }
    if (key === 'R') {
        makeStarsRace = true;
        console.log("Make Stars Race");
    }
    // Add missing closing brace for the event listener callback
    if (key === 'C') {
        showClock = !showClock;
        console.log("Show Clock:", showClock);
    }
});

setup();
draw(); // Start the animation loop

console.log("Starman screensaver script loaded. Animation started.");
console.log("Controls: [F] Firefly, [Space] Fall, [R] Race, [C] Clock");
