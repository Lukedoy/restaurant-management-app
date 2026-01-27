// src/components/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import MenuManagement from './MenuManagement';
import UserManagement from './UserManagement';
import OrderAnalytics from './OrderAnalytics';
import SalesReport from './SalesReport';
import '../../styles/Admin.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const data = await adminService.getDashboardStats(token);
      setStats(data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview stats={stats} loading={loading} error={error} />;
      case 'menu':
        return <MenuManagement />;
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return <OrderAnalytics />;
      case 'sales':
        return <SalesReport />;
      default:
        return <DashboardOverview stats={stats} loading={loading} error={error} />;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p className="admin-subtitle">Manage restaurant operations and view analytics</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="tab-icon">📊</span> Dashboard
        </button>
        <button
          className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          <span className="tab-icon">🍽️</span> Menu
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <span className="tab-icon">👥</span> Users
        </button>
        <button
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <span className="tab-icon">📈</span> Analytics
        </button>
        <button
          className={`tab-btn ${activeTab === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveTab('sales')}
        >
          <span className="tab-icon">💰</span> Sales
        </button>
      </div>

      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = ({ stats, loading, error }) => {
  if (loading) {
    return <div className="loading-spinner">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-alert">{error}</div>;
  }

  return (
    <div className="dashboard-overview">
      <div className="stats-container">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon="👥"
          color="blue"
          trend="+5% this week"
        />
        <StatCard
          title="Menu Items"
          value={stats?.totalMenuItems || 0}
          icon="🍽️"
          color="green"
          trend="Up to date"
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon="📦"
          color="purple"
          trend={`${stats?.totalOrders || 0} orders processed`}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
          icon="💰"
          color="orange"
          trend="+12% this month"
        />
      </div>

      <div className="dashboard-grid">
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <ActionButton icon="➕" label="Add Menu Item" color="blue" />
            <ActionButton icon="👤" label="Add User" color="green" />
            <ActionButton icon="📊" label="View Reports" color="purple" />
            <ActionButton icon="🔧" label="Settings" color="orange" />
          </div>
        </div>

        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <ActivityItem 
              action="New Order Created" 
              time="5 minutes ago" 
              status="success"
            />
            <ActivityItem 
              action="Menu Item Updated" 
              time="1 hour ago" 
              status="info"
            />
            <ActivityItem 
              action="New User Registered" 
              time="2 hours ago" 
              status="success"
            />
            <ActivityItem 
              action="Payment Received" 
              time="3 hours ago" 
              status="success"
            />
          </div>
        </div>
      </div>

      <div className="dashboard-footer">
        <p>Last updated: {new Date().toLocaleString()}</p>
        <button className="refresh-btn">🔄 Refresh Data</button>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    blue: 'stat-blue',
    green: 'stat-green',
    purple: 'stat-purple',
    orange: 'stat-orange'
  };

  return (
    <div className={`stat-card ${colorClasses[color]}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <h2 className="stat-value">{value}</h2>
        <p className="stat-trend">{trend}</p>
      </div>
    </div>
  );
};

// Action Button Component
const ActionButton = ({ icon, label, color }) => {
  const colorClasses = {
    blue: 'action-blue',
    green: 'action-green',
    purple: 'action-purple',
    orange: 'action-orange'
  };

  return (
    <button className={`action-btn ${colorClasses[color]}`}>
      <span className="action-icon">{icon}</span>
      <span className="action-label">{label}</span>
    </button>
  );
};

// Activity Item Component
const ActivityItem = ({ action, time, status }) => {
  const statusClasses = {
    success: 'activity-success',
    info: 'activity-info',
    warning: 'activity-warning',
    error: 'activity-error'
  };

  return (
    <div className={`activity-item ${statusClasses[status]}`}>
      <div className="activity-dot"></div>
      <div className="activity-details">
        <p className="activity-action">{action}</p>
        <p className="activity-time">{time}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;