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
  let createUserButton = document.getElementById("create-user-button");
  let deleteUserButton = document.getElementById("delete-user-button");
  let userIcon = document.getElementsByClassName("fa-user");

  createUserButton.style.display = "none";
  loginButton.style.display = "none";
  logoutButton.style.display = "block";
  deleteUserButton.style.display = "block";

  for (let i = 0; i < userIcon.length; i++) {
    userIcon[i].style.color = "green";
  }
}

function showNonUserButtons() {
  let loginButton = document.getElementById("login-button");
  let logoutButton = document.getElementById("logout-button");
  let createUserButton = document.getElementById("create-user-button");
  let deleteUserButton = document.getElementById("delete-user-button");
  let userIcon = document.getElementsByClassName("fa-user");

  createUserButton.style.display = "block";
  loginButton.style.display = "block";
  logoutButton.style.display = "none";
  deleteUserButton.style.display = "none";

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

  // Get selected stars
  const selectedStars = document.querySelectorAll(".video-star.fas");
  const selectedStarIds = Array.from(selectedStars, (star) =>
    parseInt(star.dataset.videoid)
  );
  console.log("Selected star IDs:", selectedStarIds);

  // Get database stars
  const userId = localStorage.getItem("userId");
  fetch(`/get-stars/${userId}`)
    .then((response) => response.json())
    .then((databaseStars) => {
      console.log("Database stars:", databaseStars);

      // Check if there are differences between selected and database stars
      if (haveDifferences(selectedStarIds, databaseStars)) {
        // Show dialog
        const dialog = document.getElementById("save-stars-dialog");
        dialog.style.display = "block";

        document.getElementById("save-stars-local").onclick = () => {
          saveStarsLocally(selectedStarIds);
          dialog.style.display = "none";
        };

        document.getElementById("save-stars-remote").onclick = () => {
          saveStarsRemotely(databaseStars);
          dialog.style.display = "none";
        };

        document.getElementById("merge-stars").onclick = () => {
          mergeStars(selectedStarIds, databaseStars);
          dialog.style.display = "none";
        };

        document.getElementById("cancel-stars").onclick = () => {
          logoutUser();
          dialog.style.display = "none";
        };
      } else if (databaseStars.length > 0) {
        saveStarsRemotely(databaseStars);
      } else if (selectedStarIds.length > 0) {
        saveStarsLocally(selectedStarIds);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showNotification(`Error: ${error.message}`, "negative");
    });
}

function haveDifferences(selectedStarIds, databaseStars) {
  // Convert databaseStars to a simple array of ids if necessary
  let dbStarIds = databaseStars.map((star) => star.video_id);

  // Check for differences between the two arrays
  return (
    selectedStarIds.some((id) => !dbStarIds.includes(id)) ||
    dbStarIds.some((id) => !selectedStarIds.includes(id))
  );
}

function saveStarsLocally(starIds) {
  // TODO: Store the starIds in localStorage
}

function saveStarsRemotely(starIds) {
  // TODO: Send a request to a server to save the stars
}

function mergeStars(localStarIds, remoteStarIds) {
  // Combine the two arrays, removing duplicates
  let localWithoutRemote = localStarIds.filter(
    (id) => !remoteStarIds.includes(id)
  );
  console.log("IDs missing on remote:", localWithoutRemote);

  // TODO: Save the missing IDs on the remote server
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
