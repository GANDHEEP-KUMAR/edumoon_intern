import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { useState } from 'react'
import Sidebar from './components/Layout/Sidebar';
import DashboardPage from './Dashboard/DashboardPage';
import TransactionList from './Transactions/TransactionList';
import BudgetPage from './Budgets/BudgetPage';
import ReportsPage from './Reports/ReportsPage';
import GoalsPage from './Goals/GoalsPage';
import LoginPage from './Security/LoginPage';
import ProfilePage from './Profile/ProfilePage';

function ProtectedRoutes({ user, onLogin }) {
  if (!user) {
    return <LoginPage onLogin={onLogin} />;
  }
  return <Outlet />;
}

function AppLayout({ user }) {
  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Sidebar />
      <div className="flex-grow-1" style={{ padding: '32px 24px' }}>
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('finance_user');
    return saved ? JSON.parse(saved) : null;
  });
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoutes user={user} onLogin={setUser} /> }>
          <Route element={<AppLayout user={user} />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionList />} />
            <Route path="/budgets" element={<BudgetPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App
