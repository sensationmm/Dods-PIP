export type Type = "publish" | "altering";


export interface deleteScheduleParameters {
    scheduleId: string;
}

export interface createScheduleParameters extends deleteScheduleParameters {
    scheduleType: Type;
    cron: string;
    baseURL?: string;
}

export interface getScheduleParameters {
    scheduleId: string;
}

export interface updateScheduleParameters extends deleteScheduleParameters {
    scheduleType?: String;
    cron: string;
    baseURL?: string;
}

export interface activateScheduleParameters extends deleteScheduleParameters { }

export interface deactivateScheduleParameters extends deleteScheduleParameters { }
