import React from 'react';

const ActivityMonitor: React.FC<{ productiveHours: number; nonProductiveHours: number; idleTime: number }> = ({ productiveHours, nonProductiveHours, idleTime }) => {
    return (
        <div>
            <h1>Activity Monitor</h1>
            <div>
                <h2>Productive Hours: {productiveHours}</h2>
                <h2>Non-Productive Hours: {nonProductiveHours}</h2>
                <h2>Idle Time: {idleTime}</h2>
            </div>
        </div>
    );
};

export default ActivityMonitor;