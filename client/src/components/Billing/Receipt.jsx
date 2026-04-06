import React, { useRef } from 'react';
import '../../styles/Receipt.css';

const Receipt = ({ order }) => {
  const receiptRef = useRef();

  const handlePrint = () => {
    const content = receiptRef.current;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${order.orderNumber}</title>
          <style>
            body { font-family: 'Courier New', monospace; max-width: 320px; margin: 0 auto; padding: 20px; color: #000; }
            .receipt-header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 12px; margin-bottom: 12px; }
            .receipt-header h1 { font-size: 20px; margin: 0 0 4px; }
            .receipt-header p { font-size: 12px; margin: 2px 0; }
            .receipt-info { margin-bottom: 12px; font-size: 13px; }
            .receipt-info p { margin: 3px 0; }
            .receipt-items { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 13px; }
            .receipt-items th { text-align: left; border-bottom: 1px solid #000; padding: 4px 0; font-size: 12px; }
            .receipt-items td { padding: 4px 0; }
            .receipt-items .right { text-align: right; }
            .receipt-totals { border-top: 1px dashed #000; padding-top: 8px; font-size: 13px; }
            .receipt-totals .row { display: flex; justify-content: space-between; margin: 4px 0; }
            .receipt-totals .total { font-size: 18px; font-weight: bold; border-top: 2px solid #000; margin-top: 8px; padding-top: 8px; }
            .receipt-footer { text-align: center; border-top: 2px dashed #000; margin-top: 16px; padding-top: 12px; font-size: 12px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!order) return null;

  const subtotal = order.totalAmount || 0;
  const discount = order.discount || 0;
  const afterDiscount = subtotal - discount;
  const tax = afterDiscount * 0.05;
  const total = afterDiscount + tax;

  return (
    <div className="receipt-container">
      <div className="receipt-actions">
        <button className="print-btn" onClick={handlePrint} aria-label="Print receipt">
          Print Receipt
        </button>
      </div>

      <div className="receipt-paper" ref={receiptRef}>
        <div className="receipt-header">
          <h1>Restaurant Manager</h1>
          <p>Thank you for dining with us!</p>
          <p>{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</p>
        </div>

        <div className="receipt-info">
          <p><strong>Order:</strong> {order.orderNumber}</p>
          <p><strong>Table:</strong> {order.tableNumber === 0 ? 'Takeaway' : order.tableNumber}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Payment:</strong> {order.paymentMethod || 'N/A'} ({order.paymentStatus === 'completed' ? 'Paid' : order.paymentStatus === 'partially_paid' ? 'Partially Paid' : 'Unpaid'})</p>
        </div>

        <table className="receipt-items">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th className="right">Price</th>
              <th className="right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td className="right">€{item.price.toFixed(2)}</td>
                <td className="right">€{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="receipt-totals">
          <div className="row">
            <span>Subtotal</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="row">
              <span>Discount</span>
              <span>-€{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="row">
            <span>Tax (5%)</span>
            <span>€{tax.toFixed(2)}</span>
          </div>
          <div className="row total">
            <span>TOTAL</span>
            <span>€{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="receipt-footer">
          <p>Thank you for your visit!</p>
          <p>We hope to see you again soon.</p>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
