import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const getMenuItems = () => {
    const baseItems = [{ label: 'Menu', path: '/menu', icon: '🍽️' }];

    switch (user?.role) {
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin', icon: '📊' },
          { label: 'Menu', path: '/menu', icon: '🍽️' },
        ];
      case 'waiter':
        return [
          { label: 'Dashboard', path: '/waiter', icon: '📋' },
          ...baseItems,
        ];
      case 'chef':
        return [
          { label: 'Dashboard', path: '/chef', icon: '👨‍🍳' },
        ];
      default:
        return baseItems;
    }
  };

  return (
    <aside className="sidebar" role="navigation" aria-label="Sidebar navigation">
      <nav>
        <ul className="sidebar-menu">
          {getMenuItems().map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
                aria-current={location.pathname === item.path ? 'page' : undefined}
              >
                <span className="sidebar-icon" aria-hidden="true">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
