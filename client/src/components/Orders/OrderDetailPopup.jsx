import { useState, useEffect, useCallback, useRef } from 'react';
import { orderService } from '../../services/orderService';
import { menuService } from '../../services/menuService';
import '../../styles/OrderHistory.css';

export function formatPaymentStatus(s) {
  if (s === 'completed') return 'Paid';
  if (s === 'partially_paid') return 'Partially Paid';
  return 'Unpaid';
}

const OrderDetailPopup = ({ order, onClose, onUpdated }) => {
  const [items, setItems] = useState(order.items.map(i => ({ ...i })));
  const [status, setStatus] = useState(order.status);
  const [tableNumber, setTableNumber] = useState(order.tableNumber);
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [error, setError] = useState('');
  const [autoSaveMsg, setAutoSaveMsg] = useState('');
  const saveTimer = useRef(null);

  useEffect(() => {
    if (showMenu && menuItems.length === 0) {
      setMenuLoading(true);
      menuService.getAllMenuItems()
        .then(data => setMenuItems(data.filter(m => m.availability)))
        .catch(() => {})
        .finally(() => setMenuLoading(false));
    }
  }, [showMenu, menuItems.length]);

  const paidItems = items.filter(i => i.paid);
  const unpaidItems = items.filter(i => !i.paid);
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const paidTotal = paidItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const unpaidTotal = unpaidItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const triggerAutoSave = useCallback((updatedItems) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await orderService.updateOrderItems(order._id, updatedItems);
        setAutoSaveMsg('Saved');
        if (onUpdated) onUpdated();
        setTimeout(() => setAutoSaveMsg(''), 2000);
      } catch (err) {
        setError(err.message || 'Failed to save');
      }
    }, 800);
  }, [order._id, onUpdated]);

  useEffect(() => {
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, []);

  const getOriginalIndex = (item) => items.indexOf(item);

  const handleQuantityChange = (item, qty) => {
    const num = Math.max(1, parseInt(qty) || 1);
    const idx = getOriginalIndex(item);
    const updated = items.map((it, i) => i === idx ? { ...it, quantity: num } : it);
    setItems(updated);
    triggerAutoSave(updated);
  };

  const handleSpecialRequests = (item, value) => {
    const idx = getOriginalIndex(item);
    const updated = items.map((it, i) => i === idx ? { ...it, specialRequests: value } : it);
    setItems(updated);
    triggerAutoSave(updated);
  };

  const handleRemoveItem = (item) => {
    if (items.length <= 1) {
      setError('Order must have at least one item');
      return;
    }
    const idx = getOriginalIndex(item);
    const updated = items.filter((_, i) => i !== idx);
    setItems(updated);
    triggerAutoSave(updated);
  };

  const handleAddItem = (menuItem) => {
    const existingUnpaid = items.findIndex(i =>
      (i.menuItemId === menuItem._id || i.name === menuItem.name) && !i.paid
    );
    let updated;
    if (existingUnpaid >= 0) {
      updated = items.map((it, i) =>
        i === existingUnpaid ? { ...it, quantity: it.quantity + 1 } : it
      );
    } else {
      updated = [...items, {
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        specialRequests: '',
        status: 'confirmed',
        paid: false,
        createdAt: new Date().toISOString()
      }];
    }
    setItems(updated);
    triggerAutoSave(updated);
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    try {
      const token = localStorage.getItem('token');
      if (newStatus === 'completed') {
        await orderService.completeOrder(order._id, token);
      } else {
        await orderService.updateOrderStatus(order._id, newStatus, token);
      }
      if (onUpdated) onUpdated();
    } catch (err) {
      setError(err.message || 'Failed to update status');
      setStatus(order.status);
    }
  };

  const handleTableReassign = async (newTable) => {
    const num = parseInt(newTable);
    if (isNaN(num) || num < 0) return;
    setTableNumber(num);
    try {
      await orderService.reassignTable(order._id, num);
      if (onUpdated) onUpdated();
    } catch (err) {
      setError(err.message || 'Failed to reassign table');
      setTableNumber(order.tableNumber);
    }
  };

  const handlePrintBill = () => {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    const discount = order.discount || 0;
    const discountAmount = total * (discount / 100);
    const afterDiscount = total - discountAmount;
    const tax = afterDiscount * 0.05;
    const finalTotal = afterDiscount + tax;

    printWindow.document.write(`
      <html>
      <head><title>Bill - ${order.orderNumber}</title>
      <style>
        body { font-family: monospace; padding: 20px; max-width: 350px; margin: 0 auto; }
        h2 { text-align: center; margin-bottom: 4px; }
        .subtitle { text-align: center; color: #666; font-size: 12px; margin-bottom: 16px; }
        hr { border: none; border-top: 1px dashed #999; margin: 12px 0; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; font-size: 11px; padding: 4px 0; border-bottom: 1px solid #333; }
        th:last-child { text-align: right; }
        td { padding: 4px 0; font-size: 13px; }
        td:last-child { text-align: right; }
        .total-row td { font-weight: bold; font-size: 15px; border-top: 2px solid #333; padding-top: 8px; }
        .section-label { font-weight: bold; font-size: 12px; margin: 12px 0 6px; text-transform: uppercase; }
        .paid-label { color: #059669; }
        .unpaid-label { color: #dc2626; }
        .footer { text-align: center; margin-top: 20px; font-size: 11px; color: #666; }
      </style>
      </head>
      <body>
        <h2>${order.orderNumber}</h2>
        <p class="subtitle">${tableNumber === 0 ? 'Takeaway' : 'Table ' + tableNumber} &middot; ${new Date(order.createdAt).toLocaleString()}</p>
        <hr>
        ${paidItems.length > 0 ? `
          <div class="section-label paid-label">Paid Items</div>
          <table>
            <tr><th>Item</th><th>Qty</th><th>Amount</th></tr>
            ${paidItems.map(i => `<tr><td>${i.name}</td><td>${i.quantity}</td><td>&euro;${(i.price * i.quantity).toFixed(2)}</td></tr>`).join('')}
          </table>
        ` : ''}
        ${unpaidItems.length > 0 ? `
          <div class="section-label unpaid-label">Unpaid Items</div>
          <table>
            <tr><th>Item</th><th>Qty</th><th>Amount</th></tr>
            ${unpaidItems.map(i => `<tr><td>${i.name}</td><td>${i.quantity}</td><td>&euro;${(i.price * i.quantity).toFixed(2)}</td></tr>`).join('')}
          </table>
        ` : ''}
        <hr>
        <table>
          <tr><td>Subtotal</td><td>&euro;${total.toFixed(2)}</td></tr>
          ${discount > 0 ? `<tr><td>Discount (${discount}%)</td><td>-&euro;${discountAmount.toFixed(2)}</td></tr>` : ''}
          ${discount > 0 ? `<tr><td>After Discount</td><td>&euro;${afterDiscount.toFixed(2)}</td></tr>` : ''}
          <tr><td>Tax (5%)</td><td>&euro;${tax.toFixed(2)}</td></tr>
          <tr class="total-row"><td>Total</td><td>&euro;${finalTotal.toFixed(2)}</td></tr>
        </table>
        <p class="footer">Thank you for dining with us!</p>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const renderItemsTable = (itemsList, label, labelClass) => {
    if (itemsList.length === 0) return null;
    return (
      <>
        <div className={`popup-group-label ${labelClass}`}>{label}</div>
        <table className="popup-items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Special Requests</th>
              <th>Paid</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {itemsList.map((item) => (
              <tr key={getOriginalIndex(item)}>
                <td>
                  <div className="popup-item-name">{item.name}</div>
                  <div className="popup-item-time">
                    {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                  </div>
                </td>
                <td>&euro;{Number(item.price).toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    className="qty-input"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(item, e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="special-input"
                    value={item.specialRequests || ''}
                    placeholder="e.g. no onions"
                    onChange={(e) => handleSpecialRequests(item, e.target.value)}
                  />
                </td>
                <td>
                  <span className={`paid-badge ${item.paid ? 'yes' : 'no'}`}>
                    {item.paid ? 'Paid' : 'Unpaid'}
                  </span>
                </td>
                <td>&euro;{(item.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button className="remove-item-btn" onClick={() => handleRemoveItem(item)}>&#10005;</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <div>
            <h2>{order.orderNumber}</h2>
            <p className="popup-subtitle">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div className="popup-header-right">
            {autoSaveMsg && <span className="auto-save-msg">{autoSaveMsg}</span>}
            <button className="print-bill-btn" onClick={handlePrintBill}>Print Bill</button>
            <button className="close-panel-btn" onClick={onClose}>&#10005;</button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="popup-section popup-row">
          <div>
            <label>Status</label>
            <select className="popup-status-select" value={status} onChange={(e) => handleStatusChange(e.target.value)}>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="served">Served</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label>Table</label>
            <select className="popup-table-select" value={tableNumber} onChange={(e) => handleTableReassign(e.target.value)}>
              <option value="0">Takeaway</option>
              {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>Table {n}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Payment</label>
            <span className={`payment-badge ${order.paymentStatus || 'unpaid'}`}>{formatPaymentStatus(order.paymentStatus)}</span>
          </div>
          {order.discount > 0 && (
            <div>
              <label>Discount</label>
              <span>{order.discount}%</span>
            </div>
          )}
        </div>

        <div className="popup-section">
          <div className="popup-items-header">
            <label>Items</label>
            <button className="popup-add-btn" onClick={() => setShowMenu(!showMenu)}>
              {showMenu ? 'Hide Menu' : '+ Add Items'}
            </button>
          </div>

          {renderItemsTable(paidItems, 'Paid Items', 'paid-group')}
          {renderItemsTable(unpaidItems, 'New / Unpaid Items', 'unpaid-group')}

          {paidItems.length > 0 && unpaidItems.length > 0 && (
            <div className="popup-split-totals">
              <div className="split-total-row">
                <span>Paid items subtotal</span>
                <span>&euro;{paidTotal.toFixed(2)}</span>
              </div>
              <div className="split-total-row unpaid">
                <span>Unpaid items subtotal</span>
                <span>&euro;{unpaidTotal.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="popup-grand-total">
            <span>Grand Total</span>
            <span>&euro;{total.toFixed(2)}</span>
          </div>

          {showMenu && (
            <div className="popup-menu-panel">
              {menuLoading ? (
                <p>Loading menu...</p>
              ) : (
                <div className="popup-menu-list">
                  {menuItems.map(mi => (
                    <button key={mi._id} className="popup-menu-item" onClick={() => handleAddItem(mi)}>
                      <span>{mi.name}</span>
                      <span className="popup-menu-price">&euro;{mi.price.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPopup;
