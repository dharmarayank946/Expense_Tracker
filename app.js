/**
 * INTERACTIVE EXPENSE TRACKER - APPLICATION LOGIC
 * Vanilla JavaScript (ES6+), DOM Manipulation, LocalStorage Persistence.
 */

'use strict';

// =============================================================================
// 1. CONSTANTS & CATEGORY DEFINITIONS
// =============================================================================

const STORAGE_KEY = 'EXPENSE_TRACKER_RECORDS_V1';
const CURRENCY_KEY = 'EXPENSE_TRACKER_CURRENCY_V1';

const CATEGORIES = {
  'Food & Dining': {
    icon: '🍔',
    color: '#ea580c',
    bg: '#fff7ed',
    border: '#ffedd5'
  },
  'Transportation': {
    icon: '🚗',
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#e0f2fe'
  },
  'Housing & Utilities': {
    icon: '🏠',
    color: '#9333ea',
    bg: '#faf5ff',
    border: '#f3e8ff'
  },
  'Entertainment': {
    icon: '🎬',
    color: '#db2777',
    bg: '#fdf2f8',
    border: '#fce7f3'
  },
  'Healthcare': {
    icon: '💊',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#d1fae5'
  },
  'Education': {
    icon: '📚',
    color: '#4f46e5',
    bg: '#eef2ff',
    border: '#e0e7ff'
  },
  'Shopping': {
    icon: '🛍️',
    color: '#0891b2',
    bg: '#ecfeff',
    border: '#cffafe'
  },
  'Personal Care': {
    icon: '✨',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fef3c7'
  },
  'Travel': {
    icon: '✈️',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#dbeafe'
  },
  'Miscellaneous': {
    icon: '📦',
    color: '#475569',
    bg: '#f1f5f9',
    border: '#e2e8f0'
  }
};

const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

// =============================================================================
// 2. APPLICATION STATE
// =============================================================================

const state = {
  expenses: [],
  editingId: null,
  currency: 'INR',
  filters: {
    search: '',
    category: 'ALL',
    period: 'all',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date-desc'
  },
  modalCallback: null
};

// =============================================================================
// 3. DOM ELEMENT REFERENCES
// =============================================================================

