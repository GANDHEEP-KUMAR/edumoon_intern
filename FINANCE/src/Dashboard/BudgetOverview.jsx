import React from 'react';
import { formatRupees } from '../utils/helpers';

const BudgetOverview = ({ budgets, transactions }) => {
  // Calculate spent per budget
  const getSpent = (category, period) => {
    const now = new Date();
    return transactions.filter(t => t.category === category && t.type === 'expense' && (
      period === 'monthly' ? new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear() :
      period === 'weekly' ? getWeek(new Date(t.date)) === getWeek(now) && new Date(t.date).getFullYear() === now.getFullYear() :
      true
    )).reduce((sum, t) => sum + t.amount, 0);
  };

  // Helper to get week number
  function getWeek(date) {
    const firstDay = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date - firstDay) / 86400000) + firstDay.getDay() + 1) / 7);
  }

  return (
    <div className="card mb-4">
      <div className="card-header">Budget Overview</div>
      <div className="card-body">
        {budgets.length === 0 ? <p>No budgets set yet.</p> : (
          <div>
            {budgets.map(b => {
              const spent = getSpent(b.category, b.period);
              const percent = Math.min(100, Math.round((spent / b.amount) * 100));
              const over = spent > b.amount;
              return (
                <div key={b.id} className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span>{b.category} ({b.period.charAt(0).toUpperCase() + b.period.slice(1)})</span>
                    <span>{formatRupees(spent)} / {formatRupees(b.amount)}</span>
                  </div>
                  <div className="progress">
                    <div className={`progress-bar ${over ? 'bg-danger' : percent > 80 ? 'bg-warning' : 'bg-success'}`} style={{ width: percent + '%' }}>
                      {percent}%
                    </div>
                  </div>
                  {over && <div className="text-danger small">Budget exceeded!</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetOverview;
