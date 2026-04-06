
import React, { createContext, useState, useEffect } from 'react';
import apiCall from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      apiCall('GET', '/auth/me')
        .then((data) => {
          if (data.user && data.user.status !== 'inactive') {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          } else {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        })
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};