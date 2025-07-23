export interface ActivityData {
    productiveHours: number;
    nonProductiveHours: number;
    idleTime: number;
}

export interface UserSession {
    userId: string;
    startTime: Date;
    endTime: Date;
    activityData: ActivityData;
}