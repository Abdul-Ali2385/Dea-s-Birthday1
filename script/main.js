/**
 * Engine — Optimized for Landscape & Component Lifecycle
 */

let currentMode = (CONFIG.defaultMode || "dark");

// ── Screen Handling (Force Landscape Logic) ───────────────────────
function handleOrientation() {
  const container = document.querySelector('.container');
  if (!container) return;

  const rotateStyle = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (h > w) {
      // Portrait Mode -> Rotate and Scale
      const scale = (w / h) * 1.25; 
      container.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: ${h}px;
        height: ${w}px;
        transform: translate(-50%, -50%) rotate(90deg) scale(${scale});
        transform-origin: center center;
        visibility: visible;
      `;
    } else {
      // Native Landscape
      container.style.cssText = `
        width: 100%;
        height: 100dvh;
        position: relative;
        visibility: visible;
      `;
    }
  };

  rotateStyle();
  window.addEventListener('resize', rotateStyle);
  window.addEventListener('orientationchange', rotateStyle);
}

// ── Theme System ────────────────────────────────────────────────
function applyTheme(mode) {
  currentMode = mode;
  const root = document.documentElement;
  const c = CONFIG.colors;

  root.style.setProperty("--primary", c.primary || "#f472b6");
  root.style.setProperty("--accent", c.accent || "#60a5fa");
  root.style.setProperty("--secondary", c.secondary || "#c4b5fd");

  const theme = c[mode] || c.dark || {};
  root.style.setProperty("--bg", theme.background || "#0f172a");
  root.style.setProperty("--text", theme.text || "#f1f5f9");

  const btn = document.getElementById("theme-toggle");
  if (btn) btn.textContent = mode === "dark" ? "☀️" : "🌙";
}

function createThemeToggle() {
  if (document.getElementById("theme-toggle")) return;
  const btn = document.createElement("button");
  btn.id = "theme-toggle";
  btn.textContent = currentMode === "dark" ? "☀️" : "🌙";
  btn.onclick = () => applyTheme(currentMode === "dark" ? "light" : "dark");
  document.body.appendChild(btn);
}

// ── Starry Background (Triggered only when needed) ──────────────
function createStarryBackground(numStars = 100) {
  if (document.querySelector('.starry-bg')) return;
  const bg = document.createElement('div');
  bg.className = 'starry-bg';
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.cssText = `
      width: ${Math.random() * 2 + 1}px;
      height: ${Math.random() * 2 + 1}px;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 3 + 2}s;
    `;
    bg.appendChild(star);
  }
  document.body.prepend(bg);
}

// ── Main Execution ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  handleOrientation();
  applyTheme(currentMode);
  createThemeToggle();

  const audio = document.querySelector(".song");
  if (audio && CONFIG.music) {
    audio.querySelector("source").src = CONFIG.music;
    audio.load();
  }

  const types = [...new Set(CONFIG.sections.map(s => s.type))];
  await Promise.all(types.map(type => 
    new Promise(resolve => {
      const s = document.createElement("script");
      s.src = `./script/components/${type}.js`;
      s.onload = resolve;
      s.onerror = resolve;
      document.head.appendChild(s);
    })
  ));

  const container = document.querySelector(".container");
  const rendered = CONFIG.sections.map(section => {
    const comp = window.Components && window.Components[section.type];
    if (!comp) return null;
    const el = comp.render(container, section, CONFIG);
    return { el, comp, section };
  }).filter(Boolean);

  Swal.fire({
    title: "Ready for the surprise?",
    confirmButtonText: "Yes!",
    background: currentMode === "dark" ? "#1e293b" : "#fff",
    color: currentMode === "dark" ? "#f1f5f9" : "#1e293b",
  }).then(res => {
    if (res.isConfirmed) {
      if (audio) audio.play().catch(() => {});
      buildTimeline(rendered);
    }
  });
});

function buildTimeline(rendered) {
  const tl = gsap.timeline();
  tl.to(".container", { duration: 0.5, opacity: 1, visibility: "visible" });

  let deferredExits = [];

  rendered.forEach(({ el, comp, section }, i) => {
    const isOverlay = comp.overlay === true;

    // Trigger stars ONLY when profile/fireworks/balloons appear
    if (['profile', 'fireworks', 'balloons'].includes(section.type)) {
      tl.add(() => {
        createStarryBackground();
        gsap.to(".starry-bg", { opacity: 1, duration: 1 });
      }, "-=0.5");
    }

    if (!isOverlay && deferredExits.length > 0) {
      deferredExits.forEach(fn => fn());
      deferredExits = [];
    }

    // Ensure overlay is visible when its turn starts
    if (isOverlay) {
      tl.set(el, { visibility: "visible", opacity: 1 }, "<");
    }

    comp.animate(tl, el, CONFIG);

    if (comp.exit) {
      const next = rendered[i + 1];
      if (next && next.comp.overlay) {
        deferredExits.push(() => comp.exit(tl, el));
      } else if (!isOverlay) {
        comp.exit(tl, el);
      }
    }
  });

  deferredExits.forEach(fn => fn());
}
// ── Starry Background Generator ─────────────────────────────
function initStarryBackground(numStars = 150) {
  // Create the background container if it doesn't exist
  let bg = document.querySelector('.starry-bg');
  if (!bg) {
    bg = document.createElement('div');
    bg.className = 'starry-bg';
    document.body.prepend(bg);
  }

  // Force it to be visible
  bg.style.opacity = "1";

  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    // Randomize size (1px to 3px)
    const size = Math.random() * 2 + 1;
    // Randomize position
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    // Randomize animation duration (between 2s and 6s)
    const duration = Math.random() * 4 + 2;
    // Randomize delay so they don't all twinkle at once
    const delay = Math.random() * 5;

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${top}%`;
    star.style.left = `${left}%`;
    star.style.setProperty('--duration', `${duration}s`);
    star.style.animationDelay = `${delay}s`;

    bg.appendChild(star);
  }
}

// Call the function when the window loads
window.addEventListener('DOMContentLoaded', () => {
  initStarryBackground(150);
});