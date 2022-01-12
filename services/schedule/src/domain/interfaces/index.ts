export type Type = "publishing" | "altering";


export interface deleteScheduleParameters {
    id: string;
}

export interface createScheduleParameters extends deleteScheduleParameters {
    scheduleType: Type;
    cron: string;
}

export interface getScheduleParameters {
    scheduleId: string;
}

export interface updateScheduleParameters extends deleteScheduleParameters {
    scheduleType?: String;
    cron: string;
}