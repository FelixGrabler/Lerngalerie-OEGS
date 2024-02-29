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

db.run(`CREATE TABLE IF NOT EXISTS stars (
    user_id INTEGER NOT NULL,
    video_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, video_id),
    FOREIGN KEY (user_id) REFERENCES users (id)
)`);

function addStar(userId, videoId) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO stars (user_id, video_id) VALUES(?, ?)`;
    db.run(sql, [userId, videoId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(`A star added for user ${userId}`);
      }
    });
  });
}

function addStars(userId, videoIds) {
  return new Promise((resolve, reject) => {
    // Validierung: Überprüfen der User-ID
    const parsedUserId = parseInt(userId);
    if (!parsedUserId || isNaN(parsedUserId)) {
      reject({
        message:
          "Ungültige Benutzer-ID. Type: " +
          typeof parsedUserId +
          ", Value: " +
          parsedUserId,
      });
      return;
    }

    // Validierung: Überprüfen der User-ID
    if (!parsedUserId || typeof parsedUserId !== "number") {
      reject({
        message:
          "Ungültige Benutzer-ID. Type: " +
          typeof parsedUserId +
          ", Value: " +
          parsedUserId,
      });
      return;
    }

    // Validierung: Überprüfen der Video-IDs
    if (!videoIds || !Array.isArray(videoIds)) {
      reject({ message: "Ungültige Video-IDs. [1]" });
      return;
    }

    // Validierung: Überprüfen, ob alle Video-IDs numerisch sind
    const allNumeric = videoIds.every((id) => typeof id === "number");
    if (!allNumeric) {
      reject({ message: "Ungültige Video-IDs. [2]" });
      return;
    }

    // Validierung: Überprüfen, ob alle Video-IDs positiv sind
    const allPositive = videoIds.every((id) => id > 0);
    if (!allPositive) {
      reject({ message: "Ungültige Video-IDs. [3]" });
      return;
    }

    // Validierung: Überprüfen, ob alle Video-IDs eindeutig sind
    const uniqueIds = new Set(videoIds);
    if (uniqueIds.size !== videoIds.length) {
      reject({ message: "Ungültige Video-IDs. [4]" });
      return;
    }

    // Direktes Einfügen der Stars mit Fehlerbehandlung
    const sql = `INSERT OR IGNORE INTO stars (user_id, video_id) VALUES(?, ?)`;
    const stmt = db.prepare(sql, (err) => {
      if (err) {
        reject({
          message:
            "Fehler bei der Vorbereitung der Datenbankoperation. " +
            err.message,
        });
        return;
      }

      videoIds.forEach((videoId) => {
        stmt.run(parsedUserId, videoId, (err) => {
          if (err) {
            reject({
              message: "Fehler beim Einfügen der Daten. " + err.message,
            });
            return;
          }
        });
      });

      stmt.finalize((err) => {
        if (err) {
          reject({
            message:
              "Fehler beim Abschließen der Datenbankoperation. " + err.message,
          });
        } else {
          resolve(`Stars added for user ${parsedUserId}`);
        }
      });
    });
  });
}

function removeStar(userId, videoId) {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM stars WHERE user_id = ? AND video_id = ?`;
    db.run(sql, [userId, videoId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(`Removed star for user ${userId}`);
      }
    });
  });
}

function removeAllStars(userId) {
  const parsedUserId = parseInt(userId);
  if (!parsedUserId || isNaN(parsedUserId)) {
    return Promise.reject({
      message:
        "Ungültige Benutzer-ID. Type: " +
        typeof parsedUserId +
        ", Value: " +
        parsedUserId,
    });
  }

  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM stars WHERE user_id = ?`;
    db.run(sql, [parsedUserId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(`Removed all stars for user ${parsedUserId}`);
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

function loginCreateUser(name) {
  return new Promise((resolve, reject) => {
    // Validierung: Name darf nicht leer sein
    if (!name || name.trim() === "") {
      reject({ message: "Der Benutzername darf nicht leer sein." });
      return;
    }

    // Versuchen, den Benutzer einzuloggen
    const sqlLogin = `SELECT id FROM users WHERE name = ?`;
    db.get(sqlLogin, [name], (err, row) => {
      if (err) {
        reject({
          message:
            "Fehler bei der Anfrage. Bitte versuchen Sie es später erneut.",
        });
      } else if (row) {
        resolve({ message: "Erfolgreich eingeloggt.", user_id: row.id });
      } else {
        // Benutzer existiert nicht, also neuen Benutzer erstellen
        const sqlCreate = `INSERT INTO users (name) VALUES(?)`;
        db.run(sqlCreate, [name], function (err) {
          if (err) {
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
          message: err.message,
        });
      } else {
        resolve(rows);
      }
    });
  });
}

function getUserStars(userId) {
  return new Promise((resolve, reject) => {
    // Convert userId to a number if it's a string
    const numericUserId = Number(userId);

    // Validierung der User-ID
    if (!numericUserId || typeof numericUserId !== "number") {
      reject({ message: "Ungültige Benutzer-ID." });
      return;
    }

    // Modify the SQL query to select only the video_id column
    const sql = `SELECT video_id FROM stars WHERE user_id = ?`;
    db.all(sql, [numericUserId], (err, rows) => {
      if (err) {
        reject({
          message: err.message,
        });
      } else {
        // Extract only the video_ids from the rows
        const videoIds = rows.map((row) => row.video_id);
        resolve(videoIds);
      }
    });
  });
}

module.exports = {
  addStar,
  addStars,
  removeStar,
  removeAllStars,
  createUser,
  loginUser,
  loginCreateUser,
  deleteUser,
  getAllUsers,
  getUserStars,
};
