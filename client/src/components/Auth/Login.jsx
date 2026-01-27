// src/components/Auth/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { token, user } = await authService.login(email, password);
      
      if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
      } else {
        localStorage.removeItem('rememberEmail');
      }
      
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
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  React.useEffect(() => {
    const rememberEmail = localStorage.getItem('rememberEmail');
    if (rememberEmail) {
      setEmail(rememberEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Branding */}
        <div className="auth-left">
          <div className="auth-branding">
            <div className="brand-icon">🍽️</div>
            <h1 className="brand-name">Restaurant Manager</h1>
            <p className="brand-tagline">Streamline Your Restaurant Operations</p>
            
            <div className="brand-features">
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span className="feature-text">Real-time Order Management</span>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span className="feature-text">Table Tracking & Reservations</span>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span className="feature-text">Kitchen Display System</span>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span className="feature-text">Sales Analytics & Reports</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="card-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your account</p>
            </div>

            {error && (
              <div className="error-banner">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    disabled={loading}
                    autoComplete="current-password"
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
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <a href="#forgot" className="forgot-link">Forgot password?</a>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="form-divider">
              <span>Demo Credentials</span>
            </div>

            <div className="demo-credentials">
              <button
                type="button"
                className="demo-btn"
                onClick={() => handleDemoLogin('admin@restaurant.com', 'admin123')}
                disabled={loading}
              >
                <span className="demo-role">Admin</span>
              </button>
              <button
                type="button"
                className="demo-btn"
                onClick={() => handleDemoLogin('waiter@restaurant.com', 'waiter123')}
                disabled={loading}
              >
                <span className="demo-role">Waiter</span>
              </button>
              <button
                type="button"
                className="demo-btn"
                onClick={() => handleDemoLogin('chef@restaurant.com', 'chef123')}
                disabled={loading}
              >
                <span className="demo-role">Chef</span>
              </button>
            </div>

            <div className="auth-footer">
              <p>Don't have an account? 
                <Link to="/register" className="signup-link"> Create one</Link>
              </p>
            </div>
          </div>

          <div className="auth-support">
            <p>Need help? <a href="#support">Contact support</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;