import React, { useEffect, useState, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import apiCall from '../../services/api';
import MenuManagement from './MenuManagement';
import UserManagement from './UserManagement';
import OrderAnalytics from './OrderAnalytics';
import SalesReport from './SalesReport';
import OrderHistory from '../Orders/OrderHistory';
import '../../styles/Admin.css';
import '../../styles/OrderHistory.css';

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
        return <DashboardOverview stats={stats} loading={loading} error={error} onRefresh={fetchDashboardStats} onNavigate={setActiveTab} />;
      case 'menu':
        return <MenuManagement />;
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return <OrderAnalytics />;
      case 'sales':
        return <SalesReport />;
      case 'orders':
        return <OrderHistory />;
      case 'tables':
        return <TableManagement />;
      default:
        return <DashboardOverview stats={stats} loading={loading} error={error} onRefresh={fetchDashboardStats} onNavigate={setActiveTab} />;
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
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <span className="tab-icon">📋</span> Orders
        </button>
        <button
          className={`tab-btn ${activeTab === 'tables' ? 'active' : ''}`}
          onClick={() => setActiveTab('tables')}
        >
          <span className="tab-icon">🪑</span> Tables
        </button>
      </div>

      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

const DashboardOverview = ({ stats, loading, error, onRefresh, onNavigate }) => {
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
          value={`€${(stats?.totalRevenue || 0).toLocaleString()}`}
          icon="💰"
          color="orange"
          trend="+12% this month"
        />
      </div>

      <div className="dashboard-grid">
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <ActionButton icon="➕" label="Add Menu Item" color="blue" onClick={() => onNavigate('menu')} />
            <ActionButton icon="👤" label="Manage Users" color="green" onClick={() => onNavigate('users')} />
            <ActionButton icon="📊" label="View Reports" color="purple" onClick={() => onNavigate('analytics')} />
            <ActionButton icon="💰" label="Sales Report" color="orange" onClick={() => onNavigate('sales')} />
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
        <button className="refresh-btn" onClick={onRefresh}>🔄 Refresh Data</button>
      </div>
    </div>
  );
};

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

const ActionButton = ({ icon, label, color, onClick }) => {
  const colorClasses = {
    blue: 'action-blue',
    green: 'action-green',
    purple: 'action-purple',
    orange: 'action-orange'
  };

  return (
    <button className={`action-btn ${colorClasses[color]}`} onClick={onClick}>
      <span className="action-icon">{icon}</span>
      <span className="action-label">{label}</span>
    </button>
  );
};

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

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableCount, setTableCount] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchTables = useCallback(async () => {
    try {
      const data = await apiCall('GET', '/tables');
      setTables(data);
      setTableCount(data.length.toString());
    } catch (err) {
      console.error('Failed to fetch tables:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const handleSetCount = async () => {
    const num = parseInt(tableCount);
    if (isNaN(num) || num < 1 || num > 50) {
      setError('Enter a number between 1 and 50');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const data = await apiCall('PUT', '/tables/set-count', { count: num });
      setTables(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading tables...</div>;

  return (
    <div className="table-management">
      <div className="table-management-header">
        <h2>Table Management</h2>
        <div className="table-count-control">
          <label>Number of Tables:</label>
          <input
            type="number"
            value={tableCount}
            onChange={(e) => setTableCount(e.target.value)}
            min="1"
            max="50"
          />
          <button
            className="apply-btn"
            onClick={handleSetCount}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Apply'}
          </button>
        </div>
      </div>

      {error && <div className="error-alert" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="admin-tables-grid">
        {tables.map(table => (
          <div key={table._id} className={`admin-table-card ${table.status}`}>
            <div className="table-icon">
              {table.status === 'available' ? '🪑' : table.status === 'occupied' ? '🍽️' : '📋'}
            </div>
            <div className="table-num">Table {table.tableNumber}</div>
            <div className="table-cap">Seats: {table.capacity}</div>
            <div className="table-status-text">{table.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;