const btn = document.getElementById('btn');
const backBtn = document.getElementById('back-btn');
const slide1 = document.getElementById('slide-1');
const slide2 = document.getElementById('slide-2');
const confettiCanvas = document.getElementById('confetti-canvas');
const ctx = confettiCanvas.getContext('2d');

let confettiParticles = [];
let animationId = null;
let isAnimating = false;

// Fungsi untuk update ukuran canvas
function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

// Event listener untuk resize
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

btn.addEventListener('click', () => {
    slide1.style.display = 'none';
    slide2.style.display = 'flex';
    
    // Reset particles dan buat burst dari pusat
    confettiParticles = [];
    const centerX = confettiCanvas.width / 2;
    const centerY = confettiCanvas.height / 2;
    
    for (let i = 0; i < 150; i++) { // Lebih banyak partikel untuk efek 🎉
        const angle = (Math.PI * 2 * i) / 150; // Distribusi radial
        const speed = Math.random() * 8 + 2; // Kecepatan burst
        
        confettiParticles.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed, // Gerak radial horizontal
            vy: Math.sin(angle) * speed, // Gerak radial vertikal
            gravity: 0.15, // Gravitasi lebih kuat untuk jatuh cepat
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.2, // Rotasi acak
            radius: Math.random() * 6 + 3, // Ukuran confetti
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        });
    }
    
    isAnimating = true;
    if (!animationId) {
        animateConfetti();
    }
});

backBtn.addEventListener('click', () => {
    slide2.style.display = 'none';
    slide1.style.display = 'flex';
    confettiParticles = [];
    isAnimating = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
});

function animateConfetti() {
    if (!isAnimating) return;
    
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    for (let i = 0; i < confettiParticles.length; i++) {
        const particle = confettiParticles[i];
        
        // Update rotasi
        particle.rotation += particle.rotationSpeed;
        
        // Update posisi dengan gravitasi
        particle.vy += particle.gravity;
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Gambar partikel dengan rotasi (seperti confetti persegi, tapi pakai circle untuk sederhana)
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.beginPath();
        ctx.arc(0, 0, particle.radius, 0, 2 * Math.PI);
        ctx.fillStyle = particle.color;
        ctx.fill();
        ctx.restore();
        
        // Reset jika keluar layar (jatuh ke bawah atau samping)
        if (particle.y > confettiCanvas.height + particle.radius) {
            particle.y = -particle.radius;
            particle.x = Math.random() * confettiCanvas.width;
            particle.vx = (Math.random() - 0.5) * 4; // Sway baru
            particle.vy = Math.random() * 3;
            particle.rotation = 0;
        }
        if (particle.x < -particle.radius || particle.x > confettiCanvas.width + particle.radius) {
            particle.x = Math.random() * confettiCanvas.width;
        }
    }
    
    animationId = requestAnimationFrame(animateConfetti);
}