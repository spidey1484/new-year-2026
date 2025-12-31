const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
const btn = document.getElementById("startBtn");
const text = document.getElementById("typingText");
const music = document.getElementById("bgMusic");

canvas.width = innerWidth;
canvas.height = innerHeight;

// MOBILE BOOST
const FIREWORK_RATE = innerWidth < 768 ? 1500 : 900;
const PARTICLES = innerWidth < 768 ? 25 : 50;

// FIRE SOUND
const boom = new Audio("firecracker.mp3");
boom.volume = 0.6;

class Firework {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.vy = -7;
    this.exploded = false;
    this.p = [];
  }

  update() {
    if (!this.exploded) {
      this.y += this.vy;
      if (this.y < canvas.height / 2) this.explode();
    } else {
      this.p.forEach(pt => pt.update());
    }
  }

  explode() {
    this.exploded = true;
    boom.currentTime = 0;
    boom.play();
    for (let i = 0; i < PARTICLES; i++) {
      this.p.push(new Particle(this.x, this.y));
    }
  }

  draw() {
    if (!this.exploded) {
      ctx.fillStyle = "white";
      ctx.fillRect(this.x, this.y, 3, 6);
    } else {
      this.p.forEach(pt => pt.draw());
    }
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 5;
    this.vy = (Math.random() - 0.5) * 5;
    this.a = 1;
    this.c = `hsl(${Math.random()*360},100%,60%)`;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.a -= 0.03;
  }
  draw() {
    ctx.globalAlpha = this.a;
    ctx.fillStyle = this.c;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

let fireworks = [];

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  fireworks.forEach(f => { f.update(); f.draw(); });
  requestAnimationFrame(animate);
}

// LANTERNS
function lantern() {
  const l = document.createElement("div");
  l.className = "lantern";
  l.style.left = Math.random()*100 + "vw";
  l.style.animationDuration = 10 + Math.random()*5 + "s";
  document.body.appendChild(l);
  setTimeout(()=>l.remove(),15000);
}

// TEXT
const para = `Happy New Year 2026 🎉
May this year bring peace, growth, courage, and beautiful moments.
Leave behind doubts and walk forward with confidence and hope.
Let every day teach you something new and every night bring gratitude.
`;

let i = 0;
function type() {
  if (i < para.length) {
    text.innerHTML += para.charAt(i++);
    setTimeout(type, 35);
  }
}

// START
btn.onclick = () => {
  btn.style.display = "none";
  music.loop = true;
  music.play();

  animate();
  setInterval(() => fireworks.push(new Firework()), FIREWORK_RATE);
  setInterval(lantern, 1800);
  type();
};
