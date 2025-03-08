document.addEventListener('DOMContentLoaded', () => {
    const expenseChart = document.getElementById('expense-chart');
    const savingsChart = document.getElementById('savings-chart');

    const expenses = [300, 200, 150, 400, 150];
    const savings = [500, 1000, 1500, 2000, 2500];

    expenseChart.innerHTML = `Expenses: $${expenses.reduce((a, b) => a + b, 0)}`;
    savingsChart.innerHTML = `Savings: $${savings.reduce((a, b) => a + b, 0)}`;

});
