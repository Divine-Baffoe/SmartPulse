import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBars, FaChevronDown, FaUserTie, FaProjectDiagram, FaLaptopCode,
  FaUserCog, FaUserShield, FaCogs, FaUserCheck, FaChartLine, FaFileAlt
} from 'react-icons/fa';
import logo from '../../assets/images/logo.jpg';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDashboardOpen(false);
      }
    }
    if (dashboardOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dashboardOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-10 w-10 rounded-xl" />
            <Link to="/">
              <span className="text-2xl font-bold text-secondary">SmartPulse</span>
            </Link>
          </div>

          {/* Hamburger for mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-primary focus:outline-none"
            >
              <FaBars size={24} />
            </button>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center w-full">
            {/* Centered navigation links */}
            <div className="flex-1 flex justify-center space-x-6">
              {/* Features Dropdown */}
              <div className="relative group items-center h-full">
                <button
                  className="text-gray-600 hover:text-primary text-sm font-medium px-2 py-2 focus:outline-none"
                  onClick={() => setFeaturesOpen((open) => !open)}
                  tabIndex={0}
                  aria-haspopup="true"
                  aria-expanded={featuresOpen}
                >
                  Features
                </button>
                {featuresOpen && (
                  <div className="absolute z-50 bg-white shadow-lg rounded-md mt-2 py-2 w-56">
                    <Link to="/getstarted#feature-time-tracking" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setFeaturesOpen(false)}>
                      <FaUserCheck className="mr-2 text-blue-500" /> Time Tracking
                    </Link>
                    <Link to="/getstarted#feature-performance-monitoring" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setFeaturesOpen(false)}>
                      <FaChartLine className="mr-2 text-green-500" /> Performance Monitoring
                    </Link>
                    <Link to="/getstarted#feature-automated-reporting" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setFeaturesOpen(false)}>
                      <FaFileAlt className="mr-2 text-purple-500" /> Automated Reporting
                    </Link>
                  </div>
                )}
              </div>
              {/* Solutions Dropdown */}
              <div className="relative items-center h-full">
                <button
                  className="text-gray-600 hover:text-primary text-sm font-medium px-2 py-2 focus:outline-none"
                  onClick={() => setSolutionsOpen((open) => !open)}
                  tabIndex={0}
                  aria-haspopup="true"
                  aria-expanded={solutionsOpen}
                >
                  Solutions
                </button>
                {solutionsOpen && (
                  <div className="absolute bg-white shadow-lg rounded-md mt-2 py-2 w-64 z-50">
                    <Link to="/getstarted#solution-hr-manager" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setSolutionsOpen(false)}>
                      <FaUserCog className="mr-2 text-pink-500" /> For HR Manager
                    </Link>
                    <Link to="/getstarted#solution-executive" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setSolutionsOpen(false)}>
                      <FaUserShield className="mr-2 text-yellow-500" /> For Executive
                    </Link>
                    <Link to="/getstarted#solution-operations" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setSolutionsOpen(false)}>
                      <FaCogs className="mr-2 text-gray-500" /> For Operations Team
                    </Link>
                    <Link to="/getstarted#solution-sales-manager" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setSolutionsOpen(false)}>
                      <FaUserTie className="mr-2 text-blue-500" /> For Sales Manager
                    </Link>
                    <Link to="/getstarted#solution-project-manager" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setSolutionsOpen(false)}>
                      <FaProjectDiagram className="mr-2 text-green-500" /> For Project Manager
                    </Link>
                    <Link to="/getstarted#solution-it-manager" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setSolutionsOpen(false)}>
                      <FaLaptopCode className="mr-2 text-purple-500" /> For IT Manager
                    </Link>
                  </div>
                )}
              </div>
              <div className='flex items-center h-full'>
                <Link to="/company#" className="text-gray-600 hover:text-primary text-sm font-medium px-2 py-2">Company</Link>
              </div>
              
              
            </div>
            {/* Auth Links */}
            <div className="flex items-center space-x-4 ml-auto">
              <Link
                to="/register"
                className="bg-secondary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
              >
                Get Started
              </Link>
              <Link to="/login" className="text-gray-600 hover:text-primary text-sm font-medium">
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white px-4 pt-4 pb-6 space-y-2 shadow-inner">
            {/* Features */}
            <div>
              <button
                onClick={() => setFeaturesOpen(!featuresOpen)}
                className="w-full text-left text-gray-700 font-medium flex justify-between items-center"
              >
                Features <FaChevronDown className={`transition-transform ${featuresOpen ? 'rotate-180' : ''}`} />
              </button>
              {featuresOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  <Link to="/getstarted#feature-time-tracking" className="flex items-center text-sm text-gray-600">
                    <FaUserCheck className="mr-2 text-blue-500" /> Time Tracking
                  </Link>
                  <Link to="/getstarted#feature-performance-monitoring" className="flex items-center text-sm text-gray-600">
                    <FaChartLine className="mr-2 text-green-500" /> Performance Monitoring
                  </Link>
                  <Link to="/getstarted#feature-automated-reporting" className="flex items-center text-sm text-gray-600">
                    <FaFileAlt className="mr-2 text-purple-500" /> Automated Reporting
                  </Link>
                </div>
              )}
            </div>

            {/* Solutions */}
            <div>
              <button
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                className="w-full text-left text-gray-700 font-medium flex justify-between items-center"
              >
                Solutions <FaChevronDown className={`transition-transform ${solutionsOpen ? 'rotate-180' : ''}`} />
              </button>
              {solutionsOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  <Link to="/getstarted#solution-hr-manager" className="flex items-center text-sm text-gray-600" onClick={() => { setMobileMenuOpen(false); setSolutionsOpen(false); }}>
                    <FaUserCog className="mr-2 text-pink-500" /> For HR Manager
                  </Link>
                  <Link to="/getstarted#solution-executive" className="flex items-center text-sm text-gray-600" onClick={() => { setMobileMenuOpen(false); setSolutionsOpen(false); }}>
                    <FaUserShield className="mr-2 text-yellow-500" /> For Executive
                  </Link>
                  <Link to="/getstarted#solution-operations" className="flex items-center text-sm text-gray-600" onClick={() => { setMobileMenuOpen(false); setSolutionsOpen(false); }}>
                    <FaCogs className="mr-2 text-gray-500" /> For Operations Team
                  </Link>
                  <Link to="/getstarted#solution-sales-manager" className="flex items-center text-sm text-gray-600" onClick={() => { setMobileMenuOpen(false); setSolutionsOpen(false); }}>
                    <FaUserTie className="mr-2 text-blue-500" /> For Sales Manager
                  </Link>
                  <Link to="/getstarted#solution-project-manager" className="flex items-center text-sm text-gray-600" onClick={() => { setMobileMenuOpen(false); setSolutionsOpen(false); }}>
                    <FaProjectDiagram className="mr-2 text-green-500" /> For Project Manager
                  </Link>
                  <Link to="/getstarted#solution-it-manager" className="flex items-center text-sm text-gray-600" onClick={() => { setMobileMenuOpen(false); setSolutionsOpen(false); }}>
                    <FaLaptopCode className="mr-2 text-purple-500" /> For IT Manager
                  </Link>
                </div>
              )}
            </div>

            <Link to="/company" className="block text-gray-700 font-medium">Company</Link>

           

            {/* Auth Links */}
            <Link
              to="/register"
              className="block bg-secondary text-white text-center py-2 rounded-md text-sm font-medium mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
            <Link to="/login"
              className="block text-center text-gray-600 text-sm font-medium mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
