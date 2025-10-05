import React, { useState, useEffect } from 'react';
import SummaryCards from './SummaryCards';
import RecentTransactions from './RecentTransactions';
import BudgetOverview from './BudgetOverview';
import GoalProgress from './GoalProgress';

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    setTransactions(JSON.parse(localStorage.getItem('finance_transactions') || '[]'));
    setBudgets(JSON.parse(localStorage.getItem('finance_budgets') || '[]'));
    setGoals(JSON.parse(localStorage.getItem('finance_goals') || '[]'));
  }, []);

  return (
    <div className="dashboard-modern">
      <div className="mb-4">
        <SummaryCards transactions={transactions} />
      </div>
      <div className="mb-4">
        <div className="card p-4 shadow-sm">
          <h5 className="mb-3 fw-bold">Recent Transactions</h5>
          <RecentTransactions transactions={transactions} />
        </div>
      </div>
      <div className="mb-4">
        <div className="card p-4 shadow-sm">
          <h5 className="mb-3 fw-bold">Budgets Overview</h5>
          <BudgetOverview budgets={budgets} transactions={transactions} />
        </div>
      </div>
      <div>
        <div className="card p-4 shadow-sm">
          <h5 className="mb-3 fw-bold">Goals Progress</h5>
          <GoalProgress goals={goals} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
