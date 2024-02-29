function toggleControlCenter() {
  var controlCenter = document.getElementById("control-center");
  var isVisible = controlCenter.style.display === "flex";

  if (isVisible) {
    controlCenter.style.animation = "slideUp 0.5s forwards";
    setTimeout(() => {
      controlCenter.style.display = "none";
    }, 500); // Warten, bis die Animation beendet ist
  } else {
    controlCenter.style.display = "flex";
    controlCenter.style.animation = "slideDown 0.5s forwards";
  }
}

function showUserButtons() {
  let loginButton = document.getElementById("login-button");
  let logoutButton = document.getElementById("logout-button");
  // let createUserButton = document.getElementById("create-user-button");
  // let deleteUserButton = document.getElementById("delete-user-button");
  let userIcon = document.getElementsByClassName("fa-user");

  // createUserButton.style.display = "none";
  loginButton.style.display = "none";
  logoutButton.style.display = "block";
  // deleteUserButton.style.display = "block";

  for (let i = 0; i < userIcon.length; i++) {
    userIcon[i].style.color = "green";
  }
}

function showNonUserButtons() {
  let loginButton = document.getElementById("login-button");
  let logoutButton = document.getElementById("logout-button");
  // let createUserButton = document.getElementById("create-user-button");
  // let deleteUserButton = document.getElementById("delete-user-button");
  let userIcon = document.getElementsByClassName("fa-user");

  // createUserButton.style.display = "block";
  loginButton.style.display = "block";
  logoutButton.style.display = "none";
  // deleteUserButton.style.display = "none";

  for (let i = 0; i < userIcon.length; i++) {
    userIcon[i].style.color = "red";
  }
}

function createUser() {
  const name = document.getElementById("username").value;
  const body = {
    name: name,
  };
  fetch("/create-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((result) => {
      showNotification(result.message, "positive");
      console.log("Result:", result);
      console.log("Result message:", result.message);

      const userId = result.user_id;
      console.log("User ID:", userId);

      localStorage.setItem("userId", userId);
      showUserButtons();
    })
    .catch((error) => {
      console.error("Error:", error);
      showNotification(`Error: ${error.message}`, "negative");
    });
}

function restoreLogin() {
  // check if the user was logged in before (local storage), and if so, set the ui elements
  const userId = localStorage.getItem("userId");
  if (userId) {
    showNotification("User logged in", "positive");
    showUserButtons();
  } else {
    showNonUserButtons();
  }

  // TODO: restore stars
}

function loginUser() {
  const name = document.getElementById("username").value;
  const body = { name: name };
  fetch("/login-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then((result) => {
      showNotification(result.message, "positive");
      localStorage.setItem("userId", result.user_id);
      showUserButtons();
      saveStars();
    })
    .catch((errorPromise) => {
      errorPromise.then((errorMessage) => {
        console.error("Error:", errorMessage);
        showNotification(errorMessage.message, "negative");
      });
    });
}

function saveStars() {
  console.log("Save stars");

  const selectedStars = document.querySelectorAll(".video-star.fas");
  const localStarIds = Array.from(selectedStars, (star) =>
    parseInt(star.dataset.videoid)
  );
  console.log("Selected star IDs:", localStarIds);

  // Get database stars
  const userId = localStorage.getItem("userId");
  fetch(`/get-stars/${userId}`)
    .then((response) => response.json())
    .then((databaseStars) => {
      console.log("Database stars:", databaseStars);

      // Check if there are differences between selected and database stars
      if (localStarIds.length > 0 && databaseStars.length > 0) {
        // Show dialog
        const dialog = document.getElementById("save-stars-dialog");
        dialog.style.display = "block";

        document.getElementById("save-stars-local").onclick = () => {
          saveNewStarsRemotely(localStarIds);
          dialog.style.display = "none";
        };

        document.getElementById("save-stars-remote").onclick = () => {
          saveNewStarsLocally(databaseStars);
          dialog.style.display = "none";
        };

        document.getElementById("merge-stars").onclick = () => {
          mergeStars(localStarIds, databaseStars);
          dialog.style.display = "none";
        };

        document.getElementById("cancel-stars").onclick = () => {
          logoutUser();
          dialog.style.display = "none";
        };
      } else if (databaseStars.length > 0) {
        saveStarsLocally(databaseStars);
      } else if (localStarIds.length > 0) {
        saveStarsRemotely(localStarIds);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showNotification(`Error: ${error.message}`, "negative");
    });
}

function getDifferences(selectedStarIds, databaseStars) {
  // Convert databaseStars to a simple array of ids if necessary
  let dbStarIds = databaseStars.map((star) => star.video_id);

  // Compare the two arrays
  let starsLocalNotRemote = selectedStarIds.filter(
    (id) => !dbStarIds.includes(id)
  );
  console.log("IDs missing on remote:", starsLocalNotRemote);

  return starsLocalNotRemote;
}

function saveNewStarsRemotely(starIds) {
  deleteAllStars();
  saveStarsRemotely(starIds);
}

function saveNewStarsLocally(starIds) {
  unselectAllStars();
  saveStarsLocally(starIds);
}

/**
 * Add the given star IDs to the local storage
 */
function saveStarsLocally(starIds) {
  starIds.forEach((id) => {
    let star = document.querySelector(`.video-star[data-videoid="${id}"]`);
    toggleVideoStar(id, star);
  });
}

function saveStarsRemotely(starIds) {
  const userId = localStorage.getItem("userId");
  fetch("/add-stars", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      videoIds: starIds,
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

function mergeStars(localStarIds, remoteStarIds) {
  // Combine the two arrays, removing duplicates
  let localWithoutRemote = localStarIds.filter(
    (id) => !remoteStarIds.includes(id)
  );
  console.log("IDs missing on remote:", localWithoutRemote);
  fetch("/add-stars", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: localStorage.getItem("userId"),
      videoIds: localWithoutRemote,
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

  let remoteWithoutLocal = remoteStarIds.filter(
    (id) => !localStarIds.includes(id)
  );
  console.log("IDs missing locally:", remoteWithoutLocal);
  remoteWithoutLocal.forEach((id) => {
    let star = document.querySelector(`.video-star[data-videoid="${id}"]`);
    toggleVideoStar(id, star);
  });
}

function logoutUser() {
  localStorage.removeItem("userId");
  showNonUserButtons();
  showNotification("Logout successful", "positive");
}

function deleteUser() {
  const userId = localStorage.getItem("userId");
  fetch(`/delete-user/${userId}`, {
    method: "DELETE",
  })
    .then((response) => response.text())
    .then((result) => {
      showNotification(result, "positive");
      localStorage.removeItem("userId");
      showNonUserButtons();
    })
    .catch((error) => {
      console.error("Error:", error);
      showNotification(`Error: ${error.message}`, "negative");
    });
}
