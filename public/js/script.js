fetch("/signs.json")
  .then((response) => response.json())
  .then((categories) => {
    const container = document.getElementById("gallery");
    for (const category in categories) {
      // Erstelle einen Container für jede Kategorie
      const categoryContainer = document.createElement("div");
      categoryContainer.className = "category-container";

      // Füge eine Überschrift für die Kategorie hinzu
      const categoryHeading = document.createElement("h2");
      categoryHeading.className = "category-heading";
      categoryHeading.textContent = category;
      categoryContainer.appendChild(categoryHeading);

      // Füge Videos der Kategorie hinzu
      categories[category].forEach((sign) => {
        // Erstelle einen Container für das Video
        const videoItemContainer = document.createElement("div");
        videoItemContainer.className = "sign-container";

        // Füge das Titel-Element hinzu
        const titleElement = document.createElement("div");
        titleElement.className = "video-title";
        titleElement.textContent = sign.title;
        videoItemContainer.appendChild(titleElement);

        const videoContainer = document.createElement("div");
        videoContainer.className = "video-container";

        const videoElement = document.createElement("video");
        videoElement.src = `/mp4/${sign.filename}`;
        videoElement.controls = true;
        videoElement.loop = true;
        videoElement.muted = true;
        videoContainer.appendChild(videoElement);
        videoItemContainer.appendChild(videoContainer);

        categoryContainer.appendChild(videoItemContainer);
      });

      container.appendChild(categoryContainer);
    }

    initIntersectionObserver();
    initOriginalState();
  });

function initIntersectionObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.play();
        } else {
          entry.target.pause();
        }
      });
    },
    { threshold: 0.2 }
  );

  const videos = document.querySelectorAll("video");
  console.log(`Es wurden ${videos.length} Videos gefunden.`);

  videos.forEach((video) => {
    observer.observe(video);
  });
}

// blur
function toggleVisibility(option, event) {
  document.body.classList.add("wait");
  const currentTarget = event.currentTarget;

  setTimeout(function () {
    const videos = document.querySelectorAll("video");
    const titles = document.querySelectorAll(".video-title");

    videos.forEach((video) => {
      video.classList.remove("video-blur");
    });

    titles.forEach((title) => {
      title.classList.remove("title-blur");
    });

    if (option === "videos") {
      videos.forEach((video) => {
        video.classList.add("video-blur");
      });
    } else if (option === "titles") {
      titles.forEach((title) => {
        title.classList.add("title-blur");
      });
    }

    // Update button appearance
    const buttons = document.querySelectorAll(".blur-btn");
    buttons.forEach((btn) => btn.classList.remove("selected"));
    currentTarget.classList.add("selected");
    document.body.classList.remove("wait");
  }, 0);
}

// shuffle
let originalState;

function initOriginalState() {
  originalState = document.querySelector("#gallery").innerHTML;
  console.log("Original state: " + originalState.length);
}

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

function restoreOriginalState() {
  document.querySelector("#gallery").innerHTML = originalState;
  console.log(originalState.length);
  console.log(document.querySelector("#gallery").innerHTML.length);
  initIntersectionObserver();
}
