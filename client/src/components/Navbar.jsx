import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-left">
        <h1 className="navbar-title">Restaurant Manager</h1>
      </div>
      <div className="navbar-right">
        {user && (
          <>
            <span className="user-info" aria-label={`Logged in as ${user.name}, role: ${user.role}`}>
              {user.name} <span className="user-role-badge">{user.role}</span>
            </span>
            <button onClick={handleLogout} className="logout-btn" aria-label="Log out">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
