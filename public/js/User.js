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

  createUserButton.style.display = "none";
  loginButton.style.display = "none";
  logoutButton.style.display = "block";
  deleteUserButton.style.display = "block";
}

function showNonUserButtons() {
  let loginButton = document.getElementById("login-button");
  let logoutButton = document.getElementById("logout-button");
  let createUserButton = document.getElementById("create-user-button");
  let deleteUserButton = document.getElementById("delete-user-button");

  createUserButton.style.display = "block";
  loginButton.style.display = "block";
  logoutButton.style.display = "none";
  deleteUserButton.style.display = "none";
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
      console.log("Result:", result)
      console.log("Result message:", result.message)

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
    })
    .catch((errorPromise) => {
      errorPromise.then((errorMessage) => {
        console.error("Error:", errorMessage);
        showNotification(errorMessage.message, "negative");
      });
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
