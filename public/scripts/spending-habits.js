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
];

function getMonthEntries(month, year) {
  // Iterate through pastMonthsData to find data for the specified month and year
  for (var i = 0; i < pastMonthsData.length; i++) {
    var monthData = pastMonthsData[i];

    // Check if the data entry matches the month and year
    if (
      monthData.some(function (entry) {
        return entry.month === month && entry.year === year;
      })
    ) {
      // Filter the entries that match the criteria (month and year)
      var monthEntries = monthData.filter(function (entry) {
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

  spendingHabitsData.forEach(function (item) {
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
      monthData.some(function (entry) {
        return (
          entry.category === category &&
          entry.month === previousMonth &&
          entry.year === previousYear
        );
      })
    ) {
      // Find the entry that matches the criteria and return its amount
      var previousMonthEntry = monthData.find(function (entry) {
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

// Function to generate personalized recommendations based on spending habits
function generateRecommendations(spendingHabitsData) {
  var positiveRecommendationsList = document.getElementById(
    "positiveRecommendationsList",
  );
  var negativeRecommendationsList = document.getElementById(
    "negativeRecommendationsList",
  );

  var currentDate = new Date();
  var currentMonth = currentDate.getMonth(); // 0-indexed month
  var currentYear = currentDate.getFullYear();

  var spendingHabitsData = getMonthEntries(currentMonth, currentYear);

  // Calculate changes in spending for different categories compared to the previous month
  var categoriesWithIncreasedSpending = [];
  var categoriesWithDecreasedSpending = [];

  spendingHabitsData.forEach(function (item) {
    var category = item.category;
    var currentAmount = item.amount;
    var previousAmount = getPrevMonthCatSPending(
      category,
      item.month,
      item.year,
    );
    var monthsOfData = pastMonthsData.length;

    // Calculate the mean and standard deviation for the category
    var categoryMean = calculateCategoryMean(category, monthsOfData);
    var categoryStdev = calculateStdev(category, pastMonthsData, categoryMean);

    if (previousAmount !== null) {
      var change = currentAmount - previousAmount;
      if (change > 0) {
        categoriesWithIncreasedSpending.push({
          category,
          change,
          categoryMean,
          categoryStdev,
        });
      } else if (change < 0) {
        categoriesWithDecreasedSpending.push({
          category,
          change,
          categoryMean,
          categoryStdev,
        });
      }
    }
  });

  // Generate personalized recommendations based on spending changes
  var positiveRecommendations = [];
  var negativeRecommendations = [];

  categoriesWithDecreasedSpending.forEach(function (categoryInfo) {
    positiveRecommendations.push(
      `You've decreased spending in ${
        categoryInfo.category
      }, saving $${Math.abs(categoryInfo.change).toFixed(
        2,
      )} compared to the previous month. The category's mean spending is $${categoryInfo.categoryMean.toFixed(
        2,
      )}, with a standard deviation of $${categoryInfo.categoryStdev.toFixed(
        2,
      )}.`,
    );
  });

  categoriesWithIncreasedSpending.forEach(function (categoryInfo) {
    negativeRecommendations.push(
      `You've increased spending in ${
        categoryInfo.category
      }, spending an extra $${Math.abs(categoryInfo.change).toFixed(
        2,
      )} compared to the previous month. The category's mean spending is $${categoryInfo.categoryMean.toFixed(
        2,
      )}, with a standard deviation of $${categoryInfo.categoryStdev.toFixed(
        2,
      )}. Consider reviewing your expenses in this area.`,
    );
  });

  if (positiveRecommendations.length === 0) {
    positiveRecommendations.push(
      "Your spending habits appear consistent with the previous month.",
    );
  }

  if (negativeRecommendations.length === 0) {
    negativeRecommendations.push(
      "Your spending habits appear consistent with the previous month.",
    );
  }

  // Populate the positive and negative recommendations lists
  positiveRecommendationsList.innerHTML = positiveRecommendations
    .map((rec) => `<li>${rec}</li>`)
    .join("");

  negativeRecommendationsList.innerHTML = negativeRecommendations
    .map((rec) => `<li>${rec}</li>`)
    .join("");
}

function calculateCategoryMean(category, numberOfMonths) {
  // Filter the data for the specified category
  var categoryData = pastMonthsData.map(function (monthData) {
    return monthData.filter(function (entry) {
      return entry.category === category;
    });
  });

  // Filter out empty arrays (no data for the category in some months)
  categoryData = categoryData.filter(function (monthData) {
    return monthData.length > 0;
  });

  // Calculate the mean amount for the category over the past number of months
  var totalAmount = 0;
  var totalMonths = categoryData.length;

  categoryData.forEach(function (monthData) {
    monthData.forEach(function (entry) {
      totalAmount += entry.amount;
    });
  });

  if (totalMonths === 0) {
    return 0; // No data available for the category
  }

  var meanAmount = parseFloat((totalAmount / totalMonths).toFixed(2));

  return meanAmount;
}

function calculateStdev(category, numberOfMonths, meanAmount) {
  // Calculate the mean amount for the category

  // Filter the data for the specified category
  var categoryData = pastMonthsData.map(function (monthData) {
    return monthData.filter(function (entry) {
      return entry.category === category;
    });
  });

  // Filter out empty arrays (no data for the category in some months)
  categoryData = categoryData.filter(function (monthData) {
    return monthData.length > 0;
  });

  // Calculate the sum of squared differences from the mean
  var sumOfSquaredDifferences = 0;
  var totalMonths = categoryData.length;

  categoryData.forEach(function (monthData) {
    monthData.forEach(function (entry) {
      sumOfSquaredDifferences += Math.pow(entry.amount - meanAmount, 2);
    });
  });

  if (totalMonths === 0) {
    return 0; // No data available for the category
  }

  // Calculate the standard deviation
  var stdev = Math.sqrt(sumOfSquaredDifferences / totalMonths).toFixed(2);

  return parseFloat(stdev);
}

populateSpendingHabits();
generateRecommendations();
