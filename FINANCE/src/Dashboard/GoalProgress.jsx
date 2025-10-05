import React from 'react';
import { formatRupees } from '../utils/helpers';

const GoalProgress = ({ goals }) => {
  if (!goals.length) return (
    <div className="card mb-4">
      <div className="card-header">Goal Progress</div>
      <div className="card-body"><p>No goals set yet.</p></div>
    </div>
  );
  return (
    <div className="card mb-4">
      <div className="card-header">Goal Progress</div>
      <div className="card-body">
        {goals.map(g => {
          const percent = Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100));
          const completed = g.savedAmount >= g.targetAmount;
          return (
            <div key={g.id} className="mb-3">
              <div className="d-flex justify-content-between">
                <span>{g.name}</span>
                <span>{formatRupees(g.savedAmount)} / {formatRupees(g.targetAmount)}</span>
              </div>
              <div className="progress">
                <div className={`progress-bar ${completed ? 'bg-success' : 'bg-info'}`} style={{ width: percent + '%' }}>
                  {percent}%
                </div>
              </div>
              {completed && <div className="text-success small">Goal completed!</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalProgress;
