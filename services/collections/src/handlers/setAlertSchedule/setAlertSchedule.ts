import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { CollectionRepository } from '../../repositories';
import { setAlertScheduleParameters } from '../../domain';

export const setAlertSchedule: AsyncLambdaHandler<setAlertScheduleParameters> = async (
    parameters
) => {

    const response = await CollectionRepository.defaultInstance.setAlertSchedule(parameters)


    const alertResponse = CollectionRepository.defaultInstance.mapAlert(response)


    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Collection alerts found',
        response: alertResponse
    });




};
