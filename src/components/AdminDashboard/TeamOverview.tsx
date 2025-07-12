// src/components/dashboard/TeamOverview.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { FaUsers, FaChartLine, FaGlobe, FaThLarge, FaBan } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Sector
 
} from 'recharts';

// Define TypeScript interfaces

{/* BE34EB
8A54B9
694688
5B3D76
49325D
331B48
240A3A
4F225E
914AA9
A16AC0*/}


interface ProductivityData {
  productive: number; // % Productive (pink)
  unproductive: number; // % Unproductive (blue)
  undefined: number; // % Undefined (green)
  offline: number; // % Offline (red)
}

interface PieChartData {
  name: string;
  percentage: number;
}

interface TeamStats {
  ProductivityLevel: Record<'day' | 'week' | 'month' | 'year', ProductivityData>;
  topUsers: {
    name: string;
    hours: number;
    minutes: number;
    productive: number;
    unproductive: number;
    undefined: number;
  }[];
  WebsitesUsed: PieChartData[];
  appUsage: PieChartData[];
  BlacklistedWebsites: PieChartData[];
  BlacklistedVisits: {
    user: string;
    website: string;
    hours: number;
  }[];
}


// Define colors for pie chart segments (reduced for accessibility)
const COLORS_WEBSITES = ['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];
const COLORS_APPS = ['#BE34EB', '#8A54B9', '#694688', '#5B3D76', '#49325D', '#331B48'];

// Reusable PieChartCard component
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
      className="bg-gray-200 p-8 rounded-lg shadow-lg flex flex-col cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
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
                              title === 'MOST USED APPS'
                                ? COLORS_APPS[idx % COLORS_APPS.length]
                                : COLORS_WEBSITES[idx % COLORS_WEBSITES.length]
                          }}
                  ></span>
                  <span className="font-medium text-gray-700">{item.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="w-1/2 " role="img" aria-label={`Pie chart showing ${title.toLowerCase()} usage`}>
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
                        fill={percent < 0.15 ? '#ff0000' : '#fff'}
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
                        title === 'MOST USED APPS'
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
          Based on {title.toLowerCase()} tracking data for today.
        </div>
      )}
    </div>
  );
};

