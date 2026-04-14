(function () {
  window.Components = window.Components || {};

  window.Components.fireworks = {
    overlay: true,

    render(container) {
      const div = document.createElement("div");
      div.className = "section section-fireworks";
      container.appendChild(div);
      return div;
    },

    // This function creates a single explosion at a specific X, Y
    createFirework(el, x, y) {
      const colors = ["#f472b6", "#60a5fa", "#c4b5fd", "#fbbf24", "#34d399"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const sparkCount = 24;

      for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement("div");
        spark.className = "firework-spark";
        spark.style.backgroundColor = color;
        spark.style.left = x + "px";
        spark.style.top = y + "px";
        el.appendChild(spark);

        const angle = (i / sparkCount) * Math.PI * 2;
        const velocity = 70 + Math.random() * 80;

        gsap.to(spark, {
          x: Math.cos(angle) * velocity,
          y: Math.sin(angle) * velocity + 40, // slight gravity effect
          opacity: 0,
          scale: 0.2,
          duration: 1 + Math.random(),
          ease: "power2.out",
          onComplete: () => spark.remove(),
        });
      }
    },

    animate(tl, el) {
      // We make the fireworks section visible
      tl.set(el, { visibility: "visible", opacity: 1 });

      // Add 8 random explosions to the timeline
      for (let i = 0; i < 8; i++) {
        tl.add(() => {
          const randomX = Math.random() * window.innerWidth;
          const randomY = Math.random() * (window.innerHeight * 0.5); // Top half of screen
          this.createFirework(el, randomX, randomY);
        }, `+=${i === 0 ? 0 : 0.5}`); // Stagger by 0.5 seconds
      }
    }
  };
})();