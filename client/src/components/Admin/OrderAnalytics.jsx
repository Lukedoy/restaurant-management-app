// src/components/Admin/OrderAnalytics.jsx
import React, { useEffect, useState } from 'react';
import '../../styles/Admin.css';

const OrderAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const orders = await response.json();

      const stats = {
        totalOrders: orders.length,
        completedOrders: orders.filter(o => o.status === 'completed').length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        averageOrderValue: orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length || 0,
        ordersByStatus: {
          pending: orders.filter(o => o.status === 'pending').length,
          confirmed: orders.filter(o => o.status === 'confirmed').length,
          preparing: orders.filter(o => o.status === 'preparing').length,
          ready: orders.filter(o => o.status === 'ready').length,
          served: orders.filter(o => o.status === 'served').length,
          completed: orders.filter(o => o.status === 'completed').length
        }
      };

      setAnalytics(stats);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading analytics...</div>;

  return (
    <div className="order-analytics">
      <h2>Order Analytics</h2>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Orders</h3>
          <p className="analytics-value">{analytics?.totalOrders || 0}</p>
        </div>
        <div className="analytics-card">
          <h3>Completed Orders</h3>
          <p className="analytics-value">{analytics?.completedOrders || 0}</p>
        </div>
        <div className="analytics-card">
          <h3>Pending Orders</h3>
          <p className="analytics-value">{analytics?.pendingOrders || 0}</p>
        </div>
        <div className="analytics-card">
          <h3>Average Order Value</h3>
          <p className="analytics-value">₹{Math.round(analytics?.averageOrderValue || 0)}</p>
        </div>
      </div>

      <div className="status-breakdown">
        <h3>Orders by Status</h3>
        <div className="status-grid">
          {Object.entries(analytics?.ordersByStatus || {}).map(([status, count]) => (
            <div key={status} className={`status-item ${status}`}>
              <span className="status-label">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
              <span className="status-count">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderAnalytics;