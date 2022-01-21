import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { deactivateScheduleParameters } from '../../domain';
import { ScheduleRepository } from '../../repositories/ScheduleRepository';

export const deactivateSchedule: AsyncLambdaHandler<deactivateScheduleParameters> = async (data) => {
    await ScheduleRepository.defaultInstance.deactivateSchedule(data);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: "schedule with ID " + data.scheduleId + " deactivated"
    });
};