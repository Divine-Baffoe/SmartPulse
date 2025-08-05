// src/pages/AdminDashboard.tsx
import React from 'react';
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import AdminDashboardHeader from '../components/common/AdminDashboardHeader';
import TeamOverview from '../components/AdminDashboard/TeamOverview';
import EmployeeInsights from '../components/AdminDashboard/EmployeeInsight';
import Alerts from '../components/AdminDashboard/Alerts';
import Settings from '../components/AdminDashboard/Settings';
import Reports from '../components/AdminDashboard/Reports';
import Assign from '../components/AdminDashboard/AssignProjects';
import AssignProject from '../components/common/AssignProject';


// Tab Components








// Main AdminDashboard Component
const AdminDashboard: React.FC = () => {
  // (Actual  AuthContext )
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userEmail = user?.email || 'Admin';
  const userName = user?.name || 'Admin';

   const [isCollapsed, setIsCollapsed] = useState(false);

  console.log('User from localStorage:', user);

  return (
    <div className="flex min-h-screen">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className={`flex-1 min-h-screen bg-gray-200 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} ml-0`}>

        <AdminDashboardHeader
          userName={userName}
          userEmail={userEmail}
          isCollapsed={isCollapsed}
        />
        <Routes>
          <Route path="/" element={<TeamOverview />} />
          <Route path="team-overview" element={<TeamOverview />} />
          <Route path="employee-insights" element={<EmployeeInsights />} />
          <Route path="reports" element={<Reports />} />
          <Route path="assign-projects" element={<Assign />} />
          <Route path="assign-project" element={<AssignProject/>} />
          <Route path="settings" element={<Settings />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="*" element={<Navigate to="/admin/dashboard/team-overview" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;