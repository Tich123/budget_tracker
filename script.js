const balance = document.getElementById('balance');
const incomeTotal = document.getElementById('income-total');
const expensesTotal = document.getElementById('expenses-total');
const incomeTableBody = document.getElementById('income-table').getElementsByTagName('tbody')[0];
const expensesTableBody = document.getElementById('expenses-table').getElementsByTagName('tbody')[0];
const transactionForm = document.getElementById('transaction-form');
const typeInput = document.getElementById('type');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');

// Authentication elements
const authContainer = document.getElementById('auth-container');
const budgetContainer = document.getElementById('budget-container');
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const signupUsernameInput = document.getElementById('signup-username');
const signupPasswordInput = document.getElementById('signup-password');
const loginUsernameInput = document.getElementById('login-username');
const loginPasswordInput = document.getElementById('login-password');

// Initialize localStorage for users and transactions
let users = JSON.parse(localStorage.getItem('users')) || [];
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function init() {
    incomeTableBody.innerHTML = '';
    expensesTableBody.innerHTML = '';

    transactions.forEach(transaction => addTransactionToDOM(transaction));
    updateTotals();
}

function addTransactionToDOM(transaction) {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${transaction.date}</td><td>${transaction.text}</td><td>$${transaction.amount.toFixed(2)}</td>`;

    if (transaction.type === 'income') {
        incomeTableBody.appendChild(row);
    } else if (transaction.type === 'expense') {
        expensesTableBody.appendChild(row);
    }
}

function updateTotals() {
    const totalIncome = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((acc, transaction) => acc + transaction.amount, 0)
        .toFixed(2);

    const totalExpenses = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((acc, transaction) => acc + transaction.amount, 0)
        .toFixed(2);

    const totalBalance = (totalIncome - totalExpenses).toFixed(2);

    balance.innerText = totalBalance;
    incomeTotal.innerText = totalIncome;
    expensesTotal.innerText = totalExpenses;
}

function addTransaction(e) {
    e.preventDefault();

    if (textInput.value.trim() === '' || amountInput.value.trim() === '') {
        alert('Please fill in both the description and amount.');
        return;
    }

    const transaction = {
        id: generateID(),
        type: typeInput.value,
        text: textInput.value,
        amount: parseFloat(amountInput.value),
        date: new Date().toLocaleDateString() // Adding the current date
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    addTransactionToDOM(transaction);
    updateTotals();

    // Clear form fields
    textInput.value = '';
    amountInput.value = '';
}

function generateID() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function signup(e) {
    e.preventDefault();
    
    const username = signupUsernameInput.value.trim();
    const password = signupPasswordInput.value.trim();

    if (username === '' || password === '') {
        alert('Please fill in both the username and password.');
        return;
    }

    if (users.some(user => user.username === username)) {
        alert('Username already exists. Please choose a different username.');
        return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Signup successful. Please log in.');
}

function login(e) {
    e.preventDefault();
    
    const username = loginUsernameInput.value.trim();
    const password = loginPasswordInput.value.trim();

    if (users.some(user => user.username === username && user.password === password)) {
        authContainer.style.display = 'none';
        budgetContainer.style.display = 'block';
        init();
    } else {
        alert('Incorrect username or password. Please try again.');
    }
}

signupForm.addEventListener('submit', signup);
loginForm.addEventListener('submit', login);
transactionForm.addEventListener('submit', addTransaction);
