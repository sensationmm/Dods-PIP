import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { createAlertScheduleParameters } from '../../domain';
import { ScheduleRepository } from '../../repositories/ScheduleRepository';

export const createAlertSchedule: AsyncLambdaHandler<createAlertScheduleParameters> = async (data) => {
    await ScheduleRepository.defaultInstance.createAlertSchedule(data);

    return new HttpResponse(HttpStatusCode.OK, {
        "success": true,
        "message": "Alert schedule created with ID " + data.scheduleId
    });
};