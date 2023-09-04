// Get the inflation rate and salary increase rate elements
const inflationRateInput = document.getElementById("inflationRate");
const salaryIncreaseRateInput = document.getElementById("salaryIncreaseRate");

// Get the span elements for displaying the values
const inflationValueSpan = document.getElementById("inflationValue");
const salaryIncreaseValueSpan = document.getElementById("salaryIncreaseValue");

// Update the span elements when the slider values change
inflationRateInput.addEventListener("input", function() {
  inflationValueSpan.textContent = inflationRateInput.value;
});

salaryIncreaseRateInput.addEventListener("input", function() {
  salaryIncreaseValueSpan.textContent = salaryIncreaseRateInput.value;
});
