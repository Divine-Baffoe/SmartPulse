import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

interface Props {
  userEmail: string;
  userPhotoUrl?: string;
  isCollapsed: boolean;
}

const AdminDashboardHeader: React.FC<Props> = ({ userEmail, userPhotoUrl, isCollapsed }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header
      className={`flex justify-between items-center py-4 backdrop-blur-md bg-white/70 shadow transition-all duration-300 ${
        isCollapsed ? 'pl-24 pr-4' : 'pl-80 pr-8'
      } sm:pl-4 sm:pr-4`}
    >
      {/* Left Section: Welcome message and time hidden in mobile view  */}
      <div className="hidden md:block">
        <h1 className="text-xl font-semibold text-primary mb-1">Welcome back, Admin!</h1>
        <p className="text-sm text-gray-500">
          {currentTime.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}{' '}
          - {currentTime.toLocaleTimeString()}
        </p>
      </div>

      {/* Right Section */}
      <div className="h-5 flex items-center justify-end">
        <div className="relative">
          <button
            className="flex items-center text-gray-600 hover:text-primary text-sm font-medium space-x-2 focus:outline-none"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            aria-label="User menu"
          >
            {userPhotoUrl ? (
              <img
                src={userPhotoUrl}
                alt="User avatar"
                className="h-10 w-10 rounded-full object-cover border-2 border-primary"
              />
            ) : (
              <FaUserCircle className="h-8 w-8 text-gray-400" />
            )}
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 transition duration-200 ease-in-out z-50">
              <div className="px-4 py-2 border-b">
                <span className="block text-gray-700 text-sm">{userEmail}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                aria-label="Logout"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminDashboardHeader;
// This component is used in the AdminDashboard component to display the header with user information and current time.