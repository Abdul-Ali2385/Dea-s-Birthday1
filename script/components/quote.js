(function () {
  window.Components = window.Components || {};

  window.Components.quote = {
    render(container, section, config) {
      const div = document.createElement("div");
      div.className = "section section-quote";
      div.innerHTML = `
        <div class="quote-card">
          <span class="quote-mark">"</span>
          <p class="quote-text">${section.text || "Every year is a gift."}</p>
          ${section.author ? `<p class="quote-author">— ${section.author}</p>` : ""}
        </div>
      `;

      // Apply pastel colors dynamically
      const mark = div.querySelector(".quote-mark");
      const text = div.querySelector(".quote-text");
      const author = div.querySelector(".quote-author");

      if (config && config.colors) {
        mark.style.color = config.colors.primary;
        text.style.color = config.colors.accent;
        if (author) author.style.color = config.colors.secondary || "#c4b5fd";
      }

      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      const card = el.querySelector(".quote-card");
      const mark = el.querySelector(".quote-mark");
      const text = el.querySelector(".quote-text");
      const author = el.querySelector(".quote-author");

      tl
        // Card entrance
        .from(card, {
          duration: 0.8,
          opacity: 0,
          scale: 0.95,
          y: 40,
          ease: "power3.out",
        })
        // Quote mark entrance
        .from(mark, {
          duration: 0.6,
          opacity: 0,
          scale: 2,
          rotation: -15,
          ease: "back.out(1.7)",
        }, "-=0.5")
        // Quote text entrance
        .from(text, {
          duration: 0.8,
          opacity: 0,
          y: 20,
          ease: "power2.out",
        }, "-=0.4");

      // Author entrance if exists
      if (author) {
        tl.from(author, {
          duration: 0.6,
          opacity: 0,
          y: 10,
          ease: "power2.out",
        }, "-=0.3");
      }

      // Card exit after delay
      tl.to(card, {
        duration: 0.8,
        opacity: 0,
        y: -30,
        scale: 0.95,
        ease: "power2.inOut",
      }, "+=4");
    },
  };
})();