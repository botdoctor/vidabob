import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'reseller')[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['admin', 'reseller'],
  redirectTo = '/'
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to appropriate login based on the attempted route
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin" replace state={{ from: location }} />;
    } else if (location.pathname.startsWith('/reseller')) {
      return <Navigate to="/reseller/login" replace state={{ from: location }} />;
    }
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    // If user tries to access admin but is reseller, redirect to reseller
    if (user.role === 'reseller' && location.pathname.startsWith('/admin')) {
      return <Navigate to="/reseller" replace />;
    }
    // If user tries to access reseller but is admin, redirect to admin
    if (user.role === 'admin' && location.pathname.startsWith('/reseller')) {
      return <Navigate to="/admin" replace />;
    }
    // Default redirect
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;