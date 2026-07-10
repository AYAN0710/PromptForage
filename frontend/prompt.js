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
        this.dir = Math.random() < 0.5 ? 1 : -1;
        this.x = this.dir === 1 ? -200 : w + 200;

        if (initial) {
            this.x = Math.random() * w;
        }

        this.y = Math.random() * h;

        this.length = Math.random() * 300 + 100;
        this.thickness = Math.random() * 2 + 0.5;
        this.speed = (Math.random() * 4 + 2) * this.dir;

        // Colors: green and cyan lasers for prompt module
        const hue = Math.random() > 0.5
            ? Math.random() * 50 + 150 // cyan to light blue (150-200)
            : Math.random() * 40 + 100; // green (100-140)
        this.color = `hsla(${hue}, 100%, 65%, ${Math.random() * 0.4 + 0.1})`;

        this.angle = (Math.random() - 0.5) * 0.15;
    }

    update() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);

        if ((this.dir === 1 && this.x > w + 300) || (this.dir === -1 && this.x < -300)) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        const endX = this.x + Math.cos(this.angle) * this.length * (this.dir === 1 ? -1 : 1);
        const endY = this.y + Math.sin(this.angle) * this.length * (this.dir === 1 ? -1 : 1);

        const gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.thickness;
        ctx.lineCap = "round";

        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;

        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

// 60 lasers for prompt module
for (let i = 0; i < 60; i++) {
    lasers.push(new Laser());
}

function animate() {
    ctx.fillStyle = "rgba(3, 0, 16, 0.3)";
    ctx.fillRect(0, 0, w, h);

    lasers.forEach(laser => {
        laser.update();
        laser.draw();
    });

    requestAnimationFrame(animate);
}

animate();

// Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.module-card, .prompt-workspace, .mini-hero').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    observer.observe(el);
});

// Prompt Generation Logic
const generateBtn = document.getElementById('generate-btn');
if (generateBtn) {
    generateBtn.addEventListener('click', async () => {
        const promptInput = document.getElementById('base-prompt').value;
        if (!promptInput.trim()) return;

        // Visual feedback
        generateBtn.textContent = 'Generating...';
        generateBtn.style.opacity = 0.7;
        
        // Show the container immediately so user sees loading state happening (optional)
        const responseContainer = document.getElementById('response-container');
        if (responseContainer.style.display === 'none') {
            document.getElementById('zero-request').textContent = 'Loading...';
            document.getElementById('zero-response').textContent = 'Loading...';
            document.getElementById('few-request').textContent = 'Loading...';
            document.getElementById('few-response').textContent = 'Loading...';
            document.getElementById('cot-request').textContent = 'Loading...';
            document.getElementById('cot-response').textContent = 'Loading...';
            responseContainer.style.display = 'flex';
        }

        try {
            const response = await fetch('http://localhost:8000/prompts/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: promptInput })
            });

            if (!response.ok) throw new Error('API request failed');

            const data = await response.json();
            
            // Map varied response structures gracefully
            document.getElementById('zero-request').textContent = data.zero_prompt || data.zero_shot_request || data.zero?.request || 'Response data missing.';
            document.getElementById('zero-response').textContent = data.zero_response || data.zero_shot_response || data.zero?.response || 'Response data missing.';
            
            document.getElementById('few-request').textContent = data.few_prompt || data.few_shot_request || data.few?.request || 'Response data missing.';
            document.getElementById('few-response').textContent = data.few_response || data.few_shot_response || data.few?.response || 'Response data missing.';
            
            document.getElementById('cot-request').textContent = data.cot_prompt || data.chain_of_thought_request || data.cot?.request || 'Response data missing.';
            document.getElementById('cot-response').textContent = data.cot_response || data.chain_of_thought_response || data.cot?.response || 'Response data missing.';

            // Reveal the response grid with data properly aligned
            document.getElementById('response-container').style.display = 'flex';

        } catch (error) {
            console.error('Error generating prompts:', error);
            alert('Error generating prompts. Please ensure the backend is running.');
        } finally {
            generateBtn.textContent = 'Generate';
            generateBtn.style.opacity = 1;
        }
    });
}

// Clear Logic
const clearBtn = document.getElementById('clear-btn');
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        document.getElementById('base-prompt').value = '';
        document.getElementById('response-container').style.display = 'none';
        
        document.getElementById('zero-request').textContent = '';
        document.getElementById('zero-response').textContent = '';
        document.getElementById('few-request').textContent = '';
        document.getElementById('few-response').textContent = '';
        document.getElementById('cot-request').textContent = '';
        document.getElementById('cot-response').textContent = '';
    });
}
