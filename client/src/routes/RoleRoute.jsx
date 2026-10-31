import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const RoleRoute = ({ allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');

  if (!token || !userJson) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userJson);
    if (!allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on actual role
      if (user.role === 'student') return <Navigate to="/student/dashboard" replace />;
      if (user.role === 'recruiter') return <Navigate to="/recruiter/dashboard" replace />;
      if (user.role === 'admin') return <Navigate to="/admin/overview" replace />;
      return <Navigate to="/login" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;

