// src/components/Waiter/TableManager.jsx
import React, { useEffect, useState } from 'react';
import '../../styles/Waiter.css';

const TableManager = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tables', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Failed to fetch tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableStatusChange = async (tableId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/tables/${tableId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchTables();
    } catch (error) {
      console.error('Failed to update table:', error);
    }
  };

  if (loading) return <div className="loading">Loading tables...</div>;

  return (
    <div className="table-manager">
      <h2>Table Status</h2>
      <div className="tables-grid">
        {tables.map(table => (
          <div
            key={table._id}
            className={`table-card ${table.status}`}
          >
            <div className="table-number">Table {table.tableNumber}</div>
            <div className="table-capacity">Capacity: {table.capacity}</div>
            <div className={`table-status-badge ${table.status}`}>
              {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
            </div>
            
            <select
              value={table.status}
              onChange={(e) => handleTableStatusChange(table._id, e.target.value)}
              className="status-select"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableManager;