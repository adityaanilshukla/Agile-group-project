var pastMonthsData = [
  [
    { category: "Food", amount: 300, month: 8, year: 2023 },
    { category: "Utilities", amount: 180, month: 8, year: 2023 },
    { category: "Entertainment", amount: 50, month: 8, year: 2023 },
    { category: "Transportation", amount: 100, month: 8, year: 2023 },
    { category: "Shopping", amount: 200, month: 8, year: 2023 },
    // Add more data as needed
  ],
  [
    { category: "Food", amount: 500, month: 7, year: 2023 },
    { category: "Utilities", amount: 140, month: 7, year: 2023 },
    { category: "Entertainment", amount: 45, month: 7, year: 2023 },
    { category: "Transportation", amount: 95, month: 7, year: 2023 },
    { category: "Shopping", amount: 180, month: 7, year: 2023 },
  ],
  [
    { category: "Food", amount: 310, month: 6, year: 2023 },
    { category: "Utilities", amount: 155, month: 6, year: 2023 },
    { category: "Entertainment", amount: 55, month: 6, year: 2023 },
    { category: "Transportation", amount: 110, month: 6, year: 2023 },
    { category: "Shopping", amount: 210, month: 6, year: 2023 },
  ],
];

// Mock data for the "Projected Savings for the Month" page
var projectedSavingsData = {
  targetSavings: 1000, // Your target savings for the month
  currentSavings: 750, // Your current savings for the month
};

// Function to calculate the savings progress as a percentage
function calculateSavingsProgress(target, current) {
  if (target === 0) {
    return 0; // Avoid division by zero
  }
  return ((current / target) * 100).toFixed(2);
}

// Function to predict savings based on daily spending
function predictSavings(target, spendingData) {
  var currentDate = new Date();
  var daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();

  var totalSpending = spendingData.reduce(function(acc, item) {
    return acc + item.amount;
  }, 0);

  var dailySpending = totalSpending / daysInMonth;
  var projectedSavings = target - totalSpending;

  return {
    dailySpending: dailySpending.toFixed(2),
    projectedSavings: projectedSavings.toFixed(2),
  };
}

// Calculate the savings progress
var savingsProgress = calculateSavingsProgress(
  projectedSavingsData.targetSavings,
  projectedSavingsData.currentSavings,
);

// Calculate and predict savings based on daily spending
var savingsPrediction = predictSavings(
  projectedSavingsData.targetSavings,
  pastMonthsData,
);

// Display the savings progress and prediction on the page (with "$" sign)
document.getElementById("targetSavingsBox").innerHTML =
  "<h3>Your Target Savings</h3><p>$" +
  projectedSavingsData.targetSavings +
  "</p>";

document.getElementById("currentSavingsBox").innerHTML =
  "<h3>Your Current Savings</h3><p>$" +
  projectedSavingsData.currentSavings +
  "</p>";

document.getElementById("savingsProgressBox").innerHTML =
  "<h3>Your Savings Progress</h3><p>" +
  projectedSavingsData.savingsProgress +
  "%</p>";

// Display the savings prediction
document.getElementById("savingsProgressBox").innerHTML +=
  "<h3>Your Projected Savings</h3><p>If you continue spending as you are, you will save approximately $" +
  savingsPrediction.projectedSavings +
  " this month, with a daily spending of $" +
  savingsPrediction.dailySpending +
  ".</p>";
