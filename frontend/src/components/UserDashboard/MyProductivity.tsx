// src/components/dashboard/MyProductivity.tsx
import React, { useState, useEffect } from 'react';
import { FaDownload, FaGlobe, FaThLarge } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { CSVLink } from 'react-csv';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
} from 'recharts';

// Define TypeScript interfaces
interface ProductivityStats {
  productivity: { productive: number; unproductive: number; undefined: number };
  hoursWorked: number;
  idleTime: number;
  topApps: { name: string; percentage: number }[];
  topWebsites: { name: string; percentage: number }[];
  activityHistory: { date: string; productive: number; unproductive: number; undefined: number }[];
}

interface User {
  id: number;
  name: string;
  companyId: number;
}

interface PieChartData {
  name: string;
  percentage: number;
}

// Mock data (replace with API call)
const fetchMockStats = (userId: number, period: string): Promise<ProductivityStats> =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          productivity: { productive: 70, unproductive: 20, undefined: 10 },
          hoursWorked: 7.5,
          idleTime: 0.5,
          topApps: [
            { name: 'VS Code', percentage: 40 },
            { name: 'Slack', percentage: 30 },
            { name: 'Chrome', percentage: 20 },
            { name: 'Zoom', percentage: 10 },
          ],
          topWebsites: [
            { name: 'Google', percentage: 50 },
            { name: 'GitHub', percentage: 30 },
            { name: 'Stack Overflow', percentage: 10 },
            { name: 'YouTube', percentage: 10 },
          ],
          activityHistory: [
            { date: '2025-06-14', productive: 65, unproductive: 25, undefined: 10 },
            { date: '2025-06-13', productive: 75, unproductive: 15, undefined: 10 },
          ],
        }),
      1000,
    ),
  );

