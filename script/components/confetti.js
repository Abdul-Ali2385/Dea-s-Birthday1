(function () {
  window.Components = window.Components || {};

  window.Components.confetti = {
    overlay: true,

    render(container, section) {
      const canvas = document.createElement("canvas");
      canvas.className = "confetti-canvas";
      canvas.style.cssText = "position:fixed; inset:0; z-index:100; pointer-events:none;";
      document.body.appendChild(canvas);
      return canvas;
    },

    animate(tl, canvas, config) {
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];
      const colors = [config.colors.primary, config.colors.accent, config.colors.secondary, "#fff"];

      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: -20,
          size: Math.random() * 7 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          vX: Math.random() * 4 - 2,
          vY: Math.random() * 4 + 3,
          r: Math.random() * 360
        });
      }

      const update = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
          p.y += p.vY;
          p.x += p.vX;
          p.r += 5;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.r * Math.PI / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
          ctx.restore();
        });
        
        if (particles[0].y < canvas.height + 50) {
          requestAnimationFrame(update);
        } else {
          canvas.remove(); // Clean up when finished
        }
      };

      // Start falling exactly when the profile starts animating
      tl.add(() => update(), 0); 
    }
  };
})();