function initIntersectionObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const video = entry.target;
          video.src = video.getAttribute("data-src");
          video.load();
          video.play().catch((e) => console.error("Error playing video:", e)); // Auto-play the video
          observer.unobserve(video);
        }
      });
    },
    { threshold: 0.1 }
  ); // Adjust the threshold as needed

  const videos = document.querySelectorAll("video[data-src]");
  videos.forEach((video) => {
    observer.observe(video);
  });
}
