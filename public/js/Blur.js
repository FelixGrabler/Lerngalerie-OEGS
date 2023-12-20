// blur
function toggleVisibility(option, event) {
  document.body.classList.add("wait");
  const currentTarget = event.currentTarget;

  setTimeout(function () {
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

    // Update button appearance
    const buttons = document.querySelectorAll(".blur-btn");
    buttons.forEach((btn) => btn.classList.remove("selected"));
    currentTarget.classList.add("selected");
    document.body.classList.remove("wait");
  }, 0);
}
