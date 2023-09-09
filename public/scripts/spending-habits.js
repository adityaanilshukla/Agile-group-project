// Simulated user's spending habits data from past months (for testing recommendations)
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
  // Add more past months' data as needed
];

function getMonthEntries(month, year) {
  // Iterate through pastMonthsData to find data for the specified month and year
  for (var i = 0; i < pastMonthsData.length; i++) {
    var monthData = pastMonthsData[i];

    // Check if the data entry matches the month and year
    if (
      monthData.some(function(entry) {
        return entry.month === month && entry.year === year;
      })
    ) {
      // Filter the entries that match the criteria (month and year)
      var monthEntries = monthData.filter(function(entry) {
        return entry.month === month && entry.year === year;
      });

      return monthEntries; // Return the data for the specified month and year
    }
  }

  return []; // No data found for the specified month and year
}

// Function to populate the spending habits box with the table
function populateSpendingHabits() {
  var spendingHabitsBox = document.getElementById("spendingHabitsBox");
  var tableBody = document.getElementById("spendingHabitsTableBody");

  /*   var spendingHabitsData = pastMonthsData[0]; */

  var currentDate = new Date();
  var currentMonth = currentDate.getMonth(); // 0-indexed month
  var currentYear = currentDate.getFullYear();

  var spendingHabitsData = getMonthEntries(currentMonth, currentYear);

  spendingHabitsData.forEach(function(item) {
    var category = item.category;
    var amount = item.amount;
    var month = item.month;
    var year = item.year;
    var listItem = document.createElement("tr");

    // Create table cells for Category and Amount Total
    var categoryCell = document.createElement("td");
    categoryCell.textContent = category;

    var amountCell = document.createElement("td");
    amountCell.textContent = `$${amount}`;

    // Calculate and create a cell for Amount/Day
    var currentDate = new Date();
    var daysInMonth = new Date(year, month, 0).getDate();
    var daysPassed = currentDate.getDate();
    var amountPerDay = (amount / daysPassed).toFixed(2);

    var amountPerDayCell = document.createElement("td");
    amountPerDayCell.textContent = `$${amountPerDay}`;

    // Calculate and create a cell for Over/Under Prev
    var previousMonthAmount = getPrevMonthCatSPending(category, month, year);

    var overUnderPrev = calculateOverUnderPrev(amount, previousMonthAmount);

    var overUnderPrevCell = document.createElement("td");
    overUnderPrevCell.textContent = overUnderPrev;

    // Append cells to the row
    listItem.appendChild(categoryCell);
    listItem.appendChild(amountCell);
    listItem.appendChild(amountPerDayCell);
    listItem.appendChild(overUnderPrevCell);

    tableBody.appendChild(listItem);
  });

  // Calculate and display days passed/total days
  var currentDate = new Date();
  var daysPassed = currentDate.getDate();
  var daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();

  var daysInfo = document.getElementById("daysInfo");
  daysInfo.textContent = `Days passed: ${daysPassed} / Total days: ${daysInMonth}`;
}

function getPrevMonthCatSPending(category, currentMonth, currentYear) {
  // Find the previous month and year
  var previousMonth = currentMonth - 1;
  var previousYear = currentYear;
  if (previousMonth === 0) {
    previousMonth = 12;
    previousYear--;
  }

  // Iterate through all past months' data
  for (var i = 0; i < pastMonthsData.length; i++) {
    var monthData = pastMonthsData[i];

    // Check if the data entry matches the category, month, and year
    if (
      monthData.some(function(entry) {
        return (
          entry.category === category &&
          entry.month === previousMonth &&
          entry.year === previousYear
        );
      })
    ) {
      // Find the entry that matches the criteria and return its amount
      var previousMonthEntry = monthData.find(function(entry) {
        return (
          entry.category === category &&
          entry.month === previousMonth &&
          entry.year === previousYear
        );
      });

      return previousMonthEntry.amount;
    }
  }

  return null; // No data found for the previous month
}

// Function to calculate over/under prev
function calculateOverUnderPrev(currentAmount, previousAmount) {
  if (previousAmount === null) {
    return "N/A"; // No data for the previous month
  }

  var difference = currentAmount - previousAmount;
  if (difference > 0) {
    return `+$${difference.toFixed(2)}`;
  } else if (difference < 0) {
    return `-$${Math.abs(difference).toFixed(2)}`;
  } else {
    return "$0";
  }
}

// Function to populate the recommendations box
function populateRecommendations() {
  var recommendationsBox = document.getElementById("recommendationsBox");
  recommendationsData.forEach(function(item) {
    var recommendation = item.recommendation;
    var listItem = document.createElement("p");
    listItem.textContent = recommendation;
    recommendationsBox.appendChild(listItem);
  });
}

// populateRecommendations();
populateSpendingHabits();
