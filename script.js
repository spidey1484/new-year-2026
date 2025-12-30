const music = document.getElementById("music");
const blast = document.getElementById("blast");

let audioCtx, analyser, source, dataArray;

/* START */
function openSurprise() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("mainScreen").style.display = "block";

  music.volume = 0.5;
  music.play().catch(() => {
    document.body.addEventListener("click", () => music.play(), { once: true });
  });

  startFireworks();
  launchIntroFirework();
}

/* INTRO FIREWORK (ONE TIME) */
function launchIntroFirework() {
  setTimeout(() => {
    blast.currentTime = 0;
    blast.play();

    showTitle();
  }, 1200);
}

/* SHOW TITLE THEN PARAGRAPH */
function showTitle() {
  const title = document.getElementById("title");
  title.innerText = "Happy New Year 2026";

  setTimeout(startTyping, 1200);
}

/* TYPING PARAGRAPH (100 WORDS + SIGNATURE) */
const message = `Happy New Year 2026! As this beautiful year begins, may your life be filled with happiness, peace, confidence, and positive energy. Let every sunrise bring hope and every night bring calm satisfaction. May success, good health, and meaningful relationships stay with you throughout the year. Keep believing in yourself, stay consistent, and never stop moving forward. May 2026 gift you unforgettable moments, genuine smiles, and memories worth cherishing forever.`;

let i = 0;
function startTyping() {
  const box = document.getElementById("text");
  function type() {
    if (i < message.length) {
      box.innerHTML += message.charAt(i++);
      setTimeout(type, 35);
    }
  }
  type();
}

/* FIREWORKS (VISUAL ONLY AFTER INTRO) */
function startFireworks() {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  let particles = [];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = Math.cos(Math.random() * Math.PI * 2) * (Math.random() * 5 + 2);
      this.vy = Math.sin(Math.random() * Math.PI * 2) * (Math.random() * 5 + 2);
      this.life = 90;
      this.size = Math.random() * 2 + 1;
      this.color = `hsl(${Math.random() * 360},100%,60%)`;
    }
    update() {
      this.vy += 0.04;
      this.x += this.vx;
      this.y += this.vy;
      this.life--;
    }
    draw() {
      ctx.globalAlpha = this.life / 90;
      ctx.shadowBlur = 18;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function explode(x, y) {
    for (let i = 0; i < 240; i++) {
      particles.push(new Particle(x, y));
    }
  }

  setInterval(() => {
    explode(
      Math.random() * canvas.width,
      Math.random() * canvas.height / 2
    );
  }, 900);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.update();
      p.draw();
      if (p.life <= 0) particles.splice(i, 1);
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* CURSOR SPARKLES */
document.addEventListener("mousemove", e => {
  const s = document.createElement("div");
  s.className = "sparkle";
  s.style.left = e.pageX + "px";
  s.style.top = e.pageY + "px";
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 600);
});

/* FLOATING LANTERNS */
setInterval(() => {
  const l = document.createElement("div");
  l.className = "lantern";
  l.style.left = Math.random() * innerWidth + "px";
  l.style.animationDuration = 8 + Math.random() * 6 + "s";
  document.body.appendChild(l);
  setTimeout(() => l.remove(), 14000);
}, 700);
