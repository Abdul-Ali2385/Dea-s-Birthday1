(function () {
  window.Components = window.Components || {};

  window.Components.confetti = {
    overlay: true, // This allows the Profile to render underneath/with it

    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-confetti";
      
      // Create confetti dots (using the PRESETS from your existing file)
      const count = section.count || 12;
      for (let i = 0; i < count; i++) {
        const dot = document.createElement("div");
        dot.className = "firework-spark"; // Reusing spark class for consistent look
        dot.style.backgroundColor = ["#f472b6", "#60a5fa", "#c4b5fd"][i % 3];
        dot.style.left = Math.random() * 100 + "vw";
        dot.style.top = Math.random() * 100 + "vh";
        div.appendChild(dot);
      }

      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      const dots = el.querySelectorAll(".firework-spark");
      tl.set(el, { visibility: "visible", opacity: 1 });
      
      // Use a position parameter (0) so it starts exactly when the profile starts
      tl.from(dots, {
        scale: 0,
        opacity: 0,
        y: "+=100",
        duration: 0.8,
        stagger: 0.05,
        ease: "back.out(2)"
      }, 0); 
    }
  };
})();