// expenseData.js

const sqlite3 = require("sqlite3");

// Configure SQLite database (if not already configured in your main file)
const db = new sqlite3.Database("database.db");

function getExpenseByCategoryData(userId) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Note: Months are zero-based, so add 1

  // Query to fetch data for the current user and year
  const query = `
    SELECT category, amount, month, year
    FROM expenseByCategory
    WHERE userId = ? AND year = ? AND month <= ?
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [userId, currentYear, currentMonth], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      // Create an object to store the formatted data
      const formattedData = {};

      // Iterate through the fetched rows and format the data
      rows.forEach((row) => {
        const { category, amount, month, year } = row;

        if (!formattedData[year]) {
          formattedData[year] = {};
        }

        if (!formattedData[year][month]) {
          formattedData[year][month] = [];
        }

        formattedData[year][month].push({ category, amount });
      });

      // Convert the object to an array of arrays
      const formattedArray = Object.values(formattedData).map((yearData) =>
        Object.values(yearData).flat(),
      );

      resolve(formattedArray);
    });
  });
}

module.exports = { getExpenseByCategoryData };
