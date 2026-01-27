// src/services/menuService.js
import apiCall from './api';

export const menuService = {
  getAllMenuItems: async () => {
    return apiCall('GET', '/menu');
  },

  getMenuItemById: async (id) => {
    return apiCall('GET', `/menu/${id}`);
  },

  createMenuItem: async (data, token) => {
    return apiCall('POST', '/menu', data, token);
  },

  updateMenuItem: async (id, data, token) => {
    return apiCall('PUT', `/menu/${id}`, data, token);
  },

  deleteMenuItem: async (id, token) => {
    return apiCall('DELETE', `/menu/${id}`, null, token);
  },
};