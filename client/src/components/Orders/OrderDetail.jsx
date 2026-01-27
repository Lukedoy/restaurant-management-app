// src/components/Orders/OrderDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderService } from '../../services/orderService';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      const orders = await orderService.getAllOrders();
      const foundOrder = orders.find(o => o._id === orderId);
      setOrder(foundOrder);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading order details...</div>;
  if (!order) return <div className="error-message">Order not found</div>;

  return (
    <div className="order-detail">
      <h2>Order #{order.orderNumber}</h2>
      <div className="detail-grid">
        <div className="detail-card">
          <h3>Order Information</h3>
          <p><strong>Table:</strong> {order.tableNumber}</p>
          <p><strong>Status:</strong> <span className={`status-badge ${order.status}`}>{order.status}</span></p>
          <p><strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>

        <div className="detail-card">
          <h3>Items</h3>
          <ul className="items-list">
            {order.items.map((item, index) => (
              <li key={index}>
                <span>{item.name}</span>
                <span>x{item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="detail-card">
          <h3>Billing</h3>
          <p><strong>Subtotal:</strong> ₹{order.totalAmount}</p>
          <p><strong>Discount:</strong> ₹{order.discount}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount - order.discount}</p>
          <p><strong>Payment:</strong> {order.paymentMethod}</p>
          <p><strong>Status:</strong> {order.paymentStatus}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;