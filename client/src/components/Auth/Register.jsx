// src/components/Auth/Register.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'waiter',
    agreeTerms: false
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const roles = [
    { value: 'admin', label: 'Administrator', icon: '👨‍💼' },
    { value: 'waiter', label: 'Waiter/Staff', icon: '🧑‍💼' },
    { value: 'chef', label: 'Chef', icon: '👨‍🍳' }
  ];

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthLabel = (strength) => {
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return labels[strength] || 'Very Weak';
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      errors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Please fix the errors below');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { token, user } = await authService.register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );

      login(user, token);

      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'chef':
          navigate('/chef');
          break;
        case 'waiter':
          navigate('/waiter');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (err) {
      if (err.message.includes('already exists')) {
        setError('This email is already registered. Please login instead.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const strengthColor = ['#d63031', '#e74c3c', '#f39c12', '#f1c40f', '#27ae60', '#00b894'];
  const strengthPercentage = (passwordStrength / 5) * 100;

  return (
    <div className="auth-page">
      <div className="auth-container register-container">
        {/* Left Side - Information */}
        <div className="auth-left">
          <div className="auth-branding">
            <div className="brand-icon">🍽️</div>
            <h1 className="brand-name">Restaurant Manager</h1>
            <p className="brand-tagline">Join Our Platform Today</p>

            <div className="register-benefits">
              <div className="benefit">
                <span className="benefit-icon">📊</span>
                <div className="benefit-content">
                  <h4>Real-time Analytics</h4>
                  <p>Track your restaurant performance</p>
                </div>
              </div>
              <div className="benefit">
                <span className="benefit-icon">👥</span>
                <div className="benefit-content">
                  <h4>Team Management</h4>
                  <p>Manage staff and roles easily</p>
                </div>
              </div>
              <div className="benefit">
                <span className="benefit-icon">📱</span>
                <div className="benefit-content">
                  <h4>Mobile Friendly</h4>
                  <p>Access from any device</p>
                </div>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🔒</span>
                <div className="benefit-content">
                  <h4>Secure & Reliable</h4>
                  <p>Enterprise-grade security</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="auth-right">
          <div className="auth-card register-card">
            <div className="card-header">
              <h2>Create Account</h2>
              <p>Register and start managing your restaurant</p>
            </div>

            {error && (
              <div className="error-banner">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="register-form">
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    disabled={loading}
                    className={validationErrors.name ? 'error' : ''}
                  />
                </div>
                {validationErrors.name && (
                  <span className="field-error">{validationErrors.name}</span>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    disabled={loading}
                    className={validationErrors.email ? 'error' : ''}
                    autoComplete="email"
                  />
                </div>
                {validationErrors.email && (
                  <span className="field-error">{validationErrors.email}</span>
                )}
              </div>

              {/* Role Selection */}
              <div className="form-group">
                <label>Select Your Role</label>
                <div className="role-selector">
                  {roles.map(role => (
                    <label key={role.value} className="role-option">
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={formData.role === role.value}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <span className="role-icon">{role.icon}</span>
                      <div className="role-info">
                        <span className="role-name">{role.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    disabled={loading}
                    className={validationErrors.password ? 'error' : ''}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>

                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div
                        className="strength-fill"
                        style={{
                          width: `${strengthPercentage}%`,
                          backgroundColor: strengthColor[passwordStrength]
                        }}
                      ></div>
                    </div>
                    <span
                      className="strength-text"
                      style={{ color: strengthColor[passwordStrength] }}
                    >
                      {getPasswordStrengthLabel(passwordStrength)}
                    </span>
                  </div>
                )}

                {validationErrors.password && (
                  <span className="field-error">{validationErrors.password}</span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    disabled={loading}
                    className={validationErrors.confirmPassword ? 'error' : ''}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <span className="field-error">{validationErrors.confirmPassword}</span>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    disabled={loading}
                    className={validationErrors.agreeTerms ? 'error' : ''}
                  />
                  <span>
                    I agree to the{' '}
                    <a href="#terms" className="link">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#privacy" className="link">Privacy Policy</a>
                  </span>
                </label>
                {validationErrors.agreeTerms && (
                  <span className="field-error">{validationErrors.agreeTerms}</span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="auth-footer">
              <p>Already have an account?
                <Link to="/login" className="login-link"> Sign In</Link>
              </p>
            </div>
          </div>

          {/* Support Info */}
          <div className="auth-support">
            <p>Questions? <a href="#support">Get in touch</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;