const COLORS_WEBSITES = ['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];
const COLORS_APPS = ['#BE34EB', '#8A54B9', '#694688', '#5B3D76', '#49325D', '#331B48'];

// Reusable PieChartCard component (from TeamOverview.tsx)
const PieChartCard: React.FC<{
  title: string;
  data: PieChartData[];
  icon: React.ReactNode;
  tooltipId: string;
  tooltipContent: string;
  onClick: () => void;
  isSelected: boolean;
}> = ({ title, data, icon, tooltipId, tooltipContent, onClick, isSelected }) => {
  return (
    <div
      className="bg-white p-8 rounded-lg shadow-lg flex flex-col cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
      onClick={onClick}
      data-tooltip-id={tooltipId}
      data-tooltip-content={tooltipContent}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-gray-700">{title}</h3>
        {icon}
      </div>
      <div className="flex flex-row items-center justify-between flex-1">
        <div className="w-1/2">
          {data.length === 0 ? (
            <div className="text-center text-gray-500">No data available</div>
          ) : (
            <ul className="space-y-1">
              {data.map((item, idx) => (
                <li key={item.name} className="flex items-center space-x-2">
                  <span
                    className="inline-block w-5 h-2 rounded-sm"
                    style={{
                      backgroundColor:
                        title === 'Top Apps'
                          ? COLORS_APPS[idx % COLORS_APPS.length]
                          : COLORS_WEBSITES[idx % COLORS_WEBSITES.length],
                    }}
                  ></span>
                  <span className="font-medium text-gray-700">{item.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="w-1/2" role="img" aria-label={`Pie chart showing ${title.toLowerCase()} usage`}>
          {data.length === 0 ? (
            <div className="text-center text-gray-500">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="percentage"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  activeShape={(props: React.ComponentProps<typeof Sector>) => <Sector {...props} stroke="none" strokeWidth={0} />}
                  labelLine={false}
                  label={({ percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text
                        x={x}
                        y={y}
                        fill={percent < 0.15 ? '#333' : '#fff'}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={13}
                        fontWeight="bold"
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        title === 'Top Apps'
                          ? COLORS_APPS[index % COLORS_APPS.length]
                          : COLORS_WEBSITES[index % COLORS_WEBSITES.length]
                      }
                    />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      {isSelected && (
        <div className="mt-4 text-sm text-gray-600 transition-opacity duration-200">
          Based on {title.toLowerCase()} tracking data for the selected period.
        </div>
      )}
    </div>
  );
};

const MyProductivity: React.FC = () => {
  const [stats, setStats] = useState<ProductivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [selectedStat, setSelectedStat] = useState<string | null>(null);

  // Mock user (replace with auth context)
  const user: User = { id: 1, name: 'Maureen Semenhyia', companyId: 1 };

  // Fetch stats with retry
  const fetchStats = async (retries = 3): Promise<void> => {
    try {
      const data = await fetchMockStats(user.id, period);
      setStats(data);
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

  const csvData = stats?.activityHistory.map((entry) => ({
    Date: entry.date,
    Productive: `${entry.productive}%`,
    Unproductive: `${entry.unproductive}%`,
    Undefined: `${entry.undefined}%`,
  })) || [];

  const handleStatClick = (stat: string) => {
    setSelectedStat(selectedStat === stat ? null : stat);
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
        My Productivity
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
            <CSVLink
              data={csvData}
              filename="my-productivity.csv"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300 flex items-center space-x-1"
              data-tooltip-id="export-csv-tooltip"
              data-tooltip-content="Export your productivity data as CSV"
              aria-label="Export as CSV"
            >
              <FaDownload className="w-4 h-4" />
              <span>Export CSV</span>
            </CSVLink>
            <a
              href="/downloads/smartpulse-agent.exe"
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-1"
              data-tooltip-id="download-agent-tooltip"
              data-tooltip-content="Download SmartPulse agent to track activity"
              aria-label="Download agent"
            >
              <FaDownload className="w-4 h-4" />
              <span>Download Agent</span>
            </a>
          </div>
          <ReactTooltip id="export-csv-tooltip" className="z-50" />
          <ReactTooltip id="download-agent-tooltip" className="z-50" />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="text-sm font-semibold text-gray-600">Productivity Score</h3>
            <p className="text-lg font-bold text-gray-800">{stats?.productivity.productive}%</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="text-sm font-semibold text-gray-600">Hours Worked</h3>
            <p className="text-lg font-bold text-gray-800">{stats?.hoursWorked.toFixed(1)}h</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="text-sm font-semibold text-gray-600">Idle Time</h3>
            <p className="text-lg font-bold text-gray-800">{stats?.idleTime.toFixed(1)}h</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="text-sm font-semibold text-gray-600">Top App</h3>
            <p className="text-lg font-bold text-gray-800">{stats?.topApps[0]?.name || 'None'}</p>
          </div>
        </div>

        {/* Productivity Chart */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Productivity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={[stats?.productivity || { productive: 0, unproductive: 0, undefined: 0 }]}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <RechartsTooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="productive" fill="#EC4899" stackId="a" name="Productive" />
              <Bar dataKey="unproductive" fill="#3B82F6" stackId="a" name="Unproductive" />
              <Bar dataKey="undefined" fill="#10B981" stackId="a" name="Undefined" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Apps and Top Websites */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PieChartCard
            title="Top Apps"
            data={stats?.topApps || []}
            icon={<FaThLarge className="text-primary h-8 w-8" />}
            tooltipId="app-usage-tooltip"
            tooltipContent="Top applications you used"
            onClick={() => handleStatClick('topApps')}
            isSelected={selectedStat === 'topApps'}
          />
          <ReactTooltip id="app-usage-tooltip" className="z-50" />
          <PieChartCard
            title="Top Websites"
            data={stats?.topWebsites || []}
            icon={<FaGlobe className="text-primary h-8 w-8" />}
            tooltipId="websites-used-tooltip"
            tooltipContent="Most visited websites"
            onClick={() => handleStatClick('topWebsites')}
            isSelected={selectedStat === 'topWebsites'}
          />
          <ReactTooltip id="websites-used-tooltip" className="z-50" />
        </div>

        {/* Activity History Table */}
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Activity History</h3>
          <table className="min-w-full bg-gray-50 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Productive</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Unproductive</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Undefined</th>
              </tr>
            </thead>
            <tbody>
              {stats?.activityHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-500">
                    No activity history available
                  </td>
                </tr>
              ) : (
                stats?.activityHistory.map((entry) => (
                  <tr
                    key={entry.date}
                    className="border-t hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="p-3 text-gray-700">{entry.date}</td>
                    <td className="p-3">{entry.productive}%</td>
                    <td className="p-3">{entry.unproductive}%</td>
                    <td className="p-3">{entry.undefined}%</td>
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

export default MyProductivity;