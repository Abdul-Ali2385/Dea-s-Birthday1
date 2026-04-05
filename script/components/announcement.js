(function () {
  window.Components = window.Components || {};

  window.Components.announcement = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-announcement";

      div.innerHTML = `
        <p class="line-1" style="opacity: 0;">
          There are days that matter more than others...
        </p>

        <p class="line-2" style="opacity: 0;">
          Today is one of them.
        </p>

        <span class="countdown-go" style="opacity: 0;">
          ${section.goText || "🎉"}
        </span>

        <p class="line-3" style="opacity: 0;">
          ${section.text || "It's your birthday!!"}
        </p>
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

  tl
    // line 1 (soft float in)
    .fromTo(line1,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    )

    // smooth pause
    .to({}, { duration: 1 })

    // line 2 (slightly delayed, smoother)
    .fromTo(line2,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    )

    // hold both
    .to({}, { duration: 1.4 })

    // blur softly (not harsh)
    .to(others, {
      filter: "blur(4px)",
      opacity: 0.5,
      duration: 0.8,
      ease: "power2.out"
    })

    // 🎉 (gentle bounce instead of aggressive elastic)
    .fromTo(go,
      { scale: 0.6, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.9, ease: "back.out(1.7)" }
    )

    // hold moment
    .to({}, { duration: 1.3 })

    // fade out 🎉 smoothly
    .to(go, {
      scale: 0.6,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in"
    })

    // restore text gently
    .to(others, {
      filter: "blur(0px)",
      opacity: 1,
      duration: 0.6,
      ease: "power2.out"
    })

    // small breathing gap
    .to({}, { duration: 0.5 })

    // final line (important → slower, smoother)
    .fromTo(line3,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    )

    // hold longer (emotional impact)
    .to({}, { duration: 3 })

    // exit (soft fade, no jump)
    .to([line1, line2, line3], {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: "power2.inOut"
    });
    },
  };
})();