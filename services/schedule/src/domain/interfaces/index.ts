export type Type = "publishing" | "altering";

export interface createScheduleParameters {
    id: string;
    scheduleType: Type;
    cron: string;
}

export interface getScheduleParameters {
    scheduleId: string;
}