// Productivity Card Component
const ProductivityCard: React.FC<{
  productivityData: TeamStats['ProductivityLevel'];
  onClick: () => void;
  isSelected: boolean;
}> = ({ productivityData, onClick, isSelected }) => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day');

  const chartData = useMemo(
    () => [
      {
        name: period.charAt(0).toUpperCase() + period.slice(1),
        Productive: productivityData[period].productive,
        Unproductive: productivityData[period].unproductive,
        Undefined: productivityData[period].undefined,
        Offline: productivityData[period].offline,
      },
    ],
    [period, productivityData],
  );

  return (
    <div
      className="bg-white p-8 rounded-sm shadow-lg flex flex-col cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
      onClick={onClick}
      data-tooltip-id="productivity-level-tooltip"
      data-tooltip-content="Team productivity across different time periods"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-700">PRODUCTIVITY</h3>
        <FaChartLine className="text-primary h-8 w-8" />
      </div>
      <div className="flex gap-2 mb-4">
              {(['day', 'week', 'month', 'year'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded font-medium text-sm transition-colors duration-200
                    ${period === p
                      ? 'bg-primary text-white '
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}
                      focus:outline-none
                  `}
                  aria-pressed={period === p}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
      </div>
      <div role="img" aria-label="Bar chart showing team productivity">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis unit="%" domain={[0, 100]} />
            <RechartsTooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="Productive" stackId="a" fill="#EC4899" />
            <Bar dataKey="Unproductive" stackId="a" fill="#3B82F6" />
            <Bar dataKey="Undefined" stackId="a" fill="#10B981" />
            <Bar dataKey="Offline" stackId="a" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Legend for productivity levels */}
      <div className="flex flex-wrap gap-2 mt-4 text-xs items-center justify-center w-full"> 
        <div className="flex items-center space-x-1">
          <span className="inline-block w-2 h-2 rounded-full bg-pink-400"></span>
          <span>Productive</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
          <span>Unproductive</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
          <span>Undefined</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="inline-block w-2 h-2 rounded-full bg-red-400"></span>
          <span>Offline</span>
        </div>
      </div>
      {isSelected && (
        <div className="mt-4 text-sm text-gray-600 transition-opacity duration-200">
          Productivity based on work sessions, app usage, and activity tracking for the selected period.
        </div>
      )}
    </div>
  );
};

// Main TeamOverview Component
const TeamOverview: React.FC = () => {
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);

  // Fetch data with retry mechanism
  const fetchStats = async (retries = 2) => {
    try {
      const token = localStorage.getItem('token');
      const periods = ['day', 'week', 'month', 'year'] as const;
      const productivityResults: Record<'day' | 'week' | 'month' | 'year', ProductivityData> = {
        day: { productive: 0, unproductive: 0, undefined: 0, offline: 0 },
        week: { productive: 0, unproductive: 0, undefined: 0, offline: 0 },
        month: { productive: 0, unproductive: 0, undefined: 0, offline: 0 },
        year: { productive: 0, unproductive: 0, undefined: 0, offline: 0 },
      };
      let mainData: any = {};
      for (const period of periods) {
        const response = await fetch(`http://localhost:3000/api/user/stats?period=${period}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        productivityResults[period] = {
          productive: data.productivity?.productive ?? 0,
          unproductive: data.productivity?.unproductive ?? 0,
          undefined: data.productivity?.undefined ?? 0,
          offline: 0 // or calculate if you have this info
        };
        // Save the first (day) data for other stats
        if (period === 'day') {
          mainData = data;
        }
      }
      setStats({
        ProductivityLevel: productivityResults,
        topUsers: mainData.topUsers || [],
        WebsitesUsed: mainData.topWebsites || [],
        appUsage: mainData.topApps || [],
        BlacklistedWebsites: mainData.blacklistedWebsites || [],
        BlacklistedVisits: mainData.blacklistedVisits || [],
      });
      setLoading(false);
    } catch (err) {
      if (retries > 0) {
        setTimeout(() => fetchStats(retries - 1), 1000);
      } else {
        setError(
          typeof err === 'object' && err !== null && 'message' in err
            ? String((err as { message?: unknown }).message)
            : 'Failed to load team stats'
        );
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatClick = (stat: string) => {
    setSelectedStat(selectedStat === stat ? null : stat);
  };

  if (loading) {
    return <div className="p-6 pt-20 text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-gray-600">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 transition-opacity duration-300 ease-in-out">
        Team Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Productivity Card */}
        <ProductivityCard
          productivityData={stats!.ProductivityLevel}
          onClick={() => handleStatClick('ProductivityLevel')}
          isSelected={selectedStat === 'ProductivityLevel'}
        />
        <ReactTooltip id="productivity-level-tooltip" className="z-50" />

        {/* Top Users and Groups Card */}
        <div
          className="bg-white p-8 rounded-sm shadow-lg flex flex-col cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
          onClick={() => handleStatClick('topUsers')}
          data-tooltip-id="top-users-tooltip"
          data-tooltip-content="Top users and groups based on activity"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-700">TOP USERS & GROUPS</h3>
            <FaUsers className="text-primary h-8 w-8" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Top users based on productive time</span>
            <span className="text-sm text-gray-600">Hours & Minutes</span>
          </div>
          <div className="space-y-4 flex-1">
            {stats?.topUsers.length === 0 ? (
              <div className="text-center text-gray-500">No users available</div>
            ) : (
              stats?.topUsers.map((user) => (
                <React.Fragment key={user.name}>
                  <div className="grid grid-cols-[70px_1fr_70px] items-center mb-1 gap-x-2">
                    <span className="font-medium text-gray-700 truncate">{user.name.split(' ')[0]}</span>
                    <div className="flex h-3 w-full rounded-sm overflow-hidden">
                      <div
                        className="bg-pink-400"
                        style={{ width: `${user.productive}%` }}
                        title="Productive"
                      />
                      <div
                        className="bg-blue-400"
                        style={{ width: `${user.unproductive}%` }}
                        title="Unproductive"
                      />
                      <div
                        className="bg-green-400"
                        style={{ width: `${user.undefined}%` }}
                        title="Undefined"
                      />
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{user.hours}h {user.minutes}m</span>
                  </div>
                </React.Fragment>
              ))
            
              )}
          </div>
          <div className="flex flex-wrap gap-2 mt-4 text-xs items-center justify-center w-full">
            <div className="flex items-center space-x-1">
              <span className="inline-block w-2 h-2 rounded-full bg-pink-400"></span>
              <span>Productive</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
              <span>Unproductive</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
              <span>Undefined</span>
            </div>
          </div>
          {selectedStat === 'topUsers' && (
            <div className="mt-4 text-sm text-gray-600 transition-opacity duration-200">
              Based on user activity tracking for today.
            </div>
          )}
        </div>
        <ReactTooltip id="top-users-tooltip" className="z-50" />

        {/* Most Used Websites Card */}
        <div className="bg-white p-8 rounded-sm shadow-lg flex flex-col cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105">
        <PieChartCard
          title="MOST USED WEBSITES"
          data={stats!.WebsitesUsed}
          icon={<FaGlobe className="text-primary h-8 w-8" />}
          tooltipId="websites-used-tooltip"
          tooltipContent="Most used websites by the team"
          onClick={() => handleStatClick('WebsitesUsed')}
          isSelected={selectedStat === 'WebsitesUsed'}
        />
        </div>
        <ReactTooltip id="websites-used-tooltip" className="z-50" />

        {/* Most Used Apps Card */}
        <div className="bg-white p-8 rounded-sm shadow-lg flex flex-col cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105">
        <PieChartCard
          title="MOST USED APPS"
          data={stats!.appUsage}
          icon={<FaThLarge className="text-primary h-8 w-8" />}
          tooltipId="app-usage-tooltip"
          tooltipContent="Top applications used by the team"
          onClick={() => handleStatClick('appUsage')}
          isSelected={selectedStat === 'appUsage'}
        />
        </div>
        <ReactTooltip id="app-usage-tooltip" className="z-50" />

        {/*Users who visited blacked listed websites Card and the blacked listed websites next to their names */}
        {/* Blacklisted Websites Card */}
        <div
          className="bg-white p-8 rounded-sm shadow-lg flex flex-col cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
          onClick={() => handleStatClick('BlacklistedWebsites')}
          data-tooltip-id="blacklisted-websites-tooltip"
          data-tooltip-content="List of users who accessed blacklisted websites"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-700">BLACKLISTED WEBSITES</h3>
            <FaBan className="text-primary h-8 w-8" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Users who accessed restricted websites today</span>
            <span className="text-sm text-gray-600">Hours Spent</span>
          </div>
          <div className="space-y-4 flex-1">
            {stats?.BlacklistedVisits && stats.BlacklistedVisits.length > 0 ? (
              (() => {
                const maxHours = Math.max(...stats.BlacklistedVisits.map(v => v.hours));
                return stats.BlacklistedVisits.map((visit, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[40px_1fr_90px_60px] items-center mb-1 gap-x-2"
                  >
                    {/* Avatar */}
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-xs">
                      {visit.user
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </span>
                    {/* User Name */}
                    <span className="font-medium text-gray-700 truncate">{visit.user}</span>
                    {/* Website Badge */}
                    <span className="inline-block bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold text-center">
                      {visit.website}
                    </span>
                    {/* Hours Progress Bar */}
                    <div className="flex items-center gap-1">
                      <div className="relative w-14 h-2 bg-gray-200 rounded">
                        <div
                          className="absolute left-0 top-0 h-2 rounded bg-red-400"
                          style={{
                            width: `${Math.max(8, (visit.hours / maxHours) * 100)}%`,
                            minWidth: '8%',
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 ml-2">{visit.hours.toFixed(1)}h</span>
                    </div>
                  </div>
                ));
              })()
            ) : (
              <div className="text-center text-gray-500 py-4">No blacklisted visits recorded</div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-4 text-xs items-center justify-center w-full">
            <div className="flex items-center space-x-1">
              <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
              <span>User</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="inline-block w-2 h-2 rounded-full bg-red-400"></span>
              <span>Blacklisted Website</span>
            </div>
          </div>
          {selectedStat === 'BlacklistedWebsites' && (
            <div className="mt-4 text-sm text-gray-600 transition-opacity duration-200">
              Based on website activity logs for the past 24 hours.
            </div>
          )}
        </div>
        <ReactTooltip id="blacklisted-websites-tooltip" className="z-50" />

      </div>
    </div>
  );
};

export default TeamOverview;