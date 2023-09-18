// Import the necessary SQLite library
const sqlite3 = require("sqlite3");

// Create a function to fetch and format past months' data
const formatPastMonthsData = (db, userId) => {
  return new Promise((resolve, reject) => {
    const currentYear = new Date().getFullYear();

    const query = `
      SELECT category, amount, month, year
      FROM expenseByCategory
      WHERE userId = ? AND year = ?
    `;

    const pastMonthsData = {};

    db.all(query, [userId, currentYear], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      rows.forEach((row) => {
        const { category, amount, month, year } = row;
        if (!pastMonthsData[month]) {
          pastMonthsData[month] = [];
        }
        pastMonthsData[month].push({ category, amount, month, year });
      });

      // Convert the object values to an array
      const formattedData = Object.values(pastMonthsData);

      resolve(formattedData);
    });
  });
};

module.exports = { formatPastMonthsData };
