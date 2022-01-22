import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertsRepository, CreateAlertQueryParameters } from '@dodsgroup/dods-repositories';

export const createAlertQuery: AsyncLambdaHandler<CreateAlertQueryParameters> = async (params) => {


    const response = await CollectionAlertsRepository.defaultInstance.createQuery(params);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Alert query created successfully',
        query: response
    });
};
