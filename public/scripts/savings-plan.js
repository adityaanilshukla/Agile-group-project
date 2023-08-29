document.addEventListener("DOMContentLoaded", function () {
  const monthlySavingsInput = document.getElementById("monthlySavings");
  const targetDateInput = document.getElementById("targetDate");
  const savingsGoalInput = document.querySelector("[name=savingsGoal]");
  let lastEditedFields = []; // Array to store the last two edited fields
  let timeout;

  monthlySavingsInput.addEventListener("input", function () {
    updateLastEditedFields("monthlySavings");
    clearTimeout(timeout);
    timeout = setTimeout(updateFields, 1000);
  });

  targetDateInput.addEventListener("input", function () {
    updateLastEditedFields("targetDate");
    clearTimeout(timeout);
    timeout = setTimeout(updateFields, 1000);
  });

  savingsGoalInput.addEventListener("input", function () {
    updateLastEditedFields("savingsGoal");
    clearTimeout(timeout);
    timeout = setTimeout(updateFields, 1000);
  });

  function removeDuplicates(arr) {
    return [...new Set(arr)];
  }

  function updateLastEditedFields(fieldName) {
    lastEditedFields.push(fieldName);
    lastEditedFields = removeDuplicates(lastEditedFields);
    if (lastEditedFields.length > 2) {
      lastEditedFields.shift();
    }
  }

  function updateFields() {
    if (
      (lastEditedFields.length == 2) &
      !lastEditedFields.includes("savingsGoal")
    ) {
      updateSavingsGoal();
    }
    if (
      (lastEditedFields.length == 2) &
      !lastEditedFields.includes("monthlySavings")
    ) {
      updateMonthlySavings();
    }
    if (
      (lastEditedFields.length == 2) &
      !lastEditedFields.includes("targetDate")
    ) {
      updateTargetDate();
    }
  }

  function updateSavingsGoal() {
    if (!lastEditedFields.includes("savingsGoal")) {
      const monthlySavings = parseFloat(monthlySavingsInput.value);
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

  function updateMonthlySavings() {
    if (!lastEditedFields.includes("monthlySavings")) {
      const savingsGoal = parseFloat(savingsGoalInput.value);
      const targetDate = new Date(targetDateInput.value);

      if (!isNaN(savingsGoal) && !isNaN(targetDate.getTime())) {
        const monthsToReachGoal = Math.floor(
          (targetDate - new Date()) / (30 * 24 * 60 * 60 * 1000),
        );
        const calculatedMonthlySavings = savingsGoal / monthsToReachGoal;
        monthlySavingsInput.value = calculatedMonthlySavings.toFixed(2);
      }
    }
  }

  function updateTargetDate() {
    if (!lastEditedFields.includes("targetDate")) {
      const savingsGoal = parseFloat(savingsGoalInput.value);
      const monthlySavings = parseFloat(monthlySavingsInput.value);

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
});
