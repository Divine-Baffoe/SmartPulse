export interface ActivityData {
    productiveHours: number;
    nonProductiveHours: number;
    idleTime: number;
}

export function calculateIdleTime(lastActiveTime: Date, currentTime: Date): number {
    return Math.max(0, (currentTime.getTime() - lastActiveTime.getTime()) / 1000); // returns idle time in seconds
}

export function categorizeActivity(hours: number): string {
    if (hours < 4) {
        return 'Non-Productive';
    } else if (hours >= 4 && hours < 8) {
        return 'Productive';
    } else {
        return 'Highly Productive';
    }
}

export function trackActivity(activityData: ActivityData): string {
    const { productiveHours, nonProductiveHours, idleTime } = activityData;
    return `Productive Hours: ${productiveHours}, Non-Productive Hours: ${nonProductiveHours}, Idle Time: ${idleTime} seconds`;
}