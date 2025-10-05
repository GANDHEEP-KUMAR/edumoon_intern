import React, { useState } from 'react';

const initialForm = {
  name: '',
  targetAmount: '',
  savedAmount: '',
  deadline: ''
};

const AddGoalModal = ({ show, onClose, onSave, editData }) => {
  const [form, setForm] = useState(editData || initialForm);
  const [error, setError] = useState('');

  React.useEffect(() => {
    setForm(editData || initialForm);
    setError('');
  }, [editData, show]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.targetAmount || !form.deadline) {
      setError('Name, target amount, and deadline are required.');
      return;
    }
    if (isNaN(Number(form.targetAmount)) || Number(form.targetAmount) <= 0) {
      setError('Target amount must be a positive number.');
      return;
    }
    if (form.savedAmount && (isNaN(Number(form.savedAmount)) || Number(form.savedAmount) < 0)) {
      setError('Saved amount must be a non-negative number.');
      return;
    }
    onSave({ ...form, targetAmount: Number(form.targetAmount), savedAmount: Number(form.savedAmount) || 0 });
    setForm(initialForm);
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editData ? 'Edit' : 'Add'} Goal</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label>Name</label>
                <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label>Target Amount (₹)</label>
                <input type="number" className="form-control" name="targetAmount" value={form.targetAmount} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label>Saved Amount (₹)</label>
                <input type="number" className="form-control" name="savedAmount" value={form.savedAmount} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label>Deadline</label>
                <input type="date" className="form-control" name="deadline" value={form.deadline} onChange={handleChange} />
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

export default AddGoalModal;
