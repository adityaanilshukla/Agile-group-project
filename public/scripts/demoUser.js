const sqlite3 = require("sqlite3");

// Create a SQLite3 database connection
const db = new sqlite3.Database("database.db");

// Helper function to generate random data for expenseByVendor
function generateExpenseByVendorData(category) {
  //distopian mega corps for laughs
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

  let currentDate = new Date();
  let currMonth = currentDate.getMonth();
  let currYear = currentDate.getFullYear();

  const data = vendors.map((vendor) => ({
    userId: null,
    category,
    vendorName: vendor,
    amount: (Math.random() * 100).toFixed(2), //randomData
    month: null,
    year: null,
  }));

  return data;
}

// Helper function to generate data for userData
function generateUserData() {
  const currentDate = new Date();
  const startDate = new Date(currentDate);
  startDate.setMonth(currentDate.getMonth() - 4); // 4 months ago
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
  const userEmail = "demo@example.com"; // Replace with your demo user's email
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
        const userId = row.id;

        // Delete user data from all tables using userId as the reference
        db.run("DELETE FROM users WHERE id = ?", [userId]);
        db.run("DELETE FROM expenseByCategory WHERE userId = ?", [userId]);
        db.run("DELETE FROM expenseByVendor WHERE userId = ?", [userId]);
        db.run("DELETE FROM userData WHERE userId = ?", [userId]);

        console.log("Existing demo user deleted.");
      }

      let currentDate = new Date();
      const currYear = currentDate.getFullYear();
      const currMonth = currentDate.getMonth();

      // Generate data for the user tables
      const expenseByCategoryData = [
        {
          category: "Food",
          amount: 0, // You will calculate the total amount below
          month: null, // Use the appropriate month
          year: null, // Set to the user's beginYear
          userId: null, // Set to the user's ID once the user is inserted
        },
        {
          category: "Utilities",
          amount: 0, // You will calculate the total amount below
          month: null, // Use the appropriate month
          year: null, // Set to the user's beginYear
          userId: null, // Set to the user's ID once the user is inserted
        },
        {
          category: "Entertainment",
          amount: 0, // You will calculate the total amount below
          month: null, // Use the appropriate month
          year: null, // Set to the user's beginYear
          userId: null, // Set to the user's ID once the user is inserted
        },
        {
          category: "Transportation",
          amount: 0, // You will calculate the total amount below
          month: null, // Use the appropriate month
          year: null, // Set to the user's beginYear
          userId: null, // Set to the user's ID once the user is inserted
        },
        // // Add more categories as needed
      ];

      const expenseByVendorData = [];
      for (const categoryData of expenseByCategoryData) {
        // Generate data for each category
        const vendorData = generateExpenseByVendorData(categoryData.category);

        expenseByVendorData.push(...vendorData);

        // Calculate the total amount for the category
        categoryData.amount = vendorData.reduce(
          (total, vendor) => total + vendor.amount,
          0,
        );
      }

      const userData = generateUserData();

      // Insert the user into the users table
      db.run(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [userEmail, "demo_password"], // Replace "demo_password" with the hashed password
        function (err) {
          if (err) {
            console.error("Error inserting demo user:", err);
            db.run("ROLLBACK");
          } else {
            const userId = this.lastID;

            // Update the userId for expenseByCategoryData
            for (const categoryData of expenseByCategoryData) {
              categoryData.userId = userId;
            }

            // Insert data into expenseByCategory table
            const categoryInsert = db.prepare(
              "INSERT INTO expenseByCategory (category, amount, month, year, userId) VALUES (?, ?, ?, ?, ?)",
            );
            for (const categoryData of expenseByCategoryData) {
              categoryInsert.run([
                categoryData.category,
                categoryData.amount,
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
              vendorData.userId = userId; // Update the userId for each vendorData
              vendorInsert.run([
                vendorData.category,
                vendorData.vendorName,
                vendorData.amount,
                vendorData.month,
                vendorData.year,
                vendorData.userId,
              ]);
            }
            vendorInsert.finalize();

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
}

module.exports = createDemoUser;
