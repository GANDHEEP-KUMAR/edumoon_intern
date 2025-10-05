import React, { useState } from 'react';

const defaultCategories = ['Food', 'Salary', 'Groceries', 'Rent', 'Travel'];
const periods = ['monthly', 'weekly'];

const initialForm = {
  category: 'Food',
  amount: '',
  period: 'monthly'
};

const AddBudgetModal = ({ show, onClose, onSave, editData, categories }) => {
  const [form, setForm] = useState(editData || initialForm);
  const [error, setError] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  React.useEffect(() => {
    setForm(editData || initialForm);
    setError('');
    setCustomCategory('');
  }, [editData, show]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'category' && e.target.value !== 'Other') {
      setCustomCategory('');
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    let categoryToSave = form.category;
    if (form.category === 'Other') {
      if (!customCategory) {
        setError('Please enter a custom category.');
        return;
      }
      categoryToSave = customCategory;
    }
    if (!categoryToSave || !form.amount || !form.period) {
      setError('All fields are required.');
      return;
    }
    if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      setError('Amount must be a positive number.');
      return;
    }
    onSave({ ...form, category: categoryToSave, amount: Number(form.amount) });
    setForm(initialForm);
    setCustomCategory('');
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editData ? 'Edit' : 'Add'} Budget</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label>Category</label>
                <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="Other">Other</option>
                </select>
                {form.category === 'Other' && (
                  <input type="text" className="form-control mt-2" placeholder="Enter custom category" value={customCategory} onChange={e => setCustomCategory(e.target.value)} />
                )}
              </div>
              <div className="mb-3">
                <label>Amount (₹)</label>
                <input type="number" className="form-control" name="amount" value={form.amount} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label>Period</label>
                <select className="form-select" name="period" value={form.period} onChange={handleChange}>
                  {periods.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editData ? 'Update' : 'Add'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBudgetModal;
