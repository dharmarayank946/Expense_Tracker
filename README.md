# Interactive Expense Tracker Web Application

> A modern, responsive, browser-based personal finance management application built with vanilla JavaScript, modern CSS, semantic HTML5, and LocalStorage persistence.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla%20ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Status](https://img.shields.io/badge/Status-Completed%20%26%20Verified-success.svg)]()

---

## 📌 Project Overview

The **Interactive Expense Tracker Web Application** is a client-side web application designed to help individuals track, organize, and analyze their daily expenditures. It allows users to record transactions with categorical classifications, search and filter history across date periods and categories, dynamically sort records, and monitor real-time financial summaries including total spend, monthly expenditure, and category-wise spending distribution.

All transaction data is automatically persisted in the browser's **LocalStorage**, ensuring that financial records remain intact across browser refreshes and sessions without requiring external servers or accounts.

---

## ✨ Features & Capabilities

### 1. Expense Entry & Management
- **Add Expenses:** Record transactions with Title, Amount, Category, Date, and optional Notes/Tags.
- **Form Validation:** Real-time feedback for required fields, character length restrictions, and positive numeric amounts.
- **Inline Editing Mode:** Edit any recorded transaction with smooth scroll-to-form focus, clear visual indicators, and a one-click Cancel option.
- **Record Deletion:** Delete individual records or reset all transactions with a protective confirmation modal dialog to avoid accidental data loss.

### 2. Dashboard Analytics & Real-Time Metrics
- **Total Expenses:** Automatically sums total expenditure across all recorded transactions.
- **Current Month Total:** Aggregates transactions that occurred within the active calendar month.
- **Transaction Count:** Displays the total count of active transactions.
- **Average Spend:** Computes the mathematical average expenditure per transaction.
- **Category Breakdown:** Visual horizontal progress bars depicting the exact amount and percentage distribution of expenses across 10 core categories.
- **Top Spending Category:** Dynamically highlights the user's highest spending category badge.

### 3. Filtering, Searching & Sorting
- **Keyword Search:** Instant live filtering by matching terms within expense titles, notes, or categories.
- **Category Filtering:** Filter transactions by specific categories or view all records.
- **Quick Date Presets:** One-click filtering for **All Time**, **Today**, **This Week**, and **This Month**.
- **Custom Date Range:** Select custom "From" and "To" dates for historical audits.
- **Multi-Attribute Sorting:**
  - Date (Newest First / Oldest First)
  - Amount (Highest First / Lowest First)
  - Title Alphabetical (A to Z / Z to A)
- **One-Click Filter Reset:** Instantly resets all query parameters and date ranges to default.

### 4. Customization & Data Persistence
- **Multi-Currency Support:** Switch between **INR (₹)**, **USD ($)**, **EUR (€)**, and **GBP (£)** with automatic symbol updates.
- **Demo Data Loader:** Instantly populate realistic sample transactions with a single click.
- **LocalStorage Engine:** Safe JSON serialization and deserialization with error fallback handling.

---

## 🛠️ Technologies Used

- **HTML5:** Semantic document outline, accessible forms, ARIA attributes, skip links.
- **CSS3:** Custom properties (CSS variables), CSS Grid, Flexbox, smooth transitions, mobile-first responsive media queries.
- **Vanilla JavaScript (ES6+):** Modular state management, DOM manipulation, custom event listeners, array methods (`map`, `filter`, `reduce`, `sort`).
- **Web Storage API:** LocalStorage for browser-based data persistence.
- **Git & GitHub:** Version control, branch tracking, and remote code repository.

---

## 📂 Project Folder Structure

```text
Expense_Tracker/
├── index.html                      # Semantic markup, accessible layout & modal
├── styles.css                      # Modern CSS design system, responsive styles
├── app.js                          # Core JavaScript application logic & state
├── README.md                       # Complete repository documentation
├── PROJECT_REPORT.md               # Comprehensive technical project report
└── assets/
    └── screenshots/                # Application verification captures
        ├── expense-tracker-desktop.png
        ├── expense-tracker-tablet.png
        └── expense-tracker-mobile.png
```

---

## 🚀 How to Run the Project Locally

Because the application is built entirely with client-side standards, no build pipelines, package managers, or server runtimes are mandatory.

### Option 1: Direct Browser Launch
1. Clone or download this repository:
   ```bash
   git clone https://github.com/dharmarayank946/Expense_Tracker.git
   ```
2. Navigate into the project folder:
   ```bash
   cd Expense_Tracker
   ```
3. Open `index.html` directly in any modern browser (Chrome, Firefox, Safari, Edge).

### Option 2: Run with a Local Static Server (Recommended)
Using Python:
```bash
# Python 3
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

Using Node.js (`npx serve`):
```bash
npx serve .
```

---

## 📱 Verification & Screenshots

| Viewport | Dimension | Verification Status |
| :--- | :--- | :--- |
| **Desktop** | 1440 × 900 px | Verified (Full dashboard, metrics, breakdown, list) |
| **Tablet** | 768 × 1024 px | Verified (Adaptive 2-column metrics, responsive cards) |
| **Mobile** | 375 × 812 px | Verified (Single-column layout, touch-friendly buttons) |

Verified screenshots are located in `assets/screenshots/`.

---

## 🔗 Repository Information

- **GitHub Repository:** [https://github.com/dharmarayank946/Expense_Tracker.git](https://github.com/dharmarayank946/Expense_Tracker.git)
- **Primary Branch:** `main`
- **Author:** Dharmaraya
