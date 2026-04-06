import { useEffect, useState, useCallback } from 'react';
import { orderService } from '../../services/orderService';
import '../../styles/Chef.css';

const OrderQueue = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders({ limit: 100 });
      const allOrders = data.orders || data;
      const activeOrders = (Array.isArray(allOrders) ? allOrders : []).filter(o =>
        o.status === 'confirmed' || o.status === 'preparing'
      );
      setOrders(activeOrders.sort((a, b) =>
        new Date(a.createdAt) - new Date(b.createdAt)
      ));
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemStatusChange = async (orderId, itemIndex, currentItemStatus) => {
    const nextStatus = currentItemStatus === 'confirmed' ? 'preparing' : 'ready';
    try {
      await orderService.updateItemStatus(orderId, itemIndex, nextStatus);
      fetchOrders();
    } catch (error) {
      console.error('Failed to update item status:', error);
    }
  };

  const itemTickets = [];
  orders.forEach(order => {
    order.items.forEach((item, idx) => {

      if (item.status !== 'ready') {
        itemTickets.push({
          ...item,
          itemIndex: idx,
          orderId: order._id,
          orderNumber: order.orderNumber,
          orderStatus: order.status,
          tableNumber: order.tableNumber,
          itemTime: item.createdAt || order.createdAt,
          _ticketKey: `${order._id}-${idx}`
        });
      }
    });
  });

  const readyTickets = [];
  orders.forEach(order => {
    order.items.forEach((item, idx) => {
      if (item.status === 'ready') {
        readyTickets.push({
          ...item,
          itemIndex: idx,
          orderId: order._id,
          orderNumber: order.orderNumber,
          tableNumber: order.tableNumber,
          itemTime: item.createdAt || order.createdAt,
          _ticketKey: `${order._id}-${idx}`
        });
      }
    });
  });

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="chef-layout">
      <div className="chef-toolbar">
        <button className="chef-history-btn" onClick={() => setShowHistory(true)}>
          Today's Orders
        </button>
      </div>

      {itemTickets.length === 0 && readyTickets.length === 0 ? (
        <div className="empty-queue">
          <h2>No Active Orders</h2>
          <p>Waiting for new orders...</p>
        </div>
      ) : (
        <>
          {}
          {itemTickets.length > 0 && (
            <>
              <h3 className="chef-section-title">To Prepare ({itemTickets.length})</h3>
              <div className="item-tickets-grid">
                {itemTickets.map(ticket => (
                  <div
                    key={ticket._ticketKey}
                    className={`item-ticket ${ticket.status === 'preparing' ? 'preparing-active' : ''}`}
                  >
                    <div className="ticket-header">
                      <span className={`ticket-status ${ticket.status || 'confirmed'}`}>
                        {(ticket.status || 'confirmed').toUpperCase()}
                      </span>
                      <span className="ticket-time">
                        {new Date(ticket.itemTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="ticket-item-name">
                      {ticket.quantity > 1 && <span className="ticket-qty">x{ticket.quantity}</span>}
                      {ticket.name}
                    </div>
                    <div className="ticket-meta">
                      <span className="ticket-table">
                        {ticket.tableNumber === 0 ? 'Takeaway' : `Table ${ticket.tableNumber}`}
                      </span>
                      <span className="ticket-order-num">{ticket.orderNumber}</span>
                    </div>
                    {ticket.specialRequests && (
                      <div className="ticket-special">{ticket.specialRequests}</div>
                    )}
                    <button
                      className={`ticket-action-btn ${ticket.status === 'confirmed' ? 'start' : 'mark-ready'}`}
                      onClick={() => handleItemStatusChange(ticket.orderId, ticket.itemIndex, ticket.status || 'confirmed')}
                    >
                      {(ticket.status || 'confirmed') === 'confirmed' ? 'Start Preparing' : 'Mark Ready'}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {}
          {readyTickets.length > 0 && (
            <>
              <h3 className="chef-section-title ready-title">Ready for Pickup ({readyTickets.length})</h3>
              <div className="item-tickets-grid">
                {readyTickets.map(ticket => (
                  <div key={ticket._ticketKey} className="item-ticket ready-ticket">
                    <div className="ticket-header">
                      <span className="ticket-status ready">READY</span>
                      <span className="ticket-time">
                        {new Date(ticket.itemTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="ticket-item-name">
                      {ticket.quantity > 1 && <span className="ticket-qty">x{ticket.quantity}</span>}
                      {ticket.name}
                    </div>
                    <div className="ticket-meta">
                      <span className="ticket-table">
                        {ticket.tableNumber === 0 ? 'Takeaway' : `Table ${ticket.tableNumber}`}
                      </span>
                      <span className="ticket-order-num">{ticket.orderNumber}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {showHistory && <DailyHistoryPopup onClose={() => setShowHistory(false)} />}
    </div>
  );
};

const DailyHistoryPopup = ({ onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTodayOrders = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await orderService.getAllOrders({ from: today, to: today, limit: 100 });
      const allOrders = data.orders || data;
      setOrders(Array.isArray(allOrders) ? allOrders : []);
    } catch (err) {
      console.error('Failed to fetch daily orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodayOrders();
  }, [fetchTodayOrders]);

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container chef-history-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>Today's Orders</h2>
          <button className="close-panel-btn" onClick={onClose}>✕</button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : orders.length === 0 ? (
          <p className="chef-history-empty">No orders today.</p>
        ) : (
          <div className="chef-history-list">
            {orders.map(order => (
              <div key={order._id} className={`chef-history-card ${order.status}`}>
                <div className="chc-header">
                  <span className="chc-number">{order.orderNumber}</span>
                  <span className={`status-badge ${order.status}`}>{order.status}</span>
                </div>
                <div className="chc-meta">
                  <span>{order.tableNumber === 0 ? 'Takeaway' : `Table ${order.tableNumber}`}</span>
                  <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>{order.items.length} items</span>
                  <span className="chc-total">€{(order.totalAmount || 0).toFixed(2)}</span>
                </div>
                <div className="chc-items">
                  {order.items.map((item, idx) => (
                    <span key={idx} className={`chc-item-tag ${item.status || 'confirmed'}`}>
                      {item.quantity > 1 ? `${item.quantity}x ` : ''}{item.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderQueue;
