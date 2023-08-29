document.addEventListener("DOMContentLoaded", function() {
  const monthlyIncomeInput = document.getElementById("monthlyIncome");
  const monthlyExpenditureInput = document.getElementById("monthlyExpenditure");
  const targetDateInput = document.getElementById("targetDate");
  const savingsGoalInput = document.querySelector("[name=savingsGoal]");
  let lastEditedFields = []; // Array to store the last two edited fields
  let timeout;

  monthlyIncomeInput.addEventListener("input", function() {
    updateLastEditedFields("income/expense");
    clearTimeout(timeout);
    timeout = setTimeout(updateFields, 1000);
  });

  monthlyExpenditureInput.addEventListener("input", function() {
    updateLastEditedFields("income/expense");
    clearTimeout(timeout);
    timeout = setTimeout(updateFields, 1000);
  });

  targetDateInput.addEventListener("input", function() {
    updateLastEditedFields("targetDate");
    clearTimeout(timeout);
    timeout = setTimeout(updateFields, 1000);
  });

  savingsGoalInput.addEventListener("input", function() {
    updateLastEditedFields("savingsGoal");
    clearTimeout(timeout);
    timeout = setTimeout(updateFields, 1000);
  });

  //removes duplicates from lastedited array
  //prevents instances of array = [monthlyExpenditure, monthlyExpenditure]
  function removeDuplicates(arr) {
    return [...new Set(arr)];
  }

  //remove the oldest edited field
  function updateLastEditedFields(fieldName) {
    lastEditedFields.push(fieldName);
    lastEditedFields = removeDuplicates(lastEditedFields);
    if (lastEditedFields.length > 2) {
      lastEditedFields.shift();
    }
  }

  //updates the field that was not last edited
  function updateFields() {
    if (
      (lastEditedFields.length == 2) &
      !lastEditedFields.includes("savingsGoal")
    ) {
      updateSavingsGoal();
    }
    if (
      (lastEditedFields.length == 2) &
      !lastEditedFields.includes("monthlyExpenditure")
    ) {
      updateMonthlyExpenses();
    }
    if (
      (lastEditedFields.length == 2) &
      !lastEditedFields.includes("targetDate")
    ) {
      updateTargetDate();
    }
  }

  //auto set user's savings goal using the target date and the monthly savings
  function updateSavingsGoal() {
    if (!lastEditedFields.includes("savingsGoal")) {
      const monthlyIncome = parseFloat(monthlyIncomeInput.value);
      const monthlyExpenditure = parseFloat(monthlyExpenditureInput.value);

      if (monthlyIncome > monthlyExpenditure) {
        const monthlySavings = monthlyIncome - monthlyExpenditure;

        const targetDate = new Date(targetDateInput.value);

        if (!isNaN(monthlySavings) && !isNaN(targetDate.getTime())) {
          const monthsToReachGoal = Math.floor(
            (targetDate - new Date()) / (30 * 24 * 60 * 60 * 1000),
          );
          const calculatedSavingsGoal = monthsToReachGoal * monthlySavings;
          savingsGoalInput.value = calculatedSavingsGoal.toFixed(2);
        }
      }
    }
  }

  //update monthly expenses to reach users goal within the targeted time
  function updateMonthlyExpenses() {
    if (!lastEditedFields.includes("monthlyExpenditure")) {
      const savingsGoal = parseFloat(savingsGoalInput.value);
      const targetDate = new Date(targetDateInput.value);
      const monthlyIncome = parseFloat(monthlyIncomeInput.value);

      if (!isNaN(savingsGoal) && !isNaN(targetDate.getTime())) {
        const monthsToReachGoal = Math.floor(
          (targetDate - new Date()) / (30 * 24 * 60 * 60 * 1000),
        );
        const calculatedMonthlySavings = savingsGoal / monthsToReachGoal;

        if (monthlyIncome > calculatedMonthlySavings) {
          monthlyExpenditureInput.value =
            monthlyIncome - calculatedMonthlySavings.toFixed(2);
        } else {
          alert("Targeted date not possible with your monthly income!");
        }
      }
    }
  }

  //update the users targeted date using saving goal and monhly savings
  function updateTargetDate() {
    if (!lastEditedFields.includes("targetDate")) {
      const savingsGoal = parseFloat(savingsGoalInput.value);

      const monthlyIncome = parseFloat(monthlyIncomeInput.value);
      const monthlyExpenditure = parseFloat(monthlyExpenditureInput.value);

      if (monthlyIncome > monthlyExpenditure) {
        const monthlySavings = monthlyIncome - monthlyExpenditure;

        if (!isNaN(savingsGoal) && !isNaN(monthlySavings)) {
          const currentDate = new Date();
          const monthsToReachGoal = Math.ceil(savingsGoal / monthlySavings);
          const targetDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + monthsToReachGoal,
            currentDate.getDate(),
          );

          const year = targetDate.getFullYear();
          const month = String(targetDate.getMonth() + 1).padStart(2, "0");
          const day = String(targetDate.getDate()).padStart(2, "0");

          targetDateInput.value = `${year}-${month}-${day}`;
        }
      }
    }
  }
});
