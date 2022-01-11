import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertsRepository, CreateAlertParameters } from '@dodsgroup/dods-repositories';

export const createAlert: AsyncLambdaHandler<CreateAlertParameters> = async (params) => {
    const { alertQueries } = params;

    const createResponse = await CollectionAlertsRepository.defaultInstance.createAlert(params);


    alertQueries?.forEach(async (alertQuery) => {

        const createAlertQueryParameters = {
            alertId: createResponse.id,
            query: alertQuery.query,
            informationTypes: alertQuery.informationTypes,
            contentSources: alertQuery.contentSources,
            createdBy: createResponse.createdBy
        }

        await CollectionAlertsRepository.defaultInstance.createQuery(createAlertQueryParameters);
    })

    const alertReponse: any = CollectionAlertsRepository.defaultInstance.mapAlert(createResponse);

    delete alertReponse?.id;

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Alert created successfully in step 1',
        alert: alertReponse

    });
};
