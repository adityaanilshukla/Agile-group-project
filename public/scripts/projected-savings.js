function calculateToDateSpending(month, year) {
  // Initialize the total spending to 0
  var currentToDateSpending = 0;

  // Iterate through the pastMonthsData array
  for (var i = 0; i < pastMonthsData.length; i++) {
    var monthData = pastMonthsData[i];

    // Check if the month and year match the input
    if (
      monthData.some(function (entry) {
        return entry.month === month && entry.year === year;
      })
    ) {
      // Calculate the total spending for this month and add it to the total
      var monthlySpending = monthData.reduce(function (acc, entry) {
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

let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();
let yearsPassed = currentYear - userData.beginYear;

//as users salary is set to increase by a certain amount each year
let currentIncome = (
  userData.startMonthlyIncome *
  (1 + userData.userSalaryIncreaseRate) ** yearsPassed
).toFixed(2);

//users target savigns to increase with inflaition and changing salaries
let currentTargetSavings = (
  userData.startMonthlySavingsGoal *
  (1 + userData.userInflationRate) ** yearsPassed
).toFixed(2);

let currentToDateSpending = calculateToDateSpending(
  currentDate.getMonth(),
  currentDate.getFullYear(),
);

let spendRate = dailySpending();

let projectedExpenditre = calculateProjectedExpenditure(currentToDateSpending);

// Calculate the savings progress
let savingsProgress = calculateSavingsProgress(
  userData.projec,
  userData.currentSavings,
);

// Calculate and predict savings based on daily spending
let projectedSavings = calculateProjectedSavings(
  currentIncome,
  projectedExpenditre,
);

let currentSavings = currentIncome - currentToDateSpending;

// Display the savings progress and prediction on the page (with "$" sign)
document.getElementById("monthlyIncomeBox").innerHTML = "$" + currentIncome;

document.getElementById("currentExpenditureBox").innerHTML =
  "$" + currentToDateSpending.toFixed(2);

document.getElementById("projectedExpenditureBox").innerHTML =
  "$" + projectedExpenditre;

document.getElementById("currentSavingsBox").innerHTML =
  "$" + currentSavings.toFixed(2);

// Display the savings prediction in bold
document.getElementById("projectedSavingsBox").innerHTML =
  "<strong>" + "$" + projectedSavings + "</strong>";

document.getElementById("targetSavingsBox").innerHTML =
  "$" + currentTargetSavings;

// Calculate the difference between projected savings and the target
let savingsDifference = projectedSavings - currentTargetSavings;

// Get the message container element
let messageContainer = document.getElementById("savingsMessage");

// Define messages based on savingsDifference
let message = "";
if (savingsDifference > 0) {
  message = `Great news! You are projected to save <strong>$${savingsDifference.toFixed(
    2,
  )}</strong> more than your target savings this month.`;
} else if (savingsDifference < 0) {
  message = `You are projected to save <strong>$${Math.abs(
    savingsDifference,
  ).toFixed(
    2,
  )}</strong> less than your target savings this month. Consider reviewing your expenses on the <a href="/spending-habits">Recommendations Based on Spending Habits</a> page.`;
} else {
  message = "Your projected savings align perfectly with your target.";
}

// Display the message
messageContainer.innerHTML = `<p>${message}</p>`;
