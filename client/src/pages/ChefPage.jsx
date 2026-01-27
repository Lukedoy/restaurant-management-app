// src/pages/ChefPage.jsx
import React from 'react';
import OrderList from '../components/Orders/OrderList';

const ChefPage = () => {
  return (
    <div className="chef-page">
      <h1>Chef Dashboard</h1>
      <OrderList filter="confirmed" />
    </div>
  );
};

export default ChefPage;