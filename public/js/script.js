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
function toggleVisibility(option) {
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
}
