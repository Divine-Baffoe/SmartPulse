import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="flex bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Vertically Stacked Sections */}
        <div className="flex flex-1 space-y-8 sm:space-y-0 sm:space-x-8 sm:flex-row sm:justify-between sm:items-start">
          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/product-overview" className="text-gray-400 hover:text-white text-sm">Overview</Link></li>
              <li><Link to="/product/how-it-works" className="text-gray-400 hover:text-white text-sm">How It Works</Link></li>
              <li><Link to="/product/features" className="text-gray-400 hover:text-white text-sm">Features</Link></li>
              <li><Link to="/product/integrations" className="text-gray-400 hover:text-white text-sm">Integrations</Link></li>
              <li><Link to="/product/data-privacy" className="text-gray-400 hover:text-white text-sm">Data Privacy & Security</Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Solutions</h3>
            <ul className="space-y-2">
              <li><Link to="/solutions/remote-workforce" className="text-gray-400 hover:text-white text-sm">Remote Workforce</Link></li>
              <li><Link to="/solutions/productivity-management" className="text-gray-400 hover:text-white text-sm">Productivity Management</Link></li>
              <li><Link to="/solutions/employee-monitoring" className="text-gray-400 hover:text-white text-sm">Employee Monitoring</Link></li>
              <li><Link to="/solutions/employee-burnout" className="text-gray-400 hover:text-white text-sm">Employee Burnout</Link></li>
              <li><Link to="/solutions/productivity-monitoring" className="text-gray-400 hover:text-white text-sm">Productivity Monitoring</Link></li>
              <li><Link to="/solutions/contact-center" className="text-gray-400 hover:text-white text-sm">Contact Center</Link></li>
              <li><Link to="/solutions/it" className="text-gray-400 hover:text-white text-sm">IT</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/resources/demo" className="text-gray-400 hover:text-white text-sm">Watch Demo</Link></li>
              <li><Link to="/resources/academy" className="text-gray-400 hover:text-white text-sm">StressTrack Academy</Link></li>
              <li><Link to="/resources/productivity-lab" className="text-gray-400 hover:text-white text-sm">Productivity Lab</Link></li>
              <li><Link to="/resources/resource-center" className="text-gray-400 hover:text-white text-sm">Resource Center</Link></li>
              <li><Link to="/resources/help-center" className="text-gray-400 hover:text-white text-sm">Help Center</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/support/workforce-management" className="text-gray-400 hover:text-white text-sm">Workforce Management</Link></li>
              <li><Link to="/support/employee-productivity" className="text-gray-400 hover:text-white text-sm">Employee Productivity</Link></li>
              <li><Link to="/support/workforce-analytics" className="text-gray-400 hover:text-white text-sm">Workforce Analytics</Link></li>
              <li><Link to="/support/productivity-monitoring" className="text-gray-400 hover:text-white text-sm">Productivity Monitoring</Link></li>
              <li><Link to="/support/employee-monitoring" className="text-gray-400 hover:text-white text-sm">Employee Monitoring</Link></li>
              <li><Link to="/support/user-activity-monitoring" className="text-gray-400 hover:text-white text-sm">User Activity Monitoring</Link></li>
              <li><Link to="/support/operational-efficiency" className="text-gray-400 hover:text-white text-sm">Operational Efficiency</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/company/about" className="text-gray-400 hover:text-white text-sm">About Us</Link></li>
              <li><Link to="/company/team" className="text-gray-400 hover:text-white text-sm">Meet the Team</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm">Contact Us</Link></li>
              <li><Link to="/request-quote" className="text-gray-400 hover:text-white text-sm">Request Quote</Link></li>
              <li><Link to="/request-demo" className="text-gray-400 hover:text-white text-sm">Request Demo</Link></li>
              <li><a href="mailto:info@stresstrack.com" className="text-gray-400 hover:text-white text-sm">info@stresstrack.com</a></li>
            </ul>
          </div>
        </div>

        {/* Legal and Copyright */}
        <div className="mt-8 border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400 text-sm mb-2">© 2025 SmartPulse</p>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center text-sm">
            <Link to="/cookies-settings" className="text-gray-400 hover:text-white">Cookies Settings</Link>
            <Link to="/us-privacy-notice" className="text-gray-400 hover:text-white">Ghana Privacy Notice</Link>
            <Link to="/terms-of-use" className="text-gray-400 hover:text-white">Website Terms of Use</Link>
            <Link to="/privacy-statement" className="text-gray-400 hover:text-white">Privacy Statement</Link>
            <Link to="/legal" className="text-gray-400 hover:text-white">Legal Information</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;