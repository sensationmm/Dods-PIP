import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { updateScheduleParameters } from '../../domain';
import { ScheduleRepository } from '../../repositories/ScheduleRpository';

export const updateSchedule: AsyncLambdaHandler<updateScheduleParameters> = async (data) => {
    await ScheduleRepository.defaultInstance.updateSchedule(data);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: "schedule with ID " + data.id + " updated"
    });
};