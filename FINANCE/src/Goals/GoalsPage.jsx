import React, { useState, useEffect } from 'react';
import AddGoalModal from './AddGoalModal';
import { formatRupees } from '../utils/helpers';

const getInitialGoals = () => {
  const data = localStorage.getItem('finance_goals');
  return data ? JSON.parse(data) : [];
};

const GoalsPage = () => {
  const [goals, setGoals] = useState(getInitialGoals());
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDeadline, setFilterDeadline] = useState('');

  useEffect(() => {
    localStorage.setItem('finance_goals', JSON.stringify(goals));
  }, [goals]);

  const handleAdd = () => {
    setEditData(null);
    setShowModal(true);
  };

  const handleEdit = (g) => {
    setEditData(g);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this goal?')) {
      setGoals(goals.filter(g => g.id !== id));
    }
  };

  const handleSave = (data) => {
    if (editData) {
      setGoals(goals.map(g => g.id === editData.id ? { ...editData, ...data } : g));
    } else {
      setGoals([
        ...goals,
        { ...data, id: Date.now() }
      ]);
    }
    setShowModal(false);
    setEditData(null);
  };

  const filtered = goals.filter(g => {
    const completed = g.savedAmount >= g.targetAmount;
    if (filterStatus === 'active' && completed) return false;
    if (filterStatus === 'completed' && !completed) return false;
    if (filterDeadline && g.deadline !== filterDeadline) return false;
    return true;
  });

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>Goals</span>
        <button className="btn btn-success btn-sm" onClick={handleAdd}>Add Goal</button>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-3">
            <label>Status</label>
            <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="col-md-3">
            <label>Deadline</label>
            <input type="date" className="form-control" value={filterDeadline} onChange={e => setFilterDeadline(e.target.value)} />
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Target (₹)</th>
                <th>Saved (₹)</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center">No goals to display.</td></tr>
              ) : (
                filtered.map(g => {
                  const completed = g.savedAmount >= g.targetAmount;
                  const percent = Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100));
                  return (
                    <tr key={g.id}>
                      <td>{g.name}</td>
                      <td>{formatRupees(g.targetAmount)}</td>
                      <td>{formatRupees(g.savedAmount)}</td>
                      <td>{g.deadline}</td>
                      <td>{completed ? 'Completed' : 'Active'}</td>
                      <td>
                        <div className="progress">
                          <div className={`progress-bar ${completed ? 'bg-success' : 'bg-info'}`} style={{ width: percent + '%' }}>
                            {percent}%
                          </div>
                        </div>
                      </td>
                      <td>
                        <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(g)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(g.id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AddGoalModal show={showModal} onClose={() => setShowModal(false)} onSave={handleSave} editData={editData} />
    </div>
  );
};

export default GoalsPage;
