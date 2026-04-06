import React, { useState, useEffect, useCallback } from 'react';
import TableManager from './TableManager';
import OrderHistory from '../Orders/OrderHistory';
import BillCalculator from '../Billing/BillCalculator';
import PaymentForm from '../Billing/PaymentForm';
import apiCall from '../../services/api';
import '../../styles/Waiter.css';

const WaiterDashboard = () => {
  const [activeTab, setActiveTab] = useState('tables');

  return (
    <div className="waiter-dashboard">
      <div className="dashboard-header">
        <h1>Waiter Station</h1>
        <p className="subtitle">Manage tables, orders and payments</p>
      </div>

      <div className="waiter-tabs">
        <button
          className={`waiter-tab-btn ${activeTab === 'tables' ? 'active' : ''}`}
          onClick={() => setActiveTab('tables')}
        >
          Tables
        </button>
        <button
          className={`waiter-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={`waiter-tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          Payments
        </button>
      </div>

      {activeTab === 'tables' && <TableManager />}

      {activeTab === 'orders' && <OrderHistory />}

      {activeTab === 'payments' && <PaymentPanel />}
    </div>
  );
};

const PaymentPanel = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [billInfo, setBillInfo] = useState({ discount: 0, finalTotal: 0 });
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      const data = await apiCall('GET', '/orders?limit=100');
      const allOrders = data.orders || data;

      const payable = allOrders.filter(o =>
        ['served', 'ready', 'confirmed', 'preparing'].includes(o.status) &&
        o.paymentStatus !== 'completed'
      );
      setOrders(payable);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(`Payment for ${selectedOrder.orderNumber} completed!`);
    setSelectedOrder(null);
    fetchOrders();
    setTimeout(() => setPaymentSuccess(''), 4000);
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="payment-panel">
      {paymentSuccess && <div className="success-message">{paymentSuccess}</div>}

      {selectedOrder ? (
        <div className="payment-detail-view">
          <button className="back-btn" onClick={() => setSelectedOrder(null)}>
            ← Back to Orders
          </button>

          <div className="payment-columns">
            <BillCalculator orderId={selectedOrder._id} onBillChange={setBillInfo} />
            <PaymentForm
              orderId={selectedOrder._id}
              totalAmount={billInfo.finalTotal || selectedOrder.totalAmount || 0}
              discount={billInfo.discount || 0}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </div>
        </div>
      ) : (
        <>
          <h2>Process Payment</h2>
          <p className="payment-hint">Select an order to generate the bill and process payment.</p>

          {orders.length === 0 ? (
            <div className="empty-payment">
              <p>No orders awaiting payment.</p>
            </div>
          ) : (
            <div className="payment-orders-grid">
              {orders.map(order => (
                <div
                  key={order._id}
                  className="payment-order-card"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="payment-order-header">
                    <h3>{order.orderNumber}</h3>
                    <span className={`status-badge ${order.status}`}>{order.status}</span>
                  </div>
                  <div className="payment-order-body">
                    <p><strong>Table:</strong> {order.tableNumber === 0 ? 'Takeaway' : order.tableNumber}</p>
                    <p><strong>Items:</strong> {order.items.filter(i => !i.paid).length} unpaid</p>
                    <p className="payment-order-total">€{order.items.filter(i => !i.paid).reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WaiterDashboard;