const elements = {
  // Header & Global Controls
  currencySelect: document.getElementById('currency-select'),
  btnLoadSample: document.getElementById('btn-load-sample'),
  btnClearAll: document.getElementById('btn-clear-all'),
  currencySymbols: document.querySelectorAll('.currency-symbol'),

  // Metrics
  metricTotalAmount: document.getElementById('metric-total-amount'),
  metricTotalSub: document.getElementById('metric-total-sub'),
  metricMonthAmount: document.getElementById('metric-month-amount'),
  metricMonthSub: document.getElementById('metric-month-sub'),
  metricTotalCount: document.getElementById('metric-total-count'),
  metricCountSub: document.getElementById('metric-count-sub'),
  metricAvgAmount: document.getElementById('metric-avg-amount'),
  metricAvgSub: document.getElementById('metric-avg-sub'),

  // Expense Form
  expenseForm: document.getElementById('expense-form'),
  formHeading: document.getElementById('form-heading'),
  formModeIcon: document.getElementById('form-mode-icon'),
  formModeTitle: document.getElementById('form-mode-title'),
  editIndicatorBadge: document.getElementById('edit-indicator-badge'),
  expenseIdInput: document.getElementById('expense-id'),
  expenseTitleInput: document.getElementById('expense-title'),
  expenseAmountInput: document.getElementById('expense-amount'),
  expenseCategorySelect: document.getElementById('expense-category'),
  expenseDateInput: document.getElementById('expense-date'),
  expenseNotesInput: document.getElementById('expense-notes'),
  btnSubmitExpense: document.getElementById('btn-submit-expense'),
  btnSubmitText: document.getElementById('btn-submit-text'),
  btnCancelEdit: document.getElementById('btn-cancel-edit'),

  // Error Feedback
  titleError: document.getElementById('title-error'),
  amountError: document.getElementById('amount-error'),
  categoryError: document.getElementById('category-error'),
  dateError: document.getElementById('date-error'),

  // Category Breakdown
  topCategoryPill: document.getElementById('top-category-pill'),
  categoryBreakdownContainer: document.getElementById('category-breakdown-container'),

  // Filters & Controls
  filterSearchInput: document.getElementById('filter-search-input'),
  btnClearSearch: document.getElementById('btn-clear-search'),
  filterCategorySelect: document.getElementById('filter-category-select'),
  sortSelect: document.getElementById('sort-select'),
  btnResetFilters: document.getElementById('btn-reset-filters'),
  datePills: document.querySelectorAll('.date-pill'),
  customDateRange: document.getElementById('custom-date-range'),
  filterDateFrom: document.getElementById('filter-date-from'),
  filterDateTo: document.getElementById('filter-date-to'),

  // Expense Listing
  listSummaryCaption: document.getElementById('list-summary-caption'),
  filteredTotalPill: document.getElementById('filtered-total-pill'),
  expenseListContainer: document.getElementById('expense-list-container'),
  emptyState: document.getElementById('empty-state'),
  emptyStateTitle: document.getElementById('empty-state-title'),
  emptyStateDesc: document.getElementById('empty-state-desc'),
  btnEmptyDemo: document.getElementById('btn-empty-demo'),

  // Confirmation Modal
  confirmModal: document.getElementById('confirm-modal'),
  modalTitle: document.getElementById('modal-title'),
  modalMessage: document.getElementById('modal-message'),
  btnModalClose: document.getElementById('btn-modal-close'),
  btnModalCancel: document.getElementById('btn-modal-cancel'),
  btnModalConfirm: document.getElementById('btn-modal-confirm'),

  // Toast Container
  toastContainer: document.getElementById('toast-container')
};

// =============================================================================
// 4. STORAGE FUNCTIONS
// =============================================================================

/**
 * Loads expenses and currency settings from browser LocalStorage
 */
function loadStateFromStorage() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        state.expenses = parsed.map(sanitizeExpense);
      }
    }

    const savedCurrency = localStorage.getItem(CURRENCY_KEY);
    if (savedCurrency && CURRENCY_SYMBOLS[savedCurrency]) {
      state.currency = savedCurrency;
      if (elements.currencySelect) {
        elements.currencySelect.value = savedCurrency;
      }
    }
  } catch (error) {
    console.error('Failed to load records from LocalStorage:', error);
    showToast('Failed to load saved records. Using fresh session.', 'danger');
    state.expenses = [];
  }
}

/**
 * Persists current expense records to LocalStorage
 */
function saveExpensesToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.expenses));
  } catch (error) {
    console.error('Failed to save records to LocalStorage:', error);
    showToast('Storage quota exceeded or storage unavailable!', 'danger');
  }
}

/**
 * Persists selected currency preference to LocalStorage
 */
function saveCurrencyToStorage() {
  try {
    localStorage.setItem(CURRENCY_KEY, state.currency);
  } catch (error) {
    console.error('Failed to save currency to LocalStorage:', error);
  }
}

/**
 * Sanitizes an expense record ensuring valid data types
 */
function sanitizeExpense(item) {
  return {
    id: String(item.id || generateUniqueId()),
    title: String(item.title || 'Untitled Expense').trim(),
    amount: Math.max(0, parseFloat(item.amount) || 0),
    category: CATEGORIES[item.category] ? item.category : 'Miscellaneous',
    date: item.date && !isNaN(Date.parse(item.date)) ? item.date : getTodayDateString(),
    notes: String(item.notes || '').trim(),
    createdAt: item.createdAt || new Date().toISOString()
  };
}

// =============================================================================
// 5. HELPER UTILITIES
// =============================================================================

