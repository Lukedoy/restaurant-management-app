import React, { useCallback, useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import '../../styles/Orders.css';

const OrderList = ({ filter = null }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      const data = await orderService.getAllOrders({ status: filter || undefined, limit: 50 });
      const list = data.orders || data;
      setOrders(Array.isArray(list) ? list : []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (newStatus === 'completed') {
        await orderService.completeOrder(orderId, token);
      } else {
        await orderService.updateOrderStatus(orderId, newStatus, token);
      }
      fetchOrders();
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  if (loading) return <div className="loading" role="status">Loading orders...</div>;
  if (error) return <div className="error-message" role="alert">{error}</div>;

  return (
    <div className="order-list" role="region" aria-label="Orders list">
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found</p>
      ) : (
        <div className="orders-grid">
          {orders.map(order => (
            <div key={order._id} className="order-card animate-fade-in">
              <div className="order-header">
                <h3>{order.orderNumber}</h3>
                <span className={`status-badge ${order.status}`}>{order.status}</span>
              </div>
              <div className="order-details">
                <p><strong>Table:</strong> {order.tableNumber === 0 ? 'Takeaway' : order.tableNumber}</p>
                <p><strong>Total:</strong> €{order.totalAmount}</p>
                <p><strong>Items:</strong> {order.items.length}</p>
                {order.updatedAt && (
                  <p><strong>Updated:</strong> {new Date(order.updatedAt).toLocaleString()}</p>
                )}
              </div>
              <label htmlFor={`status-${order._id}`} className="sr-only">Change order status</label>
              <select
                id={`status-${order._id}`}
                value={order.status}
                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                className="status-select"
                aria-label={`Status for ${order.orderNumber}`}
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
