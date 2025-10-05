import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      // Sign Up: Save user to localStorage
      if (!name || !email || !password) {
        setError('All fields are required.');
        return;
      }
      localStorage.setItem('finance_user', JSON.stringify({ name, email, password }));
      setIsSignUp(false);
      setError('Sign up successful! Please sign in.');
      setName(''); setEmail(''); setPassword('');
    } else {
      // Sign In: Validate user from localStorage
      const user = JSON.parse(localStorage.getItem('finance_user'));
      if (user && user.email === email && user.password === password) {
        onLogin(user);
      } else {
        setError('Invalid email or password.');
      }
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <div className="card">
        <div className="card-body">
          <h3 className="card-title mb-4 text-center">{isSignUp ? 'Sign Up' : 'Sign In'}</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
              </div>
            )}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-2">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
          </form>
          <button className="btn btn-link w-100" onClick={() => { setIsSignUp(!isSignUp); setError(''); }}>
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
