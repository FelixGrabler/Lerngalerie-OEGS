// shuffle
let originalState;

function initOriginalState() {
  originalState = document.querySelector("#gallery").innerHTML;
}

function restoreOriginalState() {
  document.querySelector("#gallery").innerHTML = originalState;
  initIntersectionObserver();
  document.querySelectorAll("#gallery video").forEach((video) => {
    video.muted = true;
  });
}
