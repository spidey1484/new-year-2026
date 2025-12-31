const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
const btn = document.getElementById("startBtn");
const typingText = document.getElementById("typingText");
const music = document.getElementById("bgMusic");
const firstPage = document.querySelector(".first-page");

canvas.width = innerWidth;
canvas.height = innerHeight;

/* ===== FIRE SOUND ===== */
const boom = new Audio("firecracker.mp3");
boom.volume = 0.6;

/* ===== REALISTIC FIREWORK ===== */
class Firework {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.vy = -8;
    this.exploded = false;
    this.particles = [];
  }

  update() {
    if (!this.exploded) {
      this.y += this.vy;
      if (this.y < canvas.height * 0.45) this.explode();
    } else {
      this.particles.forEach(p => p.update());
    }
  }

  explode() {
    this.exploded = true;
    boom.currentTime = 0;
    boom.play();
    for (let i = 0; i < 55; i++) {
      this.particles.push(new Particle(this.x, this.y));
    }
  }

  draw() {
    if (!this.exploded) {
      ctx.fillStyle = "#fff";
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
    this.color = `hsl(${Math.random()*360},100%,60%)`;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.025;
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

let fireworks = [];

function animateFireworks() {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach((f, i) => {
    f.update();
    f.draw();
    if (f.exploded && f.particles.every(p => p.alpha <= 0)) {
      fireworks.splice(i, 1);
    }
  });

  requestAnimationFrame(animateFireworks);
}

/* ===== LANTERNS ===== */
function createLantern() {
  const l = document.createElement("div");
  l.className = "lantern";
  l.style.left = Math.random() * 100 + "vw";
  l.style.animationDuration = 10 + Math.random() * 6 + "s";
  document.body.appendChild(l);
  setTimeout(() => l.remove(), 16000);
}

/* ===== TYPING ===== */
const paragraph = `May the coming year bring peace, strength, and clarity into your life.
May every challenge shape you wiser and every success humble you.
Keep believing, keep moving, and never stop dreaming.
New beginnings always start with hope.

— Shubham`;

let i = 0;
function typeText() {
  if (i < paragraph.length) {
    typingText.innerHTML += paragraph.charAt(i++);
    setTimeout(typeText, 35);
  }
}

/* ===== START BUTTON ===== */
btn.onclick = () => {
  firstPage.style.display = "none";

  music.loop = true;
  music.play();

  animateFireworks();
  setInterval(() => fireworks.push(new Firework()), 1200);
  setInterval(createLantern, 1800);

  typeText();
};
