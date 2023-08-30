function plotInflationGraph(userExpenses, compoundedExpenses, inflation) {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 5; i++) {
    years.push(currentYear + i);
  }

  // Calculate compounded expenses with inflation
  for (let i = 1; i < compoundedExpenses.length; i++) {
    compoundedExpenses[i] = compoundedExpenses[i - 1] * (1 + inflation);
  }

  new Chart("myChart", {
    type: "line",
    data: {
      labels: years,
      datasets: [
        {
          data: compoundedExpenses,
          label: "Projected Expenses (5% Inflation)",
          borderColor: "red",
          fill: false,
        },
        {
          data: userExpenses,
          label: "Your current expenses",
          borderColor: "blue",
          fill: false,
        },
      ],
    },
    options: {
      legend: {
        display: true,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: false,
              callback: function(value, index, values) {
                return "$" + value;
              },
            },
          },
        ],
      },
      tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function(tooltipItem, data) {
            const datasetLabel =
              data.datasets[tooltipItem.datasetIndex].label || "";
            const value = "$" + tooltipItem.yLabel.toFixed(2);
            return datasetLabel + ": " + value;
          },
        },
      },
      title: {
        display: true,
        text: "Expense Projection Over 5 Years",
        fontSize: 16,
      },
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Years",
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Expenses ($)",
            },
            ticks: {
              beginAtZero: false,
              callback: function(value, index, values) {
                return "$" + value;
              },
            },
          },
        ],
      },
    },
  });
}

function plotIncomeExpensesGraph(
  userExpenses,
  compoundedExpenses,
  inflation,
  salaryIncreaseRate,
) {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 5; i++) {
    years.push(currentYear + i);
  }

  // Calculate compounded expenses with inflation
  for (let i = 1; i < compoundedExpenses.length; i++) {
    compoundedExpenses[i] = compoundedExpenses[i - 1] * (1 + inflation);
  }

  // Calculate compounded salary with increase rate
  const compoundedSalary = [userExpenses[0]]; // Starting with the current salary
  for (let i = 1; i < years.length; i++) {
    compoundedSalary.push(compoundedSalary[i - 1] * (1 + salaryIncreaseRate));
  }

  const savingsData = []; // Array to store amount saved for each year

  // Calculate the amount saved for each year
  for (let i = 0; i < userExpenses.length; i++) {
    savingsData.push(compoundedSalary[i] - compoundedExpenses[i]);
  }

  new Chart("myChart", {
    type: "bar", // Change the chart type to "bar"
    data: {
      labels: years,
      datasets: [
        {
          data: compoundedSalary,
          label: `Projected Income (${(salaryIncreaseRate * 100).toFixed(
            2,
          )}% increase annually)`,
          backgroundColor: "blue", // Use a color for the bars
          yAxisID: "y-axis-1", // Use the primary y-axis for the bar graphs
        },
        {
          data: compoundedExpenses,
          label: `Projected Expenses (${(inflation * 100).toFixed(
            2,
          )}% Inflation)`,
          backgroundColor: "red", // Use a color for the bars
          yAxisID: "y-axis-1", // Use the primary y-axis for the bar graphs
        },
        {
          data: savingsData, // Use savings data as dataset
          label: "Amount Saved",
          backgroundColor: "green", // Use a color for the bars
          yAxisID: "y-axis-1", // Use the primary y-axis for the bar graphs
        },
        {
          type: "line", // Set the type to "line" for the line graph
          data: savingsData.map((_, index) =>
            savingsData
              .slice(0, index + 1)
              .reduce((acc, value) => acc + value, 0),
          ),
          label: "Cumulative Income",
          borderColor: "black",
          backgroundColor: "black", // Set background color to black
          fill: false,
          pointRadius: 0, // Hide points on the line
          yAxisID: "y-axis-2", // Use the secondary y-axis for this line graph
        },
      ],
    },
    options: {
      legend: {
        display: true,
      },
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Years",
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Amount ($)",
            },
            ticks: {
              beginAtZero: true, // Start y-axis at 0 for a bar graph
              callback: function(value, index, values) {
                return "$" + value;
              },
            },
            id: "y-axis-1", // Use the primary y-axis for the bar graphs
          },
          {
            position: "right",
            scaleLabel: {
              display: true,
              labelString: "Cumulative Income ($)",
            },
            ticks: {
              beginAtZero: true,
              callback: function(value, index, values) {
                return "$" + value;
              },
            },
            id: "y-axis-2", // Use the secondary y-axis for the line graph
          },
        ],
      },
      title: {
        display: true,
        text: "Income and Savings Projection Over 5 Years",
        fontSize: 16,
      },
      tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function(tooltipItem, data) {
            const datasetLabel =
              data.datasets[tooltipItem.datasetIndex].label || "";
            const value = "$" + tooltipItem.yLabel.toFixed(2);
            return datasetLabel + ": " + value;
          },
        },
      },
    },
  });
}
