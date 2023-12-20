document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", function () {
    const searchText = searchInput.value.toLowerCase();

    // Iterate over all category containers
    document.querySelectorAll(".category-container").forEach((category) => {
      let found = false;

      // Iterate over all signs within this category
      category.querySelectorAll(".sign-container").forEach((sign) => {
        const title = sign
          .querySelector(".video-title")
          .textContent.toLowerCase();

        // Check if the title contains the search text
        if (title.includes(searchText)) {
          sign.style.display = ""; // Show the sign
          found = true;
        } else {
          sign.style.display = "none"; // Hide the sign
        }
      });

      // Hide or show the whole category based on if any sign was found
      category.style.display = found ? "" : "none";
    });
  });
});
