(function () {
  window.Components = window.Components || {};

  window.Components.announcement = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-announcement";
      div.innerHTML = `
        <p class="line-1" style="opacity: 0;">${section.line1 || "There are days that matter more than others..."}</p>
        <p class="line-2" style="opacity: 0;">${section.line2 || "Today is one of them."}</p>
        <span class="countdown-go" style="opacity: 0;">${section.goText || "🎉"}</span>
        <p class="line-3" style="opacity: 0;">${section.text || "It's your birthday!!"}</p>
      `;
      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      const line1 = el.querySelector(".line-1");
      const line2 = el.querySelector(".line-2");
      const line3 = el.querySelector(".line-3");
      const go = el.querySelector(".countdown-go");
      const others = [line1, line2];

      tl.fromTo(line1, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
        .to({}, { duration: 0.8 })
        .fromTo(line2, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
        .to({}, { duration: 1 })
        
        // --- BLUR EFFECT START ---
        // Blurs the text heavily before the 🎉 pops out
        .to(others, { filter: "blur(12px)", opacity: 0.3, duration: 0.6, ease: "power2.out" })
        
        // Pop the 🎉
        .fromTo(go, { scale: 0, opacity: 0, rotation: -20 }, { scale: 1.2, opacity: 1, rotation: 0, duration: 0.8, ease: "back.out(2)" })
        .to({}, { duration: 1.5 }) // Hold focus on 🎉
        
        // Shrink the 🎉
        .to(go, { scale: 0, opacity: 0, duration: 0.5, ease: "power2.in" })
        
        // --- BLUR EFFECT REMOVE ---
        // Bring the text back into focus
        .to(others, { filter: "blur(0px)", opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.2")
        
        // Final line
        .fromTo(line3, { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }, "+=0.2")
        .to({}, { duration: 2.5 });
    },

    exit(tl, el) {
      const lines = el.querySelectorAll("p");
      tl.to(lines, { opacity: 0, y: -20, duration: 0.8, ease: "power2.inOut", stagger: 0.1 });
    }
  };
})();