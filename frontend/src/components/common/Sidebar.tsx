import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUsers, FaUser, FaFileAlt, FaCog, FaBell, FaBars, FaTimes, FaAngleDoubleLeft, FaAngleDoubleRight, FaPaperPlane } from 'react-icons/fa';
interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false); // Mobile toggle

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-1 left-4 z-20 text-white bg-primary p-2 rounded-md"
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
        {/* Header with Collapse Toggle */}
        <div className="p-4 text-xl font-bold border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {!isCollapsed && <span>SmartPulse Admin</span>}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            className="hidden md:inline-flex top-4 right-4 z-20 bg-primary p-2 rounded-m border-none focus:outline-none "
            onClick={toggleCollapse}
            aria-label="Collapse sidebar"
          >
            {isCollapsed ? <FaAngleDoubleRight size={20} /> : <FaAngleDoubleLeft size={20} />}
          </button>

          {/* Mobile Close Button */}
          <button
            className=" block md:hidden text-white bg-primary p-2 rounded-md"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/admin/dashboard/team-overview"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md transition-colors duration-200 ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-gray-700'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaUsers className="mr-2" />
                {!isCollapsed && <span>Team Overview</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/dashboard/employee-insights"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md transition-colors duration-200 ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-gray-700'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaUser className="mr-2" />
                {!isCollapsed && <span>Employee Insights</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/dashboard/reports"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md transition-colors duration-200 ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-gray-700'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaFileAlt className="mr-2" />
                {!isCollapsed && <span>Reports</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/dashboard/assign-projects"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md transition-colors duration-200 ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-gray-700'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaPaperPlane className="mr-2" />
                {!isCollapsed && <span>Project Assignment</span>}
              </NavLink>
            </li>
            
            <li>
              <NavLink
                to="/admin/dashboard/alerts"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md transition-colors duration-200 ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-gray-700'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaBell className="mr-2" />
                {!isCollapsed && (
                  <>
                    <span>Alerts</span>
                   
                  </>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/dashboard/settings"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md transition-colors duration-200 ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-gray-700'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaCog className="mr-2" />
                {!isCollapsed && <span>Settings</span>}
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-0"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
// Note: This code is a complete Sidebar component for an admin dashboard.
// It includes mobile and desktop responsiveness, with a toggle for collapsing the sidebar.