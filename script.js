// State
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let budget = parseFloat(localStorage.getItem('budget')) || [];
let editingId = null;
let chart = null;

// Elements
const budgetInput = document.getElementById('budgetInput');
const setBudgetBtn = document.getElementById('setBudgetBtn');
const totalBudgetEl = document.getElementById('totalBudget');
const totalSpentEl = document.getElementById('totalSpent');
const remainingEl = document.getElementById('remaining');
const progressBar =document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');

const expenseName = document.getElementById('expenseName');
const expenseAmount = document.getElementById('expenseAmount');
const expenseCategory = document.getElementById('expenseCategory');
const expenseDate = document.getElementById('expenseDate');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const formError = document.getElementById('formError');
const formTitle = document.getElementById('formTitle');

const searchInput = document.getElementById('searchInput');
const filterCategory = document.getElementById('filterCategory');
const exportBtn = document.getElementById('exportBtn');
const expenseList = document.getElementById('expenseList');

// Init
window.addEventListener('load', () => {
    if (budget > 0) budgetInput.value = budget;
    expenseDate.value = new Date().toISOString().split('T')[0];
    render(); 
});

// Budget
setBudgetBtn.addEventListener('click', () => {
    const value = parseFloat(budgetInput.value);
    if (!value || value <= 0) return;
    budget = value;
    localStorage.setItem('budget', budget);
    render();
});

// Add/Edit Expense
addExpenseBtn.addEventListener('click', () => {
    const name = expenseName.value.trim();
    const amount = parseFloat(expenseAmount.value);
    const category = expenseCategory.value;
    const date = expenseDate.value;

    if (!name || !amount || !category || !date) {
        showFormError('Please fill in all fields.');
        return;
    }

    if (amount <= 0) {
        showFormError('Amount must be greater than 0.');
        return;
    }

    hideFormError();

    if (editingId) {
        // Update existing expense
        expenses = expenses.map(e =>
            e.id === editingId ? { ...e, name, amount, category, date } : e
        );
        editingId = null;
        addExpenseBtn.textContent = 'Add Expense';
        formTitle.textContent = '➕ Add Expense';
        cancelEditBtn.classList.add('hidden');
    } else {
        // Add new expense
        const expense = {
            id: Date.now().toISOString(),
            name,
            amount,
            category,
            date
        };
        expenses.unshift(expense);
    }

    saveAndRender();
    clearForm();
});

cancelEditBtn.addEventListener('click', () => {
    editingId = null;
    addExpenseBtn.textContent = 'Add Expense';
    formTitle.textContent = '➕ Add Expense';
    cancelEditBtn.classList.add('hidden');
    clearForm();
    hideFormError();
});

// Filter & Search
searchInput.addEventListener('input', render);
filterCategory.addEventListener('change', render);

// Export CSV
exportBtn.addEventListener('click', () => {
    if (expenses.length === 0) return;

    const headers = ['Name', 'Amount (KES)', 'Category', 'Date'];
    const rows = expenses.map(e => [e.name, e.amount, e.category, e.date]);
    const csvContent = [headers, ...rows]
        .map(row => row.join(','))
        .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    URL.revokeObjectURL(url);
});