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
      // Portrait Mode -> Rotate and Scale to fill screen as landscape
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

// ── Updated Starry Background (Twinkling & Permanent) ─────────────
function initStarryBackground(numStars = 200) {
  let bg = document.querySelector('.starry-bg');
  if (!bg) {
    bg = document.createElement('div');
    bg.className = 'starry-bg';
    // FIX: Set z-index to 0 and ensure opacity is 1. 
    // We will make the .container z-index higher so stars are behind text but in front of the floor.
    bg.style.cssText = "position: fixed; inset: 0; z-index: 0; opacity: 1; visibility: visible; overflow: hidden; pointer-events: none;"; 
    document.body.prepend(bg);

    if (!document.getElementById("twinkle-style")) {
      const style = document.createElement("style");
      style.id = "twinkle-style";
      style.innerHTML = `
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .star { position: absolute; background: white; border-radius: 50%; }
      `;
      document.head.appendChild(style);
    }
  }

  bg.innerHTML = ""; 

  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2 + 1;
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 5;

    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation: twinkle ${duration}s ease-in-out infinite;
      animation-delay: -${delay}s;
    `;
    bg.appendChild(star);
  }
}

// ── Updated buildTimeline ───────────────────────────────────────
function buildTimeline(rendered) {
  const tl = gsap.timeline();
  
  initStarryBackground(200);
  
  // FIX: Remove .starry-bg from this line. 
  // If GSAP manages it here, it might hide it when the timeline moves forward.
  tl.to(".container", { duration: 1, opacity: 1, visibility: "visible" });

  // Ensure the container is "above" the stars but transparent so we can see them
  document.querySelector('.container').style.zIndex = "10";
  document.querySelector('.container').style.background = "transparent";

  let deferredExits = [];

  rendered.forEach(({ el, comp, section }, i) => {
    const isOverlay = comp.overlay === true;
    if (!isOverlay && deferredExits.length > 0) {
      deferredExits.forEach(fn => fn());
      deferredExits = [];
    }
    if (isOverlay) {
      tl.set(el, { visibility: "visible", opacity: 1 }, "<");
    }
    if (comp.animate) {
      comp.animate(tl, el, CONFIG, section); 
    }
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

  // Load Component Scripts dynamically
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
  
  // Render components into memory
  const rendered = CONFIG.sections.map(section => {
    const comp = window.Components && window.Components[section.type];
    if (!comp) return null;
    const el = comp.render(container, section, CONFIG);
    return { el, comp, section };
  }).filter(Boolean);

  // SweetAlert Entry Point
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
  
  // 1. Initialize the persistent starry background (Increased to 200 stars)
  initStarryBackground(200);
  
  // 2. Fade in the main container AND the starry background simultaneously
  tl.to([".container", ".starry-bg"], { duration: 1, opacity: 1, visibility: "visible" });

  let deferredExits = [];

  rendered.forEach(({ el, comp, section }, i) => {
    const isOverlay = comp.overlay === true;

    // If this section is a fresh view, exit previous overlays
    if (!isOverlay && deferredExits.length > 0) {
      deferredExits.forEach(fn => fn());
      deferredExits = [];
    }

    // Set visibility for overlays immediately at their start time
    if (isOverlay) {
      tl.set(el, { visibility: "visible", opacity: 1 }, "<");
    }

    // Run the Component's Animation logic
    // Crucial: Passing CONFIG allows components to access colors/photos
    // Make sure 'section' is the 4th argument here!
if (comp.animate) {
  comp.animate(tl, el, CONFIG, section); 
}
    // Manage Exit animations
    if (comp.exit) {
      const next = rendered[i + 1];
      // If next section is an overlay, wait to exit this one
      if (next && next.comp.overlay) {
        deferredExits.push(() => comp.exit(tl, el));
      } else if (!isOverlay) {
        comp.exit(tl, el);
      }
    }
  });

  // Final cleanup for any remaining overlays
  deferredExits.forEach(fn => fn());
}