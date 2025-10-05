import React from 'react';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('finance_user'));
  if (!user) return null;
  return (
    <div className="card mx-auto mt-5" style={{ maxWidth: 400 }}>
      <div className="card-header text-center bg-white">
        <div className="mb-3">
          <i className="bi bi-person-circle" style={{ fontSize: 64, color: '#0d6efd' }}></i>
        </div>
        <h5 className="mb-0">{user.name}</h5>
        <div className="text-muted">{user.email}</div>
      </div>
    </div>
  );
};

export default Profile;
