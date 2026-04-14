(function () {
  window.Components = window.Components || {};

  const ENTER = { opacity: 0, y: 40, rotationX: 10, skewX: "5deg" };
  const LEAVE = { opacity: 0, y: -40, rotationX: -10, skewX: "-5deg" };

  const PASTEL_GRADIENTS = [
    ["#ff9a9e", "#fad0c4"],
    ["#a1c4fd", "#c2e9fb"],
    ["#fbc2eb", "#a6c1ee"],
    ["#fdcbf1", "#e6dee9"],
    ["#fef08a", "#6ee7b7"],
  ];

  function applyGradient(element, idx) {
    const [start, end] = PASTEL_GRADIENTS[idx % PASTEL_GRADIENTS.length];
    element.style.background = `linear-gradient(135deg, ${start}, ${end})`;
    element.style.webkitBackgroundClip = "text";
    element.style.webkitTextFillColor = "transparent";
  }

  window.Components.ideas = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-ideas";

      const lines = section.lines || [];
      div.innerHTML = lines
        .map((line, i) => {
          // If the line is a single character, treat it as "Big Letter"
          if (line.length === 1) {
            return `<div class="idea-big-letters"><span>${line}</span></div>`;
          }
          return `<p class="idea-line">${line}</p>`;
        })
        .join("");

      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      const lines = el.querySelectorAll(".idea-line, .idea-big-letters");

      lines.forEach((line, i) => {
        // Entrance
        tl.fromTo(
          line,
          { ...ENTER },
          { 
            opacity: 1, 
            y: 0, 
            rotationX: 0, 
            skewX: "0deg", 
            duration: 0.8, 
            ease: "power3.out" 
          }
        );

        // Highlight "strong" text if it exists
        const strong = line.querySelector("strong");
        if (strong) {
          tl.to(strong, {
            scale: 1.1,
            duration: 0.5,
            ease: "back.out(2)"
          }, "-=0.3");
        }

        // Hold the text on screen (shorter hold for big letters, longer for sentences)
        const holdTime = line.classList.contains("idea-big-letters") ? 1.2 : 2.5;
        
        // Exit
        tl.to(line, { 
          duration: 0.6, 
          ...LEAVE, 
          ease: "power3.in" 
        }, `+=${holdTime}`);
      });
    },

    exit(tl, el) {
      tl.to(el, { opacity: 0, duration: 0.5 });
    }
  };
})();