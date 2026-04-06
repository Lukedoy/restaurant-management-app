import apiCall from './api';

export const orderService = {
  createOrder: async (data, token) => {
    return apiCall('POST', '/orders', data, token);
  },

  getAllOrders: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    if (params.from) query.set('from', params.from);
    if (params.to) query.set('to', params.to);
    if (params.page) query.set('page', params.page);
    if (params.limit) query.set('limit', params.limit);
    const qs = query.toString();
    return apiCall('GET', `/orders${qs ? `?${qs}` : ''}`);
  },

  updateOrderStatus: async (id, status, token) => {
    return apiCall('PUT', `/orders/${id}/status`, { status }, token);
  },

  completeOrder: async (id, token) => {
    return apiCall('PUT', `/orders/${id}/complete`, {}, token);
  },

  updateOrderItems: async (id, items) => {
    return apiCall('PUT', `/orders/${id}/items`, { items });
  },

  updateItemStatus: async (id, itemIndex, status) => {
    return apiCall('PUT', `/orders/${id}/item-status`, { itemIndex, status });
  },

  reassignTable: async (id, tableNumber) => {
    return apiCall('PUT', `/orders/${id}/reassign-table`, { tableNumber });
  },
};
