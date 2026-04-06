import { useEffect, useState, useCallback, useMemo } from 'react';
import apiCall from '../../services/api';
import '../../styles/Admin.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await apiCall('GET', '/users?limit=100');
      const list = data.users || data;
      setUsers(Array.isArray(list) ? list : []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];
      if (sortKey === 'createdAt') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else {
        valA = (valA || '').toString().toLowerCase();
        valB = (valB || '').toString().toLowerCase();
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [users, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortIndicator = (key) => {
    if (sortKey !== key) return ' ↕';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="user-management">
      <h2>User Management</h2>
      {error && <div className="error-alert">{error}</div>}
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th className="sortable-th" onClick={() => handleSort('name')}>Name{sortIndicator('name')}</th>
              <th className="sortable-th" onClick={() => handleSort('email')}>Email{sortIndicator('email')}</th>
              <th className="sortable-th" onClick={() => handleSort('role')}>Role{sortIndicator('role')}</th>
              <th className="sortable-th" onClick={() => handleSort('status')}>Status{sortIndicator('status')}</th>
              <th className="sortable-th" onClick={() => handleSort('createdAt')}>Created Date{sortIndicator('createdAt')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map(user => (
              <tr
                key={user._id}
                className="clickable-row"
                onClick={() => setSelectedUser(user)}
              >
                <td className="user-name-cell">{user.name}</td>
                <td>{user.email}</td>
                <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                <td><span className={`status-badge ${user.status || 'active'}`}>{user.status || 'active'}</span></td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <UserDetailPopup
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdated={fetchUsers}
        />
      )}
    </div>
  );
};

const UserDetailPopup = ({ user, onClose, onUpdated }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const isAdmin = user.role === 'admin';

  const handleToggleStatus = async (newStatus) => {
    setError('');
    try {
      await apiCall('PUT', `/users/${user._id}/status`, { status: newStatus });
      setSuccess(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}!`);
      onUpdated();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update user status');
    }
  };

  const handleApprove = async () => {
    setError('');
    try {
      await apiCall('PUT', `/users/${user._id}/status`, { status: 'active' });
      setSuccess('User approved!');
      onUpdated();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to approve user');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${user.name}? This cannot be undone.`)) return;
    try {
      await apiCall('DELETE', `/users/${user._id}`);
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const currentStatus = user.status || 'active';

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container popup-sm" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <div>
            <h2>{user.name}</h2>
            <p className="popup-subtitle">{user.email}</p>
          </div>
          <button className="close-panel-btn" onClick={onClose}>✕</button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="popup-section popup-row">
          <div>
            <label>Role</label>
            <span className={`role-badge ${user.role}`}>{user.role}</span>
          </div>
          <div>
            <label>Status</label>
            <span className={`status-badge ${currentStatus}`}>{currentStatus}</span>
          </div>
          <div>
            <label>Joined</label>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="popup-section">
          <label>Actions</label>
          <div className="popup-user-actions">
            {currentStatus === 'pending' ? (
              <button className="status-toggle-btn activate" onClick={handleApprove}>
                Approve User
              </button>
            ) : (
              <>
                {currentStatus === 'active' ? (
                  <button
                    className="status-toggle-btn deactivate"
                    onClick={() => handleToggleStatus('inactive')}
                    disabled={isAdmin}
                    title={isAdmin ? 'Cannot deactivate admin accounts' : ''}
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    className="status-toggle-btn activate"
                    onClick={() => handleToggleStatus('active')}
                  >
                    Activate
                  </button>
                )}
              </>
            )}
            {!isAdmin && (
              <button className="popup-delete-btn" onClick={handleDelete}>
                Delete User
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
