import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { MainLayout } from './components/layout/MainLayout';

import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Employees } from './pages/Employees/Employees';
import { Departments } from './pages/Departments/Departments';
import { Positions } from './pages/Positions/Positions';
import { Attendance } from './pages/Attendance/Attendance';
import { Schedule } from './pages/Schedule/Schedule';
import { Salary } from './pages/Salary/Salary';
import { MySalary } from './pages/Salary/MySalary';
import { Rewards } from './pages/Rewards/Rewards';
import { Leaves } from './pages/Leaves/Leaves';
import { Reports } from './pages/Reports/Reports';
import { Profile } from './pages/Profile/Profile';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '36px', color: 'var(--primary)' }}></i>
      </div>
    );
  }
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Application Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="employees" element={<Employees />} />
              <Route path="departments" element={<Departments />} />
              <Route path="positions" element={<Positions />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="salary" element={<Salary />} />
              <Route path="my-salary" element={<MySalary />} />
              <Route path="rewards" element={<Rewards />} />
              <Route path="leaves" element={<Leaves />} />
              <Route path="reports" element={<Reports />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};
