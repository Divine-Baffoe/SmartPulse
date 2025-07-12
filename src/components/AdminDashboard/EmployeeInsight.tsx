// src/components/dashboard/EmployeeInsight.tsx
import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';

// Define TypeScript interface for employee data
interface EmployeeInsight {
  id: number;
  name: string;
  avatarUrl?: string; // Google account image URL
  timeWorked: { hours: number; minutes: number };
  activity: { productive: number; unproductive: number; undefined: number }; // % for each
  productiveTime: number; // % productive
  idleTime: { hours: number; minutes: number };
}

// Mock data (replace with API call)
{/*const fetchMockEmployeeInsights = (): Promise<EmployeeInsight[]> =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          {
            id: 1,
            name: 'Maureen Semenhyia',
            timeWorked: { hours: 2, minutes: 45 },
            activity: { productive: 70, unproductive: 20, undefined: 10 },
            productiveTime: 70,
            idleTime: { hours: 0, minutes: 30 },
          },
          {
            id: 2,
            name: 'Phoebe McBrown',
            timeWorked: { hours: 1, minutes: 30 },
            activity: { productive: 60, unproductive: 30, undefined: 10 },
            productiveTime: 60,
            idleTime: { hours: 0, minutes: 15 },
          },
          {
            id: 3,
            name: 'James Boateng',
            timeWorked: { hours: 2, minutes: 0 },
            activity: { productive: 90, unproductive: 5, undefined: 5 },
            productiveTime: 90,
            idleTime: { hours: 0, minutes: 10 },
          },
        ]),
      1000,
    ),
  );*/}

const EmployeeInsight: React.FC = () => {
  const [insights, setInsights] = useState<EmployeeInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  // Fetch data with retry mechanism
  const fetchInsights = async (retries = 3): Promise<void> => {
    try {
      const data = await fetch('http://localhost:3000/api/user/insights', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      const dataJson = await data.json();
      setInsights(dataJson);
      setLoading(false);
    } catch (err) {
      if (retries > 0) {
        setTimeout(() => fetchInsights(retries - 1), 1000);
      } else {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load employee insights');
        }
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleRowClick = (id: number) => {
    setSelectedRow(selectedRow === id ? null : id);
  };

  if (loading) {
    return <div className="p-6 pt-20 text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 pt-20 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 pt-2">
      <h2 className="text-2xl font-bold mb-6 text-black transition-opacity duration-300 ease-in-out">
        Employee Insights
      </h2>
      <div className="bg-white/30 backdrop-blur-md border border-white/20 rounded-lg shadow overflow-x-auto transition-opacity duration-300 ease-in-out">
        <table className="min-w-full bg-white/30 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden">

          <thead>
            <tr className="bg-[#f8f9fa]">
              <th className="p-3 text-left text-xl font-bold text-black bg-white/30 backdrop-blur-md border border-white/20">Employee</th>
              <th className="p-3 text-left text-xl font-bold text-black bg-white/30 backdrop-blur-md border border-white/20">Time Worked</th>
              <th className="p-3 text-left text-xl font-bold text-black bg-white/30 backdrop-blur-md border border-white/20">Average Activity</th>
              <th className="p-3 text-left text-xl font-bold text-black bg-white/30 backdrop-blur-md border border-white/20">Productive Time</th>
              <th className="p-3 text-left text-xl font-bold text-black bg-white/30 backdrop-blur-md border border-white/20">Idle Time</th>
            </tr>
          </thead>
          <tbody>
            {insights.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-3 text-center text-gray-500">
                  No employee data available
                </td>
              </tr>
            ) : (
              insights.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-t hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleRowClick(employee.id)}
                >
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      {employee.avatarUrl ? (
                        <img
                          src={employee.avatarUrl}
                          alt={`${employee.name}'s avatar`}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => (e.currentTarget.src = '/fallback-avatar.png')} // Fallback image
                        />
                      ) : (
                        <FaUserCircle className="w-8 h-8 text-gray-400" aria-label="Default avatar" />
                      )}
                      <span className="font-medium text-gray-700">{employee.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    {employee.timeWorked.hours}h {employee.timeWorked.minutes}m
                  </td>
                  <td className="p-3">
                    <div
                      className="flex h-3 w-full rounded-sm overflow-hidden"
                      data-tooltip-id={`activity-tooltip-${employee.id}`}
                      data-tooltip-content={`Productive: ${employee.activity.productive}%, Unproductive: ${employee.activity.unproductive}%, Undefined: ${employee.activity.undefined}%`}
                    >
                      <div
                        className="bg-pink-400"
                        style={{ width: `${employee.activity.productive}%` }}
                        title="Productive"
                      />
                      <div
                        className="bg-blue-400"
                        style={{ width: `${employee.activity.unproductive}%` }}
                        title="Unproductive"
                      />
                      <div
                        className="bg-green-400"
                        style={{ width: `${employee.activity.undefined}%` }}
                        title="Undefined"
                      />
                    </div>
                    <ReactTooltip id={`activity-tooltip-${employee.id}`} className="z-50" />
                  </td>
                  <td className="p-3">{employee.productiveTime}%</td>
                  <td className="p-3">
                    {employee.idleTime.hours}h {employee.idleTime.minutes}m
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {selectedRow && (
          <div className="p-4 bg-gray-50 rounded-b-lg transition-opacity duration-200">
            <p className="text-sm text-gray-600">
              Details for {insights.find((e) => e.id === selectedRow)?.name}: Placeholder for app/website usage or stress
              level data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeInsight;