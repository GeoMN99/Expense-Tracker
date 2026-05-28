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
