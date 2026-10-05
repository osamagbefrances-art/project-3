// State Management
let transactions = JSON.parse(localStorage.getItem('expense_tracker_transactions')) || [];

// DOM Elements
const balanceAmount = document.getElementById('balance-amount');
const incomeAmount = document.getElementById('income-amount');
const expenseAmount = document.getElementById('expense-amount');
const transactionForm = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const transactionList = document.getElementById('transaction-list');
const filterSelect = document.getElementById('filter-select');

// LocalStorage Persistence
function saveTransactions() {
  localStorage.setItem('expense_tracker_transactions', JSON.stringify(transactions));
}

// 1. Calculate Metrics using Array.prototype.reduce()
function updateMetrics() {
  const amounts = transactions.map(t => t.amount);

  // Total Balance
  const totalBalance = amounts.reduce((acc, item) => acc + item, 0);

  // Total Income (filter positive amounts, then reduce)
  const totalIncome = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => acc + item, 0);

  // Total Expense (filter negative amounts, then reduce)
  const totalExpense = amounts
    .filter(item => item < 0)
    .reduce((acc, item) => acc + item, 0);

  // Render Metrics
  balanceAmount.textContent = `$${totalBalance.toFixed(2)}`;
  incomeAmount.textContent = `+$${totalIncome.toFixed(2)}`;
  expenseAmount.textContent = `-$${Math.abs(totalExpense).toFixed(2)}`;
}

// 2. Render Transaction List using Array.prototype.filter() and Array.prototype.map()
function renderTransactions() {
  transactionList.innerHTML = '';

  const filterValue = filterSelect.value;

  // Filter transactions based on type
  const filteredTransactions = transactions.filter(t => {
    if (filterValue === 'income') return t.amount > 0;
    if (filterValue === 'expense') return t.amount < 0;
    return true; // 'all'
  });

  if (filteredTransactions.length === 0) {
    transactionList.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #888;">No transactions found</td></tr>';
    return;
  }

  // Generate table rows dynamically
  filteredTransactions.forEach(t => {
    const isIncome = t.amount > 0;
    const row = document.createElement('tr');
    row.className = isIncome ? 'income-row' : 'expense-row';

    row.innerHTML = `
      <td>${t.description}</td>
      <td>${isIncome ? 'Income' : 'Expense'}</td>
      <td class="amount-text ${isIncome ? 'income' : 'expense'}">
        ${isIncome ? '+' : '-'}$${Math.abs(t.amount).toFixed(2)}
      </td>
      <td>
        <button class="delete-btn" onclick="deleteTransaction(${t.id})">Delete</button>
      </td>
    `;

    transactionList.appendChild(row);
  });
}

// 3. Add New Transaction
transactionForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (!description || isNaN(amount) || amount === 0) {
    alert('Please provide a valid description and non-zero amount.');
    return;
  }

  const newTransaction = {
    id: Date.now(),
    description,
    amount
  };

  transactions.push(newTransaction);
  saveTransactions();

  // Reset form
  descriptionInput.value = '';
  amountInput.value = '';

  // Refresh UI
  updateMetrics();
  renderTransactions();
});

// 4. Delete Transaction Entry
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveTransactions();

  updateMetrics();
  renderTransactions();
}

// 5. Filter Change Event Listener
filterSelect.addEventListener('change', renderTransactions);

// Initial App Setup
function init() {
  updateMetrics();
  renderTransactions();
}

init();