import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GetStarted from './pages/getStarted';
import Register from './pages/register';
import Login from './pages/loginPage';
import ForgotPassword from './pages/forgotPassword';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

const PrivateRoute = ({ children, allowedRole }: { children: React.ReactElement, allowedRole: string }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/login" replace />;
  return children;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/getstarted" replace />} />
        <Route path="/getstarted" element={<GetStarted />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
            path="/admin/dashboard/*"
            element={
              <PrivateRoute allowedRole="ADMIN">
                <AdminDashboard />
              </PrivateRoute>
            }
        />
        <Route
            path="/user/dashboard/*"
            element={
              <PrivateRoute allowedRole="EMPLOYEE">
                <UserDashboard />
              </PrivateRoute>
            }
        />
        <Route path="*" element={<Navigate to="/getstarted" replace />} />
        
       
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;