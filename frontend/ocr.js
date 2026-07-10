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

        // Colors: magenta and pink lasers for OCR module
        const hue = Math.random() * 40 + 300; // magenta to pink (300-340)
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

// 60 lasers for OCR module
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

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

// Note: Reusing classes from prompt.css like .prompt-workspace
document.querySelectorAll('.prompt-workspace, .mini-hero, .footer-section').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    observer.observe(el);
});

// OCR API Extraction Logic
const extractBtn = document.getElementById('extract-btn');
if (extractBtn) {
    extractBtn.addEventListener('click', async () => {
        const fileInput = document.getElementById('image-upload');
        if (!fileInput.files || fileInput.files.length === 0) {
            alert('Please select an image file to upload first.');
            return;
        }

        // Visual feedback
        extractBtn.textContent = 'Extracting...';
        extractBtn.style.opacity = 0.7;

        // Show the container immediately so user sees loading state
        const responseContainer = document.getElementById('response-container');
        if (responseContainer.style.display === 'none') {
            document.getElementById('extracted-response').textContent = 'Analyzing image...';
            responseContainer.style.display = 'flex';
        }

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        try {
            const response = await fetch('http://localhost:8000/ocr/extract', {
                method: 'POST',
                body: formData // Fetch sets correct multpart headers automatically
            });

            if (!response.ok) throw new Error('API request failed');

            const data = await response.json();
            
            // Assuming response contains an "extracted_text" or similar key based on conventions
            // Adjust based on the actual backend response format, but a naive implementation often returns text or content
            let outputText = data;
            // if data is an object, stringify or get its main text property
            if (typeof data === 'object' && data !== null) {
                outputText = data.extracted_text || data.text || data.content || JSON.stringify(data, null, 2);
            }
            
            document.getElementById('extracted-response').textContent = outputText || 'No text extracted.';
            
            // Reveal the response grid with data properly aligned
            responseContainer.style.display = 'flex';

        } catch (error) {
            console.error('Error extracting text:', error);
            alert('Error processing image. Please ensure the backend is running.');
            document.getElementById('extracted-response').textContent = 'An error occurred during extraction.';
        } finally {
            extractBtn.textContent = 'Extract Text';
            extractBtn.style.opacity = 1;
        }
    });
}

// Clear Logic
const clearBtn = document.getElementById('clear-btn');
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        document.getElementById('image-upload').value = '';
        document.getElementById('response-container').style.display = 'none';
        document.getElementById('extracted-response').textContent = '';
    });
}
