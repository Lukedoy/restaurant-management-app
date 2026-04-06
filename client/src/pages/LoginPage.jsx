
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import '../styles/Auth.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token, user } = await authService.login(email, password);
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Restaurant Manager</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="submit-btn">Login</button>
        </form>
        <p className="toggle-form">
          Don't have an account? <a href="/register">Register</a>
        </p>
        <p className="toggle-form">
          <a href="/menu">Browse Menu as Customer</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;