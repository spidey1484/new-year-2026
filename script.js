const music = document.getElementById("music");
const blast = document.getElementById("blast");

let audioCtx, analyser, source, dataArray, beatPower = 0;

function openSurprise() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("mainScreen").style.display = "block";

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;

  source = audioCtx.createMediaElementSource(music);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  dataArray = new Uint8Array(analyser.frequencyBinCount);

  music.volume = 0.5;
  music.play();

  startTyping();
  startFireworks();
  setTimeout(popupBurst, 900);
}

/* TYPING */
const message = `Happy New Year 2026! As this new year begins, may your life be filled with happiness, peace, confidence, and positive energy. Let every sunrise bring new hope and every night bring calm satisfaction. May success, good health, and meaningful relationships stay with you throughout the year. Let challenges shape your strength and victories remind you of your potential. Keep believing in yourself, stay consistent, and never stop moving forward. May 2026 gift you unforgettable moments, genuine smiles, and memories worth cherishing forever.

— Shubham`;

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

/* CURSOR SPARKLES */
document.addEventListener("mousemove", e => {
  const s = document.createElement("div");
  s.className = "sparkle";
  s.style.left = e.pageX + "px";
  s.style.top = e.pageY + "px";
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 600);
});

/* POPUP BURST */
function popupBurst() {
  const rect = document.querySelector(".popup").getBoundingClientRect();
  for (let i = 0; i < 60; i++) {
    const p = document.createElement("div");
    p.className = "sparkle";
    p.style.left = rect.left + rect.width / 2 + "px";
    p.style.top = rect.top + rect.height / 2 + "px";
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 700);
  }
}

/* BEAT DETECTION */
function detectBeat() {
  analyser.getByteFrequencyData(dataArray);
  let bass = 0;
  for (let i = 0; i < 10; i++) bass += dataArray[i];
  beatPower = bass / 10;
}

/* FIREWORKS */
function startFireworks() {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  let particles = [];
  let fired2026 = false;

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = Math.cos(Math.random() * Math.PI * 2) * (Math.random() * 6 + 2);
      this.vy = Math.sin(Math.random() * Math.PI * 2) * (Math.random() * 6 + 2);
      this.life = 100;
      this.size = Math.random() * 2 + 1;
      this.color = `hsl(${Math.random() * 360},100%,60%)`;
    }
    update() {
      this.vy += 0.05;
      this.x += this.vx;
      this.y += this.vy;
      this.life--;
    }
    draw() {
      ctx.globalAlpha = this.life / 100;
      ctx.shadowBlur = 20;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function screenShake() {
    document.body.style.transform = "translate(3px,-3px)";
    setTimeout(() => {
      document.body.style.transform = "translate(-3px,3px)";
      setTimeout(() => document.body.style.transform = "translate(0,0)", 50);
    }, 50);
  }

  function explode(x, y) {
    blast.currentTime = 0;
    blast.play();
    screenShake();
    let strength = beatPower > 160 ? 420 : 280;
    for (let i = 0; i < strength; i++) {
      particles.push(new Particle(x, y));
    }
  }

  function fire2026() {
    if (fired2026) return;
    fired2026 = true;
    ctx.font = "120px Arial";
    ctx.fillText("2026", canvas.width / 2 - 160, canvas.height / 2);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let y = 0; y < canvas.height; y += 6) {
      for (let x = 0; x < canvas.width; x += 6) {
        if (data[(y * canvas.width + x) * 4 + 3] > 150) {
          particles.push(new Particle(x, y));
        }
      }
    }
  }

  setTimeout(fire2026, 1500);

  setInterval(() => {
    detectBeat();
    if (beatPower > 140) {
      explode(Math.random() * canvas.width, Math.random() * canvas.height / 2);
    }
  }, 120);

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

/* LANTERNS */
setInterval(() => {
  const l = document.createElement("div");
  l.className = "lantern";
  l.style.left = Math.random() * innerWidth + "px";
  l.style.animationDuration = 8 + Math.random() * 6 + "s";
  document.body.appendChild(l);
  setTimeout(() => l.remove(), 14000);
}, 600);
