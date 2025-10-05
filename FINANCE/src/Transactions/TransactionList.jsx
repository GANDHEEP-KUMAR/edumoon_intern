import React, { useState, useEffect } from 'react';
import { formatRupees } from '../utils/helpers';
import AddTransactionModal from './AddTransactionModal';

const defaultCategories = ['Food', 'Salary', 'Groceries', 'Rent', 'Travel'];
const types = ['income', 'expense'];

const getInitialTransactions = () => {
  const data = localStorage.getItem('finance_transactions');
  return data ? JSON.parse(data) : [];
};

const TransactionList = () => {
  const [transactions, setTransactions] = useState(getInitialTransactions());
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStart, setFilterStart] = useState('');
  const [filterTime, setFilterTime] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [categories, setCategories] = useState(() => {
    const stored = localStorage.getItem('finance_categories');
    return stored ? JSON.parse(stored) : defaultCategories;
  });
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_categories', JSON.stringify(categories));
  }, [categories]);

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const getCustomCategories = (transactions) => {
    return [...new Set(transactions.map(t => t.category).filter(c => !defaultCategories.includes(c)))];
  };

  const customCategories = getCustomCategories(transactions);
  const filterCategories = customCategories.length > 0 ? [...defaultCategories, 'Other'] : defaultCategories;

  const filtered = transactions.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (filterCategory !== 'all') {
      if (filterCategory === 'Other' && !defaultCategories.includes(t.category)) return true;
      if (filterCategory !== 'Other' && t.category !== filterCategory) return false;
      if (filterCategory === 'Other' && defaultCategories.includes(t.category)) return false;
    }
    if (filterStart && t.date < filterStart) return false;
    if (filterTime && t.time !== filterTime) return false;
    return true;
  });

  const handleAdd = () => {
    setEditData(null);
    setShowModal(true);
  };

  const handleEdit = (t) => {
    setEditData(t);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const handleSave = (data) => {
    if (editData) {
      setTransactions(transactions.map(t => t.id === editData.id ? { ...editData, ...data } : t));
    } else {
      setTransactions([
        ...transactions,
        { ...data, id: Date.now() }
      ]);
    }
    setShowModal(false);
    setEditData(null);
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>Transactions</span>
        <button className="btn btn-success btn-sm" onClick={handleAdd}>Add Transaction</button>
      </div>
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
            {/* {customCategories.length === 0 && (
              <div className="input-group mt-2">
                <input type="text" className="form-control" placeholder="Add category" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                <button className="btn btn-outline-secondary" type="button" onClick={addCategory}>Add</button>
              </div>
            )} */}
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
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount (₹)</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center">No transactions to display.</td></tr>
              ) : filtered.map(t => (
                  <tr key={t.id}>
                    <td>{t.date} {t.time}</td>
                    <td>{t.type.charAt(0).toUpperCase() + t.type.slice(1)}</td>
                    <td>{t.category}</td>
                    <td>{formatRupees(t.amount)}</td>
                    <td>{t.notes}</td>
                    <td>
                      <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(t)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <AddTransactionModal show={showModal} onClose={() => setShowModal(false)} onSave={handleSave} editData={editData} categories={categories} />
    </div>
  );
};

export default TransactionList;
