// src/components/Sidebar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const getMenuItems = () => {
    const baseItems = [{ label: 'Menu', path: '/menu' }];

    switch (user?.role) {
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin' },
          { label: 'Menu Management', path: '/admin/menu' },
          { label: 'Orders', path: '/orders' },
          { label: 'Users', path: '/admin/users' },
          { label: 'Analytics', path: '/admin/analytics' },
        ];
      case 'waiter':
        return [
          { label: 'Dashboard', path: '/waiter' },
          { label: 'Tables', path: '/waiter/tables' },
          { label: 'Orders', path: '/orders' },
          ...baseItems,
        ];
      case 'chef':
        return [
          { label: 'Dashboard', path: '/chef' },
          { label: 'Order Queue', path: '/chef/queue' },
          { label: 'Completed Orders', path: '/chef/completed' },
        ];
      default:
        return baseItems;
    }
  };

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {getMenuItems().map((item) => (
          <li key={item.path}>
            <Link to={item.path}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;