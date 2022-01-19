import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertsRepository, CopyQueryParameters } from '@dodsgroup/dods-repositories';

export const copyAlertQuery: AsyncLambdaHandler<CopyQueryParameters> = async (params) => {
    const newQuery = await CollectionAlertsRepository.defaultInstance.copyQuery(params);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Alert Query copied successfully',
        query: newQuery,
    });
};
