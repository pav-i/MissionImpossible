const savingsContainer = document.getElementById('savings-goals');
savingsContainer.innerHTML = `
    <h2>Savings Goals</h2>
    <form id="savings-form">
        <input type="text" id="goal-name" placeholder="Goal Name" required>
        <input type="number" id="goal-amount" placeholder="Goal Amount" required>
        <input type="date" id="goal-date" required>
        <button type="submit">Set Goal</button>
    </form>
    <ul id="goals-list"></ul>
`;

document.getElementById('savings-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const goalName = document.getElementById('goal-name').value;
    const goalAmount = document.getElementById('goal-amount').value;
    const goalDate = document.getElementById('goal-date').value;

    const goalsList = document.getElementById('goals-list');
    const listItem = document.createElement('li');
    listItem.innerHTML = `${goalName} - $${goalAmount} by ${goalDate}`;
    goalsList.appendChild(listItem);

    document.getElementById('savings-form').reset();
});