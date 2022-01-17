import {
    createScheduleParameters,
    deleteScheduleParameters,
    updateScheduleParameters,
    activateScheduleParameters,
    deactivateScheduleParameters,
    getScheduleParameters, createPercolatorParameters,
} from "../domain";


export interface Schedule {
    createSchedule(data: createScheduleParameters): Promise<any>;
    getSchedule(data: getScheduleParameters): Promise<any>;
    deleteSchedule(data: deleteScheduleParameters): Promise<void>;
    updateSchedule(data: updateScheduleParameters): Promise<void>;
    activateSchedule(data: activateScheduleParameters): Promise<void>;
    deactivateSchedule(data: deactivateScheduleParameters): Promise<void>;
    createPercolator(data: createPercolatorParameters): Promise<any>;
}