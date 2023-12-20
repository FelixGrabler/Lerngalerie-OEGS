function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function toggleShuffle(option, event) {
  document.body.classList.add("wait");
  const currentTarget = event.currentTarget;

  setTimeout(function () {
    if (option === "none") {
      restoreOriginalState();
    } else if (option === "categories") {
      restoreOriginalState();
      document.querySelectorAll(".category-container").forEach((category) => {
        let signs = Array.from(category.querySelectorAll(".sign-container"));
        shuffleArray(signs);
        signs.forEach((sign) => category.appendChild(sign));
      });
    } else if (option === "all") {
      let allSigns = Array.from(document.querySelectorAll(".sign-container"));
      shuffleArray(allSigns);
      let gallery = document.querySelector("#gallery"); // Replace with your main container ID
      gallery.innerHTML = ""; // Clear the container
      allSigns.forEach((sign) => gallery.appendChild(sign));
    }

    // Update button appearance for shuffle buttons
    const buttons = document.querySelectorAll(".shuffle-btn");
    buttons.forEach((btn) => btn.classList.remove("selected"));
    currentTarget.classList.add("selected");
    document.body.classList.remove("wait");
  }, 0);
}
