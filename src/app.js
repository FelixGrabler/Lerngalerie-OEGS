const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

app.get("/mp4/:filename", (req, res) => {
  const filename = req.params.filename;
  const options = {
    root: path.join(__dirname, "..", "public", "mp4"),
    headers: {
      "Cache-Control": "public, max-age=31536000", // 1 year
      Expires: new Date(Date.now() + 31536000000).toUTCString(), // 1 year from now
    },
  };

  res.sendFile(filename, options, (err) => {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
  });
});

app.get("/", (req, res) => {
  console.log("GET /");
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(express.static("public"));

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
