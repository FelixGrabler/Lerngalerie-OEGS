const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("./src/data/database.sqlite", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the SQLite database.");
});

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
)`);

db.run(`CREATE TABLE IF NOT EXISTS user_video_stars (
    user_id INTEGER NOT NULL,
    video_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, video_id),
    FOREIGN KEY (user_id) REFERENCES users (id)
)`);

function addStar(userId, videoId) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO user_video_stars (user_id, video_id) VALUES(?, ?)`;
    db.run(sql, [userId, videoId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(`A star added for user ${userId}`);
      }
    });
  });
}

function removeStar(userId, videoId) {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM user_video_stars WHERE user_id = ? AND video_id = ?`;
    db.run(sql, [userId, videoId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(`Removed star for user ${userId}`);
      }
    });
  });
}

function createUser(name) {
  return new Promise((resolve, reject) => {
    // Validierung: Name darf nicht leer sein
    if (!name || name.trim() === "") {
      reject({ message: "Der Benutzername darf nicht leer sein." });
      return;
    }

    const sql = `INSERT INTO users (name) VALUES(?)`;
    db.run(sql, [name], function (err) {
      if (err) {
        // Spezifische Fehlerbehandlung
        if (err.message.includes("UNIQUE constraint failed")) {
          reject({ message: "Der Benutzername ist bereits vergeben." });
        } else {
          reject({ message: "Ein unerwarteter Fehler ist aufgetreten." });
        }
      } else {
        resolve({
          message: "Benutzer erfolgreich erstellt.",
          user_id: this.lastID,
        });
      }
    });
  });
}

function loginUser(name) {
  return new Promise((resolve, reject) => {
    // Validierung: Name darf nicht leer sein
    if (!name || name.trim() === "") {
      reject({ message: "Der Benutzername darf nicht leer sein." });
      return;
    }

    const sql = `SELECT id FROM users WHERE name = ?`;
    db.get(sql, [name], (err, row) => {
      if (err) {
        // Allgemeine Fehlerbehandlung
        reject({
          message:
            "Fehler bei der Anfrage. Bitte versuchen Sie es später erneut.",
        });
      } else {
        if (row) {
          resolve({ message: "Erfolgreich eingeloggt.", user_id: row.id });
        } else {
          // Benutzer existiert nicht
          reject({ message: "Benutzername existiert nicht." });
        }
      }
    });
  });
}

function deleteUser(userId) {
  return new Promise((resolve, reject) => {
    // Validierung: Überprüfen der User-ID
    if (!userId || typeof userId !== "number") {
      reject({ message: "Ungültige Benutzer-ID." });
      return;
    }

    const sql = `DELETE FROM users WHERE id = ?`;
    db.run(sql, [userId], function (err) {
      if (err) {
        // Allgemeine Fehlerbehandlung
        reject({
          message:
            "Fehler beim Löschen des Benutzers. Bitte versuchen Sie es später erneut.",
        });
      } else {
        if (this.changes === 0) {
          // Keine Änderungen vorgenommen, Benutzer existiert möglicherweise nicht
          reject({
            message:
              "Benutzer wurde nicht gefunden oder konnte nicht gelöscht werden.",
          });
        } else {
          resolve({ message: "Benutzer erfolgreich gelöscht." });
        }
      }
    });
  });
}

function getAllUsers() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject({
          message:
            "Fehler beim Abrufen der Benutzerdaten. Bitte versuchen Sie es später erneut.",
        });
      } else {
        resolve(rows);
      }
    });
  });
}

function getUserStars(userId) {
  return new Promise((resolve, reject) => {
    // Validierung der User-ID
    if (!userId || typeof userId !== "number") {
      reject({ message: "Ungültige Benutzer-ID." });
      return;
    }

    const sql = `SELECT * FROM user_video_stars WHERE user_id = ?`;
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject({
          message:
            "Fehler beim Abrufen der Sternedaten. Bitte versuchen Sie es später erneut.",
        });
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  addStar,
  removeStar,
  createUser,
  loginUser,
  deleteUser,
  getAllUsers,
  getUserStars,
};
