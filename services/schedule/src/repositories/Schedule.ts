import {createScheduleParameters, getScheduleParameters} from "../domain";


export interface Schedule {
    createSchedule(data: createScheduleParameters): Promise<any>;
    getSchedule(data: getScheduleParameters): Promise<any>;
}