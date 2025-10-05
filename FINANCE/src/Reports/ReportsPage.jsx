import React, { useState, useEffect } from 'react';
import { formatRupees } from '../utils/helpers';

const defaultCategories = ['Food', 'Salary', 'Groceries', 'Rent', 'Travel'];
const types = ['income', 'expense'];

const ReportsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStart, setFilterStart] = useState('');
  const [filterTime, setFilterTime] = useState('');

  useEffect(() => {
    setTransactions(JSON.parse(localStorage.getItem('finance_transactions') || '[]'));
  }, []);

  // Get custom categories from transactions
  const customCategories = [...new Set(transactions.map(t => t.category).filter(c => !defaultCategories.includes(c)))];
  const filterCategories = customCategories.length > 0 ? [...defaultCategories, 'Other'] : defaultCategories;

  const filtered = transactions.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (filterCategory !== 'all') {
      if (filterCategory === 'Other' && defaultCategories.includes(t.category)) return false;
      if (filterCategory !== 'Other' && t.category !== filterCategory) return false;
    }
    if (filterStart && t.date < filterStart) return false;
    if (filterTime && t.time !== filterTime) return false;
    return true;
  });

  // Only show summary and category for the selected filter
  const totalIncome = filterType === 'expense' ? 0 : filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filterType === 'income' ? 0 : filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  let byCategory = [];
  if (filterCategory === 'all') {
    byCategory = filterCategories.map(cat => ({
      category: cat,
      income: filterType !== 'expense' ? filtered.filter(t => (cat === 'Other' ? !defaultCategories.includes(t.category) : t.category === cat) && t.type === 'income').reduce((sum, t) => sum + t.amount, 0) : 0,
      expense: filterType !== 'income' ? filtered.filter(t => (cat === 'Other' ? !defaultCategories.includes(t.category) : t.category === cat) && t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) : 0
    })).filter(row => row.income > 0 || row.expense > 0);
  } else {
    byCategory = [
      {
        category: filterCategory,
        income: filterType !== 'expense' ? filtered.filter(t => (filterCategory === 'Other' ? !defaultCategories.includes(t.category) : t.category === filterCategory) && t.type === 'income').reduce((sum, t) => sum + t.amount, 0) : 0,
        expense: filterType !== 'income' ? filtered.filter(t => (filterCategory === 'Other' ? !defaultCategories.includes(t.category) : t.category === filterCategory) && t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) : 0
      }
    ];
  }

  return (
    <div className="card">
      <div className="card-header">Reports & Insights</div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-3">
            <label>Type</label>
            <select className="form-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="all">All</option>
              {types.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label>Category</label>
            <select className="form-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="all">All</option>
              {filterCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label>Start Date</label>
            <input type="date" className="form-control" value={filterStart} onChange={e => setFilterStart(e.target.value)} />
          </div>
          <div className="col-md-3">
            <label>Time</label>
            <input type="time" className="form-control" value={filterTime} onChange={e => setFilterTime(e.target.value)} />
          </div>
        </div>
        <h5>Summary</h5>
        <ul>
          {filterType !== 'expense' && <li>Total Income: {formatRupees(totalIncome)}</li>}
          {filterType !== 'income' && <li>Total Expense: {formatRupees(totalExpense)}</li>}
        </ul>
        <h6>By Category</h6>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Category</th>
              {filterType !== 'expense' && <th>Income (₹)</th>}
              {filterType !== 'income' && <th>Expense (₹)</th>}
            </tr>
          </thead>
          <tbody>
            {byCategory.length === 0 ? (
              <tr><td colSpan={filterType === 'all' ? 3 : 2} className="text-center">No data for selected filter.</td></tr>
            ) : (
              byCategory.map(row => (
                <tr key={row.category}>
                  <td>{row.category}</td>
                  {filterType !== 'expense' && <td>{formatRupees(row.income)}</td>}
                  {filterType !== 'income' && <td>{formatRupees(row.expense)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;
