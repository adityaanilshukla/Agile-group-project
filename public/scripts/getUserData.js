// Import the necessary SQLite library
const sqlite3 = require("sqlite3");

// Create a function to fetch user-specific data from the userData table
const getUserData = (db, userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT startMonthlySavingsGoal, startMonthlyIncome, startMonthlyExpenditure, userSalaryIncreaseRate, userInflationRate, beginYear
      FROM userData
      WHERE userId = ?
    `;

    db.get(query, [userId], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(row);
    });
  });
};

module.exports = { getUserData };
