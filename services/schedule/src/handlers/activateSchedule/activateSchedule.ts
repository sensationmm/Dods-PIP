import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { activateScheduleParameters } from '../../domain';
import { ScheduleRepository } from '../../repositories/ScheduleRepository';

export const activateSchedule: AsyncLambdaHandler<activateScheduleParameters> = async (data) => {
    await ScheduleRepository.defaultInstance.activateSchedule(data);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: "schedule with ID " + data.scheduleId + " activated"
    });
};