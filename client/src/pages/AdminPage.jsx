// src/pages/AdminPage.jsx
import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import '../styles/Dashboard.css';

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await adminService.getDashboardStats(token);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-value">{stats?.totalUsers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Menu Items</h3>
          <p className="stat-value">{stats?.totalMenuItems || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{stats?.totalOrders || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <p className="stat-value">₹{stats?.totalRevenue || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;