function toggleVideoStar(filename, starElement) {
  if (starElement.classList.contains("far")) {
    starElement.classList.remove("far");
    starElement.classList.add("fas");
  } else {
    starElement.classList.remove("fas");
    starElement.classList.add("far");
  }

  // Finden der Kategorie-ID, um den Zustand des Kategoriesterns zu aktualisieren
  const categoryContainer = starElement.closest(".category-container");
  const categoryId = categoryContainer.id;
  updateCategoryStarState(categoryId);

  console.log("Stern für Video umgeschaltet: " + filename);
}

function toggleCategoryStar(categoryId) {
  console.log("Stern für Kategorie umgeschaltet: " + categoryId);
  const categoryContainer = document.getElementById(categoryId);
  const videos = categoryContainer.getElementsByClassName("video-star");
  const allMarked = Array.from(videos).every((star) =>
    star.classList.contains("fas")
  );

  Array.from(videos).forEach((star) => {
    if (allMarked) {
      star.classList.remove("fas");
      star.classList.add("far");
    } else {
      star.classList.remove("far");
      star.classList.add("fas");
    }
  });

  updateCategoryStarState(categoryId);
}

function updateCategoryStarState(categoryId) {
  const categoryContainer = document.getElementById(categoryId);
  const videos = categoryContainer.getElementsByClassName("video-star");
  const categoryStar = categoryContainer.querySelector(".category-star");

  const allMarked = Array.from(videos).every((star) =>
    star.classList.contains("fas")
  );
  if (allMarked) {
    categoryStar.classList.remove("far");
    categoryStar.classList.add("fas");
  } else {
    categoryStar.classList.remove("fas");
    categoryStar.classList.add("far");
  }
}
