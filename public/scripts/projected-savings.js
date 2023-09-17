function calculateToDateSpending(month, year) {
  // Initialize the total spending to 0
  var currentToDateSpending = 0;

  // Iterate through the pastMonthsData array
  for (var i = 0; i < pastMonthsData.length; i++) {
    var monthData = pastMonthsData[i];

    // Check if the month and year match the input
    if (
      monthData.some(function(entry) {
        return entry.month === month && entry.year === year;
      })
    ) {
      // Calculate the total spending for this month and add it to the total
      var monthlySpending = monthData.reduce(function(acc, entry) {
        return acc + entry.amount;
      }, 0);

      currentToDateSpending += monthlySpending;
    }
  }
  return currentToDateSpending;
}

function dailySpending() {
  var currentDate = new Date();
  var daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();

  var totalcurrentlySpent = calculateToDateSpending(
    currentDate.getMonth(),
    currentDate.getFullYear(),
  );
  return (totalcurrentlySpent / daysInMonth).toFixed(2);
}

// Function to calculate the savings progress as a percentage
function calculateSavingsProgress(target, current) {
  if (target === 0) {
    return 0; // Avoid division by zero
  }

  let percentage = (current / target) * 100;
  return percentage;
}

// Function to predict savings based on daily spending
function calculateProjectedSavings(income, projExp) {
  var projectedSavings = income - projExp;
  return projectedSavings.toFixed(2);
}

function calculateProjectedExpenditure(currentAmount) {
  const d = new Date();
  let month = d.getMonth();
  let year = d.getFullYear();
  let daysInMonth = new Date(year, month, 0).getDate();
  let daysPassed = d.getDate();
  return ((currentAmount / daysPassed) * daysInMonth).toFixed(2);
}

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
  startIncome: 2500,
  userSalaryIncreaseRate: 0.05,
  userInflationRate: 0.04,
  beginYear: 2023,
};

let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();
let yearsPassed = currentYear - projectedSavingsData.beginYear;

//as users salary is set to increase by a certain amount each year
let currentIncome = (
  projectedSavingsData.startIncome *
  (1 + projectedSavingsData.userSalaryIncreaseRate) ** yearsPassed
).toFixed(2);

//users target savigns to increase with inflaition and changing salaries
let currentTargetSavings = (
  projectedSavingsData.targetSavings *
  (1 + projectedSavingsData.userInflationRate) ** yearsPassed
).toFixed(2);

let currentToDateSpending = calculateToDateSpending(
  currentDate.getMonth(),
  currentDate.getFullYear(),
);

let spendRate = dailySpending();

let projectedExpenditre = calculateProjectedExpenditure(currentToDateSpending);

// Calculate the savings progress
let savingsProgress = calculateSavingsProgress(
  projectedSavingsData.projec,
  projectedSavingsData.currentSavings,
);

// Calculate and predict savings based on daily spending
let projectedSavings = calculateProjectedSavings(
  currentIncome,
  projectedExpenditre,
);

let currentSavings = currentIncome - currentToDateSpending;

// Display the savings progress and prediction on the page (with "$" sign)
document.getElementById("targetSavingsBox").innerHTML =
  "$" + currentTargetSavings;

document.getElementById("monthlyIncomeBox").innerHTML = "$" + currentIncome;

document.getElementById("currentExpenditureBox").innerHTML =
  "$" + currentToDateSpending.toFixed(2);

document.getElementById("projectedExpenditureBox").innerHTML =
  "$" + projectedExpenditre;

document.getElementById("currentSavingsBox").innerHTML =
  "$" + currentSavings.toFixed(2);

// Display the savings prediction
document.getElementById("projectedSavingsBox").innerHTML =
  "$" + projectedSavings;
