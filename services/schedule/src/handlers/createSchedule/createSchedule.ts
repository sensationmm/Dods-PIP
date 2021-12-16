import { AsyncLambdaHandler } from '@dodsgroup/dods-lambda';
import { createScheduleParameters } from '../../domain';
import { ScheduleRepository } from '../../repositories/ScheduleRpository';

export const createSchedule: AsyncLambdaHandler<createScheduleParameters> = async (data) => {
    console.log(data)
    return await ScheduleRepository.defaultInstance.createSchedule(data)
};