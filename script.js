document.getElementById('file-input').addEventListener('change', handleFile);

function handleFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const lines = e.target.result.split('\n').slice(1);
        const tableBody = document.querySelector('#expense-table tbody');
        tableBody.innerHTML = '';

        lines.forEach(line => {
            const [date, description, category, amount, type] = line.split(',');
            if (date) {
                const row = `<tr>
                                <td>${date}</td>
                                <td>${description}</td>
                                <td>${category}</td>
                                <td>${amount}</td>
                                <td>${type}</td>
                             </tr>`;
                tableBody.innerHTML += row;
            }
        });
    };

    reader.readAsText(file);
}

function addGoal() {
    const goalName = document.getElementById('goal-name').value;
    const goalAmount = document.getElementById('goal-amount').value;
    const goalsList = document.getElementById('goals-list');

    if (goalName && goalAmount) {
        const listItem = `<li>${goalName} - $${goalAmount}</li>`;
        goalsList.innerHTML += listItem;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('file-input').addEventListener('change', handleFileUpload);
});

document.getElementById('file-input').addEventListener('change', handleFileUpload);

document.getElementById('add-bill-form').addEventListener('submit', addBill);

const customReminders = [];

function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const rows = e.target.result.split('\n').slice(1);
        const categories = {};
        const reminders = [];

        rows.forEach(row => {
            const [date, description, category, amount, type] = row.split(',');
            if (category && amount) {
                if (type.trim().toLowerCase() !== 'credit') { // Exclude income
                    if (!categories[category]) {
                        categories[category] = 0;
                    }
                    categories[category] += parseFloat(amount);
                }

                const tableRow = `<tr>
                    <td>${date}</td>
                    <td>${description}</td>
                    <td>${category}</td>
                    <td>${amount}</td>
                    <td>${type}</td>
                </tr>`;
                document.querySelector('#expense-table tbody').innerHTML += tableRow;

                // Capture potential bill reminders
                if (category.toLowerCase().includes('bill') || category.toLowerCase().includes('loan')) {
                    reminders.push({ description, date, amount });
                }
            }
        });

        renderChart(categories);
        renderReminders([...reminders, ...customReminders]);
        checkDueReminders([...reminders, ...customReminders]);
    };

    reader.readAsText(file);
}

function addBill(event) {
    event.preventDefault();
    const description = document.getElementById('bill-description').value;
    const date = document.getElementById('bill-date').value;
    const amount = document.getElementById('bill-amount').value;

    if (description && date && amount) {
        customReminders.push({ description, date, amount });
        renderReminders(customReminders);
    }
}

function renderChart(data) {
    const ctx = document.getElementById('expense-chart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Spending by Category',
                data: Object.values(data),
                backgroundColor: ['#4CAF50', '#FF6384', '#36A2EB', '#FFCE56', '#7E57C2'],
                hoverOffset: 4
            }]
        }
    });
}

function renderReminders(reminders) {
    const remindersList = document.getElementById('reminders-list');
    remindersList.innerHTML = '';
    reminders.forEach(reminder => {
        const listItem = `<li>${reminder.description} due on ${reminder.date} - Amount: ${reminder.amount}</li>`;
        remindersList.innerHTML += listItem;
    });
}

function checkDueReminders(reminders) {
    const today = new Date();
    reminders.forEach(reminder => {
        const dueDate = new Date(reminder.date);
        const diff = (dueDate - today) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
            alert(`Reminder: ${reminder.description} is due tomorrow!`);
        }
    });
}
