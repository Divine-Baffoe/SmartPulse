// src/components/dashboard/Reports.tsx
import React, { useState, useEffect } from 'react';
import { FaDownload, FaPlus } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { CSVLink } from 'react-csv';
import Modal from 'react-modal';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

// Bind Modal to app root
Modal.setAppElement('#root');

// Define TypeScript interfaces
interface Report {
  id: number;
  userId: number;
  name: string;
  timeWorked: { hours: number; minutes: number };
  productivity: number; // %
  idleTime: { hours: number; minutes: number };
  appsUsed: { name: string; percentage: number }[];
  websitesUsed: { name: string; percentage: number }[];
}

interface CustomReport {
  metrics: string[];
  period: 'day' | 'week' | 'month';
}

// Mock data (replace with API call)
{/*const fetchMockReports = (): Promise<Report[]> =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          {
            id: 1,
            userId: 1,
            name: 'Maureen Semenhyia',
            timeWorked: { hours: 2, minutes: 45 },
            productivity: 70,
            idleTime: { hours: 0, minutes: 30 },
            appsUsed: [
              { name: 'Slack', percentage: 30 },
              { name: 'VS Code', percentage: 40 },
            ],
            websitesUsed: [
              { name: 'Google', percentage: 50 },
              { name: 'GitHub', percentage: 30 },
            ],
          },
          {
            id: 2,
            userId: 2,
            name: 'Phoebe McBrown',
            timeWorked: { hours: 1, minutes: 30 },
            productivity: 60,
            idleTime: { hours: 0, minutes: 15 },
            appsUsed: [
              { name: 'Zoom', percentage: 50 },
              { name: 'Chrome', percentage: 30 },
            ],
            websitesUsed: [
              { name: 'YouTube', percentage: 40 },
              { name: 'Reddit', percentage: 20 },
            ],
          },
        ]),
      1000,
    ),
  );*/}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customReport, setCustomReport] = useState<CustomReport>({
    metrics: ['productivity', 'timeWorked'],
    period: 'day',
  });
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  // Fetch reports with retry
  const fetchReports = async (retries = 3): Promise<void> => {
    try {
      const data = await fetch('http://localhost:3000/api/user/reports?period=month', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      const dataJson = await data.json();
      setReports(dataJson);
      setLoading(false);
    } catch (err) {
      if (retries > 0) {
        setTimeout(() => fetchReports(retries - 1), 1000);
      } else {
        setError(
          typeof err === 'object' && err !== null && 'message' in err
            ? String((err as { message?: string }).message)
            : 'Failed to load reports'
        );
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchReports();
  }, [period]);

  const handleRowClick = (id: number) => {
    setSelectedReportId(selectedReportId === id ? null : id);
  };

  const handleCustomReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Generating custom report:', customReport);
    setIsCustomModalOpen(false);
  };

  const csvData = reports.map((report) => ({
    Name: report.name,
    TimeWorked: `${report.timeWorked.hours}h ${report.timeWorked.minutes}m`,
    Productivity: `${report.productivity}%`,
    IdleTime: `${report.idleTime.hours}h ${report.idleTime.minutes}m`,
  }));

  const chartData = reports.map((report) => ({
    name: report.name,
    Productivity: report.productivity,
    IdleTime: (report.idleTime.hours * 60 + report.idleTime.minutes) / 60, // Convert to hours
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
        Reports
      </h2>
      <div className="bg-white p-8 rounded-lg shadow-lg space-y-6 transition-opacity duration-300 ease-in-out">
        {/* Filters */}
        <div className="flex justify-between items-center">
          <div>
            <label htmlFor="period" className="text-gray-600 mr-2">
              Time Period:
            </label>
            <select
              id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value as 'day' | 'week' | 'month')}
              className="border p-2 rounded focus:ring-2 focus:ring-primary transition-colors duration-200 text-sm focus:outline-none"
              aria-label="Select time period"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-1"
              data-tooltip-id="custom-report-tooltip"
              data-tooltip-content="Create a custom report"
              aria-label="Create custom report"
            >
              <FaPlus className="w-4 h-4" />
              <span>Custom Report</span>
            </button>
            <CSVLink
              data={csvData}
              filename="smartpulse-reports.csv"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300 flex items-center space-x-1"
              data-tooltip-id="export-csv-tooltip"
              data-tooltip-content="Export reports as CSV"
              aria-label="Export as CSV"
            >
              <FaDownload className="w-4 h-4" />
              <span>Export CSV</span>
            </CSVLink>
          </div>
          <ReactTooltip id="custom-report-tooltip" className="z-50" />
          <ReactTooltip id="export-csv-tooltip" className="z-50" />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="text-sm font-semibold text-gray-600">Total Hours Worked</h3>
            <p className="text-lg font-bold text-gray-800">
              {reports.reduce((sum, r) => sum + r.timeWorked.hours + r.timeWorked.minutes / 60, 0).toFixed(1)}h
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="text-sm font-semibold text-gray-600">Avg. Productivity</h3>
            <p className="text-lg font-bold text-gray-800">
              {(reports.reduce((sum, r) => sum + r.productivity, 0) / reports.length || 0).toFixed(0)}%
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="text-sm font-semibold text-gray-600">Total Idle Time</h3>
            <p className="text-lg font-bold text-gray-800">
              {reports.reduce((sum, r) => sum + r.idleTime.hours + r.idleTime.minutes / 60, 0).toFixed(1)}h
            </p>
          </div>
        </div>

        {/* Productivity Chart */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Team Productivity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <RechartsTooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="Productivity" fill="#EC4899" />
              <Bar dataKey="IdleTime" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Reports Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-50 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Employee</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Time Worked</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Productivity</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Idle Time</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-500">
                    No reports available
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-t hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                    onClick={() => handleRowClick(report.id)}
                  >
                    <td className="p-3 text-gray-700">{report.name}</td>
                    <td className="p-3">
                      {report.timeWorked.hours}h {report.timeWorked.minutes}m
                    </td>
                    <td className="p-3">{report.productivity}%</td>
                    <td className="p-3">
                      {report.idleTime.hours}h {report.idleTime.minutes}m
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {selectedReportId && (
            <div className="p-4 bg-gray-50 rounded-b-lg transition-opacity duration-200">
              <h4 className="text-sm font-semibold text-gray-700">
                Details for {reports.find((r) => r.id === selectedReportId)?.name}
              </h4>
              <p className="text-sm text-gray-600">Apps: {reports.find((r) => r.id === selectedReportId)?.appsUsed.map((app) => `${app.name} (${app.percentage}%)`).join(', ')}</p>
              <p className="text-sm text-gray-600">Websites: {reports.find((r) => r.id === selectedReportId)?.websitesUsed.map((site) => `${site.name} (${site.percentage}%)`).join(', ')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Report Modal */}
      <Modal
        isOpen={isCustomModalOpen}
        onRequestClose={() => setIsCustomModalOpen(false)}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto mt-20 w-full"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h3 className="text-lg font-bold text-gray-700 mb-4">Create Custom Report</h3>
        <form onSubmit={handleCustomReportSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Metrics</label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={customReport.metrics.includes('productivity')}
                  onChange={() => {
                    setCustomReport({
                      ...customReport,
                      metrics: customReport.metrics.includes('productivity')
                        ? customReport.metrics.filter((m) => m !== 'productivity')
                        : [...customReport.metrics, 'productivity'],
                    });
                  }}
                  className="mr-2 focus:ring-primary"
                />
                Productivity
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={customReport.metrics.includes('timeWorked')}
                  onChange={() => {
                    setCustomReport({
                      ...customReport,
                      metrics: customReport.metrics.includes('timeWorked')
                        ? customReport.metrics.filter((m) => m !== 'timeWorked')
                        : [...customReport.metrics, 'timeWorked'],
                    });
                  }}
                  className="mr-2 focus:ring-primary"
                />
                Time Worked
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={customReport.metrics.includes('idleTime')}
                  onChange={() => {
                    setCustomReport({
                      ...customReport,
                      metrics: customReport.metrics.includes('idleTime')
                        ? customReport.metrics.filter((m) => m !== 'idleTime')
                        : [...customReport.metrics, 'idleTime'],
                    });
                  }}
                  className="mr-2 focus:ring-primary"
                />
                Idle Time
              </label>
            </div>
            <div>
              <label htmlFor="customPeriod" className="block text-sm font-medium text-gray-600">
                Time Period
              </label>
              <select
                id="customPeriod"
                value={customReport.period}
                onChange={(e) =>
                  setCustomReport({ ...customReport, period: e.target.value as 'day' | 'week' | 'month' })
                }
                className="w-full border p-2 rounded focus:ring-2 focus:ring-primary text-sm"
                aria-label="Select time period"
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsCustomModalOpen(false)}
              className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 transition-colors duration-300"
            >
              Generate
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Reports;