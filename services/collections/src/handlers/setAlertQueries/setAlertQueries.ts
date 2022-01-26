import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertsRepository, SetAlertQueriesParameters } from '@dodsgroup/dods-repositories';

export const setAlertQueries: AsyncLambdaHandler<SetAlertQueriesParameters> = async (params) => {

    const createResponse: any = await CollectionAlertsRepository.defaultInstance.setAlertQueries(params);

    let { id, ...alert } = createResponse.alert;

    createResponse.queries.forEach(function (query: any) { delete query.alert });

    alert = { ...alert, queries: createResponse.queries }

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Alert updated successfully in step 1',
        alert: alert
    });
};
