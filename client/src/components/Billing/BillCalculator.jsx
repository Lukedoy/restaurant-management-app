
import React, { useEffect, useState, useCallback } from 'react';
import apiCall from '../../services/api';
import '../../styles/Billing.css';

const BillCalculator = ({ orderId, onBillChange }) => {
  const [order, setOrder] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchOrderData = useCallback(async () => {
    try {
      const data = await apiCall('GET', '/orders?limit=100');
      const allOrders = data.orders || data;
      const foundOrder = (Array.isArray(allOrders) ? allOrders : []).find(o => o._id === orderId);
      setOrder(foundOrder || null);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderData();
  }, [fetchOrderData]);

  const paidItems = order ? order.items.filter(i => i.paid) : [];
  const unpaidItems = order ? order.items.filter(i => !i.paid) : [];

  const paidSubtotal = paidItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const unpaidSubtotal = unpaidItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const discountAmount = (unpaidSubtotal * discount) / 100;
  const afterDiscount = unpaidSubtotal - discountAmount;
  const tax = (afterDiscount * 5) / 100;
  const finalTotal = afterDiscount + tax;

  useEffect(() => {
    if (onBillChange && order) {
      onBillChange({ discount: discountAmount, finalTotal });
    }
  }, [discount, discountAmount, finalTotal, onBillChange, order]);

  if (loading) return <div className="loading">Loading bill...</div>;
  if (!order) return <div className="error-message">Order not found</div>;

  return (
    <div className="bill-calculator">
      <div className="bill-header">
        <h2>Bill #{order.orderNumber}</h2>
        <p>{order.tableNumber === 0 ? 'Takeaway' : `Table ${order.tableNumber}`}</p>
      </div>

      {paidItems.length > 0 && (
        <div className="bill-paid-section">
          <h4 className="bill-section-title paid">Already Paid</h4>
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
              {paidItems.map((item, idx) => (
                <tr key={`paid-${idx}`} className="bill-paid-row">
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>€{item.price}</td>
                  <td>€{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bill-paid-total">
            <span>Paid Total</span>
            <span>€{paidSubtotal.toFixed(2)}</span>
          </div>
        </div>
      )}

      {unpaidItems.length > 0 ? (
        <>
          <div className="bill-items">
            {paidItems.length > 0 && <h4 className="bill-section-title unpaid">To Pay</h4>}
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
                {unpaidItems.map((item, idx) => (
                  <tr key={`unpaid-${idx}`}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>€{item.price}</td>
                    <td>€{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bill-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>€{unpaidSubtotal.toFixed(2)}</span>
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
              <span>€{discountAmount.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>After Discount</span>
              <span>€{afterDiscount.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Tax (5%)</span>
              <span>€{tax.toFixed(2)}</span>
            </div>

            <div className="summary-row total">
              <span>Amount Due</span>
              <span>€{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="bill-all-paid">
          <p>All items have been paid.</p>
          <div className="summary-row total">
            <span>Total Paid</span>
            <span>€{paidSubtotal.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillCalculator;
