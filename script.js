document.getElementById('file-input').addEventListener('change', handleFile);

document.getElementById('budget-form').addEventListener('submit', setBudget);
document.getElementById('track-budget-btn').addEventListener('click', trackBudget); // New track button event listener

document.getElementById('savings-form').addEventListener('submit', setSavingGoal); // Updated form id

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

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('file-input').addEventListener('change', handleFileUpload);
});

document.getElementById('file-input').addEventListener('change', handleFileUpload);

document.getElementById('add-bill-form').addEventListener('submit', addBill);

const customReminders = [];
const budgets = {};
const spending = {};
const savingGoals = []; // New saving goals array

function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const rows = e.target.result.split('\n').slice(1);
        const categories = {};
        const reminders = [];
        const tableBody = document.querySelector('#expense-table tbody');
        tableBody.innerHTML = '';

        Object.keys(spending).forEach(key => delete spending[key]);

        rows.forEach(row => {
            const [date, description, category, amount, type] = row.split(',');
            const expenseAmount = parseFloat(amount);

            if (date && category && expenseAmount && type.trim().toLowerCase() !== 'credit') {
                const rowHtml = `<tr>
                    <td>${date}</td>
                    <td>${description}</td>
                    <td>${category}</td>
                    <td>${expenseAmount}</td>
                    <td>${type}</td>
                </tr>`;
                tableBody.innerHTML += rowHtml;

                if (!spending[category]) {
                    spending[category] = 0;
                }
                spending[category] += expenseAmount;

                if (budgets[category] && spending[category] > budgets[category]) {
                    alert(`Warning: Spending for ${category} exceeded budget! (Spent: $${spending[category]}, Budget: $${budgets[category]})`);
                }
            }
        });

        renderChart(spending);
        renderReminders([...reminders, ...customReminders]);
        checkDueReminders([...reminders, ...customReminders]);
    };

    reader.readAsText(file);
}

function renderChart(data) {
    const ctx = document.getElementById('expense-chart').getContext('2d');
    if (window.expenseChart) {
        window.expenseChart.destroy();
    }
    window.expenseChart = new Chart(ctx, {
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

function trackBudget() {
    const categories = Object.keys(budgets);
    const budgetValues = Object.values(budgets);
    const spentValues = categories.map(category => spending[category] || 0);

    const ctx = document.getElementById('budget-chart').getContext('2d');
    if (window.budgetChart) {
        window.budgetChart.destroy();
    }
    window.budgetChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [
                {
                    label: 'Budget',
                    data: budgetValues,
                    backgroundColor: '#36A2EB'
                },
                {
                    label: 'Spent',
                    data: spentValues,
                    backgroundColor: '#FF6384'
                }
            ]
        }
    });
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

function setBudget(event) {
    event.preventDefault();
    const category = document.getElementById('budget-category').value.trim();
    const amount = parseFloat(document.getElementById('budget-amount').value);

    if (category && amount) {
        budgets[category] = amount;

        const budgetList = document.getElementById('budget-list');
        const listItem = `<li>Budget for ${category}: $${amount}</li>`;
        budgetList.innerHTML += listItem;

        alert(`Budget set for ${category}: $${amount}`);
    }
}

function setSavingGoal(event) {
    event.preventDefault();
    const goalName = document.getElementById('goal-name').value.trim();
    const goalAmount = document.getElementById('goal-amount').value;
    const goalDate = document.getElementById('goal-date').value;

    if (goalName && goalAmount && goalDate) {
        const goal = {
            name: goalName,
            amount: parseFloat(goalAmount),
            date: goalDate
        };

        savingGoals.push(goal);

        const goalList = document.getElementById('goals-list');
        const listItem = `<li>${goal.name} - $${goal.amount} by ${goal.date}</li>`;
        goalList.innerHTML += listItem;

        alert(`Saving goal set: ${goal.name} for $${goal.amount} by ${goal.date}`);
        document.getElementById('savings-form').reset(); // Clear form after submission
    } else {
        alert('Please fill out all fields for your saving goal.');
    }
}
const apiKey = '5b4d4e6334ed4a908defe6e4bb14b11e';
const url = `https://newsapi.org/v2/top-headlines?category=business&apiKey=${apiKey}`;


  

let index = 0;
let newsData = [];

async function fetchNews() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        newsData = data.articles.slice(0, 5); // Get the top 5 news articles
        displayNews();
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

function displayNews() {
    const newsContainer = document.getElementById("news-container");
    const dotsContainer = document.getElementById("dots-container");
    newsContainer.innerHTML = "";
    dotsContainer.innerHTML = "";

    newsData.forEach((news, idx) => {
        const newsItem = document.createElement("div");
        newsItem.classList.add("news-item");
        if (idx === 0) newsItem.style.display = "block"; // Show the first news item by default
        
        newsItem.innerHTML = `<a href="${news.url}" target="_blank">${news.title}</a>`;
        newsContainer.appendChild(newsItem);

        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (idx === 0) dot.classList.add("active");
        dot.addEventListener("click", () => moveToSlide(idx));
        dotsContainer.appendChild(dot);
    });

    startCarousel();
}

function updateCarousel() {
    const items = document.querySelectorAll(".news-item");
    const dots = document.querySelectorAll(".dot");

    items.forEach(item => (item.style.display = "none"));
    dots.forEach(dot => dot.classList.remove("active"));

    items[index].style.display = "block";
    dots[index].classList.add("active");
}

function nextSlide() {
    index = (index + 1) % newsData.length;
    updateCarousel();
}

function moveToSlide(slideIndex) {
    index = slideIndex;
    updateCarousel();
}

function startCarousel() {
    setInterval(nextSlide, 3000); // Auto slide every 3 seconds
}

fetchNews();

  function calculatePinkTax() {
    const product = document.getElementById("productInput").value.trim().toLowerCase();
    const resultDiv = document.getElementById("result");

    if (!product) {
        resultDiv.innerHTML = "⚠️ Please enter a product name!";
        return;
    }

    // Sample data for price differences
    const pinkTaxData = {
        "razor": { men: 100, women: 130 },
        "shampoo": { men: 250, women: 290 },
        "deodorant": { men: 150, women: 180 },
        "perfume": { men: 800, women: 950 },
        "lotion": { men: 300, women: 350 },
    };

    if (!pinkTaxData[product]) {
        resultDiv.innerHTML = `❌ No data available for "${product}". Try another product.`;
        return;
    }

    const menPrice = pinkTaxData[product].men;
    const womenPrice = pinkTaxData[product].women;
    const pinkTax = ((womenPrice - menPrice) / menPrice) * 100;

    resultDiv.innerHTML = `
        🛒 Product: <b>${product.charAt(0).toUpperCase() + product.slice(1)}</b> <br>
        💰 Women's Price: ₹${womenPrice} <br>
        🏷️ Men's Price: ₹${menPrice} <br>
        📊 Pink Tax: <b>${pinkTax.toFixed(2)}%</b> 🚨
    `;
}
