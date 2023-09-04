function isDateAfter(startDate, targetDate) {
  // Compare the timestamps of startDate and targetDate
  return targetDate.getTime() > startDate.getTime();
}

document.addEventListener("DOMContentLoaded", function() {
  const monthlyIncomeInput = document.getElementById("monthlyIncome");
  const monthlyExpenditureInput = document.getElementById("monthlyExpenditure");
  const targetDateInput = document.getElementById("targetDate");
  const savingsGoalInput = document.querySelector("[name=savingsGoal]");
  const inflationRateInput = document.getElementById("inflationRate");

  const salaryIncreaseRateInput = document.getElementById("salaryIncreaseRate");
  let lastEditedFields = []; // Array to store the last two edited fields
  let timeout;
  let delay = 1000; //time delay after which functions to be called

  monthlyIncomeInput.addEventListener("input", function() {
    // updateLastEditedFields("income/expense");
    updateLastEditedFields("monthlyIncome");
    clearTimeout(timeout);
    timeout = setTimeout(updateFields, delay);
  });

  monthlyExpenditureInput.addEventListener("input", function() {
    // updateLastEditedFields("income/expense");
    updateLastEditedFields("monthlyExpenditure");
    clearTimeout(timeout);
    timeout = setTimeout(updateFields, delay);
  });

  targetDateInput.addEventListener("input", function() {
    updateLastEditedFields("targetDate");
    clearTimeout(timeout);
    timeout = setTimeout(updateFields, delay);
  });

  savingsGoalInput.addEventListener("input", function() {
    updateLastEditedFields("savingsGoal");
    clearTimeout(timeout);
    timeout = setTimeout(updateFields, delay);
  });

  inflationRateInput.addEventListener("input", function() {
    // updateLastEditedFields("income/expense");
    clearTimeout(timeout);
    timeout = setTimeout(updateFields, delay);
  });

  salaryIncreaseRateInput.addEventListener("input", function() {
    // updateLastEditedFields("income/expense");
    clearTimeout(timeout);
    timeout = setTimeout(updateFields, delay);
  });

  //removes duplicates from lastedited array
  //prevents instances of lastedited = [monthlyExpenditure, monthlyExpenditure]
  function removeDuplicates(arr) {
    return [...new Set(arr)];
  }

  //remove the oldest edited field
  //include the latest one
  function updateLastEditedFields(fieldName) {
    lastEditedFields.push(fieldName);
    lastEditedFields = removeDuplicates(lastEditedFields);
    if (lastEditedFields.length > 3) {
      lastEditedFields.shift();
    }
  }

  function ExpenseHigherThanIncomeAlert() {
    alert("Monthly expenses cannot be higher than your monthly income!");
  }

  function targetGoalNotPossibleAlert() {
    alert("Savings goal not possible with current values!");
  }

  function targetGoalTooFarAlert() {
    alert("Savings goal not attainable within 50 years!");
  }

  function targetDateBeforeCurrentDateAlert() {
    alert("Target date cannot be before current date!");
  }

  //updates the field that was not last edited
  function updateFields() {
    // test update savings goal
    // lastEditedFields = ["monthlyIncome", "monthlyExpenditure", "targetDate"];
    // test updateMonthlyExpenses
    // lastEditedFields = ["monthlyIncome", "monthlyIncome", "targetDate"];

    if (
      // (lastEditedFields.length == 2) &
      (lastEditedFields.length == 3) &
      !lastEditedFields.includes("savingsGoal")
    ) {
      updateSavingsGoal();
    }
    if (
      // (lastEditedFields.length == 2) &
      (lastEditedFields.length == 3) &
      // !lastEditedFields.includes("income/expense")
      !lastEditedFields.includes("monthlyExpenditure")
    ) {
      updateMonthlyExpenses();
    }
    if (
      // (lastEditedFields.length == 2) &
      (lastEditedFields.length == 3) &
      !lastEditedFields.includes("targetDate")
    ) {
      updateTargetDate();
    }
  }

  //auto set user's savings goal using the target date and the monthly savings
  function updateSavingsGoal() {
    let monthlyIncome = parseFloat(monthlyIncomeInput.value);
    let monthlyExpenditure = parseFloat(monthlyExpenditureInput.value);
    let inflationRate =
      parseFloat(document.getElementById("inflationRate").value) / 100; // Get inflation rate from slider
    let salaryIncreaseRate =
      parseFloat(document.getElementById("salaryIncreaseRate").value) / 100; // Get salary increase rate from slider
    // let targetDate = new Date(document.getElementById("targetDate").value);
    let targetDateInput = document.getElementById("targetDate").value;
    let targetDate = new Date(targetDateInput);
    targetDate.setMonth(targetDate.getMonth() + 1); // Add 1 to the month
    let startDate = new Date();
    let calculatedSavings = 0;

    if (isDateAfter(startDate, targetDate)) {
      targetDateBeforeCurrentDateAlert();
      return;
    }

    // monthlyIncome = 500;
    // monthlyExpenditure = 340;
    // inflationRate = 0.03;
    // salaryIncreaseRate = 0.04;
    // startDate = new Date("2023-09-03");
    // targetDate = new Date("2026-07-03");
    // calculatedSavings = 0;

    if (isNaN(monthlyExpenditure)) {
      monthlyExpenditure = 0;
    }

    if (monthlyIncome > monthlyExpenditure) {
      calculatedSavings = calculateSavings(
        monthlyIncome,
        monthlyExpenditure,
        inflationRate,
        salaryIncreaseRate,
        targetDate,
        startDate,
      );

      calculatedSavings = calculatedSavings.toFixed(2);

      // Update the input field with the calculatedSavings
      document.getElementById("savingsGoal").value = calculatedSavings;
    } else {
      ExpenseHigherThanIncomeAlert();
    }
  }

  function calculateSavings(
    monthlyIncome,
    monthlyExpenditure,
    inflationRate,
    salaryIncreaseRate,
    targetDate,
    startDate,
  ) {
    let monthsPassed = 0;
    let calculatedSavings = 0;
    let dateNow = new Date();
    let firstYear = startDate.getFullYear();
    let yearsPassed = 0;

    let yearsDifference = targetDate.getFullYear() - startDate.getFullYear();
    let monthsDifference = targetDate.getMonth() - startDate.getMonth();
    let monthsToTargetDate = yearsDifference * 12 + monthsDifference;

    while (monthsPassed < monthsToTargetDate) {
      let calculatedIncome =
        monthlyIncome * (1 + salaryIncreaseRate) ** yearsPassed;
      let calculatedExpense =
        monthlyExpenditure * (1 + inflationRate) ** yearsPassed;

      // Round intermediate results to 2 decimal places
      calculatedSavings += +(calculatedIncome - calculatedExpense).toFixed(2);
      monthsPassed++;

      dateNow = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + monthsPassed,
        startDate.getDate(),
      );

      // console.log(
      //   calculatedIncome,
      //   calculatedExpense,
      //   calculatedIncome - calculatedExpense,
      //   dateNow.getMonth(),
      // );
      yearsPassed = dateNow.getFullYear() - firstYear;
    }

    // console.log(yearsDifference, monthsDifference);
    return calculatedSavings;
  }

  function expenseAllowsToHitTargetDate(calculatedSavings, savingsGoal) {
    if (calculatedSavings > savingsGoal) {
      return false;
    } else {
      return true;
    }
  }

  function updateMonthlyExpenses() {
    // let savingsGoal = 1119.78;
    // let targetDate = new Date("2025-12-31");
    // let inflationRate = 0.05;
    // let salaryIncreaseRate = 0.07;
    // let monthlyIncome = 100;
    // let startDate = new Date("2023-01-01");

    // let savingsGoal = 5984.156;
    // let targetDate = new Date("2026-07-03");
    // let inflationRate = 0.03;
    // let salaryIncreaseRate = 0.04;
    // let monthlyIncome = 500.0;
    // let startDate = new Date("2023-09-03");
    // let calculatedSavings = 0;

    let savingsGoal = parseFloat(savingsGoalInput.value);
    let monthlyIncome = parseFloat(monthlyIncomeInput.value);
    let inflationRate = parseFloat(
      document.getElementById("inflationRate").value / 100,
    ); // Get inflation rate from slider
    let salaryIncreaseRate = parseFloat(
      document.getElementById("salaryIncreaseRate").value / 100,
    ); // Get salary increase rate from slider
    // let targetDate = new Date(document.getElementById("targetDate").value);

    let targetDateInput = document.getElementById("targetDate").value;
    let targetDate = new Date(targetDateInput);
    targetDate.setMonth(targetDate.getMonth() + 1); // Add 1 to the month

    let startDate = new Date();
    let calculatedSavings = 0;

    if (isDateAfter(startDate, targetDate)) {
      targetDateBeforeCurrentDateAlert();
      return;
    }

    //can the user even hit the target with 0 expenses
    let savingsWithNoExpenses = calculateSavings(
      monthlyIncome,
      0,
      inflationRate,
      salaryIncreaseRate,
      targetDate,
      startDate,
    );

    if (savingsWithNoExpenses < savingsGoal) {
      targetGoalNotPossibleAlert();
      return;
    }

    if (
      !isNaN(savingsGoal) &&
      !isNaN(targetDate.getTime()) &&
      !isNaN(monthlyIncome)
    ) {
      let smallestMonthlyExp = 0; // Start with the smallest possible monthly expense
      let largestMonthlyExp = monthlyIncome; // Use a floating-point value

      let result = smallestMonthlyExp; // Initialize result as the smallest possible monthly expense
      let highestCalculatedSavings = 0;

      while (smallestMonthlyExp <= largestMonthlyExp) {
        let midMonthlyExp = (smallestMonthlyExp + largestMonthlyExp) / 2;

        calculatedSavings = calculateSavings(
          monthlyIncome,
          midMonthlyExp,
          inflationRate,
          salaryIncreaseRate,
          targetDate,
          startDate,
        );

        if (expenseAllowsToHitTargetDate(calculatedSavings, savingsGoal)) {
          result = midMonthlyExp;
          if (calculatedSavings > highestCalculatedSavings) {
            highestCalculatedSavings = calculatedSavings;
          }
          largestMonthlyExp = midMonthlyExp - 0.01; // Search for a smaller monthly expense
        } else {
          smallestMonthlyExp = midMonthlyExp + 0.01; // Search for a larger monthly expense
        }

        // Update the input field with the calculated monthly expense
        document.getElementById("monthlyExpenditure").value = result.toFixed(2);
      }
    }
  }

  function updateTargetDate() {
    let savingsGoal = parseFloat(savingsGoalInput.value);
    let monthlyIncome = parseFloat(monthlyIncomeInput.value);
    let monthlyExpenditure = parseFloat(monthlyExpenditureInput.value);
    let inflationRate = parseFloat(
      document.getElementById("inflationRate").value / 100,
    ); // Get inflation rate from slider
    let salaryIncreaseRate = parseFloat(
      document.getElementById("salaryIncreaseRate").value / 100,
    ); // Get salary increase rate from slider

    if (isNaN(monthlyIncome) || monthlyIncome == 0) {
      alert("Not a valid monthly income");
      return;
    }

    if (isNaN(monthlyExpenditure)) {
      monthlyExpenditure = 0;
    }

    if (monthlyIncome > monthlyExpenditure) {
      if (!isNaN(savingsGoal)) {
        let monthsPassed = 0;
        let calculatedSavings = 0;
        let dateNow = new Date();
        let startDate = new Date();
        let firstYear = startDate.getFullYear();
        let yearsPassed = 0;

        while (calculatedSavings <= savingsGoal) {
          calculatedIncome =
            monthlyIncome * (1 + salaryIncreaseRate) ** yearsPassed;
          calculatedExpense =
            monthlyExpenditure * (1 + inflationRate) ** yearsPassed;

          calculatedSavings += calculatedIncome - calculatedExpense;
          monthsPassed++;

          dateNow = new Date(
            startDate.getFullYear(),
            startDate.getMonth() + monthsPassed,
            startDate.getDate(),
          );

          yearsPassed = dateNow.getFullYear() - firstYear;
        }

        if (yearsPassed > 50) {
          targetGoalTooFarAlert();
          return;
        } else if (isNaN(yearsPassed)) {
          targetGoalNotPossibleAlert();
        }
        const year = dateNow.getFullYear();
        const month = String(dateNow.getMonth()).padStart(2, "0");
        const day = String(dateNow.getDate()).padStart(2, "0");

        targetDateInput.value = `${year}-${month}-${day}`;
      }
    } else {
      ExpenseHigherThanIncomeAlert();
    }
  }
});
