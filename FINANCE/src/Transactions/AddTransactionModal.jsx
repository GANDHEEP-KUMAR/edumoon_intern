import React, { useState } from 'react';

const types = ['income', 'expense'];

const initialForm = {
  date: '',
  time: '',
  type: 'expense',
  category: '',
  amount: '',
  notes: ''
};

const AddTransactionModal = ({ show, onClose, onSave, editData, categories }) => {
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
    if (!form.date || !form.time || !form.amount || !categoryToSave || !form.type) {
      setError('All fields except notes are required.');
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
            <h5 className="modal-title">{editData ? 'Edit' : 'Add'} Transaction</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label>Date</label>
                <input type="date" className="form-control" name="date" value={form.date} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label>Time</label>
                <input type="time" className="form-control" name="time" value={form.time} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label>Type</label>
                <select className="form-select" name="type" value={form.type} onChange={handleChange}>
                  {types.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label>Category</label>
                <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                  <option value="">Select</option>
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
                <label>Notes</label>
                <input type="text" className="form-control" name="notes" value={form.notes} onChange={handleChange} />
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

export default AddTransactionModal;
