import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { createScheduleParameters } from '../../domain';
import { ScheduleRepository } from '../../repositories/ScheduleRepository';

export const createSchedule: AsyncLambdaHandler<createScheduleParameters> = async (data) => {
    await ScheduleRepository.defaultInstance.createSchedule(data);

    return new HttpResponse(HttpStatusCode.OK, {
        "success": true,
        "message": "schedule created with ID " + data.scheduleId
    });
};