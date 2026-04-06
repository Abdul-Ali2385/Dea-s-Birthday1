(function () {
  window.Components = window.Components || {};

  window.Components.balloons = {
    overlay: true,

    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-balloons";
      const count = section.count || 30;
      
      // Use the images you have (b1.png, b2.png, etc)
      for (let i = 0; i < count; i++) {
        const img = document.createElement("img");
        img.className = "balloon";
        img.src = `img/b${(i % 3) + 1}.png`; 
        img.style.left = Math.random() * 100 + "vw";
        div.appendChild(img);
      }

      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      const balloons = el.querySelectorAll(".balloon");
      tl.set(el, { visibility: "visible", opacity: 1 });

      balloons.forEach((b) => {
        tl.fromTo(b, 
          { y: 0, opacity: 0 }, 
          { 
            y: -window.innerHeight - 500, // Float all the way up
            x: (Math.random() - 0.5) * 300, // Random horizontal drift
            opacity: 1, 
            duration: 6 + Math.random() * 4, 
            ease: "power1.out" 
          }, 
          Math.random() * 1.5 // Stagger start
        );
      });
      
      // Allow some time for balloons to be visible before profile starts
      tl.to({}, { duration: 2 });
    },
  };
})();