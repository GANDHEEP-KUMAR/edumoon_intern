import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('finance_user');
    navigate('/');
    window.location.reload();
  };
  const goToProfile = () => {
    navigate('/profile');
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Finance Tracker</a>
        <button className="btn btn-outline-light ms-auto" onClick={handleLogout}>Logout</button>
        <button className="btn btn-outline-light ms-2" onClick={goToProfile}>Profile</button>
      </div>
    </nav>
  );
};

export default Header;
