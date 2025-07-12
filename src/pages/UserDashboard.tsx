import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import UserSidebar from '../components/common/userSidebar';
import MyProductivity from '../components/UserDashboard/MyProductivity';
import UserHeader from '../components/common/UserHeader';
import StressInsights from '../components/UserDashboard/StressInsights';
import Settings from '../components/UserDashboard/Settings';
import WorkSummary from '../components/UserDashboard/WorkSummary';





// Main UserDashboard Component
const UserDashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const UserEmail = user?.email || 'User';
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className=" flex min-h-screen bg-white">
      
        <UserSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        <div className={`flex-1 min-h-screen bg-white transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} ml-0`} >
          {/* User Header */}
            <UserHeader
              userEmail={UserEmail}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed} 
            />
          <Routes>
            <Route path="productivity" element={<MyProductivity />} />
            <Route path="stress-insights" element={<StressInsights />} />
            <Route path="work-summary" element={<WorkSummary />} />
            <Route path="settings" element={<Settings />} />
            <Route path="/" element={<MyProductivity />} />
          </Routes>
        </div>
     
    </div>
  );
};

export default UserDashboard;