import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertsRepository, CreateAlertParameters } from '@dodsgroup/dods-repositories';

export const createAlert: AsyncLambdaHandler<CreateAlertParameters> = async (params) => {

    const createResponse = await CollectionAlertsRepository.defaultInstance.createAlert(params);

    const { id, updatedBy, ...alert } = createResponse;

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Alert created successfully in step 1',
        alert: alert
    });
};
