fetch("/signs.json")
  .then((response) => response.json())
  .then((categories) => {
    const container = document.getElementById("video-container");
    for (const category in categories) {
      // Erstelle einen Container für jede Kategorie
      const categoryContainer = document.createElement("div");
      categoryContainer.className = "category-container";

      // Füge eine Überschrift für die Kategorie hinzu
      const categoryHeading = document.createElement("h2");
      categoryHeading.textContent = category;
      categoryContainer.appendChild(categoryHeading);

      // Füge Videos der Kategorie hinzu
      categories[category].forEach((sign) => {
        // Erstelle einen Container für das Video
        const videoItemContainer = document.createElement("div");
        videoItemContainer.className = "video-item";

        // Füge den Titel des Videos hinzu
        const videoTitle = document.createElement("h3");
        videoTitle.className = "video-title";
        videoTitle.textContent = sign.title;
        videoItemContainer.appendChild(videoTitle);

        // Füge das Video-Element hinzu
        const videoElement = document.createElement("video");
        videoElement.src = `/mp4/${sign.filename}`;
        videoElement.controls = true;
        videoElement.loop = true;
        videoElement.muted = true;
        videoItemContainer.appendChild(videoElement);

        // Füge den Video-Container zur Kategorie hinzu
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
