import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

/**
 * ProtectedRoute component - Guards routes by authentication and optional roles
 * @param {Array<string>} allowedRoles - Optional list of permitted roles (e.g. ['admin'], ['owner'])
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <Loader size="lg" message="Verifying authentication credentials..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Redirect to login preserving intended path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization if specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
