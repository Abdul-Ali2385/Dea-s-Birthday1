(function () {
  window.Components = window.Components || {};

  window.Components.profile = {
    render(container, section, config) {
      const div = document.createElement("div");
      div.className = "section section-profile";
      const img = section.image || config.photo;

      div.innerHTML = `
        <div class="profile-wrapper">
          <img src="${img}" class="profile-picture">
          <h2 class="wish-hbd">${section.title || "Happy Birthday!"}</h2>
          <p class="wish-text">${section.text || ""}</p>
        </div>
      `;
      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      const wrapper = el.querySelector(".profile-wrapper");
      const title = el.querySelector(".wish-hbd");
      const text = el.querySelector(".wish-text");

      tl.fromTo(wrapper, 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      )
      .from([title, text], {
        opacity: 0,
        y: 20,
        stagger: 0.3,
        duration: 0.8
      }, "-=0.5");
      
      // Pause to let the user admire the profile and confetti
      tl.to({}, { duration: 3 });
    }
  };
})();