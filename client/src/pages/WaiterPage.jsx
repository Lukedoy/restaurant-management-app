// src/pages/WaiterPage.jsx
import React from 'react';
import OrderList from '../components/Orders/OrderList';
import '../styles/Dashboard.css';

const WaiterPage = () => {
  return (
    <div className="waiter-page">
      <h1>Waiter Dashboard</h1>
      <OrderList />
    </div>
  );
};

export default WaiterPage;