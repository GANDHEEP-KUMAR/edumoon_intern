import React from 'react';
import { formatRupees } from '../utils/helpers';

const RecentTransactions = ({ transactions }) => {
  const recent = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  return (
    <div className="card mb-4">
      <div className="card-header">Recent Transactions</div>
      <ul className="list-group list-group-flush">
        {recent.length === 0 ? (
          <li className="list-group-item">No transactions yet.</li>
        ) : (
          recent.map(t => (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={t.id}>
              <span>{t.date} - {t.category} ({t.type})</span>
              <span>{formatRupees(t.amount)}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default RecentTransactions;
