
import apiCall from './api';

export const authService = {
  register: async (name, email, password, role) => {
    return apiCall('POST', '/auth/register', { name, email, password, role });
  },

  login: async (email, password) => {
    return apiCall('POST', '/auth/login', { email, password });
  },
};