import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'bi bi-speedometer2' },
  { to: '/transactions', label: 'Transactions', icon: 'bi bi-list-check' },
  { to: '/budgets', label: 'Budgets', icon: 'bi bi-wallet2' },
  { to: '/reports', label: 'Reports', icon: 'bi bi-bar-chart' },
  { to: '/goals', label: 'Goals', icon: 'bi bi-bullseye' },
  { to: '/profile', label: 'Profile', icon: 'bi bi-person-circle' },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('finance_user');
    navigate('/');
    window.location.reload();
  };
  return (
    <>
      {/* Hamburger for mobile/tablet */}
      <button
        className="btn d-md-none position-fixed"
        style={{ top: 20, left: 20, zIndex: 1100, borderRadius: 12, width: 48, height: 48, boxShadow: '0 2px 8px #0d6efd22', background: '#fff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <span style={{ display: 'block', width: 24, height: 18 }}>
          <span style={{ display: 'block', height: 3, width: 24, background: '#0d6efd', borderRadius: 2, marginBottom: 4 }}></span>
          <span style={{ display: 'block', height: 3, width: 24, background: '#0d6efd', borderRadius: 2, marginBottom: 4 }}></span>
          <span style={{ display: 'block', height: 3, width: 24, background: '#0d6efd', borderRadius: 2 }}></span>
        </span>
      </button>
      <div
        className={`sidebar bg-white shadow-sm d-flex flex-column p-3 ${open ? 'show' : ''}`}
        style={{
          minHeight: '100vh',
          width: 240,
          position: 'fixed',
          left: open ? 0 : -260,
          top: 0,
          zIndex: 1200,
          transition: 'left 0.3s',
        }}
      >
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <span className="fs-4 fw-bold text-primary">💸 Finance Tracker</span>
          <button className="btn btn-link d-md-none" style={{ color: '#0d6efd', fontSize: 24 }} onClick={() => setOpen(false)} aria-label="Close navigation">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <ul className="nav nav-pills flex-column mb-auto">
          {navItems.map(item => (
            <li className="nav-item mb-2" key={item.to}>
              <Link
                to={item.to}
                className={`nav-link d-flex align-items-center ${location.pathname === item.to ? 'active' : 'text-dark'}`}
                style={{ borderRadius: 8 }}
                onClick={() => setOpen(false)}
              >
                <i className={`${item.icon} me-2`}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <button className="btn btn-outline-danger mt-auto" onClick={handleLogout} style={{ borderRadius: 8 }}>
          <i className="bi bi-box-arrow-right me-2"></i>Logout
        </button>
      </div>
      {/* Overlay for mobile nav */}
      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 1100 }} />}
      {/* Always show sidebar on md+ screens */}
      <div className="sidebar d-none d-md-flex bg-white shadow-sm flex-column p-3" style={{ minHeight: '100vh', width: 240 }}>
        <div className="mb-4 d-flex align-items-center">
          <span className="fs-4 fw-bold text-primary">💸 Finance Tracker</span>
        </div>
        <ul className="nav nav-pills flex-column mb-auto">
          {navItems.map(item => (
            <li className="nav-item mb-2" key={item.to}>
              <Link
                to={item.to}
                className={`nav-link d-flex align-items-center ${location.pathname === item.to ? 'active' : 'text-dark'}`}
                style={{ borderRadius: 8 }}
              >
                <i className={`${item.icon} me-2`}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <button className="btn btn-outline-danger mt-auto" onClick={handleLogout} style={{ borderRadius: 8 }}>
          <i className="bi bi-box-arrow-right me-2"></i>Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;
