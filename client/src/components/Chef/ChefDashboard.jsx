
import React from 'react';
import OrderQueue from './OrderQueue';
import '../../styles/Chef.css';

const ChefDashboard = () => {
  return (
    <div className="chef-dashboard">
      <div className="dashboard-header">
        <h1>Chef Station</h1>
        <p className="subtitle">Manage active orders</p>
      </div>
      <OrderQueue />
    </div>
  );
};

export default ChefDashboard;





