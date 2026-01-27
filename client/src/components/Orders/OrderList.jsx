// src/components/Orders/OrderList.jsx
import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import '../../styles/Orders.css';

const OrderList = ({ filter = null }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      const filtered = filter ? data.filter(o => o.status === filter) : data;
      setOrders(filtered);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await orderService.updateOrderStatus(orderId, newStatus, token);
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="order-list">
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found</p>
      ) : (
        <div className="orders-grid">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>{order.orderNumber}</h3>
                <span className={`status-badge ${order.status}`}>{order.status}</span>
              </div>
              <div className="order-details">
                <p><strong>Table:</strong> {order.tableNumber}</p>
                <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                <p><strong>Items:</strong> {order.items.length}</p>
              </div>
              <select 
                value={order.status} 
                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                className="status-select"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="served">Served</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;