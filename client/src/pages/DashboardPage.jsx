
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminPage from './AdminPage';
import ChefPage from './ChefPage';
import WaiterPage from './WaiterPage';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  switch (user?.role) {
    case 'admin':
      return <AdminPage />;
    case 'chef':
      return <ChefPage />;
    case 'waiter':
      return <WaiterPage />;
    default:
      return <div>Welcome</div>;
  }
};

export default DashboardPage;