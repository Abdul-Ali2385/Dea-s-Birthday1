(function () {
  window.Components = window.Components || {};

  window.Components.profile = {
    render(container, section, config) {
      const div = document.createElement("div");
      div.className = "section section-profile";
      div.innerHTML = `
        <div class="profile-wrapper">
          <canvas id="heart-canvas"></canvas>
          <img src="${section.image || config.photo}" class="profile-picture">
          <h2 class="wish-hbd">${section.title || "Happy Birthday!"}</h2>
          <p class="wish-text">${section.text || ""}</p>
        </div>
      `;
      container.appendChild(div);
      return div;
    },

    animate(tl, el, config) {
      const canvas = el.querySelector("#heart-canvas");
      const wrapper = el.querySelector(".profile-wrapper");
      const color = config.colors.primary || "#f472b6";

      // GSAP Animation for the UI elements
      tl.to(el, { visibility: "visible", opacity: 1, duration: 0.1 })
        .fromTo(wrapper, 
          { opacity: 0, scale: 0.7 }, 
          { opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.7)" }
        )
        .from(".wish-hbd, .wish-text", {
          opacity: 0,
          y: 30,
          stagger: 0.2,
          duration: 0.8
        }, "-=0.5");

      // Start Particle Heart Logic
      this.initHeart(canvas, color);
    },

    initHeart(canvas, color) {
      const ctx = canvas.getContext("2d");
      canvas.width = 800;
      canvas.height = 800;

      const particles = [];
      const particleCount = 1200; // Increased density

      class Particle {
        constructor() {
          this.reset();
        }
        reset() {
          this.t = Math.random() * Math.PI * 2;
          this.size = Math.random() * 1.5 + 0.5;
          this.speed = Math.random() * 0.01 + 0.002;
          this.opacity = Math.random() * 0.7 + 0.1;
          this.drift = Math.random() * 10;
        }
        draw(pulse, time) {
          // Parametric Heart formula
          const x = 16 * Math.pow(Math.sin(this.t), 3);
          const y = -(13 * Math.cos(this.t) - 5 * Math.cos(2 * this.t) - 2 * Math.cos(3 * this.t) - Math.cos(4 * this.t));
          
          // Dynamic jitter/shimmer
          const jitter = Math.sin(time * 5 + this.t * 10) * 1.5;
          const finalX = 400 + (x * (pulse + this.drift/10)) + jitter;
          const finalY = 380 + (y * (pulse + this.drift/10)) + jitter;

          ctx.globalAlpha = this.opacity + Math.sin(time * 3 + this.t * 5) * 0.1;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(finalX, finalY, this.size, 0, Math.PI * 2);
          ctx.fill();
          this.t += this.speed;
        }
      }

      for (let i = 0; i < particleCount; i++) particles.push(new Particle());

      let time = 0;
      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "screen";
        const pulse = 15 + Math.sin(time * 2.5) * 2; // Beating effect
        time += 0.02;
        particles.forEach(p => p.draw(pulse, time));
        requestAnimationFrame(render);
      };
      render();
    }
  };
})();