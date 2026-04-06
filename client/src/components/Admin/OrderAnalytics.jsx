import React, { useEffect, useState, useCallback } from 'react';
import apiCall from '../../services/api';
import '../../styles/Admin.css';

const OrderAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await apiCall('GET', '/orders?limit=100');
      const orders = data.orders || data;

      const stats = {
        totalOrders: orders.length,
        completedOrders: orders.filter(o => o.status === 'completed').length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        averageOrderValue: orders.length > 0
          ? orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) / orders.length
          : 0,
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
      setError('');
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  if (loading) return <div className="loading" role="status">Loading analytics...</div>;

  if (error) return <div className="error-alert" role="alert">{error}</div>;

  return (
    <div className="order-analytics" role="region" aria-label="Order Analytics">
      <div className="management-header">
        <h2>Order Analytics</h2>
        <button className="refresh-btn" onClick={fetchAnalytics} aria-label="Refresh analytics">Refresh</button>
      </div>
      <div className="analytics-grid">
        <div className="analytics-card" tabIndex="0">
          <h3>Total Orders</h3>
          <p className="analytics-value">{analytics?.totalOrders || 0}</p>
        </div>
        <div className="analytics-card" tabIndex="0">
          <h3>Completed Orders</h3>
          <p className="analytics-value">{analytics?.completedOrders || 0}</p>
        </div>
        <div className="analytics-card" tabIndex="0">
          <h3>Pending Orders</h3>
          <p className="analytics-value">{analytics?.pendingOrders || 0}</p>
        </div>
        <div className="analytics-card" tabIndex="0">
          <h3>Average Order Value</h3>
          <p className="analytics-value">€{Math.round(analytics?.averageOrderValue || 0)}</p>
        </div>
      </div>

      <div className="status-breakdown">
        <h3>Orders by Status</h3>
        <div className="status-grid" role="list">
          {Object.entries(analytics?.ordersByStatus || {}).map(([status, count]) => (
            <div key={status} className={`status-item ${status}`} role="listitem">
              <span className="status-label">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
              <span className="status-count" aria-label={`${count} ${status} orders`}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderAnalytics;
