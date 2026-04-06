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