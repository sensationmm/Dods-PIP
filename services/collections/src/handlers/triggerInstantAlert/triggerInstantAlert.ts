import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { ProcessImmediateAlertParameters } from '../../domain';

export const triggerInstantAlert: AsyncLambdaHandler<ProcessImmediateAlertParameters> = async (
    parameters
) => {
    const { alertId, documentId } = parameters;

    console.log(`parameters: ${alertId}, ${documentId}`);
    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Alert successfully triggered'
    });

}

