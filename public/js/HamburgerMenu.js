function toggleSidebar() {
  var sidebar = document.getElementById("sidebar");
  if (sidebar.style.width === "300px") {
    sidebar.style.width = "0";
  } else {
    sidebar.style.width = "300px";
  }
}

function toggleSidebarOff() {
  var sidebar = document.getElementById("sidebar");
  sidebar.style.width = "0";
}
