import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - Only accessible to authenticated users
 * Usage: <ProtectedRoute><Dashboard /></ProtectedRoute>
 */
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#ffffff',
        fontSize: '18px',
        color: '#525252',
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * PublicRoute - Redirects authenticated users to app
 * Usage: <PublicRoute><Login /></PublicRoute>
 */
export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#ffffff',
        fontSize: '18px',
        color: '#525252',
      }}>
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
