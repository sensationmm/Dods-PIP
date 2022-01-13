import {
    createScheduleParameters,
    deleteScheduleParameters,
    updateScheduleParameters,
    getScheduleParameters
} from "../domain";


export interface Schedule {
    createSchedule(data: createScheduleParameters): Promise<any>;
    getSchedule(data: getScheduleParameters): Promise<any>;
    deleteSchedule(data: deleteScheduleParameters): Promise<void>;
    updateSchedule(data: updateScheduleParameters): Promise<void>;
}