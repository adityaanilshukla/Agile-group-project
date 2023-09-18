// expenseFormatter.js

function formatExpenseByVendorData(userData, expenseByVendorData) {
  const currentYear = new Date().getFullYear();
  const inflation = userData.userInflationRate; // Get inflation from userData

  // Group expenseByVendorData by category
  const groupedData = {};
  expenseByVendorData.forEach((item) => {
    if (!groupedData[item.category]) {
      groupedData[item.category] = [];
    }
    groupedData[item.category].push({
      name: item.vendorName,
      amount: item.amount,
    });
  });

  // Create an array of sections based on category
  const sections = Object.keys(groupedData).map((category) => {
    return {
      sectionTitle: category,
      expenses: groupedData[category],
      currentYear: currentYear,
      inflation: inflation,
    };
  });

  return sections;
}

module.exports = {
  formatExpenseByVendorData,
};
