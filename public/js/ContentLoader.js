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
        const signContainer = document.createElement("div");
        signContainer.className = "sign-container";

        // Füge das Titel-Element hinzu
        const titleElement = document.createElement("a");
        titleElement.className = "video-title";
        titleElement.textContent = sign.title;
        titleElement.href = sign.url;
        signContainer.appendChild(titleElement);

        const videoContainer = document.createElement("div");
        videoContainer.className = "video-container";

        const videoElement = document.createElement("video");
        videoElement.setAttribute("data-src", `/mp4/${sign.filename}`);
        videoElement.controls = true;
        videoElement.loop = true;
        videoElement.muted = true;
        videoContainer.appendChild(videoElement);
        signContainer.appendChild(videoContainer);

        categoryContainer.appendChild(signContainer);
      });

      container.appendChild(categoryContainer);
    }

    initIntersectionObserver();
    initOriginalState();
  });
