fetch("/signs.json")
  .then((response) => response.json())
  .then((categories) => {
    const container = document.getElementById("gallery");
    var counter = 0;

    for (const category in categories) {
      counter++;
      // Container für jede Kategorie
      const categoryContainer = document.createElement("div");
      categoryContainer.className = "category-container";
      categoryContainer.id = `category-${counter}`;

      // Überschrift für die Kategorie
      const categoryHeading = document.createElement("h2");
      categoryHeading.className = "category-heading";
      categoryHeading.textContent = category;

      // Stern-Symbol für die Kategorie
      const categoryStar = document.createElement("i");
      categoryStar.className = "category-star far fa-star"; // Font Awesome für leeren Stern
      categoryStar.onclick = () => toggleCategoryStar(categoryContainer.id); // Event Listener
      categoryHeading.appendChild(categoryStar);

      categoryContainer.appendChild(categoryHeading);

      // Videos der Kategorie
      categories[category].forEach((sign) => {
        const signContainer = document.createElement("div");
        signContainer.className = "sign-container";
        signContainer.dataset.signid = sign.signID;

        // Container für Titel und Stern
        const titleStarContainer = document.createElement("div");
        titleStarContainer.className = "video-title-container";

        // Titel-Element
        const titleElement = document.createElement("a");
        titleElement.className = "video-title";
        titleElement.textContent = sign.title;
        titleElement.href = sign.url;
        titleStarContainer.appendChild(titleElement);

        // Stern-Symbol für das Video
        const videoStar = document.createElement("i");
        videoStar.className = "video-star far fa-star"; // Font Awesome für leeren Stern
        videoStar.onclick = () => toggleVideoStar(sign.signID, videoStar); // Event Listener
        videoStar.dataset.videoid = sign.signID;
        titleStarContainer.appendChild(videoStar);

        signContainer.appendChild(titleStarContainer);

        // Video-Element
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

    generateSidebar(counter);
    initIntersectionObserver();
    initOriginalState();
    restoreLogin();

    sessionStorage.setItem("stars", false);
    sessionStorage.setItem("blur", "aus");
    sessionStorage.setItem("shuffle", "aus");
  });

function generateSidebar(counter) {
  const sidebar = document.getElementById("sidebar");
  for (var i = 1; i <= counter; i++) {
    const categoryContainer = document.getElementById(`category-${i}`);
    const categoryHeading =
      categoryContainer.querySelector(".category-heading");
    const categoryLink = document.createElement("a");
    categoryLink.className = "sidebar-link";
    categoryLink.href = `#category-${i}`;
    categoryLink.textContent = categoryHeading.textContent;
    categoryLink.onclick = toggleSidebar;
    sidebar.appendChild(categoryLink);
  }

  // Add this event listener
  sidebar.addEventListener("mouseleave", function () {
    toggleSidebarOff();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var controlCenter = document.getElementById("control-center");
  var toggleButton = document.getElementById("control-center-toggle");

  document.addEventListener("click", function (event) {
    var isClickInsideControlCenter = controlCenter.contains(event.target);
    var isClickOnToggleButton = toggleButton.contains(event.target);

    if (
      !isClickInsideControlCenter &&
      !isClickOnToggleButton &&
      controlCenter.style.display === "block"
    ) {
      toggleControlCenter();
    }
  });
});
