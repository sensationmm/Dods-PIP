import {
    createScheduleParameters,
    deleteScheduleParameters,
    updateScheduleParameters,
    activateScheduleParameters,
    deactivateScheduleParameters,
    getScheduleParameters, createAlertScheduleParameters,
} from "../domain";


export interface Schedule {
    createSchedule(data: createScheduleParameters): Promise<any>;
    createAlertSchedule(data: createAlertScheduleParameters): Promise<any>;
    getSchedule(data: getScheduleParameters): Promise<any>;
    deleteSchedule(data: deleteScheduleParameters): Promise<void>;
    updateSchedule(data: updateScheduleParameters): Promise<void>;
    activateSchedule(data: activateScheduleParameters): Promise<void>;
    deactivateSchedule(data: deactivateScheduleParameters): Promise<void>;
}