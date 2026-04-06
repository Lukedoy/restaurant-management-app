
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import '../styles/Auth.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'waiter'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await authService.register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );
      if (response.pending || formData.role === 'admin') {
        setSuccess(response.message || 'Admin account created. An existing administrator must approve your account before you can log in.');
      } else {
        login(response.user, response.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="waiter">Waiter</option>
              <option value="chef">Chef</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {formData.role === 'admin' && (
            <div className="info-message">Admin accounts require approval from an existing administrator before you can log in.</div>
          )}
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <button type="submit" className="submit-btn" disabled={loading || success}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="toggle-form">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;