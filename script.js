/* Cursor */
const cursor = document.getElementById("cursor");
document.addEventListener("mousemove", e => {
  cursor.style.left = e.pageX + "px";
  cursor.style.top = e.pageY + "px";
});

/* Elements */
const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const content = document.getElementById("content");
const bgMusic = document.getElementById("bgMusic");
const boomSound = document.getElementById("boomSound");
const textEl = document.getElementById("text");

/* Paragraph (100 words, writer name at end) */
const paragraph = `
As the clock turns and a new chapter begins, may 2026 bring peace, growth, and unforgettable moments into your life.
Let this year be filled with courage to chase dreams, strength to face challenges, and wisdom to appreciate small joys.
Every sunrise is a fresh opportunity, every step a chance to become better than yesterday.
May laughter stay longer, worries fade faster, and hope shine brighter in every heart.
Welcome new beginnings with confidence and gratitude, because the best stories are yet to be written.
`;

/* Start Button */
startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  content.classList.remove("hidden");

  bgMusic.play();
  startFireworks(true);

  setTimeout(typeText, 1500);
});

/* Typing Effect */
let i = 0;
function typeText() {
  if (i < paragraph.length) {
    textEl.innerHTML += paragraph.charAt(i);
    i++;
    setTimeout(typeText, 35);
  }
}

/* Fireworks */
function startFireworks(playSoundOnce) {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  let rockets = [];
  let particles = [];
  let soundPlayed = false;

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
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.x = x;
      this.y = y;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
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

  function explode(x, y, color) {
    if (!soundPlayed && playSoundOnce) {
      boomSound.play();
      soundPlayed = true;
    }
    for (let i = 0; i < 150; i++) {
      particles.push(new Particle(x, y, color));
    }
  }

  setInterval(() => rockets.push(new Rocket()), 1200);

  function animate() {
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
  }
  animate();
}
const lanternContainer = document.getElementById("lantern-container");

function createLantern() {
  const lantern = document.createElement("div");
  lantern.className = "lantern";

  lantern.style.left = Math.random() * 100 + "vw";
  lantern.style.animationDuration = 18 + Math.random() * 12 + "s";
  lantern.style.setProperty("--drift", `${(Math.random() - 0.5) * 120}px`);

  lanternContainer.appendChild(lantern);

  setTimeout(() => {
    lantern.remove();
  }, 30000);
}

/* Start lanterns AFTER button click */
startBtn.addEventListener("click", () => {
  setInterval(createLantern, 2000);
});
