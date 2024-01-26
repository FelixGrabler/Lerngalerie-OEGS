function toggleVideoStar(videoId, starElement) {
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

  console.log("Stern für Video umgeschaltet: " + videoId);

  // Check if user is logged in
  if (!localStorage.getItem("userId")) {
    return;
  }

  const userId = localStorage.getItem("userId");
  const body = { userId: userId, videoId: videoId };

  var action = "";
  if (starElement.classList.contains("far")) {
    // Stern entfernen
    action = "/remove-star";
  } else {
    // Stern hinzufügen
    action = "/add-star";
  }

  fetch(action, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.text())
    .then((result) => {
      console.log("Result:", result);
    })
    .catch((error) => {
      console.error("Error:", error);
      showNotification(`Error: ${error.message}`, "negative");
    });
}

function toggleCategoryStar(categoryId) {
  console.log("Stern für Kategorie umgeschaltet: " + categoryId);
  const categoryContainer = document.getElementById(categoryId);
  const videos = categoryContainer.getElementsByClassName("video-star");
  const allMarked = Array.from(videos).every((star) =>
    star.classList.contains("fas")
  );

  Array.from(videos).forEach((star) => {
    const videoId = star.dataset.videoid; // Annahme, dass die Video-ID als Datenattribut gespeichert ist

    // Entscheiden, ob der Stern hinzugefügt oder entfernt werden soll
    if (allMarked) {
      // Wenn alle markiert sind, entferne den Stern
      if (star.classList.contains("fas")) {
        toggleVideoStar(videoId, star);
      }
    } else {
      // Wenn nicht alle markiert sind, füge den Stern hinzu
      if (!star.classList.contains("fas")) {
        toggleVideoStar(videoId, star);
      }
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

function unselectAllStars() {
  const stars = document.querySelectorAll(".video-star.fas");
  stars.forEach((star) => {
    star.classList.remove("fas");
    star.classList.add("far");
  });

  const categoryStars = document.querySelectorAll(".category-star.fas");
  categoryStars.forEach((star) => {
    star.classList.remove("fas");
    star.classList.add("far");
  });
}

function deleteAllStars() {
  let user_id = localStorage.getItem("userId");
  fetch("/remove-all-stars", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: user_id,
    }),
  })
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error("Error:", error);
      showNotification(`Error: ${error.message}`, "negative");
    });
}
