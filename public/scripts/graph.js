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
              callback: function (value, index, values) {
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
          label: function (tooltipItem, data) {
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
              callback: function (value, index, values) {
                return "$" + value;
              },
            },
          },
        ],
      },
    },
  });
}
