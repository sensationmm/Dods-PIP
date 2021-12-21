import {createScheduleParameters} from "../domain";


export interface Schedule {
    createSchedule(data: createScheduleParameters): Promise<any>;
}