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
    user_id INTEGER,
    video_id INTEGER,
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
    const sql = `INSERT INTO users (name) VALUES(?)`;
    db.run(sql, [name], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ message: "User created successfully", user_id: this.lastID });
      }
    });
  });
}

function deleteUser(userId) {
  return new Promise((resolve, reject) => {
    // Zuerst alle Sterne des Benutzers löschen
    const deleteStarsSql = `DELETE FROM user_video_stars WHERE user_id = ?`;
    db.run(deleteStarsSql, [userId], function (err) {
      if (err) {
        reject(err);
        return;
      }
      // Dann den Benutzer löschen
      const deleteUserSql = `DELETE FROM users WHERE id = ?`;
      db.run(deleteUserSql, [userId], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(`User ${userId} and their stars deleted`);
        }
      });
    });
  });
}

function getAllUsers() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getUserStars(userId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM user_video_stars WHERE user_id = ?`;
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
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
  deleteUser,
  getAllUsers,
  getUserStars,
};
