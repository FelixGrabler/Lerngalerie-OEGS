function showNotification(message, type = "neutral") {
  // Erstellen der Benachrichtigungs-Div
  var notification = document.createElement("div");
  notification.className = `notification ${type}`;

  // Hinzufügen der Nachricht
  var messageElement = document.createElement("span");
  messageElement.textContent = message;
  notification.appendChild(messageElement);

  // Hinzufügen des Schließ-Buttons
  var closeButton = document.createElement("span");
  closeButton.textContent = "×";
  closeButton.className = "close-btn";
  closeButton.onclick = function () {
    notification.style.opacity = "0";
    setTimeout(() => notification.remove(), 500);
  };
  notification.appendChild(closeButton);

  // Anzeigen der Benachrichtigung
  document.body.appendChild(notification);
  setTimeout(() => (notification.style.opacity = "1"), 10);

  // Benachrichtigung nach 5 Sekunden automatisch schließen
  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => notification.remove(), 500);
  }, 5000);
}