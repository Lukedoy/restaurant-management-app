// src/services/orderService.js
import apiCall from './api';

export const orderService = {
  createOrder: async (data, token) => {
    return apiCall('POST', '/orders', data, token);
  },

  getAllOrders: async () => {
    return apiCall('GET', '/orders');
  },

  updateOrderStatus: async (id, status, token) => {
    return apiCall('PUT', `/orders/${id}/status`, { status }, token);
  },

  completeOrder: async (id, token) => {
    return apiCall('PUT', `/orders/${id}/complete`, {}, token);
  },
};