import React from 'react';
import { ActivityData } from '../utils/activityUtils';

interface ActivityMonitorProps {
  data: ActivityData;
}

const ActivityMonitor: React.FC<ActivityMonitorProps> = ({ data }) => {
  return (
    <div>
      <h1>Activity Monitor</h1>
      <div>
        <h2>Productive Hours: {data.productiveHours}</h2>
        <h2>Non-Productive Hours: {data.nonProductiveHours}</h2>
        <h2>Idle Time: {data.idleTime}</h2>
      </div>
    </div>
  );
};

export default ActivityMonitor;