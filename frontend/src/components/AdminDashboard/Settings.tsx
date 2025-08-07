// src/components/dashboard/Settings.tsx
import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaUserMinus, FaSave, FaUserCircle } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import Modal from 'react-modal';

// Bind Modal to app root for accessibility
Modal.setAppElement('#root');

// Define TypeScript interfaces
interface User {
  id: number;
  avatarUrl?: string; // Google account image URL
  name: string;
  email: string;
  company?: string;
  role: 'employee' | 'admin';
}

interface SettingsData {
  trackingRules: {
    browserActivity: boolean;
    appActivity: boolean;
    idleTime: boolean;
  };
  notifications: {
    emailLowProductivity: boolean;
    inAppAlerts: boolean;
    productivityThreshold: number; // % for low productivity
  };
  users: User[];
}



const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<User>({ id: 0, name: '', email: '', role: 'employee', company: '' });
  const [userToRemove, setUserToRemove] = useState<number | null>(null);

  // Fetch settings with retry
  const fetchSettings = async (retries = 3): Promise<void> => {
    try {
      const data = await fetch('http://localhost:3000/api/user/settings', {
        headers: {  
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      const dataJson = await data.json();
      setSettings(dataJson);
      setLoading(false);
    } catch (err) {
      if (retries > 0) {
        setTimeout(() => fetchSettings(retries - 1), 1000);
      } else {
        setError(
          typeof err === 'object' && err !== null && 'message' in err
            ? String((err as { message: unknown }).message)
            : 'Failed to load settings'
        );
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    if (!settings) return;
    try {
     const res = await fetch('http://localhost:3000/api/user/update-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(settings),
      });
     if (!res.ok) {
            setError('Failed to save settings');
            return;
        }
        alert('Settings saved successfully');
    } catch (err) {
        setError('Failed to save settings');
    }
    };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings || !newUser.name || !newUser.email) return;
    try {
      // Simulate API call
      const newUserWithId = { ...newUser, id: settings.users.length + 1 };
      setSettings({
        ...settings,
        users: [...settings.users, newUserWithId],
      });
      setIsAddModalOpen(false);
      setNewUser({ id: 0, name: '', email: '', role: 'employee' });
    } catch (err) {
      setError(
        typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to add user'
      );
    }
  };

  const handleRemoveUser = async () => {
    if (!settings || !userToRemove) return;
    try {
      // Simulate API call
      setSettings({
        ...settings,
        users: settings.users.filter((user) => user.id !== userToRemove),
      });
      setIsRemoveModalOpen(false);
      setUserToRemove(null);
    } catch (err) {
      setError(
        typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to remove user'
      );
    }
  };

  const handleTrackingChange = (key: keyof SettingsData['trackingRules']) => {
    if (!settings) return;
    setSettings({
      ...settings,
      trackingRules: {
        ...settings.trackingRules,
        [key]: !settings.trackingRules[key],
      },
    });
  };

  const handleNotificationChange = (key: keyof SettingsData['notifications']) => {
    if (!settings) return;
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  };

  const handleThresholdChange = (value: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        productivityThreshold: value,
      },
    });
  };

  if (loading) {
    return <div className="p-6 pt-20 text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 pt-20 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 pt-2">
      <h2 className="text-3xl font-bold mb-6 transition-opacity duration-300 ease-in-out bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
        Settings
      </h2>
      <div className="bg-white p-8 rounded-lg shadow-lg space-y-6 transition-opacity duration-300 ease-in-out">
        {/* Manage Users */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Manage Users</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-1 focus:outline-none"
              data-tooltip-id="add-user-tooltip"
              data-tooltip-content="Add a new employee to the system"
              aria-label="Add employee"
            >
              <FaUserPlus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
            <button
              onClick={() => setIsRemoveModalOpen(true)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300 flex items-center space-x-1 focus:outline-none"
              data-tooltip-id="remove-user-tooltip"
              data-tooltip-content="Remove an existing employee"
              aria-label="Remove employee"
            >
              <FaUserMinus className="w-4 h-4" />
              <span>Remove Employee</span>
            </button>
          </div>
          <ReactTooltip id="add-user-tooltip" className="z-50" />
          <ReactTooltip id="remove-user-tooltip" className="z-50" />
          <div className="mt-4">
            <table className="min-w-full bg-gray-50 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">🧑‍💼 Name</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">📧 Email</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">🎯 Role</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">🏢 Company</th>
                </tr>
              </thead>
              <tbody>
                {settings?.users.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-3 text-center text-gray-500">
                      No users available
                    </td>
                  </tr>
                ) : (
                  settings?.users.map((user) => (
                    <tr key={user.id} className="border-t hover:bg-gray-50 transition-colors duration-200">
                      <td className="p-3 text-gray-700">
                        <div className="flex items-center space-x-2">
                            {user.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt={`${user.name}'s avatar`}
                                    className="h-8 w-8 rounded-full object-cover"
                                    onError={(e) => (e.currentTarget.src = '/fallback-avatar.png')} // Fallback image
                                />
                                ) : (
                                <FaUserCircle className="w-10 h-10 text-gray-400" aria-label="Default avatar" />
                                )}
                                <span className="font-medium text-gray-700">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-700">{user.email}</td>
                      <td className="p-3 text-gray-700">{user.role}</td>
                      <td className="p-3 text-gray-700">{user.company || 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tracking Rules */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Tracking Rules</h3>
          <div className="space-y-2">
            <label className="flex items-center text-gray-600">
              <input
                type="checkbox"
                checked={settings?.trackingRules.browserActivity}
                onChange={() => handleTrackingChange('browserActivity')}
                className="mr-2 focus:ring-primary"
                aria-label="Track browser activity"
              />
              Track browser activity
            </label>
            <label className="flex items-center text-gray-600">
              <input
                type="checkbox"
                checked={settings?.trackingRules.appActivity}
                onChange={() => handleTrackingChange('appActivity')}
                className="mr-2 focus:ring-primary"
                aria-label="Track app activity"
              />
              Track app activity
            </label>
            <label className="flex items-center text-gray-600">
              <input
                type="checkbox"
                checked={settings?.trackingRules.idleTime}
                onChange={() => handleTrackingChange('idleTime')}
                className="mr-2 focus:ring-primary"
                aria-label="Track idle time"
              />
              Track idle time
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Notifications</h3>
          <div className="space-y-2">
            <label className="flex items-center text-gray-600">
              <input
                type="checkbox"
                checked={settings?.notifications.emailLowProductivity}
                onChange={() => handleNotificationChange('emailLowProductivity')}
                className="mr-2 focus:ring-primary"
                aria-label="Email alerts for low productivity"
              />
              Email alerts for low productivity
            </label>
            <label className="flex items-center text-gray-600">
              <input
                type="checkbox"
                checked={settings?.notifications.inAppAlerts}
                onChange={() => handleNotificationChange('inAppAlerts')}
                className="mr-2 focus:ring-primary"
                aria-label="In-app alerts for low productivity"
              />
              In-app alerts for low productivity
            </label>
            <div className="flex items-center space-x-2">
              <label htmlFor="threshold" className="text-gray-600">
                Low productivity threshold (%):
              </label>
              <input
                id="threshold"
                type="number"
                value={settings?.notifications.productivityThreshold}
                onChange={(e) => handleThresholdChange(Number(e.target.value))}
                className="border p-1 rounded w-20 focus:ring-2 focus:ring-primary"
                min="0"
                max="100"
                aria-label="Productivity threshold"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-1"
            data-tooltip-id="save-settings-tooltip"
            data-tooltip-content="Save all settings changes"
            aria-label="Save settings"
          >
            <FaSave className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
          <ReactTooltip id="save-settings-tooltip" className="z-50" />
        </div>
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto mt-20 w-full"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h3 className="text-lg font-bold text-gray-700 mb-4">Add Employee</h3>
        <form onSubmit={handleAddUser}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-primary text-sm"
                aria-label="Employee name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-primary text-sm"
                aria-label="Employee email"
                required
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-600">
                Role
              </label>
              <select
                id="role"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'employee' | 'admin' })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-primary text-sm"
                aria-label="EMPLOYEE role"
              >
                <option value="employee">EMPLOYEE</option>
                <option value="admin">ADMIN</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 transition-colors duration-300"
            >
              Add
            </button>
          </div>
        </form>
      </Modal>

      {/* Remove Employee Modal */}
      <Modal
        isOpen={isRemoveModalOpen}
        onRequestClose={() => setIsRemoveModalOpen(false)}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto mt-20 w-full"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h3 className="text-lg font-bold text-gray-700 mb-4">Remove Employee</h3>
        <div className="space-y-4">
          <label htmlFor="removeUser" className="block text-sm font-medium text-gray-600">
            Select Employee
          </label>
          <select
            id="removeUser"
            value={userToRemove || ''}
            onChange={(e) => setUserToRemove(Number(e.target.value))}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-primary text-sm"
            aria-label="Select employee to remove"
          >
            <option value="">Select an employee</option>
            {settings?.users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setIsRemoveModalOpen(false)}
            className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleRemoveUser}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
            disabled={!userToRemove}
          >
            Remove
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;