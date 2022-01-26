import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertsRepository, UpdateAlertParameters } from '@dodsgroup/dods-repositories';

export const updateAlert: AsyncLambdaHandler<UpdateAlertParameters> = async (params) => {

    const alert = await CollectionAlertsRepository.defaultInstance.updateAlert(params);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Alert renamed successfully',
        alert
    });
};