function generateUniqueId() {
  return 'exp_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
}

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatCurrency(amount) {
  const symbol = CURRENCY_SYMBOLS[state.currency] || '₹';
  const formatted = Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `${symbol}${formatted}`;
}

function formatDateDisplay(dateString) {
  if (!dateString) return 'No date';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// =============================================================================
// 6. SAMPLE DEMO DATA SEEDER
// =============================================================================

function getSampleExpenses() {
  const today = new Date();
  const makeDate = (daysAgo) => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  return [
    {
      id: generateUniqueId(),
      title: 'Weekly Grocery Shopping',
      amount: 2450.00,
      category: 'Food & Dining',
      date: makeDate(0),
      notes: 'Supermarket supplies & vegetables',
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Monthly Metro SmartCard',
      amount: 1200.00,
      category: 'Transportation',
      date: makeDate(1),
      notes: 'Work commute pass',
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'High-Speed Fiber Broadband',
      amount: 1179.00,
      category: 'Housing & Utilities',
      date: makeDate(3),
      notes: 'Monthly billing',
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Movie Tickets & Snacks',
      amount: 850.00,
      category: 'Entertainment',
      date: makeDate(5),
      notes: 'Weekend IMAX show',
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Prescription Medicines',
      amount: 620.00,
      category: 'Healthcare',
      date: makeDate(8),
      notes: 'Routine health check supplements',
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'JavaScript Masterclass Book',
      amount: 1499.00,
      category: 'Education',
      date: makeDate(12),
      notes: 'Technical reference book',
      createdAt: new Date().toISOString()
    }
  ];
}

// =============================================================================
// 7. FORM VALIDATION & SUBMISSION
// =============================================================================

function validateForm() {
  let isValid = true;

  // Clear previous errors
  clearErrors();

  const titleVal = elements.expenseTitleInput.value.trim();
  const amountVal = parseFloat(elements.expenseAmountInput.value);
  const categoryVal = elements.expenseCategorySelect.value;
  const dateVal = elements.expenseDateInput.value;

  // Validate Title
  if (!titleVal) {
    showError(elements.expenseTitleInput, elements.titleError, 'Please enter an expense title.');
    isValid = false;
  } else if (titleVal.length < 2) {
    showError(elements.expenseTitleInput, elements.titleError, 'Title must be at least 2 characters.');
    isValid = false;
  }

  // Validate Amount
  if (isNaN(amountVal) || amountVal <= 0) {
    showError(elements.expenseAmountInput, elements.amountError, 'Please enter a valid amount greater than 0.');
    isValid = false;
  } else if (amountVal > 10000000) {
    showError(elements.expenseAmountInput, elements.amountError, 'Amount exceeds maximum allowable limit.');
    isValid = false;
  }

  // Validate Category
  if (!categoryVal || !CATEGORIES[categoryVal]) {
    showError(elements.expenseCategorySelect, elements.categoryError, 'Please select a valid category.');
    isValid = false;
  }

  // Validate Date
  if (!dateVal) {
    showError(elements.expenseDateInput, elements.dateError, 'Please select a transaction date.');
    isValid = false;
  }

  return isValid;
}

function showError(inputEl, errorEl, message) {
  inputEl.classList.add('is-invalid');
  if (errorEl) {
    errorEl.textContent = message;
  }
}

function clearErrors() {
  [
    elements.expenseTitleInput,
    elements.expenseAmountInput,
    elements.expenseCategorySelect,
    elements.expenseDateInput
  ].forEach(input => {
    if (input) input.classList.remove('is-invalid');
  });

  [
    elements.titleError,
    elements.amountError,
    elements.categoryError,
    elements.dateError
  ].forEach(error => {
    if (error) error.textContent = '';
  });
}

function handleFormSubmit(e) {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const title = elements.expenseTitleInput.value.trim();
  const amount = parseFloat(elements.expenseAmountInput.value);
  const category = elements.expenseCategorySelect.value;
  const date = elements.expenseDateInput.value;
  const notes = elements.expenseNotesInput.value.trim();

  if (state.editingId) {
    // Update existing expense
    const index = state.expenses.findIndex(exp => exp.id === state.editingId);
    if (index !== -1) {
      state.expenses[index] = {
        ...state.expenses[index],
        title,
        amount,
        category,
        date,
        notes,
        updatedAt: new Date().toISOString()
      };
      saveExpensesToStorage();
      showToast('Expense updated successfully!', 'success');
    }
    cancelEditMode();
  } else {
    // Add new expense
    const newExpense = {
      id: generateUniqueId(),
      title,
      amount,
      category,
      date,
      notes,
      createdAt: new Date().toISOString()
    };
    state.expenses.unshift(newExpense);
    saveExpensesToStorage();
    resetForm();
    showToast('New expense recorded!', 'success');
  }

  renderApp();
}

function resetForm() {
  elements.expenseForm.reset();
  elements.expenseIdInput.value = '';
  elements.expenseDateInput.value = getTodayDateString();
  clearErrors();
}

function startEditExpense(id) {
  const expense = state.expenses.find(exp => exp.id === id);
  if (!expense) return;

  state.editingId = id;
  elements.expenseIdInput.value = expense.id;
  elements.expenseTitleInput.value = expense.title;
  elements.expenseAmountInput.value = expense.amount;
  elements.expenseCategorySelect.value = expense.category;
  elements.expenseDateInput.value = expense.date;
  elements.expenseNotesInput.value = expense.notes || '';

  // Update UI to edit mode
  elements.formModeIcon.textContent = '✏️';
  elements.formModeTitle.textContent = 'Edit Expense';
  elements.btnSubmitText.textContent = 'Update Expense';
  elements.btnCancelEdit.hidden = false;
  elements.editIndicatorBadge.hidden = false;

  // Scroll form into view smoothly
  elements.expenseForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  elements.expenseTitleInput.focus();

  renderExpenseList();
}

function cancelEditMode() {
  state.editingId = null;
  resetForm();
  elements.formModeIcon.textContent = '➕';
  elements.formModeTitle.textContent = 'Add New Expense';
  elements.btnSubmitText.textContent = 'Add Expense';
  elements.btnCancelEdit.hidden = true;
  elements.editIndicatorBadge.hidden = true;
  renderExpenseList();
}

// =============================================================================
// 8. DELETION & MODAL DIALOGS
// =============================================================================

function promptDeleteExpense(id) {
  const expense = state.expenses.find(exp => exp.id === id);
  if (!expense) return;

  openModal({
    title: 'Delete Expense',
    message: `Are you sure you want to permanently delete "${escapeHtml(expense.title)}" (${formatCurrency(expense.amount)})?`,
    confirmText: 'Delete Expense',
    onConfirm: () => {
      state.expenses = state.expenses.filter(exp => exp.id !== id);
      if (state.editingId === id) {
        cancelEditMode();
      }
      saveExpensesToStorage();
      showToast('Expense record deleted.', 'warning');
      renderApp();
    }
  });
}

function promptClearAllExpenses() {
  if (state.expenses.length === 0) {
    showToast('There are no expenses to clear.', 'warning');
    return;
  }

  openModal({
    title: 'Clear All Expenses',
    message: `This will permanently delete all ${state.expenses.length} recorded expenses. This action cannot be undone. Do you wish to continue?`,
    confirmText: 'Clear Everything',
    onConfirm: () => {
      state.expenses = [];
      cancelEditMode();
      saveExpensesToStorage();
      showToast('All expense records cleared.', 'danger');
      renderApp();
    }
  });
}

function openModal({ title, message, confirmText, onConfirm }) {
  elements.modalTitle.textContent = title;
  elements.modalMessage.textContent = message;
  elements.btnModalConfirm.textContent = confirmText || 'Confirm';
  state.modalCallback = onConfirm;
  elements.confirmModal.hidden = false;
  elements.btnModalConfirm.focus();
}

function closeModal() {
  elements.confirmModal.hidden = true;
  state.modalCallback = null;
}

// =============================================================================
// 9. FILTERING, SORTING & SEARCH ENGINE
// =============================================================================

function getFilteredAndSortedExpenses() {
  let list = [...state.expenses];

  // 1. Search filter
  const query = state.filters.search.toLowerCase().trim();
  if (query) {
    list = list.filter(exp => 
      exp.title.toLowerCase().includes(query) ||
      (exp.notes && exp.notes.toLowerCase().includes(query)) ||
      exp.category.toLowerCase().includes(query)
    );
  }

  // 2. Category filter
  if (state.filters.category !== 'ALL') {
    list = list.filter(exp => exp.category === state.filters.category);
  }

  // 3. Date / Period filter
  const todayStr = getTodayDateString();
  const todayObj = new Date();

  switch (state.filters.period) {
    case 'today':
      list = list.filter(exp => exp.date === todayStr);
      break;

    case 'week': {
      // Current week (Monday to Sunday)
      const dayOfWeek = todayObj.getDay() || 7; // Sunday = 7
      const monday = new Date(todayObj);
      monday.setDate(todayObj.getDate() - dayOfWeek + 1);
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      list = list.filter(exp => {
        const d = new Date(exp.date);
        return d >= monday && d <= sunday;
      });
      break;
    }

    case 'month': {
      const year = todayObj.getFullYear();
      const month = todayObj.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0, 23, 59, 59);

      list = list.filter(exp => {
        const d = new Date(exp.date);
        return d >= firstDay && d <= lastDay;
      });
      break;
    }

    case 'custom': {
      if (state.filters.dateFrom) {
        list = list.filter(exp => exp.date >= state.filters.dateFrom);
      }
      if (state.filters.dateTo) {
        list = list.filter(exp => exp.date <= state.filters.dateTo);
      }
      break;
    }

    case 'all':
    default:
      // No date restriction
      break;
  }

  // 4. Sorting
  list.sort((a, b) => {
    switch (state.filters.sortBy) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'amount-desc':
        return b.amount - a.amount;
      case 'amount-asc':
        return a.amount - b.amount;
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  return list;
}

function resetAllFilters() {
  state.filters.search = '';
  state.filters.category = 'ALL';
  state.filters.period = 'all';
  state.filters.dateFrom = '';
  state.filters.dateTo = '';
  state.filters.sortBy = 'date-desc';

  // Update DOM control inputs
  elements.filterSearchInput.value = '';
  elements.btnClearSearch.hidden = true;
  elements.filterCategorySelect.value = 'ALL';
  elements.sortSelect.value = 'date-desc';
  elements.filterDateFrom.value = '';
  elements.filterDateTo.value = '';
  elements.customDateRange.hidden = true;

  elements.datePills.forEach(pill => {
    pill.classList.toggle('active', pill.dataset.period === 'all');
  });

  showToast('Filters reset to default view.', 'success');
  renderApp();
}

// =============================================================================
// 10. RENDERING FUNCTIONS
// =============================================================================

function renderApp() {
  updateCurrencyDisplay();
  renderDashboardMetrics();
  renderCategoryBreakdown();
  renderExpenseList();
}

function updateCurrencyDisplay() {
  const symbol = CURRENCY_SYMBOLS[state.currency] || '₹';
  elements.currencySymbols.forEach(el => {
    el.textContent = symbol;
  });
}

function renderDashboardMetrics() {
  const total = state.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const count = state.expenses.length;
  const avg = count > 0 ? total / count : 0;

  // Calculate current month total
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const monthTotal = state.expenses.reduce((sum, exp) => {
    const [y, m] = exp.date.split('-').map(Number);
    if (y === currentYear && m === (currentMonth + 1)) {
      return sum + exp.amount;
    }
    return sum;
  }, 0);

  elements.metricTotalAmount.textContent = formatCurrency(total);
  elements.metricTotalSub.textContent = `${count} total recorded item${count === 1 ? '' : 's'}`;

  elements.metricMonthAmount.textContent = formatCurrency(monthTotal);
  elements.metricMonthSub.textContent = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  elements.metricTotalCount.textContent = count.toLocaleString();
  elements.metricCountSub.textContent = count > 0 ? 'Active transactions' : 'No records yet';

  elements.metricAvgAmount.textContent = formatCurrency(avg);
  elements.metricAvgSub.textContent = count > 0 ? 'Average per expense' : 'Calculated on data';
}

function renderCategoryBreakdown() {
  const totalsByCategory = {};
  let totalSpending = 0;

  // Initialize all known categories with 0
  Object.keys(CATEGORIES).forEach(cat => {
    totalsByCategory[cat] = 0;
  });

  state.expenses.forEach(exp => {
    const cat = exp.category || 'Miscellaneous';
    totalsByCategory[cat] = (totalsByCategory[cat] || 0) + exp.amount;
    totalSpending += exp.amount;
  });

  // Sort categories by highest spend
  const sortedCategories = Object.entries(totalsByCategory)
    .filter(([_, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1]);

  // Update top spending category pill
  if (sortedCategories.length > 0) {
    const topCat = sortedCategories[0][0];
    elements.topCategoryPill.textContent = `Top: ${CATEGORIES[topCat].icon} ${topCat}`;
  } else {
    elements.topCategoryPill.textContent = 'Top: None';
  }

  // Render Category Breakdown Rows
  if (sortedCategories.length === 0) {
    elements.categoryBreakdownContainer.innerHTML = `
      <div class="empty-breakdown">
        No expense data to analyze yet.<br>
        Add expenses or load demo data to view category breakdowns.
      </div>
    `;
    return;
  }

  const html = sortedCategories.map(([category, amount]) => {
    const percent = totalSpending > 0 ? ((amount / totalSpending) * 100).toFixed(1) : '0.0';
    const catConfig = CATEGORIES[category] || CATEGORIES['Miscellaneous'];

    return `
      <div class="breakdown-row">
        <div class="breakdown-info">
          <span class="breakdown-label">
            <span class="category-dot" style="background-color: ${catConfig.color}"></span>
            <span>${catConfig.icon} ${escapeHtml(category)}</span>
          </span>
          <span class="breakdown-values">
            ${formatCurrency(amount)}
            <span class="breakdown-percent">(${percent}%)</span>
          </span>
        </div>
        <div class="breakdown-bar-bg" aria-hidden="true">
          <div class="breakdown-bar-fill" style="width: ${percent}%; background-color: ${catConfig.color}"></div>
        </div>
      </div>
    `;
  }).join('');

  elements.categoryBreakdownContainer.innerHTML = html;
}

function renderExpenseList() {
  const filtered = getFilteredAndSortedExpenses();
  const totalFilteredAmount = filtered.reduce((sum, exp) => sum + exp.amount, 0);

  // Update Filtered Total Pill
  elements.filteredTotalPill.textContent = `Filtered Total: ${formatCurrency(totalFilteredAmount)}`;

  // Update List Caption
  if (state.expenses.length === 0) {
    elements.listSummaryCaption.textContent = 'No expenses recorded yet';
  } else if (filtered.length === state.expenses.length) {
    elements.listSummaryCaption.textContent = `Showing all ${filtered.length} expenses`;
  } else {
    elements.listSummaryCaption.textContent = `Showing ${filtered.length} of ${state.expenses.length} filtered expenses`;
  }

  // Handle Empty State
  if (filtered.length === 0) {
    elements.expenseListContainer.innerHTML = '';
    elements.emptyState.hidden = false;

    if (state.expenses.length === 0) {
      elements.emptyStateTitle.textContent = 'No Expenses Recorded';
      elements.emptyStateDesc.textContent = 'You haven\'t added any expenses yet. Fill out the form above to record your first transaction, or load demo data!';
      elements.btnEmptyDemo.hidden = false;
    } else {
      elements.emptyStateTitle.textContent = 'No Matching Records';
      elements.emptyStateDesc.textContent = 'No expenses match your current search, category, or date range filters. Try resetting your filters.';
      elements.btnEmptyDemo.hidden = true;
    }
    return;
  }

  elements.emptyState.hidden = true;

  // Build List Items HTML
  const itemsHtml = filtered.map(expense => {
    const cat = CATEGORIES[expense.category] || CATEGORIES['Miscellaneous'];
    const isEditing = expense.id === state.editingId;

    return `
      <article class="expense-item ${isEditing ? 'is-editing' : ''}" data-id="${expense.id}">
        <div class="item-left">
          <div class="category-icon-badge" style="background-color: ${cat.bg}; color: ${cat.color}; border: 1px solid ${cat.border}" aria-hidden="true">
            ${cat.icon}
          </div>
          <div class="item-details">
            <h3 class="item-title" title="${escapeHtml(expense.title)}">${escapeHtml(expense.title)}</h3>
            <div class="item-meta">
              <span class="item-category-pill" style="background-color: ${cat.bg}; color: ${cat.color}">
                ${cat.icon} ${escapeHtml(expense.category)}
              </span>
              <span class="item-date">📅 ${formatDateDisplay(expense.date)}</span>
              ${expense.notes ? `<span class="item-note-pill" title="Note">${escapeHtml(expense.notes)}</span>` : ''}
            </div>
          </div>
        </div>

        <div class="item-right">
          <span class="item-amount">${formatCurrency(expense.amount)}</span>
          <div class="item-actions">
            <button 
              type="button" 
              class="btn-icon-action edit-action" 
              data-action="edit" 
              data-id="${expense.id}" 
              title="Edit expense"
              aria-label="Edit ${escapeHtml(expense.title)}"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button 
              type="button" 
              class="btn-icon-action delete-action" 
              data-action="delete" 
              data-id="${expense.id}" 
              title="Delete expense"
              aria-label="Delete ${escapeHtml(expense.title)}"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  elements.expenseListContainer.innerHTML = itemsHtml;
}

// =============================================================================
// 11. TOAST NOTIFICATIONS
// =============================================================================

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'status');

  const iconSvg = type === 'success' 
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>'
    : type === 'danger'
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

  toast.innerHTML = `
    <span class="toast-icon" aria-hidden="true">${iconSvg}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
  `;

  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-hiding');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3200);
}

// =============================================================================
// 12. EVENT LISTENERS SETUP
// =============================================================================

function setupEventListeners() {
  // Form submission & Cancel
  elements.expenseForm.addEventListener('submit', handleFormSubmit);
  elements.btnCancelEdit.addEventListener('click', cancelEditMode);

  // Real-time input error removal
  elements.expenseTitleInput.addEventListener('input', () => {
    if (elements.expenseTitleInput.value.trim().length >= 2) {
      elements.expenseTitleInput.classList.remove('is-invalid');
      elements.titleError.textContent = '';
    }
  });

  elements.expenseAmountInput.addEventListener('input', () => {
    const val = parseFloat(elements.expenseAmountInput.value);
    if (!isNaN(val) && val > 0 && val <= 10000000) {
      elements.expenseAmountInput.classList.remove('is-invalid');
      elements.amountError.textContent = '';
    }
  });

  elements.expenseCategorySelect.addEventListener('change', () => {
    if (elements.expenseCategorySelect.value) {
      elements.expenseCategorySelect.classList.remove('is-invalid');
      elements.categoryError.textContent = '';
    }
  });

  elements.expenseDateInput.addEventListener('input', () => {
    if (elements.expenseDateInput.value) {
      elements.expenseDateInput.classList.remove('is-invalid');
      elements.dateError.textContent = '';
    }
  });

  // Currency Selector
  elements.currencySelect.addEventListener('change', (e) => {
    state.currency = e.target.value;
    saveCurrencyToStorage();
    renderApp();
    showToast(`Currency changed to ${state.currency}`, 'info');
  });

  // Demo Data Buttons
  elements.btnLoadSample.addEventListener('click', () => {
    state.expenses = getSampleExpenses();
    cancelEditMode();
    saveExpensesToStorage();
    showToast('Loaded 6 demo expense records!', 'success');
    renderApp();
  });

  elements.btnEmptyDemo.addEventListener('click', () => {
    state.expenses = getSampleExpenses();
    cancelEditMode();
    saveExpensesToStorage();
    showToast('Loaded 6 demo expense records!', 'success');
    renderApp();
  });

  // Clear All Button
  elements.btnClearAll.addEventListener('click', promptClearAllExpenses);

  // Search input filter
  elements.filterSearchInput.addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    elements.btnClearSearch.hidden = !e.target.value;
    renderExpenseList();
  });

  elements.btnClearSearch.addEventListener('click', () => {
    elements.filterSearchInput.value = '';
    state.filters.search = '';
    elements.btnClearSearch.hidden = true;
    renderExpenseList();
    elements.filterSearchInput.focus();
  });

  // Category filter select
  elements.filterCategorySelect.addEventListener('change', (e) => {
    state.filters.category = e.target.value;
    renderExpenseList();
  });

  // Sort select
  elements.sortSelect.addEventListener('change', (e) => {
    state.filters.sortBy = e.target.value;
    renderExpenseList();
  });

  // Date Presets Pills
  elements.datePills.forEach(pill => {
    pill.addEventListener('click', () => {
      elements.datePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const period = pill.dataset.period;
      state.filters.period = period;

      if (period === 'custom') {
        elements.customDateRange.hidden = false;
      } else {
        elements.customDateRange.hidden = true;
      }

      renderExpenseList();
    });
  });

  // Custom date range inputs
  elements.filterDateFrom.addEventListener('change', (e) => {
    state.filters.dateFrom = e.target.value;
    renderExpenseList();
  });

  elements.filterDateTo.addEventListener('change', (e) => {
    state.filters.dateTo = e.target.value;
    renderExpenseList();
  });

  // Reset Filters Button
  elements.btnResetFilters.addEventListener('click', resetAllFilters);

  // Expense List Event Delegation (Edit & Delete)
  elements.expenseListContainer.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-action]');
    if (!actionBtn) return;

    const action = actionBtn.dataset.action;
    const id = actionBtn.dataset.id;

    if (action === 'edit') {
      startEditExpense(id);
    } else if (action === 'delete') {
      promptDeleteExpense(id);
    }
  });

  // Modal Dialog Actions
  elements.btnModalClose.addEventListener('click', closeModal);
  elements.btnModalCancel.addEventListener('click', closeModal);
  elements.btnModalConfirm.addEventListener('click', () => {
    if (typeof state.modalCallback === 'function') {
      state.modalCallback();
    }
    closeModal();
  });

  // Close modal on Escape key or outside click
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !elements.confirmModal.hidden) {
      closeModal();
    }
  });

  elements.confirmModal.addEventListener('click', (e) => {
    if (e.target === elements.confirmModal) {
      closeModal();
    }
  });
}

// =============================================================================
// 13. APPLICATION INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Set default date input to today
  if (elements.expenseDateInput) {
    elements.expenseDateInput.value = getTodayDateString();
  }

  // Load persisted state from LocalStorage
  loadStateFromStorage();

  // If newly initialized with 0 expenses, load demo data automatically for immediate interactivity
  if (state.expenses.length === 0) {
    state.expenses = getSampleExpenses();
    saveExpensesToStorage();
  }

  // Attach event handlers
  setupEventListeners();

  // Initial render
  renderApp();
});

