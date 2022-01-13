import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { getScheduleParameters } from '../../domain';
import {ScheduleRepository} from "../../repositories/ScheduleRepository";

export const getSchedule: AsyncLambdaHandler<getScheduleParameters> = async (data) => {
    const scheduledData = await ScheduleRepository.defaultInstance.getSchedule(data);

    return new HttpResponse(HttpStatusCode.OK, {
        "success": true,
        "message": scheduledData
    });
};