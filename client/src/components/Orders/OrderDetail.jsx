import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import '../../styles/Orders.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const data = await orderService.getAllOrders({ limit: 100 });
        const orders = data.orders || data;
        const foundOrder = (Array.isArray(orders) ? orders : []).find(o => o._id === orderId);
        setOrder(foundOrder);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [orderId]);

  if (loading) return <div className="loading" role="status">Loading order details...</div>;
  if (!order) return <div className="error-message" role="alert">Order not found</div>;

  return (
    <div className="order-detail" role="region" aria-label="Order details">
      <h2>Order #{order.orderNumber}</h2>
      <div className="detail-grid">
        <div className="detail-card">
          <h3>Order Information</h3>
          <p><strong>Table:</strong> {order.tableNumber === 0 ? 'Takeaway' : order.tableNumber}</p>
          <p><strong>Status:</strong> <span className={`status-badge ${order.status}`}>{order.status}</span></p>
          <p><strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>

        <div className="detail-card">
          <h3>Items</h3>
          <ul className="items-list" role="list">
            {order.items.map((item, index) => (
              <li key={index}>
                <span>{item.name}</span>
                <span>x{item.quantity}</span>
                <span>€{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="detail-card">
          <h3>Billing</h3>
          <p><strong>Subtotal:</strong> €{(order.totalAmount || 0).toFixed(2)}</p>
          <p><strong>Discount:</strong> €{(order.discount || 0).toFixed(2)}</p>
          <p><strong>Total:</strong> €{((order.totalAmount || 0) - (order.discount || 0)).toFixed(2)}</p>
          <p><strong>Payment:</strong> {order.paymentMethod || 'N/A'}</p>
          <p><strong>Status:</strong> {order.paymentStatus || 'pending'}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
