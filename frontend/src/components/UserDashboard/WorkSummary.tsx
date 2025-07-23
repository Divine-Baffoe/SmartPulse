// src/components/dashboard/WorkSummary.tsx
import React, { useState, useEffect } from 'react';
import { FaDownload } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { CSVLink } from 'react-csv';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// Define TypeScript interfaces
interface WorkSummaryData {
  date: string;
  hours: number;
  productivity: number;
}

// Mock data (replace with API call)
{/*const fetchMockSummary = (userId: number, period: string): Promise<WorkSummaryData[]> =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          { date: '2025-06-24', hours: 7.5, productivity: 88 },
          { date: '2025-06-23', hours: 8, productivity: 90 },
        ]),
      1000,
    ),
  );*/}


const WorkSummary: React.FC = () => {
  const [summary, setSummary] = useState<WorkSummaryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
 

  // Fetch summary with retry
  const fetchSummary = async (retries = 3): Promise<void> => {
    try {
      const res = await fetch(`http://localhost:3000/api/employees/work-summary?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setSummary(data);
      setLoading(false);
    } catch (err) {
      if (retries > 0) {
        setTimeout(() => fetchSummary(retries - 1), 1000);
      } else {
        setError('Failed to load work summary');
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchSummary();
  }, [period]);

  const csvData = summary.map((entry) => ({
    Date: entry.date,
    Hours: entry.hours,
    Productivity: `${entry.productivity}%`,
  }));

  if (loading) {
    return <div className="p-6 pt-20 text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 pt-20 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 pt-2">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 transition-opacity duration-300 ease-in-out">
        Work Summary
      </h2>
      <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
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
          <CSVLink
            data={csvData}
            filename="work-summary.csv"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300 flex items-center space-x-1"
            data-tooltip-id="export-csv-tooltip"
            data-tooltip-content="Export your work summary as CSV"
            aria-label="Export as CSV"
          >
            <FaDownload className="w-4 h-4" />
            <span>Export CSV</span>
          </CSVLink>
          <ReactTooltip id="export-csv-tooltip" className="z-50" />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="text-sm font-semibold text-gray-600">Average Hours</h3>
            <p className="text-lg font-bold text-gray-800">
              {(summary.reduce((sum, entry) => sum + entry.hours, 0) / (summary.length || 1)).toFixed(1)}h
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="text-sm font-semibold text-gray-600">Average Productivity</h3>
            <p className="text-lg font-bold text-gray-800">
              {(summary.reduce((sum, entry) => sum + entry.productivity, 0) / (summary.length || 1)).toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Work Summary Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={summary} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" unit="h" />
              <YAxis yAxisId="right" orientation="right" unit="%" domain={[0, 100]} />
              <RechartsTooltip formatter={(value, name) => (name === 'productivity' ? `${value}%` : `${value}h`)} />
              <Bar yAxisId="left" dataKey="hours" fill="#3B82F6" name="Hours Worked" />
              <Bar yAxisId="right" dataKey="productivity" fill="#EC4899" name="Productivity" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-50 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Hours Worked</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Productivity</th>
              </tr>
            </thead>
            <tbody>
              {summary.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-3 text-center text-gray-500">
                    No work summary available
                  </td>
                </tr>
              ) : (
                summary.map((day) => (
                  <tr key={day.date} className="border-t hover:bg-gray-50 transition-colors duration-200">
                    <td className="p-3 text-gray-700">{day.date}</td>
                    <td className="p-3">{day.hours}h</td>
                    <td className="p-3">{day.productivity}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkSummary;