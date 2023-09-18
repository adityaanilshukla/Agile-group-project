const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const saltRounds = 10; // The number of salt rounds to use

// Create a SQLite3 database connection
const db = new sqlite3.Database("database.db");

// Helper function to generate random data for expenseByVendor
function generateExpenseByVendorData(
  category,
  numExpenses,
  month,
  year,
  userId,
) {
  // Distopian mega corps for laughs
  const vendors = [
    "Soylent Corp",
    "Tyrell Corp",
    "Blue Sun",
    "E Corp",
    "Buy n Large",
    "Omni Cons Prod",
    "Cyberdyne Systems",
    "Biosyn",
    "Umbrella Corp",
    "Weyland Corp",
  ];

  const data = vendors.map((vendor) => ({
    userId: userId,
    category,
    vendorName: vendor,
    amount: Math.random() * 100, // Random data
    month: month,
    year: year,
  }));

  return data;
}

// Helper function to generate data for userData
function generateUserData() {
  const currentDate = new Date();
  const startDate = new Date(currentDate);
  startDate.setMonth(currentDate.getMonth() - 5); // 5 months ago
  const targetDate = new Date(startDate);
  targetDate.setFullYear(startDate.getFullYear() + 5); // 5 years from start date

  const userData = {
    startMonthlySavingsGoal: 1000,
    startMonthlyIncome: 2500,
    startMonthlyExpenditure: 1700,
    userSalaryIncreaseRate: 0.05,
    userInflationRate: 0.04,
    beginYear: startDate.getFullYear(),
    startPlanDate: startDate.toISOString(),
    targetDate: targetDate.toISOString(),
  };

  return userData;
}

// Function to create a demo user
function createDemoUser() {
  // Check if the user exists by email or another identifier and delete if found
  const userEmail = "demo@demo.com"; // Replace with your demo user's email
  let userId; // Declare userId outside of the scope

  db.serialize(() => {
    db.run("BEGIN");

    // Find the userId by email
    db.get("SELECT id FROM users WHERE email = ?", [userEmail], (err, row) => {
      if (err) {
        console.error("Error checking if demo user exists:", err);
        db.run("ROLLBACK");
        return;
      }

      if (row) {
        userId = row.id;

        // Delete user data from all tables using userId as the reference
        db.run("DELETE FROM users WHERE id = ?", [userId]);
        db.run(
          "DELETE FROM expenseByCategory WHERE userId = ? OR userId IS NULL",
          [userId],
        );
        db.run(
          "DELETE FROM expenseByVendor WHERE userId = ? OR userId IS NULL",
          [userId],
        );
        db.run("DELETE FROM userData WHERE userId = ?", [userId]);

        console.log("Existing demo user deleted.");
      }

      // Get the current date and time
      let currentDate = new Date();
      let currYear = currentDate.getFullYear();
      let currMonth = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1

      // Generate data for the user tables for the past 5 months
      for (let i = 0; i < 5; i++) {
        // Generate data for each category for the current month
        const expenseByCategoryData = [
          {
            category: "Food",
            amount: 0, // You will calculate the total amount below
            month: currMonth,
            year: currYear,
            userId: userId, // Set userId for categoryData
          },
          {
            category: "Utilities",
            amount: 0,
            month: currMonth,
            year: currYear,
            userId: userId,
          },
          {
            category: "Entertainment",
            amount: 0,
            month: currMonth,
            year: currYear,
            userId: userId,
          },
          {
            category: "Transportation",
            amount: 0,
            month: currMonth,
            year: currYear,
            userId: userId,
          },
          // Add more categories as needed
        ];

        const expenseByVendorData = [];
        for (const categoryData of expenseByCategoryData) {
          // Generate data for each category and month
          const vendorData = generateExpenseByVendorData(
            categoryData.category,
            5, // 5 expenses per category
            currMonth, // Pass the current month
            currYear, // Pass the current year
            userId, // Set userId for vendorData
          );

          expenseByVendorData.push(...vendorData);

          // Calculate the total amount for the category
          categoryData.amount = vendorData.reduce(
            (total, vendor) => total + vendor.amount,
            0,
          );
        }

        // Insert data into expenseByCategory table
        const categoryInsert = db.prepare(
          "INSERT INTO expenseByCategory (category, amount, month, year, userId) VALUES (?, ?, ?, ?, ?)",
        );
        for (const categoryData of expenseByCategoryData) {
          categoryInsert.run([
            categoryData.category,
            categoryData.amount.toFixed(2),
            categoryData.month,
            categoryData.year,
            categoryData.userId,
          ]);
        }
        categoryInsert.finalize();

        // Insert data into expenseByVendor table
        const vendorInsert = db.prepare(
          "INSERT INTO expenseByVendor (category, vendorName, amount, month, year, userId) VALUES (?, ?, ?, ?, ?, ?)",
        );
        for (const vendorData of expenseByVendorData) {
          vendorInsert.run([
            vendorData.category,
            vendorData.vendorName,
            vendorData.amount.toFixed(2),
            vendorData.month,
            vendorData.year,
            vendorData.userId,
          ]);
        }
        vendorInsert.finalize();

        // Move to the previous month
        if (currMonth === 1) {
          currYear -= 1;
          currMonth = 12;
        } else {
          currMonth -= 1;
        }
      }

      const userData = generateUserData();

      // Hash the password using bcrypt
      bcrypt.hash("1", saltRounds, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error("Error hashing password:", hashErr);
          db.run("ROLLBACK");
          return;
        }

        // Insert the user into the users table with the hashed password
        db.run(
          "INSERT INTO users (email, password) VALUES (?, ?)",
          [userEmail, hashedPassword],
          function (err) {
            if (err) {
              console.error("Error inserting demo user:", err);
              db.run("ROLLBACK");
            } else {
              userId = this.lastID; // Update userId after user insertion

              // Insert data into userData table
              db.run(
                "INSERT INTO userData (startMonthlySavingsGoal, startMonthlyIncome, startMonthlyExpenditure, userSalaryIncreaseRate, userInflationRate, beginYear, startPlanDate, targetDate, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                  userData.startMonthlySavingsGoal,
                  userData.startMonthlyIncome,
                  userData.startMonthlyExpenditure,
                  userData.userSalaryIncreaseRate,
                  userData.userInflationRate,
                  userData.beginYear,
                  userData.startPlanDate,
                  userData.targetDate,
                  userId,
                ],
                (insertErr) => {
                  if (insertErr) {
                    console.error("Error inserting user data:", insertErr);
                    db.run("ROLLBACK");
                  } else {
                    // Commit the transaction
                    db.run("COMMIT", (commitErr) => {
                      if (commitErr) {
                        console.error("Transaction commit error:", commitErr);
                      } else {
                        console.log("Demo user created successfully!");
                      }
                    });
                  }
                },
              );
            }
          },
        );
      });
    });
  });
}

module.exports = createDemoUser;
