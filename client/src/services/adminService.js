// src/services/adminService.js
import apiCall from './api';

export const adminService = {
  getDashboardStats: async (token) => {
    return apiCall('GET', '/admin/stats', null, token);
  },

  getSalesReport: async (token) => {
    return apiCall('GET', '/admin/sales-report', null, token);
  },
};