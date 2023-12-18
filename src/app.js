const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  console.log("GET /");
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/videos", (req, res) => {
  const mp4Directory = path.join(__dirname, "/public/mp4");
  fs.readdir(mp4Directory, (err, files) => {
    if (err) {
      console.error("Fehler beim Lesen des Verzeichnisses:", err);
      res
        .status(500)
        .send(
          "Serverfehler beim Lesen des Verzeichnisses" +
            mp4Directory +
            "! " +
            err
        );
      return;
    }
    console.log("MP4-Dateien loaded.");
    const mp4Files = files.filter((file) => file.endsWith(".mp4"));
    res.json(mp4Files);
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
