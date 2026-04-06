(function () {
  window.Components = window.Components || {};

  window.Components.chatbox = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-chatbox";
      div.innerHTML = `
        <div class="text-box">
          <p class="hbd-chatbox"></p>
          <p class="fake-btn">${section.buttonText || "Send"}</p>
        </div>
      `;
      // Split message into individual character spans for typing animation
      const chatbox = div.querySelector(".hbd-chatbox");
      const msg = section.message || "Happy Birthday!";
      chatbox.innerHTML = msg
        .split("")
        .map((ch) => `<span>${ch}</span>`)
        .join("");

      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
  const spans = el.querySelectorAll(".hbd-chatbox span");
  const box = el.querySelector(".text-box");
  const btn = el.querySelector(".fake-btn");

  tl
    // box enters smoothly
    .from(box, {
      duration: 0.9,
      scale: 0.85,
      opacity: 0,
      y: 30,
      ease: "power3.out",
    })

    // button fade (not pop)
    .from(btn, {
      duration: 0.5,
      opacity: 0,
      y: 10,
      ease: "power2.out",
    })

    // typing effect smoother
    .to(spans, {
      duration: 1.8,
      visibility: "visible",
      stagger: 0.035,
      ease: "none",
    })

    // button highlight (pastel)
    .to(btn, {
      duration: 0.3,
      backgroundColor: "var(--accent)",
    }, "+=3")

    // exit smoother
    .to(box, {
      duration: 0.7,
      scale: 0.9,
      opacity: 0,
      y: -60,
      ease: "power2.inOut",
    }, "+=1");
    }
  };
})();
