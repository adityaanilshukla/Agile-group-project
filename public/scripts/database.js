const sqlite3 = require("sqlite3");

// Configure SQLite database
const db = new sqlite3.Database("database.db");

module.exports = db;
