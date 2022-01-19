import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertsRepository, SetAlertQueriesParameters } from '@dodsgroup/dods-repositories';

export const setAlertQueries: AsyncLambdaHandler<SetAlertQueriesParameters> = async (params) => {

    const createResponse = await CollectionAlertsRepository.defaultInstance.setAlertQueries(params);

    const { id, ...alert } = createResponse;

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Alert updated successfully in step 1',
        alert: alert
    });
};
