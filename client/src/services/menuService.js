
import apiCall from './api';

export const menuService = {
  getAllMenuItems: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.all) query.set('all', 'true');
    const qs = query.toString();
    return apiCall('GET', `/menu${qs ? `?${qs}` : ''}`);
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