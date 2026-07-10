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

        // Colors: yellow and orange lasers for text cleaner module
        const hue = Math.random() * 40 + 20; // orange (20) to yellow (60)
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

// 60 lasers for text cleaning module
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

// Note: Reusing classes from prompt.css like .prompt-workspace
document.querySelectorAll('.prompt-workspace, .mini-hero').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    observer.observe(el);
});

// Text Cleaning Generation Logic
const cleanBtn = document.getElementById('clean-btn');
if (cleanBtn) {
    cleanBtn.addEventListener('click', async () => {
        const rawInput = document.getElementById('raw-text').value;
        if (!rawInput.trim()) return;

        // Visual feedback
        cleanBtn.textContent = 'Cleaning...';
        cleanBtn.style.opacity = 0.7;
        
        document.getElementById('response-title').textContent = 'Cleaned Text';

        // Show the container immediately so user sees loading state happening
        const responseContainer = document.getElementById('response-container');
        if (responseContainer.style.display === 'none') {
            document.getElementById('unified-response').textContent = 'Loading...';
            responseContainer.style.display = 'flex';
        } else {
            document.getElementById('unified-response').textContent = 'Loading...';
        }

        try {
            const response = await fetch('http://localhost:8000/text/clean', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: rawInput })
            });

            if (!response.ok) throw new Error('API request failed');

            const data = await response.json();
            
            // Map varied response structures gracefully
            document.getElementById('unified-response').textContent = data.cleaned || data.cleaned_text || data.text || data.response || 'Cleaned text data missing.';

            // Reveal the response grid with data properly aligned
            responseContainer.style.display = 'flex';

        } catch (error) {
            console.error('Error cleaning text:', error);
            alert('Error processing text. Please ensure the backend is running.');
        } finally {
            cleanBtn.textContent = 'Clean Text';
            cleanBtn.style.opacity = 1;
        }
    });
}

// Keywords Generation Logic
const keywordsBtn = document.getElementById('keywords-btn');
if (keywordsBtn) {
    keywordsBtn.addEventListener('click', async () => {
        const rawInput = document.getElementById('raw-text').value;
        if (!rawInput.trim()) return;

        keywordsBtn.textContent = 'Extracting...';
        keywordsBtn.style.opacity = 0.7;
        
        document.getElementById('response-title').textContent = 'Keywords';

        const responseContainer = document.getElementById('response-container');
        if (responseContainer.style.display === 'none') {
            document.getElementById('unified-response').textContent = 'Loading...';
            responseContainer.style.display = 'flex';
        } else {
            document.getElementById('unified-response').textContent = 'Loading...';
        }

        try {
            const response = await fetch('http://localhost:8000/text/keywords', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: rawInput })
            });

            if (!response.ok) throw new Error('API request failed');

            const data = await response.json();
            
            let outputText = 'Keywords data missing.';
            if (data.keywords && Array.isArray(data.keywords)) {
                outputText = data.keywords.join(', ') || 'No keywords found in text.';
            } else if (data.response || data.text) {
                outputText = data.response || data.text;
            }
            
            document.getElementById('unified-response').textContent = outputText;
            
            responseContainer.style.display = 'flex';

        } catch (error) {
            console.error('Error extracting keywords:', error);
            alert('Error processing text. Please ensure the backend is running.');
        } finally {
            keywordsBtn.textContent = 'Keywords';
            keywordsBtn.style.opacity = 1;
        }
    });
}

// Entities Generation Logic
const entitiesBtn = document.getElementById('entities-btn');
if (entitiesBtn) {
    entitiesBtn.addEventListener('click', async () => {
        const rawInput = document.getElementById('raw-text').value;
        if (!rawInput.trim()) return;

        entitiesBtn.textContent = 'Extracting...';
        entitiesBtn.style.opacity = 0.7;
        
        document.getElementById('response-title').textContent = 'Entities';

        const responseContainer = document.getElementById('response-container');
        if (responseContainer.style.display === 'none') {
            document.getElementById('unified-response').textContent = 'Loading...';
            responseContainer.style.display = 'flex';
        } else {
            document.getElementById('unified-response').textContent = 'Loading...';
        }

        try {
            const response = await fetch('http://localhost:8000/text/entities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: rawInput })
            });

            if (!response.ok) throw new Error('API request failed');

            const data = await response.json();
            
            let outputText = 'Entities data missing.';
            if (data.entities && Array.isArray(data.entities)) {
                if (data.entities.length > 0) {
                    outputText = data.entities.map(e => `${e.text} (${e.label})`).join(', ');
                } else {
                    outputText = 'No entities found in text.';
                }
            } else if (data.response || data.text) {
                outputText = data.response || data.text;
            }
            
            document.getElementById('unified-response').textContent = outputText;
            
            responseContainer.style.display = 'flex';

        } catch (error) {
            console.error('Error extracting entities:', error);
            alert('Error processing text. Please ensure the backend is running.');
        } finally {
            entitiesBtn.textContent = 'Entities';
            entitiesBtn.style.opacity = 1;
        }
    });
}

// Clear Logic
const clearBtn = document.getElementById('clear-btn');
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        document.getElementById('raw-text').value = '';
        document.getElementById('response-container').style.display = 'none';
        document.getElementById('unified-response').textContent = '';
        document.getElementById('response-title').textContent = 'Response';
    });
}
