import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import {
    CollectionAlertsRepository,
    DeleteAlertQueryParameters,
} from '@dodsgroup/dods-repositories';

export const deleteAlertQuery: AsyncLambdaHandler<DeleteAlertQueryParameters> = async (params) => {
    await CollectionAlertsRepository.defaultInstance.deleteAlertQuery(params);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Query was deleted successfully',
    });
};
