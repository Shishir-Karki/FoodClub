import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Protect admin routes
  if (location.pathname === '/admin' && 
      !(userRole === 'ADMIN' || userRole === 'SUPERADMIN')) {
    return <Navigate to="/food" replace />;
  }

  return children;
}

export default PrivateRoute;