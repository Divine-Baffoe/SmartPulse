// src/components/Productivity/Alerts.tsx
import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaPaperPlane, FaTrash } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import Modal from 'react-modal';

//Marginally Effective

// Bind Modal to app root for accessibility
Modal.setAppElement('#root');

// Define TypeScript interfaces
interface Alert {
  id: number;
  userId: number;
  name: string;
  avatarUrl?: string;
  type: 'productive' | 'unproductive';
  details: string;
  activity: { productive: number; unproductive: number; undefined: number };
  timestamp: string;
}

interface Message {
  userId: number;
  message: string;
}

// Mock data (replace with API call)
{/*const fetchMockAlerts = (): Promise<Alert[]> =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          {
            id: 1,
            userId: 1,
            name: 'Maureen Semenhyia',
            type: 'productive',
            details: '70% productive time today',
            activity: { productive: 70, unproductive: 20, undefined: 10 },
            timestamp: '2025-06-10T10:00:00Z',
          },
          {
            id: 2,
            userId: 2,
            name: 'Phoebe McBrown',
            type: 'unproductive',
            details: '40% unproductive time today',
            activity: { productive: 50, unproductive: 40, undefined: 10 },
            timestamp: '2025-06-10T11:00:00Z',
          },
        ]),
      1000,
    ),
  );*/}

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<Message>({ userId: 0, message: '' });

  // Fetch alerts with retry
  const fetchAlerts = async (retries = 3): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/user/alerts', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data: Alert[] = await response.json();
      setAlerts(data);
      setLoading(false);
    } catch (err) {
      if (retries > 0) {
        setTimeout(() => fetchAlerts(retries - 1), 1000);
      } else {
        setError(
          typeof err === 'object' && err !== null && 'message' in err
            ? String((err as { message?: unknown }).message)
            : 'Failed to load alerts'
        );
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleRowClick = (id: number) => {
    setSelectedRow(selectedRow === id ? id : null);
  };

  const handleSendMessage = (userId: number, userName: string) => {
    setMessage({ userId: userId, message: `Regarding your productivity on ${userName},...` });
    setIsModalOpen(true);
  };

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call (replace with actual endpoint)
    try {
      // await fetch('/api/admin/messages', {
        // method: 'POST',
        // headers: {
          //   'Content-Type': 'application/json',
          //   Authorization: `Bearer ${localStorage.getItem('token')}`,
          // },
        // body: JSON.stringify(message),
        // });
      console.log('Message sent:', message);
      setIsModalOpen(false);
      setMessage({ userId: 0, message: '' });
    } catch (err) {
      alert(
        'An error occurred: ' +
          (typeof err === 'object' && err !== null && 'message' in err
            ? String((err as { message?: unknown }).message)
            : String(err))
      );
    }
  };

  const handleDismiss = (id: number) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center">Error: ${error}</div>;
  }

  return (
    <div className="p-6 pt-2">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 transition-opacity duration-300 ease-in-out">Employee Alerts</h2>
      <div className="bg-white">
        <table className="min-w-table">
          <thead>
            <tr>
              <th className="p-3">Employee</th>
              <th className="p-3">Alert Type</th>
              <th className="p-3">Details</th>
              <th className="p-3">Activity</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-3">No alerts available</td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="border-t"
                  onClick={() => handleRowClick(alert.id)}
                >
                  <td className="p-3">
                    <div className="flex">
                      {alert.avatarUrl ? (
                        <img
                          src={alert.avatarUrl}
                          alt={`${alert.name}'s avatar`}
                          className="w-8"
                          onError={(e) => (e.currentTarget.src = '/fallback-avatar.png')}
                        />
                      ) : (
                        <FaUserCircle className="w-8" aria-label="Default avatar" />
                      )}
                      <span className="font-medium">{alert.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        alert.type === 'productive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                    </span>
                  </td>
                  <td className="p-3">{alert.details}</td>
                  <td className="p-3">
                    <div
                      className="flex h-3"
                      data-tooltip-id={`activity-tooltip-${alert.id}`}
                      data-tooltip-content={`Productive: ${alert.activity.productive}%, Unproductive: ${alert.activity.unproductive}%, Undefined: ${alert.activity.undefined}%`}
                    >
                      <div
                        className="bg-pink-400"
                        style={{ width: `${alert.activity.productive}%` }}
                        title="Productive"
                      />
                      <div
                        className="bg-blue-400"
                        style={{ width: `${alert.activity.unproductive}%` }}
                        title="Unproductive"
                      />
                      <div
                        className="bg-green-400"
                        style={{ width: `${alert.activity.undefined}%` }}
                        title="Undefined"
                      />
                    </div>
                    <ReactTooltip id={`activity-tooltip-${alert.id}`} className="z-50" />
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleSendMessage(alert.userId, alert.name)}
                      className="text-primary"
                      aria-label={`Send message to ${alert.name}`}
                    >
                      <FaPaperPlane />
                    </button>
                    <button
                      onClick={() => handleDismiss(alert.id)}
                      className="text-gray-500"
                      aria-label={`Dismiss alert for ${alert.name}`}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {selectedRow && (
          <div className="p-4">
            <p className="text-sm">
              Details for {alerts.find((a) => a.id === selectedRow)?.name}: Placeholder for additional data.
            </p>
          </div>
        )}
      </div>

      {/* Message Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h3 className="text-lg font-bold mb-4">Send Message</h3>
        <form onSubmit={handleSubmitMessage}>
          <textarea
            value={message.message}
            onChange={(e) => setMessage({ ...message, message: e.target.value })}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-primary"
            rows={4}
            placeholder="Type your message..."
            aria-label="Message content"
          />
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Alerts;