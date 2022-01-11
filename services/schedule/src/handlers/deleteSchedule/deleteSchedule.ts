import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { deleteScheduleParameters } from '../../domain';
import { ScheduleRepository } from '../../repositories/ScheduleRpository';

export const deleteSchedule: AsyncLambdaHandler<deleteScheduleParameters> = async (data) => {
    await ScheduleRepository.defaultInstance.deleteSchedule(data);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: "schedule with ID " + data.id + " deleted"
    });
};