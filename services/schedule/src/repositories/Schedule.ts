import {createScheduleParameters, deleteScheduleParameters} from "../domain";


export interface Schedule {
    createSchedule(data: createScheduleParameters): Promise<any>;
    deleteSchedule(data: deleteScheduleParameters): Promise<any>;
}