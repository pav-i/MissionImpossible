const budgetContainer = document.getElementById('budget-planner');
budgetContainer.innerHTML = `
    <h2>Budget Planner</h2>
    <form id="budget-form">
        <input type="text" id="budget-category" placeholder="Category" required>
        <input type="number" id="budget-amount" placeholder="Budget Amount" required>
        <button type="submit">Set Budget</button>
    </form>
    <ul id="budget-list"></ul>
`;

document.getElementById('budget-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const category = document.getElementById('budget-category').value;
    const amount = document.getElementById('budget-amount').value;

    const budgetList = document.getElementById('budget-list');
    const listItem = document.createElement('li');
    listItem.innerHTML = `${category}: $${amount}`;
    budgetList.appendChild(listItem);

    document.getElementById('budget-form').reset();
});