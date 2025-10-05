import React, { useState, useEffect } from 'react';
import AddBudgetModal from './AddBudgetModal';
import { formatRupees } from '../utils/helpers';

const defaultCategories = ['Food', 'Salary', 'Groceries', 'Rent', 'Travel'];
const periods = ['monthly', 'weekly'];

const getInitialBudgets = () => {
  const data = localStorage.getItem('finance_budgets');
  return data ? JSON.parse(data) : [];
};

const getCustomCategories = (budgets) => {
  return [...new Set(budgets.map(b => b.category).filter(c => !defaultCategories.includes(c)))];
};

const getTransactions = () => {
  const data = localStorage.getItem('finance_transactions');
  return data ? JSON.parse(data) : [];
};

const BudgetPage = () => {
  const [budgets, setBudgets] = useState(getInitialBudgets());
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [categories, setCategories] = useState(() => {
    const stored = localStorage.getItem('finance_categories');
    return stored ? JSON.parse(stored) : defaultCategories;
  });

  useEffect(() => {
    localStorage.setItem('finance_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('finance_categories', JSON.stringify(categories));
  }, [categories]);

  const handleAdd = () => {
    setEditData(null);
    setShowModal(true);
  };

  const handleEdit = (b) => {
    setEditData(b);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this budget?')) {
      setBudgets(budgets.filter(b => b.id !== id));
    }
  };

  const handleSave = (data) => {
    if (!categories.includes(data.category) && data.category !== 'Other') {
      setCategories([...categories, data.category]);
    }
    if (editData) {
      setBudgets(budgets.map(b => b.id === editData.id ? { ...editData, ...data } : b));
    } else {
      setBudgets([
        ...budgets,
        { ...data, id: Date.now() }
      ]);
    }
    setShowModal(false);
    setEditData(null);
  };

  // Calculate spent for each budget
  const transactions = getTransactions();
  const getSpent = (budget) => {
    const now = new Date();
    let filteredTx = transactions.filter(t => t.category === budget.category && t.type === 'expense');
    if (budget.period === 'monthly') {
      const month = now.getMonth();
      const year = now.getFullYear();
      filteredTx = filteredTx.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === month && d.getFullYear() === year;
      });
    } else if (budget.period === 'weekly') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      filteredTx = filteredTx.filter(t => {
        const d = new Date(t.date);
        return d >= startOfWeek && d <= endOfWeek;
      });
    }
    return filteredTx.reduce((sum, t) => sum + t.amount, 0);
  };

  // For filter: show default categories + 'Other' if any custom
  const customCategories = getCustomCategories(budgets);
  const filterCategories = customCategories.length > 0 ? [...defaultCategories, 'Other'] : defaultCategories;

  const filtered = budgets.filter(b => {
    if (filterCategory !== 'all') {
      if (filterCategory === 'Other' && defaultCategories.includes(b.category)) return false;
      if (filterCategory !== 'Other' && b.category !== filterCategory) return false;
    }
    if (filterPeriod !== 'all' && b.period !== filterPeriod) return false;
    return true;
  });

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>Budgets</span>
        <button className="btn btn-success btn-sm" onClick={handleAdd}>Add Budget</button>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-3">
            <label>Category</label>
            <select className="form-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="all">All</option>
              {filterCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label>Period</label>
            <select className="form-select" value={filterPeriod} onChange={e => setFilterPeriod(e.target.value)}>
              <option value="all">All</option>
              {periods.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Category</th>
                <th>Amount (₹)</th>
                <th>Period</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center">No budgets to display.</td></tr>
              ) : filtered.map(b => (
                  <tr key={b.id}>
                    <td>{customCategories.length > 0 && !defaultCategories.includes(b.category) ? 'Other' : b.category}</td>
                    <td>{formatRupees(b.amount)}
                      <div className="progress mt-1" style={{height: '8px'}}>
                        <div className={`progress-bar ${getSpent(b) > b.amount ? 'bg-danger' : 'bg-success'}`} role="progressbar" style={{width: `${Math.min(100, (getSpent(b)/b.amount)*100)}%`}} aria-valuenow={getSpent(b)} aria-valuemin={0} aria-valuemax={b.amount}></div>
                      </div>
                      <small className="text-muted">Spent: {formatRupees(getSpent(b))} / {formatRupees(b.amount)}</small>
                    </td>
                    <td>{b.period.charAt(0).toUpperCase() + b.period.slice(1)}</td>
                    <td>
                      <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(b)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <AddBudgetModal show={showModal} onClose={() => setShowModal(false)} onSave={handleSave} editData={editData} categories={categories} />
    </div>
  );
};

export default BudgetPage;
