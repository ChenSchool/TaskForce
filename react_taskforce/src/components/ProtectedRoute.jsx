/**
 * ProtectedRoute component wrapper.
 * Provides authentication and role-based authorization for route access with loading and error states.
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route wrapper that enforces authentication and optional role-based access control.
 * Shows loading spinner during auth check, redirects to login if not authenticated,
 * and displays access denied message if user lacks required role.
 */
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Access Denied</h4>
          <p>You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return children;
}
