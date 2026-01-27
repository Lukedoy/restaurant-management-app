// src/components/Waiter/WaiterDashboard.jsx
import React from 'react';
import TableManager from './TableManager';
import OrderList from '../Orders/OrderList';
import '../../styles/Waiter.css';

const WaiterDashboard = () => {
  return (
    <div className="waiter-dashboard">
      <div className="dashboard-header">
        <h1>Waiter Station</h1>
        <p className="subtitle">Manage tables and orders</p>
      </div>
      
      <div className="waiter-content">
        <div className="tables-section">
          <TableManager />
        </div>
        <div className="orders-section">
          <OrderList />
        </div>
      </div>
    </div>
  );
};

export default WaiterDashboard;