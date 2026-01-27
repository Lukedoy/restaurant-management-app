// src/components/Admin/SalesReport.jsx
import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import '../../styles/Admin.css';

const SalesReport = () => {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesReport();
  }, []);

  const fetchSalesReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await adminService.getSalesReport(token);
      setSalesData(data);
    } catch (error) {
      console.error('Failed to fetch sales report:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading sales report...</div>;

  const totalSales = Object.values(salesData || {}).reduce((sum, val) => sum + val, 0);

  return (
    <div className="sales-report">
      <h2>Sales Report</h2>
      
      <div className="total-sales-card">
        <h3>Total Sales</h3>
        <p className="sales-value">₹{totalSales.toLocaleString()}</p>
      </div>

      <div className="sales-table">
        <h3>Daily Sales</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Sales Amount</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(salesData || {}).map(([date, amount]) => (
              <tr key={date}>
                <td>{new Date(date).toLocaleDateString()}</td>
                <td>₹{amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;