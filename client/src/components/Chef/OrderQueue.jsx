// src/components/Chef/OrderQueue.jsx
import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import '../../styles/Chef.css';

const OrderQueue = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const allOrders = await orderService.getAllOrders();
      const preparingOrders = allOrders.filter(o => 
        o.status === 'confirmed' || o.status === 'preparing'
      );
      setOrders(preparingOrders.sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
      ));
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReady = async (orderId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = currentStatus === 'confirmed' ? 'preparing' : 'ready';
      await orderService.updateOrderStatus(orderId, newStatus, token);
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="empty-queue">
        <h2>No Active Orders</h2>
        <p>Waiting for new orders...</p>
      </div>
    );
  }

  return (
    <div className="order-queue">
      {orders.map((order, index) => (
        <div key={order._id} className={`queue-item priority-${index}`}>
          <div className="queue-priority">Order #{index + 1}</div>
          
          <div className="queue-header">
            <h3>Order {order.orderNumber}</h3>
            <span className={`queue-status ${order.status}`}>{order.status.toUpperCase()}</span>
          </div>

          <div className="queue-items">
            <h4>Items to Prepare:</h4>
            <ul>
              {order.items.map((item, i) => (
                <li key={i}>
                  <span className="item-qty">x{item.quantity}</span>
                  <span className="item-name">{item.name}</span>
                  {item.specialRequests && (
                    <span className="special-requests">({item.specialRequests})</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="queue-footer">
            <span className="time-info">
              Started: {new Date(order.createdAt).toLocaleTimeString()}
            </span>
            <button
              className="ready-btn"
              onClick={() => handleMarkReady(order._id, order.status)}
            >
              {order.status === 'confirmed' ? 'Start Preparing' : 'Mark Ready'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderQueue;