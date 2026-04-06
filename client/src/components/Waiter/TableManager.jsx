import { useEffect, useState, useCallback } from 'react';
import { menuService } from '../../services/menuService';
import apiCall from '../../services/api';
import OrderDetailPopup from '../Orders/OrderDetailPopup';
import '../../styles/Waiter.css';

const TableManager = () => {
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);

  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState('');
  const [orderError, setOrderError] = useState('');
  const [selectedOrderPopup, setSelectedOrderPopup] = useState(null);

  const fetchTables = useCallback(async () => {
    try {
      const data = await apiCall('GET', '/tables');
      setTables(data);
    } catch (error) {
      console.error('Failed to fetch tables:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await apiCall('GET', '/orders?limit=100');
      const list = data.orders || data;
      setOrders(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  }, []);

  useEffect(() => {
    fetchTables();
    fetchOrders();
    const interval = setInterval(() => {
      fetchTables();
      fetchOrders();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchTables, fetchOrders]);

  useEffect(() => {
    if (selectedTable && menuItems.length === 0) {
      setMenuLoading(true);
      menuService.getAllMenuItems()
        .then(items => setMenuItems(items.filter(m => m.availability)))
        .catch(() => {})
        .finally(() => setMenuLoading(false));
    }
  }, [selectedTable, menuItems.length]);

  const takeawayTable = { _id: 'takeaway', tableNumber: 0, capacity: '-', status: 'available' };

  const handleTableClick = (table) => {
    if (selectedTable?._id === table._id) {
      setSelectedTable(null);
      setCart([]);
      setOrderSuccess('');
      setOrderError('');
    } else {
      setSelectedTable(table);
      setCart([]);
      setOrderSuccess('');
      setOrderError('');
    }
  };

  const handleStatusChange = async (tableId, newStatus) => {
    setTables(prev => prev.map(t =>
      t._id === tableId ? { ...t, status: newStatus } : t
    ));
    if (selectedTable && selectedTable._id === tableId) {
      setSelectedTable(prev => ({ ...prev, status: newStatus }));
    }
    try {
      await apiCall('PUT', `/tables/${tableId}/status`, { status: newStatus });
    } catch (error) {
      console.error('Failed to update table:', error);
      fetchTables();
    }
  };

  const getTableOrder = (table) => {
    if (!table.currentOrderId) return null;
    return orders.find(o => o._id === table.currentOrderId);
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, specialRequests: '' }];
    });
  };

  const updateQuantity = (itemId, qty) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i._id !== itemId));
    } else {
      setCart(prev => prev.map(i => i._id === itemId ? { ...i, quantity: qty } : i));
    }
  };

  const updateSpecialRequests = (itemId, text) => {
    setCart(prev => prev.map(i => i._id === itemId ? { ...i, specialRequests: text } : i));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  const filteredMenu = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const placeOrder = async () => {
    if (cart.length === 0) {
      setOrderError('Add items to the order first');
      return;
    }
    setOrderLoading(true);
    setOrderError('');
    try {
      await apiCall('POST', '/orders', {
        tableNumber: selectedTable.tableNumber,
        items: cart.map(item => ({
          menuItemId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          specialRequests: item.specialRequests || ''
        }))
      });
      setOrderSuccess('Order placed successfully!');
      setCart([]);
      fetchOrders();
      fetchTables();
      setTimeout(() => setOrderSuccess(''), 4000);
    } catch (err) {
      setOrderError(err.message || 'Failed to place order');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading tables...</div>;

  return (
    <div className="table-manager-split">
      {}
      <div className="tm-tables-panel">
        <h2>Tables</h2>
        <div className="tm-tables-grid">
          {}
          <div
            className={`table-card takeaway ${selectedTable?._id === 'takeaway' ? 'selected' : ''}`}
            onClick={() => handleTableClick(takeawayTable)}
          >
            <div className="table-icon">📦</div>
            <div className="table-number">Takeaway</div>
            <div className="table-capacity">To-go orders</div>
            <div className="table-status-badge takeaway">takeaway</div>
          </div>
          {tables.map(table => {
            const tableOrder = getTableOrder(table);
            const isSelected = selectedTable?._id === table._id;

            return (
              <div
                key={table._id}
                className={`table-card ${table.status} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleTableClick(table)}
              >
                <div className="table-icon">
                  {table.status === 'available' ? '🪑' : table.status === 'occupied' ? '🍽️' : '📋'}
                </div>
                <div className="table-number">Table {table.tableNumber}</div>
                <div className="table-capacity">Seats: {table.capacity}</div>
                <div className={`table-status-badge ${table.status}`}>
                  {table.status}
                </div>
                {tableOrder && (
                  <div
                    className="table-order-info clickable-order"
                    onClick={(e) => { e.stopPropagation(); setSelectedOrderPopup(tableOrder); }}
                  >
                    {tableOrder.orderNumber}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {}
      <div className="tm-order-panel">
        {!selectedTable ? (
          <div className="tm-empty-panel">
            <div className="tm-empty-icon">🪑</div>
            <h3>Select a Table</h3>
            <p>Click on a table to change its status or place a new order</p>
          </div>
        ) : (
          <div className="tm-table-detail">
            <div className="tm-detail-header">
              <h2>{selectedTable._id === 'takeaway' ? 'Takeaway Order' : `Table ${selectedTable.tableNumber}`}</h2>
              <button className="close-panel-btn" onClick={() => { setSelectedTable(null); setCart([]); }}>
                ✕
              </button>
            </div>

            {}
            {selectedTable._id !== 'takeaway' && (
              <div className="tm-status-section">
                <label>Table Status</label>
                <div className="status-buttons">
                  {['available', 'occupied', 'reserved'].map(s => (
                    <button
                      key={s}
                      className={`status-btn ${s} ${selectedTable.status === s ? 'active' : ''}`}
                      onClick={() => handleStatusChange(selectedTable._id, s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {}
            {getTableOrder(selectedTable) && (
              <div className="tm-current-order">
                <label>Active Order</label>
                <div
                  className="current-order-info clickable-order"
                  onClick={() => setSelectedOrderPopup(getTableOrder(selectedTable))}
                >
                  <span>{getTableOrder(selectedTable).orderNumber}</span>
                  <span className={`status-badge ${getTableOrder(selectedTable).status}`}>
                    {getTableOrder(selectedTable).status}
                  </span>
                </div>
              </div>
            )}

            {orderSuccess && <div className="success-message">{orderSuccess}</div>}
            {orderError && <div className="error-message">{orderError}</div>}

            {}
            <div className="tm-menu-section">
              <h3>{selectedTable._id === 'takeaway' ? 'Place Takeaway Order' : `Place Order for Table ${selectedTable.tableNumber}`}</h3>

              <div className="tm-categories">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`tm-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {menuLoading ? (
                <p className="tm-loading-text">Loading menu...</p>
              ) : (
                <div className="tm-menu-list">
                  {filteredMenu.map(item => (
                    <button
                      key={item._id}
                      className="tm-menu-item"
                      onClick={() => addToCart(item)}
                    >
                      <div className="tm-menu-item-info">
                        <span className="tm-menu-item-name">{item.name}</span>
                        <span className="tm-menu-item-cat">{item.category}</span>
                      </div>
                      <span className="tm-menu-item-price">€{item.price.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {}
            {cart.length > 0 && (
              <div className="tm-cart-section">
                <h3>Order Summary</h3>
                <div className="tm-cart-items">
                  {cart.map(item => (
                    <div key={item._id} className="tm-cart-item">
                      <div className="tm-cart-item-top">
                        <span className="tm-cart-item-name">{item.name}</span>
                        <span className="tm-cart-item-subtotal">€{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="tm-cart-item-controls">
                        <div className="cart-qty-control">
                          <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                        </div>
                        <input
                          type="text"
                          className="tm-special-input"
                          placeholder="Special requests..."
                          value={item.specialRequests}
                          onChange={(e) => updateSpecialRequests(item._id, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="tm-cart-total">
                  <span>Total</span>
                  <span>€{cartTotal.toFixed(2)}</span>
                </div>
                <button
                  className="tm-place-order-btn"
                  onClick={placeOrder}
                  disabled={orderLoading}
                >
                  {orderLoading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {selectedOrderPopup && (
        <OrderDetailPopup
          order={selectedOrderPopup}
          onClose={() => setSelectedOrderPopup(null)}
          onUpdated={() => { fetchOrders(); fetchTables(); }}
        />
      )}
    </div>
  );
};

export default TableManager;
