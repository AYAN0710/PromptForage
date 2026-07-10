const canvas = document.getElementById("laser-bg");
const ctx = canvas.getContext("2d");

let w, h;
let lasers = [];

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

class Laser {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        // Randomly start from left or right edge
        this.dir = Math.random() < 0.5 ? 1 : -1;
        this.x = this.dir === 1 ? -200 : w + 200;

        // If initial, let some lasers start in the middle of screen for immediate visual effect
        if (initial) {
            this.x = Math.random() * w;
        }

        this.y = Math.random() * h;

        // Random length, thickness and speed
        this.length = Math.random() * 300 + 100;
        this.thickness = Math.random() * 2 + 0.5;
        this.speed = (Math.random() * 4 + 2) * this.dir;

        // Colors: mix of blue/cyan/purple and vibrant violet/pink
        const hue = Math.random() > 0.5
            ? Math.random() * 60 + 200 // cyan to blue (200-260)
            : Math.random() * 60 + 280; // violet to pink (280-340)
        this.color = `hsla(${hue}, 100%, 65%, ${Math.random() * 0.4 + 0.1})`;

        // Slightly skewed horizontally
        this.angle = (Math.random() - 0.5) * 0.15;
    }

    update() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);

        // Reset when out of bounds
        if ((this.dir === 1 && this.x > w + 300) || (this.dir === -1 && this.x < -300)) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        const endX = this.x + Math.cos(this.angle) * this.length * (this.dir === 1 ? -1 : 1);
        const endY = this.y + Math.sin(this.angle) * this.length * (this.dir === 1 ? -1 : 1);

        // Draw gradient line to simulate laser trail
        const gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.thickness;
        ctx.lineCap = "round";

        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;

        ctx.stroke();
        ctx.shadowBlur = 0; // reset
    }
}

// Initialize lasers
for (let i = 0; i < 35; i++) {
    lasers.push(new Laser());
}

function animate() {
    // Fill with semi-transparent dark background for trail effect
    ctx.fillStyle = "rgba(3, 0, 16, 0.3)";
    ctx.fillRect(0, 0, w, h);

    lasers.forEach(laser => {
        laser.update();
        laser.draw();
    });

    requestAnimationFrame(animate);
}

// Start animation
animate();

// Intersection Observer for scroll animations (optional enhancement)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.module-card').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    observer.observe(el);
});
