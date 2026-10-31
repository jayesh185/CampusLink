import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Public Views
import LandingPage from '../features/landing/LandingPage.jsx';
import LoginPage from '../features/auth/LoginPage.jsx';
import RegisterPage from '../features/auth/RegisterPage.jsx';

// Guards & Layouts
import ProtectedRoute from '../routes/ProtectedRoute.jsx';
import RoleRoute from '../routes/RoleRoute.jsx';
import StudentLayout from '../layouts/StudentLayout.jsx';
import RecruiterLayout from '../layouts/RecruiterLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';

// Dashboards
import StudentDashboard from '../features/student/StudentDashboard.jsx';
import RecruiterDashboard from '../features/recruiter/RecruiterDashboard.jsx';
import AdminOverview from '../features/admin/AdminOverview.jsx';

export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },

  // Protected Student Section
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={['student']} />,
        children: [
          {
            path: '/student',
            element: <StudentLayout />,
            children: [
              { index: true, element: <Navigate to="/student/dashboard" replace /> },
              { path: 'dashboard', element: <StudentDashboard /> },
              { path: 'profile', element: <StudentDashboard /> },
              { path: 'resume', element: <StudentDashboard /> },
              { path: 'jobs', element: <StudentDashboard /> },
              { path: 'applications', element: <StudentDashboard /> },
              { path: 'interviews', element: <StudentDashboard /> },
            ],
          },
        ],
      },
    ],
  },

  // Protected Recruiter Section
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={['recruiter']} />,
        children: [
          {
            path: '/recruiter',
            element: <RecruiterLayout />,
            children: [
              { index: true, element: <Navigate to="/recruiter/dashboard" replace /> },
              { path: 'dashboard', element: <RecruiterDashboard /> },
              { path: 'jobs', element: <RecruiterDashboard /> },
              { path: 'applicants', element: <RecruiterDashboard /> },
              { path: 'interviews', element: <RecruiterDashboard /> },
              { path: 'reports', element: <RecruiterDashboard /> },
            ],
          },
        ],
      },
    ],
  },

  // Protected Admin Section
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={['admin']} />,
        children: [
          {
            path: '/admin',
            element: <AdminLayout />,
            children: [
              { index: true, element: <Navigate to="/admin/overview" replace /> },
              { path: 'overview', element: <AdminOverview /> },
              { path: 'recruiters', element: <AdminOverview /> },
              { path: 'students', element: <AdminOverview /> },
              { path: 'drives', element: <AdminOverview /> },
              { path: 'audit-logs', element: <AdminOverview /> },
            ],
          },
        ],
      },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;

