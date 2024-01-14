const express = require("express");
const path = require("path");
const db = require("./database.js");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());

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

// Endpunkt: Stern hinzufügen
app.post("/add-star", async (req, res) => {
  try {
    const { userId, videoId } = req.body;
    await db.addStar(userId, videoId);
    res.status(200).send("Star added successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Endpunkt: Stern entfernen
app.post("/remove-star", async (req, res) => {
  try {
    const { userId, videoId } = req.body;
    await db.removeStar(userId, videoId);
    res.status(200).send("Star removed successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Endpunkt: Alle Sterne eines Benutzers abrufen
app.get("/get-stars/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const stars = await db.getUserStars(userId);
    res.status(200).json(stars);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Endpunkt: Benutzer erstellen
app.post("/create-user", async (req, res) => {
  try {
    const { name } = req.body;
    const result = await db.createUser(name);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpunkt: Benutzer einloggen
app.post("/login-user", async (req, res) => {
  try {
    const { name } = req.body;
    const result = await db.loginUser(name);
    res.status(200).json(result); // Antwort als JSON senden
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpunkt: Liste aller Benutzer abrufen
app.get("/get-users", async (req, res) => {
  try {
    const users = await db.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpunkt: Benutzer löschen
app.delete("/delete-user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    await db.deleteUser(userId);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
