// projectionData.js

const sqlite3 = require("sqlite3");

// Create a SQLite3 database connection
const db = new sqlite3.Database("database.db");

function getUserData(userId) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM userData WHERE userId = ?", [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function getExpenseByVendorData(userId) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM expenseByVendor WHERE userId = ?",
      [userId],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      },
    );
  });
}

module.exports = {
  getUserData,
  getExpenseByVendorData,
};
