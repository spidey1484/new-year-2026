// ================== BASIC SETUP ==================
const startBtn = document.getElementById("startBtn");
const typingText = document.getElementById("typingText");
const music = document.getElementById("bgMusic");
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ================== FIREWORK SOUND ==================
const fireSound = new Audio("firecracker.mp3");
fireSound.volume = 0.6;

// ================== MUSIC LOOP (10s) ==================
music.loop = true;

// ================== LANTERNS ==================
function createLantern() {
  const lantern = document.createElement("div");
  lantern.className = "lantern";
  lantern.style.left = Math.random() * 100 + "vw";
  lantern.style.animationDuration = 10 + Math.random() * 5 + "s";
  document.body.appendChild(lantern);

  setTimeout(() => lantern.remove(), 15000);
}

// ================== FIREWORK CLASSES ==================
class Rocket {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.vy = Math.random() * -5 - 8;
    this.exploded = false;
    this.particles = [];
  }

  update() {
    if (!this.exploded) {
      this.y += this.vy;
      if (this.y < canvas.height / 2) {
        this.explode();
      }
    } else {
      this.particles.forEach(p => p.update());
    }
  }

  explode() {
    this.exploded = true;
    fireSound.currentTime = 0;
    fireSound.play();

    for (let i = 0; i < 60; i++) {
      this.particles.push(new Particle(this.x, this.y));
    }
  }

  draw() {
    if (!this.exploded) {
      ctx.fillStyle = "white";
      ctx.fillRect(this.x, this.y, 3, 6);
    } else {
      this.particles.forEach(p => p.draw());
    }
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 6;
    this.vy = (Math.random() - 0.5) * 6;
    this.alpha = 1;
    this.color = `hsl(${Math.random() * 360},100%,60%)`;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.02;
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// ================== FIREWORK LOOP ==================
let rockets = [];

function animateFireworks() {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  rockets.forEach((r, i) => {
    r.update();
    r.draw();
    if (r.exploded && r.particles.every(p => p.alpha <= 0)) {
      rockets.splice(i, 1);
    }
  });

  requestAnimationFrame(animateFireworks);
}

// ================== TYPING TEXT ==================
const paragraph = `Happy New Year 2026 🎉  
May this year bring light, peace, success, and unforgettable moments into your life. 
Let every sunrise remind you of new opportunities and every night close with gratitude.
Dream bigger, smile wider, and never stop believing in yourself.
Cheers to growth, happiness, and new beginnings.;

let index = 0;
function typeText() {
  if (index < paragraph.length) {
    typingText.innerHTML += paragraph.charAt(index);
    index++;
    setTimeout(typeText, 35);
  }
}

// ================== START BUTTON ==================
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";

  // Play music
  music.play();

  // Start lanterns immediately
  for (let i = 0; i < 5; i++) createLantern();
  setInterval(createLantern, 1800);

  // Start fireworks immediately
  setInterval(() => {
    rockets.push(new Rocket());
  }, 1200);

  animateFireworks();
  typeText();
});
