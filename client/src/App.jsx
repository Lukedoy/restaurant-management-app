import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ToastContainer from './components/common/ToastContainer';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { connectSocket, disconnectSocket } from './services/socket';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ChefPage from './pages/ChefPage';
import WaiterPage from './pages/WaiterPage';
import NotFoundPage from './pages/NotFoundPage';

import './App.css';
import './styles/Common.css';

const AppContent = () => {
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      connectSocket();
    }
    return () => disconnectSocket();
  }, [user]);

  if (loading) {
    return (
      <div className="loading-screen" role="status" aria-live="polite">
        <div className="loading-screen-content">
          <div className="loading-screen-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <a href="#main-content" className="skip-to-content">Skip to main content</a>
      {user && <Navbar />}
      <div className="app-container">
        {user && <Sidebar />}
        <main className="main-content" id="main-content" role="main">
          <Routes>
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />

            <Route path="/menu" element={<HomePage />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            } />

            <Route path="/chef" element={
              <ProtectedRoute requiredRole="chef">
                <ChefPage />
              </ProtectedRoute>
            } />

            <Route path="/waiter" element={
              <ProtectedRoute requiredRole="waiter">
                <WaiterPage />
              </ProtectedRoute>
            } />

            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
      <ToastContainer />
    </Router>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
