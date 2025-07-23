import React, { useEffect, useState } from 'react';
import ActivityMonitor from '../components/ActivityMonitor';
import { fetchActivityData } from '../utils/activityUtils';

const App: React.FC = () => {
    const [activityData, setActivityData] = useState(null);

    useEffect(() => {
        const getActivityData = async () => {
            const data = await fetchActivityData();
            setActivityData(data);
        };

        getActivityData();
    }, []);

    return (
        <div>
            <h1>Worker Activity Monitor</h1>
            {activityData ? (
                <ActivityMonitor data={activityData} />
            ) : (
                <p>Loading activity data...</p>
            )}
        </div>
    );
};

export default App;