import {
    createScheduleParameters, 
    deleteScheduleParameters,
    updateScheduleParameters
} from "../domain";


export interface Schedule {
    createSchedule(data: createScheduleParameters): Promise<any>;
    deleteSchedule(data: deleteScheduleParameters): Promise<void>;
    updateSchedule(data: updateScheduleParameters): Promise<void>;
}