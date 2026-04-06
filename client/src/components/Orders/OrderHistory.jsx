import { useState, useEffect, useCallback, useMemo } from 'react';
import { orderService } from '../../services/orderService';
import OrderDetailPopup, { formatPaymentStatus } from './OrderDetailPopup';
import Pagination from '../common/Pagination';
import '../../styles/OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const fetchOrders = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (dateFrom) params.from = dateFrom;
      if (dateTo) params.to = dateTo;

      const data = await orderService.getAllOrders(params);
      if (data.orders) {
        setOrders(data.orders);
        setPagination(data.pagination);
      } else {
        setOrders(Array.isArray(data) ? data : []);
      }
      setError('');
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders(1);
  };

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      let valA, valB;
      if (sortKey === 'createdAt') {
        valA = new Date(a.createdAt || 0).getTime();
        valB = new Date(b.createdAt || 0).getTime();
      } else if (sortKey === 'totalAmount') {
        valA = Number(a.totalAmount) || 0;
        valB = Number(b.totalAmount) || 0;
      } else if (sortKey === 'tableNumber') {
        valA = Number(a.tableNumber) || 0;
        valB = Number(b.tableNumber) || 0;
      } else if (sortKey === 'itemCount') {
        valA = (a.items || []).length;
        valB = (b.items || []).length;
      } else {
        valA = (a[sortKey] || '').toString().toLowerCase();
        valB = (b[sortKey] || '').toString().toLowerCase();
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [orders, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortIndicator = (key) => {
    if (sortKey !== key) return ' \u2195';
    return sortDir === 'asc' ? ' \u2191' : ' \u2193';
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setDateFrom('');
    setDateTo('');
  };

  const handleOrderUpdated = () => {
    fetchOrders(pagination.page);
  };

  return (
    <div className="order-history">
      <div className="history-header">
        <h2>Order History</h2>
        <span className="history-count">{pagination.total} orders total</span>
      </div>

      <form className="history-filters" onSubmit={handleSearch}>
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="history-search">Search</label>
            <input id="history-search" type="text" placeholder="Order number or item..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="filter-group">
            <label htmlFor="history-status">Status</label>
            <select id="history-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="served">Served</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="history-from">From</label>
            <input id="history-from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div className="filter-group">
            <label htmlFor="history-to">To</label>
            <input id="history-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          <div className="filter-actions">
            <button type="submit" className="filter-search-btn">Search</button>
            <button type="button" className="filter-clear-btn" onClick={clearFilters}>Clear</button>
          </div>
        </div>
      </form>

      {error && <div className="error-alert">{error}</div>}

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="history-empty"><p>No orders found matching your criteria.</p></div>
      ) : (
        <>
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th className="sortable-th" onClick={() => handleSort('orderNumber')}>Order #{sortIndicator('orderNumber')}</th>
                  <th className="sortable-th" onClick={() => handleSort('tableNumber')}>Table{sortIndicator('tableNumber')}</th>
                  <th className="sortable-th" onClick={() => handleSort('itemCount')}>Items{sortIndicator('itemCount')}</th>
                  <th className="sortable-th" onClick={() => handleSort('totalAmount')}>Total{sortIndicator('totalAmount')}</th>
                  <th className="sortable-th" onClick={() => handleSort('status')}>Status{sortIndicator('status')}</th>
                  <th className="sortable-th" onClick={() => handleSort('paymentStatus')}>Payment{sortIndicator('paymentStatus')}</th>
                  <th className="sortable-th" onClick={() => handleSort('createdAt')}>Date{sortIndicator('createdAt')}</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map(order => (
                  <tr key={order._id} className="clickable-row" onClick={() => setSelectedOrder(order)}>
                    <td className="order-num-cell">{order.orderNumber}</td>
                    <td>{order.tableNumber === 0 ? 'Takeaway' : order.tableNumber}</td>
                    <td>{order.items.length} items</td>
                    <td className="total-cell">&euro;{(order.totalAmount || 0).toFixed(2)}</td>
                    <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                    <td><span className={`payment-badge ${order.paymentStatus || 'unpaid'}`}>{formatPaymentStatus(order.paymentStatus)}</span></td>
                    <td className="date-cell">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={pagination.page} pages={pagination.pages} total={pagination.total} onPageChange={(p) => fetchOrders(p)} />
        </>
      )}

      {selectedOrder && (
        <OrderDetailPopup
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdated={handleOrderUpdated}
        />
      )}
    </div>
  );
};

export default OrderHistory;
