import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
  const { admin, adminToken } = useAuth();

  // Check if valid admin token or admin role exists
  const isAuthorized = Boolean(adminToken && (admin?.role === 'admin' || !admin));

  if (!isAuthorized) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
