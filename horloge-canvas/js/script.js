/* js/script.js
   HorlogeCanvas - version améliorée
   - DPR scaling pour canvas (crisp on HiDPI)
   - ripples gérés dans un tableau et dessinés lors de l'animation principale
   - suppression sûre des décorations (filtrage) au lieu de splice dans forEach
   - loadTheme déplacé avant la création des particules
*/

class HorlogeCanvas {
  constructor() {
    this.canvas = document.getElementById('monCanvas');
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.radius = Math.min(this.centerX, this.centerY) - 20;
    this.animationId = null;
    this.isAnimating = false;
    this.decorations = [];
    this.ripples = []; // now centralized for drawing
    this.theme = 'light';
    this.particlesCreated = false;

    this.init();
  }

  init() {
    // Charger le thème avant de créer les particules
    this.loadTheme();
    this.setupEventListeners();
    this.setupDPR();          // scaling pour écrans HD
    this.createParticles();
    this.setupCanvasEffects();
    // démarrer l'animation principale
    this.startAnimation();
    this.updateTimeDisplay();
  }

  setupEventListeners() {
    document.getElementById('themeToggle')
      .addEventListener('click', () => this.toggleTheme());
    document.getElementById('startAnimation')
      .addEventListener('click', () => this.startAnimation());
    document.getElementById('stopAnimation')
      .addEventListener('click', () => this.stopAnimation());
    document.getElementById('addDecoration')
      .addEventListener('click', () => this.addRandomDecoration());

    // interactions canvas
    this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseenter', () => this.handleMouseEnter());
    this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());

    // mise à jour initiale des états de boutons
    this.updateButtonStates();

    // resize pour recalculer DPI / centre
    window.addEventListener('resize', () => {
      this.setupDPR(); // recalculer
    });
  }

  setupDPR() {
    // Ajuste le canvas pour devicePixelRatio afin d'obtenir un rendu net
    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = this.canvas.width;
    const logicalHeight = this.canvas.height;

    this.canvas.style.width = `${logicalWidth}px`;
    this.canvas.style.height = `${logicalHeight}px`;

    this.canvas.width = Math.round(logicalWidth * dpr);
    this.canvas.height = Math.round(logicalHeight * dpr);

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.centerX = logicalWidth / 2;
    this.centerY = logicalHeight / 2;
    this.radius = Math.min(this.centerX, this.centerY) - 20;
  }

  setupCanvasEffects() {
    this.canvas.classList.add('animating');
  }

  createParticles() {
    if (this.particlesCreated) return;
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'bg-particles';
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      const size = Math.random() * 10 + 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `${Math.random() * 100}vh`;
      particle.style.animationDelay = `${Math.random() * 6}s`;
      particle.style.animationDuration = `${Math.random() * 3 + 4}s`;

      particle.style.background = this.theme === 'light'
        ? 'rgba(52, 152, 219, 0.3)'
        : 'rgba(236, 240, 241, 0.18)';

      particlesContainer.appendChild(particle);
    }

    this.particlesCreated = true;
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-theme', this.theme === 'dark');
    const themeButton = document.getElementById('themeToggle');
    themeButton.textContent = this.theme === 'light' ? 'Thème Sombre' : 'Thème Clair';
    themeButton.setAttribute('aria-pressed', this.theme === 'dark');

    // update background particles color
    document.querySelectorAll('.particle').forEach(p => {
      p.style.background = this.theme === 'light'
        ? 'rgba(52, 152, 219, 0.3)'
        : 'rgba(236, 240, 241, 0.18)';
    });

    localStorage.setItem('canvasTheme', this.theme);
  }

  loadTheme() {
    const saved = localStorage.getItem('canvasTheme');
    if (saved) {
      this.theme = saved;
      document.body.classList.toggle('dark-theme', this.theme === 'dark');
      document.getElementById('themeToggle').textContent = this.theme === 'light' ? 'Thème Sombre' : 'Thème Clair';
      document.getElementById('themeToggle').setAttribute('aria-pressed', this.theme === 'dark');
    }
  }

  // DESSIN PRINCIPAL
  drawClock() {
    // efface (note : on dessine tout ici incluant ripples)
    const w = this.canvas.width;
    const h = this.canvas.height;
    // clear using logical coords (transform already set): clearRect with logical sizes
    this.ctx.clearRect(0, 0, this.canvas.width / (window.devicePixelRatio || 1), this.canvas.height / (window.devicePixelRatio || 1));

    this.drawFace();
    this.drawDecorations();
    this.drawHands();
    this.drawCenter();
    this.drawSpecialEffects();
    this.drawRipples(); // draw ripples inside main loop so they appear (fix)
  }

  drawFace() {
    const ctx = this.ctx;
    const cx = this.centerX, cy = this.centerY, r = this.radius;
    // face gradient
    const grad = ctx.createRadialGradient(cx, cy, r - 10, cx, cy, r);
    if (this.theme === 'light') {
      grad.addColorStop(0, '#ecf0f1');
      grad.addColorStop(0.7, '#bdc3c7');
      grad.addColorStop(1, '#95a5a6');
    } else {
      grad.addColorStop(0, '#34495e');
      grad.addColorStop(0.7, '#2c3e50');
      grad.addColorStop(1, '#1a252f');
    }
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // border
    const border = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    if (this.theme === 'light') {
      border.addColorStop(0, '#e74c3c');
      border.addColorStop(0.5, '#3498db');
      border.addColorStop(1, '#2ecc71');
    } else {
      border.addColorStop(0, '#e67e22');
      border.addColorStop(0.5, '#9b59b6');
      border.addColorStop(1, '#1abc9c');
    }
    ctx.strokeStyle = border;
    ctx.lineWidth = 4;
    ctx.stroke();

    // hours marks + numbers
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 1; i <= 12; i++) {
      const angle = (i * Math.PI / 6) - Math.PI / 2;
      const x = cx + Math.cos(angle) * (r - 30);
      const y = cy + Math.sin(angle) * (r - 30);

      // marks
      const markX = cx + Math.cos(angle) * (r - 15);
      const markY = cy + Math.sin(angle) * (r - 15);
      ctx.beginPath();
      ctx.moveTo(markX, markY);
      ctx.lineTo(cx + Math.cos(angle) * (r - 25), cy + Math.sin(angle) * (r - 25));
      const mg = ctx.createLinearGradient(cx, cy, markX, markY);
      mg.addColorStop(0, this.theme === 'light' ? '#e74c3c' : '#e67e22');
      mg.addColorStop(1, this.theme === 'light' ? '#c0392b' : '#d35400');
      ctx.strokeStyle = mg;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();

      // numbers
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 3;
      ctx.fillStyle = this.theme === 'light' ? '#2c3e50' : '#ecf0f1';
      ctx.fillText(String(i), x, y);
      ctx.restore();
    }

    // minute ticks
    for (let i = 0; i < 60; i++) {
      if (i % 5 === 0) continue;
      const ang = (i * Math.PI / 30) - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang) * (r - 10), cy + Math.sin(ang) * (r - 10));
      ctx.lineTo(cx + Math.cos(ang) * (r - 18), cy + Math.sin(ang) * (r - 18));
      ctx.strokeStyle = this.theme === 'light' ? '#7f8c8d' : '#95a5a6';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  drawHands() {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ms = now.getMilliseconds();

    // hour
    const hourAngle = (hours * 30 + minutes * 0.5 + seconds * (0.5 / 60)) * Math.PI / 180 - Math.PI / 2;
    this.drawHand(hourAngle, this.radius * 0.5, 8, this.theme === 'light' ? '#2c3e50' : '#3498db', true);

    // minute
    const minuteAngle = (minutes * 6 + seconds * 0.1) * Math.PI / 180 - Math.PI / 2;
    this.drawHand(minuteAngle, this.radius * 0.7, 5, this.theme === 'light' ? '#34495e' : '#2980b9', true);

    // second
    const secondAngle = (seconds * 6 + ms * 0.006) * Math.PI / 180 - Math.PI / 2;
    this.drawHand(secondAngle, this.radius * 0.8, 2, '#e74c3c', false);

    // point tip
    const tipX = this.centerX + Math.cos(secondAngle) * (this.radius * 0.9);
    const tipY = this.centerY + Math.sin(secondAngle) * (this.radius * 0.9);

    this.ctx.beginPath();
    this.ctx.arc(tipX, tipY, 3, 0, Math.PI * 2);
    const sd = this.ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 5);
    sd.addColorStop(0, '#e74c3c'); sd.addColorStop(1, '#c0392b');
    this.ctx.fillStyle = sd;
    this.ctx.fill();
  }

  drawHand(angle, length, width, color, hasShadow) {
    const ctx = this.ctx;
    if (hasShadow) {
      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    }

    ctx.beginPath();
    ctx.moveTo(this.centerX, this.centerY);
    ctx.lineTo(this.centerX + Math.cos(angle) * length, this.centerY + Math.sin(angle) * length);

    // gradient along hand
    const gx = ctx.createLinearGradient(this.centerX, this.centerY,
      this.centerX + Math.cos(angle) * length, this.centerY + Math.sin(angle) * length);
    gx.addColorStop(0, color);
    gx.addColorStop(1, this.safeLightenColor(color, -20));

    ctx.strokeStyle = gx;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();

    // reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  drawCenter() {
    const ctx = this.ctx;
    const cx = this.centerX, cy = this.centerY;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 12);
    g.addColorStop(0, '#e74c3c'); g.addColorStop(0.7, '#c0392b'); g.addColorStop(1, '#a93226');

    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx - 3, cy - 3, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fill();
  }

  drawSpecialEffects() {
    // halo subtle
    const ctx = this.ctx;
    const cx = this.centerX, cy = this.centerY;
    ctx.beginPath();
    ctx.arc(cx, cy, this.radius + 10, 0, Math.PI * 2);
    const halo = ctx.createRadialGradient(cx, cy, this.radius, cx, cy, this.radius + 20);
    halo.addColorStop(0, this.theme === 'light' ? 'rgba(52,152,219,0.2)' : 'rgba(236,240,241,0.08)');
    halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo;
    ctx.fill();
  }

  // ---- Decorations (safe removal) ----
  drawDecorations() {
    // Supprime les décorations expirer (filtrer)
    const now = Date.now();
    this.decorations = this.decorations.filter(dec => {
      const progress = (now - dec.startTime) / 5000;
      if (progress >= 1) return false;
      return true;
    });

    // Dessine
    this.decorations.forEach(decoration => {
      const progress = (Date.now() - decoration.startTime) / 5000;
      const alpha = 1 - progress;
      const scale = 1 + progress * 0.5;
      const rotation = progress * 360 * Math.PI / 180;

      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.translate(decoration.x, decoration.y);
      this.ctx.rotate(rotation);
      this.ctx.scale(scale, scale);
      this.drawStar(0, 0, 8, 4, 5);
      this.ctx.fillStyle = decoration.color;
      this.ctx.fill();
      this.ctx.restore();
    });

    // Mise à jour compteur
    this.updateDecorationCount();
  }

  drawStar(cx, cy, outerRadius, innerRadius, points) {
    const ctx = this.ctx;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  addRandomDecoration() {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * (this.radius - 50) + 30;
    this.decorations.push({
      x: this.centerX + Math.cos(angle) * distance,
      y: this.centerY + Math.sin(angle) * distance,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      startTime: Date.now()
    });
    this.updateDecorationCount();
    this.animateButton('addDecoration');
  }

  handleCanvasClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);

    const dx = x - this.centerX;
    const dy = y - this.centerY;
    if (Math.sqrt(dx * dx + dy * dy) <= this.radius) {
      // créer ripple dans la file
      this.ripples.push({ x, y, startTime: Date.now(), duration: 1000 });
      this.decorations.push({
        x, y, color: `hsl(${Math.random() * 360}, 70%, 60%)`, startTime: Date.now()
      });
      this.updateDecorationCount();
    }
  }

  drawRipples() {
    const now = Date.now();
    // filtrer ripples expirés
    this.ripples = this.ripples.filter(r => {
      const elapsed = now - r.startTime;
      const t = elapsed / r.duration;
      if (t > 1) return false;

      const radius = 5 + t * 30;
      const alpha = 1 - t;
      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = '#3498db';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.restore();
      return true;
    });
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);
    const dist = Math.hypot(x - this.centerX, y - this.centerY);
    this.canvas.style.cursor = dist <= this.radius ? 'pointer' : 'default';
  }
  handleMouseEnter() { this.canvas.style.transform = 'scale(1.02)'; this.canvas.style.transition = 'transform 0.25s ease'; }
  handleMouseLeave() { this.canvas.style.transform = 'scale(1)'; }

  animateButton(buttonId) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => { btn.style.transform = ''; }, 150);
  }

  updateDecorationCount() {
    const el = document.getElementById('decorationCount');
    if (!el) return;
    el.textContent = String(this.decorations.length);
    el.style.transform = 'scale(1.15)';
    setTimeout(() => { el.style.transform = ''; }, 250);
  }

  updateTimeDisplay() {
    const now = new Date();
    const el = document.getElementById('currentTime');
    el.textContent = now.toLocaleTimeString();
    el.style.color = '#e74c3c';
    setTimeout(() => { el.style.color = ''; }, 500);
  }

  updateButtonStates() {
    const startBtn = document.getElementById('startAnimation');
    const stopBtn = document.getElementById('stopAnimation');
    if (startBtn) startBtn.disabled = this.isAnimating;
    if (stopBtn) stopBtn.disabled = !this.isAnimating;
  }

  animate() {
    // boucle principale
    this.drawClock();
    this.updateTimeDisplay();
    if (this.isAnimating) {
      this.animationId = requestAnimationFrame(() => this.animate());
    }
  }

  startAnimation() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.updateButtonStates();
    // kick-off
    this.animate();
    this.animateButton('startAnimation');
  }

  stopAnimation() {
    this.isAnimating = false;
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.updateButtonStates();
    this.animateButton('stopAnimation');
  }

  // sécurise la modification d'une couleur ; retourne une couleur hex si input hex, sinon renvoie input
  safeLightenColor(hex, percent) {
    try {
      if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return hex;
      const normalized = hex.length === 4
        ? '#' + [...hex.slice(1)].map(c => c + c).join('')
        : hex;
      const num = parseInt(normalized.slice(1), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.min(255, Math.max(0, (num >> 16) + amt));
      const G = Math.min(255, Math.max(0, ((num >> 8) & 0xFF) + amt));
      const B = Math.min(255, Math.max(0, (num & 0xFF) + amt));
      return '#' + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
    } catch (err) {
      return hex;
    }
  }
}

// initialisation
document.addEventListener('DOMContentLoaded', () => {
  const app = new HorlogeCanvas();
  // enlever loading state une fois tout prêt
  window.addEventListener('load', () => document.body.classList.remove('loading'));
});
