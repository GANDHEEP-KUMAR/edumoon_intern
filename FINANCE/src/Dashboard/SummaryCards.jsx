import React from 'react';
import { formatRupees } from '../utils/helpers';

const SummaryCards = ({ transactions }) => {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  return (
    <div className="row mb-4">
      <div className="col-md-4">
        <div className="card text-white bg-success mb-3">
          <div className="card-body">
            <h5 className="card-title">Total Balance</h5>
            <p className="card-text">{formatRupees(totalBalance)}</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card text-white bg-primary mb-3">
          <div className="card-body">
            <h5 className="card-title">Total Income</h5>
            <p className="card-text">{formatRupees(totalIncome)}</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card text-white bg-danger mb-3">
          <div className="card-body">
            <h5 className="card-title">Total Expenses</h5>
            <p className="card-text">{formatRupees(totalExpense)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
