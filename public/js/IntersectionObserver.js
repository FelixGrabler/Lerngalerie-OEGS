function initIntersectionObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.src = video.getAttribute("data-src");
          video.load();
          video.play().catch((e) => console.error("Error playing video:", e));
        } else {
          video.pause();
          video.src = ""; // Unload the video
          video.load(); // This is necessary to properly update the video state
        }
      });
    },
    { threshold: 0 }
  );

  const videos = document.querySelectorAll("video[data-src]");
  videos.forEach((video) => {
    observer.observe(video);
  });
}
