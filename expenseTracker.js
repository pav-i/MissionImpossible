const expenseContainer = document.getElementById('expense-tracker');
expenseContainer.innerHTML = `
    <h2>Expense Tracker</h2>
    <input type="file" id="file-input" accept=".csv">
    <table id="expense-table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Type</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
`;

document.getElementById('file-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const rows = e.target.result.split('\n').slice(1);
        const tbody = document.getElementById('expense-table').querySelector('tbody');
        tbody.innerHTML = '';

        rows.forEach(row => {
            const cols = row.split(',');
            const tr = document.createElement('tr');

            cols.forEach(col => {
                const td = document.createElement('td');
                td.textContent = col;
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });
    };

    reader.readAsText(file);
});
