// fills date section automatically when the user fills up savins
// goal and monthly savings
document.addEventListener("DOMContentLoaded", function () {
  const monthlySavingsInput = document.getElementById("monthlySavings");
  const targetDateInput = document.getElementById("targetDate");

  monthlySavingsInput.addEventListener("input", function () {
    const savingsGoal = parseFloat(
      document.querySelector("[name=savingsGoal]").value,
    );
    const monthlySavings = parseFloat(monthlySavingsInput.value);

    if (savingsGoal && monthlySavings) {
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
    } else {
      targetDateInput.value = "";
    }
  });
});

//fills savings goal automatically when the user fills up
//monthly savings and target date
document.addEventListener("DOMContentLoaded", function () {
  const monthlySavingsInput = document.getElementById("monthlySavings");
  const targetDateInput = document.getElementById("targetDate");
  const savingsGoalInput = document.querySelector("[name=savingsGoal]");

  monthlySavingsInput.addEventListener("input", function () {
    updateSavingsGoal();
  });

  targetDateInput.addEventListener("input", function () {
    updateSavingsGoal();
  });

  function updateSavingsGoal() {
    const targetDateValue = targetDateInput.value;
    const currentDate = new Date();
    const targetDate = new Date(targetDateValue);

    if (!isNaN(targetDate.getTime()) && targetDate > currentDate) {
      const monthsToReachGoal = Math.floor(
        (targetDate - currentDate) / (30 * 24 * 60 * 60 * 1000),
      );
      const monthlySavings = parseFloat(monthlySavingsInput.value);

      if (!isNaN(monthlySavings)) {
        const calculatedSavingsGoal = monthsToReachGoal * monthlySavings;
        savingsGoalInput.value = calculatedSavingsGoal.toFixed(2);
      }
    }
  }
});

//fills up monthly savings when user fills up the savins goal
//and the target date
document.addEventListener("DOMContentLoaded", function () {
  const monthlySavingsInput = document.getElementById("monthlySavings");
  const targetDateInput = document.getElementById("targetDate");
  const savingsGoalInput = document.querySelector("[name=savingsGoal]");

  savingsGoalInput.addEventListener("input", function () {
    updateMonthlySavings();
  });

  targetDateInput.addEventListener("input", function () {
    updateMonthlySavings();
  });

  function updateMonthlySavings() {
    const targetDateValue = targetDateInput.value;
    const currentDate = new Date();
    const targetDate = new Date(targetDateValue);

    if (!isNaN(targetDate.getTime()) && targetDate > currentDate) {
      const monthsToReachGoal = Math.floor(
        (targetDate - currentDate) / (30 * 24 * 60 * 60 * 1000),
      );
      const savingsGoal = parseFloat(savingsGoalInput.value);

      if (!isNaN(savingsGoal) && monthsToReachGoal > 0) {
        const calculatedMonthlySavings = savingsGoal / monthsToReachGoal;
        monthlySavingsInput.value = calculatedMonthlySavings.toFixed(2);
      }
    }
  }
});
