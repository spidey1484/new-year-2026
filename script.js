/* ================= CURSOR ================= */
const cursor = document.getElementById("cursor");
document.addEventListener("mousemove", e => {
  cursor.style.left = e.pageX + "px";
  cursor.style.top = e.pageY + "px";
});

/* ================= ELEMENTS ================= */
const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const content = document.getElementById("content");
const bgMusic = document.getElementById("bgMusic");
const boomSound = document.getElementById("boomSound");
const textEl = document.getElementById("text");

/* ================= PARAGRAPH ================= */
const paragraph = `
As a new year begins, may 2026 bring peace, success, and happiness into your life.
Let every challenge shape you stronger and every moment teach gratitude.
Dream bigger, smile louder, and move forward with courage and hope.
May this year reward your efforts and fill your days with warmth and positivity.
Welcome fresh beginnings and endless possibilities with confidence and belief.
`;

/* ================= LANTERNS ================= */
const lanternContainer = document.getElementById("lantern-container");
function createLantern() {
  const l = document.createElement("div");
  l.className = "lantern";
  l.style.left = Math.random() * 100 + "vw";
  l.style.animationDuration = 20 + Math.random() * 10 + "s";
  l.style.setProperty("--drift", (Math.random() - 0.5) * 160 + "px");
  lanternContainer.appendChild(l);
  setTimeout(() => l.remove(), 35000);
}

/* ================= SOUND LOOP ================= */
let fireLoop = null;

/* ================= START CLICK ================= */
startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  content.classList.remove("hidden");

  bgMusic.play();

  boomSound.currentTime = 0;
  boomSound.play();
  fireLoop = setInterval(() => {
    boomSound.currentTime = 0;
    boomSound.play();
  }, 10000);

  setInterval(createLantern, 1800);
  startFireworks();

  setTimeout(typeText, 2000);
});

/* ================= TYPING EFFECT ================= */
let i = 0;
function typeText() {
  if (i < paragraph.length) {
    textEl.innerHTML += paragraph.charAt(i);
    i++;
    setTimeout(typeText, 35);
  }
}

/* ================= FIREWORK TEXT 2026 ================= */
function fireworkText2026(ctx, canvas, callback) {
  const tempCanvas = document.createElement("canvas");
  const tctx = tempCanvas.getContext("2d");

  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  tctx.fillStyle = "white";
  tctx.font = "bold 180px Orbitron";
  tctx.textAlign = "center";
  tctx.fillText("2026", canvas.width / 2, canvas.height / 2);

  const data = tctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const points = [];

  for (let y = 0; y < canvas.height; y += 6) {
    for (let x = 0; x < canvas.width; x += 6) {
      const index = (y * canvas.width + x) * 4;
      if (data[index + 3] > 150) points.push({ x, y });
    }
  }

  let p = 0;
  const draw = setInterval(() => {
    if (p >= points.length) {
      clearInterval(draw);
      setTimeout(callback, 1500);
      return;
    }
    explode(points[p].x, points[p].y, `hsl(${Math.random()*360},100%,70%)`);
    p += 4;
  }, 20);
}

/* ================= FIREWORKS ================= */
function startFireworks() {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  let rockets = [];
  let particles = [];
  let textDone = false;

  class Rocket {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height;
      this.vy = -(Math.random() * 8 + 10);
      this.color = `hsl(${Math.random() * 360},100%,70%)`;
    }
    update() {
      this.y += this.vy;
      this.vy += 0.15;
      if (this.vy >= 0) {
        explode(this.x, this.y, this.color);
        return true;
      }
      return false;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, 2, 12);
    }
  }

  class Particle {
    constructor(x, y, color) {
      const a = Math.random() * Math.PI * 2;
      const s = Math.random() * 6 + 2;
      this.x = x;
      this.y = y;
      this.vx = Math.cos(a) * s;
      this.vy = Math.sin(a) * s;
      this.life = 100;
      this.color = color;
    }
    update() {
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.vy += 0.04;
      this.x += this.vx;
      this.y += this.vy;
      this.life--;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  window.explode = function(x, y, color) {
    for (let i = 0; i < 150; i++) {
      particles.push(new Particle(x, y, color));
    }
  };

  setTimeout(() => {
    if (!textDone) {
      fireworkText2026(ctx, canvas, () => {
        textDone = true;
        setInterval(() => rockets.push(new Rocket()), 1200);
      });
    }
  }, 800);

  (function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    rockets = rockets.filter(r => {
      r.draw();
      return !r.update();
    });

    particles = particles.filter(p => {
      p.update();
      p.draw();
      return p.life > 0;
    });

    requestAnimationFrame(animate);
  })();
}
