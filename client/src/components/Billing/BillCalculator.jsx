// src/components/Billing/BillCalculator.jsx
import React, { useEffect, useState } from 'react';
import '../../styles/Billing.css';

const BillCalculator = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderData();
  }, [orderId]);

  const fetchOrderData = async () => {
    try {
      const allOrders = await fetch('http://localhost:5000/api/orders').then(r => r.json());
      const foundOrder = allOrders.find(o => o._id === orderId);
      setOrder(foundOrder);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading bill...</div>;
  if (!order) return <div className="error-message">Order not found</div>;

  const subtotal = order.totalAmount;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;
  const tax = (total * 5) / 100;
  const finalTotal = total + tax;

  return (
    <div className="bill-calculator">
      <div className="bill-header">
        <h2>Bill #{order.orderNumber}</h2>
        <p>Table {order.tableNumber}</p>
      </div>

      <div className="bill-items">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price}</td>
                <td>₹{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bill-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="summary-row discount-row">
          <span>Discount (%)</span>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
            min="0"
            max="100"
            className="discount-input"
          />
          <span>₹{discountAmount.toFixed(2)}</span>
        </div>

        <div className="summary-row">
          <span>After Discount</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        <div className="summary-row">
          <span>Tax (5%)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>

        <div className="summary-row total">
          <span>Total</span>
          <span>₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default BillCalculator;

