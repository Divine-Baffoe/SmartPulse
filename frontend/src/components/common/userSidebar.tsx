import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaChartBar,
  FaHeartbeat,
  FaCalendar,
  FaBars,
  FaTimes,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaPaperPlane,
  FaUser,
} from 'react-icons/fa';

export interface UserSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false); // Mobile state

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-1 left-4 z-20 text-white bg-primary p-2 rounded-md focus:outline-none"
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`h-full bg-gray-800 text-white fixed top-0 left-0 flex flex-col transition-all duration-300 ease-in-out z-30
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Sidebar Header */}
        <div className="p-4 text-xl font-bold border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {!isCollapsed && <span>SmartPulse</span>}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            className="hidden md:inline-flex bg-primary p-2 rounded-md focus:outline-none"
            onClick={toggleCollapse}
            aria-label="Collapse sidebar"
          >
            {isCollapsed ? <FaAngleDoubleRight size={20} /> : <FaAngleDoubleLeft size={20} />}
          </button>

          {/* Mobile Close Button */}
          <button
            className="block md:hidden text-white bg-primary p-2 rounded-md"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/user/dashboard/productivity"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md transition-colors duration-200 ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-gray-700'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaChartBar className="mr-2" />
                {!isCollapsed && <span>My Productivity</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user/dashboard/stress-insights"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md transition-colors duration-200 ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-gray-700'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaHeartbeat className="mr-2" />
                {!isCollapsed && <span>Work Analysis</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user/dashboard/work-summary"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md transition-colors duration-200 ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-gray-700'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaCalendar className="mr-2" />
                {!isCollapsed && <span>Work Summary</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user/dashboard/submit-project"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md transition-colors duration-200 ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-gray-700'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaPaperPlane className="mr-2" />
                {!isCollapsed && <span>Submit Project</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user/dashboard/settings"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md transition-colors duration-200 ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-gray-700'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaUser className="mr-2" />
                {!isCollapsed && <span>Profile</span>}
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-10"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default UserSidebar;
