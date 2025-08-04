import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import Modal from 'react-modal';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

// Bind Modal to app root
Modal.setAppElement('#root');

// Define TypeScript interfaces
interface StressData {
  stressLevel: number; // 0–100%
  workDuration: number; // Hours
  appSwitches: number; // Per hour
  breakTime: number; // Hours
  stressHistory: { date: string; stressLevel: number }[];
  tip: string;
}

interface User {
  id: number;
  name: string;
  companyId: number;
}

// Mock data (replace with API call)
const fetchMockStress = (userId: number, period: string): Promise<StressData> =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          stressLevel: 35,
          workDuration: 3.5,
          appSwitches: 15,
          breakTime: 0.2,
          stressHistory: [
            { date: '2025-06-14', stressLevel: 30 },
            { date: '2025-06-13', stressLevel: 40 },
            { date: '2025-06-12', stressLevel: 25 },
          ],
          tip: 'Take a 5-minute break every hour to reduce stress.',
        }),
      1000,
    ),
  );

const StressInsights: React.FC = () => {
  const [stress, setStress] = useState<StressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [stressRating, setStressRating] = useState<number>(1);
  const [showBreakAlert, setShowBreakAlert] = useState(false);



  // Fetch stress data with retry
  const fetchStats = async (retries = 3): Promise<void> => {
      try {
        const response = await fetch(`http://localhost:3000/api/employees/stress?period=${period}`, {
          headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                  }
        });
        if (!response.ok) throw new Error('Failed to fetch productivity stats');
        const data = await response.json();
        setStress(data);
        setLoading(false);
      } catch (err) {
        if (retries > 0) {
          setTimeout(() => fetchStats(retries - 1), 1000);
        } else {
          setError(
            typeof err === 'object' && err !== null && 'message' in err
              ? String((err as { message?: unknown }).message)
              : 'Failed to load productivity stats'
          );
          setLoading(false);
        }
      }
    };
  
    useEffect(() => {
      fetchStats();
    }, [period]);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reported stress rating:', stressRating);
    // TODO: Send to /api/user/stress-report
    setIsReportModalOpen(false);
  };

  const handleTakeBreak = () => {
    console.log('Starting 5-min break');
    // TODO: Trigger break timer or log break
    setShowBreakAlert(false);
  };

  if (loading) {
    return <div className="p-6 pt-20 text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 pt-20 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 pt-2">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 transition-opacity duration-300 ease-in-out">
        Workload Analysis
      </h2>
      <div className="bg-white p-8 rounded-lg shadow-lg space-y-6 transition-opacity duration-300 ease-in-out">
        {/* Filters and Actions */}
        <div className="flex justify-between items-center">
          <div>
            <label htmlFor="period" className="text-gray-600 mr-2">
              Time Period:
            </label>
            <select
              id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value as 'day' | 'week' | 'month')}
              className="border p-2 rounded focus:ring-2 focus:ring-primary transition-colors duration-200 text-sm"
              aria-label="Select time period"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-1"
              data-tooltip-id="report-stress-tooltip"
              data-tooltip-content="Report your current stress level"
              aria-label="Report stress level"
            >
              <FaPlus className="w-4 h-4" />
              <span>Report Stress</span>
            </button>
          </div>
          <ReactTooltip id="report-stress-tooltip" className="z-50" />
        </div>

        {/* Break Alert */}
        {showBreakAlert && (
          <div className="bg-yellow-100 p-4 rounded-lg flex justify-between items-center">
            <p className="text-yellow-800">
              High stress detected! Take a 5-minute break to recharge.
            </p>
            <button
              onClick={handleTakeBreak}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Take Break
            </button>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="text-sm font-semibold text-gray-600">Stress Level</h3>
            <p className="text-lg font-bold text-gray-800">{stress?.stressLevel}%</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="text-sm font-semibold text-gray-600">Work Duration</h3>
            <p className="text-lg font-bold text-gray-800">{stress?.workDuration.toFixed(1)}h</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="text-sm font-semibold text-gray-600">App Switches</h3>
            <p className="text-lg font-bold text-gray-800">{stress?.appSwitches}/hr</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="text-sm font-semibold text-gray-600">Break Time</h3>
            <p className="text-lg font-bold text-gray-800">{stress?.breakTime.toFixed(1)}h</p>
          </div>
        </div>

        {/* Stress Gauge Placeholder */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Current Stress Level</h3>
          <div className="flex flex-col items-center justify-center h-48">
            <div className="text-5xl font-bold text-primary">{stress?.stressLevel}%</div>
            <div className="text-gray-500 mt-2">Gauge chart visualization is not available.</div>
          </div>
          <p className="text-center text-gray-600 mt-2">Tip: {stress?.tip}</p>
        </div>

        {/* Stress History Chart */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Stress Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stress?.stressHistory || []} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis unit="%" />
              <RechartsTooltip formatter={(value) => `${value}%`} />
              <Line type="monotone" dataKey="stressLevel" stroke="#EC4899" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stress Report Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onRequestClose={() => setIsReportModalOpen(false)}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto mt-20 w-full"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h3 className="text-lg font-bold text-gray-700 mb-4">Report Stress Level</h3>
        <form onSubmit={handleReportSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Stress Level (1–5)</label>
              <select
                value={stressRating}
                onChange={(e) => setStressRating(Number(e.target.value))}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-primary text-sm"
                aria-label="Select stress level"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? '(Low)' : num === 5 ? '(High)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-1"
            >
              <FaPlus className="w-4 h-4" />
              <span>Submit Report</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StressInsights